/**
 * DashboardPage (로그인/회원가입 성공 후 메인 랜딩)
 * Figma 1194-7664: 전체 차량 그리드 + 좌측 사이드바 + 헤더 + 페이지네이션 + 푸터
 */

import { useState, useMemo } from 'react';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { MainLandingSidebar } from '@/widgets/MainLandingSidebar/ui/MainLandingSidebar';
import { VehicleCard } from '@/entities/vehicle/ui/VehicleCard';
import { Button } from '@/shared/ui/Button';
import { Pagination } from '@/shared/ui/Pagination';
import { useVehicles } from '@/features/vehicle/register-form/model/useVehicles';

const PAGE_SIZE = 9;

export const DashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarActive, setSidebarActive] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: vehicles = [], isLoading } = useVehicles();

  const filteredVehicles = useMemo(() => {
    if (!searchTerm.trim()) return vehicles;
    const q = searchTerm.toLowerCase();
    return vehicles.filter(
      (v) =>
        v.plateNumber.toLowerCase().includes(q) ||
        v.modelName.toLowerCase().includes(q) ||
        (v.manufacturer && v.manufacturer.toLowerCase().includes(q))
    );
  }, [vehicles, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredVehicles.length / PAGE_SIZE));
  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredVehicles.slice(start, start + PAGE_SIZE);
  }, [filteredVehicles, currentPage]);

  const handleRegister = () => {
    window.location.href = '/vehicles/new/step1';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader
        userName="홍길동"
        variant="main"
        activeNav="vehicles"
        onRegisterListing={handleRegister}
      />

      <div className="flex">
        <MainLandingSidebar
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          activeKey={sidebarActive}
        />

        <main className="flex-1 p-8">
          {/* 상단: 전체 차량 + 확인 필요차량 */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-h1 font-bold text-gray-900">전체 차량</h1>
            <Button variant="secondary" size="md">
              확인 필요차량
            </Button>
          </div>

          {/* 그리드 */}
          {isLoading ? (
            <div className="text-center py-16">
              <p className="text-body text-gray-500">로딩 중...</p>
            </div>
          ) : paginatedVehicles.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
              <p className="text-body text-gray-600">등록된 차량이 없습니다.</p>
              <Button className="mt-4" onClick={handleRegister}>
                매물 등록하기
              </Button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    variant="mainLanding"
                    onClick={() => {
                      window.location.href = `/vehicles/${vehicle.id}`;
                    }}
                  />
                ))}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="mt-10 flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* 푸터 */}
      <footer className="container py-6 border-t border-gray-200">
        <p className="text-caption text-gray-500">
          ForwardMax Cariv Domestic Seller 1.0 Prototype
        </p>
      </footer>
    </div>
  );
};
