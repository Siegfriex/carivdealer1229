# 구체적 딥 개발 플랜

**문서 버전**: 1.0  
**최종 업데이트**: 2026-01-28  
**목적**: SSOT·1440px·E2E·DEV:SKIP·정합성 측정을 한 문서에 정리한 **실행 가능한 딥 개발 플랜** (보고·실행용)

---

## 1. 레퍼런스(SSOT) 정리

| # | SSOT | 검증 도구 | 산출물 |
|---|------|-----------|--------|
| 1 | **Figma Dev (MCP)** | `mcp_Figma_get_design_context`, `mcp_Figma_get_screenshot` | 코드 스펙, Figma 스크린샷 |
| 2 | **1440px 레이아웃·토큰** | `src/shared/styles/design-tokens.css`, Playwright viewport 1440×900 | 로컬 스크린샷 (`tests/screenshots/`) |
| 3 | **코드 레이어(FSD)** | `docs/FSD_ENFORCEMENT_RULES.md`, `grep` 레거시 참조 | pages/auth 등 레이어 준수 여부 |

**지향점**
- 로컬: `npm run dev` 또는 Playwright `webServer` 기동 후 **1440×900** 고정으로 스크린샷 촬영.
- Figma MCP로 동일 화면 스크린샷·디자인 컨텍스트 수집.
- 두 결과 **시각적 비교** → 불일치 시 코드/레이어 수정.

**Figma 파일 키**: `4w3ft8RpGwoho5EtvNO9hQ` (Domestic Seller 1.0)

---

## 2. 회원가입 플로우 – 구체 플랜

### 2.1 Figma 노드 ↔ 구현 ↔ 스크린샷

| 순서 | Figma 노드 | 화면 | 구현 파일 | E2E 스크린샷 (02-signup-*) |
|------|------------|------|-----------|-----------------------------|
| 0 | 1194-6171 | 회원가입 진입 | SignupEntryPage.tsx | 02-signup-entry.png |
| 1 | 1194-5792 | Step1 본인인증 | SignupStep1Page.tsx | 02-signup-step1-identity.png |
| 2 | 1194-5866 | Step2 사업자 정보 | SignupStep2Page.tsx | 02-signup-step2-business.png |
| 3 | 1194-5921 | Step3 중고차 매매업 인증 | SignupStep3Page.tsx | 02-signup-step3-dealership.png |
| 4 | 1194-6002 | Step4 정산 정보 | SignupStep4Page.tsx | 02-signup-step4-settlement.png |
| 5 | 1194-6072 | Step5 약관 동의 | SignupStep5Page.tsx | 02-signup-step5-terms.png |
| 6 | 1194-6063 | Step6 승인 대기 | SignupPendingPage.tsx | 02-signup-step6-pending.png |
| 7 | 1194-6054 | 승인 완료 | SignupCompletePage.tsx | 02-signup-step6-complete.png |

### 2.2 DEV:SKIP (개발 시 필수 입력 스킵)

- **위치**: 좌하단 고정 버튼 `div.fixed.bottom-6.left-6.z-[9999]` (DevSkipFloatingButton).
- **동작**: 클릭 시 전역 `skipRequired` 토글. ON이면 **이 플랜을 적용한 페이지**에서 필수 검증 스킵 후 다음 단계 이동.
- **회원가입 Step1 적용 완료**  
  - `SignupStep1Page`에서 `useDevSkip()` 사용.  
  - `skipRequired === true`일 때 `handleNext()`에서 검증 없이 `/signup/step2` 이동.
- **사용 절차**:  
  1. `/signup/step1` 접속 → 2. 좌하단 **dev:skip** 클릭 → **dev:skip ON** → 3. **다음** 클릭 → Step2 이동.

### 2.3 DOM/도구 이슈 (인증번호 전송 버튼)

- **현상**: 일부 도구가 "인증번호 전송" 버튼의 부모를 `div.fixed.bottom-6.left-6.z-[9999]`로 잘못 표시.
- **실제 구조**: "인증번호 전송" 버튼은 **회원가입 폼** 내부(`section[1] > div.space-y-4 > ... > button`)에 있음. 고정 div에는 **dev:skip** 버튼만 있음.
- **조치**: 코드 구조 변경 불필요. 도구 해석 오류로 이해하고, 레퍼런스는 위 2.1 매핑 및 실제 DOM 기준으로 유지.

