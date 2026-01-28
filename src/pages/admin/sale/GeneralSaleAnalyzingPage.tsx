/**
 * GeneralSaleAnalyzingPage (SCR-0301-N)
 * 일반 판매 - 분석 중
 */

import { useParams, useNavigate } from 'react-router-dom';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { MainLandingSidebar } from '@/widgets/MainLandingSidebar/ui/MainLandingSidebar';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Loader2 } from 'lucide-react';

export const GeneralSaleAnalyzingPage = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();

  const handleNext = () => {
    if (vehicleId) navigate(`/vehicles/${vehicleId}/sale/price`);
    else navigate('/offers');
  };

  const handleBack = () => {
    if (vehicleId) navigate(`/vehicles/${vehicleId}`);
    else navigate('/vehicles');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader variant="main" activeNav="vehicles" />
      <div className="flex">
        <MainLandingSidebar activeKey="all" />
        <main className="flex-1 p-6 max-w-2xl">
          <h1 className="text-h1 font-bold text-gray-900 mb-2">일반 판매 분석 중</h1>
          <p className="text-body text-gray-600 mb-8">시장 가격을 분석하고 있습니다.</p>
          <Card className="p-8 flex flex-col items-center justify-center gap-4">
            <Loader2 className="h-12 w-12 text-primary animate-spin" />
            <p className="text-body text-gray-600">잠시만 기다려 주세요.</p>
          </Card>
          <div className="flex gap-4 mt-8">
            <Button variant="secondary" onClick={handleBack}>
              이전
            </Button>
            <Button onClick={handleNext}>다음 (가격 설정)</Button>
          </div>
        </main>
      </div>
    </div>
  );
};
