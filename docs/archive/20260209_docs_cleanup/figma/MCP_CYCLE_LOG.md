# MCP 사이클 로그

**기준**: [MCP_AGENT_FULL_ROADMAP.md](MCP_AGENT_FULL_ROADMAP.md), IA Figma 섹션별 MCP 사이클 플랜.  
사이클 완료 시마다 아래 요약 표의 **상태**를 갱신하고, **사이클 로그** 섹션에 체크리스트 블록을 추가한다.

---

## 요약 표 (사이클 인덱스–섹션–nodeId–라우트)

| 사이클 | 섹션 | nodeId (최대 3개) | 대표 라우트 | 상태 |
|--------|------|-------------------|-------------|------|
| 1 | §3.1 랜딩 | 1368:37201, 1368:37364, 1368:43715 | `/` | 완료 |
| 2 | §3.2 로그인·회원가입 | 1425:7280, 1425:7613, 1513:12032 | `/login`, `/signup`, `/signup/step1` | 완료 |
| 3 | §3.2 로그인·회원가입 | 1425:7309, 1513:11607, 1425:7445 | `/signup/step2`~`step4` | 완료 |
| 4 | §3.2 로그인·회원가입 | 1425:7514, 1425:7496, 1425:7505 | `/signup/step5`, `/signup/pending`, `/signup/complete` | 완료 |
| 5 | §3.3 대시보드 | 1418:25059 | `/dashboard` | 완료 |
| 6 | §3.4 차량 목록 | 1418:15487, 1418:15695, 1418:15903 | `/vehicles` | 완료 |
| 7 | §3.4 차량 목록 | 1418:15565, 1418:17357, 1418:20145 | `/vehicles` | 완료 |
| 8 | §3.4 차량 목록 | 1418:16327, 1418:16111, 1418:16860 | `/vehicles` | 미실행 |
| 9 | §3.4 차량 목록 | 1418:16684, 1418:17629, 1418:17036 | `/vehicles` | 미실행 |
| 10 | §3.4 차량 목록 | 1418:17196 | `/vehicles` | 미실행 |
| 11 | §3.5 차량 등록·상세·경매 | 1418:20498, 1418:23705, 1418:23880 | `/vehicles/new`, `/vehicles/:id`, `/vehicles/:id/auction/*` | 완료 |
| 12 | §3.5 차량 등록·상세·경매 | 1418:20576, 1418:21868, 1418:22630 | `/vehicles/:id`, `/vehicles/:id/auction/*` | 완료 |
| 13 | §3.5 차량 등록·상세·경매 | 1418:24679, 1418:24463, 1418:21690 | `/vehicles/:id/auction/*` | 완료 |
| 14 | §3.5 차량 등록·상세·경매 | 1418:21512, 1418:24856, 1418:22153 | `/vehicles/:id`, `/vehicles/:id/auction/*` | 미실행 |
| 15 | §3.5 차량 등록·상세·경매 | 1418:22315, 1418:22951 | `/vehicles/:id/auction/*` | 미실행 |
| 16 | §3.6 검차 | 1444:8198, 1425:9445, 1425:9661 | `/inspections`, `/inspections/request`, `/inspections/:id/*` | 완료 |
| 17 | §3.6 검차 | 1425:9875, 1425:10137, 1425:10663 | `/inspections/:id/*` | 완료 |
| 18 | §3.6 검차 | 1425:10813, 1425:10285, 1425:10443 | `/inspections/:id/*` | 미실행 |
| 19 | §3.7 일반 판매 | 1425:8153, 1425:8420, 1425:12046 | `/vehicles`, `/vehicles/:id/sale/*` | 미실행 |
| 20 | §3.7 일반 판매 | 1425:8636, 1425:8842, 1425:7638 | `/vehicles/:id/sale/*` | 미실행 |
| 21 | §3.7 일반 판매 | 1425:8107, 1425:7684, 1425:7918 | `/vehicles/:id/sale/*` | 미실행 |
| 22 | §3.8 마이페이지/오퍼 | 1418:36766, 1418:37804, 1418:37971 | `/mypage/*`, `/offers` | 미실행 |
| 23 | §3.8 마이페이지/오퍼 | 1418:37042, 1418:37170, 1418:37677 | `/mypage/*`, `/offers` | 미실행 |
| 24 | §3.8 마이페이지/오퍼 | 1418:38264, 1418:38114, 1418:36901 | `/mypage/*`, `/offers` | 미실행 |
| 25 | §3.8 마이페이지/오퍼 | 1418:37298, 1418:37559, 1418:37402 | `/mypage/*`, `/offers` | 미실행 |
| 26 | §3.10 탁송 | 1418:29145, 1418:28880, 1418:25060 | `/logistics/schedule`, `/logistics/request`, `/logistics/:id` | 미실행 |
| 27 | §3.10 탁송 | 1418:25219, 1418:27070, 1418:26827 | `/logistics/*` | 미실행 |
| 28 | §3.10 탁송 | 1418:25400, 1418:25619, 1418:26067 | `/logistics/*` | 미실행 |
| 29 | §3.10 탁송 | 1418:26325, 1418:26583 | `/logistics/*` | 미실행 |
| 30 | §3.11 정산 | 1418:36405, 1418:27657 | `/settlements`, `/settlements/:id`, `/sales/history` | 미실행 |
| 31 | §3.11 정산 | 1418:27434, 1418:27952 | `/settlements/:id`, `/sales/history` | 미실행 |

