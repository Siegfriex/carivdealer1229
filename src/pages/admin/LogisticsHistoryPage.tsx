/**
 * LogisticsHistoryPage - 탁송 내역
 * Figma 1444:7927 Domestic-Seller 1.0 — 탁송 섹션 (SCR-0601)
 * Layout: Header + Sidebar + Main (IA §3.10)
 */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Truck, Calendar, MapPin, User, Lock, List, LayoutGrid } from 'lucide-react';
import { LandingHeader } from '@/widgets/Header';
import { GnbMinimalSidebar } from '@/widgets/GnbMinimalSidebar';
import { LogisticsSectionTabs } from '@/widgets/LogisticsSectionTabs';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { Z_INDEX } from '@/shared/config/zIndex';
import { apiClient } from '@/shared/api/apiClient';
import { useToast } from '@/shared/ui/Toast';

import { MOCK_LOGISTICS_HISTORY, type MockLogisticsRecord } from '@/shared/api/mockLists';

type ViewMode = 'list' | 'grid';
const VIEW_PARAM = 'view';

export const LogisticsHistoryPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const viewMode: ViewMode = useMemo(
    () => (searchParams.get(VIEW_PARAM) === 'grid' ? 'grid' : 'list'),
    [searchParams]
  );
  const setViewMode = (mode: ViewMode) => {
    if (mode === 'grid') setSearchParams({ [VIEW_PARAM]: 'grid' }, { replace: true });
    else setSearchParams({}, { replace: true });
  };

  const [logistics, setLogistics] = useState<MockLogisticsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLogistics, setSelectedLogistics] = useState<MockLogisticsRecord | null>(null);
  const [pin, setPin] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    loadLogistics();
  }, []);

  const loadLogistics = async () => {
    try {
      setLoading(true);
      setLogistics(MOCK_LOGISTICS_HISTORY);
    } catch {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedLogistics || pin.length !== 6) {
      showToast('6자리 PIN을 입력해주세요.', 'warning');
      return;
    }

    try {
      setIsApproving(true);
      await apiClient.logistics.approveHandover(selectedLogistics.id, pin);
      setLogistics(prev => prev.map(l =>
        l.id === selectedLogistics.id ? { ...l, status: 'completed' as const } : l
      ));

      const vehicleId = selectedLogistics.vehicleId;
      setShowPinModal(false);
      setPin('');
      setSelectedLogistics(null);

      navigate(`/vehicles/${vehicleId}`);
    } catch {
      showToast('인계 승인에 실패했습니다.', 'error');
    } finally {
      setIsApproving(false);
    }
  };

  const statusLabels: Record<string, string> = {
    scheduled: '예약됨',
    dispatched: '배차됨',
    in_transit: '운송중',
    completed: '완료'
  };

  const statusColors: Record<string, string> = {
    scheduled: 'bg-blue-100 text-blue-700',
    dispatched: 'bg-purple-100 text-purple-700',
    in_transit: 'bg-yellow-100 text-yellow-700',
    completed: 'bg-green-100 text-green-700',
  };

  return (
    <div className="min-h-screen bg-fmax-surface flex flex-col">
      <LandingHeader userName="홍길동" variant="main" activeNav="logistics" />

      <div className={`flex w-full ${LAYOUT_CLASSES.CONTAINER}`}>
        <GnbMinimalSidebar sectionTitle="탁송" />
        <main className={`flex-1 min-w-0 p-8 ${LAYOUT_CLASSES.MAIN_LIST}`}>
          <div className="mx-auto max-w-7xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <h1 className="text-h1 font-medium text-fmax-text-main">탁송 내역</h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-md" role="group" aria-label="보기 방식">
                <button
                  type="button"
                  onClick={() => setViewMode('list')}
                  aria-label="리스트 뷰"
                  className={`p-2 rounded transition-fast ${
                    viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <List className="h-5 w-5" />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode('grid')}
                  aria-label="그리드 뷰"
                  className={`p-2 rounded transition-fast ${
                    viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
                  }`}
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
              </div>
              <LogisticsSectionTabs />
              <button
                onClick={() => navigate('/logistics/schedule')}
                className="px-4 py-2.5 bg-fmax-primary text-white rounded-lg hover:opacity-90 transition-opacity text-button font-medium"
              >
                새 탁송 예약
              </button>
            </div>
          </div>
          {loading ? (
            <div className="bg-white rounded-lg p-8 text-center text-body text-fmax-text-sub border border-fmax-border">로딩 중...</div>
          ) : logistics.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center border border-fmax-border">
              <Truck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p className="text-body text-fmax-text-sub">탁송 내역이 없습니다</p>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {logistics.map((log) => (
                <div key={log.id} className="bg-white rounded-lg p-6 border border-fmax-border shadow-sm hover:shadow-md transition-shadow flex flex-col">
                  <div className="flex items-center gap-3 mb-3">
                    <Truck className="w-5 h-5 flex-shrink-0 text-fmax-primary" />
                    <h3 className="text-h3 text-fmax-text-main truncate">{log.plateNumber}</h3>
                    <span className={`px-2 py-1 rounded text-xs font-medium flex-shrink-0 ${statusColors[log.status]}`}>
                      {statusLabels[log.status]}
                    </span>
                  </div>
                  <div className="space-y-2 text-body text-fmax-text-sub flex-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 flex-shrink-0" />
                      <span>{log.scheduleDate} {log.scheduleTime}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{log.address}</span>
                    </div>
                    {log.driverName && (
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 flex-shrink-0" />
                        <span className="text-caption">{log.driverName}</span>
                      </div>
                    )}
                  </div>
                  {log.status === 'in_transit' && (
                    <button
                      onClick={() => {
                        setSelectedLogistics(log);
                        setShowPinModal(true);
                      }}
                      className="mt-4 w-full px-4 py-2 bg-fmax-primary text-white rounded-lg hover:bg-primaryHover transition-colors text-sm font-medium flex items-center justify-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      인계 승인
                    </button>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {logistics.map((log) => (
                <div key={log.id} className="bg-white rounded-lg p-6 border border-fmax-border shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-2">
                        <Truck className="w-5 h-5 flex-shrink-0 text-fmax-primary" />
                        <h3 className="text-h3 text-fmax-text-main">{log.plateNumber}</h3>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[log.status]}`}>
                          {statusLabels[log.status]}
                        </span>
                      </div>
                      <div className="space-y-2 text-body text-fmax-text-sub">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{log.scheduleDate} {log.scheduleTime}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{log.address}</span>
                        </div>
                        {log.driverName && (
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4" />
                            <span>{log.driverName} ({log.driverPhone})</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {log.status === 'in_transit' && (
                      <button
                        onClick={() => {
                          setSelectedLogistics(log);
                          setShowPinModal(true);
                        }}
                        className="px-4 py-2 bg-fmax-primary text-white rounded-lg hover:bg-primaryHover transition-colors text-sm font-medium flex items-center gap-2"
                      >
                        <Lock className="w-4 h-4" />
                        인계 승인
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* PIN Modal */}
      {showPinModal && selectedLogistics && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: Z_INDEX.MODAL_BACKDROP }}>
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-xl" style={{ zIndex: Z_INDEX.MODAL }}>
            <h3 className="text-h3 text-fmax-text-main mb-4">인계 승인</h3>

            {/* Prototype Info */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">프로토타입 안내</p>
              <p className="text-xs text-blue-800 leading-relaxed mb-2">
                <strong>PIN 번호란?</strong> 탁송 기사님이 도착 후 제시하는 6자리 보안 번호입니다.
                차량 상태 확인서 확인, 차키 및 서류 인계가 완료된 후 기사님이 알려주는 PIN을 입력하여
                책임 이관을 승인합니다.
              </p>
              <p className="text-xs text-blue-700 italic">
                현재 프로토타입 단계에서는 임의의 6자리 숫자(예: 123456)를 입력하시면 됩니다.
              </p>
            </div>

            {/* Driver Info */}
            {selectedLogistics.driverName && (
              <div className="bg-white border border-fmax-border rounded-lg p-4 mb-4">
                <h4 className="text-sm font-semibold text-fmax-text-main mb-3 flex items-center gap-2">
                  <User className="w-4 h-4 text-fmax-primary" />
                  기사 정보
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">성함:</span>
                    <span className="font-medium text-fmax-text-main">{selectedLogistics.driverName}</span>
                  </div>
                  {selectedLogistics.driverPhone && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">연락처:</span>
                      <span className="font-medium text-fmax-text-main">{selectedLogistics.driverPhone}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Vehicle Info */}
            <div className="bg-white border border-fmax-border rounded-lg p-4 mb-4">
              <h4 className="text-sm font-semibold text-fmax-text-main mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4 text-fmax-primary" />
                차량 정보
              </h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">차량번호:</span>
                  <span className="font-medium text-fmax-text-main">{selectedLogistics.plateNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">탁송 일시:</span>
                  <span className="font-medium text-fmax-text-main">{selectedLogistics.scheduleDate} {selectedLogistics.scheduleTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">주소:</span>
                  <span className="font-medium text-fmax-text-main">{selectedLogistics.address}</span>
                </div>
              </div>
            </div>

            {/* Checklist */}
            <div className="bg-gray-50 border border-fmax-border rounded-lg p-4 mb-4">
              <h4 className="text-sm font-semibold text-fmax-text-main mb-3">확인 사항</h4>
              <div className="space-y-2 text-xs text-gray-600">
                <div className="flex items-start gap-2">
                  <span className="text-fmax-primary mt-0.5">✓</span>
                  <span>차량 상태 확인서 확인 완료</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-fmax-primary mt-0.5">✓</span>
                  <span>차키 인계 완료</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-fmax-primary mt-0.5">✓</span>
                  <span>서류 인계 완료</span>
                </div>
              </div>
            </div>

            {/* PIN Input */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-fmax-text-main mb-2">PIN (6자리)</label>
                <input
                  type="text"
                  value={pin}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setPin(value);
                  }}
                  placeholder="000000"
                  maxLength={6}
                  className="w-full px-4 py-3 border border-fmax-border rounded-lg focus:outline-none focus:border-fmax-primary text-center text-2xl font-mono tracking-widest"
                />
                <p className="text-xs text-gray-500 mt-2 text-center">
                  기사님이 제시한 6자리 PIN을 입력하세요
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowPinModal(false);
                    setPin('');
                    setSelectedLogistics(null);
                  }}
                  className="flex-1 px-4 py-2 border border-fmax-border text-fmax-text-main rounded-lg hover:bg-fmax-surface transition-colors"
                >
                  취소
                </button>
                <button
                  onClick={handleApprove}
                  disabled={pin.length !== 6 || isApproving}
                  className="flex-1 px-4 py-2 bg-fmax-primary text-white rounded-lg hover:bg-primaryHover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isApproving ? '승인 중...' : '승인'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
