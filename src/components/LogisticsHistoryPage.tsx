import React, { useState, useEffect } from 'react';
import { ArrowLeft, Truck, Calendar, MapPin, User, CheckCircle2, Lock } from 'lucide-react';
import { apiClient } from '../services/api';

interface LogisticsRecord {
  id: string;
  vehicleId: string;
  plateNumber: string;
  scheduleDate: string;
  scheduleTime: string;
  address: string;
  driverName?: string;
  driverPhone?: string;
  status: 'scheduled' | 'dispatched' | 'in_transit' | 'completed';
  pin?: string;
}

const LogisticsHistoryPage = ({ onNavigate }: { onNavigate: (screen: string, vehicleId?: string) => void }) => {
  const [logistics, setLogistics] = useState<LogisticsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLogistics, setSelectedLogistics] = useState<LogisticsRecord | null>(null);
  const [pin, setPin] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    loadLogistics();
  }, []);

  const loadLogistics = async () => {
    try {
      setLoading(true);
      // TODO: Firestore에서 실제 탁송 내역 로드
      // 임시 Mock 데이터
      const mockLogistics: LogisticsRecord[] = [
        {
          id: 'log-001',
          vehicleId: 'v-106',
          plateNumber: '33바 3333',
          scheduleDate: '2025-05-25',
          scheduleTime: '14:00',
          address: '서울특별시 강남구 테헤란로 123',
          driverName: '김택시',
          driverPhone: '010-1234-5678',
          status: 'in_transit'
        },
        {
          id: 'log-002',
          vehicleId: 'v-107',
          plateNumber: '77사 7777',
          scheduleDate: '2025-05-24',
          scheduleTime: '10:00',
          address: '서울특별시 서초구 서초대로 456',
          driverName: '박운송',
          driverPhone: '010-9876-5432',
          status: 'completed'
        },
      ];
      setLogistics(mockLogistics);
    } catch (error) {
      console.error('Failed to load logistics:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedLogistics || pin.length !== 6) {
      alert('6자리 PIN을 입력해주세요.');
      return;
    }

    try {
      setIsApproving(true);
      await apiClient.logistics.approveHandover(selectedLogistics.id, pin);
      setLogistics(prev => prev.map(l => 
        l.id === selectedLogistics.id ? { ...l, status: 'completed' as const } : l
      ));
      
      // ✅ 인계 승인 완료 후 SCR-0105로 이동 (명세: SCR-0601 → SCR-0105)
      const vehicleId = selectedLogistics.vehicleId;
      setShowPinModal(false);
      setPin('');
      setSelectedLogistics(null);
      
      // 정산 상세 화면으로 이동
      onNavigate('SCR-0105', vehicleId);
      
    } catch (error) {
      console.error('Failed to approve handover:', error);
      alert('인계 승인에 실패했습니다.');
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
      <header className="bg-white border-b border-fmax-border px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('SCR-0100')} className="p-2 hover:bg-fmax-surface rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-fmax-text-secondary" />
          </button>
          <h1 className="text-lg font-bold text-fmax-text-main">탁송 내역</h1>
        </div>
        <button
          onClick={() => onNavigate('SCR-0600')}
          className="px-4 py-2 bg-fmax-primary text-white rounded-lg hover:bg-primaryHover transition-colors text-sm font-medium"
        >
          새 탁송 예약
        </button>
      </header>

      <main className="flex-grow p-4 sm:p-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
          {loading ? (
            <div className="bg-white rounded-lg p-8 text-center text-gray-500">로딩 중...</div>
          ) : logistics.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center text-gray-500">
              <Truck className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>탁송 내역이 없습니다</p>
            </div>
          ) : (
            logistics.map((log) => (
              <div key={log.id} className="bg-white rounded-lg p-6 border border-fmax-border hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Truck className="w-5 h-5 text-fmax-primary" />
                      <h3 className="font-bold text-fmax-text-main">{log.plateNumber}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${statusColors[log.status]}`}>
                        {statusLabels[log.status]}
                      </span>
                    </div>
                    <div className="space-y-2 text-sm text-gray-600">
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
            ))
          )}
        </div>
      </main>

      {/* PIN Modal - 개선된 버전 */}
      {showPinModal && selectedLogistics && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-fmax-text-main mb-4">인계 승인</h3>
            
            {/* 프로토타입 안내 */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-4">
              <p className="text-sm font-semibold text-blue-900 mb-2">📌 프로토타입 안내</p>
              <p className="text-xs text-blue-800 leading-relaxed mb-2">
                <strong>PIN 번호란?</strong> 탁송 기사님이 도착 후 제시하는 6자리 보안 번호입니다. 
                차량 상태 확인서 확인, 차키 및 서류 인계가 완료된 후 기사님이 알려주는 PIN을 입력하여 
                책임 이관을 승인합니다.
              </p>
              <p className="text-xs text-blue-700 italic">
                💡 현재 프로토타입 단계에서는 임의의 6자리 숫자(예: 123456)를 입력하시면 됩니다.
              </p>
            </div>

            {/* 기사 정보 */}
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

            {/* 차량 정보 */}
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

            {/* 확인 사항 */}
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

            {/* PIN 입력 */}
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
  );
};

export default LogisticsHistoryPage;

