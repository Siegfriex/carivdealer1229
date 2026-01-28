/**
 * InspectionListPage
 * 검차 신청 목록 (Figma 1202-6685)
 * GNB "검차" 클릭 또는 검차신청 랜딩 임시저장 시 이동
 */

import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';

export const InspectionListPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader
        userName="홍길동"
        variant="main"
        activeNav="inspections"
      />
      <main className="container mx-auto px-6 py-8">
        <h1 className="text-h1 font-bold text-gray-900 mb-6">검차 신청 목록</h1>
        <p className="text-body text-gray-600">목록 로딩 중...</p>
      </main>
    </div>
  );
};
