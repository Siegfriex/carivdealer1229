"""Tests for Stage 1 metadata parser."""

from pathlib import Path

import pytest

from figma_audit.pipeline.stage1_metadata import parse_metadata, run_stage1


FIXTURES = Path(__file__).parent / "fixtures" / "794-3704"


def test_parse_metadata():
    content = (FIXTURES / "metadata_raw.txt").read_text(encoding="utf-8")
    nodes = parse_metadata(content)
    assert len(nodes) > 50
    root = next((n for n in nodes if n.id == "794-3704"), None)
    assert root is not None
    assert root.parent_id is None
    assert root.depth == 0
    assert "794-3705" in root.children_ids
    child = next((n for n in nodes if n.id == "794-3706"), None)
    assert child is not None
    assert child.parent_id == "794-3705"


def test_run_stage1():
    result = run_stage1(FIXTURES / "metadata_raw.txt", "794-3704")
    assert result is not None
    assert result.node_id == "794-3704"
    assert len(result.nodes) > 50
    assert "container" in result.categories or "text" in result.categories
