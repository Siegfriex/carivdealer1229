# 06. 보안 및 인증/인가 분석

## 6.1 SecurityConfig

**파일**: `src/main/java/cariv/exp/global/config/SecurityConfig.java`

### 필터 체인 설정

#### securityFilterChain (라인: 37-93)
```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    return http
            .csrf(AbstractHttpConfigurer::disable)  // 라인: 42
            .headers(h -> h.frameOptions(f -> f.deny()).httpStrictTransportSecurity(...))  // 라인: 44-50
            .cors(Customizer.withDefaults())  // 라인: 52
            .httpBasic(AbstractHttpConfigurer::disable)  // 라인: 53
            .formLogin(AbstractHttpConfigurer::disable)  // 라인: 54
            .sessionManagement(s -> s.sessionCreationPolicy(SessionCreationPolicy.STATELESS))  // 라인: 55
            .authorizeHttpRequests(auth -> { ... })  // 라인: 57-86
            .addFilterAfter(new JwtAuthenticationFilter(jwtTokenProvider), UsernamePasswordAuthenticationFilter.class)  // 라인: 89-90
            .build();
}
```

**분석:**
- **CSRF**: 비활성화 (라인: 42) - JWT API에서는 불필요
- **세션**: STATELESS (라인: 55) - JWT 기반 인증
- **CORS**: 활성화 (라인: 52) - corsConfigurationSource Bean 사용
- **필터 순서**: UsernamePasswordAuthenticationFilter 이후에 JwtAuthenticationFilter 실행 (라인: 89-90)

### 인증 필요/불필요 경로

#### 인증 불필요 경로 (라인: 58-60)
- `OPTIONS /**` - CORS preflight
- `/`, `/error`, `/favicon.ico` - 기본 경로
- `/api/auth/**` - 인증 API (로그인, 회원가입, 토큰 재발급, 로그아웃)

#### Swagger 문서 경로 (라인: 62-80)
- `allowDocs` 설정에 따라 허용/거부:
  - 허용: `/swagger-ui/**`, `/v3/api-docs/**`, `/swagger-resources/**`, `/webjars/**`, `/h2-console/**`
  - 거부: 동일 경로 거부

#### 인증 필요 경로 (라인: 82-85)
- `/api/master/**` - `ROLE_MASTER` 필요
- `/api/admin/**` - `ROLE_ADMIN` 또는 `ROLE_MASTER` 필요
- `/api/**` - 인증 필요 (위 경로 제외)
- 기타 모든 요청 - 거부

