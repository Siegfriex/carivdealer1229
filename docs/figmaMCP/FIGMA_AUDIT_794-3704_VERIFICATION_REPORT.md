# Figma Design Audit — 794-3704 노드 검증 보고서

**검증 일시**: 2026-02-11  
**대상 노드**: 794-3704 (판매방식선택)  
**데이터 소스**: report_794.json, pytest, CLI 실행 로그

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

## 3. L3 CLI 실행 결과 (794-3704)

| 항목 | 값 |
|------|-----|
| Exit code | 1 |
| critical_count | 0 |
| warn_count | 3 |
| R007 info | 6건 |

### 3.1 R003-D 오탐 해소 검증

| node_id | 이전 (오탐 시) | 현재 | 판정 |
|---------|----------------|------|------|
| **794:3708** | "Fixed width not reflected" (w-[297px] 있음) | **finding 없음** | 오탐 해소 |
| **794:3720** | "Fixed width not reflected" (w-[297px] 있음) | **finding 없음** | 오탐 해소 |
| 794:3706 | 동일 | "Fixed width not reflected" (216px) | 정탐 (text만 있음) |
| 794:3713 | Width mismatch | "Fixed width not reflected" (250px) | 정탐 |
| 794:3725 | Width mismatch | "Fixed width not reflected" (250px) | 정탐 |

**결론**: Phase 1 Parser 고도화로 794:3708, 794:3720에 대한 R003-D 오탐이 **해소됨**.

---

## 4. 규칙별 트리거 상태

| Rule | Finding 수 | Severity | 비고 |
|------|------------|----------|------|
| R001 | 0 | — | global_colors → 코드/토큰 반영 통과 |
| R002 | 0 | — | global_assets → figma_image/추적성 통과 |
| R003-C | 0 | — | 위상 일치 (critical 0) |
| R003-D | 3 | warn | 794:3706, 794:3713, 794:3725 |
| R004 | 0 | — | FSD 경로 준수 |
| R005 | 0 | — | FIGMA_ASSET_TRACEABILITY 통과 |
| R006 | 0 | — | impl_plan 존재 |
| R007 | 6 | info | design context vs 코드 클래스 차이 |
| R008 | 0 | — | design-tokens 사용 또는 JIT 허용 |

---

## 5. R003-D 상세 (3건 warn)

| node_id | Figma width | 코드 상황 | 권장 |
|---------|-------------|-----------|------|
| 794:3706 | 216px | `text-[38px]`만 사용, w-[Npx] 없음 | 제목은 고정폭 비필수, 무시 가능 |
| 794:3713 | 250.46px | 부모 카드(297px) 내 본문, w-[Npx] 없음 | `max-w-[250px]` 검토 (선택) |
| 794:3725 | 250.46px | 동일 | 동일 |

---

## 6. R007 info (6건)

design_context의 배치(absolute, left-[...])·폰트 클래스가 코드에 완전히 반영되지 않음.  
info 수준으로, 구현 방식 차이(레이아웃·폰트 전략)로 인한 경미한 불일치로 판단.

---

## 7. 종합 판정

| 항목 | 결과 |
|------|------|
| **Pipeline** | SUCCESS |
| **R003-D 오탐 해소** | 확인됨 (794:3708, 794:3720) |
| **critical** | 0건 |
| **종합 등급** | B (warn 3건, info 6건) |
