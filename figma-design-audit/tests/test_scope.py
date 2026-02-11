"""Tests for scope resolver."""

from pathlib import Path

from figma_audit.scope import parse_ssot_section4, resolve_code_ref, resolve

PROJECT_ROOT = Path(__file__).parent.parent.parent
SSOT_PATH = PROJECT_ROOT / "docs" / "figma" / "FSD_IA_NODEID_SSOT.md"


def test_parse_ssot_section4():
    if not SSOT_PATH.exists():
        return
    content = SSOT_PATH.read_text(encoding="utf-8")
    mapping = parse_ssot_section4(content)
    assert "794-3704" in mapping
    assert "pages/admin/sale/GeneralSaleAnalyzingPage.tsx" in mapping["794-3704"]


def test_resolve_code_ref():
    paths = resolve_code_ref(
        "pages/admin/sale/GeneralSaleAnalyzingPage.tsx",
        PROJECT_ROOT,
        "src",
    )
    assert len(paths) >= 1
    assert any("GeneralSaleAnalyzingPage" in str(p) for p in paths)


def test_resolve():
    if not SSOT_PATH.exists():
        return
    paths = resolve("794-3704", PROJECT_ROOT, SSOT_PATH, "src")
    assert len(paths) >= 1
    assert any("GeneralSaleAnalyzingPage" in str(p) for p in paths)
