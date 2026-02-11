# FSD · IA · nodeId 통합 SSOT (단일 참조 지점)

**목적**: 전체 사이트맵 구조, IA 기능명세(§4), FIGMASCR0208 스크린샷·Figma 노드, **현재 코드베이스 FSD 구조**를 한 문서에 정렬. 기능명세·디자인·구현의 단일 참조 지점.

**기준 문서**: [IA_SITEMAP_SPEC_IPOE.md](IA_SITEMAP_SPEC_IPOE.md), [FIGMASCR0208](../../FIGMASCR0208/), `src/` (FSD 레이어), [mcp_outputs](../figmaMCP/mcp_outputs/).

---

## §0 메타데이터·SSOT 선언

| 항목 | 내용 |
|------|------|
| **버전** | 1.1 |
| **최종 검증** | 2026-02-11 |
| **데이터 소스** | mcp_outputs(43노드), router.tsx, FSD 구조, FIGMASCR0208 |
| **검증 방법** | grep, list_dir, read_file |
| **대체** | [FSD_SPEC_BLUEPRINT.md](FSD_SPEC_BLUEPRINT.md) |
| **검증 보고서** | [FSD_IA_NODEID_SSOT_VERIFICATION_REPORT.md](FSD_IA_NODEID_SSOT_VERIFICATION_REPORT.md) |

---

## §1 전체 사이트맵 구조 (IA §3)

| 경로/탭 | nodeIds (mcp_outputs) | 노드(화면) 라벨 | 라우트 (router.tsx) |
|---------|------------------------|------------------|---------------------|
| / 랜딩 | 1444-7928, 1368-37364 | 랜딩 로그인전·로그인후 | `/` |
| 회원가입 이전 GNB | 1425-8153 | 나의매물목록_회원가입유도 | (비로그인 시 `/vehicles` 등 → 리다이렉트) |
| GNB 차량목록 탭 | 1425-8153, 1362-36169, 1636-10115 | 사이드 필터별 5뷰·탁송단계·그리드 | `/vehicles`, `/vehicles?stage=logistics` |
| GNB 검차 탭 | 1037-5126, 1037-5673, 1042-4681 | 검차요청내역_리스트_변형 | `/inspections`, `/inspections/history` |
| GNB 거래 탭 | 1714-22332 | (컨테이너) | `/offers` |
| GNB 탁송 탭 | 1714-22874, 1272-12926 | (컨테이너)·탁송 리스트 | `/logistics/schedule`, `/logistics/history` |
| GNB 정산 탭 | (1714-23139) | (컨테이너) | `/settlements`, `/sales/history` |
| / 회원가입 | (mcp_outputs 없음) | 로그인~Step5~승인대기 | `/login`, `/signup`, `/signup/step1`~`step5`, `/signup/pending` |
| 매물등록 CTA_1 | 1425-7638, 1425-7684 | 차량등록 진입·원부등록 | `/vehicles/new`, `/vehicles/new/step1`, `step2`, `/vehicles/:vehicleId/complete` |
| 매물등록 CTA_2 | 1033-4903, 1121-5308, 1193-8343, 1193-8120, 1193-9217, 1425-10137, 1425-10813, 1425-10285 | 검차신청 Step1·매칭·이동중·완료·결과요약 | `/inspections/request`, `request/step1`, `step2`, `/inspections/:inspectionId/progress`, `complete` |
| 매물등록 CTA_3 | 794-3704, 794-4015, 794-4200, 794-4371, 794-4107, 794-4708, 794-4542, 1123-13580, 1123-20023, 1123-20699, 1123-13763, 1123-13487, 1123-14112, 1123-13946, 1302-27093, 1302-27289 | 판매방식·시세분석·가격·거래상세·경매·모달 | `/vehicles/:vehicleId/sale/*`, `/vehicles/:vehicleId/auction/*`, `/vehicles/:vehicleId/trade` |
| 매물등록 CTA_4 | 1272-13294, 1272-13503, 1272-13819, 1272-14309, 1272-14540, 1272-15049, 1272-13099 | 탁송 목록·예약 폼·월/시간 선택·주소검색·기사배정·완료 | `/logistics/schedule`, `/logistics/history` |
| 매물등록 CTA_5 | (mcp_outputs 없음) | 정산현황·정산목록 | `/settlements`, `/settlements/:settlementId`, `/sales/history` |
| 마이페이지 | (mcp_outputs 없음) | 내프로필·사이드바 페이지 | `/mypage/settlement-account` |

