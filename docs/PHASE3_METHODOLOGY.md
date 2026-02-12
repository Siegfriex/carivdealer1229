# Phase 3 실행 방법론 (FSD 아키텍처 및 위젯 의존성 정리)

**목적**: Phase 3의 최종 완수 기준, 달성 요구사항, 개발 전략, 검사 절차, 인테그레이션 방법을 정의. 실행 시 참조하는 작업 지침서.

**기준 문서**: [CarivDealer_VID.md](CarivDealer_VID.md) §7, [carivdealer_vid_roadmap_6ec43111.plan.md](../.cursor/plans/carivdealer_vid_roadmap_6ec43111.plan.md) Phase 3

---

## §0 메타데이터

| 항목 | 내용 |
|------|------|
| **버전** | 1.0 |
| **작성일** | 2026-02-12 |
| **상태** | 검토·설계 문서화 완료. 실행 시 본 방법론 준수. |
| **Phase 3 범위** | Task A (Feature 분리), Task B (ProgressSidebar), Task C (VehicleListTableWithExpand) |

---

## §1 최종 완수 기준 및 목표

### 1.1 Phase 3 완료 정의

| 구분 | 완료 기준 | 검증 방법 |
|------|-----------|-----------|
| **Feature 분리** | `ocrRegistration`이 `features/vehicle-registration`으로 분리. `VehicleRegisterStep1Page`만 수정됨 | `grep -r "ocrRegistration" src/` → `vehicle-registration` 관련만 hit |
| **ProgressSidebar** | `ProgressStep` 인터페이스 TypeScript로 확정. 모든 사용처가 `@/widgets/ProgressSidebar`로 import | `grep -r "ProgressSidebar/ui" src/` → 0건 |
| **VehicleListTableWithExpand** | `columnDefs` prop으로 컬럼 정의 주입 가능. VehicleListPage·TradeListPage에서 POC 적용 | columnDefs 기반 렌더링 동작, fallback 유지 |
| **FSD 위반 없음** | entities → features/pages 역참조 없음 | `npx tsc --noEmit`, `npm run build` 성공 |

### 1.2 정량 목표

| 항목 | 목표 | 현재 (2026-02-12 기준) |
|------|------|------------------------|
| ProgressSidebar import 통일 | 100% `@/widgets/ProgressSidebar` | InspectionRequestLandingPage만 `@/widgets/ProgressSidebar/ui/ProgressSidebar` |
| ocrRegistration 사용처 | VehicleRegisterStep1Page 1곳 | 1곳 (분리 후에도 동일) |
| VehicleListTableWithExpand columnDefs | POC 검증 완료 | grid-cols 고정, columnDefs 미도입 |

### 1.3 범위 제외 (Phase 3 외)

- `useVehicle`, `useVehicles`: register-form 또는 entities/vehicle 유지. 이번 Phase에서 분리하지 않음.
- `getVehicleStatistics`: vehicleApi에 유지 (거래 플로우용). vehicle-registration과 별도.

---

## §2 달성 요구사항

### 2.1 Task A: Feature 분리 (ocrRegistration)

| ID | 요구사항 | 상세 |
|----|----------|------|
| A1 | 폴더 생성 | `src/features/vehicle-registration/` 생성 |
| A2 | API 분리 | `ocrRegistration`, `OcrResponse` 타입을 `vehicle-registration/api/ocrApi.ts`로 이동 |
| A3 | register-form 정리 | `vehicleApi.ts`에서 `ocrRegistration` 제거. `register-form/index.ts`에서 export 제거 |
| A4 | 사용처 수정 | `VehicleRegisterStep1Page` import를 `@/features/vehicle-registration`으로 변경 |
| A5 | 의존성 검증 | `useVehicle`, `useVehicles`는 register-form에 유지. vehicle-registration은 shared, apiClient만 참조 |

### 2.2 Task B: ProgressSidebar 표준화

| ID | 요구사항 | 상세 |
|----|----------|------|
| B1 | 인터페이스 확정 | `ProgressStep.status: 'completed' \| 'current' \| 'upcoming'` 이미 정의됨. index.ts에서 re-export 확인 |
| B2 | Import 통일 | `InspectionRequestStep1Page` → `@/widgets/ProgressSidebar` (index 통일) |
| B3 | 타입 노출 | `ProgressStep` 타입이 `@/widgets/ProgressSidebar`에서 export되는지 확인 |

### 2.3 Task C: VehicleListTableWithExpand columnDefs

| ID | 요구사항 | 상세 |
|----|----------|------|
| C1 | 인터페이스 정의 | `ColumnDef<T>` (key, label, width?, render?) |
| C2 | Props 확장 | `VehicleListTableWithExpandProps`에 `columnDefs?: ColumnDef<Vehicle>[]` 추가 |
| C3 | Fallback 유지 | `columnDefs` 없을 때 기존 grid-cols·컬럼 동작 |
| C4 | POC 적용 | VehicleListPage, TradeListPage에서 columnDefs 전달하여 동작 검증 |
| C5 | 매핑 규칙 | grid 템플릿과 columnDefs 순서·width 매핑 문서화 |

