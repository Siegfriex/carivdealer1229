/**
 * useSettlements Hook
 * 정산 목록 조회 (Mock). API 확장 시 getSettlements 교체.
 */

import { useQuery } from '@tanstack/react-query';
import { settlementKeys } from '@/shared/api/queryKeys';
import { getSettlements, type SettlementStatusFilter } from '../api/settlementApi';

export const useSettlements = (filter: SettlementStatusFilter = 'all') => {
  return useQuery({
    queryKey: settlementKeys.list(filter),
    queryFn: () => getSettlements(filter),
    staleTime: 5 * 60 * 1000,
  });
};
