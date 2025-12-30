# API 명세서 (API Specification)
## ForwardMax B2B Used Car Export Platform

**문서 버전**: 1.0  
**작성일**: 2025-01-XX  
**프로젝트**: ForwardMax (carivdealer)  
**작성자**: Development Team

---

## 목차

1. [개요](#1-개요)
2. [엔드포인트 목록](#2-엔드포인트-목록)
3. [엔드포인트 상세 명세](#3-엔드포인트-상세-명세)
4. [Mock API](#4-mock-api)
5. [에러 코드](#5-에러-코드)

---

## 1. 개요

### 1.1 API 기본 정보

- **Base URL**: `https://asia-northeast3-carivdealer.cloudfunctions.net`
- **프로토콜**: HTTPS
- **인코딩**: UTF-8
- **데이터 형식**: JSON

### 1.2 인증 방식

**현재 상태**: 인증 미구현 (프로토타입 단계)

**계획**: Firebase Auth 토큰 기반 인증
```http
Authorization: Bearer {firebase_auth_token}
```

### 1.3 공통 규칙

#### 요청 헤더
```http
Content-Type: application/json
```

#### 응답 형식
- **성공**: HTTP 200 + JSON 본문
- **에러**: HTTP 4xx/5xx + JSON 에러 메시지

#### CORS
- 모든 엔드포인트에서 CORS 허용 (Firebase Functions v2 `cors: true` 설정)

#### 리전
- 모든 Functions는 `asia-northeast3` 리전에 배포됨

---

## 2. 엔드포인트 목록

### 2.1 구현된 엔드포인트

| API ID | 엔드포인트명 | HTTP 메서드 | 경로 | 상태 |
|--------|-------------|------------|------|------|
| API-0002 | verifyBusinessAPI | POST | `/verifyBusinessAPI` | ✅ 구현됨 |
| API-0100 | ocrRegistrationAPI | POST | `/ocrRegistrationAPI` | ✅ 구현됨 |
| API-0101 | inspectionRequestAPI | POST | `/inspectionRequestAPI` | ✅ 구현됨 |
| API-0200 | bidAPI | POST | `/bidAPI` | ✅ 구현됨 |
| API-0201 | buyNowAPI | POST | `/buyNowAPI` | ✅ 구현됨 |
| API-0300 | changeSaleMethodAPI | POST | `/changeSaleMethodAPI` | ✅ 구현됨 |

### 2.2 Mock API (프로토타입)

| API ID | 엔드포인트명 | HTTP 메서드 | 경로 | 상태 |
|--------|-------------|------------|------|------|
| - | acceptProposal | POST | Mock (프론트엔드) | 🔶 Mock |
| - | confirmProposal | POST | Mock (프론트엔드) | 🔶 Mock |
| - | scheduleLogistics | POST | Mock (프론트엔드) | 🔶 Mock |
| - | dispatchLogistics | POST | Mock (프론트엔드) | 🔶 Mock |
| - | confirmDispatch | POST | Mock (프론트엔드) | 🔶 Mock |
| - | approveHandover | POST | Mock (프론트엔드) | 🔶 Mock |
| - | notifySettlement | POST | Mock (프론트엔드) | 🔶 Mock |

---

## 3. 엔드포인트 상세 명세

### 3.1 API-0002: 사업자 인증

**엔드포인트**: `POST /verifyBusinessAPI`

**설명**: 사업자등록증 이미지를 업로드하여 OCR 처리 및 진위 확인을 수행합니다.

**요청 헤더**:
```http
Content-Type: multipart/form-data
```

**요청 본문** (FormData):
```
business_registration_image: File (이미지 파일)
```

**응답 본문** (200 OK):
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

**에러 응답**:
```json
{
  "error": "에러 메시지"
}
```

**에러 코드**:
- `400`: 파일이 제공되지 않음
- `405`: POST 메서드가 아님
- `500`: 서버 오류

**구현 상태**: Mock 응답 반환 (프로토타입 단계)

**예제**:
```typescript
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

---

### 3.2 API-0100: 등록원부 OCR

**엔드포인트**: `POST /ocrRegistrationAPI`

**설명**: 차량번호를 입력받아 등록원부에서 차량 기본정보를 OCR로 추출합니다.

**요청 헤더**:
```http
Content-Type: application/json
```

**요청 본문**:
```json
{
  "car_no": "82가 1923"
}
```

**응답 본문** (200 OK):
```json
{
  "vin": "KMHXX00XXXX000000",
  "manufacturer": "Hyundai",
  "model": "Porter II",
  "year": "2018",
  "mileage": "136000"
}
```

**에러 응답**:
```json
{
  "error": "car_no is required"
}
```

**에러 코드**:
- `400`: car_no가 제공되지 않음
- `405`: POST 메서드가 아님
- `500`: 서버 오류

**구현 상태**: Mock 응답 반환 (프로토타입 단계)

**예제**:
```typescript
const response = await apiClient.vehicle.ocrRegistration('82가 1923');
// { vin: 'KMHXX00XXXX000000', manufacturer: 'Hyundai', ... }
```

---

### 3.3 API-0101: 검차 신청

**엔드포인트**: `POST /inspectionRequestAPI`

**설명**: 차량에 대한 검차 신청을 처리하고 Firestore에 검차 데이터를 저장합니다.

**요청 헤더**:
```http
Content-Type: application/json
```

**요청 본문**:
```json
{
  "vehicle_id": "v-101",
  "preferred_date": "2025-01-25",
  "preferred_time": "14:00"
}
```

**응답 본문** (200 OK):
```json
{
  "success": true,
  "inspection_id": "insp-1234567890",
  "message": "검차 신청이 완료되었습니다."
}
```

**에러 응답**:
```json
{
  "error": "vehicle_id, preferred_date, and preferred_time are required"
}
```

**에러 코드**:
- `400`: 필수 파라미터 누락
- `405`: POST 메서드가 아님
- `500`: 서버 오류

**구현 상태**: ✅ Firebase Functions 구현됨

**Firestore 저장**:
- 컬렉션: `inspections`
- 필드: `vehicleId`, `preferredDate`, `preferredTime`, `status: 'pending'`, `createdAt`

**예제**:
```typescript
const response = await apiClient.vehicle.inspection.request('v-101', {
  preferred_date: '2025-01-25',
  preferred_time: '14:00',
});
```

---

### 3.4 API-0200: 경매 입찰

**엔드포인트**: `POST /bidAPI`

**설명**: 경매에 입찰을 처리합니다. 동시성 제어를 위해 Firestore 트랜잭션을 사용합니다.

**요청 헤더**:
```http
Content-Type: application/json
```

**요청 본문**:
```json
{
  "auction_id": "auc-1234567890",
  "bid_amount": 650000
}
```

**응답 본문** (200 OK):
```json
{
  "success": true,
  "message": "입찰이 완료되었습니다."
}
```

**에러 응답**:
```json
{
  "error": "Bid amount must be higher than current highest bid"
}
```

**에러 코드**:
- `400`: auction_id 또는 bid_amount 누락
- `400`: 입찰 금액이 현재 최고가보다 낮음
- `404`: 경매를 찾을 수 없음
- `400`: 경매가 활성 상태가 아님
- `405`: POST 메서드가 아님
- `500`: 서버 오류

**구현 상태**: ✅ Firebase Functions 구현됨

**동시성 제어**:
- Firestore 트랜잭션 사용
- 최고가 업데이트는 화면에 비노출 (Blind Auction)

**Firestore 업데이트**:
- 컬렉션: `auctions/{auctionId}`
- 필드: `currentHighestBid`, `updatedAt`

**예제**:
```typescript
const response = await apiClient.auction.bid('auc-1234567890', 650000);
```

---

### 3.5 API-0201: 즉시구매

**엔드포인트**: `POST /buyNowAPI`

**설명**: 경매에서 즉시구매를 처리합니다. 원자성을 보장하기 위해 Firestore 트랜잭션을 사용합니다.

**요청 헤더**:
```http
Content-Type: application/json
```

**요청 본문**:
```json
{
  "auction_id": "auc-1234567890"
}
```

**응답 본문** (200 OK):
```json
{
  "success": true,
  "contract_id": "contract-1234567890",
  "message": "즉시구매가 완료되었습니다."
}
```

**에러 응답**:
```json
{
  "error": "Buy now price is not set"
}
```

**에러 코드**:
- `400`: auction_id 누락
- `404`: 경매를 찾을 수 없음
- `400`: 경매가 활성 상태가 아님
- `400`: 즉시구매가 설정되지 않음
- `405`: POST 메서드가 아님
- `500`: 서버 오류

**구현 상태**: ✅ Firebase Functions 구현됨

**원자성 보장**:
- Firestore 트랜잭션 사용
- 경매 종료 및 차량 상태 업데이트를 원자적으로 처리

**Firestore 업데이트**:
- 컬렉션: `auctions/{auctionId}`
  - 필드: `status: 'Sold'`, `currentHighestBid`, `endedAt`
- 컬렉션: `vehicles/{vehicleId}`
  - 필드: `status: 'locked'`, `updatedAt`

**예제**:
```typescript
const response = await apiClient.auction.buyNow('auc-1234567890');
```

---

### 3.6 API-0300: 판매 방식 변경

**엔드포인트**: `POST /changeSaleMethodAPI`

**설명**: 일반 판매에서 경매로 판매 방식을 변경하고 경매를 생성합니다.

**요청 헤더**:
```http
Content-Type: application/json
```

**요청 본문**:
```json
{
  "vehicle_id": "v-101",
  "auction_settings": {
    "start_price": 500000,
    "buy_now_price": 700000
  }
}
```

**응답 본문** (200 OK):
```json
{
  "success": true,
  "auction_id": "auc-1234567890"
}
```

**에러 응답**:
```json
{
  "error": "start_price is required"
}
```

**에러 코드**:
- `400`: vehicle_id 또는 auction_settings 누락
- `400`: start_price 누락
- `404`: 차량을 찾을 수 없음
- `405`: POST 메서드가 아님
- `500`: 서버 오류

**구현 상태**: ✅ Firebase Functions 구현됨

**Firestore 저장/업데이트**:
- 컬렉션: `auctions` (새 문서 생성)
  - 필드: `vehicleId`, `startPrice`, `buyNowPrice`, `currentHighestBid: null`, `status: 'Active'`, `createdAt`
- 컬렉션: `vehicles/{vehicleId}` (업데이트)
  - 필드: `status: 'bidding'`, `auctionId`, `updatedAt`

**예제**:
```typescript
const response = await apiClient.trade.changeSaleMethod('v-101', {
  start_price: 500000,
  buy_now_price: 700000,
});
```

---

## 4. Mock API

프로토타입 단계에서 프론트엔드에서 Mock 응답을 반환하는 API들입니다. 향후 Firebase Functions로 구현 예정입니다.

### 4.1 일반 판매 제안 수락/거절

**API 클라이언트**: `apiClient.trade.acceptProposal()`

**요청**:
```typescript
acceptProposal(proposalId: string, action: 'accept' | 'reject')
```

**Mock 응답**:
```json
{
  "success": true,
  "message": "제안이 수락되었습니다." // 또는 "제안이 거절되었습니다."
}
```

**구현 위치**: `src/services/api.ts`

**향후 엔드포인트**: `POST /acceptProposalAPI`

---

### 4.2 바이어 최종 구매 의사 재확인

**API 클라이언트**: `apiClient.trade.confirmProposal()`

**요청**:
```typescript
confirmProposal(proposalId: string, confirmed: boolean)
```

**Mock 응답**:
```json
{
  "success": true,
  "message": "구매 의사가 확인되었습니다." // 또는 "구매 의사 확인이 취소되었습니다."
}
```

**구현 위치**: `src/services/api.ts`

**향후 엔드포인트**: `POST /confirmProposalAPI`

---

### 4.3 탁송 일정 조율

**API 클라이언트**: `apiClient.logistics.schedule()`

**요청**:
```typescript
schedule({
  schedule_date: string,
  schedule_time: string,
  address: string
})
```

**Mock 응답**:
```json
{
  "success": true,
  "schedule_id": "schedule-1234567890"
}
```

**구현 위치**: `src/services/api.ts`

**향후 엔드포인트**: `POST /scheduleLogisticsAPI`

---

### 4.4 배차 요청

**API 클라이언트**: `apiClient.logistics.dispatch.request()`

**요청**:
```typescript
request(scheduleId: string)
```

**Mock 응답**:
```json
{
  "success": true,
  "dispatch_id": "dispatch-1234567890"
}
```

**구현 위치**: `src/services/api.ts`

**향후 엔드포인트**: `POST /dispatchLogisticsAPI`

---

### 4.5 배차 확정

**API 클라이언트**: `apiClient.logistics.dispatch.confirm()`

**요청**:
```typescript
confirm(dispatchId: string)
```

**Mock 응답**:
```json
{
  "success": true,
  "driver_info": {
    "name": "김택시",
    "phone": "010-1234-5678"
  }
}
```

**구현 위치**: `src/services/api.ts`

**향후 엔드포인트**: `POST /confirmDispatchAPI`

---

### 4.6 인계 승인

**API 클라이언트**: `apiClient.logistics.approveHandover()`

**요청**:
```typescript
approveHandover(logisticsId: string, pin: string)
```

**Mock 응답**:
```json
{
  "success": true,
  "handover_timestamp": "2025-01-25T14:30:00.000Z"
}
```

**구현 위치**: `src/services/api.ts`

**향후 엔드포인트**: `POST /approveHandoverAPI`

**보안 참고**: PIN 번호는 로그에서 마스킹 처리됨 (`pin.substring(0, 1)***`)

---

### 4.7 정산 완료 알림

**API 클라이언트**: `apiClient.settlement.notify()`

**요청**:
```typescript
notify(settlementId: string)
```

**Mock 응답**:
```json
{
  "success": true,
  "notification_id": "notif-1234567890"
}
```

**구현 위치**: `src/services/api.ts`

**향후 엔드포인트**: `POST /notifySettlementAPI`

---

## 5. 에러 코드

### 5.1 공통 에러 코드

| HTTP 상태 코드 | 의미 | 설명 |
|---------------|------|------|
| 200 | OK | 요청 성공 |
| 400 | Bad Request | 잘못된 요청 (필수 파라미터 누락, 형식 오류 등) |
| 404 | Not Found | 리소스를 찾을 수 없음 |
| 405 | Method Not Allowed | 허용되지 않은 HTTP 메서드 |
| 500 | Internal Server Error | 서버 내부 오류 |

### 5.2 에러 응답 형식

**표준 에러 응답**:
```json
{
  "error": "에러 메시지"
}
```

**예제**:
```json
{
  "error": "vehicle_id, preferred_date, and preferred_time are required"
}
```

### 5.3 에러 처리 가이드

**프론트엔드 에러 처리** (`src/services/api.ts`):
```typescript
async function apiCall<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(url, options);
  
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: response.statusText }));
    throw new Error(error.message || `API call failed: ${response.statusText}`);
  }
  
  return response.json();
}
```

**백엔드 에러 처리** (Firebase Functions):
```typescript
try {
  // 처리 로직
  res.status(200).json({ success: true, ... });
} catch (error: any) {
  console.error('Error:', error);
  res.status(500).json({ error: error.message || 'Internal server error' });
}
```

---

## 부록

### A. API 클라이언트 사용 예제

**전체 예제** (`src/services/api.ts`):
```typescript
import { apiClient } from './services/api';

