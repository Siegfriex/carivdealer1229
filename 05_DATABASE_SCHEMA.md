# 05. 데이터베이스 스키마 분석

## 5.1 공통 엔티티

### BaseEntity

**파일**: `src/main/java/cariv/exp/global/common/BaseEntity.java`

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
- **JPA Auditing**: `@EnableJpaAuditing`로 활성화됨
- **사용 위치**: Company, RefreshToken 엔티티가 상속

**필드:**
| 필드명 | 타입 | 제약조건 | 설명 | 라인 |
|--------|------|----------|------|------|
| createdAt | Instant | NOT NULL, updatable=false | 생성일시 | 20 |
| updatedAt | Instant | NOT NULL | 수정일시 | 24 |

---

### TenantEntity

**파일**: `src/main/java/cariv/exp/global/common/TenantEntity.java`

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
- **사용 위치**: 대부분의 도메인 엔티티가 상속

**필드:**
| 필드명 | 타입 | 제약조건 | 설명 | 라인 |
|--------|------|----------|------|------|
| companyId | Long | NOT NULL | 회사 ID (FK) | 26 |

**Hibernate Filter:**
- 필터명: `tenantFilter`
- 조건: `company_id = :companyId`
- 자동 적용: TenantEntityListener를 통해 자동 설정

---

## 5.2 도메인 엔티티 분석

### Company

**파일**: `src/main/java/cariv/exp/domain/login/entity/Company.java`

**기본 정보:**
- 테이블명: `company` (기본값)
- 상속: `BaseEntity`
- JPA Auditing: 활성화

**필드 분석:**

| 필드명 | 타입 | 제약조건 | 설명 | 라인 |
|--------|------|----------|------|------|
| id | Long | PK, AUTO | 회사 ID | 17 |
| name | String | length=100 | 회사명 | 20 |
| ownerName | String | length=100 | 대표자명 | 23 |

**관계 매핑:**
- 없음

---

### User

**파일**: `src/main/java/cariv/exp/domain/login/entity/User.java`

**기본 정보:**
- 테이블명: `users` (라인: 13)
- 상속: `TenantEntity`
- JPA Auditing: 활성화

**필드 분석:**

| 필드명 | 타입 | 제약조건 | 설명 | 라인 |
|--------|------|----------|------|------|
| id | Long | PK, AUTO | 사용자 ID | 18 |
| companyId | Long | NOT NULL | 회사 ID (TenantEntity) | - |
| loginId | String | NOT NULL, UNIQUE, length=100 | 로그인용 아이디 | 24 |
| email | String | length=100 | 이메일 | 27 |
| passwordHash | String | NOT NULL | 계정 비밀번호(Hash) | 30 |
| active | boolean | - | 활성화 여부 | 32 |
| role | Role | NOT NULL | 관리자 or 직원 | 36 |

**관계 매핑:**
- 없음 (주석 처리된 Company 관계 있음, 라인: 20-21)

**도메인 메서드:**
- `changePassword(String encodedPassword)` (라인: 39-41) - 비밀번호 변경
- `deactivate()` (라인: 44-46) - 계정 비활성화 (soft delete)

---

### AuctionCertificate

**파일**: `src/main/java/cariv/exp/domain/auction/entity/AuctionCertificate.java`

**기본 정보:**
- 테이블명: `auction_certificate` (기본값)
- 상속: `TenantEntity`
- JPA Auditing: 활성화

**필드 분석:**

| 필드명 | 타입 | 제약조건 | 설명 | 라인 |
|--------|------|----------|------|------|
| id | Long | PK, AUTO | 경매증 ID | 25 |
| companyId | Long | NOT NULL | 회사 ID (TenantEntity) | - |
| registrationNo | String | - | 등록번호 | 27 |
| chassisNo | String | - | 차대번호 | 28 |
| model | String | - | 모델명 | 29 |
| modelYear | Integer | - | 연식 | 30 |
| mileage | Long | - | 주행거리 | 31 |
| displacement | Integer | - | 배기량 | 32 |
| initialRegistrationDate | LocalDate | - | 최초등록일 | 33 |
| fuel | String | - | 연료 | 34 |
| color | String | - | 색상 | 35 |
| rawJson | String | @Lob | 원본 JSON | 38 |

**관계 매핑:**
- 없음

---

### BaseInfo

**파일**: `src/main/java/cariv/exp/domain/base/entity/BaseInfo.java`

**기본 정보:**
- 테이블명: `base_info` (기본값)
- 상속: `TenantEntity`
- JPA Auditing: 활성화

**필드 분석:**

| 필드명 | 타입 | 제약조건 | 설명 | 라인 |
|--------|------|----------|------|------|
| id | Long | PK, AUTO | 기본정보 ID | 21 |
| companyId | Long | NOT NULL | 회사 ID (TenantEntity) | - |
| name | String | NOT NULL, length=200 | 회사명 | 23 |
| number | String | length=50 | 전화번호 | 26 |
| businessRegistrationNumber | String | length=50 | 사업자등록번호 | 29 |
| businessAddress | String | length=500 | 사업장 주소 | 32 |
| exportCountryCodes | Set<String> | @ElementCollection | 수출 대상 국가 코드 | 45 |
| signS3Key | String | length=600 | 사인방 S3 Key | 48 |
| sealS3Key | String | length=600 | 인감 S3 Key | 51 |
| ceoIdS3Key | String | length=600 | 대표자 신분증 S3 Key | 54 |
| bizRegS3Key | String | length=600 | 사업자등록증 S3 Key | 57 |

**관계 매핑:**
- `@ElementCollection`: `exportCountryCodes` - 별도 테이블 `base_info_export_country`에 저장 (라인: 35-45)
  - 컬렉션 테이블: `base_info_export_country`
  - 조인 컬럼: `base_info_id`
  - 유니크 제약: `uk_base_info_export_country` (base_info_id, country_code)

**도메인 메서드:**
- `updateBaseInfo(...)` (라인: 59-71) - 기본정보 업데이트
- `updateDocuments(...)` (라인: 73-83) - 서류 S3 Key 업데이트
- `applyOcrData(...)` (라인: 85-98) - OCR 데이터 적용

