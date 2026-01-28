# 다음 에이전트 필수 인수인계 문서 (최종 검증본)

**검증일**: 2025-01-28  
**검증 기준**: 현 코드베이스 + FSD 규칙  
**다음 작업**: Figma 1194-5866 구현

---

## 1. 시작 전 필수 확인 (체크리스트)

| 순서 | 문서 | 경로 | 용도 |
|------|------|------|------|
| 1 | **AI 에이전트 작업 가이드** | `ReNew/AGENT_GUIDE.md` | Figma 구현 프로세스, FSD 체크리스트, 1440px 가이드, 공통 컴포넌트 활용법 |
| 2 | **세션 작업 정리** | `ReNew/SESSION_SUMMARY.md` | 이번 세션 전체 작업, 플로우/라우팅, 검증 명령어 |
| 3 | **FSD 강제 규칙** | `docs/FSD_ENFORCEMENT_RULES.md` | ESLint 설정, 레이어 의존성, Public API, 세그먼트 규칙 |
| 4 | **FSD 준수 점검** | `ReNew/FSD_COMPLIANCE_CHECK.md` | 추가된 파일별 FSD 준수 현황, 허용/금지 import 요약 |
| 5 | **Figma 디자인 스펙** | `ReNew/FIGMA_DESIGN_SPEC.md` | 화면별 스펙, 노드 ID |
| 6 | **컴포넌트 매핑** | `ReNew/COMPONENT_SUMMARY.md` | Figma→코드 매핑 |
| 7 | **타이포그래피** | `ReNew/TYPOGRAPHY_SYSTEM.md` | 1440px 기준 타입 스케일 |

**시작 전 체크리스트**:
- [ ] `ReNew/AGENT_GUIDE.md` 읽기
- [ ] `ReNew/SESSION_SUMMARY.md` 확인
- [ ] `docs/FSD_ENFORCEMENT_RULES.md` 확인
- [ ] Figma 1194-5866 디자인 가져오기 (MCP 또는 스크린샷)
- [ ] 관련 기존 코드 확인 (`pages/auth/SignupStep2Page.tsx` 등)
- [ ] `npm run build` 성공 확인

---

## 2. 작업 경과 보고 (현 코드베이스 기준 검증)

### 2.1 에이전트 보고 vs 실제 상태

| 항목 | 에이전트 보고 | 실제 검증 결과 | 판정 |
|------|--------------|----------------|------|
| config/services/utils 폴더 삭제 | ✅ 삭제됨 | ✅ 삭제됨 (폴더 없음) | **일치** |
| Entity index.ts 12개 | ✅ 모두 생성 | ✅ 12개 존재 (vehicle, auction, inspection 등) | **일치** |
| shared/api | apiClient, mockData | ✅ apiClient.ts, mockData.ts, queryClient.ts 존재 | **일치** |
| @/components 참조 | 7개 파일 | **6개 파일** (VehicleListPage는 이미 FSD 이전 완료) | **부분 수정** |
| ToastProvider | 문서에 미언급 | ✅ `@/shared/ui/Toast` 사용 (레거시 아님) | **준수** |
| ESLint FSD 규칙 | 문서에 “lint 통과” | ✅ `.eslintrc.json`에 no-restricted-imports 및 레이어 overrides 적용됨 | **적용됨** |

### 2.2 FSD 위반 여부 명확 판단

| 규칙 | 위반 여부 | 위반 파일 수 | 비고 |
|------|----------|-------------|------|
| `@/components` 참조 금지 | **⚠️ 위반** | **6개** | 아래 목록 참고 |
| `@/config` 참조 금지 | ✅ 준수 | 0 | 폴더 삭제됨 |
| `@/services` 참조 금지 | ✅ 준수 | 0 | 폴더 삭제됨 |
| `@/utils` 참조 금지 | ✅ 준수 | 0 | 폴더 삭제됨 |
| app 레이어에서 레거시 참조 | ✅ 준수 | 0 | ToastProvider는 shared/ui 사용 |
| 레이어 의존성 (shared→상위 등) | ✅ 준수 | 0 | ESLint로 강제 중 |
| Public API 사용 (entities) | ⚠️ 선택적 미준수 | 다수 | 내부 경로 직접 참조 많음 (강제 아님) |

**현재 `@/components` 참조 중인 파일 (6개)**:
```
src/pages/admin/SettlementListPage.tsx
src/pages/admin/SettlementDetailPage.tsx
src/pages/admin/SalesHistoryPage.tsx
src/pages/admin/LogisticsHistoryPage.tsx
src/pages/admin/LogisticsSchedulePage.tsx
src/pages/admin/GeneralSaleOffersPage.tsx
```

**참고**: `VehicleListPage.tsx`는 FSD 구조로 이미 이전됨 (widgets/entities/features/shared만 사용). `ToastProvider.tsx`는 `@/shared/ui/Toast` 사용.

### 2.3 작업 경과 요약

- **완료된 작업**: Phase 1(아카이브), Phase 2.1(설정 통합), Phase 2.2(API/유틸 통합), Phase 2.3(Entity index 12개), Phase 3(DB 스키마), Figma 6개 노드 구현, 타이포/디자인 토큰, ESLint FSD 규칙 적용, ToastProvider FSD 경로 전환, VehicleListPage FSD 이전.
- **미완료**: Phase 2.4–2.5 — 위 6개 페이지가 여전히 레거시 `@/components` 래핑 상태. 해당 페이지들을 FSD 구조로 완전 이전하면 `@/components` 위반이 해소됨.
- **선택 사항**: Public API(entities/features/widgets index.ts) 통일 후 내부 경로 참조를 Public API로 전환.

---

## 3. 이대로 진행 시 잠재 요인 (리스크·기회)

