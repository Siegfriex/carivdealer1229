# 위험 요인 수정 청사진

**작성일**: 2026-01-28  
**기준**: 코드베이스 스캔 결과 Critical/High 위험 요인  
**원칙**: 선제적 수정, 구체적 위치·수정 내용 명시

---

## 1. Critical — 즉시 수정

### 1.1 #1 차량 상세 라우트 없음

| 항목 | 내용 |
|------|------|
| **문제** | `/vehicles/${vehicle.id}`로 이동하지만 라우터에 `/vehicles/:id` 매핑 없음 → 로그인(SCR-0001)으로 폴백 |
| **위치** | `src/app/router.tsx` (pathToScreen, getScreenFromPath, renderScreen) |
| **수정 내용** | ① `Screen` 타입에 `'VEHICLE_DETAIL'` 추가 ② `getScreenFromPath()`에서 `/vehicles/{id}` 패턴 감지 (단, `id` ≠ `new`, 경로가 `/complete`로 끝나지 않음) ③ `renderScreen()`에 `VEHICLE_DETAIL` → `VehicleDetailPage` 매핑 ④ `src/pages/admin/vehicle/VehicleDetailPage.tsx` 신규 생성: pathname에서 id 추출 후 차량 상세 UI (목록 복귀 버튼 포함) |
| **완료 기준** | 차량 목록/대시에서 카드 클릭 시 `/vehicles/{id}` 접근 시 차량 상세 화면 표시, 404/로그인 폴백 없음 |

### 1.2 #2 비밀번호 콘솔 로그

| 항목 | 내용 |
|------|------|
| **문제** | `console.log('Login:', { email, password })` → 프로덕션에서 크레덴셜 노출 위험 |
| **위치** | `src/pages/admin/LoginPage.tsx` 16행, `src/shared/ui/LoginModal.tsx` 31행 |
| **수정 내용** | ① LoginPage: `console.log` 제거. (선택) 개발 시에만 이메일만 로그: `if (import.meta.env.DEV) console.debug('Login attempt:', { email: email ? '***' : '' });` ② LoginModal: 동일하게 제거 또는 debug만 |
| **완료 기준** | 비밀번호가 콘솔/로그에 전혀 출력되지 않음 |

### 1.3 #3 DevSkip UI 프로덕션 노출

| 항목 | 내용 |
|------|------|
| **문제** | `DevSkipFloatingButton`이 `import.meta.env.DEV` 체크 없이 항상 렌더 → 배포 환경에서도 노출 |
| **위치** | `src/app/router.tsx` 217행: `<DevSkipFloatingButton />` |
| **수정 내용** | `{import.meta.env.DEV && <DevSkipFloatingButton />}` 로 조건부 렌더. 프로덕션 빌드에서는 버튼 미노출 |
| **완료 기준** | `npm run build` 후 프로덕션 빌드에서 dev:skip 버튼 미표시 |

### 1.4 #4 /forgot-password 미구현

| 항목 | 내용 |
|------|------|
| **문제** | `<a href="/forgot-password">` 존재하나 해당 경로·화면 없음 → 클릭 시 로그인으로 폴백 |
| **위치** | `src/pages/admin/LoginPage.tsx` 61행, `src/app/router.tsx` (path 없음) |
| **수정 내용** | ① `src/pages/admin/ForgotPasswordPage.tsx` 신규: 제목 "비밀번호 찾기", 안내 문구, "이메일 입력 후 재설정 링크 요청" 플레이스홀더, "로그인으로 돌아가기" 링크 ② router에 `/forgot-password` → ForgotPasswordPage 매핑 (Screen 타입 및 pathToScreen, renderScreen 추가) |
| **완료 기준** | /forgot-password 접근 시 전용 화면 표시, 로그인으로 돌아가기 동작 |

---

## 2. High — 단계별 수정 (청사진만 명시)

### 2.1 #5 인증 상태 미연동

