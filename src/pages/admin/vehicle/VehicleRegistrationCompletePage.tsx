/**
 * VehicleRegistrationCompletePage Component
 * 차량 등록 완료 (Figma 915-998)
 * 그리드 레이아웃, "홈으로 돌아가기" + "검차 진행하기" 버튼
 */

import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';
import { CheckCircle2, TrendingUp, Gavel, Home, SearchCheck } from 'lucide-react';

export const VehicleRegistrationCompletePage = () => {
  const handleGoHome = () => {
    window.location.href = '/vehicles';
  };

  const handleInspection = () => {
    window.location.href = '/inspections/request';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader userName="홍길동" variant="main" activeNav="vehicles" />

      <main className="container mx-auto px-6 py-8 max-w-[1440px]">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-8">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-success-light flex items-center justify-center">
              <CheckCircle2 className="h-12 w-12 text-success" />
            </div>
            <h1 className="text-h1 font-bold text-gray-900 mb-4">
              차량 등록이 완료되었습니다!
            </h1>
            <p className="text-body text-gray-600">검차를 진행하시면 판매 준비가 완료됩니다</p>
          </div>

          {/* 등록된 차량 정보 - 그리드 */}
          <Card className="mb-8" padding="lg">
            <h2 className="text-h3 font-bold text-gray-900 mb-4">등록된 차량 정보</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-caption text-gray-500">차량번호</p>
                <p className="text-body font-medium text-gray-900">33바 3333</p>
              </div>
              <div>
                <p className="text-caption text-gray-500">모델명</p>
                <p className="text-body font-medium text-gray-900">Carnival KA4</p>
              </div>
              <div>
                <p className="text-caption text-gray-500">연식</p>
                <p className="text-body font-medium text-gray-900">2022년</p>
              </div>
              <div>
                <p className="text-caption text-gray-500">주행거리</p>
                <p className="text-body font-medium text-gray-900">50,000km</p>
              </div>
              <div>
                <p className="text-caption text-gray-500">검차 점수</p>
                <p className="text-body font-medium text-primary font-bold">A</p>
              </div>
            </div>
          </Card>

          {/* 다음 액션 - 그리드 */}
          <div className="space-y-4 mb-8">
            <h2 className="text-h3 font-bold text-gray-900 mb-4">다음 단계를 선택하세요</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card hover className="cursor-pointer">
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

              <Card hover className="cursor-pointer">
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
          </div>

          {/* 하단: 홈으로 돌아가기 + 검차 진행하기 (그리드) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button variant="secondary" size="lg" fullWidth onClick={handleGoHome}>
              <Home className="h-5 w-5 mr-2" />
              홈으로 돌아가기
            </Button>
            <Button size="lg" fullWidth onClick={handleInspection}>
              <SearchCheck className="h-5 w-5 mr-2" />
              검차 진행하기
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};
