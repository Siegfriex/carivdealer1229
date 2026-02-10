/**
 * GNB 직속 탭 목록 페이지 공통 레이아웃.
 * 사이드바 249px, 메인 972px, 제목·children. 메인 좌측 W-149. 배지 제거.
 */

import type { ReactNode } from 'react';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { GnbMinimalSidebar } from '@/widgets/GnbMinimalSidebar';
import { MainLandingSidebar } from '@/widgets/MainLandingSidebar/ui/MainLandingSidebar';

export type GnbListSidebarType = 'vehicles' | 'minimal';

export interface GnbListLayoutVehiclesSidebar {
  type: 'vehicles';
  searchValue: string;
  onSearchChange: (value: string) => void;
  activeKey: string;
}

export interface GnbListLayoutMinimalSidebar {
  type: 'minimal';
  sectionTitle: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
}

export type GnbListLayoutSidebar = GnbListLayoutVehiclesSidebar | GnbListLayoutMinimalSidebar;

export interface GnbListLayoutProps {
  /** 사이드바 종류 및 props */
  sidebar: GnbListLayoutSidebar;
  /** 페이지 제목 */
  title: string;
  /** 메인 본문 (탭·그리드·테이블·페이지네이션 등) */
  children: ReactNode;
  /** 푸터 (선택) */
  footer?: ReactNode;
  /** data-node-id for main (선택) */
  mainNodeId?: string;
  /** data-node-id for title (선택) */
  titleNodeId?: string;
}

function renderSidebar(sidebar: GnbListLayoutSidebar) {
  const className = LAYOUT_CLASSES.GNB_SIDEBAR;
  if (sidebar.type === 'vehicles') {
    return (
      <MainLandingSidebar
        className={className}
        searchValue={sidebar.searchValue}
        onSearchChange={sidebar.onSearchChange}
        activeKey={sidebar.activeKey}
      />
    );
  }
  return (
    <GnbMinimalSidebar
      className={className}
      sectionTitle={sidebar.sectionTitle}
      searchValue={sidebar.searchValue}
      onSearchChange={sidebar.onSearchChange}
      searchPlaceholder={sidebar.searchPlaceholder}
    />
  );
}

export function GnbListLayout({
  sidebar,
  title,
  children,
  footer,
  mainNodeId,
  titleNodeId,
}: GnbListLayoutProps) {
  return (
    <>
      {renderSidebar(sidebar)}
      <main
        className={`flex-1 p-8 md:pl-[149px] ${LAYOUT_CLASSES.MAIN_GNB}`}
        data-node-id={mainNodeId}
      >
        <h1 className={`${LAYOUT_CLASSES.GNB_TITLE} font-bold text-gray-900 mb-4`} data-node-id={titleNodeId}>{title}</h1>
        {children}
      </main>
      {footer != null && footer}
    </>
  );
}
