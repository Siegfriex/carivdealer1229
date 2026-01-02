import { Request, Response } from 'express';
import { getSecret } from '../config/secrets';
import { GoogleGenAI, Type } from '@google/genai';
import { asyncHandler, createError } from '../middlewares/errorHandler';

interface GenerateReportRequest {
  vehicleInfo: {
    plateNumber?: string;
    vin?: string;
    manufacturer?: string;
    model?: string;
    modelName?: string;
    modelYear?: string;
    year?: string;
    mileage?: string;
    fuelType?: string;
    registrationDate?: string;
    color?: string;
  };
}

/**
 * 차량 정보를 바탕으로 성능 평가 리포트의 "상세 상태" 섹션 생성
 * 평가사 진단은 제외하고 차량 정보만 기반으로 생성
 */
export const generateReport = asyncHandler(async (req: Request, res: Response) => {
  if (req.method !== 'POST') {
    throw createError('Method not allowed', 405, 'METHOD_NOT_ALLOWED');
  }

  try {
    const { vehicleInfo } = req.body as GenerateReportRequest;

    // 입력값 유효성 검증
    if (!vehicleInfo || typeof vehicleInfo !== 'object') {
      throw createError('vehicleInfo is required and must be an object', 400, 'VALIDATION_ERROR');
    }

    if (!vehicleInfo.plateNumber || vehicleInfo.plateNumber.trim() === '') {
      throw createError('plateNumber is required', 400, 'VALIDATION_ERROR');
    }

    // Secret Manager에서 Gemini API 키 로드
    let apiKey: string;
    try {
      apiKey = await getSecret('gemini-api-key');
      if (!apiKey || apiKey.trim() === '') {
        throw new Error('Gemini API key is empty or not configured');
      }
      console.log('[GenerateReport] Gemini API key retrieved successfully');
    } catch (error: any) {
      console.error('[GenerateReport] Failed to get Gemini API key:', {
        message: error.message,
        code: error.code,
        details: error
      });
      throw createError(
        `Gemini API key configuration error: ${error.message}`,
        500,
        'CONFIGURATION_ERROR'
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    // 차량 정보를 텍스트로 정리
    const vehicleDetails = `
차량번호: ${vehicleInfo.plateNumber || '미확인'}
차대번호(VIN): ${vehicleInfo.vin || '미확인'}
제조사: ${vehicleInfo.manufacturer || '미확인'}
모델명: ${vehicleInfo.modelName || vehicleInfo.model || '미확인'}
연식: ${vehicleInfo.modelYear || vehicleInfo.year || '미확인'}
주행거리: ${vehicleInfo.mileage || '미확인'} km
연료종류: ${vehicleInfo.fuelType || '미확인'}
등록일자: ${vehicleInfo.registrationDate || '미확인'}
색상: ${vehicleInfo.color || '미확인'}
`.trim();

    const prompt = `다음 차량 정보를 바탕으로 성능평가리포트의 "상세 상태" 섹션을 작성하세요.

**차량 정보:**
${vehicleDetails}

**요구사항:**
1. 평가사 진단은 포함하지 마세요. 차량 정보만을 바탕으로 작성하세요.
2. 다음 4개 카테고리별로 구체적이고 상세한 텍스트를 작성하세요:
   - exterior: 외관 상태 (차량번호, 제조사, 모델, 연식, 색상, 등록일자 등을 고려한 일반적인 외관 상태 설명)
   - interior: 내부 상태 (연식, 주행거리, 연료종류 등을 고려한 일반적인 내부 상태 설명)
   - mechanic: 기계적 상태 (연식, 주행거리, 연료종류, 제조사/모델 특성을 고려한 일반적인 기계적 상태 설명)
   - frame: 차대/프레임 상태 (등록일자, 연식, 사고이력 유무 등을 고려한 일반적인 프레임 상태 설명)

3. 각 카테고리는 1-2문장으로 구체적이고 전문적으로 작성하세요.
4. 차량 정보가 없는 항목은 "미확인"으로 표시하고, 일반적인 추정을 바탕으로 작성하세요.
5. 한국어로 작성하세요.

JSON 형식으로만 응답하세요.`;

    console.log('[GenerateReport] Generating report for vehicle:', vehicleInfo.plateNumber);

    // Gemini API 호출
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 16000 },
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            exterior: {
              type: Type.STRING,
              description: '외관 상태에 대한 구체적인 설명 (1-2문장)',
            },
            interior: {
              type: Type.STRING,
              description: '내부 상태에 대한 구체적인 설명 (1-2문장)',
            },
            mechanic: {
              type: Type.STRING,
              description: '기계적 상태에 대한 구체적인 설명 (1-2문장)',
            },
            frame: {
              type: Type.STRING,
              description: '차대/프레임 상태에 대한 구체적인 설명 (1-2문장)',
            },
          },
        },
      },
    });

    const responseText = response.text || '{}';

    // 응답 파싱 및 유효성 검증
    let parsedResponse: any;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error('[GenerateReport] Failed to parse Gemini response:', parseError);
      throw createError(
        '리포트 생성 응답을 파싱할 수 없습니다.',
        500,
        'PARSE_ERROR'
      );
    }

    // 필수 필드 확인
    const requiredFields = ['exterior', 'interior', 'mechanic', 'frame'];
    const missingFields = requiredFields.filter(
      (field) => !parsedResponse[field] || typeof parsedResponse[field] !== 'string'
    );

    if (missingFields.length > 0) {
      console.error('[GenerateReport] Missing required fields:', missingFields);
      throw createError(
        `리포트 필수 필드가 누락되었습니다: ${missingFields.join(', ')}`,
        500,
        'VALIDATION_ERROR',
        { missingFields }
      );
    }

    console.log('[GenerateReport] Report generated successfully for vehicle:', vehicleInfo.plateNumber);

    res.status(200).json({
      success: true,
      condition: parsedResponse,
      vehicleInfo: vehicleInfo,
      generatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    // asyncHandler가 에러를 처리하므로 여기서는 throw만 하면 됨
    throw error;
  }
});


