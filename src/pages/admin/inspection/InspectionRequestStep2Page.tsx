/**
 * InspectionRequestStep2Page Component
 * 검차 신청 Step 2 - 평가사 선택 (리스트/카드 뷰 토글)
 * DEV:SKIP(좌하단): 평가사 선택 스킵 후 목록(/inspections) 이동
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logEventWithHypothesis } from '@/shared/lib/logEvent';
import { LandingHeader } from '@/widgets/Header';
import { ProgressSidebar } from '@/widgets/ProgressSidebar';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { getRegisterFlowSteps } from '@/shared/config/registerFlowSteps';
import { StepProgress, type Step } from '@/shared/ui/StepProgress';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { DevSkipButton } from '@/shared/ui/DevSkipButton';
import { useFormFeedback } from '@/shared/lib/formFeedback';
import { CheckCircle2, Grid3x3, List, Star } from 'lucide-react';

const steps: Step[] = [
  { id: 'step1', label: '날짜/장소 선택', status: 'completed' },
  { id: 'step2', label: '평가사 선택', status: 'current' },
  { id: 'step3', label: '검차 진행', status: 'upcoming' },
  { id: 'step4', label: '검차 완료', status: 'upcoming' },
];

// Mock 평가사 데이터
const evaluators = [
  { id: 'eval-1', name: '김평가', rating: 4.8, specialty: '수입차 전문', phone: '010-1234-5678' },
  { id: 'eval-2', name: '이평가', rating: 4.9, specialty: '국산차 전문', phone: '010-2345-6789' },
  { id: 'eval-3', name: '박평가', rating: 4.7, specialty: '상용차 전문', phone: '010-3456-7890' },
];

export const InspectionRequestStep2Page = () => {
  const navigate = useNavigate();
  const { showValidationError } = useFormFeedback();
  const [viewMode, setViewMode] = useState<'list' | 'card'>('list');
  const [selectedId, setSelectedId] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleDevSkip = () => {
    navigate('/inspections');
  };

  const handleSubmit = () => {
    if (!selectedId) {
      showValidationError('평가사를 선택해주세요.');
      return;
    }

    const selectedEvaluator = evaluators.find((e) => e.id === selectedId);
    console.log('검차 신청:', { evaluatorId: selectedId, evaluatorName: selectedEvaluator?.name });

    // #region agent log
    logEventWithHypothesis('InspectionRequestStep2Page:handleSubmit', '검차신청 완료', { to: '/inspections' }, 'H_CTA2_end');
    // #endregion
    setSubmitted(true);
  };

  const handleGoToList = () => navigate('/inspections');

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader userName="홍길동" variant="main" activeNav="inspections" />

      <div className={`flex ${LAYOUT_CLASSES.CONTAINER}`}>
        <aside className={`${LAYOUT_CLASSES.SIDEBAR} flex-shrink-0 bg-white border-r border-gray-200 ${LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} flex flex-col`}>
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-button font-medium text-gray-700 mb-2">검색</h3>
            <input
              type="text"
              placeholder="차량번호/모델명"
              className="w-full pl-3 pr-10 py-2.5 border border-gray-200 rounded-md text-body text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex-1 overflow-auto">
            <ProgressSidebar steps={getRegisterFlowSteps('inspection')} inline />
          </div>
        </aside>
        <main className={`flex-1 py-8 ${LAYOUT_CLASSES.MAIN_DETAIL}`}>
          <StepProgress steps={steps} className="mb-12" />

          <div className="mx-auto max-w-4xl">
          {submitted ? (
            <Card className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-h2 font-bold text-gray-900 mb-2">검차 신청이 완료되었습니다</h2>
              <p className="text-body text-gray-600 mb-6">검차 목록에서 진행 상황을 확인하세요.</p>
              <Button onClick={handleGoToList}>검차 목록 보기</Button>
            </Card>
          ) : (
          <>
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-h1 font-bold text-gray-900 mb-2">평가사를 선택해주세요</h1>
              <p className="text-body text-gray-600">검차를 진행할 평가사를 선택해주세요</p>
            </div>

            {/* View Toggle */}
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
                onClick={() => setViewMode('card')}
                aria-label="카드 뷰"
                className={`p-2 rounded transition-fast ${
                  viewMode === 'card' ? 'bg-white text-primary shadow-sm' : 'text-gray-600'
                }`}
              >
                <Grid3x3 className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* 리스트 뷰 */}
          {viewMode === 'list' && (
            <div className="space-y-4">
              {evaluators.map((evaluator) => (
                <Card
                  key={evaluator.id}
                  hover
                  onClick={() => setSelectedId(evaluator.id)}
                  className={`cursor-pointer ${
                    selectedId === evaluator.id ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-h4 font-bold text-gray-600">
                          {evaluator.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-h4 font-bold text-gray-900">{evaluator.name}</h3>
                        <p className="text-body text-gray-600">{evaluator.specialty}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1">
                        <Star className="h-5 w-5 fill-warning text-warning" />
                        <span className="text-body font-medium">{evaluator.rating}</span>
                      </div>
                      <input
                        type="radio"
                        checked={selectedId === evaluator.id}
                        onChange={() => setSelectedId(evaluator.id)}
                        className="w-5 h-5 text-primary"
                      />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* 카드 뷰 */}
          {viewMode === 'card' && (
            <div className="grid grid-cols-3 gap-6">
              {evaluators.map((evaluator) => (
                <Card
                  key={evaluator.id}
                  hover
                  onClick={() => setSelectedId(evaluator.id)}
                  className={`cursor-pointer ${
                    selectedId === evaluator.id ? 'ring-2 ring-primary' : ''
                  }`}
                >
                  <div className="text-center">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-200 flex items-center justify-center">
                      <span className="text-h2 font-bold text-gray-600">
                        {evaluator.name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="text-h4 font-bold text-gray-900 mb-2">{evaluator.name}</h3>
                    <p className="text-body text-gray-600 mb-3">{evaluator.specialty}</p>
                    <div className="flex items-center justify-center gap-1 mb-4">
                      <Star className="h-5 w-5 fill-warning text-warning" />
                      <span className="text-body font-medium">{evaluator.rating}</span>
                    </div>
                    <input
                      type="radio"
                      checked={selectedId === evaluator.id}
                      onChange={() => setSelectedId(evaluator.id)}
                      className="w-5 h-5 text-primary"
                    />
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="flex justify-between pt-8">
            <Button variant="secondary" onClick={() => navigate(-1)}>
              이전
            </Button>
            <Button onClick={handleSubmit} disabled={!selectedId}>
              검차 신청 완료
            </Button>
          </div>
          </>
          )}
        </div>
        </main>
      </div>
      <DevSkipButton onClick={handleDevSkip} subLabel="목록으로 스킵" />
    </div>
  );
};
