# CarivDealer 상태 관리 정책 및 개발 로드맵

**목적**: CarivDealer 프론트엔드 상태 관리 현황·정책·갭 분석 및 TanStack Query·Provider 중심 개선 제언.  
**참조**: [CarivDealer_IA.md](CarivDealer_IA.md), [CarivDealer_UserFlow.md](CarivDealer_UserFlow.md), [CarivDealer_API_ERD_Mapping.md](CarivDealer_API_ERD_Mapping.md), [CarivDealer_api_v1.md](CarivDealer_api_v1.md), [CarivDealer_VID.md](CarivDealer_VID.md)

---

## §0 메타데이터

| 항목 | 내용 |
|------|------|
| **버전** | 1.5 |
| **작성일** | 2026-02-12 |
| **최종 수정** | 2026-02-13 — 진행 전 처리(P0 필수) 체크리스트 추가 |
| **의존 문서** | CarivDealer_IA, CarivDealer_UserFlow, CarivDealer_API_ERD_Mapping, CarivDealer_api_v1, CarivDealer_VID, FSD_IA_NODEID_SSOT |
| **벤치마크** | TanStack Query v5 공식 문서, enterprise 패턴 |

---

## §1 현행 상태 관리 정책

### 1.1 Provider 스택 (main.tsx)

```
StrictMode
  └─ ErrorBoundary
       └─ QueryProvider (TanStack Query)
            └─ ToastProvider
                 └─ DevSkipProvider
                      └─ AuthProvider
                           └─ Router
```

| Provider | 역할 | 상태 저장소 |
|----------|------|-------------|
| **ErrorBoundary** | 예외 포착, 폴백 UI | — |
| **QueryProvider** | 서버 상태 캐시·동기화 | QueryClient (메모리) |
| **ToastProvider** | 토스트 알림 (success/error/info/warning) | useState |
| **DevSkipProvider** | 개발용 필수 입력 스킵 | localStorage |
| **AuthProvider** | 로그인 여부 | localStorage |

### 1.2 서버 상태 (TanStack Query)

| 훅 | queryKey | 데이터 소스 | staleTime |
|----|----------|-------------|-----------|
| `useVehicles` | `['vehicles', ownerId?, status?]` | Firestore / Mock | 5분 |
| `useVehicle` | `['vehicles', vehicleId]` | Firestore | 5분 |
| `useInspections` | `['inspections', vehicleId?, evaluatorId?, status?]` | Firestore | (기본) |
| `useVehicleRegister` | mutation | apiClient | — |
| `useInspectionRequest` | mutation | apiClient | — |
| `useBid` | mutation | apiClient | — |
| `useBuyNow` | mutation | apiClient | — |

### 1.3 QueryClient 설정 (queryClient.ts)

```ts
queries: {
  staleTime: 5 * 60 * 1000,   // 5분
  gcTime: 10 * 60 * 1000,     // 10분
  retry: 1,
  refetchOnWindowFocus: false,
  refetchOnMount: true,
}
mutations: { retry: 0 }
```

### 1.4 클라이언트 상태 (로컬)

| 구분 | 사용처 | 패턴 |
|------|--------|------|
| **URL 파라미터** | VehicleListPage, TradeListPage, InspectionListPage 등 | `useSearchParams` (SSOT) |
| **폼 상태** | VehicleRegisterStep1, LogisticsSchedule 등 | `useState` |
| **모달/뷰** | viewMode, modalOpen | `useState` |

---

## §2 IA·유저플로우 기반 요구사항

### 2.1 Core Loop (UserFlow §1)

```
차량등록 → 검수 → 판매/경매 → 낙찰/유찰 → 탁송 → 정산완료
```

**상태 동기화 요구**:
- 차량 상태(`status`) 변경 시 목록·상세·routeManager 일관성
- 검차 신청/진행 → 차량 상세 상태 반영
- 경매 낙찰 → 거래상세·탁송 플로우 연계
- 정산 완료 → 완료 상태 갱신

### 2.2 인증 플로우 (IA §5.2, UserFlow §2)

- 비로그인 시 `/signup` 리다이렉트
- `redirect` 쿼리로 로그인 후 복귀
- **갭**: AuthProvider는 boolean만 제공, 사용자 정보(User) 없음

### 2.3 트랜잭션 플로우 (UserFlow §3)

