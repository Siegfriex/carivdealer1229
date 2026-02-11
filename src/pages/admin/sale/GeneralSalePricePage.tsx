/**
 * GeneralSalePricePage (Figma 794-4200, 794-4371 — 경매 시작가설정 보정 일반)
 * 일반 판매 가격 설정. 좌측 320×420 차량정보 패널(794:4201 SSOT), 우측 희망가 폼.
 * @see docs/figmaMCP/impl_plans/794-4200_794-4371_구현계획.md
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
import { DevSkipButton } from '@/shared/ui/DevSkipButton';
import { isRunDev } from '@/shared/config/runDev';

export const GeneralSalePricePage = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const { data: vehicle, isLoading } = useVehicle(vehicleId ?? undefined);
  const [inspectionDetailOpen, setInspectionDetailOpen] = useState(false);
  const [hopePrice, setHopePrice] = useState('');

  const handleSubmit = () => {
    const to = vehicleId ? `/vehicles/${vehicleId}/sale/complete` : '/offers';
    // #region agent log
    fetch(LOG_INGEST_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'GeneralSalePricePage:handleSubmit',message:'CTA_3 일반 가격→판매완료',data:{to},timestamp:Date.now(),hypothesisId:'H_CTA3_sale',runId:'register-flow-check'})}).catch(()=>{});
    // #endregion
    navigate(to, { state: { hopePrice: hopePrice.trim() || undefined } });
  };

  const handleBack = () => {
    if (vehicleId) navigate(`/vehicles/${vehicleId}/sale/analyzing`);
    else navigate('/vehicles');
  };

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
    <div className="min-h-screen bg-gray-50" data-node-id="794:4200">
      <LandingHeader variant="main" activeNav="offers" />
      <div className={`flex min-w-0 ${LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} ${LAYOUT_CLASSES.CONTAINER}`}>
        <ProgressSidebar steps={getRegisterFlowSteps('trade')} className={LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} inline widthClass={LAYOUT_CLASSES.GNB_SIDEBAR} />
        <main className={`flex-1 min-w-0 overflow-x-auto p-6 ${LAYOUT_CLASSES.MAIN_GNB_STEP} flex gap-6 flex-wrap`}>
          {/* 794-4200: 좌측 차량정보 패널 320×420 (VehicleInfoPanel) */}
          <VehicleInfoPanel vehicle={vehicle} nodeIdPrefix="794" />

          {/* 794-4200/4371 SSOT: 우측 피드백 블록 (차량정보와 높이 420px 맞춤) */}
          <div className={LAYOUT_CLASSES.CTA3_FEEDBACK_BLOCK} data-node-id="794:4371">
            <FeedbackBlock nodeIdPrefix="794" onInspectionDetail={() => setInspectionDetailOpen(true)} />
          </div>

          {/* 794:4253 — 내차 예상 시세 카드 */}
          <div className={`${LAYOUT_CLASSES.CTA3_PRICE_CARD} flex flex-col justify-center`} data-node-id="794:4253">
            <p className="text-[26px] font-extrabold text-black mb-2" data-node-id="794:4254">
              내차 예상 시세는
            </p>
            <p className="text-[48px] font-extrabold text-primary leading-tight" data-node-id="794:4255">
              910 ~ 1,010
            </p>
            <p className="text-[28px] font-extrabold text-primary" data-node-id="794:4256">
              만원이에요.
            </p>
          </div>
          {/* 794:4257 — 판매 가격 카드 */}
          <div className={LAYOUT_CLASSES.CTA3_PRICE_CARD} data-node-id="794:4257">
            <p className="text-[26px] font-extrabold text-black mb-4" data-node-id="794:4258">
              판매 가격은
            </p>
            <div className="flex flex-wrap items-baseline gap-2">
              <Input
                type="number"
                value={hopePrice}
                onChange={(e) => setHopePrice(e.target.value)}
                placeholder=""
                className="w-24 text-[28px] font-extrabold text-black"
                aria-label="희망가 만원"
              />
              <span className="text-[28px] font-extrabold text-black" data-node-id="794:4259">
                만원으로 설정할게요.
              </span>
            </div>
          </div>

          <div className="w-full flex gap-4">
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
      <InspectionDetailModal isOpen={inspectionDetailOpen} onClose={() => setInspectionDetailOpen(false)} />
    </div>
  );
};
