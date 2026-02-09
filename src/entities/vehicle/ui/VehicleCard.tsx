/**
 * 차량 정보 카드 (상태·타임스탬프·가격·태그)
 * Figma 1194-7664. variant: default | mainLanding, statusLabelOverride 지원.
 */

import { Card } from '@/shared/ui/Card';
import { VehicleStatusBadge } from './VehicleStatusBadge';
import { StatusBadge } from '@/shared/ui/StatusBadge';
import { VEHICLE_STATUS_COLORS } from '@/entities/vehicle/model/constants';
import type { Vehicle } from '@/entities/vehicle/model/types';

/** 차량 카드 props */
interface VehicleCardProps {
  vehicle: Vehicle;
  onClick?: () => void;
  className?: string;
  /** Figma 스타일: 타임스탬프, 신차가, 태그 표시 */
  variant?: 'default' | 'mainLanding';
  /** 거래 목록(§3.5 22630) 등에서 사용할 상태 라벨 오버라이드 */
  statusLabelOverride?: string;
}

function formatTime(ts: { toDate?: () => Date } | Date): string {
  try {
    const date = ts && typeof (ts as { toDate?: () => Date }).toDate === 'function'
      ? (ts as { toDate: () => Date }).toDate()
      : ts instanceof Date ? ts : new Date();
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false });
  } catch {
    return '--:--:--';
  }
}

const DEFAULT_TAGS = ['낙찰가', '단순교환부위', '기본정보', '성능점검'];

/**
 * 차량 카드 렌더링
 * @description 상태 배지·타임스탬프·가격·태그 표시, 클릭 시 onClick 호출
 * @param props.vehicle - 차량 엔티티
 * @param props.onClick - 카드 클릭 핸들러 (선택)
 * @param props.variant - default | mainLanding
 * @param props.statusLabelOverride - 상태 라벨 오버라이드 (선택)
 */
export const VehicleCard = ({ vehicle, onClick, className = '', variant = 'default', statusLabelOverride }: VehicleCardProps) => {
  const isMainLanding = variant === 'mainLanding';
  const showRedDot = vehicle.status === 'bidding' || vehicle.status === 'inspection';
  const statusColor = VEHICLE_STATUS_COLORS[vehicle.status];

  return (
    <Card hover={!!onClick} onClick={onClick} className={className}>
      {/* 상단: 상태(빨간 점) + 타임스탬프 (메인 랜딩 스타일) */}
      <div className="flex items-center justify-between p-3 pb-0">
        <div className="flex items-center gap-2">
          {isMainLanding && showRedDot && (
            <span className="w-2 h-2 rounded-full bg-error flex-shrink-0" aria-hidden />
          )}
          {statusLabelOverride != null ? (
            <StatusBadge label={statusLabelOverride} color={statusColor} size="sm" />
          ) : (
            <VehicleStatusBadge status={vehicle.status} size="sm" />
          )}
        </div>
        {isMainLanding && vehicle.updatedAt && (
          <span className="text-caption text-gray-500">
            {formatTime(vehicle.updatedAt)}
          </span>
        )}
      </div>

      {/* 썸네일 */}
      <div className="px-3 pt-2">
        {vehicle.thumbnailUrl ? (
          <img
            src={vehicle.thumbnailUrl}
            alt={vehicle.modelName}
            className="w-full h-40 object-cover rounded-md"
          />
        ) : (
          <div className="w-full h-40 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-body">
            이미지 없음
          </div>
        )}
      </div>

      <div className="p-4">
        {/* 모델명 */}
        <h3 className="text-h4 font-bold text-gray-900 mb-1">{vehicle.modelName}</h3>
        {/* 연식 • 주행거리 */}
        <p className="text-body text-gray-600 mb-2">
          {vehicle.modelYear}년형 • {(parseInt(vehicle.mileage, 10) / 10000).toFixed(1)}만 km
        </p>

        {/* 가격: 파란 굵게 + 신차가 회색 (메인 랜딩) */}
        <div className="mb-3">
          {vehicle.price && (
            <p className="text-h4 font-bold text-primary">
              {parseInt(vehicle.price, 10).toLocaleString()}만원
            </p>
          )}
          {isMainLanding && (
            <p className="text-caption text-gray-500 mt-0.5">
              신차 {vehicle.price ? (parseInt(vehicle.price, 10) * 1.5).toLocaleString() : '—'}만원
            </p>
          )}
        </div>

        {/* 태그 (메인 랜딩) */}
        {isMainLanding && (
          <div className="flex flex-wrap gap-1.5">
            {DEFAULT_TAGS.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 rounded-md text-caption text-gray-600 bg-gray-100"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* 기본 variant: 기존 레이아웃 보조 정보 */}
        {!isMainLanding && (
          <p className="text-body text-gray-600">{vehicle.manufacturer}</p>
        )}
      </div>
    </Card>
  );
};
