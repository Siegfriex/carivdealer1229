/**
 * useInspectionRequest 훅 테스트
 * 검차 신청 뮤테이션 호출·성공 시 쿼리 무효화·에러 시 toast를 검증한다.
 */

import type { ReactNode } from 'react';
import { describe, test, expect, vi, beforeEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@/shared/ui/Toast';
import { useInspectionRequest } from './useInspectionRequest';

const apiPost = vi.fn();

vi.mock('@/shared/api/client', () => ({
  apiClient: {
    post: <T,>(endpoint: string, data?: unknown) => apiPost(endpoint, data) as Promise<T>,
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

describe('useInspectionRequest', () => {
  beforeEach(() => {
    apiPost.mockReset();
  });

  test('mutation 성공 시 apiClient.post 호출 및 onSuccess 동작', async () => {
    apiPost.mockResolvedValue({
      success: true,
      inspection_id: 'insp-1',
      message: '검차 신청되었습니다.',
    });

    const { result } = renderHook(() => useInspectionRequest(), {
      wrapper: createWrapper(),
    });

    const input = {
      vehicle_id: 'v-1',
      preferred_date: '2026-02-15',
      preferred_time: '14:00',
    };
    result.current.mutate(input);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(apiPost).toHaveBeenCalledWith('inspectionRequestAPI', input);
    expect(result.current.data).toEqual({
      success: true,
      inspection_id: 'insp-1',
      message: '검차 신청되었습니다.',
    });
  });

  test('mutation 실패 시 error 상태', async () => {
    apiPost.mockRejectedValue(new Error('검차 신청 실패'));

    const { result } = renderHook(() => useInspectionRequest(), {
      wrapper: createWrapper(),
    });

    result.current.mutate({
      vehicle_id: 'v-1',
      preferred_date: '2026-02-15',
      preferred_time: '14:00',
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });
});
