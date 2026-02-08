# 사이트맵 대비 구현 현황

**기준**: 사용자 제시 사이트맵(플로우·노드 라벨).  
**목적**: 해당 플로우가 현재 라우트/페이지로 전체 구현되었는지 매핑.

---

## 요약

| 구역 | 구현 | 비고 |
|------|------|------|
| 랜딩페이지 | ✅ | `/` |
| 회원가입 유도 (GNB 탭 비로그인) | ✅ | ProtectedRoute → `/signup?redirect=...` |
| GNB 5탭 (차량목록/검차/거래/탁송/정산) | ✅ | 각 랜딩 라우트 존재 |
| 회원가입 (로그인·Step1~5·승인대기·완료) | ✅ | `/login`, `/signup` ~ `/signup/complete` |
| 매물등록 CTA_1 (차량원부등록) | ✅ | `/vehicles/new` ~ step2, complete |
| 매물등록 CTA_2 (검차) | ✅ | 검차신청 step1/2, 진행, 완료, 결과 |
| 매물등록 CTA_3 (거래·일반/경매) | ✅ | 판매방식선택·시세·가격·완료·거래상세 |
| 매물등록 CTA_4 (탁송) | ⚠️ 부분 | 예약 폼·완료 있음, **주소검색 모달·연/월/일 캘린더 UI**는 단순화 |
| 매물등록 CTA_5 (정산) | ✅ | 정산목록·상세·필터 |
| 마이페이지 | ⚠️ 부분 | **정산 계좌**만 구현, 내프로필·기본정보·딜러승인·알림 등 **미구현**(사이드바 "준비 중") |

---

## 1. 랜딩페이지

| 사이트맵 | 라우트 | 구현 |
|----------|--------|------|
| §3.1 랜딩페이지_로그인전_풀뷰 / Hero / 알림노출 | `/` | ✅ `LandingPage` |

---

## 2. 회원가입 이전 · GNB

| 사이트맵 | 동작 | 구현 |
|----------|------|------|
| GNB 5탭 클릭 시 (비로그인) | §3.7 나의매물목록_회원가입유도 | ✅ `ProtectedRoute` → `/signup?redirect=...` (회원가입 진입으로 유도) |

---

## 3. GNB 5탭 랜딩

| 탭 | 사이트맵 노드 | 라우트 | 구현 |
|----|----------------|--------|------|
| 차량목록 | 1714-23434, 전체/검차/판매·거래/탁송/정산 필터 | `/vehicles` (?filter=) | ✅ `VehicleListPage` (사이드 필터·탭·그리드/리스트) |
| 검차 | §3.6 검차요청내역_리스트_변형 | `/inspections` | ✅ `InspectionListPage` |
| 거래 | 1714-22332 | `/offers` | ✅ `TradeListPage` |
| 탁송 | 1714-22874 | `/logistics/schedule`, `/logistics/history` | ✅ `LogisticsSchedulePage`, `LogisticsHistoryPage` |
| 정산 | 1714-23139 | `/settlements` | ✅ `SettlementListPage` |

---

## 4. 회원가입

| 사이트맵 | 라우트 | 구현 |
|----------|--------|------|
| §3.2 로그인 | `/login` | ✅ `LoginPage` |
| 회원가입진입 | `/signup` | ✅ `SignupEntryPage` |
| Step1~5, 승인대기 | `/signup/step1` ~ `step5`, `/signup/pending` | ✅ 각 Step·Pending 페이지 |
| 승인완료 | `/signup/complete` | ✅ `SignupCompletePage` |

---

## 5. 매물등록 CTA (매물등록하기 버튼)

### CTA_1 차량원부등록

| 사이트맵 | 라우트 | 구현 |
|----------|--------|------|
| 차량등록_비대면_랜딩 | `/vehicles/new` | ✅ `VehicleRegisterEntryPage` |
| 원부등록-2/-1 | `/vehicles/new/step1`, `step2` | ✅ Step1·Step2 |
| 차량등록완료_확인 | `/vehicles/:id/complete` | ✅ `VehicleRegistrationCompletePage` |

### CTA_2 검차

| 사이트맵 | 라우트 | 구현 |
|----------|--------|------|
| 검차신청 Step1_변형 | `/inspections/request`, `request/step1`, `step2` | ✅ 랜딩·Step1·Step2 |
| 검차진행_매칭중/완료 | `/inspections/:id/progress` | ✅ `InspectionProgressPage` |
| 검차결과요약 | `/inspections/:id/complete` | ✅ `InspectionCompletePage` |
| 검차요청내역 (리스트/카드) | `/inspections`, `/inspections/history` | ✅ 리스트·히스토리 |

### CTA_3 거래 (일반/경매)

