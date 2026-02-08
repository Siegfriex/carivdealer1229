/**
 * VehicleListPage Component
 * 매물 목록 페이지 (Figma 1198-6370)
 * 
 * 회원가입/로그인 후 진입하는 "나의 매물 목록" 화면
 * - GNB: LandingHeader (variant=main, activeNav='vehicles')
 * - 좌측 사이드바: MainLandingSidebar (검색)
 * - 메인: 필터 탭(전체/임시저장됨/등록완료), 그리드/리스트 토글, 확인 필요차량 체크박스, 차량 카드 그리드, 페이지네이션
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { MainLandingSidebar } from '@/widgets/MainLandingSidebar/ui/MainLandingSidebar';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { VehicleTable } from '@/widgets/VehicleTable/ui/VehicleTable';
import { VehicleCard } from '@/entities/vehicle/ui/VehicleCard';
import { SegmentedControl, type SegmentedControlOption } from '@/shared/ui/SegmentedControl';
import { Checkbox } from '@/shared/ui/Checkbox';
import { Pagination } from '@/shared/ui/Pagination';
import { useVehicles } from '@/features/vehicle/register-form/model/useVehicles';
import { Grid3x3, List } from 'lucide-react';
import type { VehicleStatus } from '@/entities/vehicle/model/types';

const PAGE_SIZE = 9;

type FilterTab = 'all' | 'draft' | 'completed';

export const VehicleListPage = () => {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [needsAttention, setNeedsAttention] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // 전체 차량 조회 (건수 계산용)
  const { data: allVehicles = [], isLoading: isLoadingAll } = useVehicles({});
  
  // 필터별 차량 조회
  const statusFilter: VehicleStatus[] | undefined = useMemo(() => {
    if (filterTab === 'draft') return ['draft'];
    if (filterTab === 'completed') return ['completed', 'active_sale', 'sold'];
    return undefined;
  }, [filterTab]);

  const { data: vehicles = [], isLoading } = useVehicles({
    status: statusFilter,
  });

  // 건수 계산
  const draftCount = allVehicles.filter((v) => v.status === 'draft').length;
  const completedCount = allVehicles.filter((v) => 
    ['completed', 'active_sale', 'sold'].includes(v.status)
  ).length;
  const allCount = allVehicles.length;

  // 검색 필터링
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

  // 확인 필요차량 필터 (임시저장 또는 검차 진행 중)
  const attentionFilteredVehicles = useMemo(() => {
    if (!needsAttention) return filteredVehicles;
    return filteredVehicles.filter((v) => 
      v.status === 'draft' || v.status === 'inspection'
    );
  }, [filteredVehicles, needsAttention]);

  // 페이지네이션
  const totalPages = Math.max(1, Math.ceil(attentionFilteredVehicles.length / PAGE_SIZE));
  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return attentionFilteredVehicles.slice(start, start + PAGE_SIZE);
  }, [attentionFilteredVehicles, currentPage]);

  const handleRegister = () => {
    navigate('/vehicles/new/step1');
  };

  // 필터 탭 옵션
  const filterOptions: SegmentedControlOption<FilterTab>[] = [
    { value: 'all', label: '전체', count: allCount },
    { value: 'draft', label: '임시저장됨', count: draftCount },
    { value: 'completed', label: '등록완료', count: completedCount },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader
        userName="홍길동"
        variant="main"
        activeNav="vehicles"
        onRegisterListing={handleRegister}
      />

      <div className={LAYOUT_CLASSES.CONTAINER}>
        <div className="flex">
          <MainLandingSidebar
            searchValue={searchTerm}
            onSearchChange={setSearchTerm}
            activeKey="all"
          />

          <main className={`flex-1 ${LAYOUT_CLASSES.MAIN_PADDING} ${LAYOUT_CLASSES.MAIN_LIST}`}>
          {/* 제목: 나의 매물 목록 */}
          <h1 className="text-h1 font-bold text-gray-900 mb-6">나의 매물 목록</h1>

          {/* 필터 탭 + 뷰 토글 + 확인 필요차량 */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              {/* 필터 탭 (SegmentedControl) */}
              <SegmentedControl
                options={filterOptions}
                value={filterTab}
                onChange={(value) => {
                  setFilterTab(value as FilterTab);
                  setCurrentPage(1); // 필터 변경 시 첫 페이지로
                }}
              />

              {/* 뷰 토글 */}
              <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-md">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded transition-fast ${
                    viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
                  }`}
                  aria-label="그리드 뷰"
                >
                  <Grid3x3 className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded transition-fast ${
                    viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
                  }`}
                  aria-label="리스트 뷰"
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* 확인 필요차량 체크박스 */}
            <Checkbox
              checked={needsAttention}
              onChange={(e) => {
                setNeedsAttention(e.target.checked);
                setCurrentPage(1);
              }}
              label="확인 필요차량"
            />
          </div>

          {/* 콘텐츠 */}
          {isLoading || isLoadingAll ? (
            <div className="text-center py-16">
              <p className="text-body text-gray-500">로딩 중...</p>
            </div>
          ) : paginatedVehicles.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-lg shadow-md">
              <p className="text-body text-gray-600">등록된 차량이 없습니다.</p>
            </div>
          ) : viewMode === 'grid' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedVehicles.map((vehicle) => (
                  <VehicleCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    variant="mainLanding"
                    onClick={() => {
                      navigate(`/vehicles/${vehicle.id}`);
                    }}
                  />
                ))}
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex justify-center">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <div className="bg-white rounded-lg shadow-md mb-8">
                <VehicleTable vehicles={paginatedVehicles} />
              </div>

              {/* 페이지네이션 */}
              {totalPages > 1 && (
                <div className="flex justify-center">
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
        <footer className="py-6 border-t border-gray-200">
          <p className="text-caption text-gray-500">
            ForwardMax Cariv Domestic Seller 1.0 Prototype
          </p>
        </footer>
      </div>
    </div>
  );
};
