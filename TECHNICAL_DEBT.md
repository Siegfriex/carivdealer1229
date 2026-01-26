# 기술적 타협점 및 의도적 부채

## 개요

이 문서는 코드베이스에서 발견된 의도적 타협점, 하드코딩된 값, 비활성화된 코드, 그리고 향후 개선이 필요한 영역을 정리합니다. 각 항목은 개발 당시의 상황과 타협 이유를 역추론하여 제시합니다.

---

## 1. 명시적 타협점 (TODO/FIXME 주석)

### 1.1 미사용 엔드포인트: `/api/auth/signup`

**파일**: `src/main/java/cariv/exp/domain/login/controller/AuthController.java` (라인 23-31)

**코드:**
```java
@PostMapping("/signup")
@Operation(
    summary = "회원가입",
    description = "staff용 회원 가입인데 아마 admin에서 staff 생성할 것 같아서 안쓸거같아요 - 나중에 지울거"
)
public String signup(@RequestBody SignupRequest req) {
    authService.signup(req);
    return "ok";
}
```

**타협 이유 추론:**
- 초기 개발 단계에서 staff 회원가입 기능 구현
- 이후 Admin에서 staff 생성 기능으로 대체 예정
- **의도적 부채**: 기능은 유지하되 주석으로 미사용 표시

**영향도**: 낮음 (미사용이지만 코드는 유지)

**개선 권장:**
- 운영 환경에서 사용하지 않는다면 엔드포인트 제거
- 또는 `@Deprecated` 어노테이션 추가하여 명시적 표시

---

### 1.2 S3 업로드 미연동: 임시 파일 저장만 사용

**파일**: `src/main/java/cariv/exp/domain/document/service/DocumentService.java` (라인 74-76)

**코드:**
```java
// ✅ S3 없이 임시파일로만 저장
Path tmp = Files.createTempFile("up-", "-" + safe(file.getOriginalFilename()));
file.transferTo(tmp.toFile());
```

**타협 이유 추론:**
- 문서 업로드 초기 구현 단계
- S3 연동은 `DocumentWorkTx`에서 수행되지만, 초기 업로드 단계에서는 임시 파일만 사용
- **의도적 부채**: 빠른 개발을 위해 임시 파일 저장으로 우선 구현

**영향도**: 중간 (임시 파일은 서버 재시작 시 삭제 가능)

**개선 권장:**
- 초기 업로드도 S3에 저장하도록 변경
- 또는 임시 파일을 S3에 업로드 후 삭제하는 방식으로 개선

**참고**: `DocumentWorkTx.java`에서는 이미 S3 업로드가 구현되어 있음 (라인 68-73)

---

### 1.3 문서 타입 감지 확장 예정

**파일**: `src/main/java/cariv/exp/domain/upstage/service/DocumentTypeDetector.java` (라인 25)

**코드:**
```java
// (등록원부/인보이스도 나중에 추가 가능)
private static final List<String> REGISTRATION_KEYWORDS = List.of(
    "자동차등록증",
    // ...
);
```

**타협 이유 추론:**
- 현재 6가지 문서 타입 지원 (DEREGISTRATION, REGISTRATION, INVOICE, CONTRACT, AUCTION, EXPORT)
- 등록원부/인보이스는 향후 추가 예정
- **의도적 부채**: 확장 가능한 구조로 설계하되, 현재는 우선순위 낮은 기능

**영향도**: 낮음 (확장 계획만 표시)

**개선 권장:**
- 등록원부/인보이스 타입 추가 시 키워드 목록 확장

---

## 2. 하드코딩된 매직 넘버

### 2.1 Upstage API 재시도 설정

**파일**: `src/main/java/cariv/exp/domain/upstage/service/UpstageService.java` (라인 27-28, 95)

**코드:**
```java
// ✅ 운영하면서 조절: Tier1이면 3~5회 정도면 보통 충분
private static final int MAX_RETRIES = 5;
private static final long BASE_BACKOFF_MS = 400; // 0.4s

// 라인 95
backoff = Math.min(backoff * 2, 8000); // 최대 8s
```

