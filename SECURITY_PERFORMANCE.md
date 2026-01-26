# 보안 및 성능 결정

## 개요

이 문서는 코드베이스에서 발견된 보안 설정, 성능 최적화 전략, 인덱스 설계, 트랜잭션 관리 등을 분석합니다. 각 결정은 개발자의 의도와 근거를 역추론하여 제시합니다.

---

## 1. 인덱스 전략

### 1.1 Vehicle 엔티티 인덱스

**파일**: `src/main/java/cariv/exp/domain/vehicle/entity/Vehicle.java` (라인 16-24)

**인덱스 설정**:
```java
@Table(
    indexes = {
        @Index(name = "idx_vehicle_company_regno", columnList = "company_id, registration_no"),
        @Index(name = "idx_vehicle_company_stage", columnList = "company_id, stage")
    }
)
```

**설계 의도 추론**:

1. **복합 인덱스 `(company_id, registration_no)`**
   - **목적**: 멀티테넌트 환경에서 회사별 차량번호 조회 최적화
   - **사용 쿼리**: `findByCompanyIdAndRegistrationNo()`
   - **이유**: `company_id`를 선두에 배치하여 테넌트 필터링 후 차량번호 검색

2. **복합 인덱스 `(company_id, stage)`**
   - **목적**: 회사별 진행 단계 필터링 최적화
   - **사용 쿼리**: `findByCompanyIdAndStage()`, `listManagement()` (stage 필터)
   - **이유**: 차량관리 목록 조회에서 stage 필터가 자주 사용됨

**추론 근거**:
- 주석: `// ✅ 추가 추천` - 개발 중 추가된 인덱스
- 멀티테넌트 환경에서 `company_id`를 항상 선두에 배치

---

### 1.2 Export 엔티티 인덱스

**파일**: `src/main/java/cariv/exp/domain/export/entity/Export.java` (라인 16-21)

**인덱스 설정**:
```java
@Table(
    indexes = {
        @Index(name = "idx_export_decl_company_vehicle", columnList = "company_id, vehicle_id"),
        @Index(name = "idx_export_decl_company_declno", columnList = "company_id, declaration_no"),
        @Index(name = "idx_export_decl_company_vin", columnList = "company_id, chassis_no")
    }
)
```

**설계 의도 추론**:

1. **복합 인덱스 `(company_id, vehicle_id)`**
   - **목적**: 차량별 수출증명서 조회 최적화
   - **사용 쿼리**: `findTop1ByCompanyIdAndVehicleIdOrderByIdDesc()`, `findLatestByCompanyIdAndVehicleIdIn()`
   - **이유**: 차량별 최신 수출증명서 조회가 빈번함

2. **복합 인덱스 `(company_id, declaration_no)`**
   - **목적**: 신고번호 조회 최적화
   - **사용 쿼리**: `findByCompanyIdAndDeclarationNo()` (추정)
   - **이유**: 신고번호로 수출증명서 조회

3. **복합 인덱스 `(company_id, chassis_no)`**
   - **목적**: VIN(차대번호) 기반 조회 최적화
   - **사용 쿼리**: VIN 기반 검색 (추정)
   - **이유**: 차대번호로 수출증명서 조회

**추론 근거**:
- 멀티테넌트 환경에서 `company_id`를 항상 선두에 배치
- 자주 조회되는 필드 조합에 복합 인덱스 적용

---

### 1.3 유니크 제약조건

**Vehicle 엔티티**:
```java
@UniqueConstraint(name = "uk_vehicle_company_chassis", columnNames = {"company_id", "chassis_no"})
```

**설계 의도 추론**:
- 회사별로 동일한 차대번호를 가진 차량은 중복 불가
- 데이터 무결성 보장

---

## 2. N+1 문제 방지 전략

### 2.1 Fetch Join 사용

**파일**: `src/main/java/cariv/exp/domain/export/repository/ExportRepository.java` (라인 55-78)

**코드**:
```java
@Query("""
    select e
    from Export e
    join fetch e.vehicle v  // ✅ fetch join 사용
    where e.companyId = :companyId
      and v.stage = :stage
      // ...
""")
List<Export> findLatestExportsForStatus(...)
```

