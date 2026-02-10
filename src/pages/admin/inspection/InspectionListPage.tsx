/**
 * GNB 검차 탭 랜딩. 검차요청내역 리스트/카드뷰. IA §4.4.
 * Figma 1037-5126(리스트), 1037-5673(선택 카드+상세), 1042-4681(헤더+카드) 레이아웃 반영.
 * @see docs/figma/IA_SITEMAP_SPEC_IPOE.md §4.4, §4.10
 * @see docs/figmaMCP/impl_plans/1037-5126_1037-5673_1042-4681_구현계획.md
 * 라우트: /inspections.
 */

import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { GnbMinimalSidebar } from '@/widgets/GnbMinimalSidebar';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { InspectionStatusBadge } from '@/entities/inspection/ui/InspectionStatusBadge';
import { Button } from '@/shared/ui/Button';
import { SegmentedControl, type SegmentedControlOption } from '@/shared/ui/SegmentedControl';
import { ChevronDown, ChevronUp, LayoutList, LayoutGrid, Clock, MapPin } from 'lucide-react';
import { INSPECTION_STATUS_LABELS } from '@/entities/inspection/model/constants';
import { MOCK_INSPECTIONS, type InspectionWithVehicle } from './mockInspectionList';

type StatusFilter = 'all' | 'draft' | 'pending' | 'assigned' | 'in_progress' | 'completed' | 'storage';
type ViewMode = 'list' | 'card';

const PERIOD_OPTIONS = [
  { value: '1m', label: '최근 1개월' },
  { value: '3m', label: '최근 3개월' },
  { value: '6m', label: '최근 6개월' },
];

