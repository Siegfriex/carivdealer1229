# 코드베이스 분석 실행 프롬프트 (즉시 사용 가능)

이 프롬프트를 AI에게 제공하면 코드베이스를 자동으로 분석합니다.

---

## 🚀 실행 프롬프트

```
다음 코드베이스를 코드 라인 단위로 완전히 분석해주세요.

## 분석 범위
1. 모든 Controller 파일의 API 엔드포인트 (HTTP 메서드, 경로, 파라미터, 응답)
2. 모든 Service 파일의 비즈니스 로직 (메서드별 상세 분석)
3. 모든 Parser 서비스의 파싱 로직 (입력/출력, 파싱 전략)
4. 모든 Entity와 Repository의 데이터베이스 스키마
5. Security 설정 및 JWT 인증/인가 흐름
6. 예외 처리 메커니즘 (ErrorCode, GlobalExceptionHandler)
7. 전역 설정 및 외부 서비스 연동 (AWS S3, Upstage OCR 등)

## 분석 요구사항
- 각 파일을 read_file로 완전히 읽고 분석
- 모든 메서드에 대해 파일 경로와 라인 번호를 명시
- 실제 코드를 인용하여 분석 근거 제시
- Controller → Service → Repository → Entity 의존성 추적
- 주요 비즈니스 플로우를 라인 단위로 추적

## 출력 형식
각 분석 항목에 대해 다음 정보 포함:
- 파일 경로
- 라인 번호 범위
- 실제 코드 인용
- 상세 분석 (파라미터, 반환값, 로직 흐름, 의존성)

## 분석 순서
1. 프로젝트 구조 파악 (build.gradle, 메인 클래스)
2. 전역 설정 분석 (Security, Exception, Config)
3. 도메인별 순차 분석 (각 도메인 완전 분석)
4. 의존성 그래프 작성
5. 데이터 흐름 다이어그램 작성

시작하세요.
```

---

## 📋 단계별 실행 프롬프트

### 1단계: 프로젝트 구조 파악

```
다음 작업을 수행해주세요:

1. build.gradle 파일을 읽고 다음 정보를 추출:
   - Spring Boot 버전
   - Java 버전
   - 주요 의존성 라이브러리 목록 (Spring Data JPA, Security, JWT, Swagger 등)

2. ExpApplication.java를 읽고 분석:
   - 활성화된 어노테이션
   - 패키지 구조

3. src/main/java/cariv/exp 디렉토리 구조를 list_dir로 확인:
   - domain/ 하위의 모든 도메인 목록
   - global/ 하위의 모든 모듈 목록

4. 각 도메인별로 다음 파일 수를 카운트:
   - Controller 파일 수
   - Service 파일 수
   - Repository 파일 수
   - Entity 파일 수
```

### 2단계: API 엔드포인트 완전 분석

```
모든 Controller 파일을 찾아서 각각 분석해주세요:

1. glob_file_search로 **/*Controller.java 파일 모두 찾기

2. 각 Controller 파일에 대해:
   - read_file로 전체 파일 읽기
   - @RequestMapping으로 기본 경로 추출
   - @Tag로 Swagger 태그 추출
   - 각 메서드별로:
     * HTTP 메서드 (@GetMapping, @PostMapping 등)
     * 전체 경로 (base path + 메서드 경로)
     * 파라미터 목록 (@PathVariable, @RequestParam, @RequestBody 등)
     * 응답 타입
     * @Operation의 summary와 description
     * 호출하는 Service 메서드
     * 라인 번호 범위

3. 결과를 표 형식으로 정리:
   | Controller | HTTP Method | Path | 메서드명 | 라인 | 인증 | 설명 |
```

### 3단계: Service 계층 분석

