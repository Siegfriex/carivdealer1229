/**
 * GeneralSaleCompletePage (Figma 1418:20576 판매전환완료 — §3.5 차량 등록·상세·경매)
 * 일반 판매 전환 완료: "판매 상태로 전환되었습니다", "구매제안이 오면 알람을 통해 알려드려요!", 확인. GNB 거래 활성.
 */

import { useNavigate } from 'react-router-dom';
import { LOG_INGEST_URL } from '@/shared/config/logging';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { ProgressSidebar } from '@/widgets/ProgressSidebar/ui/ProgressSidebar';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { getRegisterFlowSteps } from '@/shared/config/registerFlowSteps';
import { Button } from '@/shared/ui/Button';
import { Tag } from 'lucide-react';

export const GeneralSaleCompletePage = () => {
  const navigate = useNavigate();

  const handleConfirm = () => {
    // #region agent log
    fetch(LOG_INGEST_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'GeneralSaleCompletePage:handleConfirm',message:'일반판매완료→거래목록',data:{to:'/offers'},timestamp:Date.now(),hypothesisId:'H_CTA3_sale',runId:'register-flow-check'})}).catch(()=>{});
    // #endregion
    navigate('/offers');
  };

  const handleNextLogistics = () => {
    fetch(LOG_INGEST_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'GeneralSaleCompletePage:handleNextLogistics',message:'다음: 탁송 신청(CTA_4)',data:{to:'/logistics/schedule'},timestamp:Date.now(),hypothesisId:'H_CTA4',runId:'register-flow-check'})}).catch(()=>{});
    navigate('/logistics/schedule');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader userName="홍길동" variant="main" activeNav="offers" />
      <div className={`flex ${LAYOUT_CLASSES.CONTAINER}`}>
        <ProgressSidebar steps={getRegisterFlowSteps('trade')} className={LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} inline widthClass={LAYOUT_CLASSES.GNB_SIDEBAR} />
        <main className={`flex-1 py-8 ${LAYOUT_CLASSES.MAIN_GNB_STEP}`}>
          {/* 794-4107 SSOT: 794:4192 32px, 794:4199 20px */}
          <div className="mx-auto max-w-[972px] text-center" data-node-id="794:4191">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
              <Tag className="h-12 w-12 text-primary" />
            </div>
            <p className="font-['SUITE_Variable'] font-extrabold leading-[61px] text-[32px] text-black text-center mb-3" data-node-id="794:4192">
              판매 상태로 전환되었습니다
            </p>
            <p className="font-['Pretendard'] text-[20px] leading-[48px] text-black text-center mb-8" data-node-id="794:4199">
              구매제안이 오면 알람을 통해 알려드려요!
            </p>
            <div className="flex flex-wrap justify-center gap-4" data-node-id="794:4197">
              <Button variant="secondary" size="lg" onClick={handleConfirm}>
                거래 목록 보기
              </Button>
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
