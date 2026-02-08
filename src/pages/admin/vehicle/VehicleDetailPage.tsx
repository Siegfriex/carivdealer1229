/**
 * VehicleDetailPage (Figma 1418:24679, 1418:24463, 1418:21690 — §3.5 차량 등록·상세·경매)
 * 차량 상세(정보·판매방식 선택). 24679 기본 상세, 24463 일반판매 CTA 강조, 21690 경매 CTA/보관 확인 모달. 라우트: /vehicles/:id
 */

import { useParams, useNavigate } from 'react-router-dom';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { MainLandingSidebar } from '@/widgets/MainLandingSidebar/ui/MainLandingSidebar';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { useVehicle } from '@/features/vehicle/register-form/model/useVehicle';
import { VehicleStatusBadge } from '@/entities/vehicle/ui/VehicleStatusBadge';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { VEHICLE_STATUS_LABELS } from '@/entities/vehicle/model/constants';
import { ArrowLeft, ShoppingBag, Wallet } from 'lucide-react';

export const VehicleDetailPage = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();

  const { data: vehicle, isLoading, error } = useVehicle(vehicleId ?? undefined);

  const handleBack = () => navigate('/vehicles');

  const handleAuctionSale = () => {
    if (vehicleId) navigate(`/vehicles/${vehicleId}/auction`);
    else navigate('/offers?type=auction');
  };

  const handleGeneralSale = () => {
    if (vehicleId) navigate(`/vehicles/${vehicleId}/sale/analyzing`);
    else navigate('/offers?type=general');
  };

  if (!vehicleId || vehicleId === 'new') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-body text-gray-600 mb-4">잘못된 경로입니다.</p>
          <Button onClick={handleBack}>차량 목록으로</Button>
        </div>
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

  if (error || !vehicle) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-body text-gray-600 mb-4">차량을 찾을 수 없습니다.</p>
          <Button onClick={handleBack}>차량 목록으로</Button>
        </div>
      </div>
    );
  }

  const statusLabel = VEHICLE_STATUS_LABELS[vehicle.status];

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader variant="main" activeNav="offers" />
      <div className={LAYOUT_CLASSES.CONTAINER}>
        <div className="flex">
          <MainLandingSidebar activeKey="all" />
          <main className={`flex-1 p-6 ${LAYOUT_CLASSES.MAIN_DETAIL}`}>
          <Button
            variant="secondary"
            size="sm"
            onClick={handleBack}
            className="mb-6 flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            차량 목록
          </Button>

          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {vehicle.thumbnailUrl && (
              <div className="w-full h-64 bg-gray-100">
                <img
                  src={vehicle.thumbnailUrl}
                  alt={vehicle.modelName}
                  className="w-full h-full object-cover"
                />
              </div>
            )}
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-h2 font-bold text-gray-900">{vehicle.modelName}</h1>
                <VehicleStatusBadge status={vehicle.status} size="md" />
              </div>
              <p className="text-body text-gray-600 mb-2">
                상태: {statusLabel}
              </p>
              <p className="text-body text-gray-600 mb-2">
                {vehicle.modelYear}년형 • {(parseInt(vehicle.mileage, 10) / 10000).toFixed(1)}만 km
              </p>
              {vehicle.manufacturer && (
                <p className="text-body text-gray-600 mb-2">제조사: {vehicle.manufacturer}</p>
              )}
              {vehicle.plateNumber && (
                <p className="text-body text-gray-600 mb-2">차량번호: {vehicle.plateNumber}</p>
              )}
              {vehicle.price && (
                <p className="text-h4 font-bold text-primary mt-4">희망가: {vehicle.price}</p>
              )}
            </div>
          </div>

          {/* §3.5 20498: 판매 방식 선택 — 참조 스크린샷 §3.5_1418-20498_판매방식선택.png */}
          <section className="mt-8">
            <h2 className="text-h3 font-bold text-gray-900 mb-6 text-center">판매 방식 선택</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card hover className="cursor-pointer" onClick={handleGeneralSale}>
                <div className="p-6 flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center mb-4">
                    <ShoppingBag className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-h4 font-bold text-gray-900 mb-2">일반 판매</h3>
                  <p className="text-body text-gray-600">
                    원하는 가격으로 판매를 진행합니다. 가격 제안을 받고, 조건에 맞는 경우에만 판매할 수 있습니다.
                  </p>
                </div>
              </Card>
              <Card hover className="cursor-pointer" onClick={handleAuctionSale}>
                <div className="p-6 flex flex-col items-center text-center">
                  <div className="w-14 h-14 rounded-full bg-primary-light flex items-center justify-center mb-4">
                    <Wallet className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-h4 font-bold text-gray-900 mb-2">경매</h3>
                  <p className="text-body text-gray-600">
                    정해진 기간 동안 최고가로 판매됩니다. 입찰 결과에 따라 판매가 진행되며, 가격 변동 가능성이 있습니다.
                  </p>
                </div>
              </Card>
            </div>
          </section>
        </main>
        </div>
      </div>
    </div>
  );
};
