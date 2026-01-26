# 환경 설정 전략

## 개요

이 문서는 코드베이스의 환경 설정 전략을 분석하고, 필요한 환경 변수와 설정 파일 구조를 제안합니다.

---

## 1. 현재 설정 상태

### 1.1 설정 파일 부재

**위치**: `src/main/resources/`

**현재 상태**:
- `application.yml` 또는 `application.properties` 파일 없음
- 환경 변수 기반 설정으로 추정

**타협 이유 추론**:
- 환경별 설정 파일 관리 복잡도 회피
- 환경 변수로 모든 설정 관리 (Docker/Kubernetes 환경 고려)
- **의도적 부채**: 설정 파일 관리 부재

**영향도**: 중간 (로컬 개발 환경 설정 어려움)

---

## 2. 환경 변수 분석

### 2.1 발견된 환경 변수

코드베이스에서 `@Value` 어노테이션으로 사용되는 환경 변수:

#### 보안 관련

| 환경 변수 | 파일 | 용도 | 필수 여부 |
|-----------|------|------|-----------|
| `jwt.secret` | `JwtTokenProvider.java` | JWT 서명 키 | ✅ 필수 |
| `app.security.allowed-origins` | `SecurityConfig.java` | CORS 허용 Origin 목록 | ⚠️ 선택 |
| `app.security.allow-docs` | `SecurityConfig.java` | Swagger 문서 허용 여부 | ⚠️ 선택 (기본: false) |

#### AWS 관련

| 환경 변수 | 파일 | 용도 | 필수 여부 |
|-----------|------|------|-----------|
| `cloud.aws.credentials.access-key` | `AwsS3Config.java` | AWS Access Key | ✅ 필수 |
| `cloud.aws.credentials.secret-key` | `AwsS3Config.java` | AWS Secret Key | ✅ 필수 |
| `cloud.aws.region.static` | `AwsS3Config.java` | AWS 리전 | ✅ 필수 |
| `cloud.aws.s3.bucket` | `S3Upload.java`, `S3ObjectReader.java` | S3 버킷명 | ✅ 필수 |

#### Upstage 관련

| 환경 변수 | 파일 | 용도 | 필수 여부 |
|-----------|------|------|-----------|
| `upstage.api-key` | `UpstageConfig.java` | Upstage API 키 | ✅ 필수 |

#### 인쇄 관련

| 환경 변수 | 파일 | 용도 | 필수 여부 |
|-----------|------|------|-----------|
| `print.libreoffice.binary` | `LibreOfficeXlsxToPdfConverter.java` | LibreOffice 실행 파일 경로 | ⚠️ 선택 (기본: soffice) |
| `print.libreoffice.timeout-seconds` | `LibreOfficeXlsxToPdfConverter.java` | LibreOffice 타임아웃 | ⚠️ 선택 (기본: 45) |

---

## 3. 하드코딩된 설정 값

### 3.1 Upstage API 설정

**파일**: `src/main/java/cariv/exp/global/config/UpstageConfig.java` (라인 20)

**하드코딩된 값**:
```java
.baseUrl("https://api.upstage.ai/v1")  // 하드코딩
```

**개선 권장**: 환경 변수로 이동
```properties
upstage.api.base-url=https://api.upstage.ai/v1
```

---

### 3.2 재시도 설정

**파일**: `src/main/java/cariv/exp/domain/upstage/service/UpstageService.java` (라인 27-28)

**하드코딩된 값**:
```java
private static final int MAX_RETRIES = 5;
private static final long BASE_BACKOFF_MS = 400;
```

**개선 권장**: 환경 변수로 이동
```properties
upstage.retry.max-retries=5
upstage.retry.base-backoff-ms=400
```

---

### 3.3 동시성 제한 설정

**파일**: `src/main/java/cariv/exp/domain/upstage/service/UpstageCallGuard.java` (라인 15, 21, 32, 35)

