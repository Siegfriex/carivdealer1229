# ERD 정합성 분석 보고서

**프로젝트**: ForwardMax (carivdealer)  
**분석 일자**: 2026-01-28  
**분석 대상**:
- 이미지 ERD: `erd/IMG_3923.png` (관계형 데이터베이스 설계)
- 문서 ERD: `docs/DATABASE_ERD_SCHEMA.md` (Firestore NoSQL 설계)

---

## 실행 요약

### 전체 일치율
- **엔티티 매핑 일치율**: 약 30% (7/21 테이블이 직접 매핑 가능)
- **핵심 비즈니스 엔티티 일치율**: 약 60% (주요 도메인은 대부분 존재)
- **필드 수준 일치율**: 약 40% (필드명, 타입, 제약조건 차이 다수)

### 주요 발견사항

1. **Critical (치명적)**: 
   - 이미지 ERD는 관계형 DB 설계, 문서는 NoSQL 설계로 근본적 아키텍처 차이
   - 사용자/회원 관리 구조가 완전히 다름 (user/buyer_profile/seller_profile vs members)
   - 주문/결제 시스템 누락 (orders, payment 테이블)

2. **High (높음)**:
   - 매물 등록 시스템 누락 (listing 테이블)
   - 차량 미디어/옵션 관리 구조 차이 (별도 테이블 vs 내장 객체)
   - 주소 관리 구조 차이 (별도 테이블 vs 내장 객체)

3. **Medium (중간)**:
   - 탁송/배송 시스템 구조 차이 (transport/shipping vs logistics)
   - 리뷰 시스템 누락
   - 판매자 문서 관리 누락

4. **Low (낮음)**:
   - 포트 정보 누락 (국제 배송용, 현재는 국내 전용)
   - base_entity 상속 구조 차이

---

## 1. 엔티티 매핑 비교표

| 이미지 ERD 테이블 | 문서 컬렉션 | 매핑 상태 | 비고 |
|------------------|-----------|---------|------|
| `user` | `members` | ⚠️ 부분 일치 | 구조 차이 (단일 vs 분리) |
| `buyer_profile` | ❌ 없음 | ❌ 누락 | 구매자 프로필 정보 |
| `seller_profile` | ❌ 없음 | ❌ 누락 | 판매자 프로필 정보 |
| `user_profile` | ❌ 없음 | ❌ 누락 | 사용자 프로필 정보 |
| `address` | ❌ 없음 | ❌ 누락 | 주소 정보 (inspections.location에 일부 포함) |
| `vehicle` | `vehicles` | ✅ 일치 | 필드명 차이 다수 |
| `vehicle_media` | ❌ 없음 | ❌ 누락 | vehicles 내장 또는 별도 관리 필요 |
| `vehicle_option` | ❌ 없음 | ❌ 누락 | vehicles 내장 또는 별도 관리 필요 |
| `vehicle_inspection` | `inspections` | ✅ 일치 | 필드명 차이 다수 |
| `listing` | ❌ 없음 | ❌ 누락 | 매물 등록 정보 (vehicles에 일부 포함) |
| `orders` | ❌ 없음 | ❌ 누락 | 주문 정보 (trades와 유사하나 구조 다름) |
| `transport` | `logistics` | ⚠️ 부분 일치 | 필드명 및 구조 차이 |
| `payment` | ❌ 없음 | ❌ 누락 | 결제 정보 (settlements에 일부 포함) |
| `auction` | `auctions` | ✅ 일치 | 필드명 차이 다수 |
| `auction_bid` | ❌ 없음 | ❌ 누락 | 입찰 정보 (서브컬렉션 또는 별도 관리) |
| `user_profile` | ❌ 없음 | ❌ 누락 | 사용자 프로필 |
| `shipping` | ❌ 없음 | ❌ 누락 | 배송 정보 (logistics에 통합) |
| `port` | ❌ 없음 | ❌ 누락 | 포트 정보 (국제 배송용) |
| `bid` | ❌ 없음 | ❌ 누락 | 입찰 정보 (auction_bid와 중복 가능) |
| `review` | ❌ 없음 | ❌ 누락 | 리뷰 시스템 |
| `seller_docs` | ❌ 없음 | ❌ 누락 | 판매자 문서 관리 |
| `base_entity` | ❌ 없음 | ❌ 누락 | 공통 필드 (각 엔티티에 분산) |

**매핑 요약**:
- ✅ 직접 매핑 가능: 3개 (vehicle, vehicle_inspection, auction)
- ⚠️ 부분 매핑: 2개 (user→members, transport→logistics)
- ❌ 완전 누락: 16개

---

## 2. 누락 엔티티 상세 분석

### 2.1 Critical (치명적) - 즉시 반영 필요

