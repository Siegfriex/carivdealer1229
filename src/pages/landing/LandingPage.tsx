/**
 * LandingPage
 * 첫 홈 화면 (웹앱 첫 진입·로그아웃 시)
 * Figma 섹션: 1368-37200 (11개 섹션 #1) | SCR 프레임: 1194-7481
 * Hero, 사용 가이드(5단계), FAQ, 문의(KakaoTalk), 푸터
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
} from 'lucide-react';

const USER_GUIDE_STEPS = [
  {
    step: 1,
    title: '차량 업로드',
    description: '차량 정보를 등록하고 이미지를 업로드하세요.',
    icon: Upload,
  },
  {
    step: 2,
    title: '검차 진행',
    description: '전문 검차를 신청하고 결과를 확인하세요.',
    icon: Search,
  },
  {
    step: 3,
    title: '거래 진행',
    description: '경매 또는 일반 판매로 거래를 진행하세요.',
    icon: FileText,
  },
  {
    step: 4,
    title: '탁송 요청',
    description: '탁송을 신청하고 배차 일정을 확인하세요.',
    icon: ShoppingCart,
  },
  {
    step: 5,
    title: '거래 완료',
    description: '정산을 확인하고 거래를 완료하세요.',
    icon: CheckCircle,
  },
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

/** §3.1 랜딩 3프레임: 37201(Hero), 37364(동일 구조), 43715(알림 노출 변형). 동일 라우트 `/` 의 다른 상태. */
export const LandingPage = () => {
  const navigate = useNavigate();
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [showNotification, setShowNotification] = useState(true); // 1368:43715 알림 노출 변형
  const userName = '홍길동'; // TODO: auth context에서 가져오기

  const handleStartNow = () => {
    navigate('/vehicles/new/step1');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 1368:43715 — 알림 노출 변형: 같은 라우트의 알림 팝업 상태 */}
      {showNotification && (
        <div
          className="fixed top-[80px] right-[24px] z-[600] flex items-center gap-3 rounded-[10px] border border-gray-200 bg-white px-5 py-4 shadow-[0_3px_10px_rgba(0,0,0,0.05)] max-w-[360px]"
          style={{ fontSize: '14px' }}
          role="alert"
        >
          <span className="flex-1 font-normal leading-normal text-gray-900">
            새 알림이 도착했습니다. 확인해 보세요.
          </span>
          <button
            type="button"
            onClick={() => setShowNotification(false)}
            className="shrink-0 rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="알림 닫기"
          >
            ×
          </button>
        </div>
      )}
      <LandingHeader userName={userName} onRegisterListing={handleStartNow} />

      {/* Hero */}
      <section className="relative w-full min-h-[420px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(17, 24, 39, 0.7), rgba(17, 24, 39, 0.5)), url('https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=1440&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gray-900/50" />
        <div className="container relative z-10 py-20 text-center md:text-left">
          <Typography variant="h2" className="text-gray-200 mb-2">
            안녕하세요 {userName}님! 👋
          </Typography>
          <Typography variant="h1" className="text-white font-medium mb-6 max-w-2xl">
            ForwardMax Cariv와 함께 첫 거래를 시작해보세요
          </Typography>
          <Button size="lg" onClick={handleStartNow} className="gap-2">
            지금 시작하기
            <span aria-hidden>&rarr;</span>
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-50 rounded-t-[2rem]" />
      </section>

      {/* 사용 가이드 — Figma 881-1372 컨테이너(1440px) */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className={`${LAYOUT_CLASSES.CONTAINER} px-6`}>
          <h2 className="text-h2 font-medium leading-tight tracking-tight text-gray-900 mb-2">
            사용 가이드
          </h2>
          <p className="text-body font-normal leading-normal text-gray-600 mb-12">
            처음 이용하시는 분들을 위한 사용 가이드
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {USER_GUIDE_STEPS.map(({ step, title, description, icon: Icon }) => (
              <div
                key={step}
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-md transition-base"
              >
                <span className="text-caption text-gray-500 mb-2">STEP.{step}</span>
                <h4 className="text-h4 font-normal leading-normal text-gray-900 mb-2 font-bold">
                  {title}
                </h4>
                <p className="text-body font-normal leading-normal text-gray-600 mb-6 flex-1">
                  {description}
                </p>
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-7 w-7 text-primary" aria-hidden />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ — Figma 1194-7534: 단일 카드·구분선·아이콘 스타일 */}
      <section className="bg-gray-50 py-16 md:py-24">
        <div className="container max-w-3xl mx-auto px-6">
          <Typography variant="h2" className="text-gray-900 mb-2 font-bold">
            자주 묻는 질문이에요
          </Typography>
          <Typography variant="body" className="text-gray-600 mb-8">
            자주 묻는 질문을 통해 빠르게 궁금증을 해결해보세요
          </Typography>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {FAQ_ITEMS.map((item, index) => (
              <div key={index}>
                <button
                  type="button"
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full flex items-center gap-3 px-5 py-4 text-left hover:bg-gray-50/80 transition-fast"
                  aria-expanded={openFaqIndex === index}
                >
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white text-body font-bold">
                    ?
                  </span>
                  <span className="flex-1 text-body font-medium text-gray-900">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`h-5 w-5 text-gray-400 flex-shrink-0 transition-transform ${
                      openFaqIndex === index ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === index && (
                  <div className="px-5 pb-4 pt-0 pl-[3.25rem]">
                    <p className="text-body text-gray-600">{item.a}</p>
                  </div>
                )}
                {index < FAQ_ITEMS.length - 1 && (
                  <hr className="border-0 border-t border-gray-100 mx-5" aria-hidden />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 문의 (KakaoTalk) — Figma 1194-7606 섹션 순서·간격 */}
      <section className="bg-white py-16 md:py-24">
        <div className="container max-w-4xl mx-auto px-6 flex flex-col md:flex-row md:items-start md:justify-between gap-8">
          <div>
            <Typography variant="h2" className="text-gray-900 mb-2 font-bold">
              다른 궁금증이 있으시다면
            </Typography>
            <Typography variant="body" className="text-gray-600 max-w-2xl">
              카카오톡 1:1 채팅을 통해 문의 주시면,
              <br />
              포워드맥스 매니저가 1:1로 친절히 안내드려요
            </Typography>
          </div>
          <a
            href={KAKAO_CHAT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-base text-gray-900 font-medium shrink-0"
          >
            <span className="w-8 h-8 rounded-full bg-[#FEE500] flex items-center justify-center text-gray-900 font-bold text-caption">
              TALK
            </span>
            지금 바로 문의하기
          </a>
        </div>
      </section>

      {/* Footer — Figma 1194-7606 */}
      <footer className="border-t border-gray-200 bg-gray-50">
        <div className="container max-w-6xl mx-auto px-6 py-6">
          <p className="text-caption text-gray-500">
            ForwardMax Cariv Domestic Seller 1.0 Prototype
          </p>
        </div>
      </footer>
    </div>
  );
};
