/**
 * 랜딩 FAQ 섹션. Figma 1368:37417(자주 묻는 질문).
 * 에셋: QuestionLg (로그인 후일 때만 사용, 이 위젯에서 import).
 */

import { ChevronDown } from 'lucide-react';
import { Typography } from '@/shared/ui/Typography';
import imgQuestionLg from '@/shared/figma_image/1368-37364_FAQ_Question-Lg.png';

export interface FaqItem {
  q: string;
  a: string;
}

export interface LandingFaqProps {
  items: readonly FaqItem[];
  openIndex: number | null;
  onToggle: (index: number | null) => void;
  /** true면 1368 에셋 사용 */
  withImage?: boolean;
}

export function LandingFaq({ items, openIndex, onToggle, withImage = false }: LandingFaqProps) {
  return (
    <section className="bg-gray-50 py-16 md:py-24" data-node-id={withImage ? '1368:37417' : undefined}>
      {/* 좌측 149px부터 시작, 좌우 폭 확대 */}
      <div className="w-full max-w-[1440px] mx-auto pl-6 pr-6 md:pl-[149px] md:pr-[149px]">
        <Typography variant="h2" className={withImage ? 'text-[38px] font-extrabold leading-[61px] text-black/80 mb-1' : 'text-gray-900 mb-2 font-bold'}>
          자주 묻는 질문이에요
        </Typography>
        <Typography variant="body" className={withImage ? 'text-[20px] text-[#777] mb-8' : 'text-gray-600 mb-8'}>
          자주 묻는 질문을 통해 빠르게 궁금증을 해결해보세요
        </Typography>
        <div className="bg-white rounded-card border border-black/10 overflow-hidden">
          {items.map((item, index) => (
            <div key={index} data-node-id={withImage ? `1368:3742${2 + index * 2}` : undefined}>
              <button
                type="button"
                onClick={() => onToggle(openIndex === index ? null : index)}
                className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-gray-50/80 transition-fast"
                aria-expanded={openIndex === index}
              >
                <span className="flex-shrink-0 w-[27px] h-[27px] rounded-[13.5px] bg-[var(--color-primary)] flex items-center justify-center overflow-hidden p-0.5">
                  {withImage ? (
                    <img src={imgQuestionLg} alt="" className="w-full h-full object-contain" aria-hidden />
                  ) : (
                    <span className="text-white text-body font-bold">?</span>
                  )}
                </span>
                <span className="flex-1 text-[24px] font-semibold text-black">
                  {item.q}
                </span>
                <ChevronDown
                  className={`h-6 w-6 text-gray-400 flex-shrink-0 transition-transform ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4 pt-0 pl-[3.25rem]">
                  <p className="text-body text-gray-600">{item.a}</p>
                </div>
              )}
              {index < items.length - 1 && (
                <hr className="border-0 border-t border-gray-100 mx-6" aria-hidden />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
