/**
 * 경매 엔티티 Zod 스키마 (런타임 검증)
 */

import { z } from 'zod';
import { Timestamp } from 'firebase/firestore';

/** Firestore Timestamp 검증용 */
const timestampSchema = z.custom<Timestamp>(
  (val) => val instanceof Timestamp,
  { message: 'Invalid Timestamp' }
);

export const auctionStatusSchema = z.enum(['Active', 'Ended', 'Sold']);

export const auctionSchema = z.object({
  id: z.string(),
  vehicleId: z.string(),
  startPrice: z.number().positive(),
  buyNowPrice: z.number().positive().optional(),
  currentHighestBid: z.number().positive().optional(),
  status: auctionStatusSchema,
  endTime: timestampSchema.optional(),
  vehicleOwnerId: z.string().optional(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema.optional(),
  endedAt: timestampSchema.optional(),
}).refine(
  (data) => !data.buyNowPrice || data.buyNowPrice > data.startPrice,
  { message: 'Buy now price must be greater than start price' }
);

/** auctionSchema 추론 타입 */
export type AuctionSchemaType = z.infer<typeof auctionSchema>;
