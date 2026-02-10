/**
 * AuctionStartPricePage (Figma 1123-13580 — 경매 사전 설정)
 * 좌측 1123:13581 320×420 차량정보, 우측 1123:13605 전체 피드백, 하단 1123:13633/13637/13641 카드.
 * 라우트: /vehicles/:id/auction/start-price
 */

import { useState } from 'react';
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

export const AuctionStartPricePage = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const { data: vehicle, isLoading } = useVehicle(vehicleId ?? undefined);

  const [startPrice, setStartPrice] = useState('');
  const [instantPrice, setInstantPrice] = useState('');

  const handleConfirm = () => {
    const to = vehicleId ? `/vehicles/${vehicleId}/auction/duration` : '/vehicles';
    // #region agent log
    fetch(LOG_INGEST_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'AuctionStartPricePage:handleConfirm',message:'CTA_3 경매 시작가→기간설정',data:{to},timestamp:Date.now(),hypothesisId:'H_CTA3_auction',runId:'register-flow-check'})}).catch(()=>{});
    // #endregion
    navigate(to);
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
      <div className={`flex ${LAYOUT_CLASSES.CONTAINER}`}>
        <ProgressSidebar steps={getRegisterFlowSteps('trade')} className={LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} inline widthClass={LAYOUT_CLASSES.GNB_SIDEBAR} />
        <main className={`flex-1 p-6 ${LAYOUT_CLASSES.MAIN_GNB_STEP} flex gap-6 flex-wrap`} data-node-id="1123:13580">
            {/* 1123:13581 — 좌측 차량정보 320×420 rounded-[30px] shadow, 행 51px */}
            <div
              className="bg-white rounded-[30px] shadow-[2.344px_3.125px_11.017px_0px_rgba(0,0,0,0.05)] w-[320px] h-[420px] overflow-hidden flex flex-col p-6 box-border shrink-0"
              data-node-id="1123:13581"
            >
              <div className="bg-[#eef5fe] h-[27px] w-[67px] rounded-[5px] shrink-0 mb-1" data-node-id="1123:13582" aria-hidden />
              <p className="text-[15px] text-black/50 tracking-[0.15px] font-extrabold mb-1" data-node-id="1123:13584">
                차량정보
              </p>
              <p className="text-[28px] leading-[44px] font-extrabold text-[#2048e5] mb-6" data-node-id="1123:13583">
                {vehicle?.plateNumber ?? '12바 1234'}
              </p>
              <div className="flex flex-col flex-1 min-h-0">
                {ROW_ITEMS.map(({ label, key }) => (
                  <div
                    key={label}
                    className="h-[51px] flex items-center justify-between border-b border-gray-200 shrink-0 last:border-b-0"
                    data-node-id={key === 'manufacturer' ? '1123:13585' : key === 'modelName' ? '1123:13593' : key === 'modelYear' ? '1123:13589' : key === 'mileage' ? '1123:13597' : '1123:13601'}
                  >
                    <span className="text-[16px] font-medium text-black/40">{label}</span>
                    <span className="text-[16px] text-black/80">
                      {key === 'manufacturer' ? (vehicle?.manufacturer ?? 'Hyundai') : key === 'modelName' ? (vehicle?.modelName ?? 'G70 3T 스포츠 엘리트') : key === 'modelYear' ? (vehicle?.modelYear ?? '2018') : key === 'mileage' ? (vehicle?.mileage ? `${(parseInt(vehicle.mileage, 10) / 10000).toFixed(1)}만 km` : '14.6만 km') : '-'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* 1123:13605 — 전체 피드백 블록 */}
            <div
              className="bg-white rounded-[30px] shadow-[2.344px_3.125px_11.017px_0px_rgba(0,0,0,0.05)] flex-1 min-w-[280px] max-w-[628px] min-h-[320px] p-6 box-border flex flex-col"
              data-node-id="1123:13605"
            >
              <div className="flex items-center justify-center self-start border border-black/20 rounded-[5px] px-2 py-1.5 h-[27px]" data-node-id="1123:13606">
                <p className="text-[15px] font-extrabold text-black/50 tracking-[0.15px]" data-node-id="1123:13607">
                  전체 피드백
                </p>
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-3 mt-4">
                <div className="flex items-center gap-2" data-node-id="1123:13609">
                  <span className="w-2 h-2 rounded-full bg-[#4ade80]" data-node-id="1123:13610" />
                  <div className="flex items-center gap-1.5 text-[16px]">
                    <span className="font-medium text-black/40" data-node-id="1123:13612">양호</span>
                    <span className="text-black/80" data-node-id="1123:13613">95개</span>
                  </div>
                </div>
                <div className="flex items-center gap-2" data-node-id="1123:13624">
                  <span className="w-2 h-2 rounded-full bg-[#facc15]" data-node-id="1123:13625" />
                  <div className="flex items-center gap-1.5 text-[16px]">
                    <span className="font-medium text-black/40" data-node-id="1123:13627">경미</span>
                    <span className="text-black/80" data-node-id="1123:13628">12개</span>
                  </div>
                </div>
                <div className="flex items-center gap-2" data-node-id="1123:13614">
                  <span className="w-2 h-2 rounded-full bg-[#fb923c]" data-node-id="1123:13615" />
                  <div className="flex items-center gap-1.5 text-[16px]">
                    <span className="font-medium text-black/40" data-node-id="1123:13617">주의</span>
                    <span className="text-black/80" data-node-id="1123:13618">3개</span>
                  </div>
                </div>
                <div className="flex items-center gap-2" data-node-id="1123:13619">
                  <span className="w-2 h-2 rounded-full bg-[#f87171]" data-node-id="1123:13620" />
                  <div className="flex items-center gap-1.5 text-[16px]">
                    <span className="font-medium text-black/40" data-node-id="1123:13622">불량</span>
                    <span className="text-black/80" data-node-id="1123:13623">1개</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                className="self-start mt-4 bg-[#eef5fe] text-[#2048e5] text-[16px] font-semibold rounded-[10px] px-6 py-3 hover:opacity-90"
                data-node-id="1123:13630"
              >
                <span data-node-id="1123:13631">검차 상세내용 확인</span>
              </button>
              <div className="mt-6 pt-4 border-t border-gray-200" data-node-id="1123:13632">
                <p className="text-[18px] text-black leading-[26px]">
                  <span className="font-semibold">총 111개</span>
                  <span>의 항목이 검사되었습니다.</span>
                </p>
                <p className="text-[18px] text-black leading-[26px] mt-1">
                  전반적인 상태는 양호하며, 일부 부위에 경미한 스키레치가 확인되었습니다.
                </p>
              </div>
            </div>

            {/* 1123:13633 — 내차 예상 시세 */}
            <div className="w-full max-w-[971px] bg-white rounded-[30px] shadow-[2.344px_3.125px_11.017px_0px_rgba(0,0,0,0.05)] p-6 min-h-[224px] flex flex-col justify-center" data-node-id="1123:13633">
              <p className="text-[26px] font-extrabold text-black mb-2" data-node-id="1123:13634">내차 예상 시세는</p>
              <p className="text-[48px] font-extrabold text-[#2048e5] leading-tight" data-node-id="1123:13635">910 ~ 1,010</p>
              <p className="text-[28px] font-extrabold text-[#2048e5]" data-node-id="1123:13636">만원이에요.</p>
            </div>

            {/* 1123:13637 — 경매 시작가 */}
            <div className="w-full max-w-[971px] bg-white rounded-[30px] shadow-[2.344px_3.125px_11.017px_0px_rgba(0,0,0,0.05)] p-6 min-h-[224px]" data-node-id="1123:13637">
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

            {/* 1123:13641 — 즉시 판매가 */}
            <div className="w-full max-w-[971px] bg-white rounded-[30px] shadow-[2.344px_3.125px_11.017px_0px_rgba(0,0,0,0.05)] p-6 min-h-[224px]" data-node-id="1123:13641">
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

            <div className="w-full flex gap-4">
              <Button variant="secondary" onClick={handleBack}>이전</Button>
              <Button onClick={handleConfirm} className={hasPrices ? '' : 'opacity-90'}>
                확인
              </Button>
            </div>

            {isRunDev() && (
              <DevSkipButton label="DEV:SKIP" subLabel="기간 설정으로" onClick={handleConfirm} />
            )}
        </main>
      </div>
    </div>
  );
};
