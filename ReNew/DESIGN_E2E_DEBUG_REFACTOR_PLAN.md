# 구체적 디자인 E2E 디버깅 및 리팩토링 플랜

**작성일**: 2025-01-28  
**목적**: SSOT 2개(Figma Dev MCP, 1440px) 기준으로 로컬 스크린샷·Figma 스크린샷 정합성 측정 후, E2E 디버깅·리팩토링을 실행하기 위한 **실행 가능한** 플랜

---

## 1. 레퍼런스(SSOT) 정리

| # | SSOT | 검증 도구 | 산출물 |
|---|------|-----------|--------|
| 1 | **Figma Dev (MCP)** | `mcp_Figma_get_design_context`, `mcp_Figma_get_screenshot` | 코드 스펙, Figma 스크린샷 (`tests/screenshots/figma/`) |
| 2 | **1440px 레이아웃·토큰** | `design-tokens.css`, Playwright viewport 1440×900 | 로컬 스크린샷 (`tests/screenshots/`) |

**지향점**:  
- 로컬: `npm run dev` 또는 Playwright `webServer` 기동 후 **1440×900** 고정으로 스크린샷 촬영  
- Figma MCP로 동일 화면의 스크린샷·디자인 컨텍스트 수집  
- 두 결과를 **시각적 비교**하여 정합성 측정 → 불일치 시 코드/레이어 수정

---

## 2. 화면–노드–파일–스크린샷 매핑

### 2.1 Figma 노드 ↔ 구현 ↔ 로컬 스크린샷

| 순서 | Figma 노드 | 화면 | 구현 파일 | 로컬 스크린샷 (1440px) | 비고 |
|------|------------|------|-----------|------------------------|------|
| 1 | 915:998 | 차량등록 완료 (2-2) | `VehicleRegistrationCompletePage.tsx` | 19-vehicle-complete-to-inspection.png | 06-inspection-flow-complete |
| 2 | 1202:6390 | 검차신청 랜딩 (3) | `InspectionRequestLandingPage.tsx` | 21-inspection-request-landing.png | 동일 |
| 3 | 1202:6685 | 검차 신청 목록 (4) | `InspectionListPage.tsx` | 22-inspection-list-initial.png | 동일 |
| 4 | 1202:7020 | 목록 확장 단일 (4-1) | `InspectionListPage.tsx` | 23-inspection-list-expanded-single.png | 동일 |
| 5 | 1202:7204 | 목록 확장 전체 (4-1-1) | `InspectionListPage.tsx` | 24-inspection-list-expanded-multiple.png | 동일 |
| 6 | 1202:7440 | 검차 진행 매칭중 (5) | `InspectionProgressPage.tsx` | 25-inspection-progress-matching.png | 동일 |
| 7 | 1202:7752 | 검차 진행 이동중 (5-1) | `InspectionProgressPage.tsx` | 26-inspection-progress-en-route.png | 동일 |
| 8 | 1202:7902 | 검차 진행 완료 (5-2) | `InspectionProgressPage.tsx` | 27-inspection-progress-complete.png | 동일 |
| 9 | 1202:7588 | 검차내역 (6) | `InspectionHistoryPage.tsx` | 28-inspection-history.png | 동일 |

**Figma 파일 키**: `4w3ft8RpGwoho5EtvNO9hQ` (Domestic Seller 1.0)

### 2.2 로컬 스크린샷 수집 경로

| 스펙 | 경로 | 스크린샷 파일 (1440px) |
|------|------|------------------------|
| 00-run-all-screenshots | `/`, `/login`, … `/vehicles/v-001/complete` | 00-landing-1440px.png ~ 18-vehicle-complete-1440px.png |
| 00-run-all-screenshots (보강) | `/inspections`, `/inspections/request`, `/inspections/history` | 30-inspection-list-1440px.png, 31-inspection-request-landing-1440px.png, 32-inspection-history-1440px.png |
| 06-inspection-flow-complete | 플로우별 | 19 ~ 29 (위 표 참고) |

---

## 3. 일괄 점검 실행 순서 (구체)

### 3.1 Step 1: Figma MCP로 SSOT 1 점검

**실행**  
- 각 노드에 대해 `mcp_Figma_get_design_context(nodeId, fileKey)` 호출  
- 동일 노드에 대해 `mcp_Figma_get_screenshot(nodeId, fileKey)` 호출  
- Figma 스크린샷 저장: `tests/screenshots/figma/figma-{노드}.png` (예: `figma-915-998.png`)

