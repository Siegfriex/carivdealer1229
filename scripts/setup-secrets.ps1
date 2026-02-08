# Secret Manager 설정 스크립트
# Firebase Functions에서 사용할 API 키를 GCP Secret Manager에 설정합니다.

param(
    [switch]$SkipGemini,
    [switch]$SkipKotsa
)

# 프로젝트 설정
$PROJECT_ID = "carivdealer"
$SERVICE_ACCOUNT = "carivdealer@appspot.gserviceaccount.com"

Write-Host "=== Secret Manager 설정 스크립트 ===" -ForegroundColor Cyan
Write-Host "프로젝트: $PROJECT_ID" -ForegroundColor Yellow
Write-Host ""

# 프로젝트 설정 확인
Write-Host "[1/5] 프로젝트 설정 확인 중..." -ForegroundColor Green
gcloud config set project $PROJECT_ID
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 프로젝트 설정 실패" -ForegroundColor Red
    exit 1
}
Write-Host "✅ 프로젝트 설정 완료" -ForegroundColor Green
Write-Host ""

# Secret Manager API 활성화 확인
Write-Host "[2/5] Secret Manager API 활성화 확인 중..." -ForegroundColor Green
$apiEnabled = gcloud services list --enabled --filter="name:secretmanager.googleapis.com" --format="value(name)" 2>$null
if (-not $apiEnabled) {
    Write-Host "⚠️  Secret Manager API가 비활성화되어 있습니다. 활성화 중..." -ForegroundColor Yellow
    gcloud services enable secretmanager.googleapis.com
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Secret Manager API 활성화 실패" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Secret Manager API 활성화 완료" -ForegroundColor Green
} else {
    Write-Host "✅ Secret Manager API 이미 활성화됨" -ForegroundColor Green
}
Write-Host ""

