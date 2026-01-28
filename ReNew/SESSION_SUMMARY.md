# ReNew 세션 작업 전체 정리

**세션 일자**: 2026-01-28  
**목적**: Figma 디자인 반영 및 FSD 아키텍처 준수 구현  
**다음 작업**: [Figma 1194-5866](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1194-5866&m=dev) 구현

---

## 📋 작업 개요

이 세션에서 **6개의 Figma 디자인**을 구현하고, **타이포그래피 시스템**을 정립했습니다. 모든 작업은 **FSD(Feature-Sliced Design) 아키텍처**를 준수하며, **1440px 기준**으로 구현되었습니다.

---

## 🎨 구현된 Figma 디자인

| 순서 | Figma 노드 | 화면/컴포넌트 | 구현 파일 | 상태 |
|------|-----------|--------------|-----------|------|
| 1 | [1194-6634](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1194-6634&m=dev) | 컴포넌트 정리본 | `shared/ui/*` (4개) | ✅ 완료 |
| 2 | [1194-7425](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1194-7425&m=dev) | 타이포그래피 시스템 | `shared/styles/design-tokens.css`, `shared/ui/Typography.tsx` | ✅ 완료 |
| 3 | [1194-7481](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1194-7481&m=dev) | 첫 홈/랜딩 (로그아웃 시) | `pages/landing/LandingPage.tsx`, `widgets/Header/ui/LandingHeader.tsx` | ✅ 완료 |
| 4 | [1194-7664](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1194-7664&m=dev) | 로그인 후 메인 랜딩 (전체 차량) | `pages/admin/DashboardPage.tsx`, `widgets/MainLandingSidebar/ui/MainLandingSidebar.tsx`, `entities/vehicle/ui/VehicleCard.tsx` | ✅ 완료 |
| 5 | [1194-6171](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1194-6171&m=dev) | 회원가입 1단계 첫페이지 | `pages/auth/SignupEntryPage.tsx`, `shared/ui/LoginModal.tsx` | ✅ 완료 |
| 6 | [1194-5792](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1194-5792&m=dev) | 회원가입 Step 1 - 본인인증 | `pages/auth/SignupStep1Page.tsx` | ✅ 완료 |
| 7 | [1198-6370](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1198-6370&m=dev) | 매물목록뷰 | `pages/admin/VehicleListPage.tsx` | ✅ 완료 |
| 8 | [1198-6939](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1198-6939&m=dev) | 그리드뷰 | `VehicleListPage` (viewMode='grid') | ✅ 완료 |
| 9 | [1198-6578](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1198-6578&m=dev) | 리스트뷰 | `VehicleListPage` (viewMode='list') | ✅ 완료 |
| 10 | [1198-6791](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1198-6791&m=dev) | 임시저장됨 필터 | `VehicleListPage` (filterTab='draft') | ✅ 완료 |
| 11 | [1198-5843](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1198-5843&m=dev) | 매물등록 첫 화면 | `pages/admin/vehicle/VehicleRegisterEntryPage.tsx` | ✅ 완료 |
| 12 | [1198-5889](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1198-5889&m=dev) | 차량원부등록 | `pages/admin/vehicle/VehicleRegisterStep1Page.tsx` | ✅ 완료 |

---

## 📁 추가/수정된 파일 상세

### 1. 공통 UI 컴포넌트 (`src/shared/ui/`)

| 파일 | 설명 | Figma 대응 | FSD 준수 |
|------|------|------------|----------|
| `SegmentedControl.tsx` | 옵션1/옵션2/옵션3 + 건수 세그먼트 | 컴포넌트 정리본 | ✅ shared만 참조 |
| `MessageModal.tsx` | 메시지 박스 (제목, 내용, 취소/확인) | 컴포넌트 정리본 | ✅ shared만 참조 |
| `PillChip.tsx` | 필터용 pill 칩 | 컴포넌트 정리본 | ✅ shared만 참조 |
| `DateRangePicker.tsx` | 기간 선택 (Today/7d/30d/Custom + 캘린더) | 컴포넌트 정리본 | ✅ shared만 참조 |
| `Typography.tsx` | 타이포그래피 컴포넌트 (H1~Button/Caption) | 타이포그래피 1194-7425 | ✅ shared만 참조 |
| `LoginModal.tsx` | 로그인 모달 (이메일/비밀번호, 회원가입 링크) | 로그인 플로우 | ✅ shared만 참조 |

### 2. 위젯 (`src/widgets/`)

| 파일 | 설명 | Figma 대응 | FSD 준수 |
|------|------|------------|----------|
| `Header/ui/LandingHeader.tsx` | 첫 홈/랜딩 GNB (로고, 네비, 검색, 유저, 매물등록하기) | 1194-7481, 1194-7664 | ✅ widgets → shared만 참조 |
| `MainLandingSidebar/ui/MainLandingSidebar.tsx` | 로그인 후 메인 랜딩 좌측 사이드바 (검색, 목록) | 1194-7664 | ✅ widgets → shared만 참조 |

