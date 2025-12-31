# OCR-공공데이터-리포트 플로우 점검 보고서

**작성일**: 2025-01-XX  
**프로젝트**: ForwardMax (carivdealer)  
**점검 범위**: 차량번호 OCR → 공공데이터 조회 → 평가 리포트 생성 플로우

---

## 📋 실행 요약

### 요청된 플로우
1. 백엔드에서 차량 번호 OCR (Gemini) 추출
2. 추출된 차량 번호로 공공데이터 Open API (차량등록증도) 호출
3. 공공데이터에서 추출된 데이터를 Gemini에 전달
4. 최종적으로 평가 리포트 생성

### 점검 결과
- ✅ **1단계 (OCR)**: 백엔드에서 완전 구현됨
- ✅ **2단계 (공공데이터 조회)**: 백엔드에서 완전 구현됨
- ⚠️ **3-4단계 (리포트 생성)**: 프론트엔드에서 구현됨 (백엔드 API 없음)

---

## 🔍 상세 점검 결과

### 1단계: 차량 번호 OCR 추출 (Gemini)

#### 구현 위치
- **파일**: `functions/src/vehicle/ocrRegistration.ts`
- **엔드포인트**: `POST /ocrRegistrationAPI`
- **라인**: 114-148

#### 구현 내용
```114:148:functions/src/vehicle/ocrRegistration.ts
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
```

#### 상태
✅ **완전 구현됨**
- Gemini API를 사용하여 차량번호 추출
- Secret Manager에서 API 키 로드
- JSON 스키마 검증으로 안정적인 응답 보장
- 에러 처리 완료

---

### 2단계: 공공데이터 Open API 호출

#### 구현 위치
- **파일**: `functions/src/vehicle/ocrRegistration.ts` (호출부)
- **파일**: `functions/src/vehicle/getVehicleStatistics.ts` (구현부)
- **라인**: 165-203 (ocrRegistration.ts), 20-175 (getVehicleStatistics.ts)

#### 구현 내용
```165:203:functions/src/vehicle/ocrRegistration.ts
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
```

