/**
 * 차량 정보 카드 (상태·타임스탬프·가격·태그)
 * Figma 1194-7664, 1636-10115(전체 차량목록 그리드). variant: default | mainLanding, statusLabelOverride 지원.
 * - 구분선: border 사용 (Figma Line 에셋 미사용).
 * - 상태 점: rounded-full + VEHICLE_STATUS_COLORS_1636 색상 (Figma Ellipse 에셋 미사용).
 * - 에셋 URL: model/figma-assets.ts 상수로 두어 나중에 CDN/Storage URL로 교체 가능.
 */

import { Card } from '@/shared/ui/Card';
import { VehicleStatusBadge } from './VehicleStatusBadge';
import { StatusBadge } from '@/shared/ui/StatusBadge';
import { VEHICLE_STATUS_COLORS, VEHICLE_STATUS_COLORS_1636, TRADE_LIST_STATUS_LABELS } from '@/entities/vehicle/model/constants';
import type { Vehicle } from '@/entities/vehicle/model/types';
import type { VehicleStatus } from '@/entities/vehicle/model/types';

/** 차량 카드 props */
interface VehicleCardProps {
  vehicle: Vehicle;
  onClick?: () => void;
  className?: string;
  /** Figma 스타일: 타임스탬프, 신차가, 태그 표시. mainLanding 시 1636-10115 카드 스펙(314×291, 구분선, 배지 1년보증/단순교환무사고) */
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

/** Figma 1636-10115: 메인 랜딩 카드 배지 (1년보증, 단순교환무사고) */
const CARD_TAGS_1636 = ['1년보증', '단순교환무사고'];

/**
 * 차량 카드 렌더링
 * @description 상태 배지·타임스탬프·가격·태그 표시, 클릭 시 onClick 호출. mainLanding 시 Figma 1636-10115 레이아웃(314×291, 구분선, #eef5fe 이미지 영역, 상태 점 색상).
 */
export const VehicleCard = ({ vehicle, onClick, className = '', variant = 'default', statusLabelOverride }: VehicleCardProps) => {
  const isMainLanding = variant === 'mainLanding';
  const showRedDot = vehicle.status === 'bidding' || vehicle.status === 'inspection';
  const statusColor = VEHICLE_STATUS_COLORS[vehicle.status];
  const statusColor1636 = VEHICLE_STATUS_COLORS_1636[vehicle.status as VehicleStatus];
  const statusLabel1636 = statusLabelOverride ?? TRADE_LIST_STATUS_LABELS[vehicle.status as VehicleStatus];

  const mileageStr = vehicle.mileage ? `${(parseInt(vehicle.mileage, 10) / 10000).toFixed(1)}만 km` : '-- 만 km';
  const yearStr = vehicle.modelYear ? `${vehicle.modelYear}년형` : '---- 년형';
  const priceStr = vehicle.price ? `${parseInt(vehicle.price, 10).toLocaleString()}만원` : '--- 만원';
  const newCarPriceStr = vehicle.price ? `신차 ${(parseInt(vehicle.price, 10) * 1.53).toFixed(0)}만원` : '신차 —만원';

  if (isMainLanding) {
    return (
      <Card
        hover={!!onClick}
        onClick={onClick}
        padding="none"
        className={`w-[314px] min-h-[291px] max-w-[314px] rounded-[23.441px] overflow-hidden ${className}`}
        data-node-id="1636:10117"
      >
        {/* 이미지 영역 Figma 1636:10118 — 174px, #eef5fe */}
        <div className="relative h-[174px] w-full bg-[#eef5fe]" data-node-id="1636:10118">
          {vehicle.thumbnailUrl ? (
            <img
              src={vehicle.thumbnailUrl}
              alt={vehicle.modelName}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-caption">이미지 없음</div>
          )}
        </div>

        <div className="relative px-[23px] pt-[18px] pb-4">
          {/* 상태 행: 점(1636 Ellipse → rounded-full+색상), 라벨, 타임스탬프 */}
          <div className="flex items-center justify-between mb-[5px]" data-node-id="1636:10129">
            <div className="flex items-center gap-2">
              <span
                className="h-[6.63px] w-[6.63px] shrink-0 rounded-full"
                style={{ backgroundColor: statusColor1636 }}
                aria-hidden
                data-node-id="1636:10131"
              />
              <span
                className="text-[12px] font-semibold leading-[21.5px]"
                style={{ color: statusColor1636 }}
                data-node-id="1636:10130"
              >
                {statusLabel1636}
              </span>
            </div>
            {vehicle.updatedAt && (
              <span className="text-[10px] font-semibold" style={{ color: statusColor1636 }} data-node-id="1636:10119">
                {formatTime(vehicle.updatedAt)}
              </span>
            )}
          </div>

          {/* 구분선 Figma Line 80 — border로 구현 (에셋 URL 대체) */}
          <div className="w-full border-b border-gray-200 mb-[16px]" data-node-id="1636:10128" />

          {/* 모델명 */}
          <h3 className="text-[15.627px] font-bold leading-[18.75px] text-black mb-0.5" data-node-id="1636:10120">
            {vehicle.modelName}
          </h3>
          {/* 연식 · 주행거리 */}
          <p className="text-[7.814px] font-bold text-[#707070] leading-[18.75px] mb-1" data-node-id="1636:10121">
            {yearStr} · {mileageStr}
          </p>

          {/* 가격 #2048e5 + 신차가 rgba(0,0,0,0.3) */}
          <p className="text-[15.627px] font-extrabold leading-[18.75px] text-[#2048e5] mb-0.5" data-node-id="1636:10123">
            {priceStr}
          </p>
          <p className="text-[9.376px] font-bold leading-[18.75px] text-black/30 mb-3" data-node-id="1636:10122">
            {newCarPriceStr}
          </p>

          {/* 배지: 1년보증, 단순교환무사고 — Figma 1636:10124, 1636:10126 */}
          <div className="flex flex-wrap gap-1.5">
            {CARD_TAGS_1636.map((tag) => (
              <span
                key={tag}
                className="rounded-[2.859px] bg-[#f0f0f1] px-2 py-0.5 text-[7.623px] font-semibold text-[#404043] leading-tight"
                data-node-id={tag === '1년보증' ? '1636:10124' : '1636:10126'}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card hover={!!onClick} onClick={onClick} className={className}>
      <div className="flex items-center justify-between p-3 pb-0">
        <div className="flex items-center gap-2">
          {showRedDot && (
            <span className="w-2 h-2 rounded-full bg-error flex-shrink-0" aria-hidden />
          )}
          {statusLabelOverride != null ? (
            <StatusBadge label={statusLabelOverride} color={statusColor} size="sm" />
          ) : (
            <VehicleStatusBadge status={vehicle.status} size="sm" />
          )}
        </div>
        {vehicle.updatedAt && (
          <span className="text-caption text-gray-500">{formatTime(vehicle.updatedAt)}</span>
        )}
      </div>

      <div className="px-3 pt-2">
        {vehicle.thumbnailUrl ? (
          <img src={vehicle.thumbnailUrl} alt={vehicle.modelName} className="w-full h-40 object-cover rounded-md" />
        ) : (
          <div className="w-full h-40 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-body">
            이미지 없음
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-h4 font-bold text-gray-900 mb-1">{vehicle.modelName}</h3>
        <p className="text-body text-gray-600 mb-2">
          {vehicle.modelYear}년형 • {(parseInt(vehicle.mileage, 10) / 10000).toFixed(1)}만 km
        </p>
        <div className="mb-3">
          {vehicle.price && (
            <p className="text-h4 font-bold text-primary">
              {parseInt(vehicle.price, 10).toLocaleString()}만원
            </p>
          )}
          <p className="text-caption text-gray-500 mt-0.5">
            신차 {vehicle.price ? (parseInt(vehicle.price, 10) * 1.5).toLocaleString() : '—'}만원
          </p>
        </div>
        <p className="text-body text-gray-600">{vehicle.manufacturer}</p>
      </div>
    </Card>
  );
};