---

## §3 개발 전략

### 3.1 실행 순서 (의존성 기반)

```
Task B (ProgressSidebar)  →  Task A (ocrRegistration)  →  Task C (columnDefs)
     │                              │                            │
     └─ 영향 범위 최소               └─ register-form 1곳만       └─ 공통 위젯, POC
```

| Step | Task | 예상 소요 | 주요 파일 |
|------|------|-----------|-----------|
| 1 | B | 5분 | InspectionRequestLandingPage.tsx |
| 2 | A | 15분 | vehicle-registration/, register-form/, VehicleRegisterStep1Page.tsx |
| 3 | C | 30분 | VehicleListTableWithExpand.tsx, VehicleListPage.tsx, TradeListPage.tsx |

### 3.2 Task B: ProgressSidebar — 상세 전략

**현재 상태**:
- `InspectionRequestLandingPage.tsx` (line 12): `import { ProgressSidebar } from '@/widgets/ProgressSidebar/ui/ProgressSidebar'`
- 그 외 12개 파일: `import { ProgressSidebar } from '@/widgets/ProgressSidebar'`

**작업**:
1. `InspectionRequestLandingPage.tsx`의 import를 `@/widgets/ProgressSidebar`로 변경
2. `npm run build` && `npx tsc --noEmit` 실행

### 3.3 Task A: ocrRegistration 분리 — 상세 전략

**현재 구조**:
```
features/vehicle/register-form/
├── api/vehicleApi.ts     # ocrRegistration, getVehicleStatistics
├── model/useVehicle.ts, useVehicles.ts, useVehicleRegister.ts
└── index.ts              # export ocrRegistration, useVehicle, useVehicles
```

**목표 구조**:
```
features/vehicle-registration/
├── api/ocrApi.ts         # ocrRegistration, OcrResponse
└── index.ts              # export ocrRegistration, OcrResponse

features/vehicle/register-form/
├── api/vehicleApi.ts     # getVehicleStatistics만 (ocrRegistration 제거)
├── model/ (변경 없음)
└── index.ts              # ocrRegistration export 제거
```

**작업 단계**:
1. `mkdir -p src/features/vehicle-registration/api`
2. `vehicle-registration/api/ocrApi.ts` 생성. `vehicleApi.ts`에서 `ocrRegistration`, `OcrResponse` 복사
3. `vehicle-registration/index.ts` 생성: `export { ocrRegistration } from './api/ocrApi'; export type { OcrResponse } from './api/ocrApi';`
4. `register-form/api/vehicleApi.ts`에서 `ocrRegistration`, `OcrResponse` 제거
5. `register-form/index.ts`에서 `ocrRegistration`, `OcrResponse` export 제거
6. `VehicleRegisterStep1Page.tsx`: `import { ocrRegistration } from '@/features/vehicle-registration'`
7. `npm run build` && `npx tsc --noEmit`

### 3.4 Task C: columnDefs POC — 상세 전략

**인터페이스 (제안)**:
```ts
// widgets/VehicleTable/model/types.ts 또는 동일 경로
export interface ColumnDef<T> {
  key: string;
  label: string;
  width?: string;  // Tailwind grid 대응, 예: '1fr', '2fr'
  render?: (item: T) => React.ReactNode;
}
```

**Props 확장**:
```ts
export interface VehicleListTableWithExpandProps {
  vehicles: Vehicle[];
  onView?: (vehicle: Vehicle) => void;
  statusLabelOverride?: (vehicle: Vehicle) => string;
  columnDefs?: ColumnDef<Vehicle>[];  // 신규. 없으면 기존 고정 컬럼
}
```

**Fallback 로직**:
- `columnDefs`가 없거나 빈 배열이면 기존 `grid-cols-[28px_1fr_2fr_1fr_1fr_1.5fr_auto]` 및 고정 렌더링 사용
- `columnDefs`가 있으면 동적 grid·헤더·셀 렌더링. 기존 `onView`, `statusLabelOverride`와 병행 가능

**POC 검증**:
- VehicleListPage: 기존과 동일한 columnDefs 배열 전달 → 동일 렌더 결과 확인
- TradeListPage: 동일 또는 일부 컬럼만 다른 columnDefs 전달 → 재사용 가능 여부 확인

### 3.5 롤백 전략

| 단계 | 롤백 명령 | 비고 |
|------|-----------|------|
| Task B 실패 | `git restore src/pages/admin/inspection/InspectionRequestLandingPage.tsx` | 1파일 |
| Task A 실패 | `git restore src/features/ src/pages/admin/vehicle/VehicleRegisterStep1Page.tsx` | feature·page 복원 |
| Task C 실패 | `git restore src/widgets/VehicleTable/ src/pages/admin/VehicleListPage.tsx src/pages/admin/trade/TradeListPage.tsx` | 위젯·페이지 복원 |

