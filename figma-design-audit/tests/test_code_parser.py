"""Tests for code parser."""

from pathlib import Path

from figma_audit.code.parser import parse_file, parse_codebase, get_ancestor_chain

# Use actual project file for integration test
PROJECT_ROOT = Path(__file__).parent.parent.parent
PAGE_PATH = PROJECT_ROOT / "src" / "pages" / "admin" / "sale" / "GeneralSaleAnalyzingPage.tsx"


def test_parse_file():
    if not PAGE_PATH.exists():
        return
    items = parse_file(PAGE_PATH)
    node_ids = [x[0] for x in items]
    assert "794:3706" in node_ids
    assert "794:3708" in node_ids
    assert "794:3712" in node_ids


def test_parse_codebase():
    if not PAGE_PATH.exists():
        return
    code_map = parse_codebase([PAGE_PATH])
    assert "794:3706" in code_map
    assert "794:3708" in code_map
    elem_3708 = code_map["794:3708"]
    assert elem_3708.width_px is not None, "794:3708 should have w-[297px] parsed (multi-line tag)"
    assert abs(elem_3708.width_px - 297) < 1
    ancestors_3712 = get_ancestor_chain(code_map, "794:3712")
    assert "794:3708" in ancestors_3712