---

### Documents

**파일**: `src/main/java/cariv/exp/domain/document/entity/Documents.java`

**기본 정보:**
- 테이블명: `documents` (기본값)
- 상속: `TenantEntity`
- JPA Auditing: 활성화

**필드 분석:**

| 필드명 | 타입 | 제약조건 | 설명 | 라인 |
|--------|------|----------|------|------|
| id | Long | PK, AUTO | 문서 ID | 17 |
| companyId | Long | NOT NULL | 회사 ID (TenantEntity) | - |
| fileName | String | - | 파일명 | 19 |
| s3Key | String | - | 업로드 파일 저장 위치 | 20 |
| sizeBytes | Long | - | 파일 크기 (바이트) | 21 |
| type | DocumentType | @Enumerated(STRING) | 문서 타입 (UNKNOWN 포함) | 24 |
| status | DocumentStatus | @Enumerated(STRING) | 문서 상태 (PROCESSING/DONE/FAILED) | 27 |
| relatedId | Long | - | 관련 엔티티 ID (예: 말소증 certId) | 29 |
| missingFieldsJson | String | @Lob | 누락 필드 JSON | 30 |
| errorMessage | String | @Lob | 에러 메시지 | 31 |

**관계 매핑:**
- 없음

**DocumentType 열거형:**
- EXPORT_CERTIFICATE (수출필증)
- DEREGISTRATION (말소증)
- REGISTRATION (자동차 등록증)
- AUCTION_CERTIFICATE (경락사실확인서)
- ID_CARD (신분증)
- INVOICE (세금계산서)
- CONTRACT (매매계약서)
- UNKNOWN (미분류)

**DocumentStatus 열거형:**
- PROCESSING (처리 중)
- DONE (완료)
- FAILED (실패)

---

### Vehicle

**파일**: `src/main/java/cariv/exp/domain/vehicle/entity/Vehicle.java`

**기본 정보:**
- 테이블명: `vehicle` (라인: 17)
- 상속: `TenantEntity`
- JPA Auditing: 활성화
- 유니크 제약: `uk_vehicle_company_chassis` (company_id, chassis_no) (라인: 19)
- 인덱스:
  - `idx_vehicle_company_regno` (company_id, registration_no) (라인: 22)
  - `idx_vehicle_company_stage` (company_id, stage) (라인: 23)

**필드 분석:**

| 필드명 | 타입 | 제약조건 | 설명 | 라인 |
|--------|------|----------|------|------|
| id | Long | PK, AUTO | 차량 ID | 30 |
| companyId | Long | NOT NULL | 회사 ID (TenantEntity) | - |
| chassisNo | String | NOT NULL, length=50 | 차대번호 (VIN) | 33 |
| registrationNo | String | length=50 | 등록번호 | 36 |
| stage | VehicleStage | NOT NULL, length=30 | 진행 단계 (기본값: REGISTERED_BY_DEALER) | 42 |
| vehicleType | String | - | 차종 | 45 |
| vehicleUse | String | - | 용도 | 46 |
| model | String | - | 모델명 | 47 |
| modelCode | String | - | 형식 및 제작연월 | 48 |
| engineType | String | - | 원동기형식 | 49 |
| ownerName | String | - | 소유자 이름 | 50 |
| ownerId | String | - | 생년월일 or 법인등록번호 | 51 |
| modelYear | Integer | - | 연식 | 52 |
| purchaseSource | String | - | 매입처 | 54 |
| mileage | Long | - | 주행거리 | 56 |
| transmission | String | - | 변속기 | 57 |
| fuel | String | - | 연료 | 58 |
| displacement | Integer | - | 배기량 | 59 |
| firstRegistrationDate | LocalDate | - | 최초등록일 | 60 |
| color | String | - | 색상 | 61 |
| exportDestinationCountry | String | - | 수출 목적국 | 62 |
| buyerName | String | - | 화주 이름 | 63 |
| saleAmount | Long | - | 판매 금액 | 64 |
| address | String | length=500 | 주소 | 67 |

**관계 매핑:**
- 없음 (다른 엔티티에서 Vehicle을 참조)

**도메인 메서드:**
- `changeStage(VehicleStage stage)` (라인: 69-71) - 단계 변경
- `applyRegistrationSnapshot(...)` (라인: 76-99) - 등록증 스냅샷 적용
- `updateManagement(...)` (라인: 105-139) - 차량관리 정보 업데이트

**VehicleStage 열거형:**
- REGISTERED_BY_DEALER (딜러 등록 완료)
- DEREG_IN_PROGRESS (말소 진행 중)
- DEREG_COMPLETED (말소 완료)
- LICENSE_COMPLETED (면허 완료)

---

### DeRegistrationCertificate

**파일**: `src/main/java/cariv/exp/domain/malso/entity/DeRegistrationCertificate.java`

**기본 정보:**
- 테이블명: `de_registration_certificate` (기본값)
- 상속: `TenantEntity`
- JPA Auditing: 활성화

**필드 분석:**

| 필드명 | 타입 | 제약조건 | 설명 | 라인 |
|--------|------|----------|------|------|
| id | Long | PK, AUTO | 말소등록증 ID | 22 |
| companyId | Long | NOT NULL | 회사 ID (TenantEntity) | - |
| documentNo | String | - | 문서번호 | 24 |
| specNo | String | - | 제원관리번호 | 26 |
| registrationNo | String | - | 자동차등록번호 | 27 |
| vehicleType | String | - | 차종 | 29 |
| mileage | String | - | 주행거리 | 30 |
| model | String | - | 차명 | 31 |
| chassisNo | String | - | 차대번호 | 33 |
| engineType | String | - | 원동기형식 | 35 |
| modelYear | Integer | - | 모델연도 | 37 |
| vehicleUse | String | - | 용도 | 39 |
| initialRegistrationDate | LocalDate | - | 최초등록일 | 41 |
| deRegistrationDate | LocalDate | - | 말소등록일 | 43 |
| deRegistrationReason | String | - | 말소등록 구분 | 45 |
| certificateUse | String | - | 증명서 용도 | 47 |
| ownerName | String | - | 소유자 성명 | 49 |
| ownerBirthOrRegNo | String | - | 생년월일 or 법인등록번호 | 51 |
| rightsRelation | String | - | 권리관계 여부 (압류/저당 등) | 53 |
| businessUsagePeriod | String | - | 사업용 사용기간 | 55 |
| exportOrderId | Long | - | 수출오더 ID | 65 |