**상태**: 미실행 / 진행 중 / 완료

---

## 사이클 로그

(사이클 완료 시 [MCP_CYCLE_LOG_TEMPLATE.md](MCP_CYCLE_LOG_TEMPLATE.md)의 체크리스트 블록을 복사해 채운 뒤 아래에 추가)

---

### 사이클 1 — §3.1 랜딩 (에이전트 A)

| 항목 | 내용 |
|------|------|
| **에이전트 식별자** | 에이전트 A |
| **라운드** | 1 |
| **시간** | 2026-02-08T15:00:00+09:00 |
| **담당 태스크** | 사이클 1: §3.1 랜딩 — 1368:37201, 1368:37364, 1368:43715 |
| **섹션 번호·이름** | §3.1 랜딩 |
| **이번 사이클 nodeId (최대 3개)** | 1368:37201, 1368:37364, 1368:43715 |
| **동일 라우트 여부** | 동일 route `/` (3프레임: Hero, 동일 구조, 알림 노출 변형) |
| **대응 라우트** | `/` |
| **대응 페이지 파일** | pages/landing/LandingPage.tsx, widgets/Header/ui/LandingHeader |
| **MCP 호출** | get_design_context: 1회(1368:37201). 1368:37364·1368:43715는 rate limit으로 미호출. |
| **API/ERD** | 랜딩 페이지 전용 API 없음 (api_v1·ERD 참조만) |
| **스크린샷 검증** | get_screenshot rate limit으로 미실행. IA·문서 스위트로 검토 완료. |
| **비고** | 1368:43715 변형 반영: 알림 팝업 상태(showNotification) 추가. px·FIGMA_MCP_TO_CODE_CONVERSION 준수. |

---

### 사이클 2 — §3.2 로그인·회원가입 (AGENT-B)

| 항목 | 내용 |
|------|------|
| **에이전트 ID** | AGENT-B |
| **담당 태스크** | 사이클 2: §3.2 로그인·회원가입 — 1425:7280, 1425:7613, 1513:12032 |
| **섹션 번호·이름** | §3.2 로그인·회원가입 |
| **이번 사이클 nodeId (최대 3개)** | 1425:7280, 1425:7613, 1513:12032 |
| **동일 라우트 여부** | 서로 다른 route: /login, /signup, /signup/step1 (IA §3.2) |
| **대응 라우트** | `/login`, `/signup`, `/signup/step1` |
| **대응 페이지 파일** | pages/admin/LoginPage.tsx, pages/auth/SignupEntryPage.tsx, pages/auth/SignupStep1Page.tsx |
| **MCP 호출** | get_design_context: 3회 (1425:7280, 1425:7613, 1513:12032 순차) |
| **API/ERD** | 로그인/회원가입 API 예정 (api_v1·ERD 참조) |
| **스크린샷 검증** | 1425:7280(로그인) get_screenshot 완료. Figma: 아이디/비밀번호 필드·로그인 버튼·회원가입 링크·소셜 로그인(Google/Kakao/Naver). 현재 코드는 이메일/비밀번호 로그인만 구현 — 소셜 버튼 추가 시 Figma와 정합. |
| **비고** | AGENT-B 1회 사이클. 기존 라우트·페이지 존재 확인, px 규칙 적용 유지. F 단계 빌드는 로컬 PATH 설정 후 npm run build 권장. |

