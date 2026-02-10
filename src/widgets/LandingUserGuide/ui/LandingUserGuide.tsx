/**
 * 랜딩 사용 가이드 섹션. Figma 1368:37382(로그인 후).
 * 에셋: 스텝 1~5 이미지 (이 위젯에서만 import).
 */

import {
  Upload,
  Search,
  FileText,
  ShoppingCart,
  CheckCircle,
} from 'lucide-react';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import imgStep1 from '@/shared/figma_image/1368-37364_스텝1_L-Up-Arrow.png';
import imgStep2 from '@/shared/figma_image/1368-37364_스텝2_L-Search.png';
import imgStep3 from '@/shared/figma_image/1368-37364_스텝3_L-Newspaper.png';
import imgStep4 from '@/shared/figma_image/1368-37364_스텝4_R-Shopping-Cart.png';
import imgStep5 from '@/shared/figma_image/1368-37364_스텝5_L-Dollar-Coin.png';

const STEPS_WITH_IMAGES = [
  { step: 1, title: '차량 업로드', description: '판매할 차량의 차량등록원부를 업로드하고, 기본 정보와 판매방식을 선택하여 매물을 등록합니다.', icon: Upload, imgSrc: imgStep1 },
  { step: 2, title: '검차 진행', description: '차량 등록 후 검차를 신청하며, 전문 검차를 통해 실제 차량 상태를 확인합니다.', icon: Search, imgSrc: imgStep2 },
  { step: 3, title: '거래 진행', description: '검차 완료 후 판매 방식에 따라 거래를 진행합니다.', icon: FileText, imgSrc: imgStep3 },
  { step: 4, title: '탁송 요청', description: '거래 확정 후 차량 탁송을 요청합니다.', icon: ShoppingCart, imgSrc: imgStep4 },
  { step: 5, title: '거래 완료', description: '계약금과 잔금이 모두 납부되면 탁송 신청이 가능하며, 송금 및 환전이 완료된 후 탁송 직후 거래금이 입금됩니다.', icon: CheckCircle, imgSrc: imgStep5 },
] as const;

const STEPS_ICONS_ONLY = [
  { step: 1, title: '차량 업로드', description: '차량 정보를 등록하고 이미지를 업로드하세요.', icon: Upload },
  { step: 2, title: '검차 진행', description: '전문 검차를 신청하고 결과를 확인하세요.', icon: Search },
  { step: 3, title: '거래 진행', description: '경매 또는 일반 판매로 거래를 진행하세요.', icon: FileText },
  { step: 4, title: '탁송 요청', description: '탁송을 신청하고 배차 일정을 확인하세요.', icon: ShoppingCart },
  { step: 5, title: '거래 완료', description: '정산을 확인하고 거래를 완료하세요.', icon: CheckCircle },
] as const;

export interface LandingUserGuideProps {
  /** true면 1368 에셋 사용(로그인 후 스타일) */
  withImages?: boolean;
}

export function LandingUserGuide({ withImages = false }: LandingUserGuideProps) {
  const steps = withImages ? STEPS_WITH_IMAGES : STEPS_ICONS_ONLY;

  return (
    <section
      className={withImages ? `min-h-[592px] pt-16 pb-24 rounded-t-[40px] ${LAYOUT_CLASSES.LANDING_SECTION} bg-gradient-to-b from-[var(--color-primary-light)] to-white` : `bg-gray-50 py-16 md:py-24 ${LAYOUT_CLASSES.LANDING_SECTION}`}
      data-node-id={withImages ? '1368:37382' : undefined}
    >
      {/* 좌측 149px부터 시작, 좌우 폭 확대 (랜딩 하단 섹션 통일) */}
      <div className="w-full max-w-[1440px] mx-auto px-6 md:pl-[149px] md:pr-[149px]">
        <h2 className={withImages ? 'text-[34px] font-extrabold leading-[61px] text-black/80 mb-1' : 'text-h2 font-medium leading-tight tracking-tight text-gray-900 mb-2'}>
          사용 가이드
        </h2>
        <p className={withImages ? 'text-[20px] leading-[61px] text-[#777] mb-12' : 'text-body font-normal leading-normal text-gray-600 mb-12'}>
          처음 이용하시는 분들을 위한 사용 가이드
        </p>
        {/* Figma 1368:37382 — 5카드 동일 y=221 → 1행 5열 */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          {steps.map((stepItem) => {
            const { step, title, description, icon: Icon } = stepItem;
            const stepImgSrc = 'imgSrc' in stepItem ? stepItem.imgSrc : null;
            return (
              <div
                key={step}
                className="bg-white rounded-[17px] shadow-[6px_8px_22px_rgba(0,0,0,0.08)] p-6 flex flex-col items-center text-center hover:shadow-md transition-base"
                data-node-id={withImages ? `1368:3738${6 + step}` : undefined}
              >
                <span className="text-[14px] font-heavy text-[var(--color-primary)] mb-2">STEP.{step}</span>
                <h4 className="text-[21px] font-extrabold leading-tight text-black/80 mb-2">
                  {title}
                </h4>
                <p className="text-[14px] leading-[21px] text-[var(--color-gray-500)] mb-6 flex-1 text-left">
                  {description}
                </p>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  {stepImgSrc ? (
                    <img src={stepImgSrc} alt="" className="h-9 w-9 object-contain" aria-hidden />
                  ) : (
                    <Icon className="h-7 w-7 text-primary" aria-hidden />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
