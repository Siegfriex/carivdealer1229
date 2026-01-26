# 07. 예외 처리 분석

## 7.1 ErrorCode

**파일**: `src/main/java/cariv/exp/global/exception/ErrorCode.java`

### 에러 코드 목록

| 코드 | HTTP Status | 메시지 | 사용 위치 |
|------|-------------|--------|-----------|
| INVALID_INPUT | 400 | 잘못된 요청입니다. | GlobalExceptionHandler (Validation 에러) |
| NOT_FOUND | 404 | 대상을 찾을 수 없습니다. | AuthService.signup() (회사 없음), AdminUserService |
| FORBIDDEN | 403 | 권한이 없습니다. | AdminUserService (권한 체크), GlobalExceptionHandler (AccessDeniedException) |
| UNAUTHORIZED | 401 | 로그인이 필요합니다. | AuthService.login() (비밀번호 불일치) |
| USER_NOT_FOUND | 404 | 유저를 찾을 수 없습니다. | AuthService.login() |
| DUPLICATE_LOGIN_ID | 400 | 로그인 ID가 이미 존재합니다. | AuthService.signup() |
| INVALID_PASSWORD | 404 | 비밀번호가 일치하지 않습니다 | AdminUserService.changeAdminPassword() |
| TOKEN_EXPIRED | 401 | 토큰이 만료되었습니다. | JwtTokenProvider.validate() |
| TOKEN_INVALID | 401 | 유효하지 않은 토큰입니다. | JwtTokenProvider.validate(), AuthService.refresh() |
| REFRESH_TOKEN_EXPIRED | 401 | Refresh Token이 만료되었습니다. | - |
| REFRESH_TOKEN_REVOKED | 401 | Refresh Token이 폐기되었습니다. | - |
| TENANT_MISMATCH | 403 | 회사 데이터 접근 권한이 없습니다. | AdminUserService (회사 소속 체크) |

### ErrorCode 구조 (라인: 7-34)
```java
@Getter
public enum ErrorCode {
    // 각 에러 코드는 HttpStatus, code, message를 가짐
    
    private final HttpStatus status;
    private final String code;
    private final String message;
}
```

**분석:**
- 각 에러 코드는 HTTP Status, 코드 문자열, 메시지를 포함
- 생성자에서 초기화 (라인: 29-33)

---

## 7.2 CustomException

**파일**: `src/main/java/cariv/exp/global/exception/CustomException.java`

### 구조 분석

```java
@Getter
public class CustomException extends RuntimeException {
    private final ErrorCode errorCode;

    public CustomException(ErrorCode errorCode) {
        super(errorCode.getMessage());
        this.errorCode = errorCode;
    }
}
```

**분석:**
- **상속**: `RuntimeException`
- **역할**: ErrorCode를 포함하는 커스텀 예외
- **사용 위치**: 모든 Service에서 비즈니스 로직 예외 발생 시 사용

---

## 7.3 ErrorResponse

**파일**: `src/main/java/cariv/exp/global/exception/ErrorResponse.java`

### 구조 분석

```java
@Getter
@Builder
public class ErrorResponse {
    private final String code;
    private final String message;
    private final int status;
    private final String timestamp;
}
```

**분석:**
- **역할**: 클라이언트에게 반환되는 에러 응답 DTO
- **필드**:
  - `code`: 에러 코드 문자열
  - `message`: 에러 메시지
  - `status`: HTTP 상태 코드
  - `timestamp`: 에러 발생 시간

---

## 7.4 GlobalExceptionHandler

**파일**: `src/main/java/cariv/exp/global/exception/GlobalExceptionHandler.java`

### 기본 정보
- **어노테이션**: `@RestControllerAdvice` (라인: 17) - 전역 예외 처리
- **로깅**: `@Slf4j` 사용

### 예외 처리 메서드 분석

#### build (라인: 20-30)
```java
private ResponseEntity<ErrorResponse> build(ErrorCode code) {
    ErrorResponse response = ErrorResponse.builder()
            .code(code.getCode())
            .message(code.getMessage())
            .status(code.getStatus().value())
            .timestamp(LocalDateTime.now().toString())
            .build();

    return ResponseEntity.status(code.getStatus()).body(response);
}
```

**분석:**
- **역할**: ErrorCode를 ErrorResponse로 변환하는 헬퍼 메서드
- **사용 위치**: 모든 예외 처리 메서드에서 공통 사용

#### handleCustom (라인: 33-37)
```java
@ExceptionHandler(CustomException.class)
public ResponseEntity<ErrorResponse> handleCustom(CustomException ex) {
    log.warn("[CustomException] {}", ex.getErrorCode().getMessage());
    return build(ex.getErrorCode());
}
```

