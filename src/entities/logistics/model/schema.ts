/**
 * Logistics Entity Zod Schemas
 */

import { z } from 'zod';
import { Timestamp } from 'firebase/firestore';

const timestampSchema = z.custom<Timestamp>(
  (val) => val instanceof Timestamp,
  { message: 'Invalid Timestamp' }
);

export const logisticsStatusSchema = z.enum([
  'scheduled',
  'dispatched',
  'in_transit',
  'completed',
]);

export const logisticsSchema = z.object({
  id: z.string(),
  vehicleId: z.string(),
  scheduleDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  scheduleTime: z.string().regex(/^\d{2}:\d{2}$/),
  departureAddress: z.string().min(1),
  destinationAddress: z.string().min(1),
  status: logisticsStatusSchema,
  driverName: z.string().optional(),
  driverPhone: z.string().regex(/^010-\d{4}-\d{4}$/).optional(),
  dispatchedAt: timestampSchema.optional(),
  handoverTimestamp: timestampSchema.optional(),
  pin: z.string().regex(/^\d{6}$/).optional(),
  specialNotes: z.string().optional(),
  createdAt: timestampSchema,
});

export type LogisticsSchemaType = z.infer<typeof logisticsSchema>;