**타협 이유 추론:**
- Upstage API Tier1 기준으로 초기 설정
- 운영 중 조절 가능하도록 주석으로 표시
- **의도적 부채**: 빠른 개발을 위해 하드코딩, 향후 설정 파일로 이동 예정

**영향도**: 중간 (운영 중 조절 필요 시 코드 수정 필요)

**개선 권장:**
- `application.yml` 또는 환경 변수로 이동
- 예: `upstage.retry.max-retries=5`, `upstage.retry.base-backoff-ms=400`

---

### 2.2 Upstage API 동시성 제한

**파일**: `src/main/java/cariv/exp/domain/upstage/service/UpstageCallGuard.java` (라인 15, 21, 32, 35)

**코드:**
```java
// ✅ 전역 동시성: Tier1이면 일단 2 정도로 시작(429 줄어듦)
private final Semaphore global = new Semaphore(2, true);

// ✅ 회사별 동시성: 회사 하나가 독점 못 하게 1
return perCompany.computeIfAbsent(companyId, id -> new Semaphore(1, true));

// 타임아웃
g = global.tryAcquire(30, TimeUnit.SECONDS);
c = company.tryAcquire(30, TimeUnit.SECONDS);
```

**타협 이유 추론:**
- Upstage API Tier1 Rate Limit 대응
- 초기 SaaS 단계에서 적절한 수준으로 설정
- **의도적 부채**: 운영 중 조절 필요 시 코드 수정 필요

**영향도**: 중간 (API Tier 변경 시 코드 수정 필요)

**개선 권장:**
- 설정 파일로 이동
- 예: `upstage.concurrency.global=2`, `upstage.concurrency.per-company=1`, `upstage.concurrency.timeout-seconds=30`

---

### 2.3 Upstage API Base URL 하드코딩

**파일**: `src/main/java/cariv/exp/global/config/UpstageConfig.java` (라인 20)

**코드:**
```java
@Bean
public WebClient upstageWebClient() {
    return WebClient.builder()
        .baseUrl("https://api.upstage.ai/v1")  // 라인 20
        // ...
}
```

**타협 이유 추론:**
- Upstage API는 단일 엔드포인트만 사용
- 환경별 URL 차이가 없음
- **의도적 부채**: 단순성을 위해 하드코딩

**영향도**: 낮음 (URL 변경 가능성 낮음)

**개선 권장:**
- 설정 파일로 이동 (환경별 테스트 가능)
- 예: `upstage.api.base-url=https://api.upstage.ai/v1`

---

### 2.4 Export Controller 기본 Stage 하드코딩

**파일**: `src/main/java/cariv/exp/domain/export/controller/ExportController.java` (라인 41-43)

**코드:**
```java
// ✅ 여기만 바꾸면 "디폴트 stage" 바뀜
VehicleStage resolvedStage =
    (stage == null) ? VehicleStage.DEREG_COMPLETED : stage;
```

**타협 이유 추론:**
- 기본 Stage를 `DEREG_COMPLETED`로 고정
- Swagger 설명과 불일치 ("원하는 값으로 디폴트"라고 명시)
- **의도적 부채**: 빠른 개발을 위해 하드코딩

**영향도**: 낮음 (기본값 변경 시 코드 수정 필요)

**개선 권장:**
- 설정 파일로 이동
- Swagger 설명 수정 ("기본 stage는 DEREG_COMPLETED")

---

### 2.5 S3 Key 경로 패턴 하드코딩

**파일**: `src/main/java/cariv/exp/global/aws/S3Upload.java` (라인 36-39, 52-55)

**코드:**
```java
// raw-documents 경로 패턴
String key = "raw-documents/"
    + companyId + "/"
    + documentId + "/"
    + UUID.randomUUID() + "-" + safeName;

// base-info 경로 패턴
String key = "base-info/"
    + companyId + "/"
    + documentType.toLowerCase()
    + "/latest";
```

