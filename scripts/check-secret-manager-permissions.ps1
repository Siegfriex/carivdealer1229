# Secret Manager 접근 권한 확인 스크립트
# Firebase Functions 서비스 계정의 Secret Manager 접근 권한을 확인합니다.

$PROJECT_ID = "carivdealer"
$SERVICE_ACCOUNTS = @(
    "cloud-runtime-unified@carivdealer.iam.gserviceaccount.com",
    "carivdealer@appspot.gserviceaccount.com"
)

Write-Host "=== Secret Manager 접근 권한 확인 ===" -ForegroundColor Cyan
Write-Host "프로젝트: $PROJECT_ID" -ForegroundColor Yellow
Write-Host ""

# 프로젝트 설정
gcloud config set project $PROJECT_ID

Write-Host "[1/3] 서비스 계정 목록 확인 중..." -ForegroundColor Green
foreach ($sa in $SERVICE_ACCOUNTS) {
    Write-Host "  확인 중: $sa" -ForegroundColor Gray
    $exists = gcloud iam service-accounts describe $sa --project=$PROJECT_ID 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "    ✅ 서비스 계정 존재함" -ForegroundColor Green
    } else {
        Write-Host "    ❌ 서비스 계정 없음" -ForegroundColor Red
    }
}
Write-Host ""

Write-Host "[2/3] Secret Manager 접근 권한 확인 중..." -ForegroundColor Green
foreach ($sa in $SERVICE_ACCOUNTS) {
    Write-Host "  확인 중: $sa" -ForegroundColor Gray
    
    $hasPermission = gcloud projects get-iam-policy $PROJECT_ID `
        --flatten="bindings[].members" `
        --filter="bindings.members:serviceAccount:$sa AND bindings.role:roles/secretmanager.secretAccessor" `
        --format="value(bindings.role)" 2>$null
    
    if ($hasPermission -contains "roles/secretmanager.secretAccessor") {
        Write-Host "    ✅ Secret Manager 접근 권한 있음" -ForegroundColor Green
    } else {
        Write-Host "    ❌ Secret Manager 접근 권한 없음" -ForegroundColor Red
        Write-Host "    권한 부여 명령어:" -ForegroundColor Yellow
        Write-Host "      gcloud projects add-iam-policy-binding $PROJECT_ID `" -ForegroundColor Gray
        Write-Host "        --member=`"serviceAccount:$sa`" `" -ForegroundColor Gray
        Write-Host "        --role=`"roles/secretmanager.secretAccessor`"" -ForegroundColor Gray
    }
}
Write-Host ""

Write-Host "[3/3] Secret Manager 시크릿 확인 중..." -ForegroundColor Green
$secrets = @("gemini-api-key", "kotsa-public-data-api-key", "google-maps-api-key")
foreach ($secret in $secrets) {
    Write-Host "  확인 중: $secret" -ForegroundColor Gray
    $exists = gcloud secrets describe $secret --project=$PROJECT_ID 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "    ✅ 시크릿 존재함" -ForegroundColor Green
    } else {
        Write-Host "    ❌ 시크릿 없음" -ForegroundColor Yellow
    }
}
Write-Host ""

Write-Host "=== 확인 완료 ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "권한이 없는 경우 다음 명령어로 권한 부여:" -ForegroundColor Yellow
Write-Host "  gcloud projects add-iam-policy-binding $PROJECT_ID `" -ForegroundColor Gray
Write-Host "    --member=`"serviceAccount:cloud-runtime-unified@carivdealer.iam.gserviceaccount.com`" `" -ForegroundColor Gray
Write-Host "    --role=`"roles/secretmanager.secretAccessor`"" -ForegroundColor Gray

