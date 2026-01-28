import { Timestamp } from 'firebase/firestore';

/**
 * CarsOfKorea 연동 엔티티 타입 정의
 * 외부 플랫폼(카스오브코리아) 연동용
 * 원본 ERD: erd/IMG_3923.png
 */

export type SyncStatus = 'SYNCED' | 'PENDING' | 'FAILED';

export interface CarsOfKoreaVehicle {
  id: string;
  platform_id?: string;
  external_id: string;
  vehicle_id: string;
  sync_status: SyncStatus;
  last_synced_at: Timestamp;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface CarsOfKoreaListing {
  id: string;
  platform_id?: string;
  external_id: string;
  listing_id: string;
  sync_status: SyncStatus;
  last_synced_at: Timestamp;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface CarsOfKoreaAuction {
  id: string;
  platform_id?: string;
  external_id: string;
  auction_id: string;
  sync_status: SyncStatus;
  last_synced_at: Timestamp;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export interface CarsOfKoreaAuctionBid {
  id: string;
  platform_id?: string;
  external_id: string;
  auction_bid_id: string;
  sync_status: SyncStatus;
  last_synced_at: Timestamp;
  created_at: Timestamp;
}

export const SYNC_STATUS_LABELS: Record<SyncStatus, string> = {
  SYNCED: '동기화 완료',
  PENDING: '대기중',
  FAILED: '실패',
};
