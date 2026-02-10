# CarivDealer (FM Seller) 프론트엔드

중고차 딜러 플랫폼 웹 앱. React 18 + Vite + TypeScript, FSD(Feature-Sliced Design) 구조.

---

## 1. 프로젝트 개요

| 항목 | 내용 |
|------|------|
| **스택** | React 18, Vite, TypeScript, TanStack Query, React Router, Firebase (Auth·Firestore·Functions) |
| **구조** | FSD: app → pages → widgets → features → entities → shared |
| **명세 SSOT** | [docs/figma/IA_SITEMAP_SPEC_IPOE.md](docs/figma/IA_SITEMAP_SPEC_IPOE.md), [docs/figma/FSD_SPEC_BLUEPRINT.md](docs/figma/FSD_SPEC_BLUEPRINT.md) |
| **API·ERD** | [docs/CarivDealer_api_v1.md](docs/CarivDealer_api_v1.md), [docs/CarivDealer_API_ERD_Mapping.md](docs/CarivDealer_API_ERD_Mapping.md) |

---

## 2. 전체 프론트엔드 파일·폴더 구조

```
src/
├── app/                    # 진입점·라우터·프로바이더
│   ├── main.tsx
│   ├── router.tsx
│   ├── providers/          # QueryProvider, ToastProvider
│   └── styles/globals.css
├── pages/                  # 라우트 단위 페이지
│   ├── landing/            # / → LandingPage
│   ├── auth/               # /login, /signup, /signup/step1~5, pending, complete
│   └── admin/              # 보호 라우트
│       ├── vehicle/        # 차량 등록·상세·완료·판매/경매
│       ├── inspection/     # 검차 목록·신청·진행·완료
│       ├── sale/           # 일반판매(시세·가격·완료)
│       ├── auction/        # 경매(시작가·기간·완료)
│       ├── logistics/      # 탁송 스케줄·이력
│       ├── mypage/         # 정산 계좌 등
│       ├── LoginPage, ForgotPasswordPage, DashboardPage
│       ├── VehicleListPage, TradeListPage, GeneralSaleOffersPage
│       ├── LogisticsSchedulePage, LogisticsHistoryPage
│       ├── SettlementListPage, SettlementDetailPage, SalesHistoryPage
│       └── TradeDetailPage
├── widgets/                # 복합 UI (헤더·사이드바·테이블)
│   ├── Header/             # LandingHeader, Header
│   ├── MainLandingSidebar/  # 차량목록 탭 필터(전체·검차·판매·탁송·정산)
│   ├── GnbMinimalSidebar/  # GNB 검차/거래/탁송/정산 탭용 구역+검색
│   ├── MypageSidebar/
│   ├── ProgressSidebar/    # 매물등록 플로우 단계
│   ├── Sidebar/            # 어드민 메뉴
│   └── VehicleTable/
├── features/               # 시나리오 훅·API 래퍼
│   ├── vehicle/register-form/   # useVehicles, useVehicle, useVehicleRegister, vehicleApi
│   ├── inspection/request-form/ # useInspectionRequest, useInspections
│   └── auction/place-bid/       # useBid, useBuyNow
├── entities/               # 도메인 엔티티 (타입·스키마·상수·UI)
│   ├── vehicle/            # types, schema, constants, VehicleCard, VehicleStatusBadge
│   ├── inspection/         # types, schema, constants, InspectionStatusBadge
│   ├── auction/            # types, schema, constants, AuctionStatusBadge
│   ├── trade, logistics, settlement, member
│   ├── address, listing, order, payment, review, seller_docs, cars_of_korea
│   └── 각 슬라이스: index.ts, model/(types|schema|constants).ts, ui/
└── shared/
    ├── api/                # apiClient, client, queryClient, mockData, apiEndpoints
    ├── config/              # firebase, layout, logging, registerFlowSteps, zIndex
    ├── context/             # AuthContext, DevSkipContext
    ├── lib/                 # errorHandler, formFeedback, responsive
    └── ui/                  # Button, Modal, Toast, Table, Input, Badge 등
```

---

## 3. 엔드포인트

