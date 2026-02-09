/**
 * GNB 탭 전용 미니 사이드바.
 * 검차/거래/탁송/정산 탭 진입 시 "검색(상단) + 구역(하단)"만 노출.
 * @see docs/figma/IA_SITEMAP_SPEC_IPOE.md §3 (GNB 탭과 매물등록 플로우 구분)
 */

import { Search } from 'lucide-react';
import { LAYOUT_CLASSES } from '@/shared/config/layout';

export interface GnbMinimalSidebarProps {
  /** 구역명 (예: 검차, 거래, 탁송, 정산) */
  sectionTitle: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  className?: string;
}

/**
 * GNB 탭용 미니 사이드바 렌더링
 * @description 검색(상단) + 구역명(하단) 표시
 * @param props.sectionTitle - 구역명 (검차/거래/탁송/정산)
 * @param props.searchValue - 검색 입력값
 * @param props.onSearchChange - 검색 변경 핸들러
 */
export function GnbMinimalSidebar({
  sectionTitle,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = '차량번호/모델명',
  className = '',
}: GnbMinimalSidebarProps) {
  return (
    <aside
      className={`${LAYOUT_CLASSES.SIDEBAR} flex-shrink-0 bg-white border-r border-gray-200 ${LAYOUT_CLASSES.CONTENT_MIN_HEIGHT} ${className}`}
      data-testid="gnb-minimal-sidebar"
    >
      <div className="p-4 space-y-6 flex flex-col h-full overflow-auto">
        <div className="flex-shrink-0">
          <h3 className="text-button font-medium text-gray-700 mb-2">검색</h3>
          <div className="relative">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchValue}
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-3 pr-10 py-2.5 border border-gray-200 rounded-md text-body text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              aria-label="검색"
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
          </div>
        </div>
        <div className="flex-shrink-0">
          <h3 className="text-button font-medium text-gray-700 mb-2">구역</h3>
          <p className="text-body font-medium text-primary" data-testid="gnb-sidebar-section">
            {sectionTitle}
          </p>
        </div>
      </div>
    </aside>
  );
}