#### 2.1.1 `orders` (주문)
**이미지 ERD 구조**:
```sql
orders (
  order_id BIGINT PK,
  buyer_id BIGINT FK → buyer_profile,
  listing_id BIGINT FK → listing,
  order_type ENUM('BUY_NOW','AUCTION','REQUEST'),
  order_status ENUM('PENDING','COMPLETED','CANCELLED','REFUNDED'),
  final_price DECIMAL(10,2),
  order_date DATETIME,
  winning_bid_id BIGINT FK → auction_bid
)
```

**문서 상태**: ❌ 완전 누락

**현재 대안**: `trades` 컬렉션이 일부 역할 수행하나, 주문의 전체 생명주기 관리 불가

**영향도**:
- 주문 생성, 결제, 배송, 환불 등 전체 주문 플로우 관리 불가
- 주문 상태 추적 불가
- 주문 이력 관리 불가

**보완 제안**:
- `orders` 컬렉션 추가 또는 `trades`를 확장하여 주문 기능 통합
- 주문 상태 전이 규칙 정의 필요

#### 2.1.2 `payment` (결제)
**이미지 ERD 구조**:
```sql
payment (
  payment_id BIGINT PK,
  order_id BIGINT FK → orders,
  payment_method ENUM('CREDIT_CARD','BANK_TRANSFER','TOSSPAY','KAKAOPAY','NAVERPAY'),
  amount DECIMAL(10,2),
  payment_status ENUM('PENDING','COMPLETED','FAILED','REFUNDED'),
  paid_at DATETIME
)
```

**문서 상태**: ❌ 완전 누락

**현재 대안**: `settlements`에 일부 정산 정보만 포함

**영향도**:
- 결제 처리 로직 구현 불가
- 결제 수단별 처리 불가
- 결제 실패/환불 처리 불가
- 결제 이력 추적 불가

**보완 제안**:
- `payments` 컬렉션 추가
- `orders`와 1:N 관계 설정
- 결제 상태 전이 규칙 정의

#### 2.1.3 `listing` (매물 등록)
**이미지 ERD 구조**:
```sql
listing (
  listing_id BIGINT PK,
  seller_id BIGINT FK → seller_profile,
  vehicle_id BIGINT FK → vehicle (UNIQUE),
  selling_method ENUM('FIXED_PRICE','AUCTION'),
  price DECIMAL(10,2),
  start_date DATE,
  end_date DATE,
  warranty_service_provided BOOLEAN,
  pre_inspection_required BOOLEAN,
  description TEXT,
  view_count INT,
  interest_count INT,
  commission_rate DECIMAL(5,2),
  additional_cost DECIMAL(10,2),
  tax_rate DECIMAL(5,2),
  pre_transaction_cost DECIMAL(10,2),
  lead_time_days INT,
  delivery_option ENUM('PICKUP','DELIVERY'),
  status ENUM('DRAFT','PENDING','ACTIVE','EXPIRED','SOLD','CANCELLED'),
  auction_id BIGINT FK → auction
)
```

**문서 상태**: ❌ 완전 누락

**현재 대안**: `vehicles`에 일부 판매 정보 포함 (`price`, `status` 등)

**영향도**:
- 매물 등록/수정/삭제 플로우 관리 불가
- 매물별 상세 판매 조건 관리 불가
- 조회수/관심수 추적 불가
- 매물 상태 전이 관리 불가

**보완 제안**:
- `listings` 컬렉션 추가 또는 `vehicles` 확장
- 매물 상태 전이 규칙 정의
- 매물별 판매 조건 필드 추가

### 2.2 High (높음) - 조기 반영 권장

#### 2.2.1 `buyer_profile`, `seller_profile`, `user_profile`
**이미지 ERD 구조**:
- `user`: 기본 인증 정보 (email, password, user_type, status)
- `buyer_profile`: 구매자 프로필 (이름, 전화번호, 개인/법인 정보)
- `seller_profile`: 판매자 프로필 (이름, 전화번호, 계좌 정보, 정산 정보)
- `user_profile`: 사용자 프로필 (닉네임, 프로필 이미지, 생년월일, 성별, 주소)

**문서 상태**: ⚠️ `members` 하나로 통합

**현재 구조**: `members` 컬렉션에 모든 정보 통합

**영향도**:
- 사용자 역할별 프로필 관리 복잡도 증가
- 구매자/판매자 분리 관리 어려움
- 프로필 정보 확장 시 스키마 복잡도 증가

**보완 제안**:
- `members`를 기본 인증 정보만 포함하도록 분리
- `buyer_profiles`, `seller_profiles` 서브컬렉션 또는 별도 컬렉션 추가
- 또는 `members` 내부에 `buyerInfo`, `sellerInfo` 객체로 구조화

