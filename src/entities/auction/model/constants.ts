/**
 * Auction Entity Constants
 */

import type { AuctionStatus } from './types';

export const AUCTION_STATUS_LABELS: Record<AuctionStatus, string> = {
  Active: '진행 중',
  Ended: '종료',
  Sold: '판매 완료',
};

export const AUCTION_STATUS_COLORS: Record<AuctionStatus, string> = {
  Active: '#10B981',   // Green
  Ended: '#909090',    // Gray
  Sold: '#F97316',     // Orange
};

export const AUCTION_STATUS_TRANSITIONS: Record<AuctionStatus, AuctionStatus[]> = {
  Active: ['Ended', 'Sold'],
  Ended: [],
  Sold: [],
};

export const canTransitionTo = (
  currentStatus: AuctionStatus,
  nextStatus: AuctionStatus
): boolean => {
  return AUCTION_STATUS_TRANSITIONS[currentStatus].includes(nextStatus);
};
