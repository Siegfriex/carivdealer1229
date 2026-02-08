/**
 * Member Entity Zod Schemas
 */

import { z } from 'zod';
import { Timestamp } from 'firebase/firestore';

const timestampSchema = z.custom<Timestamp>(
  (val) => val instanceof Timestamp,
  { message: 'Invalid Timestamp' }
);

export const memberRoleSchema = z.enum(['DEALER', 'INSPECTOR', 'ADMIN']);

export const memberStatusSchema = z.enum(['active', 'suspended', 'withdrawn']);

export const businessInfoSchema = z.object({
  companyName: z.string().min(1),
  businessRegNo: z.string().regex(/^\d{3}-\d{2}-\d{5}$/, 'Invalid business registration number'),
  representativeName: z.string().min(1),
  verified: z.boolean(),
  verifiedAt: timestampSchema.optional(),
});

export const memberSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  password: z.string().min(8),  // bcrypt hash는 실제로 60자
  dealerName: z.string().min(2),
  phone: z.string().regex(/^010-\d{4}-\d{4}$/, 'Invalid phone format'),
  role: memberRoleSchema.optional(),
  businessInfo: businessInfoSchema.optional(),
  status: memberStatusSchema.optional(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

export type MemberSchemaType = z.infer<typeof memberSchema>;
