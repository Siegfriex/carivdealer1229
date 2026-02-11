"""Stage 3: Rules engine - R003-C topology, R003-D dimension, R006 impl_plan, R001~R008."""

import re
from pathlib import Path
from typing import List, Dict, Any, Optional

from ..models import ClassifiedData, EnrichedNode, Finding
from ..code.parser import CodeElement, parse_codebase, get_ancestor_chain
from ..utils import get_logger, safe_read
from ..utils.color import normalize_for_compare, colors_equivalent, hex_to_rgba

logger = get_logger()

HEX_RE = re.compile(r"#([0-9a-fA-F]{3,8})\b")
RGBA_RE = re.compile(r"rgba\([^)]+\)")
RGB_RE = re.compile(r"rgb\([^)]+\)")


def verify_r003_topology(
    classified: ClassifiedData,
    code_map: Dict[str, CodeElement],
    config: Dict[str, Any],
) -> List[Finding]:
    """R003-C: Metadata hierarchy must match code DOM hierarchy (ancestor-descendant)."""
    findings: List[Finding] = []
    severity = config.get("rules", {}).get("r003_topology", {}).get("severity", "critical")

    for node in classified.nodes:
        if not node.parent_id:
            continue
        figma_parent_colon = node.parent_id.replace("-", ":")
        figma_child_colon = node.id_colon
        if figma_parent_colon not in code_map or figma_child_colon not in code_map:
            continue
        ancestors = get_ancestor_chain(code_map, figma_child_colon)
        if figma_parent_colon not in ancestors:
            findings.append(
                Finding(
                    rule_id="R003-C",
                    severity=severity,
                    message=f"위상 불일치: Figma parent({figma_parent_colon}) not ancestor of {figma_child_colon} in code",
                    node_id=figma_child_colon,
                )
            )
    return findings


def verify_r003_dimension(
    classified: ClassifiedData,
    code_map: Dict[str, CodeElement],
    config: Dict[str, Any],
) -> List[Finding]:
    """R003-D: Fixed/Fill dimension check. Loose - warn only."""
    findings: List[Finding] = []
    rules_cfg = config.get("rules", {}).get("r003_dimension", {})
    severity = rules_cfg.get("severity", "warn")
    tolerance = rules_cfg.get("tolerance_percent", 10) / 100
    min_width = rules_cfg.get("min_width_px", 100)

    parent_width_by_id: Dict[str, float] = {}
    for node in classified.nodes:
        if node.parent_id and node.parent_id in [n.id for n in classified.nodes]:
            parent_node = next((n for n in classified.nodes if n.id == node.parent_id), None)
            if parent_node:
                parent_width_by_id[node.id] = parent_node.bounds.width

    for node in classified.nodes:
        if node.bounds.width < min_width:
            continue
        if node.id_colon not in code_map:
            continue
        elem = code_map[node.id_colon]
        parent_width = parent_width_by_id.get(node.id)
        is_fill = parent_width and abs(node.bounds.width - parent_width) / parent_width < 0.05

        if is_fill:
            if not elem.is_fill:
                findings.append(
                    Finding(
                        rule_id="R003-D",
                        severity=severity,
                        message=f"Fill expected but no w-full/flex-1: {node.id_colon}",
                        node_id=node.id_colon,
                    )
                )
        else:
            if elem.width_px is None:
                findings.append(
                    Finding(
                        rule_id="R003-D",
                        severity=severity,
                        message=f"Fixed width not reflected: Figma {node.bounds.width}px, code has no w-[Npx]",
                        node_id=node.id_colon,
                    )
                )
            elif abs(elem.width_px - node.bounds.width) / node.bounds.width > tolerance:
                findings.append(
                    Finding(
                        rule_id="R003-D",
                        severity=severity,
                        message=f"Width mismatch: Figma {node.bounds.width}px vs code {elem.width_px}px (>{tolerance*100}% diff)",
                        node_id=node.id_colon,
                    )
                )
    return findings


