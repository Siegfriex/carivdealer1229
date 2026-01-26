# 09. 데이터 흐름 분석

## 9.1 문서 업로드 → 파싱 → 저장 플로우

### 플로우 다이어그램

```
[Client]
  POST /api/documents/upload
  MultipartFile[]
    ↓
[DocumentController.upload()] (라인: 28-41)
    ↓
[DocumentService.uploadMany()] (라인: 57-82)
  ├─ Documents 엔티티 생성 (PROCESSING 상태)
  ├─ 임시 파일 저장
  └─ DocumentProcessEvent 발행
    ↓
[DocumentProcessEventListener.on()] (라인: 18-22)
  @Async("documentExecutor")
  @TransactionalEventListener(AFTER_COMMIT)
    ↓
[DocumentAsyncProcessor.processAsync()] (라인: 25-49)
    ↓
[DocumentWorkTx.run()] (라인: 39-81)
  ├─ TenantContext 설정
  ├─ UpstageCallGuard.run()
  │  └─ UpstageService.parseDocuments() → OCR 호출
  ├─ DocumentTypeDetector.detect() → 타입 감지
  ├─ DocumentOrchestrationService.handleParsed()
  │  ├─ DEREGISTRATION → DeRegistrationService.handleUpload()
  │  ├─ REGISTRATION → RegistrationService.handleParsed()
  │  ├─ EXPORT_CERTIFICATE → ExportCertificateService.handleUpload()
  │  ├─ AUCTION_CERTIFICATE → AuctionService.handleUpload()
  │  └─ INVOICE → InvoiceService.handleUpload()
  ├─ ParserService.parse() → 데이터 추출
  ├─ Repository.save() → 엔티티 저장
  └─ S3Upload.uploadRawDocument() → S3 저장
    ↓
[DocumentStatusTx.markDone()] (라인: 23-37)
  ├─ Documents.status = DONE
  ├─ Documents.type 설정
  ├─ Documents.relatedId 설정
  └─ Documents.s3Key 설정
    ↓
[완료]
```

### 라인별 상세 추적

#### 1. Controller 레이어
- **파일**: `DocumentController.java`
- **메서드**: `upload()` (라인: 28-41)
- **입력**: `MultipartFile[] documents`, `MultipartFile[] document`
- **출력**: `List<DocumentRowResponse>` (PROCESSING 상태)

#### 2. Service 레이어 - 업로드
- **파일**: `DocumentService.java`
- **메서드**: `uploadMany()` (라인: 57-82)
- **단계**:
  1. Documents 엔티티 생성 (라인: 62-67)
  2. companyId 설정 (라인: 70)
  3. 저장 (라인: 72)
  4. 임시 파일 생성 (라인: 74-75)
  5. 이벤트 발행 (라인: 77)

#### 3. 이벤트 리스너
- **파일**: `DocumentProcessEventListener.java`
- **메서드**: `on()` (라인: 18-22)
- **비동기 실행**: `@Async("documentExecutor")`
- **트랜잭션**: `AFTER_COMMIT` 후 실행

#### 4. 비동기 처리
- **파일**: `DocumentAsyncProcessor.java`
- **메서드**: `processAsync()` (라인: 25-49)
- **호출**: `DocumentWorkTx.run()` (라인: 34-35)

#### 5. 작업 실행
- **파일**: `DocumentWorkTx.java`
- **메서드**: `run()` (라인: 39-81)
- **단계**:
  1. TenantContext 설정 (라인: 47)
  2. Upstage OCR 호출 (라인: 53-55)
  3. 타입 감지 (라인: 60)
  4. 파싱 및 저장 (라인: 61)
  5. S3 업로드 (라인: 70)

#### 6. 상태 업데이트
- **파일**: `DocumentStatusTx.java`
- **메서드**: `markDone()` (라인: 23-37)
- **트랜잭션**: `REQUIRES_NEW` (독립 트랜잭션)

---

## 9.2 로그인 → 토큰 발급 플로우

### 플로우 다이어그램

```
[Client]
  POST /api/auth/login
  {loginId, password}
    ↓
[AuthController.login()] (라인: 33-41)
    ↓
[AuthService.login()] (라인: 53-69)
  ├─ UserRepository.findByLoginId() (라인: 55)
  ├─ PasswordEncoder.matches() (라인: 58)
  ├─ JwtTokenProvider.createAccessToken() (라인: 62)
  │  └─ JWT 생성 (claims: userId, companyId, role)
  ├─ JwtTokenProvider.createRefreshToken() (라인: 63)
  ├─ JwtTokenProvider.getClaims() (라인: 65)
  └─ RefreshTokenService.saveNewToken() (라인: 66)
    └─ RefreshToken 해시하여 저장
    ↓
[TokenResponse 반환]
  {accessToken, refreshToken}
```

### 라인별 상세 추적

1. **AuthController.login()** (라인: 38-40)
   - `LoginRequest` 받음
   - `AuthService.login()` 호출

2. **AuthService.login()** (라인: 53-69)
   - 사용자 조회 (라인: 55-56)
   - 비밀번호 검증 (라인: 58-60)
   - Access Token 생성 (라인: 62)
   - Refresh Token 생성 (라인: 63)
   - Refresh Token 저장 (라인: 65-66)

