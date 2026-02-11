# Figma Design Audit Implementation Spec

요약: [AUDIT_SPEC_FINAL_V3.md](../../docs/figmaMCP/AUDIT_SPEC_FINAL_V3.md) 및 플랜 기반 구현.

## Pipeline

- Stage 1: metadata_raw → ClassifiedData (스택 파서)
- Stage 2: design_context_raw → Enriched (정규식, global_colors, global_assets)
- Stage 3: R003-C topology, R003-D dimension, R006 impl_plan, R001~R008 (colors, assets, fsd, traceability, styles, tokens)

## Usage

```bash
pip install -e .
figma-audit --node 794-3704
figma-audit --all --output report.json
```
