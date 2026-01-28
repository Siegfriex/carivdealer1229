/**
 * LoginModal
 * GNB 로그인 클릭 시 표시되는 로그인 창 (기본 로그인)
 * 회원가입 클릭 시 회원가입 1단계(진입) 페이지로 이동
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Modal } from '@/shared/ui/Modal';
import { Button } from '@/shared/ui/Button';
import { Input } from '@/shared/ui/Input';

export interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** 회원가입 클릭 시: 모달 닫고 /signup 이동 */
  onSignupClick?: () => void;
}

export function LoginModal({ isOpen, onClose, onSignupClick }: LoginModalProps) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError('');
    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.');
      return;
    }
    // TODO: 실제 로그인 API 연동 (Firebase Auth signInWithEmailAndPassword 등)
    onClose();
  };

  const handleSignupClick = () => {
    onClose();
    if (onSignupClick) {
      onSignupClick();
    } else {
      navigate('/signup');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="로그인" size="md">
      <div className="space-y-5">
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
        {error && (
          <p className="text-caption text-error">{error}</p>
        )}
        <Button fullWidth size="lg" onClick={handleLogin}>
          로그인
        </Button>
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={handleSignupClick}
            className="text-body text-primary hover:underline"
          >
            회원가입
          </button>
        </div>
        <div className="text-center">
          <Link to="/forgot-password" className="text-caption text-gray-500 hover:underline">
            비밀번호를 잊으셨나요?
          </Link>
        </div>
      </div>
    </Modal>
  );
}
