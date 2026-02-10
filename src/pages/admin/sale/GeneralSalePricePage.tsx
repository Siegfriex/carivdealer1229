/**
 * GeneralSalePricePage (Figma 794-4200, 794-4371 — 경매 시작가설정 보정 일반)
 * 일반 판매 가격 설정. 좌측 320×420 차량정보 패널(794:4201 SSOT), 우측 희망가 폼.
 */

import { useParams, useNavigate } from 'react-router-dom';
import { LOG_INGEST_URL } from '@/shared/config/logging';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { ProgressSidebar } from '@/widgets/ProgressSidebar/ui/ProgressSidebar';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { getRegisterFlowSteps } from '@/shared/config/registerFlowSteps';
import { useVehicle } from '@/features/vehicle/register-form/model/useVehicle';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';
import { DevSkipButton } from '@/shared/ui/DevSkipButton';
import { isRunDev } from '@/shared/config/runDev';

const ROW_ITEMS = [
  { label: '제조사', key: 'manufacturer' as const },
  { label: '모델', key: 'modelName' as const },
  { label: '연식', key: 'modelYear' as const },
  { label: '주행거리', key: 'mileage' as const },
  { label: '연료', key: 'fuel' as const },
] as const;

export const GeneralSalePricePage = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const { data: vehicle, isLoading } = useVehicle(vehicleId ?? undefined);

  const handleSubmit = () => {
    const to = vehicleId ? `/vehicles/${vehicleId}/sale/complete` : '/offers';
    // #region agent log
    fetch(LOG_INGEST_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'GeneralSalePricePage:handleSubmit',message:'CTA_3 일반 가격→판매완료',data:{to},timestamp:Date.now(),hypothesisId:'H_CTA3_sale',runId:'register-flow-check'})}).catch(()=>{});
    // #endregion
    navigate(to);
  };

  const handleBack = () => {
    if (vehicleId) navigate(`/vehicles/${vehicleId}/sale/analyzing`);
    else navigate('/vehicles');
  };

  const plateNumber = vehicle?.plateNumber ?? '12바 1234';
  const manufacturer = vehicle?.manufacturer ?? 'Hyundai';
  const modelName = vehicle?.modelName ?? 'G70 3T 스포츠 엘리트';
  const modelYear = vehicle?.modelYear ?? '2018';
  const mileage = vehicle?.mileage ? `${(parseInt(vehicle.mileage, 10) / 10000).toFixed(1)}만 km` : '14.6만 km';
  const fuel = '-';

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
      <div className={`flex ${LAYOUT_CLASSES.CONTAINER}`}>
        <ProgressSidebar steps={getRegisterFlowSteps('trade')} className={LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} inline widthClass={LAYOUT_CLASSES.GNB_SIDEBAR} />
        <main className={`flex-1 p-6 ${LAYOUT_CLASSES.MAIN_GNB_STEP} flex gap-6 flex-wrap`}>
          {/* 794-4200: 좌측 차량정보 패널 320×420 rounded-[30px] shadow, 행 51px, 라벨 rgba(0,0,0,0.4) 값 0.8 */}
          <div
            className="bg-white rounded-card shadow-figma-card w-[320px] h-[420px] overflow-hidden flex flex-col p-6 box-border shrink-0"
            data-node-id="794:4201"
          >
            <p className="text-[15px] text-black/50 tracking-[0.15px] font-extrabold mb-1" data-node-id="794:4204">
              차량정보
            </p>
            <p className="text-[28px] leading-[44px] font-extrabold text-primary mb-6" data-node-id="794:4203">
              {plateNumber}
            </p>
            <div className="flex flex-col flex-1 min-h-0">
              {ROW_ITEMS.map(({ label, key }) => (
                <div
                  key={label}
                  className="h-[51px] flex items-center justify-between border-b border-gray-200 shrink-0 last:border-b-0"
                  data-node-id={key === 'manufacturer' ? '794:4205' : key === 'modelName' ? '794:4213' : key === 'modelYear' ? '794:4209' : key === 'mileage' ? '794:4217' : '794:4221'}
                >
                  <span className="text-[16px] font-medium" style={{ color: 'rgba(0,0,0,0.4)' }}>
                    {label}
                  </span>
                  <span className="text-[16px] text-black/80">
                    {key === 'manufacturer' ? manufacturer : key === 'modelName' ? modelName : key === 'modelYear' ? modelYear : key === 'mileage' ? mileage : fuel}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 794-4200/4371 SSOT: 우측 628×420 영역 794:4225 전체 피드백 + 내차 예상 시세(794:4253) + 판매 가격(794:4257) */}
          <div className="flex-1 min-w-[280px] max-w-[628px] flex flex-col gap-6">
            {/* 794:4225 — 전체 피드백 블록: 라벨, 양호/경미/주의/불량, 검차 상세내용 확인, 본문 */}
            <div
              className="bg-white rounded-[30px] shadow-[2.344px_3.125px_11.017px_0px_rgba(0,0,0,0.05)] w-full max-w-[628px] min-h-[320px] p-6 box-border flex flex-col"
              data-node-id="794:4225"
            >
              <div className="flex items-center justify-center self-start border border-black/20 rounded-[5px] px-2 py-1.5 h-[27px]" data-node-id="794:4226">
                <p className="text-[15px] font-extrabold text-black/50 tracking-[0.15px]" data-node-id="794:4227">
                  전체 피드백
                </p>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4">
                <div className="flex items-center gap-2" data-node-id="794:4229">
                  <span className="w-2 h-2 rounded-full bg-[#4ade80]" data-node-id="794:4230" />
                  <div className="flex items-center gap-1.5 text-[16px]">
                    <span className="font-medium text-black/40" data-node-id="794:4232">양호</span>
                    <span className="text-black/80" data-node-id="794:4233">95개</span>
                  </div>
                </div>
                <div className="flex items-center gap-2" data-node-id="794:4244">
                  <span className="w-2 h-2 rounded-full bg-[#facc15]" data-node-id="794:4245" />
                  <div className="flex items-center gap-1.5 text-[16px]">
                    <span className="font-medium text-black/40" data-node-id="794:4247">경미</span>
                    <span className="text-black/80" data-node-id="794:4248">12개</span>
                  </div>
                </div>
                <div className="flex items-center gap-2" data-node-id="794:4234">
                  <span className="w-2 h-2 rounded-full bg-[#fb923c]" data-node-id="794:4235" />
                  <div className="flex items-center gap-1.5 text-[16px]">
                    <span className="font-medium text-black/40" data-node-id="794:4237">주의</span>
                    <span className="text-black/80" data-node-id="794:4238">3개</span>
                  </div>
                </div>
                <div className="flex items-center gap-2" data-node-id="794:4239">
                  <span className="w-2 h-2 rounded-full bg-[#f87171]" data-node-id="794:4240" />
                  <div className="flex items-center gap-1.5 text-[16px]">
                    <span className="font-medium text-black/40" data-node-id="794:4242">불량</span>
                    <span className="text-black/80" data-node-id="794:4243">1개</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="self-start mt-4 bg-[#eef5fe] text-[#2048e5] text-[16px] font-semibold rounded-[10px] px-6 py-3 hover:opacity-90"
                data-node-id="794:4250"
              >
                <span data-node-id="794:4251">검차 상세내용 확인</span>
              </button>
              <div className="mt-6 pt-4 border-t border-gray-200" data-node-id="794:4252">
                <p className="text-[18px] text-black leading-[26px]">
                  <span className="font-semibold">총 111개</span>
                  <span>의 항목이 검사되었습니다.</span>
                </p>
                <p className="text-[18px] text-black leading-[26px] mt-1">
                  전반적인 상태는 양호하며, 일부 부위에 경미한 스키레치가 확인되었습니다.
                </p>
              </div>
            </div>

            {/* 794:4253 — 내차 예상 시세는 26px, 910~1,010 48px primary, 만원이에요 28px */}
            <div
              className="bg-white rounded-[30px] shadow-[2.344px_3.125px_11.017px_0px_rgba(0,0,0,0.05)] p-6 min-h-[224px] flex flex-col justify-center"
              data-node-id="794:4253"
            >
              <p className="text-[26px] font-extrabold text-black mb-2" data-node-id="794:4254">
                내차 예상 시세는
              </p>
              <p className="text-[48px] font-extrabold text-[#2048e5] leading-tight" data-node-id="794:4255">
                910 ~ 1,010
              </p>
              <p className="text-[28px] font-extrabold text-[#2048e5]" data-node-id="794:4256">
                만원이에요.
              </p>
            </div>
            {/* 794:4257 — 판매 가격은 / [입력] 만원으로 설정할게요. */}
            <div
              className="bg-white rounded-[30px] shadow-[2.344px_3.125px_11.017px_0px_rgba(0,0,0,0.05)] p-6 min-h-[224px]"
              data-node-id="794:4257"
            >
              <p className="text-[26px] font-extrabold text-black mb-4" data-node-id="794:4258">
                판매 가격은
              </p>
              <div className="flex flex-wrap items-baseline gap-2">
                <Input
                  type="number"
                  placeholder=""
                  className="w-24 text-[28px] font-extrabold text-black"
                  aria-label="희망가 만원"
                />
                <span className="text-[28px] font-extrabold text-black" data-node-id="794:4259">
                  만원으로 설정할게요.
                </span>
              </div>
            </div>
            <div className="flex gap-4">
              <Button variant="secondary" onClick={handleBack}>
                이전
              </Button>
              <Button onClick={handleSubmit}>등록 완료</Button>
            </div>

            {isRunDev() && (
              <DevSkipButton label="DEV:SKIP" subLabel="등록 완료로" onClick={handleSubmit} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
};
