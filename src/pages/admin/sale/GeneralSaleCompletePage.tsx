/**
 * GeneralSaleCompletePage (Figma 794-4107 — 판매전환완료 일반)
 * 일반 판매 전환 완료: "판매 상태로 전환되었습니다", "구매제안이 오면 알람을 통해 알려드려요!", 확인. GNB 거래 활성.
 * @see docs/figmaMCP/impl_plans/794-4107_구현계획.md
 */

import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { LOG_INGEST_URL } from '@/shared/config/logging';
import { LandingHeader } from '@/widgets/Header';
import { ProgressSidebar } from '@/widgets/ProgressSidebar';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { getRegisterFlowSteps } from '@/shared/config/registerFlowSteps';
import { Button } from '@/shared/ui/Button';
import { Tag } from 'lucide-react';

export const GeneralSaleCompletePage = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const { state } = useLocation();
  const hopePrice = (state as { hopePrice?: string })?.hopePrice;

  const handleTradeDetail = () => {
    const to = vehicleId ? `/vehicles/${vehicleId}/trade` : '/offers';
    fetch(LOG_INGEST_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'GeneralSaleCompletePage:handleTradeDetail',message:'일반판매완료→거래상세',data:{to},timestamp:Date.now(),hypothesisId:'H_CTA3_sale',runId:'register-flow-check'})}).catch(()=>{});
    navigate(to);
  };

  const handleOffers = () => {
    fetch(LOG_INGEST_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'GeneralSaleCompletePage:handleOffers',message:'일반판매완료→거래목록',data:{to:'/offers'},timestamp:Date.now(),hypothesisId:'H_CTA3_sale',runId:'register-flow-check'})}).catch(()=>{});
    navigate('/offers');
  };

  const handleNextLogistics = () => {
    fetch(LOG_INGEST_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'GeneralSaleCompletePage:handleNextLogistics',message:'다음: 탁송 신청(CTA_4)',data:{to:'/logistics/schedule'},timestamp:Date.now(),hypothesisId:'H_CTA4',runId:'register-flow-check'})}).catch(()=>{});
    navigate('/logistics/schedule');
  };

  return (
    <div className="min-h-screen bg-gray-50" data-node-id="794:4107">
      <LandingHeader userName="홍길동" variant="main" activeNav="offers" />
      <div className={`flex min-w-0 ${LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} ${LAYOUT_CLASSES.CONTAINER}`}>
        <ProgressSidebar steps={getRegisterFlowSteps('trade')} className={LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} inline widthClass={LAYOUT_CLASSES.GNB_SIDEBAR} />
        <main className={`flex-1 min-w-0 overflow-x-auto p-6 ${LAYOUT_CLASSES.MAIN_GNB_STEP} flex flex-col items-center justify-center ${LAYOUT_CLASSES.CONTENT_MIN_HEIGHT}`}>
          {/* 794-4107 SSOT: 경매완료와 동일 구조 — 거래 상세 | 제안 목록 | 다음: 탁송 신청 */}
          <div className="text-center mb-8 w-full max-w-md" data-node-id="794:4191">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
              <Tag className="h-12 w-12 text-primary" />
            </div>
            <p className="font-['SUITE_Variable'] font-extrabold leading-[61px] text-[32px] text-black text-center mb-3" data-node-id="794:4192">
              판매 상태로 전환되었습니다
            </p>
            <p className="font-['Pretendard'] text-[20px] leading-[48px] text-black text-center mb-8" data-node-id="794:4199">
              구매제안이 오면 알람을 통해 알려드려요!
            </p>
            {hopePrice && (
              <p className="text-body text-gray-600 mb-4">
                희망가: {hopePrice}만원
              </p>
            )}
            <div className="flex flex-wrap gap-4 justify-center" data-node-id="794:4197">
              <Button variant="secondary" size="lg" onClick={handleTradeDetail}>
                거래 상세
              </Button>
              <Button variant="secondary" size="lg" onClick={handleOffers}>제안 목록</Button>
              <Button size="lg" onClick={handleNextLogistics} data-node-id="794:4198">
                다음: 탁송 신청
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
