# 구체 실행 청사진 (Blueprint)

**문서 버전**: 1.0  
**최종 업데이트**: 2026-01-28  
**목적**: "구체적으로 어떻게 할지"를 단계·파일·검증 기준으로 명시한 실행 청사진.

---

## Phase 0: 전제 (이미 반영된 것)

- [x] `globals.css`: `.container` 주석 보강 (페이지 최외곽용, 내부는 max-w-*)
- [x] 회원가입 8개 페이지: `container` 바깥 / `max-w-3xl` 안쪽 이단 구조
- [x] admin/inspection/vehicle: `container mx-auto px-6` → `container py-8` 등으로 정리
- [x] `shared/ui/PageLayout.tsx` 생성 (maxContentWidth: 2xl|3xl|4xl|full)

---

## Phase 1: 레이아웃 통일 (PageLayout 적용)

**목표**: 회원가입 페이지가 PageLayout 한 컴포넌트로 container/최대폭을 사용하도록 통일.

| 순서 | 작업 | 파일 | 구체 변경 |
|------|------|------|-----------|
| 1.1 | PageLayout 적용 | `SignupEntryPage.tsx` | 최외곽 `min-h-screen` 유지. 그 안 `container py-10` + `max-w-3xl` 래퍼를 `<PageLayout maxContentWidth="3xl">` 한 개로 교체. 진입 페이지는 `text-center` 유지 위해 children 래퍼에 `className="text-center"` 또는 PageLayout에 `contentClassName` 추가 가능. |
| 1.2 | PageLayout 적용 | `SignupStep1Page.tsx` ~ `SignupStep5Page.tsx` | `<div className="container py-10"><div className="max-w-3xl mx-auto">` → `<PageLayout maxContentWidth="3xl">`. 내부는 기존 제목·StepProgress·space-y-10·버튼만 유지. |
| 1.3 | PageLayout 적용 | `SignupPendingPage.tsx`, `SignupCompletePage.tsx` | 동일. `container py-10` + `max-w-3xl mx-auto` 제거 후 `<PageLayout maxContentWidth="3xl">`로 감싸기. |
| 1.4 | 검증 | - | `npm run build`, `read_lints` (auth). 회원가입 진입·step1·완료 페이지 1440px 뷰포트에서 스크린 확인. |

**완료 기준**: 회원가입 관련 8개 페이지가 모두 PageLayout 사용, 빌드·린트 통과.

---

## Phase 2: Critical 위험 요인 조치

**목표**: 즉시 영향 4건 해소.

| ID | 위험 | 조치 | 파일·위치 | 구체 변경 |
|----|------|------|-----------|-----------|
| C1 | 차량 상세 라우트 없음 | 라우트 추가 또는 이동 경로 변경 | `router.tsx`, (선택) `pages/admin/vehicle/VehicleDetailPage.tsx` | **옵션 A**: `router.tsx`에 path `/vehicles/:id` 추가, Screen 타입·매칭·렌더 분기 추가. **옵션 B**: DashboardPage/VehicleListPage에서 `onClick` 시 `/vehicles/:id` 대신 현재 존재하는 URL(예: `/vehicles/new/step1` 또는 목록 쿼리)로 이동하도록 변경. |
| C2 | 비밀번호 콘솔 로그 | 프로덕션 크레덴셜 노출 제거 | `LoginPage.tsx` (약 16행), `LoginModal.tsx` (약 31행) | `console.log('Login:', { email, password })` 제거. (필요 시 `console.log('Login attempt')` 정도만 남기거나 완전 제거.) |
| C3 | DevSkip 프로덕션 노출 | 개발 환경에서만 렌더 | `router.tsx` (DevSkipFloatingButton 렌더하는 부분) | `import.meta.env.DEV`일 때만 `<DevSkipFloatingButton />` 렌더. 예: `{import.meta.env.DEV && <DevSkipFloatingButton />}` |
| C4 | /forgot-password 미구현 | 경로 구현 또는 링크 비활성화 | `LoginPage.tsx` (forgot-password 링크), (선택) `router.tsx` + ForgotPasswordPage | **옵션 A**: `/forgot-password` 라우트 추가, 단순 "이메일 입력 후 안내" 페이지 구현. **옵션 B**: `<a href="/forgot-password">` 제거 또는 `href="#"` + `onClick`에서 "준비 중" 토스트/알림. |

