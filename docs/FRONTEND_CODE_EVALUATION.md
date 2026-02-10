# 프론트엔드 코드 수준 평가 보고서

**검증 일시**: 2025-02-10 (현시점 재검증 반영)  
**검증 방법**: 실제 코드베이스 직접 확인 (list_dir, read_file, grep, npm run type-check, npm run build)  
**검증 범위**: `src/` 전체 (app, entities, features, pages, shared, widgets)

**재검증 시 조치**: `npm run type-check` 실패 2건 발견 → 수정 완료  
- `GeneralSaleAnalyzingPage.tsx`: 미사용 import `Card` 제거  
- `VehicleRegisterStep1Page.tsx`: 미사용 import `LAYOUT_CLASSES` 제거  
→ 수정 후 `type-check` 통과, `build` 유지

**로그 (2025-02-10)**: CTA_3 미흡사항 보완 반영 — GeneralSaleAnalyzingPage(38px 타이틀·카드 shadow), TradeDetailPage(검차 상세 버튼 스타일·검차 모달 사진/영상 항목·펼침 뷰 보강), Modal(titleClassName 추가). 상세: `docs/figmaMCP/figMCP.MD` 로그 항목 참고.

**현시점 코드베이스 스냅샷**  
- **페이지**: admin 30+ (대시·차량·검차·경매·판매·탁송·정산·거래·마이페이지 등), auth 9, landing 1  
- **엔티티**: address, auction, cars_of_korea, inspection, listing, logistics, member, order, payment, review, seller_docs, settlement, trade, vehicle (14개)  
- **단위 테스트**: 10개 (schema×3, 훅×2, UI×2, lib×2, 페이지×1)  
- **shared/ui**: 25개 컴포넌트, shared/figma_image 에 Figma 연동 이미지 보관

---

## 1. 실행 요약

| 항목 | 평가 |
|------|------|
| **아키텍처** | FSD(Feature-Sliced Design) 구조 준수, 라우팅·인증·레이아웃 일관됨 |
| **타입/검증** | TypeScript strict 모드, Zod 스키마로 엔티티 런타임 검증 |
| **API/에러** | 중앙 API 클라이언트, 타임아웃·폴백·에러 분류 체계화 |
| **UI/디자인** | 디자인 토큰·Tailwind·공용 컴포넌트 체계적 사용 |
| **테스트** | 단위(스키마·훅·UI·lib) 10개, E2E(Playwright) 구성 |
| **빌드/품질** | `tsc --noEmit` 통과, `vite build` 성공, Lint 에러 없음 |

**종합**: 프로덕션 수준에 근접. 일부 일관성 보완(API import 경로, 테스트 커버리지 확대) 시 유지보수성과 품질이 더 올라감.

---

## 2. 항목별 상세 검증 결과

### 2.1 아키텍처 및 구조

| 검증 항목 | 결과 | 근거 |
|-----------|------|------|
| FSD 레이어 구분 | ✅ | `app/`, `entities/`, `features/`, `pages/`, `shared/`, `widgets/` 명확히 분리 |
| 라우팅 | ✅ | `router.tsx` 단일 진입, 공개/보호/폴백 구분, 문서(FSD_SPEC_BLUEPRINT·IA) 참조 |
| 인증 | ✅ | `AuthContext` + `ProtectedRoute`, 비로그인 시 `/signup?redirect=...` 리다이렉트 |
| 앱 부트스트랩 | ✅ | `main.tsx`: StrictMode → ErrorBoundary → QueryProvider → ToastProvider → DevSkipProvider → AuthProvider → Router |

- **완료 기준**: 레이어별 역할 분리·라우트·인증 플로우가 코드와 문서에 맞게 구현됨.

### 2.2 타입 및 런타임 검증

