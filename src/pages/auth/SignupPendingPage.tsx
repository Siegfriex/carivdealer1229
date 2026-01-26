/**
 * SignupPendingPage Component
 * 회원가입 Step 6 - 승인 대기
 * 
 * 디자인: design/design_SignIn/A. 회원/회원가입_6승인대기.svg
 */

import { ProgressSidebar, type ProgressStep } from '@/widgets/ProgressSidebar/ui/ProgressSidebar';
import { Button } from '@/shared/ui/Button';
import { Clock } from 'lucide-react';

const steps: ProgressStep[] = [
  { id: 'step1', label: '이메일 입력', status: 'completed' },
  { id: 'step2', label: '비밀번호 설정', status: 'completed' },
  { id: 'step3', label: '딜러 정보 입력', status: 'completed' },
  { id: 'step4', label: '사업자 정보 입력', status: 'completed' },
  { id: 'step5', label: '약관 동의', status: 'completed' },
  { id: 'step6', label: '승인 대기', status: 'current' },
];

export const SignupPendingPage = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <ProgressSidebar steps={steps} />

      <div className="flex-1" style={{ marginLeft: 'var(--sidebar-width-vw)' }}>
        <div className="max-w-2xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-warning-light flex items-center justify-center">
              <Clock className="h-12 w-12 text-warning" />
            </div>

            <h1 className="text-h1 font-bold text-gray-900 mb-4">승인 대기 중입니다</h1>
            <p className="text-h4 text-gray-600 mb-8">
              회원가입이 완료되었습니다
            </p>

            <div className="bg-white rounded-lg shadow-md p-8 mb-8">
              <p className="text-body text-gray-700 mb-4">
                관리자의 승인이 필요합니다.
                <br />
                승인 완료 시 등록하신 이메일로 안내드립니다.
              </p>
              <p className="text-caption text-gray-500">
                승인은 영업일 기준 1-2일 소요됩니다
              </p>
            </div>

            <Button size="lg" onClick={() => (window.location.href = '/login')}>
              로그인 페이지로 이동
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