**설계 의도 추론**:
- `Export.vehicle` 관계를 fetch join으로 한 번에 조회
- N+1 문제 방지

**추론 근거**:
- `@ManyToOne(fetch = FetchType.LAZY)`로 설정되어 있지만, 이 쿼리에서는 fetch join으로 즉시 로딩

---

### 2.2 배치 조회 패턴

**파일**: `src/main/java/cariv/exp/domain/vehicle/service/VehicleService.java` (라인 130-150 추정)

**패턴**:
```java
// 1. Vehicle 목록 조회
List<Vehicle> vehicles = vehicleRepository.findForManagementList(...);

// 2. 관련 엔티티 배치 조회 (N+1 방지)
Map<Long, VehiclePurchase> purchaseMap = 
    vehiclePurchaseRepository.findByCompanyIdAndVehicleIdIn(companyId, vehicleIds)
        .stream()
        .collect(Collectors.toMap(...));

Map<Long, DeRegistrationCertificate> deregMap = 
    deRegistrationCertificateRepository.findLatestByCompanyIdAndVehicleIdIn(...)
        .stream()
        .collect(Collectors.toMap(...));
```

**설계 의도 추론**:
- Vehicle 목록 조회 후 관련 엔티티를 배치로 조회
- Map으로 변환하여 O(1) 조회 성능 확보

**추론 근거**:
- `findByCompanyIdAndVehicleIdIn()` 메서드로 배치 조회
- Stream API로 Map 변환

---

### 2.3 Lazy 로딩 전략

**엔티티 관계 설정**:
- `Export.vehicle`: `@ManyToOne(fetch = FetchType.LAZY)`
- `VehiclePurchase.vehicle`: `@OneToOne(fetch = FetchType.LAZY)`
- `DeRegistrationCertificate.vehicle`: `@ManyToOne(fetch = FetchType.LAZY)`
- `RefreshToken.user`: `@ManyToOne(fetch = FetchType.LAZY)`
- `BaseInfo.exportCountryCodes`: `@ElementCollection(fetch = FetchType.LAZY)`

**설계 의도 추론**:
- 기본적으로 LAZY 로딩으로 설정하여 불필요한 조회 방지
- 필요 시 fetch join으로 즉시 로딩

---

### 2.4 미적용 영역

**문제점**:
- `VehicleRepository.findForManagementList()`는 Vehicle만 조회
- 이후 별도 조회로 N+1 가능성

**개선 권장**:
- `@EntityGraph` 사용 또는 fetch join 적용

---

## 3. 캐싱 전략

### 3.1 캐싱 없음

**분석 결과**:
- `@Cacheable`, `@CacheEvict`, `@CachePut` 사용 없음
- Spring Cache 설정 없음

**캐싱이 없는 이유 추정**:

1. **멀티테넌트 복잡도**
   - 캐시 키에 `companyId` 포함 필요
   - 캐시 무효화 시 테넌트별 관리 복잡

2. **데이터 변경 빈도**
   - 문서 처리, 차량 정보 등 변경 빈도가 높음
   - 캐시 효율이 낮을 수 있음

3. **현재 트래픽 수준**
   - 초기 SaaS 단계에서 DB 성능으로 충분

**개선 제안**:
- BaseInfo 같은 변경 빈도 낮은 데이터에 캐싱 고려
- JWT 검증 결과 캐싱 고려

---

## 4. 보안 설정

### 4.1 CORS 설정

**파일**: `src/main/java/cariv/exp/global/config/SecurityConfig.java` (라인 101-121)

**코드**:
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));
    config.setExposedHeaders(List.of("Authorization"));
    
    if (allowedOrigins != null && !allowedOrigins.isEmpty()) {
        config.setAllowedOrigins(allowedOrigins);  // 설정 파일에서 관리
        config.setAllowCredentials(true);
    } else {
        config.setAllowCredentials(false);
    }
    
    config.setMaxAge(3600L);  // 1시간
}
```

**설계 의도 추론**:

1. **허용 Origin 설정 파일 관리**
   - `app.security.allowed-origins` 환경 변수로 관리
   - 운영 환경에서만 특정 Origin 허용

2. **Credentials 허용 조건부**
   - Origin 설정 시에만 `allowCredentials(true)`
   - 보안 강화

3. **Preflight 캐시 1시간**
   - `maxAge(3600L)`로 Preflight 요청 캐싱
   - 성능 최적화

**추론 근거**:
- 환경 변수 기반 설정으로 운영 환경별 관리
- 보안과 사용성의 균형

---

### 4.2 비밀번호 암호화

**파일**: `src/main/java/cariv/exp/global/config/SecurityConfig.java` (라인 95-98)

**코드**:
```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

