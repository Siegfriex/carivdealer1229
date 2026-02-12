/**
 * useBuyNow 훅 테스트
 * 즉시구매 뮤테이션 호출·성공 시 쿼리 무효화를 검증한다.
 */

import type { ReactNode } from 'react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@/shared/ui/Toast';
import { useBuyNow } from './useBuyNow';

const auctionBuyNow = vi.fn();

vi.mock('@/shared/api/client', () => ({
  apiClient: {
    auction: {
      buyNow: (auctionId: string) => auctionBuyNow(auctionId),
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

describe('useBuyNow', () => {
  beforeEach(() => {
    auctionBuyNow.mockReset();
  });

  test('mutation 성공 시 apiClient.auction.buyNow 호출 및 onSuccess 동작', async () => {
    auctionBuyNow.mockResolvedValue({
      success: true,
      contract_id: 'c-1',
      message: '즉시구매가 완료되었습니다.',
    });

    const { result } = renderHook(() => useBuyNow(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ auction_id: 'auc-1' });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(auctionBuyNow).toHaveBeenCalledWith('auc-1');
    expect(result.current.data).toMatchObject({
      success: true,
      contract_id: 'c-1',
      message: '즉시구매가 완료되었습니다.',
    });
  });

  test('mutation 실패 시 error 상태', async () => {
    auctionBuyNow.mockRejectedValue(new Error('즉시구매 실패'));

    const { result } = renderHook(() => useBuyNow(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({ auction_id: 'auc-1' });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });
});