- 경매 입찰: 입찰 → 가격 갱신 → 낙찰/유찰
- 정산: 매각 확정 → 계좌 입력 → 세금계산서 → 입금 확인

**상태 요구**: 실시간성·낙관적 업데이트(Optimistic Update) 가능성

### 2.4 예외·폴백 (UserFlow §4)

- `handleApiError` 중앙화, Mock 폴백 시 `_isMockData`
- Empty State, 로딩·에러 UI

### 2.5 API·ERD·VID 정합성 (참조 문서 일치화)

| 참조 문서 | 핵심 내용 | 본 정책과의 일치 |
|-----------|-----------|------------------|
| **CarivDealer_API_ERD_Mapping** | 정산·탁송·경매·오퍼 엔드포인트 제안, status enum, 계산값(displayStatus, primaryCta) | P0 useSettlements/useLogistics 구현 시 매핑 문서 제안 엔드포인트·스키마 반영 |
| **CarivDealer_api_v1** | 회원·차량·검차 현재 명세. 탁송·정산·거래·경매는 "확장 제안"으로 ERD_Mapping 참조 | apiEndpoints.ts와 Functions 연동. 확장 시 api_v1 §4 라우트↔API 매핑 반영 |
| **CarivDealer_VID** | Protocol 4: Server State(API)→React Query. Stale-while-revalidate | 본 정책의 TanStack Query 적용과 동일 |

**API 응답 포맷** (api_v1 공통): `{ ok: boolean, result: object | null, message: string | null }` — queryFn 내 `result` 추출 후 Zod parse 적용.

**엔드포인트 갭** (ERD_Mapping 제안 vs apiEndpoints.ts 현행):
- 정산: `GET /settlements`, `GET /settlements/:id` → 현재 SETTLEMENT.NOTIFY만. 목록·상세 API 확장 필요.
- 탁송: `GET /logistics/schedule`, `GET /logistics/history` → 현재 LOGISTICS는 schedule/dispatch/handover만. 목록·내역 API 확장 필요.
- 매출: `GET /sales/history` → apiEndpoints에 미정의. 확장 필요.

---

## §3 현재 적용 현황 (갭 분석)

### 3.1 TanStack Query 적용 페이지

| 페이지 | 훅 | 데이터 소스 | 비고 |
|--------|-----|-------------|------|
| VehicleListPage | useVehicles | Firestore/Mock | ✅ |
| TradeListPage | useVehicles | Firestore/Mock | ✅ (차량 기반 필터) |
| VehicleDetailPage | useVehicle | Firestore | ✅ |
| InspectionListPage | useInspections | Firestore | ✅ |
| InspectionRequestStep1 | useVehicles | Firestore/Mock | ✅ |
| (기타) | — | — | — |

### 3.2 useState + useEffect 패턴 (Query 미적용)

| 페이지 | 패턴 | 데이터 |
|--------|------|--------|
| **SettlementListPage** | `useEffect` + `loadSettlements()` | Mock 인라인 |
| **SettlementDetailPage** | (추정) 비슷 | Mock/API |
| **LogisticsSchedulePage** | `useState(listItems)` | MOCK_LOGISTICS_ITEMS |
| **LogisticsHistoryPage** | (추정) 비슷 | Mock |
| **SalesHistoryPage** | (추정) 비슷 | Mock |
| **GeneralSaleOffersPage** | 로컬 상태 | 제안 수락/거절 mutation |
| **DashboardPage** | (추정) | 요약 데이터 |

### 3.3 Mutation invalidation 현황

| mutation | invalidation 대상 |
|----------|-------------------|
| useVehicleRegister | `['vehicles']` |
| useInspectionRequest | `['inspections']`, `['vehicles']` |
| useBid | `['auctions']` |
| useBuyNow | `['auctions']`, `['vehicles']` |

### 3.4 갭 요약

| 갭 | 설명 | 영향 |
|----|------|------|
| **정산·탁송·판매목록** | useQuery 미적용 | 캐시·재시도·stale 관리 불가 |
| **Optimistic Update** | 미적용 | 입찰·제안 수락 시 지연 체감 |
| **Prefetch** | 미적용 | 라우트 전환 시 waterfall |
| **Auth 사용자 정보** | boolean만 | 프로필·권한 등 확장 제한 |
| **실시간 경매** | 없음 | 경매 진행 시 갱신 수동 |

