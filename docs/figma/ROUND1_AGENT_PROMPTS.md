# 라운드 1 에이전트 개별 프롬프트 (복사·붙여넣기)

**기준**: [IMAGE_SCREEN_CYCLE_BLUEPRINT.md](IMAGE_SCREEN_CYCLE_BLUEPRINT.md), [FIGMASCR0208/VERIFICATION_TABLE.md](../FIGMASCR0208/VERIFICATION_TABLE.md) — FIGMASCR0208 현재 배치 반영.  
**사용법**: 아래 블록을 해당 에이전트 세션에 복사해 붙여넣기. IA·API/ERD 참조 필수. 완료 후 [SCREEN_IMAGE_CYCLE_LOG.md](SCREEN_IMAGE_CYCLE_LOG.md) 기입.

---

## 라운드 1 완료 — 관리 에이전트 확인

| 항목 | 내용 |
|------|------|
| **에이전트 A** (사이클 1, §3.1 랜딩) | 완료. 로그 반영: [SCREEN_IMAGE_CYCLE_LOG.md](SCREEN_IMAGE_CYCLE_LOG.md) § 라운드 1 — 에이전트 A |
| **에이전트 B** (사이클 11, §3.5 차량 등록·상세·경매) | 완료. 로그 반영: 동일 § 에이전트 B |
| **에이전트 C** (사이클 5, §3.3 대시보드) | 완료. 로그 반영: 동일 § 에이전트 C |
| **관리 에이전트 확인 일시** | 2026-02-08 (A/B/C 완료 보고 수신 후) |
| **다음 단계** | **라운드 2**: [ROUND2_AGENT_PROMPTS.md](ROUND2_AGENT_PROMPTS.md) — A=사이클 6(§3.4), B=사이클 12(§3.5), C=사이클 16(§3.6). 이후 [MCP_AGENT_FULL_ROADMAP.md](MCP_AGENT_FULL_ROADMAP.md) §3 31사이클 표·[VERIFICATION_TABLE.md](../FIGMASCR0208/VERIFICATION_TABLE.md) 기준. |
| **관리 E2E** | `npm run build` 후 `npm run test:e2e` (dev 자동 기동). 라운드 1 전용: `npx playwright test tests/e2e/round1-management-full.spec.ts` (A+B+C 4케이스). 전체 스크린샷: `tests/e2e/00-run-all-screenshots.spec.ts`. |

---

## 에이전트 A용 (라운드 1, 사이클 1, §3.1 랜딩)

```
이번 1회 사이클을 진행해줘. 플랜 B + IMAGE_SCREEN_CYCLE_BLUEPRINT. FIGMASCR0208 현재 배치(VERIFICATION_TABLE) 기준 참조 스크린샷만 사용. IA·API/ERD 참조 필수.

- **에이전트 식별자**: 에이전트 A (§3.1 랜딩·§3.4 차량 목록·§3.7 일반 판매 담당)
- **라운드**: 1
- **섹션**: §3.1 랜딩
- **nodeId**: 1368:37201, 1368:37364, 1368:43715
- **참조 스크린샷 (FIGMASCR0208/§3.1_랜딩/)**: §3.1_1368-37201_랜딩페이지_Hero중심.png, §3.1_1368-37201_랜딩페이지_Hero중심-1.png, §3.1_1368-37201_랜딩페이지_로그인전_풀뷰.png, §3.1_1368-43715_랜딩페이지_알림노출.png
- **대표 라우트**: /

진행 규칙:
1) docs/figma/IMAGE_SCREEN_CYCLE_BLUEPRINT.md와 docs/figma/PLAN_B_SCREENSHOT_BASED.md를 읽고, FIGMASCR0208 내 참조 스크린샷 경로를 확인한다.
2) 위 참조 스크린샷을 열어 디자인을 확인한 뒤, 해당 라우트(/)를 스크린샷에 맞게 구현 또는 수정한다(px, FIGMA_MCP_TO_CODE_CONVERSION·IA·API/ERD 참조).
3) npm run build 실행, 에러 시 수정. npm run dev 후 해당 라우트 접속해 러닝 스크린샷 캡처.
4) 참조 스크린샷 vs 러닝 스크린샷 비교 → 차이 정리 → 디버깅·리팩토링.
5) docs/figma/SCREEN_IMAGE_CYCLE_LOG.md에 에이전트 A·라운드 1·시간 명시하여 기입. 보고: 담당 사이클, 참조 스크린샷 경로, 수정 파일, 비교 요약, 남은 이슈.

한 사이클만 수행하고, "참조 스크린샷 확인 → 구현 → 빌드 → dev·캡처 → 비교·디버깅 → 로그·보고" 순서로 진행해줘.
```

---

## 에이전트 B용 (라운드 1, 사이클 11, §3.5 차량 등록·상세·경매)

