/**
 * useBid 훅 테스트
 * 경매 입찰 뮤테이션 호출·성공 시 쿼리 무효화를 검증한다.
 */

import type { ReactNode } from 'react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@/shared/ui/Toast';
import { useBid } from './useBid';

const auctionBid = vi.fn();

vi.mock('@/shared/api/client', () => ({
  apiClient: {
    auction: {
      bid: (auctionId: string, bidAmount: number) => auctionBid(auctionId, bidAmount),
    },
  },
}));

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  });
  return function Wrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>{children}</ToastProvider>
      </QueryClientProvider>
    );
  };
}

describe('useBid', () => {
  beforeEach(() => {
    auctionBid.mockReset();
  });

  test('mutation 성공 시 apiClient.auction.bid 호출 및 onSuccess 동작', async () => {
    auctionBid.mockResolvedValue({ success: true, message: '입찰되었습니다.' });

    const { result } = renderHook(() => useBid(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      auction_id: 'auc-1',
      bid_amount: 1000,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(auctionBid).toHaveBeenCalledWith('auc-1', 1000);
    expect(result.current.data).toEqual({ success: true, message: '입찰되었습니다.' });
  });

  test('mutation 실패 시 error 상태', async () => {
    auctionBid.mockRejectedValue(new Error('입찰 실패'));

    const { result } = renderHook(() => useBid(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ auction_id: 'auc-1', bid_amount: 500 });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });
});
