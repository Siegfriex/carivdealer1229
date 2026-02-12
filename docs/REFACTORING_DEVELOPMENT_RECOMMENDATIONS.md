# 딜러웹(carivdealer) 코드베이스 리팩토링·개발 제언서

**대상**: `src/` (딜러 프론트엔드)  
**작성일**: 2025-02-12  
**검증 방법**: 파일 시스템 직접 확인, grep, 코드 리뷰, functions 연동 검증

---

## 1. 실행 요약

| 위험도 | 항목 수 | 비고 |
|--------|---------|------|
| **Critical** | 4 | 즉시 수정 권장 |
| **High** | 6 | 1~2주 내 해결 권장 |
| **Medium** | 8 | 중기 개선 |
| **Low** | 5 | 장기 검토 |

---

## 2. Critical(즉시 대응) 항목

### 2.1 API 엔드포인트 부재 — getVehicleStatisticsAPI

**현상**
- `apiEndpoints.VEHICLE.GET_STATISTICS` = `'getVehicleStatisticsAPI'`
- Firebase Functions `index.ts`에 **해당 export 없음**
- `getVehicleStatistics`는 functions 내부에서 `ocrRegistration`이만 사용 (차량번호→공공데이터 조회)
- 프론트 `vehicleApi.ts`는 `apiClient.post(GET_STATISTICS, { registYy, registMt, useFuelCode })` 호출

**영향**: `getVehicleStatistics` 호출 시 404 또는 실제로는 존재하지 않는 엔드포인트 호출

**권장**
1. **옵션 A**: `getVehicleStatistics`를 plateNumber 기반 HTTP API로 노출 후, 프론트 `vehicleApi`를 `plateNumber` 파라미터로 수정
2. **옵션 B**: 공공데이터 통계 조회가 OCR 전용이면, `vehicleApi.getVehicleStatistics` 제거 또는 사용처 재검토

**관련 파일**
- `src/features/vehicle/register-form/api/vehicleApi.ts`
- `src/shared/config/apiEndpoints.ts`
- `functions/src/index.ts`, `functions/src/vehicle/getVehicleStatistics.ts`

---

### 2.2 이중 데이터 소스 — Firestore 직접 vs Firebase Functions

**현상**
- **Firestore 직접**: `useVehicles`, `useInspections`, `useVehicle`, `useVehicleRegister` (getDocs, addDoc, getDoc)
- **Firebase Functions**: `apiClient` (회원, 검차 신청, 경매, 거래, 탁송, 정산 등)

**리스크**
- Firestore 규칙과 Functions 서버 로직이 각각 권한·검증을 담당 → 보안 정책 이원화
- 실시간 동기화·트랜잭션 부재 시 데이터 불일치 가능
- 백엔드가 Functions로 마이그레이션될 때 Firestore 직접 접근은 레거시로 남음

**권장**
1. **데이터 출처 정책 수립**: CRUD는 Functions 경유 vs Firestore 직접 선택
2. **단기**: Firestore 직접 접근 도메인 문서화 (vehicles, inspections)
3. **중기**: vehicles/inspections용 Functions API 설계 후 단계적 마이그레이션

---

### 2.3 인증 토큰 미연동 — apiClient

**현상**
- `apiClient`의 `defaultHeaders`에 `Authorization` 없음
- Firebase Auth `auth`는 export되나, API 호출 시 미사용
- `AuthContext`는 `localStorage` 기반 플레이스홀더 (Firebase Auth 미연동)

**영향**: 인증 필요한 API 호출 시 백엔드가 401/403을 반환할 수 있음

**권장**
1. Firebase Auth `onAuthStateChanged` → `idToken` 수집
2. `apiCall`에 `Authorization: Bearer <token>` 헤더 주입
3. 401 응답 시 로그인 페이지로 리다이렉트 또는 토큰 갱신

---

### 2.4 로그인·회원가입 API 미구현

**현상**
- `LoginPage.tsx`, `LoginModal.tsx`, `SignupStep1Page.tsx` 등에 `TODO: 실제 로그인 API 연동`, `TODO: 인증번호 전송 API`
- `SignupCompletePage.tsx`: `TODO: 실제 사용자 정보로 대체`

**영향**: 현재는 `devLogin`, localStorage 기반 우회 인증만 동작

**권장**
1. CarivDealer_api_v1.md 회원가입·로그인 명세와 연동
2. Firebase Auth 또는 백엔드 인증 API 연동 일정 수립