---

## §2 FSD 구조 (레이어·슬라이스·라우트)

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
| auth | `/signup`, `/signup/step1`~`step5`, `/signup/pending`, `/signup/complete` | SignupEntryPage, SignupStep1Page~Step5Page, SignupPendingPage, SignupCompletePage |
| admin | `/login`, `/dashboard`, `/forgot-password` | LoginPage, DashboardPage, ForgotPasswordPage |
| admin | `/vehicles`, `/vehicles/new`, `/vehicles/new/step1`, `step2`, `/vehicles/:vehicleId/complete`, `/vehicles/:vehicleId` | VehicleListPage, VehicleRegisterEntryPage, VehicleRegisterStep1Page, Step2Page, VehicleRegistrationCompletePage, VehicleDetailPage |
| admin/inspection | `/inspections`, `/inspections/request`, `request/step1`, `step2`, `/inspections/history`, `/inspections/:inspectionId/progress`, `complete` | InspectionListPage, InspectionRequestLandingPage, InspectionRequestStep1Page, Step2Page, InspectionHistoryPage, InspectionProgressPage, InspectionCompletePage |
| admin/sale | `/vehicles/:vehicleId/sale/analyzing`, `price`, `complete` | GeneralSaleAnalyzingPage, GeneralSalePricePage, GeneralSaleCompletePage |
| admin/auction | `/vehicles/:vehicleId/auction`, `auction/start-price`, `duration`, `complete` | AuctionDetailPage, AuctionStartPricePage, AuctionDurationPage, AuctionCompletePage |
| admin | `/offers`, `/offers/proposals`, `/vehicles/:vehicleId/trade` | TradeListPage, GeneralSaleOffersPage, TradeDetailPage |
| admin | `/logistics/schedule`, `/logistics/history` | LogisticsSchedulePage, LogisticsHistoryPage |
| admin | `/sales/history`, `/settlements`, `/settlements/:settlementId` | SalesHistoryPage, SettlementListPage, SettlementDetailPage |
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
|---------|------|---------------|
| vehicle/register-form | 차량 등록 폼·API | vehicle |
| inspection/request-form | 검차 신청 폼·API | inspection |
| auction/place-bid | 경매 입찰·즉시구매 | auction |

| entity | 용도 |
|--------|------|
| vehicle (모델: types, schema) | 차량·파일 |
| inspection | 검차 |
| auction, trade, logistics, settlement | 경매·거래·탁송·정산 |
| member, seller_docs | 회원·딜러 서류 |

---

## §3 IA §4 ↔ FSD 레이어·슬라이스 ↔ 라우트

