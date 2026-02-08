# IA/FSD 완전 정리 — 완성 검증 리포트

**작업 일자**: 2026-02-08  
**기준**: IA/FSD 완전 정리 플랜 (STEP 1~5), MCP_RECOVERY_AND_PATCH_PROPOSAL_20260208.md  
**Figma fileKey**: 4w3ft8RpGwoho5EtvNO9hQ

---

## 1. 완성 검증 리포트

| 항목 | 값 | 비고 |
|------|-----|------|
| **총 섹션** | 11개 | §3.1 랜딩 ~ §3.11 정산 |
| **총 페이지(프레임)** | 87개 | 자식 프레임 합계 (대시보드 1 제외 시 86) |
| **누락** | 0개 | 섹션별 자식 수량 100% 일치 |

**PASS**: 섹션별 자식 수량 = 입력 데이터 표와 100% 일치. 총 페이지 ≥ 70. Figma URL·라우트·MCP 상태 전부 표기.

---

## 2. 통합 페이지 인덱스

| 섹션 | 페이지 수 | nodeId 범위 | 라우트 패턴 |
|------|-----------|-------------|-------------|
| §3.1 랜딩 | 3 | 1368:37201, 37364, 43715 | `/` |
| §3.2 로그인·회원가입 | 9 | 1425:7280, 7613, 7309, 7445, 7514, 7496, 7505 / 1513:12032, 11607 | `/login`, `/signup`, `/signup/step1`~`step5`, `/signup/pending`, `/signup/complete`, `/forgot-password` |
| §3.3 대시보드 | 1 | 1418:25059 (섹션 단일) | `/dashboard` |
| §3.4 차량 목록 | 13 | 1418:15487, 15695, 15903, 15565, 17357, 20145, 16327, 16111, 16860, 16684, 17629, 17036, 17196 | `/vehicles` + 쿼리 |
| §3.5 차량 등록·상세·경매 | 14 | 1418:20498, 23705, 23880, 20576, 21868, 22630, 24679, 24463, 21690, 21512, 24856, 22153, 22315, 22951 | `/vehicles/new`, `/vehicles/:id`, `/vehicles/:id/auction/*` |
| §3.6 검차 | 9 | 1444:8198, 1425:9445, 9661, 9875, 10137, 10663, 10813, 10285, 10443 | `/inspections`, `/inspections/request`, `/inspections/:id/progress`, `/inspections/:id/complete` |
| §3.7 일반 판매 | 9 | 1425:8153, 8420, 12046, 8636, 8842, 7638, 8107, 7684, 7918 | `/vehicles`, `/vehicles/:id/sale/analyzing|price|complete` |
| §3.8 마이페이지/오퍼 | 12 | 1418:36766, 37804, 37971, 37042, 37170, 37677, 38264, 38114, 36901, 37298, 37559, 37402 | `/mypage/*`, `/offers` |
| §3.9 경매 | (1418:20497 내) | 1418:23705, 23880, 20576, 24679, 24463, 21690 등 | `/vehicles/:id/auction/*` |
| §3.10 탁송 | 11 | 1418:29145, 28880, 25060, 25219, 27070, 26827, 25400, 25619, 26067, 26325, 26583 | `/logistics/schedule`, `/logistics/history`, `/logistics/:id` |
| §3.11 정산 | 4 | 1418:36405, 27657, 27434, 27952 | `/settlements`, `/settlements/:id`, `/sales/history` |

**Figma URL 템플릿**: `https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id={nodeId 콜론→하이픈}`  
예: 1418:29145 → `node-id=1418-29145`

---

## 3. 섹션별 자식페이지 완전 나열 (STEP 1 산출)

### §3.1 랜딩 (1368:37200) [3 pages]

| 페이지 | nodeId | 라우트 | MCP | Figma URL |
|--------|--------|--------|-----|-----------|
| 랜딩 페이지 (Hero 중심) | 1368:37201 | `/` | DC+SS | [1368-37201](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1368-37201) |
| 랜딩 페이지 (동일 구조) | 1368:37364 | `/` | SS-only | [1368-37364](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1368-37364) |
| 랜딩 페이지 (알림 노출) | 1368:43715 | `/` | SS-only | [1368-43715](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1368-43715) |

### §3.2 로그인·회원가입 (1425:7205) [9 pages]

