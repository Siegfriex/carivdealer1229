# FSD_IA_NODEID_SSOT.md 무결성·정합성·일치성 검증 보고서

**검증 대상**: [FSD_IA_NODEID_SSOT.md](FSD_IA_NODEID_SSOT.md)  
**검증 일시**: 2026-02-11  
**검증 방법**: `list_dir`, `glob_file_search`, `grep`, `read_file` 기반 실제 코드베이스 대조  
**기준**: 실제 코드 우선 원칙, 문서-코드 일치성 검증

---

## 1. 실행 요약

| 구분 | 결과 | 비고 |
|------|------|------|
| **라우트 ↔ router.tsx** | ✅ 일치 | 문서 §1·§2.2의 모든 라우트가 router.tsx에 정의됨 |
| **페이지 컴포넌트 존재** | ✅ 일치 | 문서에 명시된 모든 페이지 컴포넌트 파일 존재 |
| **§4 코드 참조 경로** | ✅ 일치 | §4 Node 상세의 "코드 참조" 경로는 실제 파일 위치와 일치 |
| **§2.2 슬라이스(폴더)** | ⚠️ 부분 불일치 | 4건: LoginPage, VehicleListPage, Logistics* 페이지의 “슬라이스” 표기가 실제 폴더와 다름 |
| **FSD 레이어·widgets·features·entities** | ✅ 일치 | 디렉터리 구조 및 명칭 일치 (entity 하위 vehicle_file/inspection_place는 §2.4 보완 권장) |
| **mcp_outputs 43노드** | ✅ 일치 | docs/figmaMCP/mcp_outputs/ 하위 43개 nodeId 폴더 존재 |
| **FIGMASCR0208 폴더** | ✅ 일치 | 01~14 (05~07 제외) 폴더 존재, §6 대응 |

---

## 2. 검증 방법

- **라우트**: `src/app/router.tsx` 전체 읽기로 path·element 매핑 확인
- **페이지 파일**: `list_dir`로 `src/pages/` 하위 및 `glob **/*.tsx`로 파일 존재 확인
- **위젯/features/entities**: `list_dir`로 `src/widgets/`, `src/features/`, `src/entities/` 구조 확인
- **mcp_outputs**: `list_dir`로 `docs/figmaMCP/mcp_outputs/` 하위 폴더 개수·이름 확인
- **FIGMASCR0208**: `list_dir`로 `FIGMASCR0208/` 폴더 목록 확인

---

## 3. 라우트·페이지 컴포넌트 검증

### 3.1 router.tsx와 문서 §1·§2.2 대조

문서에 기재된 모든 경로와 대응 컴포넌트가 router.tsx에 정의되어 있음.