| IA §4 | FSD 레이어/슬라이스 | 대표 라우트 | 페이지 컴포넌트 | mcp_outputs nodeIds |
|-------|---------------------|-------------|-----------------|---------------------|
| 4.1 랜딩 | pages/landing | `/` | LandingPage | 1444-7928, 1368-37364 |
| 4.2 회원가입 이전 GNB | pages(공통)·widgets(MainLandingSidebar) | (비로그인 시) | VehicleListPage 등 | 1425-8153 |
| 4.3 GNB 차량목록 | pages/admin | `/vehicles`, `/vehicles?stage=logistics` | VehicleListPage | 1425-8153, 1362-36169, 1636-10115 |
| 4.4 GNB 검차 | pages/admin/inspection | `/inspections`, `/inspections/history` | InspectionListPage, InspectionHistoryPage | 1037-5126, 1037-5673, 1042-4681 |
| 4.5~4.7 거래/탁송/정산 탭 | pages/admin (trade, logistics, settlement) | `/offers`, `/logistics/*`, `/settlements`, `/sales/history` | TradeListPage, LogisticsSchedulePage, SettlementListPage, SalesHistoryPage | 1714-22332, 1714-22874, 1272-12926 |
| 4.8 회원가입 | pages/auth | `/login`, `/signup/*` | LoginPage, SignupEntryPage, SignupStep1~5, SignupPendingPage | — |
| 4.9 CTA_1 차량원부등록 | pages/admin/vehicle + features/vehicle/register-form | `/vehicles/new`, `/vehicles/new/step1`, `step2`, `/:vehicleId/complete` | VehicleRegisterEntryPage, VehicleRegisterStep1Page, Step2Page, VehicleRegistrationCompletePage | 1425-7638, 1425-7684 |
| 4.10 CTA_2 검차 | pages/admin/inspection + features/inspection/request-form | `/inspections/request`, `request/step1`, `step2`, `/:inspectionId/progress`, `complete` | InspectionRequestLandingPage, Step1/Step2, InspectionProgressPage, InspectionCompletePage | 1033-4903, 1121-5308, 1193-8343, 1193-8120, 1193-9217, 1425-10137, 1425-10813, 1425-10285 |
| 4.11 CTA_3 거래 | pages/admin/sale, admin/auction, admin | `/vehicles/:vehicleId/sale/*`, `/vehicles/:vehicleId/auction/*`, `/vehicles/:vehicleId/trade` | GeneralSaleAnalyzingPage, AuctionStartPricePage 등, TradeDetailPage | 794-3704, 794-4015, 794-4200, 794-4371, 794-4107, 794-4708, 794-4542, 1123-13580, 1123-20023, 1123-20699, 1123-13763, 1123-13487, 1123-14112, 1123-13946, 1302-27093, 1302-27289 |
| 4.12 CTA_4 탁송 | pages/admin/logistics | `/logistics/schedule`, `/logistics/history` | LogisticsSchedulePage, LogisticsHistoryPage | 1272-13294, 1272-13503, 1272-13819, 1272-14309, 1272-14540, 1272-15049, 1272-13099 |
| 4.13 CTA_5 정산 | pages/admin | `/settlements`, `/settlements/:settlementId`, `/sales/history` | SettlementListPage, SettlementDetailPage, SalesHistoryPage | — |
| 4.14 마이페이지 | pages/admin/mypage + widgets/MypageSidebar | `/mypage/settlement-account` 등 | SettlementAccountPage 등 | — |

---

## §4 Node 상세 매핑 (mcp_outputs 43개)