- **목표**: AuthProvider/useAuth 도입, `userName` 하드코딩 제거, 실제 로그인 사용자와 UI 일치.
- **위치**: 전역 레이아웃, LandingPage, Dashboard 등.
- **수정**: (1) `src/shared/context/AuthContext.tsx` 생성 — Firebase Auth onAuthStateChanged, user 상태 (2) main.tsx에 AuthProvider 래핑 (3) 각 페이지에서 useAuth()로 user 사용, 미로그인 시 로그인 유도.

### 2.2 #6 라우팅·네비게이션 혼용

- **목표**: 한 방식으로 통일 (예: history.pushState + setPathname만 사용, 또는 React Router 도입).
- **위치**: `window.location.href` 사용처 전부 (VehicleListPage, DashboardPage, VehicleRegisterStep1 등).
- **수정**: 내비게이션을 `history.pushState` + `window.dispatchEvent(new PopStateEvent('popstate'))` 또는 router의 `handleNavigate(screen)` 호출로 통일; 링크는 `<a href={path}>` + click에서 preventDefault 후 위 방식 호출.

### 2.3 #7 미연동 API·TODO

- **목표**: 회원가입 중복확인/인증번호, 로그인 API, 차량 등록 제출 등 실제 백엔드 연동.
- **수정**: API 명세 및 apiEndpoints 기준으로 서비스 레이어 구현 후 각 페이지에서 호출, TODO 제거.

### 2.4 #8 에러 무시 패턴

- **위치**: GeneralSaleOffersPage, SettlementListPage, SalesHistoryPage 등 `catch { }` 또는 "Error handled silently".
- **수정**: catch 블록에서 최소한 console.error 또는 토스트/알림으로 사용자 피드백, 필요 시 에러 바운더리 연동.

### 2.5 #9 Firebase env 폴백

- **위치**: `shared/config/firebase.ts` — `VITE_FIREBASE_* || 'demo-api-key'` 등.
- **수정**: 프로덕션에서는 폴백 제거 또는 빌드 시 필수 env 검사 후 누락 시 경고/에러 throw.

---

## 3. Medium / Low

- **#10 PRD·SCR 매핑**: router 주석 및 TASK_PLAN 문서와 실제 화면 역할 정리.
- **#11 레이아웃·그리드**: 페이지별 max-width·grid 클래스 통일 (공통 레이아웃 컴포넌트 권장).
- **#12 any 타입**: apiClient, errorHandler 등에 구체 타입 도입.
- **#13 console 잔존**: 디버그용 console 제거 또는 DEV 조건/logger 유틸로 대체.
- **#14 동적 경로 파라미터**: 라우터에서 :id 추출 후 props/context로 전달, 페이지는 id만 수신.

---

## 4. 적용 순서 (이번 실행)

1. **Critical #1** — 라우트 + VehicleDetailPage  
2. **Critical #2** — 비밀번호 로그 제거  
3. **Critical #3** — DevSkip 조건부 렌더  
4. **Critical #4** — ForgotPasswordPage + 라우트  

이후 빌드·Lint 검증 및 필요 시 High 항목 순차 진행.

---

## 5. 적용 완료 (2026-01-28)

| # | 항목 | 적용 내용 |
|---|------|-----------|
| #1 | 차량 상세 라우트 | React Router에 `<Route path="/vehicles/:vehicleId" element={<VehicleDetailPage />} />` 추가. `VehicleDetailPage` 신규 생성(useParams, useVehicle, 목록 복귀 버튼). |
| #2 | 비밀번호 로그 | `LoginPage.tsx`, `LoginModal.tsx`에서 `console.log('Login:', { email, password })` 제거. |
| #3 | DevSkip 프로덕션 | `router.tsx`에서 `{import.meta.env.DEV && <DevSkipFloatingButton />}` 조건부 렌더. |
| #4 | /forgot-password | `ForgotPasswordPage.tsx` 신규 생성(준비 중 안내 + 로그인으로 돌아가기). `<Route path="/forgot-password" element={<ForgotPasswordPage />} />` 추가. 로그인 페이지 링크는 `<a href="/forgot-password">` 유지. |

**검증**: `npm run build` 성공. 프로덕션 빌드에서 DevSkip 버튼 미포함.
