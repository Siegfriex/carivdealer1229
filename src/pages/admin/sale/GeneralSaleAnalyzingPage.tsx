/**
 * 일반/경매 판매 시세분석. CTA_3 플로우. Figma 794-3704(판매방식선택), 794-4015(시세분석중).
 * @see docs/figmaMCP/impl_plans/794-3704_구현계획.md
 * @see docs/figmaMCP/impl_plans/794-4015_구현계획.md
 * 라우트: /vehicles/:vehicleId/sale/analyzing
 */

import { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { LOG_INGEST_URL } from '@/shared/config/logging';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { ProgressSidebar } from '@/widgets/ProgressSidebar/ui/ProgressSidebar';
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
      fetch(LOG_INGEST_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          location: 'GeneralSaleAnalyzingPage:analyzingDone',
          message: saleType === 'general' ? 'CTA_3 일반 시세→가격설정' : 'CTA_3 경매 시세→시작가설정',
          data: { to, saleType },
          timestamp: Date.now(),
          hypothesisId: 'H_CTA3_sale',
          runId: 'register-flow-check',
        }),
      }).catch(() => {});
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
    <div className="min-h-screen bg-[var(--color-background,#f8f9fa)]">
      <LandingHeader variant="main" activeNav="offers" />
      <div className={`flex ${LAYOUT_CLASSES.CONTAINER}`}>
        <ProgressSidebar steps={getRegisterFlowSteps('trade')} className={LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} inline widthClass={LAYOUT_CLASSES.GNB_SIDEBAR} />
        <main className={`flex-1 p-6 ${LAYOUT_CLASSES.MAIN_GNB_STEP}`}>
          {step === 'choice' && (
            <>
              {/* 794-3704: 판매 방식 선택 (Figma 794:3706 38px) */}
              <h1 className="text-[38px] font-extrabold leading-tight text-[rgba(0,0,0,0.8)] mb-12" style={{ fontFamily: 'var(--font-primary)' }} data-node-id="794:3706">
                판매 방식 선택
              </h1>
              <div className="flex flex-wrap justify-center gap-8 max-w-[620px] mx-auto">
                <button
                  type="button"
                  onClick={() => handleChoice('general')}
                  className="bg-white rounded-section w-[297px] min-h-[280px] p-6 flex flex-col items-center text-left hover:opacity-95 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2"
                  style={{ boxShadow: '6.019px 7.738px 21.84px 0px rgba(0,0,0,0.08)' }}
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
                  style={{ boxShadow: '6.019px 7.738px 21.84px 0px rgba(0,0,0,0.08)' }}
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
              {/* 794-4015: 시세분석중 — 기준 가격 설정 / 홍길동님의 차량 시세를 분석 중입니다 ... (794:4102 SSOT) */}
              <div className="flex flex-col items-center justify-center min-h-[320px] text-center" data-node-id="794:4015">
                <div className="relative mb-8">
                  <Loader2 className="h-[75px] w-[75px] text-[var(--color-primary)] animate-spin" aria-hidden />
                </div>
                <h2 className="text-[32px] font-bold text-[var(--color-primary)] mb-3" data-node-id="794:4101">
                  기준 가격 설정
                </h2>
                <p className="text-[20px] text-gray-900 max-w-[380px]" data-node-id="794:4102">
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
