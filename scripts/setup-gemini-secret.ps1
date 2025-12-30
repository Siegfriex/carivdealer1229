# 한국교통안전공단 공공데이터 API Key Secret Manager 설정 스크립트
# 제공된 오픈 API 키를 GCP Secret Manager에 설정합니다.

param(
    [string]$ApiKey = "c06db8fb06b9eb310bd1060d450d7d2a2581f406ec46dbf1eae9a803bffbb738"
)

# 프로젝트 설정
$PROJECT_ID = "carivdealer"
$SERVICE_ACCOUNT = "carivdealer@appspot.gserviceaccount.com"
$SECRET_NAME = "kotsa-public-data-api-key"

Write-Host "=== 한국교통안전공단 공공데이터 API Key Secret Manager 설정 ===" -ForegroundColor Cyan
Write-Host "프로젝트: $PROJECT_ID" -ForegroundColor Yellow
Write-Host "시크릿 이름: $SECRET_NAME" -ForegroundColor Yellow
Write-Host ""

# 1. 프로젝트 설정
Write-Host "[1/5] 프로젝트 설정 중..." -ForegroundColor Green
gcloud config set project $PROJECT_ID
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ 프로젝트 설정 실패" -ForegroundColor Red
    exit 1
}
Write-Host "✅ 프로젝트 설정 완료" -ForegroundColor Green
Write-Host ""

# 2. Secret Manager API 활성화
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

# 3. 서비스 계정 권한 확인 및 부여
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

# 4. 시크릿 생성 또는 업데이트
Write-Host "[4/5] 시크릿 생성/업데이트 중..." -ForegroundColor Green

# 시크릿 존재 여부 확인
$secretExists = gcloud secrets describe $SECRET_NAME --format="value(name)" 2>$null

if ($secretExists) {
    Write-Host "⚠️  기존 시크릿이 존재합니다. 새 버전을 추가합니다..." -ForegroundColor Yellow
    $ApiKey | gcloud secrets versions add $SECRET_NAME --data-file=-
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ Gemini API Key 업데이트 완료" -ForegroundColor Green
    } else {
        Write-Host "❌ Gemini API Key 업데이트 실패" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "새 시크릿을 생성합니다..." -ForegroundColor Yellow
    $ApiKey | gcloud secrets create $SECRET_NAME `
        --data-file=- `
        --replication-policy="automatic"
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 한국교통안전공단 공공데이터 API Key 생성 완료" -ForegroundColor Green
    } else {
        Write-Host "❌ 한국교통안전공단 공공데이터 API Key 생성 실패" -ForegroundColor Red
        exit 1
    }
}
Write-Host ""

# 5. 검증
Write-Host "[5/5] 설정 검증 중..." -ForegroundColor Green

# 시크릿 목록 확인
Write-Host "시크릿 목록:" -ForegroundColor Yellow
gcloud secrets list --project=$PROJECT_ID --filter="name:$SECRET_NAME"

# 시크릿 값 확인 (마스킹)
$secretValue = gcloud secrets versions access latest --secret=$SECRET_NAME 2>$null
if ($secretValue) {
    $maskedValue = $secretValue.Substring(0, [Math]::Min(8, $secretValue.Length)) + "..." + $secretValue.Substring([Math]::Max(0, $secretValue.Length - 8))
    Write-Host "시크릿 값 확인: $maskedValue" -ForegroundColor Green
} else {
    Write-Host "⚠️  시크릿 값 확인 실패" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=== 설정 완료 ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "다음 단계:" -ForegroundColor Yellow
Write-Host "1. Firebase Functions 배포: firebase deploy --only functions" -ForegroundColor White
Write-Host "2. Functions 로그 확인: firebase functions:log" -ForegroundColor White
Write-Host ""
Write-Host "코드에서 사용:" -ForegroundColor Yellow
Write-Host "  import { getSecret } from '../config/secrets';" -ForegroundColor Gray
Write-Host "  const apiKey = await getSecret('kotsa-public-data-api-key');" -ForegroundColor Gray

