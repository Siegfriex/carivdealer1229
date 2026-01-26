/**
 * VehicleStatusBadge Component
 * 차량 상태 배지
 */

import { StatusBadge } from '@/shared/ui/StatusBadge';
import {
  VEHICLE_STATUS_LABELS,
  VEHICLE_STATUS_COLORS,
} from '@/entities/vehicle/model/constants';
import type { VehicleStatus } from '@/entities/vehicle/model/types';

interface VehicleStatusBadgeProps {
  status: VehicleStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const VehicleStatusBadge = ({ status, size, className }: VehicleStatusBadgeProps) => {
  return (
    <StatusBadge
      label={VEHICLE_STATUS_LABELS[status]}
      color={VEHICLE_STATUS_COLORS[status]}
      size={size}
      className={className}
    />
  );
};
