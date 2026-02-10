/**
 * 랜딩 페이지 — 로그인 후 Hero·사용가이드·FAQ·문의 영역.
 * Figma 1368-37364 에셋은 이 위젯에서만 import.
 */

import { useState } from 'react';
import { Button } from '@/shared/ui/Button';
import { Typography } from '@/shared/ui/Typography';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { Upload, Search, FileText, ShoppingCart, CheckCircle, ChevronDown } from 'lucide-react';

import img1368ChevronRight from '@/shared/figma_image/1368-37364_지금시작하기_chevron-right.png';
import img1368Briefcase from '@/shared/figma_image/1368-37364_배지_briefcase.png';
import img1368Step1 from '@/shared/figma_image/1368-37364_스텝1_L-Up-Arrow.png';
import img1368Step2 from '@/shared/figma_image/1368-37364_스텝2_L-Search.png';
import img1368Step3 from '@/shared/figma_image/1368-37364_스텝3_L-Newspaper.png';
import img1368Step4 from '@/shared/figma_image/1368-37364_스텝4_R-Shopping-Cart.png';
import img1368Step5 from '@/shared/figma_image/1368-37364_스텝5_L-Dollar-Coin.png';
import img1368QuestionLg from '@/shared/figma_image/1368-37364_FAQ_Question-Lg.png';
import img1368Kakao from '@/shared/figma_image/1368-37364_문의_image110.png';

const USER_GUIDE_STEPS_1368 = [
  { step: 1, title: '차량 업로드', description: '판매할 차량의 차량등록원부를 업로드하고, 기본 정보와 판매방식을 선택하여 매물을 등록합니다.', icon: Upload, imgSrc: img1368Step1 },
  { step: 2, title: '검차 진행', description: '차량 등록 후 검차를 신청하며, 전문 검차를 통해 실제 차량 상태를 확인합니다.', icon: Search, imgSrc: img1368Step2 },
  { step: 3, title: '거래 진행', description: '검차 완료 후 판매 방식에 따라 거래를 진행합니다.', icon: FileText, imgSrc: img1368Step3 },
  { step: 4, title: '탁송 요청', description: '거래 확정 후 차량 탁송을 요청합니다.', icon: ShoppingCart, imgSrc: img1368Step4 },
  { step: 5, title: '거래 완료', description: '계약금과 잔금이 모두 납부되면 탁송 신청이 가능하며, 송금 및 환전이 완료된 후 탁송 직후 거래금이 입금됩니다.', icon: CheckCircle, imgSrc: img1368Step5 },
] as const;

export interface FaqItem {
  q: string;
  a: string;
}

export interface LandingHeroProps {
  userName: string;
  onStartNow: () => void;
  faqItems: readonly FaqItem[];
  kakaoChatUrl: string;
}

/** 로그인 후 Hero 섹션 (1368:37367) */
export function LandingHeroSection({ userName, onStartNow }: { userName: string; onStartNow: () => void }) {
  return (
    <section
      className="relative w-full min-h-[627px] max-w-[1440px] mx-auto flex items-center overflow-hidden"
      data-node-id="1368:37367"
      data-name="Frame_Hero"
    >
      <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1440&q=80')` }} />
      <div className="absolute inset-0 bg-black/65" aria-hidden />
      <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 py-16 md:pl-[175px] md:pr-6">
        <div className={`absolute top-0 left-6 md:left-0 inline-flex items-center gap-2 ${LAYOUT_CLASSES.GNB_BADGE} px-5 py-2`} data-node-id="1368:37376">
          <img src={img1368Briefcase} alt="" className="h-[18px] w-[18px] object-contain" aria-hidden />
          <span className="text-[14px] font-semibold text-[var(--color-primary)]">한국 수출차량 전문 플랫폼</span>
        </div>
        <p className="font-semibold text-[45px] leading-[61px] text-white mb-6 max-w-[508px] mt-14 md:mt-16" data-node-id="1368:37375">
          안녕하세요 {userName}님! 👋<br />
          ForwardMax Cariv와 함께<br />
          첫 거래를 시작해보세요
        </p>
        <Button size="lg" onClick={onStartNow} className="gap-2 rounded-[39px] w-[149px] h-[41px]" type="button" data-node-id="1368:37370">
          지금 시작하기
          <img src={img1368ChevronRight} alt="" className="h-[15px] w-[15px] object-contain" aria-hidden />
        </Button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-[var(--color-gray-100)] rounded-t-[2rem]" />
    </section>
  );
}

