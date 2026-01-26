# 코드베이스 완전 해부 분석 프롬프트

## 📋 분석 목표
이 코드베이스를 **코드 라인 단위**로 완전히 분석하여 다음 항목들을 체계적으로 문서화합니다:
- API 엔드포인트 명세 (HTTP 메서드, 경로, 파라미터, 응답)
- 비즈니스 로직 흐름 (Service 계층)
- 데이터 파싱 로직 (Parser 서비스)
- 데이터베이스 스키마 (Entity, Repository)
- 보안 및 인증/인가 메커니즘
- 예외 처리 및 에러 코드
- 전역 설정 및 인프라 구성

---

## 🔍 1단계: 프로젝트 구조 파악

### 1.1 프로젝트 메타데이터 분석
```
- [ ] build.gradle 파일 분석
  - Spring Boot 버전: ___
  - Java 버전: ___
  - 주요 의존성 라이브러리 목록:
    - Spring Data JPA: ___
    - Spring Security: ___
    - JWT 라이브러리: ___
    - Swagger/OpenAPI: ___
    - 기타: ___
  
- [ ] 메인 애플리케이션 클래스 분석
  - 파일 경로: ___
  - 패키지 구조: ___
  - 활성화된 설정: ___
```

### 1.2 디렉토리 구조 매핑
```
각 도메인별로 다음 구조 확인:
- domain/
  - [도메인명]/
    - controller/ (파일 수: ___)
    - service/ (파일 수: ___)
    - repository/ (파일 수: ___)
    - entity/ (파일 수: ___)
    - dto/ (파일 수: ___)
    - 기타 (파일 수: ___)

- global/
  - config/ (파일 수: ___)
  - exception/ (파일 수: ___)
  - security/ (파일 수: ___)
  - jwt/ (파일 수: ___)
  - 기타 (파일 수: ___)
```

---

## 🌐 2단계: API 엔드포인트 완전 분석

### 2.1 Controller 파일별 상세 분석

**각 Controller 파일에 대해 다음 정보를 라인별로 추출:**

#### 템플릿:
```markdown
### [Controller명] (파일: [경로])

#### 기본 정보
- Base Path: `[@RequestMapping 경로]`
- Swagger Tag: `[@Tag name]`
- 설명: `[@Tag description]`

#### 엔드포인트 목록

##### 1. [메서드명] (라인: [시작라인]-[종료라인])
```java
[실제 메서드 코드 전체]
```

**분석:**
- HTTP Method: `[GET/POST/PUT/DELETE/PATCH]`
- Full Path: `[Base Path] + [@GetMapping/@PostMapping 경로]`
- 인증 필요 여부: `[예/아니오]`
- 권한 요구사항: `[@PreAuthorize 등]`
- 요청 파라미터:
  - `@PathVariable`: `[변수명: 타입]` - 설명
  - `@RequestParam`: `[변수명: 타입]` - 필수여부, 기본값, 설명
  - `@RequestBody`: `[DTO 클래스명]` - 필드 상세
  - `@RequestPart`: `[변수명: 타입]` - 설명
  - `@AuthenticationPrincipal`: `[타입]` - 설명
- 응답 타입: `[ResponseEntity<DTO> 또는 직접 타입]`
- Swagger Operation:
  - Summary: `[@Operation summary]`
  - Description: `[@Operation description]`
- 호출되는 Service 메서드: `[Service명].[메서드명]`
- 예외 처리: `[발생 가능한 예외 및 ErrorCode]`
```

### 2.2 API 엔드포인트 통합 목록

**모든 엔드포인트를 다음 형식으로 정리:**

| 순번 | HTTP Method | Path | Controller | 메서드명 | 인증 | 설명 |
|------|-------------|------|------------|----------|------|------|
| 1 | GET | `/api/auth/...` | AuthController | ... | ❌ | ... |
| 2 | POST | `/api/auth/login` | AuthController | login | ❌ | 로그인 |

---

## 🔧 3단계: Service 계층 비즈니스 로직 분석

### 3.1 Service 파일별 상세 분석

**각 Service 파일에 대해:**

```markdown
### [Service명] (파일: [경로])

#### 의존성 주입
- `[Repository/Service명]`: 용도 설명
- `[Repository/Service명]`: 용도 설명

#### 메서드별 상세 분석

##### [메서드명] (라인: [시작라인]-[종료라인])
```java
[실제 메서드 코드 전체]
```

**분석:**
- 접근 제어자: `[public/private/protected]`
- 반환 타입: `[타입]`
- 파라미터:
  - `[파라미터명]: [타입]` - 설명
- 트랜잭션: `[@Transactional 여부 및 설정]`
- 비즈니스 로직 흐름:
  1. [단계 1 설명]
  2. [단계 2 설명]
  3. [단계 3 설명]
- 호출하는 Repository 메서드:
  - `[Repository명].[메서드명]` - 용도
- 호출하는 다른 Service 메서드:
  - `[Service명].[메서드명]` - 용도
- 예외 처리:
  - `[예외 상황]` → `[ErrorCode]` 또는 `[예외 타입]`
- 부가 효과 (Side Effects):
  - [이벤트 발행, 파일 업로드, 외부 API 호출 등]
```