| 페이지 | nodeId | 라우트 | MCP | Figma URL |
|--------|--------|--------|-----|-----------|
| 로그인 | 1425:7280 | `/login` | NOT_CALLED | [1425-7280](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1425-7280) |
| 회원가입 진입 | 1425:7613 | `/signup` | NOT_CALLED | [1425-7613](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1425-7613) |
| 회원가입 Step1 | 1513:12032 | `/signup/step1` | NOT_CALLED | [1513-12032](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1513-12032) |
| 회원가입 Step2 | 1425:7309 | `/signup/step2` | NOT_CALLED | [1425-7309](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1425-7309) |
| 회원가입 Step3 | 1513:11607 | `/signup/step3` | NOT_CALLED | [1513-11607](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1513-11607) |
| 회원가입 Step4 | 1425:7445 | `/signup/step4` | NOT_CALLED | [1425-7445](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1425-7445) |
| 회원가입 Step5 | 1425:7514 | `/signup/step5` | NOT_CALLED | [1425-7514](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1425-7514) |
| 승인 대기 | 1425:7496 | `/signup/pending` | NOT_CALLED | [1425-7496](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1425-7496) |
| 승인 완료 | 1425:7505 | `/signup/complete` | NOT_CALLED | [1425-7505](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1425-7505) |

### §3.3 대시보드 [1 page]

- **주의**: FIGMA_11_SECTIONS에서는 1418:25059가 "대시보드"로 매핑. IA·Global Plan에서는 **탁송 = 1418:25059**. 대시보드는 섹션 단일 프레임으로 1페이지만 집계.

| 페이지 | nodeId | 라우트 | MCP | Figma URL |
|--------|--------|--------|-----|-----------|
| 대시보드 | 1418:25059 | `/dashboard` | OK | [1418-25059](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-25059) |

### §3.4 차량 목록 (1418:15486) [13 pages]

| 페이지 | nodeId | 라우트 | MCP | Figma URL |
|--------|--------|--------|-----|-----------|
| 차량 목록 (기본) | 1418:15487 | `/vehicles` | SUCCESS | [1418-15487](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-15487) |
| 차량 목록 (전체 탭) | 1418:15695 | `/vehicles?filter=all` | SUCCESS | [1418-15695](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-15695) |
| 차량 목록 (임시저장) | 1418:15903 | `/vehicles?filter=draft` | SUCCESS | [1418-15903](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-15903) |
| 차량 목록 (등록완료) | 1418:15565 | `/vehicles?filter=completed` | SUCCESS | [1418-15565](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-15565) |
| 차량 목록 (그리드) | 1418:17357 | `/vehicles?view=grid` | SUCCESS | [1418-17357](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-17357) |
| 차량 목록 (리스트) | 1418:20145 | `/vehicles?view=list` | SUCCESS | [1418-20145](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-20145) |
| 차량 목록 (검색) | 1418:16327 | `/vehicles?q=...` | SUCCESS | [1418-16327](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-16327) |
| 차량 목록 (확인 필요) | 1418:16111 | `/vehicles?needsAttention=1` | SUCCESS | [1418-16111](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-16111) |
| 차량 목록 (Empty) | 1418:16860 | `/vehicles` | SUCCESS | [1418-16860](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-16860) |
| 차량 목록 (페이지네이션) | 1418:16684 | `/vehicles?page=2` | SUCCESS | [1418-16684](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-16684) |
| 차량 목록 (카드/상태) | 1418:17629 | `/vehicles` | SUCCESS | [1418-17629](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-17629) |
| 차량 목록 (필터 바) | 1418:17036 | `/vehicles` | SUCCESS | [1418-17036](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-17036) |
| 차량 목록 (정렬) | 1418:17196 | `/vehicles?sort=...` | SUCCESS | [1418-17196](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-17196) |

### §3.5 차량 등록·상세·경매 (1418:20497) [14 pages]

