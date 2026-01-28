# Secret Manager 설정 가이드

**버전**: 1.0  
**최종 업데이트**: 2025-01-XX

---

## 개요

이 문서는 Firebase Functions에서 사용하는 API 키를 GCP Secret Manager에 설정하는 방법을 설명합니다.

---

## Secret Manager 사용 이유

### Backend (Firebase Functions)
- **Secret Manager 사용**: API 키를 안전하게 저장하고 관리
- **이유**: 
  - 코드에 API 키가 노출되지 않음
  - 버전 관리 및 로테이션 용이
  - 접근 권한 세밀하게 제어 가능

### Frontend (Vite/React)
- **환경변수 사용**: `.env` 파일로 관리
- **이유**: 
  - 빌드 시점에 주입되어 클라이언트에 포함됨
  - 공개되어도 되는 키만 사용 (Firebase Config 등)
  - 민감한 키는 Backend API를 통해 간접 사용

---

## 필요한 시크릿 목록

### 1. Gemini API Key
- **시크릿 이름**: `gemini-api-key`
- **용도**: 차량 등록원부 OCR 처리
- **사용 위치**: `functions/src/vehicle/ocrRegistration.ts`
- **상태**: ✅ 이미 사용 중

### 2. 한국교통안전공단 공공데이터 API Key
- **시크릿 이름**: `kotsa-public-data-api-key`
- **용도**: 차량 통계 정보 조회
- **사용 위치**: `functions/src/vehicle/getVehicleStatistics.ts` (구현 예정)
- **상태**: ⚠️ 아직 설정되지 않음

---

## Secret Manager 설정 방법

### 방법 1: GCP Console 사용

1. **GCP Console 접속**
   - https://console.cloud.google.com/security/secret-manager?project=carivdealer

2. **시크릿 생성**
   - "시크릿 만들기" 클릭
   - 시크릿 이름 입력 (예: `gemini-api-key`)
   - 시크릿 값 입력 (API 키)
   - "만들기" 클릭

3. **접근 권한 확인**
   - Firebase Functions 서비스 계정이 Secret Manager Secret Accessor 역할을 가지고 있는지 확인
   - 서비스 계정: `carivdealer@appspot.gserviceaccount.com`

### 방법 2: gcloud CLI 사용

#### Gemini API Key 설정
```bash
# 프로젝트 설정
gcloud config set project carivdealer

# 시크릿 생성 (값을 직접 입력)
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create gemini-api-key \
  --data-file=- \
  --replication-policy="automatic"

# 또는 기존 시크릿에 새 버전 추가
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets versions add gemini-api-key \
  --data-file=-
```

#### 한국교통안전공단 API Key 설정
```bash
# 시크릿 생성
echo -n "YOUR_KOTSA_API_KEY" | gcloud secrets create kotsa-public-data-api-key \
  --data-file=- \
  --replication-policy="automatic"
```

### 방법 3: PowerShell 스크립트 사용

```powershell
# 프로젝트 설정
gcloud config set project carivdealer

# Gemini API Key 설정
$geminiKey = Read-Host "Enter Gemini API Key" -AsSecureString
$geminiKeyPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
  [Runtime.InteropServices.Marshal]::SecureStringToBSTR($geminiKey)
)
$geminiKeyPlain | gcloud secrets create gemini-api-key `
  --data-file=- `
  --replication-policy="automatic"

# 한국교통안전공단 API Key 설정
$kotsaKey = Read-Host "Enter KOTSA Public Data API Key" -AsSecureString
$kotsaKeyPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
  [Runtime.InteropServices.Marshal]::SecureStringToBSTR($kotsaKey)
)
$kotsaKeyPlain | gcloud secrets create kotsa-public-data-api-key `
  --data-file=- `
  --replication-policy="automatic"
```

---

## 접근 권한 설정

Firebase Functions가 Secret Manager에 접근하려면 서비스 계정에 권한이 필요합니다.

### 필요한 역할
- **Secret Manager Secret Accessor** (`roles/secretmanager.secretAccessor`)

### 권한 부여 방법

```bash
# Firebase Functions 서비스 계정에 권한 부여
gcloud projects add-iam-policy-binding carivdealer \
  --member="serviceAccount:carivdealer@appspot.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 확인 방법

```bash
# 서비스 계정 권한 확인
gcloud projects get-iam-policy carivdealer \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:carivdealer@appspot.gserviceaccount.com"
```

---

## 코드에서 사용 방법

### Backend (Firebase Functions)

```typescript
import { getSecret } from '../config/secrets';

// 시크릿 로드
const apiKey = await getSecret('gemini-api-key');
```

### 현재 구현 상태

#### ✅ 이미 구현됨
- `functions/src/vehicle/ocrRegistration.ts`: `gemini-api-key` 사용

#### ⚠️ 구현 필요
- `functions/src/vehicle/getVehicleStatistics.ts`: `kotsa-public-data-api-key` 사용 (아직 구현되지 않음)

---

## 시크릿 값 확인 (읽기 전용)

```bash
# 시크릿 목록 확인
gcloud secrets list --project=carivdealer

# 시크릿 값 확인 (최신 버전)
gcloud secrets versions access latest --secret="gemini-api-key"

# 시크릿 버전 목록 확인
gcloud secrets versions list gemini-api-key
```

---

## 시크릿 업데이트

### 새 버전 추가
```bash
echo -n "NEW_API_KEY_VALUE" | gcloud secrets versions add gemini-api-key --data-file=-
```

### 이전 버전 비활성화
```bash
gcloud secrets versions disable VERSION_NUMBER --secret="gemini-api-key"
```

---

## 환경변수 vs Secret Manager

| 항목 | Frontend (환경변수) | Backend (Secret Manager) |
|------|-------------------|------------------------|
| **설정 위치** | `.env` 파일 | GCP Secret Manager |
| **접근 방법** | `import.meta.env.VITE_*` | `getSecret('secret-name')` |
| **보안** | 빌드에 포함됨 (공개 가능한 키만) | 서버에서만 접근 가능 |
| **사용 예시** | Firebase Config | Gemini API Key, KOTSA API Key |

---

## 문제 해결

### 에러: "Permission denied"
- **원인**: 서비스 계정에 Secret Manager 접근 권한 없음
- **해결**: 위의 "접근 권한 설정" 섹션 참조

### 에러: "Secret not found"
- **원인**: 시크릿이 생성되지 않았거나 이름이 잘못됨
- **해결**: `gcloud secrets list`로 시크릿 목록 확인

### 에러: "Failed to get secret"
- **원인**: 시크릿 값이 비어있거나 형식이 잘못됨
- **해결**: 시크릿 값 확인 및 재설정

---

## 체크리스트

### 초기 설정
- [ ] Secret Manager API 활성화 확인
- [ ] Firebase Functions 서비스 계정 권한 확인
- [ ] `gemini-api-key` 시크릿 생성
- [ ] `kotsa-public-data-api-key` 시크릿 생성 (구현 후)

### 배포 전 확인
- [ ] 모든 시크릿이 최신 버전인지 확인
- [ ] 코드에서 올바른 시크릿 이름 사용하는지 확인
- [ ] 에러 핸들링이 적절한지 확인

---

## 참고 문서

- [GCP Secret Manager 문서](https://cloud.google.com/secret-manager/docs)
- [Firebase Functions 환경변수](https://firebase.google.com/docs/functions/config-env)
- [DATABASE_CONFIG.md](./DATABASE_CONFIG.md) - 데이터베이스 설정 문서

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0 | 2025-01-XX | 초기 버전 작성 |

