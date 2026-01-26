# 03. Service 계층 비즈니스 로직 분석

## 3.1 AuthService

**파일**: `src/main/java/cariv/exp/domain/login/service/AuthService.java`

### 의존성 주입
- `UserRepository` (라인: 26) - 사용자 조회/저장
- `CompanyRepository` (라인: 27) - 회사 조회
- `PasswordEncoder` (라인: 28) - 비밀번호 암호화
- `JwtTokenProvider` (라인: 29) - JWT 토큰 생성/검증
- `RefreshTokenService` (라인: 30) - Refresh Token 관리

### 메서드별 상세 분석

#### signup (라인: 32-51)
```java
public void signup(SignupRequest req) {
    Company company = companyRepository.findById(req.companyId())
            .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND));

    if (userRepository.existsByLoginId(req.loginId())) {
        throw new CustomException(ErrorCode.DUPLICATE_LOGIN_ID);
    }
    User user = User.builder()
            .loginId(req.loginId())
            .passwordHash(encoder.encode(req.password()))
            .active(true)
            .role(Role.STAFF)
            .build();

    user.setCompanyId(company.getId());
    userRepository.save(user);
}
```

**분석:**
- **접근 제어자**: `public`
- **반환 타입**: `void`
- **파라미터**: `SignupRequest req` - 회원가입 요청
- **트랜잭션**: 없음 (명시적 @Transactional 없음)
- **비즈니스 로직 흐름**:
  1. 회사 존재 여부 확인 (라인: 34-35)
  2. 로그인 ID 중복 체크 (라인: 37-39)
  3. User 엔티티 생성 (라인: 40-45)
  4. 비밀번호 암호화 (라인: 42)
  5. companyId 설정 (라인: 48)
  6. 저장 (라인: 50)
- **호출하는 Repository 메서드**:
  - `CompanyRepository.findById()` (라인: 34)
  - `UserRepository.existsByLoginId()` (라인: 37)
  - `UserRepository.save()` (라인: 50)
- **예외 처리**:
  - 회사 없음 → `ErrorCode.NOT_FOUND`
  - 중복 로그인 ID → `ErrorCode.DUPLICATE_LOGIN_ID`

#### login (라인: 53-69)
```java
public TokenResponse login(LoginRequest req) {
    User user = userRepository.findByLoginId(req.loginId())
            .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

    if (!encoder.matches(req.password(), user.getPasswordHash())) {
        throw new CustomException(ErrorCode.UNAUTHORIZED);
    }

    String access = jwtProvider.createAccessToken(user);
    String refresh = jwtProvider.createRefreshToken(user);

    Claims claims = jwtProvider.getClaims(refresh);
    refreshTokenService.saveNewToken(user, refresh, claims.getExpiration().toInstant());

    return new TokenResponse(access, refresh);
}
```

**분석:**
- **접근 제어자**: `public`
- **반환 타입**: `TokenResponse`
- **파라미터**: `LoginRequest req` - 로그인 요청
- **트랜잭션**: 없음
- **비즈니스 로직 흐름**:
  1. 사용자 조회 (라인: 55-56)
  2. 비밀번호 검증 (라인: 58-60)
  3. Access Token 생성 (라인: 62)
  4. Refresh Token 생성 (라인: 63)
  5. Refresh Token 저장 (라인: 65-66)
  6. 토큰 반환 (라인: 68)
- **호출하는 Service 메서드**:
  - `JwtTokenProvider.createAccessToken()` (라인: 62)
  - `JwtTokenProvider.createRefreshToken()` (라인: 63)
  - `JwtTokenProvider.getClaims()` (라인: 65)
  - `RefreshTokenService.saveNewToken()` (라인: 66)
- **예외 처리**:
  - 사용자 없음 → `ErrorCode.USER_NOT_FOUND`
  - 비밀번호 불일치 → `ErrorCode.UNAUTHORIZED`

#### refresh (라인: 71-87)
```java
public TokenResponse refresh(String refreshToken) {
    RefreshToken tokenEntity = refreshTokenService.validateRefreshToken(refreshToken)
            .orElseThrow(() -> new CustomException(ErrorCode.TOKEN_INVALID));

    User user = tokenEntity.getUser();

    String newAccess = jwtProvider.createAccessToken(user);
    String newRefresh = jwtProvider.createRefreshToken(user);

    refreshTokenService.revokeToken(refreshToken);

    Claims claims = jwtProvider.getClaims(newRefresh);
    refreshTokenService.saveNewToken(user, newRefresh, claims.getExpiration().toInstant());

    return new TokenResponse(newAccess, newRefresh);
}
```

