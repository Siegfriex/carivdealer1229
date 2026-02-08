/**
 * LogisticsSectionTabs
 * Figma 1444:7927 탁송 섹션 — 일정 / 내역 전환 탭
 * Domestic-Seller 1.0 스타일
 */

import { NavLink } from 'react-router-dom';

const TABS = [
  { to: '/logistics/schedule', label: '탁송 예약' },
  { to: '/logistics/history', label: '탁송 내역' },
] as const;

export function LogisticsSectionTabs() {
  return (
    <nav
      className="inline-flex rounded-lg border border-fmax-border bg-fmax-surface p-0.5"
      role="tablist"
      aria-label="탁송 메뉴"
    >
      {TABS.map(({ to, label }) => (
        <NavLink
          key={to}
          to={to}
          end
          className={({ isActive }) =>
            `inline-flex items-center gap-2 rounded-md px-4 py-2.5 text-button font-medium transition-fast ${
              isActive
                ? 'bg-white text-fmax-primary shadow-sm border border-fmax-border'
                : 'text-fmax-text-sub hover:text-fmax-text-main hover:bg-white/50'
            }`
          }
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}