// 회원가입
const registerResult = await apiClient.member.register({
  email: 'dealer@example.com',
  password: 'password123',
  dealer_name: 'Global Motors',
  phone: '010-1234-5678',
  terms_agreed: true,
});

// 등록원부 OCR
const ocrResult = await apiClient.vehicle.ocrRegistration('82가 1923');

// 검차 신청
const inspectionResult = await apiClient.vehicle.inspection.request('v-101', {
  preferred_date: '2025-01-25',
  preferred_time: '14:00',
});

// 경매 입찰
const bidResult = await apiClient.auction.bid('auc-1234567890', 650000);

// 즉시구매
const buyNowResult = await apiClient.auction.buyNow('auc-1234567890');

// 판매 방식 변경
const changeMethodResult = await apiClient.trade.changeSaleMethod('v-101', {
  start_price: 500000,
  buy_now_price: 700000,
});
```

### B. 환경 변수 설정

**프론트엔드** (`.env.local`):
```bash
VITE_API_BASE_URL=https://asia-northeast3-carivdealer.cloudfunctions.net
```

**백엔드** (GCP Secret Manager):
- `gemini-api-key`: Gemini API 키 (향후 OCR 처리 시 사용)

### C. 개발 환경 Mock 로그

프로토타입 단계에서 Mock API 호출 시 개발 환경에서만 로그가 출력됩니다:

```typescript
const isDev = import.meta.env.DEV;
const logMockCall = (message: string, ...args: any[]) => {
  if (isDev) {
    console.warn(`[프로토타입] ${message}`, ...args);
  }
};
```

프로덕션 빌드에서는 Mock 로그가 출력되지 않습니다.

---

**문서 끝**

