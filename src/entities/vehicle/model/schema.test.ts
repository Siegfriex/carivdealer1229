/**
 * Vehicle Schema Tests
 */

import { describe, test, expect } from 'vitest';
import { vehicleSchema, vehicleStatusSchema } from './schema';
import { Timestamp } from 'firebase/firestore';

describe('Vehicle Schema Validation', () => {
  test('유효한 차량 데이터 검증 성공', () => {
    const validVehicle = {
      id: 'v-001',
      status: 'draft',
      plateNumber: '33바 3333',
      manufacturer: 'Kia',
      modelName: 'Carnival KA4',
      modelYear: '2022',
      mileage: '50000',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    expect(() => vehicleSchema.parse(validVehicle)).not.toThrow();
  });

  test('잘못된 차량번호 형식 검증 실패', () => {
    const invalidVehicle = {
      id: 'v-001',
      status: 'draft',
      plateNumber: 'invalid',
      manufacturer: 'Kia',
      modelName: 'Carnival KA4',
      modelYear: '2022',
      mileage: '50000',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    expect(() => vehicleSchema.parse(invalidVehicle)).toThrow('Invalid plate number format');
  });

  test('VIN 17자리 검증', () => {
    const vehicleWithValidVin = {
      id: 'v-001',
      status: 'draft',
      plateNumber: '33바 3333',
      vin: 'KMHXX00XXXX000000',
      manufacturer: 'Kia',
      modelName: 'Carnival KA4',
      modelYear: '2022',
      mileage: '50000',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    expect(() => vehicleSchema.parse(vehicleWithValidVin)).not.toThrow();

    const vehicleWithInvalidVin = {
      ...vehicleWithValidVin,
      vin: 'INVALID',
    };

    expect(() => vehicleSchema.parse(vehicleWithInvalidVin)).toThrow('VIN must be 17 characters');
  });

  test('차량 상태 enum 검증', () => {
    expect(() => vehicleStatusSchema.parse('draft')).not.toThrow();
    expect(() => vehicleStatusSchema.parse('inspection')).not.toThrow();
    expect(() => vehicleStatusSchema.parse('invalid')).toThrow();
  });
});
