/**
 * 레이아웃 상수 (픽셀·클래스)
 * 사이드바·GNB·컨테이너·패딩·브레이크포인트 및 Tailwind 클래스 매핑.
 * 참조: ReNew/ADMIN_LAYOUT_ISSUES.md §7 — 목록 max-w-7xl, 상세/스텝 max-w-4xl.
 */

/** 픽셀 단위 레이아웃 값 (사이드바 너비, GNB 높이, 컨테이너 최대 너비 등) */
export const LAYOUT = {
  /** Sidebar 너비 (px) - w-64 = 256px */
  SIDEBAR_WIDTH: 256,

  /** GNB 직속 탭 사이드바 너비 (px) — Figma 1714:22875, 1425:8154, 1714:22333 */
  GNB_SIDEBAR_WIDTH: 249,

  /** GNB 직속 탭 메인 콘텐츠 최대 너비 (px) — Figma 1037-5126 SSOT 974, 1714:22920 등 */
  GNB_MAIN_MAX: 974,

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

  /** 좌측 상세 패널 320×420 (px) — 1272:12927, 1123:13582, 1302:27096, 794:4201 */
  DETAIL_PANEL_W: 320,
  DETAIL_PANEL_H: 420,
  /** 패널 행 높이 51px — 1272:12931, 1123:13585 */
  DETAIL_PANEL_ROW_H: 51,
} as const;