```
모든 Service 파일을 찾아서 각각 분석해주세요:

1. glob_file_search로 **/*Service.java 파일 모두 찾기

2. 각 Service 파일에 대해:
   - read_file로 전체 파일 읽기
   - @RequiredArgsConstructor로 주입된 의존성 목록 추출
   - 각 메서드별로:
     * 메서드 시그니처 (접근 제어자, 반환 타입, 파라미터)
     * @Transactional 여부
     * 비즈니스 로직 단계별 분석
     * 호출하는 Repository 메서드
     * 호출하는 다른 Service 메서드
     * 예외 처리
     * 라인 번호 범위

3. Service 간 의존성 그래프 작성
```

### 4단계: Parser 서비스 분석

```
모든 ParserService 파일을 찾아서 각각 분석해주세요:

1. glob_file_search로 **/*ParserService.java 파일 모두 찾기

2. 각 ParserService 파일에 대해:
   - read_file로 전체 파일 읽기
   - 파싱 대상 문서 타입 확인
   - 각 파싱 메서드별로:
     * 입력 형식 (PDF, 이미지, HTML 등)
     * 출력 형식 (DTO 클래스)
     * 파싱 전략 (OCR, 정규표현식, DOM 파싱 등)
     * 파싱 단계별 분석
     * 에러 처리 방식
     * 사용하는 외부 라이브러리/API
     * 라인 번호 범위
```

### 5단계: 데이터베이스 스키마 분석

```
모든 Entity와 Repository 파일을 분석해주세요:

1. glob_file_search로 **/*Entity.java 파일 모두 찾기
2. glob_file_search로 **/*Repository.java 파일 모두 찾기

3. 각 Entity 파일에 대해:
   - read_file로 전체 파일 읽기
   - @Table 어노테이션으로 테이블명 확인
   - 상속 관계 확인 (BaseEntity, TenantEntity 등)
   - 모든 필드 분석:
     * 필드명, 타입, 제약조건 (@Column, @NotNull 등)
     * 관계 매핑 (@OneToMany, @ManyToOne 등)
     * 라인 번호
   - 인덱스 정보 (@Index)

4. 각 Repository 파일에 대해:
   - read_file로 전체 파일 읽기
   - 상속하는 인터페이스 확인
   - 커스텀 쿼리 메서드 분석:
     * 메서드 시그니처
     * 쿼리 생성 방식 (메서드명 기반 / @Query / 네이티브)
     * 예상 SQL 쿼리
     * 사용 위치 (어디서 호출되는지)
     * 라인 번호
```

### 6단계: 보안 및 인증 분석

```
보안 관련 파일들을 분석해주세요:

1. SecurityConfig.java 읽기:
   - 필터 체인 설정
   - 인증 필요/불필요 경로
   - 필터 순서

2. JwtTokenProvider.java 읽기:
   - 토큰 생성 로직
   - 토큰 검증 로직
   - 만료 시간 설정

3. JwtAuthenticationFilter.java 읽기:
   - 필터 동작 흐름 (라인별)
   - 토큰 추출 로직
   - SecurityContext 설정

4. AuthService.java 읽기:
   - 로그인 플로우 (라인별 추적)
   - 토큰 발급 과정
   - Refresh Token 처리

5. JWT 인증/인가 전체 플로우를 다이어그램으로 작성
```

### 7단계: 예외 처리 분석

```
예외 처리 관련 파일들을 분석해주세요:

1. ErrorCode.java 읽기:
   - 모든 에러 코드 목록
   - HTTP Status 코드 매핑
   - 에러 메시지

2. GlobalExceptionHandler.java 읽기:
   - 각 예외 처리 메서드 분석:
     * 처리하는 예외 타입
     * HTTP Status 코드
     * 응답 형식
     * 로깅 방식
     * 라인 번호

3. CustomException.java 읽기:
   - 커스텀 예외 구조

4. 각 Service에서 발생하는 예외를 추적하여 ErrorCode 사용 현황 정리
```

### 8단계: 전역 설정 및 인프라 분석

