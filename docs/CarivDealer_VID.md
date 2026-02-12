# CarivDealer VID (Verification & Integration Document)

**목적**: IA·FSD·코드베이스 간 추적성 및 통합 규약을 정의하는 개발자 참조 문서. 에이전트가 참조할 '법전'.

---

## §0 메타데이터·VID 선언

| 항목 | 내용 |
|------|------|
| **버전** | 1.3 |
| **최종 검증** | 2026-02-12 |
| **데이터 소스** | FSD_IA_NODEID_SSOT, IA_SITEMAP_SPEC_IPOE, router.tsx, FSD 구조 |
| **기준 문서** | [FSD_IA_NODEID_SSOT.md](figma/FSD_IA_NODEID_SSOT.md), [IA_SITEMAP_SPEC_IPOE.md](figma/IA_SITEMAP_SPEC_IPOE.md) |

### 0.2a Phase 0/4 grep 검증 명령

경로 참조 문서 확정 시 사용. Phase 4 동기화 후에는 경로 변경 시 재실행 권장.

```bash
grep -r "pages/admin/LogisticsSchedulePage\|LogisticsHistoryPage" . --include="*.md" --include="*.py" -l
grep -r "pages/admin/TradeListPage\|TradeDetailPage" . --include="*.md" --include="*.py" -l
grep -r "pages/admin/SettlementListPage\|SettlementDetailPage" . --include="*.md" --include="*.py" -l
grep -r "pages/admin/GeneralSaleOffersPage\|SalesHistoryPage" . --include="*.md" --include="*.py" -l
```

---

## §1 Executive Summary

### 1.1 파일 이동 매핑

Phase 1 완료(2026-02-12). 아래는 이력 기록용.

| 변경 전 경로 | Phase 1 최종 경로 | 비고 |
|-----------|----------------|------|
| `src/pages/admin/LogisticsSchedulePage.tsx` | `src/pages/admin/logistics/LogisticsSchedulePage.tsx` | `logistics/` 폴더 생성 |
| `src/pages/admin/LogisticsHistoryPage.tsx` | `src/pages/admin/logistics/LogisticsHistoryPage.tsx` | |
| `src/pages/admin/SettlementListPage.tsx` | `src/pages/admin/settlement/SettlementListPage.tsx` | `settlement/` 폴더 생성 |
| `src/pages/admin/SettlementDetailPage.tsx` | `src/pages/admin/settlement/SettlementDetailPage.tsx` | |
| `src/pages/admin/TradeListPage.tsx` | `src/pages/admin/trade/TradeListPage.tsx` | `trade/` 폴더 생성 |
| `src/pages/admin/TradeDetailPage.tsx` | `src/pages/admin/trade/TradeDetailPage.tsx` | |
| `src/pages/admin/GeneralSaleOffersPage.tsx` | `src/pages/admin/sale/GeneralSaleOffersPage.tsx` | 기존 `sale/` 폴더로 이동 |
| `src/pages/admin/SalesHistoryPage.tsx` | `src/pages/admin/sale/SalesHistoryPage.tsx` | |

### 1.2 3-Phase Optimization Plan

| 단계 | 목표 | 핵심 과업 | 기대 효과 |
|------|------|-----------|-----------|
| **Phase 1** | 구조 정규화 | SSOT 불일치 파일(Logistics, Trade, Settlement, Sale) 물리적 폴더 이동 및 경로 재매핑 | 코드 가독성 증대, 도메인 격리 강화 |
| **Phase 2** | 라우팅 시스템화 | mockNavigationMap → routeManager 격상, 라우터 설정 최적화 | 상태 기반 라우팅 안정성 확보 |
| **Phase 3** | 위젯/기능 최적화 | 공통 위젯(Sidebar, Table) 의존성 정리 | 컴포넌트 재사용성 극대화 |

### 1.3 Expanded Roadmap (6-Phase)

| 단계 | 핵심 목표 |
|------|-----------|
| Phase 0 | 규칙 선포 (Skeleton VID) |
| Phase 1 | 물리적 구조 정규화 |
| Phase 2 | 라우팅 시스템화 |
| Phase 3 | 뷰/로직 분리 |
| Phase 4 | VID 동기화 (Sync) |
| Phase 5 | 데이터 무결성 및 성능 |
| Phase 6 | 안정성 및 문서화 |

