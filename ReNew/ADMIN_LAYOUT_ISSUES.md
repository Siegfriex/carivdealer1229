# Admin 레이아웃 현황 및 작업 명세

**작성일**: 2026-01-28  
**목적**: Admin 페이지 레이아웃·헤더·사이드바·1440px·design-tokens 혼재 정리 및 **실행·검증 가능한 작업 명세**  
**검증 기준**: 실제 코드베이스 (grep, list_dir)

---

## 1. 한 줄 요약

- **Auth**: PageLayout으로 정리됨 (Signup 전부 max-w-3xl).
- **Admin**: GNB는 **LandingHeader로 통일 완료** (커스텀 `<header>` 0건).  
  그러나 **전체 레이아웃/그리드가 한 시스템으로 통일됐다**고 보기는 어렵고, **페이지마다 컨테이너·메인 max-width·사이드바 사용이 여전히 상이**함.

---

## 2. Admin 페이지 전체 목록 (파일 기준)

다음 에이전트가 **“어디까지 손대야 하는지”** 한 번에 보이도록, 1440px/레이아웃 작업 대상 파일을 나열.

| # | 파일 | 비고 |
|---|------|------|
| 1 | `DashboardPage.tsx` | 1440px/레이아웃 대상 |
| 2 | `VehicleListPage.tsx` | 1440px/레이아웃 대상 |
| 3 | `VehicleDetailPage.tsx` | 1440px/레이아웃 대상 |
| 4 | `VehicleRegisterEntryPage.tsx` | 1440px/레이아웃 대상 |
| 5 | `VehicleRegisterStep1Page.tsx` | 1440px/레이아웃 대상 (이미 LAYOUT_CLASSES 사용) |
| 6 | `VehicleRegisterStep2Page.tsx` | 1440px/레이아웃 대상 |
| 7 | `VehicleRegistrationCompletePage.tsx` | 1440px/레이아웃 대상 |
| 8 | `InspectionListPage.tsx` | 1440px 적용됨, 레이아웃 정책 정합 대상 |
| 9 | `InspectionRequestLandingPage.tsx` | 1440px 적용됨 |
| 10 | `InspectionRequestStep1Page.tsx` | 1440px/레이아웃 대상 |
| 11 | `InspectionRequestStep2Page.tsx` | 1440px/레이아웃 대상 |
| 12 | `InspectionProgressPage.tsx` | 1440px/레이아웃 대상 (이미 LAYOUT_CLASSES 사용) |
| 13 | `InspectionCompletePage.tsx` | 1440px/레이아웃 대상 |
| 14 | `InspectionHistoryPage.tsx` | 1440px 적용됨 |
| 15 | `GeneralSaleOffersPage.tsx` | 1440px/레이아웃 대상 |
| 16 | `SalesHistoryPage.tsx` | 1440px/레이아웃 대상 |
| 17 | `SettlementListPage.tsx` | 1440px/레이아웃 대상 |
| 18 | `SettlementDetailPage.tsx` | 1440px/레이아웃 대상 |
| 19 | `LogisticsSchedulePage.tsx` | 1440px/레이아웃 대상 |
| 20 | `LogisticsHistoryPage.tsx` | 1440px/레이아웃 대상 |
| 21 | `GeneralSaleAnalyzingPage.tsx` | 1440px/레이아웃 대상 |
| 22 | `GeneralSalePricePage.tsx` | 1440px/레이아웃 대상 |
| 23 | `GeneralSaleCompletePage.tsx` | 1440px/레이아웃 대상 |
| 24 | `AuctionDetailPage.tsx` | 1440px/레이아웃 대상 |
| 25 | `AuctionStartPricePage.tsx` | 1440px/레이아웃 대상 |
| 26 | `AuctionDurationPage.tsx` | 1440px/레이아웃 대상 |
| 27 | `AuctionCompletePage.tsx` | 1440px/레이아웃 대상 |
| 28 | `LoginPage.tsx` | 레이아웃 정책 제외 가능 |
| 29 | `ForgotPasswordPage.tsx` | 레이아웃 정책 제외 가능 |

**총 29개** (레이아웃 작업 대상 **27개**, Auth 제외 **2개**).

---

## 3. 작업 전/후 검증 방법

### 3.1 1440px

- **완료 정의**: 뷰포트 1920px에서 콘텐츠가 **1440px 안에서만** 보인다 (가운데 정렬, 좌우 여백).
- **검증**: 브라우저 1920px로 열고, Admin 페이지별로 최상위 콘텐츠 래퍼가 `max-w-[1440px] mx-auto`(또는 `LAYOUT_CLASSES.CONTAINER`) 적용 여부 확인.

### 3.2 GNB 통일

- **완료 정의**: Admin 하위 **모든** 페이지에서 **LandingHeader만** 사용한다 (커스텀 `<header>` 0건).
- **검증 절차**:
  1. `rg "<header" src/pages/admin --glob "*.tsx"` → 0건이어야 함.
  2. `rg "LandingHeader" src/pages/admin --glob "*.tsx"` → Admin 페이지 수와 일치(또는 Auth 제외 27개에서 사용).

