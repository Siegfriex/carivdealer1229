# Figma MCP → 코드 변환 규칙

**버전**: 1.0  
**최종 업데이트**: 2026-02-08  
**목적**: Figma MCP 반환 데이터와 Figma 디자인을 **단일 SSOT**로 두고, 로컬 코드베이스는 픽셀(px)로 정합한다.

---

## 1. 원칙

| 원칙 | 설명 |
|------|------|
| **Figma = SSOT** | get_design_context 등 MCP 반환값과 Figma 캔버스(1440px 기준)가 스타일·레이아웃의 기준이다. |
| **코드베이스 px 정합** | 구현 시 **px 단위** 사용. rem·vw 등 동적 단위는 제거하거나 픽셀로 변환한다. |
| **새 구현은 px** | 새로 작성하는 페이지·컴포넌트는 Figma(1440px) 기준 px만 사용한다. |

---

## 2. 변환 규칙

### 2.1 rem → px

- **기준**: 1rem = 16px (브라우저 기본값).
- **규칙**: `Nrem` → `N * 16px` (또는 프로젝트에서 정한 기준 px).

| rem | px (16px 기준) |
|-----|-----------------|
| 0.625rem | 10px |
| 0.75rem | 12px |
| 0.875rem | 14px |
| 1rem | 16px |
| 1.125rem | 18px |
| 1.5rem | 24px |
| 2rem | 32px |
| 2.5rem | 36px |

**예시 (CSS)**  
- Before: `font-size: 1rem; margin: 1.5rem 0;`  
- After: `font-size: 16px; margin: 24px 0;`

### 2.2 vw → px (1440px 기준)

- **기준**: 1440px 뷰포트. `1vw = 14.4px`, 즉 `Nvw` → `N * 14.4px` (필요 시 반올림).

| vw | px @ 1440 |
|----|-----------|
| 0.28vw | 4px |
| 0.56vw | 8px |
| 0.83vw | 12px |
| 1.11vw | 16px |
| 1.67vw | 24px |
| 2.22vw | 32px |
| 4.44vw | 64px |
| 10vw | 144px |

**예시 (CSS)**  
- Before: `padding: 1.67vw; width: 17.29vw;`  
- After: `padding: 24px; width: 249px;` (24 = 1440×0.0167, 249 = 1440×0.1729)

### 2.3 clamp(rem, vw, px) → px

- **규칙**: 1440px 기준으로 최대값(세 번째 인자)을 그대로 px로 사용하거나, Figma 스펙에 맞는 고정 px로 교체.

**예시 (design-tokens)**  
- Before: `--text-h1: clamp(2rem, 2.5vw, 36px);`  
- After: `--text-h1: 36px;` (또는 `--text-h1-px: 36px;`)

- Before: `--container-padding: max(24px, 1.67vw);`  
- After: `--container-padding: 24px;`

### 2.4 z-index

- Figma 레이어 순서에 맞춰 [src/shared/config/zIndex.ts](src/shared/config/zIndex.ts) 상수를 사용.
- MCP 출력의 z-index는 1440px 레이아웃과 함께 SSOT로 수용하고, 필요 시 상수만 조정.

---

## 3. 적용 범위

- **design-tokens.css**: `clamp(..., vw, px)`·`--*-vw` 등은 점진적으로 1440px 기준 **고정 px** 또는 `var(--xxx-px)` 형태로 교체. 새 토큰은 px만 사용.
- **layout.ts**: 이미 px 상수 사용. 유지.
- **새 페이지/위젯**: MCP get_design_context 결과(px)를 그대로 반영, **px 단위 유지**.
- **기존 컴포넌트**: 수정 시 rem/vw → px 변환 적용.

---

## 4. px 고정 후에도 뷰가 동적으로 보이는 방식

타이포·간격을 1440px 기준 **고정 px**로 둬도, 레이아웃은 여전히 뷰포트에 반응한다.

| 구분 | 방식 | 설명 |
|------|------|------|
| **가로** | `.container` = `max-width: 1440px` + `margin: auto` | 뷰포트 &lt; 1440px일 때 콘텐츠 영역이 줄어듦(유동 너비). 1440px 이상에서는 중앙 정렬. |
| **세로** | `100vh`, `min-h-[calc(100vh-4rem)]` | 뷰포트 높이에 따라 콘텐츠 최소 높이·풀 높이가 변함. |
| **타이포·간격** | 고정 px | Figma와 1440px에서 1:1 맞추기 위해 스케일은 변하지 않음. |

정리하면, **폭·높이**는 뷰포트에 따라 변하고, **글자 크기·여백**만 1440px 기준으로 고정되어 Figma와 일치한다.

---

## 5. 참고

- **IA·라우트 SSOT**: [FIGMA_IA_FSD_STRUCTURE.md](FIGMA_IA_FSD_STRUCTURE.md), [IA_FSD_COMPLETE_VERIFICATION_20260208.md](IA_FSD_COMPLETE_VERIFICATION_20260208.md)
- **백엔드 SSOT**: [../CarivDealer_api_v1.md](../CarivDealer_api_v1.md), [../CarivDealer_API_ERD_Mapping.md](../CarivDealer_API_ERD_Mapping.md)
- **플랜**: Phase 0 및 사이클당 단계는 IA Figma 섹션별 MCP 사이클 플랜 문서 참고.
