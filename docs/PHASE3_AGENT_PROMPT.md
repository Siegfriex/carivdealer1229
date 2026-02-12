# Phase 3 실행용 에이전트 프롬프트

**용도**: 새 Cursor Agent 세션에서 Phase 3를 실행할 때 아래 프롬프트 전체를 복사·붙여넣기. `@docs/PHASE3_METHODOLOGY.md`를 반드시 첨부한다.

---

## 프롬프트 (복사용)

```
# Phase 3 실행 지시

## 1. 참조 문서 (필수)

**최우선 참조**: @docs/PHASE3_METHODOLOGY.md
- 이 파일을 반드시 첨부하고, 실행 전·중에 계속 참조하라.
- 모든 작업은 방법론의 §3 개발 전략·§4 검토 및 검사·§5 최종 인테그레이션을 따른다.

## 2. Role & Objective

- **Role**: CarivDealer 프로젝트 FSD 아키텍처 리팩토링 실행자
- **Objective**: Phase 3 (Task A·B·C)를 방법론대로 완수. 코드베이스 확인 후 워크플로우 순서대로 진행.

## 3. 사전 점검 (작업 전 필수)

다음을 실행하여 실제 코드베이스 상태를 확인한다:

1. **ProgressSidebar import**: `grep -r "ProgressSidebar" src/ --include="*.tsx"` — 현재 어떤 파일이 `@/widgets/ProgressSidebar/ui/ProgressSidebar`를 사용하는지 확인
2. **ocrRegistration 사용처**: `grep -r "ocrRegistration" src/` — VehicleRegisterStep1Page 1곳만 사용하는지 확인
3. **register-form 구조**: `list_dir src/features/vehicle/register-form/` — vehicleApi.ts, index.ts 내용 확인
4. **VehicleListTableWithExpand**: `read_file src/widgets/VehicleTable/ui/VehicleListTableWithExpand.tsx` — 현재 Props, grid-cols 구조 확인

점검 결과가 PHASE3_METHODOLOGY.md §3.2~§3.4의 "현재 상태"와 다르면, 실제 코드 기준으로 작업한다.

## 4. 실행 순서 (엄수)

| Step | Task | 작업 | 검증 |
|------|------|------|------|
| 1 | **B** | InspectionRequestLandingPage.tsx의 ProgressSidebar import를 `@/widgets/ProgressSidebar`로 변경 | `npm run build` && `npx tsc --noEmit` |
| 2 | **A** | vehicle-registration 폴더 생성, ocrApi.ts 생성, register-form에서 ocrRegistration 제거, VehicleRegisterStep1Page import 수정 | 동일 |
| 3 | **C** | ColumnDef 인터페이스, VehicleListTableWithExpand columnDefs prop, fallback, VehicleListPage·TradeListPage POC | 동일 |

## 5. 실행 규칙 (Constraints)

1. **Task 순서**: B → A → C. 한 Task 완료·검증 후 다음 Task 진행.
2. **롤백**: 빌드 또는 tsc 실패 시 `git restore .` 후 원인 분석. 다음 Task로 진행하지 않음.
3. **범위 제외**: useVehicle, useVehicles, getVehicleStatistics는 분리하지 않음. register-form에 유지.
4. **Fallback**: Task C에서 columnDefs 없을 때 기존 grid-cols·컬럼 동작 100% 유지.

## 6. Task 완료 후 검증

각 Task 완료 시마다:

- `npm run build` (성공 여부)
- `npx tsc --noEmit` (에러 없음)
- `grep -r "ProgressSidebar/ui" src/` → Task B 후 0건
- `grep -r "ocrRegistration" src/` → Task A 후 vehicle-registration·VehicleRegisterStep1Page만

## 7. 최종 인테그레이션 (Phase 3 전체 완료 후)

1. **문서 동기화**: docs/CarivDealer_VID.md §7 "검토 및 설계 문서화" → "실행 완료"로 수정. Task A·B·C 결과 반영.
2. **FSD_IA_NODEID_SSOT**: docs/figma/FSD_IA_NODEID_SSOT.md §2.4 features에 vehicle-registration 추가.
3. **체크리스트**: PHASE3_METHODOLOGY.md §5.3 완료 체크리스트 전체 충족 확인.

## 8. 보고 형식

각 Task 완료 시:

```
### Task X 완료

- 수행: (구체적 파일·변경 내용)
- 검증: npm run build [성공/실패], npx tsc [성공/실패]
```

Phase 3 전체 완료 시:

```
### Phase 3 완료

- Task B: ProgressSidebar import 통일 완료
- Task A: ocrRegistration 분리 완료
- Task C: columnDefs POC 완료
- 문서 동기화: CarivDealer_VID §7, FSD_IA_NODEID_SSOT §2.4
```

## 9. Action

1. **즉시** docs/PHASE3_METHODOLOGY.md를 읽어라.
2. **사전 점검** 4개를 실행하여 코드베이스 상태를 확인하라.
3. **Task B**부터 순서대로 실행하라.
4. 각 Task 완료 후 위 보고 형식으로 결과를 보고하라.
5. **Phase 3 전체** 완료 후 최종 인테그레이션·문서 동기화를 수행하고 최종 보고하라.
```

---

## 사용 방법

1. 새 Cursor Agent 세션을 연다.
2. 프롬프트 입력창에 위 `---` 구간의 **프롬프트 (복사용)** 블록 전체를 붙여넣는다.
3. `@docs/PHASE3_METHODOLOGY.md`를 첨부한다.
4. 실행을 시작한다.

---

## 참조

- 방법론: [docs/PHASE3_METHODOLOGY.md](PHASE3_METHODOLOGY.md)
- VID Phase 3: [docs/CarivDealer_VID.md](CarivDealer_VID.md) §7
