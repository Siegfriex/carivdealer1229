# API 명세서
## ForwardMax B2B 중고차 수출 플랫폼

**문서 버전**: 2.0  
**작성일**: 2025-01-XX  
**프로젝트**: ForwardMax (carivdealer)  
**작성자**: 개발팀  
**대상 독자**: 내부 이해관계자 (기획·디자인·개발, 특히 백엔드 개발자)

---

## 목차

1. [개요](#1-개요)
2. [엔드포인트 목록](#2-엔드포인트-목록)
3. [엔드포인트 상세 명세](#3-엔드포인트-상세-명세)
4. [Mock API](#4-mock-api)
5. [에러 처리](#5-에러-처리)
6. [부록](#6-부록)
    - [6.1 용어집](#61-용어집)
    - [6.2 요청/응답 스키마 상세](#62-요청응답-스키마-상세)
    - [6.3 구현 코드 참조](#63-구현-코드-참조)

---

## 1. 개요

### 1.1 API 기본 정보

- **기본 URL**: `https://asia-northeast3-carivdealer.cloudfunctions.net`
- **프로토콜**: HTTPS
- **인코딩**: UTF-8
- **데이터 형식**: JSON

### 1.2 인증 방식

**현재 상태**: 인증 미구현 (프로토타입 단계)

**계획**: Firebase Auth 토큰 기반 인증
```
Authorization: Bearer {firebase_auth_token}
```

### 1.3 공통 규칙

#### 요청 헤더
```
Content-Type: application/json
```

#### 응답 형식
- **성공**: HTTP 200 + JSON 본문
- **에러**: HTTP 4xx/5xx + JSON 에러 메시지

#### CORS
- 모든 엔드포인트에서 CORS 허용 (Firebase Functions v2 설정)

#### 리전
- 모든 Functions는 `asia-northeast3` 리전에 배포됨

---

## 2. 엔드포인트 목록

### 2.1 구현된 엔드포인트

| API 식별자 | 엔드포인트명 | HTTP 메서드 | 경로 | 상태 |
|--------|-------------|------------|------|------|
| API-0002 | 사업자 인증 API | POST | `/verifyBusinessAPI` | ✅ 구현됨 |
| API-0100 | 등록원부 OCR API | POST | `/ocrRegistrationAPI` | ✅ 구현됨 |
| API-0101 | 검차 신청 API | POST | `/inspectionRequestAPI` | ✅ 구현됨 |
| API-0200 | 경매 입찰 API | POST | `/bidAPI` | ✅ 구현됨 |
| API-0201 | 즉시구매 API | POST | `/buyNowAPI` | ✅ 구현됨 |
| API-0300 | 판매 방식 변경 API | POST | `/changeSaleMethodAPI` | ✅ 구현됨 |
| API-0400 | 주문 생성 API | POST | `/createOrderAPI` | ✅ 구현됨 |
| API-0401 | 주문 단건 조회 API | GET/POST | `/getOrderAPI` | ✅ 구현됨 |
| API-0402 | 주문 상태 업데이트 API | POST/PATCH | `/updateOrderStatusAPI` | ✅ 구현됨 |
| API-0500 | 결제 생성 API | POST | `/createPaymentAPI` | ✅ 구현됨 |
| API-0501 | 결제 단건 조회 API | GET/POST | `/getPaymentAPI` | ✅ 구현됨 |
| API-0502 | 결제 환불 API | POST | `/refundPaymentAPI` | ✅ 구현됨 |
| API-0700 | 주소 생성 API | POST | `/createAddressAPI` | ✅ 구현됨 |
| API-0701 | 주소 단건 조회 API | GET/POST | `/getAddressAPI` | ✅ 구현됨 |
| API-0702 | 주소 목록 조회 API | GET/POST | `/listAddressesAPI` | ✅ 구현됨 |
| API-0703 | 주소 수정 API | POST/PATCH | `/updateAddressAPI` | ✅ 구현됨 |
| API-0704 | 주소 삭제 API | POST/DELETE | `/deleteAddressAPI` | ✅ 구현됨 |
| API-0800 | 리뷰 생성 API | POST | `/createReviewAPI` | ✅ 구현됨 |
| API-0801 | 리뷰 목록 조회 API | GET/POST | `/listReviewsAPI` | ✅ 구현됨 |
| API-0900 | 판매자 서류 업로드 API | POST | `/uploadDocAPI` | ✅ 구현됨 |
| API-0901 | 판매자 서류 승인/거절 API | POST | `/approveDocAPI` | ✅ 구현됨 |
| API-0902 | 판매자 서류 목록 조회 API | GET/POST | `/listDocsAPI` | ✅ 구현됨 |

**참고**: API-0001 (딜러 회원가입)은 현재 Mock API로 구현되어 있으며, 향후 Firebase Functions로 구현 예정입니다.

### 2.2 Mock API (프로토타입)

| API 식별자 | 엔드포인트명 | HTTP 메서드 | 경로 | 상태 |
|--------|-------------|------------|------|------|
| - | 제안 수락/거절 | POST | Mock (프론트엔드) | 🔶 Mock |
| - | 구매 의사 확인 | POST | Mock (프론트엔드) | 🔶 Mock |
| - | 탁송 일정 조율 | POST | Mock (프론트엔드) | 🔶 Mock |
| - | 배차 요청 | POST | Mock (프론트엔드) | 🔶 Mock |
| - | 배차 확정 | POST | Mock (프론트엔드) | 🔶 Mock |
| - | 인계 승인 | POST | Mock (프론트엔드) | 🔶 Mock |
| - | 정산 완료 알림 | POST | Mock (프론트엔드) | 🔶 Mock |

---

## 3. 엔드포인트 상세 명세

### 3.1 API-0001: 딜러 회원가입

**엔드포인트**: `POST /api/v1/member/dealer/register`

**기능 설명**: 딜러 계정을 생성하고 기본 정보를 입력합니다.

**요청 헤더**:
```
Content-Type: application/json
```

**요청 본문**:
- `email`: 이메일 주소 (문자열, 필수)
- `password`: 비밀번호 (문자열, 필수)
- `dealer_name`: 딜러명 (문자열, 필수)
- `phone`: 전화번호 (문자열, 필수)
- `terms_agreed`: 약관 동의 여부 (불린, 필수)

**응답 본문** (200 OK):
- `success`: 성공 여부 (불린)
- `member_id`: 회원 식별자 (문자열)
- `message`: 메시지 (문자열)

**에러 응답**:
- `error`: 에러 메시지 (문자열)

**에러 코드**:
- `400`: 필수 파라미터 누락
- `405`: POST 메서드가 아님
- `500`: 서버 오류

**구현 상태**: Mock 응답 반환 (프로토타입 단계)

**향후 구현 계획**: Firebase Auth를 통한 회원가입 처리

상세 요청/응답 스키마는 부록 6.2를 참조하시기 바랍니다[^ref-schema-register].

[^ref-schema-register]: 부록 6.2: 요청/응답 스키마 상세 - 딜러 회원가입

---

### 3.2 API-0002: 사업자 인증

**엔드포인트**: `POST /verifyBusinessAPI`

**기능 설명**: 사업자등록증 이미지를 업로드하여 OCR 처리 및 진위 확인을 수행합니다.

**요청 헤더**:
```
Content-Type: multipart/form-data
```

**요청 본문** (FormData):
- `business_registration_image`: 이미지 파일

**응답 본문** (200 OK):
- `success`: 성공 여부 (불린)
- `verified`: 인증 완료 여부 (불린)
- `business_info`: 사업자 정보 객체
  - `companyName`: 회사명 (문자열)
  - `businessRegNo`: 사업자등록번호 (문자열)
  - `representativeName`: 대표자명 (문자열)
- `message`: 메시지 (문자열)

**에러 응답**:
- `error`: 에러 메시지 (문자열)

**에러 코드**:
- `400`: 파일이 제공되지 않음
- `405`: POST 메서드가 아님
- `500`: 서버 오류

**구현 상태**: Mock 응답 반환 (프로토타입 단계)

**요청 예제**:
```javascript
const formData = new FormData();
formData.append('business_registration_image', file);

const response = await fetch(
  'https://asia-northeast3-carivdealer.cloudfunctions.net/verifyBusinessAPI',
  {
    method: 'POST',
    body: formData,
  }
);
const data = await response.json();
```

**응답 예제**:
```json
{
  "success": true,
  "verified": true,
  "business_info": {
    "companyName": "Global Motors",
    "businessRegNo": "123-45-67890",
    "representativeName": "홍길동"
  },
  "message": "인증이 완료되었습니다."
}
```

상세 요청/응답 스키마는 부록 6.2를 참조하시기 바랍니다[^ref-schema-verify].

[^ref-schema-verify]: 부록 6.2: 요청/응답 스키마 상세 - 사업자 인증

---

### 3.3 API-0100: 등록원부 OCR

**엔드포인트**: `POST /ocrRegistrationAPI`

**기능 설명**: 차량번호를 입력받아 등록원부에서 차량 기본정보를 OCR로 추출합니다.

**요청 헤더**:
```
Content-Type: application/json
```

**요청 본문**:
- `car_no`: 차량번호 (문자열)

**응답 본문** (200 OK):
- `vin`: 차대번호(VIN) (문자열)
- `manufacturer`: 제조사 (문자열)
- `model`: 모델명 (문자열)
- `year`: 연식 (문자열)
- `mileage`: 주행거리 (문자열)

**에러 응답**:
- `error`: 에러 메시지 (문자열)

**에러 코드**:
- `400`: 차량번호가 제공되지 않음
- `405`: POST 메서드가 아님
- `500`: 서버 오류

**구현 상태**: Mock 응답 반환 (프로토타입 단계)

**요청 예제**:
```javascript
const response = await fetch(
  'https://asia-northeast3-carivdealer.cloudfunctions.net/ocrRegistrationAPI',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ car_no: '82가 1923' }),
  }
);
const data = await response.json();
```

**응답 예제**:
```json
{
  "vin": "KMHXX00XXXX000000",
  "manufacturer": "Hyundai",
  "model": "Porter II",
  "year": "2018",
  "mileage": "136000"
}
```

상세 요청/응답 스키마는 부록 6.2를 참조하시기 바랍니다[^ref-schema-ocr].

[^ref-schema-ocr]: 부록 6.2: 요청/응답 스키마 상세 - 등록원부 OCR

---

### 3.4 API-0101: 검차 신청

**엔드포인트**: `POST /inspectionRequestAPI`

**기능 설명**: 차량에 대한 검차 신청을 처리하고 Firestore에 검차 데이터를 저장합니다.

**요청 헤더**:
```
Content-Type: application/json
```

**요청 본문**:
- `vehicle_id`: 차량 식별자 (문자열)
- `preferred_date`: 희망 날짜 (문자열, YYYY-MM-DD 형식)
- `preferred_time`: 희망 시간 (문자열, HH:mm 형식)

**응답 본문** (200 OK):
- `success`: 성공 여부 (불린)
- `inspection_id`: 검차 식별자 (문자열)
- `message`: 메시지 (문자열)

**에러 응답**:
- `error`: 에러 메시지 (문자열)

**에러 코드**:
- `400`: 필수 파라미터 누락
- `405`: POST 메서드가 아님
- `500`: 서버 오류

**구현 상태**: ✅ Firebase Functions 구현됨

**데이터 저장**: Firestore의 검차 컬렉션에 저장
- 컬렉션: `inspections`
- 필드: 차량 식별자, 희망 날짜, 희망 시간, 상태(대기 중), 생성 일시

**요청 예제**:
```javascript
const response = await fetch(
  'https://asia-northeast3-carivdealer.cloudfunctions.net/inspectionRequestAPI',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vehicle_id: 'v-101',
      preferred_date: '2025-01-25',
      preferred_time: '14:00'
    }),
  }
);
const data = await response.json();
```

**응답 예제**:
```json
{
  "success": true,
  "inspection_id": "insp-1234567890",
  "message": "검차 신청이 완료되었습니다."
}
```

상세 요청/응답 스키마는 부록 6.2를 참조하시기 바랍니다[^ref-schema-inspection].

[^ref-schema-inspection]: 부록 6.2: 요청/응답 스키마 상세 - 검차 신청

---

### 3.5 API-0200: 경매 입찰

**엔드포인트**: `POST /bidAPI`

**기능 설명**: 경매에 입찰을 처리합니다. 동시성 제어를 위해 Firestore 트랜잭션을 사용합니다.

**요청 헤더**:
```
Content-Type: application/json
```

**요청 본문**:
- `auction_id`: 경매 식별자 (문자열)
- `bid_amount`: 입찰 금액 (숫자)

**응답 본문** (200 OK):
- `success`: 성공 여부 (불린)
- `message`: 메시지 (문자열)

**에러 응답**:
- `error`: 에러 메시지 (문자열)

**에러 코드**:
- `400`: 경매 식별자 또는 입찰 금액 누락
- `400`: 입찰 금액이 현재 최고가보다 낮음
- `404`: 경매를 찾을 수 없음
- `400`: 경매가 활성 상태가 아님
- `405`: POST 메서드가 아님
- `500`: 서버 오류

**구현 상태**: ✅ Firebase Functions 구현됨

**동시성 제어**: Firestore 트랜잭션 사용

**데이터 업데이트**: Firestore의 경매 컬렉션 업데이트
- 컬렉션: `auctions/{auctionId}`
- 필드: 현재 최고 입찰가, 업데이트 일시
- 참고: 최고가 업데이트는 화면에 비노출 (Blind Auction)

**요청 예제**:
```javascript
const response = await fetch(
  'https://asia-northeast3-carivdealer.cloudfunctions.net/bidAPI',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auction_id: 'auc-1234567890',
      bid_amount: 650000
    }),
  }
);
const data = await response.json();
```

**응답 예제**:
```json
{
  "success": true,
  "message": "입찰이 완료되었습니다."
}
```

상세 요청/응답 스키마는 부록 6.2를 참조하시기 바랍니다[^ref-schema-bid].

[^ref-schema-bid]: 부록 6.2: 요청/응답 스키마 상세 - 경매 입찰

---

### 3.6 API-0201: 즉시구매

**엔드포인트**: `POST /buyNowAPI`

**기능 설명**: 경매에서 즉시구매를 처리합니다. 원자성을 보장하기 위해 Firestore 트랜잭션을 사용합니다.

**요청 헤더**:
```
Content-Type: application/json
```

**요청 본문**:
- `auction_id`: 경매 식별자 (문자열)

**응답 본문** (200 OK):
- `success`: 성공 여부 (불린)
- `contract_id`: 계약 식별자 (문자열)
- `message`: 메시지 (문자열)

**에러 응답**:
- `error`: 에러 메시지 (문자열)

**에러 코드**:
- `400`: 경매 식별자 누락
- `404`: 경매를 찾을 수 없음
- `400`: 경매가 활성 상태가 아님
- `400`: 즉시구매가 설정되지 않음
- `405`: POST 메서드가 아님
- `500`: 서버 오류

**구현 상태**: ✅ Firebase Functions 구현됨

**원자성 보장**: Firestore 트랜잭션 사용

**데이터 업데이트**: 
- Firestore의 경매 컬렉션 업데이트
  - 컬렉션: `auctions/{auctionId}`
  - 필드: 상태(판매 완료), 현재 최고 입찰가, 종료 일시
- Firestore의 차량 컬렉션 업데이트
  - 컬렉션: `vehicles/{vehicleId}`
  - 필드: 상태(잠금), 업데이트 일시

**요청 예제**:
```javascript
const response = await fetch(
  'https://asia-northeast3-carivdealer.cloudfunctions.net/buyNowAPI',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      auction_id: 'auc-1234567890'
    }),
  }
);
const data = await response.json();
```

**응답 예제**:
```json
{
  "success": true,
  "contract_id": "contract-1234567890",
  "message": "즉시구매가 완료되었습니다."
}
```

상세 요청/응답 스키마는 부록 6.2를 참조하시기 바랍니다[^ref-schema-buynow].

[^ref-schema-buynow]: 부록 6.2: 요청/응답 스키마 상세 - 즉시구매

---

### 3.7 API-0300: 판매 방식 변경

**엔드포인트**: `POST /changeSaleMethodAPI`

**기능 설명**: 일반 판매에서 경매로 판매 방식을 변경하고 경매를 생성합니다.

**요청 헤더**:
```
Content-Type: application/json
```

**요청 본문**:
- `vehicle_id`: 차량 식별자 (문자열)
- `auction_settings`: 경매 설정 객체
  - `start_price`: 시작가 (숫자, 필수)
  - `buy_now_price`: 즉시구매가 (숫자, 선택)

**응답 본문** (200 OK):
- `success`: 성공 여부 (불린)
- `auction_id`: 경매 식별자 (문자열)

**에러 응답**:
- `error`: 에러 메시지 (문자열)

**에러 코드**:
- `400`: 차량 식별자 또는 경매 설정 누락
- `400`: 시작가 누락
- `404`: 차량을 찾을 수 없음
- `405`: POST 메서드가 아님
- `500`: 서버 오류

**구현 상태**: ✅ Firebase Functions 구현됨

**데이터 저장/업데이트**:
- Firestore의 경매 컬렉션에 새 문서 생성
  - 컬렉션: `auctions`
  - 필드: 차량 식별자, 시작가, 즉시구매가, 현재 최고 입찰가(null), 상태(활성), 생성 일시
- Firestore의 차량 컬렉션 업데이트
  - 컬렉션: `vehicles/{vehicleId}`
  - 필드: 상태(입찰 중), 경매 식별자, 업데이트 일시

**요청 예제**:
```javascript
const response = await fetch(
  'https://asia-northeast3-carivdealer.cloudfunctions.net/changeSaleMethodAPI',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      vehicle_id: 'v-101',
      auction_settings: {
        start_price: 500000,
        buy_now_price: 700000
      }
    }),
  }
);
const data = await response.json();
```

**응답 예제**:
```json
{
  "success": true,
  "auction_id": "auc-1234567890"
}
```

상세 요청/응답 스키마는 부록 6.2를 참조하시기 바랍니다[^ref-schema-changemethod].

[^ref-schema-changemethod]: 부록 6.2: 요청/응답 스키마 상세 - 판매 방식 변경

---

### 3.8 API-0400: 주문 생성

**엔드포인트**: `POST /createOrderAPI`

**기능 설명**: 주문을 생성합니다. Firestore `orders` 컬렉션에 문서를 추가합니다.

**요청 헤더**:
```
Content-Type: application/json
```

**요청 본문**:
- `listing_id`: 매물 식별자 (문자열, 필수)
- `buyer_id`: 구매자 사용자 ID (문자열, 필수)
- `seller_id`: 판매자 ID (문자열, 필수)
- `vehicle_id`: 차량 식별자 (문자열, 필수)
- `order_type`: 주문 유형 (문자열, 필수) — `AUCTION` | `GENERAL` | `BUY_NOW`
- `total_price`: 총 금액 (숫자, 필수)
- `platform_id`: 플랫폼 식별자 (문자열, 선택)

**응답 본문** (201 Created):
- `success`: 성공 여부 (불린)
- `order`: 주문 객체 (id, platform_id, listing_id, buyer_id, seller_id, vehicle_id, order_type, total_price, status, created_at, updated_at)

**에러 응답**:
- `error`: 에러 메시지 (문자열)

**에러 코드**:
- `400`: 필수 파라미터 누락 또는 order_type/total_price 형식 오류
- `405`: POST 메서드가 아님
- `500`: 서버 오류

**구현 상태**: ✅ Firebase Functions 구현됨

---

### 3.9 API-0401: 주문 단건 조회

**엔드포인트**: `GET /getOrderAPI?orderId={orderId}` 또는 `POST /getOrderAPI` (body: `{ "orderId": "..." }`)

**기능 설명**: orderId로 주문 단건을 조회합니다.

**요청**: 쿼리 파라미터 `orderId` 또는 본문 `orderId` (문자열, 필수)

**응답 본문** (200 OK):
- `success`: 성공 여부 (불린)
- `order`: 주문 객체

**에러 응답**:
- `error`: 에러 메시지 (문자열)

**에러 코드**:
- `400`: orderId 누락
- `404`: 주문을 찾을 수 없음
- `405`: GET/POST가 아님
- `500`: 서버 오류

**구현 상태**: ✅ Firebase Functions 구현됨

---

### 3.10 API-0402: 주문 상태 업데이트

**엔드포인트**: `POST /updateOrderStatusAPI` 또는 `PATCH /updateOrderStatusAPI`

**기능 설명**: 주문의 status만 업데이트합니다.

**요청 본문**:
- `order_id` 또는 `orderId`: 주문 식별자 (문자열, 필수)
- `status`: 상태 (문자열, 필수) — `PENDING` | `CONFIRMED` | `CANCELLED` | `COMPLETED`

**응답 본문** (200 OK):
- `success`: 성공 여부 (불린)
- `order`: 업데이트된 주문 객체

**에러 응답**:
- `error`: 에러 메시지 (문자열)

**에러 코드**:
- `400`: order_id/orderId 또는 status 누락, status 값 오류
- `404`: 주문을 찾을 수 없음
- `405`: POST/PATCH가 아님
- `500`: 서버 오류

**구현 상태**: ✅ Firebase Functions 구현됨

---

### 3.11 API-0500: 결제 생성

**엔드포인트**: `POST /createPaymentAPI`

**기능 설명**: order_id 기준으로 결제를 생성합니다. 해당 주문이 존재하는지 확인합니다.

**요청 본문**:
- `order_id`: 주문 식별자 (문자열, 필수)
- `amount`: 결제 금액 (숫자, 필수)
- `method`: 결제 수단 (문자열, 필수) — `CARD` | `BANK_TRANSFER` | `VIRTUAL_ACCOUNT` | `ESCROW`
- `platform_id`: 플랫폼 식별자 (문자열, 선택)
- `pg_provider`: PG사 (문자열, 선택)
- `pg_transaction_id`: PG 거래 ID (문자열, 선택)

**응답 본문** (201 Created):
- `success`: 성공 여부 (불린)
- `payment`: 결제 객체 (id, order_id, amount, method, status, pg_provider, pg_transaction_id, paid_at, refunded_at, created_at, updated_at)

**에러 응답**:
- `error`: 에러 메시지 (문자열)

**에러 코드**:
- `400`: 필수 파라미터 누락 또는 method/amount 형식 오류
- `404`: 주문을 찾을 수 없음
- `405`: POST 메서드가 아님
- `500`: 서버 오류

**구현 상태**: ✅ Firebase Functions 구현됨

---

### 3.12 API-0501: 결제 단건 조회

**엔드포인트**: `GET /getPaymentAPI?paymentId={paymentId}` 또는 `POST /getPaymentAPI` (body: `{ "paymentId": "..." }`)

**기능 설명**: paymentId로 결제 단건을 조회합니다.

**요청**: 쿼리 파라미터 `paymentId` 또는 본문 `paymentId` (문자열, 필수)

**응답 본문** (200 OK):
- `success`: 성공 여부 (불린)
- `payment`: 결제 객체

**에러 응답**:
- `error`: 에러 메시지 (문자열)

**에러 코드**:
- `400`: paymentId 누락
- `404`: 결제를 찾을 수 없음
- `405`: GET/POST가 아님
- `500`: 서버 오류

**구현 상태**: ✅ Firebase Functions 구현됨

---

### 3.13 API-0502: 결제 환불

**엔드포인트**: `POST /refundPaymentAPI`

**기능 설명**: 결제를 환불합니다. status를 REFUNDED로 업데이트하고 refunded_at을 설정합니다. COMPLETED 상태만 환불 가능합니다.

**요청 본문**:
- `payment_id` 또는 `paymentId`: 결제 식별자 (문자열, 필수)

**응답 본문** (200 OK):
- `success`: 성공 여부 (불린)
- `payment`: 업데이트된 결제 객체

**에러 응답**:
- `error`: 에러 메시지 (문자열)

**에러 코드**:
- `400`: payment_id/paymentId 누락, 이미 환불됨, COMPLETED가 아님
- `404`: 결제를 찾을 수 없음
- `405`: POST 메서드가 아님
- `500`: 서버 오류

**구현 상태**: ✅ Firebase Functions 구현됨

---

### 3.14 API-0700: 주소 생성

**엔드포인트**: `POST /createAddressAPI`

**기능 설명**: 주소를 생성합니다. Firestore `addresses` 컬렉션에 문서를 추가합니다.

**요청 본문**: `user_id`, `address_type` (HOME | WORK | DEALER), `postal_code`, `address1`, `address2` (선택), `is_default` (선택), `platform_id` (선택)

**응답 본문** (201 Created): `success`, `address` (id, user_id, address_type, postal_code, address1, address2, is_default, created_at, updated_at)

**구현 상태**: ✅ Firebase Functions 구현됨

---

### 3.15 API-0701: 주소 단건 조회

**엔드포인트**: `GET /getAddressAPI?addressId={id}` 또는 `POST /getAddressAPI` (body: `{ "addressId": "..." }`)

**구현 상태**: ✅ Firebase Functions 구현됨

---

### 3.16 API-0702: 주소 목록 조회

**엔드포인트**: `GET /listAddressesAPI?user_id={id}` 또는 `POST /listAddressesAPI` (body: `{ "user_id": "..." }`)

**응답 본문** (200 OK): `success`, `addresses` (배열)

**구현 상태**: ✅ Firebase Functions 구현됨

---

### 3.17 API-0703: 주소 수정

**엔드포인트**: `POST /updateAddressAPI` 또는 `PATCH /updateAddressAPI`

**요청 본문**: `address_id` (또는 `addressId`), `address_type`, `postal_code`, `address1`, `address2`, `is_default` (수정할 필드만 포함)

**구현 상태**: ✅ Firebase Functions 구현됨

---

### 3.18 API-0704: 주소 삭제

**엔드포인트**: `DELETE /deleteAddressAPI?addressId={id}` 또는 `POST /deleteAddressAPI` (body: `{ "addressId": "..." }`)

**구현 상태**: ✅ Firebase Functions 구현됨

---

### 3.19 API-0800: 리뷰 생성

**엔드포인트**: `POST /createReviewAPI`

**기능 설명**: 주문에 대한 리뷰를 생성합니다.

**요청 본문**: `order_id`, `reviewer_id`, `reviewee_id`, `rating` (1-5), `content` (선택), `platform_id` (선택)

**구현 상태**: ✅ Firebase Functions 구현됨

---

### 3.20 API-0801: 리뷰 목록 조회

**엔드포인트**: `GET /listReviewsAPI?order_id={id}` 또는 `?reviewee_id={id}` 또는 POST body

**응답 본문** (200 OK): `success`, `reviews` (배열)

**구현 상태**: ✅ Firebase Functions 구현됨

---

### 3.21 API-0900: 판매자 서류 업로드

**엔드포인트**: `POST /uploadDocAPI`

**요청 본문**: `seller_id`, `doc_type` (BUSINESS_LICENSE | DEALER_LICENSE | ID_CARD), `file_url`, `platform_id` (선택)

**구현 상태**: ✅ Firebase Functions 구현됨

---

### 3.22 API-0901: 판매자 서류 승인/거절

**엔드포인트**: `POST /approveDocAPI`

**요청 본문**: `doc_id` (또는 `docId`), `status` (APPROVED | REJECTED)

**구현 상태**: ✅ Firebase Functions 구현됨

---

### 3.23 API-0902: 판매자 서류 목록 조회

**엔드포인트**: `GET /listDocsAPI?seller_id={id}` 또는 POST body

**구현 상태**: ✅ Firebase Functions 구현됨

---

## 4. Mock API

프로토타입 단계에서 프론트엔드에서 Mock 응답을 반환하는 API들입니다. 향후 Firebase Functions로 구현 예정입니다.

### 4.1 일반 판매 제안 수락/거절

**기능 설명**: 일반 판매 제안을 수락하거나 거절합니다.

**요청 데이터**:
- 제안 식별자 (문자열)
- 동작 (수락/거절) (문자열)

**응답 데이터**:
- 성공 여부 (불린)
- 메시지 (문자열)

**향후 엔드포인트**: `POST /acceptProposalAPI`

구현 코드는 부록 6.3을 참조하시기 바랍니다[^ref-code-accept].

[^ref-code-accept]: 부록 6.3: 구현 코드 참조 - 제안 수락/거절

---

### 4.2 바이어 최종 구매 의사 재확인

**기능 설명**: 바이어의 최종 구매 의사를 재확인합니다.

**요청 데이터**:
- 제안 식별자 (문자열)
- 확인 여부 (불린)

**응답 데이터**:
- 성공 여부 (불린)
- 메시지 (문자열)

**향후 엔드포인트**: `POST /confirmProposalAPI`

구현 코드는 부록 6.3을 참조하시기 바랍니다[^ref-code-confirm].

[^ref-code-confirm]: 부록 6.3: 구현 코드 참조 - 구매 의사 확인

---

### 4.3 탁송 일정 조율

**기능 설명**: 탁송 일정을 조율합니다.

**요청 데이터**:
- 일정 날짜 (문자열)
- 일정 시간 (문자열)
- 주소 (문자열)

**응답 데이터**:
- 성공 여부 (불린)
- 일정 식별자 (문자열)

**향후 엔드포인트**: `POST /scheduleLogisticsAPI`

구현 코드는 부록 6.3을 참조하시기 바랍니다[^ref-code-schedule].

[^ref-code-schedule]: 부록 6.3: 구현 코드 참조 - 탁송 일정 조율

---

### 4.4 배차 요청

**기능 설명**: 배차를 요청합니다.

**요청 데이터**:
- 일정 식별자 (문자열)

**응답 데이터**:
- 성공 여부 (불린)
- 배차 식별자 (문자열)

**향후 엔드포인트**: `POST /dispatchLogisticsAPI`

구현 코드는 부록 6.3을 참조하시기 바랍니다[^ref-code-dispatch].

[^ref-code-dispatch]: 부록 6.3: 구현 코드 참조 - 배차 요청

---

### 4.5 배차 확정

**기능 설명**: 배차를 확정합니다.

**요청 데이터**:
- 배차 식별자 (문자열)

**응답 데이터**:
- 성공 여부 (불린)
- 기사 정보 객체
  - `name`: 기사명 (문자열)
  - `phone`: 전화번호 (문자열)

**향후 엔드포인트**: `POST /confirmDispatchAPI`

구현 코드는 부록 6.3을 참조하시기 바랍니다[^ref-code-confirm-dispatch].

[^ref-code-confirm-dispatch]: 부록 6.3: 구현 코드 참조 - 배차 확정

---

### 4.6 인계 승인

**기능 설명**: 탁송 기사로부터 차량 인계를 승인합니다.

**요청 데이터**:
- 탁송 식별자 (문자열)
- PIN (6자리) (문자열)

**응답 데이터**:
- 성공 여부 (불린)
- 인계 시각 (ISO 8601 형식 문자열)

**향후 엔드포인트**: `POST /approveHandoverAPI`

**보안 참고**: PIN 번호는 로그에서 마스킹 처리됨

구현 코드는 부록 6.3을 참조하시기 바랍니다[^ref-code-handover].

[^ref-code-handover]: 부록 6.3: 구현 코드 참조 - 인계 승인

---

### 4.7 정산 완료 알림

**기능 설명**: 정산 완료 알림을 전송합니다.

**요청 데이터**:
- 정산 식별자 (문자열)

**응답 데이터**:
- 성공 여부 (불린)
- 알림 식별자 (문자열)

**향후 엔드포인트**: `POST /notifySettlementAPI`

구현 코드는 부록 6.3을 참조하시기 바랍니다[^ref-code-settlement].

[^ref-code-settlement]: 부록 6.3: 구현 코드 참조 - 정산 완료 알림

---

## 5. 에러 처리

### 5.1 공통 에러 코드

| HTTP 상태 코드 | 의미 | 설명 |
|---------------|------|------|
| 200 | OK | 요청 성공 |
| 400 | Bad Request | 잘못된 요청 (필수 파라미터 누락, 형식 오류 등) |
| 404 | Not Found | 리소스를 찾을 수 없음 |
| 405 | Method Not Allowed | 허용되지 않은 HTTP 메서드 |
| 500 | Internal Server Error | 서버 내부 오류 |

### 5.2 에러 응답 형식 (RFC 9457)

에러 응답은 **RFC 9457 Problem Details for HTTP APIs** 형식을 따릅니다.

**Content-Type**: `application/problem+json`

**Problem Details 필드**:
| 필드 | 타입 | 설명 |
|------|------|------|
| type | string (URI) | 문제 유형 식별자 (예: `https://api.carivdealer.com/errors#ValidationError`) |
| status | number | HTTP 상태 코드 |
| title | string | 짧은 요약 |
| detail | string | 사람이 읽을 수 있는 상세 설명 |
| instance | string | 요청 경로 등 발생 위치 (선택) |
| traceId | string | 요청 추적 ID (확장) |
| code | string | 에러 코드 (확장, 선택) |

**에러 타입 URI ↔ HTTP 상태 매핑**:
| HTTP 상태 | type (URI) |
|-----------|------------|
| 400 | https://api.carivdealer.com/errors#BadRequest |
| 401 | https://api.carivdealer.com/errors#Unauthorized |
| 403 | https://api.carivdealer.com/errors#Forbidden |
| 404 | https://api.carivdealer.com/errors#NotFound |
| 405 | https://api.carivdealer.com/errors#MethodNotAllowed |
| 409 | https://api.carivdealer.com/errors#Conflict |
| 422 | https://api.carivdealer.com/errors#ValidationError |
| 500 | https://api.carivdealer.com/errors#InternalError |

**예제 (RFC 9457)**:
```json
{
  "type": "https://api.carivdealer.com/errors#BadRequest",
  "status": 400,
  "title": "Request Error",
  "detail": "vehicle_id, preferred_date, and preferred_time are required",
  "instance": "/inspectionRequestAPI",
  "traceId": "trace-1738000000000-abc12def",
  "code": "VALIDATION_ERROR"
}
```

**레거시 호환 (참고)**: 이전 표준 에러 응답 `{ "error": "에러 메시지" }` 는 RFC 9457 도입 후 사용하지 않습니다. 클라이언트는 `Content-Type: application/problem+json` 및 `detail` 필드를 사용하세요.

### 5.3 에러 처리 가이드

**프론트엔드 에러 처리**:
- HTTP 응답 상태 코드 확인
- JSON 에러 메시지 파싱
- 사용자에게 적절한 에러 메시지 표시

**백엔드 에러 처리**:
- try-catch 블록을 통한 예외 처리
- 적절한 HTTP 상태 코드 반환
- 에러 로깅

상세 에러 처리 코드는 부록 6.3을 참조하시기 바랍니다[^ref-code-error].

[^ref-code-error]: 부록 6.3: 구현 코드 참조 - 에러 처리

---

## 6. 부록

### 6.1 용어집

| 용어 | 설명 |
|------|------|
| 엔드포인트 | API 서비스의 특정 기능에 접근하기 위한 URL 경로 |
| 요청 본문 | API 호출 시 전송하는 데이터 |
| 응답 본문 | API 호출 결과로 받는 데이터 |
| Mock API | 실제 구현 전 테스트를 위한 가짜 API |
| 트랜잭션 | 데이터베이스 작업의 원자성을 보장하는 메커니즘 |
| 원자성 | 데이터베이스 작업이 모두 성공하거나 모두 실패하는 성질 |
| CORS | Cross-Origin Resource Sharing, 다른 도메인 간 리소스 공유를 허용하는 메커니즘 |
| PIN | Personal Identification Number, 개인 식별 번호 (인계 승인용 6자리) |
| Blind Auction | 경매 진행 중 최고 입찰가를 화면에 비노출하는 경매 방식 |
| Firestore | Firebase의 NoSQL 문서 데이터베이스 |
| 서버리스 | 서버 관리 없이 코드 실행이 가능한 클라우드 컴퓨팅 모델 |
| HTTP 상태 코드 | HTTP 요청의 결과를 나타내는 숫자 코드 (200: 성공, 400: 잘못된 요청 등) |
| FormData | 파일 업로드 시 사용하는 데이터 형식 |
| JSON | JavaScript Object Notation, 데이터 교환 형식 |

### 6.2 요청/응답 스키마 상세

#### 딜러 회원가입 (API-0001)

**요청 스키마**:
```json
{
  "email": "dealer@example.com",
  "password": "password123",
  "dealer_name": "Global Motors",
  "phone": "010-1234-5678",
  "terms_agreed": true
}
```

**응답 스키마**:
```json
{
  "success": true,
  "member_id": "member-1234567890",
  "message": "회원가입이 완료되었습니다."
}
```

#### 사업자 인증 (API-0002)

**요청 스키마**:
- FormData 형식
- `business_registration_image`: File 객체

**응답 스키마**:
```json
{
  "success": true,
  "verified": true,
  "business_info": {
    "companyName": "Global Motors",
    "businessRegNo": "123-45-67890",
    "representativeName": "홍길동"
  },
  "message": "인증이 완료되었습니다."
}
```

#### 등록원부 OCR (API-0100)

**요청 스키마**:
```json
{
  "car_no": "82가 1923"
}
```

**응답 스키마**:
```json
{
  "vin": "KMHXX00XXXX000000",
  "manufacturer": "Hyundai",
  "model": "Porter II",
  "year": "2018",
  "mileage": "136000"
}
```

#### 검차 신청 (API-0101)

**요청 스키마**:
```json
{
  "vehicle_id": "v-101",
  "preferred_date": "2025-01-25",
  "preferred_time": "14:00"
}
```

**응답 스키마**:
```json
{
  "success": true,
  "inspection_id": "insp-1234567890",
  "message": "검차 신청이 완료되었습니다."
}
```

#### 경매 입찰 (API-0200)

**요청 스키마**:
```json
{
  "auction_id": "auc-1234567890",
  "bid_amount": 650000
}
```

**응답 스키마**:
```json
{
  "success": true,
  "message": "입찰이 완료되었습니다."
}
```

#### 즉시구매 (API-0201)

**요청 스키마**:
```json
{
  "auction_id": "auc-1234567890"
}
```

**응답 스키마**:
```json
{
  "success": true,
  "contract_id": "contract-1234567890",
  "message": "즉시구매가 완료되었습니다."
}
```

#### 판매 방식 변경 (API-0300)

**요청 스키마**:
```json
{
  "vehicle_id": "v-101",
  "auction_settings": {
    "start_price": 500000,
    "buy_now_price": 700000
  }
}
```

**응답 스키마**:
```json
{
  "success": true,
  "auction_id": "auc-1234567890"
}
```

### 6.3 구현 코드 참조

**프론트엔드 API 클라이언트**: `src/services/api.ts`

**백엔드 Functions**:
- `functions/src/index.ts` (엔드포인트 등록)
- `functions/src/member/verifyBusiness.ts` (사업자 인증)
- `functions/src/vehicle/ocrRegistration.ts` (등록원부 OCR)
- `functions/src/vehicle/inspection.ts` (검차 신청)
- `functions/src/auction/bid.ts` (경매 입찰)
- `functions/src/auction/buyNow.ts` (즉시구매)
- `functions/src/trade/changeSaleMethod.ts` (판매 방식 변경)

**설정 파일**:
- `firebase.json` (Firebase 설정)

---

**문서 끝**

