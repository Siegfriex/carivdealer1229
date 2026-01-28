/**
 * SignupPendingPage (회원가입 Step 6 - 승인 대기)
 * Figma 1194-6063: 회원가입 승인 동의
 */

import { useNavigate } from 'react-router-dom';
import { StepProgress } from '@/shared/ui/StepProgress';
import { Button } from '@/shared/ui/Button';
import { PageLayout } from '@/shared/ui/PageLayout';
import { ClipboardList } from 'lucide-react';

const SIGNUP_STEPS = [
  { id: '1', label: '① 본인인증', status: 'completed' as const },
  { id: '2', label: '② 사업자 정보 입력', status: 'completed' as const },
  { id: '3', label: '③ 중고차 매매업 인증', status: 'completed' as const },
  { id: '4', label: '④ 정산 정보 입력', status: 'completed' as const },
  { id: '5', label: '⑤ 약관 동의', status: 'completed' as const },
  { id: '6', label: '⑥ 승인 대기', status: 'current' as const },
];

export const SignupPendingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-white">
      <PageLayout maxContentWidth="3xl">
        <h1 className="text-h1 font-bold text-gray-900 text-center mb-8">회원가입</h1>
        <StepProgress steps={SIGNUP_STEPS} className="mb-12" />

        <div className="text-center">
          {/* 아이콘 */}
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-primary/10 flex items-center justify-center">
            <ClipboardList className="h-12 w-12 text-primary" />
          </div>

          {/* 메시지 */}
          <h2 className="text-h2 font-bold text-gray-900 mb-4">
            감사합니다. 딜러 승인 대기 중 입니다
          </h2>
          <p className="text-body text-gray-600 mb-2">
            링크를 누르고 일정을 저장하세요.
          </p>
          <p className="text-caption text-gray-500 mb-8">
            승인까지는 영업일 기준 1-2일 정도 소요됩니다.
          </p>

          {/* 버튼 */}
          <Button size="lg" onClick={() => navigate('/login')}>
            로그인 페이지로 이동
          </Button>
        </div>
      </PageLayout>
    </div>
  );
};