**설계 의도 추론**:
- BCrypt 사용 (salt 자동 생성)
- 단방향 해싱으로 원문 복구 불가

**사용 위치**:
- `AuthService.signup()`: `encoder.encode(req.password())`
- `AuthService.login()`: `encoder.matches(req.password(), user.getPasswordHash())`
- `AdminUserService.changePassword()`: `passwordEncoder.matches()` 및 `encode()`

**추론 근거**:
- Spring Security 기본 BCrypt 사용
- 보안 표준 준수

---

### 4.3 JWT 서명 알고리즘

**파일**: `src/main/java/cariv/exp/global/jwt/JwtTokenProvider.java` (라인 32-34, 48)

**코드**:
```java
private Key getSigningKey() {
    return Keys.hmacShaKeyFor(secretKey.getBytes(StandardCharsets.UTF_8));
}

.signWith(getSigningKey(), SignatureAlgorithm.HS256)  // ✅ HS256 사용
```

**설계 의도 추론**:
- HS256 (HMAC-SHA256) 사용
- Secret Key는 설정 파일에서 주입 (`${jwt.secret}`)
- Access Token: 1시간, Refresh Token: 14일

**보안 강화 제안**:
- RS256 고려 (비대칭 키)
- Secret Key 길이 검증
- Token Rotation 강화

---

### 4.4 Security Filter Chain 설정

**파일**: `src/main/java/cariv/exp/global/config/SecurityConfig.java` (라인 37-93)

**주요 설정**:

1. **CSRF 비활성화**
   ```java
   .csrf(AbstractHttpConfigurer::disable)  // JWT API에서는 거의 필수
   ```
   - JWT 기반 Stateless API이므로 CSRF 불필요

2. **Session Stateless**
   ```java
   .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
   ```
   - JWT 기반 인증으로 세션 불필요

3. **HSTS 설정**
   ```java
   .httpStrictTransportSecurity(hsts -> hsts
       .includeSubDomains(true)
       .maxAgeInSeconds(31536000)  // 1년
   )
   ```
   - HTTPS 강제

4. **Swagger 문서 접근 제어**
   ```java
   if (allowDocs) {
       auth.requestMatchers("/swagger-ui/**", ...).permitAll();
   } else {
       auth.requestMatchers("/swagger-ui/**", ...).denyAll();
   }
   ```
   - 운영 환경에서 Swagger 비활성화 가능

**설계 의도 추론**:
- JWT 기반 Stateless 인증에 최적화
- 운영 환경 보안 강화

---

## 5. 트랜잭션 관리

### 5.1 읽기 전용 트랜잭션

**사용 예시**:
```java
@Transactional(readOnly = true)  // VehicleService.getManagement()
@Transactional(readOnly = true)  // VehicleService.listManagement()
@Transactional(readOnly = true)  // BaseInfoService.getBaseInfo()
```

**설계 의도 추론**:
- 읽기 전용 쿼리 성능 최적화
- DB 리소스 사용 최소화

---

### 5.2 쓰기 트랜잭션

**사용 예시**:
```java
@Transactional  // VehicleService.upsertFromRegistration()
@Transactional  // VehicleService.update()
```

**설계 의도 추론**:
- 기본 트랜잭션 설정 사용
- 데이터 일관성 보장

---

### 5.3 특수 전파 설정: REQUIRES_NEW

**파일**: `src/main/java/cariv/exp/domain/document/service/DocumentStatusTx.java` (라인 23-36)

**코드**:
```java
@Transactional(propagation = Propagation.REQUIRES_NEW)
public void markDone(Long companyId, Long documentId, ...) {
    withTenant(companyId, () -> {
        Documents doc = documentRepository.findById(documentId)...
        doc.setStatus(DocumentStatus.DONE);
        documentRepository.save(doc);
    });
}
```

