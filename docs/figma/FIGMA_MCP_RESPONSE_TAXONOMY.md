# Figma MCP 반환 데이터 분류·범주화

**목적**: 로컬에서 Figma MCP를 콜링할 때 `get_metadata` / `get_design_context` / `get_screenshot` 각각이 반환하는 전체 데이터를 범주별로 정리한 문서.

**기준**: Figma Design 파일 대상, nodeId·fileKey로 특정 노드 지정 시의 반환 구조.

---

## 1. 개요: 콜링 시 반환되는 것들

| 도구 | 반환 요약 |
|------|-----------|
| **get_screenshot** | 해당 노드의 **이미지(스크린샷)** (PNG 등) |
| **get_metadata** | 노드 트리 **XML 메타데이터** (구조·위치·크기) + 안내 문구 |
| **get_design_context** | **XML + 에셋 URL + 생성 코드 + 스타일·컴포넌트 설명** 등 통합 패키지 |

---

## 2. get_metadata 반환 데이터

### 2.1 범주 요약

| 범주 | 설명 | 형식 |
|------|------|------|
| **A. 노드 트리 XML** | 요청한 노드 및 자손의 계층 구조 | XML |
| **B. 안내 문구** | 구현 시 get_design_context 호출 권장 메시지 | 텍스트 |

### 2.2 A. 노드 트리 XML 상세

- **루트**: 요청한 nodeId의 프레임/노드가 루트.
- **요소 타입**: `<frame>`, `<text>`, `<line>`, `<rounded-rectangle>`, `<ellipse>`, `<instance>` 등.
- **공통 속성**:
  - `id`: Figma nodeId (예: `1745:11395`)
  - `name`: 레이어 이름 (예: `F_1_1_경매 사전 설정`)
  - `x`, `y`: 좌표 (부모 기준)
  - `width`, `height`: 크기
- **역할**: 레이아웃·계층·위치 파악용. **텍스트 내용·색·폰트 등 스타일 값은 없음.**

### 2.3 B. 안내 문구

- 예: `"IMPORTANT: After you call this tool, you MUST call get_design_context if trying to implement the design..."`

---

## 3. get_design_context 반환 데이터

### 3.1 범주 요약

| 범주 | 설명 | 형식 |
|------|------|------|
| **A. 노드 트리 XML** | get_metadata와 동일/유사한 구조 정보 | XML |
| **B. 에셋 URL 상수** | 이미지·SVG 등 에셋의 다운로드 URL 목록 | JS 상수 선언 |
| **C. 생성 UI 코드** | 노드 트리를 기반으로 한 React+Tailwind 컴포넌트 코드 | JSX/TSX |
| **D. 구현 지침** | 타겟 프로젝트 맞춤 변환 요구사항 | 텍스트 |
| **E. 디자인 스타일** | 사용된 쉐도우·컬러 등 | 키-값/설명 |
| **F. 컴포넌트 설명** | 아이콘/컴포넌트별 용도·문서 | 텍스트 |
| **G. 에셋 유효기간 안내** | URL 만료(예: 7일) 등 | 텍스트 |
| **H. 안내 문구** | get_screenshot 호출 권장 등 | 텍스트 |

---

### 3.2 A. 노드 트리 XML

- get_metadata와 동일한 계층·id·name·x,y·width·height.
- design_context는 이 구조를 기반으로 코드 생성에 사용.

---

### 3.3 B. 에셋 URL 상수

- **형식**: `const imgXxx = "https://www.figma.com/api/mcp/asset/{uuid}";`
- **내용**: 배경 이미지, 아이콘, 라인, 도형 등 노드에서 참조하는 에셋의 URL.
- **용도**: 생성 코드 내 `<img src={imgXxx} />` 등으로 사용.
- **예**:  
  `img202601061145265`, `imgStickMan1181741`, `imgLine87`, `imgEllipse55`, `imgCheck`, `imgBriefcase`, `imgGroup140`, `imgSearch`, `imgIcon`, `imgCilTruck` 등.

---

### 3.4 C. 생성 UI 코드

