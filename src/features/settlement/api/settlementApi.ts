/**
 * 정산 API
 * GET /settlements, GET /settlements/:id 미구현. Mock 폴백.
 * CarivDealer_API_ERD_Mapping §정산. P2 Zod 런타임 검증.
 */

import { z } from 'zod';
import {
  MOCK_SETTLEMENTS,
  MOCK_SETTLEMENT_DETAILS,
  type MockSettlementItem,
  type MockSettlementDetail,
} from '@/shared/api/mockLists';

export type SettlementStatusFilter = 'all' | 'pending' | 'completed';

const mockSettlementItemSchema = z.object({
  id: z.string(),
  vehicleId: z.string(),
  plateNumber: z.string(),
  modelName: z.string(),
  salePrice: z.number(),
  settlementAmount: z.number(),
  platformFee: z.number(),
  totalRefund: z.number(),
  settlementDate: z.string(),
  settlementStatus: z.enum(['pending', 'completed', 'paid']),
});

const mockSettlementDetailSchema = z.object({
  id: z.string(),
  vehicleId: z.string(),
  plateNumber: z.string(),
  modelName: z.string(),
  manufacturer: z.string(),
  modelYear: z.string(),
  salePrice: z.number(),
  settlementAmount: z.number(),
  platformFee: z.number(),
  platformFeeRate: z.number(),
  vatRefund: z.number(),
  vatRefundRate: z.number(),
  totalRefund: z.number(),
  finalAmount: z.number(),
  settlementDate: z.string(),
  buyerName: z.string(),
  saleMethod: z.enum(['auction', 'general']),
  logisticsFee: z.number().optional(),
  inspectionFee: z.number().optional(),
  bankAccount: z.string().optional(),
  accountHolder: z.string().optional(),
  settlementStatus: z.enum(['pending', 'completed', 'paid']),
});

/** 정산 목록 조회 (Mock). API 구현 시 apiClient 호출로 교체 */
export const getSettlements = async (filter: SettlementStatusFilter = 'all'): Promise<MockSettlementItem[]> => {
  await new Promise((r) => setTimeout(r, 100));
  let raw: MockSettlementItem[];
  if (filter === 'all') raw = [...MOCK_SETTLEMENTS];
  else if (filter === 'completed') {
    raw = MOCK_SETTLEMENTS.filter((s) => s.settlementStatus === 'completed' || s.settlementStatus === 'paid');
  } else {
    raw = MOCK_SETTLEMENTS.filter((s) => s.settlementStatus === 'pending');
  }
  return z.array(mockSettlementItemSchema).parse(raw);
};

/** 정산 상세 조회 (Mock). API 구현 시 apiClient 호출로 교체 */
export const getSettlement = async (id: string): Promise<MockSettlementDetail | null> => {
  await new Promise((r) => setTimeout(r, 80));
  const raw = MOCK_SETTLEMENT_DETAILS[id] ?? null;
  if (!raw) return null;
  return mockSettlementDetailSchema.parse(raw);
};
