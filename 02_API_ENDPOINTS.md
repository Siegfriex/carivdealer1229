# 02. API 엔드포인트 완전 분석

## 2.1 AuthController

**파일**: `src/main/java/cariv/exp/domain/login/controller/AuthController.java`

### 기본 정보
- **Base Path**: `/api/auth` (라인: 16)
- **Swagger Tag**: `Auth` - "인증 / 인가 API" (라인: 17)
- **의존성**: `AuthService` (라인: 21)

### 엔드포인트 목록

#### 1. signup (라인: 23-31)
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

**분석:**
- **HTTP Method**: `POST`
- **Full Path**: `/api/auth/signup`
- **인증 필요 여부**: ❌ 아니오 (인증 불필요)
- **요청 파라미터**:
  - `@RequestBody SignupRequest req` - 회원가입 요청 DTO
- **응답 타입**: `String` ("ok")
- **호출되는 Service 메서드**: `AuthService.signup()` (라인: 29)
- **비고**: 나중에 삭제 예정 (주석 참조)

#### 2. login (라인: 33-41)
```java
@PostMapping("/login")
@Operation(
        summary = "로그인",
        description = "아이디와 비밀번호로 로그인해서 Access/Refresh 토큰 발급"
)
public ResponseEntity<TokenResponse> login(@RequestBody LoginRequest req) {
    TokenResponse res = authService.login(req);
    return ResponseEntity.ok(res);
}
```

**분석:**
- **HTTP Method**: `POST`
- **Full Path**: `/api/auth/login`
- **인증 필요 여부**: ❌ 아니오 (인증 불필요)
- **요청 파라미터**:
  - `@RequestBody LoginRequest req` - 로그인 요청 DTO (아이디, 비밀번호)
- **응답 타입**: `ResponseEntity<TokenResponse>` - Access Token, Refresh Token 포함
- **호출되는 Service 메서드**: `AuthService.login()` (라인: 39)
- **Swagger Operation**: 
  - Summary: "로그인"
  - Description: "아이디와 비밀번호로 로그인해서 Access/Refresh 토큰 발급"

#### 3. refresh (라인: 42-50)
```java
@PostMapping("/refresh")
@Operation(
        summary = "토큰 재발급",
        description = "Refresh Token 유효성 검사하고 Access/Refresh 토큰을 새로 발급"
)
public ResponseEntity<TokenResponse> refresh(@RequestBody RefreshRequest req) {
    TokenResponse res = authService.refresh(req.refreshToken());
    return ResponseEntity.ok(res);
}
```

**분석:**
- **HTTP Method**: `POST`
- **Full Path**: `/api/auth/refresh`
- **인증 필요 여부**: ❌ 아니오 (인증 불필요)
- **요청 파라미터**:
  - `@RequestBody RefreshRequest req` - Refresh Token 포함
- **응답 타입**: `ResponseEntity<TokenResponse>` - 새로운 Access/Refresh 토큰
- **호출되는 Service 메서드**: `AuthService.refresh()` (라인: 48)
- **Swagger Operation**: 
  - Summary: "토큰 재발급"
  - Description: "Refresh Token 유효성 검사하고 Access/Refresh 토큰을 새로 발급"

#### 4. logout (라인: 53-61)
```java
@PostMapping("/logout")
@Operation(
        summary = "로그아웃",
        description = "전달받은 Refresh Token을 서버에서 폐기, 이후 이 토큰으로는 재발급 x"
)
public ResponseEntity<String> logout(@RequestBody LogoutRequest req) {
    authService.logout(req.refreshToken());
    return ResponseEntity.ok("ok");
}
```

**분석:**
- **HTTP Method**: `POST`
- **Full Path**: `/api/auth/logout`
- **인증 필요 여부**: ❌ 아니오 (인증 불필요)
- **요청 파라미터**:
  - `@RequestBody LogoutRequest req` - Refresh Token 포함
- **응답 타입**: `ResponseEntity<String>` ("ok")
- **호출되는 Service 메서드**: `AuthService.logout()` (라인: 59)
- **Swagger Operation**: 
  - Summary: "로그아웃"
  - Description: "전달받은 Refresh Token을 서버에서 폐기, 이후 이 토큰으로는 재발급 x"

---

## 2.2 AdminUserController

**파일**: `src/main/java/cariv/exp/domain/login/controller/AdminUserController.java`

### 기본 정보
- **Base Path**: `/api/admin` (라인: 20)
- **Swagger Tag**: `Admin` - "admin에서 사용할 수 있는 기능들" (라인: 21)
- **의존성**: `AdminUserService` (라인: 25)

### 엔드포인트 목록

#### 1. createStaff (라인: 28-40)
```java
@PostMapping("/companies/{companyId}/staff")
@Operation(
        summary = "staff 생성",
        description = "자기 회사의 staff 생성해주기 "
)
public ResponseEntity<String> createStaff(
        @PathVariable Long companyId,
        @RequestBody CreateStaffRequest req,
        @AuthenticationPrincipal CustomUserDetails currentUser
) {
    adminUserService.createStaff(companyId, req, currentUser);
    return ResponseEntity.ok("ok");
}
```

**분석:**
- **HTTP Method**: `POST`
- **Full Path**: `/api/admin/companies/{companyId}/staff`
- **인증 필요 여부**: ✅ 예 (`@AuthenticationPrincipal` 사용)
- **요청 파라미터**:
  - `@PathVariable Long companyId` - 회사 ID
  - `@RequestBody CreateStaffRequest req` - Staff 생성 요청 DTO
  - `@AuthenticationPrincipal CustomUserDetails currentUser` - 현재 로그인한 사용자 정보
- **응답 타입**: `ResponseEntity<String>` ("ok")
- **호출되는 Service 메서드**: `AdminUserService.createStaff()` (라인: 38)
- **Swagger Operation**: 
  - Summary: "staff 생성"
  - Description: "자기 회사의 staff 생성해주기"

#### 2. changeMyPassword (라인: 41-52)
```java
@PutMapping("/me/password")
@Operation(
        summary = "비밀 번호 변경",
        description = "ADMIN 자신의 비밀번호 변경"
)
public ResponseEntity<String> changeMyPassword(
        @RequestBody ChangePasswordRequest req,
        @AuthenticationPrincipal CustomUserDetails currentUser
) {
    adminUserService.changeAdminPassword(currentUser, req);
    return ResponseEntity.ok("ok");
}
```

