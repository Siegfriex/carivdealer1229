/**
 * InspectionCompletePage
 * 검차 완료·결과 요약·상세 (Figma §3.6 nodeId: 1425:10813, 1425:10285, 1425:10443)
 * 참조: FIGMASCR0208/§3.6_검차/§3.6_1425-10285_검차결과요약*.png
 * 라우트: /inspections/:inspectionId/complete
 * 레이아웃: 검차내역 제목 + 차량정보·전체 피드백·검차자 카드 + 세부 검차내역(양호/경미/주의/불량) + 사진항목/영상항목 아코디언 + 판매 방식 선택
 */

import { useState, useMemo, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { LOG_INGEST_URL } from '@/shared/config/logging';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { ProgressSidebar } from '@/widgets/ProgressSidebar/ui/ProgressSidebar';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { getRegisterFlowSteps } from '@/shared/config/registerFlowSteps';
import { User, ChevronDown, ChevronUp } from 'lucide-react';
import { MOCK_INSPECTIONS } from './mockInspectionList';

const FEEDBACK_COUNTS = { good: 95, minor: 12, caution: 3, defect: 1 };
const SUMMARY_TEXT = '총 111개의 항목이 검사되었습니다. 전반적인 상태는 양호하며, 일부 부위에 경미한 스키레치가 확인되었습니다.';

const PHOTO_CATEGORIES = [
  { name: '차량 외관', count: 0 },
  { name: '차량 내부', count: 14 },
  { name: '타이어', count: 4 },
  { name: '유리', count: 2 },
  { name: '사이드미러', count: 2 },
  { name: '트렁크', count: 2 },
  { name: '범퍼', count: 2 },
  { name: '보닛', count: 1 },
];

const VIDEO_CATEGORIES = [
  { name: '보닛', duration: '10초/1' },
  { name: '성능기록부', duration: '10초/1' },
  { name: '외부 손상', duration: '10초/1' },
];

/** 검차내역 페이지: 컨테이너 클릭 시 아래(세부 검차내역)로 스크롤 (Figma 1193-9217 별도 뷰) */
const useScrollToDetail = () => {
  const detailSectionRef = useRef<HTMLDivElement>(null);
  const scrollToDetail = useCallback(() => {
    detailSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);
  return { detailSectionRef, scrollToDetail };
};

export const InspectionCompletePage = () => {
  const navigate = useNavigate();
  const { inspectionId } = useParams<{ inspectionId: string }>();
  const [expandedPhoto, setExpandedPhoto] = useState<string | null>('차량 내부');
  const [expandedVideo, setExpandedVideo] = useState<string | null>(null);
  const { detailSectionRef, scrollToDetail } = useScrollToDetail();

  const inspection = useMemo(
    () => MOCK_INSPECTIONS.find((i) => i.id === inspectionId),
    [inspectionId]
  );

  const vehicleNumber = inspection?.vehiclePlateNumber ?? '12바 1234';
  const vehicleModel = inspection?.vehicleModelName ?? 'G70 3T 스포츠 엘리트';
  const vehicleYear = inspection?.vehicleModelYear ?? '2018';
  const locationDisplay = inspection?.location?.address ?? '인천광역시 서구 봉수대로 158';
  const dateDisplay = inspection ? `${inspection.preferredDate} ${inspection.preferredTime}` : '2026년 1월 10일 (일) 오후 11:00';

  const vehicleId = inspection?.vehicleId;

  const handleAuctionSale = () => {
    const to = vehicleId ? `/vehicles/${vehicleId}/sale/analyzing?type=auction` : '/offers?type=auction';
    fetch(LOG_INGEST_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'InspectionCompletePage:handleAuctionSale',message:'검차완료→CTA_3 판매방식(경매)',data:{to,vehicleId},timestamp:Date.now(),hypothesisId:'H_CTA3',runId:'register-flow-check'})}).catch(()=>{});
    navigate(to);
  };
  const handleGeneralSale = () => {
    const to = vehicleId ? `/vehicles/${vehicleId}/sale/analyzing` : '/offers?type=general';
    fetch(LOG_INGEST_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'InspectionCompletePage:handleGeneralSale',message:'검차완료→CTA_3 판매방식선택(일반)',data:{to,vehicleId},timestamp:Date.now(),hypothesisId:'H_CTA3',runId:'register-flow-check'})}).catch(()=>{});
    navigate(to);
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa]" data-node-id="1425:10285">
      <LandingHeader userName="홍길동" variant="main" activeNav="inspections" />

      <div className={`flex ${LAYOUT_CLASSES.CONTAINER}`}>
        <aside className={`${LAYOUT_CLASSES.GNB_SIDEBAR} flex-shrink-0 bg-white border-r border-gray-200 ${LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} flex flex-col`} data-node-id="1425:10325">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-button font-medium text-gray-700 mb-2">검색</h3>
            <input
              type="text"
              placeholder="차량번호/모델명"
              className="w-full pl-3 pr-10 py-2.5 border border-gray-200 rounded-md text-body text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex-1 overflow-auto">
            <ProgressSidebar steps={getRegisterFlowSteps('trade')} inline />
          </div>
        </aside>

        <main className={`flex-1 ${LAYOUT_CLASSES.MAIN_PADDING}`}>
          {/* SSOT 1193-8120, 1425-10285: 검차완료! 내역을 확인하세요 */}
          <h1 className="text-h1 font-bold text-gray-900 mb-2">검차완료!</h1>
          <p className="text-body text-gray-600 mb-8">내역을 확인하세요</p>

          {/* 상단 컨테이너: 클릭 시 아래(세부 검차내역)로 스크롤 (Figma 1193-9217 별도 뷰) */}
          <div
            role="button"
            tabIndex={0}
            onClick={scrollToDetail}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); scrollToDetail(); } }}
            className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 rounded-lg mb-6"
            aria-label="아래 세부 검차내역으로 이동"
          >
          {/* 상단 2열: 차량정보 | 전체 피드백 — 1425:10376 972×266 (1425-10285) */}
          <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6 ${LAYOUT_CLASSES.GNB_CARD_972_266}`} data-node-id="1425:10376">
            <Card className="p-6">
              <h2 className="text-body font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100">차량정보</h2>
              <div className="flex gap-4">
                <div>
                  <p className="text-h3 font-bold text-gray-900 mb-2">{vehicleNumber}</p>
                  <dl className="space-y-1.5 text-body text-gray-700">
                    <div><dt className="inline font-medium">제조사 </dt><dd className="inline">Hyundai</dd></div>
                    <div><dt className="inline font-medium">모델 </dt><dd className="inline">{vehicleModel}</dd></div>
                    <div><dt className="inline font-medium">연식 </dt><dd className="inline">{vehicleYear}</dd></div>
                    <div><dt className="inline font-medium">주행거리 </dt><dd className="inline">14.6만 km</dd></div>
                    <div><dt className="inline font-medium">연료 </dt><dd className="inline">-</dd></div>
                  </dl>
                </div>
                <div className="w-24 h-24 flex-shrink-0 bg-gray-200 rounded-lg flex items-center justify-center">
                  <span className="text-caption text-gray-400">차량</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-body font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100">전체 피드백</h2>
              <div className="flex gap-4 mb-4">
                <div className="w-28 h-20 flex-shrink-0 bg-gray-200 rounded flex items-center justify-center">
                  <span className="text-caption text-gray-400">이미지</span>
                </div>
                <div className="flex-1 flex flex-wrap gap-x-4 gap-y-1 text-body">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500" />양호 {FEEDBACK_COUNTS.good}개</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-400" />경미 {FEEDBACK_COUNTS.minor}개</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500" />주의 {FEEDBACK_COUNTS.caution}개</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500" />불량 {FEEDBACK_COUNTS.defect}개</span>
                </div>
              </div>
              <Button variant="secondary" size="sm" className="mb-3">세부 검차내역</Button>
              <p className="text-caption text-gray-600">{SUMMARY_TEXT}</p>
            </Card>
          </div>

          {/* 검차자 카드 — 1425:10378 400×160 (1425-10285) */}
          <Card className={`p-6 mb-8 ${LAYOUT_CLASSES.GNB_PANEL_400_160}`} data-node-id="1425:10378">
            <h2 className="text-body font-bold text-gray-700 mb-4 pb-2 border-b border-gray-100">검차자</h2>
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <p className="text-body text-gray-700 mb-1">{dateDisplay}</p>
                <p className="text-body text-gray-700">{locationDisplay}</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <p className="text-body font-medium text-gray-900">홍길동 검사원</p>
                  <p className="text-caption text-gray-500">010-1234-5678</p>
                </div>
              </div>
            </div>
          </Card>
          </div>

          {/* 세부 검차내역 4칸 (참조 10285 변형) — 컨테이너 클릭 시 스크롤 목적지 (Figma 1193-9217) */}
          <div ref={detailSectionRef} className="mb-6">
            <h2 className="text-h3 font-bold text-gray-900 mb-4">세부 검차내역</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: '양호', value: FEEDBACK_COUNTS.good, color: 'bg-green-500' },
                { label: '경미', value: FEEDBACK_COUNTS.minor, color: 'bg-yellow-500' },
                { label: '주의', value: FEEDBACK_COUNTS.caution, color: 'bg-orange-400' },
                { label: '불량', value: FEEDBACK_COUNTS.defect, color: 'bg-red-500' },
              ].map(({ label, value, color }) => (
                <Card key={label} className="p-4 flex items-center gap-3">
                  <span className={`w-4 h-4 rounded-full flex-shrink-0 ${color}`} />
                  <div>
                    <p className="text-caption text-gray-500">{label}</p>
                    <p className="text-h4 font-bold text-gray-900">{value}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* 사진항목 아코디언 (참조 10285 변형) */}
          <div className="mb-6">
            <h2 className="text-h3 font-bold text-gray-900 mb-4">사진항목</h2>
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
              {PHOTO_CATEGORIES.map(({ name, count }) => {
                const isOpen = expandedPhoto === name;
                return (
                  <div key={name}>
                    <button
                      type="button"
                      onClick={() => setExpandedPhoto(isOpen ? null : name)}
                      className="w-full flex items-center justify-between px-4 py-3 text-left text-body text-gray-900 hover:bg-gray-50"
                    >
                      <span>{name} {count}</span>
                      {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                    </button>
                    {isOpen && name === '차량 내부' && (
                      <div className="px-4 pb-4 pt-0 flex gap-4 flex-wrap">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="w-24">
                            <div className="aspect-square bg-gray-100 rounded flex items-center justify-center mb-1">
                              <span className="text-caption text-gray-400">{i}</span>
                            </div>
                            <p className="text-caption text-gray-600 truncate">
                              {i === 1 ? '운전석 전체 프레임' : i === 2 ? '계기판' : '시트'}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* 영상항목 아코디언 */}
          <div className="mb-8">
            <h2 className="text-h3 font-bold text-gray-900 mb-4">영상항목</h2>
            <div className="border border-gray-200 rounded-lg divide-y divide-gray-200">
              {VIDEO_CATEGORIES.map(({ name, duration }) => {
                const isOpen = expandedVideo === name;
                return (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setExpandedVideo(isOpen ? null : name)}
                    className="w-full flex items-center justify-between px-4 py-3 text-left text-body text-gray-900 hover:bg-gray-50"
                  >
                    <span>{name} {duration}</span>
                    {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 판매 방식 선택: 검차 완료된 경우에만 표시 */}
          <Card className="p-8">
            {inspection?.status === 'completed' ? (
              <>
                <h2 className="text-h3 font-bold text-gray-900 mb-6 text-center">판매 방식을 선택하세요</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Button size="lg" fullWidth onClick={handleAuctionSale}>경매로 판매하기</Button>
                  <Button size="lg" variant="secondary" fullWidth onClick={handleGeneralSale}>일반 판매하기</Button>
                </div>
                <div className="mt-4 flex justify-center gap-4">
                  <Button variant="ghost" onClick={() => navigate('/inspections')}>목록으로</Button>
                  <Button variant="secondary" onClick={() => navigate(`/inspections/${inspectionId}/progress?stage=complete`)}>검차 진행상황</Button>
                </div>
              </>
            ) : (
              <>
                <h2 className="text-h3 font-bold text-gray-900 mb-2 text-center">검차 진행 중</h2>
                <p className="text-body text-gray-600 text-center mb-6">검차가 완료되면 판매 방식을 선택할 수 있습니다.</p>
                <div className="flex justify-center gap-4">
                  <Button variant="ghost" onClick={() => navigate('/inspections')}>목록으로</Button>
                  <Button variant="secondary" onClick={() => navigate(`/inspections/${inspectionId}/progress`)}>검차 진행상황</Button>
                </div>
              </>
            )}
          </Card>
        </main>
      </div>
    </div>
  );
};
