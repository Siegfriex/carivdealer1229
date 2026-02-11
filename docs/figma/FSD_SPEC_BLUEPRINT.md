# FSD 기능명세 블루프린트 (완성도 문서)

> **DEPRECATED (2026-02-11)**  
> 이 문서는 [FSD_IA_NODEID_SSOT.md](FSD_IA_NODEID_SSOT.md)로 통합·대체되었습니다.  
> mcp_outputs 43노드 기반 Node 상세 매핑 및 코드 검증 결과는 SSOT 문서를 참조하세요.

---

**목적**: 전체 사이트맵 구조, IA 기능명세(§4), FIGMASCR0208 스크린샷·Figma 노드, **현재 코드베이스 FSD 구조**를 한 문서에 정렬한 블루프린트. 기능명세·디자인·구현의 단일 참조 지점.

**기준 문서**: [IA_SITEMAP_SPEC_IPOE.md](IA_SITEMAP_SPEC_IPOE.md), [FIGMASCR0208](../../FIGMASCR0208/), `src/` (FSD 레이어).

---

## 1. 전체 사이트맵 구조 (IA §3 요약)

| 경로/탭 | nodeId (대표) | 노드(화면) 라벨 | 라우트 (코드 기준) |
|---------|---------------|------------------|---------------------|
| / 랜딩 | 1368-37201, 1368-43715 | 랜딩 3단계 | `/` |
| 회원가입 이전 GNB | 1425-8153 | 나의매물목록_회원가입유도 | (비로그인 시 `/vehicles` 등 → 리다이렉트) |
| GNB 차량목록 탭 | 1425-8153, 8420, 12046, 8636, 8842 | 사이드 필터별 5뷰 | `/vehicles` |
| GNB 검차 탭 | 1425-9445 | 검차요청내역_리스트_변형 | `/inspections`, `/inspections/history` |
| GNB 거래 탭 | 1714-22332 | (컨테이너) | `/vehicles`, `/offers` |
| GNB 탁송 탭 | 1714-22874 | (컨테이너) | `/logistics/schedule`, `/logistics/history` |
| GNB 정산 탭 | 1714-23139 | (컨테이너) | `/settlements`, `/sales/history` |
| / 회원가입 | 1425-7280~7496, 1513-12032, 11607 | 로그인~Step5~승인대기 | `/login`, `/signup`, `/signup/step1`~`step5`, `/signup/pending` |
| 매물등록 CTA_1 | 1418-20498, 1418-20576 | 차량등록 → 원부등록 → 완료 | `/vehicles/new`, `/vehicles/new/step1`, `step2`, `/vehicles/:id/complete` |
| 매물등록 CTA_2 | 1444-8198, 1425-10137, 10813, 10285 | 검차신청 → 매칭/완료 → 결과요약 | `/inspections/request`, `request/step1`, `step2`, `/inspections/:id/progress`, `complete` |
| 매물등록 CTA_3 | 1418-20498, 23705, 23880, 24679, 21690 | 판매방식·경매·거래상세 | `/vehicles/:id/sale/*`, `/vehicles/:id/auction/*`, `/vehicles/:id/trade` |
| 매물등록 CTA_4 | 1418-22630, 25400, 25219 등 | 탁송 목록·예약·기사배정 | `/logistics/schedule`, `/logistics/history` |
| 매물등록 CTA_5 | 1418-27434, 36405 | 정산현황·정산목록 | `/settlements`, `/settlements/:id`, `/sales/history` |
| 마이페이지 | 1418-36766, 37804, 37677, 37170, 37042, 36901, 37559, 37298 | 내프로필·사이드바 페이지 | `/mypage/settlement-account` 등 |

---

## 2. 현재 코드베이스 FSD 구조

### 2.1 레이어·디렉터리 요약