**관계 매핑:**
- `@ManyToOne BaseInfo baseInfo` (라인: 57) - LAZY 로딩
- `@OneToOne Vehicle vehicle` (라인: 59-61) - LAZY 로딩, NOT NULL, FK: vehicle_id

**도메인 메서드:**
- `updateDeRegistrationDate(LocalDate deRegistrationDate)` (라인: 67-71) - 말소등록일 업데이트

---

### RegistrationReCertificate

**파일**: `src/main/java/cariv/exp/domain/registration/entity/RegistrationReCertificate.java`

**기본 정보:**
- 테이블명: `registration_re_certificate` (기본값)
- 상속: `TenantEntity`
- JPA Auditing: 활성화

**필드 분석:**

| 필드명 | 타입 | 제약조건 | 설명 | 라인 |
|--------|------|----------|------|------|
| id | Long | PK, AUTO | 등록증 ID | 21 |
| companyId | Long | NOT NULL | 회사 ID (TenantEntity) | - |
| registrationNo | String | - | 자동차등록번호 | 24 |
| vehicleType | String | - | 차종 | 27 |
| vehicleUse | String | - | 용도 | 30 |
| model | String | - | 차명 | 33 |
| modelCode | String | - | 형식 및 제작연월 | 36 |
| modelYear | LocalDate | - | 제작연월 | 37 |
| chassisNo | String | - | 차대번호 | 40 |
| engineType | String | - | 원동기형식 | 43 |
| ownerName | String | - | 소유자 이름 | 46 |
| ownerId | String | - | 생년월일 or 법인등록번호 | 49 |
| address | String | length=500 | 사용본거지 | 53 |
| lengthVal | String | - | 길이 | 56 |
| widthVal | String | - | 너비 | 57 |
| heightVal | String | - | 높이 | 58 |
| weight | String | - | 총중량 | 59 |
| seating | String | - | 승차정원 | 60 |
| displacement | String | - | 배기량 | 61 |
| maxLoad | String | - | 최대적재량 | 62 |
| power | String | - | 정격출력 | 63 |
| rawJson | String | @Lob | OCR 원본 JSON | 71 |

**관계 매핑:**
- `@ManyToOne Vehicle vehicle` (라인: 66-68) - LAZY 로딩, FK: vehicle_id

---

### Export

**파일**: `src/main/java/cariv/exp/domain/export/entity/Export.java`

**기본 정보:**
- 테이블명: `export` (기본값)
- 상속: `TenantEntity`
- JPA Auditing: 활성화
- 인덱스:
  - `idx_export_decl_company_vehicle` (company_id, vehicle_id) (라인: 18)
  - `idx_export_decl_company_declno` (company_id, declaration_no) (라인: 19)
  - `idx_export_decl_company_vin` (company_id, chassis_no) (라인: 20)

**필드 분석:**

| 필드명 | 타입 | 제약조건 | 설명 | 라인 |
|--------|------|----------|------|------|
| id | Long | PK, AUTO | 수출 증명서 ID | 27 |
| companyId | Long | NOT NULL | 회사 ID (TenantEntity) | - |
| vehicle | Vehicle | @ManyToOne, NOT NULL | 연결 차량 | 32 |
| declarationNo | String | length=50 | 신고번호 | 36 |
| declarationDate | LocalDate | length=20 | 신고일자 | 41 |
| acceptanceDate | LocalDate | length=20 | 신고수리일자 | 45 |
| issueNo | String | length=30 | 발행번호 | 51 |
| destCountryCode | String | length=10 | 목적국 코드 | 55 |
| destCountryName | String | length=50 | 목적국 이름 | 58 |
| loadingPortCode | String | length=20 | 적재항 코드 | 62 |
| loadingPortName | String | length=50 | 적재항 이름 | 65 |
| containerNo | String | length=30 | 컨테이너 번호 | 69 |
| itemName | String | length=100 | 거래품명(차명) | 73 |
| modelYear | String | length=10 | 연식 | 77 |
| chassisNo | String | length=50 | VIN(차대번호) | 81 |
| amountKrw | Long | - | 신고금액(KRW) | 84 |
| loadingDeadline | LocalDate | length=20 | 적재의무기한 | 88 |
| buyerName | String | length=100 | 바이어명(구매자) | 92 |

**관계 매핑:**
- `@ManyToOne Vehicle vehicle` (라인: 30-32) - LAZY 로딩, NOT NULL, FK: vehicle_id

---

### TaxInvoice

**파일**: `src/main/java/cariv/exp/domain/invoice/entity/TaxInvoice.java`

**기본 정보:**
- 테이블명: `tax_invoice` (기본값)
- 상속: `TenantEntity`
- JPA Auditing: 활성화

**필드 분석:**

| 필드명 | 타입 | 제약조건 | 설명 | 라인 |
|--------|------|----------|------|------|
| id | Long | PK, AUTO | 세금계산서 ID | 23 |
| companyId | Long | NOT NULL | 회사 ID (TenantEntity) | - |
| registrationNo | String | - | 차량번호 | 25 |
| totalAmount | Long | - | 합계금액 | 26 |
| rawJson | String | @Lob | 원본 JSON | 29 |

**관계 매핑:**
- 없음

---

### VehiclePurchase

**파일**: `src/main/java/cariv/exp/domain/vehiclePurchase/entity/VehiclePurchase.java`

**기본 정보:**
- 테이블명: `vehicle_purchase` (기본값)
- 상속: `TenantEntity`
- JPA Auditing: 활성화

**필드 분석:**

