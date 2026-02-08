# 이미지 스크린 기반 사이클 블루프린트

**목적**: 이미지 스크린(FIGMASCR0208)을 SSOT로 하는 전체 사이클 정의·에이전트 A/B/C 할당·IA/FSD/API/ERD 비교대조 연동 규칙.  
**버전**: 1.0  
**최종 업데이트**: 2026-02-08

---

## 1. 목적·전제

- **1사이클 정의**: 해당 사이클의 nodeId 1~3개에 대응하는 **FIGMASCR0208 스크린샷**을 SSOT로 구현·검증. MCP 호출은 선택(가능 시 get_screenshot만 보조).
- **사이클 수**: [MCP_AGENT_FULL_ROADMAP.md](MCP_AGENT_FULL_ROADMAP.md) §3의 **31 사이클** 유지. 각 사이클 = (사이클 번호, 섹션, nodeId 1~3개, 대표 라우트).
- **참조 스크린샷 경로**: 프로젝트 루트 기준 `FIGMASCR0208/§3.x_폴더/§3.x_노드_이름.png`. 경로는 [FIGMASCR0208/VERIFICATION_TABLE.md](../FIGMASCR0208/VERIFICATION_TABLE.md)(또는 [FIGMASCR0208_IA_NAMING_MAP.md](../FIGMASCR0208/FIGMASCR0208_IA_NAMING_MAP.md))에서 current_file → new_folder/new_filename 매핑으로 산출. 스크린샷 없음(예: §3.3 대시보드)은 IA·기존 코드 SSOT.

---

## 2. 에이전트 A/B/C 할당 (플랜 B와 동일)

| 에이전트 | 담당 섹션 | 담당 사이클 번호 |
|----------|-----------|------------------|
| **A** | §3.1 랜딩, §3.4 차량 목록, §3.7 일반 판매 | 1; 6, 7, 8, 9, 10; 19, 20, 21 |
| **B** | §3.2 로그인·회원가입, §3.5 차량 등록·상세·경매, §3.8 마이페이지/오퍼 | 2, 3, 4; 11, 12, 13, 14, 15; 22, 23, 24, 25 |
| **C** | §3.3 대시보드, §3.6 검차, §3.10 탁송, §3.11 정산 | 5; 16, 17, 18; 26, 27, 28, 29; 30, 31 |

---

## 3. 전체 사이클–에이전트 매핑표

| 사이클 | 섹션 | nodeId (최대 3개) | 대표 라우트 | 담당 에이전트 |
|--------|------|-------------------|-------------|---------------|
| 1 | §3.1 랜딩 | 1368:37201, 37364, 43715 | `/` | A |
| 2 | §3.2 로그인·회원가입 | 1425:7280, 7613, 1513:12032 | `/login`, `/signup`, `/signup/step1` | B |
| 3 | §3.2 로그인·회원가입 | 1425:7309, 1513:11607, 1425:7445 | `/signup/step2`~`step4` | B |
| 4 | §3.2 로그인·회원가입 | 1425:7514, 7496, 7505 | `/signup/step5`, `/signup/pending`, `/signup/complete` | B |
| 5 | §3.3 대시보드 | 1418:25059 | `/dashboard` | C |
| 6 | §3.4 차량 목록 | 15487, 15695, 15903 | `/vehicles` | A |
| 7 | §3.4 차량 목록 | 15565, 17357, 20145 | `/vehicles` | A |
| 8 | §3.4 차량 목록 | 16327, 16111, 16860 | `/vehicles` | A |
| 9 | §3.4 차량 목록 | 16684, 17629, 17036 | `/vehicles` | A |
| 10 | §3.4 차량 목록 | 17196 | `/vehicles` | A |
| 11 | §3.5 차량 등록·상세·경매 | 20498, 23705, 23880 | `/vehicles/new`, `/vehicles/:id/auction/*` | B |
| 12 | §3.5 차량 등록·상세·경매 | 20576, 21868, 22630 | `/vehicles/:id`, `/vehicles/:id/auction/*` | B |
| 13 | §3.5 차량 등록·상세·경매 | 24679, 24463, 21690 | `/vehicles/:id/auction/*` | B |
| 14 | §3.5 차량 등록·상세·경매 | 21512, 24856, 22153 | `/vehicles/:id`, `/vehicles/:id/auction/*` | B |
| 15 | §3.5 차량 등록·상세·경매 | 22315, 22951 | `/vehicles/:id/auction/*` | B |
| 16 | §3.6 검차 | 1444:8198, 1425:9445, 9661 | `/inspections`, `/inspections/request` 등 | C |
| 17 | §3.6 검차 | 9875, 10137, 10663 | `/inspections/:id/*` | C |
| 18 | §3.6 검차 | 10813, 10285, 10443 | `/inspections/:id/*` | C |
| 19 | §3.7 일반 판매 | 8153, 8420, 12046 | `/vehicles`, `/vehicles/:id/sale/*` | A |
| 20 | §3.7 일반 판매 | 8636, 8842, 7638 | `/vehicles/:id/sale/*` | A |
| 21 | §3.7 일반 판매 | 8107, 7684, 7918 | `/vehicles/:id/sale/*` | A |
| 22 | §3.8 마이페이지/오퍼 | 36766, 37804, 37971 | `/mypage/*`, `/offers` | B |
| 23 | §3.8 마이페이지/오퍼 | 37042, 37170, 37677 | `/mypage/*`, `/offers` | B |
| 24 | §3.8 마이페이지/오퍼 | 38264, 38114, 36901 | `/mypage/*`, `/offers` | B |
| 25 | §3.8 마이페이지/오퍼 | 37298, 37559, 37402 | `/mypage/*`, `/offers` | B |
| 26 | §3.10 탁송 | 29145, 28880, 25060 | `/logistics/schedule`, `/logistics/request`, `/logistics/:id` | C |
| 27 | §3.10 탁송 | 25219, 27070, 26827 | `/logistics/*` | C |
| 28 | §3.10 탁송 | 25400, 25619, 26067 | `/logistics/*` | C |
| 29 | §3.10 탁송 | 26325, 26583 | `/logistics/*` | C |
| 30 | §3.11 정산 | 36405, 27657 | `/settlements`, `/settlements/:id`, `/sales/history` | C |
| 31 | §3.11 정산 | 27434, 27952 | `/settlements/:id`, `/sales/history` | C |

