/**
 * 검차 일정 섹션 (Figma 1193:6709)
 * SSOT: docs/figmaMCP/mcp_outputs/1033-4903 design_context_raw.txt
 * - 제목 24px Bold + * #f21824, gap 10px
 * - 내부 카드 rounded-[30px] shadow 2.344px 3.125px 11.017px, 980px
 */

import { Input } from '@/shared/ui/Input';

export interface InspectionScheduleSectionProps {
  preferredDate: string;
  preferredTime: string;
  onPreferredDateChange: (value: string) => void;
  onPreferredTimeChange: (value: string) => void;
}

export const InspectionScheduleSection = ({
  preferredDate,
  preferredTime,
  onPreferredDateChange,
  onPreferredTimeChange,
}: InspectionScheduleSectionProps) => {
  return (
    <section className="w-full max-w-[980px]" data-node-id="1193:6709">
      <div className="mb-4 flex items-center gap-2.5" data-node-id="1193:6703">
        <h2 className="font-bold leading-[44px] text-[24px] text-black" data-node-id="1193:6707">
          검차 일정
        </h2>
        <span className="text-[22px] leading-[18.753px] text-[var(--color-error-figma)]">*</span>
      </div>
      <div className="inspection-step1-section-card overflow-hidden bg-white p-6">
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="희망 날짜"
            type="date"
            value={preferredDate}
            onChange={(e) => onPreferredDateChange(e.target.value)}
            fullWidth
            required
            className="rounded-[10px] border-[var(--color-form-field-border)] bg-[var(--color-form-field-bg)]"
          />
          <Input
            label="희망 시간"
            type="time"
            value={preferredTime}
            onChange={(e) => onPreferredTimeChange(e.target.value)}
            fullWidth
            required
            className="rounded-[10px] border-[var(--color-form-field-border)] bg-[var(--color-form-field-bg)]"
          />
        </div>
      </div>
    </section>
  );
};
