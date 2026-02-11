# CTA_3 메타데이터·디자인 컨텍스트 사용 검증 분석

**분석일**: 2026-02-11  
**대상**: figma-design-audit 경고 (R003-D, R007) 메타데이터·design_context 사용 적합성

---

## 1. 검증 파이프라인 데이터 소스

| Stage | 입력 파일 | 파싱 결과 | 사용 Rule |
|-------|-----------|-----------|-----------|
| **Stage 1** | `mcp_outputs/{nodeId}/metadata_raw.txt` | EnrichedNode (bounds, parent_id) | R003-C, R003-D |
| **Stage 2** | `mcp_outputs/{nodeId}/design_context_raw.txt` | node_styles (className), global_assets, global_colors | R001, R002, R005, R007 |
| **코드** | SSOT §4 → TSX 파일 | data-node-id, className | 전체 비교 대상 |

### 1.1 metadata_raw.txt

- **출처**: Figma MCP `get_metadata` 호출 결과
- **형식**: XML-like `<frame id="794:4200" x="1893" y="290" width="1440" height="1516">`
- **파싱**: `stage1_metadata.py` → `EnrichedNode.bounds` (left, top, width, height), `parent_id`
- **R003-D 사용**: `node.bounds.width` ≥ min_width_px(100)인 노드에 대해, 코드에 `w-[Npx]` 또는 `w-full/flex-1` 존재 여부 검사

### 1.2 design_context_raw.txt

- **출처**: Figma MCP `get_design_context` 호출 결과 (Figma 생성 React/JSX)
- **형식**: `className="..." data-node-id="794:4200"` 형태
- **파싱**: `stage2_mapping.py` → `node_styles[node_id] = { className: "..." }`
- **R007 사용**: `node.styles["className"]`(design_context) vs `elem.classes`(실제 코드) 비교

---

## 2. 경고 의미 및 데이터 소스

### 2.1 R003-D (warn)

| 메시지 패턴 | 데이터 소스 | 의미 |
|-------------|-------------|------|
| `Fixed width not reflected: Figma 216.0px, code has no w-[Npx]` | **metadata** bounds.width | metadata(metadata_raw)의 노드 width가 부모 대비 95% 이상일 때 fill로 판단, 그 외는 fixed. fixed인데 코드에 w-[Npx] 없음 |
| `Width mismatch: Figma 1440px vs code 972px (>15% diff)` | metadata vs code | metadata width와 코드 w-[Npx] 값 차이 >15% |
| `Fill expected but no w-full/flex-1` | metadata | 부모 너비와 유사한 노드인데 코드에 w-full/flex-1 없음 |

**검증**: R003-D는 **metadata bounds**를 사용. design_context가 아님. 맞음.

### 2.2 R007 (info)

| 메시지 패턴 | 데이터 소스 | 의미 |
|-------------|-------------|------|
| `Node 794:3706: design context classes not fully in code: ['bg-[#f8f9fa]', 'size-full', 'relative']...` | **design_context** node_styles | design_context의 className 토큰 중 코드에 없는 것(차집합) |

**검증**: R007은 **design_context**의 `node_styles[node_id]["className"]`을 사용. 맞음.

---

## 3. CTA_3 노드별 경고 요약

### 3.1 R003-D (metadata 파생)

| 노드 | 데이터 소스 | 경고 예 |
|------|-------------|---------|
| 794-3704 | metadata 794:3706, 794:3713, 794:3725 | 216px, 250.46px |
| 794-4200 | metadata 794:4200, 794:4254~4259 | 1440px, 170px, 263px, 130px, 119px, 233px |
| 794-4371 | metadata | Width mismatch 1440 vs 280 |
| 1123-13580 | metadata | 1440px, 170px, 263px, 130px, 142px, 233px |
| 1123-20023 | metadata | 1440px, 434.5px, 100px |
| 1714-22332 | metadata | 1440px, 970px, 972px |

**해석**: metadata의 bounds.width는 Figma 노드 실제 픽셀 값. 코드가 `w-[971px]` 대신 `max-w`, `rounded-card`, 반응형 등으로 구현하면 R003-D 발생. **의도적 불일치** 가능(디자인 토큰·시맨틱 클래스 사용 시).

### 3.2 R007 (design_context 파생)

| 노드 | 데이터 소스 | 경고 예 |
|------|-------------|---------|
| 794-3704 | design_context 794:3706, 3708, 3712, 3713, 3724, 3725 | `bg-[#f8f9fa]`, `left-[calc(50%-108px)]`, `text-[#2048e5]` 등 |
| 794-4200 | design_context 794:4255~4259 | `w-[971px]`, `left-[calc(8.33%+176px)]`, `text-[#2048e5]` |
| 1123-13580 | design_context 1123:13635~13643 | `w-[971px]`, `text-[#2048e5]`, `overflow-clip` 등 |
| 1123-20023 | design_context 1123:20090~20097 | `text-[rgba(0,0,0,0.3)]`, `rounded-[30px]`, `w-[434.516px]` |

**해석**: design_context는 Figma MCP 생성 코드의 `className`. 코드가 `--color-primary`, `rounded-card`, `text-primary` 등 시맨틱 클래스로 대체하면 R007 발생. **의도적 불일치** 가능(design-tokens 적용 시).

---

## 4. 결론: 사용 적합성

| 항목 | 판정 | 근거 |
|------|------|------|
| **metadata 사용** | ✅ 적합 | R003-C, R003-D는 metadata_raw.txt bounds·parent_id 사용 |
| **design_context 사용** | ✅ 적합 | R001, R002, R005, R007은 design_context_raw.txt 파싱 결과 사용 |
| **코드 대상** | ✅ 적합 | SSOT §4 → TSX 파일 data-node-id, className 파싱 |

### 4.1 경고가 "맞다"는 의미

- **R003-D**: metadata( Figma bounds) 기준으로 코드에 `w-[Npx]` 또는 fill 클래스가 없으면 경고. **정확함**.
- **R007**: design_context(Figma 생성 className) 기준으로 코드에 없는 클래스가 있으면 info. **정확함**.

### 4.2 경고가 "기대와 다르다"는 의미

- 2번 에이전트가 `rounded-card`, `text-primary`, `--shadow-sale-choice-card` 등 **시맨틱 클래스**로 구현한 경우:
  - design_context는 `w-[971px]`, `left-[calc(8.33%+176px)]` 등 **픽셀 단위** 클래스
  - 검증기는 **문자열 매칭**만 수행 → var(), CSS 변수, 시맨틱 클래스로의 대체는 인식하지 못함
- 따라서 **R003-D, R007 경고는 예상 가능**하며, 디자인 토큰·시맨틱 클래스 전략과는 **의도적 불일치** 관계.

### 4.3 권장 사항

1. **R003-D**: `w-[971px]` 대신 `max-w-[971px]` 또는 `rounded-card`(CSS에서 971px) 사용 시, 검증기가 인식하려면 `w-[Npx]` 또는 `max-w-[Npx]` 형태가 코드에 있어야 함.
2. **R007**: severity가 info이므로, design_context와의 pixel-perfect 일치보다 **시맨틱·토큰 기반 구현**을 우선할 경우 무시 가능.
3. **파이프라인 개선 제안**: design-tokens 매핑 테이블(`--color-primary` ↔ `#2048e5`) 또는 시맨틱 클래스 매핑(`rounded-card` → `w-[971px]`)을 도입하면, R007/R003-D의 false positive를 줄일 수 있음.

---

*문서 버전: 1.0 | 최종 업데이트: 2026-02-11*
