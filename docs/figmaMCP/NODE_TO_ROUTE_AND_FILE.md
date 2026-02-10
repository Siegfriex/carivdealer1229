# nodeId ↔ 라우트 ↔ 페이지 컴포넌트 ↔ FIGMASCR0208 경로 매핑

**목적**: 한 노드로 "어느 라우트·어느 페이지·어느 스크린샷 파일"인지 바로 찾기.

**데이터 소스**: [docs/figma/FSD_SPEC_BLUEPRINT.md](../figma/FSD_SPEC_BLUEPRINT.md), [FIGMASCR0208/IA_NODEID_TO_FILENAME.md](../../FIGMASCR0208/IA_NODEID_TO_FILENAME.md), [FIGMASCR0208/INDEX.md](../../FIGMASCR0208/INDEX.md), [src/app/router.tsx](../../src/app/router.tsx).

**Figma URL**: `https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id={nodeId}` (nodeId는 하이픈 형식 예: 1418-24679).

---

## 매핑 테이블 (대표 노드)

| nodeId (하이픈) | IA 화면 라벨 | 라우트 (path) | 페이지 컴포넌트 | FIGMASCR0208 폴더 | FIGMASCR0208 파일명(예시) |
|-----------------|---------------|---------------|-----------------|-------------------|---------------------------|
| 1368-37201 | 랜딩 Hero 중심 | `/` | LandingPage | 01_랜딩페이지 | §3.1_1368-37201_랜딩페이지_Hero중심.png |
| 1368-37364 | 랜딩 (로그인 후 동일 구조) | `/` | LandingPage | 01_랜딩페이지 | §3.1_1368-37364_랜딩페이지_동일구조.png |
| 1444-7928 | 랜딩 로그인 전 프로토타입 (Domestic Seller Hero) | `/` | LandingPage | 01_랜딩페이지 | (FIGMASCR0208 미등록, MCP 스크린샷 기준) |
| 1368-43715 | 랜딩 알림 노출 | `/` | LandingPage | 01_랜딩페이지 | §3.1_1368-43715_랜딩페이지_알림노출.png |
| 1425-8153 | 나의매물목록_회원가입유도 | `/vehicles` (비로그인) | VehicleListPage | 02_회원가입_이전_GNB | §3.7_1425-8153_나의매물목록_회원가입유도.png |
| 1425-8153 | 나의매물목록 전체 | `/vehicles` | VehicleListPage | 03_GNB_차량목록_탭 | §3.7_1425-8153_나의매물목록_전체.png |
| 1425-9445 | 검차요청내역_리스트 | `/inspections` | InspectionListPage | 04_GNB_검차_탭, 10_매물등록_CTA_2_검차 | §3.6_1425-9445_검차요청내역_리스트.png |
| 1033-4903 | 검차신청 Step1 (변형) | `/inspections/request`, `request/step1` | InspectionRequestLandingPage, InspectionRequestStep1Page | 10_매물등록_CTA_2_검차 | §3.6_1444-8198_검차신청_Step1_변형 1 |
| 1037-5126 | 검차요청내역 (동일페이지·상태1) | `/inspections` | InspectionListPage | 10_매물등록_CTA_2_검차 | §3.6_1425-9445_검차요청내역_리스트_변형 1 등 |
| 1037-5673 | 검차요청내역 (동일페이지·상태2) | `/inspections` | InspectionListPage | 10_매물등록_CTA_2_검차 | 리스팅 클릭 시 하단 매칭/완료/결과 중 1로 전환 |
| 1042-4681 | 검차요청내역 (동일페이지·상태3) | `/inspections` | InspectionListPage | 10_매물등록_CTA_2_검차 | 리스팅 클릭 시 하단 매칭/완료/결과 중 1로 전환 |
| 1425-7280 | 로그인 | `/login` | LoginPage | 08_회원가입 | §3.2_1425-7280_로그인.png |
| 1425-7613 | 회원가입 진입 | `/signup` | SignupEntryPage | 08_회원가입 | §3.2_1425-7613_회원가입진입.png |
| 1513-12032 | 회원가입 Step1 | `/signup/step1` | SignupStep1Page | 08_회원가입 | §3.2_1513-12032_회원가입_Step1_ref.png |
| 1425-7309 | 회원가입 Step2 | `/signup/step2` | SignupStep2Page | 08_회원가입 | §3.2_1425-7309_회원가입_Step2.png |
| 1425-7496 | 승인 대기 | `/signup/pending` | SignupPendingPage | 08_회원가입 | §3.2_1425-7496_승인대기.png |
| 1418-20498 | 차량등록 비대면 랜딩 | `/vehicles/new` | VehicleRegisterEntryPage | 09_매물등록_CTA_1_차량원부등록 | §3.5_1418-20498_차량등록_비대면_랜딩.png |
| 1425-7638 | 매물등록버튼 클릭 시 첫화면 (CTA_1 진입) | `/vehicles/new` | VehicleRegisterEntryPage | 09_매물등록_CTA_1_차량원부등록 | §3.5_1418-20498_차량등록_비대면_랜딩 1 |
| 1418-20498 | 차량등록 원부등록 | `/vehicles/new/step1`, `step2` | VehicleRegisterStep1Page, Step2Page | 09_매물등록_CTA_1_차량원부등록 | §3.5_1418-20498_차량등록_원부등록-2.png |
| 1425-7684 | 차량 원부등록 (2단계 화면) | `/vehicles/new/step1` | VehicleRegisterStep1Page | 09_매물등록_CTA_1_차량원부등록 | §3.5_1418-20498_차량등록_원부등록-2 1 |
| 1418-20576 | 차량등록완료 확인 | `/vehicles/:vehicleId/complete` | VehicleRegistrationCompletePage | 09_매물등록_CTA_1_차량원부등록 | §3.5_1418-20576_차량등록완료_확인.png |
| 1444-8198 | 검차신청 Step1 | `/inspections/request`, `request/step1` | InspectionRequestLandingPage, Step1Page | 10_매물등록_CTA_2_검차 | §3.6_1444-8198_검차신청_Step1_변형.png |
| 1425-10137 | 검차진행 매칭중 (검차자 매칭중) | `/inspections/:id/progress?stage=matching` | InspectionProgressPage | 10_매물등록_CTA_2_검차 | §3.6_1425-10137_검차진행_매칭중 1·변형 1 |
| 1425-10813 | 검차진행 완료 (검차자 이동중) | `/inspections/:id/progress?stage=en_route` | InspectionProgressPage | 10_매물등록_CTA_2_검차 | §3.6_1425-10813_검차진행_완료 1 |
| 1425-10285 | 검차결과요약 (검차완료! 내역 확인) | `/inspections/:id/complete` | InspectionCompletePage | 10_매물등록_CTA_2_검차 | §3.6_1425-10285_검차결과요약 1·변형 1 |
| 1121-5308 | 검차자 매칭중 (Figma 디자인) | `/inspections/:id/progress?stage=matching` | InspectionProgressPage | 10_매물등록_CTA_2_검차 | §3.6 검차진행_매칭중 |
| 1193-8343 | 검차자 이동중 (Figma 디자인·별도 스크롤 뷰) | `/inspections/:id/progress?stage=en_route` | InspectionProgressPage | 10_매물등록_CTA_2_검차 | §3.6 검차진행_이동중 |
| 1193-8120 | 검차완료! 내역을 확인하세요 | `/inspections/:id/complete` | InspectionCompletePage | 10_매물등록_CTA_2_검차 | §3.6 검차결과요약 |
| 1193-9217 | 검차내역 (검차 완료 시 상세·컨테이너 클릭 시 아래로 스크롤) | `/inspections/:id/complete` | InspectionCompletePage | 10_매물등록_CTA_2_검차 | §3.6 검차내역 |
| 1425-9661 | 검차내역 리스트 | `/inspections/history` | InspectionHistoryPage | 10_매물등록_CTA_2_검차 | §3.6 검차내역 리스트 |
| 1425-9875 | 검차내역 카드뷰 | `/inspections/history?view=card` | InspectionHistoryPage | 10_매물등록_CTA_2_검차 | §3.6_1425-9875_검차요청내역_카드뷰 1 |
| 1418-20498 | 판매방식선택 | `/vehicles/:id/sale/analyzing` | GeneralSaleAnalyzingPage | 11_매물등록_CTA_3_거래 | §3.5_1418-20498_판매방식선택.png |
| 1418-23705 | 경매 시작가 설정 | `/vehicles/:id/auction/start-price` | AuctionStartPricePage | 11_매물등록_CTA_3_거래 | §3.5_1418-23705_경매_시작가설정.png |
| 1418-24679 | 거래상세 | `/vehicles/:id/trade` | TradeDetailPage | 11_매물등록_CTA_3_거래 | §3.5_1418-24679_거래상세_변형-2.png |
| 1418-21690 | 거래상세 경매 | `/vehicles/:id/trade` | TradeDetailPage | 11_매물등록_CTA_3_거래 | §3.5_1418-21690_거래상세_경매.png |
| 1714-22332 | GNB 거래 탭 리스팅 (클릭 시 하단 상태 전환) | `/offers` | TradeListPage | 11_매물등록_CTA_3_거래 | §3.5 거래 리스팅 |
| 794-3704 | 판매방식선택 | `/vehicles/:id/sale/analyzing` | GeneralSaleAnalyzingPage | 11_매물등록_CTA_3_거래 | §3.5_1418-20498_판매방식선택 1 |
| 794-4015 | 시세분석중 (일반/경매 공통) | `/vehicles/:id/sale/analyzing` | GeneralSaleAnalyzingPage | 11_매물등록_CTA_3_거래 | §3.5_1418-20498_차량등록진입_시세분석중-1 1 |
| 794-4200 | 경매 시작가설정 보정 (일반) | `/vehicles/:id/sale/price` | GeneralSalePricePage | 11_매물등록_CTA_3_거래 | §3.5_1418-23705_경매_시작가설정_보정 1 |
| 794-4371 | 경매 시작가설정 보정-1 (일반) | `/vehicles/:id/sale/price` | GeneralSalePricePage | 11_매물등록_CTA_3_거래 | §3.5_1418-23705_경매_시작가설정_보정-1 1 |
| 794-4107 | 판매전환완료 (일반) | `/vehicles/:id/sale/complete` | GeneralSaleCompletePage | 11_매물등록_CTA_3_거래 | §3.5_1418-20576_판매전환완료-1 1 |
| 794-4708 | 거래상세 변형 (컨테이너 클릭 시 아래 펼침) | `/vehicles/:id/trade` | TradeDetailPage | 11_매물등록_CTA_3_거래 | §3.5_1418-24679_거래상세_변형 1 |
| 794-4542 | 거래상세 경매 (펼쳐지는 뷰) | `/vehicles/:id/trade` | TradeDetailPage | 11_매물등록_CTA_3_거래 | §3.5_1418-21690_거래상세_경매 1 |
| 1302-27289 | 검차 상세내역 모달 (컨테이너 내 버튼 클릭) | TradeDetailPage 모달 | TradeDetailPage | 11_매물등록_CTA_3_거래 | 검차 상세내역 팝업 |
| 1123-13580 | 경매 시작가설정 (경매 방식) | `/vehicles/:id/auction/start-price` | AuctionStartPricePage | 11_매물등록_CTA_3_거래 | §3.5_1418-23705_경매_시작가설정 1 |
| 1123-20023 | 경매시작가 값입력·연월일시 | `/vehicles/:id/auction/duration` | AuctionDurationPage | 11_매물등록_CTA_3_거래 | §3.5_1418-23880_경매시작가_값입력 1 |
| 1123-20699 | 경매 연월일시 입력 | `/vehicles/:id/auction/duration` | AuctionDurationPage | 11_매물등록_CTA_3_거래 | §3.5 경매 일시 |
| 1123-13763 | 경매 모두 입력 완료 화면 | `/vehicles/:id/auction/duration` | AuctionDurationPage | 11_매물등록_CTA_3_거래 | §3.5 경매 입력 완료 |
| 1123-13487 | 판매전환완료 (경매) | `/vehicles/:id/auction/complete` | AuctionCompletePage | 11_매물등록_CTA_3_거래 | §3.5_1418-20576_판매전환완료-1 1 |
| 1123-14112 | 거래상세 경매-1 (컨테이너 클릭 시 아래 펼침) | `/vehicles/:id/trade` | TradeDetailPage | 11_매물등록_CTA_3_거래 | §3.5_1418-21690_거래상세_경매-1 1 |
| 1123-13946 | 거래상세 경매 펼쳐지는 뷰 | `/vehicles/:id/trade` | TradeDetailPage | 11_매물등록_CTA_3_거래 | §3.5 거래상세 경매 펼침 |
| 1302-27093 | 판매방식 변경 및 판매가 수정 컨테이너 | `/vehicles/:id/trade` | TradeDetailPage | 11_매물등록_CTA_3_거래 | §3.5 판매방식 변경·판매가 수정 |
| 1418-22630 | 판매/거래 목록 | `/logistics/schedule` 등 | LogisticsSchedulePage | 12_매물등록_CTA_4_탁송 | §3.5_1418-22630_판매_거래목록_목록뷰-1.png |
| 1714-22874 | GNB 탁송 탭 (전용 페이지·차량목록 탭과 별도) | `/logistics/schedule` | LogisticsSchedulePage | 12_매물등록_CTA_4_탁송 | §3.5 GNB 탁송 |
| 1362-36169 | 차량목록 탭에서 탁송단계 필터 스크린 (별도 페이지) | `/vehicles?stage=logistics` | VehicleListPage | 03_GNB_차량목록_탭 | §3.5 차량목록_탁송단계 필터 |
| 1272-12926 | 판매/거래목록→탁송 해당 페이지 (본격 탁송·리스트 클릭 시 하단 상태 전환) | `/logistics/schedule` | LogisticsSchedulePage | 12_매물등록_CTA_4_탁송 | §3.5_1418-22630_판매_거래목록_목록뷰-1 2 |
| 1272-13294 | 새 탁송예약 폼 | `/logistics/schedule` (새 예약 플로우) | LogisticsSchedulePage | 12_매물등록_CTA_4_탁송 | §3.10_1418-25400_새탁송예약_폼 1 |
| 1272-14540 | 주소검색 모달·주소결과 (우편번호 버튼→모달·텍스트 입력) | LogisticsSchedulePage 모달 | LogisticsSchedulePage | 12_매물등록_CTA_4_탁송 | §3.10_1418-26827·27070_주소검색·주소결과 1 |
| 1272-13503 | 새탁송예약 연도 캘린더 (날짜 클릭 시) | LogisticsSchedulePage 내 | LogisticsSchedulePage | 12_매물등록_CTA_4_탁송 | §3.10_1418-25400_폼-1 1 |
| 1272-13819 | 새탁송예약 월 선택 (3*4 그리드) | LogisticsSchedulePage 내 | LogisticsSchedulePage | 12_매물등록_CTA_4_탁송 | §3.10_1418-26325_월선택 1 |
| 1272-14309 | 새탁송예약 시간 선택 (일) | LogisticsSchedulePage 내 | LogisticsSchedulePage | 12_매물등록_CTA_4_탁송 | §3.10_1418-26583_시간선택 1 |
| 1272-15049 | 탁송 기사배정 진행중 | `/logistics/schedule` 또는 상세 | LogisticsSchedulePage | 12_매물등록_CTA_4_탁송 | §3.10_1418-25219_기사배정_진행중 1 |
| 1272-13099 | 탁송완료 (탁송목록 돌아가기 / 정산단계 진행 분기·정산은 인계확정 시만) | `/logistics/schedule` 또는 완료 뷰 | LogisticsSchedulePage | 12_매물등록_CTA_4_탁송 | §3.10 탁송완료 |
| 1418-25400 | 새탁송예약 폼 | `/logistics/schedule` | LogisticsSchedulePage | 12_매물등록_CTA_4_탁송 | §3.10_1418-25400_새탁송예약_폼.png |
| 1418-27434 | 정산현황 검차피드백 | `/settlements`, `/sales/history` | SettlementListPage, SalesHistoryPage | 13_매물등록_CTA_5_정산 | §3.11_1418-27434_정산현황_검차피드백.png |
| 1418-36405 | 정산 목록 | `/settlements` | SettlementListPage | 13_매물등록_CTA_5_정산 | §3.11_1418-36405_정산목록_정산필터카드뷰.png |
| 1418-36766 | 내 프로필 | `/mypage/settlement-account` | SettlementAccountPage | 14_마이페이지 | §3.8_1418-36766_내프로필.png |
| 1418-37804 | 기본정보수정 | (마이페이지 내) | (마이페이지 서브) | 14_마이페이지 | §3.8_1418-37804_기본정보수정.png |
| 1418-37298 | 알림센터 | (마이페이지 내) | (마이페이지 서브) | 14_마이페이지 | §3.8_1418-37298_알림센터.png |

