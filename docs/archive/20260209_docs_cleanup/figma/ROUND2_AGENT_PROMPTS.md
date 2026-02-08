# 라운드 2 에이전트 개별 프롬프트 (복사·붙여넣기)

**기준**: [IMAGE_SCREEN_CYCLE_BLUEPRINT.md](IMAGE_SCREEN_CYCLE_BLUEPRINT.md), [FIGMASCR0208/VERIFICATION_TABLE.md](../FIGMASCR0208/VERIFICATION_TABLE.md) — FIGMASCR0208 현재 배치 반영.  
**사용법**: 아래 블록을 해당 에이전트 세션에 복사해 붙여넣기. IA·API/ERD 참조 필수. 완료 후 [SCREEN_IMAGE_CYCLE_LOG.md](SCREEN_IMAGE_CYCLE_LOG.md) 기입.

---

## 라운드 2 완료 — 관리 에이전트 확인

| 항목 | 내용 |
|------|------|
| **에이전트 A** (사이클 6, §3.4 차량 목록) | 완료. 코드베이스 검증: VehicleListPage — filter=all\|draft\|completed, view=grid\|list, nodeId 15487·15695·15903 주석 반영. 로그: [SCREEN_IMAGE_CYCLE_LOG.md](SCREEN_IMAGE_CYCLE_LOG.md) § 라운드 2 — 에이전트 A. |
| **에이전트 B** (사이클 12, §3.5) | 완료. 코드베이스 검증: VehicleRegistrationCompletePage(20576), TradeListPage(/offers, 22630), 라우트·주석 일치. 로그: 동일 § 에이전트 B. |
| **에이전트 C** (사이클 16, §3.6 검차) | 완료. 코드베이스 검증: InspectionListPage(9445·9875), InspectionRequestStep1Page(8198), /inspections·/inspections/request·/inspections/request/step1·/inspections/history 라우트 존재. 로그: 동일 § 에이전트 C. |
| **관리 에이전트 검증 일시** | 2026-02-08 (현 코드베이스 기준 검증·빌드 통과) |
| **다음 단계** | **라운드 3**: [ROUND3_AGENT_PROMPTS.md](ROUND3_AGENT_PROMPTS.md) — A=사이클 7(§3.4), B=사이클 13(§3.5), C=사이클 17(§3.6). 이후 [MCP_AGENT_FULL_ROADMAP.md](MCP_AGENT_FULL_ROADMAP.md) §3·[VERIFICATION_TABLE.md](../FIGMASCR0208/VERIFICATION_TABLE.md) 기준. |
| **관리 E2E** | 라운드 2 전용: `npx playwright test tests/e2e/round2-agent-a-vehicle-list-screenshot.spec.ts tests/e2e/round2-agent-b-screenshots.spec.ts tests/e2e/round2-agent-c-inspection-screenshot.spec.ts` |

---

## 라운드 2 — 사이클 할당

| 에이전트 | 사이클 | 섹션 | 대표 라우트 |
|----------|--------|------|-------------|
| **A** | 6 | §3.4 차량 목록 | `/vehicles` |
| **B** | 12 | §3.5 차량 등록·상세·경매 | `/vehicles/:id`, `/vehicles/:id/auction/*`, 거래목록 |
| **C** | 16 | §3.6 검차 | `/inspections`, `/inspections/request` 등 |

---

## 에이전트 A용 (라운드 2, 사이클 6, §3.4 차량 목록)

