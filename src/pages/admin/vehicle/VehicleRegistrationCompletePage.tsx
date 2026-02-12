/**
 * 차량 등록 완료 화면. IA §4.9 CTA_1 완료 후 §4.10 CTA_2(검차 신청) 진입 권장.
 * @see docs/figma/IA_SITEMAP_SPEC_IPOE.md §4.9
 * @see docs/figma/FSD_SPEC_BLUEPRINT.md §2.2
 * 라우트: /vehicles/:vehicleId/complete. Figma 1418-20576 차량등록완료_확인.
 * vehicleId는 신규 등록 플로우(저장 전)에서 "new"로 올 수 있음. 검차 신청은 /inspections/request로 이동하므로 ID 불필요.
 */

import { useNavigate } from 'react-router-dom';
import { logEventWithHypothesis } from '@/shared/lib/logEvent';
import { LandingHeader } from '@/widgets/Header';
import { ProgressSidebar } from '@/widgets/ProgressSidebar';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { getRegisterFlowSteps } from '@/shared/config/registerFlowSteps';
import { Button } from '@/shared/ui/Button';
import { ClipboardList, Home, SearchCheck } from 'lucide-react';

export const VehicleRegistrationCompletePage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    // #region agent log
    logEventWithHypothesis('VehicleRegistrationCompletePage:handleGoHome', 'CTA_1완료→홈', { to: '/vehicles' }, 'H_CTA1');
    // #endregion
    navigate('/vehicles');
  };

  /** IA §4.10 CTA_2 진입: 검차 신청 랜딩으로 이동 */
  const handleInspectionRequest = () => {
    // #region agent log
    logEventWithHypothesis('VehicleRegistrationCompletePage:handleInspectionRequest', 'CTA_1완료→검차신청', { to: '/inspections/request' }, 'H_CTA2');
    // #endregion
    navigate('/inspections/request');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader userName="홍길동" variant="main" activeNav="vehicles" />

      <div className={`flex ${LAYOUT_CLASSES.CONTAINER}`}>
        <ProgressSidebar steps={getRegisterFlowSteps('upload')} className={LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} inline />
        <main className={`flex-1 py-8 ${LAYOUT_CLASSES.MAIN_DETAIL}`}>
          <div className="mx-auto max-w-4xl text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <ClipboardList className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-h1 font-bold text-gray-900 mb-6">
              차량 등록이 완료되었습니다.
            </h1>
            <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
              <Button size="lg" variant="primary" onClick={handleInspectionRequest}>
                <SearchCheck className="h-5 w-5 mr-2" />
                검차 신청하기
              </Button>
              <Button size="lg" variant="secondary" onClick={handleGoHome}>
                <Home className="h-5 w-5 mr-2" />
                홈으로 돌아가기
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
