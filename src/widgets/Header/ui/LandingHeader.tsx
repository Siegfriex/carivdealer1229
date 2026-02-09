/**
 * GNB. 랜딩/메인 공통. 차량목록·검차·거래·탁송·정산, 매물등록. IA §3.
 * @see docs/figma/IA_SITEMAP_SPEC_IPOE.md §3
 * @see docs/figma/FSD_SPEC_BLUEPRINT.md §2.3
 * Figma 1194-7481, 1368-43715(알림).
 */

import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LOG_INGEST_URL } from '@/shared/config/logging';
import { User, ChevronDown, Car, FileText, Truck, Calculator, Bell, Search, SearchCheck, UserCircle } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { LoginModal } from '@/shared/ui/LoginModal';
import { Z_INDEX } from '@/shared/config/zIndex';

const NOTIFICATION_MOCKS = [
  { id: '1', text: '아반떼 CN7 검차가 완료되었습니다.', time: '10분 전' },
  { id: '2', text: '그랜져 IG에 새로운 제안이 도착했습니다.', time: '30분 전' },
];

const NAV_ITEMS = [
  { label: '차량목록', href: '/vehicles', icon: Car },
  { label: '검차', href: '/inspections', icon: SearchCheck },
  { label: '거래', href: '/offers', icon: FileText },
  { label: '탁송', href: '/logistics/schedule', icon: Truck },
  { label: '정산', href: '/settlements', icon: Calculator },
] as const;

type NavKey = 'vehicles' | 'inspections' | 'offers' | 'logistics' | 'settlements';

interface LandingHeaderProps {
  userName?: string | null;
  onRegisterListing?: () => void;
  /** 로그인 후 메인 랜딩: 알림 + 매물 등록하기에 차량 아이콘 (Figma 1194-7664) */
  variant?: 'landing' | 'main';
  /** 메인 랜딩에서 활성 네비 (차량목록/거래/탁송/정산) */
  activeNav?: NavKey;
}

const NAV_KEYS: NavKey[] = ['vehicles', 'inspections', 'offers', 'logistics', 'settlements'];

/**
 * 랜딩/메인 GNB 헤더 (차량목록·검차·거래·탁송·정산·매물등록·알림)
 * @param props.userName - 로그인 사용자명
 * @param props.onRegisterListing - 매물 등록하기 클릭 핸들러
 * @param props.variant - landing | main
 * @param props.activeNav - 메인에서 활성 네비 키
 */
