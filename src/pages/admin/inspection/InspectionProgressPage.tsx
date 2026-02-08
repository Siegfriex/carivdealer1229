/**
 * InspectionProgressPage
 * 검차 진행 상황 (Figma §3.6 nodeId: 1425:10137 매칭중, 1425:10663 픽업/이동중, 1425:10813 완료)
 * 참조: FIGMASCR0208/§3.6_검차/§3.6_1425-10137_검차진행_매칭중*.png
 * 레이아웃: 사이드바(검색·차량 업로드|검차 진행|거래|탁송|완료) + 차량 카드 + 검차자 매칭/이동 카드 + 4단계 스테퍼
 */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { DevSkipButton } from '@/shared/ui/DevSkipButton';
import { User, MapPin, Clock, Check, Truck, CheckCircle2 } from 'lucide-react';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { MOCK_INSPECTIONS, type InspectionWithVehicle } from './mockInspectionList';

type ProgressStage = 'matching' | 'en_route' | 'complete';

const STAGE_LABELS: Record<ProgressStage, string> = {
  matching: '검차자 매칭중',
  en_route: '검차자 이동중',
  complete: '검차완료',
};

const STEPPER_LABELS = ['검차자 매칭중', '검차자 매칭 완료', '검차중', '검차완료'];

function useProgressStage(): { inspectionId: string; stage: ProgressStage } {
  const { inspectionId: paramId } = useParams<{ inspectionId: string }>();
  const [searchParams] = useSearchParams();
  const inspectionId = paramId ?? '';
  const stageParam = searchParams.get('stage') as ProgressStage | null;
  const stage: ProgressStage =
    stageParam && ['matching', 'en_route', 'complete'].includes(stageParam) ? stageParam : 'matching';
  return { inspectionId, stage };
}

function useSetStageInUrl() {
  const navigate = useNavigate();
  const { inspectionId } = useParams<{ inspectionId: string }>();
  return (stage: ProgressStage) => {
    navigate(`/inspections/${inspectionId}/progress?stage=${stage}`, { replace: true });
  };
}