### 3.2 Service 간 의존성 그래프

```
[Service A] → [Service B]
[Service C] → [Service D]
[Service C] → [Service E]
```

---

## 📄 4단계: Parser 서비스 분석

### 4.1 Parser 파일별 상세 분석

**각 ParserService 파일에 대해:**

```markdown
### [ParserService명] (파일: [경로])

#### 파싱 대상
- 문서 타입: `[예: 경매증, 등록증 등]`
- 입력 형식: `[PDF/이미지/HTML/기타]`
- 출력 형식: `[DTO 클래스명]`

#### 파싱 메서드 분석

##### [메서드명] (라인: [시작라인]-[종료라인])
```java
[실제 메서드 코드 전체]
```

**분석:**
- 입력: `[파라미터 타입 및 설명]`
- 출력: `[반환 타입 및 구조]`
- 파싱 전략:
  - [OCR 사용 여부 및 라이브러리]
  - [정규표현식 패턴]
  - [DOM/HTML 파싱 방식]
  - [기타 파싱 기법]
- 파싱 단계:
  1. [전처리 단계]
  2. [텍스트 추출 단계]
  3. [데이터 추출 단계]
  4. [검증 단계]
  5. [후처리 단계]
- 에러 처리:
  - 파싱 실패 시: `[처리 방식]`
  - 부분 파싱 실패 시: `[처리 방식]`
- 사용하는 외부 라이브러리/API:
  - `[라이브러리명]`: 용도
```

---

## 🗄️ 5단계: 데이터베이스 스키마 분석

### 5.1 Entity 파일별 상세 분석

**각 Entity 파일에 대해:**

```markdown
### [Entity명] (파일: [경로])

#### 기본 정보
- 테이블명: `[@Table name 또는 클래스명 기반]`
- 상속: `[BaseEntity/TenantEntity/없음]`
- JPA Auditing: `[활성화 여부]`

#### 필드 분석 (라인별)

| 필드명 | 타입 | 제약조건 | 설명 | 라인 |
|--------|------|----------|------|------|
| id | Long | PK, AUTO | ... | [라인] |
| companyId | Long | FK, NOT NULL | ... | [라인] |
| ... | ... | ... | ... | ... |

#### 관계 매핑
- `@OneToMany`: `[관계 엔티티]` - 설명
- `@ManyToOne`: `[관계 엔티티]` - 설명
- `@OneToOne`: `[관계 엔티티]` - 설명

#### 인덱스
- `@Index`: `[컬럼명]` - 용도
```

### 5.2 Repository 인터페이스 분석

**각 Repository 파일에 대해:**

```markdown
### [Repository명] (파일: [경로])

#### 기본 정보
- 상속: `JpaRepository<[Entity], [ID타입]>`
- 커스텀 쿼리 메서드 수: `[개수]`

#### 쿼리 메서드 목록

##### [메서드명] (라인: [라인])
```java
[메서드 시그니처]
```

**분석:**
- 반환 타입: `[타입]`
- 쿼리 생성 방식: `[Spring Data JPA 메서드명 기반 / @Query / 네이티브 쿼리]`
- 실제 생성 쿼리 (예상):
  ```sql
  SELECT ... FROM ... WHERE ...
  ```
- 사용 케이스: `[어디서 호출되는지]`
```

---

## 🔐 6단계: 보안 및 인증/인가 분석

### 6.1 Security 설정 분석

```markdown
### SecurityConfig (파일: [경로])

#### 필터 체인 설정
- 인증 필요 경로: `[패턴]`
- 인증 불필요 경로: `[패턴]`
- 필터 순서:
  1. `[필터명]` - 용도
  2. `[필터명]` - 용도

#### JWT 설정
- 토큰 만료 시간: `[Access Token]`, `[Refresh Token]`
- 토큰 발급 로직: `[파일 및 메서드]`
- 토큰 검증 로직: `[파일 및 메서드]`
```

### 6.2 JWT 인증 흐름 분석

```markdown
#### 로그인 플로우 (라인별 추적)
1. `AuthController.login()` (라인: [라인])
   → `AuthService.login()` (라인: [라인])
   → `JwtTokenProvider.generateToken()` (라인: [라인])
   → `RefreshTokenService.save()` (라인: [라인])

#### 요청 인증 플로우
1. `JwtAuthenticationFilter.doFilterInternal()` (라인: [라인])
   → 토큰 추출 (라인: [라인])
   → 토큰 검증 (라인: [라인])
   → SecurityContext 설정 (라인: [라인])
```

---

## ⚠️ 7단계: 예외 처리 분석

### 7.1 ErrorCode 열거형 분석

```markdown
### ErrorCode (파일: [경로])

#### 에러 코드 목록

| 코드 | HTTP Status | 메시지 | 사용 위치 |
|------|-------------|--------|-----------|
| USER_NOT_FOUND | 404 | ... | AuthService, ... |
| ... | ... | ... | ... |
```

### 7.2 GlobalExceptionHandler 분석

