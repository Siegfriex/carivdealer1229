/**
 * 계측/디버그 로그 수집 설정
 * 수집기: node scripts/log-collector.js (기본 포트 7244). 테스트 세션 구분은 VITE_LOG_RUN_ID로.
 */

/** 로그 수집 서버 ingest URL (환경변수 VITE_LOG_INGEST_URL 없으면 기본값 사용) */
export const LOG_INGEST_URL =
  (import.meta.env.VITE_LOG_INGEST_URL as string) ||
  'http://127.0.0.1:7244/ingest/746659b6-9689-4489-bbb8-e6301089bd42';

/** 테스트 세션 구분용 runId. 계측 페이로드에 포함되며 미설정 시 'register-flow-check' */
export const LOG_RUN_ID =
  (import.meta.env.VITE_LOG_RUN_ID as string) || 'register-flow-check';
