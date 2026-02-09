/**
 * 레이아웃 상수 (픽셀·클래스)
 * 사이드바·GNB·컨테이너·패딩·브레이크포인트 및 Tailwind 클래스 매핑.
 * 참조: ReNew/ADMIN_LAYOUT_ISSUES.md §7 — 목록 max-w-7xl, 상세/스텝 max-w-4xl.
 */

/** 픽셀 단위 레이아웃 값 (사이드바 너비, GNB 높이, 컨테이너 최대 너비 등) */
export const LAYOUT = {
  /** Sidebar 너비 (px) - w-64 = 256px */
  SIDEBAR_WIDTH: 256,

  /** GNB(Header) 높이 (px) - h-16 = 64px */
  GNB_HEIGHT: 64,

  /** Container 최대 너비 (px) */
  CONTAINER_MAX: 1440,

  /** Container 패딩 (px) */
  CONTAINER_PADDING: 24,

  /** 메인 콘텐츠 패딩 (px) - p-8 = 32px */
  MAIN_PADDING: 32,

  /** Breakpoint: Desktop 전환점 (px) */
  BREAKPOINT_DESKTOP: 700,
} as const;

/** Tailwind CSS 클래스로 변환된 레이아웃 값 (컨테이너·메인 패딩·목록/상세 max-width 등) */
export const LAYOUT_CLASSES = {
  SIDEBAR: 'w-64',                    // 256px
  GNB: 'h-16',                       // 64px
  CONTAINER: 'max-w-[1440px] mx-auto',
  MAIN_PADDING: 'p-8',               // 32px
  CONTENT_MIN_HEIGHT: 'min-h-[calc(100vh-64px)]',  // 100vh - GNB 64px (FIGMA_MCP_TO_CODE: px 정합)
  /** 목록 페이지: max-w-7xl */
  MAIN_LIST: 'max-w-7xl',
  /** 상세/스텝/완료: max-w-4xl */
  MAIN_DETAIL: 'max-w-4xl',
} as const;
