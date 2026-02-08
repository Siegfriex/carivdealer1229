/**
 * AuctionDetailPage (§3.5 경매 플로우 — 차량 상세 24679/24463/21690에서 경매 CTA 진입)
 * 경매 상세·시작가 설정 진입. 라우트: /vehicles/:id/auction
 */

import { useParams, useNavigate } from 'react-router-dom';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { MainLandingSidebar } from '@/widgets/MainLandingSidebar/ui/MainLandingSidebar';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { useVehicle } from '@/features/vehicle/register-form/model/useVehicle';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { ArrowLeft } from 'lucide-react';

export const AuctionDetailPage = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();
  const { data: vehicle, isLoading } = useVehicle(vehicleId ?? undefined);

  const handleBack = () => navigate(vehicleId ? `/vehicles/${vehicleId}` : '/vehicles');
  const handleStartPrice = () => {
    if (vehicleId) navigate(`/vehicles/${vehicleId}/auction/start-price`);
    else navigate('/vehicles');
  };

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
      <LandingHeader variant="main" activeNav="vehicles" />
      <div className={LAYOUT_CLASSES.CONTAINER}>
        <div className="flex">
          <MainLandingSidebar activeKey="all" />
          <main className={`flex-1 p-6 ${LAYOUT_CLASSES.MAIN_DETAIL}`}>
          <Button variant="secondary" size="sm" onClick={handleBack} className="mb-6 flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" />
            차량 상세
          </Button>
          <h1 className="text-h1 font-bold text-gray-900 mb-2">경매 상세</h1>
          <p className="text-body text-gray-600 mb-8">
            {vehicle?.modelName ?? '차량'} — 경매 설정을 진행하세요.
          </p>
          <Card className="p-6 mb-8">
            <p className="text-body text-gray-700 mb-4">시작가와 경매 기간을 설정한 후 경매를 시작할 수 있습니다.</p>
          </Card>
          <Button onClick={handleStartPrice}>시작가 설정하기</Button>
        </main>
        </div>
      </div>
    </div>
  );
};
