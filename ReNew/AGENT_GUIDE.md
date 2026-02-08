# AI 에이전트 작업 가이드 (Figma 구현)

**작성일**: 2026-01-28  
**목적**: 다음 AI 에이전트가 Figma 디자인을 구현할 때 따라야 할 규약 및 체크리스트  
**다음 작업**: [Figma 1194-5866](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1194-5866&m=dev)

---

## 🚀 작업 시작 전 필수 확인

### 1. ReNew 문서 읽기

**필수 문서**:
1. **[SESSION_SUMMARY.md](./SESSION_SUMMARY.md)** – 이전 세션 전체 작업 정리
2. **[FSD_COMPLIANCE_CHECK.md](./FSD_COMPLIANCE_CHECK.md)** – FSD 규칙 준수 점검 결과
3. **[FIGMA_DESIGN_SPEC.md](./FIGMA_DESIGN_SPEC.md)** – Figma 디자인 스펙
4. **[COMPONENT_SUMMARY.md](./COMPONENT_SUMMARY.md)** – 컴포넌트 매핑

**참고 문서**:
- [TYPOGRAPHY_SYSTEM.md](./TYPOGRAPHY_SYSTEM.md) – 타이포그래피 시스템
- [IMPLEMENTATION_LOG.md](./IMPLEMENTATION_LOG.md) – 컴포넌트 구현 내역

### 2. FSD 규칙 문서 확인

**필수**: `docs/FSD_ENFORCEMENT_RULES.md` 읽기

**핵심 규칙**:
- ❌ 레거시 폴더 참조 금지: `@/components`, `@/config`, `@/services`, `@/utils`
- ❌ 레이어 의존성 위반: 하위 레이어는 상위 레이어 참조 불가
- ✅ 허용: `shared` → (없음), `entities` → `shared`, `widgets` → `shared`, `pages` → `widgets/entities/shared`

---

## 📐 Figma 디자인 구현 프로세스

### Step 1: Figma 디자인 가져오기

```typescript
// Figma MCP 사용 (권장)
mcp_Figma_Desktop_get_design_context(
  nodeId: "1194:5866",  // 노드 ID (하이픈을 콜론으로 변환)
  clientLanguages: "typescript",
  clientFrameworks: "react",
  artifactType: "WEB_PAGE_OR_APP_SCREEN" | "COMPONENT_WITHIN_A_WEB_PAGE_OR_APP_SCREEN",
  taskType: "CREATE_ARTIFACT" | "CHANGE_ARTIFACT"
)

// 스크린샷도 함께 가져오기
mcp_Figma_Desktop_get_screenshot(nodeId: "1194:5866", ...)
```

**주의**: Figma 파일이 비밀번호로 보호되어 있으면 사용자에게 비밀번호 요청.

### Step 2: 기존 코드 확인

```bash
# 관련 페이지/컴포넌트 검색
codebase_search("회원가입 step 2", target_directories=[])
grep -r "SignupStep2" src/
list_dir("src/pages/auth")
```

### Step 3: FSD 구조 확인

**파일 배치 규칙**:
- **공통 UI**: `src/shared/ui/ComponentName.tsx`
- **엔티티 UI**: `src/entities/{entity}/ui/ComponentName.tsx`
- **위젯**: `src/widgets/{WidgetName}/ui/ComponentName.tsx`
- **페이지**: `src/pages/{category}/PageName.tsx`

**import 규칙**:
```ts
// ✅ OK
import { Button } from '@/shared/ui/Button';
import { VehicleCard } from '@/entities/vehicle/ui/VehicleCard';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';

// ❌ 금지
import Something from '@/components/...';
import Config from '@/config/...';
```

### Step 4: 구현

1. **1440px 기준**: 모든 가로는 1440px 기준 (`--layout-base-width`, `clamp(..., vw, px)`)
2. **타이포그래피**: `Typography` 컴포넌트 또는 `text-h1`, `text-h2` 등 Tailwind 클래스 사용
3. **디자인 토큰**: `shared/styles/design-tokens.css`의 CSS 변수 활용
4. **기존 컴포넌트 재사용**: `shared/ui/*`, `entities/*/ui/*`, `widgets/*/ui/*` 활용

### Step 5: 검증

```bash
# 1. Lint 검증
read_lints(paths=['src/.../NewFile.tsx'])

# 2. 빌드 검증
npm run build

# 3. FSD 규칙 점검
grep -r "from '@/components" src/새로추가한파일
grep -r "from '@/pages" src/shared/새로추가한파일  # shared에서 pages 참조 금지
```

