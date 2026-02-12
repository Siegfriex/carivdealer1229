/**
 * useAuction Hook
 * 경매 상세 조회 (5초 폴링). IA §4.11, STATE_MANAGEMENT_POLICY P1.
 *
 * @description 경매 상세 페이지만 enabled일 때 refetchInterval 동작.
 *   현재 경매 전용 API 없음 → vehicle 데이터로 대체. API 확장 시 queryFn 교체.
 * @see docs/STATE_MANAGEMENT_POLICY.md §7 P1
 */

import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/shared/config/firebase';
import { auctionKeys } from '@/shared/api/queryKeys';
import { vehicleSchema } from '@/entities/vehicle/model/schema';
import type { Vehicle } from '@/entities/vehicle/model/types';

export interface UseAuctionOptions {
  /** 경매 상세 페이지에 있을 때만 true. default: true */
  enabled?: boolean;
}

/**
 * 경매 상세 조회 (5초 폴링)
 * @param vehicleId - 차량 ID (경매는 vehicle 단위)
 * @param options.enabled - true일 때만 폴링. pathname === `/vehicles/${vehicleId}/auction` 일치 시 true 권장
 */
export const useAuction = (vehicleId: string | undefined, options?: UseAuctionOptions) => {
  const enabled = options?.enabled ?? true;

  return useQuery({
    queryKey: auctionKeys.detail(vehicleId),
    queryFn: async (): Promise<Vehicle> => {
      if (!vehicleId) {
        throw new Error('Vehicle ID is required');
      }

      const docRef = doc(db, 'vehicles', vehicleId);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        throw new Error('Vehicle not found');
      }

      const data = { id: snapshot.id, ...snapshot.data() };
      return vehicleSchema.parse(data);
    },
    enabled: !!vehicleId && enabled,
    staleTime: 0,
    refetchInterval: 5000,
  });
};
