# NEO GOD 통합 명세서 테이블 (Integrated Specification Table)

**목적**: 유저플로우 단계별 스크린·기능·ERD·API 매핑. NEO GOD 헌법 준수.  
**참조**: [archive/FIGMA_SCR_ROUTE_MAP.md](archive/FIGMA_SCR_ROUTE_MAP.md)(SCR-xxxx), [archive/FIRESTORE_SCHEMA.md](archive/FIRESTORE_SCHEMA.md), [archive/API_SPECIFICATION_v2.md](archive/API_SPECIFICATION_v2.md), functions export 경로.

---

## 공개·인증

| Flow ID | 스크린 명세 (Screen) | 기능 명세 (Function) | 관련 ERD 필드 (Data) | 관련 API (Endpoint) |
|---------|----------------------|----------------------|----------------------|---------------------|
| SCR-0000 | 랜딩 페이지. 목적: 진입·CTA 노출 | 로그인/회원가입/비밀번호찾기 클릭 | — | — |
| SCR-0001 | 로그인. 경로: /login. 목적: 인증 입력 | 이메일·비밀번호 입력, 제출 | members (향후) | (인증 미구현) |
| STEP_SIGNUP_ENTRY | 회원가입 진입. 경로: /signup | 다음 단계 이동 | — | — |
| SCR-0002-2 | 회원가입 step1~4. 경로: /signup/step1~4 | 사업자·서류·정산·약관 입력 | members.* (향후) | (회원가입 API 경로 확인 필요) |
| SCR-0003 | 사업자 인증. 경로: /signup/step3 | 사업자등록증 이미지 업로드, 제출 | — | POST /verifyBusinessAPI |
| SCR-0003-1 | 승인 대기. 경로: /signup/pending | 대기 안내 확인 | — | — |
| SCR-0003-2 | 승인 완료. 경로: /signup/complete | 완료 확인, 대시보드 이동 | — | — |
| STEP_FORGOT | 비밀번호 찾기. 경로: /forgot-password | 이메일 입력, 재설정 요청 | — | (미구현) |

---

## 어드민 허브·차량

| Flow ID | 스크린 명세 (Screen) | 기능 명세 (Function) | 관련 ERD 필드 (Data) | 관련 API (Endpoint) |
|---------|----------------------|----------------------|----------------------|---------------------|
| SCR-0100 | 대시보드. 경로: /dashboard. 목적: 허브 | 탭(차량/검차/제안/탁송/판매/정산) 이동 | — | — |
| SCR-0101 | 차량 목록. 경로: /vehicles | 목록 조회, 필터, 행 클릭(상세) | vehicles.id, status, plateNumber, updatedAt | (Firestore 직접 또는 미사용) |
| SCR-0200 | 차량 등록 진입. 경로: /vehicles/new | 차량번호 입력, step1 이동 | — | — |
| STEP_VREG_1 | 차량 등록 step1. 경로: /vehicles/new/step1 | 등록원부 이미지 업로드, 기본정보 확인·수정 | vehicles.plateNumber, vin, manufacturer, model, mileage, ocrMetadata | POST /ocrRegistrationAPI, GET /getVehicleStatisticsAPI |
| STEP_VREG_2 | 차량 등록 step2. 경로: /vehicles/new/step2 | 판매방식(일반/경매)·추가정보 입력, 제출 | vehicles.status, price, auctionId | POST /changeSaleMethodAPI |
| STEP_VREG_COMPLETE | 차량 등록 완료. 경로: /vehicles/:vehicleId/complete | 완료 메시지 확인, 목록/상세 이동 | vehicles.id, status | — |
| SCR-0300 | 차량 상세. 경로: /vehicles/:vehicleId | 상세 조회, 일반판매/경매 선택 | vehicles.*, inspections, auctions | — |
| SCR-0301-N | 일반판매 분석중. 경로: /vehicles/:vehicleId/sale/analyzing | 분석 진행 표시, 완료 시 다음 | vehicles.offers, report | POST /generateReportAPI |
| SCR-0302-N | 일반판매 가격. 경로: /vehicles/:vehicleId/sale/price | 희망가·메모 입력, 제출 | vehicles.offers, report | POST /saveReportAPI |
| SCR-0303-N | 일반판매 완료. 경로: /vehicles/:vehicleId/sale/complete | 완료 메시지 확인 | vehicles.status | — |
| SCR-0400 | 경매 상세. 경로: /vehicles/:vehicleId/auction | 입찰/즉시구매 액션 | auctions.*, auction_bid | POST /bidAPI, POST /buyNowAPI |
| SCR-0401-A | 경매 시작가. 경로: /vehicles/:vehicleId/auction/start-price | 시작가 입력, 다음 | auctions.start_price | POST /changeSaleMethodAPI |
| SCR-0402-A | 경매 기간. 경로: /vehicles/:vehicleId/auction/duration | 기간(일) 입력, 제출 | auctions.endTime | POST /changeSaleMethodAPI |
| SCR-0403-A | 경매 완료. 경로: /vehicles/:vehicleId/auction/complete | 완료 메시지 확인 | auctions.id, status | — |

