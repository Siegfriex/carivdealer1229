# 프론트엔드 코드베이스: 라우트·스택·페이지·의존성 보고서

**작성일**: 2026-02-08  
**검증 방법**: `src/app/router.tsx`, `src/pages/**` import/navigate 검색, `package.json` 기준

---

## 1. 기술 스택 (Tech Stack)

| 구분 | 기술 | 버전 |
|------|------|------|
| **런타임** | React | ^19.2.3 |
| | React DOM | ^19.2.3 |
| **라우팅** | react-router-dom | ^7.13.0 |
| **빌드** | Vite | ^6.2.0 |
| | @vitejs/plugin-react | ^5.0.0 |
| **상태/데이터** | @tanstack/react-query | ^5.62.0 |
| | zustand | ^5.0.3 |
| **백엔드 연동** | firebase | ^10.13.0 |
| **AI** | @google/genai | ^1.34.0 |
| **UI/아이콘** | lucide-react | ^0.562.0 |
| **검증** | zod | ^3.24.1 |
| **언어** | TypeScript | ~5.8.2 |

- **엔트리**: `index.html` → `<script type="module" src="/src/app/main.tsx">`
- **앱 루트**: `main.tsx` → `ErrorBoundary` → `QueryProvider` → `ToastProvider` → `DevSkipProvider` → `Router`
- **라우터**: `BrowserRouter` + `Routes`/`Route`, 404 시 `Navigate to="/dashboard"`

---

## 2. 라우트 정의 (Router)

진입점: `src/app/router.tsx`. 모든 라우트는 단일 `Routes` 내에 선언됨.

### 2.1 라우트 목록 (경로 → 페이지 컴포넌트)

| 경로 | 페이지 컴포넌트 | 비고 |
|------|-----------------|------|
| `/` | LandingPage | 랜딩 |
| `/login` | LoginPage | |
| `/signup` | SignupEntryPage | |
| `/signup/step1` ~ `step5` | SignupStep1Page ~ SignupStep5Page | |
| `/signup/pending` | SignupPendingPage | |
| `/signup/complete` | SignupCompletePage | |
| `/dashboard` | DashboardPage | |
| `/vehicles` | VehicleListPage | |
| `/vehicles/new` | VehicleRegisterEntryPage | |
| `/vehicles/new/step1` | VehicleRegisterStep1Page | |
| `/vehicles/new/step2` | VehicleRegisterStep2Page | |
| `/vehicles/:vehicleId/complete` | VehicleRegistrationCompletePage | |
| `/vehicles/:vehicleId/sale/analyzing` | GeneralSaleAnalyzingPage | |
| `/vehicles/:vehicleId/sale/price` | GeneralSalePricePage | |
| `/vehicles/:vehicleId/sale/complete` | GeneralSaleCompletePage | |
| `/vehicles/:vehicleId/auction` | AuctionDetailPage | |
| `/vehicles/:vehicleId/auction/start-price` | AuctionStartPricePage | |
| `/vehicles/:vehicleId/auction/duration` | AuctionDurationPage | |
| `/vehicles/:vehicleId/auction/complete` | AuctionCompletePage | |
| `/vehicles/:vehicleId` | VehicleDetailPage | |
| `/forgot-password` | ForgotPasswordPage | |
| `/inspections` | InspectionListPage | |
| `/inspections/request` | InspectionRequestLandingPage | |
| `/inspections/request/step1` | InspectionRequestStep1Page | |
| `/inspections/request/step2` | InspectionRequestStep2Page | |
| `/inspections/history` | InspectionHistoryPage | |
| `/inspections/:inspectionId/progress` | InspectionProgressPage | |
| `/inspections/:inspectionId/complete` | InspectionCompletePage | |
| `/offers` | GeneralSaleOffersPage | |
| `/logistics/schedule` | LogisticsSchedulePage | |
| `/logistics/history` | LogisticsHistoryPage | |
| `/sales/history` | SalesHistoryPage | |
| `/settlements` | SettlementListPage | |
| `/settlements/:settlementId` | SettlementDetailPage | |
| `/mypage/settlement-account` | SettlementAccountPage | |
| `*` | Navigate to `/dashboard` | 404 폴백 |

