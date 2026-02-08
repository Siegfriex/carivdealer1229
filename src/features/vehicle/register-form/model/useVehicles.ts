/**
 * useVehicles Hook
 * 차량 목록 조회 (Firestore Query). 개발 시 컬렉션 비어 있으면 목업 반환.
 */

import { useQuery } from '@tanstack/react-query';
import { Timestamp, collection, query, where, orderBy, getDocs, Query } from 'firebase/firestore';
import { db } from '@/shared/config/firebase';
import { vehicleSchema } from '@/entities/vehicle/model/schema';
import type { Vehicle, VehicleStatus } from '@/entities/vehicle/model/types';

interface UseVehiclesOptions {
  ownerId?: string;
  status?: VehicleStatus[];
}

const now = () => Timestamp.fromDate(new Date());

/** 개발용 목업: Firestore에 데이터 없을 때 차량목록/사이드바 필터 확인용 */
function getMockVehicles(): Vehicle[] {
  return [
    { id: 'mock-1', status: 'draft', plateNumber: '12가 3456', manufacturer: '현대', modelName: '아반떼', modelYear: '2022', mileage: '32000', createdAt: now(), updatedAt: now() },
    { id: 'mock-2', status: 'inspection', plateNumber: '33바 3333', manufacturer: '기아', modelName: '카니발', modelYear: '2023', mileage: '10000', createdAt: now(), updatedAt: now() },
    { id: 'mock-3', status: 'active_sale', plateNumber: '82가 1923', manufacturer: '현대', modelName: '포터2', modelYear: '2018', mileage: '146000', createdAt: now(), updatedAt: now() },
    { id: 'mock-4', status: 'bidding', plateNumber: '55라 5555', manufacturer: '현대', modelName: '그랜저', modelYear: '2019', mileage: '82000', createdAt: now(), updatedAt: now() },
    { id: 'mock-5', status: 'sold', plateNumber: '12나 7890', manufacturer: '현대', modelName: 'G70', modelYear: '2020', mileage: '55000', createdAt: now(), updatedAt: now() },
    { id: 'mock-6', status: 'pending_settlement', plateNumber: '98다 1111', manufacturer: '기아', modelName: 'K5', modelYear: '2021', mileage: '40000', createdAt: now(), updatedAt: now() },
    { id: 'mock-7', status: 'completed', plateNumber: '11하 2222', manufacturer: '현대', modelName: '투싼', modelYear: '2020', mileage: '62000', createdAt: now(), updatedAt: now() },
  ];
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
      let vehicles = snapshot.docs.map((doc) => {
        const data = { id: doc.id, ...doc.data() };
        return vehicleSchema.parse(data);
      });

      if (import.meta.env.DEV && vehicles.length === 0) {
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
