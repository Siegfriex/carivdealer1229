/**
 * Settlement Entity Types
 * ERD 스키마 기반 타입 정의
 */

import { Timestamp } from 'firebase/firestore';

export type SettlementStatus = 'pending' | 'completed' | 'paid';

export type SaleMethod = 'auction' | 'general';

export interface Settlement {
  id: string;
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

export type CreateSettlementInput = Omit<Settlement, 'id' | 'createdAt'>;
export type UpdateSettlementInput = Partial<Omit<Settlement, 'id' | 'createdAt'>>;
