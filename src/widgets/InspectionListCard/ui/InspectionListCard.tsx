/**
 * 검차 목록 카드 1건. 탁송 카드뷰(1714:22923)와 동일한 타이포·디자인 — 314×291, GNB_CARD_WRAPPER + GNB_CARD.
 * Figma 1042-4681 / 1193:8818 참조.
 */

import { Clock, MapPin } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { INSPECTION_STATUS_LABELS, INSPECTION_STATUS_COLORS } from '@/entities/inspection/model/constants';
import type { InspectionStatus } from '@/entities/inspection/model/types';

/** 카드에 표시할 검차 정보 (페이지에서 InspectionWithVehicle 등 전달) */
export interface InspectionListCardInspection {
  id: string;
  status: InspectionStatus;
  vehiclePlateNumber?: string;
  vehicleModelName?: string;
  vehicleModelYear?: string;
  serialNumber?: string;
  preferredDate?: string;
  preferredTime?: string;
  location?: { address?: string };
}

export interface InspectionListCardProps {
  inspection: InspectionListCardInspection;
  onProgress?: () => void;
  onComplete?: () => void;
  onTrade?: () => void;
  onDelete?: () => void;
  onEdit?: () => void;
}

export const InspectionListCard = ({
  inspection,
  onProgress,
  onComplete,
  onTrade,
  onDelete,
  onEdit,
}: InspectionListCardProps) => {
  const statusColor = INSPECTION_STATUS_COLORS[inspection.status];
  const statusLabel = INSPECTION_STATUS_LABELS[inspection.status];

  return (
    <div
      className={`text-left bg-white ${LAYOUT_CLASSES.GNB_CARD_WRAPPER} ${LAYOUT_CLASSES.GNB_CARD} overflow-hidden w-full border-2 border-transparent flex flex-col`}
      data-node-id="1193:8818"
    >
      {/* 탁송 카드와 동일: 이미지 영역 174px */}
      <div
        className="h-[174px] w-full bg-[#eef5fe] shrink-0 flex items-center justify-center"
        data-node-id="1193:8820"
      >
        <span className="text-[7.814px] font-bold text-[#707070]">차량 이미지</span>
      </div>
      {/* 탁송 카드와 동일: 패딩 pl/pr 23px, pt 23px, pb-3, border-t */}
      <div className="flex-1 min-h-0 pl-[23px] pr-[23px] pt-[23px] pb-3 border-t border-gray-200 flex flex-col">
        <p
          className="text-[12px] font-semibold mb-1"
          style={{ color: statusColor }}
          data-node-id="1193:8964"
        >
          {statusLabel}
        </p>
        <p className="text-[15.627px] font-bold text-black leading-tight" data-node-id="1193:8826">
          {inspection.vehiclePlateNumber ?? '-'}
        </p>
        <p className="text-[15.627px] font-bold text-black/80 leading-tight" data-node-id="1193:8830">
          {inspection.vehicleModelName ?? '-'}
        </p>
        <p className="text-[7.814px] text-[#707070] font-bold leading-tight" data-node-id="1193:8829">
          {inspection.vehicleModelYear ?? '-'}년형 · 일련번호 {inspection.serialNumber ?? inspection.id}
        </p>
        <div className="flex flex-col gap-0.5 mt-1 text-[9.376px] text-black/70 font-bold leading-tight" data-node-id="1193:8834">
          <p className="flex items-center gap-1">
            <Clock className="h-3 w-3 shrink-0" />
            검차일정 {inspection.preferredDate} {inspection.preferredTime}
          </p>
          <p className="flex items-center gap-1">
            <MapPin className="h-3 w-3 shrink-0" />
            {inspection.location?.address ?? '검차장소 미정'}
          </p>
        </div>
        <div className="mt-auto flex flex-wrap gap-2 pt-3" data-node-id="1193:8987">
          {inspection.status === 'completed' && (
            <Button size="sm" className="bg-[#f3f4f6] border border-[#e6e6e6] text-black hover:bg-gray-200" onClick={onComplete}>
              검차내역 상세보기
            </Button>
          )}
          {inspection.status !== 'completed' && (
            <Button size="sm" className="bg-primary text-white" onClick={onProgress}>
              진행하기
            </Button>
          )}
          {onTrade && (
            <Button size="sm" variant="secondary" onClick={onTrade}>
              거래하기
            </Button>
          )}
          {onDelete && (
            <Button size="sm" variant="ghost" className="text-red-600 hover:bg-red-50" onClick={onDelete}>
              삭제
            </Button>
          )}
          {onEdit && (
            <Button size="sm" variant="ghost" onClick={onEdit}>
              수정하기
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