### 2.4 E2E (02-signup-flow.spec.ts) 리팩토링 적용 내역

- h1 strict 모드: `getByRole('heading', { name: '회원가입' })` (MobileBlocker h1과 구분).
- 비밀번호: `page.locator('input[type="password"]').first().fill()`, `.last().fill()`.
- 이메일: `input[placeholder="아이디"]`.nth(1) + `selectOption({ label: 'naver.com' })`.
- Step2 필수 select 2개: `locator('select').first().selectOption({ label: '소매업' })`, `.nth(1).selectOption({ label: '개인사업자' })`.
- 신분증: `section:has(h2:has-text("신분증"))` 내 `input[type="file"]`.
- `playwright.config.ts`: 기본 viewport 1440×900.

### 2.5 회원가입 E2E 검증 결과

| 테스트 | 결과 | 비고 |
|--------|------|------|
| 필수 필드 검증 | 통과 | Step2 필수 select 2개 반영 |
| 이전 버튼 동작 | 통과 | Step3→2→1 |
| 전체 플로우 (8단계) | 타임아웃 가능 | Step1→Step2에서 waitForURL 타임아웃. **dev:skip ON** 후 재실행 시 통과 기대 |

---

## 3. 검차 플로우 – 구체 플랜 (요약)

### 3.1 Figma 노드 ↔ 구현 ↔ 스크린샷

| 순서 | Figma 노드 | 화면 | 구현 파일 | 스크린샷 |
|------|------------|------|-----------|----------|
| 1 | 915:998 | 차량등록 완료 (2-2) | VehicleRegistrationCompletePage.tsx | 19-vehicle-complete-to-inspection.png |
| 2 | 1202:6390 | 검차신청 랜딩 | InspectionRequestLandingPage.tsx | 21-inspection-request-landing.png |
| 3 | 1202:6685 | 검차 신청 목록 | InspectionListPage.tsx | 22-inspection-list-initial.png |
| 4~6 | 1202:7020, 7204, 7440, 7752, 7902, 7588 | 목록 확장·진행·내역 | InspectionListPage, InspectionProgressPage, InspectionHistoryPage | 23~28 |

### 3.2 DEV:SKIP 적용 페이지 (검차)

- InspectionRequestStep1Page: `useDevSkip()`, `skipRequired` 시 step2 이동.
- InspectionRequestStep2Page: DevSkipButton "목록으로 스킵".
- InspectionProgressPage: DevSkipButton (매칭중→이동중→완료 스킵).

---

## 4. 1440px 준수 – 구체 점검

| 항목 | 기준 | 점검 방법 |
|------|------|-----------|
| 레이아웃 | `--layout-base-width: 1440px`, `--container-max` | design-tokens.css 확인 |
| 타이포 | Figma 1194-7425, 1440px 기준 px/vw | text-h1 ~ text-caption 사용 여부 |
| E2E viewport | 1440×900 고정 | playwright.config.ts `viewport`, 각 스펙 setViewportSize |
| 스크린샷 | 1440×900으로 촬영 | tests/screenshots/ 파일명·실행 스펙 확인 |

---

## 5. 코드 레이어(FSD) – 구체 점검

| 항목 | 기준 | 점검 방법 |
|------|------|-----------|
| auth 페이지 | @/components, @/config, @/services, @/utils 미사용 | grep `from '@/components'` 등 src/pages/auth |
| 레이어 의존성 | shared ← entities ← features ← widgets ← pages | docs/FSD_ENFORCEMENT_RULES.md |

---

## 6. 일괄 점검 실행 순서 (구체)

1. **Step 1 – Figma MCP SSOT 수집**  
   - 회원가입: 노드 1194-6171, 1194-5792, 1194-5866, 1194-5921, 1194-6002, 1194-6072, 1194-6063, 1194-6054에 대해 get_design_context / get_screenshot.  
   - 검차: 노드 915:998, 1202:6390 등 (DESIGN_E2E_DEBUG_REFACTOR_PLAN.md 2.1 참고).

