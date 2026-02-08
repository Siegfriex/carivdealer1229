# 스크린샷 기준 최종 검수 체크리스트

**작성일**: 2025-01-28  
**기준**: TASK_PLAN_ISSUES_RESOLUTION.md 실행 완료 + 스크린샷 1440×900

---

## 1. DEV:SKIP 좌하단 장치

| # | 페이지 | 위치 | 동작 | 검수 |
|---|--------|------|------|------|
| 1 | InspectionRequestStep1Page | 좌하단 고정 | 클릭 시 `/inspections/request/step2` 이동 (필수 입력 스킵) | ✅ |
| 2 | InspectionRequestStep2Page | 좌하단 고정 | 클릭 시 `/inspections` 이동 (평가사 선택 스킵) | ✅ |
| 3 | InspectionProgressPage (matching) | 좌하단 고정 | "DEV:SKIP" → stage en_route | ✅ |
| 4 | InspectionProgressPage (en_route) | 좌하단 고정 | "스킵" → stage complete | ✅ |

- **컴포넌트**: `src/shared/ui/DevSkipButton.tsx` (fixed left-4 bottom-4, z-[10000])
- **E2E**: `getByTestId('dev-skip-area').getByRole('button', { name: 'DEV:SKIP' })` / `{ name: '스킵' }` 사용

---

## 2. 식별 문제 해결 반영

| # | 항목 | 조치 | 검수 |
|---|------|------|------|
| 1 | 차량등록 완료 버튼 | "검차 진행하기" 유지 | ✅ (유지) |
| 2 | 검차 목록 상태 라벨 | assigned → "검차자 매칭완료" (InspectionListPage, entities/inspection/model/constants.ts) | ✅ |
| 3 | 검차 진행 제목 | "검차 진행내역" → "검차 진행상황" (InspectionProgressPage 3곳) | ✅ |
| 4 | 검차내역 상세 뷰 | 별도 검토로 유지 | — |

---

## 3. 스크린샷·E2E 검수

| # | 항목 | 결과 |
|---|------|------|
| 1 | `npm run build` | ✅ 성공 |
| 2 | `npx playwright test tests/e2e/06-inspection-flow-complete.spec.ts` | ✅ 7 passed |
| 3 | 검차 플로우 스크린샷 (19~29) | 1440×900 재촬영 완료 |
| 4 | 제목 "검차 진행상황" 노출 | E2E에서 검증 |
| 5 | DEV:SKIP/스킵 좌하단 클릭 동작 | E2E에서 검증 |

---

## 4. 스크린샷 파일 목록 (검차 플로우)

- `19-vehicle-complete-to-inspection.png`
- `20-gnb-inspection-to-list.png`
- `21-inspection-request-landing.png`
- `22-inspection-list-initial.png`
- `23-inspection-list-expanded-single.png`
- `24-inspection-list-expanded-multiple.png`
- `25-inspection-progress-matching.png`
- `26-inspection-progress-en-route.png`
- `27-inspection-progress-complete.png`
- `28-inspection-history.png`
- `29-inspection-full-flow.png`

---

## 5. 완료 기준 요약

- [x] DevSkipButton(좌하단) 생성 및 Step1·Step2·Progress 적용
- [x] Step1: 다음 → step2 이동, DEV:SKIP → step2 스킵
- [x] Step2: DEV:SKIP → `/inspections` 이동
- [x] Progress: DEV:SKIP·스킵 좌하단 고정 (z-[10000])
- [x] 검차 목록 "검차자 매칭완료" 반영
- [x] 검차 진행 "검차 진행상황" 반영
- [x] 빌드 성공, 검차 E2E 7 tests 통과
- [x] 스크린샷 재촬영 및 최종 검수 체크리스트 작성
