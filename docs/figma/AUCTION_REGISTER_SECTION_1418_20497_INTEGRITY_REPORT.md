# 경매 거래 / 차량 등록·상세·경매 섹션 정합성·무결성 보고서

**대상 섹션**: 경매 거래 / 차량 등록·상세·경매 — Figma nodeId `1418:20497`, 자식 14프레임  
**작업 기준**: HANDOFF_AGENT_FIGMA_IA_INTEGRITY.md §7, 경매 거래 섹션 1418-20497 정합성 플랜  
**보고 일자**: 2026-02-08  
**(Figma MCP get_screenshot 기반 검증)** — get_metadata(1418:20497), get_design_context(14개), get_screenshot(14개) 수행 완료.

---

## 1. MCP 호출 수행 결과

| 단계 | 도구 | 대상 | 결과 |
|------|------|------|------|
| 1 | get_metadata | 1418:20497 | 호출 완료 |
| 2 | get_design_context | 14개 자식 (20498, 23705, 23880, 20576, 21868, 22630, 24679, 24463, 21690, 21512, 24856, 22153, 22315, 22951) | 14건 호출 완료 |
| 3 | get_screenshot | 동일 14개 | **14건 스크린샷 수신** |

---

## 2. 화면 역할·상태 표 (스크린샷 기준)

| nodeId | 역할(스크린샷 기준) | 라우트(예상/확정) | 도메인 | 상태/변형 | MCP 검증 |
|--------|---------------------|-------------------|--------|-----------|----------|
| 1418:20498 | 기준 가격 설정 — 시세 분석 로딩 | `/vehicles/:id/sale/analyzing` | 일반판매 | 로딩 | get_screenshot OK |
| 1418:23705 | 경매 사전 설정 (시작가·즉시판매가 입력) | `/vehicles/:id/auction/start-price` | 경매 | 초기 설정 | get_screenshot OK |
| 1418:23880 | 경매 사전 설정 (값 입력됨) | `/vehicles/:id/auction/start-price` | 경매 | 폼 | get_screenshot OK |
| 1418:20576 | 판매 상태 전환 완료 | 완료 화면 | 완료 | 완료 | get_screenshot OK |
| 1418:21868 | 거래 목록 — 탭·그리드·카드 | `/vehicles` | 목록 | 목록 | get_screenshot OK |
| 1418:22630 | 판매/거래 목록 — 그리드 | `/vehicles` | 목록 | 목록 | get_screenshot OK |
| 1418:24679 | 거래 상세 보기 (차량정보·판매방식·구매제안) | `/vehicles/:id` | 상세 | 상세 | get_screenshot OK |
| 1418:24463 | 거래 상세 보기 | `/vehicles/:id` | 상세 | 상세 | get_screenshot OK |
| 1418:21690 | 거래 상세 + 보관 확인 모달 | `/vehicles/:id` | 상세 | 상세+모달 | get_screenshot OK |
| 1418:21512 | 거래 상세 + 삭제 확인 모달 | `/vehicles/:id` | 상세 | 상세+모달 | get_screenshot OK |
| 1418:24856 | 거래 상세 + "판매 방식 변경 불가" 모달 | `/vehicles/:id` | 상세 | 상세+모달 | get_screenshot OK |
| 1418:22153 | 판매 방식 변경 전 확인 모달 (동의) | `/vehicles/:id` | 상세 | 모달 | get_screenshot OK |
| 1418:22315 | 판매 방식 변경 전 확인 모달 (동의 체크됨) | `/vehicles/:id` | 상세 | 모달 | get_screenshot OK |
| 1418:22951 | 거래 상세 + 거래 현황판·정산 현황 | `/vehicles/:id` 등 | 상세/정산 | 거래완료 후 | get_screenshot OK |

---

## 3. 갭 요약

- **섹션 1418:20497**은 "경매 거래 / 차량 등록·상세·경매" 통합. 14개 자식 중 스크린샷 기준 **등록 진입/step1/step2/등록완료 화면은 0건**. 경매 시작가 설정 2건(23705, 23880), 거래 상세·모달 7건, 거래/정산 현황 1건, 목록 2건, 시세 로딩 1건, 판매 전환 완료 1건.
- **문서·코드 정합성**: IA §3.5·§3.9, Global Plan §2.8에 14프레임 역할·라우트·도메인 반영. VehicleDetailPage, AuctionStartPricePage 등 코드와 nodeId 매핑 표 정리. ERD/API에는 경매 플로우 필드·상태·엔드포인트 제안 반영.

---

## 4. 반영된 문서

| 문서 | 반영 내용 |
|------|-----------|
| **FIGMA_IA_FSD_STRUCTURE.md** | §3.5.2·§3.5.2b 14프레임 전원, §3.5.7 코드 매핑. §3.9 경매: nodeId 1418:23705, 23880(경매 시작가), 20576(완료), IA 트리·플로우·Mermaid. |
| **FIGMA_GLOBAL_PLAN.md** | §2.8 "경매 거래 / 차량 등록·상세·경매(1418-20497)" 교체. 14개 node-id 포함 페이지 표·의도된 역할·MCP 실제 결과. |
| **CarivDealer_API_ERD_Mapping.md** | "경매 플로우 관련 필드/상태/엔드포인트 (제안)" 섹션 및 문서 이력 1.6 추가. |

---

## 5. 결론

경매 거래(차량 등록·상세·경매) 섹션(1418-20497)에 대해 **MCP 3단계(get_metadata → get_design_context → get_screenshot)** 를 **14개 자식 전원**에 수행하였고, 스크린샷 기준 역할·라우트·도메인을 확정하였다. IA §3.5·§3.9, Global Plan §2.8, 코드 매핑·ERD/API 제안을 반영하여 정합성·무결성을 맞추었다.
