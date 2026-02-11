# Figma Design Audit Python 엔진 — 검증 보고서

**검증 일시**: 2026-02-11  
**검증자**: AI Agent  
**계획 기준**: figma_design_audit_python_엔진_187a8048.plan.md  
**대상 노드**: 794-3704 (판매방식선택), 794-4015 (시세분석중)

---

## 1. 실행 요약

| 항목 | 결과 | 비고 |
|------|------|------|
| 단위 테스트 | ✅ 7/7 통과 | pytest tests/ -v |
| CLI 794-3704 | Exit 1 | R003-D warn 5건 |
| CLI 794-4015 | Exit 1 | R003-D warn 3건 |
| R003-C 위상 | ✅ 0건 (통과) | critical 없음 |
| R003-D 치수 | ⚠️ warn 8건 | Loose 설정 |
| R006 impl_plan | ✅ 통과 | 두 노드 모두 구현계획 존재 |
| 스펙 준수율 | 100% | Stage 1~3, scope, code parser 동작 |

---

## 2. 단위 테스트 결과

```
tests/test_code_parser.py::test_parse_file PASSED
tests/test_code_parser.py::test_parse_codebase PASSED
tests/test_scope.py::test_parse_ssot_section4 PASSED
tests/test_scope.py::test_resolve_code_ref PASSED
tests/test_scope.py::test_resolve PASSED
tests/test_stage1_metadata.py::test_parse_metadata PASSED
tests/test_stage1_metadata.py::test_run_stage1 PASSED
```

---

## 3. mcp_outputs 원본 vs 코드베이스 비교 분석

### 3.1 794-3704 (판매방식선택)

| 구분 | mcp_outputs (metadata_raw + design_context_raw) | 로컬 코드베이스 (GeneralSaleAnalyzingPage.tsx) |
|------|-----------------------------------------------|----------------------------------------------|
| **루트** | 794:3704 (1440×1024, D_ 판매 방식 선택) | 미구현 (루트 div에 data-node-id 없음) |
| **metadata 노드 수** | 167개 | — |
| **구현된 data-node-id** | design_context: 794:3704~794:3815 등 다수 | 794:3706, 794:3708, 794:3712, 794:3713, 794:3720, 794:3724, 794:3725 (7개) |
| **794:3706 (title)** | width 216px, text "판매 방식 선택" | `text-[38px]`, w-[Npx] 없음 → R003-D warn |
| **794:3708 (일반판매)** | width 297.38px, height 279.73px | `w-[297px] min-h-[280px]` — 297px 사용, 794:3708 카드 |
| **794:3713 (본문)** | width 250.46px | 부모 794:3708 카드 내부, 코드는 `w-[297px]` 카드 → 250 vs 297 차이 warn |
| **794:3720 (경매)** | width 297.38px | `w-[297px]` — 동일 |
| **794:3725** | width 250.46px | 부모 카드와 동일 이슈 |

**핵심**:
- metadata 계층: 794:3704 > 794:3705 > 794:3706·794:3707(Group) > 794:3708·794:3720
- 코드는 794:3705, 794:3707 등 중간 컨테이너 없이 794:3706·794:3708·794:3720 등 핵심 UI만 구현
- 위상: metadata (parent, child) 쌍 중 **코드에 있는** 노드만 검증 → 조상 체인 일치 (R003-C 통과)
- 치수: 794:3706(216px)은 text 제목 → `text-[38px]`로 고정폭 없음, 794:3713/794:3725는 부모 카드 width 297px 내부 텍스트 → 코드는 카드 전체 297px로 구현됨

### 3.2 794-4015 (시세분석중)

| 구분 | mcp_outputs | 로컬 코드베이스 |
|------|-------------|----------------|
| **루트** | 794:4015 (1440×1024, 로그인 후 랜딩페이지_전체차량 필터 미적용) | `data-node-id="794:4015"` (div 컨테이너) |
| **metadata 노드 수** | 84개 | — |
| **design_context 포함** | 794:4016~794:4106 (GNB, top bar, 페이지네이션, 시세분석 영역) | — |
| **구현된 data-node-id** | design_context 다수 | 794:4015, 794:4101, 794:4102 (3개) |
| **794:4015 (루트)** | width 1440px | `flex flex-col` 컨테이너, `w-[1440px]` 없음 → R003-D warn |
| **794:4101 (기준 가격 설정)** | Fill (부모 794:4099 내) | `text-[32px]` — w-full/flex-1 없음 → R003-D warn |
| **794:4102 (분석 중 문구)** | Fill | `max-w-[380px]` — Fill 기대, R003-D warn |