### 3. 페이지 (`src/pages/`)

| 파일 | 설명 | Figma 대응 | FSD 준수 |
|------|------|------------|----------|
| `landing/LandingPage.tsx` | 첫 홈/랜딩 (Hero, 사용 가이드, FAQ, 문의, 푸터) | 1194-7481 | ✅ pages → widgets, shared만 참조 |
| `admin/DashboardPage.tsx` | 로그인 후 메인 랜딩 (전체 차량 그리드) | 1194-7664 | ✅ pages → widgets, entities, shared만 참조 |
| `auth/SignupEntryPage.tsx` | 회원가입 진입 (3카드, 딜러로 시작하기) | 1194-6171 | ✅ pages → shared만 참조 |
| `auth/SignupStep1Page.tsx` | 회원가입 Step 1 본인인증 (기본정보, 본인인증, 신분증) | 1194-5792 | ✅ pages → shared만 참조 |

### 4. 엔티티 (`src/entities/`)

| 파일 | 설명 | Figma 대응 | FSD 준수 |
|------|------|------------|----------|
| `vehicle/ui/VehicleCard.tsx` | 차량 카드 (variant: mainLanding 추가) | 1194-7664 | ✅ entities → shared만 참조 |

### 5. 디자인 토큰/스타일

| 파일 | 설명 | Figma 대응 | FSD 준수 |
|------|------|------------|----------|
| `shared/styles/design-tokens.css` | 타이포그래피 스펙 반영 (1440px 기준, Figma 1194-7425) | 1194-7425 | ✅ CSS 파일 |
| `tailwind.config.js` | 타이포그래피 fontSize 주석 추가 | 1194-7425 | ✅ 설정 파일 |

---

## 🔍 FSD 규칙 준수 점검

### ✅ Phase 1: 레거시 폴더 참조 금지

**내가 추가한 파일**: 모두 준수 ✅
- `shared/ui/*` → `@/shared/*`만 사용
- `widgets/*` → `@/shared/*`만 사용
- `pages/*` → `@/widgets/*`, `@/shared/*`, `@/entities/*`만 사용
- `entities/*` → `@/shared/*`만 사용

**기존 위반 파일** (7개, 이번 세션에서 수정하지 않음):
- `src/pages/admin/SettlementListPage.tsx` 등 → 레거시 `@/components` 참조 (기존 코드)

### ✅ Phase 2: 레이어 의존성 규칙

**내가 추가한 파일**: 모두 준수 ✅
- `shared` → 상위 레이어 참조 없음 ✅
- `entities` → 상위 레이어 참조 없음 ✅
- `features` → 상위 레이어 참조 없음 ✅
- `widgets` → 상위 레이어 참조 없음 ✅
- `pages` → 상위 레이어 참조 없음 ✅

### ⚠️ Phase 3: Public API (선택적)

**현재 상태**: 내부 경로 직접 참조 사용 중
- 예: `import { VehicleCard } from '@/entities/vehicle/ui/VehicleCard'`
- 권장: `import { VehicleCard } from '@/entities/vehicle'` (index.ts 필요)

**이번 세션**: Public API 미구현 (선택적 단계이므로 OK)

---

## 📐 1440px 기준 준수

모든 가로(레이아웃·타이포)는 **1440px 기준**으로 구현:

- **디자인 토큰**: `--layout-base-width: 1440px`, `--container-max: 1440px`
- **타이포그래피**: `clamp(..., vw, 최대px)`에서 최대값이 Figma 1440px 스펙
- **간격/spacing**: 1440px 기준 vw 사용 (예: 24px → 1.67vw)

---

## 🔗 플로우 및 라우팅

### 로그인/회원가입 플로우

```
랜딩 (/) 
  → GNB "로그인" 클릭 
    → LoginModal 열림
      → "회원가입" 클릭 
        → /signup (SignupEntryPage: 3카드, 딜러로 시작하기)
          → "딜러로 시작하기" 클릭
            → /signup/step1 (SignupStep1Page: 본인인증)
              → "다음" 클릭
                → /signup/step2 (사업자 정보 입력)
```

### 메인 랜딩 플로우

```
로그인 성공 / 회원가입 완료
  → /dashboard (DashboardPage: 전체 차량 그리드)
    → LandingHeader (variant="main", activeNav="vehicles")
    → MainLandingSidebar (검색, 목록)
    → VehicleCard 그리드 (variant="mainLanding")
    → Pagination
    → Footer
```

---

## 📚 ReNew 문서 구조

