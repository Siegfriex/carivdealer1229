# 08. 전역 설정 및 인프라 분석

## 8.1 SwaggerConfig

**파일**: `src/main/java/cariv/exp/global/config/SwaggerConfig.java`

### 설정 내용

#### openAPI Bean (라인: 15-32)
```java
@Bean
public OpenAPI openAPI() {
    return new OpenAPI()
            .info(new Info()
                    .title("Cariv_exp API")
                    .description("Cariv 프로젝트 API 명세서")
                    .version("v1"))
            .addSecurityItem(new SecurityRequirement().addList(SECURITY_SCHEME_NAME))
            .components(new Components()
                    .addSecuritySchemes(SECURITY_SCHEME_NAME,
                            new SecurityScheme()
                                    .name("Authorization")
                                    .type(SecurityScheme.Type.HTTP)
                                    .scheme("bearer")
                                    .bearerFormat("JWT")
                    )
            );
}
```

**분석:**
- **API 정보**: 
  - Title: "Cariv_exp API"
  - Description: "Cariv 프로젝트 API 명세서"
  - Version: "v1"
- **보안 스키마**: Bearer JWT 인증 설정
  - 스키마명: "BearerAuth"
  - 헤더명: "Authorization"
  - 타입: HTTP Bearer
  - 형식: JWT

**Bean 정의:**
- `OpenAPI` - OpenAPI 스펙 Bean (라인: 16)

---

## 8.2 AsyncConfig

**파일**: `src/main/java/cariv/exp/global/config/AsyncConfig.java`

### 설정 내용

#### documentExecutor Bean (라인: 17-43)
```java
@Bean(name = "documentExecutor")
public Executor documentExecutor() {
    ThreadPoolTaskExecutor ex = new ThreadPoolTaskExecutor();
    ex.setCorePoolSize(4);  // 라인: 20
    ex.setMaxPoolSize(8);   // 라인: 21
    ex.setQueueCapacity(200);  // 라인: 22
    ex.setThreadNamePrefix("doc-");  // 라인: 23

    ex.setTaskDecorator(runnable -> {
        Long companyId = TenantContext.getCompanyId();  // 라인: 26
        var securityContext = SecurityContextHolder.getContext();  // 라인: 27

        return () -> {
            try {
                if (companyId != null) TenantContext.setCompanyId(companyId);  // 라인: 31
                SecurityContextHolder.setContext(securityContext);  // 라인: 32
                runnable.run();
            } finally {
                TenantContext.clear();  // 라인: 35
                SecurityContextHolder.clearContext();  // 라인: 36
            }
        };
    });

    ex.initialize();
    return ex;
}
```

**분석:**
- **스레드 풀 설정**:
  - Core Pool Size: 4
  - Max Pool Size: 8
  - Queue Capacity: 200
  - Thread Name Prefix: "doc-"
- **Task Decorator**: 
  - 요청 스레드의 TenantContext와 SecurityContext를 비동기 작업에 전달
  - 작업 완료 후 정리
- **활성화**: `@EnableAsync` (라인: 14)

**Bean 정의:**
- `documentExecutor` - 문서 처리용 비동기 Executor (라인: 17)

**사용 위치**: `@Async("documentExecutor")` 어노테이션으로 사용

---

## 8.3 UpstageConfig

**파일**: `src/main/java/cariv/exp/global/config/UpstageConfig.java`

### 설정 내용

#### upstageWebClient Bean (라인: 17-27)
```java
@Bean
public WebClient upstageWebClient() {
    return WebClient.builder()
            .baseUrl("https://api.upstage.ai/v1")  // 라인: 20
            .codecs(configurer -> configurer
                    .defaultCodecs()
                    .maxInMemorySize(20 * 1024 * 1024)  // 라인: 23 - 20MB
            )
            .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)  // 라인: 25
            .build();
}
```