---

## 3. High(조기 해결) 항목

### 3.1 LOG_INGEST_URL 하드코딩·분산

**현상**
- 20개 이상 컴포넌트에서 `fetch(LOG_INGEST_URL, {...})` 직접 호출
- 페이로드 구조가 호출부마다 다름 (location, message, hypothesisId, runId 등)
- 기본 URL: `http://127.0.0.1:7244/ingest/...` (로컬 수집기)

**권장**
1. `logEvent(location, message, data?)` 같은 공통 유틸로 추상화
2. 프로덕션 빌드 시 `LOG_INGEST_URL` 미설정이면 no-op 처리
3. 환경변수 `VITE_LOG_INGEST_URL` 문서화

---

### 3.2 에러 처리 일관성 부족

**현상**
- 일부 페이지: `try/catch` + `showToast` + `console.error`
- 일부: `.catch(() => {})` (로그 이벤트용 fetch)
- `handleError`, `analyzeError`는 apiClient·errorHandler에서 사용하나, 페이지 레벨에서는 혼재

**권장**
1. `useMutation`의 `onError`에서 `handleError` + `showToast` 공통 패턴 적용
2. 페이지별 `catch` 블록에서 `handleError` 사용 권장 규칙 문서화

---

### 3.3 Mock 폴백 비일관성

**현상**
- `apiCall`: mockFallback 있으면 타임아웃/네트워크 에러 시 Mock 반환 + `_isMockData`
- `verifyBusiness`, `vehicle.ocrRegistration` 등: Mock 없이 `throw`
- `useVehicles`: `USE_MOCK_LIST` 시 Firestore 쿼리 생략, 목업 반환

**권장**
1. Mock 정책 문서화: 어떤 API에 Mock 필요한지, `_isMockData` 활용 방식
2. 공통 Mock 레이어 또는 Feature Flag로 제어

---

### 3.4 ERD·Firestore 컬렉션 불일치

**현상** (DATABASE_ERD_SCHEMA.md §6)
- `order`, `payment` 컬렉션 **미구현** (Critical)
- `listing` ↔ `trades` 리네임/매핑 불명확
- `members` vs `user` 명명 불일치

**영향**: 주문·결제 도메인 구현 시 스키마·컬렉션 혼선

**권장**
1. order, payment 컬렉션 설계·생성 우선
2. ERD와 Firestore 매핑 SSOT 문서 정리

---

### 3.5 DevSkip·개발용 코드 프로덕션 노출

**현상**
- `DevSkipProvider`, `DevSkipFloatingButton` — 프로덕션 빌드에 포함
- `devLogin=1` URL로 인증 우회 가능
- `dev:skip` 버튼으로 필수 입력 검증 스킵

**권장**
1. `import.meta.env.PROD` 시 DevSkip 컴포넌트·Context 미마운트
2. `devLogin`은 `VITE_RUN_DEV` 또는 개발 도메인에서만 활성화

---

### 3.6 테스트 커버리지 부족

**현상**
- 테스트 파일 10개 (schema, errorHandler, responsive, Button, VehicleCard, useBid, useBuyNow, VehicleDetailPage)
- 페이지·위젯·features 대부분 테스트 없음

**권장**
1. 핵심 플로우(회원가입, 차량 등록, 검차 신청) E2E 또는 통합 테스트 추가
2. features 훅 단위 테스트 확대

---

## 4. Medium(중기 개선) 항목

### 4.1 apiClient.post 파라미터 불일치

**현상**
- `vehicleApi.getVehicleStatistics(params)` — `{ registYy, registMt, useFuelCode }` 전송
- 백엔드 `getVehicleStatistics` — `plateNumber` 단일 파라미터 (HTTP 노출 안 됨)

**권장**: §2.1 해결 시 함께 수정

---

### 4.2 일부 API Mock 폴백 미적용

**현상**
- `verifyBusiness`, `ocrRegistration`, `trade.changeSaleMethod` 등 mockFallback 없음
- 네트워크/타임아웃 시 바로 throw

**권장**: 프로토타입·데모용 Mock 필요 시 해당 API에 mockFallback 추가

---

### 4.3 로깅·계측 코드 분산

**현상**
- `LOG_INGEST_URL` fetch가 페이지·위젯에 산재
- `#region`/`#endregion`으로 구분되어 있으나 재사용성 낮음

**권장**: §3.1와 연계해 `logEvent` 유틸로 통합

---