| 검증 항목 | 결과 | 근거 |
|-----------|------|------|
| TypeScript strict | ✅ | `tsconfig.json`: strict, noUnusedLocals, noUnusedParameters 등 활성화 |
| 엔티티 스키마 | ✅ | `entities/*/model/schema.ts`에 Zod 스키마 (vehicle, auction, inspection, logistics, settlement, trade, member 등) |
| 스키마 테스트 | ✅ | `schema.test.ts` 존재 (vehicle, auction, inspection) |

- **완료 기준**: strict 모드로 타입 일관성 확보, 주요 엔티티는 Zod로 파싱·검증됨.

### 2.3 API 클라이언트 및 에러 처리

| 검증 항목 | 결과 | 근거 |
|-----------|------|------|
| API 중앙화 | ✅ | `apiClient` 단일 객체 (member, vehicle, inspection, auction, trade, logistics, settlement, report, config, post, upload) |
| 타임아웃 | ✅ | `fetchWithTimeout`, API 30초·OCR 90초 |
| Mock 폴백 | ✅ | 타임아웃/네트워크 실패 시 `mockFallback` 호출, 객체 반환 시 `_isMockData` 플래그 부여 |
| 에러 분류 | ✅ | `errorHandler.ts`: ErrorType(NETWORK/TIMEOUT/VALIDATION/AUTH/SERVER/UNKNOWN), `analyzeError`, `handleError`, `retryWithBackoff` |
| 네트워크 에러 패턴 | ✅ | Failed to fetch, NetworkError, ECONNREFUSED, ERR_CONNECTION_REFUSED 등 처리 |

- **보완 필요**: `apiClient` import 경로 불일치  
  - `@/shared/api/client` 사용: useBid, useBuyNow, useInspectionRequest (3곳)  
  - `@/shared/api/apiClient` 사용: vehicleApi, LogisticsSchedulePage, LogisticsHistoryPage, GeneralSaleOffersPage (4곳)  
  - **권장**: FSD/alias 목적이면 `@/shared/api/client`로 통일.

### 2.4 상태 관리 및 데이터 페칭

| 검증 항목 | 결과 | 근거 |
|-----------|------|------|
| React Query | ✅ | useQuery/useMutation 사용 (useVehicles, useBid, useBuyNow, useInspectionRequest, useInspections, useVehicle, useVehicleRegister) |
| 쿼리 키 | ✅ | 예: `['vehicles', ownerId, status]`, 뮤테이션 성공 시 `invalidateQueries(['auctions'])` |
| Firestore 직접 조회 | ✅ | `useVehicles`에서 Firestore `getDocs` + Zod 파싱, DEV 빈 컬렉션 시 목업 반환 |

- **완료 기준**: 서버/로컬 데이터 접근이 훅 단위로 정리되어 있고, 무효화 전략이 적용됨.

### 2.5 UI 및 스타일

| 검증 항목 | 결과 | 근거 |
|-----------|------|------|
| 디자인 토큰 | ✅ | `design-tokens.css`: 타이포(1440px 기준), 색상(primary/accent/neutral/semantic/status), 간격, z-index, 컴포넌트 변수 |
| 공용 컴포넌트 | ✅ | Button, Card, Input, Select, Modal, Pagination, Table, Badge, StepProgress, ErrorBoundary 등 `shared/ui` |
| Tailwind | ✅ | `tailwind.config.js`에서 design token 참조 (예: primary, radius-md), 일관된 유틸 클래스 사용 |

- **완료 기준**: 토큰 기반 디자인 시스템과 공용 UI가 정의되어 페이지/위젯에서 재사용됨.

### 2.6 테스트

| 검증 항목 | 결과 | 근거 |
|-----------|------|------|
| 단위 테스트 파일 수 | 10개 | errorHandler.test, responsive.test, Button.test, VehicleCard.test, VehicleDetailPage.test, schema.test×3, useBid.test, useBuyNow.test |
| E2E | ✅ | `tests/e2e/` (Playwright), 스크린샷 등 스펙 존재 |
| 검증 도구 | Vitest, Testing Library, Playwright | package.json 스크립트: test, test:ui, test:coverage, test:e2e |

