# 프론트엔드 FSD 리팩토링 및 데이터베이스 통합 완전 계획

**프로젝트**: ForwardMax (carivdealer)  
**버전**: 2.0  
**최종 업데이트**: 2026-01-26  
**작성자**: 개발팀  
**계획 상태**: 실행 준비 완료

---

## 목차

1. [개요](#1-개요)
2. [현재 상태 분석](#2-현재-상태-분석)
3. [아키텍처 설계](#3-아키텍처-설계)
4. [Phase별 실행 계획](#4-phase별-실행-계획)
5. [데이터베이스 통합 전략](#5-데이터베이스-통합-전략)
6. [테스트 전략](#6-테스트-전략)
7. [마이그레이션 로드맵](#7-마이그레이션-로드맵)
8. [품질 보증 체크리스트](#8-품질-보증-체크리스트)

---

## 1. 개요

### 1.1 목표

현재 단일 파일(index.tsx 5000줄+) 기반의 프론트엔드를 **FSD(Feature-Sliced Design)** 아키텍처로 전환하고, **데이터베이스 스키마와 완전히 동기화**된 타입 안전한 구조를 구축합니다.

### 1.2 핵심 개선사항

1. **아키텍처 개선**:
   - 단일 파일(5000줄+) → FSD 구조 (레이어별 분리)
   - CDN 의존 → npm 기반 빌드
   - 직접 API 호출 → TanStack Query 캐싱
   - Context API → TanStack Query + Zustand

2. **데이터베이스 통합**:
   - ERD 스키마 명세 기반 타입 정의
   - Firestore 컬렉션 구조 완전 매핑
   - 타입 안전성 100% 달성
   - 런타임 검증 레이어 추가 (Zod)

3. **개발 경험 개선**:
   - 타입 자동 완성
   - 컴파일 시간 타입 체크
   - 런타임 데이터 검증
   - 개발자 친화적 에러 메시지

4. **성능 최적화**:
   - 초기 로딩 속도 향상 (Tailwind npm)
   - API 요청량 감소 (캐싱)
   - 번들 크기 최적화 (코드 스플리팅)

### 1.3 참조 문서

- [DATABASE_ERD_SCHEMA.md](./DATABASE_ERD_SCHEMA.md) - 데이터베이스 ERD 스키마 명세
- [FIRESTORE_SCHEMA.md](./FIRESTORE_SCHEMA.md) - Firestore 컬렉션 구조
- [API_SPECIFICATION_v2.md](./API_SPECIFICATION_v2.md) - API 명세서
- [DEVELOPMENT_GUIDE.md](Y:\0126\0127\saas-front\DEVELOPMENT_GUIDE.md) - 개발 가이드 (참조)

### 1.4 성공 기준

- [ ] 타입 에러 0개 (TypeScript strict mode)
- [ ] 빌드 성공 (npm run build)
- [ ] 모든 테스트 통과 (Unit + Integration + E2E)
- [ ] 기존 기능 100% 동작
- [ ] 성능 개선 측정 가능 (초기 로딩, API 응답)

---

## 2. 현재 상태 분석

### 2.1 문제점

#### 아키텍처 문제
- **단일 파일 구조**: `index.tsx`가 5000줄 이상
- **컴포넌트 재사용 불가**: 모든 로직이 인라인으로 작성됨
- **테스트 불가능**: 단위 테스트 작성 불가능한 구조
- **유지보수 어려움**: 코드 탐색 및 수정 시간 증가

#### 인프라 문제
- **CDN 의존**: Tailwind CDN으로 런타임 로딩, 번들 최적화 불가
- **빌드 최적화 없음**: 코드 스플리팅, Tree Shaking 미적용
- **캐싱 없음**: 모든 API 요청이 새로운 fetch 호출

#### 타입 안전성 문제
- **타입 정의 없음**: 대부분 `any` 타입 사용
- **런타임 에러 가능성**: 타입 불일치로 인한 런타임 에러
- **DB 스키마 불일치**: 프론트엔드 타입과 DB 스키마 동기화 안됨

#### 상태 관리 문제
- **복잡한 Context**: 여러 Context가 중첩되어 복잡도 증가
- **불필요한 리렌더링**: 상태 변경 시 전체 컴포넌트 리렌더링
- **로컬/서버 상태 혼재**: 로컬 상태와 서버 상태 구분 없음

### 2.2 현재 코드베이스 구조

```
carivdealer1229/
├── index.tsx                # 5000줄+ 단일 파일
├── src/
│   ├── components/          # 일부 분리된 컴포넌트
│   │   ├── VehicleListPage.tsx
│   │   ├── GeneralSaleOffersPage.tsx
│   │   ├── LogisticsSchedulePage.tsx
│   │   ├── LogisticsHistoryPage.tsx
│   │   ├── SalesHistoryPage.tsx
│   │   ├── SettlementDetailPage.tsx
│   │   ├── SettlementListPage.tsx
│   │   └── ui/
│   │       └── Toast.tsx
│   ├── services/
│   │   ├── api.ts          # API 클라이언트
│   │   ├── apiMockData.ts  # Mock 데이터
│   │   └── gemini.ts       # Gemini API
│   ├── config/
│   │   ├── apiEndpoints.ts # API 엔드포인트
│   │   └── firebase.ts     # Firebase 설정
│   └── utils/
│       ├── errorHandler.ts
│       └── logger.ts
└── functions/               # Firebase Functions (백엔드)
```

### 2.3 데이터베이스 현황

**Firestore 컬렉션** (총 7개):
- `members` - 회원 정보
- `vehicles` - 차량 정보
- `inspections` - 검차 정보
- `auctions` - 경매 정보
- `trades` - 거래 정보
- `logistics` - 탁송 정보
- `settlements` - 정산 정보

**ERD 스키마**: [DATABASE_ERD_SCHEMA.md](./DATABASE_ERD_SCHEMA.md) 참조

---

## 3. 아키텍처 설계

### 3.1 FSD 레이어 구조

```
src/
├── app/                     # 애플리케이션 레이어
│   ├── providers/           # 전역 프로바이더
│   │   ├── QueryProvider.tsx
│   │   ├── ToastProvider.tsx
│   │   └── AuthProvider.tsx
│   ├── styles/              # 전역 스타일
│   │   └── globals.css
│   ├── router.tsx           # 라우팅 설정
│   └── main.tsx             # 애플리케이션 진입점
│
├── pages/                   # 페이지 레이어 (라우트별 조합)
│   ├── landing/             # 랜딩 페이지
│   │   └── LandingPage.tsx
│   └── admin/               # 어드민 페이지
│       ├── DashboardPage.tsx
│       ├── VehicleListPage.tsx
│       ├── VehicleDetailPage.tsx
│       ├── GeneralSaleOffersPage.tsx
│       ├── LogisticsSchedulePage.tsx
│       ├── LogisticsHistoryPage.tsx
│       ├── SalesHistoryPage.tsx
│       ├── SettlementListPage.tsx
│       └── SettlementDetailPage.tsx
│
├── widgets/                 # 위젯 레이어 (큰 UI 덩어리)
│   ├── Header/
│   │   ├── ui/Header.tsx
│   │   └── model/useHeader.ts
│   ├── Sidebar/
│   │   ├── ui/Sidebar.tsx
│   │   └── model/useSidebar.ts
│   ├── VehicleTable/
│   │   ├── ui/VehicleTable.tsx
│   │   └── model/useVehicleTable.ts
│   └── InspectionReportViewer/
│       ├── ui/InspectionReportViewer.tsx
│       └── model/useInspectionReport.ts
│
├── features/                # 기능 레이어 (비즈니스 로직)
│   ├── auth/
│   │   ├── login-form/
│   │   │   ├── ui/LoginForm.tsx
│   │   │   └── model/useLogin.ts
│   │   └── signup-form/
│   │       ├── ui/SignupForm.tsx
│   │       └── model/useSignup.ts
│   │
│   ├── vehicle/
│   │   ├── register-form/
│   │   │   ├── ui/VehicleRegisterForm.tsx
│   │   │   ├── model/useVehicleRegister.ts
│   │   │   └── api/vehicleApi.ts
│   │   ├── ocr-button/
│   │   │   ├── ui/OcrButton.tsx
│   │   │   ├── model/useOcr.ts
│   │   │   └── api/ocrApi.ts
│   │   └── filter-bar/
│   │       ├── ui/VehicleFilterBar.tsx
│   │       └── model/useVehicleFilter.ts
│   │
│   ├── inspection/
│   │   ├── request-form/
│   │   │   ├── ui/InspectionRequestForm.tsx
│   │   │   ├── model/useInspectionRequest.ts
│   │   │   └── api/inspectionApi.ts
│   │   ├── assign-evaluator/
│   │   │   ├── ui/AssignEvaluatorModal.tsx
│   │   │   ├── model/useAssignEvaluator.ts
│   │   │   └── api/assignApi.ts
│   │   └── upload-result/
│   │       ├── ui/UploadResultForm.tsx
│   │       ├── model/useUploadResult.ts
│   │       └── api/uploadResultApi.ts
│   │
│   ├── auction/
│   │   ├── place-bid/
│   │   │   ├── ui/BidForm.tsx
│   │   │   ├── model/useBid.ts
│   │   │   └── api/bidApi.ts
│   │   ├── buy-now/
│   │   │   ├── ui/BuyNowButton.tsx
│   │   │   ├── model/useBuyNow.ts
│   │   │   └── api/buyNowApi.ts
│   │   └── timer/
│   │       ├── ui/AuctionTimer.tsx
│   │       └── model/useAuctionTimer.ts
│   │
│   ├── trade/
│   │   ├── accept-proposal/
│   │   │   ├── ui/AcceptProposalModal.tsx
│   │   │   ├── model/useAcceptProposal.ts
│   │   │   └── api/acceptProposalApi.ts
│   │   └── change-sale-method/
│   │       ├── ui/ChangeSaleMethodModal.tsx
│   │       ├── model/useChangeSaleMethod.ts
│   │       └── api/changeSaleMethodApi.ts
│   │
│   ├── logistics/
│   │   ├── schedule-form/
│   │   │   ├── ui/LogisticsScheduleForm.tsx
│   │   │   ├── model/useLogisticsSchedule.ts
│   │   │   └── api/logisticsApi.ts
│   │   ├── dispatch-request/
│   │   │   ├── ui/DispatchRequestModal.tsx
│   │   │   ├── model/useDispatch.ts
│   │   │   └── api/dispatchApi.ts
│   │   └── handover-approval/
│   │       ├── ui/HandoverApprovalModal.tsx
│   │       ├── model/useHandover.ts
│   │       └── api/handoverApi.ts
│   │
│   └── settlement/
│       ├── settlement-viewer/
│       │   ├── ui/SettlementViewer.tsx
│       │   └── model/useSettlement.ts
│       └── settlement-notification/
│           ├── ui/SettlementNotificationButton.tsx
│           ├── model/useSettlementNotification.ts
│           └── api/settlementApi.ts
│
├── entities/                # 엔티티 레이어 (데이터 모델)
│   ├── vehicle/
│   │   ├── model/
│   │   │   ├── types.ts              # Vehicle 타입 정의
│   │   │   ├── schema.ts             # Zod 스키마 (런타임 검증)
│   │   │   └── constants.ts          # 상수 (상태 값 등)
│   │   ├── ui/
│   │   │   ├── VehicleCard.tsx       # 차량 카드 컴포넌트
│   │   │   └── VehicleStatusBadge.tsx
│   │   └── lib/
│   │       └── vehicleHelpers.ts     # 유틸리티 함수
│   │
│   ├── inspection/
│   │   ├── model/
│   │   │   ├── types.ts              # Inspection 타입 정의
│   │   │   ├── schema.ts             # Zod 스키마
│   │   │   └── constants.ts
│   │   └── ui/
│   │       ├── InspectionStatusBadge.tsx
│   │       └── InspectionReportCard.tsx
│   │
│   ├── auction/
│   │   ├── model/
│   │   │   ├── types.ts
│   │   │   ├── schema.ts
│   │   │   └── constants.ts
│   │   └── ui/
│   │       └── AuctionStatusBadge.tsx
│   │
│   ├── trade/
│   │   ├── model/
│   │   │   ├── types.ts
│   │   │   ├── schema.ts
│   │   │   └── constants.ts
│   │   └── ui/
│   │       └── TradeStatusBadge.tsx
│   │
│   ├── logistics/
│   │   ├── model/
│   │   │   ├── types.ts
│   │   │   ├── schema.ts
│   │   │   └── constants.ts
│   │   └── ui/
│   │       └── LogisticsStatusBadge.tsx
│   │
│   ├── settlement/
│   │   ├── model/
│   │   │   ├── types.ts
│   │   │   ├── schema.ts
│   │   │   └── constants.ts
│   │   └── ui/
│   │       └── SettlementStatusBadge.tsx
│   │
│   └── member/
│       ├── model/
│       │   ├── types.ts
│       │   ├── schema.ts
│       │   └── constants.ts
│       └── ui/
│           └── MemberAvatar.tsx
│
└── shared/                  # 공유 레이어 (공통 라이브러리)
    ├── api/
    │   ├── client.ts                 # Fetch 인스턴스
    │   ├── queryClient.ts            # TanStack Query 클라이언트
    │   ├── errorHandler.ts           # 에러 처리
    │   └── types.ts                  # 공통 API 타입
    │
    ├── ui/                           # 디자인 시스템 컴포넌트
    │   ├── Button.tsx
    │   ├── Input.tsx
    │   ├── Select.tsx
    │   ├── Modal.tsx
    │   ├── Toast.tsx
    │   ├── Table.tsx
    │   ├── Badge.tsx
    │   └── Card.tsx
    │
    ├── lib/                          # 유틸리티 함수
    │   ├── date.ts                   # 날짜 포맷팅
    │   ├── number.ts                 # 숫자 포맷팅
    │   ├── string.ts                 # 문자열 처리
    │   └── validation.ts             # 검증 함수
    │
    ├── config/
    │   ├── firebase.ts               # Firebase 설정
    │   ├── apiEndpoints.ts           # API 엔드포인트
    │   └── constants.ts              # 전역 상수
    │
    └── hooks/                        # 공통 훅
        ├── useDebounce.ts
        ├── useLocalStorage.ts
        └── useMediaQuery.ts
```

### 3.2 데이터베이스 매핑 전략

#### 타입 정의 계층

```
┌─────────────────────────────────────────┐
│  DATABASE (Firestore)                   │
│  - 실제 데이터 저장소                    │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  SCHEMA (Zod)                           │
│  - 런타임 검증                           │
│  - Firestore 데이터 → TypeScript 변환   │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  TYPES (TypeScript)                     │
│  - 컴파일 시간 타입 체크                 │
│  - IDE 자동 완성                         │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  API (TanStack Query)                   │
│  - 캐싱 및 상태 관리                     │
└───────────────┬─────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│  UI (React Components)                  │
│  - 사용자 인터페이스                     │
└─────────────────────────────────────────┘
```

#### 타입 정의 예시 (Vehicle)

**1. TypeScript 타입** (`entities/vehicle/model/types.ts`):
```typescript
import { Timestamp } from 'firebase/firestore';

export type VehicleStatus =
  | 'draft'
  | 'inspection'
  | 'bidding'
  | 'active_sale'
  | 'sold'
  | 'pending_settlement'
  | 'completed';

export type FuelType = '가솔린' | '디젤' | '하이브리드' | '전기';

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
```

**2. Zod 스키마** (`entities/vehicle/model/schema.ts`):
```typescript
import { z } from 'zod';
import { Timestamp } from 'firebase/firestore';

// Timestamp를 Zod로 검증
const timestampSchema = z.custom<Timestamp>(
  (val) => val instanceof Timestamp,
  { message: 'Invalid Timestamp' }
);

export const vehicleStatusSchema = z.enum([
  'draft',
  'inspection',
  'bidding',
  'active_sale',
  'sold',
  'pending_settlement',
  'completed'
]);

export const fuelTypeSchema = z.enum(['가솔린', '디젤', '하이브리드', '전기']);

export const offerSchema = z.object({
  id: z.string(),
  bidderName: z.string(),
  amount: z.string(),
  date: z.string(),
  status: z.enum(['pending', 'accepted', 'rejected'])
});

export const ocrMetadataSchema = z.object({
  extractedAt: timestampSchema,
  ocrVersion: z.string().optional(),
  confidence: z.number().min(0).max(100).optional()
});

export const publicDataMetadataSchema = z.object({
  lastQueriedAt: timestampSchema.optional(),
  queryParams: z.object({
    registYy: z.string().optional(),
    registMt: z.string().optional(),
    useFuelCode: z.string().optional()
  }).optional()
});

export const vehicleSchema = z.object({
  id: z.string(),
  status: vehicleStatusSchema,
  plateNumber: z.string().regex(/^\d{2}[가-힣]\s?\d{4}$/, 'Invalid plate number format'),
  vin: z.string().length(17).optional(),
  manufacturer: z.string(),
  modelName: z.string(),
  modelYear: z.string().regex(/^\d{4}$/, 'Invalid year format'),
  mileage: z.string().regex(/^\d+$/, 'Invalid mileage format'),
  fuelType: fuelTypeSchema.optional(),
  color: z.string().optional(),
  registrationDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  price: z.string().regex(/^\d+$/).optional(),
  highestBid: z.string().regex(/^\d+$/).optional(),
  thumbnailUrl: z.string().url().optional(),
  location: z.string().optional(),
  endTime: z.string().optional(),
  ownerId: z.string().optional(),
  inspectionId: z.string().optional(),
  auctionId: z.string().optional(),
  offers: z.array(offerSchema).optional(),
  ocrMetadata: ocrMetadataSchema.optional(),
  publicDataMetadata: publicDataMetadataSchema.optional(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema
});

// 타입 추론 (Zod 스키마 → TypeScript 타입)
export type VehicleSchemaType = z.infer<typeof vehicleSchema>;
```

**3. 상수 정의** (`entities/vehicle/model/constants.ts`):
```typescript
import type { VehicleStatus, FuelType } from './types';

export const VEHICLE_STATUS_LABELS: Record<VehicleStatus, string> = {
  draft: '임시 저장',
  inspection: '검차 진행 중',
  bidding: '경매 진행 중',
  active_sale: '일반 판매',
  sold: '판매 완료',
  pending_settlement: '정산 대기',
  completed: '거래 완료'
};

export const VEHICLE_STATUS_COLORS: Record<VehicleStatus, string> = {
  draft: 'gray',
  inspection: 'blue',
  bidding: 'purple',
  active_sale: 'green',
  sold: 'orange',
  pending_settlement: 'yellow',
  completed: 'teal'
};

export const FUEL_TYPE_LABELS: Record<FuelType, string> = {
  가솔린: 'Gasoline',
  디젤: 'Diesel',
  하이브리드: 'Hybrid',
  전기: 'Electric'
};

export const VEHICLE_STATUS_TRANSITIONS: Record<VehicleStatus, VehicleStatus[]> = {
  draft: ['inspection'],
  inspection: ['bidding', 'active_sale'],
  bidding: ['sold', 'active_sale'],
  active_sale: ['sold', 'bidding'],
  sold: ['pending_settlement'],
  pending_settlement: ['completed'],
  completed: []
};
```

### 3.3 API 레이어 설계

#### TanStack Query 훅 패턴

**1. 조회 쿼리** (`features/vehicle/*/model/useVehicles.ts`):
```typescript
import { useQuery } from '@tanstack/react-query';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '@/shared/config/firebase';
import { vehicleSchema } from '@/entities/vehicle/model/schema';
import type { Vehicle, VehicleStatus } from '@/entities/vehicle/model/types';

export const useVehicles = (ownerId?: string, status?: VehicleStatus[]) => {
  return useQuery({
    queryKey: ['vehicles', ownerId, status],
    queryFn: async (): Promise<Vehicle[]> => {
      let q = query(collection(db, 'vehicles'));

      if (ownerId) {
        q = query(q, where('ownerId', '==', ownerId));
      }

      if (status && status.length > 0) {
        q = query(q, where('status', 'in', status));
      }

      q = query(q, orderBy('updatedAt', 'desc'));

      const snapshot = await getDocs(q);
      const vehicles = snapshot.docs.map(doc => {
        const data = { id: doc.id, ...doc.data() };
        // Zod로 런타임 검증
        return vehicleSchema.parse(data);
      });

      return vehicles;
    },
    staleTime: 5 * 60 * 1000, // 5분
    cacheTime: 10 * 60 * 1000, // 10분
  });
};

export const useVehicle = (vehicleId: string) => {
  return useQuery({
    queryKey: ['vehicles', vehicleId],
    queryFn: async (): Promise<Vehicle> => {
      const docRef = doc(db, 'vehicles', vehicleId);
      const snapshot = await getDoc(docRef);

      if (!snapshot.exists()) {
        throw new Error('Vehicle not found');
      }

      const data = { id: snapshot.id, ...snapshot.data() };
      return vehicleSchema.parse(data);
    },
    enabled: !!vehicleId,
    staleTime: 5 * 60 * 1000,
  });
};
```

**2. 변경 뮤테이션** (`features/vehicle/register-form/model/useVehicleRegister.ts`):
```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/shared/config/firebase';
import { vehicleSchema } from '@/entities/vehicle/model/schema';
import type { Vehicle } from '@/entities/vehicle/model/types';
import { useToast } from '@/shared/ui/Toast';

type CreateVehicleInput = Omit<Vehicle, 'id' | 'createdAt' | 'updatedAt'>;

export const useVehicleRegister = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async (input: CreateVehicleInput): Promise<Vehicle> => {
      const vehicleData = {
        ...input,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'vehicles'), vehicleData);
      const createdVehicle = {
        id: docRef.id,
        ...input,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };

      // Zod로 검증
      return vehicleSchema.parse(createdVehicle);
    },
    onSuccess: (data) => {
      // 캐시 무효화
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      showToast('차량이 등록되었습니다.', 'success');
    },
    onError: (error) => {
      console.error('Vehicle registration failed:', error);
      showToast('차량 등록에 실패했습니다.', 'error');
    }
  });
};
```

**3. API 함수** (`features/vehicle/register-form/api/vehicleApi.ts`):
```typescript
import { apiClient } from '@/shared/api/client';
import { vehicleSchema } from '@/entities/vehicle/model/schema';
import type { Vehicle } from '@/entities/vehicle/model/types';

export const vehicleApi = {
  // OCR 처리
  ocrRegistration: async (carNo: string): Promise<Partial<Vehicle>> => {
    const response = await apiClient.post('/ocrRegistrationAPI', { car_no: carNo });
    return {
      vin: response.vin,
      manufacturer: response.manufacturer,
      modelName: response.model,
      modelYear: response.year,
      mileage: response.mileage
    };
  },

  // 공공데이터 조회
  getVehicleStatistics: async (params: {
    registYy: string;
    registMt: string;
    useFuelCode: string;
  }) => {
    const response = await apiClient.post('/getVehicleStatisticsAPI', params);
    return response;
  }
};
```

---

## 4. Phase별 실행 계획

### Phase 1: 인프라 및 빌드 시스템 개선 (1-2일)

#### 목표
- Tailwind CSS CDN → npm 전환
- 빌드 시스템 최적화
- 개발 환경 설정

#### 작업 내용

**1.1 Tailwind CSS 설정**

```bash
npm install -D tailwindcss@^3.4.17 postcss@^8.4.47 autoprefixer@^10.4.20
```

`tailwind.config.js`:
```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neutral 팔레트
        neutral: {
          50: '#f8f9fa',
          100: '#f1f3f5',
          200: '#e9ecef',
          300: '#dee2e6',
          400: '#ced4da',
          500: '#adb5bd',
          600: '#6c757d',
          700: '#495057',
          800: '#343a40',
          900: '#212529',
        },
        // Brand 팔레트
        brand: {
          50: '#e3f2fd',
          100: '#bbdefb',
          200: '#90caf9',
          300: '#64b5f6',
          400: '#42a5f5',
          500: '#2196f3',
          600: '#1e88e5',
          700: '#1976d2',
          800: '#1565c0',
          900: '#0d47a1',
        }
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
```

`postcss.config.js`:
```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

`src/app/styles/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  @font-face {
    font-family: 'Pretendard';
    src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff') format('woff');
    font-weight: 400;
    font-style: normal;
  }

  body {
    @apply font-sans text-neutral-900 bg-neutral-50;
  }
}

@layer components {
  .scrollbar-custom::-webkit-scrollbar {
    @apply w-2;
  }

  .scrollbar-custom::-webkit-scrollbar-track {
    @apply bg-neutral-100 rounded;
  }

  .scrollbar-custom::-webkit-scrollbar-thumb {
    @apply bg-neutral-400 rounded hover:bg-neutral-500;
  }
}
```

**1.2 Vite 설정 최적화**

`vite.config.ts`:
```typescript
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'tanstack-vendor': ['@tanstack/react-query'],
          'firebase-vendor': ['firebase/app', 'firebase/firestore', 'firebase/storage'],
        },
      },
    },
  },
});
```

**1.3 TypeScript 설정**

`tsconfig.json`:
```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,

    /* Paths */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

**검증**:
- [ ] `npm run dev` 정상 실행
- [ ] Tailwind 클래스 정상 적용
- [ ] CDN 제거 확인 (`index.html`에서 Tailwind CDN 제거)
- [ ] 빌드 성공 (`npm run build`)

---

### Phase 2: FSD 폴더 구조 및 타입 시스템 구축 (2-3일)

#### 목표
- FSD 폴더 구조 생성
- 엔티티별 타입 정의 (ERD 기반)
- Zod 스키마 작성 (런타임 검증)

#### 작업 내용

**2.1 의존성 설치**

```bash
npm install zod @tanstack/react-query firebase zustand
npm install -D @types/node
```

**2.2 엔티티 타입 정의 (ERD 기반)**

모든 엔티티에 대해 다음 파일 생성:

1. **Vehicle** (`src/entities/vehicle/model/`):
   - `types.ts` - TypeScript 타입 정의
   - `schema.ts` - Zod 스키마
   - `constants.ts` - 상수 (상태 값, 레이블 등)

2. **Inspection** (`src/entities/inspection/model/`):
   - `types.ts`
   - `schema.ts`
   - `constants.ts`

3. **Auction** (`src/entities/auction/model/`):
   - `types.ts`
   - `schema.ts`
   - `constants.ts`

4. **Trade** (`src/entities/trade/model/`):
   - `types.ts`
   - `schema.ts`
   - `constants.ts`

5. **Logistics** (`src/entities/logistics/model/`):
   - `types.ts`
   - `schema.ts`
   - `constants.ts`

6. **Settlement** (`src/entities/settlement/model/`):
   - `types.ts`
   - `schema.ts`
   - `constants.ts`

7. **Member** (`src/entities/member/model/`):
   - `types.ts`
   - `schema.ts`
   - `constants.ts`

**2.3 공유 레이어 구축**

**API 클라이언트** (`src/shared/api/client.ts`):
```typescript
const BASE_URL = 'https://asia-northeast3-carivdealer.cloudfunctions.net';

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = {
  async post<T = any>(endpoint: string, data?: any): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new ApiError(
          error.error || 'API request failed',
          response.status,
          error
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error', 0, error);
    }
  },

  async upload<T = any>(endpoint: string, formData: FormData): Promise<T> {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new ApiError(
          error.error || 'Upload failed',
          response.status,
          error
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError('Network error', 0, error);
    }
  },
};
```

**TanStack Query 설정** (`src/shared/api/queryClient.ts`):
```typescript
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      cacheTime: 10 * 60 * 1000, // 10분
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});
```

**Firebase 설정** (`src/shared/config/firebase.ts`):
```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const storage = getStorage(app);
```

**검증**:
- [ ] 모든 엔티티 타입 정의 완료
- [ ] Zod 스키마 작성 완료
- [ ] 타입 에러 0개 (tsc --noEmit)
- [ ] ERD 스키마와 100% 일치

---

### Phase 3: TanStack Query 도입 및 API 레이어 구축 (2-3일)

#### 목표
- TanStack Query 프로바이더 설정
- Firestore 쿼리 훅 작성
- API 함수 작성 (Firebase Functions 연동)

#### 작업 내용

**3.1 프로바이더 설정**

`src/app/providers/QueryProvider.tsx`:
```typescript
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from '@/shared/api/queryClient';
import type { PropsWithChildren } from 'react';

export const QueryProvider = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
};
```

**3.2 Firestore 쿼리 훅 작성**

각 엔티티별로 CRUD 훅 작성:

1. **Vehicle** (`src/features/vehicle/*/model/`):
   - `useVehicles.ts` - 차량 목록 조회
   - `useVehicle.ts` - 차량 상세 조회
   - `useVehicleRegister.ts` - 차량 등록
   - `useVehicleUpdate.ts` - 차량 수정
   - `useVehicleDelete.ts` - 차량 삭제

2. **Inspection** (`src/features/inspection/*/model/`):
   - `useInspections.ts` - 검차 목록 조회
   - `useInspection.ts` - 검차 상세 조회
   - `useInspectionRequest.ts` - 검차 신청
   - `useInspectionAssign.ts` - 평가사 배정
   - `useInspectionUploadResult.ts` - 검차 결과 업로드

3. **Auction** (`src/features/auction/*/model/`):
   - `useAuctions.ts` - 경매 목록 조회
   - `useAuction.ts` - 경매 상세 조회
   - `useBid.ts` - 입찰
   - `useBuyNow.ts` - 즉시구매

4. **Trade** (`src/features/trade/*/model/`):
   - `useTrades.ts` - 거래 목록 조회
   - `useAcceptProposal.ts` - 제안 수락
   - `useChangeSaleMethod.ts` - 판매 방식 변경

5. **Logistics** (`src/features/logistics/*/model/`):
   - `useLogistics.ts` - 탁송 목록 조회
   - `useLogisticsSchedule.ts` - 탁송 일정 조율
   - `useDispatch.ts` - 배차 요청
   - `useHandover.ts` - 인계 승인

6. **Settlement** (`src/features/settlement/*/model/`):
   - `useSettlements.ts` - 정산 목록 조회
   - `useSettlement.ts` - 정산 상세 조회

**3.3 API 함수 작성**

각 feature별 API 파일 작성:
- `features/vehicle/*/api/vehicleApi.ts`
- `features/inspection/*/api/inspectionApi.ts`
- `features/auction/*/api/bidApi.ts`
- `features/trade/*/api/tradeApi.ts`
- `features/logistics/*/api/logisticsApi.ts`
- `features/settlement/*/api/settlementApi.ts`

**검증**:
- [ ] 모든 쿼리 훅 작성 완료
- [ ] Firestore 연동 테스트 성공
- [ ] API 함수 작성 완료
- [ ] 캐싱 동작 확인

---

### Phase 4: 공통 UI 컴포넌트 구축 (2-3일)

#### 목표
- 디자인 시스템 컴포넌트 작성
- 재사용 가능한 UI 컴포넌트
- 접근성 (Accessibility) 고려

#### 작업 내용

**4.1 기본 컴포넌트**

1. **Button** (`src/shared/ui/Button.tsx`)
2. **Input** (`src/shared/ui/Input.tsx`)
3. **Select** (`src/shared/ui/Select.tsx`)
4. **Modal** (`src/shared/ui/Modal.tsx`)
5. **Toast** (`src/shared/ui/Toast.tsx`)
6. **Table** (`src/shared/ui/Table.tsx`)
7. **Badge** (`src/shared/ui/Badge.tsx`)
8. **Card** (`src/shared/ui/Card.tsx`)

**4.2 엔티티별 UI 컴포넌트**

1. **Vehicle**:
   - `VehicleCard.tsx` - 차량 카드
   - `VehicleStatusBadge.tsx` - 차량 상태 배지

2. **Inspection**:
   - `InspectionStatusBadge.tsx` - 검차 상태 배지
   - `InspectionReportCard.tsx` - 검차 리포트 카드

3. **Auction**:
   - `AuctionStatusBadge.tsx` - 경매 상태 배지
   - `AuctionTimer.tsx` - 경매 타이머

4. **기타 엔티티**: 각각 상태 배지 컴포넌트

**검증**:
- [ ] 모든 컴포넌트 Storybook 작성
- [ ] 접근성 테스트 통과 (aria-label 등)
- [ ] 반응형 디자인 확인

---

### Phase 5: 페이지 및 위젯 구축 (3-4일)

#### 목표
- 페이지 컴포넌트 작성
- 위젯 컴포넌트 작성
- 기능별 통합

#### 작업 내용

**5.1 페이지 컴포넌트**

1. `pages/landing/LandingPage.tsx`
2. `pages/admin/DashboardPage.tsx`
3. `pages/admin/VehicleListPage.tsx`
4. `pages/admin/VehicleDetailPage.tsx`
5. `pages/admin/GeneralSaleOffersPage.tsx`
6. `pages/admin/LogisticsSchedulePage.tsx`
7. `pages/admin/LogisticsHistoryPage.tsx`
8. `pages/admin/SalesHistoryPage.tsx`
9. `pages/admin/SettlementListPage.tsx`
10. `pages/admin/SettlementDetailPage.tsx`

**5.2 위젯 컴포넌트**

1. `widgets/Header/`
2. `widgets/Sidebar/`
3. `widgets/VehicleTable/`
4. `widgets/InspectionReportViewer/`

**검증**:
- [ ] 모든 페이지 렌더링 성공
- [ ] 라우팅 정상 동작
- [ ] 위젯 재사용성 확인

---

### Phase 6: index.tsx 마이그레이션 (3-5일)

#### 목표
- index.tsx 코드 분해
- 각 Screen을 페이지로 이동
- 기능 보존 확인

#### 작업 내용

**6.1 Screen 매핑**

```typescript
// 기존 Screen → 새 페이지 매핑
SCR-0000 (Landing) → pages/landing/LandingPage.tsx
SCR-0001 (Login) → pages/admin/LoginPage.tsx
SCR-0100 (Dashboard) → pages/admin/DashboardPage.tsx
SCR-0101 (Vehicle List) → pages/admin/VehicleListPage.tsx
SCR-0102 (Vehicle Detail) → pages/admin/VehicleDetailPage.tsx
SCR-0200 (General Sale Offers) → pages/admin/GeneralSaleOffersPage.tsx
SCR-0300 (Logistics Schedule) → pages/admin/LogisticsSchedulePage.tsx
SCR-0301 (Logistics History) → pages/admin/LogisticsHistoryPage.tsx
SCR-0400 (Sales History) → pages/admin/SalesHistoryPage.tsx
SCR-0500 (Settlement List) → pages/admin/SettlementListPage.tsx
SCR-0501 (Settlement Detail) → pages/admin/SettlementDetailPage.tsx
```

**6.2 점진적 마이그레이션**

1. Screen 하나씩 새 페이지로 이동
2. 기능 테스트
3. 문제 발생 시 롤백
4. 반복

**검증**:
- [ ] 모든 Screen 마이그레이션 완료
- [ ] 기존 기능 100% 동작
- [ ] 타입 에러 0개

---

### Phase 7: 테스트 환경 구축 (2-3일)

#### 목표
- Vitest 설정
- 단위 테스트 작성
- E2E 테스트 작성 (Playwright)

#### 작업 내용

**7.1 Vitest 설정**

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

`vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**7.2 단위 테스트 작성**

1. **엔티티 검증 테스트**:
   - `entities/vehicle/model/schema.test.ts`
   - `entities/inspection/model/schema.test.ts`
   - ...

2. **훅 테스트**:
   - `features/vehicle/register-form/model/useVehicleRegister.test.ts`
   - `features/auction/place-bid/model/useBid.test.ts`
   - ...

3. **컴포넌트 테스트**:
   - `shared/ui/Button.test.tsx`
   - `entities/vehicle/ui/VehicleCard.test.tsx`
   - ...

**7.3 E2E 테스트 작성** (Playwright)

```bash
npm install -D @playwright/test
```

1. **핵심 플로우 테스트**:
   - `tests/e2e/vehicle-registration.spec.ts`
   - `tests/e2e/auction-bid.spec.ts`
   - `tests/e2e/logistics-schedule.spec.ts`

**검증**:
- [ ] 모든 단위 테스트 통과
- [ ] E2E 테스트 통과
- [ ] 코드 커버리지 > 70%

---

### Phase 8: 최종 통합 및 검증 (2-3일)

#### 목표
- 전체 통합 테스트
- 성능 측정
- 문서화

#### 작업 내용

**8.1 통합 테스트**

- [ ] 빌드 성공 (`npm run build`)
- [ ] 개발 서버 정상 실행 (`npm run dev`)
- [ ] 타입 체크 통과 (`tsc --noEmit`)
- [ ] 린터 통과 (`npm run lint`)

**8.2 성능 측정**

- [ ] Lighthouse 점수 측정
- [ ] 초기 로딩 속도 측정
- [ ] API 응답 시간 측정
- [ ] 번들 크기 측정

**8.3 문서화**

- [ ] README.md 업데이트
- [ ] API 문서 작성
- [ ] 컴포넌트 문서 작성 (Storybook)
- [ ] 마이그레이션 가이드 작성

---

## 5. 데이터베이스 통합 전략

### 5.1 타입 동기화 프로세스

```
┌─────────────────────────────────────────────────────────┐
│  1. ERD 스키마 명세 (DATABASE_ERD_SCHEMA.md)             │
│     - 필드 정의                                          │
│     - 타입 정의                                          │
│     - 제약 조건                                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  2. TypeScript 타입 정의 (entities/*/model/types.ts)    │
│     - ERD 스키마 → TypeScript 인터페이스                 │
│     - 타입 안전성 보장                                   │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  3. Zod 스키마 작성 (entities/*/model/schema.ts)        │
│     - 런타임 검증                                        │
│     - Firestore 데이터 검증                              │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  4. 상수 정의 (entities/*/model/constants.ts)           │
│     - 상태 값 레이블                                     │
│     - 색상 매핑                                          │
│     - 상태 전이 규칙                                     │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  5. API 레이어 (features/*/api/*.ts)                    │
│     - Firestore 쿼리                                     │
│     - TanStack Query 훅                                  │
│     - 캐싱 전략                                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│  6. UI 컴포넌트 (pages/*, widgets/*, features/*/ui/)    │
│     - 타입 안전한 컴포넌트                               │
│     - 자동 완성 지원                                     │
└─────────────────────────────────────────────────────────┘
```

### 5.2 Firestore 쿼리 패턴

#### 복합 인덱스 활용

**1. 딜러별 차량 목록 조회** (최신순):
```typescript
export const useVehiclesByOwner = (ownerId: string, status?: VehicleStatus[]) => {
  return useQuery({
    queryKey: ['vehicles', 'owner', ownerId, status],
    queryFn: async () => {
      let q = query(
        collection(db, 'vehicles'),
        where('ownerId', '==', ownerId)
      );

      if (status && status.length > 0) {
        q = query(q, where('status', 'in', status));
      }

      q = query(q, orderBy('updatedAt', 'desc'));

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => 
        vehicleSchema.parse({ id: doc.id, ...doc.data() })
      );
    },
  });
};
// → 인덱스: ownerId + status + updatedAt (DESC)
```

**2. 진행 중인 경매 목록** (종료 임박순):
```typescript
export const useActiveAuctions = () => {
  return useQuery({
    queryKey: ['auctions', 'active'],
    queryFn: async () => {
      const q = query(
        collection(db, 'auctions'),
        where('status', '==', 'Active'),
        orderBy('endTime', 'asc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc =>
        auctionSchema.parse({ id: doc.id, ...doc.data() })
      );
    },
  });
};
// → 인덱스: status + endTime
```

**3. 평가사별 검차 일정** (배정일순):
```typescript
export const useInspectionsByEvaluator = (evaluatorId: string) => {
  return useQuery({
    queryKey: ['inspections', 'evaluator', evaluatorId],
    queryFn: async () => {
      const q = query(
        collection(db, 'inspections'),
        where('evaluatorId', '==', evaluatorId),
        where('status', '==', 'assigned'),
        orderBy('assignedAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc =>
        inspectionSchema.parse({ id: doc.id, ...doc.data() })
      );
    },
  });
};
// → 인덱스: evaluatorId + status + assignedAt (DESC)
```

### 5.3 데이터 무결성 보장

#### 트랜잭션 사용

**경매 입찰**:
```typescript
export const useBid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ auctionId, bidAmount }: { auctionId: string; bidAmount: number }) => {
      const auctionRef = doc(db, 'auctions', auctionId);

      return await runTransaction(db, async (transaction) => {
        const auctionDoc = await transaction.get(auctionRef);

        if (!auctionDoc.exists()) {
          throw new Error('Auction not found');
        }

        const auctionData = auctionDoc.data();

        if (auctionData.status !== 'Active') {
          throw new Error('Auction is not active');
        }

        const currentHighestBid = auctionData.currentHighestBid || auctionData.startPrice;

        if (bidAmount <= currentHighestBid) {
          throw new Error('Bid amount must be higher than current highest bid');
        }

        // 트랜잭션 내에서 업데이트
        transaction.update(auctionRef, {
          currentHighestBid: bidAmount,
          updatedAt: serverTimestamp(),
        });

        return { success: true };
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
    },
  });
};
```

**즉시구매**:
```typescript
export const useBuyNow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (auctionId: string) => {
      const auctionRef = doc(db, 'auctions', auctionId);

      return await runTransaction(db, async (transaction) => {
        const auctionDoc = await transaction.get(auctionRef);

        if (!auctionDoc.exists()) {
          throw new Error('Auction not found');
        }

        const auctionData = auctionDoc.data();

        if (auctionData.status !== 'Active') {
          throw new Error('Auction is not active');
        }

        if (!auctionData.buyNowPrice) {
          throw new Error('Buy now price is not set');
        }

        const vehicleRef = doc(db, 'vehicles', auctionData.vehicleId);

        // 트랜잭션 내에서 업데이트
        transaction.update(auctionRef, {
          status: 'Sold',
          currentHighestBid: auctionData.buyNowPrice,
          endedAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        });

        transaction.update(vehicleRef, {
          status: 'sold',
          updatedAt: serverTimestamp(),
        });

        return { success: true, contractId: `contract-${Date.now()}` };
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};
```

---

## 6. 테스트 전략

### 6.1 테스트 피라미드

```
         ┌─────────────┐
         │   E2E (10%) │  ← Playwright (핵심 플로우)
         └─────────────┘
      ┌───────────────────┐
      │ Integration (20%) │  ← 기능 통합 테스트
      └───────────────────┘
   ┌─────────────────────────┐
   │    Unit (70%)           │  ← Vitest (컴포넌트, 훅, 유틸)
   └─────────────────────────┘
```

### 6.2 단위 테스트

#### 엔티티 검증 테스트

`entities/vehicle/model/schema.test.ts`:
```typescript
import { describe, test, expect } from 'vitest';
import { vehicleSchema } from './schema';
import { Timestamp } from 'firebase/firestore';

describe('Vehicle Schema Validation', () => {
  test('유효한 차량 데이터 검증 성공', () => {
    const validVehicle = {
      id: 'v-001',
      status: 'draft',
      plateNumber: '33바 3333',
      manufacturer: 'Kia',
      modelName: 'Carnival KA4',
      modelYear: '2022',
      mileage: '50000',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    expect(() => vehicleSchema.parse(validVehicle)).not.toThrow();
  });

  test('잘못된 차량번호 형식 검증 실패', () => {
    const invalidVehicle = {
      id: 'v-001',
      status: 'draft',
      plateNumber: 'invalid',
      manufacturer: 'Kia',
      modelName: 'Carnival KA4',
      modelYear: '2022',
      mileage: '50000',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    expect(() => vehicleSchema.parse(invalidVehicle)).toThrow('Invalid plate number format');
  });

  test('VIN 17자리 검증', () => {
    const vehicleWithInvalidVin = {
      id: 'v-001',
      status: 'draft',
      plateNumber: '33바 3333',
      vin: 'INVALID',
      manufacturer: 'Kia',
      modelName: 'Carnival KA4',
      modelYear: '2022',
      mileage: '50000',
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    expect(() => vehicleSchema.parse(vehicleWithInvalidVin)).toThrow();
  });
});
```

#### 훅 테스트

`features/vehicle/register-form/model/useVehicleRegister.test.ts`:
```typescript
import { describe, test, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/shared/api/queryClient';
import { useVehicleRegister } from './useVehicleRegister';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useVehicleRegister', () => {
  test('차량 등록 성공', async () => {
    const { result } = renderHook(() => useVehicleRegister(), { wrapper });

    const vehicleData = {
      status: 'draft' as const,
      plateNumber: '33바 3333',
      manufacturer: 'Kia',
      modelName: 'Carnival KA4',
      modelYear: '2022',
      mileage: '50000',
    };

    result.current.mutate(vehicleData);

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toBeDefined();
  });

  test('차량 등록 실패 - 잘못된 데이터', async () => {
    const { result } = renderHook(() => useVehicleRegister(), { wrapper });

    const invalidData = {
      status: 'draft' as const,
      plateNumber: 'invalid',
      manufacturer: 'Kia',
      modelName: 'Carnival KA4',
      modelYear: '2022',
      mileage: '50000',
    };

    result.current.mutate(invalidData);

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
```

#### 컴포넌트 테스트

`shared/ui/Button.test.tsx`:
```typescript
import { describe, test, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  test('렌더링 확인', () => {
    render(<Button>클릭</Button>);
    expect(screen.getByText('클릭')).toBeInTheDocument();
  });

  test('클릭 이벤트 처리', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>클릭</Button>);

    fireEvent.click(screen.getByText('클릭'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test('disabled 상태 확인', () => {
    render(<Button disabled>클릭</Button>);
    expect(screen.getByText('클릭')).toBeDisabled();
  });
});
```

### 6.3 E2E 테스트

`tests/e2e/vehicle-registration.spec.ts`:
```typescript
import { test, expect } from '@playwright/test';

test.describe('차량 등록 플로우', () => {
  test('차량 등록 → 검차 신청 → 경매 등록', async ({ page }) => {
    // 1. 로그인
    await page.goto('http://localhost:5173');
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');

    // 2. 차량 등록 페이지 이동
    await page.click('text=차량 등록');
    await expect(page).toHaveURL(/vehicle\/register/);

    // 3. OCR 실행
    await page.fill('input[name="plateNumber"]', '33바 3333');
    await page.click('button:has-text("OCR 실행")');

    // 4. 차량 정보 입력
    await expect(page.locator('input[name="manufacturer"]')).toHaveValue('Kia');
    await expect(page.locator('input[name="modelName"]')).toHaveValue('Carnival KA4');

    // 5. 차량 등록
    await page.click('button:has-text("등록")');
    await expect(page.locator('text=차량이 등록되었습니다')).toBeVisible();

    // 6. 검차 신청 페이지 이동
    await page.click('text=검차 신청');
    await expect(page).toHaveURL(/inspection\/request/);

    // 7. 검차 신청
    await page.fill('input[name="preferredDate"]', '2026-02-01');
    await page.fill('input[name="preferredTime"]', '14:00');
    await page.click('button:has-text("신청")');
    await expect(page.locator('text=검차 신청이 완료되었습니다')).toBeVisible();

    // (이후 경매 등록 플로우...)
  });
});
```

---

## 7. 마이그레이션 로드맵

### 7.1 Phase별 일정

| Phase | 작업 내용 | 예상 기간 | 담당자 | 상태 |
|-------|----------|---------|-------|------|
| Phase 1 | 인프라 및 빌드 시스템 개선 | 1-2일 | - | ⏳ 대기 |
| Phase 2 | FSD 폴더 구조 및 타입 시스템 | 2-3일 | - | ⏳ 대기 |
| Phase 3 | TanStack Query 도입 및 API 레이어 | 2-3일 | - | ⏳ 대기 |
| Phase 4 | 공통 UI 컴포넌트 구축 | 2-3일 | - | ⏳ 대기 |
| Phase 5 | 페이지 및 위젯 구축 | 3-4일 | - | ⏳ 대기 |
| Phase 6 | index.tsx 마이그레이션 | 3-5일 | - | ⏳ 대기 |
| Phase 7 | 테스트 환경 구축 | 2-3일 | - | ⏳ 대기 |
| Phase 8 | 최종 통합 및 검증 | 2-3일 | - | ⏳ 대기 |

**총 예상 기간**: 17-26일 (약 3-4주)

### 7.2 위험 요소 및 대응 방안

| 위험 요소 | 영향도 | 발생 가능성 | 대응 방안 |
|----------|--------|------------|----------|
| 타입 정의 불일치 | 높음 | 중간 | ERD 스키마 기반 검증, Zod 스키마 사용 |
| 기존 기능 손실 | 높음 | 낮음 | 점진적 마이그레이션, E2E 테스트 |
| 성능 저하 | 중간 | 낮음 | 성능 측정, 최적화 |
| 일정 지연 | 중간 | 중간 | 버퍼 시간 확보, 우선순위 조정 |

---

## 8. 품질 보증 체크리스트

### 8.1 코드 품질

- [ ] TypeScript strict mode 활성화
- [ ] 타입 에러 0개 (tsc --noEmit)
- [ ] ESLint 경고 0개
- [ ] Prettier 포맷팅 적용
- [ ] 주석 및 JSDoc 작성 (복잡한 로직)
- [ ] 설계 결정사항 주석 작성

### 8.2 아키텍처

- [ ] FSD 레이어 구조 준수
- [ ] 엔티티별 타입 정의 완료
- [ ] Zod 스키마 작성 완료
- [ ] 순환 참조 없음
- [ ] 의존성 방향 올바름 (shared ← entities ← features ← widgets ← pages ← app)

### 8.3 데이터베이스

- [ ] ERD 스키마와 타입 정의 100% 일치
- [ ] Firestore 인덱스 최적화 완료
- [ ] 쿼리 성능 측정 (< 500ms)
- [ ] 트랜잭션 적용 (동시성 제어 필요 케이스)
- [ ] 데이터 무결성 검증

### 8.4 테스트

- [ ] 단위 테스트 커버리지 > 70%
- [ ] E2E 테스트 핵심 플로우 작성
- [ ] 모든 테스트 통과
- [ ] 엣지 케이스 테스트 작성

### 8.5 성능

- [ ] Lighthouse 점수 > 90 (Performance)
- [ ] 초기 로딩 속도 < 3초
- [ ] API 응답 시간 < 1초
- [ ] 번들 크기 최적화 (< 500KB gzip)

### 8.6 사용자 경험

- [ ] 반응형 디자인 (모바일, 태블릿, 데스크톱)
- [ ] 접근성 (WCAG 2.1 AA 준수)
- [ ] 에러 메시지 사용자 친화적
- [ ] 로딩 상태 표시
- [ ] 성공/실패 피드백 (Toast)

### 8.7 문서

- [ ] README.md 업데이트
- [ ] API 문서 작성
- [ ] 컴포넌트 문서 작성 (Storybook)
- [ ] 마이그레이션 가이드 작성
- [ ] 트러블슈팅 가이드 작성

---

## 부록

### A. 디렉토리 구조 전체 보기

```
src/
├── app/                          # 애플리케이션 레이어
│   ├── providers/
│   │   ├── QueryProvider.tsx
│   │   ├── ToastProvider.tsx
│   │   └── AuthProvider.tsx
│   ├── styles/
│   │   └── globals.css
│   ├── router.tsx
│   └── main.tsx
│
├── pages/                        # 페이지 레이어
│   ├── landing/
│   │   └── LandingPage.tsx
│   └── admin/
│       ├── DashboardPage.tsx
│       ├── VehicleListPage.tsx
│       ├── VehicleDetailPage.tsx
│       ├── GeneralSaleOffersPage.tsx
│       ├── LogisticsSchedulePage.tsx
│       ├── LogisticsHistoryPage.tsx
│       ├── SalesHistoryPage.tsx
│       ├── SettlementListPage.tsx
│       └── SettlementDetailPage.tsx
│
├── widgets/                      # 위젯 레이어
│   ├── Header/
│   ├── Sidebar/
│   ├── VehicleTable/
│   └── InspectionReportViewer/
│
├── features/                     # 기능 레이어
│   ├── auth/
│   ├── vehicle/
│   ├── inspection/
│   ├── auction/
│   ├── trade/
│   ├── logistics/
│   └── settlement/
│
├── entities/                     # 엔티티 레이어
│   ├── vehicle/
│   ├── inspection/
│   ├── auction/
│   ├── trade/
│   ├── logistics/
│   ├── settlement/
│   └── member/
│
└── shared/                       # 공유 레이어
    ├── api/
    ├── ui/
    ├── lib/
    ├── config/
    └── hooks/
```

### B. 참조 문서 목록

- [DATABASE_ERD_SCHEMA.md](./DATABASE_ERD_SCHEMA.md) - 데이터베이스 ERD 스키마 명세
- [FIRESTORE_SCHEMA.md](./FIRESTORE_SCHEMA.md) - Firestore 컬렉션 구조
- [API_SPECIFICATION_v2.md](./API_SPECIFICATION_v2.md) - API 명세서
- [FRD_v2.md](./FRD_v2.md) - 기능 요구사항 문서
- [DEVELOPMENT_GUIDE.md](Y:\0126\0127\saas-front\DEVELOPMENT_GUIDE.md) - 개발 가이드 (참조)

### C. 주요 의존성 목록

```json
{
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "@tanstack/react-query": "^5.0.0",
    "firebase": "^10.0.0",
    "zod": "^3.22.0",
    "zustand": "^4.5.0"
  },
  "devDependencies": {
    "@types/react": "^18.3.1",
    "@types/react-dom": "^18.3.0",
    "@types/node": "^20.0.0",
    "@vitejs/plugin-react": "^4.3.0",
    "typescript": "^5.5.0",
    "vite": "^5.4.0",
    "tailwindcss": "^3.4.17",
    "postcss": "^8.4.47",
    "autoprefixer": "^10.4.20",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "@testing-library/user-event": "^14.0.0",
    "@playwright/test": "^1.40.0",
    "eslint": "^8.57.0",
    "prettier": "^3.0.0"
  }
}
```

---

**문서 끝**

**다음 단계**: Phase 1 작업 시작 - 인프라 및 빌드 시스템 개선