---

## 4. 목표 레이아웃 구조 (목표 상태)

**모든 Admin 페이지**: `LandingHeader` + (선택) 사이드바 + **1440px 래퍼** + `main`(역할별 max-width).

- **한 문장**: 페이지 최상위 래퍼에 `className={LAYOUT_CLASSES.CONTAINER}` 또는 동일 의미 클래스(`max-w-[1440px] mx-auto`)를 적용하고, main 내부는 역할별 max-width 규칙(아래 §7)을 따름.
- **코드 조각 예시**:  
  `className={LAYOUT_CLASSES.CONTAINER}` 또는 `className="max-w-[1440px] mx-auto"`

---

## 5. 완료된 작업 (이번 세션 반영)

| 항목 | 이전 | 현재 |
|------|------|------|
| Admin GNB | LandingHeader / Header / 커스텀 `<header>` 혼재 | **LandingHeader로 통일** (모든 admin 페이지) |
| 커스텀 `<header>` | 5개 페이지 | **0건** |

**LandingHeader로 교체한 페이지 (5개)**  
- `LogisticsHistoryPage.tsx` — activeNav="logistics"  
- `GeneralSaleOffersPage.tsx` — activeNav="offers"  
- `SalesHistoryPage.tsx` — activeNav="offers"  
- `SettlementListPage.tsx` — activeNav="settlements"  
- `SettlementDetailPage.tsx` — activeNav="settlements"

---

## 6. 선행 작업: 구조 선택 및 작업 순서

**1440px 래퍼를 일괄 적용하기 전에**, 대상 구조를 한 번 정하는 단계를 명시.

### 6.1 옵션 A: AdminLayout(또는 MainAppLayout) 도입

- **내용**: `AdminLayout` 컴포넌트를 먼저 만들고, **“GNB + (선택) 사이드바 + 1440px 래퍼 + main”** 을 한 번에 담당.
- **이후**: Admin 페이지는 `AdminLayout`만 쓰도록 점진 이전 (children, activeNav 등 props로 제어).

### 6.2 옵션 B: 컴포넌트 없이 페이지별 적용

- **내용**: 새 공통 레이아웃 컴포넌트 없이, 기존처럼 **페이지별로** `LAYOUT_CLASSES.CONTAINER` 등만 적용.
- **문서화**: “이번 단계에서는 옵션 B, 추후 AdminLayout 도입”처럼 명시 가능.

**선택 결과 (2026-01-30)**: **옵션 B** 적용. 페이지별 `LAYOUT_CLASSES.CONTAINER` 및 `MAIN_LIST`/`MAIN_DETAIL` 적용.

### 6.3 의존 관계 (작업 순서)

1. **1440px 래퍼**를 먼저 통일 (옵션 A면 AdminLayout 도입 후 적용, 옵션 B면 페이지별 `LAYOUT_CLASSES.CONTAINER` 적용).
2. 그 다음 **메인 max-width 정책**을 정하고, `layout.ts` 또는 문서에 규칙 반영 (§7).
3. 그 다음 **design-tokens**를 단계적으로 적용 (§10).  
   → “모든 페이지 한 번에”가 아니라 “새 레이아웃 + 일부 페이지부터” 범위 제한 권장.

---

## 7. 메인 max-width 규칙 (역할별)

역할별로 한 줄씩 규칙을 정해 두면, 다음 에이전트가 “이 페이지는 목록이니까 7xl”처럼 판단 가능.  
`layout.ts` 주석 및 아래 표로 고정.

| 역할 | 규칙 | Tailwind 예시 |
|------|------|----------------|
| **목록 페이지** | max-w-7xl (또는 full) | `LAYOUT_CLASSES.MAIN_LIST` 또는 `max-w-7xl` |
| **상세 / 스텝 / 완료** | max-w-4xl (또는 3xl) | `LAYOUT_CLASSES.MAIN_DETAIL` 또는 `max-w-4xl` |
| **모달 / 드로어** | 기존 유지 | — |

- **목록**: VehicleList, InspectionList, SalesHistory, SettlementList, LogisticsSchedule/History, GeneralSaleOffers 등.
- **상세·스텝·완료**: VehicleDetail, VehicleRegisterStep*, InspectionProgress, InspectionComplete, SettlementDetail, Auction/Sale 단계 페이지 등.

---

## 8. 사이드바: 언제 쓸지

### 8.1 권장 규칙

| 컴포넌트 | 사용 시점 |
|----------|-----------|
| **MainLandingSidebar** | 차량/검차/대시보드 등 **“메인 네비가 있는”** 목록·랜딩 페이지 (차량 목록, 검차 목록, 대시보드 등). |
| **ProgressSidebar** | 차량 등록 스텝, 검차 진행 등 **“단계 플로우”**만 있는 페이지. |
| **사이드바 없음** | 로그인, 비밀번호 찾기, 일부 완료/상세(선택). |

