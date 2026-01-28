/**
 * MainLandingSidebar
 * 로그인 후 메인 랜딩 좌측 사이드바 (Figma 1194-7664)
 * 검색(차량번호/모델명), 목록(전체/차량 상태/판매·탁송·정산)
 */

import { Search } from 'lucide-react';

const LIST_ITEMS = [
  { label: '전체', href: '/dashboard', key: 'all' },
  { label: '차량 상태', href: '/vehicles?filter=status', key: 'status' },
  { label: '판매/거래 단계', href: '/vehicles?filter=sale', key: 'sale' },
  { label: '탁송 단계', href: '/vehicles?filter=logistics', key: 'logistics' },
  { label: '정산', href: '/settlements', key: 'settlement' },
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
