/**
 * Logistics Entity Types
 * ERD 스키마 기반 타입 정의
 */

import { Timestamp } from 'firebase/firestore';

export type LogisticsStatus = 'scheduled' | 'dispatched' | 'in_transit' | 'completed';

export interface Logistics {
  id: string;
  platform_id?: string;
  vehicleId: string;
  scheduleDate: string;
  scheduleTime: string;
  departureAddress: string;
  destinationAddress: string;
  status: LogisticsStatus;
  driverName?: string;
  driverPhone?: string;
  dispatchedAt?: Timestamp;
  handoverTimestamp?: Timestamp;
  pin?: string;  // 6자리 숫자 (암호화)
  specialNotes?: string;
  createdAt: Timestamp;
}

export type CreateLogisticsInput = Omit<
  Logistics,
  'id' | 'createdAt' | 'dispatchedAt' | 'handoverTimestamp'
>;
export type UpdateLogisticsInput = Partial<Omit<Logistics, 'id' | 'createdAt'>>;
