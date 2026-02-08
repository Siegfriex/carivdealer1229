# GCP Secret Manager 설정 프롬프트

**프로젝트**: `carivdealer`  
**용도**: Firebase Functions에서 사용할 API 키 관리

---

## 시크릿 1: Gemini API Key

### GCP Console에서 설정

1. **Secret Manager 페이지 접속**
   ```
   https://console.cloud.google.com/security/secret-manager?project=carivdealer
   ```

2. **"시크릿 만들기" 클릭**

3. **시크릿 정보 입력**
   - **이름**: `gemini-api-key`
   - **시크릿 값**: `[여기에 Gemini API Key 입력]`
   - **복제 정책**: `자동` 선택

4. **"만들기" 클릭**

### gcloud CLI로 설정

```bash
# 프로젝트 설정
gcloud config set project carivdealer

# 시크릿 생성 (값을 직접 입력)
echo -n "YOUR_GEMINI_API_KEY_HERE" | gcloud secrets create gemini-api-key \
  --data-file=- \
  --replication-policy="automatic"

# 또는 기존 시크릿에 새 버전 추가
echo -n "YOUR_GEMINI_API_KEY_HERE" | gcloud secrets versions add gemini-api-key \
  --data-file=-
```

### PowerShell로 설정

```powershell
# 프로젝트 설정
gcloud config set project carivdealer

# 시크릿 생성
$apiKey = "YOUR_GEMINI_API_KEY_HERE"
$apiKey | gcloud secrets create gemini-api-key `
  --data-file=- `
  --replication-policy="automatic"
```

---

## 시크릿 2: 한국교통안전공단 공공데이터 API Key

### GCP Console에서 설정

1. **Secret Manager 페이지 접속**
   ```
   https://console.cloud.google.com/security/secret-manager?project=carivdealer
   ```

2. **"시크릿 만들기" 클릭**

3. **시크릿 정보 입력**
   - **이름**: `kotsa-public-data-api-key`
   - **시크릿 값**: `[여기에 한국교통안전공단 공공데이터 API Key 입력]`
   - **복제 정책**: `자동` 선택

4. **"만들기" 클릭**

### gcloud CLI로 설정

```bash
# 프로젝트 설정
gcloud config set project carivdealer

# 시크릿 생성
echo -n "YOUR_KOTSA_API_KEY_HERE" | gcloud secrets create kotsa-public-data-api-key \
  --data-file=- \
  --replication-policy="automatic"
```

### PowerShell로 설정

```powershell
# 프로젝트 설정
gcloud config set project carivdealer

# 시크릿 생성
$apiKey = "YOUR_KOTSA_API_KEY_HERE"
$apiKey | gcloud secrets create kotsa-public-data-api-key `
  --data-file=- `
  --replication-policy="automatic"
```

---

## 서비스 계정 권한 설정

Firebase Functions가 Secret Manager에 접근하려면 서비스 계정에 권한이 필요합니다.

### GCP Console에서 설정

1. **IAM 및 관리자 페이지 접속**
   ```
   https://console.cloud.google.com/iam-admin/iam?project=carivdealer
   ```

2. **서비스 계정 찾기**
   - 검색창에 `carivdealer@appspot.gserviceaccount.com` 입력

3. **역할 편집 클릭** (연필 아이콘)

4. **역할 추가**
   - "역할 추가" 클릭
   - `Secret Manager Secret Accessor` 검색 및 선택
   - "저장" 클릭

### gcloud CLI로 설정

```bash
# 프로젝트 설정
gcloud config set project carivdealer

# 서비스 계정에 권한 부여
gcloud projects add-iam-policy-binding carivdealer \
  --member="serviceAccount:carivdealer@appspot.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### PowerShell로 설정

```powershell
# 프로젝트 설정
gcloud config set project carivdealer

# 서비스 계정에 권한 부여
gcloud projects add-iam-policy-binding carivdealer `
  --member="serviceAccount:carivdealer@appspot.gserviceaccount.com" `
  --role="roles/secretmanager.secretAccessor"
```

---

## 설정 확인

### 시크릿 목록 확인

```bash
# gcloud CLI
gcloud secrets list --project=carivdealer

# 또는 GCP Console에서 확인
# https://console.cloud.google.com/security/secret-manager?project=carivdealer
```

### 시크릿 값 확인 (읽기 전용)

```bash
# 최신 버전 확인
gcloud secrets versions access latest --secret="gemini-api-key"
gcloud secrets versions access latest --secret="kotsa-public-data-api-key"
```

### 서비스 계정 권한 확인

```bash
# 서비스 계정 권한 확인
gcloud projects get-iam-policy carivdealer \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:carivdealer@appspot.gserviceaccount.com" \
  --format="table(bindings.role)"