**SSOT**: [src/shared/config/apiEndpoints.ts](src/shared/config/apiEndpoints.ts).  
**API 명세**: [docs/CarivDealer_api_v1.md](docs/CarivDealer_api_v1.md).

| 도메인 | 주요 엔드포인트 (Firebase Functions 호출명) |
|--------|---------------------------------------------|
| 회원 | MEMBER.REGISTER, VERIFY_BUSINESS |
| 차량 | VEHICLE.OCR_REGISTRATION, INSPECTION_REQUEST, GET_STATISTICS |
| 검차 | INSPECTION.ASSIGN, UPLOAD_RESULT, GET_RESULT, ASSIGN_EVALUATOR |
| 거래 | TRADE.CHANGE_SALE_METHOD, ACCEPT_PROPOSAL, MANAGE_PROPOSAL_TTL |
| 경매 | AUCTION.BID, BUY_NOW |
| 탁송 | LOGISTICS.SCHEDULE, DISPATCH_REQUEST, DISPATCH_CONFIRM, HANDOVER_APPROVE |
| 정산 | SETTLEMENT.NOTIFY |
| 기타 | REPORT, CONFIG, ORDER, PAYMENT, ADDRESS, REVIEW, SELLER_DOCS |

실제 HTTP 호출은 [src/shared/api/apiClient.ts](src/shared/api/apiClient.ts) 및 [client.ts](src/shared/api/client.ts)의 `apiClient.도메인.메서드()` 또는 `apiClient.post(API_ENDPOINTS.xxx, body)` 사용.

---

## 4. 라우터

**정의**: [src/app/router.tsx](src/app/router.tsx).  
**FSD 매핑**: [docs/figma/FSD_SPEC_BLUEPRINT.md §2.2](docs/figma/FSD_SPEC_BLUEPRINT.md).

| 구분 | 경로 | 페이지 |
|------|------|--------|
| **공개** | `/` | LandingPage |
| | `/login`, `/forgot-password` | LoginPage, ForgotPasswordPage |
| | `/signup`, `/signup/step1`~`step5`, `pending`, `complete` | SignupEntryPage, SignupStep1~5, SignupPendingPage, SignupCompletePage |
| **보호** | `/dashboard` | DashboardPage |
| | `/vehicles`, `/vehicles/new`, `/vehicles/new/step1`, `step2` | VehicleListPage, VehicleRegisterEntryPage, VehicleRegisterStep1Page, Step2Page |
| | `/vehicles/:vehicleId/complete`, `/vehicles/:vehicleId` | VehicleRegistrationCompletePage, VehicleDetailPage |
| | `/vehicles/:vehicleId/sale/analyzing`, `price`, `complete` | GeneralSaleAnalyzingPage, GeneralSalePricePage, GeneralSaleCompletePage |
| | `/vehicles/:vehicleId/auction`, `auction/start-price`, `duration`, `complete` | AuctionDetailPage, AuctionStartPricePage, AuctionDurationPage, AuctionCompletePage |
| | `/vehicles/:vehicleId/trade` | TradeDetailPage |
| | `/inspections`, `/inspections/request`, `request/step1`, `step2`, `/inspections/history` | InspectionListPage, InspectionRequestLandingPage, Step1/Step2, InspectionHistoryPage |
| | `/inspections/:inspectionId/progress`, `complete` | InspectionProgressPage, InspectionCompletePage |
| | `/offers`, `/offers/proposals` | TradeListPage, GeneralSaleOffersPage |
| | `/logistics/schedule`, `/logistics/history` | LogisticsSchedulePage, LogisticsHistoryPage |
| | `/sales/history`, `/settlements`, `/settlements/:settlementId` | SalesHistoryPage, SettlementListPage, SettlementDetailPage |
| | `/mypage`, `/mypage/settlement-account` | Navigate to settlement-account, SettlementAccountPage |
| **폴백** | `*` | Navigate to `/vehicles` |

비로그인 시 보호 라우트 진입 시 `/signup` 리다이렉트(ProtectedRoute).

---

## 5. 캐싱 처리

**TanStack Query** 사용. 설정: [src/shared/api/queryClient.ts](src/shared/api/queryClient.ts).

