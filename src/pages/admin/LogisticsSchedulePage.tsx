/**
 * LogisticsSchedulePage (Figma 1714-22874 GNB 탁송 탭, 1272-12926 본격 탁송 리스트·하단 상태 전환)
 * 탁송 전용 페이지. GNB 탁송 탭 = /logistics/schedule (차량목록 탭 탁송단계 필터 /vehicles?stage=logistics 와 별도).
 * - 목록 뷰: 탁송 목록 제목, 리스트 카드(314×291), 그리드 972px gap 15, 페이지네이션, "새 탁송예약" 버튼.
 * - 리스트 항목 클릭 시 하단 해당 상태 중 1로 전환(탁송일정·탁송 배정·픽업 완료·인계완료), 상태 저장.
 * - 새 탁송예약 → 폼(1272-13294) → 기사배정 진행중(1272-15049) → 탁송완료(1272-13099): 탁송목록으로 돌아가기 / 정산단계 진행(인계확정 시만).
 * @see docs/figmaMCP/impl_plans/CTA_4_탁송_플로우_요약.md
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Calendar, MapPin, CheckCircle2 } from 'lucide-react';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { GnbMinimalSidebar } from '@/widgets/GnbMinimalSidebar';
import { GnbListLayout } from '@/widgets/GnbListLayout';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { apiClient } from '@/shared/api/apiClient';
import { useToast } from '@/shared/ui/Toast';
import { Button } from '@/shared/ui/Button';
import { Pagination } from '@/shared/ui/Pagination';

const DESTINATION_ADDRESS = '인천광역시 중구 인천항 물류센터';

/** 탁송 상태 4개 (CTA_4 요약) */
const LOGISTICS_STATES = [
  { id: 'schedule', label: '탁송일정', color: 'text-sky-500' },
  { id: 'assigned', label: '탁송 배정', color: 'text-emerald-600' },
  { id: 'pickup_done', label: '픽업 완료', color: 'text-blue-600' },
  { id: 'handover_done', label: '인계완료', color: 'text-primary' },
] as const;
type LogisticsStateId = (typeof LOGISTICS_STATES)[number]['id'];

type ViewMode = 'list' | 'form' | 'driver_assigning' | 'complete';

/** 목록용 mock 항목 (상태 저장) */
interface LogisticsItem {
  id: string;
  plateNumber: string;
  modelName: string;
  modelYear: string;
  mileage: string;
  state: LogisticsStateId;
  thumbnailUrl?: string;
}

const MOCK_LOGISTICS_LIST: LogisticsItem[] = [
  { id: '1', plateNumber: '12바 1234', modelName: 'G70 3T 스포츠 엘리트', modelYear: '2020', mileage: '--', state: 'schedule' },
  { id: '2', plateNumber: '34가 5678', modelName: 'G70 3T 스포츠 엘리트', modelYear: '2020', mileage: '9.0', state: 'assigned' },
  { id: '3', plateNumber: '56나 9012', modelName: 'G70 3T 스포츠 엘리트', modelYear: '2018', mileage: '14.6', state: 'pickup_done' },
];

const PAGE_SIZE = 9;

