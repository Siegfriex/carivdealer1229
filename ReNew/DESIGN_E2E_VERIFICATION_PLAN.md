# 디자인 E2E 일괄 점검 및 정합성 검증 플랜

**작성일**: 2025-01-28  
**목적**: Figma Dev(MCP)·1440px를 SSOT로 삼아, 로컬 스크린샷과 Figma 스크린샷의 정합성 측정 및 E2E 디자인 검증·디버깅·리팩토링을 성공적으로 수행하기 위한 구체적 플랜

---

## 1. SSOT (Single Source of Truth) — 2개

| # | SSOT | 용도 | 검증 도구/방법 |
|---|------|------|----------------|
| 1 | **Figma Dev (MCP)** | 코드 리뷰·코드 레이어·디자인 스펙 | `mcp_Figma_get_design_context`, `mcp_Figma_get_screenshot`, `mcp_Figma_get_metadata` |
| 2 | **1440px 레이아웃·토큰** | 컨테이너·타이포·간격·색상 기준 | `design-tokens.css`, `TYPOGRAPHY_SYSTEM.md`, Playwright viewport 1440x900 |

**지향점**: 로컬(`npm run dev` 또는 Playwright)에서 촬영한 스크린샷과 Figma MCP로 얻은 스크린샷을 대조하여 정합성 측정.

---

## 2. 일괄 점검 절차

### 2.1 Figma Dev(MCP) 기준 점검

**대상 Figma 파일**: `4w3ft8RpGwoho5EtvNO9hQ` (Domestic Seller 1.0)

**검차 플로우 노드 (노드 ID: URL `XXXX-YYYY` → MCP `XXXX:YYYY`)**:

| 순서 | Figma 노드 | 화면 | 구현 파일 | MCP 호출 |
|------|------------|------|-----------|----------|
| 1 | 915:998 | 차량등록 완료 (2-2) | `VehicleRegistrationCompletePage.tsx` | get_design_context, get_screenshot |
| 2 | 1202:6390 | 검차신청 랜딩 (3) | `InspectionRequestLandingPage.tsx` | 동일 |
| 3 | 1202:6685 | 검차 신청 목록 (4) | `InspectionListPage.tsx` | 동일 |
| 4 | 1202:7020 | 목록 확장 단일 (4-1) | `InspectionListPage.tsx` | 동일 |
| 5 | 1202:7204 | 목록 확장 전체 (4-1-1) | `InspectionListPage.tsx` | 동일 |
| 6 | 1202:7440 | 검차 진행 매칭중 (5) | `InspectionProgressPage.tsx` | 동일 |
| 7 | 1202:7752 | 검차 진행 이동중 (5-1) | `InspectionProgressPage.tsx` | 동일 |
| 8 | 1202:7902 | 검차 진행 완료 (5-2) | `InspectionProgressPage.tsx` | 동일 |
| 9 | 1202:7588 | 검차내역 (6) | `InspectionHistoryPage.tsx` | 동일 |

**점검 항목 (코드 리뷰·레이어)**:
- **레이아웃**: 그리드/플렉스 구조, 사이드바 너비, 메인 padding
- **타이포그래피**: 제목/본문/캡션 크기·weight (Figma 스타일과 `design-tokens.css` 대조)
- **색상**: 배경·텍스트·보더·primary (Figma 변수와 CSS 변수 대조)
- **컴포넌트**: 버튼·카드·배지 크기·간격
- **FSD 레이어**: pages → widgets/entities/shared, `@/components` 등 미참조

**실행 순서**:
1. 각 노드에 대해 `get_design_context`로 스펙(코드/메타) 수집
2. `get_screenshot`로 Figma 기준 스크린샷 수집 (저장 경로: `tests/screenshots/figma/` 등)
3. 현재 구현 파일과 대조하여 불일치 목록 작성

### 2.2 1440px 기준 점검

**기준 문서**:
- `src/shared/styles/design-tokens.css` — `--layout-base-width: 1440px`, 타입 스케일, 간격, 색상
- `ReNew/TYPOGRAPHY_SYSTEM.md` — 1440px 기준 타이포

