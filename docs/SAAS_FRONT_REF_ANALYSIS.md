# _saas-front-ref 프론트엔드 코드베이스 분석·평가 보고서

**분석 대상**: `_saas-front-ref` (saas-front)  
**분석 시점**: 2025-02-12  
**검증 방법**: 파일 시스템 직접 확인, grep, 실제 코드 리뷰

---

## 1. 실행 요약

| 항목 | 평가 | 비고 |
|------|------|------|
| 코드베이스 규칙 | 중 | 명시적 규칙 문서 부재, ESLint만 존재 |
| 코드 사용 패턴 | 중 | Service/Context 기반 패턴 일관되나 예외 존재 |
| 스타일 | 상 | Tailwind, Pretendard 통일 |
| 에러 처리 | 중~하 | AppError 체계 있으나 UI 활용 미흡 |
| 주석 | 중 | JSDoc·블록 주석 혼재, 오타·디버깅 주석 존재 |
| 상태 관리 | 중 | Context + useState, 전역 관리 단순 |

---

## 2. 코드베이스 규칙

### 2.1 현황

- **규칙 문서**: 프로젝트 루트에 `CONVENTIONS.md`, `RULE.md`, `CONTRIBUTING.md` 등 **없음**
- **린터**: `eslint.config.js` 존재 (flat config)
- **포맷터**: Prettier 설정 파일 **미확인**
- **타입**: TypeScript 사용 (`tsconfig.json`)

### 2.2 디렉터리 구조

```
src/
├── component/     # 컴포넌트 (단수형)
├── context/       # React Context
├── lib/           # API 클라이언트, 에러, auth 유틸
├── pages/         # 페이지 컴포넌트
└── services/      # API 서비스 레이어
```

- **FSD 미적용**: entities, features, widgets 등 계층 없음
- **레이아웃**: `component/layout/` 내 Layout, TableLayout, GNB 등

### 2.3 평가

- 규칙 문서가 없어 신규 인력 온보딩·일관성 유지에 불리
- ESLint로 기본 검증만 수행
- 디렉터리 명명 불일치: `component` vs `components` (일반 관례)

---

## 3. 코드 사용 패턴

### 3.1 API 호출 패턴

- **클라이언트**: axios 인스턴스 (`lib/api/client.ts`)
- **인터셉터**: 요청 시 `Authorization` 헤더, 응답 시 에러 → `mapToAppError`
- **서비스**: `services/*.service.ts` 함수별 래핑

```ts
// 패턴 예시 (vehicle.service.ts)
export async function getVehicleList(): Promise<Vehicle[]> {
  const { data } = await apiClient.get<ApiResponse<Vehicle[]>>("/vehicle/list");
  return data.data;
}
```

### 3.2 컴포넌트 패턴

- **페이지**: `function PageName()` + `useState`, `useEffect`
- **레이아웃**: `Layout` + `TableLayout` 래핑
- **입력**: `TextInput`, `Select` 등 공통 컴포넌트

### 3.3 문제점

- **오타**: `VehicleUpoload` (올바르게는 VehicleUpload), `setloginId`
- **미구현 API**: `dereg.service.ts`, `certificate.service.ts`에 `throw new Error("Not implemented")` 다수
- **MOCK + throw 혼재**: 일부 함수는 MOCK 반환, 일부는 throw

---

## 4. 스타일

### 4.1 CSS/Tailwind

- **Tailwind CSS** 사용
- **커스텀 컬러**: `tailwind.config.js`에 Neutral, Brand, Blue, Red, Green
- **폰트**: Pretendard (`index.css` CDN)
- **인라인**: `className`으로 Tailwind 유틸리티 사용

### 4.2 평가

- 스타일 체계는 일관적
- 디자인 토큰(컬러, 간격) 정의 있음

---

## 5. 에러 처리

### 5.1 인프라

- **AppError**: `AUTH`, `FORBIDDEN`, `VALIDATION`, `SERVER`, `NETWORK`, `UNKNOWN`
- **mapToAppError**: HTTP 상태 → AppError 매핑
- **API 인터셉터**: 에러 시 `mapToAppError` 호출 후 throw

### 5.2 페이지/컴포넌트 사용

- **패턴**: `try/catch` + `console.error` + `alert(error.message)`
- **AppError 타입 활용**: **없음** — `error instanceof Error`만 사용
- **AppError.type 기반 분기**: 없음 (인증/권한/네트워크 별 처리 없음)

### 5.3 평가

- 에러 **인프라**는 잘 갖춰져 있으나, UI에서 **공통 처리**로 수렴
- `AppError.type`별로 다른 UX(예: 로그인 리다이렉트, 권한 안내) 적용 안 됨

---

## 6. 주석 처리

### 6.1 패턴

| 패턴 | 예시 | 사용처 |
|------|------|--------|
| 섹션 블록 | `// ============ 제목 ============` | 서비스 파일 |
| JSDoc | `@param`, `@returns` | dereg.service.ts |
| Figma 참조 | `// Figma: 546-15901` | DocumentUploadModal |
| 인라인 | `// res는 UploadVehicleDocumentResponse 타입` | VehicleUpoload |

### 6.2 문제점

- **디버깅 주석**: `//console.log` (Login.tsx) 잔존
- **오타**: `VehicleUpoload` 등 파일명·변수명
- **일관성**: JSDoc은 일부 서비스에만 적용

---

## 7. 상태 관리

### 7.1 전역

