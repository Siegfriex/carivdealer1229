/**
 * GeneralSaleCompletePage (SCR-0303-N)
 * 일반 판매 - 완료
 */

import { useParams, useNavigate } from 'react-router-dom';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { MainLandingSidebar } from '@/widgets/MainLandingSidebar/ui/MainLandingSidebar';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { CheckCircle2 } from 'lucide-react';

export const GeneralSaleCompletePage = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();

  const handleOffers = () => navigate('/offers');
  const handleVehicle = () => {
    if (vehicleId) navigate(`/vehicles/${vehicleId}`);
    else navigate('/vehicles');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader variant="main" activeNav="vehicles" />
      <div className={LAYOUT_CLASSES.CONTAINER}>
        <div className="flex">
          <MainLandingSidebar activeKey="all" />
          <main className={`flex-1 p-6 ${LAYOUT_CLASSES.MAIN_DETAIL}`}>
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-success-light flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-success" />
            </div>
            <h1 className="text-h1 font-bold text-gray-900 mb-4">일반 판매 등록이 완료되었습니다</h1>
            <p className="text-body text-gray-600">바이어의 제안을 확인하세요.</p>
          </div>
          <Card className="p-6 mb-8">
            <p className="text-body text-gray-700">제안 목록에서 입찰 현황을 확인할 수 있습니다.</p>
          </Card>
          <div className="flex gap-4">
            <Button variant="secondary" onClick={handleVehicle}>
              차량 상세
            </Button>
            <Button onClick={handleOffers}>제안 목록 보기</Button>
          </div>
        </main>
        </div>
      </div>
    </div>
  );
};
