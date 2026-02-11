# Figma Design Audit — 794 시리즈 4노드 검증 보고서

**검증 일시**: 2026-02-11  
**대상 노드**: 794-3704, 794-4015, 794-4107, 794-4200 (판매방식선택·시세분석·판매전환완료·경매시작가설정)  
**데이터 소스**: report_794-*.json, pytest, CLI 실행 로그

---

## 1. 검증 환경

| 항목 | 값 |
|------|-----|
| Python | 3.13.6 |
| figma-design-audit | pip install -e . |
| 프로젝트 루트 | c:\carivdealer |
| 캐시 | --no-cache (무시) |

---

## 2. L1 단위 테스트 결과

```
tests/test_code_parser.py::test_parse_file PASSED
tests/test_code_parser.py::test_parse_codebase PASSED
tests/test_scope.py::test_parse_ssot_section4 PASSED
tests/test_scope.py::test_resolve_code_ref PASSED
tests/test_scope.py::test_resolve PASSED
tests/test_stage1_metadata.py::test_parse_metadata PASSED
tests/test_stage1_metadata.py::test_run_stage1 PASSED
```

**결과**: 7/7 통과

---

## 3. L3 CLI 실행 결과 (4노드)

| node_id | IA 라벨 | Exit | critical | warn | info |
|---------|----------|------|----------|------|------|
| 794-3704 | 판매방식선택 | 1 | 50 | 3 | 6 |
| 794-4015 | 시세분석중 | 1 | 40 | 3 | 3 |
| 794-4107 | 판매전환완료 (일반) | 1 | 50 | 5 | 4 |
| 794-4200 | 경매 시작가설정 보정 | 1 | 64 | 12 | 25 |

### 3.1 R003-D 오탐 해소 검증

| node_id | 이전 (오탐 시) | 현재 | 판정 |
|---------|----------------|------|------|
| **794:3708** | "Fixed width not reflected" (w-[297px] 있음) | **finding 없음** | 오탐 해소 |
| **794:3720** | "Fixed width not reflected" (w-[297px] 있음) | **finding 없음** | 오탐 해소 |
| 794:3706 | 동일 | "Fixed width not reflected" (216px) | 정탐 (text만 있음) |
| 794:3713, 794:3725 | Width mismatch | "Fixed width not reflected" (250px) | 정탐 |

**결론**: Phase 1 Parser 고도화로 794:3708, 794:3720에 대한 R003-D 오탐이 **해소됨**.

---

## 4. 규칙별 트리거 상태 (노드별)

| Rule | 794-3704 | 794-4015 | 794-4107 | 794-4200 |
|------|----------|----------|----------|----------|
| R001 | 0 | 0 | 0 | 2 critical |
| R002 | 25 critical | 20 critical | 25 critical | 31 critical |
| R003-C | 0 | 0 | 0 | 0 |
| R003-D | 3 warn | 3 warn | 4 warn | 11 warn |
| R004 | 0 | 0 | 0 | 0 |
| R005 | 25 critical | 20 critical | 25 critical | 31 critical |
| R006 | 0 | 0 | 1 warn | 1 warn |
| R007 | 6 info | 3 info | 4 info | 25 info |
| R008 | 0 | 0 | 0 | 0 |

### 4.1 R001 (794-4200만 2건)

- `#777`, `#c8c8c8` — design-tokens.css에 미정의, 코드에도 미반영
- 권장: design-tokens.css에 추가 또는 코드에 반영

### 4.2 R002/R005 (공통)

- design_context의 global_assets가 FIGMA_ASSET_TRACEABILITY 테이블·figma_image에 미등록
- 794 시리즈는 GNB 공통 에셋(imgLShoppingBag, imgBriefcase 등) 포함 — 테이블 보완 필요

### 4.3 R006 (794-4107, 794-4200)

- `impl_plans/794-4107_구현계획.md`, `impl_plans/794-4200_구현계획.md` 없음
- 권장: impl_plans 배치 또는 기존 문서 병합

### 4.4 R007 (info)

- design_context의 배치(absolute, left-[...])·폰트 클래스가 코드에 완전히 반영되지 않음
- info 수준, 구현 방식 차이로 인한 경미한 불일치

---

## 5. R003-D 상세 (노드별)

### 794-3704

| node_id | Figma width | 코드 상황 | 권장 |
|---------|-------------|-----------|------|
| 794:3706 | 216px | text-[38px]만 사용 | 제목은 고정폭 비필수 |
| 794:3713 | 250.46px | 부모 카드(297px) 내 본문 | max-w-[250px] 검토 (선택) |
| 794:3725 | 250.46px | 동일 | 동일 |

### 794-4015

| node_id | Figma width | 코드 상황 |
|---------|-------------|-----------|
| 794:4015 | 1440px | 루트, w-[Npx] 없음 |
| 794:4101, 794:4102 | Fill 추정 | w-full/flex-1 없음 |

### 794-4107

| node_id | Figma width | 코드 상황 |
|---------|-------------|-----------|
| 794:4191 | 381px | 972px (width mismatch) |
| 794:4197, 794:4198, 794:4199 | 348, 296, 381px | w-[Npx] 없음 |

### 794-4200

| node_id | Figma width | 코드 상황 |
|---------|-------------|-----------|
| 다수 | 131~971px | w-[Npx] 없음 (11건) |

---

## 6. 종합 판정

| 항목 | 결과 |
|------|------|
| **Pipeline** | SUCCESS |
| **R003-D 오탐 해소** | 확인됨 (794:3708, 794:3720) |
| **critical** | 204건 (R001 2, R002/R005 다수) |
| **warn** | 23건 (R003-D 21, R006 2) |
| **info** | 38건 (R007) |
| **종합 등급** | **C** (R002/R005 에셋·추적성 미보완) |

### 6.1 우선 보완 권장

1. **FIGMA_ASSET_TRACEABILITY**: 794 시리즈 design_context 에셋 변수명 등록
2. **impl_plans**: 794-4107, 794-4200 구현계획서 추가
3. **design-tokens**: #777, #c8c8c8 토큰 추가 (794-4200)

---

## 7. 문서 이력

| 버전 | 일자 | 비고 |
|------|------|------|
| 1.0 | 2026-02-11 | NEO GOD 감사 보고서 초안 (794-3704) |
| 1.1 | 2026-02-11 | 4노드 검증 (794-3704, 794-4015, 794-4107, 794-4200), R003-D 오탐 해소 반영 |
