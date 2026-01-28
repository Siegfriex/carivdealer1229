# Figma ↔ Screen ↔ Route 매핑 테이블

**목적**: PRD 28개 스크린(SCR)과 경로, 구현 파일, Figma nodeId 매핑  
**Figma 파일**: Domestic Seller 1.0 — `fileKey`: `4w3ft8RpGwoho5EtvNO9hQ`  
**기준**: [PRD_Phase1_2025-12-31.md](PRD_Phase1_2025-12-31.md) Screen Registry, [router.tsx](../src/app/router.tsx)

---

## 매핑 테이블 (28개)

| Screen ID | 화면명 | 경로 | 구현 파일 | Figma nodeId |
|-----------|--------|------|-----------|--------------|
| SCR-0000 | 랜딩 페이지 | `/` | LandingPage.tsx | 1194-7481 |
| SCR-0001 | 로그인 | `/login` | LoginPage.tsx | (확보 필요) |
| SCR-0002 | 회원가입(딜러) 진입 | `/signup` | SignupEntryPage.tsx | 1194-6171 |
| SCR-0002-1 | 회원가입 약관 동의 | `/signup/step5` | SignupStep5Page.tsx | 1194-6072 |
| SCR-0002-2 | 회원가입 정보 입력 | `/signup/step1`~`step4` | SignupStep1~4Page.tsx | 1194-5792, 5866, 5921, 6002 |
| SCR-0003 | 사업자 인증 | `/signup/step3` | SignupStep3Page.tsx | 1194-5921 |
| SCR-0003-1 | 승인 대기 | `/signup/pending` | SignupPendingPage.tsx | 1194-6063 |
| SCR-0003-2 | 승인 완료 | `/signup/complete` | SignupCompletePage.tsx | 1194-6054 |
| SCR-0100 | 딜러 대시보드 | `/dashboard` | DashboardPage.tsx | 1194-7664 |
| SCR-0101 | 차량 목록 | `/vehicles` | VehicleListPage.tsx | 1198-6370, 6939, 6578, 6791 |
| SCR-0102 | 일반 판매 제안 목록 | `/offers` | GeneralSaleOffersPage.tsx | (확보 필요) |
| SCR-0103 | 판매 내역 | `/sales/history` | SalesHistoryPage.tsx | (확보 필요) |
| SCR-0104 | 정산 내역 | `/settlements` | SettlementListPage.tsx | (확보 필요) |
| SCR-0105 | 정산 상세 | `/settlements/:settlementId` | SettlementDetailPage.tsx | (확보 필요) |
| SCR-0200 | 차량 등록(등록원부 OCR) | `/vehicles/new`, `/vehicles/new/step1`, `/vehicles/new/step2`, `/vehicles/:vehicleId/complete` | VehicleRegisterEntryPage, VehicleRegisterStep1Page, VehicleRegisterStep2Page, VehicleRegistrationCompletePage | 1198-5843, 1198-5889, 915-998 |
| SCR-0200-Draft | 임시 저장 목록 | `/vehicles` (filterTab=draft) | VehicleListPage.tsx | 1198-6791 |
| SCR-0201 | 검차 신청 | `/inspections/request`, `/inspections/request/step1`, `/inspections/request/step2` | InspectionRequestLandingPage, InspectionRequestStep1Page, InspectionRequestStep2Page | 1202-6390 |
| SCR-0201-Progress | 검차 진행 상태 | `/inspections/:inspectionId/progress` | InspectionProgressPage.tsx | 1202-6685, 7020, 7204, 7440, 7752, 7902 |
| SCR-0202 | 검차 결과 조회 | `/inspections/history`, `/inspections/:inspectionId/complete` | InspectionHistoryPage.tsx, InspectionCompletePage.tsx | 1202-7588 |
| SCR-0300 | 차량 상세/판매 방식 선택 | `/vehicles/:vehicleId` | VehicleDetailPage.tsx | (확보 필요) |
| SCR-0301-N | 일반 판매 - 분석 중 | `/vehicles/:vehicleId/sale/analyzing` | GeneralSaleAnalyzingPage.tsx | (확보 필요) |
| SCR-0302-N | 일반 판매 - 가격 설정 | `/vehicles/:vehicleId/sale/price` | GeneralSalePricePage.tsx | (확보 필요) |
| SCR-0303-N | 일반 판매 - 완료 | `/vehicles/:vehicleId/sale/complete` | GeneralSaleCompletePage.tsx | (확보 필요) |
| SCR-0400 | 경매 상세(즉시구매 포함) | `/vehicles/:vehicleId/auction` | AuctionDetailPage.tsx | (확보 필요) |
| SCR-0401-A | 경매 - 시작가 설정 | `/vehicles/:vehicleId/auction/start-price` | AuctionStartPricePage.tsx | (확보 필요) |
| SCR-0402-A | 경매 - 기간 설정 | `/vehicles/:vehicleId/auction/duration` | AuctionDurationPage.tsx | (확보 필요) |
| SCR-0403-A | 경매 - 완료 | `/vehicles/:vehicleId/auction/complete` | AuctionCompletePage.tsx | (확보 필요) |
| SCR-0600 | 탁송 예약/배차 | `/logistics/schedule` | LogisticsSchedulePage.tsx | (확보 필요) |
| SCR-0601 | 탁송 내역 | `/logistics/history` | LogisticsHistoryPage.tsx | (확보 필요) |

---

## 비고

- **Figma nodeId**: URL 형식 `node-id=XXXX-YYYY` 시 노드 ID는 `XXXX:YYYY` (콜론). MCP 호출 시 `get_design_context(nodeId: "XXXX:YYYY", fileKey: "4w3ft8RpGwoho5EtvNO9hQ")`.
- **복수 노드**: 한 SCR이 여러 Figma 프레임(그리드/리스트/필터 등)에 대응할 수 있음. 해당 셀에 복수 nodeId 기입.
- **일반 판매·경매 플로우**: SCR-0301-N ~ 0303-N, 0400, 0401-A ~ 0403-A — 라우트·페이지 구현 완료. Figma 노드 확보 후 정합성 반영 예정.
- **정합성 기준**: 1440px, design-tokens, Figma 스크린샷 vs 로컬 시각 비교. [DESIGN_SPECIFICATION.md](DESIGN_SPECIFICATION.md) 참조.

---

## 플로우 이식 정합성 점검 (FLOW-00 ~ FLOW-04)

| Flow | 스크린 | 점검 내용 | 상태 |
|------|--------|-----------|------|
| FLOW-00 | SCR-0000, 0001, 0100 | 랜딩·로그인·대시 — design-tokens(text-h1~caption), 1440px 레이아웃, 내부 이동 Link/navigate | 완료 |
| FLOW-01 | SCR-0002~0003-2 | 회원가입 8노드 — 픽셀/텍스트/버튼 design-tokens 사용 | 완료 |
| FLOW-02 | SCR-0201, 0201-Progress, 0202 | 검차 플로우 — 목록/진행/내역 design-tokens, 라우트 연결 | 완료 |
| FLOW-03 | SCR-0200, 0200-Draft, 0101, 0300, 0301~0303-N, 0400~0403-A, 0102, 0103 | 차량 등록·목록·판매방식선택·일반판매·경매·제안목록·판매내역 — 라우트·페이지·토큰 | 완료 |
| FLOW-04 | SCR-0104, 0105, 0600, 0601 | 정산·탁송 — 라우트·페이지·design-tokens | 완료 |

- **네비게이션 통일**: 내부 이동은 `useNavigate()` 또는 `<Link>` 사용. `window.location.href` 및 `<a href="...">`(내부 경로) 제거 완료.
