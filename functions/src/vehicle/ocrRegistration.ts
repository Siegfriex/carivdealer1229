import { Request, Response } from 'express';
// import { getSecret } from '../config/secrets';

export const ocrRegistration = async (req: Request, res: Response) => {
  // CORS는 v2에서 자동 처리됨 (index.ts에서 cors: true 설정)

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { car_no } = req.body;

    if (!car_no) {
      res.status(400).json({ error: 'car_no is required' });
      return;
    }

    // Secret Manager에서 Gemini API 키 로드 (향후 OCR 처리 시 사용)
    // const apiKey = await getSecret('gemini-api-key');
    // const ai = new GoogleGenAI({ apiKey });

    // TODO: 실제 등록원부 OCR 처리
    // 현재는 Mock 응답 반환
    // 실제 구현 시 차량번호로 등록원부 조회 후 OCR 처리

    const mockResponse = {
      vin: 'KMHXX00XXXX000000',
      manufacturer: 'Hyundai',
      model: 'Porter II',
      year: '2018',
      mileage: '136000',
    };

    res.status(200).json(mockResponse);
  } catch (error: any) {
    console.error('OCR Registration Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

