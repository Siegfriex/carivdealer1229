/**
 * DashboardPage Component
 * 딜러 대시보드 (그리드/리스트 뷰)
 * 
 * 디자인:
 * - design/design_vehicle_dashboard/매물 등록 관리_그리드 뷰1.svg
 * - design/design_vehicle_dashboard/매물 등록 관리_리스트 뷰2.svg
 */

import { useState } from 'react';
import { Header } from '@/widgets/Header/ui/Header';
import { Sidebar } from '@/widgets/Sidebar/ui/Sidebar';
import { VehicleTable } from '@/widgets/VehicleTable/ui/VehicleTable';
import { VehicleCard } from '@/entities/vehicle/ui/VehicleCard';
import { Button } from '@/shared/ui/Button';
import { useVehicles } from '@/features/vehicle/register-form/model/useVehicles';
import { Grid3x3, List, Plus } from 'lucide-react';

export const DashboardPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { data: vehicles = [], isLoading } = useVehicles();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="flex">
        <Sidebar currentPath="/dashboard" />

        <main className="flex-1 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-h1 font-bold text-gray-900 mb-2">매물 등록 관리</h1>
              <p className="text-body text-gray-600">
                총 {vehicles.length}개의 차량이 등록되어 있습니다
              </p>
            </div>

            <div className="flex items-center gap-4">
              {/* View Toggle */}
              <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-md">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`
                    p-2 rounded transition-fast
                    ${viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'}
                  `}
                  aria-label="그리드 뷰"
                >
                  <Grid3x3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`
                    p-2 rounded transition-fast
                    ${viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'}
                  `}
                  aria-label="리스트 뷰"
                >
                  <List className="h-5 w-5" />
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
            /* 그리드 뷰 */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))}
            </div>
          ) : (
            /* 리스트 뷰 */
            <div className="bg-white rounded-lg shadow-md">
              <VehicleTable vehicles={vehicles} />
            </div>
          )}

          {/* Empty State */}
          {!isLoading && vehicles.length === 0 && (
            <div className="text-center py-16">
              <Car className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-h3 font-bold text-gray-900 mb-2">등록된 차량이 없습니다</h2>
              <p className="text-body text-gray-600 mb-6">첫 차량을 등록하여 시작하세요</p>
              <Button>차량 등록하기</Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const Car = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M5 17h14v-5l-1.5-4.5h-11L5 12v5z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="7.5" cy="17.5" r="1.5" fill="currentColor"/>
    <circle cx="16.5" cy="17.5" r="1.5" fill="currentColor"/>
  </svg>
);