def verify_r006_impl_plan(
    node_id: str,
    impl_plans_base: Path,
    config: Dict[str, Any],
    project_root: Optional[Path] = None,
    alias_map: Optional[Dict[str, Dict[str, Any]]] = None,
) -> List[Finding]:
    """R006: impl_plan file must exist. If alias_map provided, alias impl_plans count as fallback."""
    findings: List[Finding] = []
    severity = config.get("rules", {}).get("r006_impl_plan", {}).get("severity", "warn")
    plan_path = impl_plans_base / f"{node_id}_구현계획.md"
    if plan_path.exists():
        return findings
    alias_map = alias_map or {}
    alias_info = alias_map.get(node_id, {})
    aliases: List[str] = alias_info.get("aliases", []) or []
    for alias in aliases:
        alias_plan = impl_plans_base / f"{alias}_구현계획.md"
        if alias_plan.exists():
            return findings
    findings.append(
        Finding(
            rule_id="R006",
            severity=severity,
            message=f"구현 계획서 없음: {plan_path}",
            file_path=str(plan_path),
        )
    )
    return findings


def verify_r001_colors(
    classified: ClassifiedData,
    code_map: Dict[str, CodeElement],
    project_root: Path,
    config: Dict[str, Any],
) -> List[Finding]:
    """R001: globalColors must be reflected in code or design-tokens."""
    findings: List[Finding] = []
    severity = config.get("rules", {}).get("r001_colors", {}).get("severity", "critical")
    colors = getattr(classified, "global_colors", []) or []
    if not colors:
        return findings
    tokens_path = project_root / "src" / "shared" / "styles" / "design-tokens.css"
    tokens_content = safe_read(tokens_path) or ""
    code_colors: set = set()
    for elem in code_map.values():
        for c in elem.classes:
            for m in HEX_RE.finditer(c):
                code_colors.add(f"#{m.group(1)}")
            for m in RGBA_RE.finditer(c):
                code_colors.add(m.group(0))
            for m in RGB_RE.finditer(c):
                code_colors.add(m.group(0))
    for figma_color in colors:
        found = False
        for code_color in code_colors:
            if colors_equivalent(figma_color, code_color):
                found = True
                break
        if not found:
            norm = normalize_for_compare(figma_color)
            tokens_norm = tokens_content.lower().replace(" ", "")
            color_norm = figma_color.lower().replace(" ", "")
            if norm and (norm in tokens_content or figma_color in tokens_content or color_norm in tokens_norm):
                found = True
            if not found and figma_color.startswith("#") and len(figma_color.lstrip("#")) == 8:
                rgba_equiv = hex_to_rgba(figma_color)
                if rgba_equiv.replace(" ", "") in tokens_norm:
                    found = True
        if not found:
            findings.append(
                Finding(
                    rule_id="R001",
                    severity=severity,
                    message=f"Design color not reflected in code or tokens: {figma_color}",
                )
            )
    return findings


def verify_r002_assets(
    classified: ClassifiedData,
    code_map: Dict[str, CodeElement],
    project_root: Path,
    config: Dict[str, Any],
) -> List[Finding]:
    """R002: globalAssets must be in figma_image or FIGMA_ASSET_TRACEABILITY."""
    findings: List[Finding] = []
    severity = config.get("rules", {}).get("r002_assets", {}).get("severity", "critical")
    assets = getattr(classified, "global_assets", []) or []
    if not assets:
        return findings
    src_base = config.get("src_base", "src")
    figma_image_dir = project_root / src_base / "shared" / "figma_image"
    traceability_path = project_root / "docs" / "figmaMCP" / "FIGMA_ASSET_TRACEABILITY.md"
    trace_content = safe_read(traceability_path) or ""
    for asset in assets:
        in_trace = asset in trace_content
        if figma_image_dir.exists():
            files = list(figma_image_dir.glob("*"))
            in_files = any(asset.lower() in f.name.lower() for f in files)
        else:
            in_files = False
        if not in_trace and not in_files:
            findings.append(
                Finding(
                    rule_id="R002",
                    severity=severity,
                    message=f"Asset {asset} not in figma_image or FIGMA_ASSET_TRACEABILITY",
                )
            )
    return findings


def verify_r004_fsd(
    code_map: Dict[str, CodeElement],
    config: Dict[str, Any],
) -> List[Finding]:
    """R004: File paths must follow FSD (pages/, widgets/, entities/, features/, shared/)."""
    findings: List[Finding] = []
    severity = config.get("rules", {}).get("r004_fsd", {}).get("severity", "critical")
    allowed = ("pages", "widgets", "entities", "features", "shared", "app")
    for elem in code_map.values():
        path = elem.file_path
        if "/" not in path:
            continue
        parts = path.replace("\\", "/").split("/")
        if "src" in parts:
            idx = parts.index("src")
            if idx + 1 < len(parts):
                layer = parts[idx + 1]
                if layer not in allowed:
                    findings.append(
                        Finding(
                            rule_id="R004",
                            severity=severity,
                            message=f"FSD violation: {path} (layer '{layer}' not in {allowed})",
                            file_path=path,
                        )
                    )
    return findings


