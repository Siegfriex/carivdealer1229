# 테스트 전략 분석

## 개요

이 문서는 코드베이스의 테스트 코드 현황을 분석하고, 개발자의 테스트 전략을 역추론합니다.

---

## 1. 현재 테스트 코드 현황

### 1.1 테스트 파일 통계

**발견된 테스트 파일**: 1개

**파일**: `src/test/java/cariv/exp/ExpApplicationTests.java`

**내용**:
```java
package cariv.exp;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
class ExpApplicationTests {

    @Test
    void contextLoads() {
    }
}
```

**분석**:
- Spring Boot 기본 테스트 템플릿만 존재
- `contextLoads()` 단일 테스트만 존재
- 실제 비즈니스 로직 테스트 없음

---

### 1.2 테스트 커버리지

**추정 커버리지**: 0% (비즈니스 로직)

**이유**:
- 실제 테스트 코드가 없음
- `contextLoads()`는 Spring Context 로딩만 확인

---

## 2. 테스트 전략 추론

### 2.1 MVP 단계 전략

**추론**:
- SaaS 초기 단계에서 빠른 개발 우선
- 테스트 코드 작성보다 기능 구현 우선
- **의도적 부채**: 테스트 코드는 향후 추가 예정

**근거**:
- 프로젝트가 초기 단계로 보임
- 기능 구현이 우선순위
- 테스트 코드 작성 시간 절약

---

### 2.2 테스트 부재의 영향

**긍정적 측면**:
- 빠른 개발 속도
- 초기 투자 비용 절감

**부정적 측면**:
- 리팩토링 시 회귀 버그 위험
- 코드 변경 시 수동 검증 필요
- 버그 발견 시점이 늦어짐

---

## 3. 테스트 전략 제안

### 3.1 우선순위 High

#### 1. 핵심 비즈니스 로직 테스트

**대상**:
- 멀티테넌트 격리 로직 (`TenantContext`, `TenantFilterAspect`)
- JWT 토큰 생성/검증 (`JwtTokenProvider`)
- 문서 파싱 로직 (각 ParserService)

**예시**:
```java
@Test
void testTenantContextIsolation() {
    TenantContext.setCompanyId(1L);
    assertEquals(1L, TenantContext.getCompanyId());
    TenantContext.clear();
    assertNull(TenantContext.getCompanyId());
}
```

---

#### 2. Repository 계층 테스트

**대상**:
- 복잡한 쿼리 메서드 (`findLatestExportsForStatus`, `findForManagementList`)
- 멀티테넌트 필터링 검증

**예시**:
```java
@SpringBootTest
@Transactional
class ExportRepositoryTest {
    @Test
    void testFindLatestExportsForStatus() {
        // 테스트 데이터 생성
        // 쿼리 실행
        // 결과 검증
    }
}
```

---

#### 3. Service 계층 통합 테스트

**대상**:
- 문서 업로드 → 파싱 → 저장 플로우
- 차량 등록 → 말소 → 수출 플로우
- 비동기 처리 플로우

**예시**:
```java
@SpringBootTest
@Transactional
class DocumentServiceIntegrationTest {
    @Test
    void testDocumentUploadAndParse() {
        // 문서 업로드
        // 비동기 처리 대기
        // 결과 검증
    }
}
```

---

### 3.2 우선순위 Medium

#### 4. Controller 계층 테스트

**대상**:
- API 엔드포인트 동작 검증
- 인증/인가 검증
- 요청/응답 검증

**예시**:
```java
@WebMvcTest(AuthController.class)
class AuthControllerTest {
    @Test
    void testLogin() {
        // 로그인 요청
        // 응답 검증
    }
}
```

---

#### 5. 보안 테스트

**대상**:
- 멀티테넌트 격리 검증
- JWT 토큰 검증
- 권한 검증

**예시**:
```java
@Test
void testTenantIsolation() {
    // 테넌트 A 데이터 생성
    // 테넌트 B 컨텍스트에서 조회 시도
    // 데이터 접근 불가 검증
}
```

---

### 3.3 우선순위 Low

#### 6. 성능 테스트

**대상**:
- 문서 처리 성능
- 대량 데이터 조회 성능
- 동시성 처리 성능

---

#### 7. E2E 테스트

**대상**:
- 주요 비즈니스 플로우
- 사용자 시나리오

---

## 4. 테스트 도구 제안

### 4.1 단위 테스트

- **JUnit 5**: 기본 테스트 프레임워크
- **Mockito**: Mock 객체 생성
- **AssertJ**: Assertion 라이브러리

### 4.2 통합 테스트

- **Spring Boot Test**: `@SpringBootTest` 사용
- **Testcontainers**: DB 통합 테스트 (선택적)

### 4.3 테스트 커버리지

- **JaCoCo**: 코드 커버리지 측정
- **목표 커버리지**: 70% 이상 (핵심 비즈니스 로직)

---

## 5. 테스트 작성 가이드라인

### 5.1 테스트 구조

```java
@SpringBootTest
@Transactional
class ServiceTest {
    @Autowired
    private Service service;
    
    @Test
    void testMethodName_condition_expectedResult() {
        // Given: 테스트 데이터 준비
        
        // When: 테스트 실행
        
        // Then: 결과 검증
    }
}
```