| 필드명 | 타입 | 제약조건 | 설명 | 라인 |
|--------|------|----------|------|------|
| id | Long | PK, AUTO | 차량 구매 ID | 19 |
| companyId | Long | NOT NULL | 회사 ID (TenantEntity) | - |
| vehicle | Vehicle | @OneToOne, NOT NULL | 차량 | 22 |
| purchaseAmount | Long | - | 매입 금액(차값) | 25 |
| totalPurchaseAmount | Long | - | 전체 매입금액(총액) | 28 |
| purchaseCompanyName | String | - | 매입처명 | 31 |
| purchaseDate | LocalDate | - | 매입일 | 34 |
| purchaseType | VehiclePurchaseType | @Enumerated(STRING), length=30 | 매입처 유형 | 39 |

**관계 매핑:**
- `@OneToOne Vehicle vehicle` (라인: 20-22) - LAZY 로딩, NOT NULL, FK: vehicle_id

**도메인 메서드:**
- `update(...)` (라인: 41-53) - 구매 정보 업데이트

**VehiclePurchaseType 열거형:**
- INDIVIDUAL (개인)
- DEALER_SOLE_PROPRIETOR (매매상사-개인사업자)
- DEALER_CORPORATION (매매상사-법인사업자)
- CORPORATE (법인사업자)

---

### RefreshToken

**파일**: `src/main/java/cariv/exp/global/jwt/entity/RefreshToken.java`

**기본 정보:**
- 테이블명: `refresh_token` (기본값)
- 상속: `BaseEntity`
- JPA Auditing: 활성화

**필드 분석:**

| 필드명 | 타입 | 제약조건 | 설명 | 라인 |
|--------|------|----------|------|------|
| id | Long | PK, AUTO | Refresh Token ID | 19 |
| tokenHash | String | NOT NULL, UNIQUE, length=64 | 토큰 해시값 | 22 |
| user | User | @ManyToOne, LAZY | 사용자 | 25 |
| expiresAt | LocalDateTime | NOT NULL | 만료 시간 | 28 |
| revoked | boolean | NOT NULL | 폐기 여부 | 31 |

**관계 매핑:**
- `@ManyToOne User user` (라인: 24-25) - LAZY 로딩

---

## 5.3 Repository 인터페이스 분석

### TenantRepository

**파일**: `src/main/java/cariv/exp/global/tenant/repository/TenantRepository.java`

**기본 정보:**
- 상속: `JpaRepository<T, ID>`
- 커스텀 쿼리 메서드: 2개

**쿼리 메서드 목록:**

#### findAllByTenant (라인: 12-15)
```java
default List<T> findAllByTenant() {
    Long companyId = TenantContext.getCompanyId();
    return findAllByCompanyId(companyId);
}
```

**분석:**
- 반환 타입: `List<T>`
- 쿼리 생성 방식: 기본 메서드 (default method)
- 실제 동작: TenantContext에서 companyId를 가져와 `findAllByCompanyId()` 호출
- 사용 케이스: 현재 테넌트의 모든 엔티티 조회

#### findAllByCompanyId (라인: 17)
```java
List<T> findAllByCompanyId(Long companyId);
```

**분석:**
- 반환 타입: `List<T>`
- 쿼리 생성 방식: Spring Data JPA 메서드명 기반
- 실제 생성 쿼리 (예상):
  ```sql
  SELECT * FROM [table] WHERE company_id = :companyId
  ```
- 사용 케이스: 특정 회사의 모든 엔티티 조회

---

### DocumentRepository

**파일**: `src/main/java/cariv/exp/domain/document/repository/DocumentRepository.java`

**기본 정보:**
- 상속: `TenantRepository<Documents, Long>`
- 커스텀 쿼리 메서드: 3개

**쿼리 메서드 목록:**

#### findByCompanyIdOrderByCreatedAtDesc (라인: 12)
```java
List<Documents> findByCompanyIdOrderByCreatedAtDesc(Long companyId, Pageable pageable);
```

**분석:**
- 반환 타입: `List<Documents>`
- 쿼리 생성 방식: Spring Data JPA 메서드명 기반
- 실제 생성 쿼리 (예상):
  ```sql
  SELECT * FROM documents 
  WHERE company_id = :companyId 
  ORDER BY created_at DESC 
  LIMIT :size OFFSET :offset
  ```
- 사용 위치: `DocumentService.list()` (라인: 89)

#### findByCompanyIdAndStatusOrderByCreatedAtDesc (라인: 14)
```java
List<Documents> findByCompanyIdAndStatusOrderByCreatedAtDesc(Long companyId, DocumentStatus status, Pageable pageable);
```

**분석:**
- 반환 타입: `List<Documents>`
- 쿼리 생성 방식: Spring Data JPA 메서드명 기반
- 실제 생성 쿼리 (예상):
  ```sql
  SELECT * FROM documents 
  WHERE company_id = :companyId AND status = :status 
  ORDER BY created_at DESC 
  LIMIT :size OFFSET :offset
  ```
- 사용 위치: `DocumentService.list()` (라인: 90)

#### findByIdAndCompanyId (라인: 17)
```java
Optional<Documents> findByIdAndCompanyId(Long id, Long companyId);
```

**분석:**
- 반환 타입: `Optional<Documents>`
- 쿼리 생성 방식: Spring Data JPA 메서드명 기반
- 실제 생성 쿼리 (예상):
  ```sql
  SELECT * FROM documents 
  WHERE id = :id AND company_id = :companyId
  ```
- 사용 위치: `DocumentService.getDetail()` (라인: 112)

---

### VehicleRepository

**파일**: `src/main/java/cariv/exp/domain/vehicle/repository/VehicleRepository.java`

**기본 정보:**
- 상속: `JpaRepository<Vehicle, Long>`
- 커스텀 쿼리 메서드: 6개

**쿼리 메서드 목록:**

#### findByCompanyIdAndChassisNo (라인: 16)
```java
Optional<Vehicle> findByCompanyIdAndChassisNo(Long companyId, String chassisNo);
```

**분석:**
- 반환 타입: `Optional<Vehicle>`
- 쿼리 생성 방식: Spring Data JPA 메서드명 기반
- 실제 생성 쿼리 (예상):
  ```sql
  SELECT * FROM vehicle 
  WHERE company_id = :companyId AND chassis_no = :chassisNo
  ```
- 사용 위치: `VehicleService.upsertFromRegistration()` (라인: 55), `DeRegistrationService.handleUpload()` (라인: 69)