#### 2.2.2 `vehicle_media`, `vehicle_option`
**이미지 ERD 구조**:
- `vehicle_media`: 차량 미디어 (이미지/비디오 URL, 타입, 설명)
- `vehicle_option`: 차량 옵션 (옵션명, 옵션값, 설명)

**문서 상태**: ❌ 별도 관리 없음

**현재 대안**: `vehicles` 내부에 배열 또는 객체로 관리 가능

**영향도**:
- 미디어/옵션 조회 성능 이슈 가능
- 미디어/옵션 개수 제한 없이 확장 가능
- 미디어/옵션별 개별 관리 어려움

**보완 제안**:
- `vehicles/{vehicleId}/media` 서브컬렉션 추가
- `vehicles/{vehicleId}/options` 서브컬렉션 추가
- 또는 `vehicles` 내부에 `media[]`, `options[]` 배열로 관리

#### 2.2.3 `address`
**이미지 ERD 구조**:
```sql
address (
  address_id BIGINT PK,
  member_id BIGINT FK → user_profile,
  address_type ENUM('HOME','OFFICE','OTHER'),
  post_code VARCHAR(10),
  street_address VARCHAR(255),
  detail_address VARCHAR(255),
  city VARCHAR(100),
  district VARCHAR(100),
  country VARCHAR(50),
  lat DECIMAL(10,7),
  lng DECIMAL(10,7),
  _geo_encoding_api VARCHAR(255)
)
```

**문서 상태**: ❌ 별도 관리 없음

**현재 대안**: `inspections.location`에 일부 주소 정보 포함

**영향도**:
- 사용자별 주소 관리 불가
- 주소 타입별 관리 불가
- 주소 좌표 정보 관리 불가
- Google Geocoding API 연동 정보 관리 불가

**보완 제안**:
- `members/{memberId}/addresses` 서브컬렉션 추가
- 또는 `members` 내부에 `addresses[]` 배열로 관리

### 2.3 Medium (중간) - 중기 반영 고려

#### 2.3.1 `auction_bid` (입찰)
**이미지 ERD 구조**:
```sql
auction_bid (
  bid_id BIGINT PK,
  auction_id BIGINT FK → auction,
  buyer_id BIGINT FK → buyer_profile,
  bid_price DECIMAL(10,2),
  bid_at DATETIME,
  status ENUM('ACTIVE','CANCELLED','OUTBID'),
  _etc VARCHAR(255)
)
```

**문서 상태**: ❌ 별도 관리 없음

**현재 대안**: 문서에 `vehicles/{vehicleId}/bids` 서브컬렉션 언급 (향후 확장)

**영향도**:
- 입찰 이력 관리 불가
- 입찰 상태 추적 불가
- 입찰자 정보 관리 불가

**보완 제안**:
- `auctions/{auctionId}/bids` 서브컬렉션 추가
- 입찰 상태 전이 규칙 정의

#### 2.3.2 `review` (리뷰)
**이미지 ERD 구조**: 컬럼 정보 불명확

**문서 상태**: ❌ 완전 누락

**영향도**:
- 거래 후 리뷰 시스템 구현 불가
- 판매자/구매자 평점 관리 불가

**보완 제안**:
- `reviews` 컬렉션 추가 (향후 확장)
- 리뷰 타입 (판매자 리뷰, 구매자 리뷰, 차량 리뷰) 정의

#### 2.3.3 `seller_docs` (판매자 문서)
**이미지 ERD 구조**:
```sql
seller_docs (
  doc_id BIGINT PK,
  seller_id BIGINT FK → seller_profile,
  doc_type ENUM('BUSINESS_LICENSE','ID_CARD','BANK_ACCOUNT'),
  doc_url VARCHAR(2048),
  status ENUM('PENDING','APPROVED','REJECTED'),
  uploaded_at DATETIME,
  approved_at DATETIME
)
```

**문서 상태**: ❌ 완전 누락

**현재 대안**: `members.businessInfo`에 일부 정보 포함

**영향도**:
- 판매자 문서 업로드/승인 플로우 관리 불가
- 문서 타입별 관리 불가
- 문서 승인 상태 추적 불가

**보완 제안**:
- `members/{memberId}/documents` 서브컬렉션 추가
- 문서 승인 상태 전이 규칙 정의

#### 2.3.4 `shipping` (배송)
**이미지 ERD 구조**:
```sql
shipping (
  shipping_id BIGINT PK,
  order_id BIGINT FK → orders,
  tracking_number VARCHAR(50) UNIQUE,
  shipper ENUM('DIRECT','3RDPARTY'),
  shipping_status ENUM('PENDING','IN_TRANSIT','DELIVERED','CANCELLED'),
  start_address VARCHAR(255),
  end_address VARCHAR(255),
  start_date DATETIME,
  expected_delivery_date DATETIME,
  actual_delivery_date DATETIME,
  cost DECIMAL(10,2),
  price DECIMAL(10,2)
)
```