---

## 검차

| Flow ID | 스크린 명세 (Screen) | 기능 명세 (Function) | 관련 ERD 필드 (Data) | 관련 API (Endpoint) |
|---------|----------------------|----------------------|----------------------|---------------------|
| SCR-0201 | 검차 신청 랜딩. 경로: /inspections/request | 검색(차량/모델), 신청 시작 | vehicles.id, inspections | — |
| STEP_INSP_REQ_1 | 검차 신청 step1. 경로: /inspections/request/step1 | 검차 대상·일정 선택 | inspections.preferredDate, preferredTime | — |
| STEP_INSP_REQ_2 | 검차 신청 step2. 경로: /inspections/request/step2 | 정보 확인, 제출 | inspections.vehicleId, preferredDate, preferredTime | POST /inspectionRequestAPI |
| SCR-0201-Progress | 검차 진행. 경로: /inspections/:inspectionId/progress | 진행 상태 조회 | inspections.status, result | POST /inspectionGetResultAPI |
| SCR-0202 | 검차 완료·내역. 경로: /inspections/:inspectionId/complete, /inspections/history | 결과 조회, 목록 조회 | inspections.result, vehicleId | POST /inspectionGetResultAPI |

---

## 일반판매 제안·탁송·판매이력·정산

| Flow ID | 스크린 명세 (Screen) | 기능 명세 (Function) | 관련 ERD 필드 (Data) | 관련 API (Endpoint) |
|---------|----------------------|----------------------|----------------------|---------------------|
| SCR-0102 | 일반판매 제안 목록. 경로: /offers | 목록 조회, 수락/거절 버튼 | trades.proposals, vehicles.offers | POST /acceptProposalAPI |
| SCR-0600 | 탁송 일정. 경로: /logistics/schedule | 일정·주소 입력, 예약 제출 | logistics.schedule_date, address, vehicle_id | POST /logisticsScheduleAPI |
| SCR-0601 | 탁송 내역. 경로: /logistics/history | 내역 조회, PIN 입력(인계 승인) | logistics.status, handover_timestamp | POST /handoverApproveAPI |
| SCR-0103 | 판매 내역. 경로: /sales/history | 목록 조회, 필터 | trades.*, vehicles | (목록 조회·Mock 등) |
| SCR-0104 | 정산 목록. 경로: /settlements | 목록 조회, 행 클릭 | settlements.id, amount, status | — |
| SCR-0105 | 정산 상세. 경로: /settlements/:settlementId | 상세 금액·내역 조회 | settlements.* | POST /settlementNotifyAPI (알림 시) |

---

## API만 존재·화면 미구현

| Flow ID | 스크린 명세 (Screen) | 기능 명세 (Function) | 관련 ERD 필드 (Data) | 관련 API (Endpoint) |
|---------|----------------------|----------------------|----------------------|---------------------|
| — | (미구현) 주문 | 주문 생성·조회·상태 업데이트 | order.* | POST /createOrderAPI, GET /getOrderAPI, POST /updateOrderStatusAPI |
| — | (미구현) 결제 | 결제 생성·조회·환불 | payment.* | POST /createPaymentAPI, GET /getPaymentAPI, POST /refundPaymentAPI |
| — | (미구현) 주소 | 주소 CRUD | address.* | POST /createAddressAPI, GET /getAddressAPI, GET /listAddressesAPI, PATCH /updateAddressAPI, DELETE /deleteAddressAPI |
| — | (미구현) 리뷰 | 리뷰 생성·목록 | review.* | POST /createReviewAPI, GET /listReviewsAPI |
| — | (미구현) 판매자 서류 | 서류 업로드·승인·목록 | seller_docs.* | POST /uploadDocAPI, POST /approveDocAPI, GET /listDocsAPI |

---

## 비고

- **ERD 필드**: Firestore 컬렉션·필드 기준. [archive/DATABASE_ERD_SCHEMA.md](archive/DATABASE_ERD_SCHEMA.md) 21개 테이블과의 매핑은 관계도 참조.
- **API 경로**: 실제 배포 URL은 `https://asia-northeast3-carivdealer.cloudfunctions.net/{함수명}`. 위 테이블은 함수명만 기재.
- **인증**: 현재 프로토타입 인증 미적용. 로그인·회원가입 관련 API는 경로 통일 후 보강 예정.
