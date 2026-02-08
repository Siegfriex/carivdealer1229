/**
 * 계측/디버그 로그 수집 엔드포인트.
 * 수집기: node scripts/log-collector.js (기본 포트 7244)
 * 7243 충돌 시 .env.local에 VITE_LOG_INGEST_URL=http://127.0.0.1:7244/ingest/...
 *
 * 테스트 세션 구분: .env.local에 VITE_LOG_RUN_ID=test-20260209-1 등 설정 시 runId로 전송됨.
 */
export const LOG_INGEST_URL =
  (import.meta.env.VITE_LOG_INGEST_URL as string) ||
  'http://127.0.0.1:7244/ingest/746659b6-9689-4489-bbb8-e6301089bd42';

/** 테스트 시 로그 필터용. 지정 시 계측 페이로드의 runId로 사용 (미설정 시 기본값 register-flow-check) */
export const LOG_RUN_ID =
  (import.meta.env.VITE_LOG_RUN_ID as string) || 'register-flow-check';