**분석:**
- **Base URL**: `https://api.upstage.ai/v1`
- **인증**: Bearer Token (환경 변수 `upstage.api-key`에서 읽음)
- **코덱 설정**: 최대 메모리 크기 20MB
- **용도**: Upstage OCR API 호출

**Bean 정의:**
- `upstageWebClient` - Upstage OCR API 호출용 WebClient (라인: 18)

**환경 변수:**
- `upstage.api-key` - Upstage API 키 (라인: 14)

---

## 8.4 AwsS3Config

**파일**: `src/main/java/cariv/exp/global/aws/AwsS3Config.java`

### 설정 내용

#### s3Client Bean (라인: 23-31)
```java
@Bean
public S3Client s3Client() {
    AwsBasicCredentials awsCreds = AwsBasicCredentials.create(accessKey, secretKey);

    return S3Client.builder()
            .region(Region.of(region))
            .credentialsProvider(StaticCredentialsProvider.create(awsCreds))
            .build();
}
```

**분석:**
- **인증 방식**: StaticCredentialsProvider (Access Key, Secret Key)
- **리전**: 환경 변수에서 읽음
- **용도**: AWS S3 파일 업로드/다운로드

**Bean 정의:**
- `s3Client` - AWS S3 클라이언트 (라인: 24)

**환경 변수:**
- `cloud.aws.credentials.access-key` - AWS Access Key (라인: 14)
- `cloud.aws.credentials.secret-key` - AWS Secret Key (라인: 17)
- `cloud.aws.region.static` - AWS 리전 (라인: 20)

---

## 8.5 AWS S3 연동 분석

### S3Upload

**파일**: `src/main/java/cariv/exp/global/aws/S3Upload.java`

### 의존성 주입
- `S3Client` (라인: 17) - AWS S3 클라이언트

### 메서드별 상세 분석

#### upload (라인: 23-31)
```java
public String upload(byte[] fileData, String fileName, String contentType) {
    PutObjectRequest putObjectRequest = PutObjectRequest.builder()
            .bucket(bucket)
            .key(fileName)
            .contentType(contentType)
            .build();
    s3Client.putObject(putObjectRequest, RequestBody.fromBytes(fileData));
    return String.format("https://%s.s3.amazonaws.com/%s", bucket, fileName);
}
```

**분석:**
- **접근 제어자**: `public`
- **반환 타입**: `String` (S3 URL)
- **파라미터**:
  - `byte[] fileData` - 파일 데이터
  - `String fileName` - 파일명 (S3 Key)
  - `String contentType` - Content-Type
- **비즈니스 로직 흐름**:
  1. PutObjectRequest 생성 (라인: 24-28)
  2. S3에 업로드 (라인: 29)
  3. S3 URL 반환 (라인: 30)

#### uploadRawDocument (라인: 34-49)
```java
public String uploadRawDocument(Path filePath, String originalFilename, Long companyId, Long documentId, String contentType) {
    String safeName = safe(originalFilename);
    String key = "raw-documents/"
            + companyId + "/"
            + documentId + "/"
            + UUID.randomUUID() + "-" + safeName;

    PutObjectRequest req = PutObjectRequest.builder()
            .bucket(bucket)
            .key(key)
            .contentType(contentType != null ? contentType : "application/octet-stream")
            .build();

    s3Client.putObject(req, RequestBody.fromFile(filePath));
    return key;
}
```

**분석:**
- **접근 제어자**: `public`
- **반환 타입**: `String` (S3 Key)
- **파라미터**:
  - `Path filePath` - 임시 파일 경로
  - `String originalFilename` - 원본 파일명
  - `Long companyId` - 회사 ID
  - `Long documentId` - 문서 ID
  - `String contentType` - Content-Type
- **S3 Key 구조**: `raw-documents/{companyId}/{documentId}/{UUID}-{safeFilename}`
- **비즈니스 로직 흐름**:
  1. 파일명 안전화 (라인: 35)
  2. S3 Key 생성 (라인: 36-39)
  3. S3에 업로드 (라인: 47)
  4. Key 반환 (라인: 48)