/** 로그인 후 사용 가이드·FAQ·문의를 한 번에 렌더 */
export function LandingHero({ userName, onStartNow, faqItems, kakaoChatUrl }: LandingHeroProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  return (
    <>
      <LandingHeroSection userName={userName} onStartNow={onStartNow} />

      <section
        className="bg-[var(--color-primary-light)] min-h-[592px] pt-16 pb-24 rounded-t-[40px] w-full max-w-[1440px] mx-auto"
        data-node-id="1368:37382"
      >
        <div className="w-full max-w-[1440px] mx-auto px-6">
          <h2 className="text-[34px] font-extrabold leading-[61px] text-black/80 mb-1">
            사용 가이드
          </h2>
          <p className="text-[20px] leading-[61px] text-[#777] mb-12">
            처음 이용하시는 분들을 위한 사용 가이드
          </p>
          {/* Figma 1368:37382 — 5카드 동일 y=221 → 1행 5열 */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {USER_GUIDE_STEPS_1368.map(({ step, title, description, imgSrc }) => (
              <div
                key={step}
                className="bg-white rounded-[17px] shadow-[6px_8px_22px_rgba(0,0,0,0.08)] p-6 flex flex-col items-center text-center hover:shadow-md transition-base"
                data-node-id={`1368:3738${6 + step}`}
              >
                <span className="text-[14px] font-heavy text-[var(--color-primary)] mb-2">STEP.{step}</span>
                <h4 className="text-[21px] font-extrabold leading-tight text-black/80 mb-2">
                  {title}
                </h4>
                <p className="text-[14px] leading-[21px] text-[var(--color-gray-500)] mb-6 flex-1 text-left">
                  {description}
                </p>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                  <img src={imgSrc} alt="" className="h-9 w-9 object-contain" aria-hidden />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 md:py-24" data-node-id="1368:37417">
        <div className="container max-w-3xl mx-auto px-6">
          <Typography variant="h2" className="text-[38px] font-extrabold leading-[61px] text-black/80 mb-1">
            자주 묻는 질문이에요
          </Typography>
          <Typography variant="body" className="text-[20px] text-[#777] mb-8">
            자주 묻는 질문을 통해 빠르게 궁금증을 해결해보세요
          </Typography>
          <div className="bg-white rounded-card border border-black/10 overflow-hidden">
            {faqItems.map((item, index) => (
              <div key={index} data-node-id={`1368:3742${2 + index * 2}`}>
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-gray-50/80 transition-fast"
                  aria-expanded={openFaqIndex === index}
                >
                  <span className="flex-shrink-0 w-[27px] h-[27px] rounded-[13.5px] bg-[var(--color-primary)] flex items-center justify-center overflow-hidden p-0.5">
                    <img src={img1368QuestionLg} alt="" className="w-full h-full object-contain" aria-hidden />
                  </span>
                  <span className="flex-1 text-[24px] font-semibold text-black">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`h-6 w-6 text-gray-400 flex-shrink-0 transition-transform ${openFaqIndex === index ? 'rotate-180' : ''}`}
                  />
                </button>
                {openFaqIndex === index && (
                  <div className="px-6 pb-4 pt-0 pl-[3.25rem]">
                    <p className="text-body text-gray-600">{item.a}</p>
                  </div>
                )}
                {index < faqItems.length - 1 && (
                  <hr className="border-0 border-t border-gray-100 mx-6" aria-hidden />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 md:py-24" data-node-id="1368:37482">
        <div className="container max-w-4xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <Typography variant="h2" className="text-[38px] font-extrabold leading-[61px] text-black/80 mb-2">
              다른 궁금증이 있으시다면
            </Typography>
            <Typography variant="body" className="text-[20px] leading-[33px] text-[#777]">
              카카오톡 1:1 채팅을 통해 문의 주시면,
              <br />
              포워드맥스 매니저가 1:1로 친절히 안내드려요
            </Typography>
          </div>
          <a
            href={kakaoChatUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-4 bg-white border border-black/10 rounded-card hover:shadow-md transition-base text-gray-900 font-bold shrink-0 text-[24px] leading-[33px]"
            data-node-id="1368:37486"
          >
            <img src={img1368Kakao} alt="카카오톡" className="w-10 h-10 rounded-full object-cover" />
            지금 바로 문의하기
          </a>
        </div>
      </section>
    </>
  );
}
