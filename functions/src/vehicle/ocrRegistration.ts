import { Request, Response } from 'express';
import { getSecret } from '../config/secrets';
import { GoogleGenAI, Type } from '@google/genai';
import * as busboy from 'busboy';

// Helper to convert buffer to base64
const bufferToBase64 = (buffer: Buffer): string => {
  return buffer.toString('base64');
};

// Helper to parse multipart/form-data
const parseMultipartForm = (req: Request): Promise<{ file: { buffer: Buffer; mimetype: string; size: number } | null }> => {
  return new Promise((resolve, reject) => {
    const bb = busboy({ headers: req.headers });
    let fileData: { buffer: Buffer; mimetype: string; size: number } | null = null;

    bb.on('file', (name, file, info) => {
      const { filename, encoding, mimeType } = info;
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

    bb.on('error', (err) => {
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
    const apiKey = await getSecret('gemini-api-key');
    if (!apiKey) {
      throw new Error('Gemini API key is not configured');
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
    console.error('OCR Registration Error:', error);
    
    // 에러 타입별 처리
    if (error.message?.includes('API key')) {
      res.status(500).json({ error: 'Gemini API key configuration error' });
    } else if (error.message?.includes('file') || error.message?.includes('required')) {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ 
        error: error.message || 'OCR processing failed. Please try again.' 
      });
    }
  }
};

