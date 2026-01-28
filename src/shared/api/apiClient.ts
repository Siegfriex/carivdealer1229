import { mockResponses } from './mockData';
import { analyzeError } from '@/shared/lib/errorHandler';
import { API_ENDPOINTS } from '@/shared/config/apiEndpoints';

// API Base URL - Firebase Functions v2 endpoint
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ||
  'https://asia-northeast3-carivdealer.cloudfunctions.net';

// API 타임아웃 (밀리초)
const API_TIMEOUT = 30000; // 일반 API: 30초
const OCR_TIMEOUT = 90000; // OCR 전용: 90초 (이미지 처리 시간이 오래 걸릴 수 있음)

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
    if (error.message === 'API_TIMEOUT') {
      if (mockFallback) {
        logMockCall(`API 타임아웃(5초)로 인한 Mock 폴백: ${endpoint}`, error.message);
        const fallbackResult = mockFallback();
        if (typeof fallbackResult === 'object' && fallbackResult !== null) {
          (fallbackResult as any)._isMockData = true;
        }
        return fallbackResult;
      }
      throw new Error(`API 호출 타임아웃(5초). Mock 데이터가 설정되지 않았습니다.`);
    }

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
      } catch (error: any) {
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
          `${API_BASE_URL}/${API_ENDPOINTS.VEHICLE.OCR_REGISTRATION}`,
          {
            method: 'POST',
            body: formData,
          },
          OCR_TIMEOUT
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
          publicDataSuccess?: boolean;
          publicDataError?: string | null;
        }>;
      } catch (error: any) {
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

  // Inspection APIs
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
      inspection_result: any;
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
      } catch (error: any) {
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
      API_ENDPOINTS.INSPECTION.GET_RESULT,
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
      API_ENDPOINTS.AUCTION.BID,
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
      API_ENDPOINTS.AUCTION.BUY_NOW,
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

  // Settlement APIs
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

  // Report APIs
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

  // Config APIs
  config: {
    getGoogleMapsApiKey: () => apiCall<{ success: boolean; apiKey: string }>(
      API_ENDPOINTS.CONFIG.GOOGLE_MAPS_API_KEY,
      { method: 'GET' }
    ),
  },

  // Generic methods for direct API calls
  post: <T = unknown>(endpoint: string, data?: unknown): Promise<T> =>
    apiCall<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    }),

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