**분석:**
- **접근 제어자**: `public`
- **반환 타입**: `TokenResponse`
- **파라미터**: `String refreshToken` - Refresh Token
- **트랜잭션**: 없음
- **비즈니스 로직 흐름**:
  1. Refresh Token 검증 (라인: 73-74)
  2. 사용자 조회 (라인: 76)
  3. 새 Access Token 생성 (라인: 78)
  4. 새 Refresh Token 생성 (라인: 79)
  5. 기존 Refresh Token 폐기 (라인: 81)
  6. 새 Refresh Token 저장 (라인: 83-84)
  7. 새 토큰 반환 (라인: 86)
- **호출하는 Service 메서드**:
  - `RefreshTokenService.validateRefreshToken()` (라인: 73)
  - `JwtTokenProvider.createAccessToken()` (라인: 78)
  - `JwtTokenProvider.createRefreshToken()` (라인: 79)
  - `RefreshTokenService.revokeToken()` (라인: 81)
  - `RefreshTokenService.saveNewToken()` (라인: 84)
- **예외 처리**:
  - 토큰 무효 → `ErrorCode.TOKEN_INVALID`

#### logout (라인: 89-91)
```java
public void logout(String refreshToken) {
    refreshTokenService.revokeToken(refreshToken);
}
```

**분석:**
- **접근 제어자**: `public`
- **반환 타입**: `void`
- **파라미터**: `String refreshToken` - Refresh Token
- **트랜잭션**: 없음
- **비즈니스 로직 흐름**:
  1. Refresh Token 폐기 (라인: 90)
- **호출하는 Service 메서드**:
  - `RefreshTokenService.revokeToken()` (라인: 90)

---

## 3.2 AdminUserService

**파일**: `src/main/java/cariv/exp/domain/login/service/AdminUserService.java`

### 의존성 주입
- `UserRepository` (라인: 26) - 사용자 조회/저장
- `CompanyRepository` (라인: 27) - 회사 조회
- `PasswordEncoder` (라인: 28) - 비밀번호 암호화

### 메서드별 상세 분석

#### createStaff (라인: 33-59)
```java
public void createStaff(Long targetCompanyId, CreateStaffRequest req, CustomUserDetails currentUser) {
    // STAFF는 staff 생성 불가
    if (currentUser.getRole() == Role.STAFF) {
        throw new CustomException(ErrorCode.FORBIDDEN);
    }

    // ADMIN은 자기 회사만 가능
    if (currentUser.getRole() == Role.ADMIN &&
            !currentUser.getCompanyId().equals(targetCompanyId)) {
        throw new CustomException(ErrorCode.TENANT_MISMATCH);
    }

    Company company = companyRepository.findById(targetCompanyId)
            .orElseThrow(() -> new CustomException(ErrorCode.NOT_FOUND));

    User staff = User.builder()
            .loginId(req.loginId())
            .passwordHash(passwordEncoder.encode(req.password()))
            .role(Role.STAFF)
            .active(true)
            .build();

    staff.setCompanyId(company.getId());
    userRepository.save(staff);
}
```

**분석:**
- **접근 제어자**: `public`
- **반환 타입**: `void`
- **파라미터**:
  - `Long targetCompanyId` - 대상 회사 ID
  - `CreateStaffRequest req` - Staff 생성 요청
  - `CustomUserDetails currentUser` - 현재 사용자 정보
- **트랜잭션**: 없음
- **비즈니스 로직 흐름**:
  1. 권한 체크 (STAFF는 생성 불가) (라인: 36-38)
  2. 회사 소속 체크 (ADMIN은 자기 회사만) (라인: 41-44)
  3. 회사 조회 (라인: 46-47)
  4. Staff 엔티티 생성 (라인: 49-54)
  5. companyId 설정 (라인: 56)
  6. 저장 (라인: 58)
- **호출하는 Repository 메서드**:
  - `CompanyRepository.findById()` (라인: 46)
  - `UserRepository.save()` (라인: 58)
- **예외 처리**:
  - STAFF 권한 → `ErrorCode.FORBIDDEN`
  - 다른 회사 접근 → `ErrorCode.TENANT_MISMATCH`
  - 회사 없음 → `ErrorCode.NOT_FOUND`

#### changeAdminPassword (라인: 65-78)
```java
public void changeAdminPassword(CustomUserDetails currentUser, ChangePasswordRequest req) {
    User admin = getUser(currentUser.getUserId());

    if (admin.getRole() != Role.ADMIN) {
        throw new CustomException(ErrorCode.FORBIDDEN);
    }

    if (!passwordEncoder.matches(req.oldPassword(), admin.getPasswordHash())) {
        throw new CustomException(ErrorCode.INVALID_PASSWORD);
    }

    admin.changePassword(passwordEncoder.encode(req.newPassword()));
}
```

**분석:**
- **접근 제어자**: `public`
- **반환 타입**: `void`
- **파라미터**:
  - `CustomUserDetails currentUser` - 현재 사용자 정보
  - `ChangePasswordRequest req` - 비밀번호 변경 요청
- **트랜잭션**: 없음
- **비즈니스 로직 흐름**:
  1. 사용자 조회 (라인: 67)
  2. ADMIN 권한 체크 (라인: 69-71)
  3. 기존 비밀번호 검증 (라인: 73-75)
  4. 새 비밀번호 암호화 및 변경 (라인: 77)