### Step 6: ReNew 문서 업데이트

- `FIGMA_DESIGN_SPEC.md`: 새로 구현한 화면 추가
- `SESSION_SUMMARY.md`: 작업 내역 추가 (또는 새 세션 문서 생성)

---

## 🎨 1440px 기준 구현 가이드

### 타이포그래피

```tsx
// Typography 컴포넌트 사용
import { Typography } from '@/shared/ui/Typography';
<Typography variant="h1">제목</Typography>
<Typography variant="body">본문</Typography>

// 또는 Tailwind 클래스
<h1 className="text-h1 font-medium">제목</h1>
<p className="text-body">본문</p>
```

**타입 스케일** (1440px 기준):
- H1: 36px Medium
- H2: 24px Medium
- H3: 18px Bold
- H4: 16px Regular
- Body: 14px Regular
- Button: 12px Regular

### 레이아웃

```tsx
// Container (1440px 기준)
<div className="container max-w-[1440px] mx-auto px-6">
  {/* 내용 */}
</div>

// 또는 CSS 변수
<div style={{ maxWidth: 'var(--container-max)', padding: 'var(--container-padding)' }}>
```

### 간격

```tsx
// Spacing (1440px 기준 vw)
<div className="space-y-6">  // 24px at 1440px
<div className="gap-4">       // 16px at 1440px
```

---

## 🔧 공통 컴포넌트 활용

### 이번 세션에서 추가된 컴포넌트

| 컴포넌트 | 경로 | 용도 |
|----------|------|------|
| `SegmentedControl` | `shared/ui/SegmentedControl.tsx` | 옵션 선택 세그먼트 (옵션1/2/3 + 건수) |
| `MessageModal` | `shared/ui/MessageModal.tsx` | 메시지 박스 (제목, 내용, 취소/확인) |
| `PillChip` | `shared/ui/PillChip.tsx` | 필터용 pill 칩 |
| `DateRangePicker` | `shared/ui/DateRangePicker.tsx` | 기간 선택 (Today/7d/30d/Custom) |
| `Typography` | `shared/ui/Typography.tsx` | 타이포그래피 컴포넌트 |
| `LoginModal` | `shared/ui/LoginModal.tsx` | 로그인 모달 |

**사용 예시**: [IMPLEMENTATION_LOG.md](./IMPLEMENTATION_LOG.md) 참고

---

## ⚠️ FSD 규칙 위반 시 대응

### 위반 발견 시

1. **즉시 수정**: 레거시 폴더 참조 → `shared/ui` 등으로 변경
2. **레이어 의존성 위반**: import 경로 수정
3. **검증**: `read_lints`, `npm run build` 재실행

### 예외 처리

**허용된 예외**:
- `app/router.tsx`: pages import 필요 (라우팅)
- 마이그레이션 중: 레거시 폴더 제거 전까지 임시 허용 (ESLint disable 주석)

```ts
/* eslint-disable-next-line no-restricted-imports */
import OriginalPage from '@/components/SomePage';  // 임시
```

---

## 📋 다음 작업 체크리스트 (Figma 1194-5866)

### 시작 전
- [ ] ReNew 문서 읽기 (SESSION_SUMMARY.md, FSD_COMPLIANCE_CHECK.md)
- [ ] FSD 규칙 문서 확인 (`docs/FSD_ENFORCEMENT_RULES.md`)
- [ ] Figma 1194-5866 디자인 가져오기 (MCP 또는 스크린샷)
- [ ] 관련 기존 코드 확인 (`codebase_search`, `grep`)

### 구현 중
- [ ] FSD 구조 준수 (파일 배치, import 경로)
- [ ] 1440px 기준 준수 (타이포, 레이아웃, 간격)
- [ ] 기존 컴포넌트 재사용 (`shared/ui/*`, `entities/*/ui/*`)
- [ ] 디자인 토큰 활용 (`design-tokens.css`)

### 구현 후
- [ ] `read_lints` 실행
- [ ] `npm run build` 실행
- [ ] FSD 규칙 위반 여부 최종 확인
- [ ] ReNew 문서 업데이트

---

## 🔗 참고 링크

- **Figma 파일**: https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0
- **FSD 규칙**: `docs/FSD_ENFORCEMENT_RULES.md`
- **타이포그래피**: `ReNew/TYPOGRAPHY_SYSTEM.md`
- **컴포넌트 매핑**: `ReNew/COMPONENT_SUMMARY.md`

---

*이 가이드는 다음 AI 에이전트가 Figma 디자인을 구현할 때 필수로 따라야 할 규약입니다.*
