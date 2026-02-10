# Figma MCP 워크플로 허브

**목적**: Figma를 SSOT로 두고, 특정 페이지를 피그마 디자인과 1:1로 맞추기 위한 MCP 기반 워크플로의 **문서·매핑·체크리스트·로그**를 한곳에서 관리하는 폴더입니다.

- **Figma SSOT**: 디자인 기준은 Figma Design 파일(Domestic-Seller 1.0).
- **nodeId = 스크린 명세**: IA·FSD 문서 및 FIGMASCR0208 스크린샷이 노드 기준으로 매핑됨.
- **fileKey**: `4w3ft8RpGwoho5EtvNO9hQ`

---

## 참조 문서

| 문서 | 용도 |
|------|------|
| [docs/figma/FIGMA_MCP_RESPONSE_TAXONOMY.md](../figma/FIGMA_MCP_RESPONSE_TAXONOMY.md) | MCP 반환 데이터 범주(메타데이터·디자인 컨텍스트·스크린샷) 정의 |
| [docs/figma/FSD_SPEC_BLUEPRINT.md](../figma/FSD_SPEC_BLUEPRINT.md) | 사이트맵·nodeId·라우트·FSD 레이어·페이지 컴포넌트 |
| [FIGMASCR0208/](../../FIGMASCR0208/) | 노드별 참조 스크린샷 이미지 (01_랜딩페이지 ~ 14_마이페이지) |

---

## 폴더 구조

| 파일/폴더 | 역할 |
|-----------|------|
| [NODE_TO_ROUTE_AND_FILE.md](NODE_TO_ROUTE_AND_FILE.md) | nodeId ↔ 라우트 ↔ 페이지 컴포넌트 ↔ FIGMASCR0208 경로 매핑 |
| [WORKFLOW.md](WORKFLOW.md) | Phase 0~7 단계별 워크플로 요약 |
| [MCP_RESPONSE_CHECKLIST.md](MCP_RESPONSE_CHECKLIST.md) | get_metadata / get_design_context 반환 범주 체크리스트 |
| [FIGMA_ASSET_TRACEABILITY.md](FIGMA_ASSET_TRACEABILITY.md) | 에셋 추적성 (로컬 파일 ↔ nodeId ↔ import 경로) |
| [figMCP.MD](figMCP.MD) | 6하원칙 작업 로그 (누적) |
| [mcp_outputs/](mcp_outputs/) | MCP 원본 응답 저장 (노드별 metadata_raw.txt, design_context_raw.txt 등) |
| [impl_plans/](impl_plans/) | 노드별 구현 계획서 |
| [AGENT_1_PROMPT_TEMPLATE.md](AGENT_1_PROMPT_TEMPLATE.md) | **1번 에이전트**: MCP 호출 + 폴더/파일 생성 후, 사용자 붙여넣기 안내 |
| [AGENT_PROMPT_TEMPLATE.md](AGENT_PROMPT_TEMPLATE.md) | **2번 에이전트**: MCP 미호출, mcp_outputs 파일만 읽고 Phase 4~7 구현 |

---

## 에이전트 사용 순서 (반환 잘림 시)

1. **1번 에이전트**: [AGENT_1_PROMPT_TEMPLATE.md](AGENT_1_PROMPT_TEMPLATE.md) 상수 복사 후, `Implement this design from Figma.` + `@Figma URL` + 붙여넣기 → MCP 호출·폴더 생성·안내 출력.
2. **사용자**: UI에 나온 get_metadata·get_design_context 반환 **전체**를 각각 mcp_outputs/{nodeId}/metadata_raw.txt, design_context_raw.txt에 붙여넣기.
3. **2번 에이전트**: 같은 URL에 [AGENT_PROMPT_TEMPLATE.md](AGENT_PROMPT_TEMPLATE.md)의 2번 상수 붙여 구현 요청 → 파일만 읽고 구현 계획·코드·검증·로그 수행. (사용자 프롬프트 형식은 동일.)

---

## 워크플로 요약

1. **메타데이터 저장** — get_metadata 호출 후 응답 전문을 mcp_outputs에 저장.
2. **디자인 컨텍스트 저장** — get_design_context 호출 후 저장, 범주별 수신 체크, 생성 코드에서 위치·크기·div 계층 추출.
3. **스크린 비교** — MCP 스크린샷 vs FIGMASCR0208 PNG 비교, 동일 노드 시 Figma(MCP) 기준.
4. **구현 계획** — impl_plans에 노드별 계획서 작성. **레이아웃 스펙**(노드별 x, y, width, height 테이블)을 반드시 포함.
5. **에셋·추적성·연동** — shared/figma_image에 에셋 보관, **대상 컴포넌트에 import·JSX 연동**, FIGMA_ASSET_TRACEABILITY.md에 실제 적용 경로 갱신.
6. **리팩토링** — 레이아웃 스펙에 따라 위치·크기·컨테이너 계층 적용 후, **레이아웃 충실도 검증** 체크리스트로 확인. JSDoc·주석·경로·의존성 명시.
7. **로그** — 런/빌드 후 figMCP.MD에 6하원칙 항목 추가.

상세 단계는 [WORKFLOW.md](WORKFLOW.md) 참고. 위치·배치를 빈틈없이 맞추려면 [AGENT_PROMPT_TEMPLATE.md](AGENT_PROMPT_TEMPLATE.md)의 "8) 디자인 컨텍스트 위치·레이아웃 반영"을 준수할 것.

---

*문서 버전: 1.0 | 최종 업데이트: 2025-02-10*
