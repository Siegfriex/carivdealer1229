/**
 * TradeDetailCard — 거래상세 컨테이너 (차량정보+피드백) + 펼침
 * Figma 794-4708, 1123-14112, 1302-27093, 794-4542, 1123-13946
 * @see docs/figmaMCP/impl_plans/794-4708_794-4542_1123-14112_1123-13946_1302-27093_1302-27289_구현계획.md
 */

import { ChevronDown, ChevronUp } from 'lucide-react';
import { VehicleInfoPanel } from '@/widgets/VehicleInfoPanel';
import { FeedbackBlock } from '@/widgets/FeedbackBlock';

export interface TradeDetailCardProps {
  vehicle?: {
    plateNumber?: string;
    manufacturer?: string;
    modelName?: string;
    modelYear?: string;
    mileage?: string;
    fuelType?: string;
  } | null;
  expanded: boolean;
  onExpand: () => void;
  onInspectionDetail?: () => void;
  /** 거래 유형 (펼침 뷰용) */
  tradeType?: string;
  /** 등록일 (펼침 뷰용) */
  registeredDate?: string;
}

export function TradeDetailCard({
  vehicle,
  expanded,
  onExpand,
  onInspectionDetail,
  tradeType = '일반 판매',
  registeredDate = '2025-02-10',
}: TradeDetailCardProps) {
  const plateNumber = vehicle?.plateNumber ?? '12바 1234';
  const manufacturer = vehicle?.manufacturer ?? 'Hyundai';
  const modelName = vehicle?.modelName ?? 'G70 3T 스포츠 엘리트';
  const modelYear = vehicle?.modelYear ?? '2018';
  const mileage = vehicle?.mileage ? `${(parseInt(vehicle.mileage, 10) / 10000).toFixed(1)}만 km` : '14.6만 km';

  return (
    <div data-node-id="1302:27093">
      <div className="mb-6" data-node-id="1123:14112">
        <button
          type="button"
          onClick={onExpand}
          className="w-full text-left rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          data-node-id="794:4708"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
            <VehicleInfoPanel vehicle={vehicle} nodeIdPrefix="1302" showBadge />
            <div className="min-h-[420px] flex flex-col">
              <FeedbackBlock nodeIdPrefix="1302" onInspectionDetail={onInspectionDetail} />
            </div>
          </div>
          <div className="flex justify-center py-2 border-t border-gray-100">
            {expanded ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
          </div>
        </button>

        {expanded && (
          <div className="mt-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm" data-node-id="794:4542">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 shadow-sm">
                <h3 className="text-h4 font-bold text-gray-900 mb-4">차량정보 요약</h3>
                <dl className="space-y-2 text-body">
                  <div className="flex justify-between"><dt className="text-gray-500">번호판</dt><dd className="font-medium text-gray-900">{plateNumber}</dd></div>
                  <div className="flex justify-between"><dt className="text-gray-500">제조사</dt><dd className="font-medium text-gray-900">{manufacturer}</dd></div>
                  <div className="flex justify-between"><dt className="text-gray-500">모델</dt><dd className="font-medium text-gray-900">{modelName}</dd></div>
                  <div className="flex justify-between"><dt className="text-gray-500">연식</dt><dd className="font-medium text-gray-900">{modelYear}</dd></div>
                  <div className="flex justify-between"><dt className="text-gray-500">주행거리</dt><dd className="font-medium text-gray-900">{mileage}</dd></div>
                </dl>
              </div>
              <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5 shadow-sm">
                <h3 className="text-h4 font-bold text-gray-900 mb-4">전체 피드백 요약</h3>
                <div className="flex flex-wrap gap-3 mb-3">
                  <span className="flex items-center gap-1 text-caption text-gray-700"><span className="w-2 h-2 rounded-full bg-green-500" />양호 95개</span>
                  <span className="flex items-center gap-1 text-caption text-gray-700"><span className="w-2 h-2 rounded-full bg-orange-400" />경미 12개</span>
                  <span className="flex items-center gap-1 text-caption text-gray-700"><span className="w-2 h-2 rounded-full bg-red-500" />주의 3개</span>
                  <span className="flex items-center gap-1 text-caption text-gray-700"><span className="w-2 h-2 rounded-full bg-red-700" />불량 1개</span>
                </div>
                <p className="text-caption text-gray-600">총 111개의 항목이 검사되었습니다. 전반적인 상태는 양호하며, 일부 부위에 경미한 스키레치가 확인되었습니다.</p>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h3 className="text-h4 font-bold text-gray-900 mb-3">거래 정보</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-caption text-gray-600">
                <div><span className="font-medium text-gray-700">거래 유형</span> {tradeType}</div>
                <div><span className="font-medium text-gray-700">등록일</span> {registeredDate}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
