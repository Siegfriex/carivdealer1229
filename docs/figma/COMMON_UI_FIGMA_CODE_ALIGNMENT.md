# 공통 UI/디자인 시스템 ↔ 코드·FSD 정합성 요약

**역할**: 공통 UI/디자인 시스템 ↔ FIGMA_IA_FSD_STRUCTURE·FIGMA_GLOBAL_PLAN·코드베이스 정렬.  
**대상 Figma 프레임**: 공통 시스템 12개(node-id 1194-6635, 6640, 6646, 7155, 7283, 7272, 6911, 7118, 7156, 6912, 7208, 7425).  
**실제 파일 수정**: 하지 않음. 아래는 “어떻게 바꿔야 하는지”만 명시한 제안이다.

---

## 1. 공통 컴포넌트 분석 결과

Figma MCP `get_metadata`/`get_design_context` 호출 시 **name** 필드가 응답에 포함되지 않아, 코드베이스·design-tokens·ReNew 문서 참고로 **추정 유형**을 부여함. Figma에서 실제 name 확인 후 아래 표를 갱신할 것.

| node-id | Figma name (현재) | 표현 내용(추정) | 주요 variants/state/props 후보 | 예상 FSD 레이어 |
|---------|-------------------|-----------------|--------------------------------|------------------|
| 1194-6635 | (미확보) | 색상/아이콘 세트 또는 공통 스타일 | color, size | shared/styles 또는 shared/ui |
| 1194-6640 | (미확보) | 버튼(Primary 등) | variant: primary/secondary, size: sm/md/lg, disabled, loading | shared/ui |
| 1194-6646 | (미확보) | 버튼(Secondary/Ghost 등) | variant, size | shared/ui |
| 1194-7155 | (미확보) | 입력 필드(Input/FormField) | label, error, placeholder, disabled, fullWidth | shared/ui |
| 1194-7283 | (미확보) | 입력·선택(Input/Select) | type: text/select, options | shared/ui |
| 1194-7272 | (미확보) | 입력 필드 또는 라벨 | label, helperText | shared/ui |
| 1194-6911 | (미확보) | 카드(Card) 또는 리스트 아이템 | padding: none/sm/md/lg, hover | shared/ui |
| 1194-7118 | (미확보) | 배지(Badge)/상태 라벨 | variant: filled/outlined, size, color | shared/ui |
| 1194-7156 | (미확보) | 모달(Modal) 또는 오버레이 | open, onClose, title | shared/ui |
| 1194-6912 | (미확보) | 스텝 인디케이터(StepProgress) | steps[], currentStep, status: completed/current/upcoming | shared/ui |
| 1194-7208 | (미확보) | 테이블(Table) 또는 리스트 헤더 | columns, sortable | shared/ui |
| 1194-7425 | **Typography** | 타이포그래피 스케일 | variant: h1/h2/h3/h4/body/button/caption, as | shared/ui |

**MCP 응답 한계·리스크**: get_metadata/get_design_context 호출 시 name 필드 미포함이 재확인된 경우, 공통 컴포넌트 1:1 매핑 불확실·정합성 검증 제한. 등급: Medium. 대응: Figma에서 수동 name 복사 후 표 갱신 권장.

**참고**: 1194-7425는 design-tokens.css, Typography.tsx, ReNew/TYPOGRAPHY_SYSTEM.md에서 **Typography** 로 명시되어 있음. 나머지 11개는 Figma에서 name 확인 후 위 표의 “Figma name” 및 “표현 내용”을 수정할 것.

---

## 2. FIGMA_IA_FSD_STRUCTURE.md 에 들어갈 추가 섹션/표

아래 블록을 **그대로** FIGMA_IA_FSD_STRUCTURE.md에 삽입하거나, 기존 §2/§4를 아래 내용으로 **보강**하면 된다.

### 2.1 §2.2 뒤에 추가: “2.3 공통 디자인 시스템 프레임(Figma node 기준)”

```markdown
### 2.3 공통 디자인 시스템 프레임 (Figma node 기준)

Figma Domestic-Seller 1.0 공통 시스템 12개 프레임과 코드·토큰 대응. (Figma name은 추후 MCP/수동 확인 시 갱신.)

| node-id | 추정 스펙/용도 | 코드 대응 | 비고 |
|---------|----------------|-----------|------|
| 1194-7425 | Typography: H1~Caption, Pretendard, 1440px 기준 | design-tokens.css, Typography.tsx, tailwind theme | 문서화 완료 |
| 1194-6635 | 색상/아이콘 또는 공통 스타일 | design-tokens.css (--color-*, --radius-*) | name 확보 후 보강 |
| 1194-6640, 1194-6646 | Button: Primary/Secondary/Ghost, size sm/md/lg | shared/ui/Button.tsx | variant/size 일치 여부 검증 |
| 1194-7155, 1194-7283, 1194-7272 | Input/FormField: label, error, helperText | shared/ui/Input.tsx, Select.tsx | Figma name 확보 후 1:1 매핑 |
| 1194-6911 | Card: padding, hover | shared/ui/Card.tsx | |
| 1194-7118 | Badge/StatusBadge: filled/outlined, size | shared/ui/StatusBadge.tsx | |
| 1194-7156 | Modal/오버레이 | shared/ui/Modal.tsx | |
| 1194-6912 | StepProgress: steps, status | shared/ui/StepProgress.tsx | |
| 1194-7208 | Table/리스트 | shared/ui/Table.tsx | |
```

