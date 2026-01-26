/**
 * Vehicle Entity Types
 * ERD 스키마 기반 타입 정의
 * 
 * 참조: docs/DATABASE_ERD_SCHEMA.md
 */

import { Timestamp } from 'firebase/firestore';

/**
 * 차량 상태
 */
export type VehicleStatus =
  | 'draft'                 // 임시 저장
  | 'inspection'            // 검차 진행 중
  | 'bidding'               // 경매 진행 중
  | 'active_sale'           // 일반 판매
  | 'sold'                  // 판매 완료
  | 'pending_settlement'    // 정산 대기
  | 'completed';            // 거래 완료

/**
 * 연료 종류
 */
export type FuelType = '가솔린' | '디젤' | '하이브리드' | '전기';

/**
 * 일반 판매 제안
 */
export interface Offer {
  id: string;
  bidderName: string;
  amount: string;
  date: string;
  status: 'pending' | 'accepted' | 'rejected';
}

/**
 * OCR 메타데이터
 */
export interface OcrMetadata {
  extractedAt: Timestamp;
  ocrVersion?: string;
  confidence?: number;  // 0-100
}

/**
 * 공공데이터 조회 메타데이터
 */
export interface PublicDataMetadata {
  lastQueriedAt?: Timestamp;
  queryParams?: {
    registYy?: string;      // 등록년
    registMt?: string;      // 등록월
    useFuelCode?: string;   // 사용연료코드
  };
}

/**
 * 차량 엔티티
 */
export interface Vehicle {
  id: string;
  status: VehicleStatus;
  plateNumber: string;
  vin?: string;
  manufacturer: string;
  modelName: string;
  modelYear: string;
  mileage: string;
  fuelType?: FuelType;
  color?: string;
  registrationDate?: string;
  price?: string;
  highestBid?: string;
  thumbnailUrl?: string;
  location?: string;
  endTime?: string;
  ownerId?: string;
  inspectionId?: string;
  auctionId?: string;
  offers?: Offer[];
  ocrMetadata?: OcrMetadata;
  publicDataMetadata?: PublicDataMetadata;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * 차량 생성 입력 (ID, timestamps 제외)
 */
export type CreateVehicleInput = Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>;

/**
 * 차량 업데이트 입력 (ID, createdAt 제외)
 */
export type UpdateVehicleInput = Partial<Omit<Vehicle, 'id' | 'createdAt'>>;
