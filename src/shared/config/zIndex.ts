/**
 * z-index 레이어링 상수
 * 드롭다운·헤더·모달·토스트·로딩·개발용 스킵 등 계층별 값 정의. CSS 변수와 동기화.
 */

/** 레이어별 z-index 값 (BASE 0 ~ DEV_SKIP_PAGE 951) */
export const Z_INDEX = {
  BASE: 0,              // 기본 콘텐츠
  DROPDOWN: 100,        // 드롭다운 메뉴
  STICKY: 200,          // sticky 헤더(GNB)·사이드바
  FIXED: 300,           // fixed 요소
  MODAL_BACKDROP: 400,  // 모달 배경
  MODAL: 500,           // 모달 콘텐츠
  POPOVER: 600,         // 팝오버
  TOOLTIP: 700,         // 툴팁
  TOAST: 800,           // 토스트 알림
  LOADING: 900,         // 로딩 오버레이
  DEV_SKIP: 950,        // 개발용 스킵 전역 토글
  DEV_SKIP_PAGE: 951,   // 개발용 스킵 페이지 버튼
} as const;

/** Z_INDEX 값 유니온 타입 */
export type ZIndexLayer = (typeof Z_INDEX)[keyof typeof Z_INDEX];

/**
 * 레이어별 사용 가이드:
 * 
 * BASE (0): 일반 컨텐츠
 * DROPDOWN (100): 드롭다운 메뉴, 셀렉트 옵션
 * STICKY (200): sticky 헤더 (GNB)
 * FIXED (300): fixed 사이드바, 플로팅 버튼
 * MODAL_BACKDROP (400): 모달 배경 (어둡게)
 * MODAL (500): 모달 컨텐츠
 * POPOVER (600): 팝오버 (모달 위에 표시 가능)
 * TOOLTIP (700): 툴팁 (항상 최상단 근처)
 * TOAST (800): 토스트 알림 (툴팁 위)
 * LOADING (900): 전체 화면 로딩 오버레이
 * DEV_SKIP (950): 개발용 스킵 전역 토글 (DevSkipFloatingButton)
 * DEV_SKIP_PAGE (951): 개발용 스킵 페이지 버튼 (DevSkipButton)
 */
