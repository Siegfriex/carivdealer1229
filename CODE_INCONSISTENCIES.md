# 코드 품질 불일치 및 오타

## 개요

이 문서는 코드베이스에서 발견된 불일치, 오타, 네이밍 이슈, Swagger 문서 불일치 등을 정리합니다. 각 항목은 파일 경로와 라인 번호를 명시하여 수정 가능하도록 제시합니다.

---

## 1. 중복 클래스명 (다른 패키지)

### 1.1 RegistrationInfo 중복

**문제**: 같은 이름의 클래스가 Entity와 DTO로 존재

**파일 1**: `src/main/java/cariv/exp/domain/registration/entity/RegistrationInfo.java` (라인 12)
```java
@Entity
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class RegistrationInfo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
}
```
- **타입**: Entity (빈 클래스, id만 있음)
- **용도**: 미사용으로 보임

**파일 2**: `src/main/java/cariv/exp/domain/registration/dto/RegistrationInfo.java` (라인 3)
```java
public record RegistrationInfo(
    String registrationNo,
    String vehicleType,
    // ... 필드 다수
) {}
```
- **타입**: DTO record (실제 사용)
- **용도**: 등록증 파싱 결과 전달

**영향도**: 중간 (혼동 가능성)

**개선 권장:**
- Entity 클래스명 변경: `RegistrationInfoEntity` 또는 삭제 (미사용 시)
- 또는 DTO 클래스명 변경: `RegistrationInfoDTO`

---

### 1.2 DocumentFieldKeys 중복 (중요)

**문제**: 같은 이름의 클래스가 dto 패키지와 service 패키지에 존재하며 필드명이 다름

**파일 1**: `src/main/java/cariv/exp/domain/document/dto/DocumentFieldKeys.java` (라인 10)
```java
public final class DocumentFieldKeys {
    // EXPORT_REQUIRED
    public static final List<String> EXPORT_REQUIRED = List.of(
        "vin",  // ❌ vin 사용
        // ...
    );
    
    // DEREG_REQUIRED
    public static final List<String> DEREG_REQUIRED = List.of(
        "vehicleNo",  // ❌ vehicleNo 사용
        "vin",        // ❌ vin 사용
        // ...
    );
    
    // REG_REQUIRED
    public static final List<String> REG_REQUIRED = List.of(
        "vehicleNo",  // ❌ vehicleNo 사용
        "vin",        // ❌ vin 사용
        // ...
    );
}
```

**파일 2**: `src/main/java/cariv/exp/domain/document/service/DocumentFieldKeys.java` (라인 8)
```java
public final class DocumentFieldKeys {
    public static List<String> requiredKeys(DocumentType type) {
        return switch (type) {
            case EXPORT_CERTIFICATE -> List.of(
                "chassisNo",  // ✅ chassisNo 사용
                // ...
            );
            case DEREGISTRATION -> List.of(
                "registrationNo",  // ✅ registrationNo 사용
                "chassisNo",       // ✅ chassisNo 사용
                // ...
            );
            case REGISTRATION -> List.of(
                "registrationNo",  // ✅ registrationNo 사용
                "chassisNo",       // ✅ chassisNo 사용
                // ...
            );
        };
    }
}
```

**실제 Entity/DTO 사용**:
- `Vehicle.chassisNo` (Entity)
- `Export.chassisNo` (Entity)
- `DeRegistrationCertificate.chassisNo` (Entity)
- `Vehicle.registrationNo` (Entity)
- 모든 DTO에서 `chassisNo`, `registrationNo` 사용

**문제 분석**:
- `dto.DocumentFieldKeys`는 `"vin"`, `"vehicleNo"` 사용 (미사용 또는 오래된 버전)
- `service.DocumentFieldKeys`는 `"chassisNo"`, `"registrationNo"` 사용 (실제 사용)
- 실제 코드는 `service.DocumentFieldKeys`를 사용하므로 `dto.DocumentFieldKeys`는 미사용

