# 다음 에이전트 필수 인수인계 문서 (최종 검증본)

**검증일**: 2026-01-30
**검증 기준**: 현 코드베이스 + FSD 규칙
**이번 세션**: Admin 레이아웃 통일 (27개 페이지 1440px 래퍼 + MAIN_LIST/MAIN_DETAIL) 완료
**다음 권장 작업**: (선택) design-tokens 1단계 적용 — [ADMIN_LAYOUT_ISSUES.md](./ADMIN_LAYOUT_ISSUES.md) §9

---

## 1. 시작 전 필수 확인 (체크리스트)

| 순서 | 문서 | 경로 | 용도 |
|------|------|------|------|
| 1 | **AI 에이전트 작업 가이드** | `ReNew/AGENT_GUIDE.md` | Figma 구현 프로세스, FSD 체크리스트, 1440px 가이드, 공통 컴포넌트 활용법 |
| 2 | **세션 작업 정리** | `ReNew/SESSION_SUMMARY.md` | 세션 전체 작업, 플로우/라우팅, 검증 명령어 |
| 3 | **FSD 강제 규칙** | `docs/FSD_ENFORCEMENT_RULES.md` | ESLint 설정, 레이어 의존성, Public API, 세그먼트 규칙 |
| 4 | **FSD 준수 점검** | `ReNew/FSD_COMPLIANCE_CHECK.md` | 파일별 FSD 준수 현황, 허용/금지 import 요약 |
| 5 | **Admin 레이아웃 이슈** | `ReNew/ADMIN_LAYOUT_ISSUES.md` | Admin 1440px/레이아웃/design-tokens 혼재 및 다음 작업 |
| 6 | **Figma 디자인 스펙** | `ReNew/FIGMA_DESIGN_SPEC.md` | 화면별 스펙, 노드 ID |
| 7 | **컴포넌트 매핑** | `ReNew/COMPONENT_SUMMARY.md` | Figma→코드 매핑 |
| 8 | **타이포그래피** | `ReNew/TYPOGRAPHY_SYSTEM.md` | 1440px 기준 타입 스케일 |

**시작 전 체크리스트**:
- [ ] `ReNew/AGENT_GUIDE.md` 읽기
- [ ] `ReNew/SESSION_SUMMARY.md` 확인
- [ ] `docs/FSD_ENFORCEMENT_RULES.md` 확인
- [ ] 작업 대상 Figma 노드 확인 (MCP 또는 스크린샷)
- [ ] 관련 기존 코드 확인 (`src/pages/admin/inspection/`, `src/app/router.tsx`)
- [ ] `npm run build` 성공 확인

---

## 2. 완료된 작업 요약

### 2.1 Admin GNB 통일 (이번 세션 완료)

| 작업 | 상태 |
|------|------|
| 커스텀 `<header>` → LandingHeader | ✅ **5개 페이지** 완료 |
| Admin 전체 GNB | ✅ **LandingHeader만 사용** (혼재 박멸) |

**LandingHeader로 교체한 페이지**:
- `LogisticsHistoryPage.tsx` (activeNav="logistics")
- `GeneralSaleOffersPage.tsx` (activeNav="offers")
- `SalesHistoryPage.tsx` (activeNav="offers")
- `SettlementListPage.tsx` (activeNav="settlements")
- `SettlementDetailPage.tsx` (activeNav="settlements", 다운로드/인쇄는 본문 툴바로 이동)

### 2.2 Phase 2.4-2.5 레거시 페이지 마이그레이션 (이전 세션 완료)

| 작업 | 상태 |
|------|------|
| 6개 admin 페이지 인라인 병합 | ✅ 완료 |
| `src/components/` 폴더 삭제 | ✅ 완료 |
| `@/components` 참조 제거 | ✅ **0건** |
| alert() → Toast 교체 | ✅ 8건 |
| console.error 제거 | ✅ |

### 2.3 TypeScript 오류 수정 (이전 세션)

| 오류 | 수정 내용 |
|------|----------|
| `@/shared/api/client` 모듈 없음 | `client.ts` 생성 (apiClient re-export) |
| `API_ENDPOINTS.BID` 경로 오류 | → `API_ENDPOINTS.AUCTION.BID` |
| `API_ENDPOINTS.BUY_NOW` 경로 오류 | → `API_ENDPOINTS.AUCTION.BUY_NOW` |
| `API_ENDPOINTS.INSPECTION_REQUEST` 경로 오류 | → `API_ENDPOINTS.VEHICLE.INSPECTION_REQUEST` |
| Firebase `app` 변수 할당 전 사용 | definite assignment assertion 적용 |

### 2.4 검차 플로우 (이전 세션 완료)

