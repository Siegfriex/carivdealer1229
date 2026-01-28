/**
 * InspectionProgressPage Component
 * 검차 진행 내역 (Figma 1202-7440, 1202-7752, 1202-7902)
 * 5: 검차자 매칭중 | 5-1: 검차자 이동중 | 5-2: 검차완료
 * stage 쿼리: matching | en_route | complete. DEV:SKIP/스킵으로 5-1, 5-2 이동
 */

import { useState, useEffect } from 'react';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { ProgressSidebar, type ProgressStep } from '@/widgets/ProgressSidebar/ui/ProgressSidebar';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { User, Calendar as CalendarIcon, MapPin, CheckCircle2 } from 'lucide-react';

type ProgressStage = 'matching' | 'en_route' | 'complete';

const STAGE_LABELS: Record<ProgressStage, string> = {
  matching: '검차자 매칭중',
  en_route: '검차자 이동중',
  complete: '검차완료',
};

function useProgressStage(): { inspectionId: string; stage: ProgressStage } {
  const [inspectionId, setInspectionId] = useState('');
  const [stage, setStage] = useState<ProgressStage>('matching');

  useEffect(() => {
    const pathname = window.location.pathname;
    const params = new URLSearchParams(window.location.search);
    const stageParam = params.get('stage') as ProgressStage | null;
    const id = pathname.replace('/inspections/', '').replace('/progress', '') || '';
    setInspectionId(id);
    if (stageParam && ['matching', 'en_route', 'complete'].includes(stageParam)) {
      setStage(stageParam);
    }
  }, []);

  return { inspectionId, stage };
}

function setStageInUrl(stage: ProgressStage) {
  const pathname = window.location.pathname;
  window.history.replaceState({}, '', `${pathname}?stage=${stage}`);
  window.dispatchEvent(new PopStateEvent('popstate'));
}

export const InspectionProgressPage = () => {
  const { inspectionId, stage } = useProgressStage();
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
    window.location.href = '/inspections/history';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader userName="홍길동" variant="main" activeNav="inspections" />

      <div className="flex">
        {/* 좌측 ProgressSidebar */}
        <ProgressSidebar steps={progressSteps} />

        <main className="flex-1 p-8 ml-64">
          {/* 5: 검차자 매칭중 */}
          {localStage === 'matching' && (
            <>
              <h1 className="text-h1 font-bold text-gray-900 mb-2">검차 진행내역</h1>
              <p className="text-body text-gray-600 mb-8">{STAGE_LABELS.matching}</p>

              <div className="max-w-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-1/3 bg-primary rounded-full" />
                  </div>
                  <span className="text-body font-medium text-primary">1/3</span>
                </div>

                <Card className="mb-6" padding="lg">
                  <p className="text-body text-gray-700 mb-4">
                    검차자를 배정 중입니다. 잠시만 기다려 주세요.
                  </p>
                </Card>

                <div className="flex items-center gap-4">
                  <Button variant="secondary" onClick={() => (window.location.href = '/inspections')}>
                    목록으로
                  </Button>
                  <Button variant="secondary" onClick={handleDevSkipToEnRoute}>
                    DEV:SKIP (검차자 이동중으로)
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* 5-1: 검차자 이동중 */}
          {localStage === 'en_route' && (
            <>
              <h1 className="text-h1 font-bold text-gray-900 mb-2">검차 진행내역</h1>
              <p className="text-body text-gray-600 mb-8">{STAGE_LABELS.en_route}</p>

              <div className="max-w-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-primary rounded-full" />
                  </div>
                  <span className="text-body font-medium text-primary">2/3</span>
                </div>

                <Card className="mb-6" padding="lg">
                  <h2 className="text-h3 font-bold text-gray-900 mb-4">평가사 정보</h2>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-caption text-gray-500">평가사</p>
                        <p className="text-body font-medium text-gray-900">김평가</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CalendarIcon className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-caption text-gray-500">예정 일시</p>
                        <p className="text-body font-medium text-gray-900">2026-02-05 14:00</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-5 w-5 text-gray-400" />
                      <div>
                        <p className="text-caption text-gray-500">장소</p>
                        <p className="text-body font-medium text-gray-900">
                          서울특별시 강남구 테헤란로 123
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>

                <div className="bg-info-light border border-info rounded-md p-6 mb-6">
                  <p className="text-body text-info">
                    평가사가 이동 중입니다. 도착 시 알림을 보내드립니다.
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <Button variant="secondary" onClick={() => (window.location.href = '/inspections')}>
                    목록으로
                  </Button>
                  <Button variant="secondary" onClick={handleSkipToComplete}>
                    스킵 (검차완료로)
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* 5-2: 검차완료 */}
          {localStage === 'complete' && (
            <>
              <h1 className="text-h1 font-bold text-gray-900 mb-2">검차 진행내역</h1>
              <p className="text-body text-gray-600 mb-8">{STAGE_LABELS.complete}</p>

              <div className="max-w-2xl">
                <div className="flex items-center gap-4 mb-6">
                  <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full w-full bg-primary rounded-full" />
                  </div>
                  <span className="text-body font-medium text-primary">3/3</span>
                </div>

                <div className="text-center mb-8">
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
                  <Button variant="secondary" onClick={() => (window.location.href = '/inspections')}>
                    목록으로
                  </Button>
                  <Button onClick={handleGoToHistory}>검차내역 보기</Button>
                </div>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};
