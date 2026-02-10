# Figma 디자인 구현 에이전트 프롬프트 템플릿 (2번 에이전트용)

**역할**: MCP는 호출하지 않는다. `mcp_outputs/{nodeId}/` 에 이미 사용자가 채워 둔 metadata_raw.txt·design_context_raw.txt만 read_file로 읽고, Phase 4~7(구현 계획·코드·검증·로그)을 수행한다.

**사용법**: 1번 에이전트로 MCP 호출 후, 사용자가 위 두 파일에 UI에서 복사한 내용을 붙여넣기까지 한 상태에서 사용한다. 아래 "복사할 프롬프트(상수)" 블록 전체를 복사하여 사용자 발화 뒤에 붙여 넣는다. **사용자가 넣는 프롬프트 형식은 그대로**: `Implement this design from Figma.` + `@Figma URL` + (아래 상수).

**사용자 발화 예시** (변수는 Figma URL만 바꾸면 됨):
```
Implement this design from Figma.
@https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1444-7928&m=dev
<여기에 아래 2번 에이전트 상수 프롬프트 붙여넣기>
```

---

## 복사할 프롬프트 (상수) — 2번 에이전트

```
이 디자인은 프로젝트의 Figma SSOT 워크플로에 따라 구현한다.

[중요] MCP 호출 금지 · 저장된 파일만 사용
- 이번 턴에서는 get_metadata / get_design_context / get_screenshot 등 Figma MCP를 호출하지 않는다.
- docs/figmaMCP/mcp_outputs/{nodeId하이픈}/ 에 이미 metadata_raw.txt, design_context_raw.txt가 사용자에 의해 채워져 있거나, **해당 파일 안에 실제 내용이 들어있지 않고 외부 경로(예: agent-tools\<uuid>.txt) 한 줄만 적혀 있는 경우**가 있다. 그때는 "없다"고 하지 말고, 그 경로를 read_file로 열어 그 내용을 metadata/design_context로 사용한다.
- 구현·계획·에셋 추출의 근거는 반드시 read_file로 mcp_outputs 파일(또는 그 안에 적힌 경로의 파일)을 읽은 내용만 사용한다.
- design_context_raw.txt(또는 해당 경로가 가리키는 파일)가 매우 길면 offset/limit으로 앞·중간·뒤를 나눠 읽고, 각 구간에서 XML·에셋 URL·생성 코드·스타일을 추출한 뒤 종합하여 사용한다.

1) URL에서 식별자 추출
- 제공된 Figma URL에서 fileKey와 nodeId를 추출한다. node-id=1444-7928 형식이면 nodeId 하이픈은 1444-7928이다. fileKey는 URL 경로의 design/ 다음 값(예: 4w3ft8RpGwoho5EtvNO9hQ)이다.

2) 문서 기준
- 모든 절차와 매핑은 docs/figmaMCP 폴더를 기준으로 한다. 반드시 읽을 문서: docs/figmaMCP/README.md, docs/figmaMCP/WORKFLOW.md, docs/figmaMCP/NODE_TO_ROUTE_AND_FILE.md, docs/figmaMCP/MCP_RESPONSE_CHECKLIST.md.

3) mcp_outputs 파일 읽기 (MCP 호출 없음)
- docs/figmaMCP/mcp_outputs/{nodeId하이픈}/metadata_raw.txt 를 read_file로 전부 읽고, 그 내용으로 노드 트리·구조를 파악한다.
- docs/figmaMCP/mcp_outputs/{nodeId하이픈}/design_context_raw.txt 를 read_file로 읽는다. 길면 구간별로 여러 번 읽고, 에셋 URL·생성 코드·디자인 스타일·구현 지침을 추출해 종합한다.
- **외부 경로(agent-tools) 처리**: mcp_outputs 내 metadata_raw.txt 또는 design_context_raw.txt를 읽었을 때, 내용이 한두 줄이고 그 줄이 파일 경로처럼 보이면(예: `C:\...\agent-tools\<uuid>.txt`, `...agent-tools\...txt`, 또는 "Output has been written to: ..." 형식) "없다"고 가정하지 말고, **그 경로를 read_file로 열어** 실제 메타데이터/디자인 컨텍스트로 사용한다. 사용자가 프롬프트에 "design_context는 ...agent-tools\xxx.txt에 있다"고 적어 둔 경우에도 해당 경로를 read_file로 읽어서 사용한다. 경로는 절대경로 또는 워크스페이스 기준 경로로 전달될 수 있으므로, read_file에 그대로 넘겨 읽는다.
- MCP_RESPONSE_CHECKLIST.md 범주별로 읽은 내용의 수신 여부를 점검한다. 구현 결정은 위에서 읽은 파일 내용(또는 외부 경로에서 읽은 내용)만으로 한다.

4) 단계별 워크플로 (WORKFLOW.md Phase 0~7)
- Phase 0: NODE_TO_ROUTE_AND_FILE.md로 해당 nodeId의 라우트·페이지 컴포넌트·FIGMASCR0208 스크린샷 경로를 확정한다.
- Phase 1: read_file로 metadata_raw.txt 전체 읽기 → 체크리스트로 A·B 범주 확인. (MCP 호출 없음)
- Phase 2: read_file로 design_context_raw.txt 읽기(길면 구간별로) → A~H 범주 확인, 에셋 URL·코드·스타일 추출. (MCP 호출 없음)
- Phase 3: 해당 nodeId의 FIGMASCR0208 이미지 경로를 확정하고, 있을 경우 mcp_outputs 내 스크린샷과 비교한다. 불일치 시 Figma 디자인을 시각적 기준으로 한다.
- Phase 4: (읽은 design_context·metadata만 근거로) docs/figmaMCP/impl_plans/{nodeId하이픈}_구현계획.md를 작성한다. 목표, 변경 대상 파일, 의존성, MCP 스타일→디자인 토큰 매핑, 위험/주의사항에 더해, metadata와 design_context에서 추출한 노드별 (x, y, width, height) 테이블을 "레이아웃 스펙" 섹션에 반드시 넣는다. impl_plans/README.md와 _template_impl_plan.md를 참고한다.
- Phase 5 (에셋 다운로드·import·연동, 필수): (읽은 design_context에서 추출한) 이미지·에셋 URL(라이브러리 등)을 만료 전에 다운로드하여 src/shared/figma_image/(또는 프로젝트 규칙에 맞는 경로)에 저장한다. 파일명은 nodeId_용도_원본이름 형식(예: 1444-7928_검색_search.png)을 권장한다. 이어서 **해당 에셋을 사용할 컴포넌트**(NODE_TO_ROUTE_AND_FILE·구현 계획서 기준, 예: LandingHeader)를 정하고, 그 파일에서 import한 뒤 JSX에 직접 연동한다. 예: 검색 버튼·GNB의 탁송·정산 등 디자인에서 지정한 위치에 <img src={...} /> 또는 import한 이미지를 사용하고, 기존 Lucide 등 아이콘은 Figma 에셋으로 대체한다. 적용이 끝나면 docs/figmaMCP/FIGMA_ASSET_TRACEABILITY.md에 로컬 파일명·원본 nodeId·용도·**실제 import한 파일 경로**(예: widgets/Header/ui/LandingHeader.tsx)를 반영한다. "참조용 보관"이었던 항목도 실제 적용 시 해당 컴포넌트 경로로 수정한다.
- Phase 6: 구현 계획서의 레이아웃 스펙과 읽은 디자인 컨텍스트(위치·크기·div 계층)를 기준으로 기존 페이지/위젯을 리팩토링·리디자인한다. 각 블록에 해당 노드의 left/top/width/height를 적용하고, 생성 코드의 컨테이너·자식 계층을 유지한다. MCP 생성 코드의 Tailwind는 프로젝트 design-tokens·기존 패턴으로 변환하되, 수치는 레이아웃 스펙과 일치시킨다. JSDoc과 파일 내부 주석(블록·의존성)을 반드시 추가한다. 구현 후 "레이아웃 충실도 검증" 체크리스트로 주요 노드의 위치·크기 적용 여부를 확인하고, 누락/불일치 시 수정한 뒤 Phase 7로 간다.
- Phase 7: npm run build(또는 npm run dev)로 빌드/실행을 검증한 뒤, docs/figmaMCP/figMCP.MD에 6하원칙(누가, 무엇을, 언제, 어디서, 왜, 어떻게) 형식으로 로그 항목을 한 행 추가한다.

5) 의존성 사전 파악
- 구현 계획 작성 및 코드 수정 시 src/app/router.tsx, docs/figma/FSD_SPEC_BLUEPRINT.md의 위젯 사용처·라우트 매핑을 참고하여 GNB·모달 z-index·라우트·공통 스타일·API 의존성을 넓게 파악하고 반영한다.

6) Tailwind
- 프로젝트에 Tailwind가 없거나 사용자 지시가 없으면 Tailwind 의존성을 추가하지 않는다. MCP가 생성한 Tailwind 클래스는 프로젝트의 design-tokens·기존 CSS 방식으로 변환한다.

7) Figma 에셋: 다운로드 → import → 컴포넌트 연동 (필수)
- design_context(콜링/응답)에서 제공된 이미지·에셋 URL을 추출하고, 만료 전에 다운로드하여 src/shared/figma_image/ 등에 저장한다. 저장 후 **해당 에셋을 쓰는 컴포넌트에서 직접 import하고 JSX에 연동**한다. 다운로드만 하거나 문서만 갱신하는 것으로 끝내지 않는다.
- 예시: 랜딩 헤더(1444-7928)의 검색·탁송·정산 아이콘 → 에셋 3개 다운로드(검색_search, 탁송_cil-truck, 정산_coins-stacked-03 등) → LandingHeader.tsx에서 import 후 검색 버튼은 <img src={iconSearch} />, GNB 탁송·정산은 NAV_ITEMS에 imgSrc로 지정해 렌더링. 차량목록·검차·거래처럼 디자인에서 Figma 에셋이 없는 항목은 기존 Lucide 등 유지.
- FIGMA_ASSET_TRACEABILITY.md에는 로컬 파일명·원본 nodeId·용도·**실제로 import한 파일 경로**(예: widgets/Header/ui/LandingHeader.tsx)를 기입한다. "참조용 보관"은 실제 적용 후 해당 컴포넌트 경로로 갱신한다. 빌드(npm run build) 성공 후 완료 보고에 "다운로드한 Figma 에셋(검색, 탁송, 정산)을 LandingHeader에 적용함"처럼 적용 내역을 명시한다.

8) 디자인 컨텍스트 위치·레이아웃 반영 (필수)
- design_context_raw.txt 안의 생성 코드(Component)를 읽고, 각 노드의 위치·크기 클래스(left, top, right, bottom, width, height)를 반드시 추출한 뒤, 구현 시 동일 픽셀 또는 프로젝트 단위(rem/design token)로 매핑하라. 단순히 콘텐츠만 맞추지 말고, 배치 값도 반영하라.
- absolute 레이아웃이면: 프로젝트에서 absolute를 쓰지 않는 정책이 없다면 같은 absolute와 같은 수치를 유지하라. 정책상 flex/grid만 쓴다면, 같은 시각적 결과가 나오도록 left/top에 대응하는 간격·정렬·margin·padding을 계산해 적용하라.
- metadata_raw.txt를 파싱해 노드 id별 (x, y, width, height) 테이블을 만들고, 이를 구현 계획서(impl_plans)의 "레이아웃 스펙" 섹션에 넣어라. 구현 시 이 테이블을 보고, 각 블록에 해당 노드의 x, y, width, height를 CSS(또는 design token)로 적용하라. 캔버스 기준(예: 1440px)이면 비율(예: left %)로 바꿔도 되지만, 값은 이 테이블에서 가져와야 한다.
- 생성 코드의 div 계층 구조(어떤 노드가 어떤 부모 안에 있는지)를 유지하라. 같은 부모 안에 있는 노드들은 같은 레이아웃 컨테이너 안에 두고, 부모의 위치·크기도 design_context와 맞추라.
- Phase 6 구현 후: design_context에서 주요 노드의 left, top, width, height 목록을 뽑아, 구현된 페이지에 같은 값(또는 동일 시각을 내는 대체 값)이 적용되었는지 체크리스트로 검증하라. 누락/불일치가 있으면 목록에 적고, 필요 시 코드를 수정한 뒤 Phase 7로 진행하라.

위 단계를 모두 수행한 뒤, 최종 빌드가 성공하고 figMCP.MD에 로그가 추가된 상태로 완료 보고한다. 구현의 근거는 항상 mcp_outputs에 저장한 뒤 read_file로 읽은 내용만 사용했는지, 그리고 레이아웃 스펙·위치·크기가 반영되었는지 확인할 것.
```

---

## 참고: 1번 / 2번 에이전트 분리 사용

MCP 반환값이 잘려서 에이전트가 전체를 받지 못하는 경우, **1번 에이전트**와 **2번 에이전트**를 나눠 쓴다.

- **1번 에이전트**: `docs/figmaMCP/AGENT_1_PROMPT_TEMPLATE.md` 의 상수 프롬프트 사용. MCP 호출 + mcp_outputs/{nodeId}/ 폴더·파일 생성 후, 사용자에게 "UI에서 반환 전체를 복사해 metadata_raw.txt·design_context_raw.txt에 붙여넣기" 안내.
- **2번 에이전트** (본 문서): 사용자가 붙여넣기까지 한 뒤, 같은 Figma URL에 본 상수 프롬프트를 붙여 구현 요청. MCP 호출 없이 저장된 파일만 read_file로 읽고 Phase 4~7 수행.

사용자가 2번 에이전트에 넣는 프롬프트 형식은 그대로 유지: `Implement this design from Figma.` + `@Figma URL` + (위 2번 상수).

---

*이 템플릿은 docs/figmaMCP 워크플로와 동기화되어 있음. WORKFLOW.md 또는 README.md 변경 시 본 프롬프트도 함께 갱신할 것.*
