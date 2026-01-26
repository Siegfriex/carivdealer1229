/**
 * VehicleCard Component
 * 차량 정보 카드
 * 
 * 디자인: design/design_component/리스트 카드.svg
 */

import { Card } from '@/shared/ui/Card';
import { VehicleStatusBadge } from './VehicleStatusBadge';
import type { Vehicle } from '@/entities/vehicle/model/types';
import { Calendar, Gauge } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  onClick?: () => void;
  className?: string;
}

export const VehicleCard = ({ vehicle, onClick, className = '' }: VehicleCardProps) => {
  return (
    <Card hover={!!onClick} onClick={onClick} className={className}>
      {/* 썸네일 */}
      {vehicle.thumbnailUrl && (
        <img
          src={vehicle.thumbnailUrl}
          alt={vehicle.modelName}
          className="w-full h-40 object-cover rounded-t-md"
        />
      )}

      <div className="p-4">
        {/* 차량 기본 정보 */}
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-h4 font-bold text-gray-900 mb-1">{vehicle.modelName}</h3>
            <p className="text-body text-gray-600">{vehicle.manufacturer}</p>
          </div>
          <VehicleStatusBadge status={vehicle.status} size="sm" />
        </div>

        {/* 상세 정보 */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-body text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>{vehicle.modelYear}년식</span>
          </div>
          <div className="flex items-center gap-2 text-body text-gray-600">
            <Gauge className="h-4 w-4" />
            <span>{parseInt(vehicle.mileage).toLocaleString()}km</span>
          </div>
        </div>

        {/* 가격 */}
        {vehicle.price && (
          <div className="pt-3 border-t border-gray-200">
            <p className="text-body text-gray-600 mb-1">판매가</p>
            <p className="text-h3 font-bold text-primary">
              {parseInt(vehicle.price).toLocaleString()}만원
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};
