# Figma 노드 1418:38264 MCP 도구 호출 결과

**노드**: 1418:38264 (정산 계좌 등록/변경/조회 — 조회 뷰)  
**Figma**: [Domestic-Seller 1.0](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-38264)  
**목적**: design_context 추출이 안 되는 원인 확인을 위해 get_metadata / get_design_context / get_screenshot 호출 결과 정리.

---

## 1. 호출 결과 요약

| 도구 | 반환 | 비고 |
|------|------|------|
| **get_metadata** | `IMPORTANT: After you call this tool, you MUST call get_design_context if trying to implement the design...` | 메타데이터 본문(자식 트리, 타입 등)은 응답에 포함되지 않음. 안내 문구만 수신. |
| **get_design_context** | `IMPORTANT: After you call this tool, you MUST call get_screenshot to get a screenshot of the node for context.` | **컴포넌트/레이아웃/코드 구조 미반환**. 스크린샷 호출 안내만 수신. (과거 세션에서는 동일 노드에 대해 "An error occurred while using the tool get_design_context" 에러가 나기도 함.) |
| **get_screenshot** | 이미지 + 설명 수신 | 정상. "정산 계좌 등록/변경/조회" 화면(프로필·정산 계좌 정보·변경하기 버튼) 설명 확인. |

---

## 2. design_context를 추출하지 못하는 이유 (추정)

1. **Figma MCP 쪽 제한**
   - 해당 노드(1418:38264)에 대해 `get_design_context`가 **실제 코드/구조를 생성하지 않고** “get_screenshot 호출” 안내만 반환하는 경우가 있음.
   - 동일 노드라도 호출 시점에 따라 **에러**("An error occurred...")가 나기도 하고, **안내만** 나오기도 해, Figma 플러그인/서버 상태·타임아웃·노드 복잡도 등에 따라 동작이 달라지는 것으로 추정.

2. **Code Connect / 컴포넌트 매핑 부재**
   - Figma 디자인이 Code Connect로 코드와 연결돼 있지 않으면, MCP가 “디자인 → 코드” 변환 결과를 내지 못하고 안내만 반환할 수 있음.

3. **노드 유형·계층**
   - 노드가 페이지급 프레임이고 내부에 많은 컴포넌트가 중첩돼 있으면, 응답 생성 실패 또는 타임아웃으로 에러/안내만 반환될 수 있음.

**결론**: 현재 1418:38264에 대해서는 **get_screenshot으로만 화면 구조를 확보**할 수 있고, **design_context(코드/레이아웃 스펙)는 MCP 한계로 추출 불가**한 상태로 보고, 스크린샷 기반으로 구현함.
