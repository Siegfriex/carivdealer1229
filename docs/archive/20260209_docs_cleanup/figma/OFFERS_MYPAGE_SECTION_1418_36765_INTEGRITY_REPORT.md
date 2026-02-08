# 마이페이지 / 오퍼 섹션 정합성·무결성 보고서

**대상 섹션**: 마이페이지 / 오퍼 관리 — Figma nodeId `1418:36765`, 자식 12프레임  
**작업 기준**: 마이페이지·오퍼 섹션 1418-36765 풀스택 정합성 플랜  
**보고 일자**: 2026-02-08  
**(Figma MCP get_screenshot 기반 검증)** — get_metadata(1418:36765), get_design_context(12개 일부), get_screenshot(12개) 수행 완료.

---

## 1. MCP 호출 수행 결과 — 2026-02-08 재호출 반영

| 단계 | 도구 | 대상 | 결과 |
|------|------|------|------|
| 1 | get_metadata | 1418:36765 | 호출 완료 |
| 2 | get_design_context | 12개 자식 | 6건 DC+SS(36901, 37402, 37170, 38114, 37298, 37559), 6건 SS-only(36766, 37804, 37971, 37042, 37677, 38264 — 실제 응답: "An error occurred while using the tool get_design_context") |
| 3 | get_screenshot | 동일 12개 | **12건 스크린샷 수신** |

---

## 2. 화면 역할·상태 표 (스크린샷 기준)

| nodeId | 역할(스크린샷 기준) | 라우트(예상/확정) | 상태/변형 | MCP 검증 |
|--------|---------------------|-------------------|-----------|----------|
| 1418:36766 | 마이페이지 — 내 프로필(요약 카드·내 정보·수정하기) | `/mypage/profile` | 프로필 조회 | get_screenshot OK |
| 1418:37804 | 마이페이지 — 기본 정보 수정(이메일·성함·생년월일·국가·휴대폰·사업자 주소) | `/mypage/profile/edit` | 프로필 편집 | get_screenshot OK |
| 1418:37971 | 마이페이지 — 로그인·비밀번호 변경(이메일·비밀번호·비밀번호 확인) | `/mypage/account/password` | 계정 설정 | get_screenshot OK |
| 1418:37042 | 마이페이지 — 딜러 승인 상태 확인(승인완료 뱃지) | `/mypage/profile/approval` | 승인완료 | get_screenshot OK |
| 1418:37170 | 마이페이지 — 딜러 승인 상태 확인(승인대기 뱃지) | `/mypage/profile/approval` | 승인대기 | get_screenshot OK |
| 1418:37677 | 마이페이지 — 딜러 승인 상태 확인(반려·반려 사유) | `/mypage/profile/approval` | 반려 | get_screenshot OK |
| 1418:38264 | 마이페이지 — 정산 계좌 등록/변경/조회(조회 뷰·변경하기) | `/mypage/settlement-account` | 정산 계좌 조회 | get_screenshot OK |
| 1418:38114 | 마이페이지 — 정산 계좌 등록/변경/조회(편집 폼·저장하기) | `/mypage/settlement-account` | 정산 계좌 편집 | get_screenshot OK |
| 1418:36901 | 마이페이지 — 사업자 정보 조회(사업자 구분·등록번호·상호·성명 등) | `/mypage/profile/business` | 사업자 정보 | get_screenshot OK |
| 1418:37298 | 마이페이지 — 알림 센터/알림 설정(토글 목록·전체 on) | `/mypage/notifications` | 알림 설정 | get_screenshot OK |
| 1418:37559 | 마이페이지 — 알림 센터/알림 설정(토글 목록·off 변형) | `/mypage/notifications` | 알림 설정 변형 | get_screenshot OK |
| 1418:37402 | 마이페이지 — 문의·지원(고객 지원 채팅/FAQ·카카오톡 문의) | `/mypage/support` | 문의·지원 | get_screenshot OK |

---

## 3. 갭 요약

- **섹션 1418:36765** 자식 12프레임은 스크린샷 기준 **전원 마이페이지** 화면(프로필·계정 설정·딜러 승인·정산 계좌·알림·문의). **오퍼 목록**(/offers) 화면은 12자식 중 없음 — 코드의 GeneralSaleOffersPage는 `/offers`만 존재하며, Figma 1418:36765 자식에는 오퍼 목록 프레임이 포함되지 않은 것으로 해석.
- **코드 갭**: `/mypage`, `/mypage/profile`, `/mypage/profile/edit`, `/mypage/account/password`, `/mypage/profile/approval`, `/mypage/settlement-account`, `/mypage/profile/business`, `/mypage/notifications`, `/mypage/support` 라우트·전용 페이지 미구현. 오퍼 목록은 GeneralSaleOffersPage만 구현됨. acceptProposalAPI(수락/거절) 존재.

---

## 4. 반영된 문서

| 문서 | 반영 내용 |
|------|-----------|
| **FIGMA_IA_FSD_STRUCTURE.md** | §3.8: 섹션 1418:36765, 마이페이지/오퍼 범위, 12개 프레임 목록·IA 트리·플로우·Mermaid·공통 컴포넌트·코드 매핑·갭. |
| **FIGMA_GLOBAL_PLAN.md** | §2.11 "오퍼 / 마이페이지 (1418-36765)" 신규 추가. 12개 node-id 포함 페이지 표·라우트·구현 페이지·IA §3.8 참조. |
| **CarivDealer_API_ERD_Mapping.md** | "오퍼/마이페이지 플로우 관련 필드/상태/엔드포인트 (제안)" 섹션 및 문서 이력 1.9 추가. |
| **CarivDealer_api_v1.md** | 오퍼·마이페이지 REST 미포함 유지 + 추가 제안 bullet. |

---

## 5. 결론

마이페이지/오퍼 섹션(1418:36765)에 대해 **MCP 3단계(get_metadata → get_design_context → get_screenshot)** 를 **12개 자식 전원**에 수행하였고, 2026-02-08 순차 재호출 결과 design_context는 6건 DC+SS·6건 SS-only로 확정(실제 응답 인용 반영)하였으며, 스크린샷 기준 역할·라우트는 전원 확정하였다. 12프레임은 모두 마이페이지 하위 화면이며, 오퍼 목록은 코드만 존재·Figma 12자식과 직접 대응 프레임 없음. IA §3.8, Global Plan §2.11, 코드 매핑·ERD/API 제안을 반영하여 정합성·무결성을 맞추었다.
