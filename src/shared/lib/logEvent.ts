/**
 * 계측/디버그 로그 이벤트 전송
 * PROD 및 VITE_LOG_INGEST_URL 미설정 시 no-op.
 * @see src/shared/config/logging.ts
 */

import { LOG_INGEST_URL, LOG_RUN_ID } from '@/shared/config/logging';

/** logEvent 페이로드 (내부용) */
interface LogPayload {
  location: string;
  message: string;
  data?: Record<string, unknown>;
  timestamp: number;
  hypothesisId?: string;
  runId: string;
}

/**
 * 로그 이벤트 전송. PROD 또는 URL 미설정 시 아무것도 하지 않음.
 * @param location - 이벤트 위치 (예: 'LandingPage:handleStartNow')
 * @param message - 이벤트 메시지 (예: '지금 시작하기')
 * @param data - 추가 데이터 (선택)
 */
export function logEvent(
  location: string,
  message: string,
  data?: Record<string, unknown>
): void {
  if (import.meta.env.PROD) return;

  const payload: LogPayload = {
    location,
    message,
    ...(data && Object.keys(data).length > 0 && { data }),
    timestamp: Date.now(),
    runId: LOG_RUN_ID,
  };
  fetch(LOG_INGEST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {});
}

/**
 * hypothesisId를 포함한 로그 이벤트 (기존 fetch 호출과 호환)
 */
export function logEventWithHypothesis(
  location: string,
  message: string,
  data?: Record<string, unknown>,
  hypothesisId?: string
): void {
  if (import.meta.env.PROD) return;

  const payload: LogPayload = {
    location,
    message,
    ...(data && Object.keys(data).length > 0 && { data }),
    timestamp: Date.now(),
    runId: LOG_RUN_ID,
    ...(hypothesisId && { hypothesisId }),
  };
  fetch(LOG_INGEST_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  }).catch(() => {});
}
