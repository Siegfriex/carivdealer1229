import { Timestamp } from 'firebase/firestore';

/**
 * Review (리뷰) 엔티티 타입 정의
 * 원본 ERD: erd/IMG_3923.png
 */

export interface Review {
  id: string;
  platform_id?: string;
  order_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  content?: string;
  created_at: Timestamp;
  updated_at: Timestamp;
}

export const RATING_LABELS: Record<number, string> = {
  1: '매우 불만족',
  2: '불만족',
  3: '보통',
  4: '만족',
  5: '매우 만족',
};