| 라우트 | 문서 페이지 컴포넌트 | 실제 import 경로 | 일치 |
|--------|----------------------|------------------|------|
| `/` | LandingPage | @/pages/landing/LandingPage | ✅ |
| `/login` | LoginPage | @/pages/admin/LoginPage | ✅ |
| `/signup`, `/signup/step1`~`step5`, `/signup/pending`, `/signup/complete` | SignupEntryPage, SignupStep1~5, SignupPending, SignupComplete | @/pages/auth/* | ✅ |
| `/forgot-password` | ForgotPasswordPage | @/pages/admin/ForgotPasswordPage | ✅ |
| `/dashboard` | DashboardPage | @/pages/admin/DashboardPage | ✅ |
| `/vehicles`, `/vehicles/new`, `/vehicles/new/step1`, `step2` | VehicleListPage, VehicleRegisterEntryPage, Step1/Step2 | @/pages/admin/*, admin/vehicle/* | ✅ |
| `/vehicles/:vehicleId/complete`, `:vehicleId` | VehicleRegistrationCompletePage, VehicleDetailPage | @/pages/admin/vehicle/* | ✅ |
| `/vehicles/:vehicleId/sale/*` | GeneralSaleAnalyzingPage, GeneralSalePricePage, GeneralSaleCompletePage | @/pages/admin/sale/* | ✅ |
| `/vehicles/:vehicleId/auction/*` | AuctionDetailPage, AuctionStartPricePage, AuctionDurationPage, AuctionCompletePage | @/pages/admin/auction/* | ✅ |
| `/vehicles/:vehicleId/trade` | TradeDetailPage | @/pages/admin/TradeDetailPage | ✅ |
| `/inspections`, `/inspections/request`, `request/step1`, `step2`, `/inspections/history` | InspectionListPage, InspectionRequestLandingPage, Step1/Step2, InspectionHistoryPage | @/pages/admin/inspection/* | ✅ |
| `/inspections/:inspectionId/progress`, `complete` | InspectionProgressPage, InspectionCompletePage | @/pages/admin/inspection/* | ✅ |
| `/offers`, `/offers/proposals` | TradeListPage, GeneralSaleOffersPage | @/pages/admin/* | ✅ |
| `/logistics/schedule`, `/logistics/history` | LogisticsSchedulePage, LogisticsHistoryPage | @/pages/admin/LogisticsSchedulePage, LogisticsHistoryPage | ✅ |
| `/sales/history`, `/settlements`, `/settlements/:settlementId` | SalesHistoryPage, SettlementListPage, SettlementDetailPage | @/pages/admin/* | ✅ |
| `/mypage/settlement-account` | SettlementAccountPage | @/pages/admin/mypage/SettlementAccountPage | ✅ |

**결론**: 라우트와 페이지 컴포넌트는 문서와 코드베이스와 **일치**함.

---

## 4. FSD 슬라이스(폴더) vs 실제 경로 — 불일치 4건

문서 §2.2 "슬라이스(폴더)" 열은 **디렉터리 경로**를 나타낸다고 해석할 때, 아래 4건은 실제 폴더 구조와 다름.

| 문서 §2.2 슬라이스 | 문서 페이지 | 실제 파일 경로 | 조치 제안 |
|--------------------|------------|----------------|-----------|
| auth | LoginPage | `pages/admin/LoginPage.tsx` | 슬라이스를 **admin**으로 수정 (또는 "auth(LoginPage 제외)" 등 명시) |
| admin/vehicle | VehicleListPage | `pages/admin/VehicleListPage.tsx` | 슬라이스를 **admin**으로 수정 |
| admin/logistics | LogisticsSchedulePage, LogisticsHistoryPage | `pages/admin/LogisticsSchedulePage.tsx`, `pages/admin/LogisticsHistoryPage.tsx` | 슬라이스를 **admin**으로 수정 (admin/logistics 폴더 없음) |
| admin | TradeListPage, GeneralSaleOffersPage, TradeDetailPage, SalesHistoryPage, SettlementListPage, SettlementDetailPage | 각각 `pages/admin/*.tsx` | ✅ 문서와 일치 |

**참고**: §4 Node 상세 매핑의 "코드 참조" 열은 이미 실제 경로(`pages/admin/LogisticsSchedulePage.tsx` 등)로 기재되어 있어 **정확함**. 수정이 필요한 것은 §2.2의 "슬라이스(폴더)" 표기뿐임.

---

## 5. FSD 레이어·위젯·features·entities 검증

### 5.1 레이어·디렉터리 (§2.1)

| 문서 | 실제 src/ 하위 | 일치 |
|------|----------------|------|
| app | app/ (router.tsx, providers, styles) | ✅ |
| pages | pages/ (landing, auth, admin) | ✅ |
| widgets | widgets/ | ✅ |
| features | features/ | ✅ |
| entities | entities/ | ✅ |
| shared | shared/ (api, config, context, lib, styles, ui) | ✅ |

### 5.2 widgets (§2.3)

문서: LandingHeader, Header, MainLandingSidebar, MypageSidebar, VehicleTable, ProgressSidebar, Sidebar.

- **실제**: Header/ui/에 `Header.tsx`, `LandingHeader.tsx` 공존. MainLandingSidebar, MypageSidebar, ProgressSidebar, Sidebar, VehicleTable 모두 해당 이름으로 존재.  
- **결론**: ✅ 일치.

### 5.3 features (§2.4)

문서: vehicle/register-form, inspection/request-form, auction/place-bid.

- **실제**: `features/vehicle/register-form/`, `features/inspection/request-form/`, `features/auction/place-bid/` 존재.  
- **결론**: ✅ 일치.

### 5.4 entities (§2.4)

문서: vehicle, vehicle_file(모델), inspection, inspection_place, auction, trade, logistics, settlement, member, seller_docs 등.

- **실제**: vehicle, inspection, auction, trade, logistics, settlement, member, seller_docs, address, listing, order, payment, review, cars_of_korea 등 **폴더** 존재.
- **vehicle_file**, **inspection_place**: entities 하위에 **동일 이름 폴더 없음**. 타입/스키마 수준 개념일 가능성 있음.
- **결론**: ✅ entities 목록은 일치. §2.4에서 "vehicle_file", "inspection_place"는 "모델/타입" 등으로 보완 기술 권장.

---

## 6. mcp_outputs 43노드 검증

문서 §0·§4: mcp_outputs 43노드.

- **실제**: `docs/figmaMCP/mcp_outputs/` 하위에 1033-4903, 1037-5126, … , 794-4708 등 **43개 nodeId 폴더** 존재 (README 제외).
- **결론**: ✅ 일치.

---

## 7. FIGMASCR0208 폴더 (§6)

문서 §6: 01_랜딩페이지, 02_회원가입_이전_GNB, 03_GNB_차량목록_탭, 04_GNB_검차_탭, 08_회원가입, 09~14.

- **실제**: `FIGMASCR0208/` 하위에 01, 02, 03, 04, 08, 09, 10, 11, 12, 13, 14 폴더 존재 (05~07 없음).
- **결론**: ✅ 문서 §6과 일치.

---

## 8. 보완 제안 요약

| 항목 | 위치 | 제안 |
|------|------|------|
| LoginPage 슬라이스 | §2.2 | "auth" → **admin** (실제: pages/admin/LoginPage.tsx) |
| VehicleListPage 슬라이스 | §2.2 | "admin/vehicle" → **admin** |
| LogisticsSchedulePage, LogisticsHistoryPage 슬라이스 | §2.2 | "admin/logistics" → **admin** |
| vehicle_file, inspection_place | §2.4 | "모델/타입 개념" 등으로 설명 보강 또는 entities 폴더와 구분 명시 |

---

## 9. 검증 완료 기준 충족 여부

| 기준 | 충족 |
|------|------|
| 문서의 라우트·페이지가 코드에 존재하는가 | ✅ |
| 문서의 FSD 레이어·슬라이스가 실제 디렉터리와 일치하는가 | ⚠️ §2.2 슬라이스 4건만 수정 시 일치 |
| 문서의 코드 참조(§4) 경로가 실제 파일과 일치하는가 | ✅ |
| mcp_outputs·FIGMASCR0208 개수·이름이 문서와 일치하는가 | ✅ |

**최종**: FSD_IA_NODEID_SSOT.md는 현 코드베이스와 **대부분 일치**하며, **§2.2 슬라이스(폴더) 4건 수정** 시 무결성·정합성·일치성이 완전히 맞춰짐.

---

## 10. 사후 조치 (2026-02-11)

- SSOT 문서 **1.1** 반영: §2.2 슬라이스를 실제 경로에 맞게 수정함 (LoginPage·VehicleListPage·Logistics* → admin, auth에서 LoginPage 제거). §2.4 entity 표기 정리. 검증 보고서 링크 추가.
- 위 보완 제안 4건은 **SSOT에 반영 완료**.
