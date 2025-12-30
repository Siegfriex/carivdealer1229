import { mockResponses } from './apiMockData';
import { analyzeError } from '../utils/errorHandler';

// API Base URL - Firebase Functions v2 endpoint
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  'https://asia-northeast3-carivdealer.cloudfunctions.net';

// API 타임아웃 (밀리초)
const API_TIMEOUT = 30000; // 30초 (OCR 처리는 시간이 오래 걸릴 수 있음)

// 개발 환경에서만 로그 출력
const isDev = import.meta.env.DEV;
const logMockCall = (message: string, ...args: any[]) => {
  if (isDev) {
    console.warn(`[프로토타입] ${message}`, ...args);
  }
};

// 타임아웃을 포함한 fetch 래퍼
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
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      throw new Error('API_TIMEOUT');
    }
    throw error;
  }
}

// Helper function for API calls with timeout and fallback
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
      // 응답이 온 실패(400, 404, 409 등)는 폴백하지 않고 에러만 throw
      let errorData: any;
      try {
        errorData = await response.json();
      } catch {
        errorData = { message: response.statusText };
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
  } catch (error: any) {
    // 타임아웃(AbortError)만 폴백: 무응답(5초) 시에만 Mock 데이터로 폴백
    // 400/404/409 같은 "응답이 온 실패"는 폴백하지 않음
    if (error.message === 'API_TIMEOUT') {
      if (mockFallback) {
        logMockCall(`API 타임아웃(5초)로 인한 Mock 폴백: ${endpoint}`, error.message);
        // 폴백 발생 시 반환값에 플래그 추가 (선택 사항)
        const fallbackResult = mockFallback();
        // 유령 성공 방지를 위한 플래그 (화면에서 사용 가능)
        if (typeof fallbackResult === 'object' && fallbackResult !== null) {
          (fallbackResult as any)._isMockData = true;
        }
        return fallbackResult;
      }
      throw new Error(`API 호출 타임아웃(5초). Mock 데이터가 설정되지 않았습니다.`);
    }
    
    // 네트워크 에러(TypeError: Failed to fetch)도 타임아웃과 동일하게 처리
    if (error instanceof TypeError && (error.message.includes('fetch') || error.message.includes('Failed to fetch'))) {
      if (mockFallback) {
        logMockCall(`네트워크 에러로 인한 Mock 폴백: ${endpoint}`, error.message);
        const fallbackResult = mockFallback();
        if (typeof fallbackResult === 'object' && fallbackResult !== null) {
          (fallbackResult as any)._isMockData = true;
        }
        return fallbackResult;
      }
      const apiError = analyzeError(error);
      throw new Error(apiError.message);
    }
    
    // 그 외 에러는 그대로 throw (400/404/409 등)
    throw error;
  }
}

