/**
 * 검차 차량 선택 섹션 (Figma 1193:6763)
 * SSOT: docs/figmaMCP/mcp_outputs/1033-4903 design_context_raw.txt
 * - 제목 24px Bold, * #f21824
 * - 입력 bg #f3f3f6 rounded-[5px] 14px placeholder #a5abb6 "예) 12바 1234"
 * - 버튼 bg #2048e5 rounded-[5px] 14px white "검색하기"
 * - 카드 rounded-[23.441px] shadow 2.344px 3.125px 11.017px
 */

import { Button } from '@/shared/ui/Button';
import { Car } from 'lucide-react';

export interface InspectionVehicleSelectSectionProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearch?: () => void;
  onVehicleChange?: () => void;
}

export const InspectionVehicleSelectSection = ({
  searchValue = '',
  onSearchChange,
  onSearch,
  onVehicleChange,
}: InspectionVehicleSelectSectionProps) => {
  return (
    <section className="w-full max-w-[972px]" data-node-id="1193:6763">
      <div className="mb-4 flex items-start gap-2.5">
        <h2 className="font-bold leading-[44px] text-[24px] text-black" data-node-id="1193:6758">
          검차 차량 선택
        </h2>
        <span className="text-[22px] leading-[18.753px] text-[#f21824]" data-node-id="1193:6896">*</span>
      </div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input
          type="text"
          placeholder="예) 12바 1234"
          value={searchValue}
          onChange={(e) => onSearchChange?.(e.target.value)}
          className="h-10 w-[217px] overflow-hidden rounded-[5px] bg-[#f3f3f6] px-3 py-2.5 text-[14px] leading-[18.753px] text-gray-900 placeholder:text-[#a5abb6] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
          aria-label="차량번호 검색"
          data-node-id="1193:6751"
        />
        <Button
          type="button"
          size="md"
          onClick={onSearch}
          className="h-10 w-[87px] rounded-[5px] px-[18px] py-[10px] text-[14px] font-bold"
          data-node-id="1193:6755"
        >
          검색하기
        </Button>
      </div>
      <div
        className="inspection-step1-vehicle-card flex items-center gap-4 bg-white p-4"
        data-node-id="1193:6711"
      >
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg bg-[#eef5fe]">
          <Car className="h-10 w-10 text-gray-500" />
        </div>
        <div className="min-w-0 flex-1 text-[14px] leading-[18.753px] text-[#707070]">
          차량을 선택하거나 등록해주세요.
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={onVehicleChange}
          className="rounded-[10px] text-[12px] shadow-[2.344px_3.125px_11.017px_0_rgba(0,0,0,0.05)]"
        >
          차량변경
        </Button>
      </div>
    </section>
  );
};
