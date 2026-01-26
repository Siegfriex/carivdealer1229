# 01. 프로젝트 구조 분석

## 1.1 프로젝트 메타데이터

### build.gradle 분석 (파일: `saas-back-v2/build.gradle`)

#### 기본 정보
- **Spring Boot 버전**: 3.5.9 (라인: 3)
- **Java 버전**: 17 (라인: 13)
- **Gradle 플러그인**: 
  - `org.springframework.boot` version 3.5.9
  - `io.spring.dependency-management` version 1.1.7

#### 주요 의존성 라이브러리

**Spring Framework:**
- `spring-boot-starter-data-jpa` (라인: 28) - Spring Data JPA
- `spring-boot-starter-security` (라인: 29) - Spring Security
- `spring-boot-starter-web` (라인: 30) - Spring Web MVC
- `spring-boot-starter-webflux` (라인: 41) - Spring WebFlux (비동기 처리)

**데이터베이스:**
- `h2` (라인: 35) - H2 Database (개발용)
- `mysql-connector-java:8.0.33` (라인: 66) - MySQL 커넥터

**인증/보안:**
- `jjwt-api:0.11.5` (라인: 51) - JWT API
- `jjwt-impl` (라인: 52) - JWT 구현체
- `jjwt-jackson` (라인: 53) - JWT Jackson 지원

**문서 처리:**
- `poi-ooxml:5.2.5` (라인: 46, 61) - Apache POI (Excel 처리)
- `pdfbox:2.0.31` (라인: 59) - Apache PDFBox (PDF 처리)
- `jsoup:1.17.2` (라인: 47) - JSoup (HTML 파싱)
- `playwright:1.42.0` (라인: 48) - Playwright (브라우저 자동화)

**외부 서비스:**
- `springdoc-openapi-starter-webmvc-ui:2.8.15` (라인: 56) - Swagger/OpenAPI
- `jackson-databind:2.15.2` (라인: 44) - JSON 처리
- `aws-sdk:s3:2.25.25` (라인: 63) - AWS S3 SDK
- `aws-sdk:auth` (라인: 64) - AWS 인증

**유틸리티:**
- `lombok` (라인: 32-33) - 코드 생성 라이브러리

---

## 1.2 메인 애플리케이션 클래스

### ExpApplication.java (파일: `src/main/java/cariv/exp/ExpApplication.java`)

```java
package cariv.exp;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class ExpApplication {

	public static void main(String[] args) {
		SpringApplication.run(ExpApplication.class, args);
	}

}
```

**분석:**
- **패키지**: `cariv.exp`
- **활성화된 어노테이션**:
  - `@SpringBootApplication` (라인: 7) - Spring Boot 자동 설정 활성화
  - `@EnableJpaAuditing` (라인: 8) - JPA Auditing 활성화 (생성일시, 수정일시 자동 관리)

---

## 1.3 디렉토리 구조 매핑

### 도메인 구조 (domain/)

총 **11개 도메인**:

1. **auction** (경매증)
   - controller: 0개
   - service: 2개 (AuctionService, AuctionParserService)
   - repository: 1개 (AuctionCertificateRepository)
   - entity: 1개 (AuctionCertificate)
   - dto: 3개

2. **base** (회사 기본정보)
   - controller: 1개 (BaseInfoController)
   - service: 1개 (BaseInfoService)
   - repository: 1개 (BaseInfoRepository)
   - entity: 2개 (BaseInfo, BaseInfoDocumentType)
   - dto: 3개

3. **document** (문서 관리)
   - controller: 1개 (DocumentController)
   - service: 7개 (DocumentService, DocumentAsyncProcessor, DocumentProcessEventListener, DocumentStatusTx, DocumentWorkTx, BaseInfoOcrService, BaseInfoOcrParserService)
   - repository: 1개 (DocumentRepository)
   - entity: 3개 (Documents, DocumentStatus, DocumentType)
   - dto: 4개

