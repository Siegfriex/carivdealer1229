/**
 * 랜딩 문의(카카오) 섹션. Figma 1368:37482.
 * 에셋: 카카오 이미지 (로그인 후일 때만 사용, 이 위젯에서만 import).
 */

import { Typography } from '@/shared/ui/Typography';
import imgKakao from '@/shared/figma_image/1368-37364_문의_image110.png';

export interface LandingInquiryProps {
  kakaoChatUrl: string;
  /** true면 1368 카카오 이미지 사용 */
  withImage?: boolean;
}

export function LandingInquiry({ kakaoChatUrl, withImage = false }: LandingInquiryProps) {
  return (
    <section className="bg-gray-50 py-16 md:py-24" data-node-id={withImage ? '1368:37482' : undefined}>
      <div className="container max-w-4xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
        <div>
          <Typography variant="h2" className={withImage ? 'text-[38px] font-extrabold leading-[61px] text-black/80 mb-2' : 'text-gray-900 mb-2 font-bold'}>
            다른 궁금증이 있으시다면
          </Typography>
          <Typography variant="body" className={withImage ? 'text-[20px] leading-[33px] text-[#777]' : 'text-gray-600 max-w-2xl'}>
            카카오톡 1:1 채팅을 통해 문의 주시면,
            <br />
            포워드맥스 매니저가 1:1로 친절히 안내드려요
          </Typography>
        </div>
        <a
          href={kakaoChatUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex items-center gap-3 px-6 py-4 bg-white border border-black/10 rounded-card hover:shadow-md transition-base text-gray-900 font-bold shrink-0 ${withImage ? 'text-[24px] leading-[33px]' : ''}`}
          data-node-id={withImage ? '1368:37486' : undefined}
        >
          {withImage ? (
            <img src={imgKakao} alt="카카오톡" className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <span className="w-10 h-10 rounded-full bg-[#FEE500] flex items-center justify-center text-gray-900 font-bold text-caption">TALK</span>
          )}
          지금 바로 문의하기
        </a>
      </div>
    </section>
  );
}