### 4.4 Firestore 쿼리 보안 규칙 검증

**현상**
- `vehicles`, `inspections`에 ownerId, evaluatorId 등 필터 적용
- Firestore 규칙에서 해당 필드 기반 접근 제어 여부 미확인

**권장**: firestore.rules와 클라이언트 쿼리 조건 교차 검증

---

### 4.5 React Query와 Firestore 직접 접근 혼재

**현상**
- `useVehicles`, `useInspections`, `useVehicle`, `useVehicleRegister` — Firestore SDK + React Query
- `useBid`, `useBuyNow`, `useInspectionRequest` — apiClient + React Query

**권장**: 데이터 소스별 패턴 문서화, 추후 Functions 마이그레이션 시 React Query 쿼리키·함수만 교체

---

### 4.6 이미지 로드 실패 처리 중복

**현상**
- `VehicleCard`, `VehicleListCard`에 `onError`에서 `display: none` + placeholder 표시 로직 유사

**권장**: `ImageWithFallback` 또는 `ImagePlaceholder` 공통 컴포넌트로 추출

---

### 4.7 design-tokens 미반영 색상

**현상**
- `design-tokens.css` 주석: "1033-4903 검차 신청 Step1 (R001) — design-tokens 미반영 9색"

**권장**: 해당 컴포넌트 색상을 design-tokens로 이전

---

### 4.8 문서 참조 경로 유효성

**현상**
- `@see docs/figmaMCP/impl_plans/...` 등 경로 다수
- `docs/figmaMCP/` 존재 여부·최신성 미검증

**권장**: 문서 경로 목록 추출 후 존재 여부 확인, 404 링크 정리

---

## 5. Low(장기 검토) 항목

### 5.1 FSD 레이어 경계 강화

**현상**
- features가 pages에서 직접 import되는 경우 있음
- entities ↔ features 의존성 방향 검토 필요

**권장**: FSD 규칙 문서화, lint/architect 규칙 도입 검토

---

### 5.2 번들 크기·코드 스플리팅

**현상**
- 라우트 단위 lazy loading 미적용
- 큰 페이지·위젯이 초기 번들에 포함될 가능성

**권장**: `React.lazy` + `Suspense` 적용, 번들 분석

---

### 5.3 접근성(a11y)

**현상**
- 모달, 버튼, 폼 등 aria 속성·키보드 포커스 관리 미확인

**권장**: axe-core 등으로 접근성 점검

---

### 5.4 다국어(i18n)

**현상**
- 한글 하드코딩
- i18n 라이브러리 미사용

**권장**: 다국어 요구 시 react-i18next 등 도입 검토

---

### 5.5 결제·토스페이먼츠 연동

**현상**
- CLAUDE.md: "결제: 토스페이먼츠 연동 예정"
- payment API는 functions에 존재, 프론트 결제 UI·연동 미확인

**권장**: 결제 플로우 명세·연동 일정 수립

---

## 6. 우선순위 매트릭스

| 우선순위 | 항목 | 예상 공수 | 의존성 |
|----------|------|-----------|--------|
| P0 | §2.1 getVehicleStatisticsAPI 정리 | 0.5d | - |
| P0 | §2.3 apiClient 인증 토큰 연동 | 1d | Firebase Auth |
| P0 | §2.4 로그인·회원가입 API 연동 | 2~3d | 백엔드 |
| P1 | §2.2 데이터 소스 정책 수립 | 0.5d | - |
| P1 | §3.1 LOG_INGEST 추상화 | 0.5d | - |
| P1 | §3.5 DevSkip 프로덕션 비노출 | 0.5d | - |
| P2 | §3.2 에러 처리 일관화 | 1d | - |
| P2 | §3.4 order/payment 컬렉션 | 2d | ERD |
| P2 | §3.6 테스트 확대 | 2d+ | - |

---

## 7. 검증 완료 기준

| 항목 | 기준 | 상태 |
|------|------|------|
| API 엔드포인트 존재 | functions/index.ts grep | 완료 |
| Firestore 사용처 | collection/doc grep | 완료 |
| 인증·apiClient | apiClient.ts, AuthContext 검토 | 완료 |
| TODO/FIXME | grep | 완료 |
| 로깅·계측 | LOG_INGEST_URL grep | 완료 |
| ERD 매핑 | DATABASE_ERD_SCHEMA.md §6 참조 | 완료 |

---

*문서 버전: 1.0 | 최종 업데이트: 2025-02-12*
