# 판매방식 선택 섹션(1368-41153) 정합성·무결성 작업 보고서

**작업 일자**: 2026-02-07  
**Figma 파일**: fileKey `4w3ft8RpGwoho5EtvNO9hQ`  
**검증 방법**: Figma MCP `get_metadata`, `get_design_context`, `get_screenshot` 호출 기반.

---

## 1. 실행 요약

- **대상 섹션**: Figma nodeId `1368:41153` (판매방식 선택), 자식 프레임 `1368:41154`, `1368:41309`.
- **역할 확정**: **(Figma MCP get_screenshot 기반 검증)** — 두 프레임 모두 "판매 방식 선택" 화면(일반 판매·경매 카드, 거래 진행 사이드바). 차량 상세 페이지 내부 섹션으로 구현됨, 별도 전용 페이지 아님.
- **라우트**: `/vehicles/:id`. 선택 시 일반 판매 → `/vehicles/:id/sale/analyzing`, 경매 → `/vehicles/:id/auction`.
- **문서 반영**: FIGMA_IA_FSD_STRUCTURE.md §3.5.8, FIGMA_GLOBAL_PLAN.md §2.6, CarivDealer_API_ERD_Mapping.md "판매방식 선택 관련" 초안 반영 완료.

---

## 2. MCP 검증 요약

| 단계 | 도구 | 대상 | 결과 |
|------|------|------|------|
| 1 | get_metadata | 1368:41153 | 섹션 구조 확인 |
| 2 | get_design_context | 1368:41154, 1368:41309 | 레이아웃·컴포넌트 참고 |
| 3 | get_screenshot | 1368:41154, 1368:41309 | 역할·UI 확정 — 동일 "판매 방식 선택" 화면 |

---

## 3. 화면 역할·상태 표 (최종)

| nodeId | 역할(스크린샷 기준) | 라우트 | 상태/변형 | MCP 검증 |
|--------|---------------------|--------|-----------|----------|
| 1368:41154 | 판매방식 선택 — 일반·경매 카드 | `/vehicles/:id` | 기본(미선택) | get_screenshot OK |
| 1368:41309 | 판매방식 선택 — 동일 선택 UI 변형 | `/vehicles/:id` | 동일 화면 변형 | get_screenshot OK |

---

## 4. 갭·TODO

- **Figma vs 코드**: Figma 1368-41154/41309는 **동일 페이지(차량 상세) 내 섹션**으로 매핑. VehicleDetailPage.tsx SCR-0300 "판매 방식을 선택하세요"와 일치.
- **API/ERD**: 판매방식 선택 시 전용 API 없음. 선택은 네비게이션만. 필요 시 `vehicle.sale_mode`(GENERAL | AUCTION) 및 PATCH /vehicles/:id 확장 검토 — CarivDealer_API_ERD_Mapping.md "판매방식 선택 관련" 참고.
- **FIGMA_11_SECTIONS_TO_APP_MAP**: 1368-41153이 "로그인·회원가입"으로 매핑된 불일치는 본 작업 범위에서 수정하지 않음. 별도 이슈 권장.

---

## 5. 산출물 위치

| 산출물 | 위치 |
|--------|------|
| IA 블록 | FIGMA_IA_FSD_STRUCTURE.md §3.5.8 |
| Global Plan | FIGMA_GLOBAL_PLAN.md §2.6 |
| API/ERD 초안 | CarivDealer_API_ERD_Mapping.md "판매방식 선택 관련 필드/상태/enum·엔드포인트 (초안)" |
| 본 보고서 | docs/figma/SALE_MODE_SECTION_INTEGRITY_REPORT.md |