### 1.4 Import 경로 (No Barrel: 직접 경로)

- `@/pages/admin/LogisticsSchedulePage` → `@/pages/admin/logistics/LogisticsSchedulePage`
- `@/pages/admin/LogisticsHistoryPage` → `@/pages/admin/logistics/LogisticsHistoryPage`
- `@/pages/admin/SettlementListPage` → `@/pages/admin/settlement/SettlementListPage`
- `@/pages/admin/SettlementDetailPage` → `@/pages/admin/settlement/SettlementDetailPage`
- `@/pages/admin/TradeListPage` → `@/pages/admin/trade/TradeListPage`
- `@/pages/admin/TradeDetailPage` → `@/pages/admin/trade/TradeDetailPage`
- `@/pages/admin/GeneralSaleOffersPage` → `@/pages/admin/sale/GeneralSaleOffersPage`
- `@/pages/admin/SalesHistoryPage` → `@/pages/admin/sale/SalesHistoryPage`

### 1.5 문서 동기화 대상 (Phase 4에서 일괄 업데이트)

§0.2a grep 검증으로 확정된 문서 목록. Phase 4에서 경로 참조를 Phase 1 최종 경로로 수정.

| 문서 | 실제 경로 참조 유형 |
|------|---------------------|
| docs/figma/FSD_IA_NODEID_SSOT.md | §2.2, §3, §4 코드 참조 열 |
| docs/figma/FSD_IA_NODEID_SSOT_VERIFICATION_REPORT.md | @/pages/admin/logistics/LogisticsSchedulePage 등 (Phase 4 반영) |
| docs/FSD_ENFORCEMENT_RULES.md | src/pages/admin/settlement/SettlementListPage.tsx 등 (Phase 4 반영) |
| docs/figmaMCP/FIGMA_ASSET_TRACEABILITY.md | pages/admin/logistics/LogisticsSchedulePage.tsx (Phase 4 반영) |
| docs/figmaMCP/impl_plans/1714-22332_구현계획.md | src/pages/admin/trade/TradeListPage.tsx (Phase 4 반영) |
| docs/figmaMCP/impl_plans/794-4708_*.md | src/pages/admin/trade/TradeDetailPage.tsx (Phase 4 반영) |
| docs/HANDOFF_NEXT_AGENT.md | LogisticsSchedulePage.tsx, TradeDetailPage.tsx |
| **FRONTEND_ARCHITECTURE_REVIEW.md** | **프로젝트 루트** (docs/ 하위 아님). pages/admin/sale/GeneralSaleOffersPage.tsx 등 (Phase 4 반영) |
| figma-design-audit/src/figma_audit/scope.py | pages/admin/logistics/LogisticsSchedulePage.tsx (Phase 4 반영) |
| docs/README.md, docs/CHANGELOG_2026-02-11.md, docs/SITEMAP_IMPLEMENTATION_STATUS.md | 경로·페이지명 참조 |
| docs/GNB_MINIMAL_SIDEBAR_VERIFICATION.md, docs/FRONTEND_CODE_EVALUATION.md | 페이지 경로 참조 |
| docs/figma/FSD_SPEC_BLUEPRINT.md, docs/figma/IA_SITEMAP_SPEC_IPOE.md | 슬라이스·경로 참조 |
| docs/figma/NODEID_ROUTE_PAGE_FIGMASCR_VERIFICATION.md | 경로 참조 |

---

## §2 문서 인덱스

| § | 내용 |
|---|------|
| §0 | 메타데이터·VID 선언·grep 검증 명령 |
| §1 | Executive Summary·이력·문서 동기화 대상 |
| §3 | VID Protocol 5대 규약 |
| §4 | 전체 사이트맵·라우트 |
| §5 | routeManager 스펙 |
| §6 | Barrel File 전략 |
| §7 | Phase 3 검토 항목 |
| §8 | CarivDealer Code Manifesto |
| §9 | 문서 이력 |

---

## §3 VID Protocol — 5대 절대 규약

