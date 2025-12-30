# Firestore 컬렉션 구조 정의서

**버전**: 2.0  
**최종 업데이트**: 2025-01-XX  
**상태**: 테스트 모드 (2026-01-29까지)

---

## 개요

이 문서는 FOWARDMAX 프로젝트의 Firestore 데이터베이스 컬렉션 구조를 정의합니다. 프로토타입 단계에서는 인증 없이도 작동하도록 설계되었으며, 프로덕션 전환 시 보안 규칙을 강화해야 합니다.

---

## 컬렉션 목록

1. [vehicles](#1-vehicles-차량-정보)
2. [inspections](#2-inspections-검차-정보)
3. [auctions](#3-auctions-경매-정보)
4. [trades](#4-trades-거래-정보)
5. [logistics](#5-logistics-탁송-정보)
6. [settlements](#6-settlements-정산-정보)
7. [members](#7-members-회원-정보-향후-사용)

---

## 1. vehicles (차량 정보)

**컬렉션 경로**: `vehicles/{vehicleId}`

### 필드 정의

| 필드명 | 타입 | 필수 | 설명 | 예시 |
|--------|------|------|------|------|
| `id` | string | ✅ | 차량 고유 식별자 | `"v-106"` |
| `status` | string | ✅ | 차량 상태 | `"draft"`, `"inspection"`, `"bidding"`, `"sold"`, `"pending_settlement"`, `"active_sale"` |
| `plateNumber` | string | ✅ | 차량번호 | `"33바 3333"` |
| `modelName` | string | ✅ | 모델명 | `"Carnival KA4"` |
| `manufacturer` | string | ✅ | 제조사 | `"Kia"` |
| `modelYear` | string | ✅ | 연식 | `"2022"` |
| `mileage` | string | ✅ | 주행거리 | `"50000"` |
| `price` | string | ❌ | 판매가격 (만원 단위) | `"2850"` |
| `highestBid` | string | ❌ | 최고 입찰가 (경매용) | `"3000"` |
| `thumbnailUrl` | string | ❌ | 썸네일 이미지 URL | `"https://..."` |
| `updatedAt` | Timestamp | ✅ | 최종 업데이트 일시 | `Timestamp` |
| `fuelType` | string | ❌ | 연료 종류 | `"가솔린"`, `"디젤"`, `"하이브리드"` |
| `registrationDate` | string | ❌ | 등록일자 (YYYY-MM-DD) | `"2022-01-15"` |
| `color` | string | ❌ | 색상 | `"화이트"` |
| `vin` | string | ❌ | 차대번호 (VIN) | `"KMHXX00XXXX000000"` |
| `inspectionId` | string | ❌ | 검차 ID 참조 | `"insp-001"` |
| `location` | string | ❌ | 차량 위치 | `"Seoul"` |
| `endTime` | string | ❌ | 경매 종료 시간 (ISO 8601) | `"2025-01-20T15:00:00Z"` |
| `auctionId` | string | ❌ | 경매 ID 참조 | `"auction-001"` |
| `ownerId` | string | ❌ | 소유자 ID (딜러 ID) | `"dealer-001"` |
| `offers` | array | ❌ | 일반 판매 제안 목록 (서브컬렉션 대신 배열) | `[{ id, bidderName, amount, date }]` |
| `createdAt` | Timestamp | ✅ | 생성 일시 | `Timestamp` |
| `ocrMetadata` | object | ❌ | OCR 메타데이터 | 아래 참조 |
| `publicDataMetadata` | object | ❌ | 공공데이터 조회 메타데이터 | 아래 참조 |

### OCR 메타데이터 (ocrMetadata) 구조

```typescript
{
  extractedAt: Timestamp;      // OCR 추출 일시
  ocrVersion?: string;          // OCR 모델 버전 (예: "gemini-3-pro-preview")
  confidence?: number;          // OCR 신뢰도 (0-100, 선택)
}
```

### 공공데이터 메타데이터 (publicDataMetadata) 구조

```typescript
{
  lastQueriedAt?: Timestamp;    // 마지막 공공데이터 조회 일시
  queryParams?: {              // 조회 파라미터 (디버깅용)
    registYy?: string;          // 등록년
    registMt?: string;          // 등록월
    useFuelCode?: string;       // 사용연료코드
  };
}
```

**참고**: 공공데이터 통계 정보는 저장하지 않으며, 항상 실시간으로 조회합니다. 메타데이터는 조회 이력 추적 및 디버깅 목적으로만 사용됩니다.

### 상태 값 상세

- `draft`: 임시 저장 상태
- `inspection`: 검차 진행 중
- `bidding`: 경매 진행 중
- `sold`: 판매 완료
- `pending_settlement`: 정산 대기
- `active_sale`: 일반 판매 활성화

### 인덱스

- 복합 인덱스: `ownerId` + `status` + `updatedAt` (DESC)
- 복합 인덱스: `status` + `createdAt` (DESC)

**참고**: 단일 필드 인덱스(`plateNumber`, `vin`, `inspectionId`, `auctionId` 등)는 Firestore가 자동으로 생성하므로 명시적으로 정의할 필요가 없습니다.

**인덱스 사용 목적**:
- `ownerId` + `status` + `updatedAt`: 딜러별 차량 목록 조회 (최신순)
- `status` + `createdAt`: 전체 차량 목록 조회 (최신순)
- `plateNumber`: 차량번호로 검색 (자동 생성된 단일 필드 인덱스 사용)
- `vin`: 차대번호로 검색 (자동 생성된 단일 필드 인덱스 사용)

---

## 2. inspections (검차 정보)

**컬렉션 경로**: `inspections/{inspectionId}`

### 필드 정의

| 필드명 | 타입 | 필수 | 설명 | 예시 |
|--------|------|------|------|------|
| `id` | string | ✅ | 검차 고유 식별자 | `"insp-001"` |
| `vehicleId` | string | ✅ | 차량 ID 참조 | `"v-106"` |
| `preferredDate` | string | ✅ | 희망 날짜 (YYYY-MM-DD) | `"2025-01-20"` |
| `preferredTime` | string | ✅ | 희망 시간 (HH:mm) | `"14:00"` |
| `location` | object | ❌ | 검차 장소 정보 (Google Maps에서 선택) | 아래 참조 |
| `status` | string | ✅ | 검차 상태 | `"pending"`, `"assigned"`, `"in_progress"`, `"completed"` |
| `createdAt` | Timestamp | ✅ | 생성 일시 | `Timestamp` |
| `updatedAt` | Timestamp | ✅ | 최종 업데이트 일시 | `Timestamp` |
| `evaluatorId` | string | ❌ | 평가사 ID 참조 | `"eval-001"` |
| `evaluatorName` | string | ❌ | 평가사 이름 | `"홍길동"` |
| `assignedAt` | Timestamp | ❌ | 배정 일시 | `Timestamp` |
| `completedAt` | Timestamp | ❌ | 검차 완료 일시 | `Timestamp` |
| `result` | object | ❌ | 검차 결과 (InspectionReport 객체) | 아래 참조 |
| `mediaMetadata` | object | ❌ | 미디어 파일 메타데이터 | 아래 참조 |

### 검차 결과 (result) 구조

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
  media: Array<{
    category: string;
    count: number;
    items: Array<{
      type: 'image' | 'video';
      url: string;
      label: string;
    }>;
  }>;
}
```

### 상태 값 상세

- `pending`: 검차 신청 완료, 평가사 배정 대기
- `assigned`: 평가사 배정 완료
- `in_progress`: 검차 진행 중
- `completed`: 검차 완료

### 검차 장소 정보 (location) 구조

```typescript
{
  address: string;              // 주소 (예: "서울특별시 강남구 테헤란로 123")
  coordinates: {                // 좌표 (Google Maps에서 선택한 위치)
    lat: number;                 // 위도
    lng: number;                 // 경도
  } | null;                      // 좌표가 없는 경우 null
}
```

**참고**: `coordinates`가 `null`인 경우, 나중에 Geocoding API를 사용하여 주소를 좌표로 변환할 수 있습니다.

### 미디어 메타데이터 (mediaMetadata) 구조

```typescript
{
  totalFiles: number;           // 총 파일 수
  totalSize: number;             // 총 크기 (bytes)
  lastUploadedAt?: Timestamp;   // 마지막 업로드 일시
}
```

### 인덱스

- 복합 인덱스: `vehicleId` + `status` + `createdAt` (DESC)
- 복합 인덱스: `evaluatorId` + `status` + `assignedAt` (DESC)
- 복합 인덱스: `status` + `preferredDate`

**참고**: 단일 필드 인덱스(`evaluatorId` 등)는 Firestore가 자동으로 생성하므로 명시적으로 정의할 필요가 없습니다.

**인덱스 사용 목적**:
- `vehicleId` + `status` + `createdAt`: 차량별 검차 목록 조회 (최신순)
- `evaluatorId` + `status` + `assignedAt`: 평가사별 검차 목록 조회 (배정일순)
- `status` + `preferredDate`: 날짜별 검차 일정 조회

---

## 3. auctions (경매 정보)

**컬렉션 경로**: `auctions/{auctionId}`

### 필드 정의

| 필드명 | 타입 | 필수 | 설명 | 예시 |
|--------|------|------|------|------|
| `id` | string | ✅ | 경매 고유 식별자 | `"auction-001"` |
| `vehicleId` | string | ✅ | 차량 ID 참조 | `"v-106"` |
| `startPrice` | number | ✅ | 시작가 (만원 단위) | `2800` |
| `buyNowPrice` | number | ❌ | 즉시구매가 (만원 단위) | `3200` |
| `currentHighestBid` | number | ❌ | 현재 최고 입찰가 (화면 비노출) | `3000` |
| `status` | string | ✅ | 경매 상태 | `"Active"`, `"Ended"`, `"Sold"` |
| `createdAt` | Timestamp | ✅ | 생성 일시 | `Timestamp` |
| `updatedAt` | Timestamp | ❌ | 최종 업데이트 일시 | `Timestamp` |
| `endedAt` | Timestamp | ❌ | 종료 일시 | `Timestamp` |
| `vehicleOwnerId` | string | ❌ | 차량 소유자 ID (딜러 ID) | `"dealer-001"` |

### 상태 값 상세

- `Active`: 경매 진행 중
- `Ended`: 경매 종료 (미판매)
- `Sold`: 판매 완료

### 인덱스

- 복합 인덱스: `vehicleId` + `status` + `createdAt` (DESC)
- 복합 인덱스: `status` + `createdAt` (DESC)
- 복합 인덱스: `status` + `endTime`

**참고**: 단일 필드 인덱스(`status` 등)는 Firestore가 자동으로 생성하므로 명시적으로 정의할 필요가 없습니다.

**인덱스 사용 목적**:
- `vehicleId` + `status` + `createdAt`: 차량별 경매 목록 조회 (최신순)
- `status` + `createdAt`: 전체 경매 목록 조회 (최신순)
- `status` + `endTime`: 종료 예정 경매 조회

---

## 4. trades (거래 정보)

**컬렉션 경로**: `trades/{tradeId}`

### 필드 정의

| 필드명 | 타입 | 필수 | 설명 | 예시 |
|--------|------|------|------|------|
| `id` | string | ✅ | 거래 고유 식별자 | `"trade-001"` |
| `vehicleId` | string | ✅ | 차량 ID 참조 | `"v-106"` |
| `buyerId` | string | ❌ | 구매자 ID | `"buyer-001"` |
| `sellerId` | string | ❌ | 판매자 ID (딜러 ID) | `"dealer-001"` |
| `price` | number | ✅ | 거래 가격 (만원 단위) | `2850` |
| `status` | string | ✅ | 거래 상태 | `"pending"`, `"accepted"`, `"rejected"`, `"completed"` |
| `createdAt` | Timestamp | ✅ | 생성 일시 | `Timestamp` |
| `expiresAt` | Timestamp | ❌ | 제안 만료 일시 (TTL) | `Timestamp` |
| `acceptedAt` | Timestamp | ❌ | 수락 일시 | `Timestamp` |
| `rejectedAt` | Timestamp | ❌ | 거절 일시 | `Timestamp` |

### 상태 값 상세

- `pending`: 제안 대기 중
- `accepted`: 제안 수락
- `rejected`: 제안 거절
- `completed`: 거래 완료

### 인덱스

- 복합 인덱스: `vehicleId` + `status` + `createdAt` (DESC)
- 복합 인덱스: `sellerId` + `status` + `createdAt` (DESC)
- 복합 인덱스: `status` + `expiresAt`

**참고**: 단일 필드 인덱스(`buyerId`, `sellerId`, `expiresAt` 등)는 Firestore가 자동으로 생성하므로 명시적으로 정의할 필요가 없습니다.

**인덱스 사용 목적**:
- `vehicleId` + `status` + `createdAt`: 차량별 거래 목록 조회 (최신순)
- `sellerId` + `status` + `createdAt`: 딜러별 거래 목록 조회 (최신순)
- `status` + `expiresAt`: 만료 예정 제안 조회

---

## 5. logistics (탁송 정보)

**컬렉션 경로**: `logistics/{logisticsId}`

### 필드 정의

| 필드명 | 타입 | 필수 | 설명 | 예시 |
|--------|------|------|------|------|
| `id` | string | ✅ | 탁송 고유 식별자 | `"log-001"` |
| `vehicleId` | string | ✅ | 차량 ID 참조 | `"v-106"` |
| `scheduleDate` | string | ✅ | 탁송 예정일 (YYYY-MM-DD) | `"2025-01-25"` |
| `scheduleTime` | string | ✅ | 탁송 예정 시간 (HH:mm) | `"14:00"` |
| `departureAddress` | string | ✅ | 출발지 주소 | `"서울특별시 강남구 테헤란로 123"` |
| `destinationAddress` | string | ✅ | 도착지 주소 | `"인천광역시 중구 인천항 물류센터"` |
| `status` | string | ✅ | 탁송 상태 | `"scheduled"`, `"dispatched"`, `"in_transit"`, `"completed"` |
| `createdAt` | Timestamp | ✅ | 생성 일시 | `Timestamp` |
| `driverName` | string | ❌ | 탁송 기사 이름 | `"홍길동"` |
| `driverPhone` | string | ❌ | 탁송 기사 전화번호 | `"010-1234-5678"` |
| `dispatchedAt` | Timestamp | ❌ | 배차 일시 | `Timestamp` |
| `handoverTimestamp` | Timestamp | ❌ | 인계 승인 일시 | `Timestamp` |
| `pin` | string | ❌ | 인계 승인 PIN (암호화 저장 권장) | `"123456"` |
| `specialNotes` | string | ❌ | 특이사항 | `"키 위치: 현관 앞 화분 아래"` |

### 상태 값 상세

- `scheduled`: 탁송 일정 조율 완료
- `dispatched`: 배차 확정
- `in_transit`: 탁송 진행 중
- `completed`: 인계 승인 완료

### 인덱스

- 복합 인덱스: `vehicleId` + `status` + `createdAt` (DESC)
- 복합 인덱스: `status` + `scheduleDate`

**참고**: 단일 필드 인덱스(`scheduleDate`, `status` 등)는 Firestore가 자동으로 생성하므로 명시적으로 정의할 필요가 없습니다.

**인덱스 사용 목적**:
- `vehicleId` + `status` + `createdAt`: 차량별 탁송 목록 조회 (최신순)
- `status` + `scheduleDate`: 날짜별 탁송 일정 조회

---

## 6. settlements (정산 정보)

**컬렉션 경로**: `settlements/{settlementId}`

### 필드 정의

| 필드명 | 타입 | 필수 | 설명 | 예시 |
|--------|------|------|------|------|
| `id` | string | ✅ | 정산 고유 식별자 | `"settle-001"` |
| `vehicleId` | string | ✅ | 차량 ID 참조 | `"v-106"` |
| `salePrice` | number | ✅ | 판매가 (만원 단위) | `2850` |
| `settlementAmount` | number | ✅ | 정산 금액 (만원 단위) | `2850` |
| `platformFee` | number | ✅ | 플랫폼 수수료 (만원 단위) | `142.5` |
| `platformFeeRate` | number | ✅ | 플랫폼 수수료율 (%) | `5` |
| `vatRefund` | number | ✅ | 부가세 환급 (만원 단위) | `259.09` |
| `vatRefundRate` | number | ✅ | 부가세 환급율 (%) | `9.09` |
| `totalRefund` | number | ✅ | 총 환급액 (만원 단위) | `259.09` |
| `finalAmount` | number | ✅ | 최종 정산 금액 (만원 단위) | `2966.59` |
| `logisticsFee` | number | ❌ | 탁송비 (만원 단위) | `35` |
| `inspectionFee` | number | ❌ | 검차비 (만원 단위) | `10` |
| `settlementDate` | string | ✅ | 정산일 (YYYY-MM-DD) | `"2025-05-20"` |
| `buyerName` | string | ✅ | 구매자명 | `"Global Motors Inc."` |
| `saleMethod` | string | ✅ | 판매 방식 | `"auction"`, `"general"` |
| `bankAccount` | string | ✅ | 입금 계좌 | `"국민은행 123-45-67890"` |
| `accountHolder` | string | ✅ | 예금주 | `"주식회사 포워드맥스"` |
| `settlementStatus` | string | ✅ | 정산 상태 | `"pending"`, `"completed"`, `"paid"` |
| `createdAt` | Timestamp | ✅ | 생성 일시 | `Timestamp` |
| `dealerId` | string | ❌ | 딜러 ID | `"dealer-001"` |

### 상태 값 상세

- `pending`: 정산 대기
- `completed`: 정산 완료
- `paid`: 지급 완료

### 인덱스

- 복합 인덱스: `vehicleId` + `settlementStatus` + `createdAt` (DESC)
- 복합 인덱스: `dealerId` + `settlementStatus` + `settlementDate` (DESC)

**참고**: 단일 필드 인덱스(`dealerId`, `settlementDate` 등)는 Firestore가 자동으로 생성하므로 명시적으로 정의할 필요가 없습니다.

**인덱스 사용 목적**:
- `vehicleId` + `settlementStatus` + `createdAt`: 차량별 정산 목록 조회 (최신순)
- `dealerId` + `settlementStatus` + `settlementDate`: 딜러별 정산 목록 조회 (정산일순)

---

## 7. members (회원 정보) - 향후 사용

**컬렉션 경로**: `members/{memberId}`

### 필드 정의

| 필드명 | 타입 | 필수 | 설명 | 예시 |
|--------|------|------|------|------|
| `id` | string | ✅ | 회원 고유 식별자 | `"member-001"` |
| `email` | string | ✅ | 이메일 | `"dealer@example.com"` |
| `password` | string | ✅ | 비밀번호 (암호화) | `"$2b$10$..."` |
| `dealerName` | string | ✅ | 딜러명 | `"Global Motors"` |
| `phone` | string | ✅ | 전화번호 | `"010-1234-5678"` |
| `businessInfo` | object | ❌ | 사업자 정보 | 아래 참조 |
| `role` | string | ❌ | 역할 | `"DEALER"`, `"INSPECTOR"` |
| `createdAt` | Timestamp | ✅ | 생성 일시 | `Timestamp` |
| `updatedAt` | Timestamp | ✅ | 최종 업데이트 일시 | `Timestamp` |

### 사업자 정보 (businessInfo) 구조

```typescript
{
  companyName: string;
  businessRegNo: string;
  representativeName: string;
  verified: boolean;
}
```

### 인덱스

- 복합 인덱스: `role` + `createdAt` (DESC)

**참고**: 단일 필드 인덱스(`email` 등)는 Firestore가 자동으로 생성하므로 명시적으로 정의할 필요가 없습니다.

**인덱스 사용 목적**:
- `email`: 이메일로 회원 검색 (자동 생성된 단일 필드 인덱스 사용)
- `role` + `createdAt`: 역할별 회원 목록 조회 (최신순)

---

## 관계(참조) 정의

### 차량 → 검차
- `vehicles.inspectionId` → `inspections.id`

### 차량 → 경매
- `vehicles.auctionId` → `auctions.id`

### 검차 → 차량
- `inspections.vehicleId` → `vehicles.id`

### 경매 → 차량
- `auctions.vehicleId` → `vehicles.id`

### 거래 → 차량
- `trades.vehicleId` → `vehicles.id`

### 탁송 → 차량
- `logistics.vehicleId` → `vehicles.id`

### 정산 → 차량
- `settlements.vehicleId` → `vehicles.id`

---

## 리전 설정

- **Firestore**: `asia-northeast3` (서울)
- **Storage**: `asia-northeast3` (서울)
- **Realtime Database**: `us-central1` (아이오와, 예외)

자세한 리전 설정 정보는 `docs/DATABASE_CONFIG.md`를 참조하세요.

## 보안 규칙 (테스트 모드)

테스트 모드에서는 2026-01-29까지 모든 읽기/쓰기가 가능하도록 설정합니다. 프로덕션 전환 시 보안 규칙을 강화해야 합니다.

자세한 보안 규칙은 `firestore.rules` 파일을 참조하세요.

---

## 인덱스 정의

모든 인덱스는 `firestore.indexes.json` 파일에 정의되어 있습니다.

주요 인덱스 (총 16개 복합 인덱스):
- `vehicles`: 2개 복합 인덱스
- `inspections`: 3개 복합 인덱스
- `auctions`: 3개 복합 인덱스
- `trades`: 3개 복합 인덱스
- `logistics`: 2개 복합 인덱스
- `settlements`: 2개 복합 인덱스
- `members`: 1개 복합 인덱스

**참고**: 단일 필드 인덱스는 Firestore가 자동으로 생성하므로 명시적으로 정의하지 않습니다.

각 컬렉션별 상세 인덱스는 위의 컬렉션 섹션을 참조하세요.

---

## 데이터 마이그레이션 가이드

프로토타입에서 프로덕션으로 전환 시:

1. **인증 시스템 통합**: `ownerId`, `dealerId` 필드에 실제 사용자 ID 할당
2. **보안 규칙 강화**: `firestore.rules` 파일 업데이트
3. **인덱스 최적화**: 쿼리 패턴에 맞춰 인덱스 추가/수정
4. **데이터 검증**: 필수 필드 누락 여부 확인
5. **TTL 정책 적용**: 만료된 제안 자동 삭제 (Cloud Functions Scheduled Function)

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0 | 2025-01-XX | 초기 버전 작성 |
| 2.0 | 2025-01-XX | 한국교통안전공단 API 통합 반영, 엔터티 스키마 확장, 인덱스 최적화, 리전 설정 정보 추가 |

---

## 참고 문서

- [FRD_v2.md](./FRD_v2.md) - 기능 요구사항 문서
- [API_SPECIFICATION_v2.md](./API_SPECIFICATION_v2.md) - API 명세서
- [PRD_Phase1_2025-12-31.md](./PRD_Phase1_2025-12-31.md) - 제품 요구사항 문서

