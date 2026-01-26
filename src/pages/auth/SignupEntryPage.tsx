/**
 * SignupEntryPage Component
 * 회원가입 진입 페이지
 * 
 * 디자인: design/design_SignIn/A. 회원/회원가입진입.svg
 */

import { Button } from '@/shared/ui/Button';
import { Building, ArrowRight } from 'lucide-react';

export const SignupEntryPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* 로고 */}
        <div className="text-center mb-12">
          <h1 className="text-h1 font-bold text-primary mb-4">ForwardMax</h1>
          <p className="text-body text-gray-600">B2B 중고차 수출 플랫폼</p>
        </div>

        {/* 회원가입 카드 */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary-light flex items-center justify-center">
              <Building className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h2 className="text-h3 font-bold text-gray-900">딜러 회원가입</h2>
              <p className="text-body text-gray-600">사업자 인증으로 간편하게</p>
            </div>
          </div>

          <Button fullWidth size="lg" className="mb-4">
            딜러 회원가입 시작
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>

          <div className="text-center">
            <a href="/login" className="text-body text-primary hover:underline">
              이미 계정이 있으신가요? 로그인
            </a>
          </div>
        </div>

        {/* 안내 문구 */}
        <p className="text-caption text-gray-500 text-center">
          회원가입 후 관리자 승인이 필요합니다
        </p>
      </div>
    </div>
  );
};
