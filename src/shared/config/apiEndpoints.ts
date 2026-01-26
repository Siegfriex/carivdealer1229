/**
 * API Endpoints
 * Firebase Functions 엔드포인트 정의
 */

export const API_ENDPOINTS = {
  // Member
  VERIFY_BUSINESS: '/verifyBusinessAPI',
  
  // Vehicle
  OCR_REGISTRATION: '/ocrRegistrationAPI',
  GET_VEHICLE_STATISTICS: '/getVehicleStatisticsAPI',
  
  // Inspection
  INSPECTION_REQUEST: '/inspectionRequestAPI',
  ASSIGN_EVALUATOR: '/assignEvaluatorAPI',
  GET_INSPECTION_RESULT: '/getInspectionResultAPI',
  UPLOAD_INSPECTION_RESULT: '/uploadInspectionResultAPI',
  
  // Auction
  BID: '/bidAPI',
  BUY_NOW: '/buyNowAPI',
  
  // Trade
  CHANGE_SALE_METHOD: '/changeSaleMethodAPI',
  ACCEPT_PROPOSAL: '/acceptProposalAPI',
  MANAGE_PROPOSAL_TTL: '/manageProposalTTLAPI',
  
  // Logistics
  SCHEDULE_LOGISTICS: '/scheduleLogisticsAPI',
  DISPATCH_LOGISTICS: '/dispatchLogisticsAPI',
  HANDOVER_LOGISTICS: '/handoverLogisticsAPI',
  
  // Settlement
  NOTIFY_SETTLEMENT: '/notifySettlementAPI',
  
  // Report
  GENERATE_REPORT: '/generateReportAPI',
  SAVE_REPORT: '/saveReportAPI',
} as const;

export type ApiEndpoint = (typeof API_ENDPOINTS)[keyof typeof API_ENDPOINTS];
