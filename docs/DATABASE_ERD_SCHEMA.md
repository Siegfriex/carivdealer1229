# 데이터베이스 ERD 스키마 명세서

**프로젝트**: ForwardMax (carivdealer)  
**버전**: 1.0  
**최종 업데이트**: 2026-01-26  
**작성자**: 개발팀  
**검증 상태**: 코드베이스 기반 검증 완료

---

## 목차

1. [개요](#1-개요)
2. [ERD 다이어그램](#2-erd-다이어그램)
3. [엔티티 상세 명세](#3-엔티티-상세-명세)
4. [관계 정의](#4-관계-정의)
5. [인덱스 전략](#5-인덱스-전략)
6. [데이터 무결성 규칙](#6-데이터-무결성-규칙)
7. [테스트 시나리오](#7-테스트-시나리오)
8. [마이그레이션 가이드](#8-마이그레이션-가이드)

---

## 1. 개요

### 1.1 데이터베이스 아키텍처

- **데이터베이스**: Firestore (NoSQL 문서 기반)
- **리전**: `asia-northeast3` (서울)
- **보안 모드**: 테스트 모드 (2026-01-29까지)
- **백업**: Firebase 자동 백업 활성화

### 1.2 설계 원칙

1. **비정규화 허용**: 조회 성능을 위해 일부 데이터 중복 허용
2. **참조 관계 최소화**: 서브컬렉션보다 참조 ID 우선
3. **인덱스 최적화**: 쿼리 패턴 기반 복합 인덱스 구성
4. **타임스탬프 필수**: 모든 엔티티에 `createdAt`, `updatedAt` 포함
5. **소프트 삭제**: 물리 삭제 대신 상태 변경 우선

### 1.3 컬렉션 목록

총 **7개 컬렉션** + **3개 서브컬렉션**:

**주 컬렉션**:
1. `members` - 회원 정보
2. `vehicles` - 차량 정보
3. `inspections` - 검차 정보
4. `auctions` - 경매 정보
5. `trades` - 거래/제안 정보
6. `logistics` - 탁송 정보
7. `settlements` - 정산 정보

**서브컬렉션** (향후 확장):
- `vehicles/{vehicleId}/bids` - 입찰 내역
- `vehicles/{vehicleId}/offers` - 일반 판매 제안
- `members/{memberId}/notifications` - 알림

**향후 추가 예정**:
- `reports` - 검차 리포트 (현재 inspections.result에 포함)
- `systemLogs` - 시스템 로그
- `notifications` - 전역 알림

---

## 2. ERD 다이어그램

### 2.1 핵심 엔티티 관계

```
┌─────────────┐
│   Members   │
│  (회원)     │
└──────┬──────┘
       │ 1
       │ owns
       │
       │ N
┌──────▼──────┐      1:N      ┌──────────────┐
│  Vehicles   ├───────────────►│ Inspections  │
│  (차량)     │                │  (검차)      │
└──────┬──────┘                └──────────────┘
       │
       │ 1:N
       ├───────────────────┬───────────────┬──────────────┐
       │                   │               │              │
       ▼ N                 ▼ N             ▼ N            ▼ N
┌─────────────┐    ┌─────────────┐  ┌──────────┐  ┌──────────────┐
│  Auctions   │    │   Trades    │  │Logistics │  │ Settlements  │
│  (경매)     │    │  (거래)     │  │ (탁송)   │  │   (정산)     │
└─────────────┘    └─────────────┘  └──────────┘  └──────────────┘
```

### 2.2 상태 전이 다이어그램

**차량 상태 전이**:
```
draft → inspection → (bidding | active_sale) → sold → pending_settlement → completed
```

**검차 상태 전이**:
```
pending → assigned → in_progress → completed
```

**경매 상태 전이**:
```
Active → (Ended | Sold)
```

**탁송 상태 전이**:
```
scheduled → dispatched → in_transit → completed
```

---

## 3. 엔티티 상세 명세

### 3.1 Members (회원)

**컬렉션 경로**: `members/{memberId}`

#### 필드 정의

| 필드명 | 타입 | 필수 | 인덱스 | 설명 | 검증 규칙 |
|--------|------|------|--------|------|-----------|
| `id` | string | ✅ | PK | 회원 고유 식별자 | UUID v4 형식 |
| `email` | string | ✅ | ✅ | 이메일 주소 | 이메일 형식 검증 |
| `password` | string | ✅ | ❌ | 비밀번호 (암호화) | bcrypt hash |
| `dealerName` | string | ✅ | ❌ | 딜러명 | 최소 2자 이상 |
| `phone` | string | ✅ | ❌ | 전화번호 | 010-XXXX-XXXX 형식 |
| `role` | string | ❌ | ✅ | 역할 | `DEALER`, `INSPECTOR`, `ADMIN` |
| `businessInfo` | object | ❌ | ❌ | 사업자 정보 | 아래 참조 |
| `status` | string | ❌ | ❌ | 회원 상태 | `active`, `suspended`, `withdrawn` |
| `createdAt` | Timestamp | ✅ | ✅ | 생성 일시 | 자동 생성 |
| `updatedAt` | Timestamp | ✅ | ❌ | 최종 업데이트 일시 | 자동 갱신 |

#### businessInfo 객체 구조

```typescript
{
  companyName: string;          // 회사명
  businessRegNo: string;        // 사업자등록번호 (XXX-XX-XXXXX)
  representativeName: string;   // 대표자명
  verified: boolean;            // 인증 여부
  verifiedAt?: Timestamp;       // 인증 일시
}
```

#### 제약 조건

- `email`은 고유해야 함 (중복 불가)
- `businessRegNo`는 사업자 인증 시 고유해야 함
- `password`는 최소 8자 이상, 영문+숫자+특수문자 조합
- `role`이 `DEALER`인 경우 `businessInfo` 필수

#### 인덱스

- 단일 필드 인덱스: `email` (자동 생성)
- 복합 인덱스: `role` + `createdAt` (DESC)

---

### 3.2 Vehicles (차량)

**컬렉션 경로**: `vehicles/{vehicleId}`

#### 필드 정의

| 필드명 | 타입 | 필수 | 인덱스 | 설명 | 검증 규칙 |
|--------|------|------|--------|------|-----------|
| `id` | string | ✅ | PK | 차량 고유 식별자 | `v-{숫자}` 형식 |
| `status` | string | ✅ | ✅ | 차량 상태 | 상태 값 상세 참조 |
| `plateNumber` | string | ✅ | ✅ | 차량번호 | XX가 XXXX 형식 |
| `vin` | string | ❌ | ✅ | 차대번호 | 17자리 영숫자 |
| `manufacturer` | string | ✅ | ❌ | 제조사 | 예: Hyundai, Kia |
| `modelName` | string | ✅ | ❌ | 모델명 | 예: Porter II |
| `modelYear` | string | ✅ | ❌ | 연식 | YYYY 형식 |
| `mileage` | string | ✅ | ❌ | 주행거리 (km) | 숫자 문자열 |
| `fuelType` | string | ❌ | ❌ | 연료 종류 | 가솔린, 디젤, 하이브리드, 전기 |
| `color` | string | ❌ | ❌ | 색상 | 한글 또는 영문 |
| `registrationDate` | string | ❌ | ❌ | 등록일자 | YYYY-MM-DD 형식 |
| `price` | string | ❌ | ❌ | 판매가격 (만원) | 숫자 문자열 |
| `highestBid` | string | ❌ | ❌ | 최고 입찰가 | 숫자 문자열 (경매용) |
| `thumbnailUrl` | string | ❌ | ❌ | 썸네일 이미지 URL | HTTPS URL |
| `location` | string | ❌ | ❌ | 차량 위치 | 주소 또는 도시명 |
| `endTime` | string | ❌ | ❌ | 경매 종료 시간 | ISO 8601 형식 |
| `ownerId` | string | ❌ | ✅ | 소유자 ID | members.id 참조 |
| `inspectionId` | string | ❌ | ✅ | 검차 ID | inspections.id 참조 |
| `auctionId` | string | ❌ | ✅ | 경매 ID | auctions.id 참조 |
| `offers` | array | ❌ | ❌ | 일반 판매 제안 목록 | Offer[] 형식 |
| `ocrMetadata` | object | ❌ | ❌ | OCR 메타데이터 | 아래 참조 |
| `publicDataMetadata` | object | ❌ | ❌ | 공공데이터 메타데이터 | 아래 참조 |
| `createdAt` | Timestamp | ✅ | ✅ | 생성 일시 | 자동 생성 |
| `updatedAt` | Timestamp | ✅ | ✅ | 최종 업데이트 일시 | 자동 갱신 |

#### 상태 값 상세

- `draft`: 임시 저장 상태
- `inspection`: 검차 진행 중
- `bidding`: 경매 진행 중
- `active_sale`: 일반 판매 활성화
- `sold`: 판매 완료
- `pending_settlement`: 정산 대기
- `completed`: 거래 완료

#### ocrMetadata 객체 구조

```typescript
{
  extractedAt: Timestamp;       // OCR 추출 일시
  ocrVersion?: string;          // OCR 모델 버전
  confidence?: number;          // OCR 신뢰도 (0-100)
}
```

#### publicDataMetadata 객체 구조

```typescript
{
  lastQueriedAt?: Timestamp;    // 마지막 조회 일시
  queryParams?: {
    registYy?: string;          // 등록년
    registMt?: string;          // 등록월
    useFuelCode?: string;       // 사용연료코드
  };
}
```

#### offers 배열 항목 구조

```typescript
{
  id: string;                   // 제안 고유 ID
  bidderName: string;           // 입찰자명
  amount: string;               // 제안 금액
  date: string;                 // 제안 날짜 (ISO 8601)
  status: 'pending' | 'accepted' | 'rejected';
}
```

#### 제약 조건

- `plateNumber`는 고유해야 함 (중복 불가)
- `vin`은 제공 시 고유해야 함
- `status`가 `bidding`인 경우 `auctionId` 필수
- `status`가 `inspection`인 경우 `inspectionId` 필수
- `price`는 양수여야 함

#### 인덱스

- 복합 인덱스 1: `ownerId` + `status` + `updatedAt` (DESC)
- 복합 인덱스 2: `status` + `createdAt` (DESC)
- 단일 필드 인덱스: `plateNumber`, `vin`, `inspectionId`, `auctionId` (자동 생성)

---

### 3.3 Inspections (검차)

**컬렉션 경로**: `inspections/{inspectionId}`

#### 필드 정의

| 필드명 | 타입 | 필수 | 인덱스 | 설명 | 검증 규칙 |
|--------|------|------|--------|------|-----------|
| `id` | string | ✅ | PK | 검차 고유 식별자 | `insp-{timestamp}` 형식 |
| `vehicleId` | string | ✅ | ✅ | 차량 ID | vehicles.id 참조 |
| `preferredDate` | string | ✅ | ✅ | 희망 날짜 | YYYY-MM-DD 형식 |
| `preferredTime` | string | ✅ | ❌ | 희망 시간 | HH:mm 형식 |
| `location` | object | ❌ | ❌ | 검차 장소 정보 | 아래 참조 |
| `status` | string | ✅ | ✅ | 검차 상태 | 상태 값 상세 참조 |
| `evaluatorId` | string | ❌ | ✅ | 평가사 ID | members.id 참조 |
| `evaluatorName` | string | ❌ | ❌ | 평가사 이름 | 한글 또는 영문 |
| `assignedAt` | Timestamp | ❌ | ✅ | 배정 일시 | 자동 생성 |
| `completedAt` | Timestamp | ❌ | ❌ | 검차 완료 일시 | 자동 생성 |
| `result` | object | ❌ | ❌ | 검차 결과 | InspectionReport 구조 |
| `mediaMetadata` | object | ❌ | ❌ | 미디어 메타데이터 | 아래 참조 |
| `createdAt` | Timestamp | ✅ | ✅ | 생성 일시 | 자동 생성 |
| `updatedAt` | Timestamp | ✅ | ❌ | 최종 업데이트 일시 | 자동 갱신 |

#### 상태 값 상세

- `pending`: 검차 신청 완료, 평가사 배정 대기
- `assigned`: 평가사 배정 완료
- `in_progress`: 검차 진행 중
- `completed`: 검차 완료

#### location 객체 구조

```typescript
{
  address: string;              // 주소
  coordinates: {                // 좌표
    lat: number;                // 위도
    lng: number;                // 경도
  } | null;
}
```

#### result 객체 구조 (InspectionReport)

```typescript
{
  evaluator: {
    name: string;
    id: string;
    rating: number;
    phone: string;
  };
  summary: string;
  score: string;
  condition: {
    exterior: string;           // 외장 상태
    interior: string;           // 내장 상태
    mechanic: string;           // 기계 상태
    frame: string;              // 골격 상태
  };
  aiAnalysis: {
    pros: string[];             // 장점
    cons: string[];             // 단점
    marketVerdict: string;      // 시장 평가
  };
  media: Array<{
    category: string;           // 카테고리 (Exterior, Interior 등)
    count: number;              // 파일 수
    items: Array<{
      type: 'image' | 'video';
      url: string;
      label: string;
    }>;
  }>;
}
```

#### mediaMetadata 객체 구조

```typescript
{
  totalFiles: number;           // 총 파일 수
  totalSize: number;            // 총 크기 (bytes)
  lastUploadedAt?: Timestamp;   // 마지막 업로드 일시
}
```

#### 제약 조건

- `vehicleId`는 유효한 차량 ID여야 함
- `preferredDate`는 현재 날짜 이후여야 함
- `status`가 `assigned` 이상인 경우 `evaluatorId` 필수
- `status`가 `completed`인 경우 `result` 필수

#### 인덱스

- 복합 인덱스 1: `vehicleId` + `status` + `createdAt` (DESC)
- 복합 인덱스 2: `evaluatorId` + `status` + `assignedAt` (DESC)
- 복합 인덱스 3: `status` + `preferredDate`

---

### 3.4 Auctions (경매)

**컬렉션 경로**: `auctions/{auctionId}`

#### 필드 정의

| 필드명 | 타입 | 필수 | 인덱스 | 설명 | 검증 규칙 |
|--------|------|------|--------|------|-----------|
| `id` | string | ✅ | PK | 경매 고유 식별자 | `auc-{timestamp}` 형식 |
| `vehicleId` | string | ✅ | ✅ | 차량 ID | vehicles.id 참조 |
| `startPrice` | number | ✅ | ❌ | 시작가 (만원) | 양수 |
| `buyNowPrice` | number | ❌ | ❌ | 즉시구매가 (만원) | startPrice보다 커야 함 |
| `currentHighestBid` | number | ❌ | ❌ | 현재 최고 입찰가 | 화면 비노출 (Blind) |
| `status` | string | ✅ | ✅ | 경매 상태 | `Active`, `Ended`, `Sold` |
| `endTime` | Timestamp | ❌ | ✅ | 종료 시간 | 자동 계산 (생성 시간 + 기간) |
| `vehicleOwnerId` | string | ❌ | ❌ | 차량 소유자 ID | members.id 참조 |
| `createdAt` | Timestamp | ✅ | ✅ | 생성 일시 | 자동 생성 |
| `updatedAt` | Timestamp | ❌ | ❌ | 최종 업데이트 일시 | 자동 갱신 |
| `endedAt` | Timestamp | ❌ | ❌ | 종료 일시 | 자동 생성 |

#### 상태 값 상세

- `Active`: 경매 진행 중
- `Ended`: 경매 종료 (미판매)
- `Sold`: 판매 완료

#### 제약 조건

- `vehicleId`는 유효한 차량 ID여야 함
- `buyNowPrice`는 `startPrice`보다 커야 함
- `currentHighestBid`는 `startPrice` 이상이어야 함
- `status`가 `Sold`인 경우 `currentHighestBid` 필수

#### 인덱스

- 복합 인덱스 1: `vehicleId` + `status` + `createdAt` (DESC)
- 복합 인덱스 2: `status` + `endTime`

---

### 3.5 Trades (거래/제안)

**컬렉션 경로**: `trades/{tradeId}`

#### 필드 정의

| 필드명 | 타입 | 필수 | 인덱스 | 설명 | 검증 규칙 |
|--------|------|------|--------|------|-----------|
| `id` | string | ✅ | PK | 거래 고유 식별자 | `trade-{timestamp}` 형식 |
| `vehicleId` | string | ✅ | ✅ | 차량 ID | vehicles.id 참조 |
| `buyerId` | string | ❌ | ❌ | 구매자 ID | members.id 참조 |
| `sellerId` | string | ❌ | ✅ | 판매자 ID | members.id 참조 |
| `price` | number | ✅ | ❌ | 거래 가격 (만원) | 양수 |
| `status` | string | ✅ | ✅ | 거래 상태 | 상태 값 상세 참조 |
| `expiresAt` | Timestamp | ❌ | ✅ | 제안 만료 일시 | TTL 관리용 |
| `acceptedAt` | Timestamp | ❌ | ❌ | 수락 일시 | 자동 생성 |
| `rejectedAt` | Timestamp | ❌ | ❌ | 거절 일시 | 자동 생성 |
| `createdAt` | Timestamp | ✅ | ✅ | 생성 일시 | 자동 생성 |

#### 상태 값 상세

- `pending`: 제안 대기 중
- `accepted`: 제안 수락
- `rejected`: 제안 거절
- `completed`: 거래 완료

#### 제약 조건

- `vehicleId`는 유효한 차량 ID여야 함
- `price`는 양수여야 함
- `expiresAt`는 `createdAt` 이후여야 함
- `status`가 `accepted`인 경우 `acceptedAt` 필수

#### 인덱스

- 복합 인덱스 1: `vehicleId` + `status` + `createdAt` (DESC)
- 복합 인덱스 2: `sellerId` + `status` + `createdAt` (DESC)
- 복합 인덱스 3: `status` + `expiresAt`

---

### 3.6 Logistics (탁송)

**컬렉션 경로**: `logistics/{logisticsId}`

#### 필드 정의

| 필드명 | 타입 | 필수 | 인덱스 | 설명 | 검증 규칙 |
|--------|------|------|--------|------|-----------|
| `id` | string | ✅ | PK | 탁송 고유 식별자 | `log-{timestamp}` 형식 |
| `vehicleId` | string | ✅ | ✅ | 차량 ID | vehicles.id 참조 |
| `scheduleDate` | string | ✅ | ✅ | 탁송 예정일 | YYYY-MM-DD 형식 |
| `scheduleTime` | string | ✅ | ❌ | 탁송 예정 시간 | HH:mm 형식 |
| `departureAddress` | string | ✅ | ❌ | 출발지 주소 | 한글 주소 |
| `destinationAddress` | string | ✅ | ❌ | 도착지 주소 | 한글 주소 |
| `status` | string | ✅ | ✅ | 탁송 상태 | 상태 값 상세 참조 |
| `driverName` | string | ❌ | ❌ | 탁송 기사 이름 | 한글 또는 영문 |
| `driverPhone` | string | ❌ | ❌ | 탁송 기사 전화번호 | 010-XXXX-XXXX 형식 |
| `dispatchedAt` | Timestamp | ❌ | ❌ | 배차 일시 | 자동 생성 |
| `handoverTimestamp` | Timestamp | ❌ | ❌ | 인계 승인 일시 | 자동 생성 |
| `pin` | string | ❌ | ❌ | 인계 승인 PIN | 6자리 숫자 (암호화) |
| `specialNotes` | string | ❌ | ❌ | 특이사항 | 자유 텍스트 |
| `createdAt` | Timestamp | ✅ | ✅ | 생성 일시 | 자동 생성 |

#### 상태 값 상세

- `scheduled`: 탁송 일정 조율 완료
- `dispatched`: 배차 확정
- `in_transit`: 탁송 진행 중
- `completed`: 인계 승인 완료

#### 제약 조건

- `vehicleId`는 유효한 차량 ID여야 함
- `scheduleDate`는 현재 날짜 이후여야 함
- `status`가 `dispatched` 이상인 경우 `driverName`, `driverPhone` 필수
- `status`가 `completed`인 경우 `handoverTimestamp`, `pin` 필수
- `pin`은 6자리 숫자여야 함

#### 인덱스

- 복합 인덱스 1: `vehicleId` + `status` + `createdAt` (DESC)
- 복합 인덱스 2: `status` + `scheduleDate`

---

### 3.7 Settlements (정산)

**컬렉션 경로**: `settlements/{settlementId}`

#### 필드 정의

| 필드명 | 타입 | 필수 | 인덱스 | 설명 | 검증 규칙 |
|--------|------|------|--------|------|-----------|
| `id` | string | ✅ | PK | 정산 고유 식별자 | `settle-{timestamp}` 형식 |
| `vehicleId` | string | ✅ | ✅ | 차량 ID | vehicles.id 참조 |
| `dealerId` | string | ❌ | ✅ | 딜러 ID | members.id 참조 |
| `salePrice` | number | ✅ | ❌ | 판매가 (만원) | 양수 |
| `settlementAmount` | number | ✅ | ❌ | 정산 금액 (만원) | 양수 |
| `platformFee` | number | ✅ | ❌ | 플랫폼 수수료 (만원) | 양수 |
| `platformFeeRate` | number | ✅ | ❌ | 플랫폼 수수료율 (%) | 0-100 |
| `vatRefund` | number | ✅ | ❌ | 부가세 환급 (만원) | 0 이상 |
| `vatRefundRate` | number | ✅ | ❌ | 부가세 환급율 (%) | 0-100 |
| `totalRefund` | number | ✅ | ❌ | 총 환급액 (만원) | 0 이상 |
| `finalAmount` | number | ✅ | ❌ | 최종 정산 금액 (만원) | 양수 |
| `logisticsFee` | number | ❌ | ❌ | 탁송비 (만원) | 0 이상 |
| `inspectionFee` | number | ❌ | ❌ | 검차비 (만원) | 0 이상 |
| `settlementDate` | string | ✅ | ✅ | 정산일 | YYYY-MM-DD 형식 |
| `buyerName` | string | ✅ | ❌ | 구매자명 | 한글 또는 영문 |
| `saleMethod` | string | ✅ | ❌ | 판매 방식 | `auction`, `general` |
| `bankAccount` | string | ✅ | ❌ | 입금 계좌 | 은행명 + 계좌번호 |
| `accountHolder` | string | ✅ | ❌ | 예금주 | 한글 또는 영문 |
| `settlementStatus` | string | ✅ | ✅ | 정산 상태 | `pending`, `completed`, `paid` |
| `createdAt` | Timestamp | ✅ | ✅ | 생성 일시 | 자동 생성 |

#### 상태 값 상세

- `pending`: 정산 대기
- `completed`: 정산 완료
- `paid`: 지급 완료

#### 제약 조건

- `vehicleId`는 유효한 차량 ID여야 함
- `finalAmount` = `settlementAmount` - `platformFee` + `vatRefund` - `logisticsFee` - `inspectionFee`
- `platformFee` = `salePrice` * `platformFeeRate` / 100
- `vatRefund` = `salePrice` * `vatRefundRate` / 100
- 모든 금액 필드는 소수점 2자리까지 허용

#### 인덱스

- 복합 인덱스 1: `vehicleId` + `settlementStatus` + `createdAt` (DESC)
- 복합 인덱스 2: `dealerId` + `settlementStatus` + `settlementDate` (DESC)

---

## 4. 관계 정의

### 4.1 참조 무결성 규칙

#### Members → Vehicles (1:N)
- **관계**: 한 회원은 여러 차량을 소유할 수 있음
- **참조**: `vehicles.ownerId` → `members.id`
- **삭제 규칙**: 회원 삭제 시 소유 차량 확인 필요 (Soft Delete 권장)

#### Vehicles → Inspections (1:N)
- **관계**: 한 차량은 여러 검차를 받을 수 있음
- **참조**: `inspections.vehicleId` → `vehicles.id`
- **삭제 규칙**: 차량 삭제 시 관련 검차 기록 유지 (로그 목적)

#### Vehicles ↔ Inspections (현재 검차)
- **관계**: 차량의 현재 진행 중인 검차
- **참조**: `vehicles.inspectionId` → `inspections.id`
- **삭제 규칙**: 검차 완료 시 상태만 업데이트

#### Vehicles → Auctions (1:N)
- **관계**: 한 차량은 여러 경매에 등록될 수 있음 (단, 동시 진행 불가)
- **참조**: `auctions.vehicleId` → `vehicles.id`
- **삭제 규칙**: 차량 삭제 시 진행 중인 경매 확인 필요

#### Vehicles ↔ Auctions (현재 경매)
- **관계**: 차량의 현재 진행 중인 경매
- **참조**: `vehicles.auctionId` → `auctions.id`
- **삭제 규칙**: 경매 종료 시 상태만 업데이트

#### Vehicles → Trades (1:N)
- **관계**: 한 차량은 여러 거래 제안을 받을 수 있음
- **참조**: `trades.vehicleId` → `vehicles.id`
- **삭제 규칙**: 차량 삭제 시 대기 중인 제안 자동 거절

#### Vehicles → Logistics (1:1 or 1:N)
- **관계**: 차량당 하나의 활성 탁송 (이력은 여러 개 가능)
- **참조**: `logistics.vehicleId` → `vehicles.id`
- **삭제 규칙**: 차량 삭제 시 진행 중인 탁송 확인 필요

#### Vehicles → Settlements (1:N)
- **관계**: 한 차량은 여러 정산 기록을 가질 수 있음
- **참조**: `settlements.vehicleId` → `vehicles.id`
- **삭제 규칙**: 차량 삭제 시 정산 기록 유지 (회계 목적)

#### Members → Settlements (1:N)
- **관계**: 한 회원은 여러 정산 기록을 가짐
- **참조**: `settlements.dealerId` → `members.id`
- **삭제 규칙**: 회원 삭제 시 정산 기록 유지 (회계 목적)

### 4.2 데이터 일관성 규칙

1. **차량 상태와 참조 ID 일치**:
   - `vehicles.status = 'inspection'` → `vehicles.inspectionId` 필수
   - `vehicles.status = 'bidding'` → `vehicles.auctionId` 필수

2. **경매 상태와 차량 상태 동기화**:
   - `auctions.status = 'Active'` → `vehicles.status = 'bidding'`
   - `auctions.status = 'Sold'` → `vehicles.status = 'sold'`

3. **검차 상태와 차량 상태 동기화**:
   - `inspections.status = 'in_progress'` → `vehicles.status = 'inspection'`
   - `inspections.status = 'completed'` → 차량 상태 업데이트 필요

4. **탁송 상태와 차량 상태 동기화**:
   - `logistics.status = 'in_transit'` → 차량 이동 중
   - `logistics.status = 'completed'` → 차량 인계 완료

5. **정산 금액 계산 일관성**:
   - `finalAmount` = `settlementAmount` - `platformFee` + `vatRefund` - `logisticsFee` - `inspectionFee`

---

## 5. 인덱스 전략

### 5.1 복합 인덱스 목록

총 **14개 복합 인덱스**:

1. **vehicles**: 2개
   - `ownerId` + `status` + `updatedAt` (DESC)
   - `status` + `createdAt` (DESC)

2. **inspections**: 3개
   - `vehicleId` + `status` + `createdAt` (DESC)
   - `evaluatorId` + `status` + `assignedAt` (DESC)
   - `status` + `preferredDate`

3. **auctions**: 2개
   - `vehicleId` + `status` + `createdAt` (DESC)
   - `status` + `endTime`

4. **trades**: 3개
   - `vehicleId` + `status` + `createdAt` (DESC)
   - `sellerId` + `status` + `createdAt` (DESC)
   - `status` + `expiresAt`

5. **logistics**: 2개
   - `vehicleId` + `status` + `createdAt` (DESC)
   - `status` + `scheduleDate`

6. **settlements**: 2개
   - `vehicleId` + `settlementStatus` + `createdAt` (DESC)
   - `dealerId` + `settlementStatus` + `settlementDate` (DESC)

### 5.2 인덱스 사용 패턴

#### 조회 패턴별 인덱스 활용

1. **딜러별 차량 목록 조회** (최신순):
   ```typescript
   vehicles
     .where('ownerId', '==', dealerId)
     .where('status', 'in', ['draft', 'inspection', 'bidding'])
     .orderBy('updatedAt', 'desc')
   ```
   → 인덱스: `ownerId` + `status` + `updatedAt` (DESC)

2. **진행 중인 경매 목록** (종료 임박순):
   ```typescript
   auctions
     .where('status', '==', 'Active')
     .orderBy('endTime', 'asc')
   ```
   → 인덱스: `status` + `endTime`

3. **평가사별 검차 일정** (배정일순):
   ```typescript
   inspections
     .where('evaluatorId', '==', evaluatorId)
     .where('status', '==', 'assigned')
     .orderBy('assignedAt', 'desc')
   ```
   → 인덱스: `evaluatorId` + `status` + `assignedAt` (DESC)

4. **날짜별 탁송 일정**:
   ```typescript
   logistics
     .where('status', '==', 'scheduled')
     .orderBy('scheduleDate', 'asc')
   ```
   → 인덱스: `status` + `scheduleDate`

5. **딜러별 정산 내역** (정산일순):
   ```typescript
   settlements
     .where('dealerId', '==', dealerId)
     .where('settlementStatus', '==', 'pending')
     .orderBy('settlementDate', 'desc')
   ```
   → 인덱스: `dealerId` + `settlementStatus` + `settlementDate` (DESC)

### 5.3 인덱스 모니터링

- **주기적 검토**: 월 1회 쿼리 패턴 분석
- **자동 추천**: Firebase Console의 인덱스 추천 활용
- **성능 측정**: 쿼리 응답 시간 모니터링 (< 500ms 목표)

---

## 6. 데이터 무결성 규칙

### 6.1 입력 검증 (Validation)

#### 클라이언트 측 검증 (프론트엔드)
- 필수 필드 확인
- 형식 검증 (이메일, 전화번호, 날짜 등)
- 범위 검증 (가격, 퍼센트 등)

#### 서버 측 검증 (Functions)
- 클라이언트 검증 재확인
- 비즈니스 로직 검증
- 참조 무결성 확인

#### 데이터베이스 규칙 (Firestore Rules)
- 인증된 사용자만 접근
- 소유권 확인 (본인 데이터만 수정)
- 필수 필드 존재 확인

### 6.2 트랜잭션 관리

#### 트랜잭션 필요 케이스

1. **경매 입찰**:
   - 경매 최고가 확인
   - 입찰가 비교 및 업데이트
   - 동시성 제어 (Race Condition 방지)

2. **즉시구매**:
   - 경매 상태 확인
   - 경매 상태 업데이트 → `Sold`
   - 차량 상태 업데이트 → `sold`

3. **제안 수락**:
   - 제안 상태 확인
   - 제안 상태 업데이트 → `accepted`
   - 차량 상태 업데이트 → `sold`
   - 다른 제안 거절 처리

4. **정산 생성**:
   - 차량 판매 상태 확인
   - 정산 금액 계산
   - 정산 레코드 생성
   - 차량 상태 업데이트 → `pending_settlement`

### 6.3 데이터 정합성 검증

#### 주기적 검증 (Scheduled Functions)

1. **만료된 제안 자동 처리** (1시간마다):
   ```typescript
   trades
     .where('status', '==', 'pending')
     .where('expiresAt', '<', now)
     .update({ status: 'expired' })
   ```

2. **경매 종료 처리** (10분마다):
   ```typescript
   auctions
     .where('status', '==', 'Active')
     .where('endTime', '<', now)
     .update({ status: 'Ended' })
   ```

3. **고아 레코드 확인** (일 1회):
   - `vehicles.inspectionId`가 존재하지 않는 검차 ID 참조
   - `vehicles.auctionId`가 존재하지 않는 경매 ID 참조

---

## 7. 테스트 시나리오

### 7.1 단위 테스트 (Unit Tests)

#### 엔티티 검증 테스트

```typescript
describe('Vehicle Entity Validation', () => {
  test('차량 생성 시 필수 필드 확인', () => {
    const vehicle = {
      plateNumber: '33바 3333',
      modelName: 'Carnival KA4',
      manufacturer: 'Kia',
      modelYear: '2022',
      mileage: '50000',
      status: 'draft'
    };
    expect(validateVehicle(vehicle)).toBe(true);
  });

  test('차량번호 형식 검증', () => {
    expect(validatePlateNumber('33바 3333')).toBe(true);
    expect(validatePlateNumber('invalid')).toBe(false);
  });

  test('상태 전이 규칙 검증', () => {
    expect(canTransition('draft', 'inspection')).toBe(true);
    expect(canTransition('draft', 'sold')).toBe(false);
  });
});
```

#### 관계 무결성 테스트

```typescript
describe('Reference Integrity', () => {
  test('차량 상태가 bidding일 때 auctionId 필수', async () => {
    const vehicle = { status: 'bidding', auctionId: null };
    await expect(updateVehicle(vehicle)).rejects.toThrow('auctionId is required');
  });

  test('존재하지 않는 vehicleId 참조 시 오류', async () => {
    const inspection = { vehicleId: 'non-existent-id' };
    await expect(createInspection(inspection)).rejects.toThrow('Vehicle not found');
  });
});
```

### 7.2 통합 테스트 (Integration Tests)

#### 경매 플로우 테스트

```typescript
describe('Auction Flow Integration', () => {
  test('차량 등록 → 검차 → 경매 등록 → 입찰 → 판매 완료', async () => {
    // 1. 차량 등록
    const vehicleId = await createVehicle({
      plateNumber: '33바 3333',
      modelName: 'Carnival KA4',
      // ...
    });

    // 2. 검차 신청
    const inspectionId = await createInspection({
      vehicleId,
      preferredDate: '2026-02-01',
      preferredTime: '14:00'
    });

    // 3. 검차 완료
    await completeInspection(inspectionId, {
      score: 'A',
      condition: { exterior: 'Good', interior: 'Excellent', mechanic: 'Good', frame: 'Good' }
    });

    // 4. 경매 등록
    const auctionId = await createAuction({
      vehicleId,
      startPrice: 2800,
      buyNowPrice: 3200
    });

    // 5. 입찰
    await placeBid(auctionId, { bidAmount: 3000 });

    // 6. 즉시구매
    const result = await buyNow(auctionId);

    // 검증
    expect(result.success).toBe(true);
    const vehicle = await getVehicle(vehicleId);
    expect(vehicle.status).toBe('sold');
    const auction = await getAuction(auctionId);
    expect(auction.status).toBe('Sold');
  });
});
```

#### 일반 판매 플로우 테스트

```typescript
describe('General Sale Flow Integration', () => {
  test('차량 등록 → 일반 판매 → 제안 수락 → 탁송 → 정산', async () => {
    // 1. 차량 등록 및 일반 판매 활성화
    const vehicleId = await createVehicle({
      plateNumber: '33바 3333',
      status: 'active_sale',
      price: '2850'
    });

    // 2. 구매 제안 생성
    const tradeId = await createTrade({
      vehicleId,
      buyerId: 'buyer-001',
      price: 2850
    });

    // 3. 제안 수락
    await acceptTrade(tradeId);

    // 4. 탁송 일정 조율
    const logisticsId = await createLogistics({
      vehicleId,
      scheduleDate: '2026-02-05',
      scheduleTime: '14:00',
      departureAddress: '서울특별시 강남구',
      destinationAddress: '인천광역시 중구'
    });

    // 5. 배차 및 탁송 완료
    await dispatchLogistics(logisticsId, {
      driverName: '홍길동',
      driverPhone: '010-1234-5678'
    });
    await completeHandover(logisticsId, { pin: '123456' });

    // 6. 정산 생성
    const settlementId = await createSettlement({
      vehicleId,
      salePrice: 2850,
      platformFeeRate: 5,
      vatRefundRate: 9.09
    });

    // 검증
    const settlement = await getSettlement(settlementId);
    expect(settlement.settlementStatus).toBe('pending');
    expect(settlement.finalAmount).toBeCloseTo(2966.59, 2);
  });
});
```

### 7.3 성능 테스트 (Performance Tests)

#### 조회 성능 테스트

```typescript
describe('Query Performance', () => {
  test('차량 목록 조회 성능 (< 500ms)', async () => {
    const startTime = Date.now();
    const vehicles = await getVehiclesByOwner('dealer-001', { limit: 20 });
    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(500);
    expect(vehicles.length).toBeLessThanOrEqual(20);
  });

  test('복합 쿼리 성능 (< 1000ms)', async () => {
    const startTime = Date.now();
    const inspections = await getInspectionsByEvaluator('eval-001', {
      status: 'assigned',
      limit: 50
    });
    const duration = Date.now() - startTime;

    expect(duration).toBeLessThan(1000);
  });
});
```

#### 동시성 테스트

```typescript
describe('Concurrency Tests', () => {
  test('동시 입찰 처리 (Race Condition)', async () => {
    const auctionId = await createAuction({
      vehicleId: 'v-001',
      startPrice: 2800
    });

    // 동시에 10개의 입찰 요청
    const bids = Array.from({ length: 10 }, (_, i) => ({
      auctionId,
      bidAmount: 2900 + i * 10
    }));

    const results = await Promise.all(
      bids.map(bid => placeBid(bid.auctionId, bid))
    );

    // 가장 높은 입찰만 성공해야 함
    const successCount = results.filter(r => r.success).length;
    expect(successCount).toBeGreaterThan(0);

    const auction = await getAuction(auctionId);
    expect(auction.currentHighestBid).toBe(2990);
  });
});
```

### 7.4 엣지 케이스 테스트

```typescript
describe('Edge Cases', () => {
  test('만료된 제안 수락 시도', async () => {
    const tradeId = await createTrade({
      vehicleId: 'v-001',
      price: 2850,
      expiresAt: new Date(Date.now() - 1000) // 이미 만료됨
    });

    await expect(acceptTrade(tradeId)).rejects.toThrow('Proposal has expired');
  });

  test('이미 판매된 차량에 입찰 시도', async () => {
    const auctionId = 'auc-001';
    await updateAuction(auctionId, { status: 'Sold' });

    await expect(placeBid(auctionId, { bidAmount: 3000 }))
      .rejects.toThrow('Auction is not active');
  });

  test('정산 금액 계산 정확성', () => {
    const settlement = calculateSettlement({
      salePrice: 2850,
      platformFeeRate: 5,
      vatRefundRate: 9.09,
      logisticsFee: 35,
      inspectionFee: 10
    });

    expect(settlement.platformFee).toBeCloseTo(142.5, 2);
    expect(settlement.vatRefund).toBeCloseTo(259.09, 2);
    expect(settlement.finalAmount).toBeCloseTo(2921.59, 2);
  });
});
```

---

## 8. 마이그레이션 가이드

### 8.1 프로토타입 → 프로덕션 전환

#### 1단계: 보안 규칙 강화

**현재 (테스트 모드)**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.time < timestamp.date(2026, 1, 29);
    }
  }
}
```

**프로덕션 (인증 기반)**:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 회원 데이터: 본인만 읽기/쓰기
    match /members/{memberId} {
      allow read, write: if request.auth != null && request.auth.uid == memberId;
    }

    // 차량 데이터: 소유자만 쓰기, 모든 인증 사용자 읽기
    match /vehicles/{vehicleId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null &&
        (request.auth.uid == resource.data.ownerId || 
         request.auth.token.role == 'ADMIN');
    }

    // 검차 데이터: 평가사 또는 차량 소유자만 수정
    match /inspections/{inspectionId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null &&
        (request.auth.uid == resource.data.evaluatorId ||
         request.auth.token.role == 'ADMIN');
    }

    // 경매/거래/탁송/정산: 관련자만 접근
    // (상세 규칙은 별도 문서 참조)
  }
}
```

#### 2단계: 인증 시스템 통합

1. **Firebase Auth 활성화**:
   - 이메일/비밀번호 인증 활성화
   - 회원가입 플로우 구현
   - 로그인/로그아웃 기능 구현

2. **사용자 ID 매핑**:
   - `members.id` = Firebase Auth UID
   - `vehicles.ownerId` = Firebase Auth UID
   - 기존 데이터 마이그레이션 스크립트 작성

3. **커스텀 클레임 설정**:
   ```typescript
   admin.auth().setCustomUserClaims(uid, {
     role: 'DEALER',
     dealerId: 'dealer-001'
   });
   ```

#### 3단계: 데이터 검증 및 정리

1. **필수 필드 누락 확인**:
   ```typescript
   const vehiclesSnapshot = await db.collection('vehicles').get();
   const missingFields = [];
   
   vehiclesSnapshot.forEach(doc => {
     const data = doc.data();
     if (!data.plateNumber || !data.modelName || !data.status) {
       missingFields.push({ id: doc.id, missing: [...] });
     }
   });
   ```

2. **참조 무결성 확인**:
   ```typescript
   // inspectionId 참조 확인
   const vehiclesWithInspection = await db.collection('vehicles')
     .where('inspectionId', '!=', null)
     .get();
   
   for (const doc of vehiclesWithInspection.docs) {
     const inspectionId = doc.data().inspectionId;
     const inspectionDoc = await db.collection('inspections').doc(inspectionId).get();
     
     if (!inspectionDoc.exists) {
       console.error(`Invalid inspectionId: ${inspectionId} in vehicle: ${doc.id}`);
     }
   }
   ```

3. **상태 일관성 확인**:
   ```typescript
   // 차량 상태와 경매 상태 동기화 확인
   const vehicles = await db.collection('vehicles')
     .where('status', '==', 'bidding')
     .get();
   
   for (const doc of vehicles.docs) {
     const auctionId = doc.data().auctionId;
     if (!auctionId) {
       console.error(`Vehicle ${doc.id} is bidding but has no auctionId`);
       continue;
     }
     
     const auctionDoc = await db.collection('auctions').doc(auctionId).get();
     if (!auctionDoc.exists || auctionDoc.data().status !== 'Active') {
       console.error(`Inconsistent state: vehicle ${doc.id}, auction ${auctionId}`);
     }
   }
   ```

#### 4단계: 인덱스 최적화

1. **쿼리 패턴 분석**:
   - Firebase Console에서 쿼리 로그 분석
   - 느린 쿼리 식별 (> 500ms)
   - 인덱스 추천 확인

2. **인덱스 추가/수정**:
   - `firestore.indexes.json` 업데이트
   - `firebase deploy --only firestore:indexes`

3. **성능 모니터링**:
   - 쿼리 응답 시간 측정
   - 인덱스 사용률 확인

#### 5단계: TTL 정책 적용

**만료된 제안 자동 삭제** (Cloud Functions Scheduled):
```typescript
export const cleanupExpiredTrades = functions.pubsub
  .schedule('every 1 hours')
  .timeZone('Asia/Seoul')
  .onRun(async (context) => {
    const now = admin.firestore.Timestamp.now();
    
    const expiredTrades = await db.collection('trades')
      .where('status', '==', 'pending')
      .where('expiresAt', '<', now)
      .get();
    
    const batch = db.batch();
    expiredTrades.forEach(doc => {
      batch.update(doc.ref, { status: 'expired', updatedAt: now });
    });
    
    await batch.commit();
    console.log(`Expired ${expiredTrades.size} trades`);
  });
```

### 8.2 백업 및 복구

#### 자동 백업 설정

1. **Firebase 백업 활성화**:
   - GCP Console → Firestore → 백업
   - 일일 자동 백업 스케줄 설정

2. **백업 스크립트**:
   ```bash
   gcloud firestore export gs://carivdealer-backups/$(date +%Y%m%d) \
     --project carivdealer \
     --collection-ids=vehicles,inspections,auctions,trades,logistics,settlements,members
   ```

3. **복구 스크립트**:
   ```bash
   gcloud firestore import gs://carivdealer-backups/20260126 \
     --project carivdealer
   ```

### 8.3 스키마 변경 가이드

#### 필드 추가

```typescript
// 예: vehicles에 새 필드 추가
const vehiclesSnapshot = await db.collection('vehicles').get();
const batch = db.batch();

vehiclesSnapshot.forEach(doc => {
  batch.update(doc.ref, {
    newField: defaultValue,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
});

await batch.commit();
```

#### 필드 이름 변경

```typescript
// 예: plateNumber → vehicleNumber
const vehiclesSnapshot = await db.collection('vehicles').get();
const batch = db.batch();

vehiclesSnapshot.forEach(doc => {
  const data = doc.data();
  batch.update(doc.ref, {
    vehicleNumber: data.plateNumber,
    plateNumber: admin.firestore.FieldValue.delete(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  });
});

await batch.commit();
```

---

## 부록

### A. TypeScript 타입 정의

```typescript
// src/entities/vehicle/model/types.ts
export interface Vehicle {
  id: string;
  status: VehicleStatus;
  plateNumber: string;
  vin?: string;
  manufacturer: string;
  modelName: string;
  modelYear: string;
  mileage: string;
  fuelType?: FuelType;
  color?: string;
  registrationDate?: string;
  price?: string;
  highestBid?: string;
  thumbnailUrl?: string;
  location?: string;
  endTime?: string;
  ownerId?: string;
  inspectionId?: string;
  auctionId?: string;
  offers?: Offer[];
  ocrMetadata?: OcrMetadata;
  publicDataMetadata?: PublicDataMetadata;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type VehicleStatus =
  | 'draft'
  | 'inspection'
  | 'bidding'
  | 'active_sale'
  | 'sold'
  | 'pending_settlement'
  | 'completed';

export type FuelType = '가솔린' | '디젤' | '하이브리드' | '전기';

export interface Offer {
  id: string;
  bidderName: string;
  amount: string;
  date: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface OcrMetadata {
  extractedAt: Timestamp;
  ocrVersion?: string;
  confidence?: number;
}

export interface PublicDataMetadata {
  lastQueriedAt?: Timestamp;
  queryParams?: {
    registYy?: string;
    registMt?: string;
    useFuelCode?: string;
  };
}

// src/entities/inspection/model/types.ts
export interface Inspection {
  id: string;
  vehicleId: string;
  preferredDate: string;
  preferredTime: string;
  location?: Location;
  status: InspectionStatus;
  evaluatorId?: string;
  evaluatorName?: string;
  assignedAt?: Timestamp;
  completedAt?: Timestamp;
  result?: InspectionReport;
  mediaMetadata?: MediaMetadata;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type InspectionStatus = 'pending' | 'assigned' | 'in_progress' | 'completed';

export interface Location {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  } | null;
}

export interface InspectionReport {
  evaluator: {
    name: string;
    id: string;
    rating: number;
    phone: string;
  };
  summary: string;
  score: string;
  condition: {
    exterior: string;
    interior: string;
    mechanic: string;
    frame: string;
  };
  aiAnalysis: {
    pros: string[];
    cons: string[];
    marketVerdict: string;
  };
  media: MediaCategory[];
}

export interface MediaCategory {
  category: string;
  count: number;
  items: MediaItem[];
}

export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  label: string;
}

export interface MediaMetadata {
  totalFiles: number;
  totalSize: number;
  lastUploadedAt?: Timestamp;
}

// (기타 엔티티 타입 정의...)
```

### B. 참조 문서

- [FIRESTORE_SCHEMA.md](./FIRESTORE_SCHEMA.md) - Firestore 컬렉션 구조 정의서
- [API_SPECIFICATION_v2.md](./API_SPECIFICATION_v2.md) - API 명세서
- [FRD_v2.md](./FRD_v2.md) - 기능 요구사항 문서

---

**문서 끝**