**분석:**
- **HTTP Method**: `PUT`
- **Full Path**: `/api/admin/me/password`
- **인증 필요 여부**: ✅ 예
- **요청 파라미터**:
  - `@RequestBody ChangePasswordRequest req` - 비밀번호 변경 요청 DTO
  - `@AuthenticationPrincipal CustomUserDetails currentUser` - 현재 로그인한 사용자 정보
- **응답 타입**: `ResponseEntity<String>` ("ok")
- **호출되는 Service 메서드**: `AdminUserService.changeAdminPassword()` (라인: 50)
- **Swagger Operation**: 
  - Summary: "비밀 번호 변경"
  - Description: "ADMIN 자신의 비밀번호 변경"

#### 3. getMyPage (라인: 54-63)
```java
@GetMapping("/me")
@Operation(
        summary = "마이페이지 조회",
        description = "로그인 사용자 정보 및 ADMIN인 경우 같은 회사 직원 목록 조회"
)
public ResponseEntity<MyPageResponse> getMyPage(
        @AuthenticationPrincipal CustomUserDetails currentUser
) {
    return ResponseEntity.ok(adminUserService.getMyPage(currentUser));
}
```

**분석:**
- **HTTP Method**: `GET`
- **Full Path**: `/api/admin/me`
- **인증 필요 여부**: ✅ 예
- **요청 파라미터**:
  - `@AuthenticationPrincipal CustomUserDetails currentUser` - 현재 로그인한 사용자 정보
- **응답 타입**: `ResponseEntity<MyPageResponse>` - 사용자 정보 및 직원 목록
- **호출되는 Service 메서드**: `AdminUserService.getMyPage()` (라인: 62)
- **Swagger Operation**: 
  - Summary: "마이페이지 조회"
  - Description: "로그인 사용자 정보 및 ADMIN인 경우 같은 회사 직원 목록 조회"

#### 4. changeStaffPassword (라인: 66-79)
```java
@PutMapping("/companies/{companyId}/staff/{staffId}/password")
@Operation(
        summary = "비밀 번호 변경",
        description = "Staff의 비밀번호 변경"
)
public ResponseEntity<String> changeStaffPassword(
        @PathVariable Long companyId,
        @PathVariable Long staffId,
        @RequestBody ChangePasswordRequest req,
        @AuthenticationPrincipal CustomUserDetails currentUser
) {
    adminUserService.changeStaffPassword(companyId, staffId, req, currentUser);
    return ResponseEntity.ok("ok");
}
```

**분석:**
- **HTTP Method**: `PUT`
- **Full Path**: `/api/admin/companies/{companyId}/staff/{staffId}/password`
- **인증 필요 여부**: ✅ 예
- **요청 파라미터**:
  - `@PathVariable Long companyId` - 회사 ID
  - `@PathVariable Long staffId` - Staff ID
  - `@RequestBody ChangePasswordRequest req` - 비밀번호 변경 요청 DTO
  - `@AuthenticationPrincipal CustomUserDetails currentUser` - 현재 로그인한 사용자 정보
- **응답 타입**: `ResponseEntity<String>` ("ok")
- **호출되는 Service 메서드**: `AdminUserService.changeStaffPassword()` (라인: 77)
- **Swagger Operation**: 
  - Summary: "비밀 번호 변경"
  - Description: "Staff의 비밀번호 변경"

#### 5. getStaffList (라인: 81-90)
```java
@GetMapping("/companies/{companyId}/staff")
@Operation(summary = "직원 목록 조회")
public ResponseEntity<List<StaffResponse>> getStaffList(
        @PathVariable Long companyId,
        @AuthenticationPrincipal CustomUserDetails currentUser
) {
    return ResponseEntity.ok(
            adminUserService.getStaffList(companyId, currentUser)
    );
}
```

**분석:**
- **HTTP Method**: `GET`
- **Full Path**: `/api/admin/companies/{companyId}/staff`
- **인증 필요 여부**: ✅ 예
- **요청 파라미터**:
  - `@PathVariable Long companyId` - 회사 ID
  - `@AuthenticationPrincipal CustomUserDetails currentUser` - 현재 로그인한 사용자 정보
- **응답 타입**: `ResponseEntity<List<StaffResponse>>` - 직원 목록
- **호출되는 Service 메서드**: `AdminUserService.getStaffList()` (라인: 88)
- **Swagger Operation**: 
  - Summary: "직원 목록 조회"

#### 6. deleteStaff (라인: 93-105)
```java
@DeleteMapping("/companies/{companyId}/staff/{staffId}")
@Operation(
        summary = "Staff 삭제",
        description = "자기 회사의 staff 삭제"
)
public ResponseEntity<String> deleteStaff(
        @PathVariable Long companyId,
        @PathVariable Long staffId,
        @AuthenticationPrincipal CustomUserDetails currentUser
) {
    adminUserService.deleteStaff(companyId, staffId, currentUser);
    return ResponseEntity.ok("ok");
}
```

**분석:**
- **HTTP Method**: `DELETE`
- **Full Path**: `/api/admin/companies/{companyId}/staff/{staffId}`
- **인증 필요 여부**: ✅ 예
- **요청 파라미터**:
  - `@PathVariable Long companyId` - 회사 ID
  - `@PathVariable Long staffId` - Staff ID
  - `@AuthenticationPrincipal CustomUserDetails currentUser` - 현재 로그인한 사용자 정보
- **응답 타입**: `ResponseEntity<String>` ("ok")
- **호출되는 Service 메서드**: `AdminUserService.deleteStaff()` (라인: 103)
- **Swagger Operation**: 
  - Summary: "Staff 삭제"
  - Description: "자기 회사의 staff 삭제"

---

## 2.3 BaseInfoController

**파일**: `src/main/java/cariv/exp/domain/base/controller/BaseInfoController.java`

### 기본 정보
- **Base Path**: `/api/base-info` (라인: 19)
- **Swagger Tag**: 없음
- **의존성**: `BaseInfoService` (라인: 23)

### 엔드포인트 목록

#### 1. getBaseInfo (라인: 29-34)
```java
@GetMapping
public ResponseEntity<BaseInfoResponse> getBaseInfo(
        @AuthenticationPrincipal CustomUserDetails user
) {
    return ResponseEntity.ok(baseInfoService.get(user.getCompanyId()));
}
```

