# 다음 에이전트 필수 인수인계 문서 (최종 검증본)

**검증일**: 2025-01-28  
**검증 기준**: 현 코드베이스 + FSD 규칙  
**이번 세션**: 검차 플로우 Figma 8노드 구현 완료  
**다음 권장 작업**: admin 6개 페이지 FSD 이전 또는 추가 Figma 구현

---

## 1. 시작 전 필수 확인 (체크리스트)

| 순서 | 문서 | 경로 | 용도 |
|------|------|------|------|
| 1 | **AI 에이전트 작업 가이드** | `ReNew/AGENT_GUIDE.md` | Figma 구현 프로세스, FSD 체크리스트, 1440px 가이드, 공통 컴포넌트 활용법 |
| 2 | **세션 작업 정리** | `ReNew/SESSION_SUMMARY.md` | 세션 전체 작업, 플로우/라우팅, 검증 명령어 |
| 3 | **FSD 강제 규칙** | `docs/FSD_ENFORCEMENT_RULES.md` | ESLint 설정, 레이어 의존성, Public API, 세그먼트 규칙 |
| 4 | **FSD 준수 점검** | `ReNew/FSD_COMPLIANCE_CHECK.md` | 파일별 FSD 준수 현황, 허용/금지 import 요약 |
| 5 | **Figma 디자인 스펙** | `ReNew/FIGMA_DESIGN_SPEC.md` | 화면별 스펙, 노드 ID |
| 6 | **컴포넌트 매핑** | `ReNew/COMPONENT_SUMMARY.md` | Figma→코드 매핑 |
| 7 | **타이포그래피** | `ReNew/TYPOGRAPHY_SYSTEM.md` | 1440px 기준 타입 스케일 |

**시작 전 체크리스트**:
- [ ] `ReNew/AGENT_GUIDE.md` 읽기
- [ ] `ReNew/SESSION_SUMMARY.md` 확인
- [ ] `docs/FSD_ENFORCEMENT_RULES.md` 확인
- [ ] 작업 대상 Figma 노드 확인 (MCP 또는 스크린샷)
- [ ] 관련 기존 코드 확인 (`src/pages/admin/inspection/`, `src/app/router.tsx`)
- [ ] `npm run build` 성공 확인

---

## 2. 이번 세션 수행 작업 (본 에이전트)

### 2.1 구현 완료 – 검차 플로우 (Figma 8노드)

| Figma 노드 | 화면 | 구현 파일 | 라우트 경로 | 비고 |
|------------|------|-----------|-------------|------|
| 915-998 | 차량등록 완료 (2-2) | `pages/admin/vehicle/VehicleRegistrationCompletePage.tsx` | `/vehicles/.../complete` | 검차 진행하기 버튼 추가 |
| - | GNB "검차" 추가 | `widgets/Header/ui/LandingHeader.tsx` | - | NAV_ITEMS에 검차 추가, `/inspections` |
| 1202-6390 | 검차신청 랜딩 (3) | `pages/admin/inspection/InspectionRequestLandingPage.tsx` | `/inspections/request` | 사이드바(검색+단계), 검차 신청하기 → step1 |
| 1202-6685 | 검차 신청 목록 (4) | `pages/admin/inspection/InspectionListPage.tsx` | `/inspections` | 목업데이터 4건, 상태별 행, 확장 기능 |
| 1202-7020, 7204 | 목록 확장 (4-1, 4-1-1) | `pages/admin/inspection/InspectionListPage.tsx` | `/inspections` | expandedIds, ChevronDown/Up, 다중 확장 |
| 1202-7440, 7752, 7902 | 검차 진행 (5, 5-1, 5-2) | `pages/admin/inspection/InspectionProgressPage.tsx` | `/inspections/:id/progress?stage=...` | matching/en_route/complete, DEV:SKIP/스킵 |
| 1202-7588 | 검차내역 (6) | `pages/admin/inspection/InspectionHistoryPage.tsx` | `/inspections/history` | 완료 목록, 검색, 상세 이동 |
| - | 목업데이터 | `pages/admin/inspection/mockInspectionList.ts` | - | pending/assigned/in_progress/completed 각 1건 |

