/**
 * TanStack Query 프로바이더
 * queryClient·Selective Persist·ReactQueryDevtools 래핑.
 * P4: whitelist(vehicles, settlements)만 localStorage에 저장.
 */

import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/shared/api/queryClient';
import { queryPersister, shouldDehydrateQuery } from '@/shared/api/queryPersister';
import type { PropsWithChildren } from 'react';

const PERSIST_MAX_AGE = 1000 * 60 * 60 * 24; // 24시간

/**
 * Query 프로바이더 렌더링
 * @param props.children - 자식 노드
 */
export const QueryProvider = ({ children }: PropsWithChildren) => {
  return (
    <PersistQueryClientProvider
      client={queryClient}
      persistOptions={{
        persister: queryPersister,
        maxAge: PERSIST_MAX_AGE,
        dehydrateOptions: {
          shouldDehydrateQuery,
        },
      }}
    >
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </PersistQueryClientProvider>
  );
};
