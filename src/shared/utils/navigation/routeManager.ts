/**
 * 차량 상태 기반 라우팅 — 전 플로우 이동 연동
 * VehicleListPage/TradeListPage 카드·리스트 클릭 시 상태별 올바른 상세 페이지로 이동
 * @see docs/CarivDealer_VID.md §5 routeManager
 */

/** 미매칭 경로 폴백. router.tsx path="*"와 동기화 */
export const FALLBACK_ROUTE = '/vehicles';

/** vehicleId → inspectionId (draft, inspection 상태 시 검차 진행 페이지) */
export const MOCK_VEHICLE_TO_INSPECTION: Record<string, string> = {
  'v-1': 'insp-1',  // draft 아반떼
  'v-2': 'insp-2',  // inspection 카니발
};

/** vehicleId → settlementId (pending_settlement, completed 시 정산 상세) */
export const MOCK_VEHICLE_TO_SETTLEMENT: Record<string, string> = {
  'v-t6': 'settle-003',  // pending_settlement K5
  'v-t7': 'settle-001',  // completed 투싼 (정산완료 가정)
};

const ROUTE_BY_STATUS: Record<string, (vehicleId: string) => string> = {
  draft: (vehicleId) => {
    const inspectionId = MOCK_VEHICLE_TO_INSPECTION[vehicleId];
    return inspectionId ? `/inspections/${inspectionId}/progress` : `/inspections/request?vehicleId=${vehicleId}`;
  },
  inspection: (vehicleId) => {
    const inspectionId = MOCK_VEHICLE_TO_INSPECTION[vehicleId];
    return inspectionId ? `/inspections/${inspectionId}/progress` : `/inspections/request?vehicleId=${vehicleId}`;
  },
  active_sale: (vehicleId) => `/vehicles/${vehicleId}/trade`,
  bidding: (vehicleId) => `/vehicles/${vehicleId}/auction`,
  sold: (vehicleId) => `/logistics/schedule?vehicleId=${vehicleId}`,
  pending_settlement: (vehicleId) => {
    const settlementId = MOCK_VEHICLE_TO_SETTLEMENT[vehicleId];
    return settlementId ? `/settlements/${settlementId}` : `/settlements`;
  },
  completed: (vehicleId) => {
    const settlementId = MOCK_VEHICLE_TO_SETTLEMENT[vehicleId];
    return settlementId ? `/settlements/${settlementId}` : `/vehicles/${vehicleId}`;
  },
};

/**
 * 차량 상태에 따른 상세 페이지 경로
 * @param vehicleId - 차량 ID
 * @param status - 차량 상태 (draft, inspection, active_sale, bidding, sold, pending_settlement, completed 등)
 * @returns 상태에 맞는 경로. status가 null/undefined/빈 문자열/미등록 시 `/vehicles/${vehicleId}` 폴백.
 *          vehicleId가 빈 문자열 또는 잘못된 형식 시 FALLBACK_ROUTE 반환.
 */
export function getVehicleDetailRoute(
  vehicleId: string,
  status: string
): string {
  // vehicleId 예외 처리: 빈 문자열 또는 잘못된 형식
  if (typeof vehicleId !== 'string' || !vehicleId.trim()) {
    return FALLBACK_ROUTE;
  }
  const trimmedId = vehicleId.trim();

  // status 예외 처리: null, undefined, 빈 문자열, 미등록 상태
  const s = (status ?? '').trim();
  if (!s) {
    return `/vehicles/${trimmedId}`;
  }

  const handler = ROUTE_BY_STATUS[s];
  if (handler) return handler(trimmedId);
  return `/vehicles/${trimmedId}`;
}