export function LandingHeader({ userName, onRegisterListing, variant = 'landing', activeNav }: LandingHeaderProps) {
  const navigate = useNavigate();
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const isMain = variant === 'main';

  useEffect(() => {
    if (!isNotificationOpen) return;
    const close = (e: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) setIsNotificationOpen(false);
    };
    document.addEventListener('click', close);
    return () => document.removeEventListener('click', close);
  }, [isNotificationOpen]);

  const handleSignupFromModal = () => {
    setLoginModalOpen(false);
    navigate('/signup');
  };

  const handleRegister = () => {
    // #region agent log
    const hasCb = !!onRegisterListing;
    const to = hasCb ? 'callback' : '/vehicles/new';
    fetch(LOG_INGEST_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'LandingHeader:handleRegister',message:'매물등록하기',data:{hasCallback:hasCb,target:to},timestamp:Date.now(),hypothesisId:'H_진입',runId:'register-flow-check'})}).catch(()=>{});
    // #endregion
    onRegisterListing?.();
    if (!onRegisterListing) navigate('/vehicles/new');
  };

  return (
    <header
      className="sticky top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm"
      style={{ zIndex: Z_INDEX.STICKY }}
    >
      {/* 1단: 로고 + 우측(마이페이지, 알림, 유저) — Figma 881-1581 */}
      <div className="container mx-auto max-w-[1440px] h-14 flex items-center justify-between gap-6 px-6">
        <Link to="/" className="flex items-center shrink-0">
          <span className="text-h3 font-bold text-gray-900 tracking-tight">
            FORWARD<span className="text-primary">MAX</span>
          </span>
        </Link>

        <div className="flex items-center gap-4 shrink-0">
          <button
            type="button"
            className="p-2 text-gray-600 hover:text-gray-900 rounded-md transition-fast"
            aria-label="검색"
          >
            <Search className="h-5 w-5" />
          </button>
          {isMain && (
            <div className="relative" ref={notificationRef}>
              <button
                type="button"
                onClick={() => setIsNotificationOpen((v) => !v)}
                className="p-2 text-gray-600 hover:text-gray-900 rounded-md transition-fast"
                aria-label="알림"
                aria-expanded={isNotificationOpen}
              >
                <Bell className="h-5 w-5" />
              </button>
              {isNotificationOpen && (
                <div
                  className="absolute right-0 mt-2 w-[360px] bg-white rounded-[10px] border border-gray-200 shadow-[0_3px_10px_rgba(0,0,0,0.05)] py-3"
                  style={{ zIndex: Z_INDEX.DROPDOWN }}
                >
                  <p className="px-4 pb-2 text-body font-medium text-gray-900" style={{ fontSize: '14px' }}>
                    알림
                  </p>
                  <ul className="max-h-[320px] overflow-y-auto">
                    {NOTIFICATION_MOCKS.map((n) => (
                      <li
                        key={n.id}
                        className="px-4 py-3 border-t border-gray-100 hover:bg-gray-50 cursor-pointer"
                        style={{ fontSize: '14px' }}
                      >
                        <p className="text-gray-900 font-normal">{n.text}</p>
                        <p className="text-caption text-gray-500 mt-1">{n.time}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {userName ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsUserOpen(!isUserOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-fast"
              >
                <User className="h-5 w-5 text-gray-600" />
                <span className="text-body font-medium text-gray-900">{userName}님</span>
                <ChevronDown className="h-4 w-4 text-gray-500" />
              </button>
              {isUserOpen && (
                <div
                  className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-2"
                  style={{ zIndex: Z_INDEX.DROPDOWN }}
                >
                  <Link
                    to="/vehicles"
                    className="block px-4 py-2 text-body text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserOpen(false)}
                  >
                    차량 목록
                  </Link>
                  <Link
                    to="/mypage"
                    className="block px-4 py-2 text-body text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserOpen(false)}
                  >
                    마이페이지
                  </Link>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-body text-gray-700 hover:bg-gray-100"
                    onClick={() => setIsUserOpen(false)}
                  >
                    로그아웃
                  </Link>
                </div>
              )}
            </div>
          ) : (
            <>
              <button
                type="button"
                onClick={() => setLoginModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 text-body font-medium text-gray-700 hover:text-primary transition-fast"
              >
                로그인
              </button>
              <LoginModal
                isOpen={loginModalOpen}
                onClose={() => setLoginModalOpen(false)}
                onSignupClick={handleSignupFromModal}
              />
            </>
          )}
        </div>
      </div>

      {/* 2단: 네비(차량목록, 검차, 거래, 탁송, 정산) + 매물 등록하기 오른쪽 — Figma 881-1581 */}
      <div className="border-t border-gray-100">
        <div className="container mx-auto max-w-[1440px] hidden md:flex items-center justify-between h-12 px-6">
          <nav className="flex items-center gap-8">
            {NAV_ITEMS.map(({ label, href, icon: Icon }, index) => {
              const key = NAV_KEYS[index];
              const isActive = isMain && activeNav === key;
              return (
                <Link
                  key={label}
                  to={href}
                  className={`flex items-center gap-2 text-body font-medium transition-fast border-b-2 -mb-px ${
                    isActive ? 'text-primary border-primary' : 'text-gray-700 border-transparent hover:text-primary hover:border-primary'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  {label}
                </Link>
              );
            })}
          </nav>
          <Button size="md" onClick={handleRegister} className="shrink-0">
            {isMain ? (
              <>
                <Car className="h-5 w-5 mr-2" />
                매물 등록하기
              </>
            ) : (
              '매물등록하기'
            )}
          </Button>
        </div>
      </div>
    </header>
  );
}
