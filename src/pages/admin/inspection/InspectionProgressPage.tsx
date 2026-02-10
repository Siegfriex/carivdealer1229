/**
 * InspectionProgressPage
 * 검차 진행 상황 (Figma §3.6 nodeId: 1121-5308 매칭중, 1193-8343 이동중, 1425-10813 완료)
 * 참조: impl_plans/1121-5308_구현계획.md, 1193-8343_구현계획.md
 * 레이아웃: 사이드바 249px(1121:5350) + 메인 제목(1121:5381) + 차량 카드 972×243(1193:9066) + 검차 카드 972×473(1193:7871) + 4단계 스테퍼
 */

import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { DevSkipButton } from '@/shared/ui/DevSkipButton';
import { User, Check, CheckCircle2 } from 'lucide-react';
import imgClock from '@/shared/figma_image/1121-5308_검차일정_clock.png';
import imgMap from '@/shared/figma_image/1121-5308_검차장소_map.png';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { MOCK_INSPECTIONS, type InspectionWithVehicle } from './mockInspectionList';
import { isRunDev } from '@/shared/config/runDev';

type ProgressStage = 'matching' | 'en_route' | 'complete';

const STEPPER_LABELS = ['검차자 매칭중', '검차자 매칭 완료', '검차중', '검차완료'];

const FALLBACK_TIMESTAMP = { seconds: 0, toDate: () => new Date() } as unknown as import('firebase/firestore').Timestamp;

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