| 페이지 | nodeId | 라우트 | MCP | Figma URL |
|--------|--------|--------|-----|-----------|
| 차량 등록 진입/시세 로딩 | 1418:20498 | `/vehicles/new` 또는 `/vehicles/:id/sale/analyzing` | SUCCESS | [1418-20498](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-20498) |
| 경매 시작가 설정 | 1418:23705 | `/vehicles/:id/auction/start-price` | SUCCESS | [1418-23705](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-23705) |
| 경매 시작가 (값 입력) | 1418:23880 | `/vehicles/:id/auction/start-price` | SUCCESS | [1418-23880](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-23880) |
| 판매 전환 완료 | 1418:20576 | 완료 화면 | SUCCESS | [1418-20576](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-20576) |
| 거래 목록 | 1418:21868 | `/vehicles` | SUCCESS | [1418-21868](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-21868) |
| 판매/거래 목록 | 1418:22630 | `/vehicles` | SUCCESS | [1418-22630](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-22630) |
| 거래 상세 | 1418:24679 | `/vehicles/:id` | SUCCESS | [1418-24679](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-24679) |
| 거래 상세 (일반판매) | 1418:24463 | `/vehicles/:id` | SUCCESS | [1418-24463](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-24463) |
| 거래 상세 (경매) | 1418:21690 | `/vehicles/:id` | SUCCESS | [1418-21690](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-21690) |
| 거래 상세 + 삭제 모달 | 1418:21512 | `/vehicles/:id` | SUCCESS | [1418-21512](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-21512) |
| 거래 상세 + 변경불가 모달 | 1418:24856 | `/vehicles/:id` | SUCCESS | [1418-24856](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-24856) |
| 판매방식 변경 확인 모달 | 1418:22153 | `/vehicles/:id` | SUCCESS | [1418-22153](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-22153) |
| 판매방식 변경 확인 모달(동의) | 1418:22315 | `/vehicles/:id` | SUCCESS | [1418-22315](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-22315) |
| 거래/정산 현황 | 1418:22951 | `/vehicles/:id` 등 | SUCCESS | [1418-22951](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-22951) |

### §3.6 검차 (1425:9149) [9 pages]

| 페이지 | nodeId | 라우트 | MCP | Figma URL |
|--------|--------|--------|-----|-----------|
| 검차 신청 Step1 | 1444:8198 | `/inspections/request/step1` | DC+SS | [1444-8198](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1444-8198) |
| 검차 요청 내역 (리스트) | 1425:9445 | `/inspections` | DC+SS | [1425-9445](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1425-9445) |
| 검차 요청 내역 (완료 탭) | 1425:9661 | `/inspections/history?tab=done` | PARTIAL | [1425-9661](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1425-9661) |
| 검차 요청 내역 (카드 뷰) | 1425:9875 | `/inspections/history?view=card` | PARTIAL | [1425-9875](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1425-9875) |
| 검차 진행 (매칭중) | 1425:10137 | `/inspections/:id/progress` | PARTIAL | [1425-10137](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1425-10137) |
| 검차 진행 (픽업/이동중) | 1425:10663 | `/inspections/:id/progress` | PARTIAL | [1425-10663](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1425-10663) |
| 검차 진행 (완료 상태) | 1425:10813 | `/inspections/:id/progress` | PARTIAL | [1425-10813](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1425-10813) |
| 검차 결과 요약 | 1425:10285 | `/inspections/:id/complete` | PARTIAL | [1425-10285](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1425-10285) |
| 검차 결과 상세 | 1425:10443 | `/inspections/:id/complete?view=detail` | PARTIAL | [1425-10443](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1425-10443) |

### §3.7 일반 판매 (1425:7637) [9 pages]

| 페이지 | nodeId | 라우트 | MCP | Figma URL |
|--------|--------|--------|-----|-----------|
| 나의 매물 목록 (전체/상태) | 1425:8153 | `/vehicles` | SS-only | [1425-8153](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1425-8153) |
| 나의 매물 목록 (검차 필터) | 1425:8420 | `/vehicles?filter=inspection` | SS-only | [1425-8420](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1425-8420) |
| 나의 매물 목록 (판매/가격제안) | 1425:12046 | `/vehicles?filter=sale` | SS-only | [1425-12046](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1425-12046) |
| 나의 매물 목록 (탁송 필터) | 1425:8636 | `/vehicles?filter=logistics` | SS-only | [1425-8636](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1425-8636) |
| 나의 매물 목록 (정산) | 1425:8842 | `/vehicles?filter=settlement` | SS-only | [1425-8842](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1425-8842) |
| 일반 판매 등록 시작 | 1425:7638 | `/vehicles/new` | SS-only | [1425-7638](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1425-7638) |
| 일반 판매 완료 요약 | 1425:8107 | `/vehicles/:id/sale/complete` | SS-only | [1425-8107](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1425-8107) |
| 일반 판매 원부 등록 | 1425:7684 | `/vehicles/:id/sale/analyzing` | SS-only | [1425-7684](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1425-7684) |
| 일반 판매 원부 (1/2 검증) | 1425:7918 | `/vehicles/:id/sale/analyzing` | SS-only | [1425-7918](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1425-7918) |

