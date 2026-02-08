/**
 * VehicleRegistrationCompletePage Component
 * 차량 등록 완료 (Figma 1418:20576 차량등록완료_확인 — §3.5 차량 등록·상세·경매)
 * 라우트: /vehicles/:id/complete. 아이콘 + 메시지 + 홈으로 돌아가기. GNB 차량목록 활성.
 */

import { useNavigate } from 'react-router-dom';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { Button } from '@/shared/ui/Button';
import { ClipboardList, Home } from 'lucide-react';

export const VehicleRegistrationCompletePage = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/vehicles');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader userName="홍길동" variant="main" activeNav="vehicles" />

      <div className={LAYOUT_CLASSES.CONTAINER}>
        <main className={`py-8 ${LAYOUT_CLASSES.MAIN_DETAIL}`}>
          <div className="mx-auto max-w-4xl text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
              <ClipboardList className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-h1 font-bold text-gray-900 mb-6">
              차량 등록이 완료되었습니다.
            </h1>
            <Button size="lg" onClick={handleGoHome}>
              <Home className="h-5 w-5 mr-2" />
              홈으로 돌아가기
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};
