/**
 * InspectionListPage
 * 검차 신청 목록 (Figma 1202-6685)
 * GNB "검차" 클릭 또는 검차신청 랜딩 임시저장 시 이동
 * 목록 행 클릭/벡터 아이콘으로 확장(4-1), 상태별로 5/5-1/5-2/6 이동
 */

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { InspectionStatusBadge } from '@/entities/inspection/ui/InspectionStatusBadge';
import { Button } from '@/shared/ui/Button';
import { SegmentedControl, type SegmentedControlOption } from '@/shared/ui/SegmentedControl';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import type { InspectionStatus } from '@/entities/inspection/model/types';
import { MOCK_INSPECTIONS, type InspectionWithVehicle } from './mockInspectionList';

const STATUS_LABELS: Record<InspectionStatus, string> = {
  pending: '검차자 매칭중',
  assigned: '검차자 매칭완료',
  in_progress: '검차 진행중',
  completed: '검차 완료',
};

type StatusFilter = 'all' | 'pending' | 'assigned' | 'in_progress' | 'completed';

export const InspectionListPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');

  // 상태별 건수 계산
  const statusCounts = useMemo(() => {
    const counts = {
      all: MOCK_INSPECTIONS.length,
      pending: MOCK_INSPECTIONS.filter((i) => i.status === 'pending').length,
      assigned: MOCK_INSPECTIONS.filter((i) => i.status === 'assigned').length,
      in_progress: MOCK_INSPECTIONS.filter((i) => i.status === 'in_progress').length,
      completed: MOCK_INSPECTIONS.filter((i) => i.status === 'completed').length,
    };
    return counts;
  }, []);

  // 필터 옵션
  const filterOptions: SegmentedControlOption<StatusFilter>[] = [
    { value: 'all', label: '전체', count: statusCounts.all },
    { value: 'pending', label: '검차자 매칭중', count: statusCounts.pending },
    { value: 'assigned', label: '검차자 매칭완료', count: statusCounts.assigned },
    { value: 'in_progress', label: '검차 진행중', count: statusCounts.in_progress },
    { value: 'completed', label: '검차 완료', count: statusCounts.completed },
  ];

  const inspections = useMemo(() => {
    let filtered = MOCK_INSPECTIONS;

    // 상태 필터
    if (statusFilter !== 'all') {
      filtered = filtered.filter((insp) => insp.status === statusFilter);
    }

    // 검색 필터
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

      <div className="flex max-w-[1440px] mx-auto">
        {/* 좌측 사이드바 */}
        <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
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
            <h1 className="text-h1 font-bold text-gray-900">검차 신청 목록</h1>
            <Button size="md" onClick={() => (navigate('/inspections/request'))}>
              검차 신청하기
            </Button>
          </div>

          {/* 상태 필터 탭 */}
          <div className="mb-6">
            <SegmentedControl
              options={filterOptions}
              value={statusFilter}
              onChange={(value) => setStatusFilter(value as StatusFilter)}
            />
          </div>

          {/* 리스트 컨테이너 */}
          <div className="bg-white rounded-lg shadow-md border border-gray-200 divide-y divide-gray-200">
            {inspections.map((insp) => {
              const isExpanded = expandedIds.has(insp.id);
              return (
                <div key={insp.id} className="border-b border-gray-200 last:border-b-0">
                  {/* 행: 클릭 시 확장 또는 진행 페이지 이동 */}
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
                    className="flex items-center justify-between px-6 py-4 hover:bg-gray-50 cursor-pointer transition-fast"
                  >
                    <div className="flex items-center gap-4">
                      <div>
                        <p className="text-body font-medium text-gray-900">
                          {insp.vehiclePlateNumber} · {insp.vehicleModelName}
                        </p>
                        <p className="text-caption text-gray-500">
                          {insp.preferredDate} {insp.preferredTime} · {insp.vehicleModelYear}년형
                        </p>
                      </div>
                      <InspectionStatusBadge status={insp.status} size="sm" />
                    </div>
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
          </div>

          {inspections.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
              <p className="text-body text-gray-600">검차 신청 목록이 없습니다.</p>
              <Button className="mt-4" onClick={() => (navigate('/inspections/request'))}>
                검차 신청하기
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