### PasswordEncoder Bean (라인: 95-98)
```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

**분석:**
- BCryptPasswordEncoder 사용
- 비밀번호 해싱에 사용

### CORS 설정 (라인: 101-121)
```java
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration config = new CorsConfiguration();
    config.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
    config.setAllowedHeaders(List.of("Authorization", "Content-Type", "X-Requested-With"));
    config.setExposedHeaders(List.of("Authorization"));
    // allowedOrigins 설정에 따라 credentials 설정
    config.setMaxAge(3600L);
    // ...
}
```

**분석:**
- 허용 메서드: GET, POST, PUT, PATCH, DELETE, OPTIONS
- 허용 헤더: Authorization, Content-Type, X-Requested-With
- 노출 헤더: Authorization
- Max-Age: 3600초 (1시간)
- allowedOrigins: 환경 변수 `app.security.allowed-origins`에서 읽음

---

## 6.2 JwtTokenProvider

**파일**: `src/main/java/cariv/exp/global/jwt/JwtTokenProvider.java`

### 토큰 만료 시간 설정

- **Access Token**: 1시간 (라인: 29)
  ```java
  private final long ACCESS_TOKEN_EXPIRE = 1000L * 60 * 60;  // 1시간
  ```
- **Refresh Token**: 14일 (라인: 30)
  ```java
  private final long REFRESH_TOKEN_EXPIRE = 1000L * 60 * 60 * 24 * 14;  // 14일
  ```

### 토큰 생성 로직

#### createAccessToken (라인: 36-50)
```java
public String createAccessToken(User user) {
    Date now = new Date();
    Date expiry = new Date(now.getTime() + ACCESS_TOKEN_EXPIRE);

    return Jwts.builder()
            .setSubject(user.getLoginId())              // subject = loginid
            .claim("type", "access")
            .claim("userId", user.getId())
            .claim("companyId", user.getCompanyId())
            .claim("role", user.getRole().name())
            .setIssuedAt(now)
            .setExpiration(expiry)
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
}
```

**분석:**
- **Subject**: `user.getLoginId()` (로그인 ID)
- **Claims**:
  - `type`: "access"
  - `userId`: 사용자 ID
  - `companyId`: 회사 ID (멀티테넌트)
  - `role`: 사용자 역할 (ADMIN, STAFF, MASTER)
- **서명 알고리즘**: HS256
- **서명 키**: `getSigningKey()` (HMAC SHA-256) (라인: 32-34)

#### createRefreshToken (라인: 52-63)
```java
public String createRefreshToken(User user) {
    Date now = new Date();
    Date expiry = new Date(now.getTime() + REFRESH_TOKEN_EXPIRE);

    return Jwts.builder()
            .setSubject(user.getLoginId())
            .claim("type", "refresh")
            .setIssuedAt(now)
            .setExpiration(expiry)
            .signWith(getSigningKey(), SignatureAlgorithm.HS256)
            .compact();
}
```

**분석:**
- **Subject**: `user.getLoginId()`
- **Claims**: `type`만 "refresh"로 설정
- **만료 시간**: 14일

#### createAccessTokenForTenant (라인: 64-78)
```java
public String createAccessTokenForTenant(User masterUser, Long companyId) {
    // MASTER 사용자가 특정 회사로 전환할 때 사용
    // companyId를 파라미터로 받아서 토큰에 포함
}
```

**분석:**
- MASTER 사용자가 특정 회사로 전환할 때 사용
- 토큰의 `companyId` claim을 파라미터로 받은 값으로 설정

### 토큰 검증 로직

#### validate (라인: 81-90)
```java
public boolean validate(String token) {
    try {
        getClaims(token);
        return true;
    } catch (ExpiredJwtException e) {
        throw new CustomException(ErrorCode.TOKEN_EXPIRED);
    } catch (JwtException | IllegalArgumentException e) {
        throw new CustomException(ErrorCode.TOKEN_INVALID);
    }
}
```

**분석:**
- 토큰 파싱 시도
- 만료된 경우: `ErrorCode.TOKEN_EXPIRED` 예외
- 잘못된 토큰: `ErrorCode.TOKEN_INVALID` 예외

#### getClaims (라인: 92-98)
```java
public Claims getClaims(String token) {
    return Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody();
}
```

**분석:**
- JWT 토큰을 파싱하여 Claims 추출
- 서명 키로 검증

#### getAuthentication (라인: 101-109)
```java
public Authentication getAuthentication(String token) {
    String loginId = getClaims(token).getSubject();
    UserDetails userDetails = userDetailsService.loadUserByUsername(loginId);
    return new UsernamePasswordAuthenticationToken(
            userDetails,
            null,
            userDetails.getAuthorities()
    );
}
```

**분석:**
- 토큰에서 loginId 추출
- UserDetailsService로 사용자 정보 로드
- Authentication 객체 생성

---

## 6.3 JwtAuthenticationFilter

**파일**: `src/main/java/cariv/exp/global/jwt/JwtAuthenticationFilter.java`

### 필터 동작 흐름

#### shouldNotFilter (라인: 22-34)
```java
@Override
protected boolean shouldNotFilter(HttpServletRequest request) {
    String path = request.getRequestURI();
    return path.startsWith("/api/auth/")
            || path.equals("/")
            || path.equals("/error")
            || path.equals("/favicon.ico")
            || path.startsWith("/v3/api-docs")
            || path.startsWith("/swagger-ui")
            || path.startsWith("/swagger-resources")
            || path.startsWith("/webjars")
            || path.startsWith("/h2-console");
}
```

**분석:**
- 필터를 건너뛸 경로 정의
- 인증 불필요 경로는 필터 미적용

#### doFilterInternal (라인: 37-72)
```java
@Override
protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
) throws ServletException, java.io.IOException {

    String token = resolveToken(request);  // 라인: 43

    if (token != null && jwtTokenProvider.validate(token)) {  // 라인: 45

        // SecurityContext에 인증정보 넣기
        var authentication = jwtTokenProvider.getAuthentication(token);  // 라인: 48
        SecurityContextHolder.getContext().setAuthentication(authentication);  // 라인: 49

        // 멀티 테넌시 적용: JWT에서 companyId 꺼내 TenantContext에 저장
        Claims claims = jwtTokenProvider.getClaims(token);  // 라인: 52
        Object v = claims.get("companyId");  // 라인: 53
        Long companyId = null;
        if (v instanceof Number n) {
            companyId = n.longValue();  // 라인: 56
        } else if (v instanceof String s && !s.isBlank()) {
            companyId = Long.parseLong(s);  // 라인: 58
        }
        if (companyId != null) {
            TenantContext.setCompanyId(companyId);  // 라인: 61
        }
    }

    try {
        filterChain.doFilter(request, response);  // 라인: 66
    }finally {
        TenantContext.clear();  // 라인: 68
        SecurityContextHolder.clearContext();  // 라인: 69
    }
}
```

**분석:**
- **토큰 추출** (라인: 43): `resolveToken()` 호출
- **토큰 검증** (라인: 45): `jwtTokenProvider.validate()` 호출
- **인증 정보 설정** (라인: 48-49): SecurityContext에 Authentication 설정
- **멀티테넌트 컨텍스트 설정** (라인: 52-62): JWT에서 companyId 추출하여 TenantContext에 설정
- **필터 체인 실행** (라인: 66)
- **정리** (라인: 68-69): finally 블록에서 TenantContext와 SecurityContext 정리

#### resolveToken (라인: 74-80)
```java
private String resolveToken(HttpServletRequest request) {
    String bearer = request.getHeader("Authorization");
    if (bearer != null && bearer.startsWith("Bearer ")) {
        return bearer.substring(7);
    }
    return null;
}
```

**분석:**
- Authorization 헤더에서 토큰 추출
- "Bearer " 접두사 제거

---

## 6.4 RefreshTokenService

**파일**: `src/main/java/cariv/exp/global/jwt/service/RefreshTokenService.java`

### 의존성 주입
- `RefreshTokenRepository` (라인: 23) - Refresh Token 저장소

### 메서드별 상세 분석

#### saveNewToken (라인: 25-33)
```java
public RefreshToken saveNewToken(User user, String refreshToken, Instant expiresAt) {
    RefreshToken token = RefreshToken.builder()
            .user(user)
            .tokenHash(hashToken(refreshToken))  // 라인: 28
            .expiresAt(LocalDateTime.ofInstant(expiresAt, ZoneId.systemDefault()))  // 라인: 29
            .revoked(false)  // 라인: 30
            .build();
    return refreshTokenRepository.save(token);
}
```

**분석:**
- **접근 제어자**: `public`
- **반환 타입**: `RefreshToken`
- **파라미터**:
  - `User user` - 사용자
  - `String refreshToken` - Refresh Token 문자열
  - `Instant expiresAt` - 만료 시간
- **비즈니스 로직 흐름**:
  1. Refresh Token을 SHA-256 해시로 변환 (라인: 28)
  2. 만료 시간을 LocalDateTime으로 변환 (라인: 29)
  3. revoked=false로 설정 (라인: 30)
  4. 저장 (라인: 32)
- **호출하는 Repository 메서드**:
  - `RefreshTokenRepository.save()` (라인: 32)

#### validateRefreshToken (라인: 35-38)
```java
public Optional<RefreshToken> validateRefreshToken(String token) {
    return refreshTokenRepository.findByTokenHashAndRevokedFalse(hashToken(token))
            .filter(t -> t.getExpiresAt().isAfter(LocalDateTime.now()));
}
```

**분석:**
- **접근 제어자**: `public`
- **반환 타입**: `Optional<RefreshToken>`
- **파라미터**: `String token` - Refresh Token 문자열
- **비즈니스 로직 흐름**:
  1. 토큰을 해시로 변환
  2. Repository에서 해시와 revoked=false로 조회
  3. 만료 시간 검증 (현재 시간보다 이후인지)
- **호출하는 Repository 메서드**:
  - `RefreshTokenRepository.findByTokenHashAndRevokedFalse()` (라인: 36)

#### revokeToken (라인: 40-52)
```java
public void revokeToken(String token) {
    refreshTokenRepository.findByTokenHashAndRevokedFalse(hashToken(token))
            .ifPresent(t -> {
                t = RefreshToken.builder()
                        .id(t.getId())
                        .user(t.getUser())
                        .tokenHash(t.getTokenHash())
                        .expiresAt(t.getExpiresAt())
                        .revoked(true)  // 라인: 48
                        .build();
                refreshTokenRepository.save(t);
            });
}
```

**분석:**
- **접근 제어자**: `public`
- **반환 타입**: `void`
- **파라미터**: `String token` - Refresh Token 문자열
- **비즈니스 로직 흐름**:
  1. 토큰을 해시로 변환하여 조회
  2. 있으면 revoked=true로 업데이트
  3. 저장
- **호출하는 Repository 메서드**:
  - `RefreshTokenRepository.findByTokenHashAndRevokedFalse()` (라인: 41)
  - `RefreshTokenRepository.save()` (라인: 50)

#### hashToken (라인: 54-66)
```java
private String hashToken(String token) {
    try {
        MessageDigest digest = MessageDigest.getInstance("SHA-256");
        byte[] hashed = digest.digest(token.getBytes(StandardCharsets.UTF_8));
        StringBuilder sb = new StringBuilder(hashed.length * 2);
        for (byte b : hashed) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    } catch (NoSuchAlgorithmException e) {
        throw new IllegalStateException("SHA-256 not available", e);
    }
}
```

**분석:**
- **접근 제어자**: `private`
- **반환 타입**: `String`
- **파라미터**: `String token` - 토큰 문자열
- **비즈니스 로직 흐름**:
  1. SHA-256 해시 생성
  2. 바이트 배열을 16진수 문자열로 변환
- **용도**: Refresh Token을 해시하여 저장 (보안)

---

## 6.5 CustomUserDetails

**파일**: `src/main/java/cariv/exp/global/security/CustomUserDetails.java`

### 기본 정보
- **구현 인터페이스**: `UserDetails`
- **역할**: Spring Security의 사용자 인증 정보 래퍼

### 권한 계층 구조 (라인: 27-41)
```java
@Override
public Collection<? extends GrantedAuthority> getAuthorities() {
    return switch (user.getRole()) {
        case MASTER -> List.of(
                new SimpleGrantedAuthority("ROLE_MASTER"),
                new SimpleGrantedAuthority("ROLE_ADMIN"),
                new SimpleGrantedAuthority("ROLE_STAFF")
        );
        case ADMIN -> List.of(
                new SimpleGrantedAuthority("ROLE_ADMIN"),
                new SimpleGrantedAuthority("ROLE_STAFF")
        );
        default -> List.of(new SimpleGrantedAuthority("ROLE_STAFF"));
    };
}
```

**분석:**
- **MASTER**: ROLE_MASTER, ROLE_ADMIN, ROLE_STAFF 모두 가짐
- **ADMIN**: ROLE_ADMIN, ROLE_STAFF 가짐
- **STAFF**: ROLE_STAFF만 가짐

### 주요 메서드
- `getUserId()` (라인: 61) - 사용자 ID 반환
- `getCompanyId()` (라인: 63) - 회사 ID 반환
- `getRole()` (라인: 49-51) - 역할 반환
- `isEnabled()` (라인: 59) - 계정 활성화 여부 (user.isActive())

---

## 6.6 CustomUserDetailsService

**파일**: `src/main/java/cariv/exp/global/security/service/CustomUserDetailsService.java`

### 의존성 주입
- `UserRepository` (라인: 17) - 사용자 조회

### 메서드 분석

#### loadUserByUsername (라인: 20-25)
```java
@Override
public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
    // username = loginId
    User user = userRepository.findByLoginId(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    return new CustomUserDetails(user);
}
```

**분석:**
- **접근 제어자**: `public`
- **반환 타입**: `UserDetails`
- **파라미터**: `String username` - 실제로는 loginId
- **비즈니스 로직 흐름**:
  1. loginId로 사용자 조회 (라인: 22-23)
  2. 없으면 UsernameNotFoundException 발생
  3. CustomUserDetails로 래핑하여 반환 (라인: 24)
- **호출하는 Repository 메서드**:
  - `UserRepository.findByLoginId()` (라인: 22)

---

## 6.7 JWT 인증/인가 전체 플로우

### 로그인 플로우 (라인별 추적)

```
1. AuthController.login() (라인: 33-41)
   ↓
