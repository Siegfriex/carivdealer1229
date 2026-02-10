/**
 * 랜딩 페이지. 첫 진입·로그아웃 시. IA §4.1.
 * - 로그인 전: Figma 1444-7928 (Domestic Seller Hero) — mcp_outputs/1444-7928/design_context_raw.txt.
 * - 로그인 후: Figma 1368-37364 (동일 구조) — mcp_outputs/1368-37364/, impl_plans/1368-37364_구현계획.md.
 * @see docs/figma/IA_SITEMAP_SPEC_IPOE.md §4.1
 * @see docs/figma/FSD_SPEC_BLUEPRINT.md §2.2
 * @see docs/figmaMCP/impl_plans/1444-7928_구현계획.md
 * @see docs/figmaMCP/impl_plans/1368-37364_구현계획.md
 * 라우트: /.
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { LOG_INGEST_URL } from '@/shared/config/logging';
import { useAuth } from '@/shared/context/AuthContext';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { Button } from '@/shared/ui/Button';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { LandingHeroUnauth } from '@/widgets/LandingHeroUnauth';
import { LandingHeroAuth } from '@/widgets/LandingHeroAuth';
import { LandingUserGuide } from '@/widgets/LandingUserGuide';
import { LandingFaq } from '@/widgets/LandingFaq';
import { LandingInquiry } from '@/widgets/LandingInquiry';

const FAQ_ITEMS = [
  { q: '구매 시 필요한 서류는 무엇인가요?', a: '신분증, 자동차 등록증, 보험증권 등이 필요합니다. 구체적인 서류는 거래 유형에 따라 안내드립니다.' },
  { q: '시세는 어떻게 결정되나요?', a: '검차 결과와 시장 데이터를 바탕으로 시세가 산정됩니다.' },
  { q: '결제가 가능한 수단은 무엇이 있나요?', a: '계좌이체, 토스페이먼츠 등 다양한 결제 수단을 지원합니다.' },
  { q: '명의 이전은 어떻게 진행되나요?', a: '거래 완료 후 필요한 서류를 제출하시면 명의 이전을 안내드립니다.' },
  { q: '탁송 시 필요한 서류는 무엇인가요?', a: '운송 신청서와 차량 관련 서류가 필요할 수 있습니다.' },
  { q: '검차 시 필요한 서류는 무엇인가요?', a: '자동차 등록증과 차량 키를 지참해 주시면 됩니다.' },
] as const;

const KAKAO_CHAT_URL = 'https://pf.kakao.com/_example'; // 실제 채널 URL로 교체

/** §3.1 랜딩. Figma 1444-7928 비로그인 시 Hero(이메일+회원가입); 로그인 시 기존 인사 블록. */
export const LandingPage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [email, setEmail] = useState('');
  /** 로그인 시 표시명(추후 프로필 연동) */
  const userName = isAuthenticated ? '홍길동' : null;

  /** 매물등록 flow 진입 → /vehicles/new (비로그인 Section2 CTA) */
  const handleStartNow = () => {
    fetch(LOG_INGEST_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'LandingPage:handleStartNow', message: '지금 시작하기', data: { to: '/vehicles/new' }, timestamp: Date.now(), hypothesisId: 'H_진입', runId: 'register-flow-check' }) }).catch(() => {});
    navigate('/vehicles/new');
  };

  /** 로그인 후 Hero "지금 시작하기" → 로그인 페이지 */
  const handleGoLogin = () => {
    navigate('/login');
  };

  /** 회원가입 진입 (Figma 1444-7928 Hero CTA) */
  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div
      className={`min-h-screen ${isAuthenticated ? 'bg-[var(--color-gray-50)]' : 'bg-white'}`}
      data-node-id={isAuthenticated ? '1368:37364' : '1444:7928'}
      data-name={isAuthenticated ? '로그인 후 랜딩페이지_첫 사용자' : '로그인 전 랜딩페이지'}
    >
      <LandingHeader userName={userName} variant="main" activeNav="vehicles" />

      {!isAuthenticated ? (
        <LandingHeroUnauth email={email} onEmailChange={setEmail} onSignup={handleSignup} />
      ) : (
        <LandingHeroAuth userName={userName ?? '홍길동'} onStartNow={handleGoLogin} />
      )}

      {/* Section 2 — Figma 1444-7949: 좌정렬, 디자인 컨텍스트 문구 */}
      {!isAuthenticated && (
        <section className={`${LAYOUT_CLASSES.LANDING_SECTION} ${LAYOUT_CLASSES.LANDING_SECTION2_MIN_H} flex items-center py-16 md:py-20 bg-[var(--color-gray-100)]`} data-node-id="1444:7949">
          <div className={`${LAYOUT_CLASSES.LANDING_CONTENT} px-6 text-left md:pl-[260px] md:pr-6`}>
            <h2 className="font-extrabold text-[45px] leading-[61px] text-black mb-4" data-node-id="1444:7952">
              언제 어디서든 빠르고 간편하게.
            </h2>
            <p className={`${LAYOUT_CLASSES.LANDING_LEAD_MAX_W} text-[16px] leading-[22px] text-[#909090] whitespace-pre-wrap mb-6`} data-node-id="1444:7951">
              판매를 희망하는 차량을 등록하고, 거래해보세요. 경매진행부터 정산 대기까지의 과정을 실시간으로 확인하고, 빠르게 확인할 수 있습니다.
            </p>
            <Button size="lg" onClick={handleStartNow} className="gap-2 rounded-[39px]" type="button" data-node-id="1444:7953">
              차량 업로드하기
              <ChevronRight className="h-5 w-5" aria-hidden />
            </Button>
          </div>
        </section>
      )}

      {/* Section 3 — Figma 1444-7958: 좌정렬, 디자인 컨텍스트 문구 */}
      {!isAuthenticated && (
        <section className={`${LAYOUT_CLASSES.LANDING_SECTION} ${LAYOUT_CLASSES.LANDING_SECTION3_MIN_H} py-16 md:py-20 bg-[var(--color-gray-100)]`} data-node-id="1444:7958">
          <div className={`${LAYOUT_CLASSES.LANDING_CONTENT} px-6 text-left md:pl-[260px] md:pr-6`}>
            <h2 className={`font-extrabold text-[45px] leading-[61px] text-black mb-4 ${LAYOUT_CLASSES.LANDING_SECTION3_TITLE_MAX_W}`} data-node-id="1444:7962">
              간소화된 인증과정
            </h2>
            <p className={`${LAYOUT_CLASSES.LANDING_SECTION3_BODY_MAX_W} text-[16px] leading-[21px] text-[#909090] whitespace-pre-wrap`} data-node-id="1444:7961">
              기존의 복잡한 행정처리와 발품팔이를 스킵하고, 빠른 정보등록과 OCR스캔을 통해 전산처리 과정을 신속하고 빠르게 처리하여 원활한 거래를 가능하게 합니다.
            </p>
          </div>
        </section>
      )}

      <LandingUserGuide withImages={isAuthenticated} />

      <LandingFaq items={FAQ_ITEMS} openIndex={openFaqIndex} onToggle={setOpenFaqIndex} withImage={isAuthenticated} />

      <LandingInquiry kakaoChatUrl={KAKAO_CHAT_URL} withImage={isAuthenticated} />

      {/* Footer — 로고·GNB와 같은 컬럼(px-6) 정렬 */}
      <footer className={`border-t border-gray-200 ${LAYOUT_CLASSES.LANDING_FOOTER_MIN_H} ${isAuthenticated ? 'bg-[var(--color-gray-100)] flex items-start' : 'bg-gray-50'}`} data-node-id={isAuthenticated ? '1368:37365' : '1444:7965'}>
        <div className={`${LAYOUT_CLASSES.LANDING_CONTENT} px-6 py-3 md:pt-[58px]`}>
          <p className="text-[12px] leading-[16px] text-[var(--color-gray-500)]" data-node-id={isAuthenticated ? '1368:37366' : undefined}>
            ForwardMax Cariv Domestic Seller 1.0 Prototype
          </p>
        </div>
      </footer>
    </div>
  );
};
