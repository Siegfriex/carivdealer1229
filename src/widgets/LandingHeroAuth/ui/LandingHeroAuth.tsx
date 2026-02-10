/**
 * 랜딩 Hero (로그인 후). Figma 1368-37364.
 * 에셋: briefcase, chevron-right (이 위젯에서만 import).
 */

import imgBriefcase from '@/shared/figma_image/1368-37364_배지_briefcase.png';
import imgChevronRight from '@/shared/figma_image/1368-37364_지금시작하기_chevron-right.png';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { PlatformBadge } from '@/shared/ui/PlatformBadge';
import { Button } from '@/shared/ui/Button';

export interface LandingHeroAuthProps {
  userName: string;
  onStartNow: () => void;
}

export function LandingHeroAuth({ userName, onStartNow }: LandingHeroAuthProps) {
  return (
    <section
      className={`relative ${LAYOUT_CLASSES.LANDING_SECTION} min-h-[627px] flex items-center overflow-hidden`}
      data-node-id="1368:37367"
      data-name="Frame_Hero"
    >
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1440&q=80')` }} />
      <div className="absolute inset-0 bg-black/65" aria-hidden />
      <div className={`relative z-10 ${LAYOUT_CLASSES.LANDING_CONTENT} px-6 py-16 md:pl-[175px] md:pr-6`}>
        <PlatformBadge
          icon={<img src={imgBriefcase} alt="" className="h-[18px] w-[18px] object-contain" aria-hidden />}
          className="absolute top-0 left-6 md:left-0"
        >
          한국 수출차량 전문 플랫폼
        </PlatformBadge>
        <p className="font-semibold text-[45px] leading-[61px] text-white mb-6 max-w-[508px] mt-14 md:mt-16" data-node-id="1368:37375">
          안녕하세요 {userName}님! 👋<br />
          ForwardMax Cariv와 함께<br />
          첫 거래를 시작해보세요
        </p>
        <Button size="lg" onClick={onStartNow} className="gap-2 rounded-[39px] w-[149px] h-[41px]" type="button" data-node-id="1368:37370">
          지금 시작하기
          <img src={imgChevronRight} alt="" className="h-[15px] w-[15px] object-contain" aria-hidden />
        </Button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-[var(--color-gray-100)] rounded-t-[2rem]" />
    </section>
  );
}