**하드코딩된 값**:
```java
private final Semaphore global = new Semaphore(2, true);  // 전역 2개
return perCompany.computeIfAbsent(companyId, id -> new Semaphore(1, true));  // 회사별 1개
g = global.tryAcquire(30, TimeUnit.SECONDS);  // 타임아웃 30초
```

**개선 권장**: 환경 변수로 이동
```properties
upstage.concurrency.global=2
upstage.concurrency.per-company=1
upstage.concurrency.timeout-seconds=30
```

---

### 3.4 비동기 스레드 풀 설정

**파일**: `src/main/java/cariv/exp/global/config/AsyncConfig.java` (라인 20-22)

**하드코딩된 값**:
```java
ex.setCorePoolSize(4);
ex.setMaxPoolSize(8);
ex.setQueueCapacity(200);
```

**개선 권장**: 환경 변수로 이동
```properties
async.document-executor.core-pool-size=4
async.document-executor.max-pool-size=8
async.document-executor.queue-capacity=200
```

---

### 3.5 Export Controller 기본 Stage

**파일**: `src/main/java/cariv/exp/domain/export/controller/ExportController.java` (라인 42-43)

**하드코딩된 값**:
```java
VehicleStage resolvedStage = (stage == null) ? VehicleStage.DEREG_COMPLETED : stage;
```

**개선 권장**: 환경 변수로 이동
```properties
export.default-stage=DEREG_COMPLETED
```

---

## 4. 설정 파일 구조 제안

### 4.1 application.yml 기본 구조

```yaml
spring:
  application:
    name: cariv-exp
  
  datasource:
    url: ${DB_URL:jdbc:mysql://localhost:3306/cariv_exp}
    username: ${DB_USERNAME:root}
    password: ${DB_PASSWORD:password}
    driver-class-name: com.mysql.cj.jdbc.Driver
  
  jpa:
    hibernate:
      ddl-auto: validate
    show-sql: false
    properties:
      hibernate:
        format_sql: true

# JWT 설정
jwt:
  secret: ${JWT_SECRET:your-secret-key-min-256-bits}

# 애플리케이션 보안 설정
app:
  security:
    allowed-origins: ${ALLOWED_ORIGINS:}
    allow-docs: ${ALLOW_DOCS:false}

# AWS 설정
cloud:
  aws:
    credentials:
      access-key: ${AWS_ACCESS_KEY:}
      secret-key: ${AWS_SECRET_KEY:}
    region:
      static: ${AWS_REGION:ap-northeast-2}
    s3:
      bucket: ${S3_BUCKET:}

# Upstage 설정
upstage:
  api:
    base-url: ${UPSTAGE_API_BASE_URL:https://api.upstage.ai/v1}
    key: ${UPSTAGE_API_KEY:}
  retry:
    max-retries: ${UPSTAGE_MAX_RETRIES:5}
    base-backoff-ms: ${UPSTAGE_BASE_BACKOFF_MS:400}
  concurrency:
    global: ${UPSTAGE_CONCURRENCY_GLOBAL:2}
    per-company: ${UPSTAGE_CONCURRENCY_PER_COMPANY:1}
    timeout-seconds: ${UPSTAGE_CONCURRENCY_TIMEOUT:30}

# 비동기 설정
async:
  document-executor:
    core-pool-size: ${ASYNC_CORE_POOL_SIZE:4}
    max-pool-size: ${ASYNC_MAX_POOL_SIZE:8}
    queue-capacity: ${ASYNC_QUEUE_CAPACITY:200}

# Export 설정
export:
  default-stage: ${EXPORT_DEFAULT_STAGE:DEREG_COMPLETED}

# 인쇄 설정
print:
  libreoffice:
    binary: ${LIBREOFFICE_BINARY:soffice}
    timeout-seconds: ${LIBREOFFICE_TIMEOUT:45}
```

---

### 4.2 환경별 프로파일

#### application-dev.yml (로컬 개발)

```yaml
spring:
  jpa:
    show-sql: true
    hibernate:
      ddl-auto: update

app:
  security:
    allow-docs: true

logging:
  level:
    cariv.exp: DEBUG
```

#### application-prod.yml (운영)