- **NotificationContext**: `useState` + `createContext`
- **역할**: 토스트/알림 표시
- **인증 상태**: `token.ts` (localStorage) + API 헤더

### 7.2 로컬

- `useState`, `useEffect` 중심
- React Query, Zustand, Redux **미사용**

### 7.3 평가

- 단순 앱 규모에 적합
- 복잡도 증가 시 캐싱·서버 상태 관리 도입 검토 필요

---

## 8. carivdealer(dealer-front) 대비 비교

| 항목 | _saas-front-ref | carivdealer |
|------|-----------------|-------------|
| 아키텍처 | 단순 구조 | FSD(entities/features/widgets) |
| 규칙 문서 | 없음 | CLAUDE.md, 규칙 다수 |
| 에러 처리 | AppError + alert | analyzeError + apiClient 내장 폴백 |
| 상태 관리 | Context + useState | Context + React Query + useState |
| API 폴백 | MOCK + throw | Mock + _isMockData 플래그 |
| 주석 | 혼재 | 프로젝트 규칙 있음 |

---

## 11. 코드스타일 공통점·차이점 (saas-front-ref vs carivdealer)

### 11.1 공통점

| 항목 | 내용 |
|------|------|
| **프레임워크** | React 18 + TypeScript + Vite |
| **스타일** | Tailwind CSS |
| **폰트** | Pretendard |
| **라우팅** | React Router (BrowserRouter, Routes, Route) |
| **인증** | 토큰 기반 (localStorage) |
| **Context** | 전역 상태용 Context + Provider |
| **에러 분류** | 타입별 분류 (AUTH, NETWORK, SERVER 등) |
| **서비스 레이어** | API 호출을 서비스/API 레이어로 분리 |

### 11.2 차이점

| 항목 | _saas-front-ref | carivdealer |
|------|-----------------|-------------|
| **디렉터리** | `component`, `pages`, `services`, `lib`, `context` | `app`, `entities`, `features`, `pages`, `shared`, `widgets` (FSD) |
| **HTTP 클라이언트** | axios | fetch (apiClient 직접 구현) |
| **에러 처리** | `AppError` 클래스 + `mapToAppError` | `ApiError` 인터페이스 + `analyzeError` |
| **에러 표시** | `try/catch` + `alert(message)` | apiClient 내부 처리 + Toast/페이지별 처리 |
| **Mock 폴백** | MOCK 반환 or `throw new Error("Not implemented")` | 타임아웃/네트워크 에러 시 Mock 반환 + `_isMockData` 플래그 |
| **서버 상태** | useState + useEffect | React Query (useQuery, useMutation) |
| **앱 초기화** | `main.tsx` → BrowserRouter → App | `main.tsx` → ErrorBoundary → QueryProvider → ToastProvider → AuthProvider → Router |
| **라우팅** | App.tsx 내 Routes 직접 선언 | `router.tsx` 분리, ProtectedRoute |
| **스타일 토큰** | tailwind.config.js colors (Neutral, Brand, Blue…) | `design-tokens.css` (CSS 변수) + tailwind |
| **폰트 로드** | CDN `@import` (Pretendard) | `@font-face` (Pretendard + SUITE Variable) |
| **주석 스타일** | `// ============ 제목 ============`, JSDoc 일부 | `/** ... */` 블록, JSDoc, `@see` 문서 참조 |
| **레이아웃** | Layout, TableLayout | GnbListLayout, PageLayout, LAYOUT_CLASSES |
| **공통 UI** | TextInput, Select 등 | Button, Input, Modal, Toast, Badge 등 (shared/ui) |

### 11.3 패턴 요약

- **saas-front-ref**: 페이지 중심, axios + 서비스 함수, 즉시 API 호출 후 로컬 상태에 반영.
- **carivdealer**: FSD + React Query, features/entities 분리, apiClient 내장 Mock 폴백·에러 분류, Figma/문서 SSOT 연동.

---

## 9. 권장 사항 (saas-front-ref 개선용)

### 9.1 즉시 적용 가능

1. **규칙 문서 작성**: `CONVENTIONS.md` 또는 `docs/` 내 코딩 규칙 정리
2. **오타 수정**: `VehicleUpoload` → `VehicleUpload`, `setloginId` → `setLoginId`
3. **디버깅 주석 제거**: `//console.log` 삭제
4. **에러 처리 통일**: `AppError` 체크 후 `error.type`별 분기 또는 공통 핸들러 도입

### 9.2 중기 개선

1. **API 미구현 정리**: MOCK 반환 vs throw 정책 수립 후 일관 적용
2. **JSDoc 확대**: 공개 API·서비스 함수에 JSDoc 적용
3. **Prettier 도입**: 포맷팅 자동화

### 9.3 장기 검토

1. **FSD 도입**: 트래픽·복잡도 증가 시 entities/features/widgets 구조 검토
2. **React Query**: 서버 상태 캐싱·재시도·폴링 필요 시 검토
3. **공통 에러 경계**: `ErrorBoundary` + fallback UI

---

## 10. 검증 완료 기준

| 항목 | 기준 | 상태 |
|------|------|------|
| 파일 존재 | glob, list_dir로 확인 | 완료 |
| import 경로 | 실제 파일 참조 확인 | 완료 |
| 패턴 일치 | grep, 코드 리뷰로 확인 | 완료 |
| 문서-코드 일치 | 분석 대상이 코드베이스 | 해당 없음 |

---

*문서 버전: 1.0 | 최종 업데이트: 2025-02-12*