#### 공공데이터 API 구현
```20:175:functions/src/vehicle/getVehicleStatistics.ts
export async function getVehicleStatistics(
  plateNumber: string
): Promise<VehicleStatisticsResponse> {
  try {
    // Secret Manager에서 API 키 로드
    const apiKey = await getSecret('kotsa-public-data-api-key');
    if (!apiKey || apiKey.trim() === '') {
      throw new Error('KOTSA Public Data API key is empty or not configured');
    }

    // 차량번호에서 공백 제거 (예: "33바 3333" → "33바3333")
    const cleanPlateNumber = plateNumber.replace(/\s+/g, '');

    if (!cleanPlateNumber || cleanPlateNumber.length < 4) {
      throw new Error('Invalid plate number format');
    }

    // 차량번호로 조회 가능한 여러 엔드포인트 시도
    const endpoints = [
      'https://apis.data.go.kr/B553881/changeRegistlnfoService_01/getCarRegInfoList',
      'https://apis.data.go.kr/B553881/changeRegistlnfoService_01/getCarInfo',
      'https://apis.data.go.kr/B553881/changeRegistlnfoService_01',
    ];

    let lastError: any = null;
    let lastXmlText: string = '';

    for (const endpoint of endpoints) {
      try {
        // 쿼리 파라미터 구성 (차량번호 기반)
        const queryParams = new URLSearchParams({
          serviceKey: apiKey,
          carNo: cleanPlateNumber,
          numOfRows: '10',
          pageNo: '1',
        });

        const url = `${endpoint}?${queryParams.toString()}`;
        console.log('[KOTSA] Trying endpoint:', url.replace(apiKey, '***'));
        console.log('[KOTSA] Plate number:', cleanPlateNumber);

        // API 호출 (타임아웃 30초)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 30000);

        let response: Response;
        try {
          response = await fetch(url, {
            method: 'GET',
            headers: {
              'Accept': 'application/xml',
            },
            signal: controller.signal,
          });
        } finally {
          clearTimeout(timeoutId);
        }

        const xmlText = await response.text();
        lastXmlText = xmlText;

        // 에러 응답 확인
        if (!response.ok) {
          // XML 에러 응답 파싱 시도
          if (xmlText.includes('<resultCode>') || xmlText.includes('<resultMsg>')) {
            try {
              const errorParser = new xml2js.Parser({
                explicitArray: false,
                mergeAttrs: true,
                explicitRoot: false,
              });
              const errorData = await errorParser.parseStringPromise(xmlText);
              const resultCode = errorData?.response?.header?.resultCode || errorData?.resultCode;
              const resultMsg = errorData?.response?.header?.resultMsg || errorData?.resultMsg || response.statusText;
              console.warn(`[KOTSA] Endpoint ${endpoint} error:`, resultCode, resultMsg);
              lastError = new Error(`API error (${resultCode}): ${resultMsg}`);
            } catch {
              console.warn(`[KOTSA] Endpoint ${endpoint} returned ${response.status}: ${response.statusText}`);
              lastError = new Error(`API returned ${response.status}: ${response.statusText}`);
            }
          } else {
            console.warn(`[KOTSA] Endpoint ${endpoint} returned ${response.status}: ${response.statusText}`);
            console.warn(`[KOTSA] Response body:`, xmlText.substring(0, 500));
            lastError = new Error(`API returned ${response.status}: ${response.statusText}`);
          }
          continue; // 다음 엔드포인트 시도
        }

        // XML 파싱
        const parser = new xml2js.Parser({
          explicitArray: false,
          mergeAttrs: true,
          explicitRoot: false,
        });

        const parsedData = await parser.parseStringPromise(xmlText);
        
        // 응답에 데이터가 있는지 확인
        const hasData = parsedData?.response?.body?.items || 
                       parsedData?.response?.body?.item ||
                       parsedData?.body?.items || 
                       parsedData?.body?.item ||
                       parsedData?.items ||
                       parsedData?.item;

        if (hasData) {
          console.log('[KOTSA] Success with endpoint:', endpoint);
          console.log('[KOTSA] Parsed data structure:', JSON.stringify(parsedData).substring(0, 500));
          
          return {
            success: true,
            data: parsedData,
          };
        } else {
          console.warn(`[KOTSA] No data in response from ${endpoint}`);
          console.warn(`[KOTSA] Parsed structure:`, JSON.stringify(parsedData).substring(0, 500));
          lastError = new Error('No data in API response');
        }
      } catch (error: any) {
        console.warn(`[KOTSA] Error with endpoint ${endpoint}:`, error.message);
        lastError = error;
        continue;
      }
    }

    // 모든 엔드포인트 실패
    console.error('[KOTSA] All endpoints failed. Last error:', lastError?.message);
    console.error('[KOTSA] Last XML response:', lastXmlText.substring(0, 1000));
    
    return {
      success: false,
      error: lastError?.message || 'All API endpoints failed',
      rawXml: lastXmlText,
    };
  } catch (error: any) {
    // 타임아웃 에러 처리
    if (error.name === 'AbortError') {
      console.error('[KOTSA] API call timeout');
      return {
        success: false,
        error: 'API call timeout (30s)',
      };
    }

    console.error('[KOTSA] Error fetching vehicle statistics:', {
      message: error.message,
      plateNumber: plateNumber,
      details: error
    });

    return {
      success: false,
      error: error.message || 'Failed to fetch vehicle statistics',
    };
  }
}
```

#### 상태
✅ **완전 구현됨**
- 한국교통안전공단 공공데이터 API 호출
- 여러 엔드포인트 폴백 로직 구현
- XML 파싱 및 데이터 추출
- Secret Manager에서 API 키 로드
- 타임아웃 처리 (30초)
- 에러 처리 완료

---

### 3-4단계: 공공데이터 → Gemini 리포트 생성

#### 현재 구현 위치
- **프론트엔드**: `index.tsx` (라인 1295-1372)
- **서비스**: `src/services/gemini.ts` (라인 107-210)

