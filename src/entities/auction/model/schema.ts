/**
 * Auction Entity Zod Schemas
 */

import { z } from 'zod';
import { Timestamp } from 'firebase/firestore';

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

export type AuctionSchemaType = z.infer<typeof auctionSchema>;