#### findByIdAndCompanyId (라인: 17)
```java
Optional<Vehicle> findByIdAndCompanyId(Long id, Long companyId);
```

**분석:**
- 반환 타입: `Optional<Vehicle>`
- 쿼리 생성 방식: Spring Data JPA 메서드명 기반
- 실제 생성 쿼리 (예상):
  ```sql
  SELECT * FROM vehicle 
  WHERE id = :id AND company_id = :companyId
  ```
- 사용 위치: `VehicleService.getManagement()` (라인: 165), `VehicleService.update()` (라인: 92)

#### findByCompanyIdAndIdIn (라인: 18)
```java
List<Vehicle> findByCompanyIdAndIdIn(Long companyId, List<Long> ids);
```

**분석:**
- 반환 타입: `List<Vehicle>`
- 쿼리 생성 방식: Spring Data JPA 메서드명 기반
- 실제 생성 쿼리 (예상):
  ```sql
  SELECT * FROM vehicle 
  WHERE company_id = :companyId AND id IN (:ids)
  ```

#### findForManagementList (라인: 46-51)
```java
@Query("""
    select v
    from Vehicle v
    where v.companyId = :companyId
      and (:stage is null or v.stage = :stage)
      and (:fromTs is null or v.createdAt >= :fromTs)
      and (:toTs   is null or v.createdAt <  :toTs)
    order by v.createdAt desc, v.id desc
""")
List<Vehicle> findForManagementList(
        @Param("companyId") Long companyId,
        @Param("stage") VehicleStage stage,
        @Param("fromTs") Instant fromTs,
        @Param("toTs") Instant toTs
);
```

**분석:**
- 반환 타입: `List<Vehicle>`
- 쿼리 생성 방식: `@Query` (JPQL)
- 실제 생성 쿼리 (예상):
  ```sql
  SELECT * FROM vehicle 
  WHERE company_id = :companyId 
    AND (:stage IS NULL OR stage = :stage)
    AND (:fromTs IS NULL OR created_at >= :fromTs)
    AND (:toTs IS NULL OR created_at < :toTs)
  ORDER BY created_at DESC, id DESC
  ```
- 사용 위치: `VehicleService.listManagement()` (라인: 237), `VehicleService.listManagementKeywords()` (라인: 351)

#### findMalsoPending (라인: 82-87)
```java
@Query("""
    select v
    from Vehicle v
    where v.companyId = :companyId
      and (:stage is null or v.stage = :stage)
      and (:fromTs is null or v.createdAt >= :fromTs)
      and (:toTs   is null or v.createdAt <  :toTs)
      and not exists (
          select 1
          from DeRegistrationCertificate d
          where d.companyId = :companyId
            and d.vehicle = v
      )
    order by v.createdAt desc
""")
List<Vehicle> findMalsoPending(
        @Param("companyId") Long companyId,
        @Param("stage") VehicleStage stage,
        @Param("fromTs") Instant fromTs,
        @Param("toTs") Instant toTs
);
```

**분석:**
- 반환 타입: `List<Vehicle>`
- 쿼리 생성 방식: `@Query` (JPQL)
- 실제 생성 쿼리 (예상):
  ```sql
  SELECT * FROM vehicle v
  WHERE v.company_id = :companyId 
    AND (:stage IS NULL OR v.stage = :stage)
    AND (:fromTs IS NULL OR v.created_at >= :fromTs)
    AND (:toTs IS NULL OR v.created_at < :toTs)
    AND NOT EXISTS (
        SELECT 1 FROM de_registration_certificate d
        WHERE d.company_id = :companyId AND d.vehicle_id = v.id
    )
  ORDER BY v.created_at DESC
  ```
- 사용 위치: `DeRegistrationService.listPending()` (라인: 150)

#### findForStageStatusList (라인: 97-102)
```java
@Query("""
    select v
    from Vehicle v
    where v.companyId = :companyId
      and (:stage is null or v.stage = :stage)
      and (:fromTs is null or v.createdAt >= :fromTs)
      and (:toTs   is null or v.createdAt <  :toTs)
    order by v.createdAt desc
""")
List<Vehicle> findForStageStatusList(
        @Param("companyId") Long companyId,
        @Param("stage") VehicleStage stage,
        @Param("fromTs") Instant fromTs,
        @Param("toTs") Instant toTs
);
```

**분석:**
- 반환 타입: `List<Vehicle>`
- 쿼리 생성 방식: `@Query` (JPQL)
- 실제 생성 쿼리 (예상):
  ```sql
  SELECT * FROM vehicle 
  WHERE company_id = :companyId 
    AND (:stage IS NULL OR stage = :stage)
    AND (:fromTs IS NULL OR created_at >= :fromTs)
    AND (:toTs IS NULL OR created_at < :toTs)
  ORDER BY created_at DESC
  ```
- 사용 위치: `ExportCertificateService.list()` (라인: 94)

---

### UserRepository

**파일**: `src/main/java/cariv/exp/domain/login/repository/UserRepository.java`

**기본 정보:**
- 상속: `JpaRepository<User, Long>`
- 커스텀 쿼리 메서드: 3개

**쿼리 메서드 목록:**

#### findByLoginId (라인: 12)
```java
Optional<User> findByLoginId(String loginId);
```

**분석:**
- 반환 타입: `Optional<User>`
- 쿼리 생성 방식: Spring Data JPA 메서드명 기반
- 실제 생성 쿼리 (예상):
  ```sql
  SELECT * FROM users WHERE login_id = :loginId
  ```
- 사용 위치: `AuthService.login()` (라인: 55)

#### existsByLoginId (라인: 13)
```java
boolean existsByLoginId(String loginId);
```

**분석:**
- 반환 타입: `boolean`
- 쿼리 생성 방식: Spring Data JPA 메서드명 기반
- 실제 생성 쿼리 (예상):
  ```sql
  SELECT COUNT(*) > 0 FROM users WHERE login_id = :loginId
  ```
- 사용 위치: `AuthService.signup()` (라인: 37)

#### findAllByCompanyIdAndRole (라인: 14)
```java
List<User> findAllByCompanyIdAndRole(Long companyId, Role role);
```

