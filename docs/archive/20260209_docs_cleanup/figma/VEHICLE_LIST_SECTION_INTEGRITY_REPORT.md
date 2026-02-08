# 일반 거래(차량 목록) 섹션 정합성·무결성 보고서

**대상 섹션**: 일반 거래 / 차량 목록 — Figma nodeId `1418:15486`, 자식 13개 프레임  
**작업 기준**: 일반 거래(차량 목록) 섹션(1418-15486) 정합성·무결성 작업 계획  
**보고 일자**: 2026-02-07  
**(Figma MCP get_screenshot 기반 검증)** — get_metadata, get_design_context(13개), get_screenshot(13개) 수행 완료.

---

## 1. MCP 호출 수행 결과

| 단계 | 도구 | 대상 | 결과 |
|------|------|------|------|
| 1 | get_metadata | 1418:15486 | 호출 완료 (메타데이터 메시지 반환) |
| 2 | get_design_context | 1418:15487 ~ 1418:17196 (13개) | 13건 호출 완료 (컨텍스트 메시지 반환) |
| 3 | get_screenshot | 1418:15487 ~ 1418:17196 (13개) | **13건 스크린샷 수신** |

---

## 2. 화면 역할·상태 표 (스크린샷 기준)

| nodeId | 역할(스크린샷 기준) | 라우트(실제 대응) | 상태/변형 | MCP 검증 |
|--------|---------------------|-------------------|-----------|----------|
| 1418:15487 | 기준 가격 설정 — 시세 분석 로딩 | `/vehicles/:id/sale/analyzing` 등 | 로딩 | get_screenshot OK |
| 1418:15695 | 판매 가격 설정 (단일 차량) | `/vehicles/:id/sale/price` | 폼 | get_screenshot OK |
| 1418:15903 | 판매 가격 설정 (동일) | `/vehicles/:id/sale/price` | 폼 | get_screenshot OK |
| 1418:15565 | 판매 상태 전환 완료 | 완료 화면 | 완료 | get_screenshot OK |
| **1418:17357** | **거래 목록 — 탭·그리드·카드·페이지네이션** | `/vehicles` 또는 거래 목록 | **목록** | get_screenshot OK |
| **1418:20145** | **차량목록·판매/거래 — 확인 필요차량·그리드·페이지네이션** | `/vehicles` | **목록** | get_screenshot OK |
| 1418:16327 | 거래 상세 보기 | `/vehicles/:id` | 상세 | get_screenshot OK |
| 1418:16111 | 거래 상세 보기 | `/vehicles/:id` | 상세 | get_screenshot OK |
| 1418:16860 | 거래 상세 + 보관 확인 모달 | `/vehicles/:id` | 모달 | get_screenshot OK |
| 1418:16684 | 거래 상세 + 삭제 확인 모달 | `/vehicles/:id` | 모달 | get_screenshot OK |
| 1418:17629 | 거래 상세 + "판매 방식 변경 불가" 모달 | `/vehicles/:id` | 모달 | get_screenshot OK |
| 1418:17036 | 거래 상세 + 판매 방식 변경 확인 모달 | `/vehicles/:id` | 모달 | get_screenshot OK |
| 1418:17196 | 거래 상세 + 판매 방식 변경 확인 모달(동의) | `/vehicles/:id` | 모달 | get_screenshot OK |

---

## 3. 갭 요약

- **Figma 섹션 vs 자식 프레임**: 섹션 1418:15486은 "차량 목록"으로 정의되어 있으나, **13개 자식 프레임 중 스크린샷 기준 목록 화면은 2개**(1418:17357, 1418:20145). 나머지 11개는 기준/판매 가격 설정·완료·거래 상세·모달 등 **다른 플로우**로 노출됨. (프로토타입 링크/배치 이슈 가능.)
- **문서·코드 정합성**: IA §3.4, Global Plan §2.7, VehicleListPage는 **앱 기준 목록 플로우**(/vehicles, 필터/뷰/페이징)를 우선 유지. Figma 내 "목록 전용" 프레임만 1418-15486 하위로 재배치 시 문서와 시각 일치 권장.
- **URL 쿼리·정렬**: VehicleListPage의 useSearchParams 동기화, sort UI·API 연동은 기존 갭으로 유지.

---

## 4. 반영된 문서

| 문서 | 반영 내용 |
|------|-----------|
| **FIGMA_IA_FSD_STRUCTURE.md** | §3.4 상단에 MCP 검증 문구. §3.4.2b 추가 — MCP get_screenshot 실제 결과 표 및 갭 요약. §3.4.2는 의도된 역할(플랜/앱 기준) 유지. |
| **FIGMA_GLOBAL_PLAN.md** | §2.7 "Figma MCP get_screenshot 기반 검증" 문구, 의도된 역할 표 + MCP 실제 결과 표 추가, 갭 설명. |
| **CarivDealer_API_ERD_Mapping.md** | 차량 목록/일반 거래 필터·정렬·상태 매핑 섹션 및 이력 1.5 기존 유지. |

---

## 5. 결론

일반 거래(차량 목록) 섹션(1418-15486)에 대해 **MCP 3단계(get_metadata → get_design_context → get_screenshot)를 수행**하였고, **13개 프레임 스크린샷을 기준으로** 역할을 확정하였다. 스크린샷 상 목록 화면은 2건(1418:17357, 1418:20145)이며, 나머지는 다른 플로우 화면으로 **갭**을 IA·Global Plan에 명시하였다. 앱/코드/API/ERD는 목록 플로우 기준으로 정합 유지.