```
이번 1회 사이클을 진행해줘. 플랜 B + IMAGE_SCREEN_CYCLE_BLUEPRINT. §3.4 차량 목록은 FIGMASCR0208에 전용 스크린샷 폴더가 없으므로 IA·기존 코드를 SSOT로 사용한다.

- **에이전트 식별자**: 에이전트 A (§3.1 랜딩·§3.4 차량 목록·§3.7 일반 판매 담당)
- **라운드**: 2
- **섹션**: §3.4 차량 목록
- **nodeId**: 1418:15487, 1418:15695, 1418:15903 (기본·전체 탭·임시저장 탭 변형)
- **참조 스크린샷 (FIGMASCR0208)**: 없음. IA 문서(docs/figma/IA_FSD_COMPLETE_VERIFICATION_20260208.md §3.4)와 기존 /vehicles(VehicleListPage) 구현 코드를 디자인 SSOT로 사용한다.
- **대표 라우트**: /vehicles (?filter=all|draft|completed, ?view=grid|list)

진행 규칙:
1) docs/figma/IMAGE_SCREEN_CYCLE_BLUEPRINT.md와 docs/figma/PLAN_B_SCREENSHOT_BASED.md를 읽고, IA·기존 코드 기반 절차를 확인한다.
2) IA §3.4 "차량 목록" 설명과 기존 VehicleListPage·VehicleTable·VehicleCard를 바탕으로 15487·15695·15903(전체/임시저장 탭·그리드/리스트)에 맞게 구현 또는 수정한다(px, FIGMA_MCP_TO_CODE_CONVERSION·API/ERD 참조).
3) npm run build 실행, 에러 시 수정. npm run dev 후 /vehicles 접속해 러닝 스크린샷 캡처.
4) IA 설명·기존 Figma 구조(가능 시) vs 러닝 스크린샷 비교 → 차이 정리 → 디버깅·리팩토링.
5) docs/figma/SCREEN_IMAGE_CYCLE_LOG.md에 에이전트 A·라운드 2·시간 명시하여 기입. 보고: 담당 사이클, 참조한 문서, 수정 파일, 비교 요약, 남은 이슈.

한 사이클만 수행하고, "IA·코드 확인 → 구현 → 빌드 → dev·캡처 → 비교·디버깅 → 로그·보고" 순서로 진행해줘.
```

---

## 에이전트 B용 (라운드 2, 사이클 12, §3.5 차량 등록·상세·경매)

```
이번 1회 사이클을 진행해줘. 플랜 B + IMAGE_SCREEN_CYCLE_BLUEPRINT. FIGMASCR0208 현재 배치(VERIFICATION_TABLE) 기준 참조 스크린샷만 사용. IA·API/ERD 참조 필수.

- **에이전트 식별자**: 에이전트 B (§3.2 로그인·회원가입·§3.5 차량 등록·상세·경매·§3.8 마이페이지 담당)
- **라운드**: 2
- **섹션**: §3.5 차량 등록·상세·경매
- **nodeId**: 1418:20576, 1418:21868, 1418:22630 (차량등록완료·거래목록·판매 거래목록 그리드/리스트)
- **참조 스크린샷 (FIGMASCR0208/§3.5_차량등록_상세_경매/)**: §3.5_1418-20576_차량등록완료_확인.png, §3.5_1418-20576_판매전환완료.png, §3.5_1418-20576_판매전환완료-1.png, §3.5_1418-22630_판매_거래목록_그리드뷰-1.png, §3.5_1418-22630_판매_거래목록_그리드뷰-2.png, §3.5_1418-22630_판매_거래목록_목록뷰.png, §3.5_1418-22630_판매_거래목록_목록뷰-1.png, §3.5_1418-22630_판매_거래목록_목록뷰-2.png. (21868 거래목록은 스크린샷 없을 수 있음 — IA·22630 계열 참고)
- **대표 라우트**: /vehicles/:id/complete, /vehicles/:id, /offers 또는 거래 목록 관련 라우트

진행 규칙:
1) docs/figma/IMAGE_SCREEN_CYCLE_BLUEPRINT.md와 docs/figma/PLAN_B_SCREENSHOT_BASED.md를 읽고, FIGMASCR0208 내 참조 스크린샷 경로를 확인한다.
2) 위 참조 스크린샷을 열어 디자인을 확인한 뒤, 해당 라우트를 스크린샷에 맞게 구현 또는 수정한다(px, FIGMA_MCP_TO_CODE_CONVERSION·IA·API/ERD 참조).
3) npm run build 실행, 에러 시 수정. npm run dev 후 해당 라우트 접속해 러닝 스크린샷 캡처.
4) 참조 스크린샷 vs 러닝 스크린샷 비교 → 차이 정리 → 디버깅·리팩토링.
5) docs/figma/SCREEN_IMAGE_CYCLE_LOG.md에 에이전트 B·라운드 2·시간 명시하여 기입. 보고: 담당 사이클, 참조 스크린샷 경로, 수정 파일, 비교 요약, 남은 이슈.

한 사이클만 수행하고, "참조 스크린샷 확인 → 구현 → 빌드 → dev·캡처 → 비교·디버깅 → 로그·보고" 순서로 진행해줘.
```

