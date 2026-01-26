# 설계 철학 및 아키텍처 결정

## 개요

이 문서는 백엔드 코드베이스를 역추론하여 개발자가 내린 주요 아키텍처 결정과 그 이유를 분석합니다. 각 결정은 실제 코드 근거와 함께 제시되며, 대안과의 비교를 통해 설계 의도를 명확히 합니다.

---

## 1. 멀티테넌트 구현 방식

### 선택된 방식: ThreadLocal + Hibernate Filter + EntityListener 조합

**코드 근거:**

```java
// TenantContext.java (라인 5)
private static final ThreadLocal<Long> COMPANY_ID = new ThreadLocal<>();

// TenantEntity.java (라인 19, 22)
@Filter(name = "tenantFilter", condition = "company_id = :companyId")
@EntityListeners(TenantEntityListener.class)

// TenantEntityListener.java (라인 11-17)
@PrePersist
public void prePersist(TenantEntity e) {
    if (e.getCompanyId() == null) {
        Long cid = TenantContext.getCompanyId();
        if (cid == null) throw new IllegalStateException("TenantContext companyId is null");
        e.setCompanyId(cid);
    }
}

// TenantFilterAspect.java (라인 26-64)
@Around("@annotation(TenantFiltered) || @within(TenantFiltered)")
public Object around(ProceedingJoinPoint pjp) {
    Filter filter = session.enableFilter("tenantFilter");
    filter.setParameter("companyId", companyId);
    // depth 체크로 중첩 호출 안전 처리
}
```

### 설계 의도 추론

#### 1. ThreadLocal 사용 이유

**추론:**
- **요청 스레드별 격리**: Spring MVC는 HTTP 요청마다 별도 스레드를 할당하므로, ThreadLocal로 각 요청의 `companyId`를 안전하게 보관 가능
- **코드 침투 최소화**: 메서드 파라미터로 `companyId`를 전달하지 않아도 전역적으로 접근 가능하여 코드 중복 감소
- **성능**: 컨텍스트 조회 비용이 매우 낮음 (메모리 접근 수준)

**코드 증거:**
- `JwtAuthenticationFilter.java`에서 JWT 파싱 후 `TenantContext.setCompanyId(companyId)` 호출
- 모든 Service 메서드에서 `TenantContext.getCompanyId()`로 직접 접근

#### 2. Hibernate Filter 사용 이유

**추론:**
- **자동 쿼리 필터링**: 모든 SELECT 쿼리에 `WHERE company_id = :companyId` 자동 추가
- **개발자 실수 방지**: 수동으로 WHERE 절을 추가하지 않아도 자동으로 테넌트 격리 보장
- **중첩 호출 안전**: `TenantFilterAspect`의 depth 체크로 중복 활성화 방지

**코드 증거:**
```java
// TenantFilterAspect.java (라인 38-46)
int depth = DEPTH.get();
if (depth == 0) {
    Filter filter = session.enableFilter("tenantFilter");
    filter.setParameter("companyId", companyId);
    enabledHere = true;
}
```

**설계 의도**: AOP로 자동화하여 개발자가 필터 활성화를 수동으로 관리할 필요 없음

#### 3. EntityListener 사용 이유

**추론:**
- **자동 companyId 주입**: `@PrePersist`에서 TenantContext에서 가져와 자동 설정
- **보안 강화**: `@PreUpdate`에서 다른 테넌트로 변경 시도 차단 (`SecurityException`)

**코드 증거:**
```java
// TenantEntityListener.java (라인 20-26)
@PreUpdate
public void preUpdate(TenantEntity e) {
    Long cid = TenantContext.getCompanyId();
    if (cid != null && e.getCompanyId() != null && !e.getCompanyId().equals(cid)) {
        throw new SecurityException("Tenant mismatch update blocked");
    }
}
```

**설계 의도**: 데이터 무결성과 보안을 자동으로 보장하는 방어적 프로그래밍

### 대안과 비교

| 대안 | 장점 | 단점 | 미선택 이유 |
|------|------|------|------------|
| **별도 DB 스키마** | 완전 격리, 성능 우수 | 운영 복잡도 높음, 마이그레이션 어려움 | SaaS 초기 단계에서 과도한 복잡도 |
| **파라미터 전달** | 명시적, 단순 | 모든 메서드에 companyId 추가 필요 | 코드 중복 증가, 실수 가능성 |
| **인터셉터만 사용** | 단순 | INSERT/UPDATE 시 수동 설정 필요 | 실수 가능성 높음 |

### 결론

