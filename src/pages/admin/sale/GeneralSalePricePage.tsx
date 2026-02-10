/**
 * GeneralSalePricePage (SCR-0302-N)
 * 일반 판매 - 가격 설정
 */

import { useParams, useNavigate } from 'react-router-dom';
import { LOG_INGEST_URL } from '@/shared/config/logging';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { ProgressSidebar } from '@/widgets/ProgressSidebar/ui/ProgressSidebar';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { getRegisterFlowSteps } from '@/shared/config/registerFlowSteps';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';
import { DevSkipButton } from '@/shared/ui/DevSkipButton';
import { isRunDev } from '@/shared/config/runDev';

export const GeneralSalePricePage = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();

  const handleSubmit = () => {
    const to = vehicleId ? `/vehicles/${vehicleId}/sale/complete` : '/offers';
    // #region agent log
    fetch(LOG_INGEST_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'GeneralSalePricePage:handleSubmit',message:'CTA_3 일반 가격→판매완료',data:{to},timestamp:Date.now(),hypothesisId:'H_CTA3_sale',runId:'register-flow-check'})}).catch(()=>{});
    // #endregion
    navigate(to);
  };

  const handleBack = () => {
    if (vehicleId) navigate(`/vehicles/${vehicleId}/sale/analyzing`);
    else navigate('/vehicles');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader variant="main" activeNav="vehicles" />
      <div className={`flex ${LAYOUT_CLASSES.CONTAINER}`}>
        <ProgressSidebar steps={getRegisterFlowSteps('trade')} className={LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} inline />
        <main className={`flex-1 p-6 ${LAYOUT_CLASSES.MAIN_DETAIL}`}>
          <h1 className="text-h1 font-bold text-gray-900 mb-2">판매 가격 설정</h1>
          <p className="text-body text-gray-600 mb-8">희망 판매가를 입력하세요.</p>
          <Card className="p-6 space-y-4">
            <div>
              <label className="block text-body font-medium text-gray-700 mb-2">희망가 (만원)</label>
              <Input type="number" placeholder="예: 2850" className="w-full" />
            </div>
          </Card>
          <div className="flex gap-4 mt-8">
            <Button variant="secondary" onClick={handleBack}>
              이전
            </Button>
            <Button onClick={handleSubmit}>등록 완료</Button>
          </div>

          {isRunDev() && (
            <DevSkipButton label="DEV:SKIP" subLabel="등록 완료로" onClick={handleSubmit} />
          )}
        </main>
      </div>
    </div>
  );
};
