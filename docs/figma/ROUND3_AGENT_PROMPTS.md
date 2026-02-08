# 라운드 3 에이전트 개별 프롬프트 (복사·붙여넣기)

**기준**: [IMAGE_SCREEN_CYCLE_BLUEPRINT.md](IMAGE_SCREEN_CYCLE_BLUEPRINT.md), [FIGMASCR0208/VERIFICATION_TABLE.md](../FIGMASCR0208/VERIFICATION_TABLE.md) — FIGMASCR0208 현재 배치 반영.  
**사용법**: 아래 블록을 해당 에이전트 세션에 복사해 붙여넣기. IA·API/ERD 참조 필수. 완료 후 [SCREEN_IMAGE_CYCLE_LOG.md](SCREEN_IMAGE_CYCLE_LOG.md) 기입.

---

## 라운드 3 완료 — 관리 에이전트 확인

| 항목 | 내용 |
|------|------|
| **에이전트 A** (사이클 7, §3.4 차량 목록) | 완료. 로그: [SCREEN_IMAGE_CYCLE_LOG.md](SCREEN_IMAGE_CYCLE_LOG.md) § 라운드 3 — 에이전트 A. |
| **에이전트 B** (사이클 13, §3.5) | 완료. 로그: 동일 § 에이전트 B. |
| **에이전트 C** (사이클 17, §3.6 검차) | 완료. 코드베이스 검증: InspectionProgressPage(10137 매칭중·10663 이동중·10813 완료), InspectionCompletePage, 라우트 /inspections/:id/progress·complete. 로그: 동일 § 에이전트 C. |
| **관리 에이전트 검증 일시** | 2026-02-08 (현 코드베이스 검증·빌드 통과) |
| **다음 단계** | 라운드 4: [ROUND4_AGENT_PROMPTS.md](ROUND4_AGENT_PROMPTS.md). A=사이클 8(§3.4), B=사이클 14(§3.5), C=사이클 18(§3.6). [MCP_AGENT_FULL_ROADMAP.md](MCP_AGENT_FULL_ROADMAP.md) §3·[VERIFICATION_TABLE.md](../FIGMASCR0208/VERIFICATION_TABLE.md) 기준. |
| **관리 E2E** | 라운드 3 전용: `npx playwright test tests/e2e/round3-agent-a-vehicle-list-screenshot.spec.ts tests/e2e/round3-agent-b-screenshots.spec.ts tests/e2e/round3-agent-c-inspection-progress-screenshot.spec.ts` |

---

## 라운드 3 — 사이클 할당

| 에이전트 | 사이클 | 섹션 | 대표 라우트 |
|----------|--------|------|-------------|
| **A** | 7 | §3.4 차량 목록 | `/vehicles` (등록완료 탭·그리드/리스트 변형) |
| **B** | 13 | §3.5 차량 등록·상세·경매 | `/vehicles/:id/auction/*` (거래 상세·경매) |
| **C** | 17 | §3.6 검차 | `/inspections/:id/progress`, `/inspections/:id/complete` 등 |

---

## 에이전트 A용 (라운드 3, 사이클 7, §3.4 차량 목록)

```
이번 1회 사이클을 진행해줘. 플랜 B + IMAGE_SCREEN_CYCLE_BLUEPRINT. §3.4 차량 목록은 FIGMASCR0208에 전용 스크린샷 폴더가 없으므로 IA·기존 코드를 SSOT로 사용한다.

- **에이전트 식별자**: 에이전트 A (§3.1 랜딩·§3.4 차량 목록·§3.7 일반 판매 담당)
- **라운드**: 3
- **섹션**: §3.4 차량 목록
- **nodeId**: 1418:15565, 1418:17357, 1418:20145 (등록완료 탭·그리드 뷰·리스트 뷰 변형)
- **참조 스크린샷 (FIGMASCR0208)**: 없음. IA 문서(docs/figma/IA_FSD_COMPLETE_VERIFICATION_20260208.md §3.4)와 기존 /vehicles(VehicleListPage) 구현 코드를 디자인 SSOT로 사용한다.
- **대표 라우트**: /vehicles (?filter=completed, ?view=grid|list)

진행 규칙:
1) docs/figma/IMAGE_SCREEN_CYCLE_BLUEPRINT.md와 docs/figma/PLAN_B_SCREENSHOT_BASED.md를 읽고, IA·기존 코드 기반 절차를 확인한다.
2) IA §3.4 "차량 목록" 설명과 기존 VehicleListPage를 바탕으로 15565(등록완료 탭)·17357(그리드)·20145(리스트)에 맞게 구현 또는 수정한다(px, FIGMA_MCP_TO_CODE_CONVERSION·API/ERD 참조).
3) npm run build 실행, 에러 시 수정. npm run dev 후 /vehicles?filter=completed 접속해 러닝 스크린샷 캡처.
4) IA 설명 vs 러닝 스크린샷 비교 → 차이 정리 → 디버깅·리팩토링.
5) docs/figma/SCREEN_IMAGE_CYCLE_LOG.md에 에이전트 A·라운드 3·시간 명시하여 기입. 보고: 담당 사이클, 참조한 문서, 수정 파일, 비교 요약, 남은 이슈.

한 사이클만 수행하고, "IA·코드 확인 → 구현 → 빌드 → dev·캡처 → 비교·디버깅 → 로그·보고" 순서로 진행해줘.
```

---

## 에이전트 B용 (라운드 3, 사이클 13, §3.5 차량 등록·상세·경매)

