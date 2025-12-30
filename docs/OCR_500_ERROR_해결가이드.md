# OCR API 500 에러 해결 가이드

**에러 메시지**: `Failed to load resource: the server responded with a status of 500`

---

## 가능한 원인

### 1. Secret Manager에 API 키가 설정되지 않음 (가장 가능성 높음)
- `gemini-api-key` 시크릿이 생성되지 않았거나 접근 권한이 없음

### 2. Functions가 배포되지 않음
- 최신 코드가 배포되지 않았거나 배포 실패

### 3. 서비스 계정 권한 부족
- Secret Manager 접근 권한이 없음

### 4. Gemini API 키 문제
- API 키가 잘못되었거나 만료됨

---

## 해결 방법

### 1단계: Functions 로그 확인

```bash
# 최근 로그 확인
firebase functions:log --only ocrRegistrationAPI --limit 20

# 또는 실시간 로그 확인
firebase functions:log --only ocrRegistrationAPI --follow
```

**확인할 내용**:
- `Failed to get secret gemini-api-key` 에러
- `Permission denied` 에러
- `Secret not found` 에러

### 2단계: Secret Manager 설정 확인

```bash
# 시크릿 목록 확인
gcloud secrets list --project=carivdealer

# 시크릿 존재 확인
gcloud secrets describe gemini-api-key --project=carivdealer

# 시크릿 값 확인 (마스킹)
gcloud secrets versions access latest --secret="gemini-api-key" --project=carivdealer | Select-Object -First 1
```

**예상 결과**:
- `gemini-api-key` 시크릿이 목록에 표시되어야 함
- 시크릿 값이 반환되어야 함

### 3단계: 서비스 계정 권한 확인

```bash
# 서비스 계정 권한 확인
gcloud projects get-iam-policy carivdealer \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:carivdealer@appspot.gserviceaccount.com" \
  --format="table(bindings.role)"
```

**확인할 역할**:
- `roles/secretmanager.secretAccessor` 또는 `roles/secretmanager.secretAccessor`

### 4단계: Secret Manager 설정 (미설정 시)

#### Gemini API Key 설정

```bash
# 프로젝트 설정
gcloud config set project carivdealer

# Secret Manager API 활성화
gcloud services enable secretmanager.googleapis.com

# 시크릿 생성 (API 키를 입력해야 함)
echo -n "YOUR_GEMINI_API_KEY_HERE" | gcloud secrets create gemini-api-key \
  --data-file=- \
  --replication-policy="automatic"

# 서비스 계정 권한 부여
gcloud projects add-iam-policy-binding carivdealer \
  --member="serviceAccount:carivdealer@appspot.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 5단계: Functions 재배포

Secret Manager 설정 후 Functions를 재배포:

```bash
firebase deploy --only functions:ocrRegistrationAPI
```

---

## 빠른 진단 스크립트

다음 PowerShell 스크립트로 문제를 진단할 수 있습니다:

```powershell
# OCR API 500 에러 진단 스크립트
$PROJECT_ID = "carivdealer"
$SERVICE_ACCOUNT = "carivdealer@appspot.gserviceaccount.com"

Write-Host "=== OCR API 500 에러 진단 ===" -ForegroundColor Cyan
Write-Host ""

# 1. Secret Manager API 활성화 확인
Write-Host "[1/4] Secret Manager API 확인 중..." -ForegroundColor Green
$apiEnabled = gcloud services list --enabled --filter="name:secretmanager.googleapis.com" --format="value(name)" 2>$null
if ($apiEnabled) {
    Write-Host "✅ Secret Manager API 활성화됨" -ForegroundColor Green
} else {
    Write-Host "❌ Secret Manager API 비활성화됨" -ForegroundColor Red
    Write-Host "   해결: gcloud services enable secretmanager.googleapis.com" -ForegroundColor Yellow
}
Write-Host ""

# 2. 시크릿 존재 확인
Write-Host "[2/4] gemini-api-key 시크릿 확인 중..." -ForegroundColor Green
$secretExists = gcloud secrets describe gemini-api-key --format="value(name)" 2>$null
if ($secretExists) {
    Write-Host "✅ gemini-api-key 시크릿 존재함" -ForegroundColor Green
} else {
    Write-Host "❌ gemini-api-key 시크릿 없음" -ForegroundColor Red
    Write-Host "   해결: Secret Manager에 시크릿 생성 필요" -ForegroundColor Yellow
}
Write-Host ""

# 3. 서비스 계정 권한 확인
Write-Host "[3/4] 서비스 계정 권한 확인 중..." -ForegroundColor Green
$hasPermission = gcloud projects get-iam-policy $PROJECT_ID `
    --flatten="bindings[].members" `
    --filter="bindings.members:serviceAccount:$SERVICE_ACCOUNT AND bindings.role:roles/secretmanager.secretAccessor" `
    --format="value(bindings.role)" 2>$null
if ($hasPermission) {
    Write-Host "✅ Secret Manager 접근 권한 있음" -ForegroundColor Green
} else {
    Write-Host "❌ Secret Manager 접근 권한 없음" -ForegroundColor Red
    Write-Host "   해결: 서비스 계정에 권한 부여 필요" -ForegroundColor Yellow
}
Write-Host ""

# 4. Functions 배포 상태 확인
Write-Host "[4/4] Functions 배포 상태 확인 중..." -ForegroundColor Green
Write-Host "   Firebase Console에서 확인: https://console.firebase.google.com/project/$PROJECT_ID/functions" -ForegroundColor Yellow
Write-Host ""

Write-Host "=== 진단 완료 ===" -ForegroundColor Cyan
```

---

## 일반적인 해결 방법

### 방법 1: Secret Manager 설정 후 재배포

```bash
# 1. Secret Manager 설정 (위의 4단계 참조)
# 2. Functions 재배포
firebase deploy --only functions:ocrRegistrationAPI
```

### 방법 2: 임시 해결 (로컬 개발용)

로컬에서 테스트할 때는 `functions/.env` 파일을 사용할 수 있습니다:

```bash
# functions/.env 파일 생성
GEMINI_API_KEY=your-gemini-api-key-here
```

그리고 Firebase Emulator 실행:
```bash
cd functions
npm run serve
```

---

## Functions 로그에서 확인할 에러 메시지

### 에러 1: "Failed to get secret gemini-api-key"
**원인**: Secret Manager에 시크릿이 없거나 접근 권한 없음
**해결**: Secret Manager 설정 및 권한 부여

### 에러 2: "Permission denied"
**원인**: 서비스 계정에 Secret Manager 접근 권한 없음
**해결**: `roles/secretmanager.secretAccessor` 역할 부여

### 에러 3: "Secret not found"
**원인**: 시크릿 이름이 잘못되었거나 존재하지 않음
**해결**: 시크릿 이름 확인 및 재생성

### 에러 4: "Gemini API key configuration error"
**원인**: API 키가 비어있거나 잘못됨
**해결**: Secret Manager에 올바른 API 키 설정

---

## 체크리스트

- [ ] Secret Manager API 활성화 확인
- [ ] `gemini-api-key` 시크릿 생성 확인
- [ ] 서비스 계정 권한 확인
- [ ] Functions 배포 확인
- [ ] Functions 로그 확인
- [ ] 에러 메시지 분석

---

## 참고 문서

- [SECRET_MANAGER_완전체_설정_프롬프트.md](./SECRET_MANAGER_완전체_설정_프롬프트.md)
- [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)

