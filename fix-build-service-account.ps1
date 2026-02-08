# Firebase Functions v2 빌드 서비스 계정 권한 부여 스크립트
# 프로젝트: carivdealer
# 프로젝트 번호: 850300267700

$PROJECT_ID = "carivdealer"
$PROJECT_NUMBER = "850300267700"
$BUILD_SERVICE_ACCOUNT = "${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "Firebase Functions 빌드 서비스 계정 권한 부여" -ForegroundColor Cyan
Write-Host "프로젝트: $PROJECT_ID" -ForegroundColor Cyan
Write-Host "프로젝트 번호: $PROJECT_NUMBER" -ForegroundColor Cyan
Write-Host "빌드 서비스 계정: $BUILD_SERVICE_ACCOUNT" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 1. Storage Object Viewer 권한 부여 (Cloud Build가 소스 코드 저장/읽기 위해 필요)
Write-Host "[1/3] Storage Object Viewer 권한 부여 중..." -ForegroundColor Yellow
gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:$BUILD_SERVICE_ACCOUNT" `
  --role="roles/storage.objectViewer" `
  --condition=None

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Storage Object Viewer 권한 부여 완료" -ForegroundColor Green
} else {
    Write-Host "❌ Storage Object Viewer 권한 부여 실패" -ForegroundColor Red
}

# 2. Storage Object Creator 권한 부여 (빌드 아티팩트 저장을 위해 필요)
Write-Host "[2/3] Storage Object Creator 권한 부여 중..." -ForegroundColor Yellow
gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:$BUILD_SERVICE_ACCOUNT" `
  --role="roles/storage.objectCreator" `
  --condition=None

if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ Storage Object Creator 권한 부여 완료" -ForegroundColor Green
} else {
    Write-Host "❌ Storage Object Creator 권한 부여 실패" -ForegroundColor Red
}

# 3. Cloud Build Service Account 권한 확인
Write-Host "[3/3] Cloud Build Service Account 권한 확인 중..." -ForegroundColor Yellow
gcloud projects get-iam-policy $PROJECT_ID `
  --flatten="bindings[].members" `
  --filter="bindings.members:serviceAccount:$BUILD_SERVICE_ACCOUNT" `
  --format="table(bindings.role)"

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "권한 부여 완료!" -ForegroundColor Green
Write-Host "이제 'firebase deploy --only functions' 명령어를 다시 실행하세요." -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan

