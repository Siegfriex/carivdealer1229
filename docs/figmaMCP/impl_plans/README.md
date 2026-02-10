# 노드별 구현 계획서

**목적**: Figma 노드(화면) 단위로 "어떤 파일을 어떻게 바꿀지" 구현 계획을 보관.

---

## 파일명 규칙

- `{nodeId하이픈}_구현계획.md`
- 예: `1418-24679_구현계획.md`, `1425-7280_구현계획.md`

---

## 계획서에 넣을 섹션

1. **목표** — 해당 노드 ID, IA 화면 라벨, 대응 라우트·페이지 컴포넌트
2. **변경 대상 파일** — 수정할 소스 경로 목록 (pages, widgets, shared 등)
3. **의존성** — 라우트(router.tsx), 위젯(Header, Sidebar 등), z-index(모달·GNB), 공통 스타일(design-tokens), API/features
4. **MCP 스타일 → 프로젝트 디자인 토큰 매핑** — MCP에서 나온 색·쉐도우 등을 design-tokens/기존 CSS에 어떻게 매핑할지
5. **레이아웃 스펙** — metadata_raw·design_context 생성 코드에서 추출한 노드 id별 (x, y, width, height) 테이블. 구현 시 각 블록에 이 값(또는 비율)을 적용할 것.
6. **위험/주의사항** — 터치 시 주의할 점, 기존 동작 유지 등

---

## 템플릿

새 계획서 작성 시 [\_template_impl_plan.md](_template_impl_plan.md)를 복사한 뒤, 파일명을 `{nodeId하이픈}_구현계획.md`로 바꾸고 각 섹션을 채워 넣으세요.

---

*문서 버전: 1.0 | 최종 업데이트: 2025-02-10*
