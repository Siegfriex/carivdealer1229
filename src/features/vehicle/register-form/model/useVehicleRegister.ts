/**
 * useVehicleRegister Hook
 * 차량 등록 (useMutation)
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, addDoc, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '@/shared/config/firebase';
import { vehicleSchema } from '@/entities/vehicle/model/schema';
import type { Vehicle, CreateVehicleInput } from '@/entities/vehicle/model/types';

/**
 * 차량 등록 뮤테이션 훅
 * @description Firestore vehicles 컬렉션에 addDoc, 성공 시 vehicles 쿼리 무효화
 * @returns useMutation (mutationFn: CreateVehicleInput → Vehicle)
 */
export const useVehicleRegister = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateVehicleInput): Promise<Vehicle> => {
      const vehicleData = {
        ...input,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'vehicles'), vehicleData);
      
      // 생성된 차량 데이터 반환 (Timestamp는 현재 시간으로)
      const createdVehicle = {
        id: docRef.id,
        ...input,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      };

      // Zod로 검증
      return vehicleSchema.parse(createdVehicle);
    },
    onSuccess: () => {
      // 차량 목록 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};
