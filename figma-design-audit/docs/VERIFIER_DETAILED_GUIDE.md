# Figma Design Audit 검증기 — 상세 가이드

**대상**: 처음 보는 사람도 이해할 수 있도록 알고리즘·처리 과정·입출력·IPOE·기대효과를 세세히 설명함.

---

## 1. 이게 뭐지? (What is it?)

**Figma Design Audit 검증기**는 **Figma 디자인과 실제 React/TSX 코드가 일치하는지** 자동으로 검사하는 Python CLI 도구입니다.

- **목적**: Figma MCP(1번·2번 에이전트)가 생성한 디자인 컨텍스트가, 실제 코드베이스에 올바르게 반영되었는지 검증
- **위치**: `figma-design-audit/` 패키지
- **실행**: `figma-audit --node 794-3704` 형식으로 단일 노드 검증, `--all`로 전체 검증

---

## 2. 인풋 조건 (Input Conditions)

### 2.1 필수 인풋

| 인풋 | 경로 | 설명 | 형식 |
|------|------|------|------|
| **metadata_raw.txt** | `docs/figmaMCP/mcp_outputs/{nodeId}/metadata_raw.txt` | Figma 노드 계층·위치·크기 | XML 유사 태그 (frame, text, rounded-rectangle 등) |
| **node_id** | CLI `--node` 옵션 | 검증 대상 Figma 노드 ID | `794-3704` 또는 `794:3704` |

### 2.2 선택 인풋

| 인풋 | 경로 | 설명 |
|------|------|------|
| **design_context_raw.txt** | `docs/figmaMCP/mcp_outputs/{nodeId}/design_context_raw.txt` | Figma MCP가 생성한 React 유사 코드 (className, data-node-id, asset URL) |
| **classified.json** | `docs/figmaMCP/mcp_outputs/{nodeId}/classified.json` | Stage 1 캐시 (재실행 시 건너뜀) |
| **FSD_IA_NODEID_SSOT.md** | `docs/figma/FSD_IA_NODEID_SSOT.md` | nodeId ↔ 코드 참조 매핑 표 (§4) |
| **impl_plans** | `docs/figmaMCP/impl_plans/{nodeId}_구현계획.md` | 구현 계획서 존재 여부 검증용 |
| **design-tokens.css** | `src/shared/styles/design-tokens.css` | 색상 토큰 검증용 |
| **FIGMA_ASSET_TRACEABILITY.md** | `docs/figmaMCP/FIGMA_ASSET_TRACEABILITY.md` | 에셋 추적성 검증용 |

### 2.3 인풋 예시

**metadata_raw.txt** (일부):
```xml
<frame id="794:3704" name="D_ 판매 방식 선택" x="3525" y="290" width="1440" height="1024">
<frame id="794:3705" name="Frame 2087328328" x="298.375" y="210.40234375" width="971.70703125" height="712.9296875">
<text id="794:3706" name="title" x="377.85" y="121.85" width="216" height="61" />
...
```

**design_context_raw.txt** (일부):
```javascript
const imgLShoppingBag = "https://www.figma.com/api/mcp/asset/...";
...
<div className="bg-[#f8f9fa] relative size-full" data-node-id="794:3704">
<p className="absolute ... text-[38px] ..." data-node-id="794:3706">판매 방식 선택</p>
```

---

## 3. 아웃풋 산출 (Output)

### 3.1 형태

| 형태 | 경로 | 설명 |
|------|------|------|
| **report.json** | `--output` 지정 경로 (예: `docs/figmaMCP/report_794-3704.json`) | JSON 보고서 |
| **Exit Code** | 프로세스 종료 코드 | 0=통과, 1=warn만, 2=critical 있음 |
| **콘솔 출력** | 표준출력 | findings 한 줄씩 `[R003-D] warn: ...` |

### 3.2 report.json 구조

```json
{
  "generated_at": "2026-02-11T07:53:16.115999Z",
  "node_ids": ["794-3704"],
  "findings": [
    {
      "rule_id": "R003-D",
      "severity": "warn",
      "message": "Fixed width not reflected: Figma 216.0px, code has no w-[Npx]",
      "node_id": "794:3706",
      "file_path": null
    },
    ...
  ],
  "critical_count": 4,
  "warn_count": 6
}
```

### 3.3 Finding(발견) 구조

| 필드 | 설명 |
|------|------|
| `rule_id` | 검증 규칙 ID (R001~R008, R003-C, R003-D, R006) |
| `severity` | `critical` / `warn` / `info` |
| `message` | 사람이 읽을 수 있는 오류 설명 |
| `node_id` | 관련 Figma 노드 ID (선택) |
| `file_path` | 수정 대상 코드 파일 경로 (선택) |