### 2.2 §4.1 표 보강: “공통 시스템 node-id” 컬럼 추가

기존 **§4.1 전 섹션 공통 컴포넌트** 표에 **Figma node-id** 컬럼을 넣어 아래처럼 한 행씩 매핑할 것.

| 컴포넌트 이름 | Figma node-id | 등장 섹션 번호 | 대표 용도 | 예상 FSD 레이어 | 비고 |
|---------------|----------------|----------------|-----------|------------------|------|
| Typography | 1194-7425 | 1~11 | 제목·본문·캡션 | shared/ui | 문서화 완료 |
| Button (Primary/Secondary) | 1194-6640, 1194-6646 | 1~11 | CTA·제출·취소 | shared/ui | |
| Input / FormField | 1194-7155, 1194-7283, 1194-7272 | 2, 5, 6, 7, 9 | 폼 입력 | shared/ui | |
| StepProgress | 1194-6912 | 2, 5, 6, 7 | 단계 표시 | shared/ui | |
| Card | 1194-6911 | 1, 3, 4, 5 | 카드 컨테이너 | shared/ui | |
| StatusBadge / Badge | 1194-7118 | 6, 11 | 상태 라벨 | shared/ui | |
| Modal | 1194-7156 | 2, 5~11 | 알림·확인 | shared/ui | |
| Table | 1194-7208 | 4, 8, 10, 11 | 목록 테이블 | shared/ui | |
| LandingHeader | (페이지/위젯) | 1, 3~11 | GNB | widgets/Header | |
| MainLandingSidebar | (페이지/위젯) | 3~11 | 좌측 메뉴 | widgets/MainLandingSidebar | |
| VehicleCard | (엔티티) | 3, 4, 5 | 차량 카드 | entities/vehicle/ui | |
| Pagination | (shared) | 3, 4, 8, 11 | 페이징 | shared/ui | |

(나머지 행은 기존 §4.1 유지. node-id가 없는 항목은 “(페이지/위젯)” 또는 “(shared)” 등으로 표기.)

---

## 3. FIGMA_GLOBAL_PLAN.md §3 패치 초안

**적용 위치**: `docs/figma/FIGMA_GLOBAL_PLAN.md` 의 “## 3. 공통 컴포넌트/디자인 시스템 작업 패키지” 섹션 전체.

**기존 내용(삭제·대체 대상)**:

```markdown
## 3. 공통 컴포넌트/디자인 시스템 작업 패키지

- **공통 프레임 (코드베이스 참조)**  
  - Typography: node 1194-7425 (design-tokens.css 기준).  
  - 기타 공통 컴포넌트 node는 FIGMA_SCR_ROUTE_MAP, design-tokens 주석에서 참조. get_metadata로 name 확보 후 본 목록 보강.
- **시스템 요소 분류**: 타이포(H1~Caption), 버튼(Primary/Secondary), 입력(Input, FormField), 카드(Card), 테이블(Table), 페이지네이션(Pagination), StepProgress, Header, Sidebar.
- **TODO**:
  1. FIGMA_IA_FSD_STRUCTURE.md §2(전역 설계 메타), §4(공통 컴포넌트/FSD 후보) 보강.
  2. shared/ui, entities/*/ui, widgets/*/ui와의 매핑 전략 정의 (컴포넌트별 node-id ↔ 구현 파일).
```

**교체할 새 내용**:

```markdown
## 3. 공통 컴포넌트/디자인 시스템 작업 패키지

### 3.1 공통 시스템 프레임 (12개) — name 기준 표

Figma에서 실제 name 확인 시 아래 “Figma name” 컬럼을 갱신할 것. 현재는 추정 유형만 기재.

| node-id | Figma name (확보 후 갱신) | 표현 내용 | 예상 FSD 레이어 | 구현 파일(현재) |
|---------|---------------------------|-----------|------------------|------------------|
| 1194-6635 | (미확보) | 색상/아이콘·공통 스타일 | shared/styles | design-tokens.css |
| 1194-6640 | (미확보) | Button Primary 등 | shared/ui | Button.tsx |
| 1194-6646 | (미확보) | Button Secondary 등 | shared/ui | Button.tsx |
| 1194-7155 | (미확보) | Input/FormField | shared/ui | Input.tsx |
| 1194-7283 | (미확보) | Input/Select | shared/ui | Input.tsx, Select.tsx |
| 1194-7272 | (미확보) | Input·라벨 | shared/ui | Input.tsx |
| 1194-6911 | (미확보) | Card | shared/ui | Card.tsx |
| 1194-7118 | (미확보) | Badge/StatusBadge | shared/ui | StatusBadge.tsx |
| 1194-7156 | (미확보) | Modal | shared/ui | Modal.tsx |
| 1194-6912 | (미확보) | StepProgress | shared/ui | StepProgress.tsx |
| 1194-7208 | (미확보) | Table | shared/ui | Table.tsx |
| 1194-7425 | **Typography** | 타이포 스케일 H1~Caption | shared/ui | Typography.tsx, design-tokens.css |

### 3.2 시스템 요소 분류

- **타이포**: 1194-7425 — H1/H2/H3/H4/Body/Button/Caption, Pretendard, 1440px 기준.
- **버튼**: 1194-6640, 1194-6646 — Primary/Secondary/Ghost/Danger, size sm/md/lg.
- **입력**: 1194-7155, 1194-7283, 1194-7272 — Input, Select, label/error/helperText.
- **카드·배지·모달·스텝·테이블**: 1194-6911, 1194-7118, 1194-7156, 1194-6912, 1194-7208 — Card, StatusBadge, Modal, StepProgress, Table.

### 3.3 TODO

1. FIGMA_IA_FSD_STRUCTURE.md §2(전역 설계 메타)에 §2.3 “공통 디자인 시스템 프레임” 추가, §4.1에 Figma node-id 컬럼 보강.
2. shared/ui, entities/*/ui, widgets/*/ui와의 매핑 전략 정의 및 본 표 “구현 파일” 확정.
3. Figma에서 12개 노드의 실제 name 수집 후 위 표 “Figma name” 갱신.
```