---

## 에이전트 C용 (라운드 2, 사이클 16, §3.6 검차)

```
이번 1회 사이클을 진행해줘. 플랜 B + IMAGE_SCREEN_CYCLE_BLUEPRINT. FIGMASCR0208 현재 배치(VERIFICATION_TABLE) 기준 참조 스크린샷만 사용. IA·API/ERD 참조 필수.

- **에이전트 식별자**: 에이전트 C (§3.3 대시보드·§3.6 검차·§3.10 탁송·§3.11 정산 담당)
- **라운드**: 2
- **섹션**: §3.6 검차
- **nodeId**: 1444:8198, 1425:9445, 1425:9875 (검차신청 Step1·검차요청내역 리스트·카드뷰)
- **참조 스크린샷 (FIGMASCR0208/§3.6_검차/)**: §3.6_1444-8198_검차신청_Step1_변형.png, §3.6_1425-9445_검차요청내역_리스트.png, §3.6_1425-9445_검차요청내역_리스트_변형.png, §3.6_1425-9875_검차요청내역_카드뷰.png
- **대표 라우트**: /inspections, /inspections/request, /inspections/request/step1, /inspections/history

진행 규칙:
1) docs/figma/IMAGE_SCREEN_CYCLE_BLUEPRINT.md와 docs/figma/PLAN_B_SCREENSHOT_BASED.md를 읽고, FIGMASCR0208 내 참조 스크린샷 경로를 확인한다.
2) 위 참조 스크린샷을 열어 디자인을 확인한 뒤, 해당 라우트(/inspections, /inspections/request, /inspections/request/step1 등)를 스크린샷에 맞게 구현 또는 수정한다(px, FIGMA_MCP_TO_CODE_CONVERSION·IA·API/ERD 참조).
3) npm run build 실행, 에러 시 수정. npm run dev 후 해당 라우트 접속해 러닝 스크린샷 캡처.
4) 참조 스크린샷 vs 러닝 스크린샷 비교 → 차이 정리 → 디버깅·리팩토링.
5) docs/figma/SCREEN_IMAGE_CYCLE_LOG.md에 에이전트 C·라운드 2·시간 명시하여 기입. 보고: 담당 사이클, 참조 스크린샷 경로, 수정 파일, 비교 요약, 남은 이슈.

한 사이클만 수행하고, "참조 스크린샷 확인 → 구현 → 빌드 → dev·캡처 → 비교·디버깅 → 로그·보고" 순서로 진행해줘.
```

---

## 문서 연동

- **블루프린트**: [IMAGE_SCREEN_CYCLE_BLUEPRINT.md](IMAGE_SCREEN_CYCLE_BLUEPRINT.md)
- **라운드 1 프롬프트**: [ROUND1_AGENT_PROMPTS.md](ROUND1_AGENT_PROMPTS.md)
- **라운드 2 상세·로그**: [SCREEN_IMAGE_CYCLE_LOG.md](SCREEN_IMAGE_CYCLE_LOG.md) — 라운드 2 요약 표·상세 블록 기입
- **스크린샷 경로 SSOT**: [FIGMASCR0208/VERIFICATION_TABLE.md](../FIGMASCR0208/VERIFICATION_TABLE.md)