- **사용 위치**: `DeRegistrationService.uploadCertificate()` (라인: 200)

#### uploadBaseInfoDocument (라인: 51-64)
```java
public String uploadBaseInfoDocument(byte[] fileData, String originalFilename, Long companyId, String documentType, String contentType) {
    String key = "base-info/"
            + companyId + "/"
            + documentType.toLowerCase()
            + "/latest";

    PutObjectRequest putObjectRequest = PutObjectRequest.builder()
            .bucket(bucket)
            .key(key)
            .contentType(contentType != null ? contentType : "application/octet-stream")
            .build();
    s3Client.putObject(putObjectRequest, RequestBody.fromBytes(fileData));
    return key;
}
```

**분석:**
- **접근 제어자**: `public`
- **반환 타입**: `String` (S3 Key)
- **파라미터**:
  - `byte[] fileData` - 파일 데이터
  - `String originalFilename` - 원본 파일명 (사용 안 함)
  - `Long companyId` - 회사 ID
  - `String documentType` - 문서 타입 (SIGN, SEAL, CEO_ID, BIZ_REG)
  - `String contentType` - Content-Type
- **S3 Key 구조**: `base-info/{companyId}/{documentType}/latest`
- **비즈니스 로직 흐름**:
  1. S3 Key 생성 (라인: 52-55)
  2. S3에 업로드 (라인: 62)
  3. Key 반환 (라인: 63)
- **사용 위치**: `BaseInfoService.uploadDocument()` (라인: 65)

#### toUrl (라인: 67-69)
```java
public String toUrl(String key) {
    return String.format("https://%s.s3.amazonaws.com/%s", bucket, key);
}
```

**분석:**
- **접근 제어자**: `public`
- **반환 타입**: `String` (S3 URL)
- **파라미터**: `String key` - S3 Key
- **용도**: S3 Key를 URL로 변환

**환경 변수:**
- `cloud.aws.s3.bucket` - S3 버킷명 (라인: 19)

---

### S3ObjectReader

**파일**: `src/main/java/cariv/exp/global/aws/S3ObjectReader.java`

### 의존성 주입
- `S3Client` (라인: 18) - AWS S3 클라이언트

### 메서드별 상세 분석

#### readBytes (라인: 26-41)
```java
public byte[] readBytes(String key) {
    if (key == null || key.isBlank()) return null;

    GetObjectRequest req = GetObjectRequest.builder()
            .bucket(bucket)
            .key(key)
            .build();

    try (ResponseInputStream<GetObjectResponse> is = s3Client.getObject(req)) {
        return is.readAllBytes();
    } catch (NoSuchKeyException e) {
        return null;
    } catch (IOException e) {
        throw new IllegalStateException("Failed to read s3 object: " + key, e);
    }
}
```

**분석:**
- **접근 제어자**: `public`
- **반환 타입**: `byte[]`
- **파라미터**: `String key` - S3 Key
- **비즈니스 로직 흐름**:
  1. Key 검증 (라인: 27)
  2. GetObjectRequest 생성 (라인: 29-32)
  3. S3에서 다운로드 (라인: 34)
  4. 바이트 배열 반환 (라인: 35)
- **에러 처리**:
  - NoSuchKeyException: null 반환
  - IOException: IllegalStateException 발생

#### readObject (라인: 46-62)
```java
public S3ObjectData readObject(String key) {
    if (key == null || key.isBlank()) return null;

    GetObjectRequest req = GetObjectRequest.builder()
            .bucket(bucket)
            .key(key)
            .build();

    try (ResponseInputStream<GetObjectResponse> is = s3Client.getObject(req)) {
        GetObjectResponse response = is.response();
        return new S3ObjectData(is.readAllBytes(), response.contentType());
    } catch (NoSuchKeyException e) {
        return null;
    } catch (IOException e) {
        throw new IllegalStateException("Failed to read s3 object: " + key, e);
    }
}
```