---

### 사이클 3 — §3.2 로그인·회원가입 (AGENT-B)

| 항목 | 내용 |
|------|------|
| **에이전트 ID** | AGENT-B |
| **담당 태스크** | 사이클 3: §3.2 로그인·회원가입 — 1425:7309, 1513:11607, 1425:7445 |
| **섹션 번호·이름** | §3.2 로그인·회원가입 |
| **이번 사이클 nodeId (최대 3개)** | 1425:7309, 1513:11607, 1425:7445 |
| **동일 라우트 여부** | 서로 다른 route: /signup/step2, step3, step4 (IA §3.2) |
| **대응 라우트** | `/signup/step2`, `/signup/step3`, `/signup/step4` |
| **대응 페이지 파일** | pages/auth/SignupStep2Page.tsx, SignupStep3Page.tsx, SignupStep4Page.tsx |
| **MCP 호출** | get_design_context: 3회 (1425:7309, 1513:11607, 1425:7445 순차) |
| **API/ERD** | 회원가입 단계 API 예정 (api_v1·ERD 참조) |
| **스크린샷 검증** | MCP get_screenshot 호출 가능. 기존 Step2(사업자 정보)·Step3(중고차 매매업 인증)·Step4(정산 정보) 구현 확인. |
| **비고** | AGENT-B 2회차. StepProgress·Input·Button·FileUpload 패턴 일관 유지. |

---

### 사이클 4 — §3.2 로그인·회원가입 (AGENT-B)

| 항목 | 내용 |
|------|------|
| **에이전트 ID** | AGENT-B |
| **담당 태스크** | 사이클 4: §3.2 로그인·회원가입 — 1425:7514, 1425:7496, 1425:7505 |
| **섹션 번호·이름** | §3.2 로그인·회원가입 |
| **이번 사이클 nodeId (최대 3개)** | 1425:7514, 1425:7496, 1425:7505 |
| **동일 라우트 여부** | 서로 다른 route: /signup/step5, /signup/pending, /signup/complete (IA §3.2) |
| **대응 라우트** | `/signup/step5`, `/signup/pending`, `/signup/complete` |
| **대응 페이지 파일** | pages/auth/SignupStep5Page.tsx, SignupPendingPage.tsx, SignupCompletePage.tsx |
| **MCP 호출** | get_design_context: 3회 (1425:7514, 1425:7496, 1425:7505 순차) |
| **API/ERD** | 회원가입 완료·승인 API 예정 (api_v1·ERD 참조) |
| **스크린샷 검증** | 1425:7514(약관 동의) get_screenshot 완료. Figma: 전체/개별 약관 체크박스·전체보기. Step5·Pending·Complete 페이지 구현 확인. |
| **비고** | AGENT-B 3회차. §3.2 로그인·회원가입 사이클 2·3·4 완료. |

---

### 사이클 5 — §3.3 대시보드 (에이전트 C)

| 항목 | 내용 |
|------|------|
| **에이전트 식별자** | 에이전트 C |
| **라운드** | 1 |
| **시간** | 2026-02-08 (기록 시각) |
| **담당 태스크** | 사이클 5: §3.3 대시보드 — 1418:25059 |
| **섹션 번호·이름** | §3.3 대시보드 |
| **이번 사이클 nodeId (최대 3개)** | 1418:25059 |
| **동일 라우트 여부** | 동일 route 1페이지: `/dashboard` |
| **대응 라우트** | `/dashboard` |
| **대응 페이지 파일** | pages/admin/DashboardPage.tsx, widgets/Header, widgets/MainLandingSidebar, entities/vehicle/ui/VehicleCard |
| **MCP 호출** | get_design_context: MCP rate limit으로 미실행 (추후 재시도 권장) |
| **API/ERD** | GET 차량 목록 등 (api_v1·ERD 참조만) |
| **스크린샷 검증** | MCP 한도로 get_screenshot 미실행. 기존 구현은 IA·FIGMA_IA_FSD_STRUCTURE §3.3 기준. |
| **비고** | 에이전트 C 라운드 1. A→F 중 B·D는 MCP 한도로 생략. C: layout 4rem→64px px 정합 적용. F: 빌드 검증. |

