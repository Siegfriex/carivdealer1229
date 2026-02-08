/**
 * AuctionStatusBadge Component
 * 경매 상태 배지
 */

import { StatusBadge } from '@/shared/ui/StatusBadge';
import {
  AUCTION_STATUS_LABELS,
  AUCTION_STATUS_COLORS,
} from '@/entities/auction/model/constants';
import type { AuctionStatus } from '@/entities/auction/model/types';

interface AuctionStatusBadgeProps {
  status: AuctionStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

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
