/**
 * InspectionRequestLandingPage
 * 검차신청 랜딩 (Figma 1202-6390)
 * 사이드바: 검색 + 단계(검차 신청 → 검차 진행 → 검차 완료)
 * 메인: 검차 신청 CTA, 임시저장 → /inspections
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { Button } from '@/shared/ui/Button';
import { Search } from 'lucide-react';

export const InspectionRequestLandingPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleStartRequest = () => {
    navigate('/inspections/request/step1');
  };

  const handleSaveDraft = () => {
    navigate('/inspections');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader userName="홍길동" variant="main" activeNav="inspections" />

      <div className="flex max-w-[1440px] mx-auto">
        {/* 좌측 사이드바: 검색 + 단계 */}
        <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
          <div className="p-4 space-y-6">
            <div>
              <h3 className="text-button font-medium text-gray-700 mb-2">검색</h3>
              <div className="relative">
                <input
                  type="text"
                  placeholder="차량번호/모델명"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-3 pr-10 py-2.5 border border-gray-200 rounded-md text-body text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
              </div>
            </div>
            <div>
              <h3 className="text-button font-medium text-gray-700 mb-2">단계</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-body font-medium text-primary">
                  <span className="w-5 h-5 rounded-full bg-primary flex items-center justify-center text-white text-caption">1</span>
                  검차 신청
                </li>
                <li className="flex items-center gap-2 text-body text-gray-400">
                  <span className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center text-caption">2</span>
                  검차 진행
                </li>
                <li className="flex items-center gap-2 text-body text-gray-400">
                  <span className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center text-caption">3</span>
                  검차 완료
                </li>
              </ul>
            </div>
          </div>
        </aside>

        <main className="flex-1 p-8">
          <h1 className="text-h1 font-bold text-gray-900 mb-4">검차 신청</h1>
          <p className="text-body text-gray-600 mb-8">
            차량 검차를 신청하시면 전문 평가사가 배정되어 검차가 진행됩니다.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" onClick={handleStartRequest}>
              검차 신청하기
            </Button>
            <Button variant="secondary" size="lg" onClick={handleSaveDraft}>
              임시저장
            </Button>
          </div>
        </main>
      </div>
    </div>
  );
};