**분석:**
- **HTTP Method**: `GET`
- **Full Path**: `/api/base-info`
- **인증 필요 여부**: ✅ 예
- **요청 파라미터**:
  - `@AuthenticationPrincipal CustomUserDetails user` - 현재 로그인한 사용자 정보
- **응답 타입**: `ResponseEntity<BaseInfoResponse>` - 회사 기본정보
- **호출되는 Service 메서드**: `BaseInfoService.get()` (라인: 33)
- **비고**: 회사 기본정보 조회 (없으면 null/빈값 형태로 반환)

#### 2. upsertBaseInfo (라인: 42-48)
```java
@PutMapping
public ResponseEntity<BaseInfoResponse> upsertBaseInfo(
        @AuthenticationPrincipal CustomUserDetails user,
        @Valid @RequestBody BaseInfoUpsertRequest request
) {
    return ResponseEntity.ok(baseInfoService.upsert(user.getCompanyId(), request));
}
```

**분석:**
- **HTTP Method**: `PUT`
- **Full Path**: `/api/base-info`
- **인증 필요 여부**: ✅ 예
- **요청 파라미터**:
  - `@AuthenticationPrincipal CustomUserDetails user` - 현재 로그인한 사용자 정보
  - `@Valid @RequestBody BaseInfoUpsertRequest request` - 기본정보 생성/수정 요청 DTO
- **응답 타입**: `ResponseEntity<BaseInfoResponse>` - 저장된 기본정보
- **호출되는 Service 메서드**: `BaseInfoService.upsert()` (라인: 47)
- **비고**: 회사 기본정보 생성/수정(Upsert), exportCountryCodes는 ["KR","JP"] 형태로 전달

#### 3. uploadDocument (라인: 53-60)
```java
@PostMapping(value = "/documents/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<BaseInfoDocumentsResponse> uploadDocument(
        @AuthenticationPrincipal CustomUserDetails user,
        @RequestParam("type") BaseInfoDocumentType type,
        @RequestPart("document") MultipartFile document
) {
    return ResponseEntity.ok(baseInfoService.uploadDocument(user.getCompanyId(), type, document));
}
```

**분석:**
- **HTTP Method**: `POST`
- **Full Path**: `/api/base-info/documents/upload`
- **인증 필요 여부**: ✅ 예
- **Content-Type**: `multipart/form-data`
- **요청 파라미터**:
  - `@AuthenticationPrincipal CustomUserDetails user` - 현재 로그인한 사용자 정보
  - `@RequestParam("type") BaseInfoDocumentType type` - 문서 타입 (필수)
  - `@RequestPart("document") MultipartFile document` - 문서 파일 (필수)
- **응답 타입**: `ResponseEntity<BaseInfoDocumentsResponse>` - 업로드된 문서 정보
- **호출되는 Service 메서드**: `BaseInfoService.uploadDocument()` (라인: 59)
- **비고**: 서류 4종 업로드 + 최신 1건 키 저장

#### 4. getDocuments (라인: 66-71)
```java
@GetMapping("/documents")
public ResponseEntity<BaseInfoDocumentsResponse> getDocuments(
        @AuthenticationPrincipal CustomUserDetails user
) {
    return ResponseEntity.ok(baseInfoService.getDocuments(user.getCompanyId()));
}
```

**분석:**
- **HTTP Method**: `GET`
- **Full Path**: `/api/base-info/documents`
- **인증 필요 여부**: ✅ 예
- **요청 파라미터**:
  - `@AuthenticationPrincipal CustomUserDetails user` - 현재 로그인한 사용자 정보
- **응답 타입**: `ResponseEntity<BaseInfoDocumentsResponse>` - 서류 4종 Key 정보
- **호출되는 Service 메서드**: `BaseInfoService.getDocuments()` (라인: 70)
- **비고**: 서류 4종 Key 조회 (프론트에서 "업로드 완료 여부" 확인용)

#### 5. getDocument (라인: 76-88)
```java
@GetMapping("/documents/{type}")
public ResponseEntity<byte[]> getDocument(
        @AuthenticationPrincipal CustomUserDetails user,
        @PathVariable("type") BaseInfoDocumentType type
) {
    BaseInfoService.BaseInfoDocumentData data = baseInfoService.getDocument(user.getCompanyId(), type);
    if (data == null) {
        return ResponseEntity.notFound().build();
    }
    return ResponseEntity.ok()
            .contentType(MediaType.parseMediaType(data.contentType()))
            .body(data.bytes());
}
```

**분석:**
- **HTTP Method**: `GET`
- **Full Path**: `/api/base-info/documents/{type}`
- **인증 필요 여부**: ✅ 예
- **요청 파라미터**:
  - `@AuthenticationPrincipal CustomUserDetails user` - 현재 로그인한 사용자 정보
  - `@PathVariable("type") BaseInfoDocumentType type` - 문서 타입
- **응답 타입**: `ResponseEntity<byte[]>` - 문서 바이너리 데이터
- **호출되는 Service 메서드**: `BaseInfoService.getDocument()` (라인: 81)
- **비고**: 서류 4종 미리보기/다운로드, 문서가 없으면 404 반환

#### 6. parseBusinessRegistration (라인: 93-99)
```java
@PostMapping(value = "/ocr/business-registration", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
public ResponseEntity<BaseInfoOcrResponse> parseBusinessRegistration(
        @RequestPart("document") MultipartFile document,
        @AuthenticationPrincipal CustomUserDetails user
) {
    return ResponseEntity.ok(baseInfoService.parseBusinessRegistration(user.getCompanyId(), document));
}
```

**분석:**
- **HTTP Method**: `POST`
- **Full Path**: `/api/base-info/ocr/business-registration`
- **인증 필요 여부**: ✅ 예
- **Content-Type**: `multipart/form-data`
- **요청 파라미터**:
  - `@RequestPart("document") MultipartFile document` - 사업자등록증 파일 (필수)
  - `@AuthenticationPrincipal CustomUserDetails user` - 현재 로그인한 사용자 정보
- **응답 타입**: `ResponseEntity<BaseInfoOcrResponse>` - OCR 파싱 결과
- **호출되는 Service 메서드**: `BaseInfoService.parseBusinessRegistration()` (라인: 98)
- **비고**: 사업자등록증 OCR → BaseInfo 데이터 보정/저장

---

## 2.4 DocumentController

**파일**: `src/main/java/cariv/exp/domain/document/controller/DocumentController.java`