3. **JwtTokenProvider.createAccessToken()** (라인: 36-50)
   - Subject: loginId
   - Claims: userId, companyId, role
   - 만료: 1시간

4. **RefreshTokenService.saveNewToken()** (라인: 25-33)
   - 토큰 해시 (SHA-256)
   - RefreshToken 엔티티 저장

---

## 9.3 차량 등록 → 말소 플로우

### 플로우 다이어그램

```
[등록증 업로드]
    ↓
[DocumentController.upload()]
    ↓
[DocumentService.uploadMany()]
    ↓
[비동기 처리]
    ↓
[RegistrationService.handleParsed()] (라인: 23-55)
  ├─ RegistrationParserService.parse()
  └─ VehicleService.upsertFromRegistration() (라인: 28)
    └─ Vehicle 생성/업데이트
    ↓
[Vehicle 생성]
  stage = REGISTERED_BY_DEALER
    ↓
[말소등록증 업로드]
    ↓
[MalsoController.uploadCertificate()] (라인: 52-65)
    ↓
[DeRegistrationService.uploadCertificate()] (라인: 164-216)
  ├─ DeRegistrationCertificate 생성
  ├─ Documents 생성
  ├─ S3 업로드
  └─ Vehicle.changeStage(DEREG_COMPLETED) (라인: 207)
    ↓
[Vehicle 단계 변경]
  stage = DEREG_COMPLETED
```

### 라인별 상세 추적

#### 등록증 처리
1. **RegistrationService.handleParsed()** (라인: 23-55)
   - 파싱 (라인: 24)
   - Vehicle 생성/업데이트 (라인: 28)

2. **VehicleService.upsertFromRegistration()** (라인: 50-82)
   - VIN 추출 및 정규화 (라인: 52)
   - Vehicle 조회 또는 생성 (라인: 55-60)
   - 등록증 스냅샷 적용 (라인: 62-73)

#### 말소 처리
1. **MalsoController.uploadCertificate()** (라인: 52-65)
   - 파일 업로드

2. **DeRegistrationService.uploadCertificate()** (라인: 164-216)
   - DeRegistrationCertificate 생성 (라인: 173-181)
   - Documents 생성 (라인: 186-194)
   - S3 업로드 (라인: 200)
   - Vehicle 단계 변경 (라인: 207-208)

---

## 9.4 사업자등록증 OCR 플로우

### 플로우 다이어그램

```
[Client]
  POST /api/base-info/ocr/business-registration
  MultipartFile (사업자등록증)
    ↓
[BaseInfoController.parseBusinessRegistration()] (라인: 93-99)
    ↓
[BaseInfoService.parseBusinessRegistration()] (라인: 101-120)
    ↓
[BaseInfoOcrService.parseBusinessRegistration()] (라인: 20-29)
  ├─ UpstageService.parseDocuments() (라인: 21)
  └─ BaseInfoOcrParserService.parse() (라인: 28)
    ↓
[BaseInfo.applyOcrData()] (라인: 107-111)
  ├─ name 업데이트
  ├─ businessRegistrationNumber 업데이트
  └─ businessAddress 업데이트
    ↓
[BaseInfoRepository.save()] (라인: 112)
    ↓
[BaseInfoOcrResponse 반환]
```

### 라인별 상세 추적

1. **BaseInfoController.parseBusinessRegistration()** (라인: 93-99)
   - 파일 받음
   - `BaseInfoService.parseBusinessRegistration()` 호출

2. **BaseInfoService.parseBusinessRegistration()** (라인: 101-120)
   - OCR 서비스 호출 (라인: 103)
   - BaseInfo 조회 또는 생성 (라인: 104-105)
   - OCR 데이터 적용 (라인: 107-111)
   - 저장 (라인: 112)

3. **BaseInfoOcrService.parseBusinessRegistration()** (라인: 20-29)
   - Upstage OCR 호출 (라인: 21)
   - JSON 파싱 (라인: 24)
   - ParserService 호출 (라인: 28)

4. **BaseInfoOcrParserService.parse()** (라인: 19-27)
   - 라인 추출 (라인: 20)
   - 사업자등록번호 추출 (라인: 22)
   - 상호명 추출 (라인: 23)
   - 주소 추출 (라인: 24)

---

## 9.5 주요 비즈니스 플로우 요약

### 1. 문서 업로드 플로우
- **시작**: DocumentController.upload()
- **비동기 처리**: DocumentAsyncProcessor
- **OCR**: UpstageService
- **파싱**: ParserService
- **저장**: Repository
- **상태 업데이트**: DocumentStatusTx

### 2. 인증 플로우
- **로그인**: AuthController → AuthService → JwtTokenProvider
- **토큰 재발급**: AuthController → AuthService → RefreshTokenService
- **요청 인증**: JwtAuthenticationFilter → JwtTokenProvider → CustomUserDetailsService

### 3. 차량 관리 플로우
- **등록증 파싱**: RegistrationService → VehicleService
- **말소 처리**: DeRegistrationService → Vehicle.changeStage()
- **차량관리 조회**: VehicleService.getManagement()

### 4. 기본정보 관리 플로우
- **OCR 파싱**: BaseInfoOcrService → BaseInfoOcrParserService
- **서류 업로드**: BaseInfoService → S3Upload
- **서류 조회**: BaseInfoService → S3ObjectReader
