# 식별 문제점 구체적 해결 태스크 플랜

**작성일**: 2025-01-28  
**목적**: DESIGN_CONSISTENCY_REPORT.md에서 식별한 불일치 해결 + **좌하단 DEV:SKIP**으로 필수 입력 스킵 장치 확보 + 스크린샷 기준 최종 검수

---

## 1. 해결 대상 (식별된 문제)

| # | 페이지 | 항목 | Figma | 구현 | 조치 |
|---|--------|------|-------|------|------|
| 1 | 차량등록 완료 | 버튼 | "홈으로 돌아가기"만 | "검차 진행하기" 추가 | **유지** (플로우용) |
| 2 | 검차 목록 | 상태 라벨 | "검차자 매칭완료" | "검차자 이동중" | **용어 통일**: assigned → "검차자 매칭완료" |
| 3 | 검차 진행 | 섹션 제목 | "검차 진행상황" | "검차 진행내역" | **문구 통일**: "검차 진행상황" |
| 4 | 검차내역 | 뷰 | 상세(카드) | 목록+상세 이동 | **추가 검토** (상세 페이지 Figma 대조는 별도) |
| — | **필수 입력 스킵** | — | — | — | **DEV:SKIP 좌하단 고정** (Step1·Step2·Progress) |

---

## 2. 태스크 플랜 (실행 순서)

### Phase A: DEV:SKIP 장치 (좌하단 고정)

| 순서 | 태스크 | 상세 | 산출물 |
|------|--------|------|--------|
| A-1 | 공통 컴포넌트 | `DevSkipButton` 또는 `DevSkipFAB`: `position: fixed; left; bottom;` 좌하단, 라벨·onClick | `src/shared/ui/DevSkipButton.tsx` |
| A-2 | Step1 적용 | 필수 입력(날짜·시간·장소) 스킵 → `/inspections/request/step2` 이동 | InspectionRequestStep1Page |
| A-3 | Step2 적용 | 평가사 선택 스킵 → `/inspections`(목록) 이동 | InspectionRequestStep2Page |
| A-4 | Progress 적용 | 기존 DEV:SKIP·스킵 버튼을 **좌하단 고정**으로 이동 (단계별 동일 라벨) | InspectionProgressPage |

### Phase B: 용어·문구 통일 (Figma SSOT)

| 순서 | 태스크 | 상세 | 파일 |
|------|--------|------|------|
| B-1 | 목록 상태 라벨 | assigned 표시: "검차자 이동중" → "검차자 매칭완료" | InspectionListPage, mockInspectionList(필요 시), InspectionStatusBadge |
| B-2 | 진행 페이지 제목 | "검차 진행내역" → "검차 진행상황" | InspectionProgressPage |

### Phase C: Step1 동작 보강

| 순서 | 태스크 | 상세 | 파일 |
|------|--------|------|------|
| C-1 | 다음 단계 이동 | `handleNext` 성공 시 `/inspections/request/step2`로 이동 | InspectionRequestStep1Page |

### Phase D: 스크린샷 기준 최종 검수

| 순서 | 태스크 | 상세 | 산출물 |
|------|--------|------|--------|
| D-1 | E2E 재실행 | `06-inspection-flow-complete.spec.ts` + 필요 시 step1/step2 스킵 시나리오 | 7 tests pass |
| D-2 | 전체 스크린샷 재촬영 | 1440×900 고정, 검차 플로우 19~29 + 30~32 | tests/screenshots/ |
| D-3 | 최종 검수 체크리스트 | DEV:SKIP 좌하단 노출·동작, 용어·제목 반영, 스크린샷 일치 | ReNew/FINAL_VERIFICATION_CHECKLIST.md |

---

## 3. DEV:SKIP 스펙 (좌하단)

- **위치**: `fixed`, `left: 1rem`(16px), `bottom: 1rem`(16px), `z-index` 상단 레이어.
- **스타일**: 작은 버튼(secondary/outline), 라벨 "DEV:SKIP" 또는 전달된 라벨.
- **용도**: 필수 입력 없이 다음 단계/목록으로 이동하는 개발·E2E용 스킵.
- **노출**: 개발 환경 또는 항상(프로덕션에서 숨기려면 `import.meta.env.DEV` 등으로 분기 가능).

---

## 4. 완료 기준

- [x] DevSkipButton(좌하단) 생성 및 Step1·Step2·Progress에 적용.
- [x] Step1: "다음" 클릭 시 step2 이동; DEV:SKIP 클릭 시 step2로 스킵.
- [x] Step2: DEV:SKIP 클릭 시 `/inspections` 이동.
- [x] Progress: DEV:SKIP·스킵 버튼이 좌하단 고정 영역에 배치 (z-[10000], 전역 DevSkipFloatingButton 위).
- [x] 검차 목록 상태 "검차자 매칭완료" 반영.
- [x] 검차 진행 제목 "검차 진행상황" 반영.
- [x] `npm run build` 성공, 검차 E2E 7 tests 통과.
- [x] 스크린샷 재촬영 및 최종 검수 체크리스트 작성 (`ReNew/FINAL_VERIFICATION_CHECKLIST.md`).