| FSD 레이어 | 경로 | 설명 |
|------------|------|------|
| **app** | `src/app/` | 라우터(router.tsx), 프로바이더, 전역 스타일 |
| **pages** | `src/pages/` | 페이지 단위: landing, auth, admin(vehicle, inspection, sale, auction, logistics, mypage, …) |
| **widgets** | `src/widgets/` | Header, LandingHeader, MainLandingSidebar, MypageSidebar, ProgressSidebar, Sidebar, VehicleTable |
| **features** | `src/features/` | auction/place-bid, inspection/request-form, vehicle/register-form |
| **entities** | `src/entities/` | vehicle, inspection, auction, trade, logistics, settlement, member, seller_docs, address, listing, order, payment, review 등 |
| **shared** | `src/shared/` | api, config, context, lib, styles, ui |

### 2.2 pages 슬라이스 ↔ 라우트

| 슬라이스(폴더) | 라우트 | 페이지 컴포넌트 |
|----------------|--------|-----------------|
| landing | `/` | LandingPage |
| auth | `/login`, `/signup`, `/signup/step1`~`step5`, `/signup/pending`, `/signup/complete` | LoginPage, SignupEntryPage, SignupStep1Page~Step5Page, SignupPendingPage, SignupCompletePage |
| admin | `/dashboard`, `/forgot-password` | DashboardPage, ForgotPasswordPage |
| admin/vehicle | `/vehicles`, `/vehicles/new`, `/vehicles/new/step1`, `step2`, `/vehicles/:vehicleId/complete`, `/vehicles/:vehicleId` | VehicleListPage, VehicleRegisterEntryPage, VehicleRegisterStep1Page, Step2Page, VehicleRegistrationCompletePage, VehicleDetailPage |
| admin/inspection | `/inspections`, `/inspections/request`, `request/step1`, `step2`, `/inspections/history`, `/inspections/:id/progress`, `complete` | InspectionListPage, InspectionRequestLandingPage, InspectionRequestStep1Page, Step2Page, InspectionHistoryPage, InspectionProgressPage, InspectionCompletePage |
| admin/sale | `/vehicles/:id/sale/analyzing`, `price`, `complete` | GeneralSaleAnalyzingPage, GeneralSalePricePage, GeneralSaleCompletePage |
| admin/auction | `/vehicles/:id/auction`, `auction/start-price`, `duration`, `complete` | AuctionDetailPage, AuctionStartPricePage, AuctionDurationPage, AuctionCompletePage |
| admin | `/offers`, `/offers/proposals`, `/vehicles/:id/trade` | TradeListPage, GeneralSaleOffersPage, TradeDetailPage |
| admin/logistics | `/logistics/schedule`, `/logistics/history` | LogisticsSchedulePage, LogisticsHistoryPage |
| admin | `/sales/history`, `/settlements`, `/settlements/:id` | SalesHistoryPage, SettlementListPage, SettlementDetailPage |
| admin/mypage | `/mypage/settlement-account` | SettlementAccountPage |

### 2.3 widgets 사용처

| 위젯 | 사용 페이지/레이아웃 |
|------|---------------------|
| LandingHeader | 랜딩, 로그인/회원가입 |
| Header | (어드민 공통) |
| MainLandingSidebar | 차량목록, 검차, 거래, 탁송, 정산 탭(메인 레이아웃) |
| MypageSidebar | 마이페이지 |
| VehicleTable | VehicleListPage 등 목록 |
| ProgressSidebar, Sidebar | 플로우/레이아웃에 따라 사용 |

### 2.4 features · entities 요약

| feature | 용도 | entities 의존 |
|---------|------|----------------|
| vehicle/register-form | 차량 등록 폼·API | vehicle |
| inspection/request-form | 검차 신청 폼·API | inspection |
| auction/place-bid | 경매 입찰·즉시구매 | auction |

| entity | 용도 |
|--------|------|
| vehicle, vehicle_file (모델) | 차량·파일 |
| inspection, inspection_place | 검차 |
| auction, trade, logistics, settlement | 경매·거래·탁송·정산 |
| member, seller_docs | 회원·딜러 서류 |

---

