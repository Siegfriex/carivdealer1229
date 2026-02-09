/**
 * 경매(Auction) Zod 스키마 테스트
 * auctionSchema 유효/무효·즉시구매가 검증을 검증한다.
 */

import { describe, test, expect } from 'vitest';
import { auctionSchema } from './schema';
import { Timestamp } from 'firebase/firestore';

describe('Auction Schema Validation', () => {
  test('유효한 경매 데이터 검증 성공', () => {
    const validAuction = {
      id: 'auc-001',
      vehicleId: 'v-001',
      startPrice: 2800,
      buyNowPrice: 3200,
      status: 'Active',
      createdAt: Timestamp.now(),
    };

    expect(() => auctionSchema.parse(validAuction)).not.toThrow();
  });

  test('즉시구매가 > 시작가 검증', () => {
    const invalidAuction = {
      id: 'auc-001',
      vehicleId: 'v-001',
      startPrice: 3000,
      buyNowPrice: 2800,  // 시작가보다 낮음
      status: 'Active',
      createdAt: Timestamp.now(),
    };

    expect(() => auctionSchema.parse(invalidAuction)).toThrow(
      'Buy now price must be greater than start price'
    );
  });

  test('양수 가격 검증', () => {
    const negativePrice = {
      id: 'auc-001',
      vehicleId: 'v-001',
      startPrice: -2800,
      status: 'Active',
      createdAt: Timestamp.now(),
    };

    expect(() => auctionSchema.parse(negativePrice)).toThrow();
  });
});
