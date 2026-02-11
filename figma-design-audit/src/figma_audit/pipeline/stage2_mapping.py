"""Stage 2: design_context_raw.txt parsing and mapping to ClassifiedData."""

import re
from pathlib import Path
from typing import Dict, List, Any, Optional

from ..models import ClassifiedData, EnrichedNode
from ..utils import safe_read, get_logger

logger = get_logger()

ASSET_RE = re.compile(r'const\s+(\w+)\s*=\s*"https://(www\.)?figma\.com/api/mcp/asset/[^"]+"')
DATA_NODE_ID_RE = re.compile(r'data-node-id="([^"]+)"')
CLASSNAME_RE = re.compile(r'className="([^"]*)"')
WIDTH_PX_RE = re.compile(r'w-\[([\d.]+)px\]')
HEIGHT_PX_RE = re.compile(r'h-\[([\d.]+)px\]')
HEX_RE = re.compile(r'#([0-9a-fA-F]{3,8})\b')
RGBA_RE = re.compile(r'rgba\([^)]+\)')


def parse_design_context(content: str) -> Dict[str, Any]:
    """Parse design_context_raw content. Returns parsed data."""
    result: Dict[str, Any] = {
        "global_assets": [],
        "global_colors": [],
        "node_styles": {},
        "node_layout": {},
    }
    # Global assets
    for m in ASSET_RE.finditer(content):
        result["global_assets"].append(m.group(1))
    # Global colors (hex, rgba) from entire content
    seen_colors: set[str] = set()
    for m in HEX_RE.finditer(content):
        c = m.group(1)
        norm = f"#{c}" if len(c) <= 4 else f"#{c}"
        if norm not in seen_colors:
            seen_colors.add(norm)
            result["global_colors"].append(norm)
    for m in RGBA_RE.finditer(content):
        val = m.group(0)
        if val not in seen_colors:
            seen_colors.add(val)
            result["global_colors"].append(val)

    # Find each data-node-id and extract className from same tag
    # Pattern: <tag ... className="..." ... data-node-id="X" ...> or data-node-id before className
    pos = 0
    while True:
        m = DATA_NODE_ID_RE.search(content, pos)
        if not m:
            break
        node_id = m.group(1)
        start = max(0, m.start() - 500)  # Look back for className
        snippet = content[start : m.end() + 100]
        class_match = CLASSNAME_RE.search(snippet)
        classes = class_match.group(1) if class_match else ""
        result["node_styles"][node_id] = {"className": classes}

        # Extract layout from className
        w_match = WIDTH_PX_RE.search(classes)
        h_match = HEIGHT_PX_RE.search(classes)
        if w_match or h_match:
            result["node_layout"][node_id] = {
                "width": float(w_match.group(1)) if w_match else None,
                "height": float(h_match.group(1)) if h_match else None,
            }

        # Extract colors
        hex_colors = HEX_RE.findall(classes)
        rgba_matches = RGBA_RE.findall(classes)
        if hex_colors or rgba_matches:
            if "colors" not in result["node_styles"][node_id]:
                result["node_styles"][node_id]["colors"] = []
            result["node_styles"][node_id]["colors"] = (
                [f"#{c}" if len(c) <= 4 else f"#{c}" for c in hex_colors] + list(rgba_matches)
            )

        pos = m.end()

    return result


def map_to_classified(
    classified: ClassifiedData,
    parsed_dc: Dict[str, Any],
) -> ClassifiedData:
    """Map design context data to classified nodes. Returns ClassifiedData with enriched nodes."""
    node_styles = parsed_dc.get("node_styles", {})
    node_layout = parsed_dc.get("node_layout", {})
    global_assets = parsed_dc.get("global_assets", [])
    global_colors = parsed_dc.get("global_colors", [])

    enriched_nodes: List[EnrichedNode] = []
    for node in classified.nodes:
        id_colon = node.id_colon
        styles: Dict[str, str] = {}
        layout_dc: Optional[Dict[str, Any]] = None

        if id_colon in node_styles:
            s = node_styles[id_colon]
            if isinstance(s.get("className"), str):
                styles["className"] = s["className"]
            if "colors" in s:
                styles["colors"] = ",".join(s["colors"]) if isinstance(s["colors"], list) else str(s["colors"])

        if id_colon in node_layout:
            layout_dc = node_layout[id_colon]

        enriched = node.model_copy(deep=True)
        enriched.styles = {**enriched.styles, **styles}
        enriched.layout_dc = layout_dc
        enriched.assets = []  # Per-node assets would need deeper parsing
        enriched_nodes.append(enriched)

    return ClassifiedData(
        node_id=classified.node_id,
        source=classified.source,
        nodes=enriched_nodes,
        categories=classified.categories,
        generated_at=classified.generated_at,
        global_assets=global_assets,
        global_colors=global_colors,
    )


def run_stage2(
    design_context_path: Path,
    classified: ClassifiedData,
) -> ClassifiedData:
    """Run Stage 2: load design_context, parse, map to classified."""
    content = safe_read(design_context_path)
    if not content:
        return classified
    parsed = parse_design_context(content)
    return map_to_classified(classified, parsed)
