# CarivDealer Information Architecture (IA)

**목적**: CarivDealer 서비스의 정보구조·사이트맵·라우팅·메뉴 구조를 정의하는 IA 문서. SSOT 기반, 실제 코드베이스 검증 완료.

---

## §0 메타데이터·선언

| 항목 | 내용 |
|------|------|
| **버전** | 1.1 |
| **최종 검증** | 2026-02-12 |
| **데이터 소스** | CarivDealer_VID §4, FSD_IA_NODEID_SSOT, router.tsx, src/widgets, src/shared |
| **검증 방법** | grep, read_file, list_dir (코드베이스 기반 Fact) |
| **기준 문서** | [CarivDealer_VID.md](CarivDealer_VID.md), [FSD_IA_NODEID_SSOT.md](figma/FSD_IA_NODEID_SSOT.md) |

---

## §1 Overall Sitemap (사이트맵)

### 1.1 서비스 영역 구분

| 영역 | 설명 | 대표 라우트 |
|------|------|-------------|
| **Landing** | 비로그인 랜딩 페이지 | `/` |
| **Auth** | 로그인·회원가입·비밀번호 찾기 | `/login`, `/signup`, `/forgot-password` |
| **Admin** | 딜러 어드민 (차량·검차·거래·탁송·정산) | `/vehicles`, `/inspections`, `/offers`, `/logistics`, `/settlements` |
| **MyPage** | 마이페이지 (정산 계좌 등) | `/mypage/settlement-account` |

### 1.2 전체 사이트맵 (Tree)

```
/
├── / (Landing)
├── /login
├── /signup
│   ├── /signup/step1 ~ step5
│   ├── /signup/pending
│   └── /signup/complete
├── /forgot-password
│
└── [Protected]
    ├── /dashboard
    ├── /vehicles
    │   ├── /vehicles/new
    │   │   ├── /vehicles/new/step1
    │   │   └── /vehicles/new/step2
    │   ├── /vehicles/:vehicleId
    │   ├── /vehicles/:vehicleId/complete
    │   ├── /vehicles/:vehicleId/sale/analyzing
    │   ├── /vehicles/:vehicleId/sale/price
    │   ├── /vehicles/:vehicleId/sale/complete
    │   ├── /vehicles/:vehicleId/auction
    │   ├── /vehicles/:vehicleId/auction/start-price
    │   ├── /vehicles/:vehicleId/auction/duration
    │   ├── /vehicles/:vehicleId/auction/complete
    │   └── /vehicles/:vehicleId/trade
    ├── /inspections
    │   ├── /inspections/request
    │   │   ├── /inspections/request/step1
    │   │   └── /inspections/request/step2
    │   ├── /inspections/history
    │   ├── /inspections/:inspectionId/progress
    │   └── /inspections/:inspectionId/complete
    ├── /offers
    │   ├── /offers
    │   └── /offers/proposals
    ├── /logistics/schedule
    ├── /logistics/history
    ├── /sales/history
    ├── /settlements
    ├── /settlements/:settlementId
    └── /mypage
        └── /mypage/settlement-account
```

---

## §2 Menu Structure & GNB/LNB

### 2.0 Layout Mapping (Route Group | Layout Component | 특징)

**코드 검증**: `src/app/router.tsx`에는 `AuthLayout`, `AdminLayout` 등의 전역 레이아웃 래퍼가 없음. `src/app/layouts/*` 폴더 부재. 레이아웃은 **페이지 컴포넌트 내부에서 조합**됨.

