"""Configuration loader for Figma Design Audit."""

import json
import yaml
from pathlib import Path
from typing import Any, Dict, Optional


def load_alias_map(project_root: Path, config: Dict[str, Any]) -> Dict[str, Dict[str, Any]]:
    """Load NODE_ALIAS_MAP.json. Returns {node_id: {aliases: [...], description: ...}}."""
    path_str = config.get("node_alias_map_path", "docs/figmaMCP/NODE_ALIAS_MAP.json")
    path = project_root / path_str
    if not path.exists():
        return {}
    try:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
        return data if isinstance(data, dict) else {}
    except Exception:
        return {}


def load_config(config_path: Optional[Path] = None) -> Dict[str, Any]:
    """Load audit.config.yaml."""
    if config_path is None:
        config_path = Path(__file__).parent.parent.parent / "audit.config.yaml"

    if not config_path.exists():
        return _default_config()

    try:
        with open(config_path, encoding="utf-8") as f:
            data = yaml.safe_load(f)
        return data if data else _default_config()
    except Exception:
        return _default_config()


def _default_config() -> Dict[str, Any]:
    return {
        "project_root": "..",
        "ssot_path": "docs/figma/FSD_IA_NODEID_SSOT.md",
        "node_alias_map_path": "docs/figmaMCP/NODE_ALIAS_MAP.json",
        "mcp_outputs_base": "docs/figmaMCP/mcp_outputs",
        "impl_plans_base": "docs/figmaMCP/impl_plans",
        "src_base": "src",
        "rules": {
            "r003_topology": {"severity": "critical"},
            "r003_dimension": {"severity": "warn", "tolerance_percent": 15, "min_width_px": 100},
            "r006_impl_plan": {"severity": "warn"},
            "r001_colors": {"severity": "critical"},
            "r002_assets": {"severity": "critical"},
            "r004_fsd": {"severity": "critical"},
            "r005_traceability": {"severity": "critical"},
            "r007_styles": {"severity": "info"},
            "r008_tokens": {"severity": "warn", "allow_jit": True},
        },
    }