```
이번 1회 사이클을 진행해줘. 플랜 B + IMAGE_SCREEN_CYCLE_BLUEPRINT. FIGMASCR0208 현재 배치(VERIFICATION_TABLE) 기준 참조 스크린샷만 사용. IA·API/ERD 참조 필수.

- **에이전트 식별자**: 에이전트 B (§3.2 로그인·회원가입·§3.5 차량 등록·상세·경매·§3.8 마이페이지 담당)
- **라운드**: 3
- **섹션**: §3.5 차량 등록·상세·경매
- **nodeId**: 1418:24679, 1418:24463, 1418:21690 (거래 상세 변형·거래 상세 일반판매·거래 상세 경매)
- **참조 스크린샷 (FIGMASCR0208/§3.5_차량등록_상세_경매/)**: §3.5_1418-24679_거래상세_변형.png, §3.5_1418-24679_거래상세_변형-1.png ~ -13.png, §3.5_1418-21690_거래상세_경매.png, §3.5_1418-21690_거래상세_경매-1.png. (24463 거래 상세 일반판매는 스크린샷 없을 수 있음 — IA·24679 계열 참고)
- **대표 라우트**: /vehicles/:id, /vehicles/:id/auction, /vehicles/:id/auction/start-price, /vehicles/:id/auction/duration, /vehicles/:id/auction/complete

진행 규칙:
1) docs/figma/IMAGE_SCREEN_CYCLE_BLUEPRINT.md와 docs/figma/PLAN_B_SCREENSHOT_BASED.md를 읽고, FIGMASCR0208 내 참조 스크린샷 경로를 확인한다.
2) 위 참조 스크린샷을 열어 디자인을 확인한 뒤, 거래 상세·경매 관련 라우트를 스크린샷에 맞게 구현 또는 수정한다(px, FIGMA_MCP_TO_CODE_CONVERSION·IA·API/ERD 참조).
3) npm run build 실행, 에러 시 수정. npm run dev 후 해당 라우트 접속해 러닝 스크린샷 캡처.
4) 참조 스크린샷 vs 러닝 스크린샷 비교 → 차이 정리 → 디버깅·리팩토링.
5) docs/figma/SCREEN_IMAGE_CYCLE_LOG.md에 에이전트 B·라운드 3·시간 명시하여 기입. 보고: 담당 사이클, 참조 스크린샷 경로, 수정 파일, 비교 요약, 남은 이슈.

한 사이클만 수행하고, "참조 스크린샷 확인 → 구현 → 빌드 → dev·캡처 → 비교·디버깅 → 로그·보고" 순서로 진행해줘.
```

---

## 에이전트 C용 (라운드 3, 사이클 17, §3.6 검차)

```
이번 1회 사이클을 진행해줘. 플랜 B + IMAGE_SCREEN_CYCLE_BLUEPRINT. FIGMASCR0208 현재 배치(VERIFICATION_TABLE) 기준 참조 스크린샷만 사용. IA·API/ERD 참조 필수.

- **에이전트 식별자**: 에이전트 C (§3.3 대시보드·§3.6 검차·§3.10 탁송·§3.11 정산 담당)
- **라운드**: 3
- **섹션**: §3.6 검차
- **nodeId**: 1425:9875, 1425:10137, 1425:10663 (검차요청내역 카드뷰·검차진행 매칭중·검차진행 픽업/이동중)
- **참조 스크린샷 (FIGMASCR0208/§3.6_검차/)**: §3.6_1425-9875_검차요청내역_카드뷰.png, §3.6_1425-10137_검차진행_매칭중.png, §3.6_1425-10137_검차진행_매칭중_변형.png. (10663 픽업/이동중은 스크린샷 없을 수 있음 — IA·10137 계열 참고)
- **대표 라우트**: /inspections/:inspectionId/progress, /inspections/:inspectionId/complete

진행 규칙:
1) docs/figma/IMAGE_SCREEN_CYCLE_BLUEPRINT.md와 docs/figma/PLAN_B_SCREENSHOT_BASED.md를 읽고, FIGMASCR0208 내 참조 스크린샷 경로를 확인한다.
2) 위 참조 스크린샷을 열어 디자인을 확인한 뒤, 검차 진행·완료 페이지(/inspections/:id/progress, /inspections/:id/complete)를 스크린샷에 맞게 구현 또는 수정한다(px, FIGMA_MCP_TO_CODE_CONVERSION·IA·API/ERD 참조).
3) npm run build 실행, 에러 시 수정. npm run dev 후 해당 라우트 접속해 러닝 스크린샷 캡처.
4) 참조 스크린샷 vs 러닝 스크린샷 비교 → 차이 정리 → 디버깅·리팩토링.
5) docs/figma/SCREEN_IMAGE_CYCLE_LOG.md에 에이전트 C·라운드 3·시간 명시하여 기입. 보고: 담당 사이클, 참조 스크린샷 경로, 수정 파일, 비교 요약, 남은 이슈.

한 사이클만 수행하고, "참조 스크린샷 확인 → 구현 → 빌드 → dev·캡처 → 비교·디버깅 → 로그·보고" 순서로 진행해줘.
```

---

## 문서 연동

- **블루프린트**: [IMAGE_SCREEN_CYCLE_BLUEPRINT.md](IMAGE_SCREEN_CYCLE_BLUEPRINT.md)
- **라운드 1·2 프롬프트**: [ROUND1_AGENT_PROMPTS.md](ROUND1_AGENT_PROMPTS.md), [ROUND2_AGENT_PROMPTS.md](ROUND2_AGENT_PROMPTS.md)
- **라운드 3 상세·로그**: [SCREEN_IMAGE_CYCLE_LOG.md](SCREEN_IMAGE_CYCLE_LOG.md) — 라운드 3 요약 표·상세 블록 기입
- **스크린샷 경로 SSOT**: [FIGMASCR0208/VERIFICATION_TABLE.md](../FIGMASCR0208/VERIFICATION_TABLE.md)