| Route Group | Route Wrapper | 페이지 레이아웃 조합 | 특징 |
|-------------|---------------|----------------------|------|
| **공개** | 없음 | 페이지별 | LandingPage: LandingHeader(variant=landing). Login/Signup/ForgotPassword: 각자 구조 |
| **보호** | `<ProtectedRoute />` | LandingHeader(variant=main) + 아래 조합 | ProtectedRoute는 `<Outlet />`만 렌더(인증 시). 레이아웃 래퍼 아님 |
| 보호·차량목록 | ProtectedRoute | LandingHeader + GnbListLayout(sidebar=vehicles) | MainLandingSidebar 사용 |
| 보호·거래목록 | ProtectedRoute | LandingHeader + GnbListLayout(sidebar=minimal) | GnbMinimalSidebar, sectionTitle='거래' |
| 보호·검차목록 | ProtectedRoute | LandingHeader + GnbListLayout(sidebar=minimal) | GnbMinimalSidebar, sectionTitle='검차' |
| 보호·탁송 | ProtectedRoute | LandingHeader + GnbListLayout(sidebar=minimal) | GnbMinimalSidebar, sectionTitle='탁송' |
| 보호·정산목록 | ProtectedRoute | LandingHeader | 사이드바 없음 |
| 보호·정산상세 | ProtectedRoute | LandingHeader + GnbMinimalSidebar | sectionTitle='정산' |
| 보호·스텝 플로우 | ProtectedRoute | LandingHeader + ProgressSidebar | VehicleRegister, InspectionRequest, Auction, Sale 가격/기간 |
| 보호·마이페이지 | ProtectedRoute | LandingHeader + MypageSidebar | SettlementAccountPage |
| 보호·대시보드 | ProtectedRoute | LandingHeader + MainLandingSidebar | 별도 GnbListLayout 없음 |

**출처**: `VehicleListPage.tsx`, `TradeListPage.tsx`, `InspectionListPage.tsx`, `LogisticsSchedulePage.tsx`, `SettlementListPage.tsx`, `SettlementDetailPage.tsx`, `SettlementAccountPage.tsx`, `DashboardPage.tsx`, `LandingHeader.tsx`, `GnbListLayout.tsx`

### 2.1 GNB (Global Navigation Bar)

**위치**: `src/widgets/Header/ui/LandingHeader.tsx` (admin 페이지 공통. `Header.tsx`는 별도)

**NAV_ITEMS** (코드 상수):

| 메뉴 | URL | 비고 |
|------|-----|------|
| 차량목록 | /vehicles | |
| 검차 | /inspections | |
| 거래 | /offers | |
| 탁송 | /logistics/schedule | |
| 정산 | /settlements | |
| 사용자 메뉴 | (드롭다운) | 로그아웃 |
| 매물 등록하기 | (CTA) | `onRegisterListing` 또는 `/vehicles/new` |

**variant**: `landing` | `main`. admin 페이지는 `variant="main"`. **activeNav**: `vehicles` | `inspections` | `offers` | `logistics` | `settlements`

**권한**: 로그인 후 보호 영역에서만 노출. 비로그인 시 `/signup` 리다이렉트.

### 2.2 LNB (Local Navigation Bar) — MainLandingSidebar

**위치**: `src/widgets/MainLandingSidebar/ui/MainLandingSidebar.tsx`

**사용 페이지**: VehicleListPage (차량목록 탭). GnbListLayout sidebar type `vehicles`일 때 사용.

| 항목 | href | activeKey |
|------|------|-----------|
| 전체 | /vehicles | all |
| 차량 상태 | /vehicles?filter=status | status |
| 판매/거래 단계 | /vehicles?filter=sale | sale |
| 탁송 단계 | /vehicles?filter=logistics | logistics |
| 정산 | /vehicles?filter=settlement | settlement |

**추가 기능**: 검색 (차량번호/모델명), `searchValue`, `onSearchChange`.

### 2.3 GnbMinimalSidebar (LNB 변형)

**위치**: `src/widgets/GnbMinimalSidebar/ui/GnbMinimalSidebar.tsx`

**사용 페이지**: 검차·거래·탁송·정산 탭 (MainLandingSidebar 외). `sectionTitle`, `searchValue`, `searchPlaceholder` props.

### 2.4 Mobile Navigation

**현재 구현**: Header의 `Menu` 아이콘 + `onMenuClick` 콜백. 별도 햄버거 메뉴 패널 구현 여부는 페이지별 상이.

