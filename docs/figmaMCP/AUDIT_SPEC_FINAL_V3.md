# Figma MCP Design Audit — 최종 설계 계획서 v3

**버전**: 3.0  
**기준**: 메타데이터 우선 → 범주화·정규화 → Design Context 매핑 → 디자인 검증 (R001~R008, C·D 포함)  
**웹 참조**: ETL Preprocessing, pdpipe stages, W3C DTCG, Figma REST API, axe-core, SARIF

---

## 1. 전체 플로우

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Stage 0: 입력 (CLI)                                                         │
│  --node 794-3704 [--scope /vehicles/:id/sale/analyzing] [--config ...]      │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Stage 1: 메타데이터 전처리 파이프라인 (Extract → Categorize → Normalize)    │
│  metadata_raw.txt → Parsed → Categorized → Normalized → classified.json     │
│  ※ 출력: parent_id, children_ids, depth — 위상( hierarchy) 검증용            │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Stage 2: Design Context 매핑                                                │
│  design_context_raw.txt → Parse → Map to Classified Data (data-node-id)      │
│  → Enriched Classified Data (classified + styles + assets + layout_dc)      │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  Stage 3: 디자인 검증기 (Rules Engine)                                        │
│  Enriched Classified Data + codebase + docs → R001~R008 → report.json        │
│  ※ R003: metadata_layout → R003-C(위상, critical) + R003-D(치수, warn) 분리   │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Stage 1: 메타데이터 전처리 파이프라인

### 2.1 ETL 패턴

| 단계 | 역할 | 구현 |
|------|------|------|
| Extract | metadata_raw.txt 읽기, XML 파싱 | load_metadata(path) |
| Transform | Categorize + Normalize | Categorizer, Normalizer |
| Load | classified.json 저장 | save_classified(path) |

### 2.2 Extract: Metadata Parser

- XML 파싱: `<frame|text|rounded-rectangle|instance|line|vector|ellipse>` 태그
- **계층( hierarchy)**: 여는/닫는 태그 스택으로 `parent_id` 추론 — **C. 위상 검증 필수**

### 2.3 Normalize 출력 (위상·치수 검증용)

| 항목 | 용도 |
|------|------|
| parent_id, children_ids | R003-C 위상 검증 |
| depth | 노드 깊이 |
| width, height | R003-D 치수 검증, Fixed/Fill 휴리스틱 |
| parent.width (추론) | Fill 판단: node.width ≈ parent.width (±5%) |

### 2.4 Classified Data 스키마 (W3C DTCG 스타일)

```json
{
  "$schema": "figma-audit-classified-v1",
  "nodeId": "794-3704",
  "source": "metadata_raw.txt",
  "generatedAt": "2026-02-11T00:00:00Z",
  "canvas": { "width": 1440, "height": 1024 },
  "nodes": [
    {
      "id": "794-3704",
      "idColon": "794:3704",
      "name": "D_ 판매 방식 선택",
      "category": "container",
      "type": "frame",
      "x": 3525,
      "y": 290,
      "width": 1440,
      "height": 1024,
      "depth": 0,
      "parentId": null,
      "childrenIds": ["794-3705"],
      "bounds": { "left": 3525, "top": 290, "right": 4965, "bottom": 1314 }
    },
    {
      "id": "794-3711",
      "parentId": "794-3710",
      "width": 297.38,
      "height": 279.73
    }
  ],
  "categories": { "container": 30, "text": 15, "shape": 12, "component": 8 }
}
```

---

## 3. Stage 2: Design Context 매핑

### 3.1 Design Context 파싱

| 추출 항목 | 패턴 | 출력 |
|-----------|------|------|
| 에셋 | `const\s+(\w+)\s*=\s*"https://figma\.com/api/mcp/asset/[^"]+"` | [(name, url)] |
| data-node-id | `data-node-id="([^"]+)"` | ["794:3704", ...] |
| left/top/w/h | `left-\[([^\]]+)\]`, `w-\[([^\]]+)\]` 등 | {node_id: {left, top, width, height}} |
| hex, rgba, shadow, rounded | 정규식 | styles |

