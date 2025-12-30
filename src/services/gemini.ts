import { GoogleGenAI, Type } from "@google/genai";

// Helper to process file to base64
export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = reject;
  });
};

export const GeminiService = {
  fileToBase64,

  extractBusinessInfo: async (file: File) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in .env file.');
    }
    
    const ai = new GoogleGenAI({ apiKey });
    const base64Data = await fileToBase64(file);
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: file.type, data: base64Data } },
          { text: "Extract Korean Business Registration Info as JSON." }
        ]
      },
      config: {
        thinkingConfig: { thinkingBudget: 16000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            companyName: { type: Type.STRING },
            businessRegNo: { type: Type.STRING },
            representativeName: { type: Type.STRING },
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  },

  extractVehicleRegistration: async (file: File) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in .env file.');
    }
    
    const ai = new GoogleGenAI({ apiKey });
    const base64Data = await fileToBase64(file);
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: {
        parts: [
          { inlineData: { mimeType: file.type, data: base64Data } },
          { text: "Extract Korean Vehicle Registration details as JSON." }
        ]
      },
      config: {
        thinkingConfig: { thinkingBudget: 16000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            plateNumber: { type: Type.STRING },
            vin: { type: Type.STRING },
            manufacturer: { type: Type.STRING },
            modelName: { type: Type.STRING },
            modelYear: { type: Type.STRING },
            fuelType: { type: Type.STRING },
            registrationDate: { type: Type.STRING },
            mileage: { type: Type.STRING },
          }
        }
      }
    });
    return JSON.parse(response.text || "{}");
  },

  estimateMarketPrice: async (model: string, year: string) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in .env file.');
    }
    
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Estimate export market price for ${year} ${model} from Korea in USD. Search recent data.`,
      config: { tools: [{ googleSearch: {} }] }
    });
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
      ?.map((c: any) => c.web?.uri ? { title: c.web.title, uri: c.web.uri } : null)
      .filter(Boolean) || [];
    return { text: response.text, sources };
  },

  /**
   * 차량 정보를 바탕으로 상세 상태(exterior, interior, mechanic, frame) 생성
   * 평가사 진단은 제외하고 차량 정보만 기반으로 생성
   */
  generateVehicleCondition: async (vehicleInfo: {
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
  }) => {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) {
      throw new Error('Gemini API key is not configured. Please set VITE_GEMINI_API_KEY in .env file.');
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

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 16000 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            exterior: { 
              type: Type.STRING, 
              description: "외관 상태에 대한 구체적인 설명 (1-2문장)" 
            },
            interior: { 
              type: Type.STRING, 
              description: "내부 상태에 대한 구체적인 설명 (1-2문장)" 
            },
            mechanic: { 
              type: Type.STRING, 
              description: "기계적 상태에 대한 구체적인 설명 (1-2문장)" 
            },
            frame: { 
              type: Type.STRING, 
              description: "차대/프레임 상태에 대한 구체적인 설명 (1-2문장)" 
            },
          }
        }
      }
    });

    const responseText = response.text || '{}';
    
    // 응답 파싱 및 유효성 검증
    let parsedResponse: any;
    try {
      parsedResponse = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', parseError);
      throw new Error('리포트 생성 응답을 파싱할 수 없습니다.');
    }
    
    // 필수 필드 확인
    const requiredFields = ['exterior', 'interior', 'mechanic', 'frame'];
    const missingFields = requiredFields.filter(field => !parsedResponse[field] || typeof parsedResponse[field] !== 'string');
    
    if (missingFields.length > 0) {
      console.error('Missing required fields in Gemini response:', missingFields);
      throw new Error(`리포트 필수 필드가 누락되었습니다: ${missingFields.join(', ')}`);
    }
    
    return parsedResponse;
  }
};

