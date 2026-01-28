# Z-Index 및 기존 프론트엔드 문맥 파악

**기준**: `src/shared/config/zIndex.ts`, `design-tokens.css`, `docs/FSD_ENFORCEMENT_RULES.md`, `docs/FRONTEND_ARCHITECTURE_REVIEW.md`

---

## 1. Z-Index(제트인덱스) 체계

### 1.1 정의 위치

| 소스 | 경로 | 용도 |
|------|------|------|
| TS 상수 | [src/shared/config/zIndex.ts](src/shared/config/zIndex.ts) | 컴포넌트에서 `style={{ zIndex: Z_INDEX.XXX }}` |
| CSS 변수 | [src/shared/styles/design-tokens.css](src/shared/styles/design-tokens.css) (143~155라인) | `--z-base` ~ `--z-loading` |

### 1.2 레이어 정의 (공통)

| 키 | 값 | 용도 |
|----|-----|------|
| BASE | 0 | 일반 콘텐츠 |
| DROPDOWN | 100 | 드롭다운, 셀렉트 |
| STICKY | 200 | GNB(헤더) |
| FIXED | 300 | fixed 사이드바, 플로팅 |
| MODAL_BACKDROP | 400 | 모달 배경 |
| MODAL | 500 | 모달 콘텐츠 |
| POPOVER | 600 | 팝오버 |
| TOOLTIP | 700 | 툴팁 |
| TOAST | 800 | 토스트 |
| LOADING | 900 | 로딩 오버레이 |

### 1.3 사용 현황 (Z_INDEX 준수 여부)

| 컴포넌트 | 사용 값 | 준수 |
|----------|---------|------|
| LandingHeader | Z_INDEX.STICKY, Z_INDEX.DROPDOWN | O |
| Header | Z_INDEX.STICKY, Z_INDEX.DROPDOWN | O |
| ProgressSidebar | Z_INDEX.FIXED | O |
| Modal | Z_INDEX.MODAL_BACKDROP, Z_INDEX.MODAL | O |
| Toast | Z_INDEX.TOAST | O |
| **DevSkipFloatingButton** | `z-[9999]` (Tailwind) | **X** — 상수 체계 밖 |
| **DevSkipButton** | `z-[10000]` (Tailwind) | **X** — 상수 체계 밖 |

**정리**: DevSkip 두 컴포넌트만 z-index 상수 체계를 쓰지 않고, Tailwind `z-[9999]`/`z-[10000]`을 직접 사용함. 개발용 플로팅이 TOAST(800)·LOADING(900)보다 위에 오도록 의도된 것으로 보이며, 체계에 넣으려면 `zIndex.ts`에 예: `DEV_SKIP: 950` 또는 `FLOATING_DEV: 950`을 추가하고 두 컴포넌트에서 `Z_INDEX.DEV_SKIP`을 쓰는 방식으로 통일 가능.

---

## 2. 기존 프론트엔드 문맥(FSD)

### 2.1 레이어 구조

```
app → pages, widgets, features, entities, shared
pages → widgets, features, entities, shared
widgets → features, entities, shared
features → entities, shared
entities → shared
shared → (상위 레이어 참조 금지)
```

### 2.2 규칙 요약

- **레거시 경로 금지**: `@/components`, `@/config`, `@/services`, `@/utils` 직접 사용 금지 → `shared/*`, `entities/*/ui`, `widgets/*/ui` 등으로 이전 권장.
- **의존성 방향**: 하위 레이어는 상위 레이어를 import 하지 않음.
- **현재 상태**: FSD 폴더와 기존 폴더가 혼재; 일부 페이지는 레거시 컴포넌트 래핑.

### 2.3 Z-Index와의 관계

- z-index 상수는 **shared 레이어** (`shared/config/zIndex.ts`, `shared/styles/design-tokens.css`)에 정의.
- **widgets**, **shared/ui** 등 하위 레이어에서만 참조하므로 FSD 의존성 방향과 맞음.
- DevSkip 계열은 `shared/ui`에 있으므로 `shared/config/zIndex` 참조 가능. FSD 관점에서는 z-index를 shared 상수로 통일하는 것이 일관적.

---

## 3. 권장 조치 (Z-Index 정합성)

1. **zIndex.ts 확장**  
   - 개발용 플로팅을 위한 계층 추가. 예: `DEV_SKIP: 950` (LOADING 900 위, 단일 레이어).
2. **DevSkipFloatingButton**  
   - `className="... z-[9999]"` 제거, `style={{ zIndex: Z_INDEX.DEV_SKIP }}` 사용.
3. **DevSkipButton**  
   - `className="... z-[10000]"` 제거, `style={{ zIndex: Z_INDEX.DEV_SKIP }}` 사용.
4. **design-tokens.css (선택)**  
   - `--z-dev-skip: 950` 추가 후, 필요 시 CSS 변수로도 사용 가능.

이렇게 하면 “제트인덱스 및 기존 설정한 프론트엔드 문맥(FSD + design-tokens)”에 맞춰 z-index가 한 곳에서 정의되고, 문서와 코드가 일치한다.