### 기본 정보
- **Base Path**: `/api/documents` (라인: 22)
- **Swagger Tag**: 없음
- **의존성**: `DocumentService` (라인: 26)

### 엔드포인트 목록

#### 1. upload (라인: 28-41)
```java
@PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
@Operation(summary = "문서 업로드(멀티 가능)", description = "여러 문서를 업로드하면 즉시 PROCESSING row를 반환하고 비동기로 파싱/저장합니다.")
public ResponseEntity<List<DocumentRowResponse>> upload(
        @RequestPart(value = "documents", required = false) MultipartFile[] documents,
        @RequestPart(value = "document", required = false) MultipartFile[] document, // 호환용
        @AuthenticationPrincipal CustomUserDetails user
) throws IOException {

    List<MultipartFile> merged = new ArrayList<>();
    if (documents != null) merged.addAll(List.of(documents));
    if (document != null) merged.addAll(List.of(document));

    return ResponseEntity.ok(documentService.uploadMany(user.getCompanyId(), merged.toArray(new MultipartFile[0])));
}
```

**분석:**
- **HTTP Method**: `POST`
- **Full Path**: `/api/documents/upload`
- **인증 필요 여부**: ✅ 예
- **Content-Type**: `multipart/form-data`
- **요청 파라미터**:
  - `@RequestPart(value = "documents", required = false) MultipartFile[] documents` - 문서 파일 배열 (선택)
  - `@RequestPart(value = "document", required = false) MultipartFile[] document` - 문서 파일 배열 (호환용, 선택)
  - `@AuthenticationPrincipal CustomUserDetails user` - 현재 로그인한 사용자 정보
- **응답 타입**: `ResponseEntity<List<DocumentRowResponse>>` - 업로드된 문서 목록 (PROCESSING 상태)
- **호출되는 Service 메서드**: `DocumentService.uploadMany()` (라인: 40)
- **Swagger Operation**: 
  - Summary: "문서 업로드(멀티 가능)"
  - Description: "여러 문서를 업로드하면 즉시 PROCESSING row를 반환하고 비동기로 파싱/저장합니다."
- **비고**: `documents`와 `document` 파라미터를 병합하여 처리 (호환성 고려)

#### 2. list (라인: 43-51)
```java
@GetMapping
@Operation(summary = "문서 목록 조회", description = "status=PROCESSING/DONE/FAILED로 필터 가능")
public ResponseEntity<List<DocumentRowResponse>> list(
        @RequestParam(required = false) DocumentStatus status,
        @RequestParam(defaultValue = "50") int size,
        @AuthenticationPrincipal CustomUserDetails user
) {
    return ResponseEntity.ok(documentService.list(user.getCompanyId(), status, size));
}
```

**분석:**
- **HTTP Method**: `GET`
- **Full Path**: `/api/documents`
- **인증 필요 여부**: ✅ 예
- **요청 파라미터**:
  - `@RequestParam(required = false) DocumentStatus status` - 문서 상태 필터 (선택, PROCESSING/DONE/FAILED)
  - `@RequestParam(defaultValue = "50") int size` - 조회 개수 (기본값: 50)
  - `@AuthenticationPrincipal CustomUserDetails user` - 현재 로그인한 사용자 정보
- **응답 타입**: `ResponseEntity<List<DocumentRowResponse>>` - 문서 목록
- **호출되는 Service 메서드**: `DocumentService.list()` (라인: 50)
- **Swagger Operation**: 
  - Summary: "문서 목록 조회"
  - Description: "status=PROCESSING/DONE/FAILED로 필터 가능"

#### 3. detail (라인: 53-62)
```java
@GetMapping("/{id}")
@Operation(summary = "문서 상세조회", description = "type에 맞게 value 반환")
public ResponseEntity<DocumentDetailResponse> detail(
        @PathVariable Long id,
        @AuthenticationPrincipal CustomUserDetails user
) {
    return ResponseEntity.ok(
            documentService.getDetail(user.getCompanyId(), id)
    );
}
```

**분석:**
- **HTTP Method**: `GET`
- **Full Path**: `/api/documents/{id}`
- **인증 필요 여부**: ✅ 예
- **요청 파라미터**:
  - `@PathVariable Long id` - 문서 ID
  - `@AuthenticationPrincipal CustomUserDetails user` - 현재 로그인한 사용자 정보
- **응답 타입**: `ResponseEntity<DocumentDetailResponse>` - 문서 상세 정보 (type에 맞는 value 포함)
- **호출되는 Service 메서드**: `DocumentService.getDetail()` (라인: 60)
- **Swagger Operation**: 
  - Summary: "문서 상세조회"
  - Description: "type에 맞게 value 반환"

---

## 2.5 ExportController

**파일**: `src/main/java/cariv/exp/domain/export/controller/ExportController.java`

### 기본 정보
- **Base Path**: `/api/exports` (라인: 23)
- **Swagger Tag**: 없음
- **의존성**: `ExportCertificateService` (라인: 26)

### 엔드포인트 목록

#### 1. status (라인: 28-48)
```java
@GetMapping("/status")
@Operation(
        summary = "면허(수출신고필증) 현황 조회",
        description = "기본 stage는 원하는 값으로 디폴트. Export(수출신고필증) 최신 1건 기준으로 목록 반환"
)
public ResponseEntity<List<ExportStatusRowResponse>> status(
        @RequestParam(required = false) VehicleStage stage,
        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
        @AuthenticationPrincipal CustomUserDetails user
) {
    // ✅ 여기만 바꾸면 "디폴트 stage" 바뀜
    VehicleStage resolvedStage =
            (stage == null) ? VehicleStage.DEREG_COMPLETED : stage;

    return ResponseEntity.ok(
            exportStatusService.list(user.getCompanyId(), resolvedStage, from, to)
    );
}
```

**분석:**
- **HTTP Method**: `GET`
- **Full Path**: `/api/exports/status`
- **인증 필요 여부**: ✅ 예
- **요청 파라미터**:
  - `@RequestParam(required = false) VehicleStage stage` - 차량 단계 필터 (선택, 기본값: DEREG_COMPLETED)
  - `@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from` - 시작 날짜 (선택)
  - `@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to` - 종료 날짜 (선택)
  - `@AuthenticationPrincipal CustomUserDetails user` - 현재 로그인한 사용자 정보
