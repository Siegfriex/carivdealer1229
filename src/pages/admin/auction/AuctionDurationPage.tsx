/**
 * AuctionDurationPage (Figma 1123-20023, 1123-20699, 1123-13763 — 경매 기간/연월일시)
 * 1123:20090 경매 기간 카드, 1123:20094 경매 시작일, 1123:20097 경매 종료일.
 * 라우트: /vehicles/:id/auction/duration
 */

import { useParams, useNavigate } from 'react-router-dom';
import { LOG_INGEST_URL } from '@/shared/config/logging';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { ProgressSidebar } from '@/widgets/ProgressSidebar/ui/ProgressSidebar';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { getRegisterFlowSteps } from '@/shared/config/registerFlowSteps';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { DevSkipButton } from '@/shared/ui/DevSkipButton';
import { isRunDev } from '@/shared/config/runDev';

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
      <LandingHeader variant="main" activeNav="offers" />
      <div className={`flex ${LAYOUT_CLASSES.CONTAINER}`}>
        <ProgressSidebar steps={getRegisterFlowSteps('trade')} className={LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} inline widthClass={LAYOUT_CLASSES.GNB_SIDEBAR} />
        <main className={`flex-1 p-6 ${LAYOUT_CLASSES.MAIN_GNB_STEP}`} data-node-id="1123:20023">
          {/* 1123:20090 — 경매 기간 카드 971×336, 1123:20091~20097 */}
          <div
            className="bg-white rounded-[30px] shadow-[2.344px_3.125px_11.017px_0px_rgba(0,0,0,0.05)] w-full max-w-[971px] min-h-[336px] p-6"
            data-node-id="1123:20090"
          >
            <p className="text-[26px] font-extrabold text-black mb-8" data-node-id="1123:20091">
              경매 기간
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-[#f4f4f4] rounded-[30px] min-h-[180px] p-6 flex flex-col" data-node-id="1123:20092">
                <p className="text-[22px] font-bold text-black/70 mb-4" data-node-id="1123:20094">
                  경매 시작일
                </p>
                <Input type="date" className="w-full text-[38px] font-bold text-black/30" aria-label="경매 시작일" />
              </div>
              <div className="bg-[#f4f4f4] rounded-[30px] min-h-[180px] p-6 flex flex-col" data-node-id="1123:20093">
                <p className="text-[22px] font-bold text-black/70 mb-4" data-node-id="1123:20097">
                  경매 종료일
                </p>
                <Input type="date" className="w-full text-[38px] font-bold text-black/30" aria-label="경매 종료일" />
              </div>
            </div>
          </div>
          <div className="flex gap-4 mt-8">
            <Button variant="secondary" onClick={handleBack}>
              이전
            </Button>
            <Button onClick={handleSubmit}>경매 시작</Button>
          </div>

          {isRunDev() && (
            <DevSkipButton label="DEV:SKIP" subLabel="경매 완료로" onClick={handleSubmit} />
          )}
        </main>
      </div>
    </div>
  );
};
