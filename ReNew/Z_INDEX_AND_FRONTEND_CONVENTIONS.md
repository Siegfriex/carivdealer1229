# Z-Index 및 기존 프론트엔드 문법 파악

**기준**: `src/` 코드베이스 + `.eslintrc.json`, `tailwind.config.js`, `design-tokens.css`, `.prettierrc`  
**목적**: 제트인덱스(z-index) 체계와 기존 설정한 프론트엔드 문법을 한 문서에 정리.

---

## 1. Z-Index (제트인덱스) 설정

### 1.1 정의된 레이어 (SSOT)

**파일**: [src/shared/config/zIndex.ts](src/shared/config/zIndex.ts)

| 상수 | 값 | 용도 |
|------|-----|------|
| BASE | 0 | 일반 콘텐츠 |
| DROPDOWN | 100 | 드롭다운 메뉴, 셀렉트 옵션 |
| STICKY | 200 | sticky 헤더 (GNB) |
| FIXED | 300 | fixed 사이드바, 플로팅 버튼 |
| MODAL_BACKDROP | 400 | 모달 배경 |
| MODAL | 500 | 모달 콘텐츠 |
| POPOVER | 600 | 팝오버 |
| TOOLTIP | 700 | 툴팁 |
| TOAST | 800 | 토스트 알림 |
| LOADING | 900 | 전체 화면 로딩 오버레이 |

**CSS 변수** (동기화): [src/shared/styles/design-tokens.css](src/shared/styles/design-tokens.css) 143~154행  
`--z-base`, `--z-dropdown`, `--z-sticky`, `--z-fixed`, `--z-modal-backdrop`, `--z-modal`, `--z-popover`, `--z-tooltip`, `--z-toast`, `--z-loading`

### 1.2 Z_INDEX를 사용하는 곳 (문법 준수)

| 파일 | 사용 |
|------|------|
| `widgets/Header/ui/LandingHeader.tsx` | `Z_INDEX.STICKY`, `Z_INDEX.DROPDOWN` |
| `widgets/Header/ui/Header.tsx` | `Z_INDEX.STICKY`, `Z_INDEX.DROPDOWN` |
| `widgets/ProgressSidebar/ui/ProgressSidebar.tsx` | `Z_INDEX.FIXED` |
| `shared/ui/Toast.tsx` | `Z_INDEX.TOAST` |
| `shared/ui/Modal.tsx` | `Z_INDEX.MODAL_BACKDROP`, `Z_INDEX.MODAL` |

### 1.3 이탈 (하드코딩·문법 미준수)

| 파일 | 현재 값 | 권장 |
|------|---------|------|
| `shared/ui/DevSkipFloatingButton.tsx` | `z-[9999]` | `Z_INDEX.FIXED`(300) 또는 상수에 `DEV_UI: 950` 등 추가 후 사용 |
| `shared/ui/DevSkipButton.tsx` | `z-[10000]` | 동일. TOAST(800) 위에 두려면 `Z_INDEX.TOAST + 1` 또는 `DEV_UI` 레이어 |

**정리**: 플로팅 개발용 UI는 “항상 최상단” 목적이면 기존 체계에 **DEV_UI(예: 950)** 를 추가하고, 두 컴포넌트에서 `Z_INDEX.DEV_UI` 사용하는 것이 기존 문법과 일치함.

---

## 2. 기존 프론트엔드 설정·문법

### 2.1 FSD (Feature-Sliced Design)

**파일**: [.eslintrc.json](.eslintrc.json)

- **레거시 금지**: `@/components`, `@/config`, `@/services`, `@/utils` (및 하위) import 금지.  
  대체: `shared/ui`, `shared/config`, `shared/api`, `shared/lib`, `entities/*/ui`, `widgets/*/ui`, `features/*/api`.
- **레이어 의존성**:  
  - `shared` → app/pages/widgets/features/entities 참조 불가  
  - `entities` → features/widgets/pages/app 참조 불가  
  - `features` → widgets/pages/app 참조 불가  
  - `widgets` → pages/app 참조 불가  

z-index는 **shared**에 있으므로 모든 레이어에서 `@/shared/config/zIndex` 사용 가능.

### 2.2 스타일·레이아웃

- **design-tokens.css**: 1440px 기준, `--layout-base-width`, `--container-max`, `--container-padding`, 타입/간격/색상, **z-index CSS 변수**.
- **tailwind.config.js**: `screens.md: 700px`, `maxWidth.container: 1440px`, colors/fontSize/spacing/transition (Figma 1194-7425 주석).
- **globals.css**: `.container` (최외곽용, 내부는 max-w-*), 폰트/리셋/유틸.

**문법**: 페이지 최외곽은 `container`, 좁은 콘텐츠는 그 자식에 `max-w-3xl` 등. 한 요소에 `container`와 `max-w-*` 동시 사용 금지(플랜 반영됨).

### 2.3 코드 스타일

- **Prettier** ([.prettierrc](.prettierrc)): semicolon, singleQuote, printWidth 100, tabWidth 2, endOfLine lf.
- **TypeScript**: `@typescript-eslint/no-explicit-any` warn, `no-unused-vars` warn.

---

## 3. 요약

| 항목 | 설정 위치 | 준수 여부 |
|------|-----------|-----------|
| Z-Index 레이어 | `shared/config/zIndex.ts` + design-tokens.css | Header, ProgressSidebar, Toast, Modal 준수. DevSkip 두 컴포넌트만 하드코딩(9999/10000). |
| FSD import | .eslintrc.json | shared/config(zIndex)는 FSD 허용 경로. |
| Container/레이아웃 | globals.css, 플랜 | container 바깥 / max-w 안쪽 이단 구조 적용됨. |
| 1440px·토큰 | design-tokens.css, tailwind | 타입·간격·색상·z-index 변수 정의됨. |

**권장 조치**: DevSkipFloatingButton, DevSkipButton의 `z-[9999]`/`z-[10000]`를 제거하고, `zIndex.ts`에 `DEV_UI: 950`(또는 TOAST 위 값) 추가 후 `Z_INDEX.DEV_UI` 사용하면 제트인덱스 및 기존 프론트엔드 문법에 맞춰짐.
