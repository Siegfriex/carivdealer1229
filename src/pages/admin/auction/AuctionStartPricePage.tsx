/**
 * AuctionStartPricePage (SCR-0401-A)
 * 경매 - 시작가 설정
 */

import { useParams, useNavigate } from 'react-router-dom';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { MainLandingSidebar } from '@/widgets/MainLandingSidebar/ui/MainLandingSidebar';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';
import { DevSkipButton } from '@/shared/ui/DevSkipButton';

export const AuctionStartPricePage = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();

  const handleNext = () => {
    if (vehicleId) navigate(`/vehicles/${vehicleId}/auction/duration`);
    else navigate('/vehicles');
  };

  const handleBack = () => {
    if (vehicleId) navigate(`/vehicles/${vehicleId}/auction`);
    else navigate('/vehicles');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader variant="main" activeNav="vehicles" />
      <div className={LAYOUT_CLASSES.CONTAINER}>
        <div className="flex">
          <MainLandingSidebar activeKey="all" />
          <main className={`flex-1 p-6 ${LAYOUT_CLASSES.MAIN_DETAIL}`}>
          <h1 className="text-h1 font-bold text-gray-900 mb-2">경매 시작가 설정</h1>
          <p className="text-body text-gray-600 mb-8">시작가와 즉시구매가를 입력하세요.</p>
          <Card className="p-6 space-y-4">
            <div>
              <label className="block text-body font-medium text-gray-700 mb-2">시작가 (만원)</label>
              <Input type="number" placeholder="예: 2500" className="w-full" />
            </div>
            <div>
              <label className="block text-body font-medium text-gray-700 mb-2">즉시구매가 (만원, 선택)</label>
              <Input type="number" placeholder="예: 2900" className="w-full" />
            </div>
          </Card>
          <div className="flex gap-4 mt-8">
            <Button variant="secondary" onClick={handleBack}>
              이전
            </Button>
            <Button onClick={handleNext}>다음 (기간 설정)</Button>
          </div>

          {import.meta.env.DEV && (
            <DevSkipButton label="DEV:SKIP" subLabel="기간 설정으로" onClick={handleNext} />
          )}
        </main>
        </div>
      </div>
    </div>
  );
};
