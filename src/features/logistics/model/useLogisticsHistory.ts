/**
 * useLogisticsHistory Hook
 * 탁송 내역 목록 (Mock). API 확장 시 getLogisticsHistory 교체. P2 Zod 런타임 검증.
 */

import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { logisticsKeys } from '@/shared/api/queryKeys';
import { MOCK_LOGISTICS_HISTORY, type MockLogisticsRecord } from '@/shared/api/mockLists';

const mockLogisticsRecordSchema = z.object({
  id: z.string(),
  vehicleId: z.string(),
  plateNumber: z.string(),
  scheduleDate: z.string(),
  scheduleTime: z.string(),
  address: z.string(),
  driverName: z.string().optional(),
  driverPhone: z.string().optional(),
  status: z.enum(['scheduled', 'dispatched', 'in_transit', 'completed']),
  pin: z.string().optional(),
});

export const useLogisticsHistory = (): { data: MockLogisticsRecord[] | undefined; isLoading: boolean } => {
  const result = useQuery({
    queryKey: logisticsKeys.history(),
    queryFn: async (): Promise<MockLogisticsRecord[]> =>
      z.array(mockLogisticsRecordSchema).parse([...MOCK_LOGISTICS_HISTORY]),
    staleTime: 5 * 60 * 1000,
  });
  return { data: result.data, isLoading: result.isLoading };
};