- **응답 타입**: `ResponseEntity<List<ExportStatusRowResponse>>` - 수출신고필증 현황 목록
- **호출되는 Service 메서드**: `ExportCertificateService.list()` (라인: 46)
- **Swagger Operation**: 
  - Summary: "면허(수출신고필증) 현황 조회"
  - Description: "기본 stage는 원하는 값으로 디폴트. Export(수출신고필증) 최신 1건 기준으로 목록 반환"
- **비고**: stage가 null이면 DEREG_COMPLETED로 기본값 설정 (라인: 42-43)

---

## 2.6 MalsoController

**파일**: `src/main/java/cariv/exp/domain/malso/controller/MalsoController.java`

### 기본 정보
- **Base Path**: 없음 (각 메서드에 직접 경로 지정)
- **Swagger Tag**: 없음
- **의존성**: `DeRegistrationService` (라인: 29)

### 엔드포인트 목록

#### 1. pending (라인: 31-50)
```java
@GetMapping("api/status")
@Operation(
        summary = "말소 전 현황(기본 전체조회)",
        description = "기본 stage=REGISTERED_BY_DEALER, 말소증이 아직 없는 차량 목록"
)
public ResponseEntity<List<MalsoPendingRowResponse>> pending(
        @RequestParam(required = false) VehicleStage stage,
        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to,
        @AuthenticationPrincipal CustomUserDetails user
) {
    VehicleStage resolvedStage =
            (stage == null) ? VehicleStage.REGISTERED_BY_DEALER : stage;

    return ResponseEntity.ok(
            malsoService.listPending(user.getCompanyId(), resolvedStage, from, to)
    );
}
```

**분석:**
- **HTTP Method**: `GET`
- **Full Path**: `/api/status` (라인: 31, @RequestMapping 없음)
- **인증 필요 여부**: ✅ 예
- **요청 파라미터**:
  - `@RequestParam(required = false) VehicleStage stage` - 차량 단계 필터 (선택, 기본값: REGISTERED_BY_DEALER)
  - `@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from` - 시작 날짜 (선택)
  - `@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to` - 종료 날짜 (선택)
  - `@AuthenticationPrincipal CustomUserDetails user` - 현재 로그인한 사용자 정보
- **응답 타입**: `ResponseEntity<List<MalsoPendingRowResponse>>` - 말소 전 현황 목록
- **호출되는 Service 메서드**: `DeRegistrationService.listPending()` (라인: 48)
- **Swagger Operation**: 
  - Summary: "말소 전 현황(기본 전체조회)"
  - Description: "기본 stage=REGISTERED_BY_DEALER, 말소증이 아직 없는 차량 목록"
- **비고**: stage가 null이면 REGISTERED_BY_DEALER로 기본값 설정 (라인: 44-45)

#### 2. uploadCertificate (라인: 52-65)
```java
@PostMapping(value = "/api/malso/{vehicleId}/certificate", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
@Operation(
        summary = "말소등록증 업로드",
        description = "말소등록증 파일 업로드 후 말소 완료로 변경합니다."
)
public ResponseEntity<MalsoCertificateUploadResponse> uploadCertificate(
        @PathVariable Long vehicleId,
        @RequestPart("file") MultipartFile file,
        @AuthenticationPrincipal CustomUserDetails user
) throws IOException {
    return ResponseEntity.ok(
            malsoService.uploadCertificate(user.getCompanyId(), vehicleId, file)
    );
}
```

**분석:**
- **HTTP Method**: `POST`
- **Full Path**: `/api/malso/{vehicleId}/certificate`
- **인증 필요 여부**: ✅ 예
- **Content-Type**: `multipart/form-data`
- **요청 파라미터**:
  - `@PathVariable Long vehicleId` - 차량 ID
  - `@RequestPart("file") MultipartFile file` - 말소등록증 파일 (필수)
  - `@AuthenticationPrincipal CustomUserDetails user` - 현재 로그인한 사용자 정보
- **응답 타입**: `ResponseEntity<MalsoCertificateUploadResponse>` - 업로드 결과
- **호출되는 Service 메서드**: `DeRegistrationService.uploadCertificate()` (라인: 63)
- **Swagger Operation**: 
  - Summary: "말소등록증 업로드"
  - Description: "말소등록증 파일 업로드 후 말소 완료로 변경합니다."

---

## 2.7 VehicleController

**파일**: `src/main/java/cariv/exp/domain/vehicle/controller/VehicleController.java`

### 기본 정보
- **Base Path**: `/api/vehicle` (라인: 23)
- **Swagger Tag**: 없음
- **의존성**: `VehicleService` (라인: 25)

### 엔드포인트 목록

#### 1. get (라인: 26-36)
```java
@GetMapping("/{vehicleId}/management")
@Operation(
        summary = "차량관리 조회",
        description = "차량관리 화면에 필요한 데이터 뿌리기"
)
public ResponseEntity<VehicleManagementResponse> get(
        @PathVariable Long vehicleId,
        @AuthenticationPrincipal CustomUserDetails user
) {
    return ResponseEntity.ok(vehicleService.getManagement(user.getCompanyId(), vehicleId));
}
```

**분석:**
- **HTTP Method**: `GET`
- **Full Path**: `/api/vehicle/{vehicleId}/management`
- **인증 필요 여부**: ✅ 예
- **요청 파라미터**:
  - `@PathVariable Long vehicleId` - 차량 ID
  - `@AuthenticationPrincipal CustomUserDetails user` - 현재 로그인한 사용자 정보
- **응답 타입**: `ResponseEntity<VehicleManagementResponse>` - 차량관리 상세 정보
- **호출되는 Service 메서드**: `VehicleService.getManagement()` (라인: 35)
- **Swagger Operation**: 
  - Summary: "차량관리 조회"
  - Description: "차량관리 화면에 필요한 데이터 뿌리기"

#### 2. listManagement (라인: 38-62)
```java
@GetMapping("/management")
@Operation(
        summary = "차량관리 목록 조회(전체)",
        description = "회사 기준 전체 차량 조회, 필터는 없을거면 그냥 null로 보내기, stage는 처리단계, buyername은 화주 이름, datetime from, to는 날짜범위"
)
public ResponseEntity<List<VehicleManagementResponse>> listManagement(
        @RequestParam(required = false) VehicleStage stage,
        @RequestParam(required = false) VehicleManagementSearchField searchField,
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) String buyerName,
        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE,
                fallbackPatterns = {"yyyy.MM.dd", "yyyy/MM/dd", "yyyy년 M월 d일"})
        LocalDate from,

        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE,
                fallbackPatterns = {"yyyy.MM.dd", "yyyy/MM/dd", "yyyy년 M월 d일"})
        LocalDate to,
        @AuthenticationPrincipal CustomUserDetails user
) {
    return ResponseEntity.ok(
            vehicleService.listManagement(user.getCompanyId(), stage, searchField, keyword, buyerName, from, to)
    );
}
```

