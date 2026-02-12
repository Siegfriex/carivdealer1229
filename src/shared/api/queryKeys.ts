/**
 * Query Key Factory
 * TanStack Query 캐시 키 중앙 관리. STATE_MANAGEMENT_POLICY P2.
 *
 * @description 리터럴 하드코딩 제거, invalidation 일관성 확보.
 * @see docs/STATE_MANAGEMENT_POLICY.md §7 P2, §8.1
 */

/** 차량 */
export const vehicleKeys = {
  all: ['vehicles'] as const,
  lists: () => [...vehicleKeys.all, 'list'] as const,
  list: (ownerId?: string, status?: unknown) => [...vehicleKeys.all, ownerId, status] as const,
  details: () => [...vehicleKeys.all, 'detail'] as const,
  detail: (id: string | undefined) => [...vehicleKeys.details(), id] as const,
};

/** 검차 */
export const inspectionKeys = {
  all: ['inspections'] as const,
  lists: () => [...inspectionKeys.all, 'list'] as const,
  list: (vehicleId?: string, evaluatorId?: string, status?: string) =>
    [...inspectionKeys.all, vehicleId, evaluatorId, status] as const,
};

/** 경매 */
export const auctionKeys = {
  all: ['auction'] as const,
  detail: (vehicleId: string) => [...auctionKeys.all, vehicleId] as const,
  /** useBid/useBuyNow invalidation용 */
  auctions: ['auctions'] as const,
};

/** 정산 */
export const settlementKeys = {
  all: ['settlements'] as const,
  lists: () => [...settlementKeys.all, 'list'] as const,
  list: (filter?: string) => [...settlementKeys.all, filter] as const,
  detail: (id: string | undefined) => [...settlementKeys.all, id] as const,
};

/** 탁송 */
export const logisticsKeys = {
  all: ['logistics'] as const,
  schedule: () => [...logisticsKeys.all, 'schedule'] as const,
  history: () => [...logisticsKeys.all, 'history'] as const,
};

/** 매출 */
export const saleKeys = {
  all: ['sales'] as const,
  history: () => [...saleKeys.all, 'history'] as const,
};
