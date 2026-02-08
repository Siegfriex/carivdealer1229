/**
 * Trade Entity Constants
 */

import type { TradeStatus } from './types';

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

export const canTransitionTo = (
  currentStatus: TradeStatus,
  nextStatus: TradeStatus
): boolean => {
  return TRADE_STATUS_TRANSITIONS[currentStatus].includes(nextStatus);
};