**분석:**
- **HTTP Method**: `GET`
- **Full Path**: `/api/vehicle/management`
- **인증 필요 여부**: ✅ 예
- **요청 파라미터**:
  - `@RequestParam(required = false) VehicleStage stage` - 처리 단계 필터 (선택)
  - `@RequestParam(required = false) VehicleManagementSearchField searchField` - 검색 필드 (선택)
  - `@RequestParam(required = false) String keyword` - 검색 키워드 (선택)
  - `@RequestParam(required = false) String buyerName` - 화주 이름 (선택)
  - `@RequestParam(required = false) @DateTimeFormat(...) LocalDate from` - 시작 날짜 (선택, 여러 형식 지원)
  - `@RequestParam(required = false) @DateTimeFormat(...) LocalDate to` - 종료 날짜 (선택, 여러 형식 지원)
  - `@AuthenticationPrincipal CustomUserDetails user` - 현재 로그인한 사용자 정보
- **응답 타입**: `ResponseEntity<List<VehicleManagementResponse>>` - 차량관리 목록
- **호출되는 Service 메서드**: `VehicleService.listManagement()` (라인: 60)
- **Swagger Operation**: 
  - Summary: "차량관리 목록 조회(전체)"
  - Description: "회사 기준 전체 차량 조회, 필터는 없을거면 그냥 null로 보내기, stage는 처리단계, buyername은 화주 이름, datetime from, to는 날짜범위"
- **비고**: 날짜 형식은 ISO DATE 외에 "yyyy.MM.dd", "yyyy/MM/dd", "yyyy년 M월 d일" 지원 (라인: 49-50, 54-55)

#### 3. listManagementKeywords (라인: 64-88)
```java
@GetMapping("/management/keywords")
@Operation(
        summary = "차량관리 키워드 조회",
        description = "검색 키워드 입력 후 엔터 시 포함된 키워드 목록을 반환"
)
public ResponseEntity<List<String>> listManagementKeywords(
        @RequestParam(required = false) VehicleStage stage,
        @RequestParam(required = false) VehicleManagementSearchField searchField,
        @RequestParam(required = false) String keyword,
        @RequestParam(required = false) String buyerName,
        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE,
                fallbackPatterns = {"yyyy.MM.dd", "yyyy/MM/dd", "yyyy년 M월 d일"})
        LocalDate from,

        @RequestParam(required = false)
        @DateTimeFormat(iso = DateTimeFormat.ISO.DATE,
                fallbackPatterns = {"yyyy.MM.dd", "yyyy/MM/dd", "yyyy년 M월 d일"})
        LocalDate to,
        @AuthenticationPrincipal CustomUserDetails user
) {
    return ResponseEntity.ok(
            vehicleService.listManagementKeywords(user.getCompanyId(), stage, searchField, keyword, buyerName, from, to)
    );
}
```

**분석:**
- **HTTP Method**: `GET`
- **Full Path**: `/api/vehicle/management/keywords`
- **인증 필요 여부**: ✅ 예
- **요청 파라미터**: listManagement와 동일
- **응답 타입**: `ResponseEntity<List<String>>` - 키워드 목록
- **호출되는 Service 메서드**: `VehicleService.listManagementKeywords()` (라인: 86)
- **Swagger Operation**: 
  - Summary: "차량관리 키워드 조회"
  - Description: "검색 키워드 입력 후 엔터 시 포함된 키워드 목록을 반환"

#### 4. update (라인: 90-101)
```java
@PatchMapping("/{vehicleId}/management")
@Operation(
        summary = "차량관리 수정",
        description = "차종/차대번호/수출업자(BaseInfo) 차량관리 값들을 수정"
)
public ResponseEntity<VehicleManagementResponse> update(
        @PathVariable Long vehicleId,
        @RequestBody VehicleManagementUpdateRequest req,
        @AuthenticationPrincipal CustomUserDetails user
) {
    return ResponseEntity.ok(vehicleService.update(user.getCompanyId(), vehicleId, req));
}
```

**분석:**
- **HTTP Method**: `PATCH`
- **Full Path**: `/api/vehicle/{vehicleId}/management`
- **인증 필요 여부**: ✅ 예
- **요청 파라미터**:
  - `@PathVariable Long vehicleId` - 차량 ID
  - `@RequestBody VehicleManagementUpdateRequest req` - 차량관리 수정 요청 DTO
  - `@AuthenticationPrincipal CustomUserDetails user` - 현재 로그인한 사용자 정보
- **응답 타입**: `ResponseEntity<VehicleManagementResponse>` - 수정된 차량관리 정보
- **호출되는 Service 메서드**: `VehicleService.update()` (라인: 100)
- **Swagger Operation**: 
  - Summary: "차량관리 수정"
  - Description: "차종/차대번호/수출업자(BaseInfo) 차량관리 값들을 수정"

---

## 2.8 PrintController

**파일**: `src/main/java/cariv/exp/global/print/controller/PrintController.java`

### 기본 정보
- **Base Path**: `/api/print` (라인: 22)
- **Swagger Tag**: 없음
- **의존성**: `MalsoPrintService` (라인: 26)

### 엔드포인트 목록

#### 1. malsoItems (라인: 33-54)
```java
@GetMapping(value = "/malso/{vehicleId}/items", produces = MediaType.APPLICATION_JSON_VALUE)
public PrintItemsResponse malsoItems(
        @PathVariable Long vehicleId
) {
    return PrintItemsResponse.builder()
            .vehicleId(vehicleId)
            .items(List.of(
                    PrintItemResponse.builder()
                            .key("deregistration")
                            .title("말소등록신청서")
                            .previewUrl(String.format("/api/print/malso/%d/deregistration.pdf", vehicleId))
                            .downloadUrl(String.format("/api/print/malso/%d/deregistration.xlsx", vehicleId))
                            .build(),
                    PrintItemResponse.builder()
                            .key("invoice")
                            .title("Invoice")
                            .previewUrl(String.format("/api/print/malso/%d/invoice.pdf", vehicleId))
                            .downloadUrl(String.format("/api/print/malso/%d/invoice.xlsx", vehicleId))
                            .build()
            ))
            .build();
}
```