---

## §3 Routing & URL Schema

### 3.1 Page ID & URL Map

router.tsx 기준. **공개 11개, 보호 30개(리다이렉트 1 포함), 폴백 1개.**

| 구분 | URL | 페이지 컴포넌트 | import 경로 |
|------|-----|-----------------|-------------|
| 공개 | `/` | LandingPage | @/pages/landing/LandingPage |
| 공개 | `/login` | LoginPage | @/pages/admin/LoginPage |
| 공개 | `/signup` | SignupEntryPage | @/pages/auth/SignupEntryPage |
| 공개 | `/signup/step1`~`step5` | SignupStep1Page~Step5Page | @/pages/auth/SignupStep1Page~Step5Page |
| 공개 | `/signup/pending` | SignupPendingPage | @/pages/auth/SignupPendingPage |
| 공개 | `/signup/complete` | SignupCompletePage | @/pages/auth/SignupCompletePage |
| 공개 | `/forgot-password` | ForgotPasswordPage | @/pages/admin/ForgotPasswordPage |
| 보호 | `/dashboard` | DashboardPage | @/pages/admin/DashboardPage |
| 보호 | `/vehicles` | VehicleListPage | @/pages/admin/VehicleListPage |
| 보호 | `/vehicles/new` | VehicleRegisterEntryPage | @/pages/admin/vehicle/VehicleRegisterEntryPage |
| 보호 | `/vehicles/new/step1` | VehicleRegisterStep1Page | @/pages/admin/vehicle/VehicleRegisterStep1Page |
| 보호 | `/vehicles/new/step2` | VehicleRegisterStep2Page | @/pages/admin/vehicle/VehicleRegisterStep2Page |
| 보호 | `/vehicles/:vehicleId/complete` | VehicleRegistrationCompletePage | @/pages/admin/vehicle/VehicleRegistrationCompletePage |
| 보호 | `/vehicles/:vehicleId/sale/analyzing` | GeneralSaleAnalyzingPage | @/pages/admin/sale/GeneralSaleAnalyzingPage |
| 보호 | `/vehicles/:vehicleId/sale/price` | GeneralSalePricePage | @/pages/admin/sale/GeneralSalePricePage |
| 보호 | `/vehicles/:vehicleId/sale/complete` | GeneralSaleCompletePage | @/pages/admin/sale/GeneralSaleCompletePage |
| 보호 | `/vehicles/:vehicleId/auction` | AuctionDetailPage | @/pages/admin/auction/AuctionDetailPage |
| 보호 | `/vehicles/:vehicleId/auction/start-price` | AuctionStartPricePage | @/pages/admin/auction/AuctionStartPricePage |
| 보호 | `/vehicles/:vehicleId/auction/duration` | AuctionDurationPage | @/pages/admin/auction/AuctionDurationPage |
| 보호 | `/vehicles/:vehicleId/auction/complete` | AuctionCompletePage | @/pages/admin/auction/AuctionCompletePage |
| 보호 | `/vehicles/:vehicleId/trade` | TradeDetailPage | @/pages/admin/trade/TradeDetailPage |
| 보호 | `/vehicles/:vehicleId` | VehicleDetailPage | @/pages/admin/vehicle/VehicleDetailPage |
| 보호 | `/inspections` | InspectionListPage | @/pages/admin/inspection/InspectionListPage |
| 보호 | `/inspections/request` | InspectionRequestLandingPage | @/pages/admin/inspection/InspectionRequestLandingPage |
| 보호 | `/inspections/request/step1` | InspectionRequestStep1Page | @/pages/admin/inspection/InspectionRequestStep1Page |
| 보호 | `/inspections/request/step2` | InspectionRequestStep2Page | @/pages/admin/inspection/InspectionRequestStep2Page |
| 보호 | `/inspections/history` | InspectionHistoryPage | @/pages/admin/inspection/InspectionHistoryPage |
| 보호 | `/inspections/:inspectionId/progress` | InspectionProgressPage | @/pages/admin/inspection/InspectionProgressPage |
| 보호 | `/inspections/:inspectionId/complete` | InspectionCompletePage | @/pages/admin/inspection/InspectionCompletePage |
| 보호 | `/offers` | TradeListPage | @/pages/admin/trade/TradeListPage |
| 보호 | `/offers/proposals` | GeneralSaleOffersPage | @/pages/admin/sale/GeneralSaleOffersPage |
| 보호 | `/logistics/schedule` | LogisticsSchedulePage | @/pages/admin/logistics/LogisticsSchedulePage |
| 보호 | `/logistics/history` | LogisticsHistoryPage | @/pages/admin/logistics/LogisticsHistoryPage |
| 보호 | `/sales/history` | SalesHistoryPage | @/pages/admin/sale/SalesHistoryPage |
| 보호 | `/settlements` | SettlementListPage | @/pages/admin/settlement/SettlementListPage |
| 보호 | `/settlements/:settlementId` | SettlementDetailPage | @/pages/admin/settlement/SettlementDetailPage |
| 보호 | `/mypage` | (Navigate) | `/mypage/settlement-account` 리다이렉트 |
| 보호 | `/mypage/settlement-account` | SettlementAccountPage | @/pages/admin/mypage/SettlementAccountPage |
| 폴백 | `*` | (Navigate) | `/vehicles` |