**타협 이유 추론:**
- S3 경로 구조를 코드에 하드코딩
- 경로 변경 시 코드 수정 필요
- **의도적 부채**: 단순성을 위해 하드코딩

**영향도**: 낮음 (경로 구조 변경 빈도 낮음)

**개선 권장:**
- 상수 클래스로 분리
- 예: `S3PathConstants.RAW_DOCUMENTS_PREFIX = "raw-documents"`

---

### 2.6 정규식 패턴 하드코딩

**파일**: 여러 Parser 서비스 파일

**패턴 예시:**
- VIN 패턴: `[A-HJ-NPR-Z0-9]{17}`
- 차량번호 패턴: `\\b\\d{2,3}[가-힣]\\d{4}\\b`
- 주민번호 패턴: `\\b\\d{6}-\\d{7}\\b`

**타협 이유 추론:**
- 각 Parser 서비스에서 정규식 패턴을 하드코딩
- 검증 규칙 변경 시 코드 수정 필요
- **의도적 부채**: 빠른 개발을 위해 하드코딩

**영향도**: 낮음 (검증 규칙 변경 빈도 낮음)

**개선 권장:**
- 상수 클래스로 분리
- 예: `ValidationPatterns.VIN = "[A-HJ-NPR-Z0-9]{17}"`

---

## 3. 비활성화된 코드 (주석 처리)

### 3.1 Export Entity: String → LocalDate 변경 흔적

**파일**: `src/main/java/cariv/exp/domain/export/entity/Export.java` (라인 40, 47)

**코드:**
```java
/** 신고일자 (예: 2025-01-13) */
@Column(length = 20)
//private String declarationDate;
private LocalDate declarationDate;

/** 신고수리일자 (예: 2025/01/13) */
@Column(length = 20)
private LocalDate acceptanceDate;

//private String acceptanceDate;
```

**타협 이유 추론:**
- 초기에는 `String` 타입으로 구현
- 이후 `LocalDate`로 변경하여 타입 안정성 향상
- **의도적 부채**: 이전 코드를 주석으로 남겨 변경 이력 기록

**영향도**: 낮음 (주석 처리된 코드는 실행되지 않음)

**개선 권장:**
- 주석 처리된 코드 제거 (Git 히스토리로 추적 가능)

---

### 3.2 DeRegistrationCertificate: vehicleId 주석 처리

**파일**: `src/main/java/cariv/exp/domain/malso/entity/DeRegistrationCertificate.java` (라인 64)

**코드:**
```java
// 연관관계: 이 말소증명서가 어떤 차량/수출오더에 묶이는지
//private Long vehicleId;      // or @ManyToOne Vehicle
private Long exportOrderId;  // 수출오더와 연결
```

**타협 이유 추론:**
- 초기에는 `vehicleId`로 설계 고려
- 이후 `@ManyToOne Vehicle` 관계로 변경
- **의도적 부채**: 설계 결정 과정을 주석으로 기록

**영향도**: 낮음 (주석 처리된 코드는 실행되지 않음)

**개선 권장:**
- 주석 처리된 코드 제거 (설계 결정은 문서로 기록)

---

### 3.3 UpstageElement: coordinates 필드 주석 처리

**파일**: `src/main/java/cariv/exp/domain/upstage/dto/UpstageElement.java` (라인 9)

**코드:**
```java
public record UpstageElement(
    String category,         // "table", "paragraph", ...
    Content content,
    //List<Coordinate> coordinates,
    Integer id,
    Integer page
) {}
```

**타협 이유 추론:**
- Upstage API 응답에 `coordinates` 필드가 있지만 현재 미사용
- 향후 필요 시 활성화 가능하도록 주석으로 표시
- **의도적 부채**: 확장 가능성을 고려한 설계

**영향도**: 낮음 (필요 시 활성화 가능)

**개선 권장:**
- 필요 시 활성화, 불필요 시 제거

---