**라우팅 정리**:
- `/inspections` → `INSPECTIONS_LIST` → `InspectionListPage`
- `/inspections/request` → `INSPECTION_REQUEST_LANDING` → `InspectionRequestLandingPage`
- `/inspections/request/step1` → `INSPECTION_REQUEST_STEP1` → `InspectionRequestStep1Page`
- `/inspections/request/step2` → `INSPECTION_REQUEST_STEP2` → `InspectionRequestStep2Page`
- `/inspections/:id/progress` → `INSPECTION_PROGRESS` → `InspectionProgressPage` (stage 쿼리)
- `/inspections/:id/complete` → `INSPECTION_COMPLETE` → `InspectionCompletePage`
- `/inspections/history` → `INSPECTION_HISTORY` → `InspectionHistoryPage`
- `/vehicles/.../complete` → `VEHICLE_REGISTRATION_COMPLETE` → `VehicleRegistrationCompletePage`

**플로우 연동**:
- 2-2 완료 → "검차 진행하기" → `/inspections/request` (3)
- 3 랜딩 → "검차 신청하기" → `/inspections/request/step1` → step2 → 제출 후 `/inspections` (4)
- 4 목록 → 행 클릭: `pending` → `/inspections/:id/progress?stage=matching` (5), `assigned` → `?stage=en_route` (5-1), `in_progress` → `?stage=complete` (5-2), `completed` → `/inspections/history` (6)
- 5 → DEV:SKIP → 5-1 → 스킵 → 5-2 → "검차내역 보기" → 6

### 2.2 현 코드베이스 검증 결과

| 항목 | 검증 결과 |
|------|-----------|
| 검차 inspection 페이지 | 7개 파일 존재 (List, RequestLanding, RequestStep1/2, Progress, Complete, History) |
| 차량 vehicle 페이지 | VehicleRegistrationCompletePage 수정 (검차 진행하기 추가) |
| GNB 헤더 | LandingHeader에 검차 추가 (NAV_ITEMS, NavKey 'inspections') |
| `@/components` 참조 | **검차 플로우 파일 0건** (FSD 준수) |
| `@/config`, `@/services`, `@/utils` | 참조 0건 |
| 빌드 | `npm run build` 성공 |
| FSD (검차) | Import `@/shared/ui/*`, `@/widgets/*/ui/*`, `@/entities/*/ui/*`만 사용 |

**현재 `@/components` 참조 중인 파일 (6개, 검차 플로우 제외)**:
```
src/pages/admin/SettlementListPage.tsx
src/pages/admin/SettlementDetailPage.tsx
src/pages/admin/SalesHistoryPage.tsx
src/pages/admin/LogisticsHistoryPage.tsx
src/pages/admin/LogisticsSchedulePage.tsx
src/pages/admin/GeneralSaleOffersPage.tsx
```

### 2.3 공통 컴포넌트 및 버튼 규칙 준수 확인

| 컴포넌트 | 사용 위치 | 규칙 준수 | 비고 |
|----------|----------|----------|------|
| `Button` | InspectionListPage, InspectionRequestLandingPage, InspectionProgressPage, VehicleRegistrationCompletePage | ✅ | variant (primary/secondary), size (sm/md/lg), fullWidth 올바르게 사용 |
| `Card` | InspectionProgressPage, VehicleRegistrationCompletePage | ✅ | padding (sm/md/lg), hover 올바르게 사용 |
| `LandingHeader` | 모든 검차 페이지 | ✅ | activeNav='inspections' 올바르게 설정 |
| `InspectionStatusBadge` | InspectionListPage | ✅ | entities/inspection/ui에서 import |
| `ProgressSidebar` | InspectionProgressPage | ✅ | widgets/ProgressSidebar/ui에서 import |

**FSD 규칙 준수**:
- ✅ `@/components`, `@/config`, `@/services`, `@/utils` 미참조
- ✅ `@/shared/ui/*` (Button, Card) 사용
- ✅ `@/widgets/*/ui/*` (LandingHeader, ProgressSidebar) 사용
- ✅ `@/entities/*/ui/*` (InspectionStatusBadge) 사용
- ✅ 레이어 의존성 준수 (pages → widgets/entities/shared)

### 2.4 FSD 위반 요약

| 규칙 | 위반 여부 | 비고 |
|------|----------|------|
| `@/components` 참조 금지 (검차 플로우) | ✅ **0건** | 검차 플로우 파일 모두 준수 |
| `@/components` 참조 금지 (전체) | ⚠️ **6개** (admin만, 검차 제외) | 위 목록 |
| `@/config` / `@/services` / `@/utils` | ✅ 준수 | 0건 |
| app/shared/entities/widgets 레이어 | ✅ 준수 | 올바른 경로 사용 |
| Public API (entities) | ⚠️ 선택적 | 내부 경로 직접 참조 다수 (강제 아님) |