### 3.2 Parameter Policy (URL Query Parameter)

**코드 검증**: `useSearchParams` 사용처 — VehicleListPage, TradeListPage, InspectionListPage, InspectionHistoryPage, InspectionProgressPage, LogisticsSchedulePage, LogisticsHistoryPage, GeneralSaleAnalyzingPage, VehicleRegisterStep1Page, LoginPage, SignupEntryPage

| Key | Route | Valid Values | 설명 |
|-----|-------|--------------|------|
| `filter` | /vehicles | `all`, `draft`, `completed`, `status`, `sale`, `logistics`, `settlement` | VehicleListPage. MainLandingSidebar 링크와 연동. `all`이면 파라미터 삭제 |
| `stage` | /vehicles | `logistics` | NODE 1362-36169. `?stage=logistics` = 탁송단계 필터 (`filter=logistics`와 동일) |
| `view` | /vehicles | `grid`, `list` | VehicleListPage. 기본 `grid`. `grid`이면 파라미터 삭제 |
| `q` | /vehicles | (문자열) | VehicleListPage. 차량번호/모델명 검색 |
| `needsAttention` | /vehicles | `1` | VehicleListPage. 주의 필요 체크 시 |
| `filter` | /offers | `all`, `general`, `auction`, `done` | TradeListPage. 전체/일반거래/경매거래/거래완료 |
| `view` | /offers | `grid`, `list` | TradeListPage. 기본 `grid` |
| `view` | /inspections | `list`, `card` | InspectionListPage. `card`일 때만 `?view=card` set |
| `view` | /inspections/history | `list`, `card` | InspectionHistoryPage |
| `stage` | /inspections/:inspectionId/progress | `matching`, `en_route`, `complete` | InspectionProgressPage. 검차 진행 단계. 유효하지 않으면 `matching` |
| `vehicleId` | /inspections/request | (문자열) | VehicleRegisterStep1Page `plateNumber`와 별개. 검차 신청 시 차량 지정 |
| `vehicleId` | /logistics/schedule | (문자열) | LogisticsSchedulePage. 탁송 스케줄 차량 필터 |
| `view` | /logistics/history | `list`, `grid` | LogisticsHistoryPage. 기본 `list` |
| `type` | /vehicles/:vehicleId/sale/analyzing | `auction`, (null) | GeneralSaleAnalyzingPage. `auction`이면 시세분석 스텝 스킵 |
| `plateNumber` | /vehicles/new/step1 | (문자열) | VehicleRegisterStep1Page. 등록원부 조회용 |
| `redirect` | /signup, /login | (URL 인코딩) | ProtectedRoute 비로그인 시 `?redirect={pathname+search}`. 로그인 후 복귀용 |
| `devLogin` | (전역) | `1` | AuthContext. 로그인 우회(개발용). `carivdealer_logged_out` 있으면 무시 |

