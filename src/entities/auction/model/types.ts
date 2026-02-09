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

/** 경매 생성 입력 (id·타임스탬프 제외) */
export type CreateAuctionInput = Omit<Auction, 'id' | 'createdAt' | 'updatedAt' | 'endedAt'>;
/** 경매 수정 입력 (id·createdAt 제외, 부분) */
export type UpdateAuctionInput = Partial<Omit<Auction, 'id' | 'createdAt'>>;