**선택 이유**: ThreadLocal + Filter + Listener 조합은 개발 편의성과 보안을 동시에 확보하는 실용적 선택입니다. 특히 SaaS 초기 단계에서 복잡한 인프라 없이도 안전한 멀티테넌트를 구현할 수 있습니다.

---

## 2. 비동기 처리 파이프라인

### 선택된 방식: 이벤트 기반 + TransactionalEventListener(AFTER_COMMIT) + TaskDecorator

**코드 근거:**

```java
// DocumentService.java - 이벤트 발행
publisher.publishEvent(new DocumentProcessEvent(doc.getId(), tmpPath, filename));

// DocumentProcessEventListener.java (라인 18-22)
@Async("documentExecutor")
@TransactionalEventListener(phase = TransactionPhase.AFTER_COMMIT)
public void on(DocumentProcessEvent e) {
    processor.processAsync(e.documentId(), e.tmpPath(), e.filename());
}

// AsyncConfig.java (라인 25-38)
ex.setTaskDecorator(runnable -> {
    Long companyId = TenantContext.getCompanyId(); // 캡처
    return () -> {
        TenantContext.setCompanyId(companyId); // 복원
        SecurityContextHolder.setContext(securityContext);
        runnable.run();
    };
});
```

### 설계 의도 추론

#### 1. 이벤트 기반 선택 이유

**추론:**
- **느슨한 결합**: Service가 Processor를 직접 의존하지 않아 변경 영향도 최소화
- **확장성**: 여러 리스너 추가 가능 (예: 알림 발송, 로깅 등)
- **트랜잭션 안전**: `AFTER_COMMIT`으로 커밋 후 실행 보장

**코드 증거:**
- `DocumentService`는 `ApplicationEventPublisher`만 의존
- `DocumentProcessEventListener`는 별도 컴포넌트로 분리

#### 2. AFTER_COMMIT 선택 이유

**추론:**
- **데이터 일관성**: DB 커밋 후 처리로 롤백 시나리오 방지
- **문서 상태 안전**: `PROCESSING` 상태가 확정된 후 비동기 처리 시작

**코드 증거:**
```java
// DocumentService.java
doc.setStatus(DocumentStatus.PROCESSING);
documentRepository.save(doc); // 트랜잭션 커밋
publisher.publishEvent(...); // AFTER_COMMIT에서 실행
```

**설계 의도**: 문서 상태가 DB에 확정된 후에만 OCR 처리를 시작하여, 롤백 시나리오에서도 상태 불일치 방지

#### 3. TaskDecorator 사용 이유

**추론:**
- **ThreadLocal 전파**: 비동기 스레드에서 TenantContext 복원
- **SecurityContext 전파**: 인증 정보도 함께 전달 (선택적)
- **자동 정리**: `finally`에서 `clear()`로 메모리 누수 방지

**코드 증거:**
```java
// AsyncConfig.java (라인 34-36)
finally {
    TenantContext.clear();
    SecurityContextHolder.clearContext();
}
```

**설계 의도**: 비동기 작업에서도 멀티테넌트 컨텍스트와 보안 컨텍스트가 유지되도록 보장

### 스레드 풀 설정 값의 근거

```java
// AsyncConfig.java (라인 20-22)
ex.setCorePoolSize(4);      // 기본 스레드 4개
ex.setMaxPoolSize(8);        // 최대 8개
ex.setQueueCapacity(200);    // 대기 큐 200개
```

**추론 근거:**
- **Core 4**: 문서 처리(OCR 등)가 I/O 위주이므로 CPU 코어 수와 무관하게 병렬 처리 가능. 초기 SaaS 단계에서 적절한 수준
- **Max 8**: 피크 시 2배 확장, 과도한 스레드 증가 방지 (컨텍스트 스위칭 비용 고려)
- **Queue 200**: 문서 업로드 버스트 대응, 큐 포화 시 `RejectedExecutionException`으로 백프레셔 제공

**설계 의도**: 초기 SaaS 단계에서 적절한 처리량과 리소스 사용의 균형

### 대안과 비교

| 대안 | 장점 | 단점 | 미선택 이유 |
|------|------|------|------------|
| **직접 @Async 호출** | 단순 | 트랜잭션 타이밍 제어 어려움 | AFTER_COMMIT 보장 불가 |
| **메시지 큐 (RabbitMQ/Kafka)** | 확장성, 내구성 | 인프라 복잡도 증가 | 초기 단계에서 과도한 복잡도 |
| **동기 처리** | 단순 | 응답 시간 지연, 타임아웃 위험 | 사용자 경험 저하 |