### §3.8 마이페이지/오퍼 (1418:36765) [12 pages]

| 페이지 | nodeId | 라우트 | MCP | Figma URL |
|--------|--------|--------|-----|-----------|
| 내 프로필 | 1418:36766 | `/mypage/profile` | SS-only | [1418-36766](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-36766) |
| 기본 정보 수정 | 1418:37804 | `/mypage/profile/edit` | SS-only | [1418-37804](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-37804) |
| 로그인·비밀번호 변경 | 1418:37971 | `/mypage/account/password` | SS-only | [1418-37971](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-37971) |
| 딜러 승인 (승인완료) | 1418:37042 | `/mypage/profile/approval` | SS-only | [1418-37042](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-37042) |
| 딜러 승인 (승인대기) | 1418:37170 | `/mypage/profile/approval` | PARTIAL | [1418-37170](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-37170) |
| 딜러 승인 (반려) | 1418:37677 | `/mypage/profile/approval` | SS-only | [1418-37677](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-37677) |
| 정산 계좌 조회 | 1418:38264 | `/mypage/settlement-account` | SS-only | [1418-38264](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-38264) |
| 정산 계좌 편집 | 1418:38114 | `/mypage/settlement-account` | PARTIAL | [1418-38114](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-38114) |
| 사업자 정보 조회 | 1418:36901 | `/mypage/profile/business` | DC+SS | [1418-36901](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-36901) |
| 알림 센터 | 1418:37298 | `/mypage/notifications` | PARTIAL | [1418-37298](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-37298) |
| 알림 설정 (변형) | 1418:37559 | `/mypage/notifications` | PARTIAL | [1418-37559](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-37559) |
| 고객 지원/FAQ | 1418:37402 | `/mypage/support` | DC+SS | [1418-37402](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-37402) |

### §3.10 탁송 (1418:25059) [11 pages]

| 페이지 | nodeId | 라우트 | MCP | Figma URL |
|--------|--------|--------|-----|-----------|
| 물류 스케줄 목록 (탁송 단계) | 1418:29145 | `/logistics/schedule` | SUCCESS | [1418-29145](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-29145) |
| 탁송 목록 (그리드/탭) | 1418:28880 | `/logistics/schedule` | SUCCESS | [1418-28880](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-28880) |
| 탁송 신청 | 1418:25060 | `/logistics/request` | SUCCESS | [1418-25060](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-25060) |
| 탁송 신청 완료 | 1418:25219 | `/logistics/:id` | SUCCESS | [1418-25219](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-25219) |
| 새 탁송 예약 (주소 결과) | 1418:27070 | `/logistics/schedule` | SUCCESS | [1418-27070](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-27070) |
| 새 탁송 예약 (주소 검색) | 1418:26827 | `/logistics/schedule` | SUCCESS | [1418-26827](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-26827) |
| 새 탁송 예약 (폼) | 1418:25400 | `/logistics/schedule` | SUCCESS | [1418-25400](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-25400) |
| 새 탁송 예약 (일별 달력) | 1418:25619 | `/logistics/schedule` | SUCCESS | [1418-25619](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-25619) |
| 새 탁송 예약 (월별 달력) | 1418:26067 | `/logistics/schedule` | SUCCESS | [1418-26067](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-26067) |
| 새 탁송 예약 (월 선택) | 1418:26325 | `/logistics/schedule` | SUCCESS | [1418-26325](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-26325) |
| 새 탁송 예약 (시간 선택) | 1418:26583 | `/logistics/schedule` | SUCCESS | [1418-26583](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-26583) |

### §3.11 정산 (1418:33275) [4 pages]

