/**
 * InspectionRequestStep1Page Component
 * 검차 신청 Step 1 - 날짜 및 장소 선택
 * 
 * 디자인: design/design_vehicle_input/vehicle_input_2/매물 등록 관리_차량 검차 신청1.svg
 */

import { useState } from 'react';
import { Header } from '@/widgets/Header/ui/Header';
import { StepProgress, type Step } from '@/shared/ui/StepProgress';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { MapPin } from 'lucide-react';

const steps: Step[] = [
  { id: 'step1', label: '날짜/장소 선택', status: 'current' },
  { id: 'step2', label: '평가사 선택', status: 'upcoming' },
  { id: 'step3', label: '검차 진행', status: 'upcoming' },
  { id: 'step4', label: '검차 완료', status: 'upcoming' },
];

export const InspectionRequestStep1Page = () => {
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('');
  const [address, setAddress] = useState('');

  const handleNext = () => {
    if (!preferredDate || !preferredTime || !address) {
      alert('모든 필드를 입력해주세요');
      return;
    }
    // 평가사 선택 단계로 이동
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="container mx-auto px-6 py-8">
        <StepProgress steps={steps} className="mb-12" />

        <div className="max-w-3xl mx-auto">
          <h1 className="text-h1 font-bold text-gray-900 mb-2">검차 일정을 선택해주세요</h1>
          <p className="text-body text-gray-600 mb-8">희망하시는 검차 날짜, 시간, 장소를 입력해주세요</p>

          <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <Input
                label="희망 날짜"
                type="date"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
                fullWidth
                required
              />

              <Input
                label="희망 시간"
                type="time"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                fullWidth
                required
              />
            </div>

            <Input
              label="검차 장소"
              type="text"
              placeholder="서울특별시 강남구 테헤란로 123"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              fullWidth
              required
            />

            <Button variant="ghost" className="w-full">
              <MapPin className="h-5 w-5 mr-2" />
              지도에서 장소 선택 (Google Maps)
            </Button>

            <div className="flex justify-between pt-6">
              <Button variant="secondary" onClick={() => window.history.back()}>
                이전
              </Button>
              <Button onClick={handleNext}>다음 (평가사 선택)</Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