**분석:**
- **HTTP Method**: `GET`
- **Full Path**: `/api/print/malso/{vehicleId}/items`
- **인증 필요 여부**: ❓ 확인 필요 (인증 파라미터 없음)
- **요청 파라미터**:
  - `@PathVariable Long vehicleId` - 차량 ID
- **응답 타입**: `PrintItemsResponse` - 말소 서류 아이템 목록 (JSON)
- **호출되는 Service 메서드**: 없음 (직접 응답 생성)
- **비고**: 프론트 모달에서 "말소등록신청서" + "Invoice"를 같이 보여주기 위한 아이템 목록, previewUrl은 PDF (inline), downloadUrl은 XLSX

#### 2. downloadMalsoXlsx (라인: 59-70)
```java
@GetMapping(value = "/malso/{vehicleId}/deregistration.xlsx",
        produces = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
public ResponseEntity<byte[]> downloadMalsoXlsx(
        @PathVariable Long vehicleId,
        @AuthenticationPrincipal CustomUserDetails user
) {
    byte[] bytes = malsoPrintService.generateDeregistrationApplicationXlsx(user.getCompanyId(), vehicleId);

    return ResponseEntity.ok()
            .headers(xlsxHeaders("자동차_말소등록_신청서.xlsx"))
            .body(bytes);
}
```

**분석:**
- **HTTP Method**: `GET`
- **Full Path**: `/api/print/malso/{vehicleId}/deregistration.xlsx`
- **인증 필요 여부**: ✅ 예
- **요청 파라미터**:
  - `@PathVariable Long vehicleId` - 차량 ID
  - `@AuthenticationPrincipal CustomUserDetails user` - 현재 로그인한 사용자 정보
- **응답 타입**: `ResponseEntity<byte[]>` - 말소등록신청서 엑셀 파일
- **Content-Type**: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- **호출되는 Service 메서드**: `MalsoPrintService.generateDeregistrationApplicationXlsx()` (라인: 65)
- **비고**: 말소등록신청서 엑셀 다운로드

#### 3. previewMalsoPdf (라인: 77-86)
```java
@GetMapping(value = "/malso/{vehicleId}/deregistration.pdf", produces = MediaType.APPLICATION_PDF_VALUE)
public ResponseEntity<byte[]> previewMalsoPdf(
        @PathVariable Long vehicleId,
        @AuthenticationPrincipal CustomUserDetails user
) {
    byte[] pdf = malsoPrintService.generateDeregistrationApplicationPdf(user.getCompanyId(), vehicleId);
    return ResponseEntity.ok()
            .headers(pdfInlineHeaders("자동차_말소등록_신청서.pdf"))
            .body(pdf);
}
```

**분석:**
- **HTTP Method**: `GET`
- **Full Path**: `/api/print/malso/{vehicleId}/deregistration.pdf`
- **인증 필요 여부**: ✅ 예
- **요청 파라미터**:
  - `@PathVariable Long vehicleId` - 차량 ID
  - `@AuthenticationPrincipal CustomUserDetails user` - 현재 로그인한 사용자 정보
- **응답 타입**: `ResponseEntity<byte[]>` - 말소등록신청서 PDF 파일
- **Content-Type**: `application/pdf`
- **호출되는 Service 메서드**: `MalsoPrintService.generateDeregistrationApplicationPdf()` (라인: 82)
- **비고**: 말소등록신청서 PDF 미리보기 (inline), 브라우저 iframe/object에 렌더링 가능

#### 4. downloadMalsoInvoiceXlsx (라인: 92-103)
```java
@GetMapping(value = "/malso/{vehicleId}/invoice.xlsx",
        produces = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")
public ResponseEntity<byte[]> downloadMalsoInvoiceXlsx(
        @PathVariable Long vehicleId,
        @AuthenticationPrincipal CustomUserDetails user
) {
    byte[] bytes = malsoPrintService.generateInvoiceXlsx(user.getCompanyId(), vehicleId);

    return ResponseEntity.ok()
            .headers(xlsxHeaders("자동차_말소_Invoice.xlsx"))
            .body(bytes);
}
```

**분석:**
- **HTTP Method**: `GET`
- **Full Path**: `/api/print/malso/{vehicleId}/invoice.xlsx`
- **인증 필요 여부**: ✅ 예
- **요청 파라미터**:
  - `@PathVariable Long vehicleId` - 차량 ID
  - `@AuthenticationPrincipal CustomUserDetails user` - 현재 로그인한 사용자 정보
