# CarivDealer User Flow (Service Scenarios)

**목적**: CarivDealer 핵심 사용자 시나리오·플로우 정의. CarivDealer_IA 참조, 라우트·페이지 ID는 IA 정의 사용.

---

## §0 메타데이터·선언

| 항목 | 내용 |
|------|------|
| **버전** | 1.0 |
| **최종 검증** | 2026-02-12 |
| **의존성** | [CarivDealer_IA.md](CarivDealer_IA.md) |

---

## §1 Core Loop (핵심 시나리오)

차량 등록 → 검수 → 판매/경매 설정 → 낙찰/유찰 → 탁송 → 정산 완료 (End-to-End Flow)

```mermaid
flowchart LR
    A[차량등록] --> B[검수]
    B --> C[판매/경매]
    C --> D[낙찰/유찰]
    D --> E[탁송]
    E --> F[정산완료]
```

### 1.1 단계별 라우트

| 단계 | 라우트 | 페이지 |
|------|--------|--------|
| 1. 차량등록 | `/vehicles/new` → `/vehicles/new/step1` → `step2` → `/vehicles/:vehicleId/complete` | VehicleRegisterEntryPage → VehicleRegisterStep1Page → Step2Page → VehicleRegistrationCompletePage |
| 2. 검수 | `/inspections/request` → `request/step1` → `step2` | InspectionRequestLandingPage → InspectionRequestStep1Page → InspectionRequestStep2Page |
| 2. 검수 진행 | `/inspections/:inspectionId/progress` (?stage=matching, en_route) | InspectionProgressPage |
| 2. 검수 완료 | `/inspections/:inspectionId/complete` | InspectionCompletePage |
| 3. 판매방식 선택 | `/vehicles/:vehicleId/sale/analyzing` | GeneralSaleAnalyzingPage |
| 3. 일반판매 | `/vehicles/:vehicleId/sale/price` → `/sale/complete` | GeneralSalePricePage → GeneralSaleCompletePage |
| 3. 경매 | `/vehicles/:vehicleId/auction`, `auction/start-price`, `duration`, `complete` | AuctionDetailPage → AuctionStartPricePage → AuctionDurationPage → AuctionCompletePage |
| 4. 거래상세 | `/vehicles/:vehicleId/trade` | TradeDetailPage |
| 5. 탁송 | `/logistics/schedule`, `/logistics/history` | LogisticsSchedulePage, LogisticsHistoryPage |
| 6. 정산 | `/settlements`, `/settlements/:settlementId`, `/sales/history` | SettlementListPage, SettlementDetailPage, SalesHistoryPage |

### 1.2 routeManager 상태 기반 라우팅

차량 상태별 상세 페이지 이동:

| status | 이동 경로 |
|--------|----------|
| draft | MOCK_VEHICLE_TO_INSPECTION 있으면 `/inspections/:id/progress`, 없으면 `/inspections/request?vehicleId=...` |
| inspection | 동일 |
| active_sale | `/vehicles/:vehicleId/trade` |
| bidding | `/vehicles/:vehicleId/auction` |
| sold | `/logistics/schedule?vehicleId=...` |
| pending_settlement | MOCK_VEHICLE_TO_SETTLEMENT 있으면 `/settlements/:id`, 없으면 `/settlements` |
| completed | `/settlements/:id` 또는 `/vehicles/:vehicleId` |

**사용처**: VehicleListPage, TradeListPage, DashboardPage 등에서 `getVehicleDetailRoute(vehicleId, status)` 호출.

---

## §2 Auth & Onboarding Flow

### 2.1 회원가입 (Step 1~5)

```mermaid
flowchart TD
    A[/signup] --> B[/signup/step1]
    B --> C[/signup/step2]
    C --> D[/signup/step3]
    D --> E[/signup/step4]
    E --> F[/signup/step5]
    F --> G[/signup/pending]
    G --> H[/signup/complete]
```

| 단계 | 라우트 | 페이지 |
|------|--------|--------|
| 진입 | `/signup` | SignupEntryPage |
| Step 1~5 | `/signup/step1` ~ `step5` | SignupStep1Page ~ SignupStep5Page |
| 승인대기 | `/signup/pending` | SignupPendingPage |
| 완료 | `/signup/complete` | SignupCompletePage |

### 2.2 로그인 및 비밀번호 찾기

| 플로우 | 라우트 | 페이지 |
|--------|--------|--------|
| 로그인 | `/login` | LoginPage |
| 비밀번호 찾기 | `/forgot-password` | ForgotPasswordPage |

### 2.3 인증 가드

- **비로그인 시**: 보호된 라우트 접근 시 `/signup` 리다이렉트 (ProtectedRoute)
- **인증 방식**: `localStorage` `carivdealer_auth` + `?devLogin=1` URL (개발용)
- **추후**: Firebase Auth 등으로 교체 가능

### 2.4 계정 승인 대기 및 반려 시나리오

- 승인대기: `/signup/pending` 표시
- 반려 시: (현재 구현 미확인) — IA 문서에 플로우 반영 시 검증 필요

---

## §3 Transaction Flow (거래 로직)

### 3.1 Bidding (경매 입찰)

| 단계 | 설명 | 처리 |
|------|------|------|
| 입찰 시도 | 사용자가 금액 입력 후 입찰 버튼 클릭 | auction/place-bid feature |
| 유효성 검증 | 최소 입찰 단위, 현재가 초과 등 | 클라이언트/서버 검증 |
| 실시간 가격 갱신 | 경매 진행 중 | (실시간 API 연동 시) |
| 입찰 성공/실패 | 성공 시 리다이렉트 또는 상태 갱신, 실패 시 에러 메시지 | — |

**관련 페이지**: AuctionDetailPage (`/vehicles/:vehicleId/auction`)

### 3.2 Settlement (정산)

| 단계 | 설명 | 처리 |
|------|------|------|
| 매각 확정 | 낙찰/거래 완료 | status → pending_settlement |
| 계좌 입력 | `/mypage/settlement-account` | SettlementAccountPage |
| 세금계산서 발행 | (정산 상세 내) | SettlementDetailPage |
| 입금 확인 | 정산 완료 처리 | status → completed |

**관련 페이지**: SettlementListPage, SettlementDetailPage, SettlementAccountPage

---

## §4 Exception & Fail Flow (예외 처리)

### 4.1 네트워크 에러 시 재시도 로직

- API 폴백: `handleApiError` 중앙화, Mock 데이터 반환 시 `_isMockData` 플래그
- `useApiWithFallback` 사용 시 올바른 import 확인 (사용자 규칙 18)

### 4.2 데이터 없음 (Empty State)

- VID Protocol 5: 빈 데이터 → Empty State 화면
- 목록 페이지: 0건 시 안내 UI

### 4.3 권한 없음 (403) 및 페이지 없음 (404)

| 케이스 | 처리 |
|--------|------|
| 비로그인 + 보호 라우트 | `/signup` 리다이렉트 |
| 잘못된 vehicleId | `getVehicleDetailRoute` → FALLBACK_ROUTE (`/vehicles`) |
| 미매칭 경로 | router.tsx `path="*"` → `/vehicles` Navigate |

### 4.4 로딩·에러 UI

- 로딩: Skeleton (VID Protocol 5)
- 에러: Error Boundary

---

## §5 참조

- **IA**: [CarivDealer_IA.md](CarivDealer_IA.md)
- **routeManager**: [CarivDealer_VID.md](CarivDealer_VID.md) §5
- **AuthContext**: `src/shared/context/AuthContext.tsx`
