# GNB 미니 사이드바 검증 로그

## 요구사항
- GNB에서 **검차 / 거래 / 탁송 / 정산** 탭 진입 시
- 사이드바는 **구역만 남기고 검색만** 두는 형태 (MainLandingSidebar의 차량목록 필터 목록 없음)

## 구현 요약

### 1. GnbMinimalSidebar 위젯
- **경로**: `src/widgets/GnbMinimalSidebar/ui/GnbMinimalSidebar.tsx`
- **역할**: 구역 제목(sectionTitle) + 검색 input만 노출
- **테스트 식별**: `data-testid="gnb-minimal-sidebar"`, `data-testid="gnb-sidebar-section"`

### 2. 적용 페이지
| 경로 | 페이지 | 구역명 | activeNav |
|------|--------|--------|-----------|
| `/inspections` | InspectionListPage | 검차 | inspections |
| `/offers` | TradeListPage | 거래 | offers |
| `/logistics/schedule` | LogisticsSchedulePage | 탁송 | logistics |
| `/logistics/history` | LogisticsHistoryPage | 탁송 | logistics |
| `/settlements` | SettlementListPage | 정산 | settlements |
| `/settlements/:id` | SettlementDetailPage | 정산 | settlements |

### 3. 제거·변경 사항
- **InspectionListPage**: 기존 aside 내 "목록(검차 신청 목록/검차내역)" 제거 → GnbMinimalSidebar(구역+검색만)로 교체
- **TradeListPage**: 사이드바 없음 → GnbMinimalSidebar 추가
- **LogisticsSchedulePage / LogisticsHistoryPage**: ProgressSidebar 제거 → GnbMinimalSidebar, activeNav `vehicles` → `logistics`
- **SettlementListPage / SettlementDetailPage**: ProgressSidebar 제거 → GnbMinimalSidebar, activeNav `vehicles` → `settlements`

## E2E 검증 결과

**실행 명령**
```bash
npx playwright test tests/e2e/11-gnb-minimal-sidebar.spec.ts --reporter=list
```

**환경**
- 인증: beforeEach에서 `localStorage.setItem('carivdealer_auth', 'true')` 설정 후 해당 경로 접근
- baseURL: http://localhost:3000 (playwright.config.ts)

**결과 (2025-02-09 기준)**
| 테스트 | 결과 |
|--------|------|
| /inspections → 구역 "검차" + 검색만 노출 | ✅ passed |
| /offers → 구역 "거래" + 검색만 노출 | ✅ passed |
| /logistics/schedule → 구역 "탁송" + 검색만 노출 | ✅ passed |
| /logistics/history → 구역 "탁송" + 검색만 노출 | ✅ passed |
| /settlements → 구역 "정산" + 검색만 노출 | ✅ passed |

**검증 내용**
- 각 경로에서 `gnb-minimal-sidebar` 노출
- `gnb-sidebar-section`에 해당 구역명(검차/거래/탁송/정산) 표시
- 검색 input 존재
- MainLandingSidebar용 `a[href*="/vehicles?filter="]` 링크 0개 (차량목록 필터 미노출)

## 정리
- GNB 탭 전용 미니 사이드바(구역+검색) 적용 완료.
- E2E 5건 통과로 동작 검증 완료.
