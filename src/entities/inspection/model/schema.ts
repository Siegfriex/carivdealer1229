/**
 * 검차 엔티티 Zod 스키마 (런타임 검증)
 */

import { z } from 'zod';
import { Timestamp } from 'firebase/firestore';

/** Firestore Timestamp 검증용 */
const timestampSchema = z.custom<Timestamp>(
  (val) => val instanceof Timestamp,
  { message: 'Invalid Timestamp' }
);

export const inspectionStatusSchema = z.enum(['pending', 'assigned', 'in_progress', 'completed']);

export const locationSchema = z.object({
  address: z.string(),
  coordinates: z
    .object({
      lat: z.number(),
      lng: z.number(),
    })
    .nullable(),
});

export const evaluatorSchema = z.object({
  name: z.string(),
  id: z.string(),
  rating: z.number().min(0).max(5),
  phone: z.string(),
});

export const inspectionConditionSchema = z.object({
  exterior: z.string(),
  interior: z.string(),
  mechanic: z.string(),
  frame: z.string(),
});

export const aiAnalysisSchema = z.object({
  pros: z.array(z.string()),
  cons: z.array(z.string()),
  marketVerdict: z.string(),
});

export const mediaItemSchema = z.object({
  type: z.enum(['image', 'video']),
  url: z.string().url(),
  label: z.string(),
});

export const mediaCategorySchema = z.object({
  category: z.string(),
  count: z.number().min(0),
  items: z.array(mediaItemSchema),
});

export const inspectionReportSchema = z.object({
  evaluator: evaluatorSchema,
  summary: z.string(),
  score: z.string(),
  condition: inspectionConditionSchema,
  aiAnalysis: aiAnalysisSchema,
  media: z.array(mediaCategorySchema),
});

export const mediaMetadataSchema = z.object({
  totalFiles: z.number().min(0),
  totalSize: z.number().min(0),
  lastUploadedAt: timestampSchema.optional(),
});

export const inspectionSchema = z.object({
  id: z.string(),
  vehicleId: z.string(),
  preferredDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  preferredTime: z.string().regex(/^\d{2}:\d{2}$/),
  location: locationSchema.optional(),
  status: inspectionStatusSchema,
  evaluatorId: z.string().optional(),
  evaluatorName: z.string().optional(),
  assignedAt: timestampSchema.optional(),
  completedAt: timestampSchema.optional(),
  result: inspectionReportSchema.optional(),
  mediaMetadata: mediaMetadataSchema.optional(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

export type InspectionSchemaType = z.infer<typeof inspectionSchema>;