### 3.5 현황 분석: The Good, The Bad, and The Missing

#### ✅ The Good (잘된 점)

| 항목 | 내용 |
|------|------|
| **Provider Layering** | `QueryProvider → ToastProvider → AuthProvider` 순서의 계층 구조가 견고함. 전역 에러/알림 처리가 용이. |
| **Basic Query Setup** | `useVehicles`, `useInspections` 등 핵심 도메인은 TanStack Query를 도입하여 기본적인 캐싱 이점 확보. |

#### ⚠️ The Bad (아쉬운 점)

| 항목 | 내용 |
|------|------|
| **Partial Adoption (반쪽짜리 도입)** | Settlement(정산), Logistics(탁송) 등 **돈과 관련된 중요 도메인**이 여전히 `useState` + `useEffect`로 관리됨. "새로고침해야만 최신 정보가 보이는" 구식 UX 유발. |
| **Coarse-grained Invalidation** | Mutation 후 `invalidateQueries` 전략이 너무 거칠거나(`['vehicles']` 전체 무효화 등), 아예 누락된 경우 존재. |

#### 🚫 The Missing (누락된 점)

| 항목 | 내용 |
|------|------|
| **Real-time Sync** | 경매 시스템에서 5분 캐싱(staleTime)은 **치명적**. 다른 사람이 입찰했는데 내 화면엔 5분 전 가격이 보이면 사고 위험. |
| **Optimistic Updates** | '낙찰', '승인' 버튼을 눌렀을 때 UI가 즉시 반응하지 않고 서버 응답을 기다리는 딜레이는 사용자 경험 저해. |

---

## §4 벤치마크 (TanStack Query Best Practices)

### 4.1 공식 문서 기준 (2024)

| 패턴 | 설명 | CarivDealer 적용 |
|------|------|------------------|
| **QueryClientProvider** | 앱 루트 래핑 | ✅ 적용 |
| **queryKey 일관성** | `['domain', id?, filter?]` | ✅ 일부 (vehicles, inspections) |
| **staleTime/gcTime** | 도메인별 조정 | 전역 5분/10분 |
| **Prefetching** | 라우터 hover/구간 전환 시 선로딩 | ❌ 미적용 |
| **Optimistic Update** | mutation 전 UI 선반영 | ❌ 미적용 |
| **Invalidation** | mutation 후 관련 query stale | ✅ 일부 |
| **Error Boundary** | QueryErrorBoundary | ErrorBoundary만 (Query 전용 아님) |
| **Suspense** | (선택) | ❌ 미적용 |

### 4.2 Enterprise 패턴

- **Request Waterfall 방지**: 병렬 fetch, prefetch
- **SSR/Hydration**: (현재 SPA 전제)
- **도메인별 QueryClient 분리**: (선택) member/vehicle/inspection 등

---

## §5 전략적 제언: "Static to Reactive"

단순히 라이브러리를 쓰는 것을 넘어, **데이터의 성격(Data Nature)**에 따라 캐싱 전략을 차별화해야 합니다.

### 5.1 Strategy 1: 도메인별 캐싱 전략 이원화 (Split Strategy)

| 데이터 성격 | 대상 도메인 | 전략 (StaleTime) | 비고 |
|-------------|-------------|------------------|------|
| **High Frequency** | 경매(Auction), 실시간 거래 | `staleTime: 0` (Always Stale) | `refetchInterval: 5000` (5초 폴링) 또는 WebSocket 도입 필수 |
| **Mid Frequency** | 검차 진행, 탁송 상태 | `staleTime: 30초 ~ 1분` | 사용자가 보고 있는 동안 최신 상태 유지 필요 |
| **Low Frequency** | 차량 목록, 정산 내역 | `staleTime: 5분 ~ 10분` | 자주 변하지 않음. 적극적 캐싱 권장 |

### 5.2 Strategy 2: "Optimistic UI" 표준화 (UX Upgrade)

모든 Mutation(생성/수정/삭제) 훅에 낙관적 업데이트 패턴을 표준으로 적용.

```ts
// useBid.ts 예시
onMutate: async (newBid) => {
  await queryClient.cancelQueries({ queryKey: ['auction', id] });
  const previousBid = queryClient.getQueryData(['auction', id]);

  // UI 즉시 업데이트 (내가 입력한 가격으로)
  queryClient.setQueryData(['auction', id], (old) => ({ ...old, currentPrice: newBid }));
  return { previousBid };
},
onError: (err, newBid, context) => {
  // 에러 시 롤백
  queryClient.setQueryData(['auction', id], context.previousBid);
}
```