**문서 상태**: ❌ 별도 관리 없음

**현재 대안**: `logistics`에 일부 배송 정보 포함

**영향도**:
- 배송 추적 번호 관리 불가
- 배송사별 관리 불가
- 배송 상태 추적 불가

**보완 제안**:
- `logistics` 확장 또는 `shippings` 컬렉션 추가
- 배송 추적 번호 필드 추가

### 2.4 Low (낮음) - 장기 반영 고려

#### 2.4.1 `port` (포트)
**이미지 ERD 구조**:
```sql
port (
  port_id BIGINT PK,
  port_code VARCHAR(50),
  city VARCHAR(100),
  state VARCHAR(100),
  port_name VARCHAR(255)
)
```

**문서 상태**: ❌ 완전 누락

**영향도**: 국제 배송 시에만 필요 (현재는 국내 전용)

**보완 제안**: 향후 국제 배송 확장 시 추가

#### 2.4.2 `base_entity` (기본 엔티티)
**이미지 ERD 구조**:
```sql
base_entity (
  id BIGINT PK,
  created_at DATETIME(6),
  updated_at DATETIME(6),
  _is_deleted BOOLEAN
)
```

**문서 상태**: ❌ 상속 구조 없음

**현재 대안**: 각 엔티티에 `createdAt`, `updatedAt` 분산

**영향도**: 코드 중복 증가, 일관성 유지 어려움

**보완 제안**: TypeScript 타입 정의에서 공통 인터페이스 활용

---

## 3. 필드 차이점 분석

### 3.1 `vehicle` vs `vehicles`

| 이미지 ERD 필드 | 문서 필드 | 타입 차이 | 비고 |
|----------------|----------|---------|------|
| `vehicle_id` | `id` | BIGINT → string | ✅ 일치 (명명만 다름) |
| `member_id` | `ownerId` | BIGINT → string | ✅ 일치 (명명만 다름) |
| `plate_no` | `plateNumber` | VARCHAR(20) → string | ✅ 일치 (명명만 다름) |
| `vin` | `vin` | VARCHAR(20) → string | ✅ 일치 |
| `first_registered_at` | `registrationDate` | DATE → string | ⚠️ 타입 차이 |
| `production_year` | `modelYear` | INT → string | ⚠️ 타입 차이 |
| `mileage` | `mileage` | INT → string | ⚠️ 타입 차이 |
| `image_url` | `thumbnailUrl` | VARCHAR(2048) → string | ⚠️ 명명 차이 |
| `model_name` | `modelName` | VARCHAR(255) → string | ✅ 일치 (명명만 다름) |
| `type` | ❌ 없음 | ENUM → 없음 | ❌ 누락 (차종) |
| `fuel_type` | `fuelType` | ENUM → string | ⚠️ 타입 차이 |
| `transmission` | ❌ 없음 | ENUM → 없음 | ❌ 누락 (변속기) |
| `color` | `color` | VARCHAR(50) → string | ✅ 일치 |
| `owner_count` | ❌ 없음 | TINYINT → 없음 | ❌ 누락 (소유자 변경 횟수) |
| `inspection_status` | ❌ 없음 | ENUM → 없음 | ⚠️ `status`에 포함 |
| `selling_status` | `status` | ENUM → string | ⚠️ 타입 차이 |
| `manufacturer` | `manufacturer` | ❌ 없음 → string | ✅ 문서에만 있음 |
| `price` | `price` | DECIMAL(10,2) → string | ⚠️ 타입 차이 |
| `highestBid` | `highestBid` | ❌ 없음 → string | ✅ 문서에만 있음 |
| `location` | `location` | ❌ 없음 → string | ✅ 문서에만 있음 |
| `endTime` | `endTime` | ❌ 없음 → string | ✅ 문서에만 있음 |
| `ocrMetadata` | `ocrMetadata` | ❌ 없음 → object | ✅ 문서에만 있음 |
| `publicDataMetadata` | `publicDataMetadata` | ❌ 없음 → object | ✅ 문서에만 있음 |
| `offers` | `offers` | ❌ 없음 → array | ✅ 문서에만 있음 |

**주요 차이점**:
1. **타입 차이**: 이미지는 관계형 DB 타입 (BIGINT, DECIMAL, ENUM), 문서는 NoSQL 타입 (string, number, object)
2. **누락 필드**: `type` (차종), `transmission` (변속기), `owner_count` (소유자 변경 횟수)
3. **추가 필드**: `manufacturer`, `ocrMetadata`, `publicDataMetadata`, `offers` (문서에만 있음)