## 3. IA §4 ↔ FSD 레이어·슬라이스 ↔ 라우트 매핑

| IA §4 | FSD 레이어/슬라이스 | 대표 라우트 | 페이지 컴포넌트 (예) |
|-------|---------------------|-------------|----------------------|
| 4.1 랜딩 | pages/landing | `/` | LandingPage |
| 4.2 회원가입 이전 GNB | pages(공통)·widgets(MainLandingSidebar) | (비로그인 시) | VehicleListPage 등 + 리다이렉트/회원가입유도 |
| 4.3 GNB 차량목록 | pages/admin + vehicle-list | `/vehicles` | VehicleListPage |
| 4.4 GNB 검차 | pages/admin/inspection | `/inspections`, `/inspections/history` | InspectionListPage, InspectionHistoryPage |
| 4.5~4.7 거래/탁송/정산 탭 | pages/admin (trade, logistics, settlement) | `/offers`, `/logistics/*`, `/settlements`, `/sales/history` | TradeListPage, LogisticsSchedulePage, SettlementListPage, SalesHistoryPage |
| 4.8 회원가입 | pages/auth | `/login`, `/signup/*` | LoginPage, SignupEntryPage, SignupStep1~5, SignupPendingPage |
| 4.9 CTA_1 차량원부등록 | pages/admin/vehicle + features/vehicle/register-form | `/vehicles/new`, `/vehicles/new/step1`, `step2`, `/:id/complete` | VehicleRegisterEntryPage, VehicleRegisterStep1Page, Step2Page, VehicleRegistrationCompletePage |
| 4.10 CTA_2 검차 | pages/admin/inspection + features/inspection/request-form | `/inspections/request`, `request/step1`, `step2`, `/:id/progress`, `complete` | InspectionRequestLandingPage, Step1/Step2, InspectionProgressPage, InspectionCompletePage |
| 4.11 CTA_3 거래 | pages/admin/sale, admin/auction, admin | `/vehicles/:id/sale/*`, `/vehicles/:id/auction/*`, `/vehicles/:id/trade` | GeneralSaleAnalyzingPage, AuctionStartPricePage 등, TradeDetailPage |
| 4.12 CTA_4 탁송 | pages/admin/logistics | `/logistics/schedule`, `/logistics/history` | LogisticsSchedulePage, LogisticsHistoryPage |
| 4.13 CTA_5 정산 | pages/admin | `/settlements`, `/settlements/:id`, `/sales/history` | SettlementListPage, SettlementDetailPage, SalesHistoryPage |
| 4.14 마이페이지 | pages/admin/mypage + widgets/MypageSidebar | `/mypage/settlement-account` 등 | SettlementAccountPage 등 |

---

## 4. 추적성 요약 (목표·스크린샷·Figma·코드)

- **목표·요구**: [IA_SITEMAP_SPEC_IPOE.md](IA_SITEMAP_SPEC_IPOE.md) §4 각 절의 I·P·O·E.
- **스크린샷**: [FIGMASCR0208](../../FIGMASCR0208/) — 폴더 01~14, 파일명 `§3.x_nodeId_화면명.png`.
- **Figma 노드**: 동일 nodeId로 URL `https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id={nodeId}`. IA 문서의 "참조 이미지(전체 노드)" 표에 스크린샷·Figma 노드 컬럼으로 정렬됨.
- **코드**: 위 §2·§3의 pages/widgets/features/entities 및 `src/app/router.tsx` 라우트 정의.

Verification 문서와 nodeId 불일치 가능성은 [IA_SITEMAP_SPEC_IPOE.md §5](IA_SITEMAP_SPEC_IPOE.md#5-figma-nodeid-정합성-verification-문서와의-불일치) 참고.

---

## 5. 문서 이력

| 버전 | 일자 | 비고 |
|------|------|------|
| 1.0 | 2026-02-09 | 전체 사이트맵, 코드베이스 FSD 구조, IA§4↔FSD↔라우트 매핑, 추적성 요약 |