/** Tailwind CSS 클래스로 변환된 레이아웃 값 (컨테이너·메인 패딩·목록/상세 max-width 등) */
export const LAYOUT_CLASSES = {
  SIDEBAR: 'w-64',                    // 256px
  GNB: 'h-16',                       // 64px
  /** 컨테이너: 1440px 중앙 + 좌우 패딩(좌측 치우침 완화) — CONTAINER_PADDING 24px */
  CONTAINER: 'max-w-[1440px] mx-auto px-6',
  MAIN_PADDING: 'p-8',               // 32px
  CONTENT_MIN_HEIGHT: 'min-h-[calc(100vh-64px)]',  // 100vh - GNB 64px (FIGMA_MCP_TO_CODE: px 정합)
  /** 목록 페이지: max-w-7xl */
  MAIN_LIST: 'max-w-7xl',
  /** GNB 직속 탭 메인 영역 (차량/검차/거래/탁송 목록) — 974px SSOT 1037-5126 */
  MAIN_GNB: 'max-w-[974px]',
  /** CTA_3 스텝/상세 메인 영역 — Figma 794:3705 971.707px → 972px */
  MAIN_GNB_STEP: 'max-w-[972px]',
  /** 탁송 예약 폼 메인 — 1272:13402 970.8×539 */
  FORM_MAIN: 'max-w-[971px] min-h-[539px]',
  /** 주소 검색 모달 — 1272:14749 514×640 */
  ADDRESS_MODAL: 'w-[514px] h-[640px]',
  /** 상세/스텝/완료: max-w-4xl (비-CTA_3용) */
  MAIN_DETAIL: 'max-w-4xl',

  // GNB 목록 페이지 공통 (docs/figmaMCP/impl_plans/GNB_공통_레이아웃_스펙.md)
  /** GNB 직속 탭 사이드바 너비 249px */
  GNB_SIDEBAR: '!w-[249px]',
  /** 배지 컨테이너 203×37, rounded 39px, #eef5fe — Figma 1425:8167, 1714:22345 */
  GNB_BADGE: 'w-[203px] h-[37px] rounded-[39px] border border-[#d9e7fc] bg-[#eef5fe]',
  /** 페이지 제목 28px/44px */
  GNB_TITLE: 'text-[28px] leading-[44px]',
  /** 그리드 gap column 15 row 36 — mcp_outputs 1425-8153, 1714 design_context */
  GNB_GRID: 'gap-x-[15px] gap-y-[36px]',
  /** 카드 감싸는 div — Figma 1425:8239, 1714:22381 */
  GNB_CARD_WRAPPER: 'min-h-[291px] max-w-[314px]',
  /** 카드 스타일 rounded 23.441px, shadow */
  GNB_CARD: 'rounded-[23.441px] shadow-[2.34px_3.13px_11.02px_rgba(0,0,0,0.05)]',
  /** 리스트 행 카드 974×56 — Figma 1037:5391 SSOT (검차요청내역 리스트) */
  GNB_LIST_ROW_CARD:
    'bg-white rounded-[15px] shadow-[2.344px_3.125px_11.017px_0px_rgba(0,0,0,0.05)] min-h-[56px]',
  /** 페이지네이션 영역 max 970px — Figma 1425:8211, 1714:22352 */
  GNB_PAGINATION_WRAPPER: 'max-w-[970px]',
  /** GNB 카드/패널 최소 높이 473px — 검차·탁송 완료 카드(1193:7871, 1272:13152) */
  GNB_CARD_PANEL_MIN_H: 'min-h-[473px]',
  /** 검차결과요약 카드 972×266 — 1425:10376 (1425-10285) */
  GNB_CARD_972_266: 'w-full max-w-[972px] min-h-[266px]',
  /** 검차자/기사 카드 400×160 — 1425:10378, 1425:10230 (1425-10285, 1425-10137) */
  GNB_PANEL_400_160: 'w-full sm:w-[400px] min-h-[160px]',

  // 좌측 상세 패널 (거래상세·경매시작가·일반판매가·탁송) — 1272:12927, 1123:13582, 1302:27096, 794:4201
  /** 상세 패널 320×420, rounded 30px, shadow — design_context 1272-12926 */
  DETAIL_PANEL:
    'w-full max-w-[320px] min-h-[420px] overflow-hidden flex flex-col p-6 box-border rounded-[30px] shadow-[2.344px_3.125px_11.017px_rgba(0,0,0,0.05)]',
  /** 패널 내 행 높이 51px — 1272:12931, 1123:13585 */
  DETAIL_PANEL_ROW: 'h-[51px] flex items-center justify-between border-b border-gray-200 shrink-0',

  // 랜딩 페이지 (Figma 1444-7928, 1368-37364)
  /** 랜딩 섹션: 전체 폭, 콘텐츠만 1440 제한은 내부에 CONTAINER */
  LANDING_SECTION: 'w-full',
  /** 랜딩 섹션 내부 콘텐츠 wrapper — 1440px 중앙 */
  LANDING_CONTENT: 'w-full max-w-[1440px] mx-auto',
  /** 랜딩 Section2 높이 555px (1444:7949) */
  LANDING_SECTION2_MIN_H: 'min-h-[555px]',
  /** 랜딩 Section3 높이 673px (1444:7958) */
  LANDING_SECTION3_MIN_H: 'min-h-[673px]',
  /** 랜딩 푸터 높이 327px (1444:7965, 1368:37365) */
  LANDING_FOOTER_MIN_H: 'min-h-[327px]',
  /** 랜딩 푸터 내부 패딩 */
  LANDING_FOOTER_INNER: 'px-6 py-8 md:pl-[171px] md:pt-[108px]',
  /** 랜딩 Section2 리드 영역 최대 너비 (1444:7952 등) */
  LANDING_LEAD_MAX_W: 'max-w-[549px]',
  /** 랜딩 Section3 제목 최대 너비 (1444:7962) */
  LANDING_SECTION3_TITLE_MAX_W: 'max-w-[322px]',
  /** 랜딩 Section3 본문 최대 너비 (1444:7961) */
  LANDING_SECTION3_BODY_MAX_W: 'max-w-[506px]',

  // 폼·모달 공통 (탁송·검차 design_context)
  /** 폼 섹션 카드 — rounded 20px, shadow location inner */
  FORM_SECTION_CARD: 'bg-white rounded-lg border border-gray-200 shadow-[var(--shadow-figma-location-inner)] p-6',
  /** 입력 필드 기본 — design_context #f4f4f4 #d9d9d9, rounded-md */
  INPUT_FIELD: 'bg-form-field-bg border border-form-field-border rounded-md',
} as const;
