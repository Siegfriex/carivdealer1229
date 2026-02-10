/**
 * 랜딩 Hero (로그인 후). Figma 1368-37364.
 * 배경: img/LANDING.png. 에셋: chevron-right. 배지 제거.
 */

import landingImage from '@img/LANDING.png';
import imgChevronRight from '@/shared/figma_image/1368-37364_지금시작하기_chevron-right.png';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
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
      {/* 배경 이미지 (최하단 레이어, z-0) */}
      <div className="absolute inset-0 z-0">
        <img src={landingImage} alt="" className="w-full h-full object-cover object-left-top" aria-hidden />
      </div>
      {/* 어두운 오버레이 (z-[1]) */}
      <div className="absolute inset-0 z-[1] bg-black/65" aria-hidden />
      {/* 인사 타이포·지금 시작하기 버튼 (z-10), 좌측 W-149부터 */}
      <div className={`relative z-10 ${LAYOUT_CLASSES.LANDING_CONTENT} px-6 py-16 md:pl-[149px] md:pr-6`}>
        <p className="font-semibold text-[45px] leading-[61px] text-white mb-6 mt-0 min-w-0 max-w-[700px] whitespace-pre-line" data-node-id="1368:37375">
          안녕하세요 {userName}님! 👋{'\n'}
          ForwardMax Cariv와 함께{'\n'}
          첫 거래를 시작해보세요
        </p>
        <Button
          size="lg"
          onClick={onStartNow}
          className="gap-3 rounded-[39px] min-w-[180px] h-[44px] px-8 justify-center text-[17px] font-semibold"
          type="button"
          data-node-id="1368:37370"
        >
          <span className="flex items-center gap-2">
            지금 시작하기
          </span>
          <img src={imgChevronRight} alt="" className="h-[15px] w-[15px] object-contain flex-shrink-0" aria-hidden />
        </Button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 z-[1] h-16 bg-[var(--color-gray-100)] rounded-t-[2rem]" />
    </section>
  );
}
