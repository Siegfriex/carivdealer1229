/**
 * 개발 환경에서만 로그를 출력하는 유틸리티
 * 프로덕션 빌드에서는 로그가 제거됩니다 (Vite의 tree-shaking)
 */
const isDev = import.meta.env.DEV;

export const logger = {
  log: (...args: any[]) => {
    if (isDev) {
      console.log('[ForwardMax]', ...args);
    }
  },
  
  warn: (...args: any[]) => {
    if (isDev) {
      console.warn('[ForwardMax]', ...args);
    }
  },
  
  error: (...args: any[]) => {
    // 에러는 항상 로그 (프로덕션에서도 모니터링 필요)
    console.error('[ForwardMax]', ...args);
  },
  
  mock: (message: string, ...args: any[]) => {
    if (isDev) {
      console.warn(`[프로토타입] ${message}`, ...args);
    }
  }
};

