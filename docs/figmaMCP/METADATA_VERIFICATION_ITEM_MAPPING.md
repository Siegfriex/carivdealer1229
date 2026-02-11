# 메타데이터 항목 ↔ 검증 규칙 매핑

**목적**: metadata_raw, design_context_raw의 실제 요소와 현 로직이 검증·검출하는 항목을 매핑.  
**기준**: stage1_metadata.py, stage2_mapping.py, code/parser.py, stage3_verifier.py

---

## 1. metadata_raw.txt 구조 (Figma MCP get_metadata)

### 1.1 원본 요소

| 요소 | 속성 | 예시 |
|------|------|------|
| **태그** | frame, text, rounded-rectangle, instance, line, vector, ellipse | `<frame id="794:3704" ...>` |
| **id** | 노드 식별자 (콜론 형식) | `794:3704` |
| **name** | 레이어 이름 | `D_ 판매 방식 선택` |
| **x** | 좌측 X 좌표 | `3525` |
| **y** | 상단 Y 좌표 | `290` |
| **width** | 너비 | `1440` |
| **height** | 높이 | `1024` |
| **계층** | 여는/닫는 태그로 추론 | `parent_id`, `children_ids` |

### 1.2 Stage 1 추출·정규화

| 출력 필드 | 원본 | 용도 |
|-----------|------|------|
| id | id (콜론→하이픈) | `794-3704` |
| id_colon | id | `794:3704` |
| name | name | 참조용 |
| category | tag → container/text/shape/component/line/icon | 참조용 |
| type | tag | 참조용 |
| parent_id | 스택 기반 계층 | R003-C |
| children_ids | 스택 기반 계층 | R003-C |
| depth | 스택 깊이 | 참조용 |
| bounds | (left, top, width, height) | R003-D |

---

## 2. design_context_raw.txt 구조 (Figma MCP get_design_context)

### 2.1 원본 요소

| 영역 | 패턴 | 예시 |
|------|------|------|
| **에셋** | `const imgX = "https://(www.)?figma.com/api/mcp/asset/..."` | imgLShoppingBag, imgLWallet |
| **노드** | `data-node-id="794:3704"` | JSX 각 요소 |
| **스타일** | `className="..."` | Tailwind 클래스 문자열 |
| **레이아웃** | w-[Npx], h-[Npx], left-[...], top-[...] | `w-[297.377px]` |
| **색상** | #hex, rgba(...), text-black | `text-[#2048e5]` |
| **효과** | rounded-[Npx], shadow-[...] | `rounded-[15px]` |
| **폰트** | font-['SUITE_Variable:ExtraBold'] | `font-['Pretendard:Medium']` |

### 2.2 Stage 2 추출·매핑

| 출력 | 정규식/로직 | 규칙 |
|------|-------------|------|
| **global_assets** | `const (\w+)= "https://(www\.)?figma\.com/api/mcp/asset/..."` | R002, R005 |
| **global_colors** | HEX_RE, RGBA_RE (전체 본문) | R001 |
| **node_styles[node_id].className** | data-node-id 앞 500자 내 className="..." | R007 |
| **node_styles[node_id].colors** | className 내 #hex, rgba(...) | R001 보조 |
| **node_layout[node_id]** | w-[Npx], h-[Npx] | 참조 (metadata bounds 우선) |

---

## 3. 코드(TSX) Parser 추출

