import { Request, Response } from 'express';
// import { getSecret } from '../config/secrets';

export const verifyBusiness = async (req: Request, res: Response) => {
  // CORS는 v2에서 자동 처리됨 (index.ts에서 cors: true 설정)

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    // TODO: 파일 업로드 처리
    // const file = req.files?.business_registration_image;
    // if (!file) {
    //   res.status(400).json({ error: 'business_registration_image is required' });
    //   return;
    // }

    // Secret Manager에서 Gemini API 키 로드 (향후 OCR 처리 시 사용)
    // const apiKey = await getSecret('gemini-api-key');
    // const ai = new GoogleGenAI({ apiKey });

    // TODO: 실제 사업자등록증 OCR 및 진위 확인 처리
    // 현재는 Mock 응답 반환

    const mockResponse = {
      success: true,
      verified: true,
      business_info: {
        companyName: 'Global Motors',
        businessRegNo: '123-45-67890',
        representativeName: '홍길동',
      },
      message: '인증이 완료되었습니다.',
    };

    res.status(200).json(mockResponse);
  } catch (error: any) {
    console.error('Business Verification Error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
};

