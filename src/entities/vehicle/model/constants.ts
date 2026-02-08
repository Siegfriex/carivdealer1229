/**
 * Vehicle Entity Constants
 * 
 * 참조: docs/DATABASE_ERD_SCHEMA.md
 */

import type { VehicleStatus, FuelType } from './types';

/**
 * 차량 상태 레이블 (한글)
 */
export const VEHICLE_STATUS_LABELS: Record<VehicleStatus, string> = {
  draft: '임시 저장',
  inspection: '검차 진행 중',
  bidding: '경매 진행 중',
  active_sale: '일반 판매',
  sold: '판매 완료',
  pending_settlement: '정산 대기',
  completed: '거래 완료',
};

/**
 * 거래 목록(§3.5 22630)용 상태 라벨
 */
export const TRADE_LIST_STATUS_LABELS: Record<VehicleStatus, string> = {
  draft: '검차신청 임시저장',
  inspection: '검차 진행중',
  bidding: '거래중',
  active_sale: '거래중',
  sold: '거래완료',
  pending_settlement: '정산중',
  completed: '등록됨',
};

/**
 * 차량 상태 색상
 */
export const VEHICLE_STATUS_COLORS: Record<VehicleStatus, string> = {
  draft: '#909090',               // Gray
  inspection: '#3B82F6',          // Blue
  bidding: '#8B5CF6',             // Purple
  active_sale: '#10B981',         // Green
  sold: '#F97316',                // Orange
  pending_settlement: '#F59E0B',  // Yellow
  completed: '#14B8A6',           // Teal
};

/**
 * 차량 상태 전이 규칙
 * key: 현재 상태 → value: 가능한 다음 상태들
 */
export const VEHICLE_STATUS_TRANSITIONS: Record<VehicleStatus, VehicleStatus[]> = {
  draft: ['inspection'],
  inspection: ['bidding', 'active_sale'],
  bidding: ['sold', 'active_sale'],
  active_sale: ['sold', 'bidding'],
  sold: ['pending_settlement'],
  pending_settlement: ['completed'],
  completed: [],
};

/**
 * 연료 종류 레이블 (영문)
 */
export const FUEL_TYPE_LABELS: Record<FuelType, string> = {
  가솔린: 'Gasoline',
  디젤: 'Diesel',
  하이브리드: 'Hybrid',
  전기: 'Electric',
};

/**
 * 차량번호 정규식
 */
export const PLATE_NUMBER_REGEX = /^\d{2}[가-힣]\s?\d{4}$/;

/**
 * VIN 정규식 (17자리)
 */
export const VIN_REGEX = /^[A-HJ-NPR-Z0-9]{17}$/;

/**
 * 상태 전이 검증 함수
 */
export const canTransitionTo = (
  currentStatus: VehicleStatus,
  nextStatus: VehicleStatus
): boolean => {
  return VEHICLE_STATUS_TRANSITIONS[currentStatus].includes(nextStatus);
};