**분석:**
- **접근 제어자**: `public`
- **반환 타입**: `S3ObjectData` (bytes, contentType)
- **파라미터**: `String key` - S3 Key
- **비즈니스 로직 흐름**:
  1. Key 검증 (라인: 47)
  2. GetObjectRequest 생성 (라인: 49-52)
  3. S3에서 다운로드 (라인: 54)
  4. 바이트 배열과 Content-Type 추출 (라인: 56)
  5. S3ObjectData 반환 (라인: 56)
- **사용 위치**: `BaseInfoService.getDocument()` (라인: 93)

**환경 변수:**
- `cloud.aws.s3.bucket` - S3 버킷명 (라인: 20)

---

## 8.6 Upstage OCR 연동 분석

### UpstageService

**파일**: `src/main/java/cariv/exp/domain/upstage/service/UpstageService.java`

### 의존성 주입
- `WebClient upstageWebClient` (라인: 24) - Upstage API 호출용 WebClient

### 주요 메서드

#### parseDocuments (라인: 30-75)
- Upstage OCR API 호출
- 재시도 로직 포함 (최대 5회)
- 429, 5xx 에러만 재시도
- 지수 백오프 및 jitter 적용

**재시도 설정:**
- MAX_RETRIES: 5회 (라인: 27)
- BASE_BACKOFF_MS: 400ms (라인: 28)
- 최대 백오프: 8초 (라인: 95)

---

### DocumentTypeDetector

**파일**: `src/main/java/cariv/exp/domain/upstage/service/DocumentTypeDetector.java`

### 역할
- UpstageResponse를 분석하여 문서 타입 감지

### 감지 로직 (라인: 55-94)
```java
public static DocumentType detect(UpstageResponse res) {
    // 1) 모든 element의 텍스트 내용 합치기
    String allText = res.elements().stream()
            .map(e -> {
                if (e.content() == null) return "";
                // 우선순위: text -> markdown -> html
                if (notBlank(e.content().text())) return e.content().text();
                if (notBlank(e.content().markdown())) return e.content().markdown();
                if (notBlank(e.content().html())) return stripHtml(e.content().html());
                return "";
            })
            .collect(Collectors.joining(" "));

    // 2) 공백 제거 + 소문자 통일
    String normalized = normalize(allText);

    // 3) 키워드 매칭
    if (containsAny(normalized, DEREGISTRATION_KEYWORDS)) {
        return DocumentType.DEREGISTRATION;
    }
    // ... 다른 타입들도 동일한 방식으로 매칭
}
```

**분석:**
- **입력**: `UpstageResponse` - OCR 응답
- **출력**: `DocumentType` - 감지된 문서 타입
- **감지 전략**:
  1. 모든 element의 텍스트 추출 (text → markdown → html 순서)
  2. 텍스트 정규화 (공백 제거, 소문자 변환)
  3. 키워드 매칭 (우선순위: DEREGISTRATION → REGISTRATION → INVOICE → CONTRACT → AUCTION → EXPORT)

**키워드 목록:**
- DEREGISTRATION: "자동차 말소 사실 증명서", "De-registration Certificate" 등 (라인: 16-23)
- REGISTRATION: "자동차등록증", "Vehicle Registration" 등 (라인: 26-31)
- INVOICE: "INVOICE", "세금계산서" 등 (라인: 33-38)
- CONTRACT: "매매계약서" 등 (라인: 39-43)
- AUCTION: "경락사실확인서" 등 (라인: 44-48)
- EXPORT: "수출신고필증" 등 (라인: 49-53)

---

### UpstageCallGuard

**파일**: `src/main/java/cariv/exp/domain/upstage/service/UpstageCallGuard.java`

### 역할
- Upstage API 호출의 동시성 제어