---

## 4. 처리 과정 (Pipeline / 알고리즘)

전체 파이프라인은 **3단계(Stage 1 → 2 → 3)** 로 구성됩니다.

```
[metadata_raw.txt] ──Stage1──▶ [ClassifiedData]
                                     │
[design_context_raw.txt] ──Stage2──▶ [Enriched ClassifiedData]
                                     │
[SSOT §4] ──Scope──▶ [file_paths] ──Code Parser──▶ [code_map]
                                     │
                                     ▼
[Stage 3] ◀── ClassifiedData + code_map + impl_plans + config
     │
     ▼
[findings] → report.json
```

### 4.1 Stage 1: 메타데이터 파싱 (metadata_raw.txt → ClassifiedData)

**역할**: Figma 메타데이터를 구조화된 노드 트리로 변환.

**알고리즘**:
1. **스택 기반 파서**: XML 유사 태그를 줄 단위로 순회
2. **정규식**: `OPEN_TAG_RE`로 `<frame id="X" name="Y" x="..." y="..." width="..." height="...">` 추출
3. **부모-자식 추적**: `stack`에 현재 열린 태그를 쌓고, `</tag>`에서 pop
4. **노드 생성**: 각 노드에 `id`, `parent_id`, `children_ids`, `bounds`, `category` 저장
5. **카테고리 맵핑**: `frame`→container, `text`→text, `rounded-rectangle`→shape 등

**출력**: `ClassifiedData` (node_id, nodes[], categories{})

---

### 4.2 Stage 2: 디자인 컨텍스트 매핑 (design_context_raw.txt → Enriched)

**역할**: Figma MCP가 생성한 React 유사 코드에서 스타일·레이아웃·에셋을 추출해 ClassifiedData에 병합.

**알고리즘**:
1. **정규식 추출**:
   - `ASSET_RE`: `const imgX = "https://figma.com/..."`
   - `DATA_NODE_ID_RE`: `data-node-id="794:3706"`
   - `CLASSNAME_RE`: `className="..."`
   - `WIDTH_PX_RE`, `HEIGHT_PX_RE`: `w-[297px]`, `h-[58px]`
   - `HEX_RE`, `RGBA_RE`: `#2048e5`, `rgba(0,0,0,0.8)`
2. **노드별 매핑**: `data-node-id` 기준으로 `node_styles`, `node_layout`에 저장
3. **전역 수집**: `global_assets`, `global_colors` 목록 생성
4. **병합**: 각 EnrichedNode에 `styles`, `layout_dc`, `assets` 필드 추가

**출력**: `ClassifiedData` (기존 + global_assets, global_colors, 노드별 styles/layout_dc)

---

### 4.3 Scope Resolver: nodeId → 코드 경로

**역할**: SSOT §4 테이블에서 nodeId에 해당하는 코드 참조를 찾아 실제 파일 경로로 변환.

**알고리즘**:
1. `FSD_IA_NODEID_SSOT.md`의 `## §4 Node 상세 매핑` 섹션 파싱
2. 마크다운 테이블에서 `| nodeId | ... | 코드 참조 |` 컬럼 추출
3. `resolve_code_ref()`: `pages/admin/sale/GeneralSaleAnalyzingPage.tsx` → `src/pages/admin/sale/GeneralSaleAnalyzingPage.tsx`
4. 와일드카드 처리: `widgets/*` → `widgets/*/ui/*.tsx` glob

**출력**: `List[Path]` (예: `[src/pages/admin/sale/GeneralSaleAnalyzingPage.tsx, ...]`)

---

### 4.4 Code Parser: TSX → code_map

**역할**: TSX 파일에서 `data-node-id`가 있는 요소를 추출하고, className·width·부모를 파싱.

**알고리즘**:
1. `DATA_NODE_ID_RE`: `data-node-id="794:3706"` 매칭
2. **부모 추적**: 같은 파일 내 `indent`(들여쓰기) 기준으로 부모 노드 결정
3. **className 추출**: `className="..."` 또는 `className={\`...\`}` (템플릿 리터럴)
4. **width_px, is_fill**: `w-[297px]`, `w-full`, `flex-1` 등 추출
5. **CodeElement**: node_id, classes, parent_id, file_path, width_px, is_fill

**출력**: `Dict[node_id, CodeElement]` (code_map)

---

### 4.5 Stage 3: 규칙 검증 (R001~R008)

**역할**: ClassifiedData와 code_map을 비교해 9개 규칙을 적용.