| nodeId | 타입 | IA 라벨 | 경로/탭 | IA 절 | 라우트 | 쿼리 | 페이지 | 슬라이스 | 코드 참조 | FIGMASCR 폴더 | FIGMASCR 파일 |
|--------|------|---------|---------|-------|--------|------|--------|----------|------------|---------------|---------------|
| 1033-4903 | page | 검차 신청 Step1 | 매물등록 CTA_2 | 4.10 | /inspections/request/step1 | — | InspectionRequestStep1Page | admin/inspection | pages/admin/inspection/InspectionRequestStep1Page.tsx | 10_매물등록_CTA_2_검차 | 미등록 |
| 1037-5126 | page | 검차요청내역 리스트 | GNB 검차 탭 | 4.4 | /inspections | — | InspectionListPage | admin/inspection | pages/admin/inspection/InspectionListPage.tsx | 10_매물등록_CTA_2_검차 | 미등록 |
| 1037-5673 | page | 검차요청내역 선택 카드+상세 | GNB 검차 탭 | 4.4 | /inspections | — | InspectionListPage | admin/inspection | pages/admin/inspection/InspectionListPage.tsx | 10_매물등록_CTA_2_검차 | 미등록 |
| 1042-4681 | page | 검차요청내역 헤더+카드 | GNB 검차 탭 | 4.4 | /inspections | — | InspectionListPage | admin/inspection | pages/admin/inspection/InspectionListPage.tsx | 10_매물등록_CTA_2_검차 | 미등록 |
| 1121-5308 | page | 검차자 매칭중 | 매물등록 CTA_2 | 4.10 | /inspections/:inspectionId/progress | ?stage=matching | InspectionProgressPage | admin/inspection | pages/admin/inspection/InspectionProgressPage.tsx, widgets/InspectionScheduleBlock | 10_매물등록_CTA_2_검차 | 미등록 |
| 1123-13487 | page | 판매전환완료 (경매) | 매물등록 CTA_3 | 4.11 | /vehicles/:vehicleId/auction/complete | — | AuctionCompletePage | admin/auction | pages/admin/auction/AuctionCompletePage.tsx | 11_매물등록_CTA_3_거래 | 미등록 |
| 1123-13580 | page | 경매 사전 설정 | 매물등록 CTA_3 | 4.11 | /vehicles/:vehicleId/auction/start-price | — | AuctionStartPricePage | admin/auction | pages/admin/auction/AuctionStartPricePage.tsx | 11_매물등록_CTA_3_거래 | 미등록 |
| 1123-13763 | page | 경매 기간/연월일시 입력완료 | 매물등록 CTA_3 | 4.11 | /vehicles/:vehicleId/auction/duration | — | AuctionDurationPage | admin/auction | pages/admin/auction/AuctionDurationPage.tsx | 11_매물등록_CTA_3_거래 | 미등록 |
| 1123-13946 | page | 거래상세 경매 펼쳐지는 뷰 | 매물등록 CTA_3 | 4.11 | /vehicles/:vehicleId/trade | — | TradeDetailPage | admin | pages/admin/TradeDetailPage.tsx | 11_매물등록_CTA_3_거래 | 미등록 |
| 1123-14112 | page | 거래상세 경매-1 (컨테이너 펼침) | 매물등록 CTA_3 | 4.11 | /vehicles/:vehicleId/trade | — | TradeDetailPage | admin | pages/admin/TradeDetailPage.tsx | 11_매물등록_CTA_3_거래 | 미등록 |
| 1123-20023 | page | 경매 기간/연월일시 | 매물등록 CTA_3 | 4.11 | /vehicles/:vehicleId/auction/duration | — | AuctionDurationPage | admin/auction | pages/admin/auction/AuctionDurationPage.tsx | 11_매물등록_CTA_3_거래 | 미등록 |
| 1123-20699 | page | 경매 연월일시 입력 | 매물등록 CTA_3 | 4.11 | /vehicles/:vehicleId/auction/duration | — | AuctionDurationPage | admin/auction | pages/admin/auction/AuctionDurationPage.tsx | 11_매물등록_CTA_3_거래 | 미등록 |
| 1193-8120 | page | 검차완료! 내역 확인 | 매물등록 CTA_2 | 4.10 | /inspections/:inspectionId/complete | — | InspectionCompletePage | admin/inspection | pages/admin/inspection/InspectionCompletePage.tsx | 10_매물등록_CTA_2_검차 | 미등록 |
| 1193-8343 | page | 검차자 이동중 | 매물등록 CTA_2 | 4.10 | /inspections/:inspectionId/progress | ?stage=en_route | InspectionProgressPage | admin/inspection | pages/admin/inspection/InspectionProgressPage.tsx | 10_매물등록_CTA_2_검차 | 미등록 |
| 1193-9217 | page | 검차내역 (검차완료 시 상세) | 매물등록 CTA_2 | 4.10 | /inspections/:inspectionId/complete | — | InspectionCompletePage | admin/inspection | pages/admin/inspection/InspectionCompletePage.tsx, shared/ui/Carousel.tsx | 10_매물등록_CTA_2_검차 | 미등록 |
| 1272-12926 | page | 판매/거래목록→탁송 리스트 | 매물등록 CTA_4 | 4.12 | /logistics/schedule | — | LogisticsSchedulePage | admin/logistics | pages/admin/LogisticsSchedulePage.tsx | 12_매물등록_CTA_4_탁송 | 미등록 |
| 1272-13099 | page | 탁송완료 | 매물등록 CTA_4 | 4.12 | /logistics/schedule | — | LogisticsSchedulePage | admin/logistics | pages/admin/LogisticsSchedulePage.tsx | 12_매물등록_CTA_4_탁송 | 미등록 |
| 1272-13294 | page | 새 탁송예약 폼 | 매물등록 CTA_4 | 4.12 | /logistics/schedule | — | LogisticsSchedulePage | admin/logistics | pages/admin/LogisticsSchedulePage.tsx | 12_매물등록_CTA_4_탁송 | 미등록 |
| 1272-13503 | page | 새탁송예약 연도 캘린더 | 매물등록 CTA_4 | 4.12 | /logistics/schedule | — | LogisticsSchedulePage | admin/logistics | pages/admin/LogisticsSchedulePage.tsx | 12_매물등록_CTA_4_탁송 | 미등록 |
| 1272-13819 | page | 새탁송예약 월 선택 | 매물등록 CTA_4 | 4.12 | /logistics/schedule | — | LogisticsSchedulePage | admin/logistics | pages/admin/LogisticsSchedulePage.tsx | 12_매물등록_CTA_4_탁송 | 미등록 |
| 1272-14309 | page | 새탁송예약 시간 선택 | 매물등록 CTA_4 | 4.12 | /logistics/schedule | — | LogisticsSchedulePage | admin/logistics | pages/admin/LogisticsSchedulePage.tsx | 12_매물등록_CTA_4_탁송 | 미등록 |
| 1272-14540 | page | 주소검색 모달·주소결과 | 매물등록 CTA_4 | 4.12 | /logistics/schedule | — | LogisticsSchedulePage | admin/logistics | pages/admin/LogisticsSchedulePage.tsx | 12_매물등록_CTA_4_탁송 | 미등록 |
| 1272-15049 | page | 탁송 기사배정 진행중 | 매물등록 CTA_4 | 4.12 | /logistics/schedule | — | LogisticsSchedulePage | admin/logistics | pages/admin/LogisticsSchedulePage.tsx | 12_매물등록_CTA_4_탁송 | 미등록 |
| 1302-27093 | page | 판매방식 변경·판매가 수정 | 매물등록 CTA_3 | 4.11 | /vehicles/:vehicleId/trade | — | TradeDetailPage | admin | pages/admin/TradeDetailPage.tsx | 11_매물등록_CTA_3_거래 | 미등록 |
| 1302-27289 | modal | 검차 상세내역 모달 | 매물등록 CTA_3 | 4.11 | /vehicles/:vehicleId/trade | — | TradeDetailPage | admin | pages/admin/TradeDetailPage.tsx | 11_매물등록_CTA_3_거래 | 미등록 |
| 1362-36169 | page | 차량목록 탭 탁송단계 필터 | GNB 차량목록 탭 | 4.3 | /vehicles | ?stage=logistics | VehicleListPage | admin | pages/admin/VehicleListPage.tsx | 03_GNB_차량목록_탭 | 미등록 |
| 1368-37364 | page | 랜딩 (로그인 후 동일 구조) | / 랜딩 | 4.1 | / | — | LandingPage | landing | pages/landing/LandingPage.tsx, widgets/* | 01_랜딩페이지 | 미등록 |
| 1425-10137 | page | 검차진행 매칭중 | 매물등록 CTA_2 | 4.10 | /inspections/:inspectionId/progress | ?stage=matching | InspectionProgressPage | admin/inspection | pages/admin/inspection/InspectionProgressPage.tsx | 10_매물등록_CTA_2_검차 | §3.6_1425-10137_검차진행_매칭중*.png |
| 1425-10285 | page | 검차결과요약 | 매물등록 CTA_2 | 4.10 | /inspections/:inspectionId/complete | — | InspectionCompletePage | admin/inspection | pages/admin/inspection/InspectionCompletePage.tsx | 10_매물등록_CTA_2_검차 | §3.6_1425-10285_검차결과요약*.png |
| 1425-10813 | page | 검차진행 완료 (이동중) | 매물등록 CTA_2 | 4.10 | /inspections/:inspectionId/progress | ?stage=en_route | InspectionProgressPage | admin/inspection | pages/admin/inspection/InspectionProgressPage.tsx | 10_매물등록_CTA_2_검차 | §3.6_1425-10813_검차진행_완료.png |
| 1425-7638 | page | 매물등록버튼 클릭 시 첫화면 | 매물등록 CTA_1 | 4.9 | /vehicles/new | — | VehicleRegisterEntryPage | admin/vehicle | pages/admin/vehicle/VehicleRegisterEntryPage.tsx | 09_매물등록_CTA_1_차량원부등록 | 미등록 |
| 1425-7684 | page | 차량 원부등록 (2단계) | 매물등록 CTA_1 | 4.9 | /vehicles/new/step1 | — | VehicleRegisterStep1Page | admin/vehicle | pages/admin/vehicle/VehicleRegisterStep1Page.tsx | 09_매물등록_CTA_1_차량원부등록 | 미등록 |
| 1425-8153 | page | 나의매물목록_회원가입유도/전체 | GNB 차량목록 탭 | 4.2, 4.3 | /vehicles | — | VehicleListPage | admin | pages/admin/VehicleListPage.tsx | 02_회원가입_이전_GNB, 03_GNB_차량목록_탭 | §3.7_1425-8153_나의매물목록_*.png |
| 1444-7928 | page | 랜딩 로그인 전 프로토타입 | / 랜딩 | 4.1 | / | — | LandingPage | landing | pages/landing/LandingPage.tsx, widgets/* | 01_랜딩페이지 | 미등록 |
| 1636-10115 | component | 전체 차량목록 그리드 (VehicleCard) | GNB 차량목록 탭 | 4.3 | /vehicles | — | VehicleListPage | admin | pages/admin/VehicleListPage.tsx, entities/vehicle | 03_GNB_차량목록_탭 | 미등록 |
| 1714-22332 | page | GNB 거래 탭 리스팅 | GNB 거래 탭 | 4.5 | /offers | — | TradeListPage | admin | pages/admin/TradeListPage.tsx | 11_매물등록_CTA_3_거래 | 미등록 |
| 1714-22874 | page | GNB 탁송 탭 | GNB 탁송 탭 | 4.6 | /logistics/schedule | — | LogisticsSchedulePage | admin/logistics | pages/admin/LogisticsSchedulePage.tsx | 12_매물등록_CTA_4_탁송 | 미등록 |
| 794-3704 | page | 판매방식선택 | 매물등록 CTA_3 | 4.11 | /vehicles/:vehicleId/sale/analyzing | — | GeneralSaleAnalyzingPage | admin/sale | pages/admin/sale/GeneralSaleAnalyzingPage.tsx | 11_매물등록_CTA_3_거래 | 미등록 |
| 794-4015 | page | 시세분석중 (일반/경매 공통) | 매물등록 CTA_3 | 4.11 | /vehicles/:vehicleId/sale/analyzing | — | GeneralSaleAnalyzingPage | admin/sale | pages/admin/sale/GeneralSaleAnalyzingPage.tsx | 11_매물등록_CTA_3_거래 | 미등록 |
| 794-4107 | page | 판매전환완료 (일반) | 매물등록 CTA_3 | 4.11 | /vehicles/:vehicleId/sale/complete | — | GeneralSaleCompletePage | admin/sale | pages/admin/sale/GeneralSaleCompletePage.tsx | 11_매물등록_CTA_3_거래 | 미등록 |
| 794-4200 | page | 경매 시작가설정 보정 (일반) | 매물등록 CTA_3 | 4.11 | /vehicles/:vehicleId/sale/price | — | GeneralSalePricePage | admin/sale | pages/admin/sale/GeneralSalePricePage.tsx | 11_매물등록_CTA_3_거래 | 미등록 |
| 794-4371 | page | 경매 시작가설정 보정-1 (일반) | 매물등록 CTA_3 | 4.11 | /vehicles/:vehicleId/sale/price | — | GeneralSalePricePage | admin/sale | pages/admin/sale/GeneralSalePricePage.tsx | 11_매물등록_CTA_3_거래 | 미등록 |
| 794-4542 | page | 거래상세 경매 (펼쳐지는 뷰) | 매물등록 CTA_3 | 4.11 | /vehicles/:vehicleId/trade | — | TradeDetailPage | admin | pages/admin/TradeDetailPage.tsx | 11_매물등록_CTA_3_거래 | 미등록 |
| 794-4708 | page | 거래상세 변형 (컨테이너 펼침) | 매물등록 CTA_3 | 4.11 | /vehicles/:vehicleId/trade | — | TradeDetailPage | admin | pages/admin/TradeDetailPage.tsx | 11_매물등록_CTA_3_거래 | 미등록 |

---

## §5 mcp_outputs 미대응 노드 (FIGMASCR0208 PNG 없음)

| nodeId | 비고 |
|--------|------|
| 1033-4903, 1037-5126, 1037-5673, 1042-4681 | 검차요청내역·검차신청 Step1 |
| 1121-5308, 1123-*, 1193-* | 검차진행·경매·거래상세 |
| 1272-* (전체) | 탁송 목록·예약·기사배정 등 |
| 1302-27093, 1302-27289 | 판매방식 변경·검차 모달 |
| 1362-36169, 1368-37364, 1425-7638, 1425-7684 | 차량목록 탭·랜딩·원부등록 |
| 1444-7928, 1636-10115 | 랜딩 로그인전·VehicleCard 그리드 |
| 1714-22332, 1714-22874 | GNB 거래·탁송 탭 |
| 794-* (전체) | 판매·거래 CTA_3 |

**FIGMASCR0208 대응 있음**: 1425-10137, 1425-10285, 1425-10813, 1425-8153

---

## §6 FIGMASCR0208 폴더 ↔ §3.x 대응

| 폴더 | §3 섹션 | 설명 |
|------|---------|------|
| 01_랜딩페이지 | §3.1 | 랜딩 |
| 02_회원가입_이전_GNB | §3.7 | 나의매물목록 회원가입유도 |
| 03_GNB_차량목록_탭 | §3.7 | 차량목록 필터별 뷰 |
| 04_GNB_검차_탭 | §3.6 | 검차요청내역 |
| 08_회원가입 | §3.2 | 로그인·회원가입·승인대기 |
| 09_매물등록_CTA_1_차량원부등록 | §3.5 | 차량등록·원부등록·완료 |
| 10_매물등록_CTA_2_검차 | §3.6 | 검차신청·진행·결과요약 |
| 11_매물등록_CTA_3_거래 | §3.5 | 판매방식·경매·거래상세 |
| 12_매물등록_CTA_4_탁송 | §3.5, §3.10 | 거래목록·탁송예약 |
| 13_매물등록_CTA_5_정산 | §3.11 | 정산현황·정산목록 |
| 14_마이페이지 | §3.8 | 내프로필·사이드바 페이지 |

---

## §7 추적성·참조

- **목표·요구**: [IA_SITEMAP_SPEC_IPOE.md](IA_SITEMAP_SPEC_IPOE.md) §4 각 절의 I·P·O·E.
- **스크린샷**: [FIGMASCR0208](../../FIGMASCR0208/) — 폴더 01~14, 파일명 `§3.x_nodeId_화면명.png`.
- **Figma 노드**: `https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id={nodeId}` (nodeId 하이픈 형식).
- **코드**: 위 §2·§3의 pages/widgets/features/entities 및 `src/app/router.tsx` 라우트 정의.
- **mcp_outputs**: [docs/figmaMCP/mcp_outputs/](../figmaMCP/mcp_outputs/) — 각 폴더에 metadata_raw.txt, design_context_raw.txt.
- **검증**: [NODEID_ROUTE_PAGE_FIGMASCR_VERIFICATION.md](NODEID_ROUTE_PAGE_FIGMASCR_VERIFICATION.md).

---

## §8 문서 이력

| 버전 | 일자 | 비고 |
|------|------|------|
| 1.0 | 2026-02-11 | FSD_SPEC_BLUEPRINT 대체. mcp_outputs 43노드 기반 Node 상세 §4 추가. 엔티티/필드 스키마 적용. |
| 1.1 | 2026-02-11 | 코드베이스 검증 반영. §2.2 슬라이스(폴더)를 실제 경로에 맞게 수정(LoginPage·VehicleListPage·Logistics* → admin). §2.4 entity 표기 정리. 검증 보고서 링크 추가. |