**총 라우트 수**: 42개 (404 제외 41개)

---

## 3. 페이지 간 내비게이션 의존성

아래는 코드 상 `navigate(...)` 또는 `<Link to="...">`로 이동하는 관계만 정리한 것임.

### 3.1 랜딩·인증

| 출발 페이지 | 이동 대상 경로 |
|-------------|----------------|
| LandingPage | `/vehicles/new/step1` |
| SignupEntryPage | `/`, `/signup/step1` |
| SignupStep1Page | `/signup`, `/signup/step2` |
| SignupStep2Page | `/signup/step1`, `/signup/step3` |
| SignupStep3Page | `/signup/step2`, `/signup/step4` |
| SignupStep4Page | `/signup/step3`, `/signup/step5` |
| SignupStep5Page | `/signup/step4`, `/signup/pending` |
| SignupPendingPage | `/login`, `/signup/complete` |
| SignupCompletePage | `/dashboard` |
| LoginPage | `<Link to="/signup">`, `<Link to="/forgot-password">` |
| ForgotPasswordPage | `/login` |

### 3.2 차량·등록·완료

| 출발 페이지 | 이동 대상 |
|-------------|-----------|
| VehicleRegisterEntryPage | `/vehicles/new/step1` (쿼리: plateNumber) |
| VehicleRegisterStep1Page | `/vehicles`, `/vehicles?filter=draft`, `/vehicles/new/step2` |
| VehicleRegisterStep2Page | `/vehicles?filter=draft`, `/vehicles/:vehicleId/complete`, `navigate(-1)` |
| VehicleRegistrationCompletePage | `/vehicles`, `/inspections/request`, `/offers?type=auction`, `/offers?type=general` |
| VehicleDetailPage | `/vehicles`, `/vehicles/:vehicleId/auction`, `/offers?type=auction`, `/vehicles/:vehicleId/sale/analyzing`, `/offers?type=general` |
| VehicleListPage | `/vehicles/new/step1`, `/vehicles/:id` |
| DashboardPage | `/vehicles/new/step1`, `/vehicles/:id` |

### 3.3 판매(일반/경매)

| 출발 페이지 | 이동 대상 |
|-------------|-----------|
| GeneralSaleAnalyzingPage | `/vehicles/:id`, `/vehicles`, `/vehicles/:id/sale/price`, `/offers` |
| GeneralSalePricePage | `/vehicles/:id/sale/complete`, `/offers`, `/vehicles/:id/sale/analyzing`, `/vehicles` |
| GeneralSaleCompletePage | `/offers`, `/vehicles/:id`, `/vehicles` |
| AuctionDetailPage | `/vehicles`, `/vehicles/:id`, `/vehicles/:id/auction/start-price` |
| AuctionStartPricePage | `/vehicles/:id/auction/duration`, `/vehicles`, `/vehicles/:id/auction` |
| AuctionDurationPage | `/vehicles/:id/auction/complete`, `/vehicles`, `/vehicles/:id/auction/start-price` |
| AuctionCompletePage | `/vehicles/:id/auction`, `/vehicles`, `/offers` |

### 3.4 검차

| 출발 페이지 | 이동 대상 |
|-------------|-----------|
| InspectionRequestLandingPage | `/inspections/request/step1`, `/inspections` |
| InspectionRequestStep1Page | `/inspections/request/step2`, `navigate(-1)` |
| InspectionRequestStep2Page | `/inspections` (2곳), `navigate(-1)` |
| InspectionListPage | `/inspections/:id/progress?stage=...`, `/inspections/history`, `/inspections/request` |
| InspectionHistoryPage | `/inspections/:id/complete` |
| InspectionProgressPage | `/inspections/:id/progress` (replace), `/inspections/history`, `/inspections` |
| InspectionCompletePage | `/offers?type=auction`, `/offers?type=general` |

