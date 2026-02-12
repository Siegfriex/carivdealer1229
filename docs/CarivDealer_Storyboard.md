# CarivDealer Storyboard & UI Specifications

**목적**: CarivDealer 도메인별 레이아웃·인터랙션·데이터 정책 정의. CarivDealer_IA·UserFlow 참조, FSD 구조 반영. **Interaction Rule** 기반 동작 스펙.

---

## §0 메타데이터·선언

| 항목 | 내용 |
|------|------|
| **버전** | 1.2 |
| **최종 검증** | 2026-02-12 |
| **스크린 수** | **41개** (router.tsx 기준) |
| **데이터 소스** | router.tsx, pages/*, shared/ui, widgets |
| **검증 방법** | read_file, grep (코드베이스 Fact) |
| **의존성** | [CarivDealer_IA.md](CarivDealer_IA.md), [CarivDealer_UserFlow.md](CarivDealer_UserFlow.md) |
| **FSD 구조** | app → pages → widgets → features → entities → shared |

---

## §1 Global UI Policy (공통 정책)

### 1.1 Layout System

| 항목 | 값 | 출처 |
|------|-----|------|
| **Base Width** | 1440px | design-tokens.css |
| **Container Max** | 1440px | `--container-max` |
| **Container Padding** | 24px | `--container-padding` |
| **GNB Height** | 64px | `--gnb-height`, LAYOUT.GNB_HEIGHT |
| **Sidebar Width** | 249px (GNB), 256px (일반) | `--sidebar-width`, LAYOUT.GNB_SIDEBAR_WIDTH |
| **Main Max (GNB 목록)** | 974px | LAYOUT_CLASSES.MAIN_GNB |

### 1.2 Breakpoints

| 구분 | 값 | 용도 |
|------|-----|------|
| **Desktop** | 700px 이상 | 앱 표시 |
| **Mobile Blocker** | 699px 이하 + 세로 모드 | `#mobile-blocker` 표시 |

### 1.3 Typography & Color System

| 역할 | 값 |
|------|-----|
| **Primary Font** | Pretendard |
| **Display Font** | SUITE Variable (차량번호·타이틀) |
| **H1** | 36px Medium |
| **H2** | 24px Medium |
| **H3** | 18px Bold |
| **Body** | 14px Regular |
| **Primary** | #2048E5 |
| **Accent** | #8A38F5 |

**상태 색상**: draft(gray), inspection(info), bidding(purple), active_sale(success), sold(orange), completed(teal)

### 1.4 Common Interaction — Interaction Rule

**코드**: `Toast.tsx`, `Modal.tsx`

#### 1.4.1 Toast (useToast)

| 항목 | 값 | 설명 |
|------|-----|------|
| **duration** | 3000ms | `setTimeout(..., 3000)` 후 자동 제거 |
| **중복 호출** | **Stack** | `setToasts(prev => [...prev, { id, message, type }])` — 새 토스트가 배열에 추가. 교체(Replace) 아님 |
| **수동 닫기** | X 버튼 클릭 | `removeToast(toast.id)` |
| **위치** | `fixed top-4 right-4` | z-index: Z_INDEX.TOAST(800) |
| **타입** | success, error, info, warning | 기본 info |

#### 1.4.2 Modal

| 항목 | 값 | 설명 |
|------|-----|------|
| **closeOnBackdropClick** | 기본 `true` | `closeOnBackdropClick?: boolean` — overlay 클릭 시 `onClose` 호출 |
| **ESC 키** | **지원** | `useEffect` 내 `keydown` 이벤트, `e.key === 'Escape'` 시 `onClose` |
| **body 스크롤** | 열림 시 `overflow: hidden` | 닫힐 때 `unset` |
| **size** | sm, md, lg, xl | max-w-md, max-w-lg, max-w-2xl, max-w-4xl |

#### 1.4.3 MessageModal

| 항목 | 값 |
|------|-----|
| **확인 클릭** | `onConfirm?.()` 호출 후 `onClose()` |
| **취소 클릭** | `onClose()` |
| **Modal 래핑** | `Modal` 기본 사용 (closeOnBackdropClick true, ESC 지원) |

---

## §2 Landing & Auth Domain

### 2.1 Landing Page

| 요소 | 설명 |
|------|------|
| **Hero** | LandingHero (비로그인), LandingHeroAuth (로그인 후) |
| **Feature** | LandingUserGuide, LandingFaq, LandingInquiry |
| **CTA** | 로그인·회원가입 버튼 (LoginModal 연동) |

**위젯**: LandingHeader, LandingHero, LandingHeroUnauth, LandingHeroAuth

### 2.2 Login / Signup Forms — Form Validation Rule

**코드**: `SignupStep5Page.tsx`, `useInspectionRequestStep1.ts`, `VehicleRegisterStep1Page.tsx`

| 페이지 | 검증 시점 | 에러 UI | 조건 |
|--------|----------|---------|------|
| **SignupStep5Page** | **onSubmit** (제출 시) | **Toast(error)** | `!agreeAge14 \|\| !agreeService \|\| !agreePrivacy` → "필수 약관에 모두 동의해주세요." |
| **InspectionRequestStep1Page** | **onSubmit** (다음 클릭 시) | **Toast(error)** | `!form.preferredDate \|\| !form.preferredTime \|\| !form.address` → "필수 항목을 입력해주세요." |
| **InspectionRequestStep2Page** | **onSubmit** | **Toast(error)** | 평가사 미선택 → "평가사를 선택해주세요." |
| **VehicleRegisterStep1Page** | **onSubmit** (OCR 전) | **Toast(error)** | 차량번호 미입력 → "차량번호를 입력해주세요." |
| **VehicleRegisterStep1Page** | **onSubmit** (OCR 실패) | **Toast(error)** | `catch` → "OCR 처리에 실패했습니다" |

**실시간(onChange) 검증**: 없음. **제출 시 검사(onSubmit)**만 사용.

**에러 UI**: `Input` 하단 인라인 없음. 전부 **Toast** (useFormFeedback → showToast).

---

## §3 Admin: Vehicle & Inspection Domain

### 3.1 차량 목록 (VehicleListPage) — List & Filter Specification

**코드**: `VehicleListPage.tsx`, `useVehicles.ts`, `MainLandingSidebar.tsx`

#### 3.1.1 필터 변경 시 데이터 소스

| 필터 | 데이터 소스 | 설명 |
|------|-------------|------|
| **LNB 사이드바** (전체·차량상태·판매거래·탁송·정산) | **API 재호출** | `filterTab` → `statusFilter` → `useVehicles({ status: statusFilter })`. queryKey `['vehicles', ownerId, status]` 변경 시 새 쿼리 |
| **탭** (전체·임시저장·등록완료) | **API 재호출** | 동일 |
| **검색** (차량번호/모델명) | **클라이언트 필터링** | `useMemo` filteredVehicles: `vehicles.filter(plateNumber|modelName|manufacturer.includes(q))` |
| **확인 필요차량** | **클라이언트 필터링** | `useMemo` attentionFilteredVehicles: status가 draft|inspection인 것만 |

#### 3.1.2 검색 Debounce

| 항목 | 값 |
|------|-----|
| **debounce** | **미적용** | `onSearchChange` → `updateSearchTerm` → `setSearchParams` 즉시 호출 |
| **검색 입력** | `onChange={(e) => onSearchChange?.(e.target.value)}` | 키 입력마다 URL 업데이트 |

#### 3.1.3 페이지네이션

| 항목 | 값 |
|------|-----|
| **PAGE_SIZE** | 9 |
| **데이터** | `attentionFilteredVehicles.slice(start, start + PAGE_SIZE)` | 클라이언트 slice |
| **Pagination** | `currentPage`, `totalPages`, `onPageChange` | `setCurrentPage` |

### 3.2 차량 상세 (VehicleDetailPage)

- **routeManager**: `getVehicleDetailRoute(vehicleId, status)`로 상태별 상세 페이지 이동
- **정보 노출**: VehicleInfoPanel 등

### 3.3 차량 등록 (VehicleRegisterStep1Page, Step2Page)

- **Step1**: ocrRegistration (vehicle-registration feature), 등록원부 OCR
- **MessageModal**: 확인·에러 메시지

### 3.4 검수 (Inspection)

| 화면 | 규칙 |
|------|------|
| **검차 요청** | InspectionRequestLandingPage, Step1, Step2 (ProgressSidebar) |
| **검차 진행** | InspectionProgressPage, `?stage=matching`, `?stage=en_route` |
| **검차 완료** | InspectionCompletePage, InspectionDetailModal |

---

## §4 Admin: Trade & Auction Domain

### 4.1 경매 리스트 (AuctionDetailPage)

- **카운트다운**: 고정 "26:13:02" (하드코딩)
- **입찰**: auction/place-bid feature (UI 미연결)

### 4.2 입찰 컨트롤러

- **금액 입력**: 최소 단위·유효성 검증 (미구현)
- **버튼**: 활성/비활성 조건 (미구현)

### 4.3 거래상세 (TradeDetailPage) — Modal Data Binding

**코드**: `InspectionDetailModal.tsx`, `TradeDetailCard`, `FeedbackBlock`

#### 4.3.1 InspectionDetailModal — Interaction Rule

| 항목 | 값 | 설명 |
|------|-----|------|
| **Props** | `isOpen`, `onClose` **만** | `inspectionId` 없음, 전체 객체 없음 |
| **데이터 소스** | **하드코딩** | `PHOTO_ITEMS`, `VIDEO_ITEMS` 상수. API 호출 없음 |
| **useQuery** | **미사용** | 모달 내부에서 API fetch 없음 |
| **Trigger** | `onInspectionDetail` 콜백 | TradeDetailCard·FeedbackBlock "검차 상세내용 확인" 클릭 → `setInspectionDetailOpen(true)` |
| **Callback** | `onClose` | `setInspectionDetailOpen(false)`. 닫을 때 추가 동작 없음 |

**호출부**: TradeDetailPage, AuctionDetailPage, GeneralSalePricePage, AuctionStartPricePage, InspectionCompletePage — 모두 `isOpen`, `onClose`만 전달.

### 4.4 판매방식선택 (GeneralSaleAnalyzingPage)

- **SaleMethodCards**: 일반판매·경매 카드
- **ProgressSidebar**: 플로우 단계 표시

---

## §5 Admin: Logistics & Settlement Domain

### 5.1 탁송 (LogisticsSchedulePage, LogisticsHistoryPage)

| 항목 | 규칙 |
|------|------|
| **Toast** | `showToast('날짜와 시간을 선택해주세요.', 'warning')`, `showToast('탁송 예약에 실패했습니다.', 'error')` |
| **주소 검색 모달** | `addressModalOpen`, 514×640 |
| **PIN 모달** | LogisticsHistoryPage: 인계 승인 시 6자리 PIN 입력 |

### 5.2 정산 (SettlementListPage, SettlementDetailPage, SalesHistoryPage)

- **계좌 관리**: SettlementAccountPage (`/mypage/settlement-account`)

---

## §6 노드 인덱스 & Modal Interaction Rule

### 6.1 Modal 호출부별 Props

| 모달 | Trigger | Props | Callback(onClose) |
|------|---------|-------|-------------------|
| **InspectionDetailModal** | "검차 상세내용 확인" 클릭 | isOpen, onClose | setState(false) |
| **MessageModal** (삭제) | `onDelete` | isOpen, onClose, onConfirm, title, message | setState(false) |
| **MessageModal** (판매방식 변경) | `onSaleMethodChange` | onConfirm → navigate(sale/analyzing) | setState(false) |
| **Modal** (판매방식 변경 불가) | `changeNotAllowedModalOpen` | title, onClose | setState(false) |

### 6.2 노드 인덱스 (사용 페이지·사용 영역)

FSD_IA_NODEID_SSOT §4 기반. (43개)

| nodeId | IA 라벨 | 사용 페이지 | 사용 영역 |
|--------|---------|-------------|-----------|
| 1033-4903 | 검차 신청 Step1 | InspectionRequestStep1Page | 메인 컨텐츠·ProgressSidebar |
| 1037-5126 | 검차요청내역 리스트 | InspectionListPage | 메인 컨텐츠 |
| 1037-5673 | 검차요청내역 선택 카드+상세 | InspectionListPage | 메인 컨텐츠 |
| 1042-4681 | 검차요청내역 헤더+카드 | InspectionListPage | 메인 컨텐츠 |
| 1121-5308 | 검차자 매칭중 | InspectionProgressPage | 메인 컨텐츠·InspectionScheduleBlock (?stage=matching) |
| 1123-13487 | 판매전환완료 (경매) | AuctionCompletePage | 메인 컨텐츠 |
| 1123-13580 | 경매 사전 설정 | AuctionStartPricePage | 메인 컨텐츠·VehicleInfoPanel |
| 1123-13763 | 경매 기간/연월일시 입력완료 | AuctionDurationPage | 메인 컨텐츠 |
| 1123-13946 | 거래상세 경매 펼쳐지는 뷰 | TradeDetailPage | 메인 컨텐츠·TradeDetailCard |
| 1123-14112 | 거래상세 경매-1 (컨테이너 펼침) | TradeDetailPage | 메인 컨텐츠 |
| 1123-20023 | 경매 기간/연월일시 | AuctionDurationPage | 메인 컨텐츠 |
| 1123-20699 | 경매 연월일시 입력 | AuctionDurationPage | 메인 컨텐츠 |
| 1193-8120 | 검차완료! 내역 확인 | InspectionCompletePage | 메인 컨텐츠 |
| 1193-8343 | 검차자 이동중 | InspectionProgressPage | 메인 컨텐츠 (?stage=en_route) |
| 1193-9217 | 검차내역 (검차완료 시 상세) | InspectionCompletePage | 메인 컨텐츠·Carousel |
| 1272-12926 | 판매/거래목록→탁송 리스트 | LogisticsSchedulePage | 메인 컨텐츠 |
| 1272-13099 | 탁송완료 | LogisticsSchedulePage | 메인 컨텐츠 |
| 1272-13294 | 새 탁송예약 폼 | LogisticsSchedulePage | 메인 컨텐츠 |
| 1272-13503 | 새탁송예약 연도 캘린더 | LogisticsSchedulePage | 메인 컨텐츠 |
| 1272-13819 | 새탁송예약 월 선택 | LogisticsSchedulePage | 메인 컨텐츠 |
| 1272-14309 | 새탁송예약 시간 선택 | LogisticsSchedulePage | 메인 컨텐츠 |
| 1272-14540 | 주소검색 모달·주소결과 | LogisticsSchedulePage | 모달·주소검색 |
| 1272-15049 | 탁송 기사배정 진행중 | LogisticsSchedulePage | 메인 컨텐츠 |
| 1302-27093 | 판매방식 변경·판매가 수정 | TradeDetailPage | 메인 컨텐츠·TradeDetailCard |
| 1302-27289 | 검차 상세내역 모달 | TradeDetailPage, AuctionDetailPage, GeneralSalePricePage, AuctionStartPricePage, InspectionCompletePage | 모달·InspectionDetailModal |
| 1362-36169 | 차량목록 탭 탁송단계 필터 | VehicleListPage | 사이드바·MainLandingSidebar (?stage=logistics) |
| 1368-37364 | 랜딩 (로그인 후 동일 구조) | LandingPage | 메인 컨텐츠·LandingHeroAuth |
| 1425-10137 | 검차진행 매칭중 | InspectionProgressPage | 메인 컨텐츠 (?stage=matching) |
| 1425-10285 | 검차결과요약 | InspectionCompletePage | 메인 컨텐츠 |
| 1425-10813 | 검차진행 완료 (이동중) | InspectionProgressPage | 메인 컨텐츠 (?stage=en_route) |
| 1425-7638 | 매물등록버튼 클릭 시 첫화면 | VehicleRegisterEntryPage | 메인 컨텐츠 |
| 1425-7684 | 차량 원부등록 (2단계) | VehicleRegisterStep1Page | 메인 컨텐츠 |
| 1425-8153 | 나의매물목록_회원가입유도/전체 | VehicleListPage | 메인 컨텐츠·MainLandingSidebar + VehicleListCard |
| 1444-7928 | 랜딩 로그인 전 프로토타입 | LandingPage | 메인 컨텐츠·LandingHeroUnauth |
| 1636-10115 | 전체 차량목록 그리드 (VehicleCard) | VehicleListPage | 메인 컨텐츠·VehicleListTableWithExpand |
| 1714-22332 | GNB 거래 탭 리스팅 | TradeListPage | 메인 컨텐츠 |
| 1714-22874 | GNB 탁송 탭 | LogisticsSchedulePage | 메인 컨텐츠 |
| 794-3704 | 판매방식선택 | GeneralSaleAnalyzingPage | 메인 컨텐츠·SaleMethodCards |
| 794-4015 | 시세분석중 (일반/경매 공통) | GeneralSaleAnalyzingPage | 메인 컨텐츠·로딩 상태 |
| 794-4107 | 판매전환완료 (일반) | GeneralSaleCompletePage | 메인 컨텐츠 |
| 794-4200 | 경매 시작가설정 보정 (일반) | GeneralSalePricePage | 메인 컨텐츠·VehicleInfoPanel |
| 794-4371 | 경매 시작가설정 보정-1 (일반) | GeneralSalePricePage | 메인 컨텐츠 |
| 794-4542 | 거래상세 경매 (펼쳐지는 뷰) | TradeDetailPage | 메인 컨텐츠 |
| 794-4708 | 거래상세 변형 (컨테이너 펼침) | TradeDetailPage | 메인 컨텐츠 |

**상세 코드 참조**: [FSD_IA_NODEID_SSOT.md](figma/FSD_IA_NODEID_SSOT.md) §4

---

## §7 Interaction Rule 요약 (개발자용)

| 컴포넌트 | Trigger | Data | Feedback |
|----------|---------|------|----------|
| **Toast** | showToast(msg, type) | message, type | 3초 후 자동 제거. Stack 방식. |
| **Modal** | isOpen=true | children | overlay 클릭·ESC → onClose |
| **MessageModal** | 확인 클릭 | onConfirm → onClose | onConfirm 선호출 후 닫기 |
| **InspectionDetailModal** | `onInspectionDetail` | 없음 (하드코딩) | Modal 동일 |
| **VehicleListPage** | filter 탭/LNB | useVehicles(status) | API 재호출 |
| **VehicleListPage** | 검색 입력 | useMemo filter | 클라이언트. debounce 없음 |
| **Form 검증** | onSubmit | — | Toast(error) |

---

## §8 스크린별 Interaction Rule (전체 41개)

**라우트·페이지**: `router.tsx` 기준. 각 스크린의 Toast·Modal·폼 검증·필터·검색 규칙을 코드 기반으로 정리.

### 8.1 목록 (라우트 → 페이지 → 주요 Interaction)

| # | 라우트 | 페이지 | Toast | Modal | 폼 검증 | 필터/검색/기타 |
|---|--------|--------|-------|-------|---------|----------------|
| 1 | `/` | LandingPage | — | LoginModal (LandingHeader) | — | openFaqIndex (아코디언) |
| 2 | `/login` | LoginPage | — | — | — | — |
| 3 | `/signup` | SignupEntryPage | — | — | — | — |
| 4 | `/signup/step1` | SignupStep1Page | — | — | — | — |
| 5 | `/signup/step2` | SignupStep2Page | — | — | — | — |
| 6 | `/signup/step3` | SignupStep3Page | — | — | — | — |
| 7 | `/signup/step4` | SignupStep4Page | — | — | — | — |
| 8 | `/signup/step5` | SignupStep5Page | **Toast(error)** | — | onSubmit | 약관 미동의 시 |
| 9 | `/signup/pending` | SignupPendingPage | — | — | — | — |
| 10 | `/signup/complete` | SignupCompletePage | — | — | — | — |
| 11 | `/forgot-password` | ForgotPasswordPage | — | — | — | — |
| 12 | `/dashboard` | DashboardPage | — | — | — | MainLandingSidebar |
| 13 | `/vehicles` | VehicleListPage | — | — | — | **API 재호출** (filter), **클라이언트** (검색), debounce 없음 |
| 14 | `/vehicles/new` | VehicleRegisterEntryPage | — | — | — | — |
| 15 | `/vehicles/new/step1` | VehicleRegisterStep1Page | **Toast(error)** | **MessageModal** (삭제확인) | onSubmit | 차량번호·OCR |
| 16 | `/vehicles/new/step2` | VehicleRegisterStep2Page | — | — | — | — |
| 17 | `/vehicles/:vehicleId/complete` | VehicleRegistrationCompletePage | — | — | — | — |
| 18 | `/vehicles/:vehicleId/sale/analyzing` | GeneralSaleAnalyzingPage | — | — | — | — |
| 19 | `/vehicles/:vehicleId/sale/price` | GeneralSalePricePage | — | InspectionDetailModal | — | — |
| 20 | `/vehicles/:vehicleId/sale/complete` | GeneralSaleCompletePage | — | — | — | — |
| 21 | `/vehicles/:vehicleId/auction` | AuctionDetailPage | — | MessageModal(삭제·판매방식), Modal(변경불가), InspectionDetailModal | — | — |
| 22 | `/vehicles/:vehicleId/auction/start-price` | AuctionStartPricePage | — | InspectionDetailModal | — | — |
| 23 | `/vehicles/:vehicleId/auction/duration` | AuctionDurationPage | — | — | — | — |
| 24 | `/vehicles/:vehicleId/auction/complete` | AuctionCompletePage | — | — | — | — |
| 25 | `/vehicles/:vehicleId/trade` | TradeDetailPage | — | MessageModal(삭제·판매방식), Modal(변경불가), InspectionDetailModal | — | — |
| 26 | `/vehicles/:vehicleId` | VehicleDetailPage | — | — | — | — |
| 27 | `/inspections` | InspectionListPage | — | — | — | **클라이언트** 필터·검색 (MOCK_INSPECTIONS), view list/card |
| 28 | `/inspections/request` | InspectionRequestLandingPage | — | — | — | — |
| 29 | `/inspections/request/step1` | InspectionRequestStep1Page | **Toast(error)** | — | onSubmit | preferredDate·Time·address |
| 30 | `/inspections/request/step2` | InspectionRequestStep2Page | **Toast(error)** | — | onSubmit | 평가사 미선택 |
| 31 | `/inspections/history` | InspectionHistoryPage | — | — | — | — |
| 32 | `/inspections/:id/progress` | InspectionProgressPage | — | — | — | ?stage=matching|en_route |
| 33 | `/inspections/:id/complete` | InspectionCompletePage | — | InspectionDetailModal | — | expandedPhoto·expandedVideo |
| 34 | `/offers` | TradeListPage | — | — | — | MainLandingSidebar |
| 35 | `/offers/proposals` | GeneralSaleOffersPage | **Toast(success/error)** | — | — | 수락·거절 호출 시 |
| 36 | `/logistics/schedule` | LogisticsSchedulePage | **Toast(warning/error)** | **주소검색 모달** (addressModalOpen) | — | 날짜·시간 선택 시 |
| 37 | `/logistics/history` | LogisticsHistoryPage | **Toast(warning/error)** | **PIN 모달** (showPinModal) | — | 인계 승인 시 6자리 |
| 38 | `/sales/history` | SalesHistoryPage | — | — | — | — |
| 39 | `/settlements` | SettlementListPage | — | — | — | filter(all|completed|pending), loadSettlements |
| 40 | `/settlements/:id` | SettlementDetailPage | — | — | — | — |
| 41 | `/mypage/settlement-account` | SettlementAccountPage | — | — | — | MypageSidebar |

### 8.2 모달별 스크린 매핑

| 모달 | 사용 스크린 | Trigger | Props |
|------|-------------|---------|-------|
| **LoginModal** | LandingPage (LandingHeader) | "로그인" 클릭 | isOpen, onClose, onSignupClick |
| **MessageModal** (삭제) | TradeDetailPage, AuctionDetailPage | onDelete | isOpen, onClose, onConfirm, title, message |
| **MessageModal** (판매방식 변경) | TradeDetailPage, AuctionDetailPage | onSaleMethodChange | onConfirm → navigate |
| **Modal** (판매방식 변경 불가) | TradeDetailPage, AuctionDetailPage | changeNotAllowedModalOpen | title, onClose |
| **InspectionDetailModal** | TradeDetailPage, AuctionDetailPage, GeneralSalePricePage, AuctionStartPricePage, InspectionCompletePage | onInspectionDetail | isOpen, onClose (데이터 없음) |
| **MessageModal** (삭제확인) | VehicleRegisterStep1Page | showDeleteConfirm | isOpen, onClose, onConfirm |
| **주소검색 모달** | LogisticsSchedulePage | "주소 입력" 클릭 | addressModalOpen, overlay 클릭·X 닫기 |
| **PIN 모달** | LogisticsHistoryPage | "인계 승인" 클릭 | showPinModal, 6자리 PIN 입력 |

### 8.3 Toast 사용 스크린

| 스크린 | 메시지 | 타입 | Trigger |
|--------|--------|------|---------|
| SignupStep5Page | "필수 약관에 모두 동의해주세요." | error | 제출 시 미동의 |
| VehicleRegisterStep1Page | "차량번호를 입력해주세요" | error | OCR 전 |
| VehicleRegisterStep1Page | "OCR 처리에 실패했습니다" | error | OCR catch |
| InspectionRequestStep1Page | "필수 항목을 입력해주세요." | error | 다음 클릭 시 |
| InspectionRequestStep2Page | "평가사를 선택해주세요." | error | 제출 시 |
| GeneralSaleOffersPage | "제안이 수락되었습니다." | success | 수락 성공 |
| GeneralSaleOffersPage | "제안 수락에 실패했습니다." | error | 수락 실패 |
| GeneralSaleOffersPage | "제안이 거절되었습니다." | success | 거절 성공 |
| GeneralSaleOffersPage | "제안 거절에 실패했습니다." | error | 거절 실패 |
| LogisticsSchedulePage | "날짜와 시간을 선택해주세요." | warning | 예약 시 미선택 |
| LogisticsSchedulePage | "탁송 예약에 실패했습니다." | error | 예약 실패 |
| LogisticsHistoryPage | "6자리 PIN을 입력해주세요." | warning | 인계 승인 시 미입력 |
| LogisticsHistoryPage | "인계 승인에 실패했습니다." | error | 승인 실패 |

### 8.4 필터·검색·페이지네이션 스크린

| 스크린 | 데이터 소스 | 필터 | 검색 | Debounce | 페이지네이션 |
|--------|-------------|------|------|----------|--------------|
| **VehicleListPage** | useVehicles(status) | API 재호출 | 클라이언트 useMemo | 없음 | slice(9) |
| **InspectionListPage** | MOCK_INSPECTIONS | 클라이언트 | 클라이언트 | 없음 | — |
| **SettlementListPage** | loadSettlements(filter) | filter 변경 시 재호출 | — | — | — |
| **TradeListPage** | — | MainLandingSidebar | — | — | — |

---

## §9 참조

- **IA**: [CarivDealer_IA.md](CarivDealer_IA.md)
- **UserFlow**: [CarivDealer_UserFlow.md](CarivDealer_UserFlow.md)
- **FSD nodeId**: [FSD_IA_NODEID_SSOT.md](figma/FSD_IA_NODEID_SSOT.md)
- **Design Tokens**: `src/shared/styles/design-tokens.css`, `src/shared/config/layout.ts`
- **라우트 정의**: `src/app/router.tsx`
