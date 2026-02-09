/**
 * 거래 엔티티 상수 (상태 라벨·색상·전이 규칙)
 */

import type { TradeStatus } from './types';

/** 거래 상태 한글 라벨 */
export const TRADE_STATUS_LABELS: Record<TradeStatus, string> = {
  pending: '제안 대기 중',
  accepted: '제안 수락',
  rejected: '제안 거절',
  completed: '거래 완료',
};

export const TRADE_STATUS_COLORS: Record<TradeStatus, string> = {
  pending: '#F59E0B',   // Yellow
  accepted: '#10B981',  // Green
  rejected: '#EF4444',  // Red
  completed: '#14B8A6', // Teal
};

export const TRADE_STATUS_TRANSITIONS: Record<TradeStatus, TradeStatus[]> = {
  pending: ['accepted', 'rejected'],
  accepted: ['completed'],
  rejected: [],
  completed: [],
};

/**
 * 거래 상태 전이 가능 여부
 * @param currentStatus - 현재 거래 상태
 * @param nextStatus - 다음 상태
 * @returns 전이 가능하면 true
 */
export const canTransitionTo = (
  currentStatus: TradeStatus,
  nextStatus: TradeStatus
): boolean => {
  return TRADE_STATUS_TRANSITIONS[currentStatus].includes(nextStatus);
};