### 3.1 잠재 리스크

| 리스크 | 설명 | 영향도 | 권장 조치 |
|--------|------|--------|----------|
| **npm run lint 실패** | 위 6개 파일이 `@/components` 참조로 ESLint 에러 발생. 새 작업 시 `npm run lint` 실행하면 실패 가능. | 높음 | 6개 페이지에 대해 FSD 이전 또는 해당 파일만 임시 `eslint-disable-next-line` 후 진행. 새로 추가하는 코드에는 `@/components` 사용 금지. |
| **문서와 파일 수 불일치** | AGENT_HANDOFF_DOCUMENT.md에는 “7개 파일”로 기재되어 있으나 실제는 6개 (VehicleListPage 제외). | 낮음 | 다음 에이전트가 이 문서(NEXT_AGENT_HANDOFF_FINAL.md) 기준으로 판단. 필요 시 AGENT_HANDOFF_DOCUMENT.md를 “6개”로 정정. |
| **Figma 1194-5866 미구현** | 다음 작업 대상 화면. 구현 전 반드시 MCP/스크린샷으로 디자인 확인. | - | AGENT_GUIDE.md 프로세스대로 Figma 노드 확인 후 구현. |
| **Public API 미사용** | entities는 index.ts 있으나 여전히 `@/entities/vehicle/ui/VehicleCard` 등 내부 경로 참조 다수. FSD 원칙상은 슬라이스 루트만 참조 권장. | 중간 | 당장 필수는 아님. 점진적으로 `@/entities/vehicle` 형태로 전환 권장. |

### 3.2 기회 요인

| 기회 | 설명 |
|------|------|
| **공통 컴포넌트** | SegmentedControl, MessageModal, PillChip, DateRangePicker, Typography, LoginModal 등 ReNew에서 추가된 shared/ui 활용 가능. |
| **1440px·토큰 정립** | design-tokens.css, TYPOGRAPHY_SYSTEM.md로 1440px 기준 일관 적용 가능. |
| **ESLint로 FSD 강제** | 레거시 폴더 참조 및 레이어 역참조는 ESLint로 차단됨. 새 코드는 규칙 준수 시 빌드/린트 통과. |
| **플로우·라우팅 정리** | SESSION_SUMMARY.md에 랜딩/회원가입/메인 랜딩 플로우 정리됨. |

---

## 4. 구현 시 준수 사항 (요약)

- **FSD 구조**: 파일 배치는 `pages/[domain]/`, `widgets/[Name]/ui/`, `shared/ui/`, `entities/[entity]/ui/` 등 FSD 규칙 준수. Import는 `@/components`, `@/config`, `@/services`, `@/utils` 사용 금지.
- **1440px 기준**: 레이아웃·타이포·간격은 1440px 기준 (design-tokens.css, TYPOGRAPHY_SYSTEM.md).
- **기존 컴포넌트 재사용**: `shared/ui/*`, `entities/*/ui/*`, `widgets/*/ui/*` 우선 사용.
- **검증**: 구현 후 `npm run build` 및 `read_lints` 실행. FSD 위반 시 ESLint 에러로 확인 가능.

---

## 5. 다음 작업 (Figma 1194-5866) 체크리스트

### 시작 전
- [ ] `ReNew/AGENT_GUIDE.md` 읽기
- [ ] `ReNew/SESSION_SUMMARY.md` 확인
- [ ] `docs/FSD_ENFORCEMENT_RULES.md` 확인
- [ ] Figma 1194-5866 디자인 가져오기 (MCP 또는 스크린샷)
- [ ] 관련 기존 코드 확인 (예: SignupStep2Page, 라우팅)
- [ ] `npm run build` 성공 여부 확인 (현재 6개 파일 때문에 `npm run lint`는 실패할 수 있음 — 새로 만드는 파일만 FSD 준수하면 됨)

### 구현 중
- [ ] FSD 구조 및 import 경로 준수 (레거시 폴더 미참조)
- [ ] 1440px 기준 준수
- [ ] 기존 shared/ui, entities/ui 활용
- [ ] 디자인 토큰 활용

### 구현 후
- [ ] `read_lints` 실행
- [ ] `npm run build` 실행
- [ ] FSD 규칙 위반 여부 확인 (새 파일만 검사 가능)
- [ ] ReNew 문서 업데이트 (SESSION_SUMMARY 등)

---

## 6. 최종 인사이트

1. **FSD 위반은 “6개 페이지의 `@/components` 참조”로 한정됨.**  
   나머지(app, shared, entities, widgets, 나머지 pages)는 레거시 폴더 미참조·레이어 의존성 준수·ToastProvider/shared 경로 사용이 확인됨.

2. **이대로 Figma 1194-5866만 구현하는 것은 가능.**  
   새 페이지/위젯/공통 UI는 FSD와 1440px 가이드만 지키면 됨. 기존 6개 래핑 페이지를 건드리지 않으면 해당 6개로 인한 lint 에러는 그대로일 수 있음.

3. **장기적으로는 위 6개 페이지를 FSD로 완전 이전하는 것이 필요.**  
   그때 `@/components` 참조가 사라지고 `npm run lint` 전 구간 통과 가능.

4. **다음 에이전트는 “ReNew/AGENT_GUIDE.md + SESSION_SUMMARY + FSD_ENFORCEMENT_RULES + 본 문서”를 필수로 읽고, Figma 1194-5866 구현 시 위 체크리스트와 준수 사항을 따르면 됨.**

---

## 7. 참고 문서 경로 정리

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

*이 문서는 현 코드베이스와 FSD 규칙을 기준으로 작업 경과를 검증하고, 잠재 요인과 다음 에이전트용 필수 문서를 정리한 최종 인수인계 문서입니다.*
