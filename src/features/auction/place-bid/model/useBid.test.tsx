/**
 * useBid Hook 테스트
 */

import type { ReactNode } from 'react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBid } from './useBid';

const apiClientPost = vi.fn();

vi.mock('@/shared/api/client', () => ({
  apiClient: {
    post: (...args: unknown[]) => apiClientPost(...args),
  },
}));

vi.mock('@/shared/config/apiEndpoints', () => ({
  API_ENDPOINTS: {
    AUCTION: { BID: 'auction/bid' },
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };
}

describe('useBid', () => {
  beforeEach(() => {
    apiClientPost.mockReset();
  });

  test('mutation 성공 시 apiClient.post 호출 및 onSuccess 동작', async () => {
    apiClientPost.mockResolvedValue({ success: true, message: '입찰되었습니다.' });

    const { result } = renderHook(() => useBid(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      auction_id: 'auc-1',
      bid_amount: 1000,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiClientPost).toHaveBeenCalledWith('auction/bid', {
      auction_id: 'auc-1',
      bid_amount: 1000,
    });
    expect(result.current.data).toEqual({ success: true, message: '입찰되었습니다.' });
  });

  test('mutation 실패 시 error 상태', async () => {
    apiClientPost.mockRejectedValue(new Error('입찰 실패'));

    const { result } = renderHook(() => useBid(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ auction_id: 'auc-1', bid_amount: 500 });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });
});
