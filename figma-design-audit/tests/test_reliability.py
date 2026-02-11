"""
신뢰도 테스트 — Figma Design Audit 검증기 품질 검증

검증 항목:
1. Code Parser 정확도: 794:3708, 794:3720에 대해 width_px=297 파싱 확인
2. R003-D 오탐 해소: 794:3708, 794:3720에 대해 R003-D finding 없음 (FP 해소)
3. 일관성: 동일 입력 2회 실행 시 동일 결과
"""

import json
from pathlib import Path

import pytest

from figma_audit.config import load_config
from figma_audit.scope import resolve as scope_resolve
from figma_audit.pipeline.stage1_metadata import run_stage1
from figma_audit.pipeline.stage2_mapping import run_stage2
from figma_audit.pipeline.stage3_verifier import run_stage3
from figma_audit.code.parser import parse_codebase, get_ancestor_chain
from figma_audit.utils import safe_read

PROJECT_ROOT = Path(__file__).parent.parent.parent
PAGE_PATH = PROJECT_ROOT / "src" / "pages" / "admin" / "sale" / "GeneralSaleAnalyzingPage.tsx"


# --- Ground truth: 코드베이스 실제 상태 ---
GROUND_TRUTH_794_3708 = {"width_px": 297, "has_w_px": True}  # w-[297px] 존재
GROUND_TRUTH_794_3720 = {"width_px": 297, "has_w_px": True}


def _run_audit_794_3704(no_cache: bool = True):
    """794-3704 노드에 대해 전체 오디트 실행."""
    config = load_config()
    mcp_base = PROJECT_ROOT / config.get("mcp_outputs_base", "docs/figmaMCP/mcp_outputs")
    impl_base = PROJECT_ROOT / config.get("impl_plans_base", "docs/figmaMCP/impl_plans")
    ssot_path = PROJECT_ROOT / config.get("ssot_path", "docs/figma/FSD_IA_NODEID_SSOT.md")
    node_id = "794-3704"
    node_dir = mcp_base / node_id
    metadata_path = node_dir / "metadata_raw.txt"
    design_context_path = node_dir / "design_context_raw.txt"

    if not metadata_path.exists():
        pytest.skip("metadata_raw.txt not found for 794-3704")

    classified = run_stage1(metadata_path, node_id)
    if not classified:
        pytest.fail("Stage 1 failed")

    if design_context_path.exists():
        classified = run_stage2(design_context_path, classified)

    file_paths = scope_resolve(node_id, PROJECT_ROOT, ssot_path, config.get("src_base", "src"))
    code_map = parse_codebase(file_paths) if file_paths else {}
    findings = run_stage3(classified, code_map, impl_base, config, project_root=PROJECT_ROOT)
    return findings, code_map


# ========== 1. Code Parser 정확도 ==========


def test_parser_width_px_794_3708():
    """794:3708 — w-[297px] 파싱 확인. 오탐 해소 검증."""
    if not PAGE_PATH.exists():
        pytest.skip("GeneralSaleAnalyzingPage.tsx not found")
    file_paths = scope_resolve("794-3704", PROJECT_ROOT, PROJECT_ROOT / "docs/figma/FSD_IA_NODEID_SSOT.md", "src")
    if not file_paths:
        pytest.skip("No scope for 794-3704")
    code_map = parse_codebase(file_paths)
    assert "794:3708" in code_map, "794:3708 should be in code_map"
    elem = code_map["794:3708"]
    assert elem.width_px is not None, "794:3708 should have width_px (w-[297px] in code)"
    assert abs(elem.width_px - GROUND_TRUTH_794_3708["width_px"]) < 1


def test_parser_width_px_794_3720():
    """794:3720 — w-[297px] 파싱 확인. 오탐 해소 검증."""
    if not PAGE_PATH.exists():
        pytest.skip("GeneralSaleAnalyzingPage.tsx not found")
    file_paths = scope_resolve("794-3704", PROJECT_ROOT, PROJECT_ROOT / "docs/figma/FSD_IA_NODEID_SSOT.md", "src")
    if not file_paths:
        pytest.skip("No scope for 794-3704")
    code_map = parse_codebase(file_paths)
    assert "794:3720" in code_map
    elem = code_map["794:3720"]
    assert elem.width_px is not None, "794:3720 should have width_px (w-[297px] in code)"
    assert abs(elem.width_px - GROUND_TRUTH_794_3720["width_px"]) < 1


# ========== 2. R003-D 오탐 해소 ==========


def test_r003d_no_fp_794_3708_3720():
    """
    794:3708, 794:3720에 대해 R003-D finding 없어야 함.
    코드에 w-[297px] 존재 → 오탐(false positive) 해소 검증.
    """
    findings, code_map = _run_audit_794_3704()
    r003d = [f for f in findings if f.rule_id == "R003-D"]
    fp_nodes = [f.node_id for f in r003d if f.node_id in ("794:3708", "794:3720")]
    assert len(fp_nodes) == 0, (
        f"794:3708, 794:3720 should NOT trigger R003-D (code has w-[297px]). "
        f"False positives: {fp_nodes}"
    )


# ========== 3. 일관성 ==========


def test_consistency_repeat_runs():
    """동일 입력 2회 실행 시 R003-D finding 구성 일치."""
    findings1, _ = _run_audit_794_3704()
    findings2, _ = _run_audit_794_3704()
    r003d_1 = {(f.node_id, f.message) for f in findings1 if f.rule_id == "R003-D"}
    r003d_2 = {(f.node_id, f.message) for f in findings2 if f.rule_id == "R003-D"}
    assert r003d_1 == r003d_2, f"R003-D inconsistent: {r003d_1 ^ r003d_2}"


# ========== 4. Ancestor chain ==========


def test_ancestor_chain_794_3712():
    """794:3712의 조상에 794:3708 포함."""
    if not PAGE_PATH.exists():
        pytest.skip("GeneralSaleAnalyzingPage.tsx not found")
    file_paths = scope_resolve("794-3704", PROJECT_ROOT, PROJECT_ROOT / "docs/figma/FSD_IA_NODEID_SSOT.md", "src")
    if not file_paths:
        pytest.skip("No scope for 794-3704")
    code_map = parse_codebase(file_paths)
    ancestors = get_ancestor_chain(code_map, "794:3712")
    assert "794:3708" in ancestors, "794:3712 should have 794:3708 in ancestor chain"