### 결론

**선택 이유**: 이벤트 기반 + AFTER_COMMIT은 트랜잭션 안전성과 확장성의 균형을 맞춘 선택입니다. 특히 문서 처리와 같은 장기 실행 작업에서 사용자 응답 시간을 보장하면서도 데이터 일관성을 유지할 수 있습니다.

---

## 3. JWT 토큰 전략

### 선택된 방식: Access/Refresh 분리 + Refresh Token 해시 저장

**코드 근거:**

```java
// JwtTokenProvider.java (라인 29-30)
private final long ACCESS_TOKEN_EXPIRE = 1000L * 60 * 60;       // 1시간
private final long REFRESH_TOKEN_EXPIRE = 1000L * 60 * 60 * 24 * 14; // 14일

// JwtTokenProvider.java (라인 36-49)
public String createAccessToken(User user) {
    return Jwts.builder()
        .claim("type", "access")
        .claim("userId", user.getId())
        .claim("companyId", user.getCompanyId())
        .claim("role", user.getRole().name())
        // ...
}

// JwtTokenProvider.java (라인 52-63)
public String createRefreshToken(User user) {
    return Jwts.builder()
        .claim("type", "refresh")  // 최소한의 정보만
        // ...
}

// RefreshTokenService.java (라인 54-66)
private String hashToken(String token) {
    MessageDigest digest = MessageDigest.getInstance("SHA-256");
    byte[] hashed = digest.digest(token.getBytes(StandardCharsets.UTF_8));
    // 64자리 hex 문자열로 변환
}
```

### 설계 의도 추론

#### 1. Access/Refresh 분리 이유

**추론:**
- **보안**: Access Token은 짧은 수명(1시간)으로 탈취 시 피해 최소화
- **성능**: Access Token만 검증하므로 DB 조회 없이 빠른 인증
- **재발급**: Refresh Token으로 무중단 갱신 가능

**코드 증거:**
```java
// JwtAuthenticationFilter.java
// Access Token만 검증, DB 조회 없음
Claims claims = jwtTokenProvider.getClaims(token);
```

**설계 의도**: Stateless 인증으로 서버 확장성 확보, 동시에 보안 강화

#### 2. Refresh Token 해시 저장 이유

**추론:**
- **보안**: DB 유출 시에도 원본 토큰 복원 불가능
- **저장 효율**: 원본 토큰(수백 바이트) 대신 해시(64바이트)만 저장
- **검증**: `hashToken(token)`으로 해시 비교만 수행

**코드 증거:**
```java
// RefreshTokenService.java (라인 35-38)
public Optional<RefreshToken> validateRefreshToken(String token) {
    return refreshTokenRepository.findByTokenHashAndRevokedFalse(hashToken(token))
        .filter(t -> t.getExpiresAt().isAfter(LocalDateTime.now()));
}
```

**설계 의도**: 보안과 저장 효율성의 균형

#### 3. Access Token에 companyId 포함 이유

**추론:**
- **멀티테넌트**: JWT에서 바로 TenantContext 설정 가능
- **성능**: 매 요청마다 DB 조회 불필요

**코드 증거:**
```java
// JwtAuthenticationFilter.java
Claims claims = jwtTokenProvider.getClaims(token);
Long companyId = claims.get("companyId", Long.class);
TenantContext.setCompanyId(companyId);
```

**설계 의도**: 멀티테넌트 환경에서 성능 최적화

### 대안과 비교

| 대안 | 장점 | 단점 | 미선택 이유 |
|------|------|------|------------|
| **단일 토큰** | 단순 | 만료 시 재로그인 필요 | 사용자 경험 저하 |
| **Refresh Token 원본 저장** | 검증 단순 | DB 유출 시 위험 | 보안 취약 |
| **세션 기반** | 즉시 무효화 가능 | 서버 상태 필요, 확장성 제한 | 스케일 아웃 어려움 |

### 결론

**선택 이유**: Access/Refresh 분리와 해시 저장은 보안과 사용자 경험의 균형을 맞춘 선택입니다. 특히 멀티테넌트 환경에서 성능을 유지하면서도 보안을 강화할 수 있습니다.

---

## 4. 문서 처리 파이프라인 설계

### 선택된 방식: 단계별 분리 (WorkTx → StatusTx) + UpstageCallGuard 동시성 제어

**코드 근거:**

