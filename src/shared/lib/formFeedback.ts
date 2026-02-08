/**
 * 폼 검증/피드백 공통
 * Toast 기반 메시지 노출 (alert 대체)
 * 사용: useFormFeedback() → showValidationError('필수 항목을 입력해주세요.')
 */

import { useCallback } from 'react';
import { useToast } from '@/shared/ui/Toast';

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