**분석:**
- 반환 타입: `List<User>`
- 쿼리 생성 방식: Spring Data JPA 메서드명 기반
- 실제 생성 쿼리 (예상):
  ```sql
  SELECT * FROM users 
  WHERE company_id = :companyId AND role = :role
  ```
- 사용 위치: `AdminUserService.getStaffList()` (라인: 148-149), `AdminUserService.getMyPage()` (라인: 168-169)

---

### DeRegistrationCertificateRepository

**파일**: `src/main/java/cariv/exp/domain/malso/repository/DeRegistrationCertificateRepository.java`

**기본 정보:**
- 상속: `TenantRepository<DeRegistrationCertificate, Long>`
- 커스텀 쿼리 메서드: 4개

**쿼리 메서드 목록:**

#### findByCompanyIdAndVehicleId (라인: 12)
```java
Optional<DeRegistrationCertificate> findByCompanyIdAndVehicleId(Long companyId, Long vehicleId);
```

**분석:**
- 반환 타입: `Optional<DeRegistrationCertificate>`
- 쿼리 생성 방식: Spring Data JPA 메서드명 기반
- 실제 생성 쿼리 (예상):
  ```sql
  SELECT * FROM de_registration_certificate 
  WHERE company_id = :companyId AND vehicle_id = :vehicleId
  ```

#### findTop1ByCompanyIdAndVehicleIdOrderByIdDesc (라인: 13)
```java
Optional<DeRegistrationCertificate> findTop1ByCompanyIdAndVehicleIdOrderByIdDesc(Long companyId, Long vehicleId);
```

**분석:**
- 반환 타입: `Optional<DeRegistrationCertificate>`
- 쿼리 생성 방식: Spring Data JPA 메서드명 기반
- 실제 생성 쿼리 (예상):
  ```sql
  SELECT * FROM de_registration_certificate 
  WHERE company_id = :companyId AND vehicle_id = :vehicleId 
  ORDER BY id DESC 
  LIMIT 1
  ```
- 사용 위치: `VehicleService.getManagement()` (라인: 172-174), `VehicleService.update()` (라인: 137-145)

#### findByIdAndCompanyId (라인: 14)
```java
Optional<DeRegistrationCertificate> findByIdAndCompanyId(Long id, Long companyId);
```

**분석:**
- 반환 타입: `Optional<DeRegistrationCertificate>`
- 쿼리 생성 방식: Spring Data JPA 메서드명 기반
- 실제 생성 쿼리 (예상):
  ```sql
  SELECT * FROM de_registration_certificate 
  WHERE id = :id AND company_id = :companyId
  ```
- 사용 위치: `DocumentService.getDetail()` (라인: 175)

#### findLatestByCompanyIdAndVehicleIdIn (라인: 29-32)
```java
@Query("""
    select d
    from DeRegistrationCertificate d
    where d.companyId = :companyId
      and d.vehicle.id in :vehicleIds
      and d.id in (
          select max(d2.id)
          from DeRegistrationCertificate d2
          where d2.companyId = :companyId
            and d2.vehicle.id in :vehicleIds
          group by d2.vehicle.id
      )
""")
List<DeRegistrationCertificate> findLatestByCompanyIdAndVehicleIdIn(
        @Param("companyId") Long companyId,
        @Param("vehicleIds") List<Long> vehicleIds
);
```

**분석:**
- 반환 타입: `List<DeRegistrationCertificate>`
- 쿼리 생성 방식: `@Query` (JPQL)
- 실제 생성 쿼리 (예상):
  ```sql
  SELECT * FROM de_registration_certificate d
  WHERE d.company_id = :companyId 
    AND d.vehicle_id IN (:vehicleIds)
    AND d.id IN (
        SELECT MAX(d2.id) 
        FROM de_registration_certificate d2
        WHERE d2.company_id = :companyId 
          AND d2.vehicle_id IN (:vehicleIds)
        GROUP BY d2.vehicle_id
    )
  ```
- 사용 위치: `VehicleService.listManagement()` (라인: 249-251)

---

### ExportRepository

**파일**: `src/main/java/cariv/exp/domain/export/repository/ExportRepository.java`

**기본 정보:**
- 상속: `JpaRepository<Export, Long>`
- 커스텀 쿼리 메서드: 5개

**쿼리 메서드 목록:**

#### findTop1ByCompanyIdAndVehicleIdOrderByIdDesc (라인: 15)
```java
Optional<Export> findTop1ByCompanyIdAndVehicleIdOrderByIdDesc(Long companyId, Long vehicleId);
```

**분석:**
- 반환 타입: `Optional<Export>`
- 쿼리 생성 방식: Spring Data JPA 메서드명 기반
- 실제 생성 쿼리 (예상):
  ```sql
  SELECT * FROM export 
  WHERE company_id = :companyId AND vehicle_id = :vehicleId 
  ORDER BY id DESC 
  LIMIT 1
  ```

#### findByIdAndCompanyId (라인: 16)
```java
Optional<Export> findByIdAndCompanyId(Long id, Long companyId);
```

**분석:**
- 반환 타입: `Optional<Export>`
- 쿼리 생성 방식: Spring Data JPA 메서드명 기반
- 실제 생성 쿼리 (예상):
  ```sql
  SELECT * FROM export 
  WHERE id = :id AND company_id = :companyId
  ```
- 사용 위치: `DocumentService.getDetail()` (라인: 159)

#### findLatestByCompanyIdAndVehicleIdIn (라인: 31-34)
```java
@Query("""
    select e
    from Export e
    where e.companyId = :companyId
      and e.vehicle.id in :vehicleIds
      and e.id in (
          select max(e2.id)
          from Export e2
          where e2.companyId = :companyId
            and e2.vehicle.id in :vehicleIds
          group by e2.vehicle.id
      )
""")
List<Export> findLatestByCompanyIdAndVehicleIdIn(
        @Param("companyId") Long companyId,
        @Param("vehicleIds") List<Long> vehicleIds
);
```

