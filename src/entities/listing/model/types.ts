import { Timestamp } from 'firebase/firestore';

/**
 * Listing (매물 등록) 엔티티 타입 정의
 * 원본 ERD: erd/IMG_3923.png
 */

export interface Listing {
  id: string;
  vehicle_id: string;
  seller_id: string;
  sale_type: SaleType;
  asking_price: number;
  min_price?: number;
  buy_now_price?: number;
  status: ListingStatus;
  view_count: number;
  like_count: number;
  expires_at?: Timestamp;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export type SaleType = 'AUCTION' | 'GENERAL';

export type ListingStatus = 'ACTIVE' | 'SOLD' | 'CANCELLED' | 'EXPIRED';

export const SALE_TYPE_LABELS: Record<SaleType, string> = {
  AUCTION: '경매',
  GENERAL: '일반 판매',
};

export const LISTING_STATUS_LABELS: Record<ListingStatus, string> = {
  ACTIVE: '판매중',
  SOLD: '판매완료',
  CANCELLED: '취소',
  EXPIRED: '만료',
};