**분석:**
- **처리하는 예외**: `CustomException`
- **HTTP Status**: ErrorCode의 status
- **응답 형식**: `ErrorResponse`
- **로깅**: WARN 레벨로 로깅
- **사용 위치**: 모든 Service에서 발생하는 CustomException 처리

#### handleExpiredJwtException (라인: 40-43)
```java
@ExceptionHandler(ExpiredJwtException.class)
public ResponseEntity<ErrorResponse> handleExpiredJwtException(ExpiredJwtException ex) {
    return build(ErrorCode.TOKEN_EXPIRED);
}
```

**분석:**
- **처리하는 예외**: `ExpiredJwtException` (JWT 만료)
- **HTTP Status**: 401 (UNAUTHORIZED)
- **응답 형식**: `ErrorResponse` (code: TOKEN_EXPIRED)
- **로깅**: 없음
- **사용 위치**: JwtTokenProvider.validate()에서 발생

#### handleJwtException (라인: 46-49)
```java
@ExceptionHandler(JwtException.class)
public ResponseEntity<ErrorResponse> handleJwtException(JwtException ex) {
    return build(ErrorCode.TOKEN_INVALID);
}
```

**분석:**
- **처리하는 예외**: `JwtException` (JWT 조작/유효하지 않음)
- **HTTP Status**: 401 (UNAUTHORIZED)
- **응답 형식**: `ErrorResponse` (code: TOKEN_INVALID)
- **로깅**: 없음
- **사용 위치**: JwtTokenProvider.validate()에서 발생

#### handleAccessDenied (라인: 52-55)
```java
@ExceptionHandler(AccessDeniedException.class)
public ResponseEntity<ErrorResponse> handleAccessDenied(AccessDeniedException ex) {
    return build(ErrorCode.FORBIDDEN);
}
```

**분석:**
- **처리하는 예외**: `AccessDeniedException` (권한 부족)
- **HTTP Status**: 403 (FORBIDDEN)
- **응답 형식**: `ErrorResponse` (code: FORBIDDEN)
- **로깅**: 없음
- **사용 위치**: Spring Security에서 권한 체크 실패 시 발생

#### handleValidError (라인: 58-61)
```java
@ExceptionHandler(MethodArgumentNotValidException.class)
public ResponseEntity<ErrorResponse> handleValidError(MethodArgumentNotValidException ex) {
    return build(ErrorCode.INVALID_INPUT);
}
```

**분석:**
- **처리하는 예외**: `MethodArgumentNotValidException` (@Valid 검증 실패)
- **HTTP Status**: 400 (BAD_REQUEST)
- **응답 형식**: `ErrorResponse` (code: INVALID_INPUT)
- **로깅**: 없음
- **사용 위치**: @Valid 어노테이션 검증 실패 시 발생

#### handleConstraint (라인: 64-67)
```java
@ExceptionHandler(ConstraintViolationException.class)
public ResponseEntity<ErrorResponse> handleConstraint(ConstraintViolationException ex) {
    return build(ErrorCode.INVALID_INPUT);
}
```

**분석:**
- **처리하는 예외**: `ConstraintViolationException` (QueryParam 검증 실패)
- **HTTP Status**: 400 (BAD_REQUEST)
- **응답 형식**: `ErrorResponse` (code: INVALID_INPUT)
- **로깅**: 없음
- **사용 위치**: @RequestParam 검증 실패 시 발생

#### handleInvalidJson (라인: 70-73)
```java
@ExceptionHandler(HttpMessageNotReadableException.class)
public ResponseEntity<ErrorResponse> handleInvalidJson(HttpMessageNotReadableException ex) {
    return build(ErrorCode.INVALID_INPUT);
}
```

**분석:**
- **처리하는 예외**: `HttpMessageNotReadableException` (JSON 파싱 에러)
- **HTTP Status**: 400 (BAD_REQUEST)
- **응답 형식**: `ErrorResponse` (code: INVALID_INPUT)
- **로깅**: 없음
- **사용 위치**: @RequestBody JSON 파싱 실패 시 발생

#### handleException (라인: 76-80)
```java
@ExceptionHandler(Exception.class)
public ResponseEntity<ErrorResponse> handleException(Exception ex) {
    log.error("[Exception] ", ex);
    return build(ErrorCode.INVALID_INPUT);
}
```

**분석:**
- **처리하는 예외**: `Exception` (모든 예외의 기본 클래스)
- **HTTP Status**: 400 (BAD_REQUEST)
- **응답 형식**: `ErrorResponse` (code: INVALID_INPUT)
- **로깅**: ERROR 레벨로 전체 스택 트레이스 로깅
- **사용 위치**: 위에서 처리하지 못한 모든 예외 처리 (fallback)

---

## 7.5 DeRegistrationExceptionHandler