**완료 기준**: C2·C3 반드시 적용. C1·C4는 옵션 선택 후 한 가지 방식으로 적용.

---

## Phase 3: High 위험 요인 조치 (우선 2건)

**목표**: 인증·라우팅 혼용 완화.

| ID | 위험 | 조치 | 구체 변경 |
|----|------|------|-----------|
| H1 | 인증 상태 미연동 | AuthContext/useAuth 도입 또는 문서화 | **최소**: `userName = '홍길동'` 사용처에 주석으로 "TODO: useAuth() 연동" 명시. **권장**: `shared/context/AuthContext.tsx` 생성, `main.tsx`에 Provider 래핑, 로그인 성공 시 setUser, 페이지에서 useAuth()로 표시. |
| H2 | 라우팅·네비게이션 혼용 | 정책 정리 + 일부 통일 | **문서화**: "앱 내 SPA 이동은 history.pushState, 외부/전체 리로드 필요 시 window.location.href" 등 ReNew 또는 docs에 명시. **코드**: 회원가입 플로우 내부는 이미 pushState; 다른 페이지에서 `window.location.href = '/...'` 사용처를 pushState + pathname 갱신으로 바꿀지 여부를 청사진에 명시. |

**완료 기준**: H1 최소(주석) 또는 권장(AuthContext) 적용. H2 문서화 완료.

---

## Phase 4: Medium 위험 요인 (레이아웃·품질)

**목표**: #11 레이아웃·그리드 정합성 확정, console 정리.

| ID | 위험 | 조치 | 구체 변경 |
|----|------|------|-----------|
| M1 | 레이아웃·그리드 불일치 (#11) | 1440px 기준 페이지별 점검 | LandingPage, DashboardPage, VehicleListPage에서 container/PageLayout 사용 여부와 그리드 열 수(gap-6, grid-cols-*) 확인. 필요 시 해당 페이지에도 container 바깥 / 콘텐츠 안쪽 구조 또는 PageLayout 적용. |
| M2 | console.log/warn/error 잔존 | auth·login·vehicle 등에서 제거 | SignupStep1, VehicleRegisterStep1, LoginModal, LoginPage 등 grep으로 `console.` 검색 후, 디버그용 로그 제거(또는 `if (import.meta.env.DEV)` 조건부). |

**완료 기준**: 1440px에서 회원가입·랜딩·대시보드 시각 확인 완료, console 제거 또는 DEV 한정.

---

## Phase 5: 검증·산출물

| 항목 | 방법 | 완료 기준 |
|------|------|-----------|
| 빌드 | `npm run build` | 성공 |
| 린트 | `npm run lint` 또는 read_lints (수정한 디렉터리) | 에러 0 |
| 회원가입 플로우 | 브라우저 1440×900, /signup → step1~5 → pending → complete | 각 단계에서 container 중앙, max-w 영역·그리드 깨짐 없음 |
| E2E | `npx playwright test tests/e2e/02-signup-flow.spec.ts` | 필수 필드·이전 버튼 통과; 전체 플로우는 dev:skip ON 시 통과 목표 |
| Critical | C2·C3 반영 후 프로덕션 빌드에서 DevSkip·비밀번호 로그 미노출 확인 | 수동 또는 스크립트로 확인 |

---

## 실행 순서 요약

1. **Phase 1** (PageLayout 적용) → 회원가입 8개 파일 수정 → 빌드·린트.
2. **Phase 2** (Critical) → C2·C3 즉시, C1·C4 옵션 선택 후 적용.
3. **Phase 3** (High) → H1 최소/권장, H2 문서화.
4. **Phase 4** (Medium) → M1 레이아웃 점검, M2 console 정리.
5. **Phase 5** → 전체 검증·산출물 확인.

---

## 참조

- 레이아웃 플랜: `레이아웃_그리드_수정_플랜_*.plan.md`
- 위험 요인 목록: 사용자 제공 "현시점 코드베이스 위험 요인 식별"
- 딥 개발 플랜: [ReNew/DEEP_DEVELOPMENT_PLAN.md](ReNew/DEEP_DEVELOPMENT_PLAN.md)
- FSD: [docs/FSD_ENFORCEMENT_RULES.md](docs/FSD_ENFORCEMENT_RULES.md)