**점검 항목**:
- 모든 검차 플로우 페이지가 `max-w-[1440px]` 또는 `container` + 1440px 제한 사용 여부
- 타이포 클래스: `text-h1` ~ `text-caption` 사용 여부 (clamp 기준 1440px)
- 간격: `gap-4`(16px), `p-8`(32px) 등이 토큰/스케일과 일치 여부
- Playwright viewport: 스크린샷 촬영 시 **1440x900** 고정

**실행**:
- Playwright로 1440x900 viewport 고정 후 각 URL 방문, fullPage 스크린샷 저장
- `00-run-all-screenshots.spec.ts`에 검차 플로우 경로 추가 여부 확인

---

## 3. 로컬 스크린샷 vs Figma 스크린샷 정합성 측정

### 3.1 로컬 스크린샷 수집

**방식 A: Playwright (권장)**  
- `npm run dev` 또는 `webServer`로 기동 후 `npx playwright test tests/e2e/06-inspection-flow-complete.spec.ts`  
- 각 테스트에서 `page.screenshot({ path: '...', fullPage: true })`로 1440px 뷰 저장

**방식 B: 수동 (npm run dev)**  
- 브라우저에서 viewport 1440x900 설정 후 각 URL 방문, 수동 스크린샷 저장

**저장 위치**: `tests/screenshots/` (기존)  
- 검차 플로우: `19-vehicle-complete-to-inspection.png` ~ `29-inspection-full-flow.png` (06-inspection-flow-complete.spec.ts)
- 전체 스크린샷 보강: `30-inspection-list`, `31-inspection-request-landing`, `32-inspection-history` (00-run-all-screenshots.spec.ts)

### 3.2 Figma 스크린샷 수집

- MCP: `mcp_Figma_get_screenshot(nodeId, fileKey)` 로 각 노드 스크린샷 획득
- 저장: `tests/screenshots/figma/` (신규 폴더)  
  - 예: `figma-915-998.png`, `figma-1202-6390.png`, …

### 3.3 정합성 측정 방법

| 단계 | 작업 | 비고 |
|------|------|------|
| 1 | Figma 스크린샷과 로컬 스크린샷을 나란히 비교 (시각적) | 레이아웃·텍스트 위치·버튼 위치·색상 |
| 2 | (선택) 픽셀 단위 diff 도구 사용 | 예: ImageMagick, pixelmatch — 폰트/렌더 차이로 허용 오차 필요 |
| 3 | 불일치 목록 작성 | 페이지별·영역별(헤더/사이드바/메인/버튼) |

**정합성 체크리스트 (페이지별)**:
- [ ] GNB·사이드바 유무 및 순서
- [ ] 제목(H1) 텍스트 및 스타일
- [ ] 버튼 라벨·위치·개수
- [ ] 카드/리스트 구조·간격
- [ ] 상태 배지·확장 영역 (목록 페이지)

---

## 4. E2E 디자인 검증 — 디버깅 및 리팩토링 플랜

### 4.1 현재 E2E 구조

- **검차 플로우 전용**: `tests/e2e/06-inspection-flow-complete.spec.ts` (7 tests)
- **전체 스크린샷 수집**: `tests/e2e/00-run-all-screenshots.spec.ts` — 검차 신청 목록·랜딩·내역 등 일부 경로 미포함 가능

### 4.2 디버깅 포인트

| 문제 유형 | 원인 예시 | 대응 |
|----------|-----------|------|
| **Strict mode violation** | `locator('text=검차 신청')`이 여러 요소 매칭 | `getByRole('heading', { name: '...' })`, `getByText('...', { exact: true }).first()` 등 구체적 locator 사용 |
| **Timeout** | SPA에서 `goBack()` 후 URL 미변경 | `page.goto(path)` 직접 이동으로 대체 |
| **요소 비가시** | 필터/탭 추가로 DOM 순서 변경 | role·name·필터 조합으로 안정적 locator 유지 |
| **스크린샷 불일치** | viewport·폰트·테마 차이 | 1440x900 고정, 동일 브라우저(Chromium) 사용 |

### 4.3 리팩토링 계획

1. **Locator 공통화**  
   - 반복되는 문자열(예: "검차 신청 목록", "검차내역")은 `getByRole('heading', { name })` 또는 상수/헬퍼로 통일
   - 확장 영역 라벨: `getByText('평가사', { exact: true }).first()` 패턴 유지

