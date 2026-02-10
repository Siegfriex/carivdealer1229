# 1번 에이전트 프롬프트 (MCP 호출 + 폴더/파일 생성)

**역할**: Figma MCP를 호출하고, 반환 데이터를 받을 **폴더·파일만** 만들어 둔 뒤, **사용자가 UI에서 복사해 붙여넣기**할 수 있도록 안내한다. 구현·계획 작성은 하지 않음.

**사용법**: 아래 "복사할 프롬프트(상수)" 블록 전체를 복사하여, 사용자 발화 뒤에 붙여 넣는다.

**사용자 발화 예시** (변수는 Figma URL만 바꾸면 됨):
```
Implement this design from Figma.
@https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1368-37364&m=dev
<여기에 아래 1번 에이전트 상수 프롬프트 붙여넣기>
```

---

## 복사할 프롬프트 (상수) — 1번 에이전트

```
이번 턴에서는 Figma MCP만 호출하고, 반환 데이터를 받을 폴더와 파일을 만들어 두는 것만 수행한다. 구현·계획 작성·코드 수정은 하지 않는다.

1) URL에서 식별자 추출
- 제공된 Figma URL에서 fileKey와 nodeId를 추출한다. node-id=1368-37364 형식이면 nodeId 하이픈은 1368-37364, API 호출 시 콜론 형식 1368:37364를 사용한다. fileKey는 URL 경로의 design/ 다음 값(예: 4w3ft8RpGwoho5EtvNO9hQ)이다.

2) 폴더·파일 생성
- docs/figmaMCP/mcp_outputs/ 아래에 {nodeId하이픈} 폴더가 없으면 생성한다. 예: docs/figmaMCP/mcp_outputs/1368-37364/
- 해당 폴더 안에 다음 두 파일을 생성한다.
  - metadata_raw.txt : 첫 줄에 "# 아래에 get_metadata 반환 전체를 UI에서 복사해 붙여넣으세요" 만 넣어 둔다.
  - design_context_raw.txt : 첫 줄에 "# 아래에 get_design_context 반환 전체를 UI에서 복사해 붙여넣으세요" 만 넣어 둔다.
- (선택) get_screenshot을 쓸 경우 screenshot.png 빈 파일 또는 placeholder는 두지 않아도 된다. 사용자가 스크린샷을 저장할 때 파일명만 맞추면 됨.

3) MCP 호출
- get_metadata(fileKey, nodeId 콜론 형식) 를 호출한다.
- get_design_context(fileKey, nodeId 콜론 형식) 를 호출한다.
- 반환 결과가 "Output has been written to: <경로>" 형태로 나오면, 그 경로의 파일 내용을 읽어서 위에서 만든 metadata_raw.txt 또는 design_context_raw.txt에 저장해도 되고, 사용자에게 그 경로를 알려 주어도 된다. (에이전트가 반환 전문을 받지 못한 경우 사용자가 해당 경로 파일을 열어 mcp_outputs 폴더의 해당 파일로 복사할 수 있음.)

4) 사용자 안내 문구 출력
- 다음 문구를 반드시 출력하여 사용자에게 안내한다.

---
[안내] MCP 호출이 끝났습니다. 에이전트는 반환 데이터 전체를 받지 못할 수 있으므로, 아래를 수동으로 진행해 주세요.

1. UI에 표시된 get_metadata 반환 내용 **전체**를 복사하여 docs/figmaMCP/mcp_outputs/{nodeId하이픈}/metadata_raw.txt 에 붙여넣기(기존 첫 줄 안내는 지워도 됨).
2. UI에 표시된 get_design_context 반환 내용 **전체**를 복사하여 docs/figmaMCP/mcp_outputs/{nodeId하이픈}/design_context_raw.txt 에 붙여넣기(기존 첫 줄 안내는 지워도 됨).
3. 붙여넣기가 끝나면, 2번 에이전트용 프롬프트(AGENT_PROMPT_TEMPLATE.md의 "2번 에이전트용")로 같은 Figma URL을 주고 구현을 요청하세요.

nodeId 하이픈 예: 1368-37364
---
```

---

*1번 에이전트 완료 후, 사용자가 파일에 붙여넣기까지 한 뒤 2번 에이전트를 호출한다.*
