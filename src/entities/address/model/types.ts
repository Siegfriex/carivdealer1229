import { Timestamp } from 'firebase/firestore';

/**
 * Address (주소) 엔티티 타입 정의
 * 원본 ERD: erd/IMG_3923.png
 */

export interface Address {
  id: string;
  user_id: string;
  address_type: AddressType;
  postal_code: string;
  address1: string;
  address2?: string;
  is_default: boolean;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export type AddressType = 'HOME' | 'WORK' | 'DEALER';

export const ADDRESS_TYPE_LABELS: Record<AddressType, string> = {
  HOME: '자택',
  WORK: '직장',
  DEALER: '매매상사',
};