/** 차량 업로드|검차 진행|거래|탁송|완료 사이드바 (참조 10137) */
function InspectionProgressSidebar() {
  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)] p-4">
      <div className="mb-6">
        <h3 className="text-button font-medium text-gray-700 mb-2">검색</h3>
        <input
          type="text"
          placeholder="차량번호/모델명"
          className="w-full pl-3 pr-10 py-2.5 border border-gray-200 rounded-md text-body text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      <div>
        <h3 className="text-button font-medium text-gray-700 mb-2">현재 거래 진행상황</h3>
        <ul className="space-y-1">
          {['차량 업로드', '검차 진행', '거래', '탁송', '완료'].map((label, i) => (
            <li key={label} className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  i === 1 ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
              <span className={`text-body ${i === 1 ? 'font-medium text-primary' : 'text-gray-600'}`}>
                {i === 1 ? '검차 진행 중...' : label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}

/** 4단계 스테퍼: 검차자 매칭중 → 매칭 완료 → 검차중 → 검차완료 */
function Stepper({ currentStep }: { currentStep: 0 | 1 | 2 | 3 }) {
  return (
    <div>
      <p className="text-caption text-gray-500 mb-3">진행 상황</p>
      <div className="flex items-center gap-2">
        {STEPPER_LABELS.map((label, i) => {
          const done = i < currentStep;
          const current = i === currentStep;
          return (
            <div key={label} className="flex items-center flex-1 min-w-0">
              <div
                className={`flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-full border-2 ${
                  done ? 'bg-primary border-primary' : current ? 'border-primary bg-primary/10' : 'border-gray-200 bg-white'
                }`}
              >
                {done ? (
                  <Check className="w-4 h-4 text-white" strokeWidth={3} />
                ) : current ? (
                  <span className="w-2 h-2 rounded-full bg-primary" />
                ) : null}
              </div>
              <span
                className={`ml-2 text-caption truncate ${
                  done || current ? 'text-gray-900 font-medium' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
              {i < STEPPER_LABELS.length - 1 && (
                <div
                  className={`flex-1 h-0.5 mx-1 min-w-[8px] ${
                    i < currentStep ? 'bg-primary' : 'bg-gray-200'
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const InspectionProgressPage = () => {
  const navigate = useNavigate();
  const setStageInUrl = useSetStageInUrl();
  const { inspectionId, stage } = useProgressStage();
  const [localStage, setLocalStage] = useState<ProgressStage>(stage);

  const inspection = useMemo(
    () => MOCK_INSPECTIONS.find((i) => i.id === inspectionId),
    [inspectionId]
  );

  const vehicle = useMemo((): InspectionWithVehicle | null => {
    if (inspection) return inspection;
    return {
      id: inspectionId || 'insp-1',
      vehicleId: 'v-1',
      preferredDate: '2026-02-05',
      preferredTime: '14:00',
      status: 'pending',
      vehiclePlateNumber: '123가 4567',
      vehicleModelName: 'G70 3T 스포츠 엘리트',
      vehicleModelYear: '2020',
      createdAt: inspection?.createdAt ?? ({} as InspectionWithVehicle['createdAt']),
      updatedAt: inspection?.updatedAt ?? ({} as InspectionWithVehicle['updatedAt']),
    } as InspectionWithVehicle;
  }, [inspection, inspectionId]);

  const locationDisplay = vehicle?.location?.address ?? '인천광역시 서구 봉수대로 158';
  const dateDisplay = `${vehicle?.preferredDate ?? '2025/01/01'} ${vehicle?.preferredTime ?? '10:00'}`;

  useEffect(() => {
    setLocalStage(stage);
  }, [stage]);

  const handleDevSkipToEnRoute = () => {
    setLocalStage('en_route');
    setStageInUrl('en_route');
  };

  const handleSkipToComplete = () => {
    setLocalStage('complete');
    setStageInUrl('complete');
  };

  const handleGoToHistory = () => navigate('/inspections/history');
  const handleGoToComplete = () => inspectionId && navigate(`/inspections/${inspectionId}/complete`);

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader userName="홍길동" variant="main" activeNav="inspections" />

      <div className={`flex ${LAYOUT_CLASSES.CONTAINER}`}>
        <InspectionProgressSidebar />

        <main className={`flex-1 ${LAYOUT_CLASSES.MAIN_PADDING}`}>
          <h1 className="text-h1 font-bold text-gray-900 mb-8">검차 진행상황</h1>

          {/* 카드 1: 검차 차량 정보 (10137 공통) */}
          <Card className="mb-6 p-6">
            <div className="flex gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-body font-medium text-gray-900">검차 진행중</span>
                </div>
                <div className="aspect-video bg-gray-200 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-caption text-gray-500">차량 이미지</span>
                </div>
                <div className="flex gap-2">
                  {['L', 'R', 'F', 'B'].map((v, i) => (
                    <button
                      key={v}
                      type="button"
                      className={`px-3 py-1.5 rounded text-caption font-medium ${
                        i === 0 ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex-1 min-w-0 flex flex-col">
                <p className="text-caption text-gray-500 mb-1 text-right">일련번호 {vehicle?.id ?? '12345'}</p>
                <p className="text-body font-bold text-gray-900 mb-1">{vehicle?.vehiclePlateNumber}</p>
                <p className="text-body text-gray-700 mb-1">{vehicle?.vehicleModelName}</p>
                <p className="text-caption text-gray-500 mb-3">{vehicle?.vehicleModelYear}년형</p>
                <div className="flex items-center gap-2 text-body text-gray-700 mb-2">
                  <Clock className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>검차 일정: {dateDisplay}</span>
                </div>
                <div className="flex items-center gap-2 text-body text-gray-700 mb-4">
                  <MapPin className="h-4 w-4 text-gray-400 shrink-0" />
                  <span>검차 장소: {locationDisplay}</span>
                </div>
                <Button variant="secondary" size="sm" className="mt-auto" onClick={handleGoToComplete}>
                  검차내역 상세보기
                </Button>
              </div>
            </div>
          </Card>

          {/* 5: 검차자 매칭중 */}
          {localStage === 'matching' && (
            <Card className="mb-6 p-6">
              <h2 className="text-h3 font-bold text-gray-900 mb-4">검차자 매칭중</h2>
              <p className="text-body text-gray-700 mb-2">
                2026년 1월 10일 (일) 오후 11:00
              </p>
              <p className="text-body text-gray-700 mb-6">{locationDisplay}</p>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <p className="text-body font-medium text-gray-900">익명의 기사님</p>
                  <p className="text-caption text-gray-500">010-xxxx-xxxx</p>
                </div>
              </div>
              <Stepper currentStep={0} />
            </Card>
          )}

          {/* 5-1: 검차자 이동중 */}
          {localStage === 'en_route' && (
            <Card className="mb-6 p-6">
              <h2 className="text-h3 font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Truck className="h-5 w-5 text-green-600" />
                검차자 이동중
              </h2>
              <p className="text-body text-gray-700 mb-2">2026년 1월 10일 (일) 오후 11:00</p>
              <p className="text-body text-gray-700 mb-6">{locationDisplay}</p>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                  <User className="h-6 w-6 text-gray-500" />
                </div>
                <div>
                  <p className="text-body font-medium text-gray-900">홍길동 기사님</p>
                  <p className="text-caption text-gray-500">010-1234-5678</p>
                </div>
              </div>
              <Stepper currentStep={2} />
            </Card>
          )}

          {/* 5-2: 검차완료 */}
          {localStage === 'complete' && (
            <>
              <Card className="mb-6 p-6">
                <h2 className="text-h3 font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600" />
                  검차완료
                </h2>
                <p className="text-body text-gray-700 mb-6">검차가 완료되었습니다. 내용을 확인하세요.</p>
                <Stepper currentStep={3} />
              </Card>
              <div className="flex gap-4">
                <Button variant="secondary" onClick={() => navigate('/inspections')}>
                  목록으로
                </Button>
                <Button onClick={handleGoToHistory}>검차내역 보기</Button>
                <Button variant="secondary" onClick={handleGoToComplete}>
                  검차내역 상세보기
                </Button>
              </div>
            </>
          )}

          {(localStage === 'matching' || localStage === 'en_route') && (
            <div className="flex gap-4">
              <Button variant="secondary" onClick={() => navigate('/inspections')}>
                목록으로
              </Button>
            </div>
          )}
        </main>
      </div>

      {localStage === 'matching' && (
        <DevSkipButton
          label="DEV:SKIP"
          subLabel="검차자 이동중으로"
          onClick={handleDevSkipToEnRoute}
        />
      )}
      {localStage === 'en_route' && (
        <DevSkipButton
          label="스킵"
          subLabel="검차완료로"
          onClick={handleSkipToComplete}
        />
      )}
    </div>
  );
};
