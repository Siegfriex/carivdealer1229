"""CLI entrypoint for Figma Design Audit."""

import json
from pathlib import Path
from datetime import datetime

import click

from .config import load_config
from .utils import safe_read, get_logger
from .scope import resolve as scope_resolve
from .pipeline.stage1_metadata import run_stage1
from .pipeline.stage2_mapping import run_stage2
from .pipeline.stage3_verifier import run_stage3
from .code.parser import parse_codebase
from .models import ClassifiedData, Finding

logger = get_logger()


def _project_root(project_root_opt: str, config: dict) -> Path:
    """Resolve project root - cli option overrides config."""
    root = project_root_opt or config.get("project_root", "..")
    base = Path(__file__).parent.parent.parent  # figma-design-audit/
    return (base / root).resolve()


def _audit_node(
    node_id: str,
    project_root: Path,
    config: dict,
    no_cache: bool,
) -> tuple[list[Finding], int]:
    """Run full audit for one node. Returns (findings, exit_code)."""
    mcp_base = project_root / config.get("mcp_outputs_base", "docs/figmaMCP/mcp_outputs")
    impl_base = project_root / config.get("impl_plans_base", "docs/figmaMCP/impl_plans")
    ssot_path = project_root / config.get("ssot_path", "docs/figma/FSD_IA_NODEID_SSOT.md")
    src_base = config.get("src_base", "src")

    node_dir = mcp_base / node_id
    metadata_path = node_dir / "metadata_raw.txt"
    design_context_path = node_dir / "design_context_raw.txt"

    if not metadata_path.exists():
        logger.warning("metadata_raw.txt not found: %s", metadata_path)
        return [Finding(rule_id="R000", severity="critical", message=f"metadata_raw.txt not found: {metadata_path}")], 2

    classified: ClassifiedData | None = None
    from_cache = False
    if not no_cache:
        cache_path = node_dir / "classified.json"
        if cache_path.exists():
            cached = safe_read(cache_path)
            if cached:
                try:
                    classified = ClassifiedData.model_validate(json.loads(cached))
                    from_cache = True
                except Exception:
                    pass

    if classified is None:
        classified = run_stage1(metadata_path, node_id)
    if not classified:
        return [Finding(rule_id="R000", severity="critical", message="Stage 1 failed")], 2

    if not from_cache and not no_cache:
        (node_dir / "classified.json").write_text(
            classified.model_dump_json(indent=2),
            encoding="utf-8",
        )

    if design_context_path.exists():
        classified = run_stage2(design_context_path, classified)

    # Resolve code paths
    file_paths = scope_resolve(node_id, project_root, ssot_path, src_base)
    if not file_paths:
        logger.warning("No code files for node %s", node_id)
    code_map = parse_codebase(file_paths) if file_paths else {}

    findings = run_stage3(classified, code_map, impl_base, config, project_root=project_root)

    critical_count = sum(1 for f in findings if f.severity == "critical")
    if critical_count > 0:
        return findings, 2
    if findings:
        return findings, 1
    return findings, 0


@click.command()
@click.option("--node", "node_id", help="Node ID (e.g. 794-3704)")
@click.option("--all", "audit_all", is_flag=True, help="Audit all nodes with mcp_outputs")
@click.option("--config", "config_path", type=click.Path(exists=True), default=None)
@click.option("--project-root", default=None)
@click.option("--no-cache", is_flag=True, help="Ignore cached classified.json")
@click.option("--output", "output_path", type=click.Path(), default=None, help="Write report.json")
def cli(
    node_id: str | None,
    audit_all: bool,
    config_path: str | None,
    project_root: str | None,
    no_cache: bool,
    output_path: str | None,
):
    """Figma Design Audit - metadata, design context, code verification."""
    config = load_config(Path(config_path) if config_path else None)
    proj_root = _project_root(project_root or "", config)

    if audit_all:
        mcp_base = proj_root / config.get("mcp_outputs_base", "docs/figmaMCP/mcp_outputs")
        node_ids = [
            d.name for d in mcp_base.iterdir()
            if d.is_dir() and (d / "metadata_raw.txt").exists() and d.name != "README.md"
        ]
        if not node_ids:
            logger.warning("No nodes with metadata in %s", mcp_base)
            raise SystemExit(1)
    elif node_id:
        node_ids = [node_id]
    else:
        click.echo("Use --node 794-3704 or --all")
        raise SystemExit(1)

    all_findings: list[Finding] = []
    exit_code = 0
    for nid in node_ids:
        click.echo(f"\n[Audit] {nid}")
        findings, ec = _audit_node(nid, proj_root, config, no_cache)
        all_findings.extend(findings)
        exit_code = max(exit_code, ec)
        for f in findings:
            click.echo(f"  [{f.rule_id}] {f.severity}: {f.message}")

    report = {
        "generated_at": datetime.utcnow().isoformat() + "Z",
        "node_ids": node_ids,
        "findings": [f.model_dump() for f in all_findings],
        "critical_count": sum(1 for f in all_findings if f.severity == "critical"),
        "warn_count": sum(1 for f in all_findings if f.severity == "warn"),
    }
    if output_path:
        Path(output_path).write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding="utf-8")
        click.echo(f"\nReport: {output_path}")

    raise SystemExit(exit_code)
