/**
 * z-index Layering System
 * 
 * 일관된 레이어링을 위한 z-index 상수 정의
 * CSS Variables와 동기화됨
 */

export const Z_INDEX = {
  BASE: 0,              // 기본 레이어
  DROPDOWN: 100,        // 드롭다운 (검차 신청 드롭다운 등)
  STICKY: 200,          // sticky 헤더, 사이드바
  FIXED: 300,           // fixed 요소
  MODAL_BACKDROP: 400,  // 모달 배경
  MODAL: 500,           // 모달 컨텐츠
  POPOVER: 600,         // 팝오버
  TOOLTIP: 700,         // 툴팁
  TOAST: 800,           // 토스트 알림
  LOADING: 900,         // 로딩 오버레이
} as const;

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
 */
