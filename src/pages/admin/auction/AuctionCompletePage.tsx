/**
 * AuctionCompletePage (Figma 1123-13487 — 판매전환완료 경매)
 * 경매 등록 완료. 라우트: /vehicles/:id/auction/complete
 * @see docs/figmaMCP/impl_plans/1123-13487_구현계획.md
 */

import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { logEventWithHypothesis } from '@/shared/lib/logEvent';
import { LandingHeader } from '@/widgets/Header';
import { ProgressSidebar } from '@/widgets/ProgressSidebar';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { getRegisterFlowSteps } from '@/shared/config/registerFlowSteps';
import { Button } from '@/shared/ui/Button';
import { CheckCircle2 } from 'lucide-react';

export const AuctionCompletePage = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const { state } = useLocation();
  const { startPrice, instantPrice, startDate, endDate } = (state as {
    startPrice?: string;
    instantPrice?: string;
    startDate?: string;
    endDate?: string;
  }) ?? {};

  const handleAuctionDetail = () => {
    const to = vehicleId ? `/vehicles/${vehicleId}/auction` : '/vehicles';
    // #region agent log
    logEventWithHypothesis('AuctionCompletePage:handleAuctionDetail', '경매완료→상세(CTA_4탁송연결없음)', { to }, 'H_CTA3_auction');
    // #endregion
    navigate(to);
  };

  const handleOffers = () => {
    // #region agent log
    logEventWithHypothesis('AuctionCompletePage:handleOffers', '경매완료→제안목록', { to: '/offers' }, 'H_CTA3_auction');
    // #endregion
    navigate('/offers');
  };

  const handleNextLogistics = () => {
    logEventWithHypothesis('AuctionCompletePage:handleNextLogistics', '다음: 탁송 신청(CTA_4)', { to: '/logistics/schedule' }, 'H_CTA4');
    navigate('/logistics/schedule');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader variant="main" activeNav="offers" />
      <div className={`flex min-w-0 ${LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} ${LAYOUT_CLASSES.CONTAINER}`}>
        <ProgressSidebar steps={getRegisterFlowSteps('trade')} className={LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} inline widthClass={LAYOUT_CLASSES.GNB_SIDEBAR} />
        <main className={`flex-1 min-w-0 overflow-x-auto p-6 ${LAYOUT_CLASSES.MAIN_GNB_STEP} flex flex-col items-center justify-center ${LAYOUT_CLASSES.CONTENT_MIN_HEIGHT}`} data-node-id="1123:13487">
          {/* 1123-13487 SSOT: 1123:13572 32px, 1123:13579 20px — 일반판매완료와 동일 문구 */}
          <div className="text-center mb-8 w-full max-w-md" data-node-id="1123:13571">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-success-light flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-success" />
            </div>
            <p className="font-['SUITE_Variable'] font-extrabold leading-[61px] text-[32px] text-black text-center mb-4" data-node-id="1123:13572">
              판매 상태로 전환되었습니다
            </p>
            <p className="font-['Pretendard'] text-[20px] leading-[48px] text-black text-center mb-8" data-node-id="1123:13579">
              구매제안이 오면 알람을 통해 알려드려요!
            </p>
            {(startPrice || instantPrice || startDate || endDate) && (
              <div className="text-body text-gray-600 mb-4 space-y-1">
                {startPrice && <p>시작가: {startPrice}만원</p>}
                {instantPrice && <p>즉시구매가: {instantPrice}만원</p>}
                {startDate && <p>경매 시작일: {startDate}</p>}
                {endDate && <p>경매 종료일: {endDate}</p>}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-4" data-node-id="1123:13577">
            <Button variant="secondary" onClick={handleAuctionDetail}>
              경매 상세
            </Button>
            <Button variant="secondary" onClick={handleOffers}>제안 목록</Button>
            <Button onClick={handleNextLogistics} data-node-id="1123:13578">다음: 탁송 신청</Button>
          </div>
        </main>
      </div>
    </div>
  );
};
