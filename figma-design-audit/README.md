# Figma Design Audit

Figma metadata, design context, and code verification engine for carivdealer.

## Install

```bash
cd figma-design-audit
pip install -e .
```

## Usage

```bash
# Single node
figma-audit --node 794-3704

# All nodes (mcp_outputs available)
figma-audit --all

# No cache
figma-audit --node 794-3704 --no-cache
```

## Pipeline

- **Stage 1**: metadata_raw.txt → Classified (stack-based parser)
- **Stage 2**: design_context_raw.txt → Enriched
- **Stage 3**: R003-C topology, R003-D dimension, R006 impl_plan verification
