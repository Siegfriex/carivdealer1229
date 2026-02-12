/**
 * useSettlement Hook
 * 정산 상세 조회 (Mock). API 확장 시 getSettlement 교체.
 */

import { useQuery } from '@tanstack/react-query';
import { settlementKeys } from '@/shared/api/queryKeys';
import { getSettlement } from '../api/settlementApi';

export const useSettlement = (id: string | undefined) => {
  return useQuery({
    queryKey: settlementKeys.detail(id),
    queryFn: () => (id ? getSettlement(id) : Promise.resolve(null)),
    enabled: !!id,
    staleTime: 5 * 60 * 1000,
  });
};