| 문서 | 내용 |
|------|------|
| [README.md](./README.md) | ReNew 개요 및 Figma 링크 모음 |
| [FIGMA_DESIGN_SPEC.md](./FIGMA_DESIGN_SPEC.md) | 화면/플로우 스펙 (회원·인증, 랜딩) |
| [COMPONENT_SUMMARY.md](./COMPONENT_SUMMARY.md) | 컴포넌트 정리본 + Figma→코드 매핑 |
| [IMPLEMENTATION_LOG.md](./IMPLEMENTATION_LOG.md) | 컴포넌트 4종 구현 내역 |
| [TYPOGRAPHY_SYSTEM.md](./TYPOGRAPHY_SYSTEM.md) | 타이포그래피 시스템 (1440px 기준) |
| [SESSION_SUMMARY.md](./SESSION_SUMMARY.md) | **본 문서** – 전체 세션 작업 정리 |

---

## 🎯 다음 작업 가이드 (Figma 1194-5866)

### 1. Figma 디자인 확인

```bash
# Figma MCP 사용
mcp_Figma_Desktop_get_design_context(nodeId="1194:5866", ...)
mcp_Figma_Desktop_get_screenshot(nodeId="1194:5866", ...)
```

### 2. FSD 규칙 준수 체크리스트

- ✅ **레이어 의존성**: 하위 레이어는 상위 레이어 참조 불가
- ✅ **레거시 폴더 금지**: `@/components`, `@/config`, `@/services`, `@/utils` 사용 금지
- ✅ **세그먼트 경로**: `ui/`, `model/`, `api/` 내부 구조 준수
- ✅ **1440px 기준**: 모든 가로는 1440px 기준

### 3. 구현 순서

1. **Figma 디자인 확인** (MCP 또는 스크린샷)
2. **기존 코드 확인** (관련 페이지/컴포넌트 읽기)
3. **FSD 규칙 점검** (import 경로 확인)
4. **구현** (FSD 구조 준수)
5. **검증** (`npm run build`, `read_lints`)
6. **ReNew 문서 업데이트**

### 4. 공통 컴포넌트 활용

이번 세션에서 추가된 컴포넌트:
- `SegmentedControl` – 옵션 선택 세그먼트
- `MessageModal` – 메시지 박스
- `PillChip` – 필터 칩
- `DateRangePicker` – 기간 선택
- `Typography` – 타이포그래피
- `LoginModal` – 로그인 모달

**사용 예시**: [IMPLEMENTATION_LOG.md](./IMPLEMENTATION_LOG.md) 참고

---

## ⚠️ 주의사항

### FSD 규칙 위반 시

1. **레이어 의존성 위반**: ESLint 에러 발생
2. **레거시 폴더 참조**: ESLint 에러 발생
3. **해결 방법**: 
   - `shared/ui/*` → 공통 UI 컴포넌트
   - `entities/*/ui/*` → 엔티티 UI 컴포넌트
   - `widgets/*/ui/*` → 위젯 UI 컴포넌트
   - `features/*/api/*` → 기능별 API

### 1440px 기준

- **타이포그래피**: `clamp(최소, vw, 최대px)`에서 최대값이 Figma 스펙
- **레이아웃**: `--container-max: 1440px`, `--layout-base-width: 1440px`
- **간격**: `clamp(px, vw, px)` 형태로 1440px 기준 vw 계산

---

## 📝 검증 명령어

```bash
# 빌드 검증
npm run build

# Lint 검증
npm run lint

# FSD 규칙 위반 확인
grep -r "from '@/components" src/
grep -r "from '@/config" src/
grep -r "from '@/services" src/
grep -r "from '@/utils" src/
```

---

## 🔄 다음 세션 시작 전 체크리스트

- [ ] **ReNew 문서 읽기**: [AGENT_GUIDE.md](./AGENT_GUIDE.md) 필수 확인
- [ ] Figma 1194-5866 디자인 확인 (MCP 또는 스크린샷)
- [ ] 관련 기존 코드 확인 (`codebase_search`, `grep`)
- [ ] FSD 규칙 문서 재확인 (`docs/FSD_ENFORCEMENT_RULES.md`)
- [ ] 구현 후 FSD 규칙 점검
- [ ] 빌드 및 린트 검증 (`npm run build`, `read_lints`)
- [ ] ReNew 문서 업데이트

---

## 📚 필수 참고 문서

1. **[AGENT_GUIDE.md](./AGENT_GUIDE.md)** – AI 에이전트 작업 가이드 (프로세스, FSD 규칙, 체크리스트)
2. **[FSD_COMPLIANCE_CHECK.md](./FSD_COMPLIANCE_CHECK.md)** – FSD 규칙 준수 점검 결과
3. **[FIGMA_DESIGN_SPEC.md](./FIGMA_DESIGN_SPEC.md)** – Figma 디자인 스펙
4. **[COMPONENT_SUMMARY.md](./COMPONENT_SUMMARY.md)** – 컴포넌트 매핑

---

*이 문서는 다음 AI 에이전트가 Figma 1194-5866 구현을 시작하기 전 필수 참고 자료입니다.*