// API Client
export const apiClient = {
  // Member APIs
  member: {
    register: (data: {
      email: string;
      password: string;
      dealer_name: string;
      phone: string;
      terms_agreed: boolean;
    }) => apiCall<{ success: boolean; member_id: string; message: string }>(
      'member/dealer/register',
      { method: 'POST', body: JSON.stringify(data) }
    ),

    verifyBusiness: async (businessRegistrationImage: File) => {
      const formData = new FormData();
      formData.append('business_registration_image', businessRegistrationImage);
      
      try {
        const response = await fetchWithTimeout(
          `${API_BASE_URL}/verifyBusinessAPI`,
          {
            method: 'POST',
            body: formData,
          },
          API_TIMEOUT
        );
        return response.json();
      } catch (error: any) {
        // 사업자 인증은 폴백 없음: 타임아웃/네트워크 에러도 그대로 throw
        if (error.message === 'API_TIMEOUT' || (error instanceof TypeError && error.message.includes('fetch'))) {
          const apiError = analyzeError(error);
          throw new Error(apiError.message || '사업자 인증 API 호출 실패. 네트워크 연결을 확인해주세요.');
        }
        throw error;
      }
    },
  },

  // Vehicle APIs
  vehicle: {
    ocrRegistration: async (file: File) => {
      const formData = new FormData();
      formData.append('registration_image', file);
      
      try {
        const response = await fetchWithTimeout(
          `${API_BASE_URL}/ocrRegistrationAPI`,
          {
            method: 'POST',
            body: formData,
          },
          API_TIMEOUT
        );

        if (!response.ok) {
          let errorData: any;
          try {
            errorData = await response.json();
          } catch {
            errorData = { message: response.statusText };
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
        }>;
      } catch (error: any) {
        // OCR은 폴백 없음: 타임아웃/네트워크 에러도 그대로 throw
        if (error.message === 'API_TIMEOUT' || (error instanceof TypeError && error.message.includes('fetch'))) {
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
        'inspectionRequestAPI',
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

  // Inspection APIs
  inspection: {
    assign: (inspectionId: string) => apiCall<{
      success: boolean;
      evaluator_id: string;
      message: string;
    }>(
      'inspectionAssignAPI',
      {
        method: 'POST',
        body: JSON.stringify({ inspection_id: inspectionId }),
      },
      undefined,
      () => mockResponses.assignEvaluator(inspectionId)
    ),

    uploadResult: async (inspectionId: string, data: {
      inspection_result: any;
      images: File[];
    }) => {
      const formData = new FormData();
      formData.append('inspection_id', inspectionId); // Body에 포함
      formData.append('inspection_result', JSON.stringify(data.inspection_result));
      data.images.forEach((img, idx) => {
        formData.append(`images[${idx}]`, img);
      });
      
      try {
        const response = await fetchWithTimeout(
          `${API_BASE_URL}/inspectionUploadResultAPI`,
          {
            method: 'POST',
            body: formData,
          },
          API_TIMEOUT
        );
        return response.json();
      } catch (error: any) {
        // 타임아웃 또는 네트워크 에러만 폴백
        if (error.message === 'API_TIMEOUT' || (error instanceof TypeError && error.message.includes('fetch'))) {
          logMockCall(`API 타임아웃/네트워크 에러로 인한 Mock 폴백: inspectionUploadResultAPI`, error.message);
          const fallbackResult = mockResponses.uploadInspectionResult(inspectionId);
          (fallbackResult as any)._isMockData = true;
          return fallbackResult;
        }
        throw error;
      }
    },

    getResult: (inspectionId: string) => apiCall<{
      success: boolean;
      result: any;
      inspection: any;
    }>(
      'inspectionGetResultAPI',
      { method: 'GET' },
      `?inspection_id=${encodeURIComponent(inspectionId)}`,
      () => mockResponses.getInspectionResult(inspectionId)
    ),
  },

  // Auction APIs
  auction: {
    bid: (auctionId: string, bidAmount: number) => apiCall<{
      success: boolean;
      message: string;
    }>(
      'bidAPI',
      {
        method: 'POST',
        body: JSON.stringify({ auction_id: auctionId, bid_amount: bidAmount }),
      }
    ),

    buyNow: (auctionId: string) => apiCall<{
      success: boolean;
      contract_id: string;
      message: string;
    }>(
      'buyNowAPI',
      { 
        method: 'POST',
        body: JSON.stringify({ auction_id: auctionId }),
      }
    ),
  },

  // Trade APIs
  trade: {
    changeSaleMethod: (vehicleId: string, auctionSettings: {
      start_price: number;
      buy_now_price?: number;
    }) => apiCall<{
      success: boolean;
      auction_id: string;
    }>(
      'changeSaleMethodAPI',
      {
        method: 'POST',
        body: JSON.stringify({ vehicle_id: vehicleId, auction_settings: auctionSettings }),
      }
    ),

    acceptProposal: (proposalId: string, action: 'accept' | 'reject') => apiCall<{
      success: boolean;
      message: string;
    }>(
      'acceptProposalAPI',
      {
        method: 'POST',
        body: JSON.stringify({ proposal_id: proposalId, action }),
      },
      undefined,
      () => mockResponses.acceptProposal(proposalId, action)
    ),

    confirmProposal: (proposalId: string, confirmed: boolean) => {
      // TODO: Firebase Functions v2 엔드포인트 구현 후 연결
      // 현재는 Mock 응답만 반환
      logMockCall(`confirmProposal 호출: proposalId=${proposalId}, confirmed=${confirmed}`);
      return Promise.resolve(mockResponses.confirmProposal(proposalId, confirmed));
    },
  },

  // Logistics APIs
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
      'logisticsScheduleAPI',
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
        'logisticsDispatchRequestAPI',
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
        'logisticsDispatchConfirmAPI',
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
      'handoverApproveAPI',
      {
        method: 'POST',
        body: JSON.stringify({ logistics_id: logisticsId, pin }),
      },
      undefined,
      () => mockResponses.approveHandover(logisticsId, pin)
    ),
  },

  // Settlement APIs
  settlement: {
    notify: (settlementId: string) => apiCall<{
      success: boolean;
      notification_id: string;
      message: string;
    }>(
      'settlementNotifyAPI',
      {
        method: 'POST',
        body: JSON.stringify({ settlement_id: settlementId }),
      },
      undefined,
      () => mockResponses.notifySettlement(settlementId)
    ),
  },

  // Report APIs
  report: {
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
      'saveReportAPI',
      { method: 'POST', body: JSON.stringify(data) }
    ),
  },
};

