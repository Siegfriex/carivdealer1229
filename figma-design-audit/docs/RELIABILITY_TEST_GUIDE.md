# Figma Design Audit — 신뢰도 테스트 가이드

**목적**: 검증기의 정확도·일관성을 검증하여 오탐(false positive) 해소 및 품질을 보장합니다.

---

## 1. 신뢰도 테스트 항목

| 항목 | 검증 내용 | 판정 기준 |
|------|-----------|-----------|
| **Code Parser 정확도** | 794:3708, 794:3720에서 `w-[297px]` 파싱 | `width_px ≈ 297` |
| **R003-D 오탐 해소** | 794:3708, 794:3720 R003-D 미트리거 | finding 없음 |
| **일관성** | 2회 연속 실행 시 R003-D 동일 | `findings_1 == findings_2` |
| **조상 체인** | 794:3712 → 794:3708 포함 | `get_ancestor_chain` 검증 |

---

## 2. 실행 방법

```bash
cd figma-design-audit
pip install -e .
pytest tests/test_reliability.py -v
```

전체 테스트에 신뢰도 포함:

```bash
pytest tests/ -v
```

---

## 3. 테스트 케이스 상세

### 3.1 test_parser_width_px_794_3708 / test_parser_width_px_794_3720

- **Ground truth**: `GeneralSaleAnalyzingPage.tsx` L97~100, L116~118에 `w-[297px]` 명시
- **검증**: `parse_codebase` 결과 `CodeElement.width_px` ≈ 297
- **의미**: Phase 1 Parser 고도화로 `_extract_classname_from_context`가 다중 라인 태그에서 올바르게 className 추출

### 3.2 test_r003d_no_fp_794_3708_3720

- **Ground truth**: 794:3708, 794:3720은 코드에 `w-[297px]` 사용 → R003-D 해당 없음
- **검증**: `run_stage3` R003-D finding에 해당 노드 없음
- **의미**: 오탐(false positive) 해소 확인

### 3.3 test_consistency_repeat_runs

- **검증**: `_run_audit_794_3704()` 2회 호출 시 R003-D (node_id, message) 집합 동일
- **의미**: 결정론적 동작, 캐시/랜덤 요인 없음

### 3.4 test_ancestor_chain_794_3712

- **검증**: 794:3712의 조상 체인에 794:3708 포함
- **의미**: R003-C 위상 검증 시 parent-child 관계 정확

---

## 4. 신뢰도 지표 (향후 확장)

| 지표 | 정의 | 목표 |
|------|------|------|
| **Precision** | TP / (TP + FP) | FP 0 (794:3708, 794:3720) |
| **Recall** | TP / (TP + FN) | Ground truth 확장 후 측정 |
| **Consistency** | 동일 입력 → 동일 출력 | 100% |

*현재: Precision 오탐 해소 검증만 구현. Recall은 Golden Set 확장 후 추가.*

---

## 5. 문서 이력

| 버전 | 일자 | 비고 |
|------|------|------|
| 1.0 | 2026-02-11 | 신뢰도 테스트 가이드 초안 |