**적용 대상**: `useBid`, `useBuyNow`, 제안 수락/거절, 탁송 인계 승인 등.

### 5.3 Strategy 3: "Global Store"로서의 QueryClient 활용

AuthProvider의 `user` 객체도 `useUser` 쿼리로 관리하는 것을 고려. Firebase Auth의 `onAuthStateChanged`를 Query의 subscription으로 연결하면, **모든 상태를 QueryClient 하나로 통합 관리** 가능해 디버깅과 동기화가 쉬워짐.

---

## §6 Provider·TanStack Query 핏 적용

### 6.1 Provider 유지·보강

| Provider | 제언 |
|----------|------|
| **QueryProvider** | 유지. `defaultOptions`는 도메인별 오버라이드 가능하게 |
| **ToastProvider** | 유지. mutation onError에서 `showToast` 연동 표준화 |
| **AuthProvider** | 확장: `user: User | null` 또는 `useUser` 쿼리로 전환 (Strategy 3) |
| **DevSkipProvider** | 유지 |
| **ErrorBoundary** | (선택) tanstack/react-query `QueryErrorBoundary` 도입 |

### 6.2 TanStack Query 확대 적용

| 대상 | 훅 예시 | queryKey | 데이터 소스 |
|------|----------|----------|-------------|
| **정산 목록** | `useSettlements` | `['settlements', filter?]` | apiClient / Mock |
| **정산 상세** | `useSettlement` | `['settlements', id]` | apiClient |
| **탁송 목록** | `useLogistics` | `['logistics', vehicleId?]` | apiClient / Mock |
| **판매 내역** | `useSalesHistory` | `['sales', period?]` | apiClient |
| **제안 목록** | `useProposals` | `['proposals']` | apiClient |

### 6.3 Mutation 패턴 통일

```ts
// 공통 패턴
const queryClient = useQueryClient();
return useMutation({
  mutationFn: apiClient.xxx.yyy,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['domain'] });
    showToast('성공', 'success');
  },
  onError: (err) => {
    const msg = handleError(err, 'MutationName');
    showToast(msg, 'error');
  },
});
```

---

## §7 Action Plan (우선순위)

### P0: Missing Domains Migration (가장 시급)

**Settlement, Logistics 페이지를 `useEffect` → `useQuery`로 전면 리팩토링.**

| 작업 | 대상 | 산출물 | API·스키마 참조 |
|------|------|--------|-----------------|
| `useSettlements` | SettlementListPage | `features/settlement/model/useSettlements.ts` | ERD_Mapping §정산: GET /settlements(status, from, to, page, size). `entities/settlement/model/schema.ts` |
| `useSettlement` | SettlementDetailPage | `features/settlement/model/useSettlement.ts` | ERD_Mapping §정산: GET /settlements/:id. `settlementSchema` |
| `useLogistics` | LogisticsSchedulePage, LogisticsHistoryPage | `features/logistics/model/useLogistics.ts` | ERD_Mapping §물류: GET /logistics/schedule, GET /logistics/history. `entities/logistics/model/schema.ts` |
| `useSalesHistory` | SalesHistoryPage | `features/sale/model/useSalesHistory.ts` | ERD_Mapping §정산: GET /sales/history. sale_type enum (general, auction) |

**예상 효과**: 캐시·재시도·stale 관리, "새로고침 없이 최신 정보" UX.

**참고**: apiEndpoints.ts·Firebase Functions에 GET 정산/탁송/매출 목록·상세 API가 없으면 Mock 폴백으로 먼저 구현. 백엔드 확장 시 ERD_Mapping·api_v1 §4 반영.

### P1: Auction Polling (실시간성 확보)

**경매 상세 페이지(useAuction)에 `refetchInterval` 추가.**

| 작업 | 대상 | 내용 |
|------|------|------|
| `useAuction` 신규 | AuctionDetailPage | `queryKey: ['auction', auctionId]` |
| refetchInterval | `5000` (5초) | `staleTime: 0`과 함께 |
| (선택) WebSocket | 추후 | 실시간 입찰 경쟁 시 |

**예상 효과**: 다른 사람 입찰 시 5초 이내 화면 갱신.

