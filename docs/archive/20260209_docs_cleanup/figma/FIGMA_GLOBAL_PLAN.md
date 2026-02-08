# Figma Global Plan

**목적**: Figma Domestic-Seller 1.0 섹션별 포함 페이지·역할·라우트·코드 매핑.  
**Figma fileKey**: `4w3ft8RpGwoho5EtvNO9hQ`

**통합 인덱스·MCP 상태·Figma URL**: [IA_FSD_COMPLETE_VERIFICATION_20260208.md](IA_FSD_COMPLETE_VERIFICATION_20260208.md) — 섹션별 자식 nodeId 전목록, 라우트, MCP(SUCCESS/PARTIAL/SS-only/NOT_CALLED), Figma 링크(node-id=1418-29145 형식, 콜론→하이픈).

---

## 2. 섹션별 포함 페이지·라우트

### 2.7 일반 거래 / 차량 목록 (1418-15486)

- **관련 라우트(확정)**: `/vehicles`, `/vehicles?filter=all|draft|completed`, `?view=grid|list`, `?q=...`, `?needsAttention=1`, `?page=...&size=...`, `?sort=...`
- **포함 페이지(프레임)** — **(Figma MCP get_screenshot 기반 검증)**  
  get_metadata(1418:15486), get_design_context(13개), get_screenshot(13개) 수행 완료. 스크린샷 기준 **실제 노출**은 13개 중 2건만 목록(1418-17357 거래 목록, 1418-20145 차량목록·판매/거래), 나머지 11건은 기준/판매 가격 설정·완료·거래 상세·모달. 앱/IA는 목록 플로우 기준 유지.

**의도된 역할(앱·플랜 기준)** — VehicleListPage 대응:

| node-id | 역할(앱 기준) | 예상 라우트 | 비고 |
|---------|----------------|-------------|------|
| 1418-15487 ~ 17196 | 차량 목록 — 필터/뷰/페이징/Empty 등 | `/vehicles` + 쿼리 | 13개 상태 변형 |

**MCP get_screenshot 실제 결과** (2026-02-07):

| node-id | 역할(스크린샷 기준) | 비고 |
|---------|---------------------|------|
| 1418-15487 | 기준 가격 설정 로딩 | 목록 아님 |
| 1418-15695, 15903 | 판매 가격 설정 | 목록 아님 |
| 1418-15565 | 판매 상태 전환 완료 | 목록 아님 |
| **1418-17357** | **거래 목록(그리드)** | 목록 화면 |
| **1418-20145** | **차량목록·판매/거래(그리드)** | 목록 화면 |
| 1418-16327, 16111, 16860, 16684, 17629, 17036, 17196 | 거래 상세 보기 또는 모달 | 목록 아님 |

**자식 13개 nodeId 전목록**: 1418:15487, 15695, 15903, 15565, 17357, 20145, 16327, 16111, 16860, 16684, 17629, 17036, 17196. **MCP**: 13건 SUCCESS. **Figma URL**: `?node-id=1418-15487` ~ `1418-17196`.

- **이 섹션에서 다룰 주요 기능/도메인**: 나의 매물 목록, 필터(전체/임시저장/등록완료), 검색, 그리드/리스트 뷰, 확인 필요차량, 페이지네이션, 차량 상세/등록 진입.
- **구현 페이지**: [VehicleListPage.tsx](../../src/pages/admin/VehicleListPage.tsx)
- **IA 참조**: [FIGMA_IA_FSD_STRUCTURE.md](FIGMA_IA_FSD_STRUCTURE.md) §3.4 (3.4.2b MCP 실제 결과·갭 포함)

### 2.8 경매 거래 / 차량 등록·상세·경매 (1418-20497)

- **관련 라우트(확정)**: `/vehicles/new`, `/vehicles/new/step1`, `/vehicles/new/step2`, `/vehicles/:id/complete`, `/vehicles/:id`, `/vehicles/:id/auction`, `/vehicles/:id/auction/start-price`, `/vehicles/:id/auction/duration`, `/vehicles/:id/auction/complete`
- **포함 페이지(프레임)** — **(Figma MCP get_screenshot 기반 검증)**  
  get_metadata(1418:20497), get_design_context(14개), get_screenshot(14개) 수행 완료 (2026-02-08). 14개 자식 전원 역할·라우트·도메인 확정.

**의도된 역할(앱·플랜 기준)** — 등록: VehicleRegisterEntryPage, VehicleRegisterStep1/2Page, VehicleRegistrationCompletePage. 상세·경매: VehicleDetailPage, AuctionDetailPage, AuctionStartPricePage, AuctionDurationPage, AuctionCompletePage. 목록: VehicleListPage.

