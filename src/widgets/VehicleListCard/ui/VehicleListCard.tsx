/**
 * 차량 목록 카드 1건. 검차 InspectionListCard·탁송 카드와 동일한 구조 — GNB_CARD_WRAPPER + GNB_CARD 내부에 이미지홀더(첫 자식) + 콘텐츠.
 * Figma 1636-10115, 1714-22323. 314×291, 3컬럼 그리드용.
 */

import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { ImageWithFallback } from '@/shared/ui/ImageWithFallback';
import { VEHICLE_STATUS_COLORS_1636, VEHICLE_STATUS_LABELS } from '@/entities/vehicle/model/constants';
import type { Vehicle } from '@/entities/vehicle/model/types';
import type { VehicleStatus } from '@/entities/vehicle/model/types';

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

const CARD_TAGS = ['1년보증', '단순교환무사고'];

export interface VehicleListCardProps {
  vehicle: Vehicle;
  onClick?: () => void;
  /** 거래 목록 등에서 사용할 상태 라벨 오버라이드 */
  statusLabelOverride?: string;
}

export const VehicleListCard = ({
  vehicle,
  onClick,
  statusLabelOverride,
}: VehicleListCardProps) => {
  const statusColor1636 = VEHICLE_STATUS_COLORS_1636[vehicle.status as VehicleStatus];
  const mileageStr = vehicle.mileage ? `${(parseInt(vehicle.mileage, 10) / 10000).toFixed(1)}만 km` : '-- 만 km';
  const yearStr = vehicle.modelYear ? `${vehicle.modelYear}년형` : '---- 년형';
  const priceStr = vehicle.price ? `${parseInt(vehicle.price, 10).toLocaleString()}만원` : '--- 만원';
  const newCarPriceStr = vehicle.price ? `신차 ${(parseInt(vehicle.price, 10) * 1.53).toFixed(0)}만원` : '신차 —만원';

  const statusLabel = statusLabelOverride ?? VEHICLE_STATUS_LABELS[vehicle.status as VehicleStatus];

  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onClick(); } } : undefined}
      className={`text-left bg-white ${LAYOUT_CLASSES.GNB_CARD_WRAPPER} ${LAYOUT_CLASSES.GNB_CARD} overflow-hidden w-full border-2 border-transparent flex flex-col hover:border-primary/30 transition-colors ${onClick ? 'cursor-pointer' : ''}`}
      data-node-id="1636:10117"
    >
      {/* 이미지 영역 — 검차·탁송과 동일: 컨테이너 첫 자식, 174px */}
      <div
        className="h-[174px] w-full bg-[#eef5fe] shrink-0 flex items-center justify-center overflow-hidden"
        data-node-id="1636:10118"
      >
        <ImageWithFallback
          src={vehicle.thumbnailUrl}
          alt={vehicle.modelName}
          className="w-full h-full object-cover"
          fallbackClassName="w-full h-full flex items-center justify-center"
          aspectRatio="card"
          ariaLabel={`${vehicle.modelName} 이미지`}
        />
      </div>
      {/* 콘텐츠 영역 — 검차·탁송과 동일: border-t, pl/pr 23px */}
      <div className="flex-1 min-h-0 pl-[23px] pr-[23px] pt-[18px] pb-4 border-t border-gray-200 flex flex-col">
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
              {statusLabel}
            </span>
          </div>
          {vehicle.updatedAt && (
            <span className="text-[10px] font-semibold" style={{ color: statusColor1636 }} data-node-id="1636:10119">
              {formatTime(vehicle.updatedAt)}
            </span>
          )}
        </div>
        <div className="w-full border-b border-gray-200 mb-[16px]" data-node-id="1636:10128" />
        <h3 className="text-[15.627px] font-bold leading-[18.75px] text-black mb-0.5" data-node-id="1636:10120">
          {vehicle.modelName}
        </h3>
        <p className="text-[7.814px] font-bold text-[#707070] leading-[18.75px] mb-1" data-node-id="1636:10121">
          {yearStr} · {mileageStr}
        </p>
        <p className="text-[15.627px] font-extrabold leading-[18.75px] text-[#2048e5] mb-0.5" data-node-id="1636:10123">
          {priceStr}
        </p>
        <p className="text-[9.376px] font-bold leading-[18.75px] text-black/30 mb-3" data-node-id="1636:10122">
          {newCarPriceStr}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {CARD_TAGS.map((tag) => (
            <span
              key={tag}
              className="rounded-[2.859px] bg-[var(--color-1033-badge-bg)] px-2 py-0.5 text-[7.623px] font-semibold text-[var(--color-1033-badge-text)] leading-tight"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
