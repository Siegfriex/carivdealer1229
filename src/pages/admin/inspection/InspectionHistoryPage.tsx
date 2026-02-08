/**
 * InspectionHistoryPage
 * 검차내역 (Figma §3.6 nodeId: 1425:9661 리스트, 1425:9875 카드 뷰)
 * 완료된 검차 목록, 리스트/카드 뷰 전환 지원 (/inspections/history?view=card)
 */

import { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { Search, ChevronRight, LayoutList, LayoutGrid } from 'lucide-react';
import { MOCK_INSPECTIONS, type InspectionWithVehicle } from './mockInspectionList';

const completedInspections = MOCK_INSPECTIONS.filter((i) => i.status === 'completed');

type ViewMode = 'list' | 'card';

export const InspectionHistoryPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');

  const viewMode: ViewMode = useMemo(() => {
    const v = searchParams.get('view');
    return v === 'card' ? 'card' : 'list';
  }, [searchParams]);

  const setViewMode = (mode: ViewMode) => {
    if (mode === 'card') setSearchParams({ view: 'card' }, { replace: true });
    else setSearchParams({}, { replace: true });
  };

  const list = completedInspections.filter((insp) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      (insp.vehiclePlateNumber && insp.vehiclePlateNumber.toLowerCase().includes(q)) ||
      (insp.vehicleModelName && insp.vehicleModelName.toLowerCase().includes(q))
    );
  });

  const goToDetail = (insp: InspectionWithVehicle) => {
    navigate(`/inspections/${insp.id}/complete`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader userName="홍길동" variant="main" activeNav="inspections" />

      <div className={`flex ${LAYOUT_CLASSES.CONTAINER}`}>
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
                    className="block px-3 py-2.5 rounded-md text-body font-medium text-gray-700 hover:bg-gray-100"
                  >
                    검차 신청 목록
                  </a>
                </li>
                <li>
                  <a
                    href="/inspections/history"
                    className="block px-3 py-2.5 rounded-md text-body font-medium text-primary bg-primary-light"
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
            <h1 className="text-h1 font-bold text-gray-900">검차내역</h1>
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
          </div>

          {viewMode === 'card' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {list.length === 0 ? (
                <div className="col-span-full p-12 text-center text-body text-gray-500 bg-white rounded-lg border border-gray-200">
                  완료된 검차 내역이 없습니다.
                </div>
              ) : (
                list.map((insp) => (
                  <button
                    type="button"
                    key={insp.id}
                    onClick={() => goToDetail(insp)}
                    className="text-left bg-white rounded-lg border border-gray-200 p-6 shadow-md hover:border-primary hover:shadow transition-colors"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-body font-medium text-gray-900">
                        {insp.vehiclePlateNumber ?? '-'}
                      </span>
                      <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                    </div>
                    <p className="text-body text-gray-600 mb-1">
                      {insp.vehicleModelName} {insp.vehicleModelYear}
                    </p>
                    <p className="text-caption text-gray-500">
                      검차일시: {insp.preferredDate} {insp.preferredTime}
                      {insp.evaluatorName && ` · ${insp.evaluatorName}`}
                    </p>
                  </button>
                ))
              )}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md border border-gray-200 divide-y divide-gray-200">
              {list.length === 0 ? (
                <div className="p-12 text-center text-body text-gray-500">
                  완료된 검차 내역이 없습니다.
                </div>
              ) : (
                list.map((insp) => (
                  <button
                    type="button"
                    key={insp.id}
                    onClick={() => goToDetail(insp)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3">
                        <span className="text-body font-medium text-gray-900">
                          {insp.vehiclePlateNumber ?? '-'}
                        </span>
                        <span className="text-body text-gray-600">
                          {insp.vehicleModelName} {insp.vehicleModelYear}
                        </span>
                      </div>
                      <div className="mt-1 text-caption text-gray-500">
                        검차일시: {insp.preferredDate} {insp.preferredTime}
                        {insp.evaluatorName && ` · 평가사 ${insp.evaluatorName}`}
                      </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                  </button>
                ))
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