**규칙**: VID Protocol 3 — URL as Single Source of Truth. 필터/탭/Step은 `useSearchParams`로 동기화.

**출처**: `VehicleListPage.tsx` (FILTER_PARAM, STAGE_PARAM, VIEW_PARAM, Q_PARAM, NEEDS_ATTENTION_PARAM), `TradeListPage.tsx`, `InspectionListPage.tsx`, `InspectionProgressPage.tsx`, `LogisticsSchedulePage.tsx`, `LogisticsHistoryPage.tsx`, `GeneralSaleAnalyzingPage.tsx`, `VehicleRegisterStep1Page.tsx`, `AuthContext.tsx`

---

## §4 FSD 슬라이스 ↔ 라우트 요약

### 4.1 Breadcrumb & Hierarchy (URL Depth 기반)

**코드 검증**: `router.tsx`는 flat Route 구조. 중첩 Route 없음. 논리적 브레드크럼은 URL path 깊이와 IA 구조로 도출.

| URL | Breadcrumb |
|-----|------------|
| `/` | Home |
| `/login`, `/signup`, `/forgot-password` | 인증 |
| `/dashboard` | 대시보드 |
| `/vehicles` | 차량 관리 > 차량 목록 |
| `/vehicles/new` | 차량 관리 > 매물 등록 |
| `/vehicles/new/step1`, `step2` | 차량 관리 > 매물 등록 > Step 1/2 |
| `/vehicles/:vehicleId` | 차량 관리 > 차량 상세 |
| `/vehicles/:vehicleId/complete` | 차량 관리 > 차량 상세 > 등록 완료 |
| `/vehicles/:vehicleId/sale/analyzing` | 차량 관리 > 차량 상세 > 판매방식 선택 |
| `/vehicles/:vehicleId/sale/price` | 차량 관리 > 차량 상세 > 판매가 설정 |
| `/vehicles/:vehicleId/sale/complete` | 차량 관리 > 차량 상세 > 판매 완료 |
| `/vehicles/:vehicleId/auction` | 차량 관리 > 차량 상세 > 경매 상세 |
| `/vehicles/:vehicleId/auction/start-price` | 차량 관리 > 차량 상세 > 경매 시작가 |
| `/vehicles/:vehicleId/auction/duration` | 차량 관리 > 차량 상세 > 경매 기간 |
| `/vehicles/:vehicleId/auction/complete` | 차량 관리 > 차량 상세 > 경매 완료 |
| `/vehicles/:vehicleId/trade` | 차량 관리 > 차량 상세 > 거래 상세 |
| `/inspections` | 검차 > 검차 요청 내역 |
| `/inspections/request` | 검차 > 검차 신청 |
| `/inspections/request/step1`, `step2` | 검차 > 검차 신청 > Step 1/2 |
| `/inspections/history` | 검차 > 검차 내역 |
| `/inspections/:inspectionId/progress` | 검차 > 검차 진행 |
| `/inspections/:inspectionId/complete` | 검차 > 검차 완료 |
| `/offers` | 거래 > 거래 목록 |
| `/offers/proposals` | 거래 > 제안 목록 |
| `/logistics/schedule` | 탁송 > 탁송 스케줄 |
| `/logistics/history` | 탁송 > 탁송 내역 |
| `/sales/history` | 정산 > 판매 내역 |
| `/settlements` | 정산 > 정산 목록 |
| `/settlements/:settlementId` | 정산 > 정산 상세 |
| `/mypage/settlement-account` | 마이페이지 > 정산 계좌 |

### 4.2 FSD 슬라이스 ↔ 라우트