---

## FIGMASCR0208 폴더 ↔ §3.x 대응

| 폴더 | §3 섹션 | 설명 |
|------|---------|------|
| 01_랜딩페이지 | §3.1 | 랜딩 |
| 02_회원가입_이전_GNB | §3.7 | 나의매물목록 회원가입유도 |
| 03_GNB_차량목록_탭 | §3.7 | 차량목록 필터별 뷰 |
| 04_GNB_검차_탭 | §3.6 | 검차요청내역 |
| 08_회원가입 | §3.2 | 로그인·회원가입·승인대기 |
| 09_매물등록_CTA_1_차량원부등록 | §3.5 | 차량등록·원부등록·완료 |
| 10_매물등록_CTA_2_검차 | §3.6 | 검차신청·진행·결과요약 |
| 11_매물등록_CTA_3_거래 | §3.5 | 판매방식·경매·거래상세 |
| 12_매물등록_CTA_4_탁송 | §3.5, §3.10 | 거래목록·탁송예약 |
| 13_매물등록_CTA_5_정산 | §3.11 | 정산현황·정산목록 |
| 14_마이페이지 | §3.8 | 내프로필·사이드바 페이지 |

---

## 파일명 패턴

- **형식**: `§3.{섹션}_{nodeId하이픈}_{IA페이지명_요약}.png`
- **변형**: 동일 노드에 대해 `-1`, `-2`, `_변형` 등 접미사가 붙은 파일이 있을 수 있음. 해당 폴더 내에서 nodeId로 검색하면 됨.
- **전체 nodeId 목록**: [FIGMASCR0208/IA_NODEID_TO_FILENAME.md](../../FIGMASCR0208/IA_NODEID_TO_FILENAME.md) 참고.

---

*문서 버전: 1.0 | 최종 업데이트: 2025-02-10*
