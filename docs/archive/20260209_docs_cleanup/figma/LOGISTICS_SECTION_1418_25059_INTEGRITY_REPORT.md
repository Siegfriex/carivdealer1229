# 탁송 / 물류 스케줄·히스토리 섹션 정합성·무결성 보고서

**대상 섹션**: 탁송 / 물류 스케줄·히스토리 — Figma nodeId `1418:25059`, 자식 11프레임  
**작업 기준**: 탁송 섹션 1418-25059 풀스택 정합성 플랜  
**보고 일자**: 2026-02-08  
**(Figma MCP get_screenshot 기반 검증)** — get_metadata(1418:25059), get_design_context(11개), get_screenshot(11개) 수행 완료.

---

## 1. MCP 호출 수행 결과

| 단계 | 도구 | 대상 | 결과 |
|------|------|------|------|
| 1 | get_metadata | 1418:25059 | 호출 완료 |
| 2 | get_design_context | 11개 자식 (29145, 28880, 25060, 25219, 27070, 26827, 25400, 25619, 26067, 26325, 26583) | 11건 호출 완료 |
| 3 | get_screenshot | 동일 11개 | **11건 스크린샷 수신** |

---

## 2. 화면 역할·상태 표 (스크린샷 기준)

| nodeId | 역할(스크린샷 기준) | 라우트(예상/확정) | 상태/변형 | MCP 검증 |
|--------|---------------------|-------------------|-----------|----------|
| 1418:29145 | 물류 스케줄 목록 — 탁송 단계(상태 필터·확인 필요차량·카드) | `/logistics/schedule` | 목록·필터 | get_screenshot OK |
| 1418:28880 | 물류 목록 — 탁송 목록(상태 탭·조회기간·그리드/리스트) | `/logistics/schedule` | 목록·뷰 옵션 | get_screenshot OK |
| 1418:25060 | 탁송 신청 — 차량 정보·검차 피드백·새 탁송 예약 CTA | `/logistics/request` 또는 schedule 진입 | 요청 생성 | get_screenshot OK |
| 1418:25219 | 탁송 신청 완료 — 기사 방문 확정·진행 타임라인(요청→배정→픽업→인계) | `/logistics/:id` | 상세·타임라인 | get_screenshot OK |
| 1418:27070 | 새 탁송 예약 — 주소 검색 모달(결과 목록) | `/logistics/schedule` | 폼·모달 | get_screenshot OK |
| 1418:26827 | 새 탁송 예약 — 주소 검색 모달(검색 예시) | `/logistics/schedule` | 폼·모달 | get_screenshot OK |
| 1418:25400 | 새 탁송 예약 — 탁송 장소·일정·결제 섹션 | `/logistics/schedule` | 폼 | get_screenshot OK |
| 1418:25619 | 새 탁송 예약 — 일별 달력 팝업 | `/logistics/schedule` | 폼·캘린더 모달 | get_screenshot OK |
| 1418:26067 | 새 탁송 예약 — 월별 달력 모달 | `/logistics/schedule` | 폼·캘린더 모달 | get_screenshot OK |
| 1418:26325 | 새 탁송 예약 — 월 선택 | `/logistics/schedule` | 폼·날짜 변형 | get_screenshot OK |
| 1418:26583 | 새 탁송 예약 — 시간 선택 모달 | `/logistics/schedule` | 폼·시간 모달 | get_screenshot OK |

---

## 3. 갭 요약

- **섹션 1418:25059**는 "탁송 / 물류 스케줄·히스토리" 통합. 11개 자식 중 스크린샷 기준 **물류 스케줄 목록** 2건(29145, 28880), **탁송 신청/신청 완료** 2건(25060, 25219), **새 탁송 예약 폼·모달** 7건(27070, 26827, 25400, 25619, 26067, 26325, 26583).
- **코드 갭**: Figma 상태 탭 라벨(탁송 신청/탁송 매칭 중/탁송 매칭완료/탁송 완료) vs 코드 `LogisticsStatus`(scheduled, dispatched, in_transit, completed) 라벨 매핑 보강 필요. 타임라인(탁송요청→기사 배정→픽업 완료→인계 완료) UI 컴포넌트, PIN 인계 모달은 History 페이지에만 존재·Figma 상세와 정합 검토. DateRangePicker/캘린더·주소 검색 모달은 스케줄 폼에 반영 시 Figma와 일치시키기.

---

## 4. 반영된 문서

| 문서 | 반영 내용 |
|------|-----------|
| **FIGMA_IA_FSD_STRUCTURE.md** | §3.10: 섹션 1418:25059, 11개 프레임 목록·IA 트리·플로우·Mermaid·공통 컴포넌트·코드 매핑·갭. |
| **FIGMA_GLOBAL_PLAN.md** | §2.9 "탁송 / 물류 스케줄·히스토리 (1418-25059)" 신규 추가. 11개 node-id 포함 페이지 표·라우트·구현 페이지·IA §3.10 참조. |
| **CarivDealer_API_ERD_Mapping.md** | "물류/탁송 플로우 관련 필드/상태/엔드포인트 (제안)" 섹션 및 문서 이력 1.7 추가. |
| **CarivDealer_api_v1.md** | 탁송 REST 미포함 유지 + 추가 제안 bullet(GET/POST /logistics/schedule, GET /logistics/history, GET /logistics/:id, PIN 인계 등). |

---

## 5. 결론

탁송(물류 스케줄·히스토리) 섹션(1418:25059)에 대해 **MCP 3단계(get_metadata → get_design_context → get_screenshot)** 를 **11개 자식 전원**에 수행하였고, 스크린샷 기준 역할·라우트·상태를 확정하였다. IA §3.10, Global Plan §2.9, 코드 매핑·ERD/API 제안을 반영하여 정합성·무결성을 맞추었다.