### 3.2 `vehicle_inspection` vs `inspections`

| 이미지 ERD 필드 | 문서 필드 | 타입 차이 | 비고 |
|----------------|----------|---------|------|
| `inspection_id` | `id` | BIGINT → string | ✅ 일치 (명명만 다름) |
| `vehicle_id` | `vehicleId` | BIGINT → string | ✅ 일치 (명명만 다름) |
| `inspector_id` | `evaluatorId` | BIGINT → string | ✅ 일치 (명명만 다름) |
| `requested_by` | ❌ 없음 | BIGINT → 없음 | ❌ 누락 (신청자 ID) |
| `requested_at` | `createdAt` | DATETIME → Timestamp | ⚠️ 명명 차이 |
| `inspection_date` | `preferredDate` | DATE → string | ⚠️ 명명 차이 |
| `inspection_time` | `preferredTime` | TIME → string | ⚠️ 명명 차이 |
| `address` | `location.address` | VARCHAR(255) → string | ⚠️ 구조 차이 |
| `lat` | `location.coordinates.lat` | DECIMAL(10,7) → number | ⚠️ 구조 차이 |
| `lng` | `location.coordinates.lng` | DECIMAL(10,7) → number | ⚠️ 구조 차이 |
| `memo` | ❌ 없음 | VARCHAR(255) → 없음 | ❌ 누락 |
| `result_url` | `result` (객체) | VARCHAR(2048) → object | ⚠️ 구조 차이 |
| `scheduled_at` | `assignedAt` | DATETIME → Timestamp | ⚠️ 명명 차이 |
| `completed_at` | `completedAt` | DATETIME → Timestamp | ✅ 일치 |
| `status` | `status` | ENUM → string | ⚠️ 타입 차이 |
| `report_url` | `result` (객체) | VARCHAR(2048) → object | ⚠️ 구조 차이 |

**주요 차이점**:
1. **구조 차이**: 이미지는 URL 문자열, 문서는 객체 구조 (`result` 객체)
2. **누락 필드**: `requested_by` (신청자 ID), `memo` (메모)
3. **추가 필드**: `result` (상세 검차 리포트 객체), `mediaMetadata` (문서에만 있음)

### 3.3 `auction` vs `auctions`

| 이미지 ERD 필드 | 문서 필드 | 타입 차이 | 비고 |
|----------------|----------|---------|------|
| `auction_id` | `id` | BIGINT → string | ✅ 일치 (명명만 다름) |
| `listing_id` | ❌ 없음 | BIGINT FK → 없음 | ❌ 누락 (매물 ID) |
| `start_price` | `startPrice` | DECIMAL(10,2) → number | ✅ 일치 (명명만 다름) |
| `current_bid` | `currentHighestBid` | DECIMAL(10,2) → number | ⚠️ 명명 차이 |
| `start_at` | `createdAt` | DATETIME → Timestamp | ⚠️ 명명 차이 |
| `end_at` | `endTime` | DATETIME → Timestamp | ✅ 일치 (명명만 다름) |
| `winning_bid_id` | ❌ 없음 | BIGINT FK → 없음 | ❌ 누락 (낙찰 입찰 ID) |
| `vehicleId` | `vehicleId` | ❌ 없음 → string | ✅ 문서에만 있음 |
| `buyNowPrice` | `buyNowPrice` | ❌ 없음 → number | ✅ 문서에만 있음 |
| `vehicleOwnerId` | `vehicleOwnerId` | ❌ 없음 → string | ✅ 문서에만 있음 |
| `endedAt` | `endedAt` | ❌ 없음 → Timestamp | ✅ 문서에만 있음 |

**주요 차이점**:
1. **누락 필드**: `listing_id` (매물 ID), `winning_bid_id` (낙찰 입찰 ID)
2. **추가 필드**: `vehicleId`, `buyNowPrice`, `vehicleOwnerId`, `endedAt` (문서에만 있음)

### 3.4 `transport` vs `logistics`