| 항목 | 값 | 비고 |
|------|-----|------|
| **staleTime** | 5분 | 쿼리 데이터 유효 시간 |
| **gcTime** | 10분 | 미사용 캐시 보관 시간 |
| **retry** | 1 (queries), 0 (mutations) | 실패 시 재시도 |
| **refetchOnWindowFocus** | false | 포커스 시 자동 리페치 없음 |
| **refetchOnMount** | true | 마운트 시 리페치 |

**쿼리 키 예**: `['vehicles']`, `['vehicles', vehicleId]`, `['inspections', vehicleId, status]`, `['auctions']`.  
뮤테이션 성공 시 `queryClient.invalidateQueries({ queryKey: ['vehicles'] })` 등으로 해당 목록 캐시 무효화.

---

## 6. 전체 스크린 명세 (IA·FSD 대응)

**SSOT**: [docs/figma/IA_SITEMAP_SPEC_IPOE.md](docs/figma/IA_SITEMAP_SPEC_IPOE.md) §3 사이트맵·§4 기능별 I·P·O·E.  
**블루프린트**: [docs/figma/FSD_SPEC_BLUEPRINT.md](docs/figma/FSD_SPEC_BLUEPRINT.md).

| IA §4 | 화면(노드) 요약 | 라우트 | FSD 페이지/위젯 |
|-------|-----------------|--------|-----------------|
| 4.1 랜딩 | 랜딩 3단계(풀뷰→Hero→알림) | `/` | LandingPage |
| 4.2 회원가입 이전 GNB | 나의매물목록_회원가입유도 | (비로그인 시) | 리다이렉트 + VehicleListPage 등 |
| 4.3 GNB 차량목록 | 1714-23434, 사이드 필터 5종 | `/vehicles` | VehicleListPage, MainLandingSidebar |
| 4.4 GNB 검차 | 검차요청내역_리스트_변형 | `/inspections` | InspectionListPage, GnbMinimalSidebar |
| 4.5~4.7 거래/탁송/정산 | 1714-22332, 22874, 23139 | `/offers`, `/logistics/*`, `/settlements` | TradeListPage, LogisticsSchedulePage, SettlementListPage 등 |
| 4.8 회원가입 | 로그인→Step1~5→승인대기 | `/login`, `/signup/*` | LoginPage, SignupEntryPage, SignupStep1~5, Pending, Complete |
| 4.9 CTA_1 차량원부등록 | 차량등록_비대면_랜딩→원부등록→완료 | `/vehicles/new`, `step1`, `step2`, `/:id/complete` | VehicleRegisterEntryPage, Step1/Step2, VehicleRegistrationCompletePage |
| 4.10 CTA_2 검차 | 검차신청→매칭/완료→결과요약 | `/inspections/request`, `step1`, `step2`, `/:id/progress`, `complete` | InspectionRequestLandingPage, Step1/Step2, InspectionProgressPage, InspectionCompletePage |
| 4.11 CTA_3 거래 | 판매방식선택→일반/경매→거래상세 | `/vehicles/:id/sale/*`, `auction/*`, `trade` | GeneralSaleAnalyzingPage, AuctionStartPricePage 등, TradeDetailPage |
| 4.12 CTA_4 탁송 | 목록→새탁송예약_폼→기사배정 | `/logistics/schedule`, `history` | LogisticsSchedulePage, LogisticsHistoryPage |
| 4.13 CTA_5 정산 | 정산현황→정산목록 | `/settlements`, `/:id`, `/sales/history` | SettlementListPage, SettlementDetailPage, SalesHistoryPage |
| 4.14 마이페이지 | 내프로필·사이드바 페이지 | `/mypage/settlement-account` 등 | SettlementAccountPage, MypageSidebar |

스크린샷·Figma 노드: IA 문서 §4 각 절의 「참조 이미지(전체 노드)」 표 및 [FIGMASCR0208](FIGMASCR0208/) 폴더 참고.

---

## 7. 스토리북·테스트