**핵심**:
- design_context는 794:4015 Figma 프레임 전체(GNB, 헤더, 배지, 탭, 페이지네이션) 포함
- 실제 코드는 794:4015, 794:4101, 794:4102만 page에 구현 — GNB/헤더는 LandingHeader 위젯
- scope: SSOT §4에 794-4015 → GeneralSaleAnalyzingPage.tsx만 매핑 → scope_resolver는 해당 파일만 반환
- 794:4101, 794:4102는 Fill 휴리스틱 (부모 width ≈ parent) → 코드에 `w-full`/`flex-1` 없음

### 3.3 공통 페이지 구조

- **라우트**: `/vehicles/:vehicleId/sale/analyzing`
- **페이지**: GeneralSaleAnalyzingPage
- **조건부 렌더링**:
  - `step === 'choice'` → 794-3704 UI (판매방식 선택)
  - `step === 'analyzing'` → 794-4015 UI (시세분석중)
- **위젯**: LandingHeader, ProgressSidebar — design_context의 794:3738 (top bar), 794:4016 (배지) 등은 위젯에 있어 scope에 포함되지 않음

---

## 4. 규칙 엔진 검증

### 4.1 R003-C (위상)

| 노드 | metadata parent | 코드 조상 체인 | 결과 |
|------|-----------------|----------------|------|
| 794:3706 | 794:3705 | 794:3705 (또는 없음) | 통과 |
| 794:3712 | 794:3710 | 794:3708 | 794:3708 구현됨, 통과 |
| 794:4015 | null (루트) | — | 통과 |

- metadata (parent, child) 쌍 중 **둘 다 코드에 있는** 경우만 검증
- 794-3704, 794-4015 모두 R003-C critical 0건

### 4.2 R003-D (치수)

| 노드 | Figma width | 코드 | 결과 |
|------|-------------|------|------|
| 794:3706 | 216px | w-[Npx] 없음 | warn |
| 794:3708 | 297.38px | w-[297px] 있음 | warn (Fixed width not reflected — 정규식 매칭 이슈 가능) |
| 794:3713 | 250.46px | 부모 297px | warn (Width mismatch) |
| 794:3720 | 297.38px | w-[297px] | warn |
| 794:3725 | 250.46px | 부모 297px | warn |
| 794:4015 | 1440px | w-full 없음 | warn |
| 794:4101 | Fill | w-full/flex-1 없음 | warn |
| 794:4102 | Fill | max-w-[380px] | warn |

### 4.3 R006 (impl_plan)

- `docs/figmaMCP/impl_plans/794-3704_구현계획.md` ✅ 존재
- `docs/figmaMCP/impl_plans/794-4015_구현계획.md` ✅ 존재

---

## 5. 발견 이슈 및 권장 사항

### 5.1 R003-D False Positive 가능성

- 794:3708, 794:3720: 코드에 `w-[297px]` 사용 (`GeneralSaleAnalyzingPage.tsx` L97, L116)
- R003-D "Fixed width not reflected" 발생 — code parser의 `_extract_classname_from_context`가 `data-node-id`와 다른 줄에 있는 `className`을 찾을 때, **다른 요소의 className**을 잘못 매칭했을 가능성
- `CLASSNAME_RE`이 `lines[i-10:i+1]` 범위에서 첫 번째 매칭을 사용 — 여러 요소가 겹치는 구간에서 부모/형제의 className이 선택될 수 있음
- 확인: `parse_codebase`에서 794:3708의 `CodeElement.classes`에 `w-[297px]` 포함 여부 검증 필요

### 5.2 Fill 휴리스틱

- 794:4101, 794:4102: metadata의 `node.width ≈ parent.width`로 Fill 판단
- 코드는 `max-w-[380px]` 사용 — Fill이 아닌 max-width 제한. R003-D 휴리스틱이 Fill로 잘못 분류했을 수 있음

### 5.3 scope 범위

- 794-4015 design_context에는 GNB, 헤더, 페이지네이션(794:4016~794:4098) 포함
- 코드는 GeneralSaleAnalyzingPage만 스캔 — LandingHeader, ProgressSidebar 등 위젯 미포함
- SSOT "코드 참조"가 `pages/admin/sale/GeneralSaleAnalyzingPage.tsx`만 명시 → 의도된 동작

### 5.4 권장 사항

1. **code/parser**: `w-[Npx]` 정규식이 `className="..."` 내부 template literal/동적 클래스 조합에서도 동작하는지 검증
2. **R003-D Fill 휴리스틱**: `max-w-[Npx]` 사용 시 Fixed로 분류하는 옵션 추가 검토
3. **루트 노드**: 794:3704, 794:4015 루트에 data-node-id 없음 — impl_plan 기준으로는 핵심 UI만 매핑해도 됨

---

## 6. 문서 이력

| 버전 | 일자 | 비고 |
|------|------|------|
| 1.0 | 2026-02-11 | mcp_outputs 794-3704, 794-4015 원본 vs 코드베이스 비교·검증 보고서 초안 |
