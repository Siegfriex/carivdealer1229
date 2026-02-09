/**
 * API 엔드포인트 중앙 관리 (SSOT)
 * 프론트엔드-백엔드 엔드포인트 일관성 보장. Firebase Functions v2 export 함수명과 일치해야 함.
 * 참조: docs/CarivDealer_api_v1.md
 */

/** 회원·차량·검차·거래·경매·탁송·정산·리포트·설정·주문·결제·주소·리뷰·딜러서류 엔드포인트 상수 */
export const API_ENDPOINTS = {
  /** 회원 가입·사업자 인증 */
  MEMBER: {
    REGISTER: 'member/dealer/register',
    VERIFY_BUSINESS: 'verifyBusinessAPI',
  },

  /** 차량 OCR·검차 신청·통계 */
  VEHICLE: {
    OCR_REGISTRATION: 'ocrRegistrationAPI',
    INSPECTION_REQUEST: 'inspectionRequestAPI',
    GET_STATISTICS: 'getVehicleStatisticsAPI',
  },

  /** 검차 배정·결과 업로드/조회 */
  INSPECTION: {
    ASSIGN: 'inspectionAssignAPI',
    UPLOAD_RESULT: 'inspectionUploadResultAPI',
    GET_RESULT: 'inspectionGetResultAPI',
    ASSIGN_EVALUATOR: 'assignEvaluatorAPI',
  },

  /** 거래(판매방식·제안 수락·TTL) */
  TRADE: {
    CHANGE_SALE_METHOD: 'changeSaleMethodAPI',
    ACCEPT_PROPOSAL: 'acceptProposalAPI',
    MANAGE_PROPOSAL_TTL: 'manageProposalTTLAPI',
  },

  /** 경매 입찰·즉시구매 */
  AUCTION: {
    BID: 'bidAPI',
    BUY_NOW: 'buyNowAPI',
  },

  /** 탁송 예약·배차·인계 승인 */
  LOGISTICS: {
    SCHEDULE: 'logisticsScheduleAPI',
    DISPATCH_REQUEST: 'logisticsDispatchRequestAPI',
    DISPATCH_CONFIRM: 'logisticsDispatchConfirmAPI',
    HANDOVER_APPROVE: 'handoverApproveAPI',
  },

  /** 정산 알림 */
  SETTLEMENT: {
    NOTIFY: 'settlementNotifyAPI',
  },

  /** 차량 상태 리포트 생성·저장 */
  REPORT: {
    GENERATE: 'generateReportAPI',
    SAVE: 'saveReportAPI',
  },

  /** 설정(Google Maps API 키 등) */
  CONFIG: {
    GOOGLE_MAPS_API_KEY: 'getGoogleMapsApiKeyAPI',
  },

  /** 주문 생성·조회·상태 변경 (Phase 1.3) */
  ORDER: {
    CREATE: 'createOrderAPI',
    GET: 'getOrderAPI',
    UPDATE_STATUS: 'updateOrderStatusAPI',
  },

  /** 결제 생성·조회·환불 (Phase 1.3) */
  PAYMENT: {
    CREATE: 'createPaymentAPI',
    GET: 'getPaymentAPI',
    REFUND: 'refundPaymentAPI',
  },

  /** 주소 CRUD (Phase 2.2) */
  ADDRESS: {
    CREATE: 'createAddressAPI',
    GET: 'getAddressAPI',
    LIST: 'listAddressesAPI',
    UPDATE: 'updateAddressAPI',
    DELETE: 'deleteAddressAPI',
  },

  /** 리뷰 작성·목록 (Phase 3.1) */
  REVIEW: {
    CREATE: 'createReviewAPI',
    LIST: 'listReviewsAPI',
  },

  /** 딜러 서류 업로드·승인·목록 (Phase 3.2) */
  SELLER_DOCS: {
    UPLOAD: 'uploadDocAPI',
    APPROVE: 'approveDocAPI',
    LIST: 'listDocsAPI',
  },
} as const;

/** API_ENDPOINTS에 정의된 모든 엔드포인트 경로 문자열 유니온 타입 (타입 안전성 보장) */
export type ApiEndpoint =
  | typeof API_ENDPOINTS.MEMBER[keyof typeof API_ENDPOINTS.MEMBER]
  | typeof API_ENDPOINTS.VEHICLE[keyof typeof API_ENDPOINTS.VEHICLE]
  | typeof API_ENDPOINTS.INSPECTION[keyof typeof API_ENDPOINTS.INSPECTION]
  | typeof API_ENDPOINTS.TRADE[keyof typeof API_ENDPOINTS.TRADE]
  | typeof API_ENDPOINTS.AUCTION[keyof typeof API_ENDPOINTS.AUCTION]
  | typeof API_ENDPOINTS.LOGISTICS[keyof typeof API_ENDPOINTS.LOGISTICS]
  | typeof API_ENDPOINTS.SETTLEMENT[keyof typeof API_ENDPOINTS.SETTLEMENT]
  | typeof API_ENDPOINTS.REPORT[keyof typeof API_ENDPOINTS.REPORT]
  | typeof API_ENDPOINTS.CONFIG[keyof typeof API_ENDPOINTS.CONFIG]
  | typeof API_ENDPOINTS.ORDER[keyof typeof API_ENDPOINTS.ORDER]
  | typeof API_ENDPOINTS.PAYMENT[keyof typeof API_ENDPOINTS.PAYMENT]
  | typeof API_ENDPOINTS.ADDRESS[keyof typeof API_ENDPOINTS.ADDRESS]
  | typeof API_ENDPOINTS.REVIEW[keyof typeof API_ENDPOINTS.REVIEW]
  | typeof API_ENDPOINTS.SELLER_DOCS[keyof typeof API_ENDPOINTS.SELLER_DOCS];

/**
 * 문자열이 정의된 API 엔드포인트인지 검증.
 * @param endpoint - 검사할 경로 문자열
 * @returns ApiEndpoint이면 true
 */
export function isValidEndpoint(endpoint: string): endpoint is ApiEndpoint {
  const allEndpoints = Object.values(API_ENDPOINTS).flatMap(category =>
    Object.values(category)
  );
  return allEndpoints.includes(endpoint as ApiEndpoint);
}
