/**
 * 목업 차량·검차·정산 ID 매핑 — 전 플로우 이동 연동
 * VehicleListPage/TradeListPage 카드·리스트 클릭 시 상태별 올바른 상세 페이지로 이동
 */

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

/**
 * 차량 상태에 따른 상세 페이지 경로
 */
export function getVehicleDetailRoute(
  vehicleId: string,
  status: string
): string {
  const s = status as keyof typeof ROUTE_BY_STATUS;
  const handler = ROUTE_BY_STATUS[s];
  if (handler) return handler(vehicleId);
  return `/vehicles/${vehicleId}`;
}

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