| node-id | 역할(앱 기준) | 예상 라우트 | 도메인 |
|---------|----------------|-------------|--------|
| 1418-20498 | 차량 등록 진입 또는 시세 분석 로딩 | `/vehicles/new` 또는 `/vehicles/:id/sale/analyzing` | 등록/일반판매 |
| 1418-23705, 23880 | 경매 시작가·즉시판매가 설정 | `/vehicles/:id/auction/start-price` | 경매 |
| 1418-20576 | 판매/경매 전환 완료 | 완료 화면 | 완료 |
| 1418-21868, 22630 | 거래/판매 목록 | `/vehicles` | 목록 |
| 1418-24679, 24463, 21690, 21512, 24856, 22153, 22315 | 차량 상세·모달(보관/삭제/판매방식 변경) | `/vehicles/:id` | 상세 |
| 1418-22951 | 거래/정산 현황 (거래완료 후) | `/vehicles/:id` 등 | 상세/정산 |

**MCP get_screenshot 실제 결과** (2026-02-08, 14프레임):

| node-id | 역할(스크린샷 기준) | 라우트 | 도메인 |
|---------|---------------------|--------|--------|
| 1418-20498 | 기준 가격 설정 — 시세 분석 로딩 | `/vehicles/:id/sale/analyzing` | 일반판매 |
| 1418-23705, 23880 | 경매 사전 설정 (시작가·즉시판매가) | `/vehicles/:id/auction/start-price` | 경매 |
| 1418-20576 | 판매 상태 전환 완료 | 완료 화면 | 완료 |
| 1418-21868, 22630 | 거래 목록 / 판매·거래 목록 | `/vehicles` | 목록 |
| 1418-24679, 24463, 21690 | 거래 상세 보기(및 보관 모달) | `/vehicles/:id` | 상세 |
| 1418-21512 | 거래 상세 + 삭제 확인 모달 | `/vehicles/:id` | 상세 |
| 1418-24856 | 거래 상세 + "판매 방식 변경 불가" 모달 | `/vehicles/:id` | 상세 |
| 1418-22153, 22315 | 판매 방식 변경 전 확인 모달 | `/vehicles/:id` | 상세 |
| 1418-22951 | 거래 현황판·정산 현황 | `/vehicles/:id` 등 | 상세/정산 |

**자식 14개 nodeId 전목록**: 1418:20498, 23705, 23880, 20576, 21868, 22630, 24679, 24463, 21690, 21512, 24856, 22153, 22315, 22951. **MCP**: 14건 SUCCESS. **Figma URL**: `?node-id=1418-20498` 등.

- **이 섹션에서 다룰 주요 기능/도메인**: 차량 등록 진입·step1·step2·등록 완료, 차량 상세·판매방식 선택·일반판매/경매 CTA, 경매 시작가/기간 설정·진행·완료, 거래/정산 현황.
- **구현 페이지**: VehicleRegisterEntryPage, VehicleRegisterStep1Page, VehicleRegisterStep2Page, VehicleRegistrationCompletePage, VehicleDetailPage, AuctionDetailPage, AuctionStartPricePage, AuctionDurationPage, AuctionCompletePage, VehicleListPage (admin)
- **IA 참조**: [FIGMA_IA_FSD_STRUCTURE.md](FIGMA_IA_FSD_STRUCTURE.md) §3.5 (3.5.2b 14프레임), §3.9 (경매)

### 2.9 탁송 / 물류 스케줄·히스토리 (1418-25059)

- **관련 라우트(확정)**: `/logistics/schedule`, `/logistics/history`, `/logistics/:id`(상세), `/logistics/request`(탁송 신청 진입)
- **포함 페이지(프레임)** — **(Figma MCP get_screenshot 기반 검증)**  
  get_metadata(1418:25059), get_design_context(11개), get_screenshot(11개) 수행 완료(2026-02-08). 11개 자식 전원 역할·라우트 확정.

**의도된 역할(앱 기준)** — 스케줄: LogisticsSchedulePage(목록·필터·새 탁송 예약 폼). 내역: LogisticsHistoryPage(리스트·상세·PIN 인계).

| node-id | 역할(스크린샷 기준) | 라우트 | 비고 |
|---------|---------------------|--------|------|
| 1418-29145 | 물류 스케줄 목록 — 탁송 단계(상태 필터·카드) | `/logistics/schedule` | 목록·필터 |
| 1418-28880 | 탁송 목록 — 그리드/탭·조회기간 | `/logistics/schedule` | 목록·뷰 |
| 1418-25060 | 탁송 신청(차량 정보·검차 피드백·새 탁송 예약) | `/logistics/request` 등 | 요청 생성 |
| 1418-25219 | 탁송 신청 완료(기사 방문 확정·타임라인) | `/logistics/:id` | 상세 |
| 1418-27070, 26827, 25400, 25619, 26067, 26325, 26583 | 새 탁송 예약(장소·일정·결제·주소/달력/시간 모달) | `/logistics/schedule` | 폼·모달 |

**자식 11개 nodeId 전목록**: 1418:29145, 28880, 25060, 25219, 27070, 26827, 25400, 25619, 26067, 26325, 26583. **MCP**: 11건 SUCCESS. **Figma URL**: `?node-id=1418-29145` 등.

- **이 섹션에서 다룰 주요 기능/도메인**: 물류 스케줄 목록·상태 필터(탁송 신청/매칭 중/매칭완료/완료), 탁송 신청·새 탁송 예약(주소·일정·결제), 기사 방문 확정·진행 타임라인, 탁송 내역·PIN 인계 승인.
- **구현 페이지**: LogisticsSchedulePage, LogisticsHistoryPage, LogisticsSectionTabs
- **IA 참조**: [FIGMA_IA_FSD_STRUCTURE.md](FIGMA_IA_FSD_STRUCTURE.md) §3.10 (1418:25059, 11프레임)

