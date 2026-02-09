/**
 * useInspections Hook
 * 검차 목록 조회
 */

import { useQuery } from '@tanstack/react-query';
import { collection, query, where, orderBy, getDocs, Query } from 'firebase/firestore';
import { db } from '@/shared/config/firebase';
import { inspectionSchema } from '@/entities/inspection/model/schema';
import type { Inspection, InspectionStatus } from '@/entities/inspection/model/types';

/** 검차 목록 조회 옵션 */
interface UseInspectionsOptions {
  vehicleId?: string;
  evaluatorId?: string;
  status?: InspectionStatus;
}

/**
 * 검차 목록 조회 쿼리 훅
 * @description Firestore inspections 컬렉션 조회, vehicleId/evaluatorId/status 필터, createdAt 내림차순
 * @param options - vehicleId, evaluatorId, status (선택)
 * @returns useQuery<Inspection[]>
 */
export const useInspections = (options: UseInspectionsOptions = {}) => {
  return useQuery({
    queryKey: ['inspections', options.vehicleId, options.evaluatorId, options.status],
    queryFn: async (): Promise<Inspection[]> => {
      let q: Query = collection(db, 'inspections');

      if (options.vehicleId) {
        q = query(q as Query, where('vehicleId', '==', options.vehicleId));
      }

      if (options.evaluatorId) {
        q = query(q as Query, where('evaluatorId', '==', options.evaluatorId));
      }

      if (options.status) {
        q = query(q as Query, where('status', '==', options.status));
      }

      q = query(q as Query, orderBy('createdAt', 'desc'));

      const snapshot = await getDocs(q);
      return snapshot.docs.map((doc) => {
        const data = { id: doc.id, ...doc.data() };
        return inspectionSchema.parse(data);
      });
    },
  });
};