- **언어**: React (JSX).
- **스타일**: Tailwind CSS 클래스 (`className="..."`).
- **특징**:
  - `data-name`, `data-node-id`로 Figma 노드와 1:1 매핑.
  - `left-[calc(...)]`, `absolute`, `rounded-[30px]` 등 픽셀/비율 기반 배치.
  - 텍스트는 하드코딩 또는 `{12바 1234}` 같은 표현(문법 오류 가능성 있음 → 프로젝트에서 변수로 치환 필요).
- **역할**: 디자인 → 코드의 초안. **프로젝트 스택·디자인 토큰에 맞게 변환 필요.**

---

### 3.5 D. 구현 지침 (SUPER CRITICAL)

- 생성된 React+Tailwind 코드를 **타겟 프로젝트 기술 스택·스타일 시스템**에 맞게 변환해야 함.
- 확인할 것:
  - 기술 스택 (프레임워크/라이브러리)
  - 스타일 방식 (CSS Modules, design tokens, Tailwind 사용 여부 등)
  - 컴포넌트·패턴·컨벤션
- Tailwind는 사용자 지시가 없으면 의존성 추가 금지.

---

### 3.6 E. 디자인 스타일

- **형식**: 디자인에 사용된 효과·색상 설명.
- **예**:
  - 기본 dropshadow: `Effect(type: DROP_SHADOW, color: #0000000D, offset: (...), radius: 11.017..., spread: 0)`
  - 브랜드 컬러: `#2048E5`
- **용도**: 프로젝트 design-tokens / 테마에 매핑할 때 참고.

---

### 3.7 F. 컴포넌트 설명

- **대상**: Figma에서 설명이 붙은 컴포넌트(아이콘 등).
- **형식**: Node ID + 키워드/용도 설명.
- **예**:
  - `clipboard-plus` (423:430): clipboard, plus, add, file, report
  - `file-search-01` (423:435): file, search, attachment, text, paper, pdf, report
  - `bar-chart-12` (425:440): bar, chart, barchart, graph, data
  - `coins-stacked-03` (423:424): coins, stacked, stack, currency, money
- **용도**: 구현 시 의미·용도 맞춤 참고.

---

### 3.8 G. 에셋 유효기간 안내

- 이미지/SVG는 상수로 제공된 URL로 저장되며, **일정 기간(예: 7일) 후 만료**할 수 있음.
- 만료 전 로컬/CDN에 저장해 두는 전략 권장.

---

### 3.9 H. 안내 문구

- 예: `"IMPORTANT: After you call this tool, you MUST call get_screenshot to get a screenshot of the node for context."`

---

## 4. get_screenshot 반환 데이터

| 범주 | 설명 | 형식 |
|------|------|------|
| **스크린샷 이미지** | 요청한 nodeId에 해당하는 캔버스 영역의 렌더 이미지 | 이미지 (PNG 등) |

- **용도**: 디자인 시각 확인, 구현 검증, 문서 첨부.

---

## 5. 콜링 시 반환물 체크리스트 (로컬 MCP)

구현 시 참고용 체크리스트:

- [ ] **get_screenshot**: 스크린샷 이미지 수신 여부
- [ ] **get_metadata**: 노드 트리 XML + 안내 문구
- [ ] **get_design_context**:
  - [ ] 노드 트리 XML
  - [ ] 에셋 URL 상수 목록
  - [ ] React+Tailwind 생성 코드
  - [ ] 구현 지침(SUPER CRITICAL)
  - [ ] 디자인 스타일(dropshadow, color)
  - [ ] 컴포넌트 설명
  - [ ] 에셋 유효기간 안내
  - [ ] 안내 문구

---

## 6. 구현 워크플로 권장 순서

1. **get_screenshot** → 디자인 시각 확인
2. **get_metadata** → 구조·위치 파악 (선택)
3. **get_design_context** → 에셋 URL·생성 코드·스타일·설명 확보
4. 프로젝트 스택·디자인 토큰에 맞게 **코드 변환** (D. 구현 지침 적용)
5. 에셋은 필요 시 **로컬/CDN 저장** (G. 유효기간 고려)

---

*문서 버전: 1.0 | 최종 업데이트: 2025-02-10*