4. **export** (수출 증명서)
   - controller: 1개 (ExportController)
   - service: 2개 (ExportCertificateService, ExportParserService)
   - repository: 1개 (ExportRepository)
   - entity: 1개 (Export)
   - dto: 여러 개

5. **invoice** (세금계산서)
   - controller: 0개
   - service: 2개 (InvoiceService, InvoiceParserService)
   - repository: 1개 (TaxInvoiceRepository)
   - entity: 1개 (TaxInvoice)
   - dto: 3개

6. **login** (인증/인가)
   - controller: 2개 (AuthController, AdminUserController)
   - service: 2개 (AuthService, AdminUserService)
   - repository: 2개 (UserRepository, CompanyRepository)
   - entity: 3개 (User, Company, Role, InvoiceType)
   - dto: 9개

7. **malso** (말소 등록증)
   - controller: 1개 (MalsoController)
   - service: 3개 (DeRegistrationService, DeRegistrationParserService, DeRegistrationSummaryValidator)
   - repository: 1개 (DeRegistrationCertificateRepository)
   - entity: 1개 (DeRegistrationCertificate)
   - exception: 2개 (DeRegistrationExceptionHandler, InvalidDeRegistrationSummaryException)
   - dto: 6개

8. **registration** (등록증)
   - controller: 0개
   - service: 2개 (RegistrationService, RegistrationParserService)
   - repository: 1개 (RegistrationCertificateRepository)
   - entity: 2개 (RegistrationReCertificate, RegistrationInfo)
   - dto: 3개

9. **upstage** (OCR 서비스)
   - controller: 0개
   - service: 4개 (UpstageService, DocumentOrchestrationService, DocumentTypeDetector, UpstageCallGuard)
   - repository: 0개
   - dto: 5개

10. **vehicle** (차량 관리)
    - controller: 1개 (VehicleController)
    - service: 1개 (VehicleService)
    - repository: 1개 (VehicleRepository)
    - entity: 2개 (Vehicle, VehicleStage)
    - dto: 4개

11. **vehiclePurchase** (차량 구매)
    - controller: 0개
    - service: 0개
    - repository: 1개 (VehiclePurchaseRepository)
    - entity: 2개 (VehiclePurchase, VehiclePurchaseType)

### 전역 구조 (global/)

1. **aws** (AWS S3 연동)
   - AwsS3Config.java
   - S3Upload.java
   - S3ObjectReader.java

2. **common** (공통 엔티티)
   - BaseEntity.java - 생성일시, 수정일시 관리
   - TenantEntity.java - 멀티테넌트 지원 (companyId 필터링)

3. **config** (설정)
   - SecurityConfig.java - 보안 설정
   - SwaggerConfig.java - API 문서화 설정
   - AsyncConfig.java - 비동기 처리 설정
   - UpstageConfig.java - Upstage OCR 설정

4. **exception** (예외 처리)
   - ErrorCode.java - 에러 코드 열거형
   - CustomException.java - 커스텀 예외
   - GlobalExceptionHandler.java - 전역 예외 핸들러
   - ErrorResponse.java - 에러 응답 DTO

5. **jwt** (JWT 인증)
   - JwtTokenProvider.java - 토큰 생성/검증
   - JwtAuthenticationFilter.java - 인증 필터
   - RefreshTokenService.java - Refresh Token 관리
   - RefreshToken.java - Refresh Token 엔티티
   - RefreshTokenRepository.java

6. **print** (인쇄/출력)
   - controller: PrintController.java
   - generator: MalsoPrintService.java, MalsoXlsxGenerator.java 등
   - converter: LibreOfficeXlsxToPdfConverter.java
   - model: PrintItemResponse.java, PrintItemsResponse.java

7. **security** (보안)
   - CustomUserDetails.java - 사용자 인증 정보
   - CustomUserDetailsService.java - 사용자 정보 로드 서비스