| Protocol | 제목 | 핵심 규칙 |
|----------|------|-----------|
| **1** | 아키텍처 원칙 | FSD 계층(app>pages>widgets>features>entities>shared) 엄수. 상위→하위 import만 허용, 역참조 금지. |
| **2** | 네이밍 컨벤션 | 컴포넌트: PascalCase+접미사(~Page, ~Widget, ~Modal). Hook: use+동사+목적어. 상수: SCREAMING_SNAKE_CASE. |
| **3** | 라우팅 전략 | URL as Single Source of Truth. 필터/탭/Step은 useSearchParams로 동기화. |
| **4** | 데이터 관리 | Server State(API)→React Query. Client State(UI)→Local/Zustand. Stale-while-revalidate. |
| **5** | 방어적 프로그래밍 | 로딩→Skeleton, 빈 데이터→Empty State, 에러→Error Boundary, 404→리다이렉트. |

**Protocol 6 (Barrel File)**: **No Barrel 확정**. inspection, auction, sale 기존 패턴과 동일하게 `@/pages/admin/{domain}/{PageName}` 직접 import. logistics, settlement, trade도 동일 적용.

---

## §4 전체 사이트맵·라우트 (Phase 1 최종)

router.tsx 기준. FSD_IA_NODEID_SSOT와 경로 일치. `@/pages/admin/{domain}/{PageName}` 패턴 명시.

**라우트 수**: 공개 11개, 보호 30개(내부 리다이렉트 1 포함), 폴백 1개.

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

---

## §5 routeManager (Phase 2 결과)

- **위치**: `src/shared/utils/navigation/routeManager.ts`
- **역할**: mockNavigationMap 대체. 상태 기반 차량 상세 라우트 생성.
- **FALLBACK_ROUTE 동기화**: `FALLBACK_ROUTE = '/vehicles'`와 router.tsx `path="*"` Navigate 대상이 동일해야 함. 값 변경 시 양쪽 동시 수정 필요.

### 5.1 getVehicleDetailRoute(vehicleId?, status?)

| 조건 | 반환 |
|------|------|
| vehicleId 없음, 빈 문자열, 잘못된 형식 | FALLBACK_ROUTE (`/vehicles`) |
| status 없음, null, 빈 문자열 | `/vehicles/:vehicleId` |
| status='draft' | MOCK_VEHICLE_TO_INSPECTION 매핑 있으면 `/inspections/:id/progress`, 없으면 `/inspections/request?vehicleId=...` |
| status='inspection' | 동일 |
| status='active_sale' | `/vehicles/:vehicleId/trade` |
| status='bidding' | `/vehicles/:vehicleId/auction` |
| status='sold' | `/logistics/schedule?vehicleId=...` |
| status='pending_settlement' | MOCK_VEHICLE_TO_SETTLEMENT 매핑 있으면 `/settlements/:id`, 없으면 `/settlements` |
| status='completed' | MOCK_VEHICLE_TO_SETTLEMENT 매핑 있으면 `/settlements/:id`, 없으면 `/vehicles/:vehicleId` |
| status 미등록 (알 수 없는 값) | `/vehicles/:vehicleId` |

### 5.2 MOCK_VEHICLE_TO_* 매핑

- `MOCK_VEHICLE_TO_INSPECTION`: vehicleId → inspectionId (draft, inspection용)
- `MOCK_VEHICLE_TO_SETTLEMENT`: vehicleId → settlementId (pending_settlement, completed용)
- 사용처: TradeListPage, VehicleListPage. `@/shared/utils/navigation/routeManager` import.

---

## §6 Barrel File 전략

**결정**: **No Barrel로 통일**. logistics, settlement, trade도 `@/pages/admin/logistics/LogisticsSchedulePage` 형태로 직접 import.

- logistics·settlement·trade에만 Barrel을 도입하면 같은 admin 구조 안에서 import 방식이 섞여 코드베이스 일관성이 해짐.
- Barrel을 적용하려면 inspection, auction, sale 등 모든 admin 도메인에 Barrel을 도입해야 함. (Phase 1 범위 외)

---

## §8 CarivDealer Code Manifesto

### 정조 (Core Principles)

1. **단일 진실 공급원**: URL·SSOT·코드 경로 일치. 문서와 코드 동기화 필수.
2. **FSD 계층 준수**: app→pages→widgets→features→entities→shared. 역참조 금지.
3. **가독성 우선**: 성급한 최적화 금지. Early Return, 명확한 네이밍.
4. **방어적 프로그래밍**: 로딩·빈 데이터·에러·404 모든 상태 처리.