```java
// DocumentWorkTx.java (라인 39-81)
@Transactional
public WorkResult run(Long companyId, Long documentId, ...) {
    // 1) Upstage 호출
    String jsonString = upstageCallGuard.run(companyId, 
        () -> upstageService.parseDocuments(resource, filename));
    
    // 2) 타입 판별 + 도메인 저장
    DocumentType type = DocumentTypeDetector.detect(res);
    Object result = orchestrationService.handleParsed(...);
    
    // 3) S3 업로드 (부가작업, 실패해도 OK)
    try {
        s3Key = s3Upload.uploadRawDocument(...);
    } catch (Exception s3e) {
        warning = "S3 archive failed: " + s3e.getMessage();
    }
}

// DocumentStatusTx.java (라인 23-36)
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void markDone(Long companyId, Long documentId, ...) {
    // 별도 트랜잭션으로 상태만 업데이트
}

// UpstageCallGuard.java (라인 15, 21)
private final Semaphore global = new Semaphore(2, true);  // 전역 2개
private final ConcurrentHashMap<Long, Semaphore> perCompany = ...;  // 회사별 1개
```

### 설계 의도 추론

#### 1. 단계별 분리 이유

**추론:**
- **관심사 분리**: 작업 수행(WorkTx)과 상태 업데이트(StatusTx) 분리
- **트랜잭션 최적화**: `REQUIRES_NEW`로 상태 업데이트가 롤백되지 않음
- **오류 격리**: S3 업로드 실패가 문서 처리 실패로 전파되지 않음

**코드 증거:**
```java
// DocumentWorkTx.java (라인 65-73)
// 3) S3 업로드는 "부가작업": 실패해도 문서 자체는 DONE 가능
try {
    s3Key = s3Upload.uploadRawDocument(...);
} catch (Exception s3e) {
    warning = "S3 archive failed: " + s3e.getMessage();
}
```

**설계 의도**: 핵심 비즈니스 로직(OCR 파싱)과 부가 작업(S3 보관)을 분리하여 안정성 확보

#### 2. UpstageCallGuard 동시성 제어 설계 의도

**추론:**
- **전역 제한(2)**: Upstage API Rate Limit 대응 (Tier1 기준)
- **회사별 제한(1)**: 한 회사가 전역 슬롯 독점 방지
- **타임아웃(30초)**: 무한 대기 방지, 장애 조기 감지

**코드 증거:**
```java
// UpstageCallGuard.java (라인 14-15)
// ✅ 전역 동시성: Tier1이면 일단 2 정도로 시작(429 줄어듦)
private final Semaphore global = new Semaphore(2, true);

// UpstageCallGuard.java (라인 17)
// ✅ 회사별 동시성: 회사 하나가 독점 못 하게 1
return perCompany.computeIfAbsent(companyId, id -> new Semaphore(1, true));
```

**설계 의도**: 외부 API 호출 제한을 애플리케이션 레벨에서 제어하여 Rate Limit 오류 방지

### 파이프라인 단계 설계 이유

```
1. Upstage 호출 → OCR 결과 획득
2. 타입 판별 → 문서 종류 결정
3. 도메인 저장 → 각 Service로 위임 (Registration, Export 등)
4. S3 업로드 → 원본 보관 (부가작업)
5. 상태 업데이트 → DONE/FAILED 표시
```

**추론 근거:**
- **단계별 분리**: 각 단계 실패 시 다른 단계에 영향 최소화
- **S3를 부가작업으로 처리**: 핵심 비즈니스 로직과 분리, 실패해도 문서 처리 완료 가능
- **타입별 Orchestration**: Strategy 패턴으로 확장성 확보

**코드 증거:**
```java
// DocumentOrchestrationService.java
public Object handleParsed(Long companyId, DocumentType type, UpstageResponse res, String jsonString) {
    return switch (type) {
        case DEREGISTRATION -> deRegistrationService.saveFromOcr(...);
        case REGISTRATION -> registrationService.saveFromOcr(...);
        // ...
    };
}
```

### 대안과 비교

| 대안 | 장점 | 단점 | 미선택 이유 |
|------|------|------|------------|
| **단일 트랜잭션** | 원자성 보장 | 롤백 시 상태 업데이트 불가 | 장기 실행 작업에 부적합 |
| **메시지 큐** | 확장성, 재시도 | 복잡도 증가 | 초기 단계에서 과도 |
| **동기 처리** | 단순 | 응답 시간 지연 | 사용자 경험 저하 |

### 결론

**선택 이유**: 단계별 분리와 동시성 제어는 안정성과 확장성을 확보한 설계입니다. 특히 외부 API 의존성이 있는 장기 실행 작업에서 안정적인 처리를 보장합니다.