/** 차량 업로드|검차 진행|거래|탁송|완료 사이드바 (Figma 1121:5350 — 레이아웃 스펙 width 249px) */
function InspectionProgressSidebar() {
  return (
    <aside className="w-[249px] flex-shrink-0 bg-white border-r border-gray-200 min-h-[calc(100vh-64px)] p-4" data-node-id="1121:5350">
      <div className="mb-6">
        <h3 className="text-button font-medium text-gray-700 mb-2">검색</h3>
        <input
          type="text"
          placeholder="차량번호/모델명"
          className="w-full pl-3 pr-10 py-2.5 border border-gray-200 rounded-md text-body text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>
      {/* Figma 1193-8343: 차량 업로드·검차 진행·거래·탁송·완료, 진행 중... (1193:8433) */}
      <div>
        <ul className="space-y-1">
          {['차량 업로드', '검차 진행', '거래', '탁송', '완료'].map((label, i) => (
            <li key={label} className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full flex-shrink-0 ${
                  i === 1 ? 'bg-primary' : 'bg-gray-300'
                }`}
              />
              <span className={`text-body ${i === 1 ? 'font-medium text-primary' : 'text-gray-600'}`}>
                {label}
              </span>
              {i === 1 && (
                <span className="text-[11px] text-primary/80" data-node-id="1193:8433">
                  진행 중...
                </span>
              )}
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

  const vehicle = useMemo((): InspectionWithVehicle => {
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
      createdAt: FALLBACK_TIMESTAMP,
      updatedAt: FALLBACK_TIMESTAMP,
    };
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

  /** 다음단계: 개발 모드에서는 필수 입력 없이 다음 플로우로 이동 (Figma 1121-5308, 1193-8343 요구) */
  const handleNextStage = () => {
    if (localStage === 'matching') {
      setLocalStage('en_route');
      setStageInUrl('en_route');
    } else if (localStage === 'en_route') {
      setLocalStage('complete');
      setStageInUrl('complete');
    }
  };

  /** 임시저장: 매칭중/이동중 단계에서 목록으로 저장 후 이동 (Figma 요구) */
  const handleSaveDraft = () => {
    navigate('/inspections');
  };

  const handleGoToHistory = () => navigate('/inspections/history');
  const handleGoToComplete = () => inspectionId && navigate(`/inspections/${inspectionId}/complete`);

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader userName="홍길동" variant="main" activeNav="inspections" />

      <div className={`flex ${LAYOUT_CLASSES.CONTAINER}`}>
        <InspectionProgressSidebar />

        <main className={`flex-1 ${LAYOUT_CLASSES.MAIN_PADDING} max-w-[972px]`}>
          <h1 className="text-h1 font-bold text-gray-900 mb-8" data-node-id="1121:5381">검차 진행상황</h1>

          {/* 카드 1: 검차 차량 정보 (Figma 1193:9066 — 974×243, 레이아웃 스펙) */}
          <Card className="mb-6 p-6 w-full max-w-[972px]" data-node-id="1193:9066">
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
                  <img src={imgClock} alt="" className="h-4 w-4 shrink-0" aria-hidden />
                  <span>검차 일정: {dateDisplay}</span>
                </div>
                <div className="flex items-center gap-2 text-body text-gray-700 mb-4">
                  <img src={imgMap} alt="" className="h-4 w-4 shrink-0" aria-hidden />
                  <span>검차 장소: {locationDisplay}</span>
                </div>
                <Button variant="secondary" size="sm" className="mt-auto" onClick={handleGoToComplete}>
                  검차내역 상세보기
                </Button>
              </div>
            </div>
          </Card>

          {/* 5: 검차자 매칭중 (Figma 1425:10227 972×473, 1425:10230 400×160 SSOT) */}
          {localStage === 'matching' && (
            <Card
              className="mb-6 p-0 w-full max-w-[972px] min-h-[473px] overflow-hidden rounded-[30px] shadow-[2.344px_3.125px_11.017px_rgba(0,0,0,0.05)]"
              data-node-id="1425:10227"
            >
              <div className="p-6 flex flex-col sm:flex-row sm:items-start gap-6">
                <div className="flex-1 min-w-0">
                  <h2 className="text-[38px] font-extrabold text-primary leading-[44px] mb-4" data-node-id="1425:10228">
                    검차자 매칭중
                  </h2>
                  <div className="text-[24px] leading-[40px] text-black/60 mb-6" data-node-id="1425:10229">
                    <p className="mb-0">{dateDisplay}</p>
                    <p className="mb-0">{locationDisplay}</p>
                  </div>
                </div>
                <div
                  className="flex-shrink-0 w-full sm:w-[400px] min-h-[160px] bg-[#f3f3f3] rounded-[20px] px-[46px] py-[29px] flex items-center gap-8"
                  data-node-id="1425:10230"
                >
                  <div className="w-[101px] h-[101px] rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <User className="h-12 w-12 text-gray-500" />
                  </div>
                  <div className="text-[24px] leading-[40px]">
                    <p className="font-bold text-black">익명의 기사님</p>
                    <p className="text-[#9b9b9b]">010-xxxx-xxxx</p>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6">
                <Stepper currentStep={0} />
              </div>
            </Card>
          )}

          {/* 5-1: 검차자 이동중 (Figma 1193-8343, 1425-10813 레이아웃 972×473, 400×160 SSOT) */}
          {localStage === 'en_route' && (
            <Card
              className="mb-6 p-0 w-full max-w-[972px] min-h-[473px] overflow-hidden rounded-[30px] shadow-[2.344px_3.125px_11.017px_rgba(0,0,0,0.05)]"
              data-node-id="1425:10227"
            >
              <div className="p-6 flex flex-col sm:flex-row sm:items-start gap-6">
                <div className="flex-1 min-w-0">
                  <h2 className="text-[38px] font-extrabold text-primary leading-[44px] mb-4 flex items-center gap-2" data-node-id="1193:8436">
                    검차자 이동중 🛻
                  </h2>
                  <div className="text-[24px] leading-[40px] text-black/60 mb-6">
                    <p className="mb-0">{dateDisplay}</p>
                    <p className="mb-0">{locationDisplay}</p>
                  </div>
                </div>
                <div
                  className="flex-shrink-0 w-full sm:w-[400px] min-h-[160px] bg-[#f3f3f3] rounded-[20px] px-[46px] py-[29px] flex items-center gap-8"
                  data-node-id="1425:10230"
                >
                  <div className="w-[101px] h-[101px] rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                    <User className="h-12 w-12 text-gray-500" />
                  </div>
                  <div className="text-[24px] leading-[40px]">
                    <p className="font-bold text-black">홍길동 기사님</p>
                    <p className="text-[#9b9b9b]">010-1234-5678</p>
                  </div>
                </div>
              </div>
              <div className="px-6 pb-6">
                <Stepper currentStep={2} />
              </div>
            </Card>
          )}

          {/* 5-2: 검차완료 */}
          {localStage === 'complete' && (
            <>
              <Card className="mb-6 p-6 w-full max-w-[972px]">
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
            <div className="flex flex-wrap items-center gap-4">
              <Button variant="secondary" onClick={() => navigate('/inspections')}>
                목록으로
              </Button>
              <Button variant="secondary" onClick={handleSaveDraft}>
                임시저장
              </Button>
              {isRunDev() && (
                <Button onClick={handleNextStage}>
                  다음단계
                </Button>
              )}
            </div>
          )}
        </main>
      </div>

      {isRunDev() && localStage === 'matching' && (
        <DevSkipButton
          label="DEV:SKIP"
          subLabel="검차자 이동중으로"
          onClick={handleDevSkipToEnRoute}
        />
      )}
      {isRunDev() && localStage === 'en_route' && (
        <DevSkipButton
          label="스킵"
          subLabel="검차완료로"
          onClick={handleSkipToComplete}
        />
      )}
    </div>
  );
};
