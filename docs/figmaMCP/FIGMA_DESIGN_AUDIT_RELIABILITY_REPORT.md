# Figma Design Audit — 신뢰도 테스트 검증 보고서

**검증 일시**: 2026-02-11  
**실행 환경**: Python 3.13.6, pytest 8.4.1, win32

---

## 1. 실행 요약

| 항목 | 결과 |
|------|------|
| **신뢰도 테스트** | 5/5 통과 |
| **전체 테스트** | 12/12 통과 (기존 7 + 신뢰도 5) |
| **판정** | **PASS** |

---

## 2. 신뢰도 테스트 결과

```
tests/test_reliability.py::test_parser_width_px_794_3708 PASSED
tests/test_reliability.py::test_parser_width_px_794_3720 PASSED
tests/test_reliability.py::test_r003d_no_fp_794_3708_3720 PASSED
tests/test_reliability.py::test_consistency_repeat_runs PASSED
tests/test_reliability.py::test_ancestor_chain_794_3712 PASSED
```

---

## 3. 검증 항목별 결과

| 항목 | 검증 내용 | 결과 |
|------|-----------|------|
| **Code Parser** | 794:3708, 794:3720 `width_px`=297 파싱 | ✅ 통과 |
| **R003-D 오탐** | 794:3708, 794:3720 R003-D 미트리거 | ✅ 통과 |
| **일관성** | 2회 연속 실행 시 R003-D 동일 | ✅ 통과 |
| **조상 체인** | 794:3712 → 794:3708 포함 | ✅ 통과 |

---

## 4. 신뢰도 지표

| 지표 | 값 | 비고 |
|------|-----|------|
| **R003-D FP (794:3708, 794:3720)** | 0 | 오탐 해소 확인 |
| **Parser width_px 정확도** | 2/2 | Ground truth 2건 |
| **일관성** | 100% | 동일 입력 → 동일 출력 |

---

## 5. 실행 방법

```powershell
cd c:\carivdealer\figma-design-audit
pip install -e .
pytest tests/test_reliability.py -v
```

전체 테스트:

```powershell
pytest tests/ -v
```

---

## 6. 문서 이력

| 버전 | 일자 | 비고 |
|------|------|------|
| 1.0 | 2026-02-11 | 신뢰도 테스트 검증 보고서 초안 |
