/**
 * 마이페이지 좌측 사이드바. IA §4.14. 미구현 메뉴는 비활성+준비 중 표시로 404 방지.
 * @see docs/figma/IA_SITEMAP_SPEC_IPOE.md §4.14
 * @see docs/figma/FSD_SPEC_BLUEPRINT.md §2.3
 * Figma 1418-36765. 구현 라우트: /mypage/settlement-account 만.
 */

import { Link, useLocation } from 'react-router-dom';
import { ChevronDown, ChevronRight } from 'lucide-react';

/** 라우트 미구현 시 비활성 처리(404 방지). 현재 구현: /mypage/settlement-account 만 */
const MENU_ITEMS: Array<
  | { label: string; href: string; key: string; comingSoon?: false }
  | { label: string; key: string; comingSoon: true }
  | { label: string; key: string; children: Array<{ label: string; href: string; key: string }> }
> = [
  { label: '프로필·인증 관리', key: 'profile', comingSoon: true },
  { label: '계정 설정', key: 'account', comingSoon: true },
  {
    label: '정산·금융 정보',
    key: 'settlement',
    children: [
      { label: '정산 계좌 등록 / 변경 / 조회', href: '/mypage/settlement-account', key: 'settlement-account' },
    ],
  },
  { label: '알림 센터', key: 'notifications', comingSoon: true },
  { label: '문의·지원', key: 'support', comingSoon: true },
];

export function MypageSidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-1">
        <h2 className="text-h4 font-bold text-gray-900 mb-4 px-3">마이페이지</h2>

        {MENU_ITEMS.map((item) => {
          if ('children' in item && item.children) {
            const isExpanded = item.children.some(
              (c) => 'href' in c && c.href === location.pathname
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
          if ('comingSoon' in item && item.comingSoon) {
            return (
              <div
                key={item.key}
                title="준비 중"
                className="block px-3 py-2.5 rounded-md text-body font-medium text-gray-400 cursor-not-allowed"
              >
                {item.label}
                <span className="ml-2 text-caption text-gray-400">준비 중</span>
              </div>
            );
          }
          if ('href' in item && item.href) {
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
          <div
            title="준비 중"
            className="block px-3 py-2.5 rounded-md text-body text-gray-400 cursor-not-allowed"
          >
            계정 탈퇴
            <span className="ml-2 text-caption text-gray-400">준비 중</span>
          </div>
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
