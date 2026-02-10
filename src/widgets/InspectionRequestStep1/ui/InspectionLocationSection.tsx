/**
 * 검차 장소 섹션 (Figma 1636:10691)
 * SSOT: docs/figmaMCP/mcp_outputs/1033-4903 design_context_raw.txt
 * - 제목 24px Bold + * #f21824
 * - 래퍼 rounded-[30px], 내부 bg-white rounded-[20px] shadow 2px 2px 21.3px
 * - 입력 bg #f4f4f4 border #d9d9d9 rounded-[10px], 우편번호 찾기 bg #2048e5 rounded-[10px]
 */

import { Button } from '@/shared/ui/Button';
import { MapPin } from 'lucide-react';

export interface InspectionLocationSectionProps {
  zipCode: string;
  address: string;
  addressDetail: string;
  defaultAddress: boolean;
  onZipCodeChange: (value: string) => void;
  onAddressChange: (value: string) => void;
  onAddressDetailChange: (value: string) => void;
  onDefaultAddressChange: (value: boolean) => void;
  onFindZipCode?: () => void;
  onSelectOnMap?: () => void;
}

const inputWrapClass =
  'rounded-[10px] border border-[#d9d9d9] bg-[#f4f4f4] text-[16px] text-gray-900 placeholder:text-black/40';

export const InspectionLocationSection = ({
  zipCode,
  address,
  addressDetail,
  defaultAddress,
  onZipCodeChange,
  onAddressChange,
  onAddressDetailChange,
  onDefaultAddressChange,
  onFindZipCode,
  onSelectOnMap,
}: InspectionLocationSectionProps) => {
  return (
    <section className="flex w-full max-w-[971px] flex-col gap-[17px]" data-node-id="1636:10691">
      <div className="flex items-center gap-2.5" data-node-id="1636:10692">
        <h2 className="font-bold leading-[44px] text-[24px] text-black" data-node-id="1636:10696">
          검차 장소
        </h2>
        <span className="text-[22px] leading-[18.753px] text-[#f21824]" data-node-id="1636:12381">*</span>
      </div>
      <div className="w-full rounded-[30px]" data-node-id="1636:10698">
        <div className="inspection-step1-location-inner min-h-[427px] w-full max-w-[973px] rounded-[20px] bg-white p-6" data-node-id="1636:10699">
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1">
              <label className="mb-1 block text-[18px] leading-[15px] text-black/60">우편번호 <span className="text-[#f21824]">*</span></label>
              <div className="flex gap-[17px]">
                <input
                  placeholder="우편번호를 입력해 주세요"
                  value={zipCode}
                  onChange={(e) => onZipCodeChange(e.target.value)}
                  className={`h-12 w-full max-w-[278px] px-[22px] py-2 ${inputWrapClass}`}
                />
                <Button
                  type="button"
                  size="md"
                  onClick={onFindZipCode}
                  className="h-12 w-[120px] shrink-0 rounded-[10px] px-4 text-[16px] font-medium"
                >
                  우편번호 찾기
                </Button>
              </div>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[18px] leading-[15px] text-black/60">주소지 <span className="text-[#f21824]">*</span></label>
            <input
              placeholder="주소지를 입력해 주세요"
              value={address}
              onChange={(e) => onAddressChange(e.target.value)}
              className={`h-12 w-full px-[22px] py-2 ${inputWrapClass}`}
            />
          </div>
          <div>
            <label className="mb-1 block text-[18px] leading-[15px] text-black/60">상세주소</label>
            <input
              placeholder="상세주소를 입력해 주세요"
              value={addressDetail}
              onChange={(e) => onAddressDetailChange(e.target.value)}
              className={`h-12 w-full px-[22px] py-2 ${inputWrapClass}`}
            />
          </div>
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={defaultAddress}
              onChange={(e) => onDefaultAddressChange(e.target.checked)}
              className="h-[26px] w-[26px] rounded-[13px] border border-[#2048e5] text-[var(--color-primary)] focus:ring-[var(--color-primary)]"
            />
            <span className="text-[14px] leading-[15px] text-black/60">기본 주소지 설정</span>
          </label>
          <Button
            variant="ghost"
            className="mt-4 w-full justify-center text-[16px] text-black/60"
            size="md"
            onClick={onSelectOnMap}
          >
            <MapPin className="mr-2 h-5 w-5" />
            지도에서 장소 선택
          </Button>
        </div>
        </div>
      </div>
    </section>
  );
};
