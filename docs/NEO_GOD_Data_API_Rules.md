# NEO GOD 데이터 및 인터페이스 강제 규칙

**목적**: ERD 필드 정의 시 데이터 타입·제약 명시, API 명세 RESTful 원칙 및 요청/응답 핵심 파라미터 명시.  
**참조**: [archive/FIRESTORE_SCHEMA.md](archive/FIRESTORE_SCHEMA.md), [archive/DATABASE_ERD_SCHEMA.md](archive/DATABASE_ERD_SCHEMA.md), [archive/API_SPECIFICATION_v2.md](archive/API_SPECIFICATION_v2.md).

---

## 1. ERD 필드 정의 규칙

### 1.1 필수 기재 항목

- **필드명**: 컬렉션/테이블 내 고유 식별자.
- **데이터 타입**: string | number | boolean | Timestamp | array | map | reference.
- **제약**:
  - 필수/선택 (required/optional).
  - enum 값이 있으면 나열 (예: status: draft | inspection | bidding | sold).
  - 길이/범위 (예: 문자열 max length, 숫자 min/max) — 해당 시 명시.

### 1.2 Firestore 컬렉션 우선 매핑

- 통합 명세 테이블의 "관련 ERD 필드" 컬럼은 **Firestore 컬렉션·필드**를 우선 참조.
- DATABASE_ERD_SCHEMA의 21개 테이블은 **관계도·논리 모델** 참조용. 필드 상세는 FIRESTORE_SCHEMA의 컬렉션별 필드 정의를 따른다.

### 1.3 참조 형식

- 단일 필드: `vehicles.plateNumber`, `inspections.vehicleId`.
- 복수 필드: `vehicles.id, status, updatedAt`.

---

## 2. API 명세 규칙

### 2.1 RESTful 원칙

- **리소스별 메서드**: GET(조회), POST(생성), PATCH/PUT(수정), DELETE(삭제) 구분.
- **경로**: 실제 배포 함수명 = URL 경로 세그먼트. (Firebase Functions v2 HTTP 트리거)
- **기본 URL**: `https://asia-northeast3-carivdealer.cloudfunctions.net`

### 2.2 필수 기재 항목

- **엔드포인트 경로**: 배포된 함수명 (예: `/ocrRegistrationAPI`).
- **HTTP 메서드**: POST, GET, PATCH, DELETE 등.
- **요청 핵심 파라미터**: body 필드 또는 query 파라미터 (이름, 타입, 필수/선택).
- **응답 핵심 필드**: 성공 시(200) 반환 JSON의 주요 필드.

### 2.3 통합 명세 테이블과의 교차 참조

- 통합 명세서 테이블의 "관련 API" 컬럼에는 **Method + 경로** (예: `POST /changeSaleMethodAPI`) 형식으로 기재.
- 상세 요청/응답 스키마는 [archive/API_SPECIFICATION_v2.md](archive/API_SPECIFICATION_v2.md) 부록 6.2 등에서 참조.

### 2.4 인증

- **현재**: 인증 미구현 (프로토타입). 요청 헤더에 Authorization 생략.
- **계획**: Firebase Auth 토큰 기반 `Authorization: Bearer {token}`.