2. AuthService.login() (라인: 53-69)
   ├─ UserRepository.findByLoginId() (라인: 55)
   ├─ PasswordEncoder.matches() (라인: 58)
   ├─ JwtTokenProvider.createAccessToken() (라인: 62)
   │  └─ JWT 생성 (subject=loginId, claims: userId, companyId, role)
   ├─ JwtTokenProvider.createRefreshToken() (라인: 63)
   │  └─ JWT 생성 (subject=loginId, claim: type=refresh)
   ├─ JwtTokenProvider.getClaims() (라인: 65)
   └─ RefreshTokenService.saveNewToken() (라인: 66)
      └─ RefreshToken 해시하여 저장
   ↓
3. TokenResponse 반환 (Access Token + Refresh Token)
```

### 요청 인증 플로우 (라인별 추적)

```
1. HTTP 요청 → JwtAuthenticationFilter.doFilterInternal() (라인: 37-72)
   ↓
2. resolveToken() (라인: 43, 74-80)
   └─ Authorization 헤더에서 "Bearer " 제거
   ↓
3. jwtTokenProvider.validate() (라인: 45)
   └─ JwtTokenProvider.validate() (라인: 81-90)
      ├─ getClaims() 호출
      ├─ 만료 체크 → ExpiredJwtException → ErrorCode.TOKEN_EXPIRED
      └─ 잘못된 토큰 → JwtException → ErrorCode.TOKEN_INVALID
   ↓