| 사이트맵 | 라우트 | 구현 |
|----------|--------|------|
| 판매방식선택 | `/vehicles/:id` (판매방식 선택) | ✅ `VehicleDetailPage` |
| 일반: 시세분석중·가격·판매전환완료 | `/vehicles/:id/sale/analyzing`, `price`, `complete` | ✅ |
| 경매: 시작가·기간·완료 | `/vehicles/:id/auction`, `start-price`, `duration`, `complete` | ✅ |
| 거래상세_변형/경매 | `/vehicles/:id/trade`, `/offers` | ✅ `TradeDetailPage`, `TradeListPage` |
| 차량삭제·임시저장 모달 | 거래 상세 내 버튼 | ✅ 모달 명세 반영 가능 (구현 여부는 컴포넌트 확인) |

### CTA_4 탁송

| 사이트맵 | 라우트/화면 | 구현 |
|----------|-------------|------|
| 판매_거래목록_목록뷰 | `/offers` 등에서 탁송예약 CTA | ✅ 탁송 신청 연결 |
| 새탁송예약_폼 | `/logistics/schedule` | ✅ 날짜·시간·주소·특이사항 입력 |
| 우편번호/주소검색 모달 | §3.10 26827, 27070 | ⚠️ **주소 검색 모달** (우편번호 찾기·결과) 별도 UI는 단순화 또는 미구현 |
| 폼-1 연도·월선택·시간선택 | §3.10 25400-1, 26325, 26583 | ⚠️ **연/월/일 캘린더·시간 그리드**는 현재 단순 입력으로 대체 가능 |
| 탁송_기사배정_진행중 | 완료 후 안내 | ✅ 완료 화면 있음 |
| 탁송 내역 | `/logistics/history` | ✅ 리스트/그리드 뷰 |

### CTA_5 정산

| 사이트맵 | 라우트 | 구현 |
|----------|--------|------|
| 정산현황_검차피드백 | `/settlements` | ✅ `SettlementListPage` |
| 정산목록_정산필터카드뷰 | `/settlements`, `/:id` | ✅ 목록·상세 |
| 종료 후 차량목록 복귀 | `/vehicles` | ✅ 전역 진입·완료 후 이동을 `/vehicles`로 통일 |

---

## 6. 마이페이지

| 사이트맵 | 라우트 | 구현 |
|----------|--------|------|
| §3.8 내프로필 랜딩 (1418-36766) | `/mypage` → `/mypage/settlement-account` | ⚠️ **정산 계좌** 페이지만 구현, “내프로필” 랜딩 전용 화면 없음 |
| 정산 계좌 등록/변경/조회 | `/mypage/settlement-account` | ✅ `SettlementAccountPage` |
| 기본정보수정 (1418-37804) | (미정의) | ❌ 사이드바 "준비 중" |
| 딜러승인 반려/승인대기/승인완료 | (미정의) | ❌ "준비 중" |
| 사업자정보조회 | (미정의) | ❌ "준비 중" |
| 로그인 비밀번호 변경 (내프로필-1) | (미정의) | ❌ "준비 중" |
| 알림설정_변형 · 알림센터 | (미정의) | ❌ "준비 중" |
| 고객지원 FAQ (알림센터-1) | (미정의) | ❌ "준비 중" |

---

## 7. 라우트 목록 (실제 코드 기준)

- **공개**: `/`, `/login`, `/signup`, `/signup/step1`~`step5`, `/signup/pending`, `/signup/complete`, `/forgot-password`
- **보호**: `/dashboard`, `/vehicles`, `/vehicles/new`, `/vehicles/new/step1|step2`, `/vehicles/:id`, `/vehicles/:id/complete`, `/vehicles/:id/sale/analyzing|price|complete`, `/vehicles/:id/auction`, `auction/start-price|duration|complete`, `/vehicles/:id/trade`, `/inspections`, `/inspections/request`, `request/step1|step2`, `/inspections/history`, `/inspections/:id/progress|complete`, `/offers`, `/offers/proposals`, `/logistics/schedule`, `/logistics/history`, `/sales/history`, `/settlements`, `/settlements/:id`, `/mypage`, `/mypage/settlement-account`
- **폴백**: `*` → `/vehicles`

---

## 결론

- **전체 플로우**: 랜딩 → GNB 5탭 → 회원가입 → 매물등록 CTA_1~3·CTA_5·(탁송 CTA_4 대부분)까지는 **사이트맵과 대응되는 라우트/페이지가 구현**되어 있음.
- **미완/부분**  
  - **탁송(CTA_4)**: 주소검색 모달(우편번호 찾기·결과), Figma 명세의 연/월/일·시간 선택 UI는 단순화 또는 미구현.  
  - **마이페이지**: 정산 계좌만 구현, 내프로필 랜딩·기본정보·딜러승인·알림·고객지원 등은 **미구현**(사이드바에 “준비 중” 표시).

원하시면 탁송 주소 모달·마이페이지 내프로필 랜딩을 우선 구현할 수 있도록 작업 목록으로 쪼개 드리겠습니다.
