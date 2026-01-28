/**
 * GeneralSalePricePage (SCR-0302-N)
 * 일반 판매 - 가격 설정
 */

import { useParams, useNavigate } from 'react-router-dom';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { MainLandingSidebar } from '@/widgets/MainLandingSidebar/ui/MainLandingSidebar';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Input } from '@/shared/ui/Input';

export const GeneralSalePricePage = () => {
  const { vehicleId } = useParams<{ vehicleId: string }>();
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (vehicleId) navigate(`/vehicles/${vehicleId}/sale/complete`);
    else navigate('/offers');
  };

  const handleBack = () => {
    if (vehicleId) navigate(`/vehicles/${vehicleId}/sale/analyzing`);
    else navigate('/vehicles');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader variant="main" activeNav="vehicles" />
      <div className="flex">
        <MainLandingSidebar activeKey="all" />
        <main className="flex-1 p-6 max-w-2xl">
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
        </main>
      </div>
    </div>
  );
};