| 항목 | 현황 |
|------|------|
| **Storybook** | 미구성. 공통 UI(Button, Modal, VehicleCard, VehicleTable 등)는 `src/shared/ui`, `src/entities/*/ui`, `src/widgets` 에 있으며, 추후 `.stories.tsx` 추가 시 스토리북 구성 가능. |
| **단위/통합 테스트** | Vitest + @testing-library/react. `src/test/setup.ts` 전역 설정. 테스트 파일: `*.test.ts`, `*.test.tsx` (entity schema, useBid/useBuyNow, Button, VehicleCard, VehicleDetailPage 등). |

---

## 8. API·ERD 스키마 정합

| 문서 | 용도 |
|------|------|
| [CarivDealer_api_v1.md](docs/CarivDealer_api_v1.md) | 회원가입·로그인·차량(등록/목록/상세/검차 신청·최신 상태) REST 명세. 공통 응답 포맷·인증·Base URL. |
| [CarivDealer_API_ERD_Mapping.md](docs/CarivDealer_API_ERD_Mapping.md) | API 필드 ↔ ERD 테이블·컬럼 매핑, 엔드포인트↔ERD 테이블, 계산값·API-only·DB-only 필드, 불확실 항목 정리. |

프론트엔드 엔티티 타입·스키마는 `src/entities/*/model/types.ts`, `schema.ts`에 있으며, 위 API·ERD와 기능 단위로 대응됨(차량·검차·경매·거래·탁송·정산·회원 등).

---

## 9. 실행

```bash
# 의존성 설치
npm install

# 개발 서버 (기본 포트 5173 또는 설정값)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

---

## 10. 문서 인덱스

| 문서 | 설명 |
|------|------|
| [CLAUDE.md](CLAUDE.md) | 프로젝트 컨텍스트·구조·커맨드·규칙 |
| [docs/figma/IA_SITEMAP_SPEC_IPOE.md](docs/figma/IA_SITEMAP_SPEC_IPOE.md) | IA 기능명세 SSOT (사이트맵·I·P·O·E·참조 이미지·API·ERD) |
| [docs/figma/FSD_SPEC_BLUEPRINT.md](docs/figma/FSD_SPEC_BLUEPRINT.md) | FSD 레이어·라우트·페이지·위젯 매핑 |
| [docs/CarivDealer_api_v1.md](docs/CarivDealer_api_v1.md) | API 명세 v1 |
| [docs/CarivDealer_API_ERD_Mapping.md](docs/CarivDealer_API_ERD_Mapping.md) | API↔ERD 매핑 |
| [docs/HANDOFF_NEXT_AGENT.md](docs/HANDOFF_NEXT_AGENT.md) | 다음 에이전트 핸드오프 요약 |

---

## 11. 2026-02-10 (0210) 작업 요약

| 구분 | 내용 |
|------|------|
| **랜딩** | LandingPage 구성, Hero(Auth/Unauth)·Faq·Inquiry·UserGuide 위젯, `img/LANDING.png`·`img/logo_FOWARDMAX.svg` 추가, LandingHeader 수정 |
| **검수** | InspectionListPage·InspectionListCard, InspectionRequestStep1(위치/일정/결제/차량선택), InspectionScheduleBlock, InspectionCompletePage·InspectionProgressPage 등 정리 |
| **차량 등록** | VehicleRegisterStep2 제거, VehicleRegisterEntryPage·VehicleRegisterStep1Page 수정 |
| **레이아웃·스타일** | `layout.ts`, `design-tokens.css`, GnbListLayout, ProgressSidebar, 전역 스타일 정리 |
| **경매·정산** | AuctionStartPricePage·AuctionDurationPage·AuctionCompletePage, GeneralSaleAnalyzingPage·GeneralSalePricePage·GeneralSaleCompletePage 등 레이아웃/노드 반영 |
| **거래·탁송** | TradeListPage·TradeDetailPage, LogisticsSchedulePage 수정 |
| **문서** | figmaMCP(impl_plans, mcp_outputs), LANDING_SSOT_VS_CODE_DIFF, DESIGN_TOKENS_LAYOUT_SSOT, FIGMA_IMAGE_DOWNLOAD 등 |
| **기타** | PlatformBadge 제거, vite/tsconfig/tailwind 설정 조정, 라우터·엔티티(vehicle) 보강 |

---

*최종 업데이트: 2026-02-10*
