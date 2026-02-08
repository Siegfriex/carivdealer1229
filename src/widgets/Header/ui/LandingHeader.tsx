/**
 * LandingHeader
 * 첫 홈/랜딩 전용 GNB (Figma 1194-7481)
 * 로고, 차량목록·거래·탁송·정산, 검색, 유저, 매물등록하기
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Search, ChevronDown, Car, FileText, Truck, Calculator, Bell, SearchCheck } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { LoginModal } from '@/shared/ui/LoginModal';
import { Z_INDEX } from '@/shared/config/zIndex';

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

export function LandingHeader({ userName, onRegisterListing, variant = 'landing', activeNav }: LandingHeaderProps) {
  const navigate = useNavigate();
  const [isUserOpen, setIsUserOpen] = useState(false);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const isMain = variant === 'main';

  const handleSignupFromModal = () => {
    setLoginModalOpen(false);
    navigate('/signup');
  };

  const handleRegister = () => {
    onRegisterListing?.();
    if (!onRegisterListing) navigate('/vehicles/new');
  };

  return (
    <header
      className="sticky top-0 left-0 right-0 bg-white border-b border-gray-200 shadow-sm"
      style={{ zIndex: Z_INDEX.STICKY }}
    >
      {/* 1단: 로고 + 우측(검색, 알림, 유저) — Figma 881-1581: 매물등록 버튼 제외 */}
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
            <button
              type="button"
              className="p-2 text-gray-600 hover:text-gray-900 rounded-md transition-fast"
              aria-label="알림"
            >
              <Bell className="h-5 w-5" />
            </button>
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
                  <a
                    href="/dashboard"
                    className="block px-4 py-2 text-body text-gray-700 hover:bg-gray-100"
                  >
                    대시보드
                  </a>
                  <a
                    href="/login"
                    className="block px-4 py-2 text-body text-gray-700 hover:bg-gray-100"
                  >
                    로그아웃
                  </a>
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