**분석:**
- 반환 타입: `List<Export>`
- 쿼리 생성 방식: `@Query` (JPQL)
- 실제 생성 쿼리 (예상):
  ```sql
  SELECT * FROM export e
  WHERE e.company_id = :companyId 
    AND e.vehicle_id IN (:vehicleIds)
    AND e.id IN (
        SELECT MAX(e2.id) 
        FROM export e2
        WHERE e2.company_id = :companyId 
          AND e2.vehicle_id IN (:vehicleIds)
        GROUP BY e2.vehicle_id
    )
  ```

#### findVehicleIdsByLatestExportFilters (라인: 49-54)
```java
@Query("""
    select e.vehicle.id
    from Export e
    where e.companyId = :companyId
      and e.id in (
          select max(e2.id)
          from Export e2
          where e2.companyId = :companyId
          group by e2.vehicle.id
      )
      and (:buyerName is null or e.buyerName like concat('%', :buyerName, '%'))
      and (:from is null or e.acceptanceDate >= :from)
      and (:to   is null or e.acceptanceDate <  :to)
""")
List<Long> findVehicleIdsByLatestExportFilters(
        @Param("companyId") Long companyId,
        @Param("buyerName") String buyerName,
        @Param("from") LocalDate from,
        @Param("to") LocalDate to
);
```

**분석:**
- 반환 타입: `List<Long>` (Vehicle ID 목록)
- 쿼리 생성 방식: `@Query` (JPQL)
- 실제 생성 쿼리 (예상):
  ```sql
  SELECT e.vehicle_id FROM export e
  WHERE e.company_id = :companyId 
    AND e.id IN (
        SELECT MAX(e2.id) 
        FROM export e2
        WHERE e2.company_id = :companyId
        GROUP BY e2.vehicle_id
    )
    AND (:buyerName IS NULL OR e.buyer_name LIKE CONCAT('%', :buyerName, '%'))
    AND (:from IS NULL OR e.acceptance_date >= :from)
    AND (:to IS NULL OR e.acceptance_date < :to)
  ```

#### findLatestExportsForStatus (라인: 72-78)
```java
@Query("""
    select e
    from Export e
    join fetch e.vehicle v
    where e.companyId = :companyId
      and v.stage = :stage
      and e.id in (
          select max(e2.id)
          from Export e2
          where e2.companyId = :companyId
          group by e2.vehicle.id
      )
      and (:buyerName is null or e.buyerName like concat('%', :buyerName, '%'))
      and (:from is null or e.acceptanceDate >= :from)
      and (:toExclusive is null or e.acceptanceDate < :toExclusive)
    order by v.createdAt desc
""")
List<Export> findLatestExportsForStatus(
        @Param("companyId") Long companyId,
        @Param("stage") VehicleStage stage,
        @Param("buyerName") String buyerName,
        @Param("from") LocalDate from,
        @Param("toExclusive") LocalDate toExclusive
);
```

**분석:**
- 반환 타입: `List<Export>`
- 쿼리 생성 방식: `@Query` (JPQL) with `join fetch`
- 실제 생성 쿼리 (예상):
  ```sql
  SELECT e.*, v.* FROM export e
  INNER JOIN vehicle v ON e.vehicle_id = v.id
  WHERE e.company_id = :companyId 
    AND v.stage = :stage
    AND e.id IN (
        SELECT MAX(e2.id) 
        FROM export e2
        WHERE e2.company_id = :companyId
        GROUP BY e2.vehicle_id
    )
    AND (:buyerName IS NULL OR e.buyer_name LIKE CONCAT('%', :buyerName, '%'))
    AND (:from IS NULL OR e.acceptance_date >= :from)
    AND (:toExclusive IS NULL OR e.acceptance_date < :toExclusive)
  ORDER BY v.created_at DESC
  ```
- 사용 위치: `ExportCertificateService.list()` (라인: 94)

---

### BaseInfoRepository

**파일**: `src/main/java/cariv/exp/domain/base/repository/BaseInfoRepository.java`

**기본 정보:**
- 상속: `JpaRepository<BaseInfo, Long>`
- 커스텀 쿼리 메서드: 1개

**쿼리 메서드 목록:**

#### findByCompanyId (라인: 9)
```java
Optional<BaseInfo> findByCompanyId(Long companyId);
```

**분석:**
- 반환 타입: `Optional<BaseInfo>`
- 쿼리 생성 방식: Spring Data JPA 메서드명 기반
- 실제 생성 쿼리 (예상):
  ```sql
  SELECT * FROM base_info WHERE company_id = :companyId
  ```
- 사용 위치: `BaseInfoService.get()` (라인: 36), `BaseInfoService.upsert()` (라인: 43), `VehicleService.getManagement()` (라인: 176-178)

---

### VehiclePurchaseRepository

**파일**: `src/main/java/cariv/exp/domain/vehiclePurchase/repository/VehiclePurchaseRepository.java`

**기본 정보:**
- 상속: `JpaRepository<VehiclePurchase, Long>`
- 커스텀 쿼리 메서드: 2개

**쿼리 메서드 목록:**

#### findByCompanyIdAndVehicleId (라인: 11)
```java
Optional<VehiclePurchase> findByCompanyIdAndVehicleId(Long companyId, Long vehicleId);
```

**분석:**
- 반환 타입: `Optional<VehiclePurchase>`
- 쿼리 생성 방식: Spring Data JPA 메서드명 기반
- 실제 생성 쿼리 (예상):
  ```sql
  SELECT * FROM vehicle_purchase 
  WHERE company_id = :companyId AND vehicle_id = :vehicleId
  ```
- 사용 위치: `VehicleService.getManagement()` (라인: 168-170), `VehicleService.update()` (라인: 116-124)

#### findByCompanyIdAndVehicleIdIn (라인: 13)
```java
List<VehiclePurchase> findByCompanyIdAndVehicleIdIn(Long companyId, List<Long> vehicleIds);
```

**분석:**
- 반환 타입: `List<VehiclePurchase>`
- 쿼리 생성 방식: Spring Data JPA 메서드명 기반
- 실제 생성 쿼리 (예상):
  ```sql
  SELECT * FROM vehicle_purchase 
  WHERE company_id = :companyId AND vehicle_id IN (:vehicleIds)
  ```
- 사용 위치: `VehicleService.listManagement()` (라인: 244-246), `VehicleService.listManagementKeywords()` (라인: 357)