### P2: Key Factory & Zod (Critical)

**Query Key 중앙 관리 + 런타임 스키마 검증 통합.**

| 작업 | 대상 | 산출물 |
|------|------|--------|
| Query Key Factory | vehicleKeys, inspectionKeys, auctionKeys 등 | `shared/api/queryKeys.ts` |
| Zod 통합 | 모든 queryFn 내 API 응답 | `schema.parse(data)` 표준화 |
| 기존 훅 전면 교체 | useVehicles, useVehicle, useInspections 등 | queryKey → factory, raw data → parse |

**예상 효과**: 캐시 미스·무효화 실패 방지, 백엔드 사양 변경 시 즉시 감지, 데이터 오염 방지.

### P3: Infinite Queries (Scalability)

**대규모 목록 도메인에 useInfiniteQuery 전환.**

| 작업 | 대상 | 내용 |
|------|------|------|
| useInfiniteVehicles | VehicleListPage | `initialPageParam`, `getNextPageParam` |
| useInfiniteSalesHistory | SalesHistoryPage | 동일 패턴 |
| useInfiniteTrades | TradeListPage | 동일 패턴 |
| UI | 무한 스크롤 또는 "더보기" | `fetchNextPage`, `hasNextPage` |

**예상 효과**: 수백·수천 건 목록에서 렌더링 성능 확보.

### P4: Selective Persist (Security & UX)

**필요한 캐시만 골라서 스토리지 저장.**

| 작업 | 대상 | 내용 |
|------|------|------|
| 패키지 설치 | `@tanstack/react-query-persist-client` 등 | — |
| whitelist | vehicles, settlements | 읽기 전용·오프라인 조회 |
| blacklist | user, auction 입찰 금액 | 민감정보·실시간성 우선 |
| persister | `createSyncStoragePersister` | `serialize`/`deserialize` 필터 적용 |

**예상 효과**: 새로고침·오프라인 대응 + 보안·용량 관리.

---

## §8 Developer Experience & Stability

### 8.1 제언 A: Query Key Factory (DX & Consistency)

**문제**: `['vehicles', id, status]`처럼 Query Key를 배열 리터럴로 하드코딩하면, 개발자마다 순서를 틀리거나 오타를 낼 확률이 높아짐. 이는 **캐시 미스(Cache Miss)**와 **무효화 실패(Invalidation Fail)**의 원인이 됨.

**해법**: 모든 Query Key를 중앙에서 관리하는 Factory Pattern을 도입.

```ts
// shared/api/queryKeys.ts
export const vehicleKeys = {
  all: ['vehicles'] as const,
  lists: () => [...vehicleKeys.all, 'list'] as const,
  list: (filters: string) => [...vehicleKeys.lists(), { filters }] as const,
  details: () => [...vehicleKeys.all, 'detail'] as const,
  detail: (id: string) => [...vehicleKeys.details(), id] as const,
};

// 사용처
useQuery({ queryKey: vehicleKeys.list(filters), ... });
queryClient.invalidateQueries({ queryKey: vehicleKeys.lists() });
```

**효과**: 자동완성 지원, 키 구조 변경 시 한 곳만 수정하면 됨.

### 8.2 제언 B: Persist Query Client (Resilience)

**문제**: 사용자가 페이지를 새로고침하면, 메모리(QueryClient)에 있던 모든 캐시가 날아감. 네트워크가 불안정하거나 오프라인 상태가 되면 앱이 백지(Empty)가 됨.

**해법**: React Query Persist Client를 도입하여 쿼리 캐시를 localStorage나 sessionStorage에 저장.

```ts
// main.tsx 또는 QueryProvider
import { persistQueryClient } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

persistQueryClient({
  queryClient,
  persister,
  maxAge: 1000 * 60 * 60 * 24, // 24시간 유지
});
```

**효과**: 새로고침 해도 이전 데이터가 즉시 보임(Stale-While-Revalidate). 오프라인 상태에서도 앱 사용 가능.

### 8.3 제언 C: Boundary Schema Validation (Zod 통합)

**문제**: TypeScript는 컴파일 타임에만 유효. 백엔드에서 예기치 못한 데이터 필드를 보내거나 타입을 깨뜨려도 클라이언트는 그대로 캐시에 저장하고, 이는 **런타임 에러(Runtime Crash)**로 이어짐.