| 이미지 ERD 필드 | 문서 필드 | 타입 차이 | 비고 |
|----------------|----------|---------|------|
| `transport_id` | `id` | BIGINT → string | ✅ 일치 (명명만 다름) |
| `order_id` | ❌ 없음 | BIGINT FK → 없음 | ❌ 누락 (주문 ID) |
| `request_time` | `scheduleTime` | TIME → string | ⚠️ 명명 차이 |
| `pick_up_phone_name` | ❌ 없음 | VARCHAR(255) → 없음 | ❌ 누락 |
| `pick_up_phone_num` | `driverPhone` | VARCHAR(20) → string | ⚠️ 구조 차이 |
| `pick_up_lat` | ❌ 없음 | DECIMAL(10,7) → 없음 | ❌ 누락 |
| `pick_up_lng` | ❌ 없음 | DECIMAL(10,7) → 없음 | ❌ 누락 |
| `pick_up_addr` | `departureAddress` | VARCHAR(255) → string | ✅ 일치 (명명만 다름) |
| `drop_off_phone_name` | ❌ 없음 | VARCHAR(255) → 없음 | ❌ 누락 |
| `drop_off_phone_num` | ❌ 없음 | VARCHAR(20) → 없음 | ❌ 누락 |
| `drop_off_lat` | ❌ 없음 | DECIMAL(10,7) → 없음 | ❌ 누락 |
| `drop_off_lng` | ❌ 없음 | DECIMAL(10,7) → 없음 | ❌ 누락 |
| `drop_off_addr` | `destinationAddress` | VARCHAR(255) → string | ✅ 일치 (명명만 다름) |
| `estimated_distance` | ❌ 없음 | DECIMAL(10,2) → 없음 | ❌ 누락 |
| `estimated_cost` | ❌ 없음 | DECIMAL(10,2) → 없음 | ❌ 누락 |
| `transport_status` | `status` | ENUM → string | ⚠️ 타입 차이 |
| `assigned_driver_id` | ❌ 없음 | BIGINT → 없음 | ❌ 누락 |
| `pickup_datetime` | `dispatchedAt` | DATETIME → Timestamp | ⚠️ 명명 차이 |
| `delivery_datetime` | `handoverTimestamp` | DATETIME → Timestamp | ⚠️ 명명 차이 |
| `pickup_date` | `scheduleDate` | DATE → string | ⚠️ 명명 차이 |
| `vehicleId` | `vehicleId` | ❌ 없음 → string | ✅ 문서에만 있음 |
| `driverName` | `driverName` | ❌ 없음 → string | ✅ 문서에만 있음 |
| `pin` | `pin` | ❌ 없음 → string | ✅ 문서에만 있음 |
| `specialNotes` | `specialNotes` | ❌ 없음 → string | ✅ 문서에만 있음 |

**주요 차이점**:
1. **누락 필드**: `order_id`, 픽업/도착지 상세 정보 (담당자 이름, 전화번호, 좌표), 예상 거리/비용, 배정 기사 ID
2. **추가 필드**: `vehicleId`, `driverName`, `pin`, `specialNotes` (문서에만 있음)

---

## 4. 관계 구조 차이 분석

### 4.1 사용자/회원 관리 구조

**이미지 ERD**:
```
user (1) ──< (1) buyer_profile
user (1) ──< (1) seller_profile
user (1) ──< (1) user_profile
user_profile (1) ──< (N) address
```

**문서 ERD**:
```
members (단일 컬렉션)
```

**차이점**:
- 이미지: 정규화된 구조 (user + 프로필 분리)
- 문서: 비정규화된 구조 (members에 모든 정보 통합)

**영향도**: High
- 사용자 역할별 프로필 관리 복잡도 증가
- 구매자/판매자 분리 관리 어려움

### 4.2 차량-매물-주문 관계

**이미지 ERD**:
```
vehicle (1) ──< (1) listing (1) ──< (N) orders (1) ──< (N) payment
vehicle (1) ──< (1) listing (1) ──< (1) auction
```

**문서 ERD**:
```
vehicles (1) ──< (N) trades
vehicles (1) ──< (N) auctions
vehicles (1) ──< (N) settlements
```

**차이점**:
- 이미지: vehicle → listing → orders/payment (계층 구조)
- 문서: vehicles → trades/auctions/settlements (직접 연결)

**영향도**: Critical
- 주문/결제 시스템 누락
- 매물 등록 시스템 누락

### 4.3 차량 미디어/옵션 관계

**이미지 ERD**:
```
vehicle (1) ──< (N) vehicle_media
vehicle (1) ──< (N) vehicle_option
```

**문서 ERD**:
```
vehicles (내장 배열 또는 객체)
```

**차이점**:
- 이미지: 별도 테이블로 관리
- 문서: vehicles 내부에 배열/객체로 관리

**영향도**: Medium
- 미디어/옵션 조회 성능 이슈 가능
- 확장성 제한 가능

### 4.4 탁송/배송 관계

**이미지 ERD**:
```
orders (1) ──< (N) transport
orders (1) ──< (N) shipping
```

**문서 ERD**:
```
vehicles (1) ──< (N) logistics
```

**차이점**:
- 이미지: orders와 연결, transport/shipping 분리
- 문서: vehicles와 직접 연결, logistics 통합

**영향도**: High
- 주문 기반 탁송 관리 불가
- 배송 추적 시스템 누락

---

## 5. 상태 값 및 비즈니스 로직 차이

### 5.1 차량 상태