---

## 4. IA·FSD·API·ERD 비교대조

- **라운드 시작 전 1회**: [HANDOFF_AGENT_FIGMA_IA_INTEGRITY.md](../agenthandoff/HANDOFF_AGENT_FIGMA_IA_INTEGRITY.md) §6 절차 수행 — 문서 스위트 존재, IA↔Global Plan↔11섹션맵 샘플 일치, API/ERD의 Figma IA·라우트 참조 일치. 결과는 [SCREEN_IMAGE_CYCLE_LOG.md](SCREEN_IMAGE_CYCLE_LOG.md) 상단 또는 "문서 스위트 점검" 섹션에 기록.
- **사이클 내**: 각 에이전트가 구현 시 [CarivDealer_api_v1.md](../CarivDealer_api_v1.md), [CarivDealer_API_ERD_Mapping.md](../CarivDealer_API_ERD_Mapping.md), [IA_FSD_COMPLETE_VERIFICATION_20260208.md](IA_FSD_COMPLETE_VERIFICATION_20260208.md) 참조 필수. 갭 발견 시 SCREEN_IMAGE_CYCLE_LOG 해당 사이클 블록에 "IA/API/ERD 갭" 항목으로 기록.

---

## 5. 1사이클 절차 (플랜 B 정합)

1. **참조 스크린샷 확인**: FIGMASCR0208 내 해당 사이클 nodeId 대응 파일 열기 (VERIFICATION_TABLE 참조). 없으면 IA·기존 코드만 SSOT.
2. **구현/수정**: 해당 라우트·페이지를 스크린샷에 맞게 구현 또는 수정 (px, [FIGMA_MCP_TO_CODE_CONVERSION.md](FIGMA_MCP_TO_CODE_CONVERSION.md), IA·API/ERD 참조).
3. **빌드**: `npm run build` 실행, 에러 시 수정.
4. **실행·캡처**: `npm run dev` 후 해당 라우트 접속, 러닝 스크린샷 캡처.
5. **비교·디버깅**: 참조 스크린샷 vs 러닝 스크린샷 비교 → 차이 정리 → 디버깅·리팩토링.
6. **로그·보고**: [SCREEN_IMAGE_CYCLE_LOG.md](SCREEN_IMAGE_CYCLE_LOG.md) 기입. 보고: 담당 사이클, 참조 스크린샷 경로, 수정 파일, 비교 요약, 남은 이슈.

---

## 6. 참조 문서

| 용도 | 문서 |
|------|------|
| 31 사이클·로드맵 | [MCP_AGENT_FULL_ROADMAP.md](MCP_AGENT_FULL_ROADMAP.md) |
| 플랜 B 절차 | [PLAN_B_SCREENSHOT_BASED.md](PLAN_B_SCREENSHOT_BASED.md) |
| 스크린샷 경로 SSOT | [FIGMASCR0208/VERIFICATION_TABLE.md](../FIGMASCR0208/VERIFICATION_TABLE.md), [FIGMASCR0208_IA_NAMING_MAP.md](../FIGMASCR0208/FIGMASCR0208_IA_NAMING_MAP.md) |
| IA·nodeId·라우트 | [IA_FSD_COMPLETE_VERIFICATION_20260208.md](IA_FSD_COMPLETE_VERIFICATION_20260208.md), [FIGMA_IA_FSD_STRUCTURE.md](FIGMA_IA_FSD_STRUCTURE.md) |
| API/ERD SSOT | [CarivDealer_api_v1.md](../CarivDealer_api_v1.md), [CarivDealer_API_ERD_Mapping.md](../CarivDealer_API_ERD_Mapping.md) |
| 문서 스위트·정합성 | [HANDOFF_AGENT_FIGMA_IA_INTEGRITY.md](../agenthandoff/HANDOFF_AGENT_FIGMA_IA_INTEGRITY.md) §6·§7 |
| 사이클 로그 | [SCREEN_IMAGE_CYCLE_LOG.md](SCREEN_IMAGE_CYCLE_LOG.md) |
| 라운드 1 프롬프트 | [ROUND1_AGENT_PROMPTS.md](ROUND1_AGENT_PROMPTS.md) |
| 라운드 2 프롬프트 | [ROUND2_AGENT_PROMPTS.md](ROUND2_AGENT_PROMPTS.md) |
| 라운드 3 프롬프트 | [ROUND3_AGENT_PROMPTS.md](ROUND3_AGENT_PROMPTS.md) |
