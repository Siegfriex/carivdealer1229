import { Request, Response } from 'express';
import { getSecret } from '../config/secrets';
import { GoogleGenAI, Type } from '@google/genai';
import Busboy from 'busboy';
import { Readable } from 'stream';
import type { FileInfo } from 'busboy';
import { getVehicleStatistics, extractVehicleInfoFromKOTSAResponse } from './getVehicleStatistics';

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

    // Gemini API 호출 - 차량번호만 추출
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
            text: "이 이미지는 한국 자동차등록증입니다. 차량번호(차량등록번호, 번호판 번호)만 추출하세요. 예: '12가 3456', '33바 1234' 형식입니다. 차량번호만 JSON으로 반환하세요." 
          }
        ]
      },
      config: {
        thinkingConfig: { thinkingBudget: 16000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            plateNumber: { type: Type.STRING, description: "차량번호 (예: 12가 3456)" },
          }
        }
      }
    });

    const extractedData = JSON.parse(response.text || '{}');
    const plateNumber = extractedData.plateNumber || '';

    if (!plateNumber || plateNumber.trim() === '') {
      res.status(400).json({ error: '차량번호를 추출할 수 없습니다. 이미지를 확인해주세요.' });
      return;
    }

    console.log('[OCR] Extracted plate number:', plateNumber);

    // 초기 결과 (차량번호만)
    const result: any = {
      plateNumber: plateNumber,
      vin: '',
      manufacturer: '',
      model: '',
      year: '',
      mileage: '',
      fuelType: '',
      registrationDate: '',
      color: '',
    };

    // 차량번호로 공공데이터 API 호출하여 차량 정보 가져오기
    try {
      console.log('[OCR] Fetching vehicle information from KOTSA API for plate number:', plateNumber);
      
      const vehicleInfoResult = await getVehicleStatistics(plateNumber);

      if (vehicleInfoResult.success && vehicleInfoResult.data) {
        // 공공데이터 API 응답에서 차량 정보 추출
        const vehicleInfo = extractVehicleInfoFromKOTSAResponse(vehicleInfoResult.data, plateNumber);
        
        // 추출된 정보로 결과 업데이트
        result.vin = vehicleInfo.vin || '';
        result.manufacturer = vehicleInfo.manufacturer || '';
        result.model = vehicleInfo.model || '';
        result.year = vehicleInfo.year || '';
        result.mileage = vehicleInfo.mileage || '';
        result.fuelType = vehicleInfo.fuelType || '';
        result.registrationDate = vehicleInfo.registrationDate || '';
        result.color = vehicleInfo.color || '';
        
        console.log('[OCR] Vehicle information retrieved successfully:', {
          vin: result.vin,
          manufacturer: result.manufacturer,
          model: result.model,
          year: result.year
        });
      } else {
        console.warn('[OCR] Failed to retrieve vehicle information:', vehicleInfoResult.error);
        // 공공데이터 실패 시 차량번호만 반환
      }
    } catch (error: any) {
      // 공공데이터 API 실패는 차량번호 추출에는 영향을 주지 않음
      console.error('[OCR] Error fetching vehicle information:', {
        message: error.message,
        plateNumber: plateNumber,
        details: error
      });
      // 에러 발생 시에도 차량번호는 반환
    }

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

