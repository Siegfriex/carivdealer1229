/**
 * Mock 데이터 제공 유틸리티
 * 실제 API 호출 실패 시 폴백으로 사용
 */

// API 타임아웃 (밀리초)
export const API_TIMEOUT = 5000; // 5초

// Mock 응답 생성 함수들
export const mockResponses = {
  // Trade APIs
  acceptProposal: (proposalId: string, action: 'accept' | 'reject') => ({
    success: true,
    message: action === 'accept' ? '제안이 수락되었습니다.' : '제안이 거절되었습니다.',
  }),

  confirmProposal: (proposalId: string, confirmed: boolean) => ({
    success: true,
    message: confirmed ? '구매 의사가 확인되었습니다.' : '구매 의사 확인이 취소되었습니다.',
  }),

  // Logistics APIs
  scheduleLogistics: (data: {
    schedule_date: string;
    schedule_time: string;
    address: string;
    vehicle_id?: string;
    special_notes?: string;
  }) => ({
    success: true,
    logistics_id: `logistics-${Date.now()}`,
    message: '탁송 일정이 조율되었습니다.',
  }),

  requestDispatch: (logisticsId: string) => ({
    success: true,
    dispatch_id: `dispatch-${Date.now()}`,
    message: '배차 요청이 전송되었습니다.',
  }),

  confirmDispatch: (dispatchId: string) => ({
    success: true,
    message: '배차가 확정되었습니다.',
    driver_info: {
      name: '김택시',
      phone: '010-1234-5678',
    },
  }),

  approveHandover: (logisticsId: string, pin: string) => ({
    success: true,
    handover_timestamp: new Date().toISOString(),
    message: '인계 승인이 완료되었습니다.',
  }),

  // Settlement APIs
  notifySettlement: (settlementId: string) => ({
    success: true,
    notification_id: `notif-${Date.now()}`,
    message: '정산 완료 알림이 발송되었습니다.',
  }),

  // Inspection APIs
  assignEvaluator: (inspectionId: string) => ({
    success: true,
    evaluator_id: 'eval-001',
    message: '평가사가 배정되었습니다.',
  }),

  uploadInspectionResult: (inspectionId: string) => ({
    success: true,
    message: '검차 결과가 성공적으로 업로드되었습니다.',
  }),

  getInspectionResult: (inspectionId: string) => ({
    success: true,
    result: {
      summary: '전반적으로 양호하며, 일부 외관 스크래치 존재.',
      score: 85,
    },
    inspection: {
      id: inspectionId,
      status: 'completed',
      vehicleId: 'v-101',
      preferredDate: '2025-01-15',
      preferredTime: '14:00',
      evaluatorId: 'eval-001',
    },
  }),
};

