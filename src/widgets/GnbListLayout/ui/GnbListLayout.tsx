/**
 * GNB 직속 탭 목록 페이지 공통 레이아웃.
 * 사이드바 249px, 메인 972px, 배지 + 제목 + children.
 * 에셋(briefcase)은 이 위젯에서만 import.
 */

import type { ReactNode } from 'react';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { PlatformBadge } from '@/shared/ui/PlatformBadge';
import { GnbMinimalSidebar } from '@/widgets/GnbMinimalSidebar';
import { MainLandingSidebar } from '@/widgets/MainLandingSidebar/ui/MainLandingSidebar';
import iconBriefcase from '@/shared/figma_image/1425-8153_배지_briefcase.png';

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
  /** 배지 문구 (기본: 한국 수출차량 전문 플랫폼) */
  badgeText?: string;
  /** 페이지 제목 */
  title: string;
  /** 메인 본문 (탭·그리드·테이블·페이지네이션 등) */
  children: ReactNode;
  /** 푸터 (선택) */
  footer?: ReactNode;
  /** data-node-id for main (선택) */
  mainNodeId?: string;
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
  badgeText = '한국 수출차량 전문 플랫폼',
  title,
  children,
  footer,
  mainNodeId,
}: GnbListLayoutProps) {
  return (
    <>
      {renderSidebar(sidebar)}
      <main
        className={`flex-1 ${LAYOUT_CLASSES.MAIN_PADDING} ${LAYOUT_CLASSES.MAIN_GNB}`}
        data-node-id={mainNodeId}
      >
        <PlatformBadge icon={<img src={iconBriefcase} alt="" className="h-[18px] w-[18px] object-contain" aria-hidden />} className="mb-4">
          {badgeText}
        </PlatformBadge>
        <h1 className={`${LAYOUT_CLASSES.GNB_TITLE} font-bold text-gray-900 mb-4`}>{title}</h1>
        {children}
      </main>
      {footer != null && footer}
    </>
  );
}
