import { Request, Response } from 'express';
import { getSecret } from '../config/secrets';
import { GoogleGenAI, Type } from '@google/genai';
import Busboy from 'busboy';
import { Readable } from 'stream';
import type { FileInfo } from 'busboy';

// Helper to convert buffer to base64
const bufferToBase64 = (buffer: Buffer): string => {
  return buffer.toString('base64');
};

// Helper to parse multipart/form-data
const parseMultipartForm = (req: Request): Promise<{ file: { buffer: Buffer; mimetype: string; size: number } | null }> => {
  return new Promise((resolve, reject) => {
    const bb = Busboy({ headers: req.headers });
    let fileData: { buffer: Buffer; mimetype: string; size: number } | null = null;

    bb.on('file', (name: string, file: Readable, info: FileInfo) => {
      const { mimeType } = info;
      if (name === 'registration_image') {
        const chunks: Buffer[] = [];
        
        file.on('data', (data: Buffer) => {
          chunks.push(data);
        });

        file.on('end', () => {
          const buffer = Buffer.concat(chunks);
          fileData = {
            buffer,
            mimetype: mimeType,
            size: buffer.length,
          };
        });
      } else {
        file.resume(); // Ignore other fields
      }
    });

    bb.on('finish', () => {
      resolve({ file: fileData });
    });

    bb.on('error', (err: Error) => {
      reject(err);
    });

    // Firebase Functions v2에서는 rawBody를 사용
    if ((req as any).rawBody) {
      bb.end((req as any).rawBody);
    } else {
      req.pipe(bb);
    }
  });
};

export const ocrRegistration = async (req: Request, res: Response) => {
  // CORS는 v2에서 자동 처리됨 (index.ts에서 cors: true 설정)

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // multipart/form-data 파싱
    const { file } = await parseMultipartForm(req);
    
    if (!file) {
      res.status(400).json({ error: 'registration_image file is required' });
      return;
    }

    // 파일 형식 검증
    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'application/pdf'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      res.status(400).json({ 
        error: `Invalid file type. Allowed types: ${allowedMimeTypes.join(', ')}` 
      });
      return;
    }

    // 파일 크기 제한 (10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      res.status(400).json({ error: 'File size exceeds 10MB limit' });
      return;
    }

    // Secret Manager에서 Gemini API 키 로드
    let apiKey: string;
    try {
      apiKey = await getSecret('gemini-api-key');
      if (!apiKey || apiKey.trim() === '') {
        throw new Error('Gemini API key is empty or not configured');
      }
      console.log('[OCR] Gemini API key retrieved successfully');
    } catch (error: any) {
      console.error('[OCR] Failed to get Gemini API key:', {
        message: error.message,
        code: error.code,
        details: error
      });
      throw new Error(`Gemini API key configuration error: ${error.message}`);
    }

    const ai = new GoogleGenAI({ apiKey });

    // 파일을 base64로 변환
    const base64Data = bufferToBase64(file.buffer);

    // Gemini API 호출 - 등록원부 OCR
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { 
            inlineData: { 
              mimeType: file.mimetype, 
              data: base64Data 
            } 
          },
          { 
            text: "Extract Korean Vehicle Registration details from this document as JSON. Include all fields: vin, manufacturer, model, year, mileage, fuelType, registrationDate, color, plateNumber." 
          }
        ]
      },
      config: {
        thinkingConfig: { thinkingBudget: 16000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vin: { type: Type.STRING, description: "차대번호(VIN)" },
            manufacturer: { type: Type.STRING, description: "제조사" },
            model: { type: Type.STRING, description: "모델명" },
            year: { type: Type.STRING, description: "연식" },
            mileage: { type: Type.STRING, description: "주행거리" },
            fuelType: { type: Type.STRING, description: "연료 종류" },
            registrationDate: { type: Type.STRING, description: "등록일자" },
            color: { type: Type.STRING, description: "색상" },
            plateNumber: { type: Type.STRING, description: "차량번호" },
          }
        }
      }
    });

    const extractedData = JSON.parse(response.text || '{}');

    // 응답 데이터 검증 및 정리
    const result = {
      vin: extractedData.vin || '',
      manufacturer: extractedData.manufacturer || '',
      model: extractedData.model || '',
      year: extractedData.year || '',
      mileage: extractedData.mileage || '',
      fuelType: extractedData.fuelType || '',
      registrationDate: extractedData.registrationDate || '',
      color: extractedData.color || '',
      plateNumber: extractedData.plateNumber || '',
    };

    res.status(200).json(result);
  } catch (error: any) {
    // 상세한 에러 로깅
    const errorDetails = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      code: error.code,
      details: error.details || error.response || error
    };
    
    console.error('[ERROR] OCR Registration Error:', errorDetails);
    
    // 에러 메시지 파싱 (JSON 형식인 경우)
    let errorMessage = error.message || '';
    let errorCode = error.code;
    
    try {
      // JSON 형식의 에러 메시지 파싱 시도
      if (errorMessage.includes('{')) {
        const jsonMatch = errorMessage.match(/\{.*\}/);
        if (jsonMatch) {
          const parsedError = JSON.parse(jsonMatch[0]);
          if (parsedError.error) {
            errorCode = parsedError.error.code || errorCode;
            errorMessage = parsedError.error.message || errorMessage;
          }
        }
      }
    } catch (parseError) {
      // 파싱 실패 시 원본 메시지 사용
    }
    
    // 에러 타입별 처리
    if (errorMessage?.includes('API key') || errorMessage?.includes('Secret') || errorMessage?.includes('configuration')) {
      res.status(500).json({ 
        error: 'Gemini API key configuration error',
        details: 'Secret Manager 설정을 확인해주세요. Functions 로그를 확인하세요.',
        message: errorMessage
      });
    } else if (errorCode === 403 && (errorMessage?.includes('leaked') || errorMessage?.includes('reported'))) {
      // API 키 유출로 인한 차단
      res.status(403).json({ 
        error: 'API key has been revoked',
        details: 'API 키가 유출로 보고되어 차단되었습니다. 새로운 API 키를 생성하고 Secret Manager에 업데이트해주세요.',
        message: errorMessage,
        action: 'REGENERATE_API_KEY'
      });
    } else if (errorCode === 403 || errorCode === 'PERMISSION_DENIED') {
      res.status(403).json({ 
        error: 'API access denied',
        details: 'Gemini API 접근이 거부되었습니다. API 키 권한을 확인해주세요.',
        message: errorMessage
      });
    } else if (errorMessage?.includes('file') || errorMessage?.includes('required')) {
      res.status(400).json({ error: errorMessage });
    } else if (errorMessage?.includes('timeout') || errorMessage?.includes('TIMEOUT')) {
      res.status(504).json({ 
        error: 'OCR processing timeout',
        details: '이미지 처리가 시간 초과되었습니다. 더 작은 이미지로 시도해주세요.'
      });
    } else if (errorMessage?.includes('quota') || errorMessage?.includes('QUOTA')) {
      res.status(429).json({ 
        error: 'API quota exceeded',
        details: 'Gemini API 할당량을 초과했습니다. 잠시 후 다시 시도해주세요.'
      });
    } else {
      res.status(500).json({ 
        error: errorMessage || 'OCR processing failed. Please try again.',
        details: '서버 오류가 발생했습니다. Functions 로그를 확인하세요.'
      });
    }
  }
};

