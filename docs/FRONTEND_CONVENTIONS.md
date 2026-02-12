# 프론트엔드 코딩 규칙 및 가이드

**버전**: 1.1  
**최종 업데이트**: 2026-02-13  
**검증 상태**: 문서화 완료 / 코드베이스 대조 완료 (2026-02-13)

> **완료 플랜 검증**: getVehicleStatistics 방어, logEvent 추상화, mutation onError 공통화, API 훅 import 일관성, ErrorBoundary 개선, ImageWithFallback 적용 — 6개 항목 전부 코드 일치. [STATE_MANAGEMENT_POLICY.md §11.5](STATE_MANAGEMENT_POLICY.md)

---

## 1. Mock 사용 정책

### 1.1 mockFallback 적용 대상

`apiClient`의 `apiCall` 함수는 타임아웃(30초) 또는 네트워크 에러 시 `mockFallback`이 있으면 해당 함수를 호출해 Mock 데이터를 반환한다.

**mockFallback이 적용된 API** (예시):

| API | mockFallback | 용도 |
|-----|--------------|------|
| `assignEvaluator` | `mockResponses.assignEvaluator` | 검차 평가사 배정 |
| `uploadInspectionResult` | `mockResponses.uploadInspectionResult` | 검차 결과 업로드 |
| `getInspectionResult` | `mockResponses.getInspectionResult` | 검차 결과 조회 |
| `auction.bid` | `mockResponses.auction.bid` | 경매 입찰 |
| `auction.buyNow` | `mockResponses.auction.buyNow` | 즉시구매 |
| `acceptProposal` | `mockResponses.acceptProposal` | 제안 수락/거절 |
| `scheduleLogistics` | `mockResponses.scheduleLogistics` | 탁송 일정 등록 |
| `requestDispatch` | `mockResponses.requestDispatch` | 배차 요청 |
| `confirmDispatch` | `mockResponses.confirmDispatch` | 배차 확정 |
| `approveHandover` | `mockResponses.approveHandover` | 인계 승인 |
| `notifySettlement` | `mockResponses.notifySettlement` | 정산 알림 |

**API 미구현 시 방어적 처리**:

- `vehicleApi.getVehicleStatistics`: 백엔드 엔드포인트가 없어 `Promise.resolve({})`로 mock 반환. API 구현 시 `apiClient.post` 호출로 복원.

### 1.2 Mock 데이터 소스

| 소스 | 위치 | 사용처 |
|------|------|--------|
| `mockResponses` | `shared/api/mockData.ts` | apiClient 타임아웃/네트워크 폴백 |
| `MOCK_VEHICLES_ALL` | `shared/api/mockLists.ts` | `useVehicles` (VITE_USE_MOCK_LIST=true 또는 dev) |
| `MOCK_LOGISTICS_ITEMS` | `shared/api/mockLists.ts` | `LogisticsSchedulePage` |
| `MOCK_LOGISTICS_HISTORY` | `shared/api/mockLists.ts` | `LogisticsHistoryPage` |
| `MOCK_INSPECTIONS` | `pages/admin/inspection/mockInspectionList.ts` | InspectionListPage, InspectionCompletePage, InspectionProgressPage, InspectionHistoryPage |
| `SettlementListPage` | 인라인 | 정산 목록 |
| `SettlementDetailPage` | 인라인 | 정산 상세 |
| `GeneralSaleOffersPage` | 인라인 | 일반 판매 제안 |
| `SalesHistoryPage` | 인라인 | 판매 이력 |

### 1.3 환경 변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `VITE_USE_MOCK_LIST` | `true` 시 차량 목록 Mock 사용 | dev: `true`, prod: `false`(명시 시) |
| `VITE_RUN_DEV` | 런데브 환경 (Mock 로그 출력) | - |

---

## 2. _isMockData 플래그 활용 방식

### 2.1 규칙

- `apiCall`의 `mockFallback`에서 반환하는 객체에 `_isMockData: true`를 자동 부여한다.
- 배열은 플래그를 부여하지 않음 (단일 객체만 대상).
- UI에서 Mock 데이터를 시각적으로 구분하거나, 분석·디버깅 시 사용할 수 있다.

### 2.2 사용 예시

```typescript
// apiClient 내부 (apiCall)
if (typeof fallbackResult === 'object' && fallbackResult !== null && !Array.isArray(fallbackResult)) {
  (fallbackResult as Record<string, unknown>)._isMockData = true;
}
return fallbackResult;
```

```typescript
// 사용처 (예: 분석/디버깅)
const result = await apiClient.inspection.assignEvaluator(inspectionId);
if ((result as { _isMockData?: boolean })._isMockData) {
  console.warn('Mock 데이터 사용 중');
}
```

---

## 3. 데이터 소스 현황

### 3.1 Firestore 직접 vs apiClient

| 도메인 | 소스 | 비고 |
|--------|------|------|
| 차량 목록 | Firestore 또는 Mock | `useVehicles`: Firestore 직접 조회 또는 `MOCK_VEHICLES_ALL` |
| 경매 입찰·즉시구매 | apiClient | Firebase Functions → mockFallback |
| 검차 신청·결과 | apiClient | Firebase Functions → mockFallback |
| 탁송 | apiClient | Firebase Functions → mockFallback |
| 정산 | Mock (인라인) | 백엔드 API 연동 전 |
| 일반 판매 | Mock (인라인) | 백엔드 API 연동 전 |
| 검차 목록 | Mock (mockInspectionList) | Firestore 직접 조회 전 |

### 3.2 API import 경로

- **권장**: `@/shared/api/client` (FSD alias, re-export)
- `client.ts`는 `apiClient`를 re-export한다.
- features 훅·API 호출부는 `@/shared/api/client` 사용을 권장.

---

## 4. 에러 처리

| 패턴 | 용도 |
|------|------|
| `handleError(err)` | 에러 메시지 변환 (user-friendly) |
| `showToast(handleError(err), 'error')` | mutation `onError` 공통 패턴 |
| `analyzeError(error)` | ErrorBoundary, 네트워크/타임아웃 등 분류 |

---

## 5. 로깅

- `logEvent` / `logEventWithHypothesis`: `shared/lib/logEvent.ts`
- PROD 또는 `!VITE_LOG_INGEST_URL` 시 no-op
- `fetch(LOG_INGEST_URL, ...)` 직접 호출 대신 `logEvent` 사용