**영향도**: 높음 (필드명 불일치로 인한 혼동)

**개선 권장:**
- `dto.DocumentFieldKeys` 삭제 또는 필드명 수정
- 또는 클래스명 변경하여 구분

---

## 2. 필드명 불일치

### 2.1 ownerId vs ownerBirthOrRegNo

**문제**: 같은 의미의 필드가 도메인별로 다른 이름 사용

**등록증(Registration) 도메인**:
- `RegistrationInfo` DTO (라인 12): `ownerId` 사용
- `RegistrationReCertificate` Entity (라인 49): `ownerId` 사용

**말소증(DeRegistration) 도메인**:
- `DeRegistrationInfo` DTO (라인 21): `ownerBirthOrRegNo` 사용
- `DeRegistrationSummaryDTO`: `ownerBirthOrRegNo` 사용
- `DeRegistrationCertificate` Entity (라인 51): `ownerBirthOrRegNo` 사용

**코드 증거**:
```java
// RegistrationInfo.java (라인 12)
String ownerId, //생년월일 or 법인 번호

// DeRegistrationInfo.java (라인 21)
String ownerBirthOrRegNo,  //생년월일 or 법인번호
```

**영향도**: 중간 (도메인 간 일관성 부족)

**개선 권장:**
- 통일된 필드명 사용: `ownerBirthOrRegNo` (더 명확한 이름)
- 또는 `ownerId`로 통일 (더 짧은 이름)

---

### 2.2 vin vs chassisNo

**문제**: dto 패키지의 `DocumentFieldKeys`에서 `vin` 사용, 실제 Entity/DTO는 `chassisNo` 사용

**코드 증거**:
- `dto.DocumentFieldKeys`: `"vin"` 사용
- `service.DocumentFieldKeys`: `"chassisNo"` 사용
- 실제 Entity: `Vehicle.chassisNo`, `Export.chassisNo`

**영향도**: 높음 (dto 패키지 클래스가 미사용이므로 실제 영향은 낮음)

**개선 권장:**
- `dto.DocumentFieldKeys` 삭제 또는 `"chassisNo"`로 수정

---

## 3. Swagger 문서 불일치

### 3.1 ExportController 기본 Stage 설명 불일치

**파일**: `src/main/java/cariv/exp/domain/export/controller/ExportController.java` (라인 30-31, 42-43)

**Swagger 설명**:
```java
@Operation(
    summary = "면허(수출신고필증) 현황 조회",
    description = "기본 stage는 원하는 값으로 디폴트. Export(수출신고필증) 최신 1건 기준으로 목록 반환"
)
```

**실제 코드**:
```java
// ✅ 여기만 바꾸면 "디폴트 stage" 바뀜
VehicleStage resolvedStage =
    (stage == null) ? VehicleStage.DEREG_COMPLETED : stage;
```

**문제**: Swagger 설명은 "원하는 값으로 디폴트"라고 하지만 실제는 `DEREG_COMPLETED`로 고정

**영향도**: 중간 (API 사용자 혼동 가능)

**개선 권장:**
- Swagger 설명 수정: "기본 stage는 DEREG_COMPLETED. stage 파라미터로 변경 가능"

---

### 3.2 AdminUserController Swagger summary 중복

**파일**: `src/main/java/cariv/exp/domain/login/controller/AdminUserController.java` (라인 42-44, 67-69)

**엔드포인트 1**:
```java
@PutMapping("/me/password")
@Operation(
    summary = "비밀 번호 변경",
    description = "ADMIN 자신의 비밀번호 변경"
)
```

**엔드포인트 2**:
```java
@PutMapping("/companies/{companyId}/staff/{staffId}/password")
@Operation(
    summary = "비밀 번호 변경",
    description = "Staff의 비밀번호 변경"
)
```

**문제**: 두 엔드포인트의 summary가 동일하여 Swagger UI에서 구분이 어려움

