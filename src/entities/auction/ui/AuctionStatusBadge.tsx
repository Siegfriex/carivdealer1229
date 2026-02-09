/**
 * 경매 상태 배지
 * AUCTION_STATUS_LABELS/COLORS로 라벨·색상 표시.
 */

import { StatusBadge } from '@/shared/ui/StatusBadge';
import {
  AUCTION_STATUS_LABELS,
  AUCTION_STATUS_COLORS,
} from '@/entities/auction/model/constants';
import type { AuctionStatus } from '@/entities/auction/model/types';

/** 경매 상태 배지 props */
interface AuctionStatusBadgeProps {
  status: AuctionStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * 경매 상태 배지 렌더링
 * @param props.status - 경매 상태
 * @param props.size - 배지 크기 (sm | md | lg)
 */
export const AuctionStatusBadge = ({ status, size, className }: AuctionStatusBadgeProps) => {
  return (
    <StatusBadge
      label={AUCTION_STATUS_LABELS[status]}
      color={AUCTION_STATUS_COLORS[status]}
      size={size}
      className={className}
    />
  );
};
