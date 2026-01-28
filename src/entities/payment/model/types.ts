import { Timestamp } from 'firebase/firestore';

/**
 * Payment (결제) 엔티티 타입 정의
 * 원본 ERD: erd/IMG_3923.png
 */

export interface Payment {
  id: string;
  order_id: string;
  amount: number;
  method: PaymentMethod;
  status: PaymentStatus;
  pg_provider?: string;
  pg_transaction_id?: string;
  paid_at?: Timestamp;
  refunded_at?: Timestamp;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export type PaymentMethod = 'CARD' | 'BANK_TRANSFER' | 'VIRTUAL_ACCOUNT' | 'ESCROW';

export type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'PARTIAL_REFUND';

export const PAYMENT_METHOD_LABELS: Record<PaymentMethod, string> = {
  CARD: '신용카드',
  BANK_TRANSFER: '계좌이체',
  VIRTUAL_ACCOUNT: '가상계좌',
  ESCROW: '에스크로',
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  PENDING: '결제 대기',
  COMPLETED: '결제 완료',
  FAILED: '결제 실패',
  REFUNDED: '환불 완료',
  PARTIAL_REFUND: '부분 환불',
};
