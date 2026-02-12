# CarivDealer Information Architecture (IA)

**목적**: CarivDealer 서비스의 정보구조·사이트맵·라우팅·메뉴 구조를 정의하는 IA 문서. SSOT 기반, 실제 코드베이스 검증 완료.

---

## §0 메타데이터·선언

| 항목 | 내용 |
|------|------|
| **버전** | 1.0 |
| **최종 검증** | 2026-02-12 |
| **데이터 소스** | CarivDealer_VID §4, FSD_IA_NODEID_SSOT, router.tsx |
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

### 2.1 GNB (Global Navigation Bar)

**위치**: `src/widgets/Header/ui/Header.tsx`

| 메뉴 | URL | 비고 |
|------|-----|------|
| 대시보드 | /dashboard | |
| 차량 관리 | /vehicles | 차량목록 |
| 탁송 관리 | /logistics/schedule | 탁송 스케줄 |
| 정산 관리 | /settlements | 정산 목록 |
| 사용자 메뉴 | (드롭다운) | 로그아웃 |

**권한**: 로그인 후 보호 영역에서만 노출. 비로그인 시 `/signup` 리다이렉트.

**모바일**: `md:hidden`으로 메뉴 버튼 표시, `onMenuClick` 핸들러.

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

| 파라미터 | 라우트 | 용도 |
|----------|--------|------|
| `filter` | /vehicles | `status`, `sale`, `logistics`, `settlement` — MainLandingSidebar 필터 |
| `stage` | /vehicles | `logistics` — 탁송단계 뷰 (FSD_IA_NODEID_SSOT) |
| `stage` | /inspections/:inspectionId/progress | `matching`, `en_route` — 검차 진행 단계 |
| `vehicleId` | /inspections/request | 검차 신청 시 차량 지정 |
| `vehicleId` | /logistics/schedule | 탁송 스케줄에서 차량 필터 |

**규칙**: VID Protocol 3 — URL as Single Source of Truth. 필터/탭/Step은 `useSearchParams`로 동기화.

---

## §4 FSD 슬라이스 ↔ 라우트 요약

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

## §5 참조

- **라우트 상세**: [CarivDealer_VID.md](CarivDealer_VID.md) §4
- **nodeId 매핑**: [FSD_IA_NODEID_SSOT.md](figma/FSD_IA_NODEID_SSOT.md) §4
- **routeManager**: [CarivDealer_VID.md](CarivDealer_VID.md) §5
