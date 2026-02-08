import { Timestamp } from 'firebase/firestore';

/**
 * Seller Docs (판매자 서류) 엔티티 타입 정의
 * 원본 ERD: erd/IMG_3923.png
 */

export interface SellerDocs {
  id: string;
  platform_id?: string;
  seller_id: string;
  doc_type: DocType;
  file_url: string;
  status: DocStatus;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export type DocType = 'BUSINESS_LICENSE' | 'DEALER_LICENSE' | 'ID_CARD';

export type DocStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export const DOC_TYPE_LABELS: Record<DocType, string> = {
  BUSINESS_LICENSE: '사업자등록증',
  DEALER_LICENSE: '매매상사 면허',
  ID_CARD: '신분증',
};

export const DOC_STATUS_LABELS: Record<DocStatus, string> = {
  PENDING: '대기중',
  APPROVED: '승인',
  REJECTED: '거절',
};
