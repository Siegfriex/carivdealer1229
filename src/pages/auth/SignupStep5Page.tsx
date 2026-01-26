/**
 * SignupStep5Page Component
 * 회원가입 Step 5 - 약관 동의
 * 
 * 디자인: design/design_SignIn/A. 회원/회원가입_5_약관동의.svg
 */

import { useState } from 'react';
import { ProgressSidebar, type ProgressStep } from '@/widgets/ProgressSidebar/ui/ProgressSidebar';
import { Checkbox } from '@/shared/ui/Checkbox';
import { Button } from '@/shared/ui/Button';

const steps: ProgressStep[] = [
  { id: 'step1', label: '이메일 입력', status: 'completed' },
  { id: 'step2', label: '비밀번호 설정', status: 'completed' },
  { id: 'step3', label: '딜러 정보 입력', status: 'completed' },
  { id: 'step4', label: '사업자 정보 입력', status: 'completed' },
  { id: 'step5', label: '약관 동의', status: 'current' },
  { id: 'step6', label: '승인 대기', status: 'upcoming' },
];

export const SignupStep5Page = () => {
  const [agreeAll, setAgreeAll] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [agreePrivacy, setAgreePrivacy] = useState(false);
  const [agreeMarketing, setAgreeMarketing] = useState(false);

  const handleAgreeAll = (checked: boolean) => {
    setAgreeAll(checked);
    setAgreeTerms(checked);
    setAgreePrivacy(checked);
    setAgreeMarketing(checked);
  };

  const handleNext = () => {
    if (!agreeTerms || !agreePrivacy) {
      alert('필수 약관에 동의해주세요');
      return;
    }
    // 회원가입 완료 → 승인 대기 페이지
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <ProgressSidebar steps={steps} />

      <div className="flex-1" style={{ marginLeft: 'var(--sidebar-width-vw)' }}>
        <div className="max-w-2xl mx-auto px-6 py-16">
          <h1 className="text-h1 font-bold text-gray-900 mb-2">약관에 동의해주세요</h1>
          <p className="text-body text-gray-600 mb-12">서비스 이용을 위해 약관에 동의해주세요</p>

          <div className="space-y-6">
            {/* 전체 동의 */}
            <div className="p-4 bg-gray-100 rounded-md">
              <Checkbox
                id="agree-all"
                label="전체 동의"
                checked={agreeAll}
                onChange={(e) => handleAgreeAll(e.target.checked)}
              />
            </div>

            {/* 개별 약관 */}
            <div className="space-y-4">
              <Checkbox
                id="agree-terms"
                label="[필수] 서비스 이용약관 동의"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  setAgreeAll(e.target.checked && agreePrivacy && agreeMarketing);
                }}
                required
              />

              <Checkbox
                id="agree-privacy"
                label="[필수] 개인정보 처리방침 동의"
                checked={agreePrivacy}
                onChange={(e) => {
                  setAgreePrivacy(e.target.checked);
                  setAgreeAll(e.target.checked && agreeTerms && agreeMarketing);
                }}
                required
              />

              <Checkbox
                id="agree-marketing"
                label="[선택] 마케팅 정보 수신 동의"
                checked={agreeMarketing}
                onChange={(e) => {
                  setAgreeMarketing(e.target.checked);
                  setAgreeAll(e.target.checked && agreeTerms && agreePrivacy);
                }}
              />
            </div>

            <div className="flex justify-between pt-6">
              <Button variant="secondary" onClick={() => window.history.back()}>
                이전
              </Button>
              <Button onClick={handleNext} disabled={!agreeTerms || !agreePrivacy}>
                회원가입 완료
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