**이미지 ERD**:
- `inspection_status`: REQUESTED, SCHEDULED, IN_PROGRESS, COMPLETED, FAILED, REJECTED
- `selling_status`: LISTED, AUCTIONED, SOLD, DELETED, DRAFT

**문서 ERD**:
- `status`: draft, inspection, bidding, active_sale, sold, pending_settlement, completed

**차이점**:
- 이미지: 검차 상태와 판매 상태 분리
- 문서: 통합 상태 관리

### 5.2 검차 상태

**이미지 ERD**:
- REQUESTED, SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, FAILED, NO_SHOW, REJECTED

**문서 ERD**:
- pending, assigned, in_progress, completed

**차이점**:
- 이미지: 더 상세한 상태 (CANCELLED, FAILED, NO_SHOW, REJECTED)
- 문서: 기본 상태만 정의

### 5.3 탁송 상태

**이미지 ERD**:
- REQUESTED, MATCHED, PICKUP_DONE, HANDOVER_DONE, CANCELLED, NO_SHOW, DELAYED

**문서 ERD**:
- scheduled, dispatched, in_transit, completed

**차이점**:
- 이미지: 더 상세한 상태 (MATCHED, PICKUP_DONE, HANDOVER_DONE, NO_SHOW, DELAYED)
- 문서: 기본 상태만 정의

---

## 6. 위험도 평가 및 우선순위

### Critical (치명적) - 즉시 반영 필요

| 항목 | 위험도 | 영향 범위 | 보완 난이도 |
|------|--------|----------|------------|
| 주문 시스템 누락 (`orders`) | Critical | 전체 주문 플로우 | 높음 |
| 결제 시스템 누락 (`payment`) | Critical | 결제 처리 불가 | 높음 |
| 매물 등록 시스템 누락 (`listing`) | Critical | 매물 관리 불가 | 중간 |

### High (높음) - 조기 반영 권장

| 항목 | 위험도 | 영향 범위 | 보완 난이도 |
|------|--------|----------|------------|
| 사용자 프로필 구조 차이 | High | 사용자 관리 복잡도 | 중간 |
| 차량 미디어/옵션 관리 구조 | High | 확장성 제한 | 낮음 |
| 주소 관리 구조 차이 | High | 주소 관리 불가 | 낮음 |
| 탁송/배송 시스템 구조 차이 | High | 탁송 관리 불가 | 중간 |

### Medium (중간) - 중기 반영 고려

| 항목 | 위험도 | 영향 범위 | 보완 난이도 |
|------|--------|----------|------------|
| 입찰 시스템 누락 (`auction_bid`) | Medium | 입찰 이력 관리 | 낮음 |
| 리뷰 시스템 누락 (`review`) | Medium | 리뷰 기능 불가 | 낮음 |
| 판매자 문서 관리 누락 (`seller_docs`) | Medium | 문서 승인 플로우 | 낮음 |
| 배송 시스템 누락 (`shipping`) | Medium | 배송 추적 불가 | 낮음 |

### Low (낮음) - 장기 반영 고려

| 항목 | 위험도 | 영향 범위 | 보완 난이도 |
|------|--------|----------|------------|
| 포트 정보 누락 (`port`) | Low | 국제 배송 시에만 필요 | 낮음 |
| 기본 엔티티 상속 구조 | Low | 코드 중복 증가 | 낮음 |

---

## 7. 보완 제안 및 권장 사항

### 7.1 즉시 반영 필요 항목

