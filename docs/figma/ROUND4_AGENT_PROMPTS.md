# 라운드 4 에이전트 개별 프롬프트 (복사·붙여넣기)

**기준**: [IMAGE_SCREEN_CYCLE_BLUEPRINT.md](IMAGE_SCREEN_CYCLE_BLUEPRINT.md), [FIGMASCR0208/VERIFICATION_TABLE.md](../FIGMASCR0208/VERIFICATION_TABLE.md) — FIGMASCR0208 현재 배치 반영.  
**사용법**: 아래 블록을 해당 에이전트 세션에 복사해 붙여넣기. IA·API/ERD 참조 필수. 완료 후 [SCREEN_IMAGE_CYCLE_LOG.md](SCREEN_IMAGE_CYCLE_LOG.md) 기입.

---

## 라운드 4 — 사이클 할당

| 에이전트 | 사이클 | 섹션 | 대표 라우트 |
|----------|--------|------|-------------|
| **A** | 8 | §3.4 차량 목록 | `/vehicles` (16327·16111·16860 변형) |
| **B** | 14 | §3.5 차량 등록·상세·경매 | `/vehicles/:id`, `/vehicles/:id/auction/*` (거래 상세·모달) |
| **C** | 18 | §3.6 검차 | `/inspections/:id/complete` (검차진행 완료·검차결과요약·상세) |

---

## 에이전트 A용 (라운드 4, 사이클 8, §3.4 차량 목록)

```
이번 1회 사이클을 진행해줘. 플랜 B + IMAGE_SCREEN_CYCLE_BLUEPRINT. §3.4 차량 목록은 FIGMASCR0208에 전용 스크린샷 폴더가 없으므로 IA·기존 코드를 SSOT로 사용한다.

- **에이전트 식별자**: 에이전트 A (§3.1 랜딩·§3.4 차량 목록·§3.7 일반 판매 담당)
- **라운드**: 4
- **섹션**: §3.4 차량 목록
- **nodeId**: 1418:16327, 1418:16111, 1418:16860 (차량 목록 변형 — IA §3.4 참고)
- **참조 스크린샷 (FIGMASCR0208)**: 없음. IA 문서(docs/figma/IA_FSD_COMPLETE_VERIFICATION_20260208.md §3.4)와 기존 /vehicles(VehicleListPage) 구현 코드를 디자인 SSOT로 사용한다.
- **대표 라우트**: /vehicles

진행 규칙:
1) docs/figma/IMAGE_SCREEN_CYCLE_BLUEPRINT.md와 docs/figma/PLAN_B_SCREENSHOT_BASED.md를 읽고, IA·기존 코드 기반 절차를 확인한다.
2) IA §3.4 "차량 목록" 설명과 기존 VehicleListPage를 바탕으로 16327·16111·16860 변형에 맞게 구현 또는 수정한다(px, FIGMA_MCP_TO_CODE_CONVERSION·API/ERD 참조).
3) npm run build 실행, 에러 시 수정. npm run dev 후 /vehicles 접속해 러닝 스크린샷 캡처.
4) IA 설명 vs 러닝 스크린샷 비교 → 차이 정리 → 디버깅·리팩토링.
5) docs/figma/SCREEN_IMAGE_CYCLE_LOG.md에 에이전트 A·라운드 4·시간 명시하여 기입. 보고: 담당 사이클, 참조한 문서, 수정 파일, 비교 요약, 남은 이슈.

한 사이클만 수행하고, "IA·코드 확인 → 구현 → 빌드 → dev·캡처 → 비교·디버깅 → 로그·보고" 순서로 진행해줘.
```

---

## 에이전트 B용 (라운드 4, 사이클 14, §3.5 차량 등록·상세·경매)