---

### RefreshTokenRepository

**파일**: `src/main/java/cariv/exp/global/jwt/repository/RefreshTokenRepository.java`

**기본 정보:**
- 상속: `JpaRepository<RefreshToken, Long>`
- 커스텀 쿼리 메서드: 1개

**쿼리 메서드 목록:**

#### findByTokenHashAndRevokedFalse (라인: 9)
```java
Optional<RefreshToken> findByTokenHashAndRevokedFalse(String tokenHash);
```

**분석:**
- 반환 타입: `Optional<RefreshToken>`
- 쿼리 생성 방식: Spring Data JPA 메서드명 기반
- 실제 생성 쿼리 (예상):
  ```sql
  SELECT * FROM refresh_token 
  WHERE token_hash = :tokenHash AND revoked = false
  ```
- 사용 위치: `RefreshTokenService.validateRefreshToken()` (추정)

---

### CompanyRepository

**파일**: `src/main/java/cariv/exp/domain/login/repository/CompanyRepository.java`

**기본 정보:**
- 상속: `JpaRepository<Company, Long>`
- 커스텀 쿼리 메서드: 0개 (기본 메서드만 사용)

---

### AuctionCertificateRepository

**파일**: `src/main/java/cariv/exp/domain/auction/repository/AuctionCertificateRepository.java`

**기본 정보:**
- 상속: `JpaRepository<AuctionCertificate, Long>`
- 커스텀 쿼리 메서드: 1개

**쿼리 메서드 목록:**

#### findByIdAndCompanyId (라인: 9)
```java
Optional<AuctionCertificate> findByIdAndCompanyId(Long id, Long companyId);
```

**분석:**
- 반환 타입: `Optional<AuctionCertificate>`
- 쿼리 생성 방식: Spring Data JPA 메서드명 기반
- 실제 생성 쿼리 (예상):
  ```sql
  SELECT * FROM auction_certificate 
  WHERE id = :id AND company_id = :companyId
  ```
- 사용 위치: `DocumentService.getDetail()` (라인: 211)

---

### RegistrationCertificateRepository

**파일**: `src/main/java/cariv/exp/domain/registration/repository/RegistrationCertificateRepository.java`

**기본 정보:**
- 상속: `TenantRepository<RegistrationReCertificate, Long>`
- 커스텀 쿼리 메서드: 1개

**쿼리 메서드 목록:**

#### findByIdAndCompanyId (라인: 11)
```java
Optional<RegistrationReCertificate> findByIdAndCompanyId(Long id, Long companyId);
```

**분석:**
- 반환 타입: `Optional<RegistrationReCertificate>`
- 쿼리 생성 방식: Spring Data JPA 메서드명 기반
- 실제 생성 쿼리 (예상):
  ```sql
  SELECT * FROM registration_re_certificate 
  WHERE id = :id AND company_id = :companyId
  ```
- 사용 위치: `DocumentService.getDetail()` (라인: 188)

---

### TaxInvoiceRepository

**파일**: `src/main/java/cariv/exp/domain/invoice/repository/TaxInvoiceRepository.java`

**기본 정보:**
- 상속: `JpaRepository<TaxInvoice, Long>`
- 커스텀 쿼리 메서드: 1개

**쿼리 메서드 목록:**

#### findByIdAndCompanyId (라인: 9)
```java
Optional<TaxInvoice> findByIdAndCompanyId(Long id, Long companyId);
```

**분석:**
- 반환 타입: `Optional<TaxInvoice>`
- 쿼리 생성 방식: Spring Data JPA 메서드명 기반
- 실제 생성 쿼리 (예상):
  ```sql
  SELECT * FROM tax_invoice 
  WHERE id = :id AND company_id = :companyId
  ```
- 사용 위치: `DocumentService.getDetail()` (라인: 226)

---

## 5.4 엔티티 관계 다이어그램

```
Company (BaseEntity)
  └─ id

User (TenantEntity)
  └─ id, companyId, loginId, passwordHash, role, active

RefreshToken (BaseEntity)
  └─ id, tokenHash, user (ManyToOne), expiresAt, revoked

BaseInfo (TenantEntity)
  └─ id, companyId, name, businessRegistrationNumber, ...
  └─ exportCountryCodes (ElementCollection)

Vehicle (TenantEntity)
  └─ id, companyId, chassisNo, registrationNo, stage, ...

VehiclePurchase (TenantEntity)
  └─ id, companyId, vehicle (OneToOne), purchaseAmount, ...

DeRegistrationCertificate (TenantEntity)
  └─ id, companyId, vehicle (OneToOne), vehicleType, ...

RegistrationReCertificate (TenantEntity)
  └─ id, companyId, vehicle (ManyToOne), registrationNo, ...

Export (TenantEntity)
  └─ id, companyId, vehicle (ManyToOne), declarationNo, ...

AuctionCertificate (TenantEntity)
  └─ id, companyId, registrationNo, chassisNo, ...

TaxInvoice (TenantEntity)
  └─ id, companyId, registrationNo, totalAmount, ...

Documents (TenantEntity)
  └─ id, companyId, fileName, type, status, relatedId, ...
```

**관계 요약:**
- Vehicle ← VehiclePurchase (OneToOne)
- Vehicle ← DeRegistrationCertificate (OneToOne)
- Vehicle ← RegistrationReCertificate (ManyToOne)
- Vehicle ← Export (ManyToOne)
- User ← RefreshToken (ManyToOne)

---

## 5.5 인덱스 및 제약조건 요약

### 유니크 제약조건
- `uk_vehicle_company_chassis` (vehicle 테이블): company_id + chassis_no (라인: 19)
- `uk_base_info_export_country` (base_info_export_country 테이블): base_info_id + country_code (BaseInfo.java 라인: 39-41)

### 인덱스
- Vehicle:
  - `idx_vehicle_company_regno` (company_id, registration_no)
  - `idx_vehicle_company_stage` (company_id, stage)
- Export:
  - `idx_export_decl_company_vehicle` (company_id, vehicle_id)
  - `idx_export_decl_company_declno` (company_id, declaration_no)
  - `idx_export_decl_company_vin` (company_id, chassis_no)
