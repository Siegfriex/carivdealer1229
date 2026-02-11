/**
 * InspectionDetailModal — 검차 상세내역 모달 (사진·영상 항목)
 * Figma 1302-27289
 * @see docs/figmaMCP/impl_plans/794-4708_794-4542_1123-14112_1123-13946_1302-27093_1302-27289_구현계획.md
 */

import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';

const PHOTO_ITEMS = [
  { label: '차량 외관', count: '9' },
  { label: '차량 내부', count: '14' },
  { label: '타이어', count: '4' },
  { label: '유리', count: '2' },
  { label: '사이드미러', count: '2' },
  { label: '트렁크', count: '2' },
  { label: '범퍼', count: '2' },
  { label: '보닛', count: '1' },
  { label: '성능기록부', count: '1' },
  { label: '외부 손상', count: 'x' },
];

const VIDEO_ITEMS = [
  { label: '보닛', count: '10초 / 1' },
  { label: '성능기록부', count: '10초 / 1' },
  { label: '외부 손상', count: '10초 / 1' },
];

export interface InspectionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InspectionDetailModal({ isOpen, onClose }: InspectionDetailModalProps) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="세부 검차내역"
      size="lg"
      titleClassName="text-[26px] font-extrabold leading-[44px] text-black"
    >
      <div className="space-y-6" data-node-id="1302:27289">
        <section>
          <h4 className="text-[24px] font-semibold leading-[26px] text-black mb-3">사진항목</h4>
          <ul className="rounded-lg overflow-hidden border border-[var(--color-gray-200)]">
            {PHOTO_ITEMS.map((item) => (
              <li
                key={item.label}
                className="h-14 px-4 flex justify-between items-center border-b border-[var(--color-gray-200)] last:border-b-0 bg-white"
              >
                <span className="text-base font-semibold text-black">{item.label}</span>
                <span className="text-xs text-[var(--color-gray-550)]">{item.count}</span>
              </li>
            ))}
          </ul>
        </section>
        <section>
          <h4 className="text-[24px] font-semibold leading-[26px] text-black mb-3">영상항목</h4>
          <ul className="rounded-lg overflow-hidden border border-[var(--color-gray-200)]">
            {VIDEO_ITEMS.map((item) => (
              <li
                key={`video-${item.label}`}
                className="h-14 px-4 flex justify-between items-center border-b border-[var(--color-gray-200)] last:border-b-0 bg-white"
              >
                <span className="text-base font-semibold text-black">{item.label}</span>
                <span className="text-xs text-[var(--color-gray-550)]">{item.count}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <div className="flex justify-end mt-6">
        <Button onClick={onClose}>닫기</Button>
      </div>
    </Modal>
  );
}
