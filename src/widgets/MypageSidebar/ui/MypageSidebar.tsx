/**
 * MypageSidebar
 * 마이페이지 전용 좌측 사이드바 (Figma 1418:36765 자식 화면 공통)
 * 프로필·인증, 계정 설정, 정산·금융 정보, 알림, 문의·지원, 계정 탈퇴, 로그아웃
 */

import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';

const MENU_ITEMS = [
  { label: '프로필·인증 관리', href: '/mypage/profile', key: 'profile' },
  { label: '계정 설정', href: '/mypage/account/password', key: 'account' },
  {
    label: '정산·금융 정보',
    key: 'settlement',
    children: [
      { label: '정산 계좌 등록 / 변경 / 조회', href: '/mypage/settlement-account', key: 'settlement-account' },
    ],
  },
  { label: '알림 센터', href: '/mypage/notifications', key: 'notifications' },
  { label: '문의·지원', href: '/mypage/support', key: 'support' },
] as const;

export function MypageSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-1">
        <h2 className="text-h4 font-bold text-gray-900 mb-4 px-3">마이페이지</h2>

        {MENU_ITEMS.map((item) => {
          if ('children' in item && item.children) {
            const isExpanded = item.children.some(
              (c) => c.href === location.pathname
            );
            return (
              <div key={item.key} className="space-y-0.5">
                <div className="flex items-center gap-1 px-3 py-2 text-body text-gray-700 font-medium">
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-gray-500 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-gray-500 shrink-0" />
                  )}
                  <span>{item.label}</span>
                </div>
                {item.children.map((child) => {
                  const isActive = location.pathname === child.href;
                  return (
                    <Link
                      key={child.key}
                      to={child.href}
                      className={`
                        block pl-10 pr-3 py-2.5 rounded-md text-body font-medium transition-fast
                        ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-700 hover:bg-gray-100'}
                      `}
                    >
                      {child.label}
                    </Link>
                  );
                })}
              </div>
            );
          }
          if ('href' in item) {
            const isActive = item.href === location.pathname;
            return (
              <Link
                key={item.key}
                to={item.href}
                className={`
                  block px-3 py-2.5 rounded-md text-body font-medium transition-fast
                  ${isActive ? 'bg-primary/10 text-primary font-semibold' : 'text-gray-700 hover:bg-gray-100'}
                `}
              >
                {item.label}
              </Link>
            );
          }
          return null;
        })}

        <div className="border-t border-gray-200 mt-4 pt-4 space-y-0.5">
          <Link
            to="/mypage/withdraw"
            className="block px-3 py-2.5 rounded-md text-body text-gray-600 hover:bg-gray-100"
          >
            계정 탈퇴
          </Link>
          <button
            type="button"
            className="w-full text-left px-3 py-2.5 rounded-md text-body text-gray-600 hover:bg-gray-100"
          >
            로그아웃
          </button>
        </div>
      </div>
    </aside>
  );
}
