import { Timestamp } from 'firebase/firestore';

/**
 * Order (주문) 엔티티 타입 정의
 * 원본 ERD: erd/IMG_3923.png
 */

export interface Order {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  vehicle_id: string;
  order_type: OrderType;
  total_price: number;
  status: OrderStatus;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export type OrderType = 'AUCTION' | 'GENERAL' | 'BUY_NOW';

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export const ORDER_TYPE_LABELS: Record<OrderType, string> = {
  AUCTION: '경매 낙찰',
  GENERAL: '일반 거래',
  BUY_NOW: '즉시 구매',
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: '대기중',
  CONFIRMED: '확정',
  CANCELLED: '취소',
  COMPLETED: '완료',
};