### 8.2 미사용 페이지에 대한 결정 옵션

- **탁송/정산/판매 내역** (LogisticsSchedule, LogisticsHistory, SettlementList/Detail, SalesHistory, GeneralSaleOffers)은 현재 사이드바 없음.
  - **(A)** MainLandingSidebar 추가  
  - **(B)** 유지 (사이드바 없음). **기획 확인 후 선택.**

---

## 9. design-tokens: 무엇을, 어디서 (1단계)

### 9.1 현재

- pages에서 `var(--*)` 레이아웃 사용 **0건**. “점진적 도입”만 있음.

### 9.2 1단계로 쓸 토큰 고정

| 용도 | 토큰 | 적용 예 |
|------|------|---------|
| **컨테이너** | `var(--container-max)` 또는 Tailwind 매핑 `max-w-[var(--layout-base-width)]` | 1440px 래퍼 |
| **간격** | `var(--space-4)`, `var(--space-6)` 등 | gap, padding에만 먼저 적용 |

### 9.3 적용 위치 (범위 제한)

- **옵션 1**: 새로 만드는 **AdminLayout / 공통 레이아웃 컴포넌트**에만 1단계 적용.
- **옵션 2**: 기존 페이지 중 **1440px 래퍼부터** 적용 (2~3페이지씩 적용 후 빌드/화면 확인).

→ “모든 페이지 한 번에”가 아니라 **“새 레이아웃 + 일부 페이지부터”** 로 범위를 제한하면 실행 가능.

---

## 10. 리스크·롤백 (한 줄씩)

| 리스크 | 대응 |
|--------|------|
| **1440px/레이아웃 일괄 적용** | 일부 페이지에서 스크롤/넓이 깨짐 가능 → **큰 화면(1920px) + 중간(1440px) + 리스트/테이블 페이지**만 미리 확인. |
| **AdminLayout 도입** | 기존 페이지가 레이아웃 컴포넌트에 넘기는 props(children, activeNav 등)가 제각각일 수 있음 → **먼저 사용처 목록(§2)과 props 패턴을 grep으로 정리한 뒤, 공통 인터페이스 설계.** |
| **롤백** | 한 번에 여러 페이지 말고, **2~3페이지씩 적용 후 빌드 + 화면 확인** 후 다음 페이지로 확대. |

---

## 11. 완료 기준 체크리스트

- [x] Admin 페이지 **27개** 모두 **1440px 래퍼** 적용 (옵션 B: 페이지별 `LAYOUT_CLASSES.CONTAINER`). (2026-01-30)
- [x] **메인 max-width 규칙**이 `layout.ts` 및 본 문서(§7)에 반영됨. (`MAIN_LIST` / `MAIN_DETAIL` 사용)
- [x] **LAYOUT_CLASSES** 사용처 27개 (대상 Admin 페이지 전부).
- [ ] (선택) **design-tokens 1단계** 적용 범위 및 파일 명시 (§9).

---

## 12. 참고 경로

| 항목 | 경로 |
|------|------|
| 레이아웃 상수 | `src/shared/config/layout.ts` |
| 디자인 토큰 | `src/shared/styles/design-tokens.css` |
| GNB | `src/widgets/Header/ui/LandingHeader.tsx` |
| 인수인계 | `ReNew/NEXT_AGENT_HANDOFF_FINAL.md` |

### LandingHeader activeNav 값 (GNB 일관성 검증용)

| activeNav | 의미 |
|-----------|------|
| `vehicles` | 차량목록 |
| `inspections` | 검차 |
| `offers` | 거래 |
| `logistics` | 탁송 |
| `settlements` | 정산 |

→ Admin 페이지별로 위 값 중 하나만 사용. 검증 시 `rg "activeNav=" src/pages/admin --glob "*.tsx"` 로 일관성 확인.

---

## 13. 요약: 보강 반영 내용

| # | 보강 내용 |
|---|-----------|
| 1 | Admin 페이지 전체 목록(§2) + 검증 방법(1440px, GNB)(§3) 명시 |
| 2 | 1440px 전에 “AdminLayout vs 페이지별 적용” 선택(§6) 및 작업 순서 명시 |
| 3 | 메인 max-width 역할별 규칙(§7)을 문서·layout.ts에 고정 |
| 4 | 사이드바 사용 규칙(§8) + 미사용 페이지에 대한 옵션 (A/B) |
| 5 | design-tokens 1단계: 쓸 토큰, 적용 위치, 범위 제한(§9) |
| 6 | 리스크(§10) + 롤백/단계 적용 한 줄씩 |
| 7 | 목표 구조(§4) + 완료 기준 체크리스트(§11) + activeNav 목록(§12) |

---

*마지막 업데이트: 2026-01-28 | 계획 초안 업그레이드: 검증·범위·선행 작업·max-width·사이드바·tokens·리스크·완료 기준 반영*