### 5.2 테스트 네이밍

- `testMethodName_condition_expectedResult` 형식
- 예: `testLogin_validCredentials_returnsTokens()`

### 5.3 테스트 격리

- 각 테스트는 독립적으로 실행 가능해야 함
- `@Transactional`로 테스트 후 롤백
- 공유 상태 사용 지양

---

## 6. 멀티테넌트 테스트 전략

### 6.1 TenantContext 설정

```java
@Test
void testWithTenant() {
    TenantContext.setCompanyId(1L);
    try {
        // 테스트 실행
    } finally {
        TenantContext.clear();
    }
}
```

### 6.2 테넌트 격리 검증

```java
@Test
void testTenantIsolation() {
    // 테넌트 A 데이터 생성
    TenantContext.setCompanyId(1L);
    Vehicle vehicleA = vehicleRepository.save(...);
    
    // 테넌트 B 컨텍스트에서 조회 시도
    TenantContext.setCompanyId(2L);
    Optional<Vehicle> found = vehicleRepository.findById(vehicleA.getId());
    
    // 데이터 접근 불가 검증
    assertTrue(found.isEmpty());
}
```

---

## 7. 비동기 처리 테스트

### 7.1 이벤트 기반 테스트

```java
@Test
void testDocumentProcessing() {
    // 문서 업로드
    DocumentService.upload(...);
    
    // 이벤트 발행 대기
    await().atMost(10, SECONDS)
        .until(() -> documentRepository.findById(id)
            .map(d -> d.getStatus() == DocumentStatus.DONE)
            .orElse(false));
}
```

### 7.2 Mock 사용

```java
@Test
void testDocumentProcessingWithMock() {
    // UpstageService Mock
    when(upstageService.parseDocuments(...))
        .thenReturn(mockResponse);
    
    // 테스트 실행
    // 결과 검증
}
```

---

## 8. 테스트 데이터 관리

### 8.1 테스트 Fixture

```java
public class TestFixtures {
    public static Vehicle createVehicle(Long companyId) {
        return Vehicle.builder()
            .companyId(companyId)
            .chassisNo("TEST123")
            .build();
    }
}
```

### 8.2 테스트 DB

- H2 인메모리 DB 사용 (개발 환경)
- 또는 Testcontainers로 MySQL 사용 (통합 테스트)

---

## 9. 테스트 실행 전략

### 9.1 로컬 개발

- IDE에서 개별 테스트 실행
- `./gradlew test`로 전체 테스트 실행

### 9.2 CI/CD 통합

- PR 생성 시 자동 테스트 실행
- 테스트 실패 시 머지 차단

---

## 10. 결론

### 현재 상태

- 테스트 코드가 거의 없음
- MVP 단계에서 빠른 개발 우선
- 테스트는 향후 추가 예정

### 권장 사항

1. **단계적 도입**: 핵심 비즈니스 로직부터 테스트 작성
2. **커버리지 목표**: 70% 이상 (핵심 로직)
3. **자동화**: CI/CD에 테스트 통합
4. **리팩토링**: 기존 코드 리팩토링 시 테스트 추가

### 예상 효과

- 리팩토링 안정성 향상
- 버그 조기 발견
- 코드 품질 향상
- 개발자 자신감 향상

---

## 부록: 테스트 예시 코드

### 멀티테넌트 격리 테스트

```java
@SpringBootTest
@Transactional
class TenantIsolationTest {
    @Autowired
    private VehicleRepository vehicleRepository;
    
    @Test
    void testTenantIsolation() {
        // Given
        TenantContext.setCompanyId(1L);
        Vehicle vehicle1 = vehicleRepository.save(
            Vehicle.builder().chassisNo("TEST1").build()
        );
        
        TenantContext.setCompanyId(2L);
        Vehicle vehicle2 = vehicleRepository.save(
            Vehicle.builder().chassisNo("TEST2").build()
        );
        
        // When
        TenantContext.setCompanyId(1L);
        List<Vehicle> vehicles1 = vehicleRepository.findAll();
        
        TenantContext.setCompanyId(2L);
        List<Vehicle> vehicles2 = vehicleRepository.findAll();
        
        // Then
        assertEquals(1, vehicles1.size());
        assertEquals(1, vehicles2.size());
        assertNotEquals(vehicles1.get(0).getId(), vehicles2.get(0).getId());
    }
}
```

### JWT 토큰 테스트

```java
@SpringBootTest
class JwtTokenProviderTest {
    @Autowired
    private JwtTokenProvider jwtTokenProvider;
    
    @Test
    void testCreateAndValidateToken() {
        // Given
        User user = createTestUser();
        
        // When
        String token = jwtTokenProvider.createAccessToken(user);
        boolean isValid = jwtTokenProvider.validate(token);
        
        // Then
        assertTrue(isValid);
        Claims claims = jwtTokenProvider.getClaims(token);
        assertEquals(user.getLoginId(), claims.getSubject());
        assertEquals(user.getCompanyId(), claims.get("companyId"));
    }
}
```

---

이러한 테스트 전략을 단계적으로 도입하여 코드 품질과 안정성을 향상시키는 것을 권장합니다.