### 3.4 DeRegistrationParserService: DOC_NO_LABELS 주석 처리

**파일**: `src/main/java/cariv/exp/domain/malso/service/DeRegistrationParserService.java` (라인 25)

**코드:**
```java
//private static final List<String> DOC_NO_LABELS = List.of("문서확인번호", "No.", "Document No");
```

**타협 이유 추론:**
- 문서번호 라벨 목록을 정의했으나 현재 미사용
- 향후 필요 시 활성화 가능하도록 주석으로 표시
- **의도적 부채**: 확장 가능성을 고려한 설계

**영향도**: 낮음 (필요 시 활성화 가능)

**개선 권장:**
- 필요 시 활성화, 불필요 시 제거

---

### 3.5 ExportParserService: 파싱 실패 처리 옵션 주석

**파일**: `src/main/java/cariv/exp/domain/export/service/ExportParserService.java` (라인 148)

**코드:**
```java
// 파싱 실패면 missing에 넣고 싶으면 아래처럼 처리(선택)
if (map.get("declarationDate") != null && declarationDate == null) map.remove("declarationDate");
```

**타협 이유 추론:**
- 파싱 실패 시 처리 옵션을 주석으로 제시
- 현재는 필드 제거 방식 사용
- **의도적 부채**: 향후 missing 필드 추가 시 참고용

**영향도**: 낮음 (참고용 주석)

**개선 권장:**
- missing 필드 추가 시 주석 제거하고 구현

---

## 4. 설정 파일 부재

### 4.1 application.yml/properties 없음

**위치**: `src/main/resources/`

**현재 상태:**
- `application.yml` 또는 `application.properties` 파일 없음
- 환경 변수 기반 설정으로 추정

**타협 이유 추론:**
- 환경별 설정 파일 관리 복잡도 회피
- 환경 변수로 모든 설정 관리 (Docker/Kubernetes 환경 고려)
- **의도적 부채**: 설정 파일 관리 부재

**영향도**: 중간 (로컬 개발 환경 설정 어려움)

**개선 권장:**
- `application.yml` 기본 설정 파일 추가
- 환경별 프로파일 분리 (`application-dev.yml`, `application-prod.yml`)
- 민감 정보는 환경 변수로 관리

---

## 5. 타협점 우선순위 및 개선 계획

### 우선순위 High

1. **S3 업로드 완성**: `DocumentService`에서 임시 파일 저장을 S3 업로드로 변경
2. **설정 외부화**: 재시도 횟수, 동시성 제한, 기본 Stage 등을 설정 파일로 이동
3. **미사용 엔드포인트 정리**: `/api/auth/signup` 제거 또는 `@Deprecated` 표시

### 우선순위 Medium

4. **주석 처리된 코드 정리**: 불필요한 주석 코드 제거
5. **상수 분리**: S3 경로 패턴, 정규식 패턴을 상수 클래스로 분리
6. **Swagger 설명 정확성**: ExportController 기본 Stage 설명 수정

### 우선순위 Low

7. **문서 타입 확장**: 등록원부/인보이스 타입 추가
8. **UpstageElement coordinates 활성화**: 필요 시 활성화

---

## 6. 타협점의 긍정적 측면

### 개발 속도

- 빠른 개발을 위해 하드코딩과 임시 구현을 선택
- MVP 단계에서 기능 완성도 우선

### 실용성

- 복잡한 설정 관리보다 단순한 하드코딩 선택
- 운영 중 조절 가능하도록 주석으로 표시

### 확장성 고려

- 향후 확장 가능한 구조로 설계 (주석으로 표시)
- Strategy 패턴 등으로 확장성 확보

---

## 결론

이러한 타협점들은 개발 속도와 기능 완성도 사이의 균형을 보여줍니다. 특히 SaaS 초기 단계에서 빠른 개발을 위해 일부 기능을 하드코딩하거나 임시 구현으로 처리한 것으로 보입니다. 운영 전 리팩토링을 통해 이러한 부채를 해결하는 것을 권장합니다.