export const LogisticsSchedulePage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const vehicleId = searchParams.get('vehicleId') ?? undefined;

  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [listItems, setListItems] = useState<LogisticsItem[]>(() => MOCK_LOGISTICS_LIST.map((i) => ({ ...i })));
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [listPage, setListPage] = useState(1);

  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [datePickerStep, setDatePickerStep] = useState<'closed' | 'year' | 'month'>('closed');
  const [selectedYear, setSelectedYear] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [departureAddress, setDepartureAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [destination] = useState(DESTINATION_ADDRESS);
  const [specialNotes, setSpecialNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const { showToast } = useToast();

  const currentYear = new Date().getFullYear();
  const MONTH_LABELS = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];

  useEffect(() => {
    if (vehicleId) setDepartureAddress('서울특별시 강남구 테헤란로 123');
  }, [vehicleId]);

  const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];
  /** 1272-14309: 시간 표기 "오전 09:00" / "오후 12:00" SSOT */
  const formatTimeLabel = (time: string) => {
    const [h] = time.split(':').map(Number);
    if (h < 12) return `오전 ${time}`;
    if (h === 12) return `오후 12:00`;
    return `오후 ${String(h - 12).padStart(2, '0')}:00`;
  };
  /** design_context 1272:13454 — "2026년 1월 25일 일요일" 형식 */
  const formatDateLabel = (isoDate: string) => {
    if (!isoDate) return '';
    const d = new Date(isoDate + 'T12:00:00');
    const weekdays = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
    return `${d.getFullYear()}년 ${d.getMonth() + 1}월 ${d.getDate()}일 ${weekdays[d.getDay()]}`;
  };

  const selectedItem = selectedId ? listItems.find((i) => i.id === selectedId) : null;
  const totalPages = Math.max(1, Math.ceil(listItems.length / PAGE_SIZE));
  const paginatedItems = listItems.slice((listPage - 1) * PAGE_SIZE, listPage * PAGE_SIZE);

  const setItemState = (id: string, state: LogisticsStateId) => {
    setListItems((prev) => prev.map((i) => (i.id === id ? { ...i, state } : i)));
  };

  const handleSubmitReservation = async () => {
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
      setViewMode('driver_assigning');
    } catch {
      showToast('탁송 예약에 실패했습니다.', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteDriverAssigning = () => setViewMode('complete');
  const handleBackToList = () => {
    setViewMode('list');
    setSelectedDate('');
    setSelectedTime('');
    setDatePickerStep('closed');
    setSelectedYear('');
    setPostalCode('');
    setDepartureAddress('');
    setDetailAddress('');
    setSelectedId(null);
  };

  const handleYearSelect = (year: number) => {
    setSelectedYear(String(year));
    setDatePickerStep('month');
  };
  const handleMonthSelect = (month: number) => {
    const monthStr = String(month).padStart(2, '0');
    setSelectedDate(`${selectedYear}-${monthStr}-01`);
    setDatePickerStep('closed');
  };
  const isHandoverConfirmed = true; // 실제로는 해당 건 인계확정 여부

  // ——— 탁송완료 (1272-13099): metadata 1272:13152 972×473, 제목 2줄, 버튼 영역 ———
  if (viewMode === 'complete') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col" data-node-id="1272:13099">
        <LandingHeader userName="홍길동" variant="main" activeNav="logistics" />
        <div className={`flex ${LAYOUT_CLASSES.CONTAINER}`}>
          <GnbMinimalSidebar sectionTitle="탁송" className={LAYOUT_CLASSES.GNB_SIDEBAR} />
          <main className="flex-1 min-w-0 flex flex-col items-center justify-center p-8">
            <div className="w-full max-w-[972px] min-h-[473px] flex flex-col items-center justify-center text-center py-12" data-node-id="1272:13152">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-h2 font-medium text-gray-900 mb-2" data-node-id="1272:13153">탁송이 완료되었습니다</h2>
              <p className="text-body text-gray-600 mb-8 max-w-md" data-node-id="1272:13154">정산 단계로 진행하시겠습니까?</p>
              <div className="flex flex-col sm:flex-row gap-3 w-[400px] min-h-[160px] sm:min-h-0 justify-center items-center" data-node-id="1272:13155">
                <Button onClick={handleBackToList} className="w-full sm:w-auto min-w-[180px]" variant="primary">
                  탁송 목록으로
                </Button>
                <Button
                  onClick={() => navigate('/settlements')}
                  className="w-full sm:w-auto min-w-[180px]"
                  variant="secondary"
                  disabled={!isHandoverConfirmed}
                >
                  정산단계 진행
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ——— 기사배정 진행중 (1272-15049): metadata 1272:15133 381×324.96, 1272:15135 "탁송 기사 배정 중", 1272:15136 "잠시만 기다려 주세요" ———
  if (viewMode === 'driver_assigning') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col" data-node-id="1272:15049">
        <LandingHeader userName="홍길동" variant="main" activeNav="logistics" />
        <div className={`flex ${LAYOUT_CLASSES.CONTAINER}`}>
          <GnbMinimalSidebar sectionTitle="탁송" className={LAYOUT_CLASSES.GNB_SIDEBAR} />
          <main className="flex-1 min-w-0 flex flex-col items-center justify-center p-8">
            <div
              className="w-[381px] min-h-[324.96px] flex flex-col items-center text-center"
              data-node-id="1272:15133"
            >
              <div className="w-[157px] h-[157px] rounded-full bg-primary/10 flex items-center justify-center mb-8" data-node-id="1272:15137">
                <MapPin className="w-12 h-12 text-primary animate-pulse" />
              </div>
              <h2 className="text-h1 leading-tight font-extrabold text-primary mb-0" data-node-id="1272:15135">
                탁송 기사 배정 중
              </h2>
              <p className="text-form-label leading-relaxed text-black mt-3 mb-8" data-node-id="1272:15136">
                잠시만 기다려 주세요
              </p>
              <Button onClick={handleCompleteDriverAssigning} variant="primary">
                완료 (테스트)
              </Button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ——— 새 탁송예약 폼 (1272-13294): metadata 1272:13402 970.8×539 ———
  if (viewMode === 'form') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col" data-node-id="1272:13294">
        <LandingHeader userName="홍길동" variant="main" activeNav="logistics" />
        <div className={`flex w-full ${LAYOUT_CLASSES.CONTAINER}`}>
          <GnbMinimalSidebar sectionTitle="탁송" className={LAYOUT_CLASSES.GNB_SIDEBAR} />
          <main className="flex-1 min-w-0 p-8">
            <div className={`mx-auto ${LAYOUT_CLASSES.FORM_MAIN}`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h1 className="text-h1 font-medium text-gray-900">새 탁송 예약</h1>
                <Button variant="secondary" size="sm" onClick={handleBackToList}>
                  목록으로
                </Button>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  {/* 1272:13433 design_context — "탁송 일정": 날짜 선택 * (위), 시간 선택 * (아래), 표기 "2026년 1월 25일 일요일" / "오후 12:00" */}
                  <div className={`${LAYOUT_CLASSES.FORM_SECTION_CARD} rounded-lg`} data-node-id="1272:13433">
                    <h2 className="text-section-title font-bold text-gray-900 mb-4 flex items-center gap-2" data-node-id="1272:13438">
                      <Calendar className="w-5 h-5 text-primary" />
                      탁송 일정
                    </h2>
                    <div className="flex flex-col gap-4">
                      <div>
                        <label className="flex items-center gap-1 text-form-label text-gray-500 mb-1">날짜 선택 <span className="text-red-500">*</span></label>
                        {datePickerStep === 'closed' && (
                          <>
                            <button
                              type="button"
                              onClick={() => setDatePickerStep('year')}
                              className={`w-full px-5 py-3 ${LAYOUT_CLASSES.INPUT_FIELD} text-left text-form-input text-black/40 hover:bg-gray-100 focus:outline-none focus:border-primary`}
                            >
                              {selectedDate ? formatDateLabel(selectedDate) : '날짜를 선택하세요'}
                            </button>
                            <input
                              type="date"
                              value={selectedDate}
                              onChange={(e) => setSelectedDate(e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
                              className={`mt-2 w-full px-5 py-3 ${LAYOUT_CLASSES.INPUT_FIELD} text-form-input focus:outline-none focus:border-primary`}
                              aria-label="날짜 직접 입력"
                            />
                          </>
                        )}
                        {datePickerStep === 'year' && (
                          <div className="space-y-3" data-node-id="1272:13503">
                            <p className="text-form-label text-gray-500">연도를 선택하세요</p>
                            <div className="flex flex-wrap gap-3">
                              {[currentYear, currentYear + 1].map((y) => (
                                <button
                                  key={y}
                                  type="button"
                                  onClick={() => handleYearSelect(y)}
                                  className={`px-5 py-2.5 rounded-md border text-form-input font-medium transition-colors ${
                                    selectedYear === String(y) ? 'bg-primary text-white border-primary' : 'bg-white border-form-field-border text-gray-900 hover:bg-gray-50'
                                  }`}
                                >
                                  {y}년
                                </button>
                              ))}
                            </div>
                            <button type="button" onClick={() => setDatePickerStep('closed')} className="text-sm text-gray-500 hover:text-gray-700">취소</button>
                          </div>
                        )}
                        {datePickerStep === 'month' && (
                          <div className="space-y-3" data-node-id="1272:13819">
                            <p className="text-form-label text-gray-500">{selectedYear}년 — 월을 선택하세요</p>
                            <div className="grid grid-cols-3 gap-3">
                              {MONTH_LABELS.map((label, i) => (
                                <button
                                  key={label}
                                  type="button"
                                  onClick={() => handleMonthSelect(i + 1)}
                                  className={`px-4 py-3 rounded-md border border-form-field-border bg-white text-gray-900 hover:bg-gray-50 focus:outline-none focus:border-primary text-form-input font-medium`}
                                >
                                  {label}
                                </button>
                              ))}
                            </div>
                            <button type="button" onClick={() => setDatePickerStep('year')} className="text-sm text-gray-500 hover:text-gray-700">연도 다시 선택</button>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="flex items-center gap-1 text-form-label text-gray-500 mb-1">시간 선택 <span className="text-red-500">*</span></label>
                        <div className="grid grid-cols-3 gap-3" data-node-id="1272:14309">
                          {timeSlots.map((time) => (
                            <button
                              key={time}
                              type="button"
                              onClick={() => setSelectedTime(time)}
                              className={`px-4 py-3 rounded-md border text-form-input transition-colors ${
                                selectedTime === time ? 'bg-primary text-white border-primary' : 'bg-form-field-bg border-form-field-border text-gray-900 hover:bg-gray-100'
                              }`}
                            >
                              {formatTimeLabel(time)}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className={`${LAYOUT_CLASSES.FORM_SECTION_CARD} rounded-lg`} data-node-id="1272:13402">
                    <h2 className="text-section-title font-bold text-gray-900 mb-4 flex items-center gap-2" data-node-id="1272:13407">
                      <MapPin className="w-5 h-5 text-primary" />
                      탁송 장소
                    </h2>
                    <div className="flex flex-col gap-3">
                      <div>
                        <label className="flex items-center gap-1 text-form-label text-gray-500 mb-1">우편번호 <span className="text-red-500">*</span></label>
                        <div className="flex gap-2 flex-wrap">
                          <input
                            type="text"
                            value={postalCode}
                            onChange={(e) => setPostalCode(e.target.value)}
                            placeholder="우편번호를 입력해 주세요"
                            className={`flex-1 min-w-[200px] px-5 py-3 ${LAYOUT_CLASSES.INPUT_FIELD} text-form-input placeholder:text-black/40`}
                          />
                          <Button variant="primary" size="sm" onClick={() => setAddressModalOpen(true)} className="h-[64px] px-5 text-form-input rounded-md">
                            우편번호 찾기
                          </Button>
                        </div>
                      </div>
                      <div>
                        <label className="flex items-center gap-1 text-form-label text-gray-500 mb-1">주소지 <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={departureAddress}
                          onChange={(e) => setDepartureAddress(e.target.value)}
                          placeholder="주소지를 입력해 주세요"
                          className={`w-full px-5 py-3 ${LAYOUT_CLASSES.INPUT_FIELD} text-form-input placeholder:text-black/40`}
                        />
                      </div>
                      <div>
                        <label className="flex items-center gap-1 text-form-label text-gray-500 mb-1">상세주소 <span className="text-red-500">*</span></label>
                        <input
                          type="text"
                          value={detailAddress}
                          onChange={(e) => setDetailAddress(e.target.value)}
                          placeholder="상세주소를 입력해 주세요"
                          className={`w-full px-5 py-3 ${LAYOUT_CLASSES.INPUT_FIELD} text-form-input placeholder:text-black/40`}
                        />
                      </div>
                    </div>
                    {addressModalOpen && (
                      <>
                        <div className="fixed inset-0 bg-black/30 z-40" aria-hidden onClick={() => setAddressModalOpen(false)} />
                        <div
                          className={`fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 overflow-auto bg-white rounded-2xl shadow-xl flex flex-col ${LAYOUT_CLASSES.ADDRESS_MODAL}`}
                          data-node-id="1272:14540"
                        >
                          <div className="p-6 flex-1 flex flex-col" data-node-id="1272:14749">
                            <div className="flex justify-end mb-2">
                              <button type="button" onClick={() => setAddressModalOpen(false)} className="p-1 text-gray-500 hover:text-gray-700" aria-label="X 닫기">
                                <span className="text-lg leading-none">×</span>
                              </button>
                            </div>
                            <h3 className="text-h3 text-gray-900 mb-1" data-node-id="1272:14757">주소를 검색해 주세요</h3>
                            <p className="text-body text-gray-600 mb-6" data-node-id="1272:14758">이렇게 검색해 보세요!</p>
                            <div className="flex gap-2 mb-4" data-node-id="1272:14763">
                              <input
                                type="text"
                                placeholder="도로명, 지번, 건물명 검색"
                                className="flex-1 px-4 py-3 border border-gray-200 rounded-lg text-body"
                                aria-label="도로명, 지번, 건물명 검색"
                              />
                              <Button type="button" variant="primary" size="sm" className="shrink-0" data-node-id="1272:14770">
                                검색
                              </Button>
                            </div>
                            <p className="text-caption text-gray-500 mb-1">도로명+건물번호</p>
                            <p className="text-caption text-gray-500 mb-1">예) 정자일로 95, 불정로 6</p>
                            <p className="text-caption text-gray-500">예) 정자동 178-4, 동면 만천리 1000</p>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <h2 className="text-h3 text-gray-900 mb-4">특이사항</h2>
                    <textarea
                      value={specialNotes}
                      onChange={(e) => setSpecialNotes(e.target.value)}
                      placeholder="키 위치, 특별 주의사항 등"
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-primary resize-none"
                    />
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
                    <h2 className="text-h3 text-gray-900 mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-primary" />
                      도착지
                    </h2>
                    <input
                      type="text"
                      value={destination}
                      readOnly
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-gray-600 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 flex gap-3">
                <Button variant="secondary" onClick={handleBackToList}>
                  취소
                </Button>
                <Button
                  onClick={handleSubmitReservation}
                  disabled={isSubmitting || !selectedDate || !selectedTime || !departureAddress}
                >
                  {isSubmitting ? '예약 중...' : '탁송 예약 신청'}
                </Button>
              </div>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // ——— 탁송 목록 (1714-22874, 1272-12926: 리스트 클릭 시 하단 상태 전환) ———
  const listFooter = (
    <footer className="py-6 border-t border-gray-200 mt-auto">
      <p className="text-caption text-gray-500 text-center">ForwardMax Cariv Domestic Seller 1.0 Prototype</p>
    </footer>
  );

  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col`} data-node-id="1714:22874">
      <LandingHeader userName="홍길동" variant="main" activeNav="logistics" />
      <div className={`flex w-full ${LAYOUT_CLASSES.CONTAINER}`}>
        <GnbListLayout
          sidebar={{ type: 'minimal', sectionTitle: '탁송' }}
          title="탁송 목록"
          mainNodeId="1714:22921"
          titleNodeId="1714:22893"
          footer={listFooter}
        >
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
            <Button onClick={() => setViewMode('form')} variant="primary">
              새 탁송예약
            </Button>
          </div>

          {/* 탁송 목록 그리드 — 3컬럼, 972px, gap 15/36 (검차·차량 목록과 동일) */}
          <div
            className={`grid grid-cols-3 ${LAYOUT_CLASSES.GNB_GRID} max-w-[972px] w-full mb-8`}
            data-node-id="1714:22921"
          >
              {paginatedItems.map((item) => {
                const stateInfo = LOGISTICS_STATES.find((s) => s.id === item.state);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(selectedId === item.id ? null : item.id)}
                    className={`text-left bg-white ${LAYOUT_CLASSES.GNB_CARD_WRAPPER} ${LAYOUT_CLASSES.GNB_CARD} overflow-hidden w-full border-2 transition-colors flex flex-col ${
                      selectedId === item.id ? 'border-primary ring-2 ring-primary/20' : 'border-transparent'
                    }`}
                    data-node-id="1714:22923"
                  >
                    <div className="h-[174px] w-full bg-primary-light shrink-0" data-node-id="1714:22924" />
                    <div className="flex-1 min-h-0 p-6 pb-3 border-t border-gray-200 flex flex-col">
                      <p className={`text-[12px] font-semibold ${stateInfo?.color ?? 'text-gray-500'} mb-1`} data-node-id="1714:22936">
                        {stateInfo?.label ?? item.state}
                      </p>
                      <p className="text-body font-bold text-black leading-tight" data-node-id="1714:22926">{item.modelName}</p>
                      <p className="text-caption text-gray-600 font-bold leading-tight" data-node-id="1714:22927">
                        {item.modelYear}년형 · {item.mileage} 만 km
                      </p>
                      <p className="text-body font-extrabold text-primary leading-tight" data-node-id="1714:22929">--- 만원</p>
                      <p className="text-caption text-black/30 font-bold leading-tight" data-node-id="1714:22928">신차 4,600만원</p>
                      <div className="mt-auto flex flex-wrap gap-1 pt-1" data-node-id="1714:22931">
                        <span className="inline-block rounded-sm bg-gray-100 px-1.5 py-0.5 text-caption font-bold text-gray-700">1년보증</span>
                        <span className="inline-block rounded-sm bg-gray-100 px-1.5 py-0.5 text-caption font-bold text-gray-700">단순교환무사고</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div className={`flex justify-center items-center w-full min-h-[114px] ${LAYOUT_CLASSES.GNB_PAGINATION_WRAPPER}`} data-node-id="1714:22894">
                <Pagination
                  currentPage={listPage}
                  totalPages={totalPages}
                  onPageChange={setListPage}
                />
              </div>
            )}

            {/* 1272-12926: 리스트 클릭 시 하단 상태 전환 — metadata 1272:12927 320×420 rounded 30px shadow */}
            {selectedItem && (
              <div
                className={`mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 ${LAYOUT_CLASSES.MAIN_GNB}`}
                data-node-id="1272:12926"
              >
                <div className={`bg-white ${LAYOUT_CLASSES.DETAIL_PANEL}`} data-node-id="1272:12927">
                  <p className="text-body text-black/50 tracking-wide font-extrabold mb-1" data-node-id="1272:12930">차량정보</p>
                  <p className="text-h2 leading-[44px] font-extrabold text-primary mb-6" data-node-id="1272:12929">{selectedItem.plateNumber}</p>
                  <div className="flex flex-col flex-1 min-h-0">
                    {[
                      { label: '제조사', value: 'Hyundai' },
                      { label: '모델', value: selectedItem.modelName },
                      { label: '연식', value: selectedItem.modelYear },
                      { label: '주행거리', value: `${selectedItem.mileage} 만 km` },
                      { label: '연료', value: '-' },
                    ].map(({ label, value }) => (
                      <div key={label} className={LAYOUT_CLASSES.DETAIL_PANEL_ROW}>
                        <span className="text-h4 text-black/40 font-medium">{label}</span>
                        <span className="text-h4 text-black/80">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-card shadow-figma-card p-6 flex flex-col" data-node-id="1272:12951">
                  <p className="text-body font-semibold text-gray-900 mb-4" data-node-id="1272:12953">탁송 상태</p>
                  <div className="flex flex-wrap gap-3">
                    {LOGISTICS_STATES.map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setItemState(selectedItem.id, s.id)}
                        className={`px-4 py-2 rounded-lg border text-sm font-medium transition-colors ${
                          selectedItem.state === s.id
                            ? 'bg-primary text-white border-primary'
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {s.label}
                      </button>
                    ))}
                  </div>
                  <p className="text-caption text-gray-500 mt-4">클릭 시 해당 상태로 저장됩니다.</p>
                </div>
              </div>
            )}
        </GnbListLayout>
      </div>
    </div>
  );
};
