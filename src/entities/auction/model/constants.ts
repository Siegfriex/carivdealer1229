/**
 * 경매 엔티티 상수 (상태 라벨·색상·전이 규칙)
 */

import type { AuctionStatus } from './types';

/** 경매 상태 한글 라벨 */
export const AUCTION_STATUS_LABELS: Record<AuctionStatus, string> = {
  Active: '진행 중',
  Ended: '종료',
  Sold: '판매 완료',
};

/** 경매 상태별 색상 */
export const AUCTION_STATUS_COLORS: Record<AuctionStatus, string> = {
  Active: '#10B981',   // Green
  Ended: '#909090',    // Gray
  Sold: '#F97316',     // Orange
};

/** 경매 상태 전이: 현재 상태 → 가능한 다음 상태 목록 */
export const AUCTION_STATUS_TRANSITIONS: Record<AuctionStatus, AuctionStatus[]> = {
  Active: ['Ended', 'Sold'],
  Ended: [],
  Sold: [],
};

/**
 * 경매 상태 전이 가능 여부
 * @param currentStatus - 현재 경매 상태
 * @param nextStatus - 다음 상태
 * @returns 전이 가능하면 true
 */
export const canTransitionTo = (
  currentStatus: AuctionStatus,
  nextStatus: AuctionStatus
): boolean => {
  return AUCTION_STATUS_TRANSITIONS[currentStatus].includes(nextStatus);
};
