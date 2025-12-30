import { getSecret } from '../config/secrets';
import * as xml2js from 'xml2js';

// VehicleStatisticsParams는 더 이상 사용하지 않음 (차량번호만으로 조회)

interface VehicleStatisticsResponse {
  success: boolean;
  data?: any;
  error?: string;
  rawXml?: string;  // 파싱 실패 시 원본 XML 저장
}

/**
 * 한국교통안전공단 공공데이터 API 호출
 * 차량등록번호를 기반으로 차량 정보 조회
 * 
 * API 엔드포인트: https://apis.data.go.kr/B553881/changeRegistlnfoService_01
 * 응답 형식: XML
 */
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

/**
 * 공공데이터 API 응답에서 차량 정보 추출
 * XML 파싱된 데이터에서 차량 상세 정보를 추출하여 반환
 */
export function extractVehicleInfoFromKOTSAResponse(
  parsedData: any,
  plateNumber: string
): {
  plateNumber: string;
  vin: string;
  manufacturer: string;
  model: string;
  year: string;
  mileage: string;
  fuelType: string;
  registrationDate: string;
  color: string;
} {
  // XML 응답 구조에 따라 필드 매핑
  // 실제 API 응답 구조를 확인하여 수정 필요
  const response = parsedData.response || parsedData;
  const body = response.body || response;
  const items = body.items || body.item || [];
  
  // 첫 번째 항목 사용 (일반적으로 단일 차량 정보)
  const item = Array.isArray(items) ? items[0] : items;
  
  if (!item) {
    console.warn('[KOTSA] No vehicle data found in response');
    console.warn('[KOTSA] Response structure:', JSON.stringify(parsedData).substring(0, 1000));
    return {
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
  }

  console.log('[KOTSA] Extracting vehicle info from item:', JSON.stringify(item).substring(0, 500));

  // API 응답 필드명에 맞게 매핑 (실제 응답 구조 확인 필요)
  // 다양한 가능한 필드명 시도
  return {
    plateNumber: plateNumber,
    vin: item.carVin || item.vin || item.차대번호 || item.VIN || item.carVIN || '',
    manufacturer: item.maker || item.manufacturer || item.제조사 || item.MAKER || item.makerNm || '',
    model: item.carName || item.model || item.차명 || item.CAR_NAME || item.carNm || item.modelNm || '',
    year: item.registYy || item.year || item.연식 || item.REGIST_YY || item.modelYear || '',
    mileage: item.mileage || item.주행거리 || item.MILEAGE || item.drvgDist || '',
    fuelType: item.useFuelNm || item.fuelType || item.연료종류 || item.USE_FUEL_NM || item.useFuel || '',
    registrationDate: item.registDt || item.registrationDate || item.등록일자 || item.REGIST_DT || item.firstRegDt || '',
    color: item.carColor || item.color || item.색상 || item.CAR_COLOR || item.carClr || '',
  };
}