#### 7.1.1 주문 시스템 추가
```typescript
// 컬렉션: orders/{orderId}
interface Order {
  id: string;
  buyerId: string;              // members.id 참조
  listingId?: string;            // listings.id 참조 (향후)
  vehicleId: string;             // vehicles.id 참조
  orderType: 'BUY_NOW' | 'AUCTION' | 'REQUEST';
  orderStatus: 'PENDING' | 'COMPLETED' | 'CANCELLED' | 'REFUNDED';
  finalPrice: number;
  orderDate: Timestamp;
  winningBidId?: string;         // auction_bid.id 참조
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### 7.1.2 결제 시스템 추가
```typescript
// 컬렉션: payments/{paymentId}
interface Payment {
  id: string;
  orderId: string;               // orders.id 참조
  paymentMethod: 'CREDIT_CARD' | 'BANK_TRANSFER' | 'TOSSPAY' | 'KAKAOPAY' | 'NAVERPAY';
  amount: number;
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  paidAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### 7.1.3 매물 등록 시스템 추가
```typescript
// 컬렉션: listings/{listingId}
interface Listing {
  id: string;
  sellerId: string;               // members.id 참조
  vehicleId: string;              // vehicles.id 참조 (UNIQUE)
  sellingMethod: 'FIXED_PRICE' | 'AUCTION';
  price?: number;
  startDate?: string;
  endDate?: string;
  warrantyServiceProvided: boolean;
  preInspectionRequired: boolean;
  description?: string;
  viewCount: number;
  interestCount: number;
  commissionRate: number;
  additionalCost: number;
  taxRate: number;
  preTransactionCost: number;
  leadTimeDays: number;
  deliveryOption: 'PICKUP' | 'DELIVERY';
  status: 'DRAFT' | 'PENDING' | 'ACTIVE' | 'EXPIRED' | 'SOLD' | 'CANCELLED';
  auctionId?: string;            // auctions.id 참조
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 7.2 조기 반영 권장 항목

#### 7.2.1 사용자 프로필 구조 개선
```typescript
// members 컬렉션 분리 또는 확장
interface Member {
  id: string;
  email: string;
  password: string;
  userType: 'BUYER' | 'SELLER' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'DELETED';
  // 프로필 정보는 서브컬렉션 또는 객체로 관리
  buyerProfile?: BuyerProfile;
  sellerProfile?: SellerProfile;
  userProfile?: UserProfile;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 서브컬렉션: members/{memberId}/addresses/{addressId}
interface Address {
  id: string;
  addressType: 'HOME' | 'OFFICE' | 'OTHER';
  postCode: string;
  streetAddress: string;
  detailAddress?: string;
  city: string;
  district: string;
  country: string;
  lat?: number;
  lng?: number;
  geoEncodingApi?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

#### 7.2.2 차량 미디어/옵션 서브컬렉션 추가
```typescript
// 서브컬렉션: vehicles/{vehicleId}/media/{mediaId}
interface VehicleMedia {
  id: string;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
  description?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// 서브컬렉션: vehicles/{vehicleId}/options/{optionId}
interface VehicleOption {
  id: string;
  optionName: string;
  optionValue: boolean;
  description?: string;
}
```

### 7.3 중기 반영 고려 항목

#### 7.3.1 입찰 시스템 추가
```typescript
// 서브컬렉션: auctions/{auctionId}/bids/{bidId}
interface AuctionBid {
  id: string;
  buyerId: string;               // members.id 참조
  bidPrice: number;
  bidAt: Timestamp;
  status: 'ACTIVE' | 'CANCELLED' | 'OUTBID';
  createdAt: Timestamp;
}
```

#### 7.3.2 리뷰 시스템 추가
```typescript
// 컬렉션: reviews/{reviewId}
interface Review {
  id: string;
  orderId: string;                // orders.id 참조
  reviewerId: string;              // members.id 참조
  revieweeId: string;              // members.id 참조
  rating: number;                  // 1-5
  comment?: string;
  reviewType: 'SELLER' | 'BUYER' | 'VEHICLE';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### 7.4 문서 업데이트 권장 사항

1. **DATABASE_ERD_SCHEMA.md 업데이트**:
   - 누락된 엔티티 추가 (orders, payments, listings 등)
   - 필드명 및 타입 정합성 확보
   - 관계 구조 명확화

2. **마이그레이션 가이드 추가**:
   - 기존 데이터 마이그레이션 전략
   - 스키마 변경 시나리오

3. **API 명세서 업데이트**:
   - 새로운 엔티티 관련 API 엔드포인트 추가
   - 상태 전이 규칙 명시

---

## 8. 결론

### 8.1 전체 평가

이미지 ERD와 문서 ERD 간에는 **근본적인 아키텍처 차이**가 존재합니다:
- 이미지 ERD: 관계형 데이터베이스 설계 (정규화, FK 관계)
- 문서 ERD: NoSQL 데이터베이스 설계 (비정규화, 참조 ID)

### 8.2 주요 갭

1. **주문/결제 시스템**: 완전 누락 (Critical)
2. **매물 등록 시스템**: 완전 누락 (Critical)
3. **사용자 프로필 구조**: 구조적 차이 (High)
4. **차량 미디어/옵션 관리**: 구조적 차이 (High)
5. **주소 관리**: 완전 누락 (High)

### 8.3 권장 조치

1. **즉시 조치**: 주문/결제/매물 시스템 추가
2. **단기 조치**: 사용자 프로필 구조 개선, 차량 미디어/옵션 서브컬렉션 추가
3. **중기 조치**: 입찰/리뷰/문서 관리 시스템 추가
4. **장기 조치**: 국제 배송 확장 시 포트 정보 추가

### 8.4 다음 단계

1. 비즈니스 요구사항 재검토
2. 우선순위별 구현 계획 수립
3. 스키마 마이그레이션 전략 수립
4. 문서 업데이트 및 동기화

---

**보고서 작성 완료일**: 2026-01-28  
**다음 검토 일자**: 스키마 업데이트 후 재검토 권장
