/**
 * 거래(Trade) 엔티티 타입
 * ERD 스키마 기반.
 */

import { Timestamp } from 'firebase/firestore';

/** 거래(제안) 상태 */
export type TradeStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

/** 거래 엔티티 */
export interface Trade {
  id: string;
  platform_id?: string;
  vehicleId: string;
  buyerId?: string;
  sellerId?: string;
  price: number;
  status: TradeStatus;
  expiresAt?: Timestamp;
  acceptedAt?: Timestamp;
  rejectedAt?: Timestamp;
  createdAt: Timestamp;
}

/** 거래 생성 입력 */
export type CreateTradeInput = Omit<Trade, 'id' | 'createdAt' | 'acceptedAt' | 'rejectedAt'>;
/** 거래 수정 입력 (부분) */
export type UpdateTradeInput = Partial<Omit<Trade, 'id' | 'createdAt'>>;
