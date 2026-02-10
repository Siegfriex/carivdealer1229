# 구현 계획: {nodeId하이픈} {IA 화면 라벨}

**대상 노드**: (예: 1418:24679)  
**IA 화면 라벨**: (예: 거래상세)  
**라우트**: (예: /vehicles/:vehicleId/trade)  
**페이지 컴포넌트**: (예: TradeDetailPage)

---

## 1. 목표

- (해당 노드와 로컬 페이지를 1:1로 맞출 목표를 한두 문장으로)

---

## 2. 변경 대상 파일

- (수정할 파일 경로 목록)
- 예: `src/pages/admin/TradeDetailPage.tsx`, `src/widgets/Header/...`

---

## 3. 의존성

- **라우트**: (router.tsx 상 해당 path, 부모 레이아웃)
- **위젯**: (이 페이지에서 사용하는 Header, Sidebar 등)
- **z-index**: (모달·GNB 등과 겹치지 않도록 할 값)
- **공통 스타일**: (design-tokens.css, shared/styles 참조)
- **API/features**: (호출하는 API, 사용 feature)

---

## 4. MCP 스타일 → 프로젝트 디자인 토큰 매핑

- (MCP 디자인 컨텍스트에서 나온 색·쉐도우 등을 프로젝트 변수/클래스로 매핑)
- 예: #2048E5 → var(--color-primary), dropshadow → var(--shadow-card)

---

## 5. 레이아웃 스펙 (노드별 위치·크기)

- metadata_raw.txt(또는 XML)와 design_context_raw.txt의 생성 코드에서 추출한 값으로 채운다.
- 캔버스 기준(예: 1440px)이면 비고에 "캔버스 1440px 기준" 등 명시. 구현 시 동일 픽셀 또는 비율(%)로 적용.

| nodeId | x | y | width | height | 비고 |
|--------|---|---|-------|--------|------|
| (예) 1444:7929 | 0 | 171 | 1440 | 641 | Hero 영역 |
| (예) 1444:7942 | 260 | 106 | 203 | 37 | 배지 |
| | | | | | |

---

## 6. 위험/주의사항

- (기존 동작 유지, 접근성, 반응형 등 주의할 점)

---

*복사 후 파일명을 {nodeId하이픈}_구현계획.md 로 변경하여 사용.*
