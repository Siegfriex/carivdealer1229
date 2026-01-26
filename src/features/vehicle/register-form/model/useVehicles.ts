/**
 * useVehicles Hook
 * 차량 목록 조회 (Firestore Query)
 */

import { useQuery } from '@tanstack/react-query';
import { collection, query, where, orderBy, getDocs, Query } from 'firebase/firestore';
import { db } from '@/shared/config/firebase';
import { vehicleSchema } from '@/entities/vehicle/model/schema';
import type { Vehicle, VehicleStatus } from '@/entities/vehicle/model/types';

interface UseVehiclesOptions {
  ownerId?: string;
  status?: VehicleStatus[];
}

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

      const snapshot = await getDocs(q);
      const vehicles = snapshot.docs.map((doc) => {
        const data = { id: doc.id, ...doc.data() };
        // Zod로 런타임 검증
        return vehicleSchema.parse(data);
      });

      return vehicles;
    },
    staleTime: 5 * 60 * 1000, // 5분
  });
};
