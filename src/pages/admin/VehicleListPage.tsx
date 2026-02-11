/**
 * VehicleListPage Component
 * 매물 목록 페이지 — §3.4 차량 목록
 * Figma nodeId: 1425-8153 (나의매물목록_회원가입유도/전체). 레이아웃 스펙: impl_plans/1425-8153_구현계획.md
 * 기타 동일 라우트 변형: 1418:15487, 1418:15695, 1418:15903, 1418:15565, 1418:17357, 1418:20145, 1418:16327, 1418:16111, 1418:16860
 * URL: /vehicles?filter=all|draft|completed, ?view=grid|list, ?q=..., ?needsAttention=1
 *
 * - GNB: LandingHeader (variant=main, activeNav='vehicles')
 * - 좌측 사이드바: MainLandingSidebar (검색). Figma 사이드바 249px
 * - 메인: 제목(159×44) → 탭(320×40) → 그리드(972px, 카드 314×291, gap 15px), 페이지네이션, 푸터
 */

import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LandingHeader } from '@/widgets/Header';
import { GnbListLayout } from '@/widgets/GnbListLayout';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { VehicleListTableWithExpand } from '@/widgets/VehicleTable';
import { VehicleListCard } from '@/widgets/VehicleListCard';
import { SegmentedControl, type SegmentedControlOption } from '@/shared/ui/SegmentedControl';
import { Checkbox } from '@/shared/ui/Checkbox';
import { Pagination } from '@/shared/ui/Pagination';
import { LayoutList, LayoutGrid } from 'lucide-react';
import { useVehicles } from '@/features/vehicle/register-form';
import { VEHICLE_LIST_FILTER_TO_STATUS, VEHICLE_LIST_TAB_TO_STATUS } from '@/entities/vehicle/model/vehicleListFilterMeta';
import { getVehicleDetailRoute } from '@/shared/api/mockNavigationMap';
import type { VehicleStatus } from '@/entities/vehicle/model/types';

const PAGE_SIZE = 9;

const PERIOD_OPTIONS = [
  { value: '1m', label: '최근 1개월' },
  { value: '3m', label: '최근 3개월' },
  { value: '6m', label: '최근 6개월' },
];

/** 전체/임시저장/등록완료 + 사이드바 필터(차량상태·판매거래·탁송·정산) */
type FilterTab = 'all' | 'draft' | 'completed' | 'status' | 'sale' | 'logistics' | 'settlement';

const FILTER_PARAM = 'filter';
const STAGE_PARAM = 'stage'; // NODE 1362-36169: /vehicles?stage=logistics = 차량목록 탭 탁송단계 필터 (filter=logistics와 동일)
const VIEW_PARAM = 'view';
const Q_PARAM = 'q';
const NEEDS_ATTENTION_PARAM = 'needsAttention';