8. **tenant** (멀티테넌트)
   - TenantContext.java - 테넌트 컨텍스트
   - TenantEntityListener.java - 엔티티 리스너
   - TenantFilterAspect.java - 필터 Aspect
   - TenantRepository.java

9. **init** (초기화)
   - DummyDataInitializer.java - 더미 데이터 초기화

---

## 1.4 파일 통계

### Controller 파일
- 총 **8개**:
  1. AuthController.java
  2. AdminUserController.java
  3. BaseInfoController.java
  4. DocumentController.java
  5. ExportController.java
  6. MalsoController.java
  7. VehicleController.java
  8. PrintController.java

### Service 파일
- 총 **22개**:
  - 도메인 Service: 10개
  - ParserService: 6개
  - 전역 Service: 6개

### Repository 파일
- 총 **13개**:
  1. AuctionCertificateRepository.java
  2. BaseInfoRepository.java
  3. DocumentRepository.java
  4. ExportRepository.java
  5. TaxInvoiceRepository.java
  6. DeRegistrationCertificateRepository.java
  7. RegistrationCertificateRepository.java
  8. VehicleRepository.java
  9. VehiclePurchaseRepository.java
  10. UserRepository.java
  11. CompanyRepository.java
  12. RefreshTokenRepository.java
  13. TenantRepository.java

### Entity 파일
- 공통 Entity: 2개 (BaseEntity, TenantEntity)
- 도메인별 Entity: 약 15개 이상
  - AuctionCertificate
  - BaseInfo
  - Documents
  - Export
  - TaxInvoice
  - DeRegistrationCertificate
  - RegistrationReCertificate
  - Vehicle
  - VehiclePurchase
  - User
  - Company
  - RefreshToken
  - 등

---

## 1.5 공통 엔티티 분석

### BaseEntity (파일: `global/common/BaseEntity.java`)

```java
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
@Getter
public abstract class BaseEntity {

    @CreatedDate
    @Column(updatable = false, nullable = false)
    private Instant createdAt;  // 라인: 20

    @LastModifiedDate
    @Column(nullable = false)
    private Instant updatedAt;  // 라인: 24

}
```

**분석:**
- **역할**: 생성일시, 수정일시 자동 관리
- **사용 위치**: Company 엔티티가 상속 (라인: 13)
- **JPA Auditing**: `@EnableJpaAuditing`로 활성화됨

### TenantEntity (파일: `global/common/TenantEntity.java`)

```java
@FilterDef(
        name = "tenantFilter",
        parameters = @ParamDef(name = "companyId", type = Long.class)
)
@Filter(name = "tenantFilter", condition = "company_id = :companyId")
@MappedSuperclass
@Getter
@EntityListeners(TenantEntityListener.class)
public abstract class TenantEntity extends BaseEntity {

    @Column(name = "company_id", nullable = false)
    protected Long companyId;  // 라인: 26

    public void setCompanyId(Long companyId) { this.companyId = companyId; }  // 라인: 28
}
```

**분석:**
- **역할**: 멀티테넌트 지원 (회사별 데이터 격리)
- **상속**: BaseEntity를 상속하여 생성일시, 수정일시도 관리
- **필터링**: Hibernate Filter로 `company_id` 기반 자동 필터링
- **사용 위치**: 대부분의 도메인 엔티티가 상속 (User, AuctionCertificate, BaseInfo 등)

---

## 1.6 아키텍처 특징

1. **멀티테넌트 아키텍처**: TenantEntity를 통한 회사별 데이터 격리
2. **도메인 주도 설계 (DDD)**: 도메인별로 패키지 분리
3. **계층형 아키텍처**: Controller → Service → Repository 구조
4. **문서 파싱 중심**: OCR을 통한 다양한 문서 타입 파싱 지원
5. **비동기 처리**: WebFlux 및 AsyncConfig를 통한 비동기 문서 처리
6. **외부 서비스 연동**: AWS S3 (파일 저장), Upstage (OCR)
