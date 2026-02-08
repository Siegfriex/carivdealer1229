/**
 * InspectionListPage
 * 검차 신청목록 (Figma §3.6 nodeId: 1425:9445 리스트, 1425:9875 카드뷰)
 * 참조: FIGMASCR0208/§3.6_검차/§3.6_1425-9445_검차요청내역_리스트*.png, §3.6_1425-9875_검차요청내역_카드뷰.png
 */

import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { InspectionStatusBadge } from '@/entities/inspection/ui/InspectionStatusBadge';
import { Button } from '@/shared/ui/Button';
import { SegmentedControl, type SegmentedControlOption } from '@/shared/ui/SegmentedControl';
import { Search, ChevronDown, ChevronUp, LayoutList, LayoutGrid } from 'lucide-react';
import type { InspectionStatus } from '@/entities/inspection/model/types';
import { MOCK_INSPECTIONS, type InspectionWithVehicle } from './mockInspectionList';

const STATUS_LABELS: Record<InspectionStatus, string> = {
  pending: '검차자 매칭중',
  assigned: '검차자 매칭완료',
  in_progress: '검차 진행중',
  completed: '검차 완료',
};

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
        {/* 좌측 사이드바 */}
        <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)]">
          <div className="p-4 space-y-6">
            <div>
              <h3 className="text-button font-medium text-gray-700 mb-2">검색</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="차량번호/모델명"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 border border-gray-200 rounded-md text-body text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <h3 className="text-button font-medium text-gray-700 mb-2">목록</h3>
              <ul className="space-y-1">
                <li>
                  <a
                    href="/inspections"
                    className="block px-3 py-2.5 rounded-md text-body font-medium text-primary bg-primary-light"
                  >
                    검차 신청 목록
                  </a>
                </li>
                <li>
                  <a
                    href="/inspections/history"
                    className="block px-3 py-2.5 rounded-md text-body font-medium text-gray-700 hover:bg-gray-100"
                  >
                    검차내역
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-h1 font-bold text-gray-900">검차 신청목록</h1>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {inspections.length === 0 ? (
                <div className="col-span-full p-12 text-center text-body text-gray-500 bg-white rounded-lg border border-gray-200">
                  검차 신청 목록이 없습니다.
                </div>
              ) : (
                inspections.map((insp) => (
                  <div
                    key={insp.id}
                    className="bg-white rounded-lg border border-gray-200 p-6 shadow-md"
                  >
                    <div className="w-full h-32 bg-gray-100 rounded mb-4 flex items-center justify-center">
                      <span className="text-caption text-gray-400">차량 이미지</span>
                    </div>
                    <p className="text-body font-medium text-gray-900 mb-1">{insp.vehiclePlateNumber}</p>
                    <p className="text-body text-gray-600 mb-2">{insp.vehicleModelName} {insp.vehicleModelYear}</p>
                    <p className="text-caption text-gray-500 mb-3">
                      검차일정: {insp.preferredDate} {insp.preferredTime}
                    </p>
                    <p className="text-caption text-gray-500 mb-4">일련번호: {insp.id}</p>
                    <InspectionStatusBadge status={insp.status} size="sm" className="mb-4" />
                    <div className="flex flex-wrap gap-2">
                      {insp.status === 'completed' && (
                        <Button size="sm" variant="secondary" onClick={() => navigate(`/inspections/${insp.id}/complete`)}>
                          검차내역 상세보기
                        </Button>
                      )}
                      <Button size="sm" variant="secondary">거래하기</Button>
                      <Button size="sm" variant="ghost">삭제</Button>
                      <Button size="sm" variant="ghost">수정하기</Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
          <div className="bg-white rounded-lg shadow-md border border-gray-200 divide-y divide-gray-200">
            {inspections.length === 0 ? (
              <div className="text-center py-12 px-6">
                <p className="text-body text-gray-600">검차 신청 목록이 없습니다.</p>
                <Button className="mt-4" onClick={() => navigate('/inspections/request')}>
                  검차 신청하기
                </Button>
              </div>
            ) : (
            <>
            {/* 테이블 헤더 (참조 §3.6_1425-9445) */}
            <div className="grid grid-cols-[auto_1fr_auto_2fr_1.5fr_1.5fr_auto] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-200 text-caption font-medium text-gray-500">
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
                    className="grid grid-cols-[auto_1fr_auto_2fr_1.5fr_1.5fr_auto] gap-4 px-6 py-4 hover:bg-gray-50 cursor-pointer transition-fast items-center"
                  >
                    <input
                      type="checkbox"
                      className="rounded border-gray-300"
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`${insp.vehiclePlateNumber} 선택`}
                    />
                    <InspectionStatusBadge status={insp.status} size="sm" />
                    <span className="text-caption text-gray-600">{insp.id}</span>
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

                  {/* 확장 영역: 상세 (4-1) */}
                  {isExpanded && (
                    <div className="px-6 pb-4 pt-0 bg-gray-50 border-t border-gray-100">
                      <div className="grid grid-cols-2 gap-4 text-body text-gray-700">
                        <div>
                          <span className="text-caption text-gray-500">희망일시</span>
                          <p>{insp.preferredDate} {insp.preferredTime}</p>
                        </div>
                        <div>
                          <span className="text-caption text-gray-500">평가사</span>
                          <p>{insp.evaluatorName || '-'}</p>
                        </div>
                        <div>
                          <span className="text-caption text-gray-500">상태</span>
                          <p>{STATUS_LABELS[insp.status]}</p>
                        </div>
                      </div>
                      {insp.status !== 'completed' && (
                        <Button
                          size="sm"
                          className="mt-4"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRowClick(insp);
                          }}
                        >
                          진행하기
                        </Button>
                      )}
                      {insp.status === 'completed' && (
                        <Button size="sm" variant="secondary" className="mt-4" onClick={goToHistory}>
                          검차내역 보기
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