**해법**: TanStack Query의 `queryFn` 내부에서 Zod를 이용한 런타임 데이터 검증 수행.

```ts
// entities/vehicle/model/schema.ts (기존 vehicleSchema 활용)
// useVehicle.ts
useQuery({
  queryKey: vehicleKeys.detail(id),
  queryFn: async () => {
    const data = await apiClient.getVehicle(id);
    return vehicleSchema.parse(data); // 데이터가 다르면 에러 바운더리로 즉시 전달
  },
});
```

**효과**: 데이터 오염 방지, 백엔드 사양 변경 시 즉시 감지, 프론트엔드 코드의 견고함 확보.

**현재 코드베이스**: `useVehicles`, `useVehicle`, `useInspections`, `useVehicleRegister`는 이미 `vehicleSchema.parse`, `inspectionSchema.parse` 사용. **apiClient 응답**에 대한 검증은 일부만 적용됨.

### 8.4 제언 D: Infinite Query 전략 (Scalability)

**문제**: 차량 목록(useVehicles)이나 거래 내역(useSalesHistory)이 수백·수천 건으로 늘어날 경우 단순 배열은 **렌더링 성능 저하**를 유발.

**해법**: 기존 `useQuery`를 대규모 목록 도메인에 대해 `useInfiniteQuery`로 전환.

| 적용 대상 | 페이지 | 비고 |
|-----------|--------|------|
| VehicleListPage | 차량 목록 | 페이지네이션 → 무한 스크롤 또는 "더보기" |
| SalesHistoryPage | 판매 내역 | 동일 |
| TradeListPage | 거래 목록 | 동일 |

**패턴**: TanStack Query v5의 `initialPageParam` 및 `getNextPageParam`을 사용하여 표준화.

### 8.5 제언 E: Selective Persistence (Security & UX)

**문제**: P4: Persist Cache 적용 시, localStorage에 **민감한 사용자 정보**나 **보안상 위험한 데이터**까지 저장될 수 있음. 스토리지 용량(보통 5MB) 제한 문제도 존재.

**해법**: Persister 설정 시 **blacklist** 또는 **whitelist** 필터를 적용하여 필요한 데이터만 영속화.

| 구분 | 대상 | 사유 |
|------|------|------|
| **Whitelist 권장** | 차량 목록(vehicles), 정산 내역(settlements) | 읽기 전용, 오프라인 조회 가치 |
| **Blacklist 권장** | 유저 개인정보, 입찰 금액(auction) | 실시간성·보안 우선 |

---

## §9 Action Plan v1.3 (최종 로드맵)

### 완료 사항 (재평가 기준 2026-02-13)

다음 안정화·품질 항목은 **완료** (§11.5 검증). Action Plan P0–P4 진행 전 기반 확보됨.

- getVehicleStatistics 방어, logEvent 추상화, mutation onError 공통화  
- API 훅 import 일관성(@/shared/api/client), ErrorBoundary 개선, ImageWithFallback 적용

### 진행 전 처리 (Pre-requisites) — P0 시작 전 필수

| # | 항목 | 내용 | 완료 |
|---|------|------|------|
| **1** | ownerId/dealerId | AuthContext 확장 또는 API 전환 시점에 dealerId(JWT/uid) 공급 방식 결정 | ✅ |
| **2** | MockLogisticsItem | `state` → API_ERD_Mapping `status`(scheduled, dispatched, in_transit, completed)로 통일 | ✅ |
| **3** | logisticsSchema canceled | canceled enum 추가 여부 도메인 결정 및 반영 (CarivDealer_API_ERD_Mapping §물류 참조) | ✅ |
| **4** | MOCK_VEHICLE_LIST vs MOCK_VEHICLES_ALL | vehicleId 연동 ID 체계 정리 (MOCK_VEHICLES_ALL 기준, mockLists 통합 시) | ✅ |

※ ERD 기준: CarivDealer_API_ERD_Mapping.md. P3 Infinite Queries는 제외.

### 남은 과업 (P0–P4)

| 순위 | 과업명 | 핵심 내용 | 비고 |
|------|--------|-----------|------|
| **P0** | Missing Domains | Settlement, Logistics useQuery 전환 | ✅ 완료 |
| **P1** | Auction Polling | refetchInterval 추가로 실시간성 확보 | ✅ 완료 |
| **P2** | Key Factory & Zod | 중앙 관리 + 런타임 스키마 검증 | ✅ 완료 |
| **P3** | Infinite Queries | 대규모 리스트용 무한 스크롤 최적화 | Scalability (제외) |
| **P4** | Selective Persist | 필요한 캐시만 골라서 스토리지 저장 | ✅ 완료 |

