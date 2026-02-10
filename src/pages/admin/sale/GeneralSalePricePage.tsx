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
import { Card } from '@/shared/ui/Card';
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
        <ProgressSidebar steps={getRegisterFlowSteps('trade')} className={LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} inline />
        <main className={`flex-1 p-6 ${LAYOUT_CLASSES.MAIN_DETAIL} flex gap-6 flex-wrap`}>
          {/* 794-4200: 좌측 차량정보 패널 320×420 rounded-[30px] shadow, 행 51px, 라벨 rgba(0,0,0,0.4) 값 0.8 */}
          <div
            className="bg-white rounded-[30px] shadow-[2.344px_3.125px_11.017px_0px_rgba(0,0,0,0.05)] w-[320px] h-[420px] overflow-hidden flex flex-col p-6 box-border shrink-0"
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

          <div className="flex-1 min-w-[280px]">
            <h1 className="text-h1 font-bold text-gray-900 mb-2">판매 가격 설정</h1>
            <p className="text-body text-gray-600 mb-8">희망 판매가를 입력하세요.</p>
            <Card className="p-6 space-y-4">
              <div>
                <label className="block text-body font-medium text-gray-700 mb-2">희망가 (만원)</label>
                <Input type="number" placeholder="예: 2850" className="w-full" />
              </div>
            </Card>
            <div className="flex gap-4 mt-8">
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