```yaml
spring:
  jpa:
    show-sql: false
    hibernate:
      ddl-auto: validate

app:
  security:
    allow-docs: false

logging:
  level:
    cariv.exp: INFO
    root: WARN
```

---

## 5. 환경 변수 관리 전략

### 5.1 민감 정보 관리

**원칙**:
- 민감 정보(비밀번호, API 키)는 환경 변수로만 관리
- 설정 파일에는 기본값만 포함 (로컬 개발용)

**예시**:
```yaml
jwt:
  secret: ${JWT_SECRET}  # 환경 변수 필수, 기본값 없음
```

---

### 5.2 Docker/Kubernetes 환경

**Docker Compose 예시**:
```yaml
services:
  app:
    environment:
      - JWT_SECRET=${JWT_SECRET}
      - DB_URL=jdbc:mysql://db:3306/cariv_exp
      - AWS_ACCESS_KEY=${AWS_ACCESS_KEY}
      - AWS_SECRET_KEY=${AWS_SECRET_KEY}
      - UPSTAGE_API_KEY=${UPSTAGE_API_KEY}
```

**Kubernetes Secret 예시**:
```yaml
apiVersion: v1
kind: Secret
metadata:
  name: app-secrets
type: Opaque
stringData:
  jwt-secret: <base64-encoded>
  aws-access-key: <base64-encoded>
  aws-secret-key: <base64-encoded>
  upstage-api-key: <base64-encoded>
```

---

## 6. 설정 검증 전략

### 6.1 필수 환경 변수 검증

**구현 제안**:
```java
@Configuration
public class ConfigurationValidator {
    
    @PostConstruct
    public void validate() {
        if (jwtSecret == null || jwtSecret.isEmpty()) {
            throw new IllegalStateException("jwt.secret is required");
        }
        if (awsAccessKey == null || awsAccessKey.isEmpty()) {
            throw new IllegalStateException("cloud.aws.credentials.access-key is required");
        }
        // ...
    }
}
```

---

### 6.2 설정 값 검증

**예시**:
- JWT Secret 길이 검증 (최소 256비트)
- AWS 리전 유효성 검증
- Upstage API 키 형식 검증

---

## 7. 설정 문서화

### 7.1 README.md에 설정 가이드 추가

```markdown
## 환경 설정

### 필수 환경 변수

- `JWT_SECRET`: JWT 서명 키 (최소 256비트)
- `DB_URL`: 데이터베이스 연결 URL
- `AWS_ACCESS_KEY`: AWS Access Key
- `AWS_SECRET_KEY`: AWS Secret Key
- `UPSTAGE_API_KEY`: Upstage API 키

### 선택 환경 변수

- `ALLOWED_ORIGINS`: CORS 허용 Origin 목록 (쉼표 구분)
- `ALLOW_DOCS`: Swagger 문서 허용 여부 (true/false)
- `UPSTAGE_MAX_RETRIES`: Upstage 재시도 횟수 (기본: 5)
```

---

## 8. 설정 마이그레이션 계획

### 8.1 단계별 마이그레이션

1. **1단계**: `application.yml` 기본 파일 생성
2. **2단계**: 하드코딩된 값 환경 변수로 이동
3. **3단계**: 환경별 프로파일 분리
4. **4단계**: 설정 검증 로직 추가

---

## 9. 결론

### 현재 상태

- 설정 파일 부재
- 환경 변수 기반 설정
- 하드코딩된 값 다수

### 개선 권장

1. **즉시**: `application.yml` 기본 파일 생성
2. **단기**: 하드코딩된 값 환경 변수로 이동
3. **중기**: 환경별 프로파일 분리
4. **장기**: 설정 검증 및 문서화

### 예상 효과

- 로컬 개발 환경 설정 용이
- 운영 환경별 설정 관리 용이
- 설정 변경 시 코드 수정 불필요
- 설정 문서화로 온보딩 용이

---

이러한 설정 전략을 단계적으로 도입하여 개발 및 운영 환경의 설정 관리를 개선하는 것을 권장합니다.