```
전역 설정 파일들을 분석해주세요:

1. global/config/ 디렉토리의 모든 Config 파일 읽기:
   - SecurityConfig
   - SwaggerConfig
   - AsyncConfig
   - UpstageConfig
   - 각 설정의 Bean 정의와 용도

2. AWS S3 연동 분석:
   - AwsS3Config.java 읽기
   - S3Upload.java 읽기
   - S3ObjectReader.java 읽기
   - 업로드/다운로드 로직 분석

3. Upstage OCR 연동 분석:
   - UpstageConfig.java 읽기
   - UpstageService.java 읽기
   - OCR 호출 및 응답 처리 로직 분석

4. 외부 서비스 연동 다이어그램 작성
```

### 9단계: 데이터 흐름 분석

```
주요 비즈니스 플로우를 추적해주세요:

1. 문서 업로드 → 파싱 → 저장 플로우:
   - DocumentController.upload() 시작
   - DocumentService 호출 추적
   - ParserService 호출 추적
   - Repository 저장 추적
   - 각 단계의 라인 번호 명시

2. 로그인 → 토큰 발급 플로우:
   - AuthController.login() 시작
   - AuthService 호출 추적
   - JWT 토큰 생성 추적
   - 각 단계의 라인 번호 명시

3. 차량 등록 → 말소 플로우:
   - 관련 Controller → Service → Repository 추적
   - 각 단계의 라인 번호 명시

각 플로우를 다이어그램과 함께 문서화
```

### 10단계: 통합 문서 생성

```
위의 모든 분석 결과를 바탕으로 다음 문서들을 생성해주세요:

1. API_SPECIFICATION.md:
   - 모든 API 엔드포인트를 OpenAPI 형식 또는 표 형식으로 정리
   - 각 엔드포인트의 상세 명세 포함

2. ARCHITECTURE.md:
   - 전체 아키텍처 다이어그램
   - 레이어별 역할 설명
   - 의존성 그래프

3. CODE_STATISTICS.md:
   - 총 파일 수, 코드 라인 수
   - 도메인별 파일 수
   - API 엔드포인트 수

4. DATA_FLOW.md:
   - 주요 비즈니스 플로우 다이어그램
   - 각 플로우의 상세 설명

모든 문서에 파일 경로와 라인 번호를 포함해주세요.
```

---

## 💡 사용 팁

### 빠른 분석 (요약 버전)
```
위의 1-3단계만 실행하여 API 엔드포인트와 주요 Service만 빠르게 분석
```

### 심화 분석 (완전 버전)
```
모든 단계를 순차적으로 실행하여 코드베이스를 완전히 해부
```

### 특정 도메인만 분석
```
특정 도메인(예: auction)만 집중 분석:
1. domain/auction/ 디렉토리의 모든 파일 찾기
2. 해당 도메인의 Controller, Service, Repository, Entity 분석
3. 다른 도메인과의 연관성 추적
```

### 특정 기능만 분석
```
특정 기능(예: 문서 파싱)만 집중 분석:
1. 모든 ParserService 파일 찾기
2. 각 파서의 입력/출력 분석
3. 파싱 전략 비교 분석
4. 에러 처리 방식 비교
```

---

## 📌 분석 결과 검증 체크리스트

분석 완료 후 다음 항목들을 확인:

- [ ] 모든 Controller 파일이 분석되었는가?
- [ ] 모든 Service 파일이 분석되었는가?
- [ ] 모든 Repository 파일이 분석되었는가?
- [ ] 모든 Entity 파일이 분석되었는가?
- [ ] 모든 API 엔드포인트가 문서화되었는가?
- [ ] 각 분석 항목에 라인 번호가 명시되었는가?
- [ ] 실제 코드가 인용되었는가?
- [ ] 의존성 관계가 추적되었는가?
- [ ] 주요 플로우가 다이어그램으로 작성되었는가?