- **완료 기준**: 스키마·에러 처리·반응형·버튼·카드·훅·페이지·E2E가 테스트 스위트에 포함됨.

### 2.7 빌드 및 정적 검사

| 검증 항목 | 결과 | 근거 |
|-----------|------|------|
| TypeScript | ✅ | `npm run type-check` (tsc --noEmit) 성공 |
| 프로덕션 빌드 | ✅ | `npm run build` 성공 (Vite, 청크 분리·gzip 크기 출력) |
| Lint | ✅ | `read_lints` on `src/`: 에러 없음 |

- **완료 기준**: 타입·빌드·린트가 현재 코드베이스에서 통과함.

---

## 3. 위험 요인 우선순위

| 우선순위 | 항목 | 설명 |
|----------|------|------|
| **Low** | API import 경로 불일치 | `apiClient` vs `client` 혼용. 유지보수 시 혼란 가능. |
| **Low** | 테스트 커버리지 | 페이지/위젯 대부분 단위 테스트 미작성. 회귀 검증에 한계. |
| **Low** | Auth 실제 연동 | 현재 localStorage 플래그. Firebase Auth 연동 시 AuthContext 확장 필요. |

- Critical/High 수준 이슈는 없음 (빌드·타입·에러 처리·라우팅 정상).

---

## 4. 보완 제안

1. **API import 통일 (권장)**  
   - **수정 위치**: `vehicleApi.ts`, `LogisticsSchedulePage.tsx`, `LogisticsHistoryPage.tsx`, `GeneralSaleOffersPage.tsx`  
   - **내용**: `from '@/shared/api/apiClient'` → `from '@/shared/api/client'`  
   - **이유**: `client.ts`가 FSD alias로 apiClient를 re-export 하므로, 한 경로로 통일 시 의존성 규칙 일관성 확보.

2. **테스트 커버리지 확대 (선택)**  
   - 핵심 플로우(차량 등록, 경매 입찰, 검차 신청) 페이지/위젯에 통합 또는 컴포넌트 테스트 추가.  
   - `npm run test:coverage`로 미커버 구간 확인 후 우선순위 결정.

3. **문서·코드 동기화**  
   - `CLAUDE.md`에 "React 18" 명시되어 있음. `package.json`은 react 19.2.3. 필요 시 문서 버전 수정.

---

## 5. 검증 요약 표

| 카테고리 | 검증 방법 | 완료 기준 | 상태 |
|----------|-----------|-----------|------|
| 디렉터리 구조 | list_dir(src) | FSD 레이어 존재 | ✅ |
| 라우터 | read_file(router.tsx) | 보호/공개/폴백 구분 | ✅ |
| API 클라이언트 | read_file(apiClient.ts) | 타임아웃·폴백·_isMockData | ✅ |
| 에러 처리 | read_file(errorHandler.ts) | 분류·메시지·재시도 | ✅ |
| 엔티티 스키마 | read_file(entities/*/schema) | Zod 스키마 정의 | ✅ |
| 디자인 토큰 | read_file(design-tokens.css) | 토큰 정의 일관성 | ✅ |
| 타입 검사 | npm run type-check | 종료 코드 0 (미사용 import 2건 수정 후) | ✅ |
| 빌드 | npm run build | 종료 코드 0 | ✅ |
| Lint | read_lints(src) | 에러 0건 | ✅ |
| 테스트 파일 | glob **/*.test.* | 10개 확인 | ✅ |
| API import | grep apiClient/client | 불일치 4곳 | ⚠️ 보완 권장 |

---

*이 문서는 실제 코드베이스 검증 결과를 바탕으로 작성되었으며, 추측이 아닌 파일·명령 실행 결과를 근거로 합니다.*
