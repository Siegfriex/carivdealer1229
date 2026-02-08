/**
 * AuctionStartPricePage (Figma 1418:23705, 1418:23880 — §3.5 경매 사전 설정)
 * 참조 스크린샷: §3.5_1418-23705_경매_시작가설정.png, §3.5_1418-23880_경매시작가_값입력.png
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
import { Card } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';
import { DevSkipButton } from '@/shared/ui/DevSkipButton';

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
      <div className={LAYOUT_CLASSES.CONTAINER}>
        <div className="flex">
          <div className={`${LAYOUT_CLASSES.SIDEBAR} flex-shrink-0 bg-white border-r border-gray-200 ${LAYOUT_CLASSES.CONTENT_MIN_HEIGHT}`}>
            <div className="p-8">
              <h3 className="text-body font-bold text-gray-900 mb-6">현재 거래 진행상황</h3>
              <ProgressSidebar steps={getRegisterFlowSteps('trade')} inline />
            </div>
          </div>
          <main className={`flex-1 p-6 ${LAYOUT_CLASSES.MAIN_DETAIL}`}>
            <h1 className="text-h1 font-bold text-gray-900 mb-2">경매 사전 설정</h1>
            <p className="text-body text-gray-600 mb-8">경매 시작 이후에는 조건을 변경할 수 없습니다</p>

            {/* 차량정보 · 전체 피드백 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <Card className="p-6">
                <h3 className="text-h4 font-bold text-gray-900 mb-4">차량정보</h3>
                {vehicle?.thumbnailUrl && (
                  <div className="w-full h-32 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                    <img src={vehicle.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <p className="text-body text-gray-700 mb-1">{vehicle?.plateNumber ?? '12바 1234'}</p>
                <p className="text-caption text-gray-500 mb-1">제조사: {vehicle?.manufacturer ?? 'Hyundai'}</p>
                <p className="text-caption text-gray-500 mb-1">모델: {vehicle?.modelName ?? 'G70 3T 스포츠 엘리트'}</p>
                <p className="text-caption text-gray-500 mb-1">연식: {vehicle?.modelYear ?? '2018'}</p>
                <p className="text-caption text-gray-500 mb-1">주행거리: {vehicle?.mileage ? `${(parseInt(vehicle.mileage, 10) / 10000).toFixed(1)}만 km` : '14.6만 km'}</p>
                <p className="text-caption text-gray-500">연료: —</p>
              </Card>
              <Card className="p-6">
                <h3 className="text-h4 font-bold text-gray-900 mb-4">전체 피드백</h3>
                {vehicle?.thumbnailUrl && (
                  <div className="w-full h-32 bg-gray-100 rounded-lg mb-4 overflow-hidden">
                    <img src={vehicle.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex flex-wrap gap-4 mb-3">
                  <span className="flex items-center gap-1 text-caption text-gray-700"><span className="w-2 h-2 rounded-full bg-green-500" />양호 95개</span>
                  <span className="flex items-center gap-1 text-caption text-gray-700"><span className="w-2 h-2 rounded-full bg-orange-400" />경미 12개</span>
                  <span className="flex items-center gap-1 text-caption text-gray-700"><span className="w-2 h-2 rounded-full bg-red-500" />주의 3개</span>
                  <span className="flex items-center gap-1 text-caption text-gray-700"><span className="w-2 h-2 rounded-full bg-red-700" />불량 1개</span>
                </div>
                <Button variant="secondary" size="sm" className="mb-3">검차 상세내용 확인</Button>
                <p className="text-caption text-gray-600">
                  총 111개의 항목이 검사되었습니다. 전반적인 상태는 양호하며, 일부 부위에 경미한 스키레치가 확인되었습니다.
                </p>
              </Card>
            </div>

            {/* 내차 예상 시세 */}
            <p className="text-body text-gray-900 mb-2">
              내차 예상 시세는 <span className="text-h4 font-bold text-primary">910 ~ 1,010 만원이에요.</span>
            </p>

            {/* 경매 시작가 · 즉시 판매가 */}
            <div className="space-y-4 mb-8">
              <div className="flex flex-wrap items-baseline gap-2">
                <label className="text-body text-gray-700">경매 시작가는</label>
                <Input
                  type="number"
                  value={startPrice}
                  onChange={(e) => setStartPrice(e.target.value)}
                  placeholder=""
                  className="w-24 text-h4 font-bold text-primary inline-block"
                />
                <span className="text-body text-gray-700">만원으로 설정할게요.</span>
              </div>
              <div className="flex flex-wrap items-baseline gap-2">
                <label className="text-body text-gray-700">즉시 판매가는</label>
                <Input
                  type="number"
                  value={instantPrice}
                  onChange={(e) => setInstantPrice(e.target.value)}
                  placeholder=""
                  className="w-24 text-h4 font-bold text-primary inline-block"
                />
                <span className="text-body text-gray-700">만원으로 설정할게요.</span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button variant="secondary" onClick={handleBack}>이전</Button>
              <Button onClick={handleConfirm} className={hasPrices ? '' : 'opacity-90'}>
                확인
              </Button>
            </div>

            {import.meta.env.DEV && (
              <DevSkipButton label="DEV:SKIP" subLabel="기간 설정으로" onClick={handleConfirm} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};
