/**
 * useLogisticsSchedule Hook
 * 탁송 스케줄 목록 (Mock). API 확장 시 getLogisticsSchedule 교체. P2 Zod 런타임 검증.
 */

import { z } from 'zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { logisticsKeys } from '@/shared/api/queryKeys';
import { MOCK_LOGISTICS_ITEMS, type MockLogisticsItem, type MockLogisticsStatus } from '@/shared/api/mockLists';

const mockLogisticsItemSchema = z.object({
  id: z.string(),
  plateNumber: z.string(),
  modelName: z.string(),
  modelYear: z.string(),
  mileage: z.string(),
  status: z.enum(['scheduled', 'dispatched', 'in_transit', 'completed']),
  thumbnailUrl: z.string().optional(),
  vehicleId: z.string().optional(),
});

export const useLogisticsSchedule = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: logisticsKeys.schedule(),
    queryFn: async (): Promise<MockLogisticsItem[]> =>
      z.array(mockLogisticsItemSchema).parse([...MOCK_LOGISTICS_ITEMS]),
    staleTime: 5 * 60 * 1000,
  });

  const setItemStatus = (id: string, status: MockLogisticsStatus) => {
    queryClient.setQueryData<MockLogisticsItem[]>(logisticsKeys.schedule(), (old) =>
      old ? old.map((i) => (i.id === id ? { ...i, status } : i)) : old
    );
  };

  return { ...query, setItemStatus };
};
