/**
 * LandingPage Component
 * 로그인 후 랜딩페이지 (첫 사용자)
 * 
 * 디자인: design/landing/로그인 후 랜딩페이지_첫 사용자.svg
 */

import { Header } from '@/widgets/Header/ui/Header';
import { Button } from '@/shared/ui/Button';
import { Car, FileSearch, TrendingUp } from 'lucide-react';

export const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-6 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-h1 font-bold text-gray-900 mb-4">
            ForwardMax에 오신 것을 환영합니다
          </h1>
          <p className="text-h4 text-gray-600 mb-8">
            B2B 중고차 수출 플랫폼 1.0 프로토타입
          </p>
          <p className="text-body text-gray-500 mb-12">
            차량 등록부터 검차, 경매, 탁송, 정산까지 원스톱 서비스를 시작하세요
          </p>

          <Button size="lg" className="px-12">
            차량 등록하기
          </Button>
        </div>

        {/* 가이드 플로우 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Step 1 */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary-light flex items-center justify-center">
              <Car className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-h3 font-bold text-gray-900 mb-2">1. 차량 등록</h3>
            <p className="text-body text-gray-600">
              차량 정보를 입력하고
              <br />
              OCR로 빠르게 등록하세요
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-info-light flex items-center justify-center">
              <FileSearch className="h-10 w-10 text-info" />
            </div>
            <h3 className="text-h3 font-bold text-gray-900 mb-2">2. 검차 신청</h3>
            <p className="text-body text-gray-600">
              전문 평가사에게
              <br />
              차량 검차를 신청하세요
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-success-light flex items-center justify-center">
              <TrendingUp className="h-10 w-10 text-success" />
            </div>
            <h3 className="text-h3 font-bold text-gray-900 mb-2">3. 판매 시작</h3>
            <p className="text-body text-gray-600">
              경매 또는 일반 판매로
              <br />
              차량을 판매하세요
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 p-8 bg-white rounded-lg shadow-md text-center max-w-3xl mx-auto">
          <h2 className="text-h2 font-bold text-gray-900 mb-4">첫 차량을 등록하세요</h2>
          <p className="text-body text-gray-600 mb-6">
            간편한 OCR 기능으로 등록원부에서 차량 정보를 자동으로 추출합니다
          </p>
          <Button size="lg">지금 시작하기</Button>
        </div>
      </main>
    </div>
  );
};