**노드 목록 (9개)**  
`915:998`, `1202:6390`, `1202:6685`, `1202:7020`, `1202:7204`, `1202:7440`, `1202:7752`, `1202:7902`, `1202:7588`

**점검 항목 (design context 기준)**  
- 레이아웃: 그리드/플렉스, 사이드바 너비, 메인 padding  
- 타이포: 제목/본문/캡션 크기·weight → `design-tokens.css` (`--text-h1` ~ `--text-caption`)와 대조  
- 색상: 배경·텍스트·보더 → Figma 변수와 CSS 변수 대조  
- 컴포넌트: 버튼·카드·배지 크기·간격  

**산출물**  
- `tests/screenshots/figma/` 하위 9개 PNG  
- 불일치 목록 (페이지별·영역별)

### 3.2 Step 2: 1440px SSOT 점검

**기준**  
- `src/shared/styles/design-tokens.css`: `--layout-base-width: 1440px`, 타입/간격/색상  
- Playwright: viewport **1440×900** 고정 (`playwright.config.ts` 및 각 스펙 내 `setViewportSize`)

**점검 항목**  
- 검차 관련 페이지가 `max-w-[1440px]` 또는 `container` + 1440px 제한 사용 여부  
- 타이포 클래스: `text-h1` ~ `text-caption` 사용 여부  
- 간격: `gap-4`(16px), `p-8`(32px) 등 토큰 일치 여부  
- E2E: 모든 검차 스크린샷이 1440×900으로 촬영되는지 확인  

**실행**  
- `design-tokens.css` 및 검차 페이지 TSX/SCSS grep으로 container·타이포·간격 확인  
- `tests/e2e/06-inspection-flow-complete.spec.ts`, `00-run-all-screenshots.spec.ts` viewport 확인  

### 3.3 Step 3: 로컬 스크린샷 재촬영

**실행**  
```bash
npx playwright test tests/e2e/06-inspection-flow-complete.spec.ts
npx playwright test tests/e2e/00-run-all-screenshots.spec.ts
```

**전제**  
- `npm run dev` 또는 Playwright `webServer`로 로컬 기동  
- viewport 1440×900 유지  

**산출물**  
- `tests/screenshots/` 내 19~29 (검차 플로우), 00~18 및 30~32 (전체/검차 보강)

### 3.4 Step 4: 정합성 측정 (Figma vs 로컬)

**방법**  
- Figma 스크린샷(`tests/screenshots/figma/`)과 로컬 스크린샷(위 매핑 표 기준)을 **나란히 시각 비교**  
- 비교 시 확인: GNB·사이드바 유무/순서, 제목(H1) 텍스트·스타일, 버튼 라벨·위치·개수, 카드/리스트 구조·간격, 상태 배지·확장 영역  

**선택**  
- 픽셀 단위 diff(ImageMagick, pixelmatch 등) 사용 시, 폰트/렌더 차이로 인해 허용 오차 설정  

**산출물**  
- 페이지별·영역별 **불일치 목록** (예: “검차 신청 목록 H1이 Figma 24px, 코드 20px”)

### 3.5 Step 5: 디버깅·리팩토링 실행

**디버깅 포인트 (E2E)**  

| 문제 유형 | 원인 예시 | 대응 (구체) |
|----------|-----------|-------------|
| Strict mode | `locator('text=검차 신청')` 다중 매칭 | `getByRole('heading', { name: '검차 신청' })`, `getByText('...', { exact: true }).first()` |
| Timeout | SPA에서 `goBack()` 후 URL 미변경 | `page.goto('/inspections')` 등 직접 이동 |
| 요소 비가시 | DOM 순서/필터 변경 | `getByRole('listitem').filter({ hasText: '...' }).first()` 등 구체화 |
| 스크린샷 불일치 | viewport/폰트/테마 차이 | 1440×900 고정, Chromium 동일 사용 |

**리팩토링 항목**  
1. **Locator 공통화**: 반복 문자열은 `getByRole('heading', { name })` 또는 상수/헬퍼로 통일  
2. **스크린샷 일관성**: 검차 관련 모두 1440×900, 파일명 `{화면식별}-1440px.png` 또는 기존 19~29 유지  
3. **00-run-all-screenshots 보강**: `pages`에 `/inspections`, `/inspections/request`, `/inspections/history` 추가 (30~32번)  
4. **불일치 반영**: 정합성 측정 결과에 따라 레이아웃·타이포·색상·간격 코드 수정  