def verify_r005_traceability(
    classified: ClassifiedData,
    project_root: Path,
    config: Dict[str, Any],
) -> List[Finding]:
    """R005: Each global_asset used in scope must have FIGMA_ASSET_TRACEABILITY entry."""
    findings: List[Finding] = []
    severity = config.get("rules", {}).get("r005_traceability", {}).get("severity", "critical")
    assets = getattr(classified, "global_assets", []) or []
    if not assets:
        return findings
    traceability_path = project_root / "docs" / "figmaMCP" / "FIGMA_ASSET_TRACEABILITY.md"
    trace_content = safe_read(traceability_path) or ""
    for asset in assets:
        if asset not in trace_content:
            findings.append(
                Finding(
                    rule_id="R005",
                    severity=severity,
                    message=f"Asset {asset} missing from FIGMA_ASSET_TRACEABILITY table",
                )
            )
    return findings


def verify_r007_styles(
    classified: ClassifiedData,
    code_map: Dict[str, CodeElement],
    config: Dict[str, Any],
) -> List[Finding]:
    """R007: Enriched node.styles should be reflected in code (info, optional)."""
    findings: List[Finding] = []
    severity = config.get("rules", {}).get("r007_styles", {}).get("severity", "info")
    for node in classified.nodes:
        if node.id_colon not in code_map:
            continue
        elem = code_map[node.id_colon]
        styles = getattr(node, "styles", {}) or {}
        dc_class = styles.get("className", "")
        if not dc_class:
            continue
        dc_classes = set(dc_class.split())
        code_classes = set(elem.classes)
        missing = dc_classes - code_classes
        if missing and len(missing) > 2:
            findings.append(
                Finding(
                    rule_id="R007",
                    severity=severity,
                    message=f"Node {node.id_colon}: design context classes not fully in code: {list(missing)[:5]}...",
                    node_id=node.id_colon,
                )
            )
    return findings


def verify_r008_tokens(
    classified: ClassifiedData,
    code_map: Dict[str, CodeElement],
    project_root: Path,
    config: Dict[str, Any],
) -> List[Finding]:
    """R008: Hardcoded hex/rgba should use design tokens (var) when mapped in SSOT."""
    findings: List[Finding] = []
    rules_cfg = config.get("rules", {}).get("r008_tokens", {})
    severity = rules_cfg.get("severity", "warn")
    allow_jit = rules_cfg.get("allow_jit", True)
    tokens_path = project_root / "src" / "shared" / "styles" / "design-tokens.css"
    tokens_content = safe_read(tokens_path) or ""
    for elem in code_map.values():
        for c in elem.classes:
            for m in HEX_RE.finditer(c):
                hex_val = f"#{m.group(1)}"
                if "var(" in c or (allow_jit and "var(" in tokens_content and hex_val in tokens_content):
                    continue
                if hex_val in tokens_content or normalize_for_compare(hex_val) in tokens_content:
                    findings.append(
                        Finding(
                            rule_id="R008",
                            severity=severity,
                            message=f"Prefer var() over hardcoded {hex_val} (see design-tokens.css)",
                            file_path=elem.file_path,
                        )
                    )
                    break
    return findings


def run_stage3(
    classified: ClassifiedData,
    code_map: Dict[str, CodeElement],
    impl_plans_base: Path,
    config: Dict[str, Any],
    project_root: Optional[Path] = None,
) -> List[Finding]:
    """Run all Stage 3 verifications."""
    findings: List[Finding] = []
    proj = project_root or (impl_plans_base.parent.parent.parent if impl_plans_base else Path("."))
    from ..config import load_alias_map
    alias_map = load_alias_map(proj, config)
    findings.extend(verify_r003_topology(classified, code_map, config))
    findings.extend(verify_r003_dimension(classified, code_map, config))
    findings.extend(verify_r006_impl_plan(classified.node_id, impl_plans_base, config, proj, alias_map))
    findings.extend(verify_r001_colors(classified, code_map, proj, config))
    findings.extend(verify_r002_assets(classified, code_map, proj, config))
    findings.extend(verify_r004_fsd(code_map, config))
    findings.extend(verify_r005_traceability(classified, proj, config))
    findings.extend(verify_r007_styles(classified, code_map, config))
    findings.extend(verify_r008_tokens(classified, code_map, proj, config))
    return findings