```markdown
### GlobalExceptionHandler (파일: [경로])

#### 예외 처리 메서드

##### [메서드명] (라인: [라인])
```java
[메서드 코드]
```

**분석:**
- 처리하는 예외: `[예외 타입]`
- HTTP Status: `[상태 코드]`
- 응답 형식: `[ErrorResponse 구조]`
- 로깅: `[로깅 레벨 및 내용]`
```

---

## ⚙️ 8단계: 전역 설정 및 인프라 분석

### 8.1 Config 클래스 분석

```markdown
### [Config명] (파일: [경로])

#### 설정 내용
- [설정 항목 1]: `[값]`
- [설정 항목 2]: `[값]`

#### Bean 정의
- `[Bean명]`: `[타입]` - 용도 (라인: [라인])
```

### 8.2 외부 서비스 연동 분석

```markdown
#### AWS S3 연동
- 설정 파일: `[경로]`
- 업로드 로직: `[Service/클래스명]` (라인: [라인])
- 다운로드 로직: `[Service/클래스명]` (라인: [라인])

#### Upstage OCR 연동
- 설정 파일: `[경로]`
- 호출 로직: `[Service/클래스명]` (라인: [라인])
- 응답 처리: `[Service/클래스명]` (라인: [라인])
```

---

## 📊 9단계: 데이터 흐름 분석

### 9.1 주요 비즈니스 플로우 추적

**예시: 문서 업로드 및 파싱 플로우**

```markdown
### 문서 업로드 → 파싱 → 저장 플로우

1. **Controller 레이어** (라인: [라인])
   - `DocumentController.upload()` 
   - 입력: `MultipartFile`
   - 출력: `DocumentDetailResponse`

2. **Service 레이어** (라인: [라인])
   - `DocumentService.uploadDocument()`
   - 파일 저장 (S3) → `[Service명].[메서드명]` (라인: [라인])
   - 문서 타입 판별 → `[로직 위치]` (라인: [라인])
   - 비동기 파싱 트리거 → `[Service명].[메서드명]` (라인: [라인])

3. **Parser 레이어** (라인: [라인])
   - `[ParserService명].[파싱메서드]`
   - OCR 호출 → `[Service명].[메서드명]` (라인: [라인])
   - 데이터 추출 → `[로직 위치]` (라인: [라인])
   - 결과 반환 → `[DTO 타입]`

4. **Repository 레이어** (라인: [라인])
   - `[Repository명].[save메서드]`
   - 트랜잭션 커밋

5. **이벤트 처리** (라인: [라인])
   - `[이벤트 리스너]` → `[처리 로직]` (라인: [라인])
```

---

## 📝 10단계: 최종 통합 문서 생성

### 10.1 API 명세서 생성

**OpenAPI/Swagger 형식 또는 마크다운 테이블 형식으로 모든 API 정리**

### 10.2 아키텍처 다이어그램

```
[Controller] → [Service] → [Repository] → [Database]
     ↓            ↓
[Parser]    [External API]
```

### 10.3 코드 통계

- 총 Java 파일 수: `[개수]`
- 총 코드 라인 수: `[라인 수]`
- Controller 수: `[개수]`
- Service 수: `[개수]`
- Repository 수: `[개수]`
- Entity 수: `[개수]`
- API 엔드포인트 수: `[개수]`

---

## 🎯 분석 실행 지침

### 분석 순서
1. **프로젝트 루트부터 시작**: build.gradle, 메인 애플리케이션 클래스
2. **전역 설정 분석**: Security, Exception, Config
3. **도메인별 순차 분석**: 각 도메인을 독립적으로 완전 분석
4. **의존성 추적**: Service 간, Controller-Service-Repository 간 연결
5. **데이터 흐름 추적**: 주요 비즈니스 플로우를 라인 단위로 추적

### 분석 원칙
- ✅ **실제 코드 기반**: 파일을 직접 읽고 라인 번호를 명시
- ✅ **완전성**: 모든 파일, 모든 메서드 분석
- ✅ **정확성**: 코드를 그대로 인용하고 해석
- ✅ **추적 가능성**: 각 분석 항목에 파일 경로와 라인 번호 명시
- ✅ **의존성 명시**: 호출 관계를 명확히 표시

### 분석 도구 활용
- `read_file`: 각 파일을 완전히 읽기
- `grep`: 특정 패턴 검색 (예: `@GetMapping`, `@PostMapping`)
- `codebase_search`: 의미론적 검색으로 관련 코드 찾기
- `glob_file_search`: 특정 패턴의 파일 찾기

---

## 📌 분석 결과물 형식

각 분석 단계의 결과를 마크다운 파일로 저장:
- `01_PROJECT_STRUCTURE.md`
- `02_API_ENDPOINTS.md`
- `03_SERVICES.md`
- `04_PARSERS.md`
- `05_DATABASE_SCHEMA.md`
- `06_SECURITY.md`
- `07_EXCEPTION_HANDLING.md`
- `08_CONFIGURATION.md`
- `09_DATA_FLOW.md`
- `10_SUMMARY.md`

각 파일은 위의 템플릿을 따라 작성하며, **모든 코드는 실제 파일의 라인 번호와 함께 인용**합니다.
