# mcp_outputs SSOT → 전역 CSS 연동

**목적**: `docs/figmaMCP/mcp_outputs` 를 단일 소스 of truth(SSOT)로 두고, 전역 디자인 토큰·Tailwind·페이지를 일치시킨다.

---

## 1. SSOT 정의

| 소스 | 경로 | 용도 |
|------|------|------|
| **mcp_outputs** | `docs/figmaMCP/mcp_outputs/{nodeId}/design_context_raw.txt`, `metadata_raw.txt` | Figma 노드별 레이아웃·색상·쉐도우·radius·폰트 추출 |

- design_context_raw.txt: Tailwind/JSX 형태의 클래스 문자열 (hex, rgba, shadow-[...], rounded-[...], font-['...'])
- metadata_raw.txt: 노드 치수·계층

---

## 2. 전역 CSS 파생 구조

```
mcp_outputs (SSOT)
    ↓
design-tokens.css   (:root 변수 — 색, 쉐도우, radius, 폰트, opacity)
    ↓
tailwind.config.js  (theme.extend — shadow-figma-card, rounded-card 등)
globals.css         (@font-face SUITE, .shadow-figma-card 유틸)
    ↓
페이지/위젯         (인라인 값 대신 토큰·Tailwind 클래스 사용)
```

---

## 3. 토큰 매핑 (mcp_outputs → design-tokens)

### 색상
- `#2048e5` → `--color-primary`
- `#eef5fe`, `#d9e7fc` → `--color-primary-light`, `--color-primary-border`
- `#f8f9fa` → `--color-bg-primary`, `--color-gray-50`
- `#909090`, `#707070` → `--color-gray-500`, `--color-gray-550`
- `#9b9b9b`, `#f3f3f3`, `#334155`, `#e6e6e6` → `--color-gray-caption`, `--color-bg-block`, `--color-gnb-step`, `--color-gray-200`
- `rgba(0,0,0,0.1~0.8)` → `--color-black-10` ~ `--color-black-80`
- `rgba(32,72,229,0.8)` → `--color-primary-80`

### 쉐도우 (Figma DROP_SHADOW)
- 기본 카드: `2.344px 3.125px 11.017px 0 rgba(0,0,0,0.05)` → `--shadow-figma-card`
- 상단바: `0 -3px 23.8px 0 rgba(0,0,0,0.05)` → `--shadow-figma-topbar`
- 위치 아이콘: `0 60px 100px 0 rgba(16,45,97,0.08)` → `--shadow-figma-location`
- 검차 장소 내부 카드 (1033-4903): `2px 2px 21.3px 0 rgba(0,0,0,0.08)` → `--shadow-figma-location-inner`

### Border radius
- 5px → `--radius-xs`
- 10px → `--radius-md`
- 15px → `--radius-section`
- 20px → `--radius-lg`
- 23px → `--radius-card-sm`
- 30px → `--radius-card`
- 39px → `--radius-badge`
- 100px → `--radius-pill`

### 폰트
- Pretendard → `--font-primary` (본문)
- SUITE Variable → `--font-display` (차량번호·타이틀, design_context 반영)

---

## 4. 사용 규칙

1. **새 노드 반영 시**: mcp_outputs에 design_context/metadata 저장 후, 여기서 쓰인 hex/rgba/shadow/radius가 토큰에 없으면 design-tokens.css에 추가.
2. **페이지/컴포넌트**: 인라인 `shadow-[2.344px_...]`, `rounded-[30px]` 대신 `shadow-figma-card`, `rounded-card` 등 토큰 기반 클래스 사용.
3. **빌드 전**: `npm run build` 로 CSS/토큰 변경 검증.

---

*문서 버전: 1.0 | 최종 업데이트: 2025-02-10*
