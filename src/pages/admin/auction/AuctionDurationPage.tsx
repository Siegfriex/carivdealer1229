/**
 * AuctionDurationPage (SCR-0402-A)
 * 경매 - 기간 설정
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

export const AuctionDurationPage = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();

  const handleSubmit = () => {
    const to = vehicleId ? `/vehicles/${vehicleId}/auction/complete` : '/vehicles';
    // #region agent log
    fetch(LOG_INGEST_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuctionDurationPage:handleSubmit',message:'CTA_3 경매 기간→완료(CTA_4탁송연결없음)',data:{to},timestamp:Date.now(),hypothesisId:'H_CTA3_auction',runId:'register-flow-check'})}).catch(()=>{});
    // #endregion
    navigate(to);
  };

  const handleBack = () => {
    if (vehicleId) navigate(`/vehicles/${vehicleId}/auction/start-price`);
    else navigate('/vehicles');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader variant="main" activeNav="vehicles" />
      <div className={`flex ${LAYOUT_CLASSES.CONTAINER}`}>
        <ProgressSidebar steps={getRegisterFlowSteps('trade')} className={LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} inline />
        <main className={`flex-1 p-6 ${LAYOUT_CLASSES.MAIN_DETAIL}`}>
          <h1 className="text-h1 font-bold text-gray-900 mb-2">경매 기간 설정</h1>
          <p className="text-body text-gray-600 mb-8">경매 종료 일시를 설정하세요.</p>
          <Card className="p-6 space-y-4">
            <div>
              <label className="block text-body font-medium text-gray-700 mb-2">경매 종료일</label>
              <Input type="date" className="w-full" />
            </div>
            <div>
              <label className="block text-body font-medium text-gray-700 mb-2">경매 종료 시간</label>
              <Input type="time" className="w-full" />
            </div>
          </Card>
          <div className="flex gap-4 mt-8">
            <Button variant="secondary" onClick={handleBack}>
              이전
            </Button>
            <Button onClick={handleSubmit}>경매 시작</Button>
          </div>

          {import.meta.env.DEV && (
            <DevSkipButton label="DEV:SKIP" subLabel="경매 완료로" onClick={handleSubmit} />
          )}
        </main>
      </div>
    </div>
  );
};