export const VehicleListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  // URL을 소스 오브 트루스로 사용. 사이드바 링크와 연동: ?filter=status|sale|logistics|settlement
  // NODE 1362-36169: /vehicles?stage=logistics 도 지원 (GNB 차량목록 탭에서 탁송단계 필터 = 별도 페이지)
  const filterFromUrl = searchParams.get(FILTER_PARAM) as FilterTab | null;
  const stageFromUrl = searchParams.get(STAGE_PARAM);
  const filterTab: FilterTab =
    filterFromUrl ?? (stageFromUrl === 'logistics' ? 'logistics' : 'all');
  const viewMode = (searchParams.get(VIEW_PARAM) as 'grid' | 'list') || 'grid';
  const searchTerm = searchParams.get(Q_PARAM) ?? '';
  const needsAttention = searchParams.get(NEEDS_ATTENTION_PARAM) === '1';

  const [currentPage, setCurrentPage] = useState(1);
  const [period, setPeriod] = useState('1m');

  const updateFilter = (value: FilterTab) => {
    setCurrentPage(1);
    const next = new URLSearchParams(searchParams);
    if (value === 'all') next.delete(FILTER_PARAM);
    else next.set(FILTER_PARAM, value);
    setSearchParams(next, { replace: true });
  };

  // 탭에 표시할 값: 사이드바 전용 필터(status/sale/logistics/settlement)일 땐 '전체'로 표시
  const segmentValue: FilterTab =
    filterTab === 'status' || filterTab === 'sale' || filterTab === 'logistics' || filterTab === 'settlement'
      ? 'all'
      : filterTab;

  const updateViewMode = (mode: 'grid' | 'list') => {
    const next = new URLSearchParams(searchParams);
    if (mode === 'grid') next.delete(VIEW_PARAM);
    else next.set(VIEW_PARAM, mode);
    setSearchParams(next, { replace: true });
  };

  const updateSearchTerm = (value: string) => {
    setCurrentPage(1);
    const next = new URLSearchParams(searchParams);
    if (value.trim()) next.set(Q_PARAM, value.trim());
    else next.delete(Q_PARAM);
    setSearchParams(next, { replace: true });
  };

  const updateNeedsAttention = (checked: boolean) => {
    setCurrentPage(1);
    const next = new URLSearchParams(searchParams);
    if (checked) next.set(NEEDS_ATTENTION_PARAM, '1');
    else next.delete(NEEDS_ATTENTION_PARAM);
    setSearchParams(next, { replace: true });
  };

  // 전체 차량 조회 (건수 계산용)
  const { data: allVehicles = [], isLoading: isLoadingAll } = useVehicles({});
  
  // 필터별 차량 조회 (사이드바 필터 연동) — vehicleListFilterMeta 엔티티 매핑 사용
  const statusFilter: VehicleStatus[] | undefined = useMemo(() => {
    if (filterTab in VEHICLE_LIST_TAB_TO_STATUS) return VEHICLE_LIST_TAB_TO_STATUS[filterTab];
    if (filterTab in VEHICLE_LIST_FILTER_TO_STATUS) return VEHICLE_LIST_FILTER_TO_STATUS[filterTab as keyof typeof VEHICLE_LIST_FILTER_TO_STATUS];
    return undefined;
  }, [filterTab]);

  const { data: vehicles = [], isLoading } = useVehicles({
    status: statusFilter,
  });

  // 건수 계산 (사이드바/탭 필터용)
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

  // 필터 탭 옵션 (전체/임시저장/등록완료). 사이드바는 별도 링크로 filter=status|sale|logistics|settlement 적용됨
  const filterOptions: SegmentedControlOption<FilterTab>[] = [
    { value: 'all', label: '전체', count: allCount },
    { value: 'draft', label: '임시저장됨', count: draftCount },
    { value: 'completed', label: '등록완료', count: completedCount },
  ];

  // 사이드바 활성 키: URL filter와 동기화
  const sidebarActiveKey = filterTab === 'all' || filterTab === 'draft' || filterTab === 'completed'
    ? 'all'
    : filterTab;

  const footer = (
    <footer className="py-6 border-t border-gray-200" data-node-id="1425:8165">
      <p className="text-caption text-gray-500">ForwardMax Cariv Domestic Seller 1.0 Prototype</p>
    </footer>
  );

  return (
    <div
      className="min-h-screen bg-gray-50"
      data-node-id={filterTab === 'logistics' ? '1362:36169' : '1425:8153'}
    >
      <LandingHeader userName="홍길동" variant="main" activeNav="vehicles" />
      <div className={LAYOUT_CLASSES.CONTAINER}>
        <div className="flex">
          <GnbListLayout
            sidebar={{
              type: 'vehicles',
              searchValue: searchTerm,
              onSearchChange: updateSearchTerm,
              activeKey: sidebarActiveKey,
            }}
            title="나의 매물 목록"
            mainNodeId="1425:8237"
            footer={footer}
          >
            {/* 1행: 검차탭과 동일 — 좌측 최근 1개월, 우측 리스트/카드 토글 + 탭별 고유(확인필요차량) */}
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
              <div className="flex items-center gap-3">
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
                <Checkbox
                  checked={needsAttention}
                  onChange={(e) => updateNeedsAttention(e.target.checked)}
                  label="확인 필요차량"
                />
              </div>
            </div>
            {/* 2행: 상태 필터 (전체/임시저장/등록완료) */}
            <div className="mb-6" data-node-id="1367:9463">
              <SegmentedControl
                options={filterOptions}
                value={segmentValue}
                onChange={(value) => updateFilter(value as FilterTab)}
              />
            </div>

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
                {/* Figma 1636-10115: 전체 차량목록 그리드 — 3컬럼, 972px, gap 15/36 (검차·탁송과 동일) */}
                <div
                  className={`grid grid-cols-3 ${LAYOUT_CLASSES.GNB_GRID} max-w-[972px] w-full mb-8`}
                  data-node-id="1636:10115"
                >
                  {paginatedVehicles.map((vehicle) => (
                    <VehicleListCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      onClick={() => navigate(getVehicleDetailRoute(vehicle.id, vehicle.status))}
                    />
                  ))}
                </div>
                {totalPages > 1 && (
                  <div className={`flex justify-center w-full ${LAYOUT_CLASSES.GNB_PAGINATION_WRAPPER}`} data-node-id="1425:8211">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="mb-8">
                  <VehicleListTableWithExpand
                    vehicles={paginatedVehicles}
                    onView={(v) => navigate(getVehicleDetailRoute(v.id, v.status))}
                  />
                </div>
                {totalPages > 1 && (
                  <div className={`flex justify-center w-full ${LAYOUT_CLASSES.GNB_PAGINATION_WRAPPER}`} data-node-id="1425:8211">
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                  </div>
                )}
              </>
            )}
          </GnbListLayout>
        </div>
      </div>
    </div>
  );
};