export const InspectionListPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [period, setPeriod] = useState('1m');

  const viewMode: ViewMode = useMemo(() => {
    return searchParams.get('view') === 'card' ? 'card' : 'list';
  }, [searchParams]);
  const setViewMode = (mode: ViewMode) => {
    if (mode === 'card') setSearchParams({ view: 'card' }, { replace: true });
    else setSearchParams({}, { replace: true });
  };

  // 상태별 건수 (임시저장·차량보관은 mock 없음 → 0)
  const statusCounts = useMemo(() => ({
    all: MOCK_INSPECTIONS.length,
    draft: 0,
    pending: MOCK_INSPECTIONS.filter((i) => i.status === 'pending').length,
    assigned: MOCK_INSPECTIONS.filter((i) => i.status === 'assigned').length,
    in_progress: MOCK_INSPECTIONS.filter((i) => i.status === 'in_progress').length,
    completed: MOCK_INSPECTIONS.filter((i) => i.status === 'completed').length,
    storage: 0,
  }), []);

  const filterOptions: SegmentedControlOption<StatusFilter>[] = [
    { value: 'all', label: '전체', count: statusCounts.all },
    { value: 'draft', label: '임시저장', count: statusCounts.draft },
    { value: 'pending', label: '검차자 매칭중', count: statusCounts.pending },
    { value: 'assigned', label: '검차자 매칭완료', count: statusCounts.assigned },
    { value: 'in_progress', label: '검차중', count: statusCounts.in_progress },
    { value: 'completed', label: '검차완료', count: statusCounts.completed },
    { value: 'storage', label: '차량보관', count: statusCounts.storage },
  ];

  const inspections = useMemo(() => {
    if (statusFilter === 'draft' || statusFilter === 'storage') return [];
    let filtered = MOCK_INSPECTIONS;
    if (statusFilter !== 'all') {
      filtered = filtered.filter((insp) => insp.status === statusFilter);
    }
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (insp) =>
          (insp.vehiclePlateNumber && insp.vehiclePlateNumber.toLowerCase().includes(q)) ||
          (insp.vehicleModelName && insp.vehicleModelName.toLowerCase().includes(q))
      );
    }
    return filtered;
  }, [searchTerm, statusFilter]);

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const goToProgress = (insp: InspectionWithVehicle, stage: 'matching' | 'en_route' | 'complete') => {
    navigate(`/inspections/${insp.id}/progress?stage=${stage}`);
  };

  const goToHistory = () => {
    navigate('/inspections/history');
  };

  const handleRowClick = (insp: InspectionWithVehicle) => {
    if (insp.status === 'completed') {
      goToHistory();
      return;
    }
    if (insp.status === 'pending') goToProgress(insp, 'matching');
    else if (insp.status === 'assigned') goToProgress(insp, 'en_route');
    else if (insp.status === 'in_progress') goToProgress(insp, 'complete');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader userName="홍길동" variant="main" activeNav="inspections" />

      <div className={`flex ${LAYOUT_CLASSES.CONTAINER}`}>
        <GnbMinimalSidebar
          className="!w-[249px]"
          sectionTitle="검차"
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
        />
        <main className={`flex-1 ${LAYOUT_CLASSES.MAIN_PADDING} ${LAYOUT_CLASSES.MAIN_GNB}`}>
          {/* 배지: GNB 공통 203×37 */}
          <div className="flex items-center gap-1.5 w-[203px] h-[37px] rounded-[39px] border border-[#d9e7fc] bg-[#eef5fe] px-5 py-2 mb-4">
            <span className="text-body font-semibold text-primary">한국 수출차량 전문 플랫폼</span>
          </div>
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-[28px] leading-[44px] font-bold text-gray-900">검차 신청목록</h1>
            <div className="flex items-center gap-4">
              <select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-200 rounded-md text-body text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label="조회기간"
              >
                {PERIOD_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <div className="flex rounded-md border border-gray-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  className={`flex items-center gap-2 px-4 py-2 text-body font-medium transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  aria-pressed={viewMode === 'list'}
                >
                  <LayoutList className="h-5 w-5" /> 리스트
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('card')}
                  className={`flex items-center gap-2 px-4 py-2 text-body font-medium transition-colors ${viewMode === 'card' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  aria-pressed={viewMode === 'card'}
                >
                  <LayoutGrid className="h-5 w-5" /> 카드
                </button>
              </div>
              <Button size="md" onClick={() => navigate('/inspections/request')}>
                검차 신청하기
              </Button>
            </div>
          </div>

          <div className="mb-6">
            <SegmentedControl
              options={filterOptions}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as StatusFilter)}
            />
          </div>

          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-[15px] gap-y-[36px]">
              {inspections.length === 0 ? (
                <div className="col-span-full p-12 text-center text-body text-gray-500 bg-white rounded-lg border border-gray-200">
                  검차 신청 목록이 없습니다.
                </div>
              ) : (
                inspections.map((insp) => (
                  <div
                    key={insp.id}
                    className="bg-white rounded-[23px] border border-gray-200 overflow-hidden shadow-[2.344px_3.125px_11.017px_0px_rgba(0,0,0,0.05)] min-h-[243px] flex flex-col sm:flex-row"
                  >
                    {/* Figma 1042: 좌측 차량 이미지 영역 ~397px */}
                    <div className="w-full sm:w-[min(100%,397px)] min-h-[160px] sm:min-h-[243px] bg-[#eef5fe] flex items-center justify-center flex-shrink-0">
                      <span className="text-caption text-gray-400">차량 이미지</span>
                    </div>
                    {/* 우측: 차량번호·모델·일련번호·상태·검차일정/장소·버튼 */}
                    <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                      <div>
                        <p className="text-body font-bold text-gray-900 mb-0.5">{insp.vehiclePlateNumber}</p>
                        <p className="text-body font-medium text-gray-900 mb-0.5">{insp.vehicleModelName}</p>
                        <p className="text-caption text-gray-500 mb-2">{insp.vehicleModelYear}년형</p>
                        <p className="text-caption text-gray-500 mb-2">일련번호 {insp.serialNumber ?? insp.id}</p>
                        <InspectionStatusBadge status={insp.status} size="sm" className="mb-3" />
                        <p className="text-caption text-gray-500 flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          검차일정 : {insp.preferredDate} {insp.preferredTime}
                        </p>
                        <p className="text-caption text-gray-500 flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5" />
                          검차장소 : {insp.location?.address ?? '-'}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {insp.status === 'completed' && (
                          <Button size="sm" className="bg-primary text-white" onClick={() => navigate(`/inspections/${insp.id}/complete`)}>
                            검차내역 상세보기
                          </Button>
                        )}
                        {insp.status !== 'completed' && (
                          <Button size="sm" onClick={() => handleRowClick(insp)}>
                            진행하기
                          </Button>
                        )}
                        <Button size="sm" variant="secondary">거래하기</Button>
                        <Button size="sm" variant="ghost">삭제</Button>
                        <Button size="sm" variant="ghost">수정하기</Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
          <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-200 overflow-hidden shadow-[2.344px_3.125px_11.017px_0px_rgba(0,0,0,0.05)]">
            {inspections.length === 0 ? (
              <div className="text-center py-12 px-6">
                <p className="text-body text-gray-600">검차 신청 목록이 없습니다.</p>
                <Button className="mt-4" onClick={() => navigate('/inspections/request')}>
                  검차 신청하기
                </Button>
              </div>
            ) : (
            <>
            {/* 테이블 헤더 Figma 1193:8810: h-44, 상태·일련번호·차량번호·검차 일정·검차 장소 */}
            <div className="grid grid-cols-[auto_1fr_auto_2fr_1.5fr_1.5fr_auto] gap-4 px-6 h-11 items-center bg-white border-b border-gray-200 text-caption font-semibold text-gray-900">
              <input type="checkbox" className="rounded border-gray-300" aria-label="전체 선택" />
              <span>상태</span>
              <span>일련번호</span>
              <span>차량번호</span>
              <span>검차 일정</span>
              <span>검차 장소</span>
              <span className="w-8" aria-hidden />
            </div>
            {inspections.map((insp) => {
              const isExpanded = expandedIds.has(insp.id);
              return (
                <div key={insp.id} className="border-b border-gray-200 last:border-b-0">
                  <div
                    role="button"
                    tabIndex={0}
                    aria-expanded={isExpanded}
                    onClick={() => {
                      if (insp.status === 'completed') goToHistory();
                      else toggleExpand(insp.id);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (insp.status === 'completed') goToHistory();
                        else toggleExpand(insp.id);
                      }
                    }}
                    className="grid grid-cols-[auto_1fr_auto_2fr_1.5fr_1.5fr_auto] gap-4 px-6 min-h-[56px] py-3 items-center hover:bg-gray-50 cursor-pointer transition-fast"
                  >
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`${insp.vehiclePlateNumber} 선택`}
                    />
                    <InspectionStatusBadge status={insp.status} size="sm" />
                    <span className="text-caption text-gray-600">{insp.serialNumber ?? insp.id}</span>
                    <div>
                      <p className="text-body font-medium text-gray-900">
                        {insp.vehiclePlateNumber} · {insp.vehicleModelName}
                      </p>
                      <p className="text-caption text-gray-500">{insp.vehicleModelYear}년형</p>
                    </div>
                    <span className="text-body text-gray-700">{insp.preferredDate} {insp.preferredTime}</span>
                    <span className="text-caption text-gray-500">{insp.location?.address ?? '-'}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleExpand(insp.id);
                      }}
                      className="p-2 text-gray-500 hover:text-gray-900"
                      aria-label={isExpanded ? '접기' : '펼치기'}
                    >
                      {isExpanded ? (
                        <ChevronUp className="h-5 w-5" />
                      ) : (
                        <ChevronDown className="h-5 w-5" />
                      )}
                    </button>
                  </div>

                  {/* 확장 영역: Figma 1037-5673 선택 카드 상세 — 검차일정·검차장소·검차내역 상세보기 */}
                  {isExpanded && (
                    <div className="px-6 pb-4 pt-2 bg-[#eef5fe]/30 border-t border-gray-100">
                      <p className={`text-caption font-semibold mb-2 ${insp.status === 'in_progress' ? 'text-[#10b981]' : 'text-gray-900'}`}>{INSPECTION_STATUS_LABELS[insp.status]}</p>
                      <div className="flex flex-col gap-1 text-body text-gray-700">
                        <p className="flex items-center gap-2 text-caption">
                          <Clock className="h-4 w-4 text-gray-500" />
                          검차일정 : {insp.preferredDate} {insp.preferredTime}
                        </p>
                        <p className="flex items-center gap-2 text-caption">
                          <MapPin className="h-4 w-4 text-gray-500" />
                          검차장소 : {insp.location?.address ?? '-'}
                        </p>
                      </div>
                      {insp.status === 'completed' && (
                        <Button size="sm" className="mt-4" onClick={(e) => { e.stopPropagation(); navigate(`/inspections/${insp.id}/complete`); }}>
                          검차내역 상세보기
                        </Button>
                      )}
                      {insp.status !== 'completed' && (
                        <Button size="sm" className="mt-4" onClick={(e) => { e.stopPropagation(); handleRowClick(insp); }}>
                          진행하기
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
            </>
            )}
          </div>
          )}
        </main>
      </div>
    </div>
  );
};
