/**
 * 정산(Settlement) 엔티티 타입
 * ERD 스키마 기반.
 */

import { Timestamp } from 'firebase/firestore';

/** 정산 상태 */
export type SettlementStatus = 'pending' | 'completed' | 'paid';

/** 판매 방식 (경매/일반) */
export type SaleMethod = 'auction' | 'general';

/** 정산 엔티티 */
export interface Settlement {
  id: string;
  platform_id?: string;
  vehicleId: string;
  dealerId?: string;
  salePrice: number;
  settlementAmount: number;
  platformFee: number;
  platformFeeRate: number;
  vatRefund: number;
  vatRefundRate: number;
  totalRefund: number;
  finalAmount: number;
  logisticsFee?: number;
  inspectionFee?: number;
  settlementDate: string;
  buyerName: string;
  saleMethod: SaleMethod;
  bankAccount: string;
  accountHolder: string;
  settlementStatus: SettlementStatus;
  createdAt: Timestamp;
}

/** 정산 생성 입력 */
/** 정산 생성 입력 */
export type CreateSettlementInput = Omit<Settlement, 'id' | 'createdAt'>;
/** 정산 수정 입력 (부분) */
export type UpdateSettlementInput = Partial<Omit<Settlement, 'id' | 'createdAt'>>;