**파일**: `src/main/java/cariv/exp/domain/malso/exception/DeRegistrationExceptionHandler.java`

### 기본 정보
- **어노테이션**: `@RestControllerAdvice` (라인: 11) - 말소 관련 Controller만 타겟팅
- **역할**: 도메인별 예외 처리 (말소등록증 검증 실패)

### 예외 처리 메서드 분석

#### handleInvalidDeRegistrationSummary (라인: 14-24)
```java
@ExceptionHandler(InvalidDeRegistrationSummaryException.class)
public ResponseEntity<?> handleInvalidDeRegistrationSummary(InvalidDeRegistrationSummaryException e) {
    Map<String, Object> body = Map.of(
            "message", e.getMessage(),
            "errors", e.getErrors()
    );

    return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body);
}
```

**분석:**
- **처리하는 예외**: `InvalidDeRegistrationSummaryException`
- **HTTP Status**: 400 (BAD_REQUEST)
- **응답 형식**: `Map<String, Object>` (message, errors)
- **로깅**: 없음
- **사용 위치**: 말소등록증 검증 실패 시 발생

---

## 7.6 InvalidDeRegistrationSummaryException

**파일**: `src/main/java/cariv/exp/domain/malso/exception/InvalidDeRegistrationSummaryException.java`

### 구조 분석

```java
public class InvalidDeRegistrationSummaryException extends RuntimeException {
    private final List<String> errors;

    public InvalidDeRegistrationSummaryException(List<String> errors) {
        super("말소등록 요약 정보 검증 실패");
        this.errors = errors;
    }
}
```

**분석:**
- **상속**: `RuntimeException`
- **역할**: 말소등록증 검증 실패 예외
- **필드**: `errors` - 검증 실패 필드 목록
- **사용 위치**: `DeRegistrationSummaryValidator`에서 발생

---

## 7.7 Service에서 사용하는 ErrorCode 추적

### AuthService
- `ErrorCode.NOT_FOUND` (라인: 35) - 회사 없음
- `ErrorCode.DUPLICATE_LOGIN_ID` (라인: 38) - 중복 로그인 ID
- `ErrorCode.USER_NOT_FOUND` (라인: 56) - 사용자 없음
- `ErrorCode.UNAUTHORIZED` (라인: 59) - 비밀번호 불일치
- `ErrorCode.TOKEN_INVALID` (라인: 74) - Refresh Token 무효

### AdminUserService
- `ErrorCode.FORBIDDEN` (라인: 37, 70, 91, 112, 133) - 권한 없음
- `ErrorCode.TENANT_MISMATCH` (라인: 43, 96, 116, 139) - 회사 소속 불일치
- `ErrorCode.NOT_FOUND` (라인: 47, 192, 197) - 엔티티 없음
- `ErrorCode.INVALID_PASSWORD` (라인: 74) - 비밀번호 불일치

### JwtTokenProvider
- `ErrorCode.TOKEN_EXPIRED` (라인: 86) - 토큰 만료
- `ErrorCode.TOKEN_INVALID` (라인: 88) - 토큰 무효

---

## 7.8 예외 처리 흐름 다이어그램

```
[Service Layer]
    ↓ throw CustomException(ErrorCode.XXX)
[GlobalExceptionHandler]
    ├─ handleCustom() → ErrorResponse 반환
    ├─ handleExpiredJwtException() → TOKEN_EXPIRED
    ├─ handleJwtException() → TOKEN_INVALID
    ├─ handleAccessDenied() → FORBIDDEN
    ├─ handleValidError() → INVALID_INPUT
    ├─ handleConstraint() → INVALID_INPUT
    ├─ handleInvalidJson() → INVALID_INPUT
    └─ handleException() → INVALID_INPUT (fallback)
    ↓
[HTTP Response]
    └─ ErrorResponse (code, message, status, timestamp)
```

---

## 7.9 예외 처리 우선순위

1. **CustomException** - 비즈니스 로직 예외 (가장 구체적)
2. **ExpiredJwtException** - JWT 만료
3. **JwtException** - JWT 무효
4. **AccessDeniedException** - 권한 부족
5. **MethodArgumentNotValidException** - @Valid 검증 실패
6. **ConstraintViolationException** - QueryParam 검증 실패
7. **HttpMessageNotReadableException** - JSON 파싱 실패
8. **Exception** - 모든 예외의 기본 (fallback)

---

## 7.10 도메인별 예외 처리

### 말소 도메인
- `DeRegistrationExceptionHandler` - 말소 관련 예외 전용 처리
- `InvalidDeRegistrationSummaryException` - 검증 실패 예외

### 전역 예외 처리
- `GlobalExceptionHandler` - 모든 도메인의 공통 예외 처리