**영향도**: 낮음 (description으로 구분 가능하나 일관성 부족)

**개선 권장:**
- 엔드포인트 1: `summary = "내 비밀번호 변경"`
- 엔드포인트 2: `summary = "Staff 비밀번호 변경"`

---

## 4. 변수명 이슈

### 4.1 ExportController 변수명 타입 불일치

**파일**: `src/main/java/cariv/exp/domain/export/controller/ExportController.java` (라인 26)

**코드**:
```java
private final ExportCertificateService exportStatusService;
```

**문제**: 변수명은 `exportStatusService`이지만 실제 타입은 `ExportCertificateService`

**영향도**: 낮음 (기능상 문제 없으나 네이밍 일관성 부족)

**개선 권장:**
- 변수명 변경: `exportCertificateService` (타입명과 일치)

---

## 5. 주석과 실제 코드의 불일치

### 5.1 Export Entity 주석된 코드

**파일**: `src/main/java/cariv/exp/domain/export/entity/Export.java` (라인 40, 47)

**코드**:
```java
/** 신고일자 (예: 2025-01-13) */
@Column(length = 20)
//private String declarationDate;  // 주석 처리
private LocalDate declarationDate;  // 활성

/** 신고수리일자 (예: 2025/01/13) */
@Column(length = 20)
private LocalDate acceptanceDate;  // 활성

//private String acceptanceDate;  // 주석 처리
```

**문제**: 주석 처리된 코드가 남아 있음 (리팩토링 잔재)

**영향도**: 낮음 (실행되지 않지만 코드 정리 필요)

**개선 권장:**
- 주석 처리된 코드 제거 (Git 히스토리로 추적 가능)

---

## 6. Export Entity 주석과 필드명

### 6.1 VIN vs chassisNo 주석 불일치

**파일**: `src/main/java/cariv/exp/domain/export/entity/Export.java` (라인 79, 81)

**코드**:
```java
/** VIN(차대번호) */
@Column(length = 50)
private String chassisNo;
```

**문제**: 주석은 "VIN"이지만 필드명은 `chassisNo`. 일관성은 유지되나 주석이 혼동 가능

**영향도**: 낮음 (주석만 수정 필요)

**개선 권장:**
- 주석 수정: `/** 차대번호(VIN) */` 또는 `/** 차대번호(chassisNo) */`

---

## 7. 불일치 항목 우선순위

### 우선순위 High

1. **DocumentFieldKeys 필드명 불일치**: `dto.DocumentFieldKeys` 삭제 또는 수정
2. **ownerId vs ownerBirthOrRegNo 통일**: 도메인 간 필드명 통일

### 우선순위 Medium

3. **Swagger 설명 정확성**: ExportController 기본 Stage 설명 수정
4. **Swagger summary 중복**: AdminUserController summary 구분

### 우선순위 Low

5. **주석 처리된 코드 정리**: Export Entity 주석 코드 제거
6. **변수명 일관성**: ExportController 변수명 수정
7. **주석 정확성**: Export Entity VIN 주석 수정

---

## 8. 불일치의 원인 추론

### 개발 과정에서의 변화

1. **필드명 변경**: 초기에는 `vin`, `vehicleNo` 사용 → 이후 `chassisNo`, `registrationNo`로 변경
2. **도메인별 독립 개발**: 등록증과 말소증이 다른 시점에 개발되어 필드명 불일치
3. **리팩토링 잔재**: String → LocalDate 변경 시 주석 코드 미정리

### 네이밍 컨벤션 부재

- 필드명 통일 규칙 없음
- 도메인 간 일관성 부족
- 주석 정리 프로세스 부재

---

## 결론

이러한 불일치들은 개발 과정에서 자연스럽게 발생한 것으로 보입니다. 특히 필드명 변경과 도메인별 독립 개발이 주요 원인으로 추정됩니다. 코드 리뷰와 리팩토링을 통해 이러한 불일치를 해결하는 것을 권장합니다.