```
이번 1회 사이클을 진행해줘. 플랜 B + IMAGE_SCREEN_CYCLE_BLUEPRINT. IA·기존 코드 및 참조 스크린샷(있을 경우) 기준. FIGMASCR0208에 21512·24856·22153 스크린샷이 없을 수 있음.

- **에이전트 식별자**: 에이전트 B (§3.2 로그인·회원가입·§3.5 차량 등록·상세·경매·§3.8 마이페이지 담당)
- **라운드**: 4
- **섹션**: §3.5 차량 등록·상세·경매
- **nodeId**: 1418:21512, 1418:24856, 1418:22153 (거래 상세+삭제 모달·변경불가 모달·판매방식 변경 확인 모달)
- **참조 스크린샷 (FIGMASCR0208)**: 없을 수 있음. IA_NODEID: 21512=거래상세_삭제모달, 24856=거래상세_변경불가모달, 22153=판매방식변경확인_모달. IA 문서·기존 VehicleDetailPage·거래 상세 모달 코드를 SSOT로 사용.
- **대표 라우트**: /vehicles/:id (거래 상세)·모달(삭제/변경불가/판매방식 변경 확인)

진행 규칙:
1) docs/figma/IMAGE_SCREEN_CYCLE_BLUEPRINT.md와 IA(docs/figma)를 읽고, 거래 상세·모달 UX를 확인한다.
2) VehicleDetailPage 또는 거래 상세 관련 컴포넌트에 삭제 모달·변경불가 모달·판매방식 변경 확인 모달을 IA에 맞게 구현 또는 수정한다(px, API/ERD 참조).
3) npm run build 실행, 에러 시 수정. npm run dev 후 해당 라우트 접속해 러닝 스크린샷 캡처.
4) IA vs 러닝 스크린샷 비교 → 차이 정리 → 디버깅·리팩토링.
5) docs/figma/SCREEN_IMAGE_CYCLE_LOG.md에 에이전트 B·라운드 4·시간 명시하여 기입. 보고: 담당 사이클, 참조한 문서, 수정 파일, 비교 요약, 남은 이슈.

한 사이클만 수행하고, "IA·코드 확인 → 구현 → 빌드 → dev·캡처 → 비교·디버깅 → 로그·보고" 순서로 진행해줘.
```

---

## 에이전트 C용 (라운드 4, 사이클 18, §3.6 검차)

```
이번 1회 사이클을 진행해줘. 플랜 B + IMAGE_SCREEN_CYCLE_BLUEPRINT. FIGMASCR0208 현재 배치(VERIFICATION_TABLE) 기준 참조 스크린샷만 사용. IA·API/ERD 참조 필수.

- **에이전트 식별자**: 에이전트 C (§3.3 대시보드·§3.6 검차·§3.10 탁송·§3.11 정산 담당)
- **라운드**: 4
- **섹션**: §3.6 검차
- **nodeId**: 1425:10813, 1425:10285, 1425:10443 (검차진행 완료·검차결과요약·검차결과상세)
- **참조 스크린샷 (FIGMASCR0208/§3.6_검차/)**: §3.6_1425-10813_검차진행_완료.png, §3.6_1425-10285_검차결과요약.png, §3.6_1425-10285_검차결과요약_변형.png. (10443 검차결과상세는 스크린샷 없을 수 있음 — IA·10285 계열 참고)
- **대표 라우트**: /inspections/:inspectionId/complete (검차 완료·결과 요약·상세)

진행 규칙:
1) docs/figma/IMAGE_SCREEN_CYCLE_BLUEPRINT.md와 docs/figma/PLAN_B_SCREENSHOT_BASED.md를 읽고, FIGMASCR0208 내 참조 스크린샷 경로를 확인한다.
2) 위 참조 스크린샷을 열어 디자인을 확인한 뒤, 검차 완료·결과 요약 페이지(InspectionCompletePage 등)를 스크린샷에 맞게 구현 또는 수정한다(px, FIGMA_MCP_TO_CODE_CONVERSION·IA·API/ERD 참조).
3) npm run build 실행, 에러 시 수정. npm run dev 후 해당 라우트 접속해 러닝 스크린샷 캡처.
4) 참조 스크린샷 vs 러닝 스크린샷 비교 → 차이 정리 → 디버깅·리팩토링.
5) docs/figma/SCREEN_IMAGE_CYCLE_LOG.md에 에이전트 C·라운드 4·시간 명시하여 기입. 보고: 담당 사이클, 참조 스크린샷 경로, 수정 파일, 비교 요약, 남은 이슈.

한 사이클만 수행하고, "참조 스크린샷 확인 → 구현 → 빌드 → dev·캡처 → 비교·디버깅 → 로그·보고" 순서로 진행해줘.
```

---

## 문서 연동

- **블루프린트**: [IMAGE_SCREEN_CYCLE_BLUEPRINT.md](IMAGE_SCREEN_CYCLE_BLUEPRINT.md)
- **라운드 1·2·3 프롬프트**: [ROUND1_AGENT_PROMPTS.md](ROUND1_AGENT_PROMPTS.md), [ROUND2_AGENT_PROMPTS.md](ROUND2_AGENT_PROMPTS.md), [ROUND3_AGENT_PROMPTS.md](ROUND3_AGENT_PROMPTS.md)
- **라운드 4 상세·로그**: [SCREEN_IMAGE_CYCLE_LOG.md](SCREEN_IMAGE_CYCLE_LOG.md) — 라운드 4 요약 표·상세 블록 기입
- **스크린샷 경로 SSOT**: [FIGMASCR0208/VERIFICATION_TABLE.md](../FIGMASCR0208/VERIFICATION_TABLE.md)
