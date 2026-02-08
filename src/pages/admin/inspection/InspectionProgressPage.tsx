/**
 * InspectionProgressPage Component
 * 검차 진행 상황 (Figma §3.6 nodeId: 1425:10137 매칭중, 1425:10663 픽업/이동중, 1425:10813 완료)
 * 5: 검차자 매칭중 | 5-1: 검차자 이동중 | 5-2: 검차완료
 * DEV:SKIP/스킵: 좌하단 고정, 단계별 필수 스킵
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { ProgressSidebar, type ProgressStep } from '@/widgets/ProgressSidebar/ui/ProgressSidebar';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { DevSkipButton } from '@/shared/ui/DevSkipButton';
import { User, Calendar as CalendarIcon, MapPin, CheckCircle2 } from 'lucide-react';
import { LAYOUT_CLASSES } from '@/shared/config/layout';

type ProgressStage = 'matching' | 'en_route' | 'complete';

const STAGE_LABELS: Record<ProgressStage, string> = {
  matching: '검차자 매칭중',
  en_route: '검차자 이동중',
  complete: '검차완료',
};

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
  const { inspectionId: inspectionIdParam } = useParams<{ inspectionId: string }>();
  return (stage: ProgressStage) => {
    navigate(`/inspections/${inspectionIdParam}/progress?stage=${stage}`, { replace: true });
  };
}

export const InspectionProgressPage = () => {
  const navigate = useNavigate();
  const setStageInUrl = useSetStageInUrl();
  const { stage } = useProgressStage();
  const [localStage, setLocalStage] = useState<ProgressStage>(stage);

  useEffect(() => {
    setLocalStage(stage);
  }, [stage]);

  const progressSteps: ProgressStep[] = [
    { id: 'request', label: '검차 신청', status: 'completed' },
    { id: 'progress', label: '검차 진행', status: localStage === 'complete' ? 'completed' : 'current' },
    { id: 'complete', label: '검차 완료', status: localStage === 'complete' ? 'current' : 'upcoming' },
  ];

  const handleDevSkipToEnRoute = () => {
    setLocalStage('en_route');
    setStageInUrl('en_route');
  };

  const handleSkipToComplete = () => {
    setLocalStage('complete');
    setStageInUrl('complete');
  };

  const handleGoToHistory = () => {
    navigate('/inspections/history');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader userName="홍길동" variant="main" activeNav="inspections" />

      <div className={`flex ${LAYOUT_CLASSES.CONTAINER}`}>
        {/* 좌측 ProgressSidebar — Figma 1121-5308, 1193-8343, 1193-8111 비율·여백 */}
        <aside className={`${LAYOUT_CLASSES.SIDEBAR} flex-shrink-0 bg-white border-r border-gray-200 ${LAYOUT_CLASSES.CONTENT_MIN_HEIGHT}`}>
          <ProgressSidebar steps={progressSteps} inline />
        </aside>

        <main className={`flex-1 ${LAYOUT_CLASSES.MAIN_PADDING}`}>
          {/* 5: 검차자 매칭중 */}
          {localStage === 'matching' && (
            <>
              <h1 className="text-h1 font-bold text-gray-900 mb-2">검차 진행상황</h1>
              <p className="text-body text-gray-600 mb-8">{STAGE_LABELS.matching}</p>

              <div className="max-w-2xl">
                <div className="flex items-center gap-4 mb-8" role="progressbar" aria-valuenow={1} aria-valuemin={0} aria-valuemax={3} aria-label="검차 진행 1/3">
                  <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden" style={{ borderRadius: 'var(--radius-full)' }}>
                    <div className="h-full w-1/3 bg-primary rounded-full transition-base" style={{ borderRadius: 'var(--radius-full)' }} />
                  </div>
                  <span className="text-body font-medium text-primary shrink-0">1/3</span>
                </div>

                <Card className="mb-6" padding="lg">
                  <p className="text-body text-gray-700">
                    검차자를 배정 중입니다. 잠시만 기다려 주세요.
                  </p>
                </Card>

                <div className="flex items-center gap-4">
                  <Button variant="secondary" onClick={() => navigate('/inspections')}>
                    목록으로
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* 5-1: 검차자 이동중 */}
          {localStage === 'en_route' && (
            <>
              <h1 className="text-h1 font-bold text-gray-900 mb-2">검차 진행상황</h1>
              <p className="text-body text-gray-600 mb-8">{STAGE_LABELS.en_route}</p>

              <div className="max-w-2xl">
                <div className="flex items-center gap-4 mb-8" role="progressbar" aria-valuenow={2} aria-valuemin={0} aria-valuemax={3} aria-label="검차 진행 2/3">
                  <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden" style={{ borderRadius: 'var(--radius-full)' }}>
                    <div className="h-full w-2/3 bg-primary rounded-full transition-base" style={{ borderRadius: 'var(--radius-full)' }} />
                  </div>
                  <span className="text-body font-medium text-primary shrink-0">2/3</span>
                </div>

                <Card className="mb-6" padding="lg">
                  <h2 className="text-h3 font-bold text-gray-900 mb-4">평가사 정보</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-400 shrink-0" />
                      <div>
                        <p className="text-caption text-gray-500">평가사</p>
                        <p className="text-body font-medium text-gray-900">김평가</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="h-5 w-5 text-gray-400 shrink-0" />
                      <div>
                        <p className="text-caption text-gray-500">예정 일시</p>
                        <p className="text-body font-medium text-gray-900">2026-02-05 14:00</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-400 shrink-0" />
                      <div>
                        <p className="text-caption text-gray-500">장소</p>
                        <p className="text-body font-medium text-gray-900">
                          서울특별시 강남구 테헤란로 123
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="bg-info-light border border-info p-6 mb-6" style={{ borderRadius: 'var(--radius-md)' }}>
                  <p className="text-body text-info">
                    평가사가 이동 중입니다. 도착 시 알림을 보내드립니다.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <Button variant="secondary" onClick={() => navigate('/inspections')}>
                    목록으로
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* 5-2: 검차완료 */}
          {localStage === 'complete' && (
            <>
              <h1 className="text-h1 font-bold text-gray-900 mb-2">검차 진행상황</h1>
              <p className="text-body text-gray-600 mb-8">{STAGE_LABELS.complete}</p>

              <div className="max-w-2xl">
                <div className="flex items-center gap-4 mb-8" role="progressbar" aria-valuenow={3} aria-valuemin={0} aria-valuemax={3} aria-label="검차 진행 3/3">
                  <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden" style={{ borderRadius: 'var(--radius-full)' }}>
                    <div className="h-full w-full bg-primary rounded-full transition-base" style={{ borderRadius: 'var(--radius-full)' }} />
                  </div>
                  <span className="text-body font-medium text-primary shrink-0">3/3</span>
                </div>

                <div className="text-center mb-8 p-8 bg-white border border-gray-100 rounded-[var(--card-border-radius)] shadow-[var(--card-shadow)]">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-success-light flex items-center justify-center">
                    <CheckCircle2 className="h-12 w-12 text-success" />
                  </div>
                  <h2 className="text-h2 font-bold text-gray-900 mb-2">검차가 완료되었습니다</h2>
                  <p className="text-body text-gray-600">평가사의 상세 검차 리포트를 확인하세요.</p>
                </div>

                <Card className="mb-6" padding="lg">
                  <h2 className="text-h3 font-bold text-gray-900 mb-4">검차 결과 요약</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-caption text-gray-500">종합 점수</p>
                      <p className="text-h3 font-bold text-primary">A</p>
                    </div>
                    <div>
                      <p className="text-caption text-gray-500">평가사</p>
                      <p className="text-body font-medium text-gray-900">김평가</p>
                    </div>
                  </div>
                </Card>

                <div className="flex items-center gap-4">
                  <Button variant="secondary" onClick={() => navigate('/inspections')}>
                    목록으로
                  </Button>
                  <Button onClick={handleGoToHistory}>검차내역 보기</Button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>

      {/* 좌하단 고정: 필수 단계 스킵 (DEV/E2E) */}
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
