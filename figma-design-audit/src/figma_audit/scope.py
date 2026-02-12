"""Scope resolver: FSD_IA_NODEID_SSOT §4 parsing, code ref -> file paths."""

import re
from pathlib import Path
from typing import List, Optional

from .utils import safe_read, get_logger

logger = get_logger()


def parse_ssot_section4(content: str) -> dict[str, str]:
    """Parse §4 table from SSOT markdown. Returns {nodeId: code_ref}."""
    in_section4 = False
    result = {}
    for line in content.split("\n"):
        if "## §4 Node 상세 매핑" in line:
            in_section4 = True
            continue
        if in_section4 and line.strip().startswith("## "):
            break
        if not in_section4:
            continue
        if not line.strip().startswith("|"):
            continue
        # Parse table row: | nodeId | ... | 코드 참조 | ...
        parts = [p.strip() for p in line.split("|")]
        if len(parts) < 11:
            continue
        if parts[1] == "nodeId" or parts[1] == "---":
            continue
        node_id = parts[1]
        code_ref = parts[10]  # 코드 참조 column (index 10, 1-based from split)
        if node_id and code_ref:
            result[node_id] = code_ref
    return result


def resolve_code_ref(
    ref: str,
    project_root: Path,
    src_base: str = "src",
) -> List[Path]:
    """
    Resolve code reference to actual file paths.
    - pages/admin/sale/GeneralSaleAnalyzingPage.tsx -> src/pages/admin/sale/GeneralSaleAnalyzingPage.tsx
    - widgets/InspectionScheduleBlock -> widgets/InspectionScheduleBlock/ui/InspectionScheduleBlock.tsx
    - widgets/* -> glob widgets/*/ui/*.tsx
    - entities/vehicle -> entities/vehicle/ui/*.tsx
    """
    src_path = project_root / src_base
    paths: List[Path] = []
    for part in ref.split(","):
        part = part.strip()
        if not part:
            continue
        if part.endswith("/*"):
            # widgets/* -> glob widgets/*/ui/*.tsx
            prefix = part[:-2].rstrip("/")
            base = src_path / prefix
            if base.exists():
                for child in base.iterdir():
                    if child.is_dir():
                        ui_dir = child / "ui"
                        if ui_dir.exists():
                            for f in ui_dir.glob("*.tsx"):
                                paths.append(f)
            continue
        if "/" in part and not part.endswith((".tsx", ".ts")):
            # entities/vehicle -> entities/vehicle/ui/*.tsx
            base = src_path / part
            ui_dir = base / "ui"
            if ui_dir.exists():
                for f in ui_dir.glob("*.tsx"):
                    paths.append(f)
                continue
            # widgets/InspectionScheduleBlock -> widgets/InspectionScheduleBlock/ui/InspectionScheduleBlock.tsx
            name = part.split("/")[-1]
            candidate = src_path / part / "ui" / f"{name}.tsx"
            if candidate.exists():
                paths.append(candidate)
                continue
        # Normal path: pages/admin/sale/GeneralSaleAnalyzingPage.tsx
        if not part.endswith((".tsx", ".ts")):
            part = f"{part}.tsx"
        full = src_path / part
        if full.exists():
            paths.append(full)
        else:
            # Try alternative: admin/logistics/ for LogisticsSchedulePage
            alt = _try_alternative_path(src_path, part)
            if alt:
                paths.append(alt)
    return paths


def _try_alternative_path(src_path: Path, part: str) -> Optional[Path]:
    """Try alternative paths when primary does not exist."""
    # pages/admin/logistics/LogisticsSchedulePage.tsx - Phase 1 리팩토링 후 최종 경로
    if "LogisticsSchedulePage" in part and "logistics" not in part:
        alt = src_path / "pages" / "admin" / "logistics" / "LogisticsSchedulePage.tsx"
        if alt.exists():
            return alt
    return None


def resolve(
    node_id: str,
    project_root: Path,
    ssot_path: Path,
    src_base: str = "src",
) -> List[Path]:
    """
    Resolve nodeId to list of TSX file paths via SSOT §4.
    Returns empty list if not found or parse error.
    """
    content = safe_read(ssot_path)
    if not content:
        logger.warning("SSOT not found or unreadable: %s", ssot_path)
        return []
    mapping = parse_ssot_section4(content)
    code_ref = mapping.get(node_id)
    if not code_ref:
        logger.warning("nodeId %s not in SSOT §4", node_id)
        return []
    paths = resolve_code_ref(code_ref, project_root, src_base)
    if not paths:
        logger.warning("No files resolved for nodeId %s, ref=%s", node_id, code_ref)
    return paths