- **호출하는 메서드**:
  - `getUser()` (라인: 67) - 내부 메서드
  - `User.changePassword()` (라인: 77) - 엔티티 메서드
- **예외 처리**:
  - ADMIN 아님 → `ErrorCode.FORBIDDEN`
  - 기존 비밀번호 불일치 → `ErrorCode.INVALID_PASSWORD`

#### changeStaffPassword (라인: 84-100)
```java
public void changeStaffPassword(Long companyId, Long staffId, ChangePasswordRequest req, CustomUserDetails currentUser) {
    validateAdminOfCompany(companyId, currentUser);

    User staff = getUser(staffId);

    if (staff.getRole() != Role.STAFF) {
        throw new CustomException(ErrorCode.FORBIDDEN);
    }

    if (!staff.getCompanyId().equals(companyId)) {
        throw new CustomException(ErrorCode.TENANT_MISMATCH);
    }

    staff.changePassword(passwordEncoder.encode(req.newPassword()));
}
```

**분석:**
- **접근 제어자**: `public`
- **반환 타입**: `void`
- **파라미터**:
  - `Long companyId` - 회사 ID
  - `Long staffId` - Staff ID
  - `ChangePasswordRequest req` - 비밀번호 변경 요청
  - `CustomUserDetails currentUser` - 현재 사용자 정보
- **트랜잭션**: 없음
- **비즈니스 로직 흐름**:
  1. ADMIN 권한 및 회사 소속 검증 (라인: 86)
  2. Staff 조회 (라인: 88)
  3. STAFF 역할 체크 (라인: 90-92)
  4. 회사 소속 체크 (라인: 95-97)
  5. 비밀번호 변경 (라인: 99)
- **호출하는 메서드**:
  - `validateAdminOfCompany()` (라인: 86) - 내부 메서드
  - `getUser()` (라인: 88) - 내부 메서드
- **예외 처리**:
  - STAFF 아님 → `ErrorCode.FORBIDDEN`
  - 다른 회사 소속 → `ErrorCode.TENANT_MISMATCH`

#### deleteStaff (라인: 106-120)
```java
public void deleteStaff(Long companyId, Long staffId, CustomUserDetails currentUser) {
    validateAdminOfCompany(companyId, currentUser);
    User staff = getUser(staffId);

    if (staff.getRole() != Role.STAFF) {
        throw new CustomException(ErrorCode.FORBIDDEN);
    }

    if (!staff.getCompanyId().equals(companyId)) {
        throw new CustomException(ErrorCode.TENANT_MISMATCH);
    }

    staff.deactivate(); // soft delete
}
```

**분석:**
- **접근 제어자**: `public`
- **반환 타입**: `void`
- **파라미터**:
  - `Long companyId` - 회사 ID
  - `Long staffId` - Staff ID
  - `CustomUserDetails currentUser` - 현재 사용자 정보
- **트랜잭션**: 없음
- **비즈니스 로직 흐름**:
  1. ADMIN 권한 및 회사 소속 검증 (라인: 108)
  2. Staff 조회 (라인: 109)
  3. STAFF 역할 체크 (라인: 111-113)
  4. 회사 소속 체크 (라인: 115-117)
  5. 비활성화 (soft delete) (라인: 119)
- **호출하는 메서드**:
  - `validateAdminOfCompany()` (라인: 108)
  - `getUser()` (라인: 109)
  - `User.deactivate()` (라인: 119) - 엔티티 메서드
- **예외 처리**:
  - STAFF 아님 → `ErrorCode.FORBIDDEN`
  - 다른 회사 소속 → `ErrorCode.TENANT_MISMATCH`

#### getStaffList (라인: 143-159)
```java
public List<StaffResponse> getStaffList(Long companyId, CustomUserDetails currentUser) {
    validateAdminOfCompany(companyId, currentUser);

    List<User> staffList = userRepository
            .findAllByCompanyIdAndRole(companyId, Role.STAFF);

    return staffList.stream()
            .map(u -> new StaffResponse(
                    u.getId(),
                    u.getLoginId(),
                    u.isActive(),
                    u.getRole()
            ))
            .toList();
}
```

**분석:**
- **접근 제어자**: `public`
- **반환 타입**: `List<StaffResponse>`
- **파라미터**:
  - `Long companyId` - 회사 ID
  - `CustomUserDetails currentUser` - 현재 사용자 정보
- **트랜잭션**: 없음
- **비즈니스 로직 흐름**:
  1. ADMIN 권한 및 회사 소속 검증 (라인: 146)
  2. 회사별 STAFF 목록 조회 (라인: 148-149)
  3. DTO 변환 (라인: 151-158)
- **호출하는 Repository 메서드**:
  - `UserRepository.findAllByCompanyIdAndRole()` (라인: 148-149)

