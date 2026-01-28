/**
 * Auction Entity Types
 * ERD 스키마 기반 타입 정의
 */

import { Timestamp } from 'firebase/firestore';

export type AuctionStatus = 'Active' | 'Ended' | 'Sold';

export interface Auction {
  id: string;
  platform_id?: string;
  vehicleId: string;
  startPrice: number;
  buyNowPrice?: number;
  currentHighestBid?: number;  // 화면 비노출 (Blind Auction)
  status: AuctionStatus;
  endTime?: Timestamp;
  vehicleOwnerId?: string;
  createdAt: Timestamp;
  updatedAt?: Timestamp;
  endedAt?: Timestamp;
}

export type CreateAuctionInput = Omit<Auction, 'id' | 'createdAt' | 'updatedAt' | 'endedAt'>;
export type UpdateAuctionInput = Partial<Omit<Auction, 'id' | 'createdAt'>>;
