/**
 * API 클라이언트 (Firebase Functions 연동)
 * 회원·차량·검차·경매·거래·탁송·정산·리포트 등 백엔드 API 호출 및 타임아웃/네트워크 실패 시 Mock 폴백 처리.
 * 참조: docs/CarivDealer_api_v1.md
 */

import { mockResponses } from './mockData';
import { analyzeError } from '@/shared/lib/errorHandler';
import { API_ENDPOINTS } from '@/shared/config/apiEndpoints';
import { isRunDev } from '@/shared/config/runDev';

/** API Base URL - Firebase Functions v2 엔드포인트 */
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  'https://asia-northeast3-carivdealer.cloudfunctions.net';

/** 일반 API 타임아웃 (밀리초) */
const API_TIMEOUT = 30000;
/** OCR 전용 타임아웃 (밀리초) - 이미지 처리 시간 고려 */
const OCR_TIMEOUT = 90000;

/** 개발 또는 런데브(VITE_RUN_DEV) 환경에서만 Mock 호출 로그 출력 */
const isDev = isRunDev();
const logMockCall = (message: string, ...args: unknown[]) => {
  if (isDev) {
    console.warn(`[프로토타입] ${message}`, ...args);
  }
};

/**
 * 타임아웃을 적용한 fetch 래퍼.
 * @description 지정 시간 내 응답 없으면 AbortController로 중단 후 AbortError 발생.
 * @param url - 요청 URL
 * @param options - fetch RequestInit 옵션
 * @param timeout - 타임아웃 밀리초 (기본 API_TIMEOUT)
 * @returns Response
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit = {},
  timeout: number = API_TIMEOUT
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error: unknown) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error('API_TIMEOUT');
    }
    throw error;
  }
}

/**
 * API 호출 공통 함수 (타임아웃·에러 분석·Mock 폴백 지원).
 * @description GET/POST 등 JSON API 호출 후 실패 시 analyzeError로 메시지 변환, 타임아웃/네트워크 에러 시 mockFallback 있으면 Mock 반환.
 * @param endpoint - API_ENDPOINTS 상대 경로
 * @param options - fetch options (method, body, headers 등)
 * @param queryString - 쿼리 문자열 (앞에 ? 포함 가능)
 * @param mockFallback - 타임아웃/네트워크 실패 시 호출할 Mock 반환 함수
 * @returns API 응답 JSON을 파싱한 T
 */
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {},
  queryString?: string,
  mockFallback?: () => T
): Promise<T> {
  const url = `${API_BASE_URL}/${endpoint}${queryString || ''}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  try {
    const response = await fetchWithTimeout(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    }, API_TIMEOUT);

    if (!response.ok) {
      let errorData: { error?: string; message?: string } = { message: response.statusText };
      try {
        errorData = (await response.json()) as { error?: string; message?: string };
      } catch {
        // keep default
      }

      const error = {
        message: errorData.error || errorData.message || `API call failed: ${response.statusText}`,
        statusCode: response.status,
        status: response.status,
      };

      const apiError = analyzeError(error);
      throw new Error(apiError.message);
    }

    return response.json();
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : String(error);
    if (errMsg === 'API_TIMEOUT') {
      if (mockFallback) {
        logMockCall(`API 타임아웃(30초)로 인한 Mock 폴백: ${endpoint}`, errMsg);
        const fallbackResult = mockFallback();
        if (typeof fallbackResult === 'object' && fallbackResult !== null && !Array.isArray(fallbackResult)) {
          (fallbackResult as Record<string, unknown>)._isMockData = true;
        }
        return fallbackResult;
      }
      throw new Error(`API 호출 타임아웃(30초). Mock 데이터가 설정되지 않았습니다.`);
    }

    if (error instanceof TypeError && (errMsg.includes('fetch') || errMsg.includes('Failed to fetch'))) {
      if (mockFallback) {
        logMockCall(`네트워크 에러로 인한 Mock 폴백: ${endpoint}`, errMsg);
        const fallbackResult = mockFallback();
        if (typeof fallbackResult === 'object' && fallbackResult !== null && !Array.isArray(fallbackResult)) {
          (fallbackResult as Record<string, unknown>)._isMockData = true;
        }
        return fallbackResult;
      }
      const apiError = analyzeError(error);
      throw new Error(apiError.message);
    }

    throw error;
  }
}

/**
 * 통합 API 클라이언트 객체.
 * @description 회원·차량·검차·경매·거래·탁송·정산·리포트·설정 API 및 공용 post/upload 메서드 제공.
 */
export const apiClient = {
  /** 회원 가입·사업자 인증 API */
  member: {
    register: (data: {
      email: string;
      password: string;
      dealer_name: string;
      phone: string;
      terms_agreed: boolean;
    }) => apiCall<{ success: boolean; member_id: string; message: string }>(
      API_ENDPOINTS.MEMBER.REGISTER,
      { method: 'POST', body: JSON.stringify(data) }
    ),

    verifyBusiness: async (businessRegistrationImage: File) => {
      const formData = new FormData();
      formData.append('business_registration_image', businessRegistrationImage);

      try {
        const response = await fetchWithTimeout(
          `${API_BASE_URL}/${API_ENDPOINTS.MEMBER.VERIFY_BUSINESS}`,
          {
            method: 'POST',
            body: formData,
          },
          API_TIMEOUT
        );
        return response.json();
      } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : String(error);
        if (errMsg === 'API_TIMEOUT' || (error instanceof TypeError && errMsg.includes('fetch'))) {
          const apiError = analyzeError(error);
          throw new Error(apiError.message || '사업자 인증 API 호출 실패. 네트워크 연결을 확인해주세요.');
        }
        throw error;
      }
    },
  },

  /** 차량 OCR·검차 신청 API */
  vehicle: {
    ocrRegistration: async (file: File) => {
      const formData = new FormData();
      formData.append('registration_image', file);

      try {
        const response = await fetchWithTimeout(
          `${API_BASE_URL}/${API_ENDPOINTS.VEHICLE.OCR_REGISTRATION}`,
          {
            method: 'POST',
            body: formData,
          },
          OCR_TIMEOUT
        );

        if (!response.ok) {
          let errorData: { error?: string; message?: string } = { message: response.statusText };
          try {
            errorData = (await response.json()) as { error?: string; message?: string };
          } catch {
            // keep default
          }

          const error = {
            message: errorData.error || errorData.message || `API call failed: ${response.statusText}`,
            statusCode: response.status,
            status: response.status,
          };

          const apiError = analyzeError(error);
          throw new Error(apiError.message);
        }

        return response.json() as Promise<{
          vin: string;
          manufacturer: string;
          model: string;
          year: string;
          mileage: string;
          fuelType?: string;
          registrationDate?: string;
          color?: string;
          plateNumber?: string;
          publicDataSuccess?: boolean;
          publicDataError?: string | null;
        }>;
      } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : String(error);
        if (errMsg === 'API_TIMEOUT' || (error instanceof TypeError && errMsg.includes('fetch'))) {
          const apiError = analyzeError(error);
          throw new Error(apiError.message || '등록원부 OCR API 호출 실패. 네트워크 연결을 확인해주세요.');
        }
        throw error;
      }
    },

    inspection: {
      request: (vehicleId: string, data: {
        preferred_date: string;
        preferred_time: string;
      }) => apiCall<{ success: boolean; inspection_id: string; message: string }>(
        API_ENDPOINTS.VEHICLE.INSPECTION_REQUEST,
        {
          method: 'POST',
          body: JSON.stringify({ vehicle_id: vehicleId, ...data }),
        },
        undefined,
        () => ({
          success: true,
          inspection_id: `insp-${Date.now()}`,
          message: '검차 신청이 완료되었습니다.',
        })
      ),
    },
  },

  /** 검차 배정·결과 업로드·결과 조회 API */
  inspection: {
    assign: (inspectionId: string) => apiCall<{
      success: boolean;
      evaluator_id: string;
      message: string;
    }>(
      API_ENDPOINTS.INSPECTION.ASSIGN,
      {
        method: 'POST',
        body: JSON.stringify({ inspection_id: inspectionId }),
      },
      undefined,
      () => mockResponses.assignEvaluator(inspectionId)
    ),

    uploadResult: async (inspectionId: string, data: {
      inspection_result: unknown;
      images: File[];
    }) => {
      const formData = new FormData();
      formData.append('inspection_id', inspectionId);
      formData.append('inspection_result', JSON.stringify(data.inspection_result));
      data.images.forEach((img, idx) => {
        formData.append(`images[${idx}]`, img);
      });

      try {
        const response = await fetchWithTimeout(
          `${API_BASE_URL}/${API_ENDPOINTS.INSPECTION.UPLOAD_RESULT}`,
          {
            method: 'POST',
            body: formData,
          },
          API_TIMEOUT
        );
        return response.json();
      } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : String(error);
        if (errMsg === 'API_TIMEOUT' || (error instanceof TypeError && errMsg.includes('fetch'))) {
          logMockCall(`API 타임아웃/네트워크 에러로 인한 Mock 폴백: inspectionUploadResultAPI`, errMsg);
          const fallbackResult = mockResponses.uploadInspectionResult(inspectionId);
          (fallbackResult as Record<string, unknown>)._isMockData = true;
          return fallbackResult;
        }
        throw error;
      }
    },

    getResult: (inspectionId: string) => apiCall<{
      success: boolean;
      result: unknown;
      inspection: unknown;
    }>(
      API_ENDPOINTS.INSPECTION.GET_RESULT,
      { method: 'GET' },
      `?inspection_id=${encodeURIComponent(inspectionId)}`,
      () => mockResponses.getInspectionResult(inspectionId)
    ),
  },

  /** 경매 입찰·즉시 구매 API */
  auction: {
    bid: (auctionId: string, bidAmount: number) => apiCall<{
      success: boolean;
      message: string;
    }>(
      API_ENDPOINTS.AUCTION.BID,
      {
        method: 'POST',
        body: JSON.stringify({ auction_id: auctionId, bid_amount: bidAmount }),
      },
      undefined,
      () => mockResponses.auction.bid(auctionId, bidAmount)
    ),

    buyNow: (auctionId: string) => apiCall<{
      success: boolean;
      contract_id: string;
      message: string;
    }>(
      API_ENDPOINTS.AUCTION.BUY_NOW,
      {
        method: 'POST',
        body: JSON.stringify({ auction_id: auctionId }),
      },
      undefined,
      () => mockResponses.auction.buyNow(auctionId)
    ),
  },

  /** 거래(판매방식 변경·제안 수락/거절·확인) API */
  trade: {
    changeSaleMethod: (vehicleId: string, auctionSettings: {
      start_price: number;
      buy_now_price?: number;
    }) => apiCall<{
      success: boolean;
      auction_id: string;
    }>(
      API_ENDPOINTS.TRADE.CHANGE_SALE_METHOD,
      {
        method: 'POST',
        body: JSON.stringify({ vehicle_id: vehicleId, auction_settings: auctionSettings }),
      }
    ),

    acceptProposal: (proposalId: string, action: 'accept' | 'reject') => apiCall<{
      success: boolean;
      message: string;
    }>(
      API_ENDPOINTS.TRADE.ACCEPT_PROPOSAL,
      {
        method: 'POST',
        body: JSON.stringify({ proposal_id: proposalId, action }),
      },
      undefined,
      () => mockResponses.acceptProposal(proposalId, action)
    ),

    confirmProposal: (proposalId: string, confirmed: boolean) => {
      logMockCall(`confirmProposal 호출: proposalId=${proposalId}, confirmed=${confirmed}`);
      return Promise.resolve(mockResponses.confirmProposal(proposalId, confirmed));
    },
  },

  /** 탁송 예약·배차 요청/확정·인계 승인 API */
  logistics: {
    schedule: (data: {
      schedule_date: string;
      schedule_time: string;
      address: string;
      vehicle_id?: string;
      special_notes?: string;
    }) => apiCall<{
      success: boolean;
      logistics_id: string;
      message: string;
    }>(
      API_ENDPOINTS.LOGISTICS.SCHEDULE,
      {
        method: 'POST',
        body: JSON.stringify(data),
      },
      undefined,
      () => mockResponses.scheduleLogistics(data)
    ),

    dispatch: {
      request: (logisticsId: string) => apiCall<{
        success: boolean;
        dispatch_id: string;
        message: string;
      }>(
        API_ENDPOINTS.LOGISTICS.DISPATCH_REQUEST,
        {
          method: 'POST',
          body: JSON.stringify({ logistics_id: logisticsId }),
        },
        undefined,
        () => mockResponses.requestDispatch(logisticsId)
      ),

      confirm: (dispatchId: string, driverInfo?: {
        driver_name?: string;
        driver_phone?: string;
      }) => apiCall<{
        success: boolean;
        message: string;
        driver_info?: {
          name: string;
          phone: string;
        };
      }>(
        API_ENDPOINTS.LOGISTICS.DISPATCH_CONFIRM,
        {
          method: 'POST',
          body: JSON.stringify({
            dispatch_id: dispatchId,
            ...driverInfo,
          }),
        },
        undefined,
        () => mockResponses.confirmDispatch(dispatchId)
      ),
    },

    approveHandover: (logisticsId: string, pin: string) => apiCall<{
      success: boolean;
      handover_timestamp: string;
      message: string;
    }>(
      API_ENDPOINTS.LOGISTICS.HANDOVER_APPROVE,
      {
        method: 'POST',
        body: JSON.stringify({ logistics_id: logisticsId, pin }),
      },
      undefined,
      () => mockResponses.approveHandover(logisticsId, pin)
    ),
  },

  /** 정산 알림 API */
  settlement: {
    notify: (settlementId: string) => apiCall<{
      success: boolean;
      notification_id: string;
      message: string;
    }>(
      API_ENDPOINTS.SETTLEMENT.NOTIFY,
      {
        method: 'POST',
        body: JSON.stringify({ settlement_id: settlementId }),
      },
      undefined,
      () => mockResponses.notifySettlement(settlementId)
    ),
  },

  /** 차량 상태 리포트 생성·저장 API */
  report: {
    generateReport: async (vehicleInfo: {
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
    }) => apiCall<{
      success: boolean;
      condition: {
        exterior: string;
        interior: string;
        mechanic: string;
        frame: string;
      };
      vehicleInfo: typeof vehicleInfo;
      generatedAt: string;
    }>(
      API_ENDPOINTS.REPORT.GENERATE,
      { method: 'POST', body: JSON.stringify({ vehicleInfo }) },
      undefined,
      () => ({
        success: true,
        condition: {
          exterior: '외관 상태 평가 중...',
          interior: '내부 상태 평가 중...',
          mechanic: '기계적 상태 평가 중...',
          frame: '차대/프레임 상태 평가 중...',
        },
        vehicleInfo,
        generatedAt: new Date().toISOString(),
      })
    ),
    saveReport: async (data: {
      vehicleId: string;
      report: {
        condition: {
          exterior: string;
          interior: string;
          mechanic: string;
          frame: string;
        };
        summary?: string;
        score?: string;
        aiAnalysis?: {
          pros: string[];
          cons: string[];
          marketVerdict: string;
        };
      };
      vehicleInfo: {
        plateNumber?: string;
        vin?: string;
        manufacturer?: string;
        model?: string;
        year?: string;
        mileage?: string;
        fuelType?: string;
        registrationDate?: string;
        color?: string;
      };
    }) => apiCall<{ success: boolean; reportId: string; message: string }>(
      API_ENDPOINTS.REPORT.SAVE,
      { method: 'POST', body: JSON.stringify(data) }
    ),
  },

  /** 설정(Google Maps API 키 등) API */
  config: {
    getGoogleMapsApiKey: () => apiCall<{ success: boolean; apiKey: string }>(
      API_ENDPOINTS.CONFIG.GOOGLE_MAPS_API_KEY,
      { method: 'GET' }
    ),
  },

  /** 공용 POST 호출 (엔드포인트 경로, JSON body) */
  post: <T = unknown>(endpoint: string, data?: unknown): Promise<T> =>
    apiCall<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

  /** 공용 multipart 업로드 (엔드포인트 경로, FormData) */
  upload: async <T = unknown>(endpoint: string, formData: FormData): Promise<T> => {
    const response = await fetchWithTimeout(
      `${API_BASE_URL}/${endpoint}`,
      {
        method: 'POST',
        body: formData,
      },
      API_TIMEOUT
    );

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Upload failed');
    }

    return response.json();
  },
};