2. **Step 2 – 1440px·코드 레이어 점검**  
   - design-tokens.css 1440 변수 사용 여부.  
   - playwright.config.ts viewport 1440×900.  
   - src/pages/auth 레거시 import 미사용.

3. **Step 3 – 로컬 스크린샷 촬영**  
   - `npx playwright test tests/e2e/02-signup-flow.spec.ts` (회원가입).  
   - 필요 시 `npx playwright test tests/e2e/06-inspection-flow-complete.spec.ts`, `00-run-all-screenshots.spec.ts`.

4. **Step 4 – 정합성 측정**  
   - Figma 스크린샷 vs 로컬 스크린샷 시각 비교.  
   - 불일치 목록 작성 → 코드/레이아웃 수정.

5. **Step 5 – DEV:SKIP 검증**  
   - 회원가입 Step1: dev:skip ON → 다음 클릭 → Step2 이동 확인.  
   - 검차 Step1/Step2/Progress: 각 DevSkipButton 동작 확인.

---

## 7. 체크리스트 (항목별)

### 회원가입

- [ ] SignupStep1Page: useDevSkip(), skipRequired 시 step2 이동
- [ ] SignupStep2~5, Pending, Complete: 노드·파일 매핑 및 1440px 컨테이너
- [ ] E2E: getByRole('heading','회원가입'), 비밀번호 first/last, 이메일 nth(1)+select, Step2 select 2개, 신분증 section file input
- [ ] Playwright viewport 1440×900, 스크린샷 경로 tests/screenshots/02-signup-*.png

### 검차

- [ ] InspectionRequestStep1/Step2, InspectionProgressPage: DEV:SKIP 동작
- [ ] 06-inspection-flow-complete, 00-run-all-screenshots: viewport 1440×900, 스크린샷 경로 일치

### 공통

- [ ] design-tokens.css: --layout-base-width 1440px, 타입/간격 토큰
- [ ] FSD: auth/admin 페이지 레거시 import 없음

---

## 8. 알려진 이슈·다음 단계

| 이슈 | 내용 | 다음 단계 |
|------|------|-----------|
| E2E 전체 플로우 타임아웃 | Step1→Step2에서 waitForURL 타임아웃 가능 (state 타이밍) | dev:skip ON으로 전체 플로우 검증 또는 Step1 직후 waitForTimeout(500) 등 재시도 |
| DOM 도구 오표시 | "인증번호 전송" 부모를 고정 div로 잘못 표시 | 코드 변경 없음, 문서·매핑으로 정리 완료 |
| Step2~5 DEV:SKIP | 현재 Step1만 dev skip 적용 | 필요 시 Step2~5에도 useDevSkip() 적용하여 동일 패턴 확장 |

---

## 9. 검증 명령어

```bash
# 빌드
npm run build

# 린트
npm run lint

# FSD 레거시 참조 확인
grep -r "from '@/components" src/pages/auth
grep -r "from '@/config" src/pages/auth
grep -r "from '@/services" src/pages/auth
grep -r "from '@/utils" src/pages/auth

# 회원가입 E2E
npx playwright test tests/e2e/02-signup-flow.spec.ts

# 회원가입 E2E (dev:skip ON 상태에서 수동 1회 확인 권장)
# 1. npm run dev → /signup/step1 → dev:skip ON → 다음 → step2 확인
```

---

## 10. 참고 문서

| 문서 | 용도 |
|------|------|
| ReNew/DESIGN_E2E_DEBUG_REFACTOR_PLAN.md | 검차·회원가입 E2E 디버깅 상세 |
| ReNew/DESIGN_E2E_VERIFICATION_PLAN.md | 검증 플랜 개요 |
| ReNew/FIGMA_DESIGN_SPEC.md | Figma 스펙 |
| ReNew/SESSION_SUMMARY.md | 세션 작업 정리 |
| docs/FSD_ENFORCEMENT_RULES.md | FSD 강제 규칙 |

---

**이 문서는 SSOT·회원가입·검차·DEV:SKIP·E2E·1440px·FSD를 하나의 구체적 딥 개발 플랜으로 정리한 보고·실행용 문서이다.**