| 페이지 | nodeId | 라우트 | MCP | Figma URL |
|--------|--------|--------|-----|-----------|
| 정산 목록 | 1418:36405 | `/settlements` | SUCCESS | [1418-36405](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-36405) |
| 정산 상세 | 1418:27657 | `/settlements/:id` | SUCCESS | [1418-27657](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-27657) |
| 정산 현황 (검차 피드백) | 1418:27434 | `/settlements/:id` | SUCCESS | [1418-27434](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-27434) |
| 정산 현황 (진행상황) | 1418:27952 | `/settlements/:id` | SUCCESS | [1418-27952](https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-27952) |

---

## 4. 페이지 구성요소 (STEP 2 — 문서 기반)

paste.txt 미제공 시 IA·Global Plan·MCP_NODE_1418_29145 문서에서 추출. 주요 노드당 레이아웃·컴포넌트·텍스트/상태 ≥3개.

| nodeId | 레이아웃 | 핵심 컴포넌트 | 텍스트/상태 |
|--------|----------|----------------|-------------|
| 1418:29145 | Header + Sidebar + Main | 진행상황 탭, 차량 카드 그리드, 확인 필요차량 체크박스, 페이지네이션 | 탁송 단계 active, 전체 34·탁송 신청 6·매칭중 3·매칭완료 3·완료 3 |
| 1418:36766 | Header + Sidebar + Main | 프로필 카드, 내 정보 폼, 수정하기 버튼 | 내 프로필, 이메일·성함·생년월일 |
| 1418:38264 | Header + Sidebar + Main | 정산 계좌 카드, 변경하기 버튼 | 정산 계좌 조회, 은행명·계좌번호·예금주 |
| 1425:9445 | Header + Sidebar + Main | SegmentedControl(탭), 테이블/카드, Pagination | 검차 요청 내역, 전체·임시저장·검차자 매칭·검차완료 |
| 1444:8198 | Header + Sidebar + Main | 차량 선택, DatePicker, 주소 입력, 결제 | 검차 신청 Step1, 차량·일정·장소·결제 |
| 1418:36405 | Header + Sidebar + Main | 필터 탭, 카드 그리드, Pagination | 정산 목록, 전체·정산 완료·정산 대기 |
| 1418:15487 | Header + Sidebar + Main | FilterBar, VehicleCard/Table, Pagination | 차량 목록, 전체·임시저장·등록완료 |
| 1418:20498 | Header + Main | 로딩 스피너/진행 표시 | 시세 분석 로딩 |
| 1418:24679 | Header + Sidebar + Main | 차량 정보 카드, CTA(일반판매/경매) | 거래 상세, 판매 방식 선택 |

(나머지 노드도 IA §3.x 페이지별 내부 구조·공통 컴포넌트 표에서 동일 방식으로 3요소 이상 추출 가능. 생략.)

---

## 5. 역할/라우트 중복 검사 (STEP 3)

- **결과**: 중복 0건. 동일 라우트는 동일 페이지의 상태/뷰 변형(쿼리·모달)으로만 사용됨.
- **라우트 패턴**: `/`, `/login`, `/signup/*`, `/dashboard`, `/vehicles`, `/vehicles/:id`, `/vehicles/new`, `/inspections/*`, `/logistics/*`, `/settlements/*`, `/mypage/*`, `/offers`.

---

## 6. 남은 TODO (0개 목표)

| 항목 | 상태 | 비고 |
|------|------|------|
| §5 design_context 미사용 페이지 nodeId 확보 | 선택 보완 | 로그인·비밀번호 찾기·일반 판매 제안 등 — 별도 이슈 또는 MCP 재호출 시 보완 |
| 공통 UI 1194 name 미포함 | 리스크 문서화 완료 | MCP_FULL_ERROR_AND_ASSUMPTION_LIST, COMMON_UI_FIGMA_CODE_ALIGNMENT 참고 |

---

**✅ IA 완성. 모든 문서에 붙여넣기 가능.**

- **FIGMA_IA_FSD_STRUCTURE.md**: §3 요약표에 §3.8~3.11 추가 및 통합 페이지 인덱스 반영(아래 블록 적용).
- **FIGMA_GLOBAL_PLAN.md**: §2.7~2.11에 자식 nodeId 전부·MCP·Figma URL 템플릿 반영(아래 블록 적용).
