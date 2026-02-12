/**
 * useSalesHistory Hook
 * 매출 내역 목록 (Mock). API 확장 시 getSalesHistory 교체. P2 Zod 런타임 검증.
 */

import { z } from 'zod';
import { useQuery } from '@tanstack/react-query';
import { saleKeys } from '@/shared/api/queryKeys';
import { MOCK_SALES_HISTORY, type MockSaleRecord } from '@/shared/api/mockLists';

const mockSaleRecordSchema = z.object({
  id: z.string(),
  vehicleId: z.string(),
  plateNumber: z.string(),
  modelName: z.string(),
  manufacturer: z.string(),
  modelYear: z.string(),
  salePrice: z.number(),
  saleDate: z.string(),
  buyerName: z.string(),
  saleMethod: z.enum(['auction', 'general']),
});

export const useSalesHistory = () => {
  return useQuery({
    queryKey: saleKeys.history(),
    queryFn: async (): Promise<MockSaleRecord[]> =>
      z.array(mockSaleRecordSchema).parse([...MOCK_SALES_HISTORY]),
    staleTime: 5 * 60 * 1000,
  });
};
