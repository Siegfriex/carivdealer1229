"""Color normalization for Figma vs code comparison (R001, R008)."""

import re
from typing import Optional

try:
    from webcolors import normalize_hex as _webcolors_normalize_hex
except ImportError:
    _webcolors_normalize_hex = None


def _normalize_hex_fallback(color: str) -> str:
    """Fallback when webcolors is not installed."""
    if not color or not color.startswith("#"):
        return color
    c = color.lstrip("#").lower()
    if len(c) == 3:
        c = "".join([x * 2 for x in c])
    return f"#{c}" if len(c) == 6 else color


def rgb_to_hex(rgb_str: str) -> str:
    """Convert rgba(255,255,255,1) or rgb(255,255,255) to #ffffff."""
    nums = re.findall(r"\d+", rgb_str)
    if len(nums) >= 3:
        r, g, b = map(int, nums[:3])
        return f"#{r:02x}{g:02x}{b:02x}"
    return rgb_str


def hex_to_rgba(hex_str: str) -> str:
    """Convert #RRGGBBAA (8-digit) to rgba(r,g,b,a)."""
    if not hex_str.startswith("#"):
        return hex_str
    c = hex_str.lstrip("#").lower()
    if len(c) == 8:
        r, g, b = int(c[0:2], 16), int(c[2:4], 16), int(c[4:6], 16)
        a = int(c[6:8], 16) / 255.0
        return f"rgba({r},{g},{b},{a:.2f})" if a < 1 else f"rgba({r},{g},{b},1)"
    return hex_str


def normalize_for_compare(color: str) -> str:
    """Normalize #fff, #FFFFFF, rgba(...) to #ffffff for comparison."""
    if not color:
        return ""
    color = color.strip()
    if color.startswith("#"):
        if _webcolors_normalize_hex:
            return _webcolors_normalize_hex(color)
        return _normalize_hex_fallback(color)
    if "rgba" in color or "rgb(" in color:
        return rgb_to_hex(color)
    return color


def colors_equivalent(figma: str, code: str) -> bool:
    """
    Compare Figma color vs code color.
    Returns False for var() or Tailwind (handled by R008 token logic).
    """
    if "var(" in code:
        return False
    # Tailwind-like: text-white, bg-primary etc. - skip literal comparison
    if "-" in code and "var(" not in code and not code.strip().startswith("#"):
        return False
    return normalize_for_compare(figma) == normalize_for_compare(code)
