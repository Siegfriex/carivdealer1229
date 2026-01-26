/**
 * SignupStep1Page Component
 * 회원가입 Step 1 - 이메일 입력
 * 
 * 디자인: design/design_SignIn/A. 회원/회원가입_1.svg
 */

import { useState } from 'react';
import { ProgressSidebar, type ProgressStep } from '@/widgets/ProgressSidebar/ui/ProgressSidebar';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';

const steps: ProgressStep[] = [
  { id: 'step1', label: '이메일 입력', status: 'current' },
  { id: 'step2', label: '비밀번호 설정', status: 'upcoming' },
  { id: 'step3', label: '딜러 정보 입력', status: 'upcoming' },
  { id: 'step4', label: '사업자 정보 입력', status: 'upcoming' },
  { id: 'step5', label: '약관 동의', status: 'upcoming' },
  { id: 'step6', label: '승인 대기', status: 'upcoming' },
];

export const SignupStep1Page = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!email) {
      setError('이메일을 입력해주세요');
      return;
    }
    // 다음 단계로 이동
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ProgressSidebar steps={steps} />

      <div className="flex-1" style={{ marginLeft: 'var(--sidebar-width-vw)' }}>
        <div className="max-w-2xl mx-auto px-6 py-16">
          <h1 className="text-h1 font-bold text-gray-900 mb-2">이메일을 입력해주세요</h1>
          <p className="text-body text-gray-600 mb-12">
            회원가입에 사용할 이메일 주소를 입력해주세요
          </p>

          <div className="space-y-6">
            <Input
              label="이메일"
              type="email"
              placeholder="dealer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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
