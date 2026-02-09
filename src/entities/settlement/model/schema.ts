/**
 * 정산 엔티티 Zod 스키마 (런타임 검증)
 */

import { z } from 'zod';
import { Timestamp } from 'firebase/firestore';

/** Firestore Timestamp 검증용 */
const timestampSchema = z.custom<Timestamp>(
  (val) => val instanceof Timestamp,
  { message: 'Invalid Timestamp' }
);

/** 정산 상태 스키마 */
export const settlementStatusSchema = z.enum(['pending', 'completed', 'paid']);

/** 판매 방식 스키마 */
export const saleMethodSchema = z.enum(['auction', 'general']);

/** 정산 스키마 */
export const settlementSchema = z.object({
  id: z.string(),
  vehicleId: z.string(),
  dealerId: z.string().optional(),
  salePrice: z.number().positive(),
  settlementAmount: z.number().positive(),
  platformFee: z.number().nonnegative(),
  platformFeeRate: z.number().min(0).max(100),
  vatRefund: z.number().nonnegative(),
  vatRefundRate: z.number().min(0).max(100),
  totalRefund: z.number().nonnegative(),
  finalAmount: z.number().positive(),
  logisticsFee: z.number().nonnegative().optional(),
  inspectionFee: z.number().nonnegative().optional(),
  settlementDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  buyerName: z.string().min(1),
  saleMethod: saleMethodSchema,
  bankAccount: z.string().min(1),
  accountHolder: z.string().min(1),
  settlementStatus: settlementStatusSchema,
  createdAt: timestampSchema,
});

/** settlementSchema 추론 타입 */
/** settlementSchema 추론 타입 */
export type SettlementSchemaType = z.infer<typeof settlementSchema>;
