"""Data models for Figma Design Audit pipeline."""

from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Literal, Any


class NodeBounds(BaseModel):
    """Bounds (left, top, width, height) for a node."""

    left: float
    top: float
    width: float
    height: float


class EnrichedNode(BaseModel):
    """Node from metadata + design context mapping."""

    id: str
    id_colon: str  # "794:3704"
    name: str
    category: Literal["container", "text", "shape", "component", "line", "icon", "unknown"]
    type: str

    # R003-C topology
    parent_id: Optional[str] = None
    children_ids: List[str] = Field(default_factory=list)
    depth: int = 0

    # R003-D dimension
    bounds: NodeBounds

    # Stage 2 mapped data
    styles: Dict[str, str] = Field(default_factory=dict)
    assets: List[str] = Field(default_factory=list)
    layout_dc: Optional[Dict[str, Any]] = None


class ClassifiedData(BaseModel):
    """Output of Stage 1 - classified metadata. Stage 2 adds global_assets, global_colors."""

    node_id: str  # "794-3704"
    source: str = "metadata_raw.txt"
    nodes: List[EnrichedNode] = Field(default_factory=list)
    categories: Dict[str, int] = Field(default_factory=dict)
    generated_at: Optional[str] = None
    global_assets: List[str] = Field(default_factory=list)
    global_colors: List[str] = Field(default_factory=list)


class Finding(BaseModel):
    """Single audit finding."""

    rule_id: str
    severity: Literal["critical", "warn", "info"]
    message: str
    node_id: Optional[str] = None
    file_path: Optional[str] = None
