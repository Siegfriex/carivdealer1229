/**
 * LogisticsSchedulePage - 탁송 예약/배차
 * FSD 마이그레이션 완료 (Phase 2.4)
 */

import { useState, useEffect } from 'react';
import { ArrowLeft, Calendar, Clock, MapPin, Truck, CheckCircle2, SkipForward } from 'lucide-react';
import { apiClient } from '@/shared/api/apiClient';
import { useToast } from '@/shared/ui/Toast';

const DESTINATION_ADDRESS = "인천광역시 중구 인천항 물류센터";

export const LogisticsSchedulePage = ({ onNavigate, vehicleId }: { onNavigate: (screen: string, vehicleId?: string) => void; vehicleId?: string }) => {
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [departureAddress, setDepartureAddress] = useState('');
  const [destination, setDestination] = useState(DESTINATION_ADDRESS);
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (vehicleId) {
      setDepartureAddress('서울특별시 강남구 테헤란로 123');
    }
    setDestination(DESTINATION_ADDRESS);
  }, [vehicleId]);

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00',
    '13:00', '14:00', '15:00', '16:00', '17:00'
  ];

  const handleSubmit = async () => {
    if (!selectedDate || !selectedTime || !departureAddress) {
      showToast('날짜와 시간을 선택해주세요.', 'warning');
      return;
    }

    try {
      setIsSubmitting(true);
      await apiClient.logistics.schedule({
        schedule_date: selectedDate,
        schedule_time: selectedTime,
        address: departureAddress,
        vehicle_id: vehicleId || '',
        special_notes: specialNotes,
      });
      setIsConfirmed(true);
    } catch {
      showToast('탁송 예약에 실패했습니다.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSkip = () => {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    setSelectedDate(tomorrow.toISOString().split('T')[0]);
    setSelectedTime('14:00');
    setIsConfirmed(true);
  };

  if (isConfirmed) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 text-center">
        <div className="w-full max-w-md flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center mb-6 relative">
            <div className="absolute inset-0 flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-fmax-success" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-fmax-text-main mb-2">탁송 예약이 완료되었습니다</h2>
          <p className="text-gray-500 text-sm mb-8">배차가 확정되면 알림을 통해 알려드려요!</p>
          <button
            onClick={() => onNavigate('SCR-0601')}
            className="w-full px-4 py-3 bg-fmax-primary text-white rounded-lg hover:bg-primaryHover transition-colors font-medium"
          >
            탁송 내역 보기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fmax-surface flex flex-col">
      <header className="bg-white border-b border-fmax-border px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('SCR-0100')} className="p-2 hover:bg-fmax-surface rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-fmax-text-secondary" />
          </button>
          <h1 className="text-lg font-bold text-fmax-text-main">탁송 예약/배차</h1>
        </div>
      </header>

      <main className="flex-grow p-4 sm:p-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Date Selection */}
              <div className="bg-white rounded-lg p-6 border border-fmax-border">
                <h2 className="text-lg font-bold text-fmax-text-main mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-fmax-primary" />
                  희망 날짜 선택
                </h2>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-fmax-border rounded-lg focus:outline-none focus:border-fmax-primary"
                />
              </div>

              {/* Departure Address */}
              <div className="bg-white rounded-lg p-6 border border-fmax-border">
                <h2 className="text-lg font-bold text-fmax-text-main mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-fmax-primary" />
                  출발지 (차량 등록 주소)
                </h2>
                <input
                  type="text"
                  value={departureAddress}
                  readOnly
                  className="w-full px-4 py-3 border border-fmax-border rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                  placeholder="차량 등록 주소가 자동으로 입력됩니다"
                />
                <p className="text-xs text-gray-500 mt-2">차량 등록 시 입력한 주소가 자동으로 표시됩니다.</p>
              </div>

              {/* Special Notes */}
              <div className="bg-white rounded-lg p-6 border border-fmax-border">
                <h2 className="text-lg font-bold text-fmax-text-main mb-4">특이사항</h2>
                <textarea
                  value={specialNotes}
                  onChange={(e) => setSpecialNotes(e.target.value)}
                  placeholder="키 위치, 특별 주의사항 등을 입력해주세요"
                  rows={4}
                  className="w-full px-4 py-3 border border-fmax-border rounded-lg focus:outline-none focus:border-fmax-primary resize-none"
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Time Selection */}
              <div className="bg-white rounded-lg p-6 border border-fmax-border">
                <h2 className="text-lg font-bold text-fmax-text-main mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-fmax-primary" />
                  희망 시간 선택
                </h2>
                <div className="grid grid-cols-3 gap-3">
                  {timeSlots.map((time) => (
                    <button
                      key={time}
                      onClick={() => setSelectedTime(time)}
                      className={`px-4 py-3 rounded-lg border transition-colors ${
                        selectedTime === time
                          ? 'bg-fmax-primary text-white border-fmax-primary'
                          : 'bg-white border-fmax-border text-fmax-text-main hover:bg-fmax-surface'
                      }`}
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Destination */}
              <div className="bg-white rounded-lg p-6 border border-fmax-border">
                <h2 className="text-lg font-bold text-fmax-text-main mb-4 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-fmax-primary" />
                  도착지
                </h2>
                <input
                  type="text"
                  value={destination}
                  readOnly
                  className="w-full px-4 py-3 border border-fmax-border rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                />
                <p className="text-xs text-gray-500 mt-2">인천항 물류센터로 자동 지정됩니다.</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-6 flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleSkip}
              className="flex-1 px-4 py-3 border border-fmax-border text-fmax-text-sub rounded-lg hover:bg-fmax-surface transition-colors font-medium flex items-center justify-center gap-2"
            >
              <SkipForward className="w-4 h-4" />
              SKIP (테스트용)
            </button>

            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !selectedDate || !selectedTime || !departureAddress}
              className="flex-1 px-4 py-3 bg-fmax-primary text-white rounded-lg hover:bg-primaryHover transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  예약 중...
                </>
              ) : (
                <>
                  <Truck className="w-5 h-5" />
                  탁송 예약 신청
                </>
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};
