/**
 * VehicleDetailPage 테스트
 * - vehicleId 없음 또는 'new'일 때 잘못된 경로 메시지 및 [차량 목록으로] 버튼
 * - 로딩/에러 시 UI
 */

import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { VehicleDetailPage } from './VehicleDetailPage';

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

function createWrapper(initialEntry = '/vehicles/v-1') {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[initialEntry]}>
          <Routes>
            <Route path="/vehicles/:vehicleId" element={children} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
  };
}

describe('VehicleDetailPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test('vehicleId가 new일 때 "잘못된 경로입니다." 메시지와 [차량 목록으로] 버튼 표시', () => {
    render(<VehicleDetailPage />, {
      wrapper: createWrapper('/vehicles/new'),
    });

    expect(screen.getByText('잘못된 경로입니다.')).toBeInTheDocument();
    const button = screen.getByRole('button', { name: /차량 목록으로/ });
    expect(button).toBeInTheDocument();
  });

  test('잘못된 경로에서 [차량 목록으로] 클릭 시 /vehicles로 이동', async () => {
    const user = userEvent.setup();
    render(<VehicleDetailPage />, {
      wrapper: createWrapper('/vehicles/new'),
    });

    await user.click(screen.getByRole('button', { name: /차량 목록으로/ }));
    expect(mockNavigate).toHaveBeenCalledWith('/vehicles');
  });
});