### 3.5 탁송·정산·기타

| 출발 페이지 | 이동 대상 |
|-------------|-----------|
| LogisticsSchedulePage | `/logistics/history` |
| LogisticsHistoryPage | `/logistics/schedule`, `/vehicles/:vehicleId` |
| SettlementListPage | `/settlements/:id` |
| SettlementDetailPage | `/logistics/schedule?vehicleId=...`, `/logistics/history` |
| SalesHistoryPage | `/vehicles/:id` |

- **LogisticsSectionTabs**: `NavLink`로 `/logistics/schedule`, `/logistics/history` 전환.
- **SettlementAccountPage**: 현재 라우트 이동 없음 (편집 뷰 라우트 주석 예정).

---

## 4. 페이지별 컴포넌트·모듈 임포트

페이지 → shared/widgets/entities/features/api 등 의존성만 정리. (react, react-router-dom, lucide-react 등 생략)

### 4.1 랜딩

| 페이지 | shared | widgets | entities | features |
|--------|--------|---------|----------|----------|
| LandingPage | Button, Typography, LAYOUT_CLASSES | LandingHeader | — | — |

### 4.2 인증 (auth)

| 페이지 | shared | widgets | entities | features |
|--------|--------|---------|----------|----------|
| SignupEntryPage | Button, Typography, PageLayout | — | — | — |
| SignupStep1Page | StepProgress, Input, Button, Select, PageLayout, DevSkipContext | — | — | — |
| SignupStep2Page | StepProgress, Input, Button, Select, PageLayout, DevSkipContext | — | — | — |
| SignupStep3Page | StepProgress, Input, Button, PageLayout, DevSkipContext | — | — | — |
| SignupStep4Page | StepProgress, Input, Button, PageLayout, DevSkipContext | — | — | — |
| SignupStep5Page | StepProgress, Checkbox, Button, PageLayout, Toast, DevSkipContext | — | — | — |
| SignupPendingPage | StepProgress, Button, PageLayout, DevSkipButton | — | — | — |
| SignupCompletePage | StepProgress, Button, PageLayout | — | — | — |

### 4.3 관리자 공통 (admin)

| 페이지 | shared | widgets | entities | features |
|--------|--------|---------|----------|----------|
| LoginPage | Button, Input | — | — | — |
| ForgotPasswordPage | Button | — | — | — |
| DashboardPage | LAYOUT_CLASSES, Button, Pagination | LandingHeader, MainLandingSidebar | vehicle (VehicleCard) | useVehicles |
| VehicleListPage | LAYOUT_CLASSES, SegmentedControl, Checkbox, Pagination | LandingHeader, MainLandingSidebar, VehicleTable | vehicle (VehicleCard, types) | useVehicles |
| SalesHistoryPage | LAYOUT_CLASSES | LandingHeader | — | — |
| SettlementListPage | LAYOUT_CLASSES | LandingHeader | — | — |
| SettlementDetailPage | LAYOUT_CLASSES | LandingHeader | — | — |
| GeneralSaleOffersPage | LAYOUT_CLASSES, apiClient, Toast | LandingHeader | — | — |

### 4.4 차량 (admin/vehicle)

| 페이지 | shared | widgets | entities | features |
|--------|--------|---------|----------|----------|
| VehicleRegisterEntryPage | LAYOUT_CLASSES, Button | LandingHeader | — | — |
| VehicleRegisterStep1Page | LAYOUT_CLASSES, Card, Input, Button, ImageUpload, DevSkipContext | LandingHeader, ProgressSidebar | vehicle (VehicleStatusBadge) | vehicleApi (ocrRegistration) |
| VehicleRegisterStep2Page | LAYOUT_CLASSES, StepProgress, Input, Select, Button, ImageUpload, DevSkipContext | LandingHeader | — | — |
| VehicleRegistrationCompletePage | LAYOUT_CLASSES, Card, Button, DevSkipButton | LandingHeader | — | — |
| VehicleDetailPage | LAYOUT_CLASSES, Button, Card | LandingHeader, MainLandingSidebar | vehicle (VehicleStatusBadge, constants) | useVehicle |

