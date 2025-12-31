/**
 * API 엔드포인트 중앙 관리
 * 프론트엔드-백엔드 엔드포인트 일관성 보장 (SSOT)
 * 
 * 이 파일은 Firebase Functions v2에서 export된 함수 이름과 일치해야 합니다.
 * Functions의 export 이름 변경 시 이 파일도 함께 업데이트해야 합니다.
 */

export const API_ENDPOINTS = {
  // Member APIs
  MEMBER: {
    // Mock API (향후 Firebase Functions로 구현 예정)
    REGISTER: 'member/dealer/register',
    // Firebase Functions v2
    VERIFY_BUSINESS: 'verifyBusinessAPI',
  },
  
  // Vehicle APIs
  VEHICLE: {
    OCR_REGISTRATION: 'ocrRegistrationAPI',
    INSPECTION_REQUEST: 'inspectionRequestAPI',
  },
  
  // Inspection APIs
  INSPECTION: {
    ASSIGN: 'inspectionAssignAPI',
    UPLOAD_RESULT: 'inspectionUploadResultAPI',
    GET_RESULT: 'inspectionGetResultAPI',
  },
  
  // Trade APIs
  TRADE: {
    CHANGE_SALE_METHOD: 'changeSaleMethodAPI',
    ACCEPT_PROPOSAL: 'acceptProposalAPI',
  },
  
  // Auction APIs
  AUCTION: {
    BID: 'bidAPI',
    BUY_NOW: 'buyNowAPI',
  },
  
  // Logistics APIs
  LOGISTICS: {
    SCHEDULE: 'logisticsScheduleAPI',
    DISPATCH_REQUEST: 'logisticsDispatchRequestAPI',
    DISPATCH_CONFIRM: 'logisticsDispatchConfirmAPI',
    HANDOVER_APPROVE: 'handoverApproveAPI',
  },
  
  // Settlement APIs
  SETTLEMENT: {
    NOTIFY: 'settlementNotifyAPI',
  },
  
  // Report APIs
  REPORT: {
    GENERATE: 'generateReportAPI',
    SAVE: 'saveReportAPI',
  },
  
  // Config APIs
  CONFIG: {
    GOOGLE_MAPS_API_KEY: 'getGoogleMapsApiKeyAPI',
  },
} as const;

/**
 * 모든 엔드포인트 타입 (타입 안전성 보장)
 */
export type ApiEndpoint = 
  | typeof API_ENDPOINTS.MEMBER[keyof typeof API_ENDPOINTS.MEMBER]
  | typeof API_ENDPOINTS.VEHICLE[keyof typeof API_ENDPOINTS.VEHICLE]
  | typeof API_ENDPOINTS.INSPECTION[keyof typeof API_ENDPOINTS.INSPECTION]
  | typeof API_ENDPOINTS.TRADE[keyof typeof API_ENDPOINTS.TRADE]
  | typeof API_ENDPOINTS.AUCTION[keyof typeof API_ENDPOINTS.AUCTION]
  | typeof API_ENDPOINTS.LOGISTICS[keyof typeof API_ENDPOINTS.LOGISTICS]
  | typeof API_ENDPOINTS.SETTLEMENT[keyof typeof API_ENDPOINTS.SETTLEMENT]
  | typeof API_ENDPOINTS.REPORT[keyof typeof API_ENDPOINTS.REPORT]
  | typeof API_ENDPOINTS.CONFIG[keyof typeof API_ENDPOINTS.CONFIG];

/**
 * 엔드포인트 유효성 검증 함수
 * @param endpoint 검증할 엔드포인트 문자열
 * @returns 유효한 엔드포인트인지 여부
 */
export function isValidEndpoint(endpoint: string): endpoint is ApiEndpoint {
  const allEndpoints = Object.values(API_ENDPOINTS).flatMap(category => 
    Object.values(category)
  );
  return allEndpoints.includes(endpoint as ApiEndpoint);
}

