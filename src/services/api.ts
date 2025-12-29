// API Base URL - Firebase Functions v2 endpoint
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 
  'https://asia-northeast3-carivdealer.cloudfunctions.net';

// 개발 환경에서만 로그 출력
const isDev = import.meta.env.DEV;
const logMockCall = (message: string, ...args: any[]) => {
  if (isDev) {
    console.warn(`[프로토타입] ${message}`, ...args);
  }
};

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}/${endpoint}`;
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `API call failed: ${response.statusText}`);
  }

  return response.json();
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

    verifyBusiness: (businessRegistrationImage: File) => {
      const formData = new FormData();
      formData.append('business_registration_image', businessRegistrationImage);
      return fetch(`${API_BASE_URL}/verifyBusinessAPI`, {
        method: 'POST',
        body: formData,
      }).then(res => res.json());
    },
  },

  // Vehicle APIs
  vehicle: {
    ocrRegistration: (carNo: string) => apiCall<{
      vin: string;
      manufacturer: string;
      model: string;
      year: string;
      mileage: string;
    }>(
      'ocrRegistrationAPI',
      {
        method: 'POST',
        body: JSON.stringify({ car_no: carNo }),
      }
    ),

    inspection: {
      request: (vehicleId: string, data: {
        preferred_date: string;
        preferred_time: string;
      }) => apiCall<{ success: boolean; inspection_id: string; message: string }>(
        'inspectionRequestAPI',
        {
          method: 'POST',
          body: JSON.stringify({ vehicle_id: vehicleId, ...data }),
        }
      ),
    },
  },

  // Inspection APIs
  inspection: {
    assign: (inspectionId: string) => apiCall<{
      success: boolean;
      inspector_id: string;
      assigned_at: string;
      message: string;
    }>(
      `inspection/${inspectionId}/assign`,
      { method: 'POST' }
    ),

    uploadResult: (inspectionId: string, data: {
      inspection_result: any;
      images: File[];
    }) => {
      const formData = new FormData();
      formData.append('inspection_result', JSON.stringify(data.inspection_result));
      data.images.forEach((img, idx) => {
        formData.append(`images[${idx}]`, img);
      });
      return fetch(`${API_BASE_URL}/inspection/${inspectionId}/result`, {
        method: 'POST',
        body: formData,
      }).then(res => res.json());
    },
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

    acceptProposal: async (proposalId: string, action: 'accept' | 'reject') => {
      // TODO: Firebase Functions v2 엔드포인트 구현 후 연결
      // 현재는 Mock 응답 반환 (프로토타입 단계)
      logMockCall(`acceptProposal 호출: proposalId=${proposalId}, action=${action}`);
      return Promise.resolve({
        success: true,
        message: action === 'accept' ? '제안이 수락되었습니다.' : '제안이 거절되었습니다.',
      });
      
      // 실제 API 연결 시 아래 코드 사용:
      // return apiCall<{
      //   success: boolean;
      //   message: string;
      // }>(
      //   'acceptProposalAPI', // Functions v2 엔드포인트명
      //   {
      //     method: 'POST',
      //     body: JSON.stringify({ proposal_id: proposalId, action }),
      //   }
      // );
    },

    confirmProposal: async (proposalId: string, confirmed: boolean) => {
      // TODO: Firebase Functions v2 엔드포인트 구현 후 연결
      logMockCall(`confirmProposal 호출: proposalId=${proposalId}, confirmed=${confirmed}`);
      return Promise.resolve({
        success: true,
        message: confirmed ? '구매 의사가 확인되었습니다.' : '구매 의사 확인이 취소되었습니다.',
      });
    },
  },

  // Logistics APIs
  logistics: {
    schedule: async (data: {
      schedule_date: string;
      schedule_time: string;
      address: string;
    }) => {
      // TODO: Firebase Functions v2 엔드포인트 구현 후 연결
      logMockCall(`scheduleLogistics 호출:`, data);
      return Promise.resolve({
        success: true,
        schedule_id: `schedule-${Date.now()}`,
      });
    },

    dispatch: {
      request: async (scheduleId: string) => {
        // TODO: Firebase Functions v2 엔드포인트 구현 후 연결
        logMockCall(`dispatchLogistics 호출: scheduleId=${scheduleId}`);
        return Promise.resolve({
          success: true,
          dispatch_id: `dispatch-${Date.now()}`,
        });
      },

      confirm: async (dispatchId: string) => {
        // TODO: Firebase Functions v2 엔드포인트 구현 후 연결
        logMockCall(`confirmDispatch 호출: dispatchId=${dispatchId}`);
        return Promise.resolve({
          success: true,
          driver_info: {
            name: '김택시',
            phone: '010-1234-5678',
          },
        });
      },
    },

    approveHandover: async (logisticsId: string, pin: string) => {
      // TODO: Firebase Functions v2 엔드포인트 구현 후 연결
      // 현재는 Mock 응답 반환 (프로토타입 단계)
      logMockCall(`approveHandover 호출: logisticsId=${logisticsId}, pin=${pin.substring(0, 1)}***`);
      return Promise.resolve({
        success: true,
        handover_timestamp: new Date().toISOString(),
      });
      
      // 실제 API 연결 시 아래 코드 사용:
      // return apiCall<{
      //   success: boolean;
      //   handover_timestamp: string;
      // }>(
      //   'handoverApproveAPI', // Functions v2 엔드포인트명
      //   {
      //     method: 'POST',
      //     body: JSON.stringify({ logistics_id: logisticsId, pin }),
      //   }
      // );
    },
  },

  // Settlement APIs
  settlement: {
    notify: async (settlementId: string) => {
      // TODO: Firebase Functions v2 엔드포인트 구현 후 연결
      logMockCall(`notifySettlement 호출: settlementId=${settlementId}`);
      return Promise.resolve({
        success: true,
        notification_id: `notif-${Date.now()}`,
      });
    },
  },
};