| 규칙 | 검증 내용 | 심각도 |
|------|-----------|--------|
| **R001** | globalColors가 코드 또는 design-tokens.css에 반영되었는지 | critical |
| **R002** | globalAssets가 figma_image 또는 FIGMA_ASSET_TRACEABILITY에 있는지 | critical |
| **R003-C** | Figma 부모-자식 위상이 코드 DOM의 ancestor-descendant와 일치하는지 | critical |
| **R003-D** | Figma 고정/채움(Fill) 치수가 코드 w-[Npx]/w-full에 반영되었는지 | warn |
| **R004** | 파일 경로가 FSD(pages, widgets, entities, features, shared) 준수 | critical |
| **R005** | 각 global_asset이 FIGMA_ASSET_TRACEABILITY에 등록되었는지 | critical |
| **R006** | impl_plan 파일 존재 여부 | warn |
| **R007** | design context의 className이 코드에 반영되었는지 (정보성) | info |
| **R008** | 하드코딩 hex/rgba 대신 design tokens 사용 권장 | warn |

**처리 흐름**:
1. `run_stage3()`가 9개 `verify_r00X_*` 함수를 순차 호출
2. 각 함수는 `findings: List[Finding]`를 반환
3. `findings`를 합쳐 `critical_count`, `warn_count` 계산
4. Exit Code: critical ≥ 1 → 2, warn만 → 1, 없음 → 0

---

## 5. IPOE가 뭐지?

**IPOE**는 **I·P·O·E**의 약자로, 프로젝트 문서 `IA_SITEMAP_SPEC_IPOE.md`에서 정의한 **기능별 4블록** 명세 형식입니다.

| 구분 | 의미 | 예시(랜딩) |
|------|------|------------|
| **I** (Input) | 진입 조건, 입력 | `/` 진입, 스크롤/CTA 클릭 |
| **P** (Process) | 처리 과정 | 로그인전_풀뷰 → Hero중심 → 알림노출 |
| **O** (Output) | 출력/결과 | 화면: 랜딩 3단계, 라우트 `/` |
| **E** (Exception) | 예외 처리 | 알림 미노출 시 Hero중심에서 유지 |

**검증기와의 관계**:
- 검증기는 **IPOE 명세를 직접 검증하지 않습니다**
- IPOE는 **IA 기능명세(사이트맵, 플로우)** 정의용이며, SSOT에서 **nodeId ↔ 코드 참조** 매핑을 제공
- 검증기는 이 매핑을 활용해 **Figma 노드 ↔ 코드** 일치성만 검증

즉, **IPOE = 기능 설계 형식**, **검증기 = 디자인-코드 일치성 검사 도구**입니다.

---

## 6. 기대효과

### 6.1 직접적 효과

| 효과 | 설명 |
|------|------|
| **디자인-코드 일치성 보장** | Figma와 코드가 위상·치수·색상·에셋에서 일치하는지 자동 검증 |
| **회귀 방지** | 코드 수정 후 `figma-audit --all`로 전체 노드 검증하여 회귀 발견 |
| **3번 에이전트 자동화** | report.json만으로 Phase A/B/C 분기하여 수정 여부 결정 |
| **FSD·토큰 준수** | FSD 레이어, design tokens 사용을 강제 |

### 6.2 간접적 효과

| 효과 | 설명 |
|------|------|
| **mcp_outputs 품질 관리** | Figma MCP 산출물(metadata_raw, design_context_raw) 검증 |
| **문서-코드 동기화** | SSOT, impl_plan, FIGMA_ASSET_TRACEABILITY 유지보수 유도 |
| **CI/CD 연동** | Exit Code로 빌드 실패/경고 처리 가능 |

### 6.3 사용 시나리오

1. **개발자**: 새 화면 구현 후 `figma-audit --node {nodeId}`로 검증
2. **에이전트**: report.json 기반으로 critical 수정, warn 판단
3. **CI**: `figma-audit --all` 실행 후 Exit 2면 빌드 실패

---

## 7. 실행 방법

```powershell
cd c:\carivdealer\figma-design-audit
pip install -e .

# 단일 노드
figma-audit --node 794-3704

# 전체 노드
figma-audit --all

# 캐시 무시
figma-audit --node 794-3704 --no-cache

# JSON 리포트 저장
figma-audit --node 794-3704 --output c:\carivdealer\docs\figmaMCP\report_794-3704.json
```

---

## 8. 문서 이력

| 버전 | 일자 | 비고 |
|------|------|------|
| 1.0 | 2026-02-11 | 처음 보는 사람용 상세 가이드 초안 |
