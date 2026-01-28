/**
 * InspectionCompletePage Component
 * 검차 완료
 * 
 * 디자인: design/design_vehicle_input/vehicle_input_45/매물 등록 관리_차량 검차 완료4.svg
 */

import { useNavigate } from 'react-router-dom';
import { Header } from '@/widgets/Header/ui/Header';
import { StepProgress, type Step } from '@/shared/ui/StepProgress';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { CheckCircle2, Star } from 'lucide-react';

const steps: Step[] = [
  { id: 'step1', label: '날짜/장소 선택', status: 'completed' },
  { id: 'step2', label: '평가사 선택', status: 'completed' },
  { id: 'step3', label: '검차 진행', status: 'completed' },
  { id: 'step4', label: '검차 완료', status: 'completed' },
];

export const InspectionCompletePage = () => {
  const navigate = useNavigate();

  const handleAuctionSale = () => {
    navigate('/offers?type=auction');
  };

  const handleGeneralSale = () => {
    navigate('/offers?type=general');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container py-8">
        <StepProgress steps={steps} className="mb-12" />

        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-success-light flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-success" />
            </div>
            <h1 className="text-h1 font-bold text-gray-900 mb-4">검차가 완료되었습니다!</h1>
            <p className="text-body text-gray-600">
              평가사의 상세한 검차 리포트를 확인하세요
            </p>
          </div>

          {/* 검차 결과 요약 */}
          <Card className="mb-6">
            <h2 className="text-h2 font-bold text-gray-900 mb-6">검차 결과</h2>

            {/* 평가사 정보 */}
            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
              <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-h3 font-bold text-gray-600">김</span>
              </div>
              <div className="flex-1">
                <h3 className="text-h4 font-bold text-gray-900">김평가</h3>
                <div className="flex items-center gap-1 mt-1">
                  <Star className="h-4 w-4 fill-warning text-warning" />
                  <span className="text-body">4.8</span>
                </div>
              </div>
            </div>

            {/* 종합 점수 */}
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-caption text-gray-500 mb-1">종합 점수</p>
                <p className="text-h1 font-bold text-primary">A</p>
              </div>
              <div>
                <p className="text-caption text-gray-500 mb-1">시장 평가</p>
                <p className="text-h4 font-medium text-gray-900">매우 우수</p>
              </div>
            </div>

            {/* 항목별 평가 */}
            <div className="grid grid-cols-4 gap-4">
              <div>
                <p className="text-caption text-gray-500 mb-1">외장</p>
                <p className="text-body font-medium text-gray-900">Good</p>
              </div>
              <div>
                <p className="text-caption text-gray-500 mb-1">내장</p>
                <p className="text-body font-medium text-gray-900">Excellent</p>
              </div>
              <div>
                <p className="text-caption text-gray-500 mb-1">기계</p>
                <p className="text-body font-medium text-gray-900">Good</p>
              </div>
              <div>
                <p className="text-caption text-gray-500 mb-1">골격</p>
                <p className="text-body font-medium text-gray-900">Good</p>
              </div>
            </div>
          </Card>

          {/* 다음 단계 */}
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-h3 font-bold text-gray-900 mb-6 text-center">
              판매 방식을 선택하세요
            </h2>
            <div className="grid grid-cols-2 gap-6">
              <Button size="lg" fullWidth onClick={handleAuctionSale}>
                경매로 판매하기
              </Button>
              <Button size="lg" variant="secondary" fullWidth onClick={handleGeneralSale}>
                일반 판매하기
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
