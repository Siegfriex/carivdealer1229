# 로컬 개발 환경 설정 가이드

**버전**: 1.0  
**최종 업데이트**: 2025-01-XX

---

## 개요

로컬에서 Firebase Functions를 개발하고 테스트하기 위한 환경 설정 방법을 설명합니다.

---

## 환경변수 vs Secret Manager

### 프로덕션 환경
- **Secret Manager 사용**: GCP Secret Manager에 API 키 저장
- **이유**: 보안, 중앙 관리, 버전 관리

### 로컬 개발 환경
- **환경변수 사용**: `functions/.env` 파일에 API 키 저장
- **이유**: 빠른 개발, 인증 불필요, 간단한 설정

---

## 로컬 환경변수 설정

### 1. 환경변수 파일 생성

`functions/.env` 파일을 생성합니다:

```bash
cd C:\carivdealer\FOWARDMAX\functions
cp .env.example .env
```

또는 직접 생성:

```bash
# functions/.env 파일 생성
```

### 2. 환경변수 내용 입력

`functions/.env` 파일에 다음 내용을 입력:

```bash
# Gemini API Key (로컬 개발용)
GEMINI_API_KEY=your-gemini-api-key-here

# 한국교통안전공단 공공데이터 API Key (로컬 개발용)
KOTSA_PUBLIC_DATA_API_KEY=c06db8fb06b9eb310bd1060d450d7d2a2581f406ec46dbf1eae9a803bffbb738
```

### 3. .gitignore 확인

`functions/.env` 파일이 Git에 커밋되지 않도록 확인:

```bash
# .gitignore에 다음이 포함되어 있는지 확인
.env
.env.local
.env.*.local
```

---

## 코드 수정: 로컬 환경변수 지원

`functions/src/config/secrets.ts` 파일을 수정하여 로컬 개발 시 환경변수를 사용하도록 합니다:

```typescript
import { SecretManagerServiceClient } from '@google-cloud/secret-manager';

const client = new SecretManagerServiceClient();

export async function getSecret(secretName: string): Promise<string> {
  // 로컬 개발 환경: 환경변수 사용
  if (process.env.NODE_ENV === 'development' || process.env.FUNCTIONS_EMULATOR) {
    const envKey = secretName.toUpperCase().replace(/-/g, '_');
    
    // 시크릿 이름을 환경변수 이름으로 매핑
    const envVarMap: Record<string, string> = {
      'gemini-api-key': 'GEMINI_API_KEY',
      'kotsa-public-data-api-key': 'KOTSA_PUBLIC_DATA_API_KEY',
    };
    
    const envVarName = envVarMap[secretName] || envKey;
    const envValue = process.env[envVarName];
    
    if (envValue) {
      console.log(`[LOCAL] Using environment variable: ${envVarName}`);
      return envValue;
    }
    
    console.warn(`[LOCAL] Environment variable ${envVarName} not found, falling back to Secret Manager`);
  }
  
  // 프로덕션 환경: Secret Manager 사용
  try {
    const projectId = 'carivdealer';
    const name = `projects/${projectId}/secrets/${secretName}/versions/latest`;
    const [version] = await client.accessSecretVersion({ name });
    return version.payload?.data?.toString() || '';
  } catch (error) {
    console.error(`Failed to get secret ${secretName}:`, error);
    throw error;
  }
}
```

---

## 로컬 개발 실행

### 1. 환경변수 파일 생성

```bash
cd C:\carivdealer\FOWARDMAX\functions
# .env 파일 생성 및 API 키 입력
```

### 2. Firebase Emulator 실행

```bash
cd C:\carivdealer\FOWARDMAX
npm run serve
# 또는
cd functions
npm run serve
```

### 3. 환경변수 로드 확인

Firebase Emulator는 자동으로 `functions/.env` 파일을 로드합니다.

또는 수동으로 환경변수 설정:

**Windows PowerShell:**
```powershell
$env:GEMINI_API_KEY="your-gemini-api-key"
$env:KOTSA_PUBLIC_DATA_API_KEY="c06db8fb06b9eb310bd1060d450d7d2a2581f406ec46dbf1eae9a803bffbb738"
npm run serve
```

**Windows CMD:**
```cmd
set GEMINI_API_KEY=your-gemini-api-key
set KOTSA_PUBLIC_DATA_API_KEY=c06db8fb06b9eb310bd1060d450d7d2a2581f406ec46dbf1eae9a803bffbb738
npm run serve
```

---

## dotenv 패키지 사용 (선택사항)

더 명확한 환경변수 관리를 위해 `dotenv` 패키지를 사용할 수 있습니다:

### 1. dotenv 설치

```bash
cd functions
npm install --save-dev dotenv
```

### 2. 코드 수정

`functions/src/config/secrets.ts`:

```typescript
import * as dotenv from 'dotenv';

// 로컬 개발 환경에서만 dotenv 로드
if (process.env.NODE_ENV === 'development' || process.env.FUNCTIONS_EMULATOR) {
  dotenv.config();
}

// ... 나머지 코드
```

---

## 환경변수 파일 구조

### functions/.env (로컬 개발용)
```bash
GEMINI_API_KEY=your-gemini-api-key
KOTSA_PUBLIC_DATA_API_KEY=c06db8fb06b9eb310bd1060d450d7d2a2581f406ec46dbf1eae9a803bffbb738
```

### functions/.env.example (템플릿)
```bash
GEMINI_API_KEY=your-gemini-api-key-here
KOTSA_PUBLIC_DATA_API_KEY=your-kotsa-api-key-here
```

---

## 환경별 설정 요약

| 환경 | API 키 저장 위치 | 설정 방법 |
|------|----------------|----------|
| **로컬 개발** | `functions/.env` | 환경변수 파일 |
| **프로덕션** | GCP Secret Manager | `gcloud secrets create` |

---

## 체크리스트

### 로컬 개발 설정
- [ ] `functions/.env` 파일 생성
- [ ] API 키 입력
- [ ] `.gitignore`에 `.env` 포함 확인
- [ ] Firebase Emulator 실행 테스트
- [ ] 환경변수 로드 확인

### 프로덕션 배포 전
- [ ] Secret Manager에 API 키 설정 확인
- [ ] 서비스 계정 권한 확인
- [ ] 배포 후 Functions 로그 확인

---

## 문제 해결

### 에러: "Environment variable not found"
- **원인**: `functions/.env` 파일이 없거나 환경변수 이름이 잘못됨
- **해결**: `.env` 파일 생성 및 환경변수 이름 확인

### 에러: "Failed to get secret"
- **원인**: 로컬에서 Secret Manager 접근 시도 (인증 필요)
- **해결**: 환경변수 사용하도록 코드 수정 또는 GCP 인증 설정

### 환경변수가 로드되지 않음
- **원인**: Firebase Emulator가 `.env` 파일을 자동으로 로드하지 않음
- **해결**: `dotenv` 패키지 사용 또는 수동 환경변수 설정

---

## 참고 문서

- [SECRET_MANAGER_SETUP.md](./SECRET_MANAGER_SETUP.md) - Secret Manager 설정 가이드
- [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) - 프론트엔드 환경변수 가이드
- [Firebase Emulator 문서](https://firebase.google.com/docs/emulator-suite)

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0 | 2025-01-XX | 초기 버전 작성 |

