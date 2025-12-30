# FRD (Functional Requirements Document)
## ForwardMax B2B Used Car Export Platform

**문서 버전**: 1.0  
**작성일**: 2025-01-XX  
**프로젝트**: ForwardMax (carivdealer)  
**작성자**: Development Team

---

## 목차

1. [개요](#1-개요)
2. [기술 스택](#2-기술-스택)
3. [아키텍처 개요](#3-아키텍처-개요)
4. [화면 명세 (Screen Registry)](#4-화면-명세-screen-registry)
5. [기능 명세 (Function Registry)](#5-기능-명세-function-registry)
6. [API 엔드포인트 개요](#6-api-엔드포인트-개요)
7. [데이터 모델](#7-데이터-모델)
8. [환경 변수 및 설정](#8-환경-변수-및-설정)
9. [배포 및 빌드](#9-배포-및-빌드)

---

## 1. 개요

### 1.1 프로젝트 정보

- **프로젝트명**: ForwardMax
- **프로젝트 ID**: carivdealer
- **플랫폼 유형**: B2B 중고차 수출 플랫폼
- **대상 사용자**: 딜러(판매자), 바이어(구매자), 평가사, 운영자

### 1.2 문서 목적 및 범위

본 문서는 ForwardMax 플랫폼의 현재 구현 상태를 기반으로 작성된 기능 요구사항 명세서입니다.

**범위**:
- 프론트엔드 구현사항 (React/TypeScript 기반)
- 백엔드 API 엔드포인트 (Firebase Functions v2)
- 화면 구조 및 화면 전환 플로우
- 주요 기능 및 비즈니스 로직
- 기술 스택 및 아키텍처

**제외 사항**:
- 바이어(구매자) 화면 (Phase 1 범위 외)
- 운영자 대시보드 (Phase 1 범위 외)

---

## 2. 기술 스택

### 2.1 프론트엔드 기술 스택

| 카테고리 | 기술/라이브러리 | 버전 | 용도 |
|---------|----------------|------|------|
| **프레임워크** | React | 19.2.3 | UI 프레임워크 |
| **언어** | TypeScript | 5.8.2 | 타입 안정성 |
| **빌드 도구** | Vite | 6.2.0 | 번들러 및 개발 서버 |
| **스타일링** | Tailwind CSS | CDN | 유틸리티 기반 CSS |
| **아이콘** | lucide-react | 0.562.0 | 아이콘 라이브러리 |
| **AI 서비스** | @google/genai | 1.34.0 | Gemini API 클라이언트 |

### 2.2 백엔드 기술 스택

| 카테고리 | 기술/라이브러리 | 버전 | 용도 |
|---------|----------------|------|------|
| **런타임** | Node.js | 20 | 서버 런타임 |
| **프레임워크** | Firebase Functions | v2 (5.0.0) | 서버리스 함수 |
| **데이터베이스** | Firebase Firestore | - | NoSQL 데이터베이스 |
| **스토리지** | Firebase Storage | - | 파일 스토리지 |
| **인증** | Firebase Auth | - | 사용자 인증 |
| **HTTP 프레임워크** | Express | 4.18.2 | HTTP 요청 처리 |

### 2.3 인프라 및 배포 환경

| 서비스 | 용도 | 리전 |
|--------|------|------|
| **Firebase Hosting** | 프론트엔드 호스팅 | - |
| **Firebase Functions** | 백엔드 API | asia-northeast3 |
| **Firebase Firestore** | 데이터베이스 | asia-northeast3 |
| **Firebase Storage** | 파일 스토리지 | asia-northeast3 |
| **GCP Secret Manager** | API 키 관리 | asia-northeast3 |

### 2.4 개발 도구

| 도구 | 용도 |
|------|------|
| **TypeScript** | 타입 체크 및 컴파일 |
| **Vite** | 개발 서버 및 빌드 |
| **Firebase CLI** | 배포 및 관리 |
| **Git** | 버전 관리 |

---

## 3. 아키텍처 개요

### 3.1 시스템 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Components   │  │  Services    │  │   Utils      │ │
│  │  (Pages)     │→ │  (API Client)│  │  (Logger)    │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
                          │ HTTPS
                          ↓
┌─────────────────────────────────────────────────────────┐
│              Firebase Functions v2 (Node.js)            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │   Member      │  │   Vehicle    │  │   Auction    │ │
│  │   APIs        │  │   APIs       │  │   APIs       │ │
│  └──────────────┘  └──────────────┘  └──────────────┘ │
└─────────────────────────────────────────────────────────┘
                          │
        ┌─────────────────┼─────────────────┐
        ↓                 ↓                 ↓
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Firestore   │  │   Storage    │  │  Secret      │
│  (Database)  │  │   (Files)    │  │  Manager     │
└──────────────┘  └──────────────┘  └──────────────┘
```

### 3.2 디렉토리 구조

```
FOWARDMAX/
├── src/
│   ├── components/          # 페이지 컴포넌트
│   │   ├── VehicleListPage.tsx
│   │   ├── GeneralSaleOffersPage.tsx
│   │   ├── SalesHistoryPage.tsx
│   │   ├── SettlementListPage.tsx
│   │   ├── SettlementDetailPage.tsx
│   │   ├── LogisticsSchedulePage.tsx
│   │   └── LogisticsHistoryPage.tsx
│   ├── services/            # API 클라이언트 및 서비스
│   │   ├── api.ts          # API 클라이언트
│   │   └── gemini.ts       # Gemini AI 서비스
│   ├── config/             # 설정 파일
│   │   └── firebase.ts     # Firebase 초기화
│   ├── utils/              # 유틸리티
│   │   └── logger.ts       # 로깅 유틸리티
│   └── vite-env.d.ts       # 환경 변수 타입 정의
├── functions/              # Firebase Functions
│   ├── src/
│   │   ├── index.ts        # 엔드포인트 등록
│   │   ├── member/         # 회원 관련 API
│   │   ├── vehicle/        # 차량 관련 API
│   │   ├── auction/        # 경매 관련 API
│   │   ├── trade/          # 거래 관련 API
│   │   └── config/         # 설정 (Secret Manager)
│   └── lib/                # 컴파일된 JavaScript
├── docs/                   # 문서
├── index.tsx               # 메인 앱 진입점
├── package.json
├── vite.config.ts
├── tsconfig.json
└── firebase.json
```

### 3.3 컴포넌트 구조

**메인 앱 구조** (`index.tsx`):
- 단일 파일에 모든 화면 컴포넌트 포함
- `App` 컴포넌트에서 화면 라우팅 관리
- `handleNavigate` 함수로 화면 전환 제어

**페이지 컴포넌트** (`src/components/`):
- 각 화면별 독립적인 컴포넌트 파일
- `onNavigate` prop으로 화면 전환 처리
- `vehicleId` 등 필요한 파라미터 전달

### 3.4 상태 관리 방식

- **로컬 상태**: React `useState` Hook 사용
- **전역 상태**: `App` 컴포넌트의 `currentVehicleId`, `editingVehicleId` 상태
- **데이터 페칭**: 각 컴포넌트에서 `useEffect`로 데이터 로드
- **Mock 데이터**: 프로토타입 단계에서 `MockDataService` 사용

---

## 4. 화면 명세 (Screen Registry)

### 4.1 화면 목록

| Screen ID | 화면명 | 컴포넌트 위치 | 상태 |
|-----------|--------|--------------|------|
| SCR-0000 | 랜딩 페이지 | `index.tsx` (LandingPage) | ✅ 구현됨 |
| SCR-0001 | 로그인 | `index.tsx` (LoginPage) | ✅ 구현됨 |
| SCR-0002 | 회원가입 (약관) | `index.tsx` (SignupTermsPage) | ✅ 구현됨 |
| SCR-0002-1 | 회원가입 약관 | `index.tsx` (SignupTermsPage) | ✅ 구현됨 |
| SCR-0002-2 | 회원가입 정보 입력 | `index.tsx` (SignupInfoPage) | ✅ 구현됨 |
| SCR-0003-1 | 승인 대기 | `index.tsx` (ApprovalStatusPage) | ✅ 구현됨 |
| SCR-0003-2 | 승인 완료 | `index.tsx` (ApprovalStatusPage) | ✅ 구현됨 |
| SCR-0100 | 딜러 대시보드 | `index.tsx` (DashboardPage) | ✅ 구현됨 |
| SCR-0101 | 차량 목록 | `src/components/VehicleListPage.tsx` | ✅ 구현됨 |
| SCR-0102 | 일반 판매 제안 목록 | `src/components/GeneralSaleOffersPage.tsx` | ✅ 구현됨 |
| SCR-0103 | 판매 내역 | `src/components/SalesHistoryPage.tsx` | ✅ 구현됨 |
| SCR-0104 | 정산 내역 | `src/components/SettlementListPage.tsx` | ✅ 구현됨 |
| SCR-0105 | 정산 상세 | `src/components/SettlementDetailPage.tsx` | ✅ 구현됨 |
| SCR-0200 | 차량 등록 | `index.tsx` (RegisterVehiclePage) | ✅ 구현됨 |
| SCR-0200-Draft | 임시 저장 목록 | `index.tsx` (VehicleDraftListPage) | ✅ 구현됨 |
| SCR-0201 | 검차 신청 | `index.tsx` (InspectionRequestPage) | ✅ 구현됨 |
| SCR-0201-Progress | 검차 진행 상태 | `index.tsx` (InspectionStatusPage) | ✅ 구현됨 |
| SCR-0202 | 검차 결과 조회 | `index.tsx` (InspectionReportPage) | ✅ 구현됨 |
| SCR-0300 | 판매 방식 선택 | `index.tsx` (SalesMethodPage) | ✅ 구현됨 |
| SCR-0301-N | 일반 판매 - 분석 중 | `index.tsx` (GeneralSalePageLoading) | ✅ 구현됨 |
| SCR-0302-N | 일반 판매 - 가격 설정 | `index.tsx` (GeneralSalePagePrice) | ✅ 구현됨 |
| SCR-0303-N | 일반 판매 - 완료 | `index.tsx` (GeneralSalePageComplete) | ✅ 구현됨 |
| SCR-0400 | 경매 상세 | `index.tsx` (AuctionDetailPage) | ✅ 구현됨 |
| SCR-0401-A | 경매 - 시작가 설정 | `index.tsx` (AuctionSalePageStartPrice) | ✅ 구현됨 |
| SCR-0402-A | 경매 - 기간 설정 | `index.tsx` (AuctionSalePageDuration) | ✅ 구현됨 |
| SCR-0403-A | 경매 - 완료 | `index.tsx` (AuctionSalePageComplete) | ✅ 구현됨 |
| SCR-0600 | 탁송 예약/배차 | `src/components/LogisticsSchedulePage.tsx` | ✅ 구현됨 |
| SCR-0601 | 탁송 내역 | `src/components/LogisticsHistoryPage.tsx` | ✅ 구현됨 |

**총 화면 수**: 27개

### 4.2 주요 화면 전환 플로우

#### FLOW-01: 회원가입 플로우
```
SCR-0000 (랜딩) 
  → SCR-0001 (로그인) 
  → SCR-0002 (회원가입 약관) 
  → SCR-0002-2 (정보 입력) 
  → SCR-0003-1 (승인 대기) 
  → SCR-0003-2 (승인 완료) 
  → SCR-0100 (대시보드)
```

#### FLOW-02: 검차 플로우
```
SCR-0200 (차량 등록) 
  → SCR-0201 (검차 신청) 
  → SCR-0201-Progress (검차 진행) 
  → SCR-0202 (검차 결과)
```

#### FLOW-03: 판매 플로우
```
SCR-0202 (검차 결과) 
  → SCR-0300 (판매 방식 선택)
    ├─ 일반 판매: SCR-0301-N → SCR-0302-N → SCR-0303-N → SCR-0102
    └─ 경매: SCR-0401-A → SCR-0402-A → SCR-0403-A → SCR-0400
```

#### FLOW-04: 정산/탁송 플로우
```
SCR-0104 (정산 내역) 
  → SCR-0105 (정산 상세) 
  → SCR-0600 (탁송 예약) 
  → SCR-0601 (탁송 내역)
```

### 4.3 주요 화면 상세 명세

#### SCR-0100: 딜러 대시보드
- **위치**: `index.tsx` (DashboardPage)
- **주요 기능**:
  - 통계 카드 표시 (차량 수, 판매 중, 경매 중 등)
  - 빠른 액션 버튼 (매물 등록, 차량 목록 등)
  - 최근 활동 목록
- **화면 전환**:
  - 매물 등록 → SCR-0200
  - 차량 목록 → SCR-0101
  - 일반 판매 제안 → SCR-0102
  - 판매 내역 → SCR-0103
  - 정산 내역 → SCR-0104
  - 탁송 내역 → SCR-0601

#### SCR-0200: 차량 등록
- **위치**: `index.tsx` (RegisterVehiclePage)
- **주요 기능**:
  - 등록원부 OCR (Gemini API 연동)
  - 차량 기본정보 입력
  - 시세 추정 (Gemini API 연동)
  - 검차 요청 버튼
- **API 호출**:
  - `apiClient.vehicle.ocrRegistration()` - 등록원부 OCR
  - `GeminiService.estimateMarketPrice()` - 시세 추정
- **화면 전환**:
  - 검차 요청 → SCR-0201 (vehicleId 전달)

#### SCR-0201: 검차 신청
- **위치**: `index.tsx` (InspectionRequestPage)
- **주요 기능**:
  - 검차 장소 입력
  - 방문 희망 일시 선택
  - 예약 확정
- **API 호출**:
  - `apiClient.vehicle.inspection.request()` - 검차 신청
- **화면 전환**:
  - 예약 확정 → SCR-0201-Progress (vehicleId 전달)

#### SCR-0202: 검차 결과 조회
- **위치**: `index.tsx` (InspectionReportPage)
- **주요 기능**:
  - 검차 리포트 상세 조회
  - AI 종합 진단 표시
  - 평가사 정보 표시
  - 미디어 갤러리 (사진/영상)
- **화면 전환**:
  - 판매 등록 시작 → SCR-0300 (vehicleId 전달)

#### SCR-0300: 판매 방식 선택
- **위치**: `index.tsx` (SalesMethodPage)
- **주요 기능**:
  - 일반 판매 / 경매 선택
  - 각 방식별 설명 및 특징 표시
- **화면 전환**:
  - 일반 판매 선택 → SCR-0301-N (vehicleId 전달)
  - 경매 선택 → SCR-0401-A (vehicleId 전달)

#### SCR-0600: 탁송 예약/배차
- **위치**: `src/components/LogisticsSchedulePage.tsx`
- **주요 기능**:
  - 출발지 자동 채움 (차량 등록 주소)
  - 도착지 자동 지정 (인천항 물류센터)
  - 희망 날짜/시간 선택
  - 특이사항 입력
  - SKIP 버튼 (테스트용)
- **API 호출**:
  - `apiClient.logistics.schedule()` - 탁송 일정 조율
- **화면 전환**:
  - 예약 완료 → SCR-0601

#### SCR-0601: 탁송 내역
- **위치**: `src/components/LogisticsHistoryPage.tsx`
- **주요 기능**:
  - 탁송 내역 목록 조회
  - 인계 승인 모달 (PIN 입력)
  - 기사 정보 표시
  - 차량 정보 표시
- **API 호출**:
  - `apiClient.logistics.approveHandover()` - 인계 승인
- **화면 전환**:
  - 인계 승인 완료 → SCR-0105 (정산 상세, vehicleId 전달)

---

## 5. 기능 명세 (Function Registry)

### 5.1 회원 관련 기능

#### FUNC-01: 딜러 회원가입
- **화면**: SCR-0002-2
- **API**: `apiClient.member.register()`
- **입력**:
  - email: string
  - password: string
  - dealer_name: string
  - phone: string
  - terms_agreed: boolean
- **출력**:
  - success: boolean
  - member_id: string
  - message: string

#### FUNC-02: 사업자 인증
- **화면**: SCR-0003-1
- **API**: `apiClient.member.verifyBusiness()`
- **입력**: business_registration_image (File)
- **출력**:
  - success: boolean
  - verified: boolean
  - business_info: { companyName, businessRegNo, representativeName }
  - message: string
- **구현 상태**: Mock 응답 반환 (프로토타입)

### 5.2 차량 관련 기능

#### FUNC-05: 차량 등록 (등록원부 OCR)
- **화면**: SCR-0200
- **API**: `apiClient.vehicle.ocrRegistration()`
- **입력**: car_no (차량번호)
- **출력**:
  - vin: string
  - manufacturer: string
  - model: string
  - year: string
  - mileage: string
- **구현 상태**: Mock 응답 반환 (프로토타입)

#### FUNC-06: 검차 신청
- **화면**: SCR-0201
- **API**: `apiClient.vehicle.inspection.request()`
- **입력**:
  - vehicle_id: string
  - preferred_date: string
  - preferred_time: string
- **출력**:
  - success: boolean
  - inspection_id: string
  - message: string
- **구현 상태**: Firebase Functions 구현됨

### 5.3 판매 관련 기능

#### FUNC-15: 판매 방식 변경
- **화면**: SCR-0300, SCR-0400
- **API**: `apiClient.trade.changeSaleMethod()`
- **입력**:
  - vehicle_id: string
  - auction_settings: { start_price, buy_now_price? }
- **출력**:
  - success: boolean
  - auction_id: string
- **구현 상태**: Firebase Functions 구현됨

#### FUNC-16: 일반 판매 제안 수락/거절
- **화면**: SCR-0102
- **API**: `apiClient.trade.acceptProposal()`
- **입력**:
  - proposalId: string
  - action: 'accept' | 'reject'
- **출력**:
  - success: boolean
  - message: string
- **구현 상태**: Mock 응답 반환 (프로토타입)

#### FUNC-17: 바이어 최종 구매 의사 재확인
- **화면**: SCR-0102
- **API**: `apiClient.trade.confirmProposal()`
- **입력**:
  - proposalId: string
  - confirmed: boolean
- **출력**:
  - success: boolean
  - message: string
- **구현 상태**: Mock 응답 반환 (프로토타입)

### 5.4 경매 관련 기능

#### FUNC-18: 경매 입찰
- **화면**: SCR-0400 (바이어 외부 시스템)
- **API**: `apiClient.auction.bid()`
- **입력**:
  - auction_id: string
  - bid_amount: number
- **출력**:
  - success: boolean
  - message: string
- **구현 상태**: Firebase Functions 구현됨

#### FUNC-19: 즉시구매
- **화면**: SCR-0400 (바이어 외부 시스템)
- **API**: `apiClient.auction.buyNow()`
- **입력**: auction_id: string
- **출력**:
  - success: boolean
  - contract_id: string
  - message: string
- **구현 상태**: Firebase Functions 구현됨

### 5.5 탁송 관련 기능

#### FUNC-20: 탁송 일정 조율
- **화면**: SCR-0600
- **API**: `apiClient.logistics.schedule()`
- **입력**:
  - schedule_date: string
  - schedule_time: string
  - address: string
- **출력**:
  - success: boolean
  - schedule_id: string
- **구현 상태**: Mock 응답 반환 (프로토타입)

#### FUNC-21: 배차 조율 및 확정
- **화면**: SCR-0600, SCR-0601
- **API**: 
  - `apiClient.logistics.dispatch.request()` - 배차 요청
  - `apiClient.logistics.dispatch.confirm()` - 배차 확정
- **입력**:
  - scheduleId/dispatchId: string
- **출력**:
  - success: boolean
  - dispatch_id: string (요청 시)
  - driver_info: { name, phone } (확정 시)
- **구현 상태**: Mock 응답 반환 (프로토타입)

#### FUNC-22: 인계 승인
- **화면**: SCR-0601
- **API**: `apiClient.logistics.approveHandover()`
- **입력**:
  - logisticsId: string
  - pin: string (6자리)
- **출력**:
  - success: boolean
  - handover_timestamp: string
- **구현 상태**: Mock 응답 반환 (프로토타입)

### 5.6 정산 관련 기능

#### FUNC-23: 정산 완료 알림
- **화면**: SCR-0105
- **API**: `apiClient.settlement.notify()`
- **입력**: settlementId: string
- **출력**:
  - success: boolean
  - notification_id: string
- **구현 상태**: Mock 응답 반환 (프로토타입)

### 5.7 AI 서비스 기능

#### GeminiService: 사업자등록증 OCR
- **위치**: `src/services/gemini.ts`
- **메서드**: `GeminiService.extractBusinessInfo()`
- **입력**: file (File 객체)
- **출력**:
  - companyName: string
  - businessRegNo: string
  - representativeName: string
- **모델**: gemini-3-pro-preview
- **구현 상태**: ✅ 구현됨

#### GeminiService: 등록원부 OCR
- **위치**: `src/services/gemini.ts`
- **메서드**: `GeminiService.extractVehicleRegistration()`
- **입력**: file (File 객체)
- **출력**:
  - plateNumber: string
  - vin: string
  - manufacturer: string
  - modelName: string
  - modelYear: string
  - fuelType: string
  - registrationDate: string
  - mileage: string
- **모델**: gemini-3-pro-preview
- **구현 상태**: ✅ 구현됨

#### GeminiService: 시세 추정
- **위치**: `src/services/gemini.ts`
- **메서드**: `GeminiService.estimateMarketPrice()`
- **입력**:
  - model: string (차량 모델명)
  - year: string (연식)
- **출력**:
  - text: string (시세 정보)
  - sources: Array<{ title: string, uri: string }> (참고 자료)
- **모델**: gemini-3-flash-preview
- **도구**: Google Search 연동
- **구현 상태**: ✅ 구현됨

---

## 6. API 엔드포인트 개요

### 6.1 API 기본 URL

```
프로덕션: https://asia-northeast3-carivdealer.cloudfunctions.net
개발: (환경 변수로 설정 가능)
```

### 6.2 인증 방식

- **현재 상태**: 인증 미구현 (프로토타입 단계)
- **계획**: Firebase Auth 토큰 기반 인증 (향후 구현)

### 6.3 공통 헤더

```typescript
Content-Type: application/json
```

### 6.4 에러 처리

**에러 응답 형식**:
```json
{
  "error": "에러 메시지"
}
```

**HTTP 상태 코드**:
- `200`: 성공
- `400`: 잘못된 요청
- `404`: 리소스 없음
- `405`: 허용되지 않은 메서드
- `500`: 서버 오류

### 6.5 CORS 설정

- Firebase Functions v2에서 `cors: true` 옵션으로 자동 처리
- 모든 엔드포인트에서 CORS 허용

---

## 7. 데이터 모델

### 7.1 주요 엔터티

#### Vehicle (차량)
```typescript
interface Vehicle {
  id: string;
  status: 'draft' | 'inspection' | 'bidding' | 'sold' | 'pending_settlement' | 'active_sale';
  plateNumber: string;
  modelName: string;
  manufacturer: string;
  modelYear: string;
  mileage: string;
  price: string;
  highestBid?: string;
  thumbnailUrl?: string;
  updatedAt: string;
  fuelType?: string;
  registrationDate?: string;
  color?: string;
  vin?: string;
  inspectionId?: string;
  location?: string;
  endTime?: string;
  offers?: Offer[];
}
```

#### Offer (제안)
```typescript
interface Offer {
  id: string;
  bidderName: string;
  amount: string;
  date: string;
  isHighest?: boolean;
  vehicleId: string;
  expiresAt?: string;
}
```

#### InspectionReport (검차 리포트)
```typescript
interface InspectionReport {
  id: string;
  vehicleId: string;
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
  media: {
    category: string;
    count: number;
    items: { type: 'image' | 'video', url: string, label: string }[];
  }[];
}
```

### 7.2 Firestore 컬렉션 구조

```
vehicles/
  {vehicleId}/
    - id, status, plateNumber, modelName, ...
    
inspections/
  {inspectionId}/
    - vehicleId, preferredDate, preferredTime, status, createdAt
    
auctions/
  {auctionId}/
    - vehicleId, startPrice, buyNowPrice, currentHighestBid, status, createdAt
```

---

## 8. 환경 변수 및 설정

### 8.1 환경 변수 목록

**프론트엔드** (`.env.local`):
```bash
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=carivdealer
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
VITE_API_BASE_URL=https://asia-northeast3-carivdealer.cloudfunctions.net
```

**백엔드** (GCP Secret Manager):
- `gemini-api-key`: Gemini API 키

### 8.2 설정 파일

**vite.config.ts**:
- 환경 변수 로드 및 정의
- 경로 별칭 설정 (`@/`)
- React 플러그인 설정

**tsconfig.json**:
- TypeScript 컴파일 옵션
- 경로 매핑 설정

**firebase.json**:
- Firebase 프로젝트 설정
- Hosting, Functions, Firestore 설정

---

## 9. 배포 및 빌드

### 9.1 빌드 프로세스

**프론트엔드 빌드**:
```bash
npm install
npm run build
```
- 빌드 결과물: `dist/` 폴더
- Vite가 TypeScript 컴파일 및 번들링 수행

**백엔드 빌드**:
```bash
cd functions
npm install
npm run build
```
- 빌드 결과물: `functions/lib/` 폴더
- TypeScript 컴파일 수행

### 9.2 배포 프로세스

**전체 배포**:
```bash
firebase deploy
```

**선택적 배포**:
```bash
firebase deploy --only hosting    # 프론트엔드만
firebase deploy --only functions  # 백엔드만
firebase deploy --only firestore:rules  # Firestore Rules만
```

### 9.3 배포 환경

- **프로덕션 URL**: https://carivdealer.web.app
- **Functions 리전**: asia-northeast3
- **Firestore 리전**: asia-northeast3

---

## 부록

### A. 화면 전환 매트릭스

| From Screen | To Screen | 트리거 | 조건 |
|-------------|-----------|--------|------|
| SCR-0000 | SCR-0001 | 로그인 버튼 | - |
| SCR-0001 | SCR-0002 | 회원가입 버튼 | - |
| SCR-0002-2 | SCR-0003-1 | 신청하기 버튼 | 정보 입력 완료 |
| SCR-0003-2 | SCR-0100 | 시작하기 버튼 | 승인 완료 |
| SCR-0100 | SCR-0200 | 매물 등록 버튼 | - |
| SCR-0200 | SCR-0201 | 검차 요청 버튼 | 차량 정보 저장 완료 |
| SCR-0201 | SCR-0201-Progress | 예약 확정 버튼 | 검차 신청 완료 |
| SCR-0201-Progress | SCR-0202 | 결과 확인 버튼 | progress === 100 |
| SCR-0202 | SCR-0300 | 판매 등록 시작 버튼 | 검차 완료 |
| SCR-0300 | SCR-0301-N | 일반 판매 선택 | 판매 방식 = 일반 |
| SCR-0300 | SCR-0401-A | 경매 선택 | 판매 방식 = 경매 |
| SCR-0303-N | SCR-0102 | 제안 목록 보기 버튼 | 일반 판매 완료 |
| SCR-0403-A | SCR-0400 | 경매 생성 완료 | 경매 설정 완료 |
| SCR-0105 | SCR-0600 | 탁송 신청 버튼 | 정산 완료 |
| SCR-0600 | SCR-0601 | 예약 완료 | 탁송 일정 확정 |
| SCR-0601 | SCR-0105 | 인계 승인 완료 | PIN 입력 완료 |

### B. Mock 데이터 서비스

**위치**: `index.tsx` (MockDataService)

**주요 메서드**:
- `getMockVehicles()`: Mock 차량 목록 반환
- `getVehicleById(id)`: ID로 차량 조회
- `createVehicle(formData, vehicleId?)`: 새 차량 생성
- `scheduleInspection(vehicleId, schedule)`: 검차 신청
- `startAuction(vehicleId, config)`: 경매 시작
- `startGeneralSale(vehicleId, price)`: 일반 판매 시작
- `getInspectionReport(vehicleId)`: 검차 리포트 반환

---

**문서 끝**

