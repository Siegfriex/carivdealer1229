# Figma 11개 섹션 ↔ 앱 화면 매핑

**목적**: Figma Domestic-Seller 1.0의 11개 섹션(상단 Section/Frame) nodeId와 앱 라우트·페이지 대응.  
**Figma 파일**: `fileKey` = `4w3ft8RpGwoho5EtvNO9hQ`

---

## 11개 섹션 → 앱 구현

| # | Figma node-id (URL) | nodeId (API) | 대응 영역 | 라우트 | 구현 페이지 |
|---|---------------------|--------------|-----------|--------|-------------|
| 1 | 1368-37200 | 1368:37200 | 랜딩 | `/` | [LandingPage.tsx](../../src/pages/landing/LandingPage.tsx) |
| 2 | 1368-41153 | 1368:41153 | 로그인·회원가입·비밀번호찾기 | `/login`, `/signup`, `/signup/step1`~`step5`, `/signup/pending`, `/signup/complete`, `/forgot-password` | LoginPage, SignupEntryPage, SignupStep1~5, SignupPendingPage, SignupCompletePage, ForgotPasswordPage |
| 3 | 1418-25059 | 1418:25059 | 대시보드 | `/dashboard` | [DashboardPage.tsx](../../src/pages/admin/DashboardPage.tsx) |
| 4 | 1418-15486 | 1418:15486 | 차량 목록 | `/vehicles` | [VehicleListPage.tsx](../../src/pages/admin/VehicleListPage.tsx) |
| 5 | 1418-20497 | 1418:20497 | 차량 등록·상세 | `/vehicles/new`, `/vehicles/new/step1`, `/vehicles/new/step2`, `/vehicles/:id/complete`, `/vehicles/:id` | VehicleRegisterEntryPage, VehicleRegisterStep1~2Page, VehicleRegistrationCompletePage, VehicleDetailPage |
| 6 | 1418-33275 | 1418:33275 | 검차 | `/inspections`, `/inspections/request`, `/inspections/request/step1`~`step2`, `/inspections/history`, `/inspections/:id/progress`, `/inspections/:id/complete` | InspectionListPage, InspectionRequestLandingPage, InspectionRequestStep1~2Page, InspectionHistoryPage, InspectionProgressPage, InspectionCompletePage |
| 7 | 1425-7637 | 1425:7637 | 일반 판매 | `/vehicles/:id/sale/analyzing`, `/vehicles/:id/sale/price`, `/vehicles/:id/sale/complete` | GeneralSaleAnalyzingPage, GeneralSalePricePage, GeneralSaleCompletePage |
| 8 | 1418-36765 | 1418:36765 | 일반 판매 제안 목록 | `/offers` | [GeneralSaleOffersPage.tsx](../../src/pages/admin/GeneralSaleOffersPage.tsx) |
| 9 | 1425-7205 | 1425:7205 | 경매 | `/vehicles/:id/auction`, `/vehicles/:id/auction/start-price`, `/vehicles/:id/auction/duration`, `/vehicles/:id/auction/complete` | AuctionDetailPage, AuctionStartPricePage, AuctionDurationPage, AuctionCompletePage |
| 10 | 1444-7927 | 1444:7927 | 탁송 | `/logistics/schedule`, `/logistics/history` | LogisticsSchedulePage, LogisticsHistoryPage |
| 11 | 1425-9149 | 1425:9149 | 정산·판매이력 | `/settlements`, `/settlements/:id`, `/sales/history` | SettlementListPage, SettlementDetailPage, SalesHistoryPage |

---

## 비고

- Figma에서 11개 노드는 **섹션(Section/Frame)** 단위라, MCP `get_design_context` 호출 시 sparse 메타만 반환될 수 있음. 실제 화면 단위 코드 생성은 각 섹션 **하위 프레임** nodeId로 `get_design_context` 호출 필요.
- SCR 단위 nodeId는 [archive/FIGMA_SCR_ROUTE_MAP.md](../archive/FIGMA_SCR_ROUTE_MAP.md) 참고.
- 앱 페이지는 `design-tokens.css`, `LAYOUT_CLASSES`, `Typography`/`Button` 등 공통 디자인 시스템 사용.
