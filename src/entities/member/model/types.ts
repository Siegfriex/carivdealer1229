/**
 * 회원(Member) 엔티티 타입
 * ERD 스키마 기반.
 */

import { Timestamp } from 'firebase/firestore';

/** 회원 역할 */
export type MemberRole = 'DEALER' | 'INSPECTOR' | 'ADMIN';

/** 회원 상태 */
export type MemberStatus = 'active' | 'suspended' | 'withdrawn';

/** 사업자 정보 */
export interface BusinessInfo {
  companyName: string;
  businessRegNo: string;
  representativeName: string;
  verified: boolean;
  verifiedAt?: Timestamp;
}

/** 회원 엔티티 */
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

/** 회원 생성 입력 */
export type CreateMemberInput = Omit<Member, 'id' | 'createdAt' | 'updatedAt' | 'status'>;
/** 회원 수정 입력 (부분, password 제외 가능) */
export type UpdateMemberInput = Partial<Omit<Member, 'id' | 'createdAt' | 'password'>>;