#### getMyPage (라인: 161-188)
```java
public MyPageResponse getMyPage(CustomUserDetails currentUser) {
    User user = getUser(currentUser.getUserId());
    Company company = getCompany(user.getCompanyId());
    List<StaffResponse> staffList = List.of();

    if (user.getRole() == Role.ADMIN || user.getRole() == Role.MASTER) {
        staffList = userRepository
                .findAllByCompanyIdAndRole(user.getCompanyId(), Role.STAFF)
                .stream()
                .map(u -> new StaffResponse(
                        u.getId(),
                        u.getLoginId(),
                        u.isActive(),
                        u.getRole()
                ))
                .toList();
    }

    return new MyPageResponse(
            user.getId(),
            user.getLoginId(),
            user.getEmail(),
            user.getRole(),
            company.getId(),
            company.getName(),
            staffList
    );
}
```

**분석:**
- **접근 제어자**: `public`
- **반환 타입**: `MyPageResponse`
- **파라미터**: `CustomUserDetails currentUser` - 현재 사용자 정보
- **트랜잭션**: 없음
- **비즈니스 로직 흐름**:
  1. 사용자 조회 (라인: 162)
  2. 회사 조회 (라인: 163)
  3. ADMIN/MASTER인 경우 Staff 목록 조회 (라인: 166-177)
  4. MyPageResponse 생성 및 반환 (라인: 179-187)
- **호출하는 메서드**:
  - `getUser()` (라인: 162)
  - `getCompany()` (라인: 163)
  - `UserRepository.findAllByCompanyIdAndRole()` (라인: 168-169)

---

## 3.3 BaseInfoService

**파일**: `src/main/java/cariv/exp/domain/base/service/BaseInfoService.java`

### 의존성 주입
- `BaseInfoRepository` (라인: 29) - 기본정보 조회/저장
- `BaseInfoOcrService` (라인: 30) - OCR 서비스
- `S3Upload` (라인: 31) - S3 업로드
- `S3ObjectReader` (라인: 32) - S3 다운로드

### 메서드별 상세 분석

#### get (라인: 34-39)
```java
@Transactional(readOnly = true)
public BaseInfoResponse get(Long companyId) {
    return baseInfoRepository.findByCompanyId(companyId)
            .map(this::toResponse)
            .orElseGet(() -> emptyResponse());
}
```

**분석:**
- **접근 제어자**: `public`
- **반환 타입**: `BaseInfoResponse`
- **파라미터**: `Long companyId` - 회사 ID
- **트랜잭션**: `@Transactional(readOnly = true)` - 읽기 전용
- **비즈니스 로직 흐름**:
  1. 회사별 기본정보 조회 (라인: 36)
  2. 있으면 DTO 변환, 없으면 빈 응답 반환 (라인: 37-38)
- **호출하는 Repository 메서드**:
  - `BaseInfoRepository.findByCompanyId()` (라인: 36)

#### upsert (라인: 41-58)
```java
@Transactional
public BaseInfoResponse upsert(Long companyId, BaseInfoUpsertRequest request) {
    BaseInfo baseInfo = baseInfoRepository.findByCompanyId(companyId)
            .orElseGet(() -> createEmpty(companyId));

    Set<String> normalizedCountryCodes = normalizeCountryCodes(request.getExportCountryCodes());

    baseInfo.updateBaseInfo(
            request.getName(),
            request.getNumber(),
            request.getBusinessRegistrationNumber(),
            request.getBusinessAddress(),
            normalizedCountryCodes
    );

    baseInfoRepository.save(baseInfo);
    return toResponse(baseInfo);
}
```

**분석:**
- **접근 제어자**: `public`
- **반환 타입**: `BaseInfoResponse`
- **파라미터**:
  - `Long companyId` - 회사 ID
  - `BaseInfoUpsertRequest request` - 기본정보 생성/수정 요청
- **트랜잭션**: `@Transactional` - 쓰기 트랜잭션
- **비즈니스 로직 흐름**:
  1. 기본정보 조회 또는 생성 (라인: 43-44)
  2. 국가 코드 정규화 (라인: 46)
  3. 기본정보 업데이트 (라인: 48-54)
  4. 저장 (라인: 56)
  5. 응답 변환 (라인: 57)
- **호출하는 Repository 메서드**:
  - `BaseInfoRepository.findByCompanyId()` (라인: 43)
  - `BaseInfoRepository.save()` (라인: 56)
- **호출하는 내부 메서드**:
  - `createEmpty()` (라인: 44)
  - `normalizeCountryCodes()` (라인: 46)
  - `BaseInfo.updateBaseInfo()` (라인: 48-54) - 엔티티 메서드
  - `toResponse()` (라인: 57)

