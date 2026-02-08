/**
 * 일반 판매 시세분석. CTA_3 일반 플로우. IA §4.11.
 * @see docs/figma/IA_SITEMAP_SPEC_IPOE.md §4.11
 * @see docs/figma/FSD_SPEC_BLUEPRINT.md §2.2
 * 라우트: /vehicles/:vehicleId/sale/analyzing.
 */

import { useParams, useNavigate } from 'react-router-dom';
import { LOG_INGEST_URL } from '@/shared/config/logging';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { ProgressSidebar } from '@/widgets/ProgressSidebar/ui/ProgressSidebar';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { getRegisterFlowSteps } from '@/shared/config/registerFlowSteps';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { DevSkipButton } from '@/shared/ui/DevSkipButton';
import { Loader2 } from 'lucide-react';

export const GeneralSaleAnalyzingPage = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();

  const handleNext = () => {
    const to = vehicleId ? `/vehicles/${vehicleId}/sale/price` : '/offers';
    // #region agent log
    fetch(LOG_INGEST_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'GeneralSaleAnalyzingPage:handleNext',message:'CTA_3 일반 시세→가격설정',data:{to},timestamp:Date.now(),hypothesisId:'H_CTA3_sale',runId:'register-flow-check'})}).catch(()=>{});
    // #endregion
    navigate(to);
  };

  const handleBack = () => {
    if (vehicleId) navigate(`/vehicles/${vehicleId}`);
    else navigate('/vehicles');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader variant="main" activeNav="vehicles" />
      <div className={`flex ${LAYOUT_CLASSES.CONTAINER}`}>
        <ProgressSidebar steps={getRegisterFlowSteps('trade')} className={LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} inline />
        <main className={`flex-1 p-6 ${LAYOUT_CLASSES.MAIN_DETAIL}`}>
          <h1 className="text-h1 font-bold text-gray-900 mb-2">일반 판매 분석 중</h1>
          <p className="text-body text-gray-600 mb-8">시장 가격을 분석하고 있습니다.</p>
          <Card className="p-8 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-body text-gray-600">잠시만 기다려 주세요.</p>
          </Card>
          <div className="flex gap-4 mt-8">
            <Button variant="secondary" onClick={handleBack}>
              이전
            </Button>
            <Button onClick={handleNext}>다음 (가격 설정)</Button>
          </div>

          {import.meta.env.DEV && (
            <DevSkipButton label="DEV:SKIP" subLabel="가격 설정으로" onClick={handleNext} />
          )}
        </main>
      </div>
    </div>
  );
};
