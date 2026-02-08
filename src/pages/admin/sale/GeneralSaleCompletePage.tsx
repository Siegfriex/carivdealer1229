/**
 * GeneralSaleCompletePage (Figma 1418:20576 판매전환완료 — §3.5 차량 등록·상세·경매)
 * 일반 판매 전환 완료: "판매 상태로 전환되었습니다", "구매제안이 오면 알람을 통해 알려드려요!", 확인. GNB 거래 활성.
 */

import { useNavigate } from 'react-router-dom';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { Button } from '@/shared/ui/Button';
import { Tag } from 'lucide-react';

export const GeneralSaleCompletePage = () => {
  const navigate = useNavigate();

  const handleConfirm = () => navigate('/offers');

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader userName="홍길동" variant="main" activeNav="offers" />
      <div className={LAYOUT_CLASSES.CONTAINER}>
        <main className={`py-8 ${LAYOUT_CLASSES.MAIN_DETAIL}`}>
          <div className="mx-auto max-w-4xl text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-primary/20 flex items-center justify-center">
              <Tag className="h-12 w-12 text-primary" />
            </div>
            <h1 className="text-h1 font-bold text-gray-900 mb-3">판매 상태로 전환되었습니다</h1>
            <p className="text-body text-gray-600 mb-8">구매제안이 오면 알람을 통해 알려드려요!</p>
            <Button size="lg" onClick={handleConfirm}>
              확인
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};