### 3.2 Enriched Classified Data

- `map_design_context_to_classified()`: data-node-id로 노드별 styles, assets, layout_dc 매핑

---

## 4. Stage 3: 디자인 검증기 (Rules Engine)

### 4.1 추가 입력 (R003-C, R003-D용)

| 입력 | 출처 | 용도 |
|------|------|------|
| Scope | NODE_TO_ROUTE_AND_FILE, FSD_SPEC_BLUEPRINT | nodeId → 페이지 파일 경로 |
| Codebase | scope 내 TSX (페이지 + import 위젯 재귀) | data-node-id 트리, width 표현 |

### 4.2 규칙 (axe-core 스타일)

| Rule ID | 이름 | 검증 내용 | 심각도 |
|---------|------|-----------|--------|
| R001 | design_context_colors | Enriched.globalColors → 코드/토큰 반영 | critical |
| R002 | design_context_assets | Enriched.globalAssets → figma_image + FIGMA_ASSET_TRACEABILITY | critical |
| **R003-C** | **metadata_layout_topology** | **Classified hierarchy = 코드 DOM hierarchy** | **critical** |
| **R003-D** | **metadata_layout_dimension** | **Fixed/Fill → 코드 width (±10%)** | **warn** |
| R004 | fsd_placement | 상수·유틸 FSD 경로 준수 | critical |
| R005 | asset_traceability | FIGMA_ASSET_TRACEABILITY 필수 컬럼 | critical |
| R006 | impl_plan_exists | impl_plans/{nodeId}_구현계획.md 존재 | warn |
| R007 | node_styles_mapped | Enriched node.styles → 코드 반영 (선택) | info |
| R008 | design_tokens_mapping | SSOT_DESIGN_TOKENS 매핑 포함 | warn |

---

## 5. R003-C: 위상 검증 (Topology) — 필수

### 5.1 로직

```
Figma:  Node A (Parent) > Node B (Child)
Code:   <div data-node-id="A"> ... <div data-node-id="B"> ... </div> </div>
```

- **규칙**: metadata의 (parent, child) 쌍 중 **둘 다 코드에 존재**할 때, 코드에서 parent가 child의 **조상(ancestor)**이어야 함

### 5.2 검증 절차

1. **Classified**: `parent_id`, `children_ids` 이미 보유
2. **Code Parser**: scope(페이지 + 위젯) TSX → AST/정규식 → `data-node-id` 요소의 부모-자식 트리
3. **비교**: metadata (parent, child) 쌍 중 양쪽 모두 코드에 있으면 → 코드 DOM에서 parent가 child의 조상인지 확인
4. **실패**: 위상 불일치 → critical, 검증 실패

### 5.3 예외

- metadata에만 있는 노드: 검증 대상에서 제외
- 코드에만 있는 노드: 무시
- impl_plan 레이아웃 스펙 핵심 노드 부재: 별도 경고 (info)

---

## 6. R003-D: 치수 검증 (Dimension) — 느슨

### 6.1 Fixed vs Fill 휴리스틱 (metadata 기반)

- **Fill**: `node.width ≈ parent.width` (±5%)
- **Fixed**: 그 외

### 6.2 검증 규칙

| Figma 유형 | 코드 매칭 패턴 | 허용 오차 |
|------------|----------------|-----------|
| **Fixed** | `w-[NNpx]`, `width: NNpx`, `style={{ width: N }}` | ±10% |
| **Fill** | `w-full`, `flex-1`, `flex-grow`, `self-stretch` | N/A |

### 6.3 검증 절차

1. Classified 노드별 Fixed/Fill 분류
2. 해당 `data-node-id` 요소의 className/style 파싱
3. Fixed → px 추출, Figma width와 ±10% 비교
4. Fill → full/flex-1 등 패턴 존재 여부
5. **실패**: warn만 (Loose)

---

## 7. 디렉터리 구조

