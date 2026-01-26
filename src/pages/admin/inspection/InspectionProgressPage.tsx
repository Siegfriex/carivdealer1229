/**
 * InspectionProgressPage Component
 * 검차 진행 중
 * 
 * 디자인: design/design_vehicle_input/vehicle_input_3/매물 등록 관리_차량 검차 진행3.svg
 */

import { Header } from '@/widgets/Header/ui/Header';
import { StepProgress, type Step } from '@/shared/ui/StepProgress';
import { Card } from '@/shared/ui/Card';
import { InspectionStatusBadge } from '@/entities/inspection/ui/InspectionStatusBadge';
import { Button } from '@/shared/ui/Button';
import { User, Calendar as CalendarIcon, MapPin } from 'lucide-react';

const steps: Step[] = [
  { id: 'step1', label: '날짜/장소 선택', status: 'completed' },
  { id: 'step2', label: '평가사 선택', status: 'completed' },
  { id: 'step3', label: '검차 진행', status: 'current' },
  { id: 'step4', label: '검차 완료', status: 'upcoming' },
];

export const InspectionProgressPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <StepProgress steps={steps} className="mb-12" />

        <div className="max-w-3xl mx-auto">
          <h1 className="text-h1 font-bold text-gray-900 mb-2">검차가 진행 중입니다</h1>
          <p className="text-body text-gray-600 mb-8">평가사가 곧 도착할 예정입니다</p>

          <div className="space-y-6">
            {/* 상태 */}
            <Card>
              <div className="flex items-center justify-between">
                <h2 className="text-h3 font-bold text-gray-900">검차 상태</h2>
                <InspectionStatusBadge status="in_progress" />
              </div>
            </Card>

            {/* 평가사 정보 */}
            <Card>
              <h2 className="text-h3 font-bold text-gray-900 mb-4">평가사 정보</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-caption text-gray-500">평가사</p>
                    <p className="text-body font-medium text-gray-900">김평가</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-caption text-gray-500">예정 일시</p>
                    <p className="text-body font-medium text-gray-900">2026-02-01 14:00</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-caption text-gray-500">장소</p>
                    <p className="text-body font-medium text-gray-900">
                      서울특별시 강남구 테헤란로 123
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {/* 안내 메시지 */}
            <div className="bg-info-light border border-info rounded-md p-6">
              <p className="text-body text-info">
                평가사가 도착하면 알림을 보내드립니다.
                <br />
                검차는 약 30-60분 소요됩니다.
              </p>
            </div>

            <div className="flex justify-end">
              <Button variant="secondary">검차 취소</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

