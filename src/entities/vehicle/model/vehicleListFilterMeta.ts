/**
 * 나의 매물목록 사이드바 필터 ↔ VehicleStatus 엔티티 매핑
 * MainLandingSidebar(전체·차량상태·판매거래·탁송·정산) ↔ VehicleListPage statusFilter
 * @see MainLandingSidebar LIST_ITEMS
 * @see VehicleListPage statusFilter
 */

import type { VehicleStatus } from './types';

/** 사이드바 필터 키 (MainLandingSidebar) */
export type VehicleListFilterKey = 'all' | 'status' | 'sale' | 'logistics' | 'settlement';

/** 필터 키 → VehicleStatus[] 매핑 */
export const VEHICLE_LIST_FILTER_TO_STATUS: Record<
  Exclude<VehicleListFilterKey, 'all'>,
  VehicleStatus[]
> = {
  /** 차량 상태: 전체 상태 표시 (상세 하위필터는 별도) */
  status: ['draft', 'inspection', 'active_sale', 'bidding', 'sold', 'pending_settlement', 'completed'],
  /** 판매/거래 단계 */
  sale: ['active_sale', 'bidding'],
  /** 탁송 단계 */
  logistics: ['sold'],
  /** 정산 */
  settlement: ['pending_settlement', 'completed'],
};

/** 탭(전체/임시저장/등록완료) → statusFilter */
export const VEHICLE_LIST_TAB_TO_STATUS: Record<string, VehicleStatus[] | undefined> = {
  all: undefined,
  draft: ['draft'],
  completed: ['completed', 'active_sale', 'sold'],
};