각 Task 완료 후 `git add` + `git commit` 권장. 실패 시 `git restore .` 후 원인 분석.

---

## §4 검토 및 검사

### 4.1 코드 검증

| 검증 | 명령 | 통과 기준 |
|------|------|-----------|
| 빌드 | `npm run build` | exit 0, 에러 없음 |
| 타입 | `npx tsc --noEmit` | 에러 없음 (기존 미사용 변수 경고는 제외) |
| Lint | `npm run lint` 또는 IDE read_lints | 신규 에러 없음 |
| Import 일관성 | `grep -r "ProgressSidebar/ui" src/` | 0건 |
| Feature 분리 | `grep -r "ocrRegistration" src/` | `vehicle-registration` 또는 `VehicleRegisterStep1Page`만 hit |

### 4.2 기능 검증

| 페이지 | 검증 항목 |
|--------|-----------|
| VehicleRegisterStep1Page | OCR 등록 버튼 클릭 → `ocrRegistration` 호출 → 정상 응답 |
| InspectionRequestLandingPage | ProgressSidebar 표시 정상 |
| VehicleListPage | 차량 목록·확장·클릭 동작 유지 |
| TradeListPage | 거래 목록·확장·클릭 동작 유지 |

### 4.3 FSD 구조 검증

| 레이어 | 검증 |
|--------|------|
| features/vehicle-registration | shared, apiClient만 참조. pages, widgets 참조 금지 |
| features/vehicle/register-form | vehicle-registration 참조 없음 |
| widgets/VehicleTable | features/vehicle-registration 참조 없음 |

---

## §5 최종 인테그레이션

### 5.1 통합 순서

1. **Task B** 완료 → `npm run build` && `npx tsc --noEmit` → commit
2. **Task A** 완료 → 빌드·tsc → VehicleRegisterStep1Page 수동 테스트 → commit
3. **Task C** 완료 → 빌드·tsc → VehicleListPage, TradeListPage 수동 테스트 → commit

### 5.2 문서 동기화

| 문서 | 업데이트 내용 |
|------|---------------|
| [CarivDealer_VID.md](CarivDealer_VID.md) §7 | "검토 및 설계 문서화" → "실행 완료". Task A·B·C 결과 반영 |
| [FSD_IA_NODEID_SSOT.md](figma/FSD_IA_NODEID_SSOT.md) §2.4 | `features/vehicle-registration` 추가 |
| [CLAUDE.md](../CLAUDE.md) | Project Structure에 vehicle-registration 반영 (해당 시) |

### 5.3 Phase 3 완료 체크리스트

- [x] `src/features/vehicle-registration/` 폴더 존재
- [x] `ocrRegistration` import가 `@/features/vehicle-registration`만 존재
- [x] ProgressSidebar import가 모두 `@/widgets/ProgressSidebar` (ui 경로 0건)
- [x] VehicleListTableWithExpand에 `columnDefs` POC 적용
- [x] `npm run build` 성공
- [x] `npx tsc --noEmit` 성공 (기존 미사용 변수 경고 4건은 Phase 3 범위 외)
- [x] CarivDealer_VID.md §7 현행화

---

## §6 위험 요소 및 완화

| 위험 | 영향 | 완화 |
|------|------|------|
| useVehicle/useVehicles 의존성 | 9개 페이지 | Phase 3에서 분리하지 않음. register-form 유지 |
| columnDefs grid 매핑 | 기존 레이아웃 깨짐 | `columnDefs` 없을 때 fallback으로 기존 동작 100% 유지 |
| getVehicleStatistics 위치 | vehicleApi vs vehicle-registration | 거래 플로우용이므로 register-form에 유지 |
| apiClient.ocrRegistration | shared/api에 존재 가능 | vehicle-registration은 features/vehicle/register-form/api/vehicleApi의 ocrRegistration 호출. apiClient 직접 호출 여부 확인 후 필요 시 정리 |

---

## §7 참조 문서

| 문서 | 용도 |
|------|------|
| [CarivDealer_VID.md](CarivDealer_VID.md) §7 | Phase 3 검토 항목, 현재 상태 |
| [carivdealer_vid_roadmap_6ec43111.plan.md](../.cursor/plans/carivdealer_vid_roadmap_6ec43111.plan.md) | Phase 3 원본 정의 |
| [FSD_ENFORCEMENT_RULES.md](FSD_ENFORCEMENT_RULES.md) | FSD 레이어 의존성 규칙 |

---

## §8 문서 이력

| 버전 | 일자 | 비고 |
|------|------|------|
| 1.0 | 2026-02-12 | 초안. §1~§7 완성. 실행 전 참조용. |
| 1.1 | 2026-02-12 | Phase 3 실행 완료. §5.3 체크리스트 갱신. [PHASE3_COMPLETION_REPORT.md](PHASE3_COMPLETION_REPORT.md) 참조. |
