/**
 * ForgotPasswordPage
 * 비밀번호 찾기 페이지 (준비 중 플레이스홀더)
 */

import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/ui/Button';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const handleBackToLogin = () => navigate('/login');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <h1 className="text-h1 font-bold text-primary mb-4">ForwardMax</h1>
        <h2 className="text-h2 font-bold text-gray-900 mb-2">비밀번호 찾기</h2>
        <p className="text-body text-gray-600 mb-8">
          비밀번호 재설정 기능은 준비 중입니다.
          <br />
          문의: 고객센터 또는 관리자에게 연락해 주세요.
        </p>
        <Button fullWidth size="lg" onClick={handleBackToLogin}>
          로그인으로 돌아가기
        </Button>
      </div>
    </div>
  );
};
