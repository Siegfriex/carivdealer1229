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
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { MainLandingSidebar } from '@/widgets/MainLandingSidebar/ui/MainLandingSidebar';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { VehicleTable } from '@/widgets/VehicleTable/ui/VehicleTable';
import { VehicleCard } from '@/entities/vehicle/ui/VehicleCard';
import { SegmentedControl, type SegmentedControlOption } from '@/shared/ui/SegmentedControl';
import { Checkbox } from '@/shared/ui/Checkbox';
import { Pagination } from '@/shared/ui/Pagination';
import { useVehicles } from '@/features/vehicle/register-form/model/useVehicles';
import iconGrid from '@/shared/figma_image/1425-8153_그리드_grid.png';
import iconList from '@/shared/figma_image/1425-8153_리스트_list.png';
import iconBriefcase from '@/shared/figma_image/1425-8153_배지_briefcase.png';
import type { VehicleStatus } from '@/entities/vehicle/model/types';

const PAGE_SIZE = 9;

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
  
  // 필터별 차량 조회 (사이드바 필터 연동)
  const statusFilter: VehicleStatus[] | undefined = useMemo(() => {
    if (filterTab === 'draft') return ['draft'];
    if (filterTab === 'completed') return ['completed', 'active_sale', 'sold'];
    if (filterTab === 'sale') return ['active_sale', 'bidding'];
    if (filterTab === 'logistics') return ['sold'];
    if (filterTab === 'settlement') return ['pending_settlement', 'completed'];
    // 'all' | 'status' → 전체
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

  return (
    <div className="min-h-screen bg-gray-50" data-node-id="1425:8153">
      <LandingHeader
        userName="홍길동"
        variant="main"
        activeNav="vehicles"
      />

      <div className={LAYOUT_CLASSES.CONTAINER}>
        <div className="flex">
          <MainLandingSidebar
            searchValue={searchTerm}
            onSearchChange={updateSearchTerm}
            activeKey={sidebarActiveKey}
          />

          {/* 메인: Figma 1425:8210 title, 1425:8387 탭, 1425:8237 그리드, 1425:8211 페이지네이션 */}
          <main
            className={`flex-1 ${LAYOUT_CLASSES.MAIN_PADDING} ${LAYOUT_CLASSES.MAIN_LIST}`}
            data-node-id="1425:8237"
          >
            {/* 배지: Figma 1425:8167 260,106 203×37 — 한국 수출차량 전문 플랫폼 */}
            <div
              className="flex items-center gap-1.5 rounded-full border border-[#d9e7fc] bg-[#eef5fe] px-5 py-2 w-fit mb-4"
              data-node-id="1425:8167"
            >
              <img src={iconBriefcase} alt="" className="h-[18px] w-[18px] object-contain" aria-hidden />
              <span className="text-body font-semibold text-primary">한국 수출차량 전문 플랫폼</span>
            </div>

            {/* 제목: 나의 매물 목록 — Figma 295,207 159×44, 탭과 간격 14px */}
            <h1
              className="text-h1 font-bold text-gray-900 mb-4"
              style={{ height: 44 }}
              data-node-id="1425:8210"
            >
              나의 매물 목록
            </h1>

            {/* 필터 탭 + 뷰 토글 + 확인 필요차량 — Figma 296,265 320×40, 그리드와 간격 65px */}
            <div
              className="flex items-center justify-between mb-8"
              style={{ minHeight: 40 }}
              data-node-id="1425:8387"
            >
              <div className="flex items-center gap-4">
                <SegmentedControl
                  options={filterOptions}
                  value={segmentValue}
                  onChange={(value) => updateFilter(value as FilterTab)}
                />
                {/* 뷰 토글 — Figma 1090,268 175×33 */}
                <div
                  className="flex items-center gap-2 p-1 bg-gray-100 rounded-md"
                  data-node-id="1425:8404"
                >
                  <button
                    onClick={() => updateViewMode('grid')}
                    className={`p-2 rounded transition-fast ${
                      viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
                    }`}
                    aria-label="그리드 뷰"
                  >
                    <img src={iconGrid} alt="" className="h-5 w-5 object-contain" aria-hidden />
                  </button>
                  <button
                    onClick={() => updateViewMode('list')}
                    className={`p-2 rounded transition-fast ${
                      viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
                    }`}
                    aria-label="리스트 뷰"
                  >
                    <img src={iconList} alt="" className="h-5 w-5 object-contain" aria-hidden />
                  </button>
                </div>
              </div>
              <Checkbox
                checked={needsAttention}
                onChange={(e) => updateNeedsAttention(e.target.checked)}
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
                {/* 그리드: Figma 293,330 972×1271, 카드 314×291, gap 15px. lg에서 3열 시 314px 열. */}
                <div
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[15px] mb-8 max-w-[972px]"
                  data-node-id="1425:8237"
                >
                  {paginatedVehicles.map((vehicle) => (
                    <VehicleCard
                      key={vehicle.id}
                      vehicle={vehicle}
                      variant="mainLanding"
                      onClick={() => navigate(`/vehicles/${vehicle.id}`)}
                      className="min-h-[291px] rounded-[10px] shadow-[2.34px_3.13px_11.02px_rgba(0,0,0,0.05)]"
                    />
                  ))}
                </div>

                {/* 페이지네이션 — Figma 296,1301 970×114 */}
                {totalPages > 1 && (
                  <div className="flex justify-center" data-node-id="1425:8211">
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
                  <div className="flex justify-center" data-node-id="1425:8211">
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

        {/* 푸터 — Figma 1425:8165 0,1415 1440×327 */}
        <footer
          className="py-6 border-t border-gray-200"
          data-node-id="1425:8165"
        >
          <p className="text-caption text-gray-500">
            ForwardMax Cariv Domestic Seller 1.0 Prototype
          </p>
        </footer>
      </div>
    </div>
  );
};