---

## 5. Repository 패턴 선택

### 선택된 방식: TenantRepository vs JpaRepository 구분

**코드 근거:**

```java
// TenantRepository.java
@NoRepositoryBean
public interface TenantRepository<T, ID> extends JpaRepository<T, ID> {
    default List<T> findAllByTenant() {
        Long companyId = TenantContext.getCompanyId();
        return findAllByCompanyId(companyId);
    }
    List<T> findAllByCompanyId(Long companyId);
}

// 사용 예시: DocumentRepository
public interface DocumentRepository extends TenantRepository<Documents, Long> {
    Optional<Documents> findByIdAndCompanyId(Long id, Long companyId);
}

// JpaRepository 직접 사용: RefreshTokenRepository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByTokenHashAndRevokedFalse(String tokenHash);
}
```

### 구분 기준 추론

| Repository 타입 | 사용 대상 | 예시 | 이유 |
|----------------|----------|------|------|
| **TenantRepository** | `TenantEntity` 상속 엔티티 | Documents, RegistrationCertificate, DeRegistrationCertificate | 멀티테넌트 필터링 필요 |
| **JpaRepository** | 테넌트 없는 엔티티 | Company, User, RefreshToken | 전역 엔티티, 테넌트 개념 없음 |

### 설계 의도 추론

#### 1. TenantRepository 사용 이유

**추론:**
- **자동 필터링**: `findAllByTenant()`로 현재 테넌트 데이터만 조회
- **보안 강화**: `findByIdAndCompanyId()`로 테넌트 검증 강제
- **코드 일관성**: 멀티테넌트 쿼리 패턴 통일

**코드 증거:**
```java
// VehicleRepository.java
Optional<Vehicle> findByCompanyIdAndChassisNo(Long companyId, String chassisNo);
```

**설계 의도**: 개발자가 실수로 다른 테넌트 데이터에 접근하는 것을 방지

#### 2. JpaRepository 직접 사용 이유

**추론:**
- **Company**: 테넌트 개념 자체가 없음 (최상위 엔티티)
- **User**: 멀티테넌트이지만 로그인 시점에 companyId 결정
- **RefreshToken**: 전역 엔티티, 테넌트와 무관

**설계 의도**: 도메인 특성에 맞는 Repository 선택

### 대안과 비교

| 대안 | 장점 | 단점 | 미선택 이유 |
|------|------|------|------------|
| **모두 TenantRepository** | 일관성 | 불필요한 복잡도 | Company 같은 전역 엔티티에 부적합 |
| **모두 JpaRepository** | 단순 | 매번 companyId 파라미터 필요 | 실수 가능성 증가 |
| **커스텀 BaseRepository** | 유연성 | 과도한 추상화 | 현재 요구사항에 과함 |

### 결론

**선택 이유**: TenantRepository와 JpaRepository 구분은 도메인 특성에 맞춘 실용적 선택입니다. 멀티테넌트가 필요한 엔티티만 TenantRepository를 사용하여 복잡도를 최소화하면서도 보안을 강화합니다.

---

## 종합 분석: 개발자의 설계 철학

### 핵심 설계 원칙

1. **보안 우선**: 멀티테넌트 격리, Refresh Token 해시 저장, 테넌트 검증 강제
2. **실용성**: 초기 단계에서 메시지 큐 등 복잡한 인프라 지양, Spring 기본 기능 활용
3. **확장성**: 이벤트 기반, Strategy 패턴, 단계별 분리로 향후 확장 고려
4. **안정성**: 트랜잭션 분리, 오류 격리, 동시성 제어로 장애 전파 최소화
5. **개발자 경험**: 자동화(TenantContext, Entity Listener)로 실수 방지

### 아키텍처 특징

- **멀티테넌트**: ThreadLocal + Hibernate Filter + EntityListener로 안전한 격리
- **비동기 처리**: 이벤트 기반 + AFTER_COMMIT으로 트랜잭션 안전성 확보
- **보안**: JWT 기반 Stateless 인증, Refresh Token 해시 저장
- **문서 처리**: 단계별 분리로 안정성과 확장성 확보
- **동시성 제어**: Semaphore로 외부 API 호출 제한

### 결론

이러한 설계는 SaaS 초기 단계에서 복잡도와 기능성의 균형을 맞춘 실용적 아키텍처입니다. 특히 멀티테넌트 보안과 비동기 처리 안정성에 중점을 두고 있으며, 향후 확장 가능성을 고려한 구조입니다.
