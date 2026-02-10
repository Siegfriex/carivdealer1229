/**
 * TradeListPage — 거래 목록 (Figma 1418:22630 판매_거래목록_그리드/리스트 — §3.5 차량 등록·상세·경매)
 * 라우트: /offers. GNB 거래 활성, 좌측 검색, 필터(전체/일반 거래/경매 거래/거래완료), 그리드/리스트 뷰, 페이지네이션.
 */

import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { GnbListLayout } from '@/widgets/GnbListLayout';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { VehicleTable } from '@/widgets/VehicleTable/ui/VehicleTable';
import { VehicleCard } from '@/entities/vehicle/ui/VehicleCard';
import { SegmentedControl, type SegmentedControlOption } from '@/shared/ui/SegmentedControl';
import { Pagination } from '@/shared/ui/Pagination';
import { useVehicles } from '@/features/vehicle/register-form/model/useVehicles';
import { TRADE_LIST_STATUS_LABELS } from '@/entities/vehicle/model/constants';
import { Grid3x3, List } from 'lucide-react';
import type { VehicleStatus } from '@/entities/vehicle/model/types';

const PAGE_SIZE = 9;
type FilterTab = 'all' | 'general' | 'auction' | 'done';
const FILTER_PARAM = 'filter';
const VIEW_PARAM = 'view';

export const TradeListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const filterTab = (searchParams.get(FILTER_PARAM) as FilterTab) || 'all';
  const viewMode = (searchParams.get(VIEW_PARAM) as 'grid' | 'list') || 'grid';

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  const { data: vehicles = [], isLoading } = useVehicles({});

  const statusFilter = useMemo((): VehicleStatus[] | undefined => {
    if (filterTab === 'general') return ['active_sale'];
    if (filterTab === 'auction') return ['bidding'];
    if (filterTab === 'done') return ['sold', 'completed'];
    return undefined;
  }, [filterTab]);

  const filteredByStatus = useMemo(() => {
    if (!statusFilter) return vehicles;
    return vehicles.filter((v) => statusFilter.includes(v.status));
  }, [vehicles, statusFilter]);

  const filteredBySearch = useMemo(() => {
    if (!searchTerm.trim()) return filteredByStatus;
    const q = searchTerm.toLowerCase();
    return filteredByStatus.filter(
      (v) =>
        v.plateNumber.toLowerCase().includes(q) ||
        v.modelName.toLowerCase().includes(q) ||
        (v.manufacturer && v.manufacturer.toLowerCase().includes(q))
    );
  }, [filteredByStatus, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredBySearch.length / PAGE_SIZE));
  const paginatedVehicles = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredBySearch.slice(start, start + PAGE_SIZE);
  }, [filteredBySearch, currentPage]);

  const allCount = vehicles.length;
  const generalCount = vehicles.filter((v) => v.status === 'active_sale').length;
  const auctionCount = vehicles.filter((v) => v.status === 'bidding').length;
  const doneCount = vehicles.filter((v) => v.status === 'sold' || v.status === 'completed').length;

  const updateFilter = (value: FilterTab) => {
    setCurrentPage(1);
    const next = new URLSearchParams(searchParams);
    if (value === 'all') next.delete(FILTER_PARAM);
    else next.set(FILTER_PARAM, value);
    setSearchParams(next, { replace: true });
  };

  const updateViewMode = (mode: 'grid' | 'list') => {
    const next = new URLSearchParams(searchParams);
    if (mode === 'grid') next.delete(VIEW_PARAM);
    else next.set(VIEW_PARAM, mode);
    setSearchParams(next, { replace: true });
  };

  const filterOptions: SegmentedControlOption<FilterTab>[] = [
    { value: 'all', label: '전체', count: allCount },
    { value: 'general', label: '일반 거래', count: generalCount },
    { value: 'auction', label: '경매 거래', count: auctionCount === 0 ? undefined : auctionCount },
    { value: 'done', label: '거래완료', count: doneCount },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader userName="홍길동" variant="main" activeNav="offers" />

      <div className={`flex ${LAYOUT_CLASSES.CONTAINER}`} data-node-id="1714:22332">
        <GnbMinimalSidebar
          className="!w-[249px]"
          sectionTitle="거래"
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <main className={`flex-1 ${LAYOUT_CLASSES.MAIN_PADDING} ${LAYOUT_CLASSES.MAIN_GNB}`}>
            {/* 배지: 1714:22345 260,106 203×37 */}
            <div className="flex items-center gap-1.5 w-[203px] h-[37px] rounded-[39px] border border-[#d9e7fc] bg-[#eef5fe] px-5 py-2 mb-4">
              <span className="text-body font-semibold text-primary">한국 수출차량 전문 플랫폼</span>
            </div>
            <h1 className="text-[28px] leading-[44px] font-bold text-gray-900 mb-6" data-node-id="1714:22351">거래 목록</h1>

            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <SegmentedControl
                  options={filterOptions}
                  value={filterTab}
                  onChange={(value) => updateFilter(value as FilterTab)}
                />
                <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-md">
                  <button
                    onClick={() => updateViewMode('grid')}
                    className={`p-2 rounded transition-fast ${
                      viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
                    }`}
                    aria-label="그리드 뷰"
                  >
                    <Grid3x3 className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => updateViewMode('list')}
                    className={`p-2 rounded transition-fast ${
                      viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
                    }`}
                    aria-label="리스트 뷰"
                  >
                    <List className="h-5 w-5" />
                  </button>
                </div>
              </div>
              <select
                className="text-body border border-gray-200 rounded-md px-3 py-2 text-gray-700 bg-white"
                aria-label="조회기간"
              >
                <option>조회기간</option>
                <option>7일</option>
                <option>30일</option>
                <option>90일</option>
              </select>
            </div>

            {isLoading ? (
              <div className="text-center py-16">
                <p className="text-body text-gray-500">로딩 중...</p>
              </div>
            ) : paginatedVehicles.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg shadow-md">
                <p className="text-body text-gray-600">거래 목록이 없습니다.</p>
              </div>
            ) : viewMode === 'grid' ? (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-[15px] gap-y-[36px] mb-8" data-node-id="1714:22378">
                  {paginatedVehicles.map((vehicle) => (
                    <div key={vehicle.id} className="min-h-[291px] max-w-[314px]">
                      <VehicleCard
                        vehicle={vehicle}
                        variant="mainLanding"
                        statusLabelOverride={TRADE_LIST_STATUS_LABELS[vehicle.status]}
                        onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                        className="h-full min-h-[291px] w-full max-w-[314px] rounded-[23.441px] shadow-[2.34px_3.13px_11.02px_rgba(0,0,0,0.05)]"
                      />
                    </div>
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className="flex justify-center w-full max-w-[970px]" data-node-id="1714:22352">
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
                {totalPages > 1 && (
                  <div className="flex justify-center w-full max-w-[970px]" data-node-id="1714:22352">
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

        <footer className="py-6 border-t border-gray-200">
          <p className="text-caption text-gray-500">
            ForwardMax Cariv Domestic Seller 1.0 Prototype
          </p>
        </footer>
      </div>
    </div>
  );
};