### 4.5 판매 (admin/sale)

| 페이지 | shared | widgets | entities | features |
|--------|--------|---------|----------|----------|
| GeneralSaleAnalyzingPage | LAYOUT_CLASSES, Button, Card, DevSkipButton | LandingHeader, MainLandingSidebar | — | — |
| GeneralSalePricePage | LAYOUT_CLASSES, Button, Card, Input, DevSkipButton | LandingHeader, MainLandingSidebar | — | — |
| GeneralSaleCompletePage | LAYOUT_CLASSES, Button, Card | LandingHeader, MainLandingSidebar | — | — |

### 4.6 경매 (admin/auction)

| 페이지 | shared | widgets | entities | features |
|--------|--------|---------|----------|----------|
| AuctionDetailPage | LAYOUT_CLASSES, Button, Card | LandingHeader, MainLandingSidebar | — | useVehicle |
| AuctionStartPricePage | LAYOUT_CLASSES, Button, Card, Input, DevSkipButton | LandingHeader, MainLandingSidebar | — | — |
| AuctionDurationPage | LAYOUT_CLASSES, Button, Card, Input, DevSkipButton | LandingHeader, MainLandingSidebar | — | — |
| AuctionCompletePage | LAYOUT_CLASSES, Button, Card | LandingHeader, MainLandingSidebar | — | — |

### 4.7 검차 (admin/inspection)

| 페이지 | shared | widgets | entities | features |
|--------|--------|---------|----------|----------|
| InspectionListPage | LAYOUT_CLASSES, Button, SegmentedControl | LandingHeader | inspection (InspectionStatusBadge, types) | — (mockInspectionList) |
| InspectionRequestLandingPage | LAYOUT_CLASSES, Button | LandingHeader | — | — |
| InspectionRequestStep1Page | LAYOUT_CLASSES, StepProgress, Input, Button, DevSkipContext | LandingHeader | — | — |
| InspectionRequestStep2Page | LAYOUT_CLASSES, StepProgress, Button, Card, DevSkipButton | LandingHeader | — | — |
| InspectionProgressPage | LAYOUT_CLASSES, Card, Button, DevSkipButton | LandingHeader, ProgressSidebar | — | — |
| InspectionCompletePage | LAYOUT_CLASSES, StepProgress, Card, Button, Carousel | LandingHeader | — | — |
| InspectionHistoryPage | LAYOUT_CLASSES | LandingHeader | — | — (mockInspectionList) |

### 4.8 탁송·마이페이지

| 페이지 | shared | widgets | entities | features |
|--------|--------|---------|----------|----------|
| LogisticsSchedulePage | LAYOUT_CLASSES, apiClient, Toast | LandingHeader, MainLandingSidebar | — | — |
| LogisticsHistoryPage | LAYOUT_CLASSES, Z_INDEX, apiClient, Toast | LandingHeader, MainLandingSidebar | — | — |
| LogisticsSectionTabs | — | — | — | — (NavLink만 사용) |
| SettlementAccountPage | LAYOUT_CLASSES, Button | LandingHeader, MypageSidebar | — | — |

---

## 5. 위젯·레이아웃 사용 패턴

