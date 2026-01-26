# 10. 코드베이스 분석 요약

## 10.1 코드 통계

### 파일 통계
- **Java 파일 수**: 약 115개
- **Controller 파일**: 8개
- **Service 파일**: 22개
- **Repository 파일**: 13개
- **Entity 파일**: 약 15개 이상
- **ParserService 파일**: 6개
- **Config 파일**: 5개

### API 엔드포인트 통계
- **총 API 엔드포인트**: 32개
- **인증 필요**: 28개
- **인증 불필요**: 4개 (로그인, 회원가입, 토큰 재발급, 로그아웃)

### 도메인 통계
- **도메인 수**: 11개
  - auction, base, document, export, invoice, login, malso, registration, upstage, vehicle, vehiclePurchase

---

## 10.2 아키텍처 다이어그램

### 전체 아키텍처

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Frontend)                      │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTP/REST
                        ↓
┌─────────────────────────────────────────────────────────┐
│              Spring Security Filter Chain                │
│  ┌─────────────────────────────────────────────────┐  │
│  │      JwtAuthenticationFilter                     │  │
│  │  - 토큰 검증                                      │  │
│  │  - SecurityContext 설정                          │  │
│  │  - TenantContext 설정                            │  │
│  └─────────────────────────────────────────────────┘  │
└───────────────────────┬─────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                    Controller Layer                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │   Auth   │ │ Document │ │ Vehicle  │ │  Base    │  │
│  │Controller│ │Controller│ │Controller│ │Controller│  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└───────────────────────┬─────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                     Service Layer                        │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │ Auth     │ │ Document │ │ Vehicle  │ │ BaseInfo │  │
│  │ Service  │ │ Service  │ │ Service  │ │ Service  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐   │
│  │          Parser Service Layer                    │   │
│  │  AuctionParser │ RegistrationParser │ ExportParser│  │
│  └──────────────────────────────────────────────────┘   │
└───────────────────────┬─────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                    Repository Layer                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  User    │ │ Document │ │ Vehicle  │ │ BaseInfo │  │
│  │Repository│ │Repository│ │Repository│ │Repository│  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└───────────────────────┬─────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────────┐
│                    Database (MySQL)                      │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐  │
│  │  users   │ │documents │ │ vehicles │ │base_info │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────┘  │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│              External Services                           │
│  ┌──────────────────┐  ┌──────────────────┐             │
│  │  Upstage OCR    │  │    AWS S3        │             │
│  │  (Document OCR)  │  │  (File Storage)  │             │
│  └──────────────────┘  └──────────────────┘             │
└─────────────────────────────────────────────────────────┘
```

### 계층별 역할

1. **Controller Layer**: HTTP 요청/응답 처리
2. **Service Layer**: 비즈니스 로직 처리
3. **Parser Service Layer**: OCR 응답 파싱
4. **Repository Layer**: 데이터베이스 접근
5. **Entity Layer**: 도메인 모델

---

## 10.3 주요 기술 스택

### 백엔드 프레임워크
- **Spring Boot**: 3.5.9
- **Java**: 17
- **Spring Data JPA**: 데이터베이스 ORM
- **Spring Security**: 인증/인가
- **Spring WebFlux**: 비동기 처리

### 인증/보안
- **JWT**: jjwt 0.11.5
- **Password Encoding**: BCrypt

### 문서 처리
- **Apache POI**: Excel 처리
- **Apache PDFBox**: PDF 처리
- **JSoup**: HTML 파싱
- **Playwright**: 브라우저 자동화

### 외부 서비스
- **Upstage OCR**: 문서 OCR
- **AWS S3**: 파일 저장

### 데이터베이스
- **MySQL**: 운영 데이터베이스
- **H2**: 개발/테스트 데이터베이스

### API 문서화
- **Swagger/OpenAPI**: springdoc 2.8.15

---

## 10.4 핵심 기능 요약

### 1. 인증/인가
- JWT 기반 인증
- Refresh Token 관리
- 멀티테넌트 지원 (회사별 데이터 격리)
- 역할 기반 접근 제어 (MASTER, ADMIN, STAFF)

### 2. 문서 처리
- 다중 문서 업로드
- 비동기 OCR 파싱
- 문서 타입 자동 감지
- 6가지 문서 타입 파싱 지원

### 3. 차량 관리
- 차량 등록/수정
- 차량 단계 관리 (REGISTERED_BY_DEALER → DEREG_COMPLETED → LICENSE_COMPLETED)
- 차량관리 검색 및 필터링

### 4. 기본정보 관리
- 회사 기본정보 관리
- 서류 4종 업로드 (사인방, 인감, 대표자 신분증, 사업자등록증)
- 사업자등록증 OCR 파싱

### 5. 인쇄/출력
- 말소등록신청서 생성 (XLSX, PDF)
- Invoice 생성 (XLSX, PDF)
- ZIP 번들 다운로드

---

## 10.5 데이터베이스 스키마 요약

### 주요 테이블
- `users` - 사용자
- `company` - 회사
- `vehicle` - 차량
- `documents` - 문서
- `base_info` - 기본정보
- `de_registration_certificate` - 말소등록증
- `registration_re_certificate` - 등록증
- `export` - 수출 증명서
- `auction_certificate` - 경매증
- `tax_invoice` - 세금계산서
- `vehicle_purchase` - 차량 구매
- `refresh_token` - Refresh Token

### 관계 요약
- Vehicle ← VehiclePurchase (OneToOne)
- Vehicle ← DeRegistrationCertificate (OneToOne)
- Vehicle ← RegistrationReCertificate (ManyToOne)
- Vehicle ← Export (ManyToOne)
- User ← RefreshToken (ManyToOne)

---

## 10.6 보안 아키텍처

### 인증 플로우
1. 로그인 → Access Token + Refresh Token 발급
2. 요청 시 Access Token 검증
3. 만료 시 Refresh Token으로 재발급
4. 로그아웃 시 Refresh Token 폐기

### 멀티테넌트
- TenantEntity를 통한 회사별 데이터 격리
- Hibernate Filter로 자동 필터링
- TenantContext로 현재 회사 ID 관리

---

## 10.7 비동기 처리 아키텍처

### 문서 처리 플로우
1. 문서 업로드 → 즉시 PROCESSING 상태 반환
2. 트랜잭션 커밋 후 이벤트 발행
3. 비동기 스레드 풀에서 OCR 호출
4. 파싱 및 저장
5. 상태를 DONE/FAILED로 업데이트

### 스레드 풀 설정
- Core Pool Size: 4
- Max Pool Size: 8
- Queue Capacity: 200

---

## 10.8 문서 목록

1. `01_PROJECT_STRUCTURE.md` - 프로젝트 구조 및 메타데이터
2. `02_API_ENDPOINTS.md` - 모든 API 엔드포인트 명세 (32개)
3. `03_SERVICES.md` - Service 계층 비즈니스 로직 분석 (22개)
4. `04_PARSERS.md` - Parser 서비스 분석 (6개)
5. `05_DATABASE_SCHEMA.md` - 데이터베이스 스키마 분석
6. `06_SECURITY.md` - 보안 및 인증/인가 분석
7. `07_EXCEPTION_HANDLING.md` - 예외 처리 분석
8. `08_CONFIGURATION.md` - 전역 설정 및 인프라 분석
9. `09_DATA_FLOW.md` - 데이터 흐름 분석
10. `10_SUMMARY.md` - 코드 통계 및 아키텍처 다이어그램

---

## 10.9 분석 완료 항목

✅ 프로젝트 구조 파악
✅ API 엔드포인트 완전 분석 (32개)
✅ Service 계층 분석 (22개)
✅ Parser 서비스 분석 (6개)
✅ 데이터베이스 스키마 분석 (13개 Repository, 15개 이상 Entity)
✅ 보안 및 인증 분석 (JWT, 멀티테넌트)
✅ 예외 처리 분석 (ErrorCode, GlobalExceptionHandler)
✅ 전역 설정 분석 (Config, AWS S3, Upstage OCR)
✅ 데이터 흐름 분석 (주요 플로우 4개)
✅ 통합 문서 생성 (10개 마크다운 파일)

---

## 10.10 주요 발견사항

### 아키텍처 특징
1. **멀티테넌트 아키텍처**: TenantEntity를 통한 회사별 데이터 격리
2. **비동기 문서 처리**: 이벤트 기반 비동기 파싱
3. **문서 타입 자동 감지**: DocumentTypeDetector로 자동 분류
4. **다양한 문서 파싱**: 6가지 문서 타입 지원

### 보안 특징
1. **JWT 기반 인증**: Stateless 인증
2. **Refresh Token 관리**: 해시 저장 및 폐기 기능
3. **역할 기반 접근 제어**: 계층적 권한 구조

### 성능 최적화
1. **동시성 제어**: UpstageCallGuard로 API 호출 제한
2. **비동기 처리**: 문서 파싱을 비동기로 처리
3. **인덱스 최적화**: Vehicle, Export 테이블에 인덱스 설정