### 2.10 정산 / 정산·매출 히스토리 (1418-33275)

- **관련 라우트(확정)**: `/settlements`, `/settlements/:id`, `/sales/history`
- **포함 페이지(프레임)** — **(Figma MCP get_screenshot 기반 검증)**  
  get_metadata(1418:33275), get_design_context(4개), get_screenshot(4개) 수행 완료(2026-02-08). 4개 자식 전원 역할·라우트 확정.

**의도된 역할(앱 기준)** — 목록: SettlementListPage. 상세/현황: SettlementDetailPage. 매출 내역: SalesHistoryPage.

| node-id | 역할(스크린샷 기준) | 라우트 | 비고 |
|---------|---------------------|--------|------|
| 1418-36405 | 정산 목록(필터·카드 그리드·페이지네이션) | `/settlements` | Figma MCP get_screenshot 검증 |
| 1418-27657 | 정산 상세(차량 정보·검차 피드백·정산 테이블) | `/settlements/:id` | |
| 1418-27434 | 정산 현황(검차 피드백·정산 테이블) | `/settlements/:id` | 상세 변형 |
| 1418-27952 | 정산 현황(진행상황 사이드바·정산 테이블) | `/settlements/:id` | 상세 변형 |

**자식 4개 nodeId 전목록**: 1418:36405, 27657, 27434, 27952. **MCP**: 4건 SUCCESS. **Figma URL**: `?node-id=1418-36405` 등.

- **이 섹션에서 다룰 주요 기능/도메인**: 정산 목록·상태 필터(전체/정산 완료/정산 대기), 확인 필요차량, 정산 상세(차량 정보·검차 피드백·정산 테이블), 매출/정산 히스토리.
- **구현 페이지**: SettlementListPage, SettlementDetailPage, SalesHistoryPage
- **IA 참조**: [FIGMA_IA_FSD_STRUCTURE.md](FIGMA_IA_FSD_STRUCTURE.md) §3.11 (1418:33275, 4프레임)

### 2.11 오퍼 / 마이페이지 (1418-36765)

- **관련 라우트(확정/예상)**: `/offers`, `/offers/:id`, `/mypage/profile`, `/mypage/profile/edit`, `/mypage/account/password`, `/mypage/profile/approval`, `/mypage/settlement-account`, `/mypage/profile/business`, `/mypage/notifications`, `/mypage/support`
- **포함 페이지(프레임)** — **(Figma MCP get_screenshot 기반 검증)**  
  get_metadata(1418:36765), get_design_context(12개 일부), get_screenshot(12개) 수행 완료(2026-02-08). 2026-02-08 순차 재호출: get_design_context 12개 중 6건 DC+SS, 6건 SS-only(실제 응답 인용 반영). 12개 자식 전원 **마이페이지** 화면(오퍼 목록 프레임은 12자식 중 없음).

**의도된 역할(앱 기준)** — 오퍼: GeneralSaleOffersPage(/offers). 마이페이지: 프로필·계정·딜러 승인·정산 계좌·알림·문의(현재 미구현).

| node-id | 역할(스크린샷 기준) | 라우트 | 비고 |
|---------|---------------------|--------|------|
| 1418-36766 | 내 프로필 | `/mypage/profile` | Figma MCP get_screenshot 검증 |
| 1418-37804 | 기본 정보 수정 | `/mypage/profile/edit` | |
| 1418-37971 | 로그인·비밀번호 변경 | `/mypage/account/password` | |
| 1418-37042, 37170, 37677 | 딜러 승인 상태 확인(승인완료/대기/반려) | `/mypage/profile/approval` | |
| 1418-38264, 38114 | 정산 계좌 등록/변경/조회 | `/mypage/settlement-account` | |
| 1418-36901 | 사업자 정보 조회 | `/mypage/profile/business` | |
| 1418-37298, 37559 | 알림 센터/알림 설정 | `/mypage/notifications` | |
| 1418-37402 | 고객 지원 채팅/FAQ | `/mypage/support` | |

**자식 12개 nodeId 전목록**: 1418:36766, 37804, 37971, 37042, 37170, 37677, 38264, 38114, 36901, 37298, 37559, 37402. **MCP**: 6건 DC+SS(36901, 37402, 37170, 38114, 37298, 37559), 6건 SS-only. **Figma URL**: `?node-id=1418-36766` 등.

- **이 섹션에서 다룰 주요 기능/도메인**: 오퍼 목록·수락/거절(코드만), 마이페이지(프로필·계정 설정·딜러 승인·정산 계좌·알림·문의·지원).
- **구현 페이지**: GeneralSaleOffersPage. 마이페이지 전용 페이지 미구현.
- **IA 참조**: [FIGMA_IA_FSD_STRUCTURE.md](FIGMA_IA_FSD_STRUCTURE.md) §3.8 (1418:36765, 12프레임)
