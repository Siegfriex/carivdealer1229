/**
 * 일반/경매 판매 시세분석. CTA_3 플로우. Figma 794-3704(판매방식선택), 794-4015(시세분석중).
 * @see docs/figmaMCP/impl_plans/794-3704_구현계획.md
 * @see docs/figmaMCP/impl_plans/794-4015_구현계획.md
 * 라우트: /vehicles/:vehicleId/sale/analyzing
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { logEventWithHypothesis } from '@/shared/lib/logEvent';
import { LandingHeader } from '@/widgets/Header';
import { ProgressSidebar } from '@/widgets/ProgressSidebar';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { getRegisterFlowSteps } from '@/shared/config/registerFlowSteps';
import { Button } from '@/shared/ui/Button';
import { DevSkipButton } from '@/shared/ui/DevSkipButton';
import { isRunDev } from '@/shared/config/runDev';
import { Loader2, ShoppingBag, Gavel } from 'lucide-react';

const ANALYZING_DELAY_MS = 1800;

type Step = 'choice' | 'analyzing';

export const GeneralSaleAnalyzingPage = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const typeParam = searchParams.get('type'); // 'auction' | null

  const [step, setStep] = useState<Step>(() => (typeParam === 'auction' ? 'analyzing' : 'choice'));
  const [saleType, setSaleType] = useState<'general' | 'auction' | null>(() =>
    typeParam === 'auction' ? 'auction' : null
  );

  const handleChoice = (type: 'general' | 'auction') => {
    setSaleType(type);
    setStep('analyzing');
  };

  useEffect(() => {
    if (step !== 'analyzing' || !saleType) return;
    const to = saleType === 'general'
      ? (vehicleId ? `/vehicles/${vehicleId}/sale/price` : '/offers')
      : (vehicleId ? `/vehicles/${vehicleId}/auction/start-price` : '/offers');
    const timer = setTimeout(() => {
      logEventWithHypothesis(
        'GeneralSaleAnalyzingPage:analyzingDone',
        saleType === 'general' ? 'CTA_3 일반 시세→가격설정' : 'CTA_3 경매 시세→시작가설정',
        { to, saleType },
        'H_CTA3_sale'
      );
      navigate(to);
    }, ANALYZING_DELAY_MS);
    return () => clearTimeout(timer);
  }, [step, saleType, vehicleId, navigate]);

  const handleBack = () => {
    if (step === 'analyzing') {
      setStep('choice');
      setSaleType(null);
    } else if (vehicleId) navigate(`/vehicles/${vehicleId}`);
    else navigate('/vehicles');
  };

  const handleDevSkip = () => {
    if (saleType === 'general') {
      navigate(vehicleId ? `/vehicles/${vehicleId}/sale/price` : '/offers');
    } else if (saleType === 'auction') {
      navigate(vehicleId ? `/vehicles/${vehicleId}/auction/start-price` : '/offers');
    } else {
      setSaleType('general');
      setStep('analyzing');
    }
  };

  return (
    <div className="min-h-screen bg-[var(--color-background,#f8f9fa)]" data-node-id={step === 'choice' ? '794:3704' : '794:4015'}>
      <LandingHeader variant="main" activeNav="offers" />
      <div className={`flex min-w-0 ${LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} ${LAYOUT_CLASSES.CONTAINER}`}>
        <ProgressSidebar steps={getRegisterFlowSteps('trade')} className={LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} inline widthClass={LAYOUT_CLASSES.GNB_SIDEBAR} />
        <main className={`flex-1 min-w-0 overflow-x-auto p-6 ${LAYOUT_CLASSES.MAIN_GNB_STEP}`}>
          {step === 'choice' && (
            <>
              {/* 794-3704: 판매 방식 선택 (Figma 794:3706 38px) */}
              <h1 className="text-[38px] font-extrabold leading-tight text-[rgba(0,0,0,0.8)] mb-12" style={{ fontFamily: 'var(--font-primary)' }} data-node-id="794:3706">
                판매 방식 선택
              </h1>
              <div className="flex flex-wrap justify-center gap-8 max-w-[640px] mx-auto">
                <button
                  type="button"
                  onClick={() => handleChoice('general')}
                  className="bg-white rounded-section w-[297px] min-h-[280px] p-6 flex flex-col items-center text-left hover:opacity-95 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
                  style={{ boxShadow: 'var(--shadow-sale-choice-card)' }}
                  data-node-id="794:3708"
                >
                  <div className="mb-4 flex justify-center">
                    <ShoppingBag className="w-14 h-14 text-[var(--color-primary)]" aria-hidden />
                  </div>
                  <h2 className="text-[26px] font-bold text-[var(--color-primary)] mb-3" data-node-id="794:3712">
                    일반 판매
                  </h2>
                  <p className="text-[15px] text-black leading-6" data-node-id="794:3713">
                    <span className="font-bold">원하는 가격으로 판매를 진행합니다. </span>
                    가격 제안을 받고, 조건에 맞는 경우에만 판매할 수 있습니다.
                  </p>
                </button>
                <button
                  type="button"
                  onClick={() => handleChoice('auction')}
                  className="bg-white rounded-section w-[297px] min-h-[280px] p-6 flex flex-col items-center text-left hover:opacity-95 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
                  style={{ boxShadow: 'var(--shadow-sale-choice-card)' }}
                  data-node-id="794:3720"
                >
                  <div className="mb-4 flex justify-center">
                    <Gavel className="w-14 h-14 text-[var(--color-primary)]" aria-hidden />
                  </div>
                  <h2 className="text-[26px] font-bold text-[var(--color-primary)] mb-3" data-node-id="794:3724">
                    경매
                  </h2>
                  <p className="text-[15px] text-black leading-6" data-node-id="794:3725">
                    <span className="font-bold">정해진 기간 동안 최고가로 판매됩니다.</span>
                    <br />
                    입찰 결과에 따라 판매가 진행되며, 가격 변동 가능성이 있습니다.
                  </p>
                </button>
              </div>
              <div className="mt-8">
                <Button variant="secondary" onClick={handleBack}>이전</Button>
              </div>
            </>
          )}

          {step === 'analyzing' && (
            <>
              {/* 794-4015: 시세분석중 — 기준 가격 설정 / 홍길동님의 차량 시세를 분석 중입니다 ... (794:4100/4101/4102 SSOT) */}
              <div className="flex flex-col items-center justify-center min-h-[380px] w-full max-w-[381px] mx-auto text-center" data-node-id="794:4015">
                <div className="relative mb-8">
                  <Loader2 className="h-[75px] w-[75px] text-[var(--color-primary)] animate-spin" aria-hidden />
                </div>
                <h2 className="text-[32px] font-extrabold leading-[61px] text-[var(--color-primary)] mb-3" data-node-id="794:4101">
                  기준 가격 설정
                </h2>
                <p className="text-[20px] leading-[48px] text-black" data-node-id="794:4102">
                  홍길동님의 차량 시세를 분석 중입니다 ...
                </p>
              </div>
              <div className="flex gap-4 mt-8">
                <Button variant="secondary" onClick={handleBack}>이전</Button>
              </div>
              {isRunDev() && (
                <DevSkipButton label="DEV:SKIP" subLabel={saleType === 'general' ? '가격 설정으로' : '경매 시작가로'} onClick={handleDevSkip} />
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};