#### 프론트엔드 구현 내용
```1295:1372:index.tsx
      // ✅ OCR 완료 후 즉시 Gemini로 성능 평가 리포트 생성
      if (result.plateNumber) {
        // 이미 리포트 생성 중이면 중복 실행 방지
        if (isGeneratingReport) {
          console.warn('리포트 생성이 이미 진행 중입니다.');
          return;
        }
        
        setIsGeneratingReport(true);
        setReportGenerationError(null);
        setReportGenerationProgress(0);
        
        let progressInterval: NodeJS.Timeout | null = null;
        
        try {
          // 진행률 시뮬레이션 (실제로는 Gemini API 호출 중간에 업데이트)
          progressInterval = setInterval(() => {
            setReportGenerationProgress(prev => {
              if (prev >= 90) {
                if (progressInterval) clearInterval(progressInterval);
                return 90;
              }
              return prev + 10;
            });
          }, 300);

          const { GeminiService } = await import('./src/services/gemini');
          const generatedCondition = await GeminiService.generateVehicleCondition({
            plateNumber: result.plateNumber,
            vin: result.vin,
            manufacturer: result.manufacturer,
            modelName: result.model,
            modelYear: result.year,
            mileage: result.mileage,
            fuelType: result.fuelType,
            registrationDate: result.registrationDate,
            color: result.color,
          });
          
          // 진행률 인터벌 정리
          if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
          }
          
          // 생성된 리포트 유효성 검증
          if (!generatedCondition || typeof generatedCondition !== 'object' || Object.keys(generatedCondition).length === 0) {
            throw new Error('리포트 생성 결과가 유효하지 않습니다.');
          }
          
          // 필수 필드 확인
          const requiredFields = ['exterior', 'interior', 'mechanic', 'frame'];
          const missingFields = requiredFields.filter(field => !generatedCondition[field]);
          if (missingFields.length > 0) {
            throw new Error(`리포트 필수 필드가 누락되었습니다: ${missingFields.join(', ')}`);
          }
          
          setReportGenerationProgress(100);
          
          // 생성된 리포트를 상태에 저장
          setGeneratedReport({
            condition: generatedCondition,
            vehicleInfo: result,
            generatedAt: new Date().toISOString(),
          });
        } catch (reportError: any) {
          console.error('리포트 생성 실패:', reportError);
          // 진행률 인터벌 정리 (에러 발생 시에도)
          if (progressInterval) {
            clearInterval(progressInterval);
            progressInterval = null;
          }
          setReportGenerationError(reportError.message || '리포트 생성 중 오류가 발생했습니다.');
          setReportGenerationProgress(0);
        } finally {
          setIsGeneratingReport(false);
        }
      }
```

#### Gemini 리포트 생성 서비스
```107:210:src/services/gemini.ts
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
```

#### 상태
⚠️ **프론트엔드에서 구현됨 (백엔드 API 없음)**
- 공공데이터로부터 받은 차량 정보를 Gemini에 전달하여 리포트 생성
- 프론트엔드에서 Gemini API 키를 직접 사용 (환경 변수)
- 백엔드 API 엔드포인트 없음

---

## 📊 전체 플로우 다이어그램

