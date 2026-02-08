# 검차 섹션(§3.6) 정합성·무결성 작업 보고

**대상**: Figma 섹션 3.6 검차 (검차 요청 및 진행), node-id 1425-9149, 자식 9프레임.  
**기준**: Figma MCP get_metadata / get_screenshot / get_design_context, IA·Global Plan·코드·API·ERD.

---

## 1. 수행 요약

| 단계 | 내용 | 결과 |
|------|------|------|
| 1 | Figma MCP: get_metadata(1425:9149), get_screenshot(9개 자식) | 9개 프레임 역할·상태·라우트 스크린샷 기반 확정 |
| 2 | 화면 역할·상태 표 정리 + IA 트리 | §3.6.2 표에 nodeId\|역할\|라우트\|상태/변형\|MCP 검증 여부 반영 |
| 3 | 플로우·플로우차트 | §3.6.5~3.6.7 기존 유지(검차 신청/진행·완료 Mermaid) |
| 4 | 코드 매핑 | §3.6.8 구현↔nodeId↔라우트 표 + 갭 정리(일치/부족/추가/플로우 차이) |
| 5 | ERD/API 필드·상태 매핑 | §3.6.9 데이터 상태/ERD/API 메모 추가, CarivDealer_API_ERD_Mapping 검차 플로우 섹션 추가 |
| 6 | Global Plan §2.5 | 포함 페이지 표에 비고/우선순위 컬럼 및 (Figma MCP get_screenshot 검증) 명시 |

---

## 2. 반영된 문서

- **FIGMA_IA_FSD_STRUCTURE.md**  
  - §3.6.2 페이지 프레임 목록: 컬럼 상태/변형, MCP 검증 여부 추가.  
  - §3.6.8 갭 정리: 일치/부족/추가/플로우 차이 세분화.  
  - §3.6.9 데이터 상태/ERD/API 메모: nodeId별 엔티티·필드·상태·API 표 + UI 라벨↔enum 매핑 제안.

- **FIGMA_GLOBAL_PLAN.md**  
  - §2.5 검차 요청 및 진행: 포함 페이지 표에 비고/우선순위 컬럼 추가, IA·§3.6.9 참조 문구 정리.

- **CarivDealer_API_ERD_Mapping.md**  
  - 신규 섹션 "검차 플로우 관련 필드/상태/열거 매핑": 엔티티별 화면·필드 표, UI 라벨↔inspection.status, TODO(API 확장·enum·타입 정합). 문서 이력 1.3 추가.

---

## 3. MCP 검증 근거 — 2026-02-08 design_context 9개 호출 반영

- get_metadata(1425:9149), get_screenshot(9개 자식) 호출 완료.
- get_design_context(9개 자식) 호출 완료: 1444:8198, 1425:9445(기존), 1425:9661, 9875, 10137, 10663, 10813, 10285, 10443(2026-02-08 최초 호출). 7건은 PARTIAL(스크린샷 안내 반환).
- 역할·라우트·상태는 get_screenshot 기반 확정. 문서 내 "(Figma MCP get_screenshot 검증)" 문구: FIGMA_IA_FSD_STRUCTURE.md §3.6.2, FIGMA_GLOBAL_PLAN.md §2.5 포함 페이지 표 상단.

---

## 4. 갭·TODO 요약

- **코드 갭**: Step1 차량 선택·캘린더·검차비 결제 UI; 목록 임시저장(중복됨)·차량보관 탭; complete 요약/상세 분리·피드백 카드.  
- **API**: 검차 목록 전용 REST(GET /inspections) 명세 확장 제안.  
- **ERD/열거**: DRAFT_DUPLICATE, STORAGE(차량보관) 등 UI 라벨 대응 enum 확장 제안.  
- 상세 TODO는 FIGMA_IA_FSD_STRUCTURE.md §3.6.8 갭 정리, CarivDealer_API_ERD_Mapping.md "검차 플로우 관련 필드/상태/열거 매핑" 참고.

---

**작업 일자**: 2026-02-07.  
**기준 문서**: FIGMA_IA_FSD_STRUCTURE.md, FIGMA_GLOBAL_PLAN.md, CarivDealer_api_v1.md, CarivDealer_API_ERD_Mapping.md, src/pages/admin/inspection/*, src/entities/inspection/*.
