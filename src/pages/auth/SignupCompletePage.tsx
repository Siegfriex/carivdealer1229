/**
 * SignupCompletePage (회원가입 승인 완료)
 * Figma 1194-6054: 회원가입 승인 완료
 */

import { StepProgress } from '@/shared/ui/StepProgress';
import { Button } from '@/shared/ui/Button';
import { CheckCircle2 } from 'lucide-react';

const SIGNUP_STEPS = [
  { id: '1', label: '① 본인인증', status: 'completed' as const },
  { id: '2', label: '② 사업자 정보 입력', status: 'completed' as const },
  { id: '3', label: '③ 중고차 매매업 인증', status: 'completed' as const },
  { id: '4', label: '④ 정산 정보 입력', status: 'completed' as const },
  { id: '5', label: '⑤ 약관 동의', status: 'completed' as const },
  { id: '6', label: '⑥ 승인 대기', status: 'completed' as const },
];

export const SignupCompletePage = () => {
  // TODO: 실제 사용자 정보로 대체
  const userName = '홍길동';
  const userId = 'user123';

  return (
    <div className="min-h-screen bg-white">
      <div className="container max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-h1 font-bold text-gray-900 text-center mb-8">회원가입</h1>
        <StepProgress steps={SIGNUP_STEPS} className="mb-12" />

        <div className="text-center">
          {/* 성공 아이콘 */}
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-primary flex items-center justify-center">
            <CheckCircle2 className="h-12 w-12 text-white" strokeWidth={2} />
          </div>

          {/* 메시지 */}
          <h2 className="text-h2 font-bold text-gray-900 mb-4">
            딜러인증이 완료되었습니다.
          </h2>
          <p className="text-body text-gray-700 mb-12">
            {userName}님({userId})의 딜러 회원가입이 성공적으로 완료되었습니다.
          </p>

          {/* 버튼 */}
          <Button size="lg" onClick={() => (window.location.href = '/dashboard')}>
            매물 등록하러 가기
          </Button>
        </div>
      </div>
    </div>
  );
};
