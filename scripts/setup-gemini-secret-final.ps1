# ============================================
# Gemini API Key Secret Manager 설정 스크립트
# ============================================
# 이 스크립트는 GCP Secret Manager에 gemini-api-key를 설정합니다.
# 
# 사용법:
#   1. PowerShell에서 실행
#   2. Gemini API Key를 입력하라는 프롬프트가 나타나면 입력
#   3. 스크립트가 자동으로 시크릿 생성/업데이트 및 권한 설정
#
# ============================================

$PROJECT_ID = "carivdealer"
$SECRET_NAME = "gemini-api-key"
$SERVICE_ACCOUNT = "carivdealer@appspot.gserviceaccount.com"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Gemini API Key Secret Manager 설정" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""

# 1. gcloud 로그인 확인
Write-Host "[1/5] gcloud 인증 확인 중..." -ForegroundColor Yellow
$currentAccount = gcloud auth list --filter=status:ACTIVE --format="value(account)" 2>$null
if (-not $currentAccount) {
    Write-Host "❌ gcloud에 로그인되어 있지 않습니다." -ForegroundColor Red
    Write-Host "다음 명령어를 실행하세요: gcloud auth login" -ForegroundColor Yellow
    exit 1
}
Write-Host "✅ 현재 계정: $currentAccount" -ForegroundColor Green
Write-Host ""

# 2. 프로젝트 설정 확인
Write-Host "[2/5] 프로젝트 설정 확인 중..." -ForegroundColor Yellow
$currentProject = gcloud config get-value project 2>$null
if ($currentProject -ne $PROJECT_ID) {
    Write-Host "⚠️  현재 프로젝트가 $PROJECT_ID가 아닙니다. 설정합니다..." -ForegroundColor Yellow
    gcloud config set project $PROJECT_ID
}
Write-Host "✅ 프로젝트: $PROJECT_ID" -ForegroundColor Green
Write-Host ""

# 3. Secret Manager API 활성화 확인
Write-Host "[3/5] Secret Manager API 활성화 확인 중..." -ForegroundColor Yellow
$apiEnabled = gcloud services list --enabled --filter="name:secretmanager.googleapis.com" --format="value(name)" 2>$null
if (-not $apiEnabled) {
    Write-Host "Secret Manager API를 활성화합니다..." -ForegroundColor Yellow
    gcloud services enable secretmanager.googleapis.com --project=$PROJECT_ID
    Write-Host "✅ Secret Manager API 활성화 완료" -ForegroundColor Green
} else {
    Write-Host "✅ Secret Manager API 이미 활성화됨" -ForegroundColor Green
}
Write-Host ""

# 4. 시크릿 생성 또는 업데이트
Write-Host "[4/5] 시크릿 설정 중..." -ForegroundColor Yellow

# 시크릿 존재 여부 확인
$secretExists = $false
try {
    $null = gcloud secrets describe $SECRET_NAME --project=$PROJECT_ID --format="value(name)" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        $secretExists = $true
    }
} catch {
    $secretExists = $false
}

if ($secretExists) {
    Write-Host "⚠️  시크릿 '$SECRET_NAME'이 이미 존재합니다." -ForegroundColor Yellow
    Write-Host "새 버전을 추가합니다..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Gemini API Key를 입력하세요 (입력한 내용은 화면에 표시되지 않습니다):" -ForegroundColor Cyan
    $apiKey = Read-Host -AsSecureString
    
    # SecureString을 일반 문자열로 변환
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($apiKey)
    $apiKeyPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)
    
    if ([string]::IsNullOrWhiteSpace($apiKeyPlain)) {
        Write-Host "❌ API Key가 비어있습니다. 종료합니다." -ForegroundColor Red
        exit 1
    }
    
    # 새 버전 추가
    $apiKeyPlain | gcloud secrets versions add $SECRET_NAME --data-file=- --project=$PROJECT_ID 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 시크릿 버전 추가 완료" -ForegroundColor Green
    } else {
        Write-Host "❌ 시크릿 버전 추가 실패" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "새 시크릿을 생성합니다..." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Gemini API Key를 입력하세요 (입력한 내용은 화면에 표시되지 않습니다):" -ForegroundColor Cyan
    $apiKey = Read-Host -AsSecureString
    
    # SecureString을 일반 문자열로 변환
    $BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($apiKey)
    $apiKeyPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
    [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)
    
    if ([string]::IsNullOrWhiteSpace($apiKeyPlain)) {
        Write-Host "❌ API Key가 비어있습니다. 종료합니다." -ForegroundColor Red
        exit 1
    }
    
    # 시크릿 생성
    $apiKeyPlain | gcloud secrets create $SECRET_NAME `
        --data-file=- `
        --replication-policy="automatic" `
        --project=$PROJECT_ID 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 시크릿 생성 완료" -ForegroundColor Green
    } else {
        Write-Host "❌ 시크릿 생성 실패" -ForegroundColor Red
        Write-Host "에러 메시지를 확인하세요." -ForegroundColor Yellow
        exit 1
    }
}
Write-Host ""

# 5. 서비스 계정 권한 확인 및 부여
Write-Host "[5/5] 서비스 계정 권한 확인 중..." -ForegroundColor Yellow

# 권한 확인
$hasPermission = $false
try {
    $roles = gcloud projects get-iam-policy $PROJECT_ID `
        --flatten="bindings[].members" `
        --filter="bindings.members:serviceAccount:$SERVICE_ACCOUNT AND bindings.role:roles/secretmanager.secretAccessor" `
        --format="value(bindings.role)" 2>$null
    
    if ($roles -contains "roles/secretmanager.secretAccessor") {
        $hasPermission = $true
    }
} catch {
    $hasPermission = $false
}

if (-not $hasPermission) {
    Write-Host "서비스 계정에 권한을 부여합니다..." -ForegroundColor Yellow
    gcloud projects add-iam-policy-binding $PROJECT_ID `
        --member="serviceAccount:$SERVICE_ACCOUNT" `
        --role="roles/secretmanager.secretAccessor" `
        --condition=None 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 서비스 계정 권한 부여 완료" -ForegroundColor Green
    } else {
        Write-Host "⚠️  서비스 계정 권한 부여 실패 (수동으로 확인 필요)" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ 서비스 계정 권한 이미 설정됨" -ForegroundColor Green
}
Write-Host ""

# 완료 메시지
Write-Host "============================================" -ForegroundColor Green
Write-Host "✅ 설정 완료!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "다음 단계:" -ForegroundColor Cyan
Write-Host "  1. Functions 재배포: firebase deploy --only functions:ocrRegistrationAPI" -ForegroundColor Yellow
Write-Host "  2. Functions 로그 확인: gcloud functions logs read ocrRegistrationAPI --region=asia-northeast3 --limit=50" -ForegroundColor Yellow
Write-Host ""
Write-Host "시크릿 확인:" -ForegroundColor Cyan
Write-Host "  gcloud secrets describe $SECRET_NAME --project=$PROJECT_ID" -ForegroundColor Yellow
Write-Host ""