**적용 방법**: `FIGMA_GLOBAL_PLAN.md` 를 열고 “## 3. 공통 컴포넌트/디자인 시스템 작업 패키지” 제목부터 “(컴포넌트별 node-id ↔ 구현 파일).” 로 끝나는 문단까지를 위 “교체할 새 내용” 블록 전체로 **치환**한다.

---

## 4. Figma node ↔ 코드 매핑 표

코드베이스 스캔 결과와 위 분석을 합쳐, **Figma node-id ↔ 구현 파일 ↔ props/variants** 매핑표다. 실제 파일 수정 없이 참고용으로만 사용한다.

| Figma name (또는 추정) | node-id | 구현 파일 경로 | props/variants 간략 요약 |
|------------------------|---------|----------------|---------------------------|
| Typography | 1194-7425 | src/shared/ui/Typography.tsx | variant: h1|h2|h3|h4|body|button|caption, as?: ElementType |
| Button | 1194-6640, 1194-6646 | src/shared/ui/Button.tsx | variant: primary|secondary|ghost|danger, size: sm|md|lg, loading, fullWidth |
| Input | 1194-7155, 1194-7272 | src/shared/ui/Input.tsx | label, error, helperText, fullWidth, (HTML input props) |
| Select | 1194-7283 | src/shared/ui/Select.tsx | options, value, onChange, placeholder |
| Card | 1194-6911 | src/shared/ui/Card.tsx | hover, padding: none|sm|md|lg |
| StatusBadge | 1194-7118 | src/shared/ui/StatusBadge.tsx | label, color, variant: filled|outlined, size: sm|md|lg |
| Modal | 1194-7156 | src/shared/ui/Modal.tsx | open, onClose, title, children |
| StepProgress | 1194-6912 | src/shared/ui/StepProgress.tsx | steps: { id, label, status: completed|current|upcoming }[] |
| Table | 1194-7208 | src/shared/ui/Table.tsx | columns, data, (컴포넌트별 API 상이) |
| Pagination | (공통 12개 외) | src/shared/ui/Pagination.tsx | currentPage, totalPages, onPageChange |
| VehicleCard | (엔티티) | src/entities/vehicle/ui/VehicleCard.tsx | vehicle, onClick, (도메인 props) |
| LandingHeader | (위젯) | src/widgets/Header/ui/LandingHeader.tsx | userName, variant, activeNav, onRegisterListing |
| MainLandingSidebar | (위젯) | src/widgets/MainLandingSidebar/ui/MainLandingSidebar.tsx | searchValue, onSearchChange, activeKey |

**미매핑**: 1194-6635(색상/스타일) — design-tokens.css 전역 변수로만 반영되어 있으며, 단일 “컴포넌트 파일”은 없음. 필요 시 shared/styles 또는 design-tokens 주석에 node-id만 명시해 두면 됨.

---

## 5. 적용 체크리스트 (실제 수정 시)

- [ ] FIGMA_IA_FSD_STRUCTURE.md: §2.2 뒤에 “2.3 공통 디자인 시스템 프레임” 블록 추가.
- [ ] FIGMA_IA_FSD_STRUCTURE.md: §4.1 표에 “Figma node-id” 컬럼 추가 후 위 §2.2 표와 동일하게 행 채우기.
- [ ] FIGMA_GLOBAL_PLAN.md: §3 전체를 위 “교체할 새 내용”(§3.1 표 + §3.2 분류 + §3.3 TODO)으로 교체.
- [ ] Figma에서 12개 노드의 실제 name 확인 후, 본 문서 §1 표 및 FIGMA_GLOBAL_PLAN §3.1 표의 “Figma name” 갱신.
- [ ] (선택) shared/ui 각 컴포넌트 파일 상단 주석에 “Figma node-id: 1194-XXXX” 추가해 추적성 확보.
