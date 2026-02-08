/**
 * Trade Entity Types
 * ERD 스키마 기반 타입 정의
 */

import { Timestamp } from 'firebase/firestore';

export type TradeStatus = 'pending' | 'accepted' | 'rejected' | 'completed';

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

export type CreateTradeInput = Omit<Trade, 'id' | 'createdAt' | 'acceptedAt' | 'rejectedAt'>;
export type UpdateTradeInput = Partial<Omit<Trade, 'id' | 'createdAt'>>;