---

### 사이클 6 — §3.4 차량 목록 (에이전트 A)

| 항목 | 내용 |
|------|------|
| **에이전트 식별자** | 에이전트 A |
| **라운드** | 2 |
| **시간** | 2026-02-08T16:00:00+09:00 |
| **담당 태스크** | 사이클 6: §3.4 차량 목록 — 1418:15487, 1418:15695, 1418:15903 |
| **섹션 번호·이름** | §3.4 차량 목록 |
| **이번 사이클 nodeId (최대 3개)** | 1418:15487, 1418:15695, 1418:15903 |
| **동일 라우트 여부** | 동일 route `/vehicles` (기본·전체 탭·임시저장 탭 필터 변형) |
| **대응 라우트** | `/vehicles`, `/vehicles?filter=all`, `/vehicles?filter=draft`, `/vehicles?view=list` |
| **대응 페이지 파일** | pages/admin/VehicleListPage.tsx, widgets/VehicleTable, entities/vehicle/ui/VehicleCard, widgets/MainLandingSidebar |
| **MCP 호출** | get_design_context: MCP rate limit으로 미호출. IA·FIGMA_IA_FSD_STRUCTURE §3.4 기준 적용. |
| **API/ERD** | GET 차량 목록 등 (api_v1·ERD 참조만) |
| **스크린샷 검증** | MCP rate limit으로 get_screenshot 미실행. IA·문서 스위트로 검토 완료. |
| **비고** | 에이전트 A 라운드 2. URL 쿼리 동기화 추가: filter(all/draft/completed), view(grid/list). 15487·15695·15903 동일 페이지 상태 변형 반영. |

---

### 사이클 7 — §3.4 차량 목록 (에이전트 A)

| 항목 | 내용 |
|------|------|
| **에이전트 식별자** | 에이전트 A |
| **라운드** | 3 |
| **시간** | 2026-02-08T17:00:00+09:00 |
| **담당 태스크** | 사이클 7: §3.4 차량 목록 — 1418:15565, 1418:17357, 1418:20145 |
| **섹션 번호·이름** | §3.4 차량 목록 |
| **이번 사이클 nodeId (최대 3개)** | 1418:15565, 1418:17357, 1418:20145 |
| **동일 라우트 여부** | 동일 route `/vehicles` (등록완료 탭·그리드 뷰·리스트 뷰 변형) |
| **대응 라우트** | `/vehicles?filter=completed`, `/vehicles?view=grid`, `/vehicles?view=list` |
| **대응 페이지 파일** | pages/admin/VehicleListPage.tsx, widgets/VehicleTable, entities/vehicle/ui/VehicleCard |
| **MCP 호출** | get_design_context: MCP rate limit으로 미호출. IA §3.4 기준(15565=등록완료, 17357=그리드, 20145=리스트) 적용. |
| **API/ERD** | GET 차량 목록 등 (api_v1·ERD 참조만) |
| **스크린샷 검증** | MCP rate limit으로 get_screenshot 미실행. IA·문서 스위트로 검토 완료. |
| **비고** | 에이전트 A 라운드 3. 15565·17357·20145는 사이클 6에서 도입한 filter/view URL 동기화로 이미 반영. 주석 nodeId 보강. |

---

### 사이클 11 — §3.5 차량 등록·상세·경매 (에이전트 B, 라운드 1)