```
figma-design-audit/
├── pyproject.toml
├── audit.config.yaml
├── README.md
├── src/figma_audit/
│   ├── __init__.py
│   ├── cli.py
│   ├── config.py
│   ├── scope.py              # nodeId → route, page, file paths
│   │
│   ├── pipeline/
│   │   ├── __init__.py
│   │   ├── stage1_metadata.py
│   │   │   ├── extract.py
│   │   │   ├── categorize.py
│   │   │   └── normalize.py
│   │   ├── stage2_mapping.py
│   │   │   ├── parse_design_context.py
│   │   │   └── mapper.py
│   │   └── stage3_verifier.py
│   │       ├── rules/
│   │       │   ├── r001_colors.py
│   │       │   ├── r002_assets.py
│   │       │   ├── r003_topology.py    # C. 위상
│   │       │   ├── r003_dimension.py   # D. 치수
│   │       │   ├── r004_fsd.py
│   │       │   ├── r005_traceability.py
│   │       │   ├── r006_impl_plan.py
│   │       │   ├── r007_styles.py
│   │       │   └── r008_tokens.py
│   │       └── reporter.py
│   │
│   ├── code/
│   │   ├── parser.py         # TSX → data-node-id 트리 (import 재귀)
│   │   └── scope_resolver.py # NODE_TO_ROUTE → file paths
│   │
│   ├── models/
│   │   ├── classified.py
│   │   ├── enriched.py
│   │   └── finding.py
│   │
│   └── output/
│       ├── classified.json
│       ├── enriched.json
│       └── report.json
├── tests/
│   └── fixtures/794-3704/
└── docs/
    └── AUDIT_SPEC_FINAL_V3.md
```

---

## 8. 실행 흐름

```
$ python -m figma_audit --node 794-3704

[Stage 0] nodeId=794-3704, scope=/vehicles/:id/sale/analyzing

[Stage 1] metadata_raw.txt 로드
[Stage 1] Extract: 55 nodes 파싱
[Stage 1] Categorize: container 30, text 15, shape 12, component 8
[Stage 1] Normalize: parent_id, children_ids, depth → classified.json 저장

[Stage 2] design_context_raw.txt 로드
[Stage 2] Parse: 26 assets, 12 colors, 55 data-node-id
[Stage 2] Map: Enriched Classified Data 생성

[Stage 3] Scope: GeneralSaleAnalyzingPage.tsx, LandingHeader.tsx, ProgressSidebar.tsx, ...
[Stage 3] Code Parser: data-node-id 트리 추출 (페이지 + 위젯 재귀)
[Stage 3] R001: 2 findings (critical)
[Stage 3] R002: 21 findings (critical)
[Stage 3] R003-C Topology: 12/12 pairs OK (critical)
[Stage 3] R003-D Dimension: 2 warns (warn)
[Stage 3] R004~R008: ...

report.json, report.md 생성
Exit code: 2 (critical findings)
```

---

## 9. 캐시 전략

| 파일 | 조건 | 재사용 |
|------|------|--------|
| classified.json | metadata_raw.txt 변경 없음 | Stage 2, 3만 실행 |
| enriched.json | design_context_raw.txt 변경 없음 | Stage 3만 실행 |
| report.json | 항상 재생성 | — |

---

## 10. 요약

| Stage | 입력 | 출력 |
|-------|------|------|
| 1. 메타데이터 전처리 | metadata_raw.txt | classified.json (hierarchy 포함) |
| 2. Design Context 매핑 | classified.json + design_context_raw.txt | enriched.json |
| 3. 디자인 검증 | enriched.json + codebase + docs | report.json |

**v3 변경점**:
- R003을 **R003-C(위상, critical)** + **R003-D(치수, warn)**로 분리
- Code Parser·Scope Resolver 추가 (페이지 + 위젯 재귀)
- metadata Normalize 시 parent_id, children_ids, depth 필수 — 위상 검증용

---

*문서 버전: 3.0 | 최종 업데이트: 2026-02-11*