| Figma 노드 | 화면 | 구현 파일 | 라우트 경로 |
|------------|------|-----------|-------------|
| 915-998 | 차량등록 완료 (2-2) | `pages/admin/vehicle/VehicleRegistrationCompletePage.tsx` | `/vehicles/.../complete` |
| 1202-6390 | 검차신청 랜딩 (3) | `pages/admin/inspection/InspectionRequestLandingPage.tsx` | `/inspections/request` |
| 1202-6685 | 검차 신청 목록 (4) | `pages/admin/inspection/InspectionListPage.tsx` | `/inspections` |
| 1202-7020, 7204 | 목록 확장 (4-1, 4-1-1) | `pages/admin/inspection/InspectionListPage.tsx` | `/inspections` |
| 1202-7440, 7752, 7902 | 검차 진행 (5, 5-1, 5-2) | `pages/admin/inspection/InspectionProgressPage.tsx` | `/inspections/:id/progress` |
| 1202-7588 | 검차내역 (6) | `pages/admin/inspection/InspectionHistoryPage.tsx` | `/inspections/history` |

---

## 3. 현재 코드베이스 검증 결과

| 항목 | 검증 결과 |
|------|-----------|
| `@/components` 참조 | ✅ **0건** (완전 제거) |
| `@/config` 참조 | ✅ **0건** |
| `@/services` 참조 | ✅ **0건** |
| `@/utils` 참조 | ✅ **0건** |
| `src/components/` 폴더 | ✅ **삭제됨** |
| TypeScript 검사 | ✅ `npx tsc --noEmit` 성공 |
| 빌드 | ✅ `npm run build` 성공 (1850 modules, 3.91s) |
| Dev 서버 | ✅ `http://localhost:3000` 실행 중 |

---

## 4. FSD 규칙 준수 현황

| 규칙 | 상태 | 비고 |
|------|------|------|
| `@/components` 참조 금지 | ✅ **완료** | 0건 |
| `@/config`, `@/services`, `@/utils` 참조 금지 | ✅ **완료** | 0건 |
| app/shared/entities/widgets 레이어 | ✅ 준수 | 올바른 경로 사용 |
| Public API (entities) | ⚠️ 선택적 | 내부 경로 직접 참조 다수 (강제 아님) |

---

## 5. 잠재 요인 (리스크/기회)

### 5.1 리스크

| 리스크 | 설명 | 권장 조치 |
|--------|------|----------|
| **npm run lint** | ESLint 9 사용 시 `eslint.config.js` 없음으로 실패 가능 | ESLint v9 flat config 마이그레이션 |
| **Firebase 취약점** | undici 관련 10개 moderate 취약점 | `npm audit fix` 검토 |
| **`any` 타입** | 15개 인스턴스 남아있음 | 점진적 타입 강화 |

### 5.2 기회

| 기회 | 설명 |
|------|------|
| **검차 플로우** | 8개 노드 일괄 구현 완료. 동일 패턴 재사용 가능. |
| **공통 컴포넌트** | Button, Card, LandingHeader, ProgressSidebar, InspectionStatusBadge 활용. |
| **FSD 준수** | 모든 레거시 폴더 참조 제거 완료. 클린 아키텍처. |

---

## 6. 다음 에이전트 권장 작업

1. **(선택) design-tokens 1단계**
   - [ADMIN_LAYOUT_ISSUES.md](./ADMIN_LAYOUT_ISSUES.md) §9 참고
   - Admin 레이아웃 통일은 완료(옵션 B, 27개 페이지 LAYOUT_CLASSES 적용)

2. **추가 Figma 구현**
   - AGENT_GUIDE.md 프로세스 따르기
   - FSD, 1440px 준수

3. **ESLint v9 마이그레이션** (선택)
   - `eslint.config.js` flat config 생성
   - `npm run lint` 동작 복구

4. **코드 품질 개선** (선택)
   - `any` 타입 정리 (15개)
   - Firebase 취약점 수정

**체크리스트 (신규 Figma 구현 시)**:
- [ ] AGENT_GUIDE.md, FSD_ENFORCEMENT_RULES.md 확인
- [ ] Figma 노드 확인 (MCP/스크린샷)
- [ ] FSD 구조/import 준수 (레거시 폴더 미참조)
- [ ] 공통 컴포넌트 올바르게 사용 (Button variant/size, Card padding 등)
- [ ] `npm run build` 및 TypeScript 검사 실행
- [ ] ReNew 문서 업데이트 (SESSION_SUMMARY 등)

---

## 7. 참고 문서 경로

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
| **Admin 레이아웃 이슈** | `ReNew/ADMIN_LAYOUT_ISSUES.md` |

---

*마지막 업데이트: 2026-01-30 | Admin 레이아웃 통일(1440px 래퍼 27개) 완료*