```
이번 1회 사이클을 진행해줘. 플랜 B + IMAGE_SCREEN_CYCLE_BLUEPRINT. FIGMASCR0208 현재 배치(VERIFICATION_TABLE) 기준 참조 스크린샷만 사용. IA·API/ERD 참조 필수.

- **에이전트 식별자**: 에이전트 B (§3.2 로그인·회원가입·§3.5 차량 등록·상세·경매·§3.8 마이페이지 담당)
- **라운드**: 1
- **섹션**: §3.5 차량 등록·상세·경매
- **nodeId**: 1418:20498, 1418:23705, 1418:23880
- **참조 스크린샷 (FIGMASCR0208/§3.5_차량등록_상세_경매/)**: §3.5_1418-20498_판매방식선택.png, §3.5_1418-20498_판매방식선택-1.png, §3.5_1418-20498_차량등록진입_시세분석중.png, §3.5_1418-20498_차량등록진입_시세분석중-1.png, §3.5_1418-23705_경매_시작가설정.png, §3.5_1418-23880_경매시작가_값입력.png
- **대표 라우트**: /vehicles/new, /vehicles/:id, /vehicles/:id/auction/*

진행 규칙:
1) docs/figma/IMAGE_SCREEN_CYCLE_BLUEPRINT.md와 docs/figma/PLAN_B_SCREENSHOT_BASED.md를 읽고, FIGMASCR0208 내 참조 스크린샷 경로를 확인한다.
2) 위 참조 스크린샷을 열어 디자인을 확인한 뒤, 해당 라우트(/vehicles/new, /vehicles/:id, /vehicles/:id/auction/*)를 스크린샷에 맞게 구현 또는 수정한다(px, FIGMA_MCP_TO_CODE_CONVERSION·IA·API/ERD 참조).
3) npm run build 실행, 에러 시 수정. npm run dev 후 해당 라우트 접속해 러닝 스크린샷 캡처.
4) 참조 스크린샷 vs 러닝 스크린샷 비교 → 차이 정리 → 디버깅·리팩토링.
5) docs/figma/SCREEN_IMAGE_CYCLE_LOG.md에 에이전트 B·라운드 1·시간 명시하여 기입. 보고: 담당 사이클, 참조 스크린샷 경로, 수정 파일, 비교 요약, 남은 이슈.

한 사이클만 수행하고, "참조 스크린샷 확인 → 구현 → 빌드 → dev·캡처 → 비교·디버깅 → 로그·보고" 순서로 진행해줘.
```

---

## 에이전트 C용 (라운드 1, 사이클 5, §3.3 대시보드)

```
이번 1회 사이클을 진행해줘. 플랜 B + IMAGE_SCREEN_CYCLE_BLUEPRINT. §3.3 대시보드는 스크린샷이 없으므로 IA·기존 코드를 SSOT로 사용한다.

- **에이전트 식별자**: 에이전트 C (§3.3 대시보드·§3.6 검차·§3.10 탁송·§3.11 정산 담당)
- **라운드**: 1
- **섹션**: §3.3 대시보드
- **nodeId**: 1418:25059
- **참조 스크린샷 (FIGMASCR0208)**: 없음. IA 문서(docs/figma/IA_FSD_COMPLETE_VERIFICATION_20260208.md §3.3)와 기존 /dashboard 구현 코드를 디자인 SSOT로 사용한다.
- **대표 라우트**: /dashboard

진행 규칙:
1) docs/figma/IMAGE_SCREEN_CYCLE_BLUEPRINT.md와 docs/figma/PLAN_B_SCREENSHOT_BASED.md를 읽고, IA·기존 코드 기반 절차를 확인한다.
2) IA §3.3 "대시보드" 설명과 기존 대시보드 페이지 코드를 바탕으로 1418:25059에 맞게 구현 또는 수정한다(px, FIGMA_MCP_TO_CODE_CONVERSION·API/ERD 참조).
3) npm run build 실행, 에러 시 수정. npm run dev 후 /dashboard 접속해 러닝 스크린샷 캡처.
4) IA 설명·기존 Figma 구조(가능 시) vs 러닝 스크린샷 비교 → 차이 정리 → 디버깅·리팩토링.
5) docs/figma/SCREEN_IMAGE_CYCLE_LOG.md에 에이전트 C·라운드 1·시간 명시하여 기입. 보고: 담당 사이클, 참조한 문서, 수정 파일, 비교 요약, 남은 이슈.

한 사이클만 수행하고, "IA·코드 확인 → 구현 → 빌드 → dev·캡처 → 비교·디버깅 → 로그·보고" 순서로 진행해줘.
```

---

## 문서 연동

- **블루프린트**: [IMAGE_SCREEN_CYCLE_BLUEPRINT.md](IMAGE_SCREEN_CYCLE_BLUEPRINT.md)
- **문서 스위트·정합성**: [HANDOFF_AGENT_FIGMA_IA_INTEGRITY.md](../agenthandoff/HANDOFF_AGENT_FIGMA_IA_INTEGRITY.md) §6·§7 (라운드 시작 전 점검 시 참고)
- **라운드 1 상세·로그**: [SCREEN_IMAGE_CYCLE_LOG.md](SCREEN_IMAGE_CYCLE_LOG.md)
- **기존 라운드 1 문서**: [PLAN_B_ROUND1_RESTART.md](PLAN_B_ROUND1_RESTART.md) — 참조 스크린샷 경로는 픽스 전 기준; 현재 경로는 본 문서(ROUND1_AGENT_PROMPTS.md) 우선.
