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
import { LOG_INGEST_URL } from '@/shared/config/logging';
import { useAuth } from '@/shared/context/AuthContext';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { Button } from '@/shared/ui/Button';
import { Typography } from '@/shared/ui/Typography';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import {
  Upload,
  Search,
  FileText,
  ShoppingCart,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Briefcase,
} from 'lucide-react';

/** Figma 1368-37364 에셋 (Phase 5: 다운로드·import·연동) */
import img1368ChevronRight from '@/shared/figma_image/1368-37364_지금시작하기_chevron-right.png';
import img1368Briefcase from '@/shared/figma_image/1368-37364_배지_briefcase.png';
import img1368Step1 from '@/shared/figma_image/1368-37364_스텝1_L-Up-Arrow.png';
import img1368Step2 from '@/shared/figma_image/1368-37364_스텝2_L-Search.png';
import img1368Step3 from '@/shared/figma_image/1368-37364_스텝3_L-Newspaper.png';
import img1368Step4 from '@/shared/figma_image/1368-37364_스텝4_R-Shopping-Cart.png';
import img1368Step5 from '@/shared/figma_image/1368-37364_스텝5_L-Dollar-Coin.png';
import img1368QuestionLg from '@/shared/figma_image/1368-37364_FAQ_Question-Lg.png';
import img1368Kakao from '@/shared/figma_image/1368-37364_문의_image110.png';

/** Figma 1368-37364 design_context 사용 가이드 문구 + 에셋 */
const USER_GUIDE_STEPS_1368 = [
  { step: 1, title: '차량 업로드', description: '판매할 차량의 차량등록원부를 업로드하고, 기본 정보와 판매방식을 선택하여 매물을 등록합니다.', icon: Upload, imgSrc: img1368Step1 },
  { step: 2, title: '검차 진행', description: '차량 등록 후 검차를 신청하며, 전문 검차를 통해 실제 차량 상태를 확인합니다.', icon: Search, imgSrc: img1368Step2 },
  { step: 3, title: '거래 진행', description: '검차 완료 후 판매 방식에 따라 거래를 진행합니다.', icon: FileText, imgSrc: img1368Step3 },
  { step: 4, title: '탁송 요청', description: '거래 확정 후 차량 탁송을 요청합니다.', icon: ShoppingCart, imgSrc: img1368Step4 },
  { step: 5, title: '거래 완료', description: '계약금과 잔금이 모두 납부되면 탁송 신청이 가능하며, 송금 및 환전이 완료된 후 탁송 직후 거래금이 입금됩니다.', icon: CheckCircle, imgSrc: img1368Step5 },
] as const;

