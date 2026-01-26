/**
 * InspectionStatusBadge Component
 * 검차 상태 배지
 */

import { StatusBadge } from '@/shared/ui/StatusBadge';
import {
  INSPECTION_STATUS_LABELS,
  INSPECTION_STATUS_COLORS,
} from '@/entities/inspection/model/constants';
import type { InspectionStatus } from '@/entities/inspection/model/types';

interface InspectionStatusBadgeProps {
  status: InspectionStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const InspectionStatusBadge = ({
  status,
  size,
  className,
}: InspectionStatusBadgeProps) => {
  return (
    <StatusBadge
      label={INSPECTION_STATUS_LABELS[status]}
      color={INSPECTION_STATUS_COLORS[status]}
      size={size}
      className={className}
    />
  );
};