**설계 의도 추론**:
- 비동기 처리 후 상태 업데이트를 독립 트랜잭션으로 처리
- 부모 트랜잭션 롤백 시에도 상태 업데이트 유지

**추론 근거**:
- 문서 처리 실패 시에도 상태는 업데이트되어야 함
- `REQUIRES_NEW`로 독립 트랜잭션 보장

---

### 5.4 트랜잭션 사용 통계

**분석 결과**:
- 총 26개 메서드에 `@Transactional` 적용
- `readOnly = true`: 8개
- `propagation = Propagation.REQUIRES_NEW`: 2개
- 기본 설정: 16개

**설계 의도 추론**:
- 대부분 기본 트랜잭션 설정 사용
- 읽기 전용 트랜잭션 적극 활용
- 특수 케이스에만 REQUIRES_NEW 사용

---

## 6. 에러 처리 전략

### 6.1 GlobalExceptionHandler

**파일**: `src/main/java/cariv/exp/global/exception/GlobalExceptionHandler.java`

**예외 처리 계층**:
1. CustomException (비즈니스 로직 예외)
2. JWT 만료/무효 예외
3. 권한 부족 예외
4. Validation 실패 예외
5. 모든 예외 (fallback)

**로깅 전략**:
- CustomException: WARN 레벨, 메시지만
- 일반 Exception: ERROR 레벨, 전체 스택 트레이스
- JWT/Validation 예외: 로깅 없음

**설계 의도 추론**:
- 비즈니스 예외는 로깅 최소화
- 시스템 예외는 상세 로깅

---

### 6.2 Service 레이어 예외 처리

**예시 1: 동시성 처리**
```java
// VehicleService.upsertFromRegistration()
try {
    return vehicleRepository.save(vehicle);
} catch (DataIntegrityViolationException e) {
    // 동시 생성으로 UNIQUE 충돌 시 재조회
    return vehicleRepository.findByCompanyIdAndChassisNo(companyId, chassisNo)
            .orElseThrow(() -> e);
}
```

**예시 2: 조용한 처리**
```java
// VehicleService.listManagement()
try {
    Integer.parseInt(resolvedKeyword);
} catch (NumberFormatException e) {
    return List.of();  // 빈 리스트 반환
}
```

**설계 의도 추론**:
- 비즈니스 예외는 CustomException으로 변환
- 시스템 예외는 로깅 후 사용자 친화적 메시지 반환
- 일부 예외는 조용히 처리 (NumberFormatException 등)

**문제점**:
- 일부 예외가 `IllegalArgumentException`으로 throw되어 GlobalExceptionHandler에서 처리되지 않을 수 있음
- 예: `VehicleService.update()`에서 `new IllegalArgumentException("vehicle not found")`

**개선 권장**:
- `IllegalArgumentException`을 `CustomException`으로 통일

---

## 7. 종합 평가

### 강점

1. **인덱스 전략**: 멀티테넌트 환경에 최적화된 복합 인덱스
2. **비밀번호 암호화**: BCrypt 사용으로 보안 강화
3. **CORS 설정**: 환경 변수 기반 관리로 운영 환경 보안 강화
4. **읽기 전용 트랜잭션**: 성능 최적화
5. **전역 예외 처리**: 체계적인 예외 처리 구조

### 개선 필요 사항

1. **N+1 문제**: `@EntityGraph` 도입 또는 fetch join 확대
2. **캐싱**: 변경 빈도 낮은 데이터에 캐싱 고려
3. **예외 처리**: `IllegalArgumentException`을 `CustomException`으로 통일
4. **JWT 보안**: RS256 고려, Secret Key 검증 강화
5. **트랜잭션**: Isolation 레벨 명시적 설정 검토

---

## 결론

이러한 보안 및 성능 결정은 멀티테넌트 환경과 초기 SaaS 단계를 고려한 실용적 선택입니다. 특히 인덱스 전략과 트랜잭션 관리가 잘 설계되어 있으며, 향후 확장을 고려한 개선이 필요합니다.
