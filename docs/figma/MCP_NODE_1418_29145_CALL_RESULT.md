# Figma 노드 1418:29145 MCP 도구 호출 결과 보고 (정정)

**노드**: 1418:29145 (로그인 후 랜딩페이지_판매/거래 단계 필터 미적용 — 탁송 단계 화면)  
**Figma**: [Domestic-Seller 1.0](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-29145)  
**최종 갱신**: 2026-02-08 (사용자 제공 실제 반환 데이터 기준으로 정정)

---

## 1. 정정 요약

**이전 보고서**에서는 “get_metadata / get_design_context 호출 시 payload 없이 안내 문구만 수신했다”고 기술했으나, 이는 **에이전트가 Cursor 채팅에서 받은 응답**만을 기준으로 한 것이었음.

**실제로 Figma MCP는 1418:29145에 대해 아래와 같은 전체 payload를 반환함** (사용자 제공 실제 반환 데이터 기준).

---

## 2. 실제 반환 데이터 (전체 payload)

### 2.1 get_metadata — 실제 반환 내용

- **프레임 트리 (XML 유사 구조)**  
  - 루트: `<frame id="1418:29145" name="로그인 후 랜딩페이지_판매/거래 단계 필터 미적용" x="390" y="575" width="1440" height="1742">`  
  - 자식 노드 전부 반환: 1418:29146 (Frame 2087328282, 사이드바), 1418:29147 (Line 78), 1418:29148~29169 (검색·목록·푸터 텍스트), 1418:29170~29278 (top bar, 탭, 확인 필요차량, 검차 진행상황 필터), 1418:29232~29266 (차량 카드 그룹·페이지네이션) 등.
- **노드별 id, name, x, y, width, height** 전부 포함.

→ **메타데이터 본문은 정상 반환됨.** “못 받았다”는 에이전트가 채팅에서 본 응답에 본문이 포함되지 않았던 것.

### 2.2 get_design_context — 실제 반환 내용

- **에셋 URL 상수**  
  - `imgStickMan1181741`, `img202601061145265`, `img202601061145262`, `imgLine78`, `imgSearch`, `imgBriefcase`, `imgGroup140`, `imgCheckBoxFill`, `imgEllipse44`, `imgLine80`, `imgFrame2087328289` 등 (localhost:3845/assets/...).
- **React + Tailwind 전체 코드**  
  - 루트 `data-name="로그인 후 랜딩페이지_판매/거래 단계 필터 미적용" data-node-id="1418:29145"`  
  - 좌측 사이드바(검색, 목록: 전체·등록/검차 단계·판매/거래 단계·탁송 단계·정산), 푸터, top bar(로고·차량목록·거래·탁송·정산·홍길동님·매물 등록하기), 확인 필요차량 체크박스, 차량 카드 2장(G70 3T 스포츠 엘리트, 3,000만원, 1년보증, 단순교환무사고 등), 필터 탭(전체 34, 탁송 신청 6, 탁송 매칭 중 3, 탁송 매칭완료 3, 탁송 완료 3), 페이지네이션(1).
- **data-node-id**  
  - 각 요소에 `data-node-id="1418:292xx"` 형태로 노드 ID 부여.
- **스타일·디자인 스펙**  
  - 기본 dropshadow: `Effect(type: DROP_SHADOW, color: #0000000D, offset: (2.34, 3.13), radius: 11.02, spread: 0)` 등.
- **컴포넌트 설명 (Code Connect)**  
  - clipboard-plus (423:430), file-search-01 (423:435), bar-chart-12 (425:440), coins-stacked-03 (423:424) 용도·키워드.
- **지침**  
  - “SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.”  
  - 이미지/SVG는 localhost 상수로 제공되며 `<img src={image} />` 형태로 사용.

→ **디자인 컨텍스트(코드·레이아웃·에셋·스타일·컴포넌트 설명) 전부 반환됨.** “추출 못 한다”고 한 것은 잘못된 결론임.

### 2.3 get_screenshot

- 이미지 + 텍스트 설명은 이전 보고와 동일하게 수신 가능.

---

## 3. “못 받았다”고 기술했던 이유 (원인 정리)

- **Figma MCP 서버**는 1418:29145에 대해 **메타데이터·디자인 컨텍스트 전체를 생성해 반환**함.
- **Cursor 등 MCP 클라이언트**에서 동일 호출을 했을 때, **에이전트에게 전달되는 메시지에는 위 전체 payload가 포함되지 않고** “IMPORTANT: After you call this tool, you MUST call get_design_context / get_screenshot ...” **안내 문구만 노출**된 것으로 보임.
- 따라서 **“design_context를 추출하지 못한다”**는 서버 미반환 때문이 아니라, **클라이언트·에이전트에 전달되는 응답이 잘리거나 요약만 전달되는 쪽**으로 보는 것이 맞음.

---

## 4. 결론 (정정)

- **1418:29145**에 대해 get_metadata / get_design_context는 **실제로 전체 payload(메타데이터 트리, React+Tailwind 코드, 에셋 URL, data-node-id, 스타일, 컴포넌트 설명)를 반환함.**
- 이전 보고서의 “메타데이터·design_context 본문 미반환” 기술은 **에이전트가 채팅에서 본 응답만을 기준으로 한 것으로, 실제 반환 데이터와 불일치함.** 위와 같이 정정함.
- **구현 시**: 전체 design_context가 반환되는 환경(예: Figma Dev Mode, 또는 전체 payload가 에이전트에 전달되는 MCP 설정)에서는 해당 코드·에셋·스타일을 그대로 활용 가능. Cursor에서 안내 문구만 보이는 경우에는 **MCP 클라이언트/전달 경로에서 전체 본문이 노출되도록 확인**하는 것이 필요함.
