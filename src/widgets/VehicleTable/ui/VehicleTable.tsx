/**
 * VehicleTable Component
 * 차량 목록 테이블 위젯
 */

import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from '@/shared/ui/Table';
import { VehicleStatusBadge } from '@/entities/vehicle/ui/VehicleStatusBadge';
import type { Vehicle } from '@/entities/vehicle/model/types';
import { Eye, Edit2, Trash2 } from 'lucide-react';

/** 차량 테이블 props */
interface VehicleTableProps {
  vehicles: Vehicle[];
  onView?: (vehicle: Vehicle) => void;
  onEdit?: (vehicle: Vehicle) => void;
  onDelete?: (vehicle: Vehicle) => void;
  className?: string;
}

/**
 * 차량 목록 테이블 (차량번호·모델·연식·주행·가격·상태·액션)
 * @param props.vehicles - 차량 배열
 * @param props.onView - 보기 클릭 콜백
 * @param props.onEdit - 수정 클릭 콜백
 * @param props.onDelete - 삭제 클릭 콜백
 */
export const VehicleTable = ({
  vehicles,
  onView,
  onEdit,
  onDelete,
  className = '',
}: VehicleTableProps) => {
  return (
    <Table className={className}>
      <TableHead>
        <TableRow>
          <TableHeader>차량번호</TableHeader>
          <TableHeader>모델명</TableHeader>
          <TableHeader>연식</TableHeader>
          <TableHeader>주행거리</TableHeader>
          <TableHeader>가격</TableHeader>
          <TableHeader>상태</TableHeader>
          <TableHeader>액션</TableHeader>
        </TableRow>
      </TableHead>
      <TableBody>
        {vehicles.map((vehicle) => (
          <TableRow key={vehicle.id}>
            <TableCell>{vehicle.plateNumber}</TableCell>
            <TableCell>
              <div>
                <p className="font-medium">{vehicle.modelName}</p>
                <p className="text-caption text-gray-500">{vehicle.manufacturer}</p>
              </div>
            </TableCell>
            <TableCell>{vehicle.modelYear}년</TableCell>
            <TableCell>{parseInt(vehicle.mileage).toLocaleString()}km</TableCell>
            <TableCell>
              {vehicle.price ? `${parseInt(vehicle.price).toLocaleString()}만원` : '-'}
            </TableCell>
            <TableCell>
              <VehicleStatusBadge status={vehicle.status} size="sm" />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                {onView && (
                  <button
                    onClick={() => onView(vehicle)}
                    className="p-2 text-gray-600 hover:text-primary transition-fast"
                    aria-label="보기"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                )}
                {onEdit && (
                  <button
                    onClick={() => onEdit(vehicle)}
                    className="p-2 text-gray-600 hover:text-primary transition-fast"
                    aria-label="수정"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => onDelete(vehicle)}
                    className="p-2 text-gray-600 hover:text-error transition-fast"
                    aria-label="삭제"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
