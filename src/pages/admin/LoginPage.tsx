/**
 * LoginPage Component
 * 로그인 페이지
 */

import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/shared/context/AuthContext';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/vehicles';

  const handleLogin = () => {
    // TODO: 실제 로그인 API 연동 (Firebase Auth signInWithEmailAndPassword 등)
    setAuthenticated(true);
    navigate(redirectTo.startsWith('/') ? redirectTo : `/${redirectTo}`, { replace: true });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* 로고 */}
        <div className="text-center mb-12">
          <h1 className="text-h1 font-bold text-primary mb-4">ForwardMax</h1>
          <p className="text-body text-gray-600">B2B 중고차 수출 플랫폼</p>
        </div>

        {/* 로그인 카드 */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-h2 font-bold text-gray-900 mb-6">로그인</h2>

          <div className="space-y-6">
            <Input
              label="이메일"
              type="email"
              placeholder="dealer@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              required
            />

            <Input
              label="비밀번호"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              required
            />

            <Button fullWidth size="lg" onClick={handleLogin}>
              로그인
            </Button>

            <div className="text-center space-y-2">
              <Link to="/signup" className="block text-body text-primary hover:underline">
                회원가입
              </Link>
              <Link to="/forgot-password" className="block text-caption text-gray-500 hover:underline">
                비밀번호를 잊으셨나요?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