# 서비스 계정 권한 확인 및 부여
Write-Host "[3/5] 서비스 계정 권한 확인 중..." -ForegroundColor Green
$hasPermission = gcloud projects get-iam-policy $PROJECT_ID `
    --flatten="bindings[].members" `
    --filter="bindings.members:serviceAccount:$SERVICE_ACCOUNT AND bindings.role:roles/secretmanager.secretAccessor" `
    --format="value(bindings.role)" 2>$null

if (-not $hasPermission) {
    Write-Host "⚠️  Secret Manager 접근 권한이 없습니다. 권한 부여 중..." -ForegroundColor Yellow
    gcloud projects add-iam-policy-binding $PROJECT_ID `
        --member="serviceAccount:$SERVICE_ACCOUNT" `
        --role="roles/secretmanager.secretAccessor"
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ 권한 부여 실패" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ 권한 부여 완료" -ForegroundColor Green
} else {
    Write-Host "✅ 권한 이미 설정됨" -ForegroundColor Green
}
Write-Host ""

# Gemini API Key 설정
if (-not $SkipGemini) {
    Write-Host "[4/5] Gemini API Key 설정 중..." -ForegroundColor Green
    
    # 시크릿 존재 여부 확인
    $secretExists = gcloud secrets describe gemini-api-key --format="value(name)" 2>$null
    
    if ($secretExists) {
        Write-Host "⚠️  기존 시크릿이 존재합니다. 새 버전을 추가하시겠습니까? (Y/N)" -ForegroundColor Yellow
        $response = Read-Host
        if ($response -eq "Y" -or $response -eq "y") {
            Write-Host "Gemini API Key를 입력하세요 (입력값은 화면에 표시되지 않습니다):" -ForegroundColor Cyan
            $apiKey = Read-Host -AsSecureString
            $apiKeyPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
                [Runtime.InteropServices.Marshal]::SecureStringToBSTR($apiKey)
            )
            
            $apiKeyPlain | gcloud secrets versions add gemini-api-key --data-file=-
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ Gemini API Key 업데이트 완료" -ForegroundColor Green
            } else {
                Write-Host "❌ Gemini API Key 업데이트 실패" -ForegroundColor Red
            }
        } else {
            Write-Host "⏭️  Gemini API Key 설정 건너뜀" -ForegroundColor Yellow
        }
    } else {
        Write-Host "Gemini API Key를 입력하세요 (입력값은 화면에 표시되지 않습니다):" -ForegroundColor Cyan
        $apiKey = Read-Host -AsSecureString
        $apiKeyPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
            [Runtime.InteropServices.Marshal]::SecureStringToBSTR($apiKey)
        )
        
        $apiKeyPlain | gcloud secrets create gemini-api-key `
            --data-file=- `
            --replication-policy="automatic"
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ Gemini API Key 생성 완료" -ForegroundColor Green
        } else {
            Write-Host "❌ Gemini API Key 생성 실패" -ForegroundColor Red
        }
    }
    Write-Host ""
} else {
    Write-Host "[4/5] Gemini API Key 설정 건너뜀 (--SkipGemini)" -ForegroundColor Yellow
    Write-Host ""
}

# 한국교통안전공단 API Key 설정
if (-not $SkipKotsa) {
    Write-Host "[5/5] 한국교통안전공단 공공데이터 API Key 설정 중..." -ForegroundColor Green
    
    # 시크릿 존재 여부 확인
    $secretExists = gcloud secrets describe kotsa-public-data-api-key --format="value(name)" 2>$null
    
    if ($secretExists) {
        Write-Host "⚠️  기존 시크릿이 존재합니다. 새 버전을 추가하시겠습니까? (Y/N)" -ForegroundColor Yellow
        $response = Read-Host
        if ($response -eq "Y" -or $response -eq "y") {
            Write-Host "한국교통안전공단 공공데이터 API Key를 입력하세요 (입력값은 화면에 표시되지 않습니다):" -ForegroundColor Cyan
            $apiKey = Read-Host -AsSecureString
            $apiKeyPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
                [Runtime.InteropServices.Marshal]::SecureStringToBSTR($apiKey)
            )
            
            $apiKeyPlain | gcloud secrets versions add kotsa-public-data-api-key --data-file=-
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✅ 한국교통안전공단 API Key 업데이트 완료" -ForegroundColor Green
            } else {
                Write-Host "❌ 한국교통안전공단 API Key 업데이트 실패" -ForegroundColor Red
            }
        } else {
            Write-Host "⏭️  한국교통안전공단 API Key 설정 건너뜀" -ForegroundColor Yellow
        }
    } else {
        Write-Host "한국교통안전공단 공공데이터 API Key를 입력하세요 (입력값은 화면에 표시되지 않습니다):" -ForegroundColor Cyan
        $apiKey = Read-Host -AsSecureString
        $apiKeyPlain = [Runtime.InteropServices.Marshal]::PtrToStringAuto(
            [Runtime.InteropServices.Marshal]::SecureStringToBSTR($apiKey)
        )
        
        $apiKeyPlain | gcloud secrets create kotsa-public-data-api-key `
            --data-file=- `
            --replication-policy="automatic"
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ 한국교통안전공단 API Key 생성 완료" -ForegroundColor Green
        } else {
            Write-Host "❌ 한국교통안전공단 API Key 생성 실패" -ForegroundColor Red
        }
    }
    Write-Host ""
} else {
    Write-Host "[5/5] 한국교통안전공단 API Key 설정 건너뜀 (--SkipKotsa)" -ForegroundColor Yellow
    Write-Host ""
}

# 완료 메시지
Write-Host "=== 설정 완료 ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "시크릿 목록 확인:" -ForegroundColor Yellow
gcloud secrets list --project=$PROJECT_ID
Write-Host ""
Write-Host "다음 단계:" -ForegroundColor Yellow
Write-Host "1. Firebase Functions 배포: firebase deploy --only functions" -ForegroundColor White
Write-Host "2. 시크릿 값 확인: gcloud secrets versions access latest --secret='gemini-api-key'" -ForegroundColor White

