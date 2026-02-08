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
import { ArrowLeft, Gavel, TrendingUp } from 'lucide-react';

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
      <LandingHeader variant="main" activeNav="vehicles" />
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

          {/* SCR-0300: 판매 방식 선택 */}
          <section className="mt-8">
            <h2 className="text-h3 font-bold text-gray-900 mb-4">판매 방식을 선택하세요</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card hover className="cursor-pointer" onClick={handleAuctionSale}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center">
                    <Gavel className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-h4 font-bold text-gray-900">경매로 판매하기</h3>
                    <p className="text-body text-gray-600">경쟁 입찰로 최고가에 판매</p>
                  </div>
                </div>
              </Card>
              <Card hover className="cursor-pointer" onClick={handleGeneralSale}>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-success-light flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-success" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-h4 font-bold text-gray-900">일반 판매하기</h3>
                    <p className="text-body text-gray-600">고정가로 바이어에게 제안받기</p>
                  </div>
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