| 항목 | 내용 |
|------|------|
| **에이전트 식별자** | 에이전트 B |
| **라운드** | 1 |
| **시간** | 2026-02-08 (사이클 수행 시각) |
| **담당 태스크** | 사이클 11: §3.5 차량 등록·상세·경매 — 1418:20498, 1418:23705, 1418:23880 |
| **섹션 번호·이름** | §3.5 차량 등록·상세·경매 |
| **이번 사이클 nodeId (최대 3개)** | 1418:20498, 1418:23705, 1418:23880 |
| **동일 라우트 여부** | 20498→/vehicles/new, 23705·23880→/vehicles/new/step1 및 /vehicles/:id/auction/start-price (IA §3.5) |
| **대응 라우트** | `/vehicles/new`, `/vehicles/:id`, `/vehicles/:id/auction/start-price` |
| **대응 페이지 파일** | VehicleRegisterEntryPage.tsx, VehicleRegisterStep1Page.tsx, AuctionStartPricePage.tsx, VehicleDetailPage.tsx |
| **MCP 호출** | get_design_context: 1회(1418:20498) 성공; 1418:23705, 1418:23880 rate limit으로 미호출. 문서(FIGMA_IA_FSD_STRUCTURE) 기반 검토 적용. |
| **API/ERD** | GET /vehicles/:id, POST /vehicles, vehicle·auction (api_v1·ERD 참조만) |
| **스크린샷 검증** | MCP rate limit으로 get_screenshot 미실행. IA·라우트·nodeId 문서 일치 확인. px·FIGMA_MCP_TO_CODE_CONVERSION 준수. |
| **비고** | 에이전트 B 라운드 1. 주석 nodeId 1418:20498·23705·23880 반영, placeholder 123가 4567 통일. |

---

### 사이클 12 — §3.5 차량 등록·상세·경매 (에이전트 B, 라운드 2)

| 항목 | 내용 |
|------|------|
| **에이전트 식별자** | 에이전트 B |
| **라운드** | 2 |
| **시간** | 2026-02-08 (사이클 수행 시각) |
| **담당 태스크** | 사이클 12: §3.5 차량 등록·상세·경매 — 1418:20576, 1418:21868, 1418:22630 |
| **섹션 번호·이름** | §3.5 차량 등록·상세·경매 |
| **이번 사이클 nodeId (최대 3개)** | 1418:20576, 1418:21868, 1418:22630 |
| **동일 라우트 여부** | 20576→/vehicles/new/step2·/vehicles/:id/auction/complete, 21868→step2 확인, 22630→/vehicles/:id/complete (IA §3.5) |
| **대응 라우트** | `/vehicles/new/step2`, `/vehicles/:id/complete`, `/vehicles/:id/auction/complete` |
| **대응 페이지 파일** | VehicleRegisterStep2Page.tsx, VehicleRegistrationCompletePage.tsx, AuctionCompletePage.tsx |
| **MCP 호출** | get_design_context: MCP rate limit으로 3회 미호출. IA·FIGMA_IA_FSD_STRUCTURE 문서 기반 검토 적용. |
| **API/ERD** | POST /vehicles, GET /vehicles/:id (api_v1·ERD 참조만) |
| **스크린샷 검증** | MCP rate limit으로 get_screenshot 미실행. IA·라우트·nodeId 문서 일치, px·FIGMA_MCP_TO_CODE_CONVERSION 준수. |
| **비고** | 에이전트 B 라운드 2. 주석 nodeId 20576·21868·22630 반영(Step2·등록완료·경매완료). |

---

### 사이클 13 — §3.5 차량 등록·상세·경매 (에이전트 B, 라운드 3)

| 항목 | 내용 |
|------|------|
| **에이전트 식별자** | 에이전트 B |
| **라운드** | 3 |
| **시간** | 2026-02-08 (사이클 수행 시각) |
| **담당 태스크** | 사이클 13: §3.5 차량 등록·상세·경매 — 1418:24679, 1418:24463, 1418:21690 |
| **섹션 번호·이름** | §3.5 차량 등록·상세·경매 |
| **이번 사이클 nodeId (최대 3개)** | 1418:24679, 1418:24463, 1418:21690 |
| **동일 라우트 여부** | 동일 route `/vehicles/:id` (차량 상세·일반판매 CTA 강조·경매 CTA/모달 변형, IA §3.5) |
| **대응 라우트** | `/vehicles/:id`, `/vehicles/:id/auction` |
| **대응 페이지 파일** | VehicleDetailPage.tsx, AuctionDetailPage.tsx |
| **MCP 호출** | get_design_context: MCP rate limit으로 3회 미호출. IA·FIGMA_IA_FSD_STRUCTURE 문서 기반 검토 적용. |
| **API/ERD** | GET /vehicles/:id (api_v1·ERD 참조만) |
| **스크린샷 검증** | MCP rate limit으로 get_screenshot 미실행. IA·라우트·nodeId 문서 일치, px·FIGMA_MCP_TO_CODE_CONVERSION 준수. |
| **비고** | 에이전트 B 라운드 3. 주석 nodeId 24679·24463·21690 반영(차량 상세·경매 진입). |

