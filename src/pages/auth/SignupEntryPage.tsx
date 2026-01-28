/**
 * SignupEntryPage (회원가입 1단계 첫페이지)
 * Figma 1194-6171: 회원가입 진입 - 딜러 증빙조건 안내, 3카드, 딜러로 시작하기
 * 로그인 모달에서 "회원가입" 클릭 시 진입
 */

import { Button } from '@/shared/ui/Button';
import { Typography } from '@/shared/ui/Typography';
import { FileText, Car, Wallet } from 'lucide-react';

const SIGNUP_CARDS = [
  {
    icon: FileText,
    title: '사업자 필수 정보 입력',
    description: '판매할 차량의 차량등록원부를 업로드하고, 기본 정보와 판매방식을 선택하여 매물을 등록합니다.',
  },
  {
    icon: Car,
    title: '중고차 매매업 관련 인증',
    description: '판매할 차량의 차량등록원부를 업로드하고, 기본 정보와 판매방식을 선택하여 매물을 등록합니다.',
  },
  {
    icon: Wallet,
    title: '정산(입출금) 관련 정보',
    description: '판매할 차량의 차량등록원부를 업로드하고, 기본 정보와 판매방식을 선택하여 매물을 등록합니다.',
  },
] as const;

export const SignupEntryPage = () => {
  const handleStartDealer = () => {
    window.history.pushState({}, '', '/signup/step1');
    window.dispatchEvent(new PopStateEvent('popstate'));
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
      <div className="container max-w-3xl mx-auto text-center">
        {/* 제목 */}
        <Typography variant="h1" className="text-gray-900 mb-4">
          회원가입
        </Typography>

        {/* 안내 문구 */}
        <Typography variant="body" className="text-gray-600 mb-12 max-w-2xl mx-auto">
          딜러 자격으로 가입을 위한 증빙조건이 필요합니다.
        </Typography>

        {/* 3카드 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 text-left">
          {SIGNUP_CARDS.map(({ icon: Icon, title, description }) => (
            <div
              key={title}
              className="bg-gray-100 rounded-lg p-6 flex flex-col"
            >
              <div className="w-12 h-12 rounded-lg bg-white flex items-center justify-center mb-4 shadow-sm">
                <Icon className="h-6 w-6 text-primary" />
              </div>
              <Typography variant="h4" className="font-bold text-gray-900 mb-2">
                {title}
              </Typography>
              <Typography variant="body" className="text-gray-600">
                {description}
              </Typography>
            </div>
          ))}
        </div>

        {/* CTA */}
        <Button size="lg" onClick={handleStartDealer} className="mb-6 min-w-[200px]">
          딜러로 시작하기
        </Button>

        {/* 로그인 링크 */}
        <p className="text-body text-gray-600">
          이미 회원이라면?{' '}
          <a
            href="/"
            className="text-primary font-medium hover:underline"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState({}, '', '/');
              window.dispatchEvent(new PopStateEvent('popstate'));
            }}
          >
            로그인
          </a>
        </p>
      </div>
    </div>
  );
};
