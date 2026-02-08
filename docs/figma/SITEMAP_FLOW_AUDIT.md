# 사이트맵 플로우 점검 (코드베이스 대조)

**기준**: 사용자 제공 사이트맵 (진입·엔드포인트·플로우).  
**점검 일자**: 2026-02-09.

---

## 1. 요약

| 구분 | 사이트맵 | 코드 현황 | 일치 |
|------|----------|-----------|------|
| 매물등록하기 진입 | 헤더 클릭 → **§3.5_1418-20498_차량등록_비대면_랜딩** (/vehicles/new) | 랜딩/차량목록/대시에서 **/vehicles/new/step1** 직행 | **불일치** |
| 차량목록 탭 사이드 필터 | 전체·검차·판매거래·탁송·**정산** → 동일 컨테이너(1714-23434) 필터 | 정산 → **/settlements** (다른 탭) | **불일치** |
| 차량목록 사이드 라벨 | 검차(필터) | "차량 상태" | **불일치** |
| 회원가입 이전 GNB | 나의매물목록_회원가입유도(1425-8153) | /signup 리다이렉트 | 부분(별도 페이지 없음) |
| CTA_1→CTA_2 이어짐 | 차량등록완료 후 검차 신청 | 검차 신청하기 버튼 있음 | 일치 |
| 라우트 정의 | 상기 경로 | router.tsx 전반 일치 | 일치 |

---

## 2. 매물등록 플로우 (상세)

**사이트맵**:  
헤더 2단 "매물등록하기" 클릭 → **기능 "매물등록"** → **§3.5_1418-20498_차량등록_비대면_랜딩** → 원부등록-2/-1 → 차량등록완료_확인 → (이어서 CTA_2 검차).

**코드**:
- `LandingHeader`: "매물등록하기" 클릭 시 `onRegisterListing?.()` 또는 `navigate('/vehicles/new')`.
- **LandingPage**: `onRegisterListing={handleStartNow}` → `navigate('/vehicles/new/step1')` → **차량등록_비대면_랜딩(/vehicles/new) 생략**.
- **VehicleListPage**: `onRegisterListing={handleRegister}` → `navigate('/vehicles/new/step1')` → **동일 생략**.
- **DashboardPage**: 동일.
- **VehicleRegisterEntryPage** (/vehicles/new): 자체 `onRegisterListing={handleRegister}` → step1. (진입 페이지에서 다시 헤더 누를 때만 해당.)

**결론**:  
헤더 "매물등록하기"가 **반드시 /vehicles/new(차량등록_비대면_랜딩)로 먼저 가야** 하나, 랜딩/차량목록/대시보드에서는 **/vehicles/new/step1으로 직행**하고 있음. → **플로우 불일치**.

---

## 3. 차량목록 탭 사이드 (1714-23434)

**사이트맵**:
- 전체 → §3.7_1425-8153  
- 검차(필터) → §3.7_1425-8420  
- 판매거래(필터) → §3.7_1425-12046  
- 탁송(필터) → §3.7_1425-8636  
- **정산(필터)** → §3.7_1425-8842 (동일 탭 내 필터 뷰)

**코드** (MainLandingSidebar):
- 전체 → /vehicles (일치)
- "차량 상태" → /vehicles?filter=status (사이트맵의 "검차"와 라벨/의미 불일치 가능)
- "판매/거래 단계" → /vehicles?filter=sale (일치)
- "탁송 단계" → /vehicles?filter=logistics (일치)
- **"정산"** → **/settlements** (다른 탭으로 이동. 사이트맵은 차량목록 탭 내 정산 **필터** → /vehicles?filter=정산 유형)

**결론**:  
차량목록 탭 사이드에서 "정산"은 **동일 탭 필터**여야 하나, 현재는 **정산 탭(/settlements)**으로 나감. 라벨 "차량 상태"와 "검차"도 정리 필요.

---

## 4. 기타 엔트리·엔드포인트

| 사이트맵 | 라우트/엔트리 | 코드 | 비고 |
|----------|----------------|------|------|
| / 랜딩 | §3.1 1368-37201 → Hero → 1368-43715 알림 | / → LandingPage | 일치 |
| 회원가입 이전 GNB | 1425-8153 회원가입유도 | ProtectedRoute → /signup | 전용 화면 1425-8153 없음 |
| 로그인 | 1425-7280 | /login | 일치 |
| 회원가입 Step1~5, 승인대기 | 1425-7613, 1513-12032 등 | /signup, /signup/step1~5, /signup/pending | 일치 |
| 검차 탭 랜딩 | 1425-9445 | /inspections | 일치 |
| 거래 탭 | 1714-22332 | /offers | 일치 |
| 탁송 탭 | 1714-22874 | /logistics/schedule | 일치 |
| 정산 탭 | 1714-23139 | /settlements | 일치 |
| CTA_1 랜딩 | 1418-20498 | /vehicles/new | 존재하나 상기대로 진입 생략됨 |
| CTA_2 검차신청 Step1 | 1444-8198 | /inspections/request, request/step1 | 일치 |
| CTA_3 판매방식·일반/경매 | 1418-20498, 23705, 23880 등 | /vehicles/:id/sale/*, auction/* | 일치 |
| CTA_4 탁송 | 1418-22630, 25400 등 | /logistics/schedule, history | 일치 |
| CTA_5 정산 | 1418-27434, 36405 | /settlements, /sales/history | 일치 |
| 마이페이지 | 1418-36766 내프로필 | /mypage/settlement-account 등 | 정산계좌만 구현 |

---

## 5. 가설 (런타임 계측 대상)

- **H1**: 랜딩에서 "매물등록하기" 클릭 시 `/vehicles/new/step1`로 이동(차량등록_비대면_랜딩 생략). → 로그로 확인 예정.
- **H2**: 차량목록에서 "매물등록하기" 클릭 시 `/vehicles/new/step1`로 이동. → 로그로 확인 예정.
- **H3**: `onRegisterListing` 없을 때만 `/vehicles/new`로 이동. → 로그로 확인 예정.
- **H4**: /vehicles/new에서 "다음" 클릭 시 step1으로 정상 이동. → 로그로 확인 예정.
- **H5**: 차량목록 사이드 "정산" 클릭 시 href가 /settlements. → 로그로 확인 예정.

---

## 6. 적용 완료 (2026-02-09)

1. **매물등록 진입** 적용:  
   LandingPage, VehicleListPage, DashboardPage, VehicleRegisterEntryPage에서  
   `onRegisterListing` 제거. 헤더 "매물등록하기" 클릭 시 **무조건 /vehicles/new**(§3.5_1418-20498_차량등록_비대면_랜딩) 진입.  
   랜딩 히어로 "지금 시작하기"도 `navigate('/vehicles/new')`로 통일.

2. **차량목록 사이드 "정산"** 적용:  
   MainLandingSidebar "정산" href를 **/vehicles?filter=settlement** 로 변경.  
   로그 검증: `"href":"/vehicles?filter=settlement"` (debug.log).

3. **사이드 라벨**:  
   추후 사이트맵과 맞추어 "검차(필터)" 등 라벨 정리 가능.