### 3-Tier Commenting Strategy

| 레벨 | 대상 | 규칙 |
|------|------|------|
| **L1** | Interface / Types / Props | [필수] JSDoc 형식. IDE 툴팁 노출. |
| **L2** | Complex Logic / Regex | [필수] Inline Comment. 복잡한 알고리즘, 정규식, 예외 처리의 '의도(Why)' 설명. |
| **L3** | General Code | [금지] 변수명, 함수명으로 설명 가능한 뻔한 내용. |

### Readability vs Optimization

- **대원칙**: "성급한 최적화(Premature Optimization)는 만악의 근원이다."
- **가독성 우선**: 변수명(데이터 내용), 함수명(동사+목적어), Early Return, Magic Number 금지.
- **최적화**: Profiling 후 병목 확인 시에만. useMemo/useCallback은 무거운 계산·자식 리렌더 방지 필요 시만.

### Standard Work Flow (The Ritual)

1. **Make it Work**: 비즈니스 로직 구현, 기능 동작.
2. **Make it Right**: 변수명 교체, 함수 분리, 중복 제거. L1/L2 주석 작성.
3. **Make it Fast**: 성능 이슈 부분만 선별 최적화.
4. **Review**: 로직 결함, 엣지 케이스 처리 여부 검증.

---

## §7 Phase 3 검토 항목 (실행 완료)

**Phase 3 실행 완료** (2026-02-12). 아래는 Task A·B·C 결과 반영.

**실행 방법론**: [PHASE3_METHODOLOGY.md](PHASE3_METHODOLOGY.md) — 완수 기준, 달성 요구사항, 개발 전략, 검사·인테그레이션 상세.

### 7.1 Feature 분리 (De-coupling) — 완료

| Task | 결과 |
|------|------|
| **Task A** | `ocrRegistration`을 `features/vehicle-registration`으로 분리 완료. `VehicleRegisterStep1Page`만 `@/features/vehicle-registration`에서 import. `register-form`의 `useVehicle`, `useVehicles`, `getVehicleStatistics`는 유지. |

**register-form 의존성 범위**: useVehicle, useVehicles — VehicleListPage, TradeListPage, DashboardPage, VehicleDetailPage, TradeDetailPage, AuctionDetailPage, GeneralSalePricePage, AuctionStartPricePage. ocrRegistration은 vehicle-registration으로 분리됨.

### 7.2 위젯 표준화 — 완료

| 위젯 | Task | 결과 |
|------|------|------|
| **ProgressSidebar** | import 통일 | `InspectionRequestLandingPage`가 `@/widgets/ProgressSidebar`로 변경. `ProgressSidebar/ui` 직접 import 0건. |
| **VehicleListTableWithExpand** | columnDefs POC | `ColumnDef<T>` 인터페이스, `columnDefs` prop 도입. VehicleListPage·TradeListPage에서 POC 적용 완료. `DEFAULT_VEHICLE_COLUMN_DEFS` export. |
| **InspectionRequestLandingPage** | ProgressSidebar import 표준화 | `@/widgets/ProgressSidebar`로 통일 완료 |

---

## §9 문서 이력

| 버전 | 일자 | 비고 |
|------|------|------|
| 1.0 | 2026-02-12 | Phase 0 Skeleton VID 생성. §0.2a grep 검증 반영. |
| 1.1 | 2026-02-12 | Phase 1~4 완료. routeManager 승격, mockNavigationMap 제거. §1.5 문서 동기화 대상 Phase 4 반영. |
| 1.2 | 2026-02-12 | §0.2a grep 명령 명시, §1.1 이력 표 전환, §4 사이트맵·라우트 추가, §5 routeManager 스펙 추가, §8 정조 4줄 추가. |
| 1.3 | 2026-02-12 | routeManager JSDoc §2.5→§5, README mockNavigationMap→routeManager, §4 /mypage 행·라우트 수치·FALLBACK_ROUTE 동기화 명시. |
| 1.4 | 2026-02-12 | Phase 3 실행 완료. §7 검토→실행 완료. Task A·B·C 결과 반영. |