---

## 3. 잠재 요인 (리스크·기회)

### 3.1 리스크

| 리스크 | 설명 | 권장 조치 |
|--------|------|----------|
| **npm run lint** | ESLint 9 사용 시 `eslint.config.js` 없음으로 실패 가능. 6개 admin 파일은 `@/components` 참조로 FSD 위반. | 새 코드는 `@/components` 미사용. admin 6개 FSD 이전 시 lint 구간 해소. |
| **admin 6개 페이지** | 레거시 `@/components` 래핑 상태. | FSD 구조로 완전 이전 시 위반 해소. |

### 3.2 기회

| 기회 | 설명 |
|------|------|
| **검차 플로우** | 8개 노드 일괄 구현 완료. 동일 패턴(사이드바, 목록 확장, 프로그래스, 상태별 라우팅) 재사용 가능. |
| **공통 컴포넌트** | Button, Card, LandingHeader, ProgressSidebar, InspectionStatusBadge 활용. |
| **1440px·토큰** | design-tokens.css, TYPOGRAPHY_SYSTEM.md 기준 유지. |
| **FSD 준수** | 검차 플로우 파일 모두 FSD 규칙 준수, 레거시 폴더 미참조. |

---

## 4. 구현 시 준수 사항 (요약)

- **FSD**: `pages/[domain]/`, `shared/ui/`, `entities/*/ui/`, `widgets/*/ui/` 등 준수. `@/components`, `@/config`, `@/services`, `@/utils` 사용 금지.
- **1440px**: design-tokens.css, TYPOGRAPHY_SYSTEM.md 기준.
- **재사용**: `shared/ui/*`, `entities/*/ui/*`, `widgets/*/ui/*` 우선.
- **공통 컴포넌트**: Button (variant, size, fullWidth), Card (padding, hover) 올바르게 사용.
- **검증**: 구현 후 `npm run build`, `read_lints` 실행.

---

## 5. 다음 에이전트 권장 작업

1. **admin 6개 페이지 FSD 이전**  
   위 6개 파일에서 `@/components` 제거 후 widgets/entities/shared 조합으로 전환.
2. **추가 Figma 구현**  
   신규 화면은 AGENT_GUIDE.md 프로세스·체크리스트 따르고, FSD·1440px 준수.
3. **ESLint 설정**  
   필요 시 `eslint.config.js` 마이그레이션으로 `npm run lint` 동작 복구.

**체크리스트 (신규 Figma 구현 시)**:
- [ ] AGENT_GUIDE.md, FSD_ENFORCEMENT_RULES.md 확인
- [ ] Figma 노드 확인 (MCP/스크린샷)
- [ ] FSD 구조·import 준수 (레거시 폴더 미참조)
- [ ] 공통 컴포넌트 올바르게 사용 (Button variant/size, Card padding 등)
- [ ] `npm run build` 및 `read_lints` 실행
- [ ] ReNew 문서 업데이트 (SESSION_SUMMARY 등)

---

## 6. 참고 문서 경로

| 문서 | 경로 |
|------|------|
| 에이전트 가이드 | `ReNew/AGENT_GUIDE.md` |
| 세션 작업 정리 | `ReNew/SESSION_SUMMARY.md` |
| FSD 강제 규칙 | `docs/FSD_ENFORCEMENT_RULES.md` |
| FSD 준수 점검 | `ReNew/FSD_COMPLIANCE_CHECK.md` |
| Figma 디자인 스펙 | `ReNew/FIGMA_DESIGN_SPEC.md` |
| 컴포넌트 매핑 | `ReNew/COMPONENT_SUMMARY.md` |
| 타이포그래피 | `ReNew/TYPOGRAPHY_SYSTEM.md` |
| 인수인계(백엔드 에이전트) | `ReNew/AGENT_HANDOFF_DOCUMENT.md` |
| FSD 감사(위반 상세) | `ReNew/FSD_COMPLIANCE_AUDIT.md` |
| **본 문서 (최종 검증 인수인계)** | `ReNew/NEXT_AGENT_HANDOFF_FINAL.md` |

---

*이 문서는 현 코드베이스 기준으로 본 에이전트의 수행 작업을 반영하고, 다음 에이전트용 필수 문서를 정리한 최종 인수인계 문서입니다.*
