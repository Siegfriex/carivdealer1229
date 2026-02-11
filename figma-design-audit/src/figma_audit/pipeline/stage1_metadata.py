"""Stage 1: metadata_raw.txt parsing and normalization."""

import re
from pathlib import Path
from typing import List, Optional, Tuple

from ..models import EnrichedNode, NodeBounds, ClassifiedData
from ..utils import safe_read, get_logger

logger = get_logger()

CATEGORY_MAP = {
    "frame": "container",
    "text": "text",
    "rounded-rectangle": "shape",
    "instance": "component",
    "line": "line",
    "vector": "icon",
    "ellipse": "shape",
}

OPEN_TAG_RE = re.compile(
    r'<(frame|text|rounded-rectangle|instance|line|vector|ellipse)\s+id="([^"]+)"\s+name="([^"]*)"\s+x="([^"]+)"\s+y="([^"]+)"\s+width="([^"]+)"\s+height="([^"]+)"\s*(/?)>'
)
CLOSE_TAG_RE = re.compile(r'</(frame|text|rounded-rectangle|instance|line|vector|ellipse)>')


def _parse_attrs(match: re.Match) -> Tuple[str, str, str, str, str, str, str, bool]:
    """Extract (tag, id, name, x, y, width, height, self_closing) from match."""
    tag, node_id, name, x, y, w, h, self_closing = match.groups()
    return tag, node_id, name, x, y, w, h, bool(self_closing)


def parse_metadata(content: str) -> List[EnrichedNode]:
    """Parse metadata_raw content using stack-based parser."""
    nodes: List[EnrichedNode] = []
    stack: List[Tuple[str, str]] = []  # (node_id, tag)
    node_by_id: dict[str, EnrichedNode] = {}

    for line in content.split("\n"):
        # Check for self-closing or opening tag
        open_match = OPEN_TAG_RE.search(line)
        if open_match:
            tag, node_id, name, x, y, w, h, self_closing = _parse_attrs(open_match)
            parent_id = stack[-1][0] if stack else None
            parent_id_normalized = parent_id.replace(":", "-") if parent_id else None
            depth = len(stack)
            id_normalized = node_id.replace(":", "-")

            bounds = NodeBounds(
                left=float(x),
                top=float(y),
                width=float(w),
                height=float(h),
            )
            node = EnrichedNode(
                id=id_normalized,
                id_colon=node_id,
                name=name,
                category=CATEGORY_MAP.get(tag, "unknown"),
                type=tag,
                parent_id=parent_id_normalized,
                children_ids=[],
                depth=depth,
                bounds=bounds,
            )
            nodes.append(node)
            node_by_id[id_normalized] = node

            if parent_id_normalized and parent_id_normalized in node_by_id:
                node_by_id[parent_id_normalized].children_ids.append(id_normalized)

            if not self_closing:
                stack.append((node_id, tag))

            continue

        # Check for closing tag
        close_match = CLOSE_TAG_RE.search(line)
        if close_match:
            tag = close_match.group(1)
            if stack and stack[-1][1] == tag:
                stack.pop()

    return nodes


def run_stage1(
    metadata_path: Path,
    node_id: str,
) -> Optional[ClassifiedData]:
    """Run Stage 1: load metadata_raw, parse, return ClassifiedData."""
    content = safe_read(metadata_path)
    if not content:
        return None
    nodes = parse_metadata(content)
    categories: dict[str, int] = {}
    for n in nodes:
        cat = n.category
        categories[cat] = categories.get(cat, 0) + 1
    return ClassifiedData(
        node_id=node_id,
        source=str(metadata_path.name),
        nodes=nodes,
        categories=categories,
    )
