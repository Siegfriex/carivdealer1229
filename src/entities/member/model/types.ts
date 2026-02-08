/**
 * Member Entity Types
 * ERD 스키마 기반 타입 정의
 */

import { Timestamp } from 'firebase/firestore';

export type MemberRole = 'DEALER' | 'INSPECTOR' | 'ADMIN';

export type MemberStatus = 'active' | 'suspended' | 'withdrawn';

export interface BusinessInfo {
  companyName: string;
  businessRegNo: string;
  representativeName: string;
  verified: boolean;
  verifiedAt?: Timestamp;
}

export interface Member {
  id: string;
  email: string;
  password: string;  // bcrypt hash
  dealerName: string;
  phone: string;
  role?: MemberRole;
  businessInfo?: BusinessInfo;
  status?: MemberStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type CreateMemberInput = Omit<Member, 'id' | 'createdAt' | 'updatedAt' | 'status'>;
export type UpdateMemberInput = Partial<Omit<Member, 'id' | 'createdAt' | 'password'>>;