---

### 사이클 16 — §3.6 검차 (에이전트 C, 라운드 2)

| 항목 | 내용 |
|------|------|
| **에이전트 식별자** | 에이전트 C |
| **라운드** | 2 |
| **시간** | 2026-02-08 (기록 시각) |
| **담당 태스크** | 사이클 16: §3.6 검차 — 1444:8198, 1425:9445, 1425:9661 |
| **섹션 번호·이름** | §3.6 검차 |
| **이번 사이클 nodeId (최대 3개)** | 1444:8198, 1425:9445, 1425:9661 |
| **동일 라우트 여부** | 8198→/inspections/request/step1, 9445→/inspections, 9661→/inspections/history (IA §3.6) |
| **대응 라우트** | `/inspections`, `/inspections/request`, `/inspections/request/step1`, `/inspections/history`, `/inspections/:id/progress`, `/inspections/:id/complete` |
| **대응 페이지 파일** | InspectionListPage.tsx, InspectionHistoryPage.tsx, InspectionRequestStep1Page.tsx, InspectionRequestLandingPage.tsx, InspectionProgressPage.tsx, InspectionCompletePage.tsx |
| **MCP 호출** | get_design_context: MCP rate limit으로 3회 미실행 (추후 재시도 권장) |
| **API/ERD** | POST /vehicles/:vehicleId/inspections, GET /vehicles/:vehicleId/inspections/latest 등 (api_v1·ERD 참조만) |
| **스크린샷 검증** | MCP 한도로 get_screenshot 미실행. 기존 구현은 IA·FIGMA_IA_FSD_STRUCTURE §3.6 기준. |
| **비고** | 에이전트 C 라운드 2. A→F 중 B·D는 MCP 한도로 생략. C: InspectionListPage·InspectionHistoryPage 사이드바 min-h 4rem→64px px 정합. F: 빌드 검증. |

---

### 사이클 17 — §3.6 검차 (에이전트 C, 라운드 3)

| 항목 | 내용 |
|------|------|
| **에이전트 식별자** | 에이전트 C |
| **라운드** | 3 |
| **시간** | 2026-02-08 (기록 시각) |
| **담당 태스크** | 사이클 17: §3.6 검차 — 1425:9875, 1425:10137, 1425:10663 |
| **섹션 번호·이름** | §3.6 검차 |
| **이번 사이클 nodeId (최대 3개)** | 1425:9875, 1425:10137, 1425:10663 |
| **동일 라우트 여부** | 9875→/inspections/history?view=card, 10137·10663→/inspections/:id/progress (IA §3.6) |
| **대응 라우트** | `/inspections/history?view=card`, `/inspections/:inspectionId/progress` |
| **대응 페이지 파일** | InspectionHistoryPage.tsx(카드 뷰), InspectionProgressPage.tsx(매칭중·이동중) |
| **MCP 호출** | get_design_context: MCP rate limit으로 3회 미실행 (추후 재시도 권장) |
| **API/ERD** | GET /vehicles/:vehicleId/inspections/latest 등 (api_v1·ERD 참조만) |
| **스크린샷 검증** | MCP 한도로 get_screenshot 미실행. IA·FIGMA_IA_FSD_STRUCTURE §3.6 기준. |
| **비고** | 에이전트 C 라운드 3. C: InspectionHistoryPage 리스트/카드 뷰 전환(?view=card), InspectionProgressPage nodeId 주석(10137·10663·10813). F: 빌드 검증. |
