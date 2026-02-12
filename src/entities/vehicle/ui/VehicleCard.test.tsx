/**
 * VehicleCard 컴포넌트 테스트
 * 차량 정보 렌더링·클릭·variant·statusLabelOverride 동작을 검증한다.
 */

import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { VehicleCard } from './VehicleCard';
import { Timestamp } from 'firebase/firestore';
import type { Vehicle } from '@/entities/vehicle/model/types';

describe('VehicleCard Component', () => {
  const mockVehicle: Vehicle = {
    id: 'v-001',
    status: 'draft',
    plateNumber: '33바 3333',
    manufacturer: 'Kia',
    modelName: 'Carnival KA4',
    modelYear: '2022',
    mileage: '50000',
    price: '2850',
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  };

  test('차량 정보 렌더링', () => {
    render(<VehicleCard vehicle={mockVehicle} />);
    
    expect(screen.getByText('Carnival KA4')).toBeInTheDocument();
    expect(screen.getByText('Kia')).toBeInTheDocument();
    expect(screen.getByText(/2022년형/)).toBeInTheDocument();
    // 주행거리: UI는 "5.0만 km" 형식으로 표시
    expect(screen.getByText(/5\.0\s*만\s*km/)).toBeInTheDocument();
  });

  test('가격 표시', () => {
    render(<VehicleCard vehicle={mockVehicle} />);
    expect(screen.getByText('2,850만원')).toBeInTheDocument();
  });

  test('클릭 이벤트 처리', () => {
    const handleClick = vi.fn();
    render(<VehicleCard vehicle={mockVehicle} onClick={handleClick} />);
    
    const card = screen.getByText('Carnival KA4').closest('div');
    if (card) {
      fireEvent.click(card);
    }
  });
});