4. jwtTokenProvider.getAuthentication() (라인: 48)
   └─ JwtTokenProvider.getAuthentication() (라인: 101-109)
      ├─ getClaims() → loginId 추출
      ├─ CustomUserDetailsService.loadUserByUsername() (라인: 103)
      │  └─ UserRepository.findByLoginId() → User 조회
      └─ UsernamePasswordAuthenticationToken 생성
   ↓
5. SecurityContextHolder.getContext().setAuthentication() (라인: 49)
   └─ SecurityContext에 인증 정보 설정
   ↓
6. TenantContext.setCompanyId() (라인: 61)
   └─ JWT에서 companyId 추출하여 TenantContext에 설정
   ↓
7. filterChain.doFilter() (라인: 66)
   └─ 다음 필터/컨트롤러로 요청 전달
   ↓
8. finally 블록 (라인: 67-70)
   ├─ TenantContext.clear() (라인: 68)
   └─ SecurityContextHolder.clearContext() (라인: 69)
```

### 토큰 재발급 플로우 (라인별 추적)

```
1. AuthController.refresh() (라인: 42-50)
   ↓
2. AuthService.refresh() (라인: 71-87)
   ├─ RefreshTokenService.validateRefreshToken() (라인: 73)
   │  └─ RefreshTokenRepository.findByTokenHashAndRevokedFalse()
   │  └─ 만료 시간 검증
   ├─ RefreshToken.getUser() (라인: 76)
   ├─ JwtTokenProvider.createAccessToken() (라인: 78)
   ├─ JwtTokenProvider.createRefreshToken() (라인: 79)
   ├─ RefreshTokenService.revokeToken() (라인: 81)
   │  └─ 기존 Refresh Token revoked=true로 변경
   └─ RefreshTokenService.saveNewToken() (라인: 84)
      └─ 새 Refresh Token 저장
   ↓