| 슬라이스 | 라우트 | 페이지 |
|----------|--------|--------|
| landing | `/` | LandingPage |
| auth | `/signup`, `/signup/step1`~`step5`, `/signup/pending`, `/signup/complete` | SignupEntryPage, SignupStep1~5, SignupPendingPage, SignupCompletePage |
| admin | `/login`, `/dashboard`, `/forgot-password` | LoginPage, DashboardPage, ForgotPasswordPage |
| admin | `/vehicles`, `/vehicles/new`, `/vehicles/new/step1`, `step2`, … | VehicleListPage, VehicleRegisterEntryPage, VehicleRegisterStep1Page, Step2Page, … |
| admin/vehicle | `/vehicles/:vehicleId/complete`, `/vehicles/:vehicleId` | VehicleRegistrationCompletePage, VehicleDetailPage |
| admin/inspection | `/inspections`, `/inspections/request`, … | InspectionListPage, InspectionRequestLandingPage, … |
| admin/sale | `/vehicles/:vehicleId/sale/*`, `/offers/proposals`, `/sales/history` | GeneralSaleAnalyzingPage, GeneralSaleOffersPage, SalesHistoryPage |
| admin/auction | `/vehicles/:vehicleId/auction/*` | AuctionDetailPage, AuctionStartPricePage, … |
| admin/trade | `/offers`, `/vehicles/:vehicleId/trade` | TradeListPage, TradeDetailPage |
| admin/logistics | `/logistics/schedule`, `/logistics/history` | LogisticsSchedulePage, LogisticsHistoryPage |
| admin/settlement | `/settlements`, `/settlements/:settlementId` | SettlementListPage, SettlementDetailPage |
| admin/mypage | `/mypage/settlement-account` | SettlementAccountPage |

---

## §5 Error & Redirects

**코드 검증**: `router.tsx`, `AuthContext.tsx` (ProtectedRoute), `routeManager.ts`

### 5.1 Catch-all (404)

| 상황 | 처리 | 코드 위치 |
|------|------|-----------|
| 미매칭 경로 | `Navigate to="/vehicles" replace` | `router.tsx` `path="*"` |
| FALLBACK_ROUTE | `/vehicles` | `routeManager.ts` (vehicleId 비정상 시 반환) |

### 5.2 비로그인 접근 (403-equivalent)

| 상황 | 처리 | 코드 위치 |
|------|------|-----------|
| 보호 라우트 + !isAuthenticated | `Navigate to="/signup?redirect={encodeURIComponent(pathname+search)}" replace` | `AuthContext.tsx` ProtectedRoute |
| state | `{ from: location }` 전달 (로그인 후 복귀용) | ProtectedRoute |

**인증 판단**: `localStorage.carivdealer_auth === 'true'` 또는 `?devLogin=1` (단, `carivdealer_logged_out` 있으면 devLogin 무시)

### 5.3 내부 리다이렉트

| 경로 | 대상 | 코드 위치 |
|------|------|-----------|
| `/mypage` | `/mypage/settlement-account` | `router.tsx` `path="/mypage" element={<Navigate to="..." replace />}` |

### 5.4 403 (권한 없음) 명시 처리

**코드 검증**: `AuthContext`, `router.tsx` 내 `403` 또는 `Forbidden` 처리 없음. 역할 기반 접근 제어(RBAC) 미구현.

### 5.5 routeManager 폴백

| 조건 | 향할 경로 |
|------|-----------|
| vehicleId 빈 문자열/잘못된 형식 | FALLBACK_ROUTE (`/vehicles`) |
| status 미등록 | `/vehicles/:vehicleId` |

---

## §6 참조

- **라우트 상세**: [CarivDealer_VID.md](CarivDealer_VID.md) §4
- **nodeId 매핑**: [FSD_IA_NODEID_SSOT.md](figma/FSD_IA_NODEID_SSOT.md) §4
- **routeManager**: [CarivDealer_VID.md](CarivDealer_VID.md) §5
- **의존 문서**: [CarivDealer_DOCUMENT_SUITE_INDEX.md](CarivDealer_DOCUMENT_SUITE_INDEX.md) — 문서 스위트 의존성
