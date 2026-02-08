/**
 * useVehicle Hook
 * 차량 상세 조회 (Firestore Document)
 */

import { useQuery } from '@tanstack/react-query';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/shared/config/firebase';
import { vehicleSchema } from '@/entities/vehicle/model/schema';
import type { Vehicle } from '@/entities/vehicle/model/types';

export const useVehicle = (vehicleId: string | undefined) => {
  return useQuery({
    queryKey: ['vehicles', vehicleId],
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
    enabled: !!vehicleId,
    staleTime: 5 * 60 * 1000,
  });
};