| 위젯 | 사용 페이지 |
|------|-------------|
| **LandingHeader** | Landing, Signup 제외한 대부분 admin 페이지 (Dashboard, Vehicle*, Inspection*, Sale*, Auction*, Logistics*, Settlement*, GeneralSaleOffers, SalesHistory, SettlementAccount) |
| **MainLandingSidebar** | Dashboard, VehicleList, VehicleDetail, VehicleRegisterStep2 제외한 차량 플로우·판매·경매·탁송 (GeneralSale*, Auction*, Logistics*, VehicleRegistrationComplete 제외한 완료 페이지 등) |
| **ProgressSidebar** | VehicleRegisterStep1Page, InspectionProgressPage |
| **MypageSidebar** | SettlementAccountPage |
| **VehicleTable** | VehicleListPage |
| **LogisticsSectionTabs** | LogisticsSchedulePage, LogisticsHistoryPage (페이지 내부 컴포넌트) |

- **auth(회원가입)·Login·ForgotPassword**: Header/Sidebar 없이 PageLayout 또는 단순 레이아웃.
- **Landing**: LandingHeader만 사용.

---

## 6. Shared 의존성 요약

### 6.1 shared/config

- **LAYOUT_CLASSES** (`@/shared/config/layout`): 대부분 admin 페이지에서 메인/사이드바 레이아웃 클래스.
- **Z_INDEX** (`@/shared/config/zIndex`): LogisticsHistoryPage (모달 등).

### 6.2 shared/context

- **DevSkipContext** (`useDevSkip`): SignupStep1~5, VehicleRegisterStep1~2, InspectionRequestStep1, SignupPending 등에서 개발 스킵용.

### 6.3 shared/api

- **apiClient**: LogisticsSchedulePage, LogisticsHistoryPage, GeneralSaleOffersPage.

### 6.4 shared/ui (페이지에서 사용)

- Button, Input, Card, Checkbox, Select, StepProgress, Pagination, SegmentedControl, ImageUpload, PageLayout, Typography, Toast, DevSkipButton, Carousel, ErrorBoundary(앱 루트).

---

## 7. 페이지 간 의존성 다이어그램 (요약)

```
Landing → /vehicles/new/step1
Signup: Entry → step1 → … → step5 → pending → complete → /dashboard
Login ⇄ /signup, /forgot-password

Dashboard, VehicleList → /vehicles/new/step1, /vehicles/:id
VehicleRegister: Entry → step1 → step2 → /vehicles/:id/complete
  → 완료 후: /vehicles, /inspections/request, /offers
VehicleDetail → auction 플로우, sale 플로우, /vehicles

Auction: Detail → start-price → duration → complete → /vehicles/:id/auction | /offers
Sale: analyzing → price → complete → /offers | /vehicles/:id

Inspection: List ⇄ request (Landing → step1 → step2) → /inspections
  List → /inspections/:id/progress, /inspections/history
  History → /inspections/:id/complete
  Complete → /offers

Logistics: schedule ⇄ history (Tabs), History → /vehicles/:id
Settlements: List → Detail → /logistics/schedule|history
SalesHistory → /vehicles/:id
```

---

## 8. 특이사항·비고

1. **MainLandingSidebar**: 내부에서 `<a href="...">` 사용. SPA에서는 `<Link>` 또는 `navigate()`로 통일하는 것이 좋음.
2. **mockInspectionList**: InspectionListPage, InspectionHistoryPage에서 로컬 mock 데이터 및 타입 사용. entities/inspection 타입 참조.
3. **LogisticsSectionTabs**: 페이지가 아닌 `pages/admin/logistics/` 하위 컴포넌트로, LogisticsSchedulePage·LogisticsHistoryPage에서만 임포트.
4. **SettlementAccountPage**: 마이페이지 레이아웃(Header + MypageSidebar)만 사용, 현재 다른 라우트로 이동하는 버튼 없음.
5. **404**: 미매칭 경로는 모두 `/dashboard`로 리다이렉트.

---

**문서 버전**: 1.0  
**최종 검증**: 2026-02-08, `src/app/router.tsx` 및 `src/pages/**` grep/파일 목록 기준
