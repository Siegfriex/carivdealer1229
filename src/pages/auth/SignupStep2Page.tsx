/**
 * SignupStep2Page Component
 * 회원가입 Step 2 - 비밀번호 설정
 * 
 * 디자인: design/design_SignIn/A. 회원/회원가입_2.svg
 */

import { useState } from 'react';
import { ProgressSidebar, type ProgressStep } from '@/widgets/ProgressSidebar/ui/ProgressSidebar';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { Eye, EyeOff } from 'lucide-react';

const steps: ProgressStep[] = [
  { id: 'step1', label: '이메일 입력', status: 'completed' },
  { id: 'step2', label: '비밀번호 설정', status: 'current' },
  { id: 'step3', label: '딜러 정보 입력', status: 'upcoming' },
  { id: 'step4', label: '사업자 정보 입력', status: 'upcoming' },
  { id: 'step5', label: '약관 동의', status: 'upcoming' },
  { id: 'step6', label: '승인 대기', status: 'upcoming' },
];

export const SignupStep2Page = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');

  const handleNext = () => {
    if (!password || !confirmPassword) {
      setError('모든 필드를 입력해주세요');
      return;
    }
    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다');
      return;
    }
    // 다음 단계로 이동
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ProgressSidebar steps={steps} />

      <div className="flex-1" style={{ marginLeft: 'var(--sidebar-width-vw)' }}>
        <div className="max-w-2xl mx-auto px-6 py-16">
          <h1 className="text-h1 font-bold text-gray-900 mb-2">비밀번호를 설정해주세요</h1>
          <p className="text-body text-gray-600 mb-12">
            안전한 비밀번호를 설정해주세요 (영문, 숫자, 특수문자 포함 8자 이상)
          </p>

          <div className="space-y-6">
            <div className="relative">
              <Input
                label="비밀번호"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                fullWidth
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-11 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

            <div className="relative">
              <Input
                label="비밀번호 확인"
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                error={error}
                fullWidth
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-11 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>

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
