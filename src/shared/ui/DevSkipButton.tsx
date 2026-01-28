/**
 * DevSkipButton
 * 좌하단 고정 DEV:SKIP 버튼 — 필수 입력/단계 스킵용 (개발·E2E)
 * z-index: Z_INDEX.DEV_SKIP (shared/config/zIndex)
 */

import { Z_INDEX } from '@/shared/config/zIndex';
import { Button } from './Button';

export interface DevSkipButtonProps {
  label?: string;
  onClick: () => void;
  /** 추가 라벨(예: "검차자 이동중으로") — 작게 표시 */
  subLabel?: string;
}

export const DevSkipButton = ({
  label = 'DEV:SKIP',
  onClick,
  subLabel,
}: DevSkipButtonProps) => {
  return (
    <div
      className="fixed left-4 bottom-4 flex flex-col gap-1"
      style={{ zIndex: Z_INDEX.DEV_SKIP_PAGE }}
      data-testid="dev-skip-area"
    >
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={onClick}
        className="shadow-md border border-gray-300 bg-white/95 text-gray-600 hover:bg-gray-100"
      >
        {label}
      </Button>
      {subLabel && (
        <span className="text-caption text-gray-500 px-1">{subLabel}</span>
      )}
    </div>
  );
};