### 동시성 제어 설정

#### 전역 동시성 (라인: 15)
```java
private final Semaphore global = new Semaphore(2, true);
```
- 최대 2개의 동시 호출 허용

#### 회사별 동시성 (라인: 18)
```java
private final ConcurrentHashMap<Long, Semaphore> perCompany = new ConcurrentHashMap<>();
```
- 회사별로 최대 1개의 동시 호출 허용

#### run 메서드 (라인: 24-46)
```java
public <T> T run(Long companyId, Supplier<T> action) {
    Semaphore company = companySem(companyId);
    
    boolean g = false;
    boolean c = false;
    
    try {
        g = global.tryAcquire(30, TimeUnit.SECONDS);  // 라인: 32
        if (!g) throw new IllegalStateException("Upstage global permit timeout");
        
        c = company.tryAcquire(30, TimeUnit.SECONDS);  // 라인: 35
        if (!c) throw new IllegalStateException("Upstage company permit timeout companyId=" + companyId);
        
        return action.get();
    } finally {
        if (c) company.release();
        if (g) global.release();
    }
}
```

**분석:**
- **접근 제어자**: `public`
- **반환 타입**: `<T> T`
- **파라미터**:
  - `Long companyId` - 회사 ID
  - `Supplier<T> action` - 실행할 작업
- **비즈니스 로직 흐름**:
  1. 전역 Semaphore 획득 (30초 타임아웃) (라인: 32)
  2. 회사별 Semaphore 획득 (30초 타임아웃) (라인: 35)
  3. 작업 실행 (라인: 38)
  4. finally 블록에서 Semaphore 해제 (라인: 43-44)
- **에러 처리**:
  - 타임아웃 시 IllegalStateException 발생

---

## 8.7 외부 서비스 연동 다이어그램

```
[Application]
    ↓
[UpstageService]
    ├─ UpstageCallGuard (동시성 제어)
    └─ WebClient → https://api.upstage.ai/v1/document-digitization
    ↓
[Upstage OCR API]
    └─ JSON 응답 반환
    ↓
[DocumentTypeDetector]
    └─ 문서 타입 감지
    ↓
[ParserService]
    └─ 데이터 추출

[Application]
    ↓
[S3Upload / S3ObjectReader]
    └─ S3Client → AWS S3
    ↓
[AWS S3]
    ├─ raw-documents/{companyId}/{documentId}/{UUID}-{filename}
    └─ base-info/{companyId}/{documentType}/latest
```

---

## 8.8 환경 변수 요약

### 보안 관련
- `jwt.secret` - JWT 서명 키
- `app.security.allowed-origins` - CORS 허용 Origin 목록
- `app.security.allow-docs` - Swagger 문서 허용 여부

### AWS 관련
- `cloud.aws.credentials.access-key` - AWS Access Key
- `cloud.aws.credentials.secret-key` - AWS Secret Key
- `cloud.aws.region.static` - AWS 리전
- `cloud.aws.s3.bucket` - S3 버킷명

### Upstage 관련
- `upstage.api-key` - Upstage API 키

---

## 8.9 Bean 정의 요약

| Bean명 | 타입 | 용도 | 파일 |
|--------|------|------|------|
| securityFilterChain | SecurityFilterChain | 보안 필터 체인 설정 | SecurityConfig |
| passwordEncoder | PasswordEncoder | 비밀번호 암호화 | SecurityConfig |
| corsConfigurationSource | CorsConfigurationSource | CORS 설정 | SecurityConfig |
| openAPI | OpenAPI | Swagger/OpenAPI 설정 | SwaggerConfig |
| documentExecutor | Executor | 문서 처리 비동기 실행기 | AsyncConfig |
| upstageWebClient | WebClient | Upstage OCR API 클라이언트 | UpstageConfig |
| s3Client | S3Client | AWS S3 클라이언트 | AwsS3Config |