#### uploadDocument (라인: 60-76)
```java
@Transactional
public BaseInfoDocumentsResponse uploadDocument(Long companyId, BaseInfoDocumentType documentType, MultipartFile document) {
    BaseInfo baseInfo = baseInfoRepository.findByCompanyId(companyId)
            .orElseGet(() -> createEmpty(companyId));

    String s3Key = uploadBaseInfoDocument(companyId, documentType, document);

    switch (documentType) {
        case SIGN -> baseInfo.updateDocuments(s3Key, baseInfo.getSealS3Key(), baseInfo.getCeoIdS3Key(), baseInfo.getBizRegS3Key());
        case SEAL -> baseInfo.updateDocuments(baseInfo.getSignS3Key(), s3Key, baseInfo.getCeoIdS3Key(), baseInfo.getBizRegS3Key());
        case CEO_ID -> baseInfo.updateDocuments(baseInfo.getSignS3Key(), baseInfo.getSealS3Key(), s3Key, baseInfo.getBizRegS3Key());
        case BIZ_REG -> baseInfo.updateDocuments(baseInfo.getSignS3Key(), baseInfo.getSealS3Key(), baseInfo.getCeoIdS3Key(), s3Key);
    }

    baseInfoRepository.save(baseInfo);
    return toDocumentsResponse(baseInfo);
}
```

**분석:**
- **접근 제어자**: `public`
- **반환 타입**: `BaseInfoDocumentsResponse`
- **파라미터**:
  - `Long companyId` - 회사 ID
  - `BaseInfoDocumentType documentType` - 문서 타입
  - `MultipartFile document` - 문서 파일
- **트랜잭션**: `@Transactional` - 쓰기 트랜잭션
- **비즈니스 로직 흐름**:
  1. 기본정보 조회 또는 생성 (라인: 62-63)
  2. S3 업로드 (라인: 65)
  3. 문서 타입별로 S3 Key 업데이트 (라인: 67-72)
  4. 저장 (라인: 74)
  5. 응답 변환 (라인: 75)
- **호출하는 메서드**:
  - `uploadBaseInfoDocument()` (라인: 65) - 내부 메서드
  - `BaseInfo.updateDocuments()` (라인: 68-71) - 엔티티 메서드
  - `BaseInfoRepository.save()` (라인: 74)
  - `toDocumentsResponse()` (라인: 75)

#### parseBusinessRegistration (라인: 101-120)
```java
@Transactional
public BaseInfoOcrResponse parseBusinessRegistration(Long companyId, MultipartFile document) {
    BaseInfoOcrParserService.BaseInfoOcrData data = baseInfoOcrService.parseBusinessRegistration(document);
    BaseInfo baseInfo = baseInfoRepository.findByCompanyId(companyId)
            .orElseGet(() -> createEmpty(companyId));

    baseInfo.applyOcrData(
            data.name(),
            data.businessRegistrationNumber(),
            data.businessAddress()
    );
    baseInfoRepository.save(baseInfo);

    return new BaseInfoOcrResponse(
            baseInfo.getId(),
            baseInfo.getName(),
            baseInfo.getBusinessRegistrationNumber(),
            baseInfo.getBusinessAddress()
    );
}
```

**분석:**
- **접근 제어자**: `public`
- **반환 타입**: `BaseInfoOcrResponse`
- **파라미터**:
  - `Long companyId` - 회사 ID
  - `MultipartFile document` - 사업자등록증 파일
- **트랜잭션**: `@Transactional` - 쓰기 트랜잭션
- **비즈니스 로직 흐름**:
  1. OCR 파싱 (라인: 103)
  2. 기본정보 조회 또는 생성 (라인: 104-105)
  3. OCR 데이터 적용 (라인: 107-111)
  4. 저장 (라인: 112)
  5. 응답 생성 (라인: 114-119)
- **호출하는 Service 메서드**:
  - `BaseInfoOcrService.parseBusinessRegistration()` (라인: 103)
- **호출하는 Repository 메서드**:
  - `BaseInfoRepository.findByCompanyId()` (라인: 104)
  - `BaseInfoRepository.save()` (라인: 112)
- **호출하는 엔티티 메서드**:
  - `BaseInfo.applyOcrData()` (라인: 107-111)

---

## 3.4 DocumentService

**파일**: `src/main/java/cariv/exp/domain/document/service/DocumentService.java`

### 의존성 주입
- `DocumentRepository` (라인: 47) - 문서 조회/저장
- `DocumentAsyncProcessor` (라인: 48) - 비동기 문서 처리
- `ApplicationEventPublisher` (라인: 49) - 이벤트 발행
- `ObjectMapper` (라인: 50) - JSON 처리
- `ExportRepository` (라인: 51) - 수출 증명서 조회
- `RegistrationCertificateRepository` (라인: 52) - 등록증 조회
- `DeRegistrationCertificateRepository` (라인: 53) - 말소등록증 조회
- `AuctionCertificateRepository` (라인: 54) - 경매증 조회
- `TaxInvoiceRepository` (라인: 55) - 세금계산서 조회

### 메서드별 상세 분석

