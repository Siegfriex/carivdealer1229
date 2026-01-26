/**
 * Vehicle Entity Zod Schemas
 * 런타임 데이터 검증
 * 
 * 참조: docs/DATABASE_ERD_SCHEMA.md
 */

import { z } from 'zod';
import { Timestamp } from 'firebase/firestore';

/**
 * Firestore Timestamp Zod Schema
 */
const timestampSchema = z.custom<Timestamp>(
  (val) => val instanceof Timestamp,
  { message: 'Invalid Timestamp' }
);

/**
 * 차량 상태 스키마
 */
export const vehicleStatusSchema = z.enum([
  'draft',
  'inspection',
  'bidding',
  'active_sale',
  'sold',
  'pending_settlement',
  'completed',
]);

/**
 * 연료 종류 스키마
 */
export const fuelTypeSchema = z.enum(['가솔린', '디젤', '하이브리드', '전기']);

/**
 * 일반 판매 제안 스키마
 */
export const offerSchema = z.object({
  id: z.string(),
  bidderName: z.string().min(1),
  amount: z.string().regex(/^\d+$/, 'Amount must be a number string'),
  date: z.string(),
  status: z.enum(['pending', 'accepted', 'rejected']),
});

/**
 * OCR 메타데이터 스키마
 */
export const ocrMetadataSchema = z.object({
  extractedAt: timestampSchema,
  ocrVersion: z.string().optional(),
  confidence: z.number().min(0).max(100).optional(),
});

/**
 * 공공데이터 메타데이터 스키마
 */
export const publicDataMetadataSchema = z.object({
  lastQueriedAt: timestampSchema.optional(),
  queryParams: z
    .object({
      registYy: z.string().optional(),
      registMt: z.string().optional(),
      useFuelCode: z.string().optional(),
    })
    .optional(),
});

/**
 * 차량 스키마
 */
export const vehicleSchema = z.object({
  id: z.string(),
  status: vehicleStatusSchema,
  plateNumber: z.string().regex(/^\d{2}[가-힣]\s?\d{4}$/, 'Invalid plate number format'),
  vin: z.string().length(17, 'VIN must be 17 characters').optional(),
  manufacturer: z.string().min(1),
  modelName: z.string().min(1),
  modelYear: z.string().regex(/^\d{4}$/, 'Year must be YYYY format'),
  mileage: z.string().regex(/^\d+$/, 'Mileage must be a number'),
  fuelType: fuelTypeSchema.optional(),
  color: z.string().optional(),
  registrationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  price: z.string().regex(/^\d+$/).optional(),
  highestBid: z.string().regex(/^\d+$/).optional(),
  thumbnailUrl: z.string().url().optional(),
  location: z.string().optional(),
  endTime: z.string().optional(),
  ownerId: z.string().optional(),
  inspectionId: z.string().optional(),
  auctionId: z.string().optional(),
  offers: z.array(offerSchema).optional(),
  ocrMetadata: ocrMetadataSchema.optional(),
  publicDataMetadata: publicDataMetadataSchema.optional(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

/**
 * 타입 추론 (Zod → TypeScript)
 */
export type VehicleSchemaType = z.infer<typeof vehicleSchema>;
