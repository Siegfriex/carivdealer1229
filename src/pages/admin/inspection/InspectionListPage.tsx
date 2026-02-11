/**
 * GNB 검차 탭 랜딩. 검차요청내역 리스트/카드뷰. IA §4.4.
 * Figma 1037-5126(리스트), 1037-5673(선택 카드+상세), 1042-4681(헤더+카드) 레이아웃 반영.
 * @see docs/figma/IA_SITEMAP_SPEC_IPOE.md §4.4, §4.10
 * @see docs/figmaMCP/impl_plans/1037-5126_1037-5673_1042-4681_구현계획.md
 * 라우트: /inspections.
 */

import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LandingHeader } from '@/widgets/Header';
import { GnbListLayout } from '@/widgets/GnbListLayout';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { InspectionStatusBadge } from '@/entities/inspection/ui/InspectionStatusBadge';
import { Button } from '@/shared/ui/Button';
import { SegmentedControl, type SegmentedControlOption } from '@/shared/ui/SegmentedControl';
import { ChevronDown, ChevronUp, LayoutList, LayoutGrid, Clock, MapPin } from 'lucide-react';
import { INSPECTION_STATUS_LABELS } from '@/entities/inspection/model/constants';
import { InspectionListCard } from '@/widgets/InspectionListCard';
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
        <GnbListLayout
          sidebar={{
            type: 'minimal',
            sectionTitle: '검차',
            searchValue: searchTerm,
            onSearchChange: setSearchTerm,
          }}
          title="검차 신청목록"
          titleNodeId="1042:4754"
        >
          <div className={`${LAYOUT_CLASSES.MAIN_GNB} w-full ml-auto`}>
            {/* 1행: 좌측 최근 1개월, 우측 리스트/카드 토글 + 검차 신청하기 */}
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
                    onClick={() => setViewMode('list')}
                    className={`flex items-center gap-2 px-4 h-9 text-body font-medium transition-colors ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    aria-pressed={viewMode === 'list'}
                  >
                    <LayoutList className="h-4 w-4" /> 리스트
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('card')}
                    className={`flex items-center gap-2 px-4 h-9 text-body font-medium transition-colors ${viewMode === 'card' ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    aria-pressed={viewMode === 'card'}
                  >
                    <LayoutGrid className="h-4 w-4" /> 카드
                  </button>
                </div>
                <Button size="sm" className="h-9 min-h-0 !py-2 flex items-center !text-body !font-medium !leading-normal" onClick={() => navigate('/inspections/request')}>
                  검차 신청하기
                </Button>
              </div>
            </div>

            {/* 상태 필터 */}
            <div className="mb-6" data-node-id="1367:9463">
              <SegmentedControl
                options={filterOptions}
                value={statusFilter}
                onChange={(value) => setStatusFilter(value as StatusFilter)}
              />
            </div>

          {viewMode === 'card' ? (
            <div
              className={`grid grid-cols-3 ${LAYOUT_CLASSES.GNB_GRID} max-w-[972px] w-full mb-8`}
              data-node-id="1042:4681"
            >
              {inspections.length === 0 ? (
                <div className="col-span-3 p-12 text-center text-[15.627px] text-gray-500 bg-white rounded-[23.441px] border border-gray-200 shadow-[2.34px_3.13px_11.02px_rgba(0,0,0,0.05)]">
                  검차 신청 목록이 없습니다.
                </div>
              ) : (
                inspections.map((insp) => (
                  <InspectionListCard
                    key={insp.id}
                    inspection={insp}
                    onProgress={() => handleRowClick(insp)}
                    onComplete={() => navigate(`/inspections/${insp.id}/complete`)}
                    onTrade={() => {}}
                  />
                ))
              )}
            </div>
          ) : (
          <div className={`w-full ${LAYOUT_CLASSES.MAIN_GNB} flex flex-col`} data-node-id="1037:5126">
            {inspections.length === 0 ? (
              <div className="text-center py-12 px-6 bg-white rounded-[15px] shadow-[2.344px_3.125px_11.017px_0px_rgba(0,0,0,0.05)]">
                <p className="text-body text-gray-600">검차 신청 목록이 없습니다.</p>
                <Button className="mt-4" onClick={() => navigate('/inspections/request')}>
                  검차 신청하기
                </Button>
              </div>
            ) : (
            <>
            {/* 테이블 헤더 Figma 1193:8810: 974×44, sticky — 스크롤 시 컬럼 의미 유지 */}
            <div
              className={`sticky top-0 z-10 grid grid-cols-[28px_1fr_auto_2fr_1.5fr_1.5fr_auto] gap-4 px-6 h-11 items-center bg-white rounded-[15px] text-caption font-semibold text-gray-900 shadow-[2.344px_3.125px_11.017px_0px_rgba(0,0,0,0.05)] ${LAYOUT_CLASSES.MAIN_GNB}`}
              data-node-id="1193:8810"
            >
              <input type="checkbox" className="rounded border-gray-300" aria-label="전체 선택" />
              <span>상태</span>
              <span>일련번호</span>
              <span>차량번호</span>
              <span>검차 일정</span>
              <span>검차 장소</span>
              <span className="w-8" aria-hidden />
            </div>
            <div className="flex flex-col gap-y-2 mt-2 w-full max-w-[974px]">
            {inspections.map((insp) => {
              const isExpanded = expandedIds.has(insp.id);
              return (
                <div
                  key={insp.id}
                  className={`w-full ${LAYOUT_CLASSES.GNB_LIST_ROW_CARD} overflow-hidden`}
                  data-node-id="1037:5391"
                >
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
                    className="grid grid-cols-[28px_1fr_auto_2fr_1.5fr_1.5fr_auto] gap-4 px-6 min-h-[56px] py-3 items-center hover:bg-gray-50/80 cursor-pointer transition-fast"
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
            </div>
            </>
            )}
          </div>
          )}
          </div>
        </GnbListLayout>
      </div>
    </div>
  );
};
