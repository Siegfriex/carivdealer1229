/**
 * VehicleListPage Component
 * 차량 목록 페이지
 * 
 * 기존: src/components/VehicleListPage.tsx
 * 개선: 대시보드 디자인 적용
 */

import { useState } from 'react';
import { Header } from '@/widgets/Header/ui/Header';
import { Sidebar } from '@/widgets/Sidebar/ui/Sidebar';
import { VehicleTable } from '@/widgets/VehicleTable/ui/VehicleTable';
import { VehicleCard } from '@/entities/vehicle/ui/VehicleCard';
import { Button } from '@/shared/ui/Button';
import { useVehicles } from '@/features/vehicle/register-form/model/useVehicles';
import { Grid3x3, List, Plus, Search } from 'lucide-react';
import { Input } from '@/shared/ui/Input';
import type { VehicleStatus } from '@/entities/vehicle/model/types';

export const VehicleListPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<VehicleStatus[]>([]);

  const { data: vehicles = [], isLoading } = useVehicles({
    status: statusFilter.length > 0 ? statusFilter : undefined,
  });

  const filteredVehicles = vehicles.filter((vehicle) =>
    vehicle.modelName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    vehicle.plateNumber.includes(searchTerm)
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        <Sidebar currentPath="/vehicles" />

        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-h1 font-bold text-gray-900 mb-2">차량 목록</h1>
              <p className="text-body text-gray-600">
                총 {filteredVehicles.length}개의 차량
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="차량번호 또는 모델명 검색"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-body focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              {/* View Toggle */}
              <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-md">
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-fast ${
                    viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-fast ${
                    viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <Grid3x3 className="h-5 w-5" />
                </button>
              </div>

              <Button>
                <Plus className="h-5 w-5 mr-2" />
                차량 등록
              </Button>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="text-center py-12">
              <p className="text-body text-gray-500">로딩 중...</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md">
              <VehicleTable vehicles={filteredVehicles} />
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