---

## §10 현시점과의 갭 요약

| 구분 | 현시점 | 목표 | 우선순위 |
|------|--------|------|----------|
| **Query 적용 범위** | vehicles, inspections, auction mutations | 정산·탁송·판매·제안 포함 | **P0** |
| **Mutation invalidation** | 일부만 | 전 mutation → 관련 query invalidation | P0 |
| **경매 실시간성** | 5분 캐시 | `refetchInterval: 5000` | **P1** |
| **Optimistic Update** | 없음 | 제안 수락/거절, 입찰 | P1 |
| **Key Factory & Zod** | 리터럴 + apiClient 응답 미검증 | 중앙 관리 + 런타임 검증 | **P2** |
| **Infinite Queries** | 단순 useQuery | useInfiniteQuery로 전환 | **P3** |
| **Selective Persist** | 없음 | whitelist/blacklist 영속화 | **P4** |
| **Auth 확장** | boolean | User 객체 또는 useUser | P4 |

---

## §11 코드베이스 정합성 검토

### 11.1 현행 상태와 문서 정합성

| 구분 | 문서(정책) | 실제 코드 | 정합성 |
|------|------------|-----------|--------|
| **Zod 스키마** | queryFn 내 parse 권장 | vehicleSchema, inspectionSchema 등 이미 entities에 존재. useVehicles, useVehicle, useInspections, useVehicleRegister에서 parse 사용 | ✅ 일부 적용 |
| **데이터 소스** | Firestore + apiClient | useVehicles/useInspections는 Firestore 직접, useVehicleRegister는 Firestore addDoc. apiClient는 별도(mockFallback) | ✅ 문서와 일치 |
| **Query Key** | 리터럴 하드코딩 | `['vehicles', ...]`, `['inspections', ...]` 등 직접 사용 | ✅ 문서와 일치 (갭 존재) |
| **Settlement/Logistics** | useQuery 미적용 | SettlementListPage, LogisticsSchedulePage는 useState + useEffect | ✅ 문서와 일치 |

### 11.2 적용 시 우선 고려사항

| 항목 | 내용 |
|------|------|
| **Zod 스키마 재사용** | entities에 이미 `vehicleSchema`, `inspectionSchema`, `settlementSchema`, `logisticsSchema` 등 존재. P2에서 apiClient 응답 검증 시 이 스키마 활용 권장. |
| **Firestore vs API** | useVehicles/useInspections는 Firestore 직접. apiClient는 Firebase Functions. API 응답 시 Zod parse가 필수. |
| **settlementSchema** | `entities/settlement/model/schema.ts`에 정의됨. ERD_Mapping §정산 status enum(pending, completed, paid)과 일치. |
| **logisticsSchema** | `entities/logistics/model/schema.ts`에 정의됨. ERD_Mapping §물류 status enum(scheduled, dispatched, in_transit, completed, canceled)과 일치. |
| **apiEndpoints 갭** | SETTLEMENT.NOTIFY만 존재. LOGISTICS는 schedule/dispatch/handover만. GET 목록·상세·sales/history는 API 확장 또는 Mock 전제. |

### 11.3 문서 간 정합성

| 문서 | STATE_MANAGEMENT_POLICY와의 일치 |
|------|--------------------------------|
| **CarivDealer_VID** | Protocol 4 (Server State→React Query) 반영. Stale-while-revalidate. |
| **CarivDealer_api_v1** | §4 라우트↔API 매핑. /logistics, /settlements, /sales/history 확장 제안 참조. |
| **CarivDealer_API_ERD_Mapping** | 정산·탁송·경매·오퍼 엔드포인트 제안, status enum, 계산값(displayStatus, primaryCta) 반영. |

### 11.4 평가 요약

| 구분 | 평가 |
|------|------|
| **FSD·entities 일관성** | 도메인별 schema가 entities에 이미 있어 P2 Zod 통합이 수월함. |
| **Action Plan 실행 가능성** | P0부터 순차 진행 시 P2(Key Factory·Zod)는 기존 schema 재사용으로 리스크 낮음. |
| **선택적 Persist** | TanStack Query Persist의 `serialize`/`deserialize` 또는 `queryKey` 필터로 whitelist/blacklist 구현 가능. |
| **API·ERD 확장** | P0 useSettlements/useLogistics는 Mock 또는 apiClient 확장 시 ERD_Mapping·api_v1 §4 명세 준수 권장. |

