/**
 * 폼 검증·피드백 훅 (Toast 기반)
 * alert 대체용. 검증 실패·경고·성공 메시지를 토스트로 노출.
 */

import { useCallback } from 'react';
import { useToast } from '@/shared/ui/Toast';

/**
 * 폼 피드백 메시지 노출 훅.
 * @returns showValidationError(에러 메시지), showValidationWarning(경고), showSuccess(성공)
 */
export function useFormFeedback() {
  const { showToast } = useToast();

  const showValidationError = useCallback(
    (message: string) => {
      showToast(message, 'error');
    },
    [showToast]
  );

  const showValidationWarning = useCallback(
    (message: string) => {
      showToast(message, 'warning');
    },
    [showToast]
  );

  const showSuccess = useCallback(
    (message: string) => {
      showToast(message, 'success');
    },
    [showToast]
  );

  return { showValidationError, showValidationWarning, showSuccess };
}
