/**
 * Mock 데이터 제공 유틸리티
 * 실제 API 호출 실패(타임아웃·네트워크 오류) 시 apiClient에서 폴백으로 사용하는 응답 생성 함수 모음.
 */

/** Mock 관련 API 타임아웃 참조용 (밀리초) */
export const API_TIMEOUT = 5000;

/**
 * API별 Mock 응답 생성 함수 객체.
 * @description 거래·탁송·정산·검차·경매 등 각 엔드포인트에 대응하는 폴백 반환값 제공.
 */
export const mockResponses = {
  /** 제안 수락/거절 Mock */
  acceptProposal: (_proposalId: string, action: 'accept' | 'reject') => ({
    success: true,
    message: action === 'accept' ? '제안이 수락되었습니다.' : '제안이 거절되었습니다.',
  }),

  /** 제안 구매 의사 확인 Mock */
  confirmProposal: (_proposalId: string, confirmed: boolean) => ({
    success: true,
    message: confirmed ? '구매 의사가 확인되었습니다.' : '구매 의사 확인이 취소되었습니다.',
  }),

  /** 탁송 일정 등록 Mock */
  scheduleLogistics: (_data: {
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

  /** 배차 요청 Mock */
  requestDispatch: (_logisticsId: string) => ({
    success: true,
    dispatch_id: `dispatch-${Date.now()}`,
    message: '배차 요청이 전송되었습니다.',
  }),

  /** 배차 확정 Mock */
  confirmDispatch: (_dispatchId: string) => ({
    success: true,
    message: '배차가 확정되었습니다.',
    driver_info: {
      name: '김택시',
      phone: '010-1234-5678',
    },
  }),

  /** 인계 승인 Mock */
  approveHandover: (_logisticsId: string, _pin: string) => ({
    success: true,
    handover_timestamp: new Date().toISOString(),
    message: '인계 승인이 완료되었습니다.',
  }),

  /** 정산 알림 Mock */
  notifySettlement: (_settlementId: string) => ({
    success: true,
    notification_id: `notif-${Date.now()}`,
    message: '정산 완료 알림이 발송되었습니다.',
  }),

  /** 검차 평가사 배정 Mock */
  assignEvaluator: (_inspectionId: string) => ({
    success: true,
    evaluator_id: 'eval-001',
    message: '평가사가 배정되었습니다.',
  }),

  /** 검차 결과 업로드 Mock */
  uploadInspectionResult: (_inspectionId: string) => ({
    success: true,
    message: '검차 결과가 성공적으로 업로드되었습니다.',
  }),

  /** 검차 결과 조회 Mock */
  getInspectionResult: (_inspectionId: string) => ({
    success: true,
    result: {
      summary: '전반적으로 양호하며, 일부 외관 스크래치 존재.',
      score: 85,
    },
    inspection: {
      id: _inspectionId,
      status: 'completed',
      vehicleId: 'v-101',
      preferredDate: '2025-01-15',
      preferredTime: '14:00',
      evaluatorId: 'eval-001',
    },
  }),
  /** 경매 입찰·즉시구매 Mock (타임아웃/네트워크 오류 시 폴백) */
  auction: {
    /** 입찰 Mock */
    bid: (_auctionId: string, _bidAmount: number) => ({
      success: true,
      message: '입찰이 접수되었습니다.',
    }),
    /** 즉시구매 Mock */
    buyNow: (_auctionId: string) => ({
      success: true,
      contract_id: `contract-${Date.now()}`,
      message: '즉시구매가 완료되었습니다.',
    }),
  },
};