- **응답 타입**: `ResponseEntity<byte[]>` - Invoice 엑셀 파일
- **Content-Type**: `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- **호출되는 Service 메서드**: `MalsoPrintService.generateInvoiceXlsx()` (라인: 98)
- **비고**: 말소 신청서에 함께 들어가는 Invoice 엑셀 다운로드, vehicle.model(차종) + vehicle.chassisNo(차대번호)만 채운 invoice_malso.xlsx

#### 5. previewMalsoInvoicePdf (라인: 108-117)
```java
@GetMapping(value = "/malso/{vehicleId}/invoice.pdf", produces = MediaType.APPLICATION_PDF_VALUE)
public ResponseEntity<byte[]> previewMalsoInvoicePdf(
        @PathVariable Long vehicleId,
        @AuthenticationPrincipal CustomUserDetails user
) {
    byte[] pdf = malsoPrintService.generateInvoicePdf(user.getCompanyId(), vehicleId);
    return ResponseEntity.ok()
            .headers(pdfInlineHeaders("자동차_말소_Invoice.pdf"))
            .body(pdf);
}
```

**분석:**
- **HTTP Method**: `GET`
- **Full Path**: `/api/print/malso/{vehicleId}/invoice.pdf`
- **인증 필요 여부**: ✅ 예
- **요청 파라미터**:
  - `@PathVariable Long vehicleId` - 차량 ID
  - `@AuthenticationPrincipal CustomUserDetails user` - 현재 로그인한 사용자 정보
- **응답 타입**: `ResponseEntity<byte[]>` - Invoice PDF 파일
- **Content-Type**: `application/pdf`
- **호출되는 Service 메서드**: `MalsoPrintService.generateInvoicePdf()` (라인: 113)
- **비고**: Invoice PDF 미리보기 (inline)

#### 6. downloadMalsoBundleZip (라인: 123-139)
```java
@GetMapping(value = "/malso/{vehicleId}/bundle.zip", produces = "application/zip")
public ResponseEntity<byte[]> downloadMalsoBundleZip(
        @PathVariable Long vehicleId,
        @AuthenticationPrincipal CustomUserDetails user
) {
    byte[] bytes = malsoPrintService.generateMalsoBundleZip(user.getCompanyId(), vehicleId);

    HttpHeaders headers = new HttpHeaders();
    headers.setContentType(MediaType.parseMediaType("application/zip"));
    headers.setContentDisposition(ContentDisposition.attachment()
            .filename("말소_서류_세트.zip", StandardCharsets.UTF_8)
            .build());

    return ResponseEntity.ok()
            .headers(headers)
            .body(bytes);
}
```

**분석:**
- **HTTP Method**: `GET`
- **Full Path**: `/api/print/malso/{vehicleId}/bundle.zip`
- **인증 필요 여부**: ✅ 예
- **요청 파라미터**:
  - `@PathVariable Long vehicleId` - 차량 ID
  - `@AuthenticationPrincipal CustomUserDetails user` - 현재 로그인한 사용자 정보
- **응답 타입**: `ResponseEntity<byte[]>` - ZIP 파일
- **Content-Type**: `application/zip`
- **호출되는 Service 메서드**: `MalsoPrintService.generateMalsoBundleZip()` (라인: 128)
- **비고**: 말소 서류 세트(말소등록신청서 + Invoice)를 ZIP으로 한 번에 다운로드

---

## 2.9 API 엔드포인트 통합 목록

| 순번 | HTTP Method | Path | Controller | 메서드명 | 인증 | 설명 |
|------|-------------|------|------------|----------|------|------|
| 1 | POST | `/api/auth/signup` | AuthController | signup | ❌ | 회원가입 (삭제 예정) |
| 2 | POST | `/api/auth/login` | AuthController | login | ❌ | 로그인 (Access/Refresh 토큰 발급) |
| 3 | POST | `/api/auth/refresh` | AuthController | refresh | ❌ | 토큰 재발급 |
| 4 | POST | `/api/auth/logout` | AuthController | logout | ❌ | 로그아웃 (Refresh Token 폐기) |
| 5 | POST | `/api/admin/companies/{companyId}/staff` | AdminUserController | createStaff | ✅ | Staff 생성 |
| 6 | PUT | `/api/admin/me/password` | AdminUserController | changeMyPassword | ✅ | ADMIN 비밀번호 변경 |
| 7 | GET | `/api/admin/me` | AdminUserController | getMyPage | ✅ | 마이페이지 조회 |
| 8 | PUT | `/api/admin/companies/{companyId}/staff/{staffId}/password` | AdminUserController | changeStaffPassword | ✅ | Staff 비밀번호 변경 |
| 9 | GET | `/api/admin/companies/{companyId}/staff` | AdminUserController | getStaffList | ✅ | 직원 목록 조회 |
| 10 | DELETE | `/api/admin/companies/{companyId}/staff/{staffId}` | AdminUserController | deleteStaff | ✅ | Staff 삭제 |
| 11 | GET | `/api/base-info` | BaseInfoController | getBaseInfo | ✅ | 회사 기본정보 조회 |
| 12 | PUT | `/api/base-info` | BaseInfoController | upsertBaseInfo | ✅ | 회사 기본정보 생성/수정 |
| 13 | POST | `/api/base-info/documents/upload` | BaseInfoController | uploadDocument | ✅ | 서류 4종 업로드 |
| 14 | GET | `/api/base-info/documents` | BaseInfoController | getDocuments | ✅ | 서류 4종 Key 조회 |
| 15 | GET | `/api/base-info/documents/{type}` | BaseInfoController | getDocument | ✅ | 서류 미리보기/다운로드 |
| 16 | POST | `/api/base-info/ocr/business-registration` | BaseInfoController | parseBusinessRegistration | ✅ | 사업자등록증 OCR |
| 17 | POST | `/api/documents/upload` | DocumentController | upload | ✅ | 문서 업로드(멀티 가능) |
| 18 | GET | `/api/documents` | DocumentController | list | ✅ | 문서 목록 조회 |
| 19 | GET | `/api/documents/{id}` | DocumentController | detail | ✅ | 문서 상세조회 |
| 20 | GET | `/api/exports/status` | ExportController | status | ✅ | 수출신고필증 현황 조회 |
| 21 | GET | `/api/status` | MalsoController | pending | ✅ | 말소 전 현황 조회 |
| 22 | POST | `/api/malso/{vehicleId}/certificate` | MalsoController | uploadCertificate | ✅ | 말소등록증 업로드 |
| 23 | GET | `/api/vehicle/{vehicleId}/management` | VehicleController | get | ✅ | 차량관리 조회 |
| 24 | GET | `/api/vehicle/management` | VehicleController | listManagement | ✅ | 차량관리 목록 조회 |
| 25 | GET | `/api/vehicle/management/keywords` | VehicleController | listManagementKeywords | ✅ | 차량관리 키워드 조회 |
| 26 | PATCH | `/api/vehicle/{vehicleId}/management` | VehicleController | update | ✅ | 차량관리 수정 |
| 27 | GET | `/api/print/malso/{vehicleId}/items` | PrintController | malsoItems | ❓ | 말소 서류 아이템 목록 |
| 28 | GET | `/api/print/malso/{vehicleId}/deregistration.xlsx` | PrintController | downloadMalsoXlsx | ✅ | 말소등록신청서 엑셀 다운로드 |
| 29 | GET | `/api/print/malso/{vehicleId}/deregistration.pdf` | PrintController | previewMalsoPdf | ✅ | 말소등록신청서 PDF 미리보기 |
| 30 | GET | `/api/print/malso/{vehicleId}/invoice.xlsx` | PrintController | downloadMalsoInvoiceXlsx | ✅ | Invoice 엑셀 다운로드 |
| 31 | GET | `/api/print/malso/{vehicleId}/invoice.pdf` | PrintController | previewMalsoInvoicePdf | ✅ | Invoice PDF 미리보기 |
| 32 | GET | `/api/print/malso/{vehicleId}/bundle.zip` | PrintController | downloadMalsoBundleZip | ✅ | 말소 서류 세트 ZIP 다운로드 |

**총 API 엔드포인트 수**: 32개
