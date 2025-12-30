import { Request, Response } from 'express';
import * as admin from 'firebase-admin';
import Busboy from 'busboy';
import { Readable } from 'stream';
import type { FileInfo } from 'busboy';

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();
const storage = admin.storage();

interface InspectionResult {
  evaluator: {
    name: string;
    id: string;
    rating: number;
    phone: string;
  };
  summary: string;
  score: string;
  condition: {
    exterior: string;
    interior: string;
    mechanic: string;
    frame: string;
  };
  aiAnalysis: {
    pros: string[];
    cons: string[];
    marketVerdict: string;
  };
  media: Array<{
    category: string;
    count: number;
    items: Array<{
      type: 'image' | 'video';
      url: string;
      label: string;
    }>;
  }>;
}

// Helper to convert stream to buffer
async function streamToBuffer(stream: Readable): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Buffer[] = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
    stream.on('error', reject);
  });
}

// Helper to upload file to Firebase Storage
async function uploadToStorage(
  buffer: Buffer,
  fileName: string,
  contentType: string,
  inspectionId: string,
  category?: string // 카테고리: 'exterior', 'interior', 'mechanic', 'frame', 'video'
): Promise<string> {
  const bucket = storage.bucket();
  
  // 카테고리별 디렉토리 구조 적용
  let filePath: string;
  if (contentType.startsWith('video/')) {
    // 영상 파일은 videos/ 디렉토리에 저장
    filePath = `inspections/${inspectionId}/videos/${fileName}`;
  } else if (category) {
    // 카테고리가 지정된 경우 photos/{category}/ 디렉토리에 저장
    filePath = `inspections/${inspectionId}/photos/${category}/${fileName}`;
  } else {
    // 카테고리가 없는 경우 기본 photos/ 디렉토리에 저장 (하위 호환성)
    filePath = `inspections/${inspectionId}/photos/${fileName}`;
  }
  
  const file = bucket.file(filePath);

  await file.save(buffer, {
    metadata: {
      contentType,
    },
    public: true,
  });

  // Public URL 생성
  return `https://storage.googleapis.com/${bucket.name}/${filePath}`;
}

export const uploadResult = async (req: Request, res: Response) => {
  // CORS는 v2에서 자동 처리됨 (index.ts에서 cors: true 설정)

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const bb = Busboy({ headers: req.headers });
  let inspectionId: string | null = null;
  let inspectionResultJson: string | null = null;
  const uploadedFiles: Array<{ buffer: Buffer; filename: string; mimetype: string }> = [];

  bb.on('field', (name: string, value: string) => {
    if (name === 'inspection_id') {
      inspectionId = value;
    } else if (name === 'inspection_result') {
      inspectionResultJson = value;
    }
  });

  bb.on('file', (name: string, file: Readable, info: FileInfo) => {
    const { filename, mimeType } = info;
    if (name.startsWith('images')) {
      // images[0], images[1] 등의 필드 처리
      streamToBuffer(file).then(buffer => {
        uploadedFiles.push({
          buffer,
          filename: filename || `image-${uploadedFiles.length}`,
          mimetype: mimeType,
        });
      }).catch(error => {
        console.error('Error reading file stream:', error);
        file.resume(); // Consume the stream to prevent hanging
      });
    } else {
      file.resume(); // Ignore other fields
    }
  });

  bb.on('finish', async () => {
    try {
      // 필수 필드 검증
      if (!inspectionId || !inspectionResultJson) {
        res.status(400).json({ error: 'inspection_id and inspection_result are required' });
        return;
      }

      // JSON 파싱
      let result: InspectionResult;
      try {
        result = JSON.parse(inspectionResultJson);
      } catch (parseError) {
        res.status(400).json({ error: 'inspection_result must be valid JSON' });
        return;
      }

      // 검차 정보 조회
      const inspectionRef = db.collection('inspections').doc(inspectionId);
      const inspectionDoc = await inspectionRef.get();

      if (!inspectionDoc.exists) {
        res.status(404).json({ error: 'Inspection not found' });
        return;
      }

      const inspectionData = inspectionDoc.data()!;

      if (inspectionData.status === 'completed') {
        res.status(400).json({ error: 'Inspection is already completed' });
        return;
      }

      // 이미지 파일 업로드 및 URL 생성
      const mediaUrls: Array<{ type: 'image' | 'video'; url: string; label: string }> = [];
      for (let i = 0; i < uploadedFiles.length; i++) {
        const file = uploadedFiles[i];
        try {
          const url = await uploadToStorage(
            file.buffer,
            file.filename,
            file.mimetype,
            inspectionId
          );
          mediaUrls.push({
            type: file.mimetype.startsWith('image/') ? 'image' : 'video',
            url,
            label: `Image ${i + 1}`,
          });
        } catch (uploadError) {
          console.error(`Failed to upload file ${file.filename}:`, uploadError);
          // 개별 파일 업로드 실패는 로그만 남기고 계속 진행
        }
      }

      // 검차 결과에 media URL 추가
      if (mediaUrls.length > 0) {
        result.media = result.media || [];
        result.media.push({
          category: 'uploaded',
          count: mediaUrls.length,
          items: mediaUrls,
        });
      }

      // 미디어 메타데이터 계산
      const totalFiles = mediaUrls.length;
      const totalSize = uploadedFiles.reduce((sum, file) => sum + file.buffer.length, 0);
      
      // 검차 결과 저장 (메타데이터 포함)
      await inspectionRef.update({
        result,
        status: 'completed',
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        completedAt: admin.firestore.FieldValue.serverTimestamp(),
        mediaMetadata: {
          totalFiles,
          totalSize,
          lastUploadedAt: admin.firestore.FieldValue.serverTimestamp(),
        },
      });

      // 차량 상태를 active_sale로 변경
      const vehicleRef = db.collection('vehicles').doc(inspectionData.vehicleId);
      await vehicleRef.update({
        status: 'active_sale',
        inspectionId,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      res.status(200).json({
        success: true,
        message: '검차 결과가 성공적으로 업로드되었습니다.',
      });
    } catch (error: any) {
      console.error('Upload Result Error:', error);
      res.status(500).json({ error: error.message || 'Internal server error' });
    }
  });

  bb.on('error', (error: Error) => {
    console.error('Busboy error:', error);
    res.status(400).json({ error: 'Failed to parse multipart form data' });
  });

  // Firebase Functions v2에서는 rawBody를 사용
  if ((req as any).rawBody) {
    bb.end((req as any).rawBody);
  } else {
    req.pipe(bb);
  }
};
