/**
 * Layout Constants
 * 레이아웃 관련 통일된 상수 정의
 */

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

/**
 * Tailwind CSS 클래스로 변환된 레이아웃 값
 */
export const LAYOUT_CLASSES = {
  SIDEBAR: 'w-64',                    // 256px
  GNB: 'h-16',                        // 64px
  CONTAINER: 'max-w-[1440px] mx-auto',
  MAIN_PADDING: 'p-8',                // 32px
  CONTENT_MIN_HEIGHT: 'min-h-[calc(100vh-4rem)]',  // 100vh - 64px
} as const;
