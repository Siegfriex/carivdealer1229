/**
 * 로그인 후 메인 랜딩 좌측 사이드바. IA §3 차량목록 탭 사이드 필터(전체→/vehicles).
 * 검차/거래/탁송/정산 탭에서는 별도 사이드바여야 하나, 현재 이 컴포넌트가 여러 탭에서 공통 노출됨 → 계측으로 pathname 기록.
 * @see docs/figma/IA_SITEMAP_SPEC_IPOE.md §3, §4.3
 * @see docs/figma/FSD_SPEC_BLUEPRINT.md §2.3
 * Figma 1194-7664.
 */

import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { LOG_INGEST_URL } from '@/shared/config/logging';
import { Search } from 'lucide-react';

const LIST_ITEMS = [
  { label: '전체', href: '/vehicles', key: 'all' },
  { label: '차량 상태', href: '/vehicles?filter=status', key: 'status' },
  { label: '판매/거래 단계', href: '/vehicles?filter=sale', key: 'sale' },
  { label: '탁송 단계', href: '/vehicles?filter=logistics', key: 'logistics' },
  { label: '정산', href: '/vehicles?filter=settlement', key: 'settlement' },
] as const;

interface MainLandingSidebarProps {
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  activeKey?: string;
  className?: string;
}

export function MainLandingSidebar({
  searchValue = '',
  onSearchChange,
  activeKey = 'all',
  className = '',
}: MainLandingSidebarProps) {
  // #region agent log (pathname+activeKey당 1회만 전송해 중복 감소)
  const pathname = useLocation().pathname;
  const lastSent = useRef<string>('');
  useEffect(() => {
    const key = `${pathname}|${activeKey}`;
    if (lastSent.current === key) return;
    lastSent.current = key;
    fetch(LOG_INGEST_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'MainLandingSidebar:mount',message:'차량목록필터 사이드바 표시',data:{pathname,activeKey},timestamp:Date.now(),hypothesisId:'H_sidebar',runId:'register-flow-check'})}).catch(()=>{});
  }, [pathname, activeKey]);
  // #endregion
  return (
    <aside
      className={`w-64 flex-shrink-0 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)] ${className}`}
    >
      <div className="p-4 space-y-6">
        {/* 검색 */}
        <div>
          <h3 className="text-button font-medium text-gray-700 mb-2">검색</h3>
          <div className="relative">
            <input
              type="text"
              placeholder="차량번호/모델명"
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-3 pr-10 py-2.5 border border-gray-200 rounded-md text-body text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* 목록 */}
        <div>
          <h3 className="text-button font-medium text-gray-700 mb-2">목록</h3>
          <ul className="space-y-1">
            {LIST_ITEMS.map(({ label, href, key }) => {
              const isActive = activeKey === key;
              return (
                <li key={key}>
                  <a
                    href={href}
                    className={`
                      block px-3 py-2.5 rounded-md text-body font-medium transition-fast
                      ${isActive ? 'bg-primary-light text-primary font-bold' : 'text-gray-700 hover:bg-gray-100'}
                    `}
                  >
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </aside>
  );
}
