# Z-Index 권장 조치 시행 및 최종 보고

**문서 버전**: 1.0  
**최종 업데이트**: 2025-01-28  
**검증 상태**: 완료

---

## 1. 실행 요약

| 항목 | 결과 |
|------|------|
| 권장 조치 적용 | 완료 |
| 빌드 | 성공 |
| E2E (검차 플로우) | 7/7 통과 |
| z-index 상수 체계 | DevSkip 계열 통합 완료 |

Z-Index 문맥 문서(`Z_INDEX_AND_FRONTEND_METHODOLOGY.md`)의 권장 조치를 모두 반영했고, 빌드 및 E2E로 검증했다.

---

## 2. 적용한 권장 조치

### 2.1 zIndex.ts 확장

- **파일**: `src/shared/config/zIndex.ts`
- **추가**: `DEV_SKIP: 950`, `DEV_SKIP_PAGE: 951`
- **의도**: LOADING(900) 위에 개발용 스킵 UI를 두고, 전역 플로팅(950)과 페이지용 버튼(951)을 분리해 E2E에서 페이지 버튼이 항상 클릭 가능하도록 함.

### 2.2 DevSkipFloatingButton

- **파일**: `src/shared/ui/DevSkipFloatingButton.tsx`
- **변경**: `className` 내 `z-[9999]` 제거 → `style={{ zIndex: Z_INDEX.DEV_SKIP }}` 사용
- **import**: `@/shared/config/zIndex` 에서 `Z_INDEX` 사용

### 2.3 DevSkipButton

- **파일**: `src/shared/ui/DevSkipButton.tsx`
- **변경**: `className` 내 `z-[10000]` 제거 → `style={{ zIndex: Z_INDEX.DEV_SKIP_PAGE }}` 사용
- **이유**: 전역 플로팅(950)보다 위(951)에 두어 같은 화면에 둘 다 있을 때 페이지용 "스킵" 버튼이 가려지지 않도록 함.

### 2.4 design-tokens.css

- **파일**: `src/shared/styles/design-tokens.css`
- **추가**: `--z-dev-skip: 950`, `--z-dev-skip-page: 951` (TS 상수와 동기화)

---

## 3. 검증 결과

### 3.1 빌드

- **명령**: `npm run build`
- **결과**: 성공

### 3.2 E2E (검차 플로우)

- **명령**: `npx playwright test tests/e2e/06-inspection-flow-complete.spec.ts --reporter=list`
- **결과**: 7 passed (8.7s)
- **테스트 목록**:
  1. 차량등록 완료 → 검차 진행하기 플로우
  2. GNB "검차" 클릭 → 목록 이동
  3. 검차신청 랜딩 (3) - Figma 1202-6390
  4. 검차 신청 목록 (4) - Figma 1202-6685
  5. 검차 진행 단계 (5, 5-1, 5-2) - Figma 1202-7440, 7752, 7902
  6. 검차내역 (6) - Figma 1202-7588
  7. 전체 플로우 통합 테스트

DEV_SKIP_PAGE(951) 적용으로 전역 플로팅(950)과 동시에 노출돼도 페이지용 스킵 버튼이 클릭 가능한 상태로 통과함.

---

## 4. 변경 파일 목록

| 파일 | 변경 내용 |
|------|-----------|
| `src/shared/config/zIndex.ts` | DEV_SKIP(950), DEV_SKIP_PAGE(951) 추가 및 주석 |
| `src/shared/ui/DevSkipFloatingButton.tsx` | Z_INDEX.DEV_SKIP 사용 |
| `src/shared/ui/DevSkipButton.tsx` | Z_INDEX.DEV_SKIP_PAGE 사용 |
| `src/shared/styles/design-tokens.css` | --z-dev-skip, --z-dev-skip-page 추가 |

---

## 5. 레이어 순서 (참고)

| 키 | 값 | 용도 |
|----|-----|------|
| … | … | (기존 BASE ~ LOADING 0~900) |
| DEV_SKIP | 950 | 개발용 스킵 전역 토글 (DevSkipFloatingButton) |
| DEV_SKIP_PAGE | 951 | 개발용 스킵 페이지 버튼 (DevSkipButton) |

---

## 6. 관련 문서

- **문맥·권장 조치**: `ReNew/Z_INDEX_AND_FRONTEND_METHODOLOGY.md`
- **FSD·의존성**: `docs/FSD_ENFORCEMENT_RULES.md`, `docs/FRONTEND_ARCHITECTURE_REVIEW.md`

---

*Z-Index 권장 조치는 모두 시행되었으며, 빌드 및 E2E 검증을 완료한 상태이다.*
