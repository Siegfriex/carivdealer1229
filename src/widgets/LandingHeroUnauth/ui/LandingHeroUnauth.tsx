/**
 * 랜딩 Hero (비로그인). Figma 1444-7928.
 * 641px, 배지 203×37, 이메일+회원가입. 에셋 없음(lucide Briefcase/ChevronRight).
 */

import { Briefcase, ChevronRight } from 'lucide-react';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { PlatformBadge } from '@/shared/ui/PlatformBadge';
import { Button } from '@/shared/ui/Button';

export interface LandingHeroUnauthProps {
  email: string;
  onEmailChange: (value: string) => void;
  onSignup: () => void;
}

export function LandingHeroUnauth({ email, onEmailChange, onSignup }: LandingHeroUnauthProps) {
  return (
    <section
      className={`relative ${LAYOUT_CLASSES.LANDING_SECTION} h-[641px] flex items-center overflow-hidden bg-[var(--color-gray-100)]`}
      data-node-id="1444:7929"
    >
      <div className={`relative z-10 ${LAYOUT_CLASSES.LANDING_CONTENT} pl-6 pr-6 pt-16 pb-20 md:pl-[260px] md:pr-6`}>
        <PlatformBadge icon={<Briefcase className="h-[18px] w-[18px] text-[var(--color-primary)]" aria-hidden />} className="mb-6">
          한국 수출차량 전문 플랫폼
        </PlatformBadge>
        <h1 className="font-extrabold text-[45px] leading-[50px] text-black mb-2" data-node-id="1444:7931">
          현명한 중고자동차 거래를 위한
        </h1>
        <p className="font-extrabold text-[45px] leading-[50px] text-black mb-1">
          Cariv
        </p>
        <p className="font-medium text-[22px] leading-[50px] text-black mb-6" data-node-id="1444:7948">
          for Domestic Sellers
        </p>
        <p className="max-w-[460px] text-[16px] leading-[21px] text-[var(--color-gray-500)] mb-8 whitespace-pre-wrap" data-node-id="1444:7932">
          차량 수출을 더 쉽게, 더 빠르게 ForwardMax와 함께하면 차량 등록부터 수출까지 모든 과정을 한 곳에서 관리할 수 있습니다. 간편한 사업자 인증과 자동 차량등록 원부등록으로 빠르게 거래를 진행해보세요.
        </p>
        <div className="flex flex-wrap items-center gap-3">
          <div
            className="h-[47px] w-full min-w-[200px] max-w-[389px] rounded-[39px] border border-[var(--color-gray-500)] bg-[#f2f2f2] px-4 flex items-center"
            data-node-id="1444:7933"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              placeholder="이메일 주소 입력"
              className="flex-1 min-w-0 bg-transparent text-[16px] text-gray-900 placeholder:text-[var(--color-gray-500)] outline-none"
              aria-label="이메일 주소 입력"
            />
          </div>
          <Button size="lg" onClick={onSignup} className="gap-2 rounded-[43px] shrink-0" type="button" data-node-id="1444:7935">
            회원가입 하기
            <ChevronRight className="h-[15px] w-[15px]" aria-hidden />
          </Button>
        </div>
      </div>
    </section>
  );
}
