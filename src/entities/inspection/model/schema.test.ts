/**
 * Inspection Schema Tests
 */

import { describe, test, expect } from 'vitest';
import { inspectionSchema, inspectionStatusSchema } from './schema';
import { Timestamp } from 'firebase/firestore';

describe('Inspection Schema Validation', () => {
  test('유효한 검차 데이터 검증 성공', () => {
    const validInspection = {
      id: 'insp-001',
      vehicleId: 'v-001',
      preferredDate: '2026-02-01',
      preferredTime: '14:00',
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    expect(() => inspectionSchema.parse(validInspection)).not.toThrow();
  });

  test('날짜 형식 검증', () => {
    const invalidDateInspection = {
      id: 'insp-001',
      vehicleId: 'v-001',
      preferredDate: '2026/02/01',  // 잘못된 형식
      preferredTime: '14:00',
      status: 'pending',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    expect(() => inspectionSchema.parse(invalidDateInspection)).toThrow();
  });

  test('검차 상태 enum 검증', () => {
    expect(() => inspectionStatusSchema.parse('pending')).not.toThrow();
    expect(() => inspectionStatusSchema.parse('assigned')).not.toThrow();
    expect(() => inspectionStatusSchema.parse('invalid')).toThrow();
  });
});