#### uploadMany (라인: 57-82)
```java
@Transactional
public List<DocumentRowResponse> uploadMany(Long companyId, MultipartFile[] files) throws IOException {
    List<DocumentRowResponse> rows = new ArrayList<>();

    for (MultipartFile file : files) {
        Documents doc = Documents.builder()
                .fileName(file.getOriginalFilename())
                .sizeBytes(file.getSize())
                .type(DocumentType.UNKNOWN)
                .status(DocumentStatus.PROCESSING)
                .build();

        doc.setCompanyId(companyId);

        doc = documentRepository.save(doc);

        Path tmp = Files.createTempFile("up-", "-" + safe(file.getOriginalFilename()));
        file.transferTo(tmp.toFile());

        publisher.publishEvent(new DocumentProcessEvent(doc.getId(), tmp.toString(), file.getOriginalFilename()));
        rows.add(toRow(doc));
    }
    return rows;
}
```

**분석:**
- **접근 제어자**: `public`
- **반환 타입**: `List<DocumentRowResponse>`
- **파라미터**:
  - `Long companyId` - 회사 ID
  - `MultipartFile[] files` - 문서 파일 배열
- **트랜잭션**: `@Transactional` - 쓰기 트랜잭션
- **비즈니스 로직 흐름**:
  1. 각 파일에 대해 반복 (라인: 61)
  2. Documents 엔티티 생성 (PROCESSING 상태) (라인: 62-67)
  3. companyId 설정 (라인: 70)
  4. 저장 (라인: 72)
  5. 임시 파일 생성 및 저장 (라인: 74-75)
  6. 비동기 처리 이벤트 발행 (라인: 77)
  7. 응답 목록에 추가 (라인: 78)
- **호출하는 Repository 메서드**:
  - `DocumentRepository.save()` (라인: 72)
- **부가 효과**:
  - 임시 파일 생성 (라인: 74)
  - 이벤트 발행 (라인: 77) - 비동기 파싱 트리거

#### list (라인: 84-93)
```java
@Transactional(readOnly = true)
public List<DocumentRowResponse> list(Long companyId, DocumentStatus statusOrNull, int size) {
    var pageable = PageRequest.of(0, size);

    List<Documents> docs = (statusOrNull == null)
            ? documentRepository.findByCompanyIdOrderByCreatedAtDesc(companyId, pageable)
            : documentRepository.findByCompanyIdAndStatusOrderByCreatedAtDesc(companyId, statusOrNull, pageable);

    return docs.stream().map(this::toRow).toList();
}
```

**분석:**
- **접근 제어자**: `public`
- **반환 타입**: `List<DocumentRowResponse>`
- **파라미터**:
  - `Long companyId` - 회사 ID
  - `DocumentStatus statusOrNull` - 상태 필터 (선택)
  - `int size` - 조회 개수
- **트랜잭션**: `@Transactional(readOnly = true)` - 읽기 전용
- **비즈니스 로직 흐름**:
  1. 페이지 요청 생성 (라인: 86)
  2. 상태 필터에 따라 조회 (라인: 88-90)
  3. DTO 변환 (라인: 92)
- **호출하는 Repository 메서드**:
  - `DocumentRepository.findByCompanyIdOrderByCreatedAtDesc()` (라인: 89)
  - `DocumentRepository.findByCompanyIdAndStatusOrderByCreatedAtDesc()` (라인: 90)

#### getDetail (라인: 110-152)
```java
@Transactional(readOnly = true)
public DocumentDetailResponse getDetail(Long companyId, Long documentId) {
    Documents doc = documentRepository.findByIdAndCompanyId(documentId, companyId)
            .orElseThrow(() -> new IllegalArgumentException("Document not found"));

    DocumentType type = doc.getType();
    List<String> required = DocumentFieldKeys.requiredKeys(type);

    LinkedHashMap<String, String> values = new LinkedHashMap<>();
    for (String k : required) values.put(k, "");

    if (doc.getStatus() == DocumentStatus.DONE && doc.getRelatedId() != null) {
        fillValuesByType(companyId, type, doc.getRelatedId(), values);
    }

    List<String> missing = required.stream()
            .filter(k -> isBlank(values.get(k)))
            .toList();

    if (doc.getStatus() == DocumentStatus.FAILED) {
        List<String> parsed = tryParseMissingKeys(doc.getMissingFieldsJson());
        if (!parsed.isEmpty()) missing = parsed;
    }

    String documentType = (type == null) ? "UNKNOWN"
            : (type.displayName() != null ? type.displayName() : type.name());

    return new DocumentDetailResponse(
            doc.getId(),
            doc.getFileName(),
            type,
            documentType,
            doc.getStatus().name(),
            doc.getRelatedId(),
            values,
            missing,
            doc.getErrorMessage()
    );
}
```

**분석:**
- **접근 제어자**: `public`
- **반환 타입**: `DocumentDetailResponse`
- **파라미터**:
  - `Long companyId` - 회사 ID
  - `Long documentId` - 문서 ID
