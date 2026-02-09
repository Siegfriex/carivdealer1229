/**
 * TanStack Query 프로바이더
 * queryClient·ReactQueryDevtools 래핑.
 */

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/shared/api/queryClient';
import type { PropsWithChildren } from 'react';

/**
 * Query 프로바이더 렌더링
 * @param props.children - 자식 노드
 */
export const QueryProvider = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
