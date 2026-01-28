# 데이터베이스 ERD 스키마 명세서

**프로젝트**: ForwardMax (carivdealer)
**버전**: 2.0
**최종 업데이트**: 2026-01-28
**원본 ERD**: `erd/IMG_3923.png`
**검증 상태**: 원본 ERD 기반 재작성

---

## 목차

1. [개요](#1-개요)
2. [ERD 다이어그램](#2-erd-다이어그램)
3. [엔티티 상세 명세](#3-엔티티-상세-명세)
4. [관계 정의](#4-관계-정의)
5. [인덱스 전략](#5-인덱스-전략)
6. [Firestore 컬렉션 매핑](#6-firestore-컬렉션-매핑)

---

## 1. 개요

### 1.1 데이터베이스 아키텍처

- **데이터베이스**: Firestore (NoSQL 문서 기반)
- **리전**: `asia-northeast3` (서울)
- **원본 ERD**: `erd/IMG_3923.png`

### 1.2 설계 원칙

1. **비정규화 허용**: 조회 성능을 위해 일부 데이터 중복 허용
2. **참조 관계**: 참조 ID를 통한 관계 관리
3. **타임스탬프 필수**: 모든 엔티티에 `created_at`, `updated_at` 포함
4. **소프트 삭제**: 물리 삭제 대신 상태 변경 우선

### 1.3 엔티티 목록 (원본 ERD 기준)

총 **21개 테이블**:

| 카테고리 | 테이블명 | 설명 |
|---------|---------|------|
| **사용자** | `user` | 사용자 기본 정보 |
| | `buyer_profile` | 구매자 프로필 |
| | `seller_profile` | 판매자 프로필 |
| | `seller` | 판매자 정보 |
| | `seller_docs` | 판매자 서류 |
| | `address` | 주소 정보 |
| **차량** | `vehicle` | 차량 정보 |
| | `vehicle_media` | 차량 이미지/동영상 |
| | `vehicle_option` | 차량 옵션 |
| **검차** | `vehicle_inspection` | 차량 검사 |
| **거래** | `listing` | 매물 등록 |
| | `auction` | 경매 |
| | `auction_bid` | 경매 입찰 |
| | `order` | 주문 |
| | `payment` | 결제 |
| **물류** | `delivery` | 배송/탁송 |
| **정산** | `settlement` | 정산 |
| **리뷰** | `review` | 리뷰 |
| **외부연동** | `CarsOfKorea_vehicle` | 카스오브코리아 차량 |
| | `CarsOfKorea_listing` | 카스오브코리아 매물 |
| | `CarsOfKorea_auction` | 카스오브코리아 경매 |
| | `CarsOfKorea_auction_bid` | 카스오브코리아 입찰 |

---

## 2. ERD 다이어그램

### 2.1 핵심 엔티티 관계

```
┌─────────────┐     1:1     ┌─────────────────┐
│    user     │◄───────────►│  buyer_profile  │
│  (사용자)   │             └─────────────────┘
└──────┬──────┘
       │ 1:1
       ▼
┌─────────────────┐     1:N     ┌─────────────┐
│ seller_profile  │◄───────────►│   seller    │
└─────────────────┘             └──────┬──────┘
                                       │ 1:N
                                       ▼
┌─────────────┐     1:N     ┌─────────────┐     1:N     ┌─────────────┐
│   address   │◄───────────►│   vehicle   │◄───────────►│   listing   │
└─────────────┘             └──────┬──────┘             └──────┬──────┘
                                   │                           │
                    ┌──────────────┼──────────────┐            │
                    │              │              │            │
                    ▼ 1:N         ▼ 1:N         ▼ 1:1        │
          ┌─────────────┐ ┌─────────────┐ ┌─────────────┐     │
          │vehicle_media│ │vehicle_option│ │vehicle_     │     │
          └─────────────┘ └─────────────┘ │ inspection  │     │
                                          └─────────────┘     │
                                                              │
       ┌──────────────────────────────────────────────────────┘
       │
       ▼ 1:1
┌─────────────┐     1:N     ┌─────────────┐
│   auction   │◄───────────►│ auction_bid │
└──────┬──────┘             └─────────────┘
       │ 1:1
       ▼
┌─────────────┐     1:1     ┌─────────────┐     1:1     ┌─────────────┐
│    order    │◄───────────►│   payment   │◄───────────►│  delivery   │
└──────┬──────┘             └─────────────┘             └─────────────┘
       │ 1:1
       ▼
┌─────────────┐
│ settlement  │
└─────────────┘
```

### 2.2 상태 전이 다이어그램

**Listing 상태**:
```
ACTIVE → SOLD | CANCELLED | EXPIRED
```

**Order 상태**:
```
PENDING → CONFIRMED → COMPLETED | CANCELLED
```

**Payment 상태**:
```
PENDING → COMPLETED | FAILED | REFUNDED
```

**Delivery 상태**:
```
REQUESTED → MATCHED → PICKUP_DONE → HANDOVER_DONE → CANCELLED | NO_SHOW | DELAYED
```

---

## 3. 엔티티 상세 명세

### 3.1 User (사용자)

```typescript
interface User {
  id: string;                    // PK, UUID
  provider: string;              // 인증 제공자 (GOOGLE, KAKAO, APPLE 등)
  status: UserStatus;            // 상태
  phone_first: string;           // 전화번호 앞자리
  phone_middle: string;          // 전화번호 중간
  phone_last: string;            // 전화번호 뒷자리
  email: string;                 // 이메일
  staff_perm_lv: number;         // 직원 권한 레벨
  staff_address: string;         // 직원 주소
  created_at: Timestamp;         // 생성일
  updated_at: Timestamp;         // 수정일
  deleted_at?: Timestamp;        // 삭제일 (soft delete)
  privacy_data: string;          // 개인정보 (암호화)
}

type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'WITHDRAWN';
```

### 3.2 Buyer Profile (구매자 프로필)

```typescript
interface BuyerProfile {
  id: string;                    // PK
  user_id: string;               // FK → user.id
  nickname: string;              // 닉네임
  profile_image?: string;        // 프로필 이미지 URL
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

### 3.3 Seller Profile (판매자 프로필)

```typescript
interface SellerProfile {
  id: string;                    // PK
  user_id: string;               // FK → user.id
  business_type: BusinessType;   // 사업자 유형
  dealer_name: string;           // 상사명
  created_at: Timestamp;
  updated_at: Timestamp;
}

type BusinessType = 'INDIVIDUAL' | 'CORPORATE';
```

### 3.4 Seller (판매자)

```typescript
interface Seller {
  id: string;                    // PK
  seller_profile_id: string;     // FK → seller_profile.id
  business_number: string;       // 사업자등록번호
  ceo_name: string;              // 대표자명
  business_address: string;      // 사업장 주소
  dealer_association: string;    // 매매조합
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

### 3.5 Seller Docs (판매자 서류)

```typescript
interface SellerDocs {
  id: string;                    // PK
  seller_id: string;             // FK → seller.id
  doc_type: DocType;             // 서류 유형
  file_url: string;              // 파일 URL
  status: DocStatus;             // 상태
  created_at: Timestamp;
  updated_at: Timestamp;
}

type DocType = 'BUSINESS_LICENSE' | 'DEALER_LICENSE' | 'ID_CARD';
type DocStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
```

### 3.6 Address (주소)

```typescript
interface Address {
  id: string;                    // PK
  user_id: string;               // FK → user.id
  address_type: AddressType;     // 주소 유형
  postal_code: string;           // 우편번호
  address1: string;              // 기본주소
  address2?: string;             // 상세주소
  is_default: boolean;           // 기본 주소 여부
  created_at: Timestamp;
  updated_at: Timestamp;
}

type AddressType = 'HOME' | 'WORK' | 'DEALER';
```

### 3.7 Vehicle (차량)

```typescript
interface Vehicle {
  id: string;                    // PK
  seller_id: string;             // FK → seller.id
  vehicle_number: string;        // 차량번호
  vin: string;                   // 차대번호
  manufacturer: string;          // 제조사
  model_name: string;            // 모델명
  model_year: number;            // 연식
  mileage: number;               // 주행거리
  fuel_type: FuelType;           // 연료 타입
  transmission: Transmission;    // 변속기
  color: string;                 // 색상
  body_type: BodyType;           // 차체 형태
  engine_cc: number;             // 배기량
  seats: number;                 // 좌석수
  accident_history: string;      // 사고이력
  options: string[];             // 옵션 목록
  status: VehicleStatus;         // 상태
  created_at: Timestamp;
  updated_at: Timestamp;
}

type FuelType = 'GASOLINE' | 'DIESEL' | 'HYBRID' | 'ELECTRIC' | 'LPG' | 'ETC';
type Transmission = 'AT' | 'MT' | 'CVT' | 'DCT' | 'ETC';
type BodyType = 'SEDAN' | 'SUV' | 'HATCHBACK' | 'COUPE' | 'WAGON' | 'VAN' | 'TRUCK' | 'ETC';
type VehicleStatus = 'DRAFT' | 'ACTIVE' | 'LISTED' | 'SOLD' | 'HIDDEN';
```

### 3.8 Vehicle Media (차량 미디어)

```typescript
interface VehicleMedia {
  id: string;                    // PK
  vehicle_id: string;            // FK → vehicle.id
  media_type: MediaType;         // 미디어 유형
  url: string;                   // 파일 URL
  sort_order: number;            // 정렬 순서
  created_at: Timestamp;
}

type MediaType = 'IMAGE' | 'VIDEO';
```

### 3.9 Vehicle Option (차량 옵션)

```typescript
interface VehicleOption {
  id: string;                    // PK
  vehicle_id: string;            // FK → vehicle.id
  option_name: string;           // 옵션명
  option_category: string;       // 옵션 카테고리
  created_at: Timestamp;
}
```

### 3.10 Vehicle Inspection (차량 검사)

```typescript
interface VehicleInspection {
  id: string;                    // PK
  vehicle_id: string;            // FK → vehicle.id
  inspector_id: string;          // FK → user.id (검사원)
  inspection_date: Timestamp;    // 검사일
  location: string;              // 검사 장소
  mileage: number;               // 검사 시 주행거리
  grade: InspectionGrade;        // 검사 등급
  status: InspectionStatus;      // 상태
  exterior_score: number;        // 외관 점수
  interior_score: number;        // 내부 점수
  mechanical_score: number;      // 기계 점수
  total_score: number;           // 총점
  report_url?: string;           // 리포트 URL
  comments?: string;             // 코멘트
  created_at: Timestamp;
  updated_at: Timestamp;
}

type InspectionGrade = 'A' | 'B' | 'C' | 'D' | 'F';
type InspectionStatus = 'DONE' | 'REQUESTED' | 'SCHEDULED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'FAILED' | 'NO_SHOW';
```

### 3.11 Listing (매물 등록)

```typescript
interface Listing {
  id: string;                    // PK
  vehicle_id: string;            // FK → vehicle.id
  seller_id: string;             // FK → seller.id
  sale_type: SaleType;           // 판매 유형
  asking_price: number;          // 희망가
  min_price?: number;            // 최소가 (경매용)
  buy_now_price?: number;        // 즉시구매가 (경매용)
  status: ListingStatus;         // 상태
  view_count: number;            // 조회수
  like_count: number;            // 좋아요수
  expires_at?: Timestamp;        // 만료일
  created_at: Timestamp;
  updated_at: Timestamp;
}

type SaleType = 'AUCTION' | 'GENERAL';
type ListingStatus = 'ACTIVE' | 'SOLD' | 'CANCELLED' | 'EXPIRED';
```

### 3.12 Auction (경매)

```typescript
interface Auction {
  id: string;                    // PK
  listing_id: string;            // FK → listing.id
  start_price: number;           // 시작가
  current_price: number;         // 현재가
  buy_now_price?: number;        // 즉시구매가
  bid_increment: number;         // 입찰 단위
  bid_count: number;             // 입찰 횟수
  start_time: Timestamp;         // 경매 시작 시간
  end_time: Timestamp;           // 경매 종료 시간
  status: AuctionStatus;         // 상태
  winner_id?: string;            // 낙찰자 ID
  final_price?: number;          // 낙찰가
  created_at: Timestamp;
  updated_at: Timestamp;
}

type AuctionStatus = 'SCHEDULED' | 'ACTIVE' | 'ENDED' | 'CANCELLED' | 'NO_BID';
```

### 3.13 Auction Bid (경매 입찰)

```typescript
interface AuctionBid {
  id: string;                    // PK
  auction_id: string;            // FK → auction.id
  bidder_id: string;             // FK → user.id
  bid_amount: number;            // 입찰금액
  is_winner: boolean;            // 낙찰 여부
  created_at: Timestamp;
}
```

### 3.14 Order (주문)

```typescript
interface Order {
  id: string;                    // PK
  listing_id: string;            // FK → listing.id
  buyer_id: string;              // FK → user.id
  seller_id: string;             // FK → seller.id
  vehicle_id: string;            // FK → vehicle.id
  order_type: OrderType;         // 주문 유형
  total_price: number;           // 총 금액
  status: OrderStatus;           // 상태
  created_at: Timestamp;
  updated_at: Timestamp;
}

type OrderType = 'AUCTION' | 'GENERAL' | 'BUY_NOW';
type OrderStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
```

### 3.15 Payment (결제)

```typescript
interface Payment {
  id: string;                    // PK
  order_id: string;              // FK → order.id
  amount: number;                // 결제 금액
  method: PaymentMethod;         // 결제 수단
  status: PaymentStatus;         // 상태
  pg_provider?: string;          // PG사
  pg_transaction_id?: string;    // PG 거래 ID
  paid_at?: Timestamp;           // 결제 완료 시간
  refunded_at?: Timestamp;       // 환불 시간
  created_at: Timestamp;
  updated_at: Timestamp;
}

type PaymentMethod = 'CARD' | 'BANK_TRANSFER' | 'VIRTUAL_ACCOUNT' | 'ESCROW';
type PaymentStatus = 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED' | 'PARTIAL_REFUND';
```

### 3.16 Delivery (배송/탁송)

```typescript
interface Delivery {
  id: string;                    // PK
  order_id: string;              // FK → order.id
  vehicle_id: string;            // FK → vehicle.id
  driver_id?: string;            // FK → user.id (기사)
  pickup_address: string;        // 픽업 주소
  delivery_address: string;      // 배송 주소
  pickup_lat?: number;           // 픽업 위도
  pickup_lng?: number;           // 픽업 경도
  delivery_lat?: number;         // 배송 위도
  delivery_lng?: number;         // 배송 경도
  distance_km?: number;          // 거리 (km)
  fee: number;                   // 탁송비
  scheduled_date?: Timestamp;    // 예정일
  pickup_date?: Timestamp;       // 픽업 완료일
  delivery_date?: Timestamp;     // 배송 완료일
  status: DeliveryStatus;        // 상태
  pin?: string;                  // 인계 PIN
  vehicle_condition?: string;    // 차량 상태
  notes?: string;                // 메모
  created_at: Timestamp;
  updated_at: Timestamp;
}

type DeliveryStatus = 'REQUESTED' | 'MATCHED' | 'PICKUP_DONE' | 'HANDOVER_DONE' | 'CANCELLED' | 'NO_SHOW' | 'DELAYED';
```

### 3.17 Settlement (정산)

```typescript
interface Settlement {
  id: string;                    // PK
  order_id: string;              // FK → order.id
  seller_id: string;             // FK → seller.id
  vehicle_price: number;         // 차량가
  delivery_fee: number;          // 탁송비
  platform_fee: number;          // 플랫폼 수수료
  inspection_fee: number;        // 검차비
  total_amount: number;          // 총 정산액
  settlement_amount: number;     // 판매자 정산액
  bank_name: string;             // 은행명
  account_number: string;        // 계좌번호
  account_holder: string;        // 예금주
  status: SettlementStatus;      // 상태
  settled_at?: Timestamp;        // 정산 완료일
  created_at: Timestamp;
  updated_at: Timestamp;
}

type SettlementStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
```

### 3.18 Review (리뷰)

```typescript
interface Review {
  id: string;                    // PK
  order_id: string;              // FK → order.id
  reviewer_id: string;           // FK → user.id
  reviewee_id: string;           // FK → user.id (판매자 또는 구매자)
  rating: number;                // 평점 (1-5)
  content?: string;              // 리뷰 내용
  created_at: Timestamp;
  updated_at: Timestamp;
}
```

### 3.19 CarsOfKorea 연동 테이블

외부 플랫폼(카스오브코리아) 연동용 테이블:

```typescript
interface CarsOfKoreaVehicle {
  id: string;
  external_id: string;           // 외부 시스템 ID
  vehicle_id: string;            // FK → vehicle.id
  sync_status: SyncStatus;
  last_synced_at: Timestamp;
  created_at: Timestamp;
  updated_at: Timestamp;
}

interface CarsOfKoreaListing {
  id: string;
  external_id: string;
  listing_id: string;            // FK → listing.id
  sync_status: SyncStatus;
  last_synced_at: Timestamp;
  created_at: Timestamp;
  updated_at: Timestamp;
}

interface CarsOfKoreaAuction {
  id: string;
  external_id: string;
  auction_id: string;            // FK → auction.id
  sync_status: SyncStatus;
  last_synced_at: Timestamp;
  created_at: Timestamp;
  updated_at: Timestamp;
}

interface CarsOfKoreaAuctionBid {
  id: string;
  external_id: string;
  auction_bid_id: string;        // FK → auction_bid.id
  sync_status: SyncStatus;
  last_synced_at: Timestamp;
  created_at: Timestamp;
}

type SyncStatus = 'SYNCED' | 'PENDING' | 'FAILED';
```

---

## 4. 관계 정의

### 4.1 주요 관계

| 부모 테이블 | 자식 테이블 | 관계 | FK 필드 |
|------------|------------|------|---------|
| user | buyer_profile | 1:1 | user_id |
| user | seller_profile | 1:1 | user_id |
| user | address | 1:N | user_id |
| seller_profile | seller | 1:N | seller_profile_id |
| seller | seller_docs | 1:N | seller_id |
| seller | vehicle | 1:N | seller_id |
| vehicle | vehicle_media | 1:N | vehicle_id |
| vehicle | vehicle_option | 1:N | vehicle_id |
| vehicle | vehicle_inspection | 1:1 | vehicle_id |
| vehicle | listing | 1:N | vehicle_id |
| listing | auction | 1:1 | listing_id |
| auction | auction_bid | 1:N | auction_id |
| listing | order | 1:1 | listing_id |
| order | payment | 1:1 | order_id |
| order | delivery | 1:1 | order_id |
| order | settlement | 1:1 | order_id |
| order | review | 1:N | order_id |

---

## 5. 인덱스 전략

### 5.1 복합 인덱스

```
vehicles: [seller_id, status, created_at DESC]
listings: [sale_type, status, created_at DESC]
auctions: [status, end_time ASC]
orders: [buyer_id, status, created_at DESC]
orders: [seller_id, status, created_at DESC]
deliveries: [driver_id, status, scheduled_date ASC]
settlements: [seller_id, status, created_at DESC]
```

---

## 6. Firestore 컬렉션 매핑

### 6.1 현재 코드베이스 매핑

| 원본 ERD 테이블 | Firestore 컬렉션 | 상태 |
|----------------|-----------------|------|
| user | `members` | 리네임 필요 |
| buyer_profile | (members에 내장) | 분리 권장 |
| seller_profile | (members에 내장) | 분리 권장 |
| seller | (members에 내장) | 분리 권장 |
| seller_docs | ❌ 미구현 | 신규 필요 |
| address | ❌ 미구현 | 신규 필요 |
| vehicle | `vehicles` | ✅ 일치 |
| vehicle_media | (vehicles에 내장) | 분리 고려 |
| vehicle_option | (vehicles에 내장) | 분리 고려 |
| vehicle_inspection | `inspections` | ✅ 일치 |
| listing | `trades` | 리네임 권장 |
| auction | `auctions` | ✅ 일치 |
| auction_bid | (auctions 서브컬렉션) | 분리 권장 |
| order | ❌ 미구현 | 신규 필요 (Critical) |
| payment | ❌ 미구현 | 신규 필요 (Critical) |
| delivery | `logistics` | 리네임 권장 |
| settlement | `settlements` | ✅ 일치 |
| review | ❌ 미구현 | 신규 필요 |
| CarsOfKorea_* | ❌ 미구현 | Phase 2+ |

### 6.2 마이그레이션 우선순위

**Critical (즉시 구현):**
1. `order` 컬렉션 신규 생성
2. `payment` 컬렉션 신규 생성

**High (조기 구현):**
3. `listing` 컬렉션 (trades → listing 리네임 또는 신규)
4. `address` 컬렉션 신규 생성
5. 사용자 구조 분리 (user, buyer_profile, seller_profile, seller)

**Medium (중기 구현):**
6. `auction_bid` 서브컬렉션 분리
7. `review` 컬렉션 신규 생성
8. `seller_docs` 컬렉션 신규 생성

**Low (장기 구현):**
9. CarsOfKorea 연동 테이블들

---

**문서 끝**
