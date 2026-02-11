/**
 * 차량 상태 배지
 * VEHICLE_STATUS_LABELS/COLORS로 라벨·색상 표시.
 */

import { StatusBadge } from '@/shared/ui/StatusBadge';
import {
  VEHICLE_STATUS_LABELS,
  VEHICLE_STATUS_COLORS,
} from '@/entities/vehicle/model/constants';
import type { VehicleStatus } from '@/entities/vehicle/model/types';

/** 차량 상태 배지 props */
interface VehicleStatusBadgeProps {
  status: VehicleStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  /** 거래 목록 등에서 사용할 라벨 오버라이드 */
  label?: string;
}

/**
 * 차량 상태 배지 렌더링
 * @param props.status - 차량 상태
 * @param props.size - 배지 크기 (sm | md | lg)
 * @param props.label - 라벨 오버라이드 (예: 거래 목록용)
 */
export const VehicleStatusBadge = ({ status, size, className, label }: VehicleStatusBadgeProps) => {
  return (
    <StatusBadge
      label={label ?? VEHICLE_STATUS_LABELS[status]}
      color={VEHICLE_STATUS_COLORS[status]}
      size={size}
      className={className}
    />
  );
};
