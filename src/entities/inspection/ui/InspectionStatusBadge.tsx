/**
 * 검차 상태 배지
 * INSPECTION_STATUS_LABELS/COLORS로 라벨·색상 표시.
 */

import { StatusBadge } from '@/shared/ui/StatusBadge';
import {
  INSPECTION_STATUS_LABELS,
  INSPECTION_STATUS_COLORS,
} from '@/entities/inspection/model/constants';
import type { InspectionStatus } from '@/entities/inspection/model/types';

/** 검차 상태 배지 props */
interface InspectionStatusBadgeProps {
  status: InspectionStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/**
 * 검차 상태 배지 렌더링
 * @param props.status - 검차 상태
 * @param props.size - 배지 크기 (sm | md | lg)
 */
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
