"""Utilities for Figma Design Audit."""

import logging
from pathlib import Path
from typing import Optional

logger = logging.getLogger("figma_audit")


def safe_read(path: Path, encoding: str = "utf-8") -> Optional[str]:
    """Read file with UTF-8 encoding. Returns None on failure."""
    try:
        return path.read_text(encoding=encoding)
    except Exception as e:
        logger.warning("Failed to read %s: %s", path, e)
        return None


def get_logger(name: str = "figma_audit") -> logging.Logger:
    """Get or create logger."""
    log = logging.getLogger(name)
    if not log.handlers:
        handler = logging.StreamHandler()
        handler.setFormatter(logging.Formatter("%(levelname)s: %(message)s"))
        log.addHandler(handler)
        log.setLevel(logging.INFO)
    return log


def resolve_path(base: Path, *parts: str) -> Path:
    """Resolve path parts relative to base."""
    return (base / Path(*parts)).resolve()