const USER_GUIDE_STEPS = [
  { step: 1, title: '차량 업로드', description: '차량 정보를 등록하고 이미지를 업로드하세요.', icon: Upload },
  { step: 2, title: '검차 진행', description: '전문 검차를 신청하고 결과를 확인하세요.', icon: Search },
  { step: 3, title: '거래 진행', description: '경매 또는 일반 판매로 거래를 진행하세요.', icon: FileText },
  { step: 4, title: '탁송 요청', description: '탁송을 신청하고 배차 일정을 확인하세요.', icon: ShoppingCart },
  { step: 5, title: '거래 완료', description: '정산을 확인하고 거래를 완료하세요.', icon: CheckCircle },
] as const;

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

  /** 매물등록 flow 진입 → /vehicles/new */
  const handleStartNow = () => {
    fetch(LOG_INGEST_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location: 'LandingPage:handleStartNow', message: '지금 시작하기', data: { to: '/vehicles/new' }, timestamp: Date.now(), hypothesisId: 'H_진입', runId: 'register-flow-check' }) }).catch(() => {});
    navigate('/vehicles/new');
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

      {/* Hero — Figma 1444-7929: 비로그인 시 Domestic Seller Hero (0,171 1440×641) */}
      {!isAuthenticated ? (
        <section className="relative w-full h-[641px] max-w-[1440px] mx-auto flex items-center overflow-hidden bg-[var(--color-gray-100)]" data-node-id="1444:7929">
          <div className="relative z-10 w-full max-w-[1440px] mx-auto pl-6 pr-6 pt-16 pb-20 md:pl-[260px] md:pr-6">
            {/* 배지: 1444:7942 — 260,106 203×37, rounded 39px #eef5fe */}
            <div className="inline-flex items-center gap-2 w-[203px] h-[37px] rounded-[39px] border border-[#d9e7fc] bg-[#eef5fe] px-5 py-2 mb-6" data-node-id="1444:7942">
              <Briefcase className="h-[18px] w-[18px] text-[var(--color-primary)]" aria-hidden />
              <span className="text-[14px] font-semibold text-[var(--color-primary)]">한국 수출차량 전문 플랫폼</span>
            </div>
            {/* 타이틀 — 1444:7931, 1444:7948 */}
            <h1 className="font-extrabold text-[45px] leading-[50px] text-black mb-2" style={{ fontFamily: 'var(--font-primary)' }} data-node-id="1444:7931">
              현명한 중고자동차 거래를 위한
            </h1>
            <p className="font-extrabold text-[45px] leading-[50px] text-black mb-1" style={{ fontFamily: 'var(--font-primary)' }}>
              Cariv
            </p>
            <p className="font-medium text-[22px] leading-[50px] text-black mb-6" style={{ fontFamily: 'var(--font-primary)' }} data-node-id="1444:7948">
              for Domestic Sellers
            </p>
            {/* 본문 — 1444:7932 */}
            <p className="max-w-[460px] text-[16px] leading-[21px] text-[var(--color-gray-500)] mb-8 whitespace-pre-wrap" data-node-id="1444:7932">
              차량 수출을 더 쉽게, 더 빠르게 ForwardMax와 함께하면 차량 등록부터 수출까지 모든 과정을 한 곳에서 관리할 수 있습니다. 간편한 사업자 인증과 자동 차량등록 원부등록으로 빠르게 거래를 진행해보세요.
            </p>
            {/* 이메일 + 회원가입 하기 — 1444:7933, 1444:7935 */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="h-[47px] w-full min-w-[200px] max-w-[389px] rounded-[39px] border border-[var(--color-gray-500)] bg-[#f2f2f2] px-4 flex items-center" data-node-id="1444:7933">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="이메일 주소 입력"
                  className="flex-1 min-w-0 bg-transparent text-[16px] text-gray-900 placeholder:text-[var(--color-gray-500)] outline-none"
                  aria-label="이메일 주소 입력"
                />
              </div>
              <Button size="lg" onClick={handleSignup} className="gap-2 rounded-[43px] shrink-0" type="button" data-node-id="1444:7935">
                회원가입 하기
                <ChevronRight className="h-[15px] w-[15px]" aria-hidden />
              </Button>
            </div>
          </div>
        </section>
      ) : (
        /* 로그인 시: Figma 1368-37364 Hero — 1368:37367 ~1448×627, 배지 1368:37376 203×37 */
        <section
          className="relative w-full min-h-[627px] max-w-[1440px] mx-auto flex items-center overflow-hidden"
          data-node-id="1368:37367"
          data-name="Frame_Hero"
        >
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1440&q=80')` }} />
          <div className="absolute inset-0 bg-black/65" aria-hidden />
          <div className="relative z-10 w-full max-w-[1440px] mx-auto px-6 py-16 md:pl-[175px] md:pr-6">
            {/* 배지: 1368:37376 260,106 203×37 */}
            <div className="absolute top-0 left-6 md:left-0 inline-flex items-center gap-2 w-[203px] h-[37px] rounded-[39px] border border-[#d9e7fc] bg-[#eef5fe] px-5 py-2" data-node-id="1368:37376">
              <img src={img1368Briefcase} alt="" className="h-[18px] w-[18px] object-contain" aria-hidden />
              <span className="text-[14px] font-semibold text-[var(--color-primary)]">한국 수출차량 전문 플랫폼</span>
            </div>
            <p className="font-semibold text-[45px] leading-[61px] text-white mb-6 max-w-[508px] mt-14 md:mt-16" style={{ fontFamily: 'var(--font-primary)' }} data-node-id="1368:37375">
              안녕하세요 {userName}님! 👋<br />
              ForwardMax Cariv와 함께<br />
              첫 거래를 시작해보세요
            </p>
            <Button size="lg" onClick={handleStartNow} className="gap-2 rounded-[39px] w-[149px] h-[41px]" type="button" data-node-id="1368:37370">
              지금 시작하기
              <img src={img1368ChevronRight} alt="" className="h-[15px] w-[15px] object-contain" aria-hidden />
            </Button>
          </div>
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-[var(--color-gray-100)] rounded-t-[2rem]" />
        </section>
      )}

      {/* Section 2 — Figma 1444-7949: 0,819 1440×555 */}
      {!isAuthenticated && (
        <section className="w-full max-w-[1440px] mx-auto min-h-[555px] flex items-center py-16 md:py-20 bg-[var(--color-gray-100)]" data-node-id="1444:7949">
          <div className="w-full max-w-[1440px] mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-[549px] md:text-right">
              <h2 className="font-extrabold text-[45px] leading-[61px] text-black mb-4" style={{ fontFamily: 'var(--font-primary)' }} data-node-id="1444:7952">
                언제 어디서든 빠르고 간편하게.
              </h2>
              <p className="text-[16px] leading-[22px] text-[var(--color-gray-500)] whitespace-pre-wrap" data-node-id="1444:7951">
                판매를 희망하는 차량을 등록하고, 거래해보세요. 경매진행부터 정산 대기까지의 과정을 실시간으로 확인하고, 빠르게 확인할 수 있습니다.
              </p>
              <Button size="lg" onClick={handleStartNow} className="mt-6 gap-2 rounded-[39px] md:ml-auto" type="button" data-node-id="1444:7953">
                차량 업로드하기
                <ChevronRight className="h-5 w-5" aria-hidden />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Section 3 — Figma 1444-7958: 0,1381 1440×673 */}
      {!isAuthenticated && (
        <section className="w-full max-w-[1440px] mx-auto min-h-[673px] py-16 md:py-20 bg-[var(--color-gray-100)]" data-node-id="1444:7958">
          <div className="w-full max-w-[1440px] mx-auto px-6">
            <h2 className="font-extrabold text-[45px] leading-[61px] text-black mb-4 max-w-[322px]" style={{ fontFamily: 'var(--font-primary)' }} data-node-id="1444:7962">
              간소화된 인증과정
            </h2>
            <p className="max-w-[506px] text-[16px] leading-[21px] text-[var(--color-gray-500)] whitespace-pre-wrap" data-node-id="1444:7961">
              기존의 복잡한 행정처리와 발품팔이를 스킵하고, 빠른 정보등록과 OCR스캔을 통해 전산처리 과정을 신속하고 빠르게 처리하여 원활한 거래를 가능하게 합니다.
            </p>
          </div>
        </section>
      )}

      {/* 사용 가이드 — Figma 1368:37382(로그인 후) 0,737 1440×592, 카드 208×253 */}
      <section
        className={isAuthenticated ? 'bg-[var(--color-primary-light)] min-h-[592px] pt-16 pb-24 rounded-t-[40px] w-full max-w-[1440px] mx-auto' : 'bg-gray-50 py-16 md:py-24'}
        data-node-id={isAuthenticated ? '1368:37382' : undefined}
      >
        <div className={isAuthenticated ? 'w-full max-w-[1440px] mx-auto px-6' : `${LAYOUT_CLASSES.CONTAINER} px-6`}>
          <h2 className={isAuthenticated ? 'text-[34px] font-extrabold leading-[61px] text-black/80 mb-1' : 'text-h2 font-medium leading-tight tracking-tight text-gray-900 mb-2'} style={isAuthenticated ? { fontFamily: 'var(--font-primary)' } : undefined}>
            사용 가이드
          </h2>
          <p className={isAuthenticated ? 'text-[20px] leading-[61px] text-[#777] mb-12' : 'text-body font-normal leading-normal text-gray-600 mb-12'} style={isAuthenticated ? { fontFamily: 'var(--font-primary)' } : undefined}>
            처음 이용하시는 분들을 위한 사용 가이드
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {(isAuthenticated ? USER_GUIDE_STEPS_1368 : USER_GUIDE_STEPS).map((stepItem) => {
              const { step, title, description, icon: Icon } = stepItem;
              const stepImgSrc = 'imgSrc' in stepItem ? stepItem.imgSrc : null;
              return (
                <div
                  key={step}
                  className="bg-white rounded-[17px] shadow-[6px_8px_22px_rgba(0,0,0,0.08)] p-6 flex flex-col items-center text-center hover:shadow-md transition-base"
                  data-node-id={isAuthenticated ? `1368:3738${6 + step}` : undefined}
                >
                  <span className="text-[14px] font-heavy text-[var(--color-primary)] mb-2">STEP.{step}</span>
                  <h4 className="text-[21px] font-extrabold leading-tight text-black/80 mb-2" style={{ fontFamily: 'var(--font-primary)' }}>
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

      {/* FAQ — Figma 1368:37417(자주 묻는 질문) / 1194-7534 */}
      <section className="bg-gray-50 py-16 md:py-24" data-node-id={isAuthenticated ? '1368:37417' : undefined}>
        <div className="container max-w-3xl mx-auto px-6">
          <Typography variant="h2" className={isAuthenticated ? 'text-[38px] font-extrabold leading-[61px] text-black/80 mb-1' : 'text-gray-900 mb-2 font-bold'}>
            자주 묻는 질문이에요
          </Typography>
          <Typography variant="body" className={isAuthenticated ? 'text-[20px] text-[#777] mb-8' : 'text-gray-600 mb-8'}>
            자주 묻는 질문을 통해 빠르게 궁금증을 해결해보세요
          </Typography>
          <div className="bg-white rounded-[30px] border border-black/10 overflow-hidden">
            {FAQ_ITEMS.map((item, index) => (
              <div key={index} data-node-id={isAuthenticated ? `1368:3742${2 + index * 2}` : undefined}>
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full flex items-center gap-4 px-6 py-4 text-left hover:bg-gray-50/80 transition-fast"
                  aria-expanded={openFaqIndex === index}
                >
                  <span className="flex-shrink-0 w-[27px] h-[27px] rounded-[13.5px] bg-[var(--color-primary)] flex items-center justify-center overflow-hidden p-0.5">
                    {isAuthenticated ? (
                      <img src={img1368QuestionLg} alt="" className="w-full h-full object-contain" aria-hidden />
                    ) : (
                      <span className="text-white text-body font-bold">?</span>
                    )}
                  </span>
                  <span className="flex-1 text-[24px] font-semibold text-black" style={{ fontFamily: 'var(--font-primary)' }}>
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
                {index < FAQ_ITEMS.length - 1 && (
                  <hr className="border-0 border-t border-gray-100 mx-6" aria-hidden />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 문의 (KakaoTalk) — Figma 1368:37482(다른 궁금증) / 1194-7606 */}
      <section className="bg-gray-50 py-16 md:py-24" data-node-id={isAuthenticated ? '1368:37482' : undefined}>
        <div className="container max-w-4xl mx-auto px-6 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
          <div>
            <Typography variant="h2" className={isAuthenticated ? 'text-[38px] font-extrabold leading-[61px] text-black/80 mb-2' : 'text-gray-900 mb-2 font-bold'}>
              다른 궁금증이 있으시다면
            </Typography>
            <Typography variant="body" className={isAuthenticated ? 'text-[20px] leading-[33px] text-[#777]' : 'text-gray-600 max-w-2xl'}>
              카카오톡 1:1 채팅을 통해 문의 주시면,
              <br />
              포워드맥스 매니저가 1:1로 친절히 안내드려요
            </Typography>
          </div>
          <a
            href={KAKAO_CHAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-3 px-6 py-4 bg-white border border-black/10 rounded-[30px] hover:shadow-md transition-base text-gray-900 font-bold shrink-0 ${isAuthenticated ? 'text-[24px] leading-[33px]' : ''}`}
            data-node-id={isAuthenticated ? '1368:37486' : undefined}
          >
            {isAuthenticated ? (
              <img src={img1368Kakao} alt="카카오톡" className="w-10 h-10 rounded-full object-cover" />
            ) : (
              <span className="w-10 h-10 rounded-full bg-[#FEE500] flex items-center justify-center text-gray-900 font-bold text-caption">TALK</span>
            )}
            지금 바로 문의하기
          </a>
        </div>
      </section>

      {/* Footer — Figma 1368:37365 / 1444:7965 (0,2066 1440×327) */}
      <footer className={`border-t border-gray-200 ${isAuthenticated ? 'bg-[var(--color-gray-100)] min-h-[327px] flex items-start' : 'bg-gray-50 min-h-[327px]'}`} data-node-id={isAuthenticated ? '1368:37365' : '1444:7965'}>
        <div className="container max-w-[1440px] mx-auto px-6 py-8 md:pl-[171px] md:pt-[108px]">
          <p className="text-[16px] leading-[21px] text-[var(--color-gray-500)]" data-node-id={isAuthenticated ? '1368:37366' : undefined}>
            ForwardMax Cariv Domestic Seller 1.0 Prototype
          </p>
        </div>
      </footer>
    </div>
  );
};