- **트랜잭션**: `@Transactional(readOnly = true)` - 읽기 전용
- **비즈니스 로직 흐름**:
  1. 문서 조회 (라인: 112-113)
  2. 문서 타입별 필수 필드 목록 조회 (라인: 115-116)
  3. 빈 값 맵 초기화 (라인: 118-119)
  4. DONE 상태이고 relatedId가 있으면 값 채우기 (라인: 122-124)
  5. 빈 필드 목록 추출 (라인: 127-129)
  6. FAILED 상태면 파싱된 missingFields 사용 (라인: 132-135)
  7. 응답 생성 (라인: 141-151)
- **호출하는 Repository 메서드**:
  - `DocumentRepository.findByIdAndCompanyId()` (라인: 112)
- **호출하는 내부 메서드**:
  - `fillValuesByType()` (라인: 124) - 타입별 값 채우기
  - `isBlank()` (라인: 128)
  - `tryParseMissingKeys()` (라인: 134)

---

## 3.5 AuctionService

**파일**: `src/main/java/cariv/exp/domain/auction/service/AuctionService.java`

### 의존성 주입
- `AuctionParserService` (라인: 17) - 경매증 파싱
- `AuctionCertificateRepository` (라인: 18) - 경매증 저장

### 메서드별 상세 분석

#### handleUpload (라인: 19-41)
```java
@Transactional
public AuctionResponse handleUpload(Long companyId, UpstageResponse res, String rawJson) {
    AuctionParseResult result = parserService.parse(res);
    AuctionInfo info = result.info();

    AuctionCertificate cert = AuctionCertificate.builder()
            .registrationNo(info.registrationNo())
            .chassisNo(info.chassisNo())
            .model(info.model())
            .modelYear(info.modelYear())
            .mileage(info.mileage())
            .displacement(info.displacement())
            .initialRegistrationDate(info.initialRegistrationDate())
            .fuel(info.fuel())
            .color(info.color())
            .rawJson(rawJson)
            .build();

    cert.setCompanyId(companyId);
    repository.save(cert);

    return new AuctionResponse(result.missingFields(), cert.getId());
}
```

**분석:**
- **접근 제어자**: `public`
- **반환 타입**: `AuctionResponse`
- **파라미터**:
  - `Long companyId` - 회사 ID
  - `UpstageResponse res` - Upstage OCR 응답
  - `String rawJson` - 원본 JSON
- **트랜잭션**: `@Transactional` - 쓰기 트랜잭션
- **비즈니스 로직 흐름**:
  1. OCR 응답 파싱 (라인: 21)
  2. 경매증 정보 추출 (라인: 22)
  3. AuctionCertificate 엔티티 생성 (라인: 24-35)
  4. companyId 설정 (라인: 37)
  5. 저장 (라인: 38)
  6. 응답 생성 (라인: 40)
- **호출하는 Service 메서드**:
  - `AuctionParserService.parse()` (라인: 21)
- **호출하는 Repository 메서드**:
  - `AuctionCertificateRepository.save()` (라인: 38)

---

## 3.6 VehicleService

**파일**: `src/main/java/cariv/exp/domain/vehicle/service/VehicleService.java`

### 의존성 주입
- `VehicleRepository` (라인: 35) - 차량 조회/저장
- `VehiclePurchaseRepository` (라인: 36) - 차량 구매 조회/저장
- `BaseInfoRepository` (라인: 37) - 기본정보 조회
- `DeRegistrationCertificateRepository` (라인: 38) - 말소등록증 조회

### 주요 메서드

#### upsertFromRegistration (라인: 50-82)
- 등록증 정보로부터 차량 생성/업데이트
- VIN 추출 및 정규화
- Vehicle 엔티티에 등록증 스냅샷 적용

#### update (라인: 90-152)
- 차량관리 정보 수정
- VehiclePurchase, DeRegistrationCertificate 연동 업데이트

#### getManagement (라인: 162-215)
- 차량관리 상세 정보 조회
- Vehicle, VehiclePurchase, DeRegistrationCertificate, BaseInfo 통합 조회

#### listManagement (라인: 216-311)
- 차량관리 목록 조회
- 복잡한 필터링 및 검색 로직
- 날짜 범위, 단계, 검색 필드 지원

---

## 3.7 DeRegistrationService

**파일**: `src/main/java/cariv/exp/domain/malso/service/DeRegistrationService.java`

### 의존성 주입
- `DeRegistrationParserService` (라인: 39) - 말소등록증 파싱
- `DeRegistrationCertificateRepository` (라인: 40) - 말소등록증 저장
- `DeRegistrationSummaryValidator` (라인: 41) - 요약 검증
- `VehicleRepository` (라인: 42) - 차량 조회/저장
- `DocumentRepository` (라인: 43) - 문서 저장
- `S3Upload` (라인: 44) - S3 업로드

### 주요 메서드

