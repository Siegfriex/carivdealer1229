/**
 * AuctionCompletePage (Figma 1418:20576 — §3.5 판매 상태 전환 완료)
 * 경매 등록 완료. 라우트: /vehicles/:id/auction/complete
 */

import { useParams, useNavigate } from 'react-router-dom';
import { LOG_INGEST_URL } from '@/shared/config/logging';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { ProgressSidebar } from '@/widgets/ProgressSidebar/ui/ProgressSidebar';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { getRegisterFlowSteps } from '@/shared/config/registerFlowSteps';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { CheckCircle2 } from 'lucide-react';

export const AuctionCompletePage = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();

  const handleAuctionDetail = () => {
    const to = vehicleId ? `/vehicles/${vehicleId}/auction` : '/vehicles';
    // #region agent log
    fetch(LOG_INGEST_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuctionCompletePage:handleAuctionDetail',message:'경매완료→상세(CTA_4탁송연결없음)',data:{to},timestamp:Date.now(),hypothesisId:'H_CTA3_auction',runId:'register-flow-check'})}).catch(()=>{});
    // #endregion
    navigate(to);
  };

  const handleOffers = () => {
    // #region agent log
    fetch(LOG_INGEST_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuctionCompletePage:handleOffers',message:'경매완료→제안목록',data:{to:'/offers'},timestamp:Date.now(),hypothesisId:'H_CTA3_auction',runId:'register-flow-check'})}).catch(()=>{});
    // #endregion
    navigate('/offers');
  };

  const handleNextLogistics = () => {
    fetch(LOG_INGEST_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuctionCompletePage:handleNextLogistics',message:'다음: 탁송 신청(CTA_4)',data:{to:'/logistics/schedule'},timestamp:Date.now(),hypothesisId:'H_CTA4',runId:'register-flow-check'})}).catch(()=>{});
    navigate('/logistics/schedule');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader variant="main" activeNav="offers" />
      <div className={`flex ${LAYOUT_CLASSES.CONTAINER}`}>
        <ProgressSidebar steps={getRegisterFlowSteps('trade')} className={LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} inline />
        <main className={`flex-1 p-6 ${LAYOUT_CLASSES.MAIN_DETAIL}`}>
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-success-light flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-success" />
            </div>
            <h1 className="text-h1 font-bold text-gray-900 mb-4">경매가 등록되었습니다</h1>
            <p className="text-body text-gray-600">입찰이 시작되면 알림을 받을 수 있습니다.</p>
          </div>
          <Card className="p-6 mb-8">
            <p className="text-body text-gray-700">경매 상세에서 진행 상황을 확인하세요.</p>
          </Card>
          <div className="flex flex-wrap gap-4">
            <Button variant="secondary" onClick={handleAuctionDetail}>
              경매 상세
            </Button>
            <Button variant="secondary" onClick={handleOffers}>제안 목록</Button>
            <Button onClick={handleNextLogistics}>다음: 탁송 신청</Button>
          </div>
        </main>
      </div>
    </div>
  );
};
