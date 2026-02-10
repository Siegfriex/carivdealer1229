/**
 * 검차 목록 페이지용 목업 데이터 (Figma 1202-6685)
 * status별: pending(매칭중), assigned(이동중), in_progress(검차중), completed(완료)
 */

import type { Inspection, InspectionStatus } from '@/entities/inspection/model/types';

const mockTimestamp = (date: Date) => ({
  seconds: Math.floor(date.getTime() / 1000),
  toDate: () => date,
});

export interface InspectionWithVehicle extends Inspection {
  vehiclePlateNumber?: string;
  vehicleModelName?: string;
  vehicleModelYear?: string;
  /** Figma 표시용 일련번호 (예: 12345) */
  serialNumber?: string;
}

export const MOCK_INSPECTIONS: InspectionWithVehicle[] = [
  {
    id: 'insp-1',
    vehicleId: 'v-1',
    preferredDate: '2026-02-05',
    preferredTime: '14:00',
    status: 'pending' as InspectionStatus,
    vehiclePlateNumber: '33바 3333',
    vehicleModelName: 'Carnival KA4',
    vehicleModelYear: '2022',
    serialNumber: '12341',
    createdAt: mockTimestamp(new Date('2026-01-28')) as Inspection['createdAt'],
    updatedAt: mockTimestamp(new Date('2026-01-28')) as Inspection['updatedAt'],
  },
  {
    id: 'insp-2',
    serialNumber: '12345',
    vehicleId: 'v-2',
    preferredDate: '2025/01/01',
    preferredTime: '10:00',
    status: 'assigned' as InspectionStatus,
    evaluatorName: '김평가',
    vehiclePlateNumber: '123가 4567',
    vehicleModelName: 'G70 3T 스포츠 엘리트',
    vehicleModelYear: '2020',
    location: { address: '인천광역시 서구 봉수대로 158', coordinates: null },
    createdAt: mockTimestamp(new Date('2026-01-27')) as Inspection['createdAt'],
    updatedAt: mockTimestamp(new Date('2026-01-28')) as Inspection['updatedAt'],
  },
  {
    id: 'insp-3',
    vehicleId: 'v-3',
    serialNumber: '12346',
    preferredDate: '2025/01/01',
    preferredTime: '10:00',
    status: 'in_progress' as InspectionStatus,
    evaluatorName: '이검차',
    vehiclePlateNumber: '123가 4567',
    vehicleModelName: 'G70 3T 스포츠 엘리트',
    vehicleModelYear: '2020',
    location: { address: '인천광역시 서구 봉수대로 158', coordinates: null },
    createdAt: mockTimestamp(new Date('2026-01-26')) as Inspection['createdAt'],
    updatedAt: mockTimestamp(new Date('2026-01-28')) as Inspection['updatedAt'],
  },
  {
    id: 'insp-4',
    vehicleId: 'v-4',
    serialNumber: '12347',
    preferredDate: '2026-02-01',
    preferredTime: '11:00',
    status: 'completed' as InspectionStatus,
    evaluatorName: '박평가',
    vehiclePlateNumber: '55라 5555',
    vehicleModelName: 'Grandeur IG',
    vehicleModelYear: '2019',
    location: { address: '인천광역시 서구 봉수대로 158', coordinates: null },
    createdAt: mockTimestamp(new Date('2026-01-25')) as Inspection['createdAt'],
    updatedAt: mockTimestamp(new Date('2026-01-27')) as Inspection['updatedAt'],
  },
];