#### handleUpload (라인: 46-114)
- 말소등록증 OCR 파싱 및 저장
- VIN 정규화
- Vehicle 연결 및 단계 변경 (DEREG_COMPLETED)

#### uploadCertificate (라인: 164-216)
- 말소등록증 파일 업로드
- Documents 엔티티 생성 및 S3 업로드
- Vehicle 단계 변경

---

## 3.8 ExportCertificateService

**파일**: `src/main/java/cariv/exp/domain/export/service/ExportCertificateService.java`

### 의존성 주입
- `ExportParserService` (라인: 25) - 수출 증명서 파싱
- `ExportRepository` (라인: 26) - 수출 증명서 저장
- `ExportSummaryValidator` (라인: 27) - 요약 검증
- `VehicleRepository` (라인: 28) - 차량 조회/저장

### 주요 메서드

#### handleUpload (라인: 30-81)
- 수출 증명서 OCR 파싱 및 저장
- Vehicle 연결

#### list (라인: 82-105)
- 수출신고필증 현황 목록 조회
- 차량 단계 및 날짜 범위 필터링

---

## 3.9 RegistrationService

**파일**: `src/main/java/cariv/exp/domain/registration/service/RegistrationService.java`

### 의존성 주입
- `RegistrationParserService` (라인: 19) - 등록증 파싱
- `RegistrationCertificateRepository` (라인: 20) - 등록증 저장
- `VehicleService` (라인: 21) - 차량 서비스

### 주요 메서드

#### handleParsed (라인: 23-55)
- 등록증 OCR 파싱 및 저장
- Vehicle 생성/업데이트 (upsertFromRegistration 호출)

---

## 3.10 InvoiceService

**파일**: `src/main/java/cariv/exp/domain/invoice/service/InvoiceService.java`

### 의존성 주입
- `InvoiceParserService` (라인: 16) - 세금계산서 파싱
- `TaxInvoiceRepository` (라인: 17) - 세금계산서 저장

### 주요 메서드

#### handleUpload (라인: 19-34)
- 세금계산서 OCR 파싱 및 저장
- rawJson 저장

---

## 3.11 UpstageService

**파일**: `src/main/java/cariv/exp/domain/upstage/service/UpstageService.java`

### 의존성 주입
- `WebClient upstageWebClient` (라인: 24) - Upstage OCR API 호출용 WebClient

### 주요 메서드

#### parseDocuments (라인: 30-75)
- Upstage OCR API 호출
- 재시도 로직 포함 (최대 5회)
- 429, 5xx 에러만 재시도
- 지수 백오프 및 jitter 적용

---

## 3.12 DocumentOrchestrationService

**파일**: `src/main/java/cariv/exp/domain/upstage/service/DocumentOrchestrationService.java`

### 의존성 주입
- `UpstageService` (라인: 22) - OCR 서비스
- `ObjectMapper` (라인: 23) - JSON 처리
- `ExportCertificateService` (라인: 25)
- `DeRegistrationService` (라인: 26)
- `RegistrationService` (라인: 27)
- `AuctionService` (라인: 28)
- `InvoiceService` (라인: 29)

### 주요 메서드

#### handleUpload (라인: 32-37)
- 문서 업로드 처리
- OCR 호출 → 타입 감지 → 타입별 서비스 위임

#### handleParsed (라인: 40-50)
- 이미 파싱된 문서 처리
- 문서 타입별로 적절한 서비스 호출

---

## 3.13 Service 간 의존성 그래프

```
AuthService
  → UserRepository
  → CompanyRepository
  → JwtTokenProvider
  → RefreshTokenService

AdminUserService
  → UserRepository
  → CompanyRepository

BaseInfoService
  → BaseInfoRepository
  → BaseInfoOcrService
  → S3Upload
  → S3ObjectReader

DocumentService
  → DocumentRepository
  → DocumentAsyncProcessor
  → ApplicationEventPublisher
  → ExportRepository
  → RegistrationCertificateRepository
  → DeRegistrationCertificateRepository
  → AuctionCertificateRepository
  → TaxInvoiceRepository

DocumentOrchestrationService
  → UpstageService
  → ExportCertificateService
  → DeRegistrationService
  → RegistrationService
  → AuctionService
  → InvoiceService

RegistrationService
  → RegistrationParserService
  → RegistrationCertificateRepository
  → VehicleService

VehicleService
  → VehicleRepository
  → VehiclePurchaseRepository
  → BaseInfoRepository
  → DeRegistrationCertificateRepository

DeRegistrationService
  → DeRegistrationParserService
  → DeRegistrationCertificateRepository
  → VehicleRepository
  → DocumentRepository
  → S3Upload

ExportCertificateService
  → ExportParserService
  → ExportRepository
  → VehicleRepository

AuctionService
  → AuctionParserService
  → AuctionCertificateRepository

InvoiceService
  → InvoiceParserService
  → TaxInvoiceRepository
```
