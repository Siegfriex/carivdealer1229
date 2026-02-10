# MCP 반환 데이터 범주별 체크리스트

**목적**: MCP 콜링 후 "반환 데이터를 누락 없이 받았는지" 범주별로 점검.

**참조**: [docs/figma/FIGMA_MCP_RESPONSE_TAXONOMY.md](../figma/FIGMA_MCP_RESPONSE_TAXONOMY.md) — 각 도구별 반환 범주 정의.

**권장**: 콜링 직후 **응답 전문**을 [mcp_outputs](mcp_outputs/)에 저장한 뒤, **저장된 파일**을 열어 아래 항목을 체크하세요. 응답이 잘렸을 수 있으므로 "마지막 줄만" 보고 판단하지 말 것.

---

## get_metadata

| 체크 | 범주 | 설명 |
|------|------|------|
| [ ] | **A. 노드 트리 XML** | `<frame>`, `<text>`, `<line>` 등 계층 구조, id/name/x/y/width/height 포함 |
| [ ] | **B. 안내 문구** | "IMPORTANT: ... get_design_context ..." 등 구현 권장 메시지 |

**저장 파일**: `mcp_outputs/{nodeId하이픈}/metadata_raw.txt`

---

## get_design_context

| 체크 | 범주 | 설명 |
|------|------|------|
| [ ] | **A. 노드 트리 XML** | 메타데이터와 동일/유사한 구조 정보 |
| [ ] | **B. 에셋 URL 상수** | `const imgXxx = "https://www.figma.com/api/mcp/asset/..."` 형태 목록 |
| [ ] | **C. 생성 UI 코드** | React + Tailwind 컴포넌트 코드, data-node-id 매핑 |
| [ ] | **D. 구현 지침** | 타겟 프로젝트 스택·스타일 변환 요구(SUPER CRITICAL) |
| [ ] | **E. 디자인 스타일** | dropshadow, #2048E5 등 사용된 스타일 설명 |
| [ ] | **F. 컴포넌트 설명** | clipboard-plus, file-search-01 등 아이콘/컴포넌트 용도 |
| [ ] | **G. 에셋 유효기간** | 이미지 URL 만료(예: 7일) 안내 |
| [ ] | **H. 안내 문구** | get_screenshot 호출 권장 등 |

**저장 파일**: `mcp_outputs/{nodeId하이픈}/design_context_raw.txt`

---

## get_screenshot

| 체크 | 항목 | 설명 |
|------|------|------|
| [ ] | **스크린샷 이미지** | 해당 노드 영역의 렌더 이미지(PNG 등) 수신 여부 |

**저장 파일(선택)**: `mcp_outputs/{nodeId하이픈}/screenshot.png`

---

## 사용 방법

1. MCP 호출 후 즉시 반환값 전체를 위 "저장 파일" 경로에 저장.
2. 저장된 파일을 열어, 위 표의 각 범주가 **실제로 내용에 포함되어 있는지** 확인 후 체크.
3. 누락된 범주가 있으면 "해당 노드/콜에서는 해당 범주 없음"으로 기록하거나, 재호출 검토.
4. 구현 시에는 **저장된 파일**을 읽어 파싱·분석하도록 하면, 응답 잘림으로 인한 오판을 줄일 수 있음.

---

*문서 버전: 1.0 | 최종 업데이트: 2025-02-10*
