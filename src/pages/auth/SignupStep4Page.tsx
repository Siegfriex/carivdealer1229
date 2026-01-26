/**
 * SignupStep4Page Component
 * 회원가입 Step 4 - 사업자 정보 입력
 * 
 * 디자인: design/design_SignIn/A. 회원/회원가입_4.svg
 */

import { useState } from 'react';
import { ProgressSidebar, type ProgressStep } from '@/widgets/ProgressSidebar/ui/ProgressSidebar';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';

const steps: ProgressStep[] = [
  { id: 'step1', label: '이메일 입력', status: 'completed' },
  { id: 'step2', label: '비밀번호 설정', status: 'completed' },
  { id: 'step3', label: '딜러 정보 입력', status: 'completed' },
  { id: 'step4', label: '사업자 정보 입력', status: 'current' },
  { id: 'step5', label: '약관 동의', status: 'upcoming' },
  { id: 'step6', label: '승인 대기', status: 'upcoming' },
];

export const SignupStep4Page = () => {
  const [companyName, setCompanyName] = useState('');
  const [businessRegNo, setBusinessRegNo] = useState('');
  const [representativeName, setRepresentativeName] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!companyName || !businessRegNo || !representativeName) {
      setError('모든 필드를 입력해주세요');
      return;
    }
    // 다음 단계로 이동
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ProgressSidebar steps={steps} />

      <div className="flex-1" style={{ marginLeft: 'var(--sidebar-width-vw)' }}>
        <div className="max-w-2xl mx-auto px-6 py-16">
          <h1 className="text-h1 font-bold text-gray-900 mb-2">사업자 정보를 입력해주세요</h1>
          <p className="text-body text-gray-600 mb-12">사업자 등록 정보를 입력해주세요</p>

          <div className="space-y-6">
            <Input
              label="회사명"
              type="text"
              placeholder="예: 주식회사 글로벌모터스"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              fullWidth
              required
            />

            <Input
              label="사업자등록번호"
              type="text"
              placeholder="123-45-67890"
              value={businessRegNo}
              onChange={(e) => setBusinessRegNo(e.target.value)}
              fullWidth
              required
            />

            <Input
              label="대표자명"
              type="text"
              placeholder="홍길동"
              value={representativeName}
              onChange={(e) => setRepresentativeName(e.target.value)}
              error={error}
              fullWidth
              required
            />

            <div className="flex justify-between pt-6">
              <Button variant="secondary" onClick={() => window.history.back()}>
                이전
              </Button>
              <Button onClick={handleNext}>다음</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
