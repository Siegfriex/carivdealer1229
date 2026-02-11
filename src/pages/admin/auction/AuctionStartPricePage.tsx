/**
 * AuctionStartPricePage (Figma 1123-13580 — 경매 사전 설정)
 * 좌측 1123:13581 320×420 차량정보, 우측 1123:13605 전체 피드백, 하단 1123:13633/13637/13641 카드.
 * 라우트: /vehicles/:id/auction/start-price
 * @see docs/figmaMCP/impl_plans/1123-13580_구현계획.md
 */

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LOG_INGEST_URL } from '@/shared/config/logging';
import { LandingHeader } from '@/widgets/Header';
import { ProgressSidebar } from '@/widgets/ProgressSidebar';
import { VehicleInfoPanel } from '@/widgets/VehicleInfoPanel';
import { FeedbackBlock } from '@/widgets/FeedbackBlock';
import { InspectionDetailModal } from '@/widgets/InspectionDetailModal';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { getRegisterFlowSteps } from '@/shared/config/registerFlowSteps';
import { useVehicle } from '@/features/vehicle/register-form';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { StepFooter } from '@/shared/ui/StepFooter';
import { DevSkipButton } from '@/shared/ui/DevSkipButton';
import { isRunDev } from '@/shared/config/runDev';

export const AuctionStartPricePage = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const { data: vehicle, isLoading } = useVehicle(vehicleId ?? undefined);
  const [inspectionDetailOpen, setInspectionDetailOpen] = useState(false);
  const [startPrice, setStartPrice] = useState('');
  const [instantPrice, setInstantPrice] = useState('');

  const handleConfirm = () => {
    const to = vehicleId ? `/vehicles/${vehicleId}/auction/duration` : '/vehicles';
    // #region agent log
    fetch(LOG_INGEST_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuctionStartPricePage:handleConfirm',message:'CTA_3 경매 시작가→기간설정',data:{to},timestamp:Date.now(),hypothesisId:'H_CTA3_auction',runId:'register-flow-check'})}).catch(()=>{});
    // #endregion
    navigate(to, { state: { startPrice, instantPrice } });
  };

  const handleBack = () => {
    if (vehicleId) navigate(`/vehicles/${vehicleId}/auction`);
    else navigate('/vehicles');
  };

  const hasPrices = startPrice.trim() !== '' && instantPrice.trim() !== '';

  if (!vehicleId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Button onClick={() => navigate('/vehicles')}>차량 목록</Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-body text-gray-600">로딩 중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader variant="main" activeNav="offers" />
      <div className={`flex min-w-0 ${LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} ${LAYOUT_CLASSES.CONTAINER}`}>
        <ProgressSidebar steps={getRegisterFlowSteps('trade')} className={LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} inline widthClass={LAYOUT_CLASSES.GNB_SIDEBAR} />
        <main className={`flex-1 min-w-0 overflow-x-auto p-6 ${LAYOUT_CLASSES.MAIN_GNB_STEP} flex gap-6 flex-wrap`} data-node-id="1123:13580">
            {/* 1123:13581 — 좌측 차량정보 320×420 (VehicleInfoPanel) */}
            <VehicleInfoPanel vehicle={vehicle} nodeIdPrefix="1123" showBadge />

            {/* 1123:13605 — 전체 피드백 블록 (FeedbackBlock, 차량정보와 높이 420px 맞춤) */}
            <div className={LAYOUT_CLASSES.CTA3_FEEDBACK_BLOCK}>
              <FeedbackBlock nodeIdPrefix="1123" onInspectionDetail={() => setInspectionDetailOpen(true)} />
            </div>

            {/* 1123:13633 — 내차 예상 시세 카드 */}
            <div className={`${LAYOUT_CLASSES.CTA3_PRICE_CARD} flex flex-col justify-center`} data-node-id="1123:13633">
              <p className="text-[26px] font-extrabold text-black mb-2" data-node-id="1123:13634">내차 예상 시세는</p>
              <p className="text-[48px] font-extrabold text-primary leading-tight" data-node-id="1123:13635">910 ~ 1,010</p>
              <p className="text-[28px] font-extrabold text-primary" data-node-id="1123:13636">만원이에요.</p>
            </div>

            {/* 1123:13637 — 경매 시작가 카드 */}
            <div className={LAYOUT_CLASSES.CTA3_PRICE_CARD} data-node-id="1123:13637">
              <p className="text-[26px] font-extrabold text-black mb-4" data-node-id="1123:13638">경매 시작가는</p>
              <div className="flex flex-wrap items-baseline gap-2">
                <Input
                  type="number"
                  value={startPrice}
                  onChange={(e) => setStartPrice(e.target.value)}
                  placeholder=""
                  className="w-24 text-[28px] font-extrabold text-black"
                  aria-label="경매 시작가 만원"
                />
                <span className="text-[28px] font-extrabold text-black" data-node-id="1123:13639">만원으로 설정할게요.</span>
              </div>
            </div>

            {/* 1123:13641 — 즉시 판매가 카드 */}
            <div className={LAYOUT_CLASSES.CTA3_PRICE_CARD} data-node-id="1123:13641">
              <p className="text-[26px] font-extrabold text-black mb-4" data-node-id="1123:13642">즉시 판매가는</p>
              <div className="flex flex-wrap items-baseline gap-2">
                <Input
                  type="number"
                  value={instantPrice}
                  onChange={(e) => setInstantPrice(e.target.value)}
                  placeholder=""
                  className="w-24 text-[28px] font-extrabold text-black"
                  aria-label="즉시 판매가 만원"
                />
                <span className="text-[28px] font-extrabold text-black" data-node-id="1123:13643">만원으로 설정할게요.</span>
              </div>
            </div>

            <StepFooter onBack={handleBack} onConfirm={handleConfirm} confirmLabel="확인" confirmDisabled={!hasPrices} confirmClassName={hasPrices ? '' : 'opacity-90'} />

            {isRunDev() && (
              <DevSkipButton label="DEV:SKIP" subLabel="기간 설정으로" onClick={handleConfirm} />
            )}
        </main>
      </div>
      <InspectionDetailModal isOpen={inspectionDetailOpen} onClose={() => setInspectionDetailOpen(false)} />
    </div>
  );
};