### 3.6 Step 6: 재검증

**실행**  
```bash
npm run build
npx playwright test tests/e2e/06-inspection-flow-complete.spec.ts
npx playwright test tests/e2e/00-run-all-screenshots.spec.ts
```

- 빌드 성공, E2E 전부 통과 후 스크린샷 재촬영 및 정합성 재확인

---

## 4. E2E 디버깅 체크리스트 (파일·라인 기준)

- [ ] **06-inspection-flow-complete.spec.ts**  
  - viewport 1440×900 (`beforeEach`)  
  - 모든 스크린샷 경로가 `tests/screenshots/` 하위  
  - "검차 신청", "검차 신청 목록", "검차내역" 등은 `getByRole('heading', { name })` 또는 `getByText(..., { exact: true }).first()` 사용  
  - 테스트 7: 목록→진행→내역 이동 시 `page.goto('/inspections')` 사용 (goBack 대체)
- [ ] **00-run-all-screenshots.spec.ts**  
  - viewport 1440×900 / 700×900 명시  
  - `pages`에 검차 경로 3개 포함: `/inspections`, `/inspections/request`, `/inspections/history` (30~32번)
- [ ] **playwright.config.ts**  
  - 기본 viewport 1440×900  
  - webServer: `npm run dev`, baseURL `http://localhost:3000`

---

## 5. 정합성 측정 체크리스트 (페이지별)

- [ ] 차량등록 완료: GNB, 제목, "검차 진행하기"/"홈으로 돌아가기" 버튼 위치·스타일  
- [ ] 검차신청 랜딩: 사이드바 단계, "검차 신청" 제목, "검차 신청하기"/"임시저장" 버튼  
- [ ] 검차 신청 목록: 제목, SegmentedControl(전체/매칭중/…), 목록 4건, 확장 시 희망일시·평가사·상태  
- [ ] 검차 진행 (매칭/이동/완료): ProgressSidebar, 단계 텍스트, DEV:SKIP·스킵·검차내역 보기  
- [ ] 검차내역: 제목, 완료 목록, 검색, 행 클릭 시 상세 이동  

---

## 6. 요약

- **SSOT**: (1) Figma Dev MCP → design context + screenshot (2) 1440px → design-tokens + viewport 1440×900  
- **로컬 스크린샷**: Playwright 1440×900으로 00-run-all-screenshots(00~18, 30~32) + 06-inspection-flow-complete(19~29) 촬영  
- **정합성**: Figma 스크린샷과 로컬 스크린샷 시각 비교 → 불일치 목록 작성  
- **디버깅**: strict mode locator 구체화, timeout/SPA 이동은 `page.goto` 대체  
- **리팩토링**: 00-run-all 경로 보강(검차 3경로), 스크린샷·viewport 통일, 불일치 반영 후 재검증  

이 문서는 `ReNew/DESIGN_E2E_VERIFICATION_PLAN.md`의 실행용 구체 플랜이며, 두 문서를 함께 사용하면 SSOT 기준 일괄 점검부터 디버깅·리팩토링까지 한 번에 수행할 수 있다.

---

## 7. 회원가입 플로우 E2E 실행 이력 (02-signup-flow.spec.ts)

**Figma 노드**: 1194-6171(진입), 1194-5792(Step1), 1194-5866(Step2), 1194-5921(Step3), 1194-6002(Step4), 1194-6072(Step5), 1194-6063(승인대기), 1194-6054(승인완료)

**리팩토링 적용**  
- h1 strict 모드: `getByRole('heading', { name: '회원가입' })` 사용 (MobileBlocker h1과 구분)  
- 비밀번호: `page.locator('input[type="password"]').first().fill()` / `.last().fill()`  
- 이메일: `input[placeholder="아이디"]`.nth(1) + selectOption('naver.com')  
- Step2 필수 select 2개: `locator('select').first().selectOption({ label: '소매업' })`, `.nth(1).selectOption({ label: '개인사업자' })`  
- `playwright.config.ts`: 기본 viewport 1440×900

**검증 결과**  
- 「필수 필드 검증」「이전 버튼 동작」: 통과  
- 「전체 플로우 (8단계)」: Step1→Step2 이동 시 waitForURL 타임아웃 가능. Step1 검증(이메일/파일 state)이 클릭 직후 반영되지 않을 수 있음. 로컬에서 스크린샷·에러 메시지 확인 후 추가 디버깅 권장.
