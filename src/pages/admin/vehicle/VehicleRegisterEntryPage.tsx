/**
 * VehicleRegisterEntryPage Component
 * 매물등록 첫 화면 (Figma 1198-5843)
 * 
 * "빠르고 간편하게! 완벽한 비대면 차량등록"
 * 차량 번호 입력 후 다음 단계로 이동
 */

import { useState } from 'react';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

export const VehicleRegisterEntryPage = () => {
  const [plateNumber, setPlateNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleNext = () => {
    if (!plateNumber.trim()) {
      setError('차량번호를 입력해주세요');
      return;
    }

    // 차량번호 형식 검증 (예: 123가 4567)
    const plateRegex = /^\d{2,3}[가-힣]\s?\d{4}$/;
    if (!plateRegex.test(plateNumber.replace(/\s/g, ''))) {
      setError('올바른 차량번호 형식을 입력해주세요 (예: 123가 4567)');
      return;
    }

    // TODO: 중복 체크 API 호출
    // 이미 등록된 차량인지 확인
    // if (isDuplicate) {
    //   setError('이미 등록 또는 거래된 매물입니다');
    //   return;
    // }

    // 다음 단계로 이동
    window.location.href = `/vehicles/new/step1?plateNumber=${encodeURIComponent(plateNumber)}`;
  };

  const handleRegister = () => {
    window.location.href = '/vehicles/new/step1';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <LandingHeader
        userName="홍길동"
        variant="main"
        activeNav="vehicles"
        onRegisterListing={handleRegister}
      />

      <main className="container mx-auto px-6 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* 제목 */}
          <h1 className="text-h1 font-bold text-gray-900 mb-12">
            빠르고 간편하게!<br />
            완벽한 비대면 차량등록
          </h1>

          {/* 차량번호 입력 필드 */}
          <div className="mb-6">
            <div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden bg-white focus-within:border-primary transition-base">
              {/* KOR 국기 영역 */}
              <div className="flex items-center justify-center px-6 py-4 bg-primary text-white">
                <div className="flex flex-col items-center">
                  <span className="text-button font-medium mb-1">KOR</span>
                  <div className="w-8 h-6 bg-white rounded-sm flex items-center justify-center">
                    <div className="w-6 h-4 bg-gradient-to-b from-red-500 via-white to-blue-500 rounded-sm" />
                  </div>
                </div>
              </div>

              {/* 입력 필드 */}
              <div className="flex-1 flex items-center px-4">
                <input
                  type="text"
                  value={plateNumber}
                  onChange={(e) => {
                    setPlateNumber(e.target.value);
                    setError(null);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleNext();
                    }
                  }}
                  placeholder="123기 4567"
                  className="flex-1 text-h3 font-medium text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
                />
              </div>
            </div>

            {/* 오류 메시지 */}
            {error && (
              <p className="mt-2 text-caption text-error text-left">
                ※ {error}
              </p>
            )}
          </div>

          {/* 다음 버튼 */}
          <Button onClick={handleNext} size="lg" className="w-full">
            다음
          </Button>
        </div>
      </main>
    </div>
  );
};
