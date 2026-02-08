/**
 * DevSkipFloatingButton
 * 좌하단 고정 버튼. 클릭 시 필수 입력 검증 스킵 모드 토글.
 * 개발용: 필수 항목 없이 다음 단계로 진행할 수 있게 함.
 * z-index: Z_INDEX.DEV_SKIP (shared/config/zIndex)
 */

import { Z_INDEX } from '@/shared/config/zIndex';
import { useDevSkip } from '@/shared/context/DevSkipContext';
import { Button } from '@/shared/ui/Button';

export const DevSkipFloatingButton = () => {
  const { skipRequired, toggleSkipRequired } = useDevSkip();

  return (
    <div
      className="fixed bottom-6 left-6"
      style={{ zIndex: Z_INDEX.DEV_SKIP }}
      aria-label="개발용: 필수 입력 스킵 토글"
    >
      <Button
        type="button"
        variant={skipRequired ? 'primary' : 'secondary'}
        size="sm"
        onClick={toggleSkipRequired}
        className="shadow-lg border border-gray-300 min-w-[100px]"
      >
        dev:skip {skipRequired ? 'ON' : 'OFF'}
      </Button>
    </div>
  );
};
