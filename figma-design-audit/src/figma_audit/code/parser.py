"""TSX code parser - extracts data-node-id, className, parent from JSX."""

import re
from pathlib import Path
from typing import Dict, List, Optional
from dataclasses import dataclass

from ..utils import safe_read, get_logger

logger = get_logger()

DATA_NODE_ID_RE = re.compile(r'data-node-id="([^"]+)"')
CLASSNAME_RE = re.compile(r'className="([^"]*)"|className=\{`([^`]+)`\}|className=\{[^}]+\}')
WIDTH_PX_RE = re.compile(r'w-\[([\d.]+)px\]|width:\s*([\d.]+)px')
FILL_RE = re.compile(r'\b(w-full|flex-1|flex-grow|self-stretch)\b')


@dataclass
class CodeElement:
    """Parsed element from code with data-node-id."""

    node_id: str
    classes: List[str]
    parent_id: Optional[str]
    file_path: str
    indent: int
    width_px: Optional[float] = None
    is_fill: bool = False


def _get_indent(line: str) -> int:
    """Return leading whitespace length."""
    return len(line) - len(line.lstrip())


def _find_safe_tag_start(lines: List[str], line_idx: int) -> int:
    """
    Find the line index where the tag containing data-node-id starts.
    Filters out generic (<T>), arithmetic (x < y), and closing tags (</).
    """
    for i in range(line_idx, max(-1, line_idx - 50), -1):
        line = lines[i]
        # 1. Skip obvious code context (line ends with ; or =)
        if re.search(r'[;=]\s*$', line.strip()):
            continue
        # 2. Tag start: <div, <Component (exclude closing </)
        if re.search(r'<\s*(?!/)([a-zA-Z][\w\.]*)', line):
            return i
    return line_idx


def _extract_classname_robust(lines: List[str], start_idx: int, end_idx: int) -> str:
    """
    Extract className from tag block. Handles className="..." and className={`...`}.
    Removes ${...} interpolation for template literals.
    """
    block = " ".join(lines[start_idx : end_idx + 1])
    matches: List[str] = []
    # 1. className="flex relative"
    for m in re.finditer(r'className\s*=\s*"([^"]+)"', block):
        matches.append(m.group(1))
    # 2. className={`flex ${cond ? 'a' : 'b'}`} -> extract fixed part
    for m in re.finditer(r'className\s*=\s*\{`([^`]+)`\}', block):
        cleaned = re.sub(r'\$\{[^}]+\}', '', m.group(1)).strip()
        if cleaned:
            matches.append(cleaned)
    return matches[-1].strip() if matches else ""


def _extract_classname_from_context(lines: List[str], line_idx: int) -> str:
    """Extract className from the tag containing data-node-id (multi-line safe)."""
    start = _find_safe_tag_start(lines, line_idx)
    return _extract_classname_robust(lines, start, line_idx)


def _extract_width_and_fill(classes: str) -> tuple[Optional[float], bool]:
    """Extract width in px and fill flag from class string."""
    width_px = None
    w_match = WIDTH_PX_RE.search(classes)
    if w_match:
        width_px = float(w_match.group(1) or w_match.group(2) or 0)
    is_fill = bool(FILL_RE.search(classes))
    return width_px, is_fill


def parse_file(file_path: Path) -> List[tuple[str, int, str, str]]:
    """
    Parse single TSX file. Returns list of (node_id, indent, classes, file_path_str).
    """
    content = safe_read(file_path)
    content = content or ""
    lines = content.split("\n")
    result: List[tuple[str, int, str, str]] = []
    path_str = str(file_path)

    for i, line in enumerate(lines):
        for m in DATA_NODE_ID_RE.finditer(line):
            node_id = m.group(1)
            indent = _get_indent(line)
            for j in range(i, max(-1, i - 15), -1):
                if re.search(r'^\s*<[a-zA-Z]', lines[j]):
                    indent = _get_indent(lines[j])
                    break
            classes = _extract_classname_from_context(lines, i)
            result.append((node_id, indent, classes, path_str))

    return result


def parse_codebase(file_paths: List[Path]) -> Dict[str, CodeElement]:
    """
    Parse all TSX files. Returns {node_id: CodeElement}.
    Parent = last node with strictly smaller indent in same file.
    Only data-node-id elements are pushed to stack — Fragment/<> and
    data-node-id-less wrappers are effectively transparent (Ghost Node).
    For duplicate node_ids across files, later file overwrites.
    """
    code_map: Dict[str, CodeElement] = {}
    seen_in_file: Dict[str, List[tuple[str, int]]] = {}  # file -> [(node_id, indent)]

    for path in file_paths:
        items = parse_file(path)
        path_str = str(path)
        if path_str not in seen_in_file:
            seen_in_file[path_str] = []
        for node_id, indent, classes, _ in items:
            # Parent = last node with indent < current in same file
            candidates = [(n, ind) for n, ind in seen_in_file[path_str] if ind < indent]
            parent_id = candidates[-1][0] if candidates else None
            width_px, is_fill = _extract_width_and_fill(classes)
            class_list = classes.split() if classes else []
            elem = CodeElement(
                node_id=node_id,
                classes=class_list,
                parent_id=parent_id,
                file_path=path_str,
                indent=indent,
                width_px=width_px,
                is_fill=is_fill,
            )
            code_map[node_id] = elem
            seen_in_file[path_str].append((node_id, indent))

    return code_map


def get_ancestor_chain(code_map: Dict[str, CodeElement], node_id: str) -> List[str]:
    """Get list of ancestor node_ids (from parent to root).
    Skips parent_id not in code_map (defensive for future extensions).
    """
    chain: List[str] = []
    current: Optional[str] = node_id
    visited = set()
    while current and current not in visited:
        visited.add(current)
        elem = code_map.get(current)
        if not elem or not elem.parent_id:
            break
        if elem.parent_id not in code_map:
            break  # Ghost node / defensive
        chain.append(elem.parent_id)
        current = elem.parent_id
    return chain