2. **스크린샷 일관성**  
   - 모든 검차 관련 스크린샷을 **1440x900**으로 통일
   - 파일 네이밍: `{화면식별}-1440px.png` 또는 `{번호}-{설명}-1440px.png`

3. **00-run-all-screenshots 보강**  
   - `pages` 배열에 다음 경로 추가 완료:  
     - `/inspections` → 30-inspection-list  
     - `/inspections/request` → 31-inspection-request-landing  
     - `/inspections/history` → 32-inspection-history  
   - `/vehicles/v-001/complete` → 18-vehicle-complete (기존)

4. **Figma 스크린샷 자동 저장 (선택)**  
   - 스크립트 또는 MCP 연동으로 Figma 노드 스크린샷을 `tests/screenshots/figma/`에 저장
   - CI/로컬에서 “Figma 수집 → 로컬 스크린샷 촬영 → 비교” 파이프라인 가능

5. **시각적 회귀 테스트 (선택)**  
   - `expect(page).toHaveScreenshot('name.png')` 로 첫 실행 시 baseline 저장, 이후 변경 시 diff
   - Figma와의 정합성은 “수동 비교” 또는 별도 diff 툴로 수행

### 4.4 실행 순서 (성공적 수행을 위한 권장 순서)

1. **Figma MCP로 SSOT 1 점검**  
   - 검차 플로우 9개 노드에 대해 `get_design_context` + `get_screenshot` 실행  
   - Figma 스크린샷을 `tests/screenshots/figma/`에 저장

2. **1440px SSOT 점검**  
   - `design-tokens.css`·TYPOGRAPHY_SYSTEM과 검차 페이지 코드 대조  
   - viewport 1440x900 고정 확인

3. **로컬 스크린샷 재촬영**  
   - `npx playwright test tests/e2e/06-inspection-flow-complete.spec.ts`  
   - 필요 시 `00-run-all-screenshots.spec.ts`에 경로 추가 후 전체 스크린샷 재생성

4. **정합성 측정**  
   - Figma vs 로컬 스크린샷 시각적 비교  
   - 불일치 목록 작성 (페이지·영역·항목)

5. **디버깅·리팩토링**  
   - 불일치 반영: 레이아웃·타이포·색상·간격 코드 수정  
   - E2E locator 정리 및 타임아웃/불안정 구간 수정

6. **재검증**  
   - `npm run build` + `npx playwright test tests/e2e/06-inspection-flow-complete.spec.ts`  
   - 스크린샷 재촬영 후 정합성 재확인

---

## 5. 요약 체크리스트

- [ ] **SSOT 1**: Figma Dev(MCP)로 검차 9노드 design context + screenshot 수집
- [ ] **SSOT 2**: 1440px 토큰·레이아웃 기준으로 검차 페이지 코드 점검
- [ ] **로컬 스크린샷**: Playwright 1440x900으로 검차 플로우 스크린샷 확보
- [ ] **정합성 측정**: Figma 스크린샷 vs 로컬 스크린샷 비교, 불일치 목록 작성
- [ ] **E2E 디버깅**: locator 구체화, timeout·SPA 이동 이슈 해소
- [ ] **리팩토링**: 00-run-all-screenshots 경로 보강, 스크린샷 네이밍·viewport 통일
- [ ] **재검증**: 빌드 + E2E 전부 통과 후 정합성 재확인

---

## 6. 참고

- **구체 실행 플랜**: `ReNew/DESIGN_E2E_DEBUG_REFACTOR_PLAN.md` (화면–노드–파일–스크린샷 매핑, 디버깅 체크리스트, 정합성 체크리스트)
- **Figma 파일 키**: `4w3ft8RpGwoho5EtvNO9hQ`
- **노드 ID 변환**: URL `XXXX-YYYY` → MCP `XXXX:YYYY`
- **디자인 토큰**: `src/shared/styles/design-tokens.css`
- **E2E 검차 플로우**: `tests/e2e/06-inspection-flow-complete.spec.ts`
- **전체 스크린샷**: `tests/e2e/00-run-all-screenshots.spec.ts`