3. TokenResponse 반환 (새로운 Access Token + Refresh Token)
```

### 로그아웃 플로우 (라인별 추적)

```
1. AuthController.logout() (라인: 53-61)
   ↓
2. AuthService.logout() (라인: 89-91)
   └─ RefreshTokenService.revokeToken() (라인: 90)
      └─ RefreshToken revoked=true로 변경
```

---

## 6.8 인증/인가 다이어그램

```
[HTTP Request]
    ↓
[JwtAuthenticationFilter]
    ├─ resolveToken() → Authorization 헤더에서 토큰 추출
    ├─ validate() → 토큰 검증
    ├─ getAuthentication() → UserDetails 로드
    ├─ SecurityContext 설정
    └─ TenantContext 설정 (companyId)
    ↓
[Controller]
    ├─ @AuthenticationPrincipal CustomUserDetails
    └─ Service 호출
        ↓
[Service]
    └─ Repository 호출
        ↓
[Database]
```

### 권한 계층 구조

```
MASTER
  ├─ ROLE_MASTER
  ├─ ROLE_ADMIN
  └─ ROLE_STAFF

ADMIN
  ├─ ROLE_ADMIN
  └─ ROLE_STAFF

STAFF
  └─ ROLE_STAFF
```

### 경로별 권한 요구사항

| 경로 패턴 | 권한 요구사항 | SecurityConfig 라인 |
|-----------|--------------|---------------------|
| `/api/auth/**` | 인증 불필요 | 60 |
| `/api/master/**` | ROLE_MASTER | 82 |
| `/api/admin/**` | ROLE_ADMIN 또는 ROLE_MASTER | 83 |
| `/api/**` | 인증 필요 | 84 |
| 기타 | 거부 | 85 |
