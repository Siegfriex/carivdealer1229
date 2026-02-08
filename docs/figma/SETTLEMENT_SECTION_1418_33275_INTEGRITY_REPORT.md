# 정산 / 정산·매출 히스토리 섹션 정합성·무결성 보고서

**대상 섹션**: 정산 / 정산·매출 히스토리 — Figma nodeId `1418:33275`, 자식 4프레임  
**작업 기준**: 정산 섹션 1418-33275 풀스택 정합성 플랜  
**보고 일자**: 2026-02-08  
**(Figma MCP get_screenshot 기반 검증)** — get_metadata(1418:33275), get_design_context(4개), get_screenshot(4개) 수행 완료.

---

## 1. MCP 호출 수행 결과

| 단계 | 도구 | 대상 | 결과 |
|------|------|------|------|
| 1 | get_metadata | 1418:33275 | 호출 완료 |
| 2 | get_design_context | 4개 자식 (36405, 27657, 27434, 27952) | 4건 호출 완료 |
| 3 | get_screenshot | 동일 4개 | **4건 스크린샷 수신** |

---

## 2. 화면 역할·상태 표 (스크린샷 기준)

| nodeId | 역할(스크린샷 기준) | 라우트(예상/확정) | 상태/변형 | MCP 검증 |
|--------|---------------------|-------------------|-----------|----------|
| 1418:36405 | 정산 목록 — 테이블/카드 그리드 + 필터(전체/정산 완료/정산 대기) + 확인 필요차량 + 페이지네이션 | `/settlements` | 목록·필터 | get_screenshot OK |
| 1418:27657 | 정산 상세 — 차량 정보 + 전체 피드백(검차 요약) + 정산 테이블(상태/판매가/검차·탁송비/정산금액/정산일) | `/settlements/:id` | 상세 | get_screenshot OK |
| 1418:27434 | 정산 현황 — 차량 정보 + 검차 피드백 + 정산 테이블(정산완료 등) | `/settlements/:id` | 상세·검차 피드백 | get_screenshot OK |
| 1418:27952 | 정산 현황 — 현재 거래 진행상황 사이드바 + 차량정보 카드 + 정산 상세 테이블 | `/settlements/:id` | 상세·진행상황 | get_screenshot OK |

---

## 3. 갭 요약

- **섹션 1418:33275**는 "정산 / 정산·매출 히스토리" 통합. 4개 자식 중 스크린샷 기준 **정산 목록** 1건(36405), **정산 상세/정산 현황** 3건(27657, 27434, 27952). 매출/정산 히스토리 전용 화면(/sales/history)은 4프레임 중 명시적 대응 없음 — SalesHistoryPage는 코드만 존재, Figma는 정산 목록·상세 변형으로 수용.
- **코드 갭**: Figma 상태 탭(전체/정산 완료/정산 대기) vs 코드 SettlementListPage filter(all/completed/pending) 라벨 일치. 정산 상세 테이블 컬럼(상태, 판매가, 검차/탁송비, 정산금액, 정산일)과 SettlementDetailPage 필드 매핑. MainLandingSidebar 유무(SalesHistoryPage는 activeNav="offers")·정산 전용 탭(SettlementSectionTabs) 부재 검토. 금액 포맷(만원 단위)·상태 뱃지(정산완료↔completed/paid) 문서화.

---

## 4. 반영된 문서

| 문서 | 반영 내용 |
|------|-----------|
| **FIGMA_IA_FSD_STRUCTURE.md** | §3.11: 섹션 1418:33275, 4개 프레임 목록·IA 트리·플로우·Mermaid·공통 컴포넌트·코드 매핑·갭. |
| **FIGMA_GLOBAL_PLAN.md** | §2.10 "정산 / 정산·매출 히스토리 (1418-33275)" 신규 추가. 4개 node-id 포함 페이지 표·라우트·구현 페이지·IA §3.11 참조. |
| **CarivDealer_API_ERD_Mapping.md** | "정산/매출 플로우 관련 필드/상태/엔드포인트 (제안)" 섹션 및 문서 이력 1.8 추가. |
| **CarivDealer_api_v1.md** | 정산·매출 REST 미포함 유지 + 추가 제안 bullet(GET /settlements, GET /settlements/:id, GET /sales/history 등). |

---

## 5. 결론

정산(정산·매출 히스토리) 섹션(1418:33275)에 대해 **MCP 3단계(get_metadata → get_design_context → get_screenshot)** 를 **4개 자식 전원**에 수행하였고, 스크린샷 기준 역할·라우트·상태를 확정하였다. IA §3.11, Global Plan §2.10, 코드 매핑·ERD/API 제안을 반영하여 정합성·무결성을 맞추었다.