---

## §11.5 완료 플랜 검증 (2026-02-13)

**검증 방법**: grep, read_file로 코드베이스 직접 확인.  
**검증 시점**: 2026-02-13.  

### P0–P4 진행 완료 (2026-02-13)

| # | 항목 | 내용 | 산출물 |
|---|------|------|--------|
| **P0** | Missing Domains | useSettlements, useSettlement, useLogisticsSchedule, useLogisticsHistory, useSalesHistory | features/settlement, logistics, sale |
| **P1** | Auction Polling | useAuction(vehicleId, { enabled }) + refetchInterval: 5000, staleTime: 0 | features/auction/model/useAuction.ts, AuctionDetailPage |
| **P2** | Key Factory & Zod | queryKeys.ts, mock schema parse | shared/api/queryKeys.ts, settlementApi, logistics, sale hooks |
| **P4** | Selective Persist | whitelist(vehicles, settlements), blacklist(auction, user 등) | shared/api/queryPersister.ts, QueryProvider |

### 기존 검증 항목

| # | 항목 | 완료 내용 | 검증 결과 |
|---|------|-----------|-----------|
| **1** | getVehicleStatistics 방어 | `Promise.resolve({})` 적용 | ✅ `vehicleApi.ts` L31 `return Promise.resolve({});` |
| **2.1** | logEvent 추상화 | `logEvent.ts` 생성, 전량 `logEventWithHypothesis`로 교체 | ✅ `shared/lib/logEvent.ts` 존재. 18개 파일에서 `logEventWithHypothesis` import |
| **2.2** | mutation onError 공통화 | 4개 훅 모두 `handleError` 사용 | ✅ useBid, useBuyNow, useInspectionRequest, useVehicleRegister — `onError: (err) => showToast(handleError(err), 'error')` |
| **2.3** | API 훅 import 일관성 | features 전부 `@/shared/api/client` | ✅ useBid, useBuyNow, useInspectionRequest, ocrApi — `apiClient` from `@/shared/api/client`. useVehicleRegister는 Firestore 직접 호출 (API 미사용) |
| **2.4** | ErrorBoundary 개선 | `analyzeError` 기반 타입별 메시지 | ✅ `ErrorBoundary.tsx` L47–56: NETWORK_ERROR, TIMEOUT_ERROR, AUTH_ERROR별 사용자 친화 메시지 |
| **3.1** | ImageWithFallback | VehicleCard, VehicleListCard 적용 | ✅ `VehicleCard.tsx`, `VehicleListCard.tsx`에서 `ImageWithFallback` import 및 사용 |

**결과**: 6개 항목 전부 코드베이스와 일치. 완료 확정.

---

## §12 참조

- [CarivDealer_IA.md](CarivDealer_IA.md) — 라우트·메뉴·IA
- [CarivDealer_UserFlow.md](CarivDealer_UserFlow.md) — 사용자 플로우·예외
- [CarivDealer_API_ERD_Mapping.md](CarivDealer_API_ERD_Mapping.md) — API↔ERD 매핑·엔드포인트 제안·status enum
- [CarivDealer_api_v1.md](CarivDealer_api_v1.md) — API 명세 v1·라우트↔API 매핑
- [CarivDealer_VID.md](CarivDealer_VID.md) — VID Protocol·routeManager·Phase 로드맵
- [TanStack Query v5 Docs](https://tanstack.com/query/latest/docs/framework/react/overview)
- [Optimistic Updates](https://tanstack.com/query/latest/docs/framework/react/guides/optimistic-updates)
- [Invalidations from Mutations](https://tanstack.com/query/v4/docs/framework/react/guides/invalidations-from-mutations)
- [Persist Query Client](https://tanstack.com/query/latest/docs/framework/react/guides/persist-query-client)
- [Query Keys](https://tanstack.com/query/latest/docs/framework/react/guides/query-keys)
- [Infinite Queries](https://tanstack.com/query/latest/docs/framework/react/guides/infinite-queries)
- [Zod](https://zod.dev/) — 런타임 스키마 검증
