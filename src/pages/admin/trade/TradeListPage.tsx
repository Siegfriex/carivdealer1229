/**
 * TradeListPage — 거래 목록 (Figma 1714-22332 GNB 거래 탭)
 * 라우트: /offers. GNB 거래 활성, 좌측 검색, 필터(전체/일반 거래/경매 거래/거래완료), 그리드/리스트 뷰, 페이지네이션.
 * @see docs/figmaMCP/impl_plans/1714-22332_구현계획.md
 */

import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LandingHeader } from '@/widgets/Header';
import { GnbListLayout } from '@/widgets/GnbListLayout';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { VehicleListTableWithExpand, DEFAULT_VEHICLE_COLUMN_DEFS } from '@/widgets/VehicleTable';
import { VehicleListCard } from '@/widgets/VehicleListCard';
import { SegmentedControl, type SegmentedControlOption } from '@/shared/ui/SegmentedControl';
import { Pagination } from '@/shared/ui/Pagination';
import { useVehicles } from '@/features/vehicle/register-form';
import { TRADE_LIST_STATUS_LABELS } from '@/entities/vehicle/model/constants';
import { getVehicleDetailRoute } from '@/shared/utils/navigation/routeManager';
import { LayoutList, LayoutGrid } from 'lucide-react';
import type { VehicleStatus } from '@/entities/vehicle/model/types';

const PAGE_SIZE = 9;
type FilterTab = 'all' | 'general' | 'auction' | 'done';
const FILTER_PARAM = 'filter';
const VIEW_PARAM = 'view';

const PERIOD_OPTIONS = [
  { value: '1m', label: '최근 1개월' },
  { value: '3m', label: '최근 3개월' },
  { value: '6m', label: '최근 6개월' },
];

export const TradeListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const filterTab = (searchParams.get(FILTER_PARAM) as FilterTab) || 'all';
  const viewMode = (searchParams.get(VIEW_PARAM) as 'grid' | 'list') || 'grid';

  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [period, setPeriod] = useState('1m');

  const { data: vehicles = [], isLoading } = useVehicles({});

  /** 거래탭 전체 = 거래 상태만 (차량등록탭과 달리 진짜 전체 아님) */
  const tradeStatuses: VehicleStatus[] = ['active_sale', 'bidding', 'sold', 'completed'];

  const statusFilter = useMemo((): VehicleStatus[] => {
    if (filterTab === 'general') return ['active_sale'];
    if (filterTab === 'auction') return ['bidding'];
    if (filterTab === 'done') return ['sold', 'completed'];
    return tradeStatuses; // 'all' = 거래 해당 전체만
  }, [filterTab]);

  const filteredByStatus = useMemo(() => {
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

  const allCount = vehicles.filter((v) => tradeStatuses.includes(v.status)).length;
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

  const footer = (
    <footer className="py-6 border-t border-gray-200">
      <p className="text-caption text-gray-500">ForwardMax Cariv Domestic Seller 1.0 Prototype</p>
    </footer>
  );

  return (
    <div className="min-h-screen bg-gray-50" data-node-id="1714:22332">
      <LandingHeader userName="홍길동" variant="main" activeNav="offers" />
      <div className={`flex ${LAYOUT_CLASSES.CONTAINER}`}>
        <GnbListLayout
          sidebar={{
            type: 'minimal',
            sectionTitle: '거래',
            searchValue: searchTerm,
            onSearchChange: setSearchTerm,
          }}
          title="거래 목록"
          mainNodeId="1714:22378"
          titleNodeId="1714:22351"
          footer={footer}
        >
          {/* 1행: 검차탭과 동일 — 좌측 최근 1개월, 우측 리스트/카드 토글 */}
          <div className="flex items-center justify-between mb-6" data-node-id="1300:6039">
            <select
              value={period}
              onChange={(e) => setPeriod(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-[10px] text-body text-gray-700 bg-white shadow-[2.344px_3.125px_11.017px_0px_rgba(0,0,0,0.05)] focus:outline-none focus:ring-2 focus:ring-primary"
              aria-label="조회기간"
            >
              {PERIOD_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <div className="flex h-9 rounded-[10px] border border-gray-200 overflow-hidden shadow-[2.344px_3.125px_11.017px_0px_rgba(0,0,0,0.05)]">
              <button
                type="button"
                onClick={() => updateViewMode('list')}
                className={`flex items-center gap-2 px-4 h-9 text-body font-medium transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                aria-pressed={viewMode === 'list'}
              >
                <LayoutList className="h-4 w-4" /> 리스트
              </button>
              <button
                type="button"
                onClick={() => updateViewMode('grid')}
                className={`flex items-center gap-2 px-4 h-9 text-body font-medium transition-colors ${viewMode === 'grid' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                aria-pressed={viewMode === 'grid'}
              >
                <LayoutGrid className="h-4 w-4" /> 카드
              </button>
            </div>
          </div>
          {/* 2행: 상태 필터 */}
          <div className="mb-6" data-node-id="1367:9463">
            <SegmentedControl
              options={filterOptions}
              value={filterTab}
              onChange={(value) => updateFilter(value as FilterTab)}
            />
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
              {/* 검차·탁송과 동일: 3컬럼, 972px, gap 15/36 */}
              <div className={`grid grid-cols-3 ${LAYOUT_CLASSES.GNB_GRID} max-w-[972px] w-full mb-8`} data-node-id="1714:22378">
                {paginatedVehicles.map((vehicle) => (
                  <VehicleListCard
                    key={vehicle.id}
                    vehicle={vehicle}
                    statusLabelOverride={TRADE_LIST_STATUS_LABELS[vehicle.status]}
                    onClick={() => navigate(getVehicleDetailRoute(vehicle.id, vehicle.status))}
                  />
                ))}
              </div>
              {totalPages > 1 && (
                <div className={`flex justify-center w-full ${LAYOUT_CLASSES.GNB_PAGINATION_WRAPPER}`} data-node-id="1714:22352">
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
              )}
            </>
          ) : (
            <>
              <div className="mb-8">
                <VehicleListTableWithExpand
                  vehicles={paginatedVehicles}
                  columnDefs={DEFAULT_VEHICLE_COLUMN_DEFS}
                  statusLabelOverride={(v) => TRADE_LIST_STATUS_LABELS[v.status]}
                  onView={(vehicle) => navigate(getVehicleDetailRoute(vehicle.id, vehicle.status))}
                />
              </div>
              {totalPages > 1 && (
                <div className={`flex justify-center w-full ${LAYOUT_CLASSES.GNB_PAGINATION_WRAPPER}`} data-node-id="1714:22352">
                  <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </div>
              )}
            </>
          )}
        </GnbListLayout>
      </div>
    </div>
  );
};