```

---

## 전체 설정 스크립트 (PowerShell)

```powershell
# ============================================
# GCP Secret Manager 전체 설정 스크립트
# ============================================

# 프로젝트 설정
$PROJECT_ID = "carivdealer"
$SERVICE_ACCOUNT = "carivdealer@appspot.gserviceaccount.com"

Write-Host "=== GCP Secret Manager 설정 ===" -ForegroundColor Cyan
Write-Host "프로젝트: $PROJECT_ID" -ForegroundColor Yellow
Write-Host ""

# 1. 프로젝트 설정
Write-Host "[1/4] 프로젝트 설정 중..." -ForegroundColor Green
gcloud config set project $PROJECT_ID
Write-Host "✅ 완료" -ForegroundColor Green
Write-Host ""

# 2. Secret Manager API 활성화
Write-Host "[2/4] Secret Manager API 활성화 중..." -ForegroundColor Green
gcloud services enable secretmanager.googleapis.com
Write-Host "✅ 완료" -ForegroundColor Green
Write-Host ""

# 3. 서비스 계정 권한 부여
Write-Host "[3/4] 서비스 계정 권한 부여 중..." -ForegroundColor Green
gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:$SERVICE_ACCOUNT" `
  --role="roles/secretmanager.secretAccessor"
Write-Host "✅ 완료" -ForegroundColor Green
Write-Host ""

# 4. 시크릿 생성
Write-Host "[4/4] 시크릿 생성 중..." -ForegroundColor Green
Write-Host ""

# Gemini API Key
Write-Host "Gemini API Key를 입력하세요:" -ForegroundColor Cyan
$geminiKey = Read-Host -AsSecureString
$geminiKeyPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
  [Runtime.InteropServices.Marshal]::SecureStringToBSTR($geminiKey)
)

$geminiKeyPlain | gcloud secrets create gemini-api-key `
  --data-file=- `
  --replication-policy="automatic"

if ($LASTEXITCODE -eq 0) {
  Write-Host "✅ Gemini API Key 생성 완료" -ForegroundColor Green
} else {
  Write-Host "⚠️  Gemini API Key가 이미 존재하거나 오류 발생" -ForegroundColor Yellow
}
Write-Host ""

# 한국교통안전공단 API Key
Write-Host "한국교통안전공단 공공데이터 API Key를 입력하세요:" -ForegroundColor Cyan
$kotsaKey = Read-Host -AsSecureString
$kotsaKeyPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
  [Runtime.InteropServices.Marshal]::SecureStringToBSTR($kotsaKey)
)

$kotsaKeyPlain | gcloud secrets create kotsa-public-data-api-key `
  --data-file=- `
  --replication-policy="automatic"

if ($LASTEXITCODE -eq 0) {
  Write-Host "✅ 한국교통안전공단 API Key 생성 완료" -ForegroundColor Green
} else {
  Write-Host "⚠️  한국교통안전공단 API Key가 이미 존재하거나 오류 발생" -ForegroundColor Yellow
}
Write-Host ""

# 완료 메시지
Write-Host "=== 설정 완료 ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "시크릿 목록:" -ForegroundColor Yellow
gcloud secrets list --project=$PROJECT_ID
```

---

## 빠른 참조: 복사용 명령어

### Gemini API Key 설정
```bash
gcloud config set project carivdealer
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create gemini-api-key --data-file=- --replication-policy="automatic"
```

### 한국교통안전공단 API Key 설정
```bash
gcloud config set project carivdealer
echo -n "YOUR_KOTSA_API_KEY" | gcloud secrets create kotsa-public-data-api-key --data-file=- --replication-policy="automatic"
```

### 서비스 계정 권한 부여
```bash
gcloud projects add-iam-policy-binding carivdealer --member="serviceAccount:carivdealer@appspot.gserviceaccount.com" --role="roles/secretmanager.secretAccessor"
```

---

## 참고 사항

1. **API Key 발급 위치**
   - Gemini API Key: https://aistudio.google.com/app/apikey
   - 한국교통안전공단 공공데이터 API Key: https://www.data.go.kr/

2. **보안 주의사항**
   - API Key는 절대 코드에 하드코딩하지 마세요
   - Git에 커밋하지 마세요
   - Secret Manager를 통해서만 관리하세요

3. **시크릿 업데이트**
   - 기존 시크릿에 새 버전을 추가하면 자동으로 최신 버전이 사용됩니다
   - 이전 버전은 비활성화할 수 있습니다

---

## 문제 해결

### 에러: "Permission denied"
- 서비스 계정에 `roles/secretmanager.secretAccessor` 역할이 있는지 확인

### 에러: "Secret already exists"
- 기존 시크릿에 새 버전을 추가하려면 `gcloud secrets versions add` 사용

### 에러: "API not enabled"
- `gcloud services enable secretmanager.googleapis.com` 실행