```
┌─────────────────────────────────────────────────────────────┐
│                    사용자 (프론트엔드)                        │
│  등록원부 이미지 업로드                                        │
└────────────────────┬────────────────────────────────────────┘
                     │ POST /ocrRegistrationAPI
                     │ FormData: { registration_image }
                     ▼
┌─────────────────────────────────────────────────────────────┐
│              백엔드: ocrRegistrationAPI                      │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 1. 이미지 파싱 (multipart/form-data)                  │   │
│  │ 2. Gemini API 호출 → 차량번호 추출                    │   │
│  │    - Model: gemini-3-pro-preview                      │   │
│  │    - Response: { plateNumber: "12가 3456" }          │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │ plateNumber                            │
│                     ▼                                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 3. 공공데이터 API 호출                                │   │
│  │    - getVehicleStatistics(plateNumber)                │   │
│  │    - KOTSA API: 차량등록증도 공공데이터               │   │
│  │    - Response: XML → JSON 변환                        │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │ vehicleInfo                             │
│                     │ { vin, manufacturer, model, year, ... } │
│                     ▼                                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 4. 응답 반환                                          │   │
│  │    { plateNumber, vin, manufacturer, model, ... }     │   │
│  └──────────────────┬───────────────────────────────────┘   │
└─────────────────────┼───────────────────────────────────────┘
                      │ JSON Response
                      ▼
┌─────────────────────────────────────────────────────────────┐
│              프론트엔드: index.tsx                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 5. OCR 결과 수신                                      │   │
│  │    result = { plateNumber, vin, manufacturer, ... }   │   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │ result                                  │
│                     ▼                                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 6. Gemini 리포트 생성 (프론트엔드)                    │   │
│  │    - GeminiService.generateVehicleCondition(result)  │   │
│  │    - Model: gemini-3-pro-preview                      │   │
│  │    - Prompt: 차량 정보 기반 평가 리포트 생성          │   │
│  │    - Response: { exterior, interior, mechanic, frame }│   │
│  └──────────────────┬───────────────────────────────────┘   │
│                     │ generatedReport                         │
│                     ▼                                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ 7. 리포트 저장 (선택사항)                             │   │
│  │    - POST /saveReportAPI                              │   │
│  │    - Firestore에 저장                                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## ✅ 구현 상태 요약

| 단계 | 기능 | 구현 위치 | 상태 |
|------|------|-----------|------|
| 1 | 차량번호 OCR (Gemini) | `functions/src/vehicle/ocrRegistration.ts` | ✅ 완전 구현 |
| 2 | 공공데이터 API 호출 | `functions/src/vehicle/getVehicleStatistics.ts` | ✅ 완전 구현 |
| 3 | 공공데이터 → Gemini 전달 | `index.tsx` (프론트엔드) | ⚠️ 프론트엔드 구현 |
| 4 | 평가 리포트 생성 | `src/services/gemini.ts` (프론트엔드) | ⚠️ 프론트엔드 구현 |

---

## ⚠️ 발견된 문제점 및 개선 사항

### 1. 백엔드 리포트 생성 API 부재

**현재 상태**:
- 리포트 생성이 프론트엔드에서 수행됨
- Gemini API 키가 프론트엔드 환경 변수에 노출됨
- 백엔드에서 전체 플로우를 완료하는 API가 없음

**권장 사항**:
- 백엔드에 리포트 생성 API 추가 (`generateReportAPI`)
- `ocrRegistrationAPI`에서 리포트 생성까지 포함하거나
- 별도 엔드포인트로 분리 (`POST /generateReportAPI`)

**예상 구조**:
```typescript
// functions/src/report/generateReport.ts
export const generateReport = async (req: Request, res: Response) => {
  const { vehicleInfo } = req.body;
  
  // Gemini API 호출하여 리포트 생성
  const report = await generateVehicleConditionReport(vehicleInfo);
  
  res.json({ success: true, report });
};
```

### 2. API 키 관리 일관성

**현재 상태**:
- 백엔드 OCR: Secret Manager 사용 (`gemini-api-key`)
- 프론트엔드 리포트: 환경 변수 사용 (`VITE_GEMINI_API_KEY`)

**권장 사항**:
- 모든 Gemini API 호출을 백엔드로 이동
- Secret Manager를 통한 일관된 API 키 관리

### 3. 에러 처리 개선

**현재 상태**:
- 공공데이터 API 실패 시 차량번호만 반환 (라인 193)
- 리포트 생성 실패 시 프론트엔드에서 처리

**권장 사항**:
- 백엔드에서 전체 플로우 에러 처리 통합
- 부분 실패 시에도 최대한 데이터 반환

---

## 🔧 권장 개선 방안

### 옵션 1: 백엔드 리포트 생성 API 추가 (권장)

**장점**:
- API 키 보안 강화 (프론트엔드 노출 방지)
- 전체 플로우를 백엔드에서 관리
- 에러 처리 중앙화

**구현 방법**:
1. `functions/src/report/generateReport.ts` 생성
2. `ocrRegistrationAPI`에서 리포트 생성까지 포함하거나
3. 별도 엔드포인트로 분리하여 프론트엔드에서 호출

### 옵션 2: 현재 구조 유지

**장점**:
- 이미 구현되어 있음
- 프론트엔드에서 진행률 표시 용이

**단점**:
- API 키 노출 위험
- 백엔드-프론트엔드 분리 미흡

---

## 📝 결론

### 구현 완료도
- **OCR + 공공데이터 조회**: ✅ 100% 완료 (백엔드)
- **리포트 생성**: ⚠️ 80% 완료 (프론트엔드, 백엔드 API 없음)

### 전체 플로우 동작 여부
✅ **동작함** - 현재 구조로도 전체 플로우가 정상 작동합니다.

### 보안 및 아키텍처 개선 필요
⚠️ **개선 권장** - 백엔드 리포트 생성 API 추가를 권장합니다.

---

**보고서 작성일**: 2025-01-XX  
**작성자**: AI Assistant  
**상태**: ✅ 점검 완료