| 출력 | 정규식/로직 | 규칙 |
|------|-------------|------|
| **node_id** | data-node-id="([^"]+)" | R003-C, R003-D, R001~R008 |
| **classes** | className="..." 또는 className={\`...\`} | R003-D, R001, R007, R008 |
| **parent_id** | 인덴트 기반 (같은 파일 내) | R003-C |
| **width_px** | w-[Npx], width: Npx | R003-D |
| **is_fill** | w-full, flex-1, flex-grow, self-stretch | R003-D |
| **file_path** | scope 반환 경로 | R004 |

---

## 4. 규칙별 검증·검출 항목

| Rule | 메타데이터 소스 | 디자인컨텍스트 소스 | 코드 소스 | 검증 내용 |
|------|-----------------|---------------------|-----------|-----------|
| **R003-C** | parent_id, children_ids, id_colon | — | node_id, parent_id | metadata (parent, child) = 코드 조상 체인 |
| **R003-D** | bounds.width, parent.bounds.width | — | width_px, is_fill | Fixed: w-[Npx] ±tolerance. Fill: w-full 등 |
| **R001** | — | global_colors | classes (hex, rgba) | global_colors → 코드 또는 design-tokens 반영 |
| **R002** | — | global_assets | — | global_assets → figma_image/ 또는 traceability |
| **R004** | — | — | file_path | FSD 레이어 (pages/widgets/entities/...) |
| **R005** | — | global_assets | — | global_assets → FIGMA_ASSET_TRACEABILITY 테이블 |
| **R006** | 페이지 node_id (classified.node_id) | — | — | impl_plans/{nodeId}_구현계획.md 존재 |
| **R007** | — | node_styles.className | classes | design_context classes ⊆ code classes |
| **R008** | — | — | classes (hex) | hex 하드코딩 → design-tokens(var) 권장 |

---

## 5. 추출·검증 매트릭스 (상세)

### 5.1 metadata_raw → 검증

| metadata 항목 | 추출 | R003-C | R003-D | R006 | 기타 |
|---------------|------|--------|--------|------|------|
| id | ○ | child 매칭 | — | 페이지 node_id (classified.node_id) | — |
| parent_id | ○ | parent 매칭 | Fill 휴리스틱 | — | — |
| children_ids | ○ | — | — | — | — |
| bounds.width | ○ | — | Fixed/Fill, tolerance | — | — |
| bounds.height | ○ | — | (미사용) | — | — |
| bounds.left, top | ○ | — | — | — | **미검증** |
| name | ○ | — | — | — | 참조만 |
| category, type | ○ | — | — | — | 참조만 |

### 5.2 design_context_raw → 검증

| design_context 항목 | 추출 | R001 | R002 | R005 | R007 | R008 |
|---------------------|------|------|------|------|------|------|
| const imgX = "url" | global_assets | — | ○ | ○ | — | — |
| #hex (전체) | global_colors | ○ | — | — | — | — |
| rgba(...) (전체) | global_colors | ○ | — | — | — | — |
| data-node-id | node_styles 키 | — | — | — | ○ | — |
| className (노드별) | node_styles.className | — | — | — | ○ | — |
| className 내 #hex | node_styles.colors | 보조 | — | — | — | — |
| w-[Npx], h-[Npx] | node_layout | — | — | — | — | — |
| left-[...], top-[...] | — | — | — | — | **미추출** | — |
| *(R008)* | *(코드 소스)* | — | — | — | — | *코드 classes (hex) — 5.3 참조* |
| rounded-[...] | — | — | — | — | **미추출** (className 일부) | — |
| shadow-[...] | — | — | — | — | **미추출** (className 일부) | — |
| font-['...'] | — | — | — | — | **미추출** (className 일부) | — |
| data-name | — | — | — | — | **미추출** | — |

### 5.3 코드(TSX) → 검증

| 코드 항목 | 추출 | R003-C | R003-D | R001 | R004 | R007 | R008 |
|-----------|------|--------|--------|------|------|------|------|
| data-node-id | node_id | ○ | ○ | — | — | ○ | — |
| className | classes | — | width_px, is_fill | hex, rgba | — | ○ | hex |
| file_path | — | — | — | — | ○ | — | — |
| import 경로 | — | — | — | — | **미추출** | — | — |

---

## 6. 현재 미검증·미추출 항목

| 소스 | 항목 | 비고 |
|------|------|------|
| metadata | x, y (bounds.left, top) | bounds는 있으나 위치 단독 검증 없음 |
| metadata | name | 참조만, 검증 규칙 없음 |
| design_context | left-[...], top-[...] | 절대 위치 — R007에서 className 전체 비교 시 간접 포함 |
| design_context | rounded-[Npx] | R007에서 className 전체 포함, 개별 검증 없음 |
| design_context | shadow-[...] | 동일 |
| design_context | font-['...'] | 동일 |
| design_context | data-name | 미추출 |
| code | style={{ width: N }} | WIDTH_PX_RE에 `width: Npx` 포함, inline style 검증 |
| code | import 문 | scope는 SSOT 기반, import 재귀 미구현 |

---

## 7. 문서 이력

| 버전 | 일자 | 비고 |
|------|------|------|
| 1.0 | 2026-02-11 | 메타데이터·디자인컨텍스트·검증 규칙 매핑 초안 |
| 1.1 | 2026-02-11 | ASSET_RE www. 허용, R006/R008 소스 명확화, 검증 결과 반영 |
