/**
 * TanStack Query 클라이언트 설정
 * 전역 캐시·stale/gc 시간·재시도·리페치 옵션 정의.
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * QueryClient 싱글톤 인스턴스.
 * @description 쿼리: 5분 stale, 10분 gc, 1회 재시도, 포커스 시 리페치 없음. 뮤테이션: 재시도 없음.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,      // 5분
      gcTime: 10 * 60 * 1000,        // 10분 (구 cacheTime)
      retry: 1,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
    mutations: {
      retry: 0,
    },
  },
});
