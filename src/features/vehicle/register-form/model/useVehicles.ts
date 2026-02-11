/**
 * useVehicles Hook
 * 차량 목록 조회 (Firestore Query). 개발 시 컬렉션 비어 있으면 목업 반환.
 */

import { useQuery } from '@tanstack/react-query';
import { Timestamp, collection, query, where, orderBy, getDocs, Query } from 'firebase/firestore';
import { db } from '@/shared/config/firebase';
import { isRunDev } from '@/shared/config/runDev';
import { MOCK_VEHICLES_ALL } from '@/shared/api/mockLists';

/** 목업 사용: dev 기본 ON, 프로덕션 빌드 시 VITE_USE_MOCK_LIST=true면 ON (Firebase Hosting 등) */
const USE_MOCK_LIST =
  import.meta.env.VITE_USE_MOCK_LIST === 'true' ||
  (import.meta.env.DEV && import.meta.env.VITE_USE_MOCK_LIST !== 'false');
import { vehicleSchema } from '@/entities/vehicle/model/schema';
import type { Vehicle, VehicleStatus } from '@/entities/vehicle/model/types';

/** 차량 목록 조회 옵션 */
interface UseVehiclesOptions {
  ownerId?: string;
  status?: VehicleStatus[];
}

/** 개발용 목업: Firestore에 데이터 없을 때 공용 shared.api.mockLists 사용 */
function getMockVehicles(): Vehicle[] {
  return MOCK_VEHICLES_ALL as Vehicle[];
}

/**
 * 차량 목록 조회 쿼리 훅
 * @description Firestore vehicles 컬렉션 조회, ownerId/status 필터, updatedAt 내림차순. DEV에서 비어 있으면 목업 반환
 * @param options - ownerId, status (선택)
 * @returns useQuery<Vehicle[]>
 */
export const useVehicles = (options: UseVehiclesOptions = {}) => {
  return useQuery({
    queryKey: ['vehicles', options.ownerId, options.status],
    queryFn: async (): Promise<Vehicle[]> => {
      let q: Query = collection(db, 'vehicles');

      if (options.ownerId) {
        q = query(q as Query, where('ownerId', '==', options.ownerId));
      }

      if (options.status && options.status.length > 0) {
        q = query(q as Query, where('status', 'in', options.status));
      }

      q = query(q as Query, orderBy('updatedAt', 'desc'));

      if (USE_MOCK_LIST) {
        const mock = getMockVehicles();
        return options.status && options.status.length > 0
          ? mock.filter((v) => options.status!.includes(v.status))
          : mock;
      }

      const snapshot = await getDocs(q);
      let vehicles = snapshot.docs.map((doc) => {
        const data = { id: doc.id, ...doc.data() };
        return vehicleSchema.parse(data);
      });

      if (isRunDev() && vehicles.length === 0) {
        const mock = getMockVehicles();
        vehicles = options.status && options.status.length > 0
          ? mock.filter((v) => options.status!.includes(v.status))
          : mock;
      }

      return vehicles;
    },
    staleTime: 5 * 60 * 1000, // 5분
  });
};
