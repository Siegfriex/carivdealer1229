# GCP API 활성화 상태 확인 스크립트
# 사용법: .\scripts\check-gcp-apis.ps1

$project = "carivdealer"

# 필수 API 목록
$requiredApis = @(
    @{Name="Firebase Management API"; Id="firebase.googleapis.com"},
    @{Name="Firebase Hosting API"; Id="firebasehosting.googleapis.com"},
    @{Name="Firebase Authentication API"; Id="identitytoolkit.googleapis.com"},
    @{Name="Firebase Extensions API"; Id="firebaseextensions.googleapis.com"},
    @{Name="Cloud Functions API"; Id="cloudfunctions.googleapis.com"},
    @{Name="Cloud Build API"; Id="cloudbuild.googleapis.com"},
    @{Name="Cloud Run API"; Id="run.googleapis.com"},
    @{Name="Artifact Registry API"; Id="artifactregistry.googleapis.com"},
    @{Name="Eventarc API"; Id="eventarc.googleapis.com"},
    @{Name="Cloud Scheduler API"; Id="cloudscheduler.googleapis.com"},
    @{Name="Pub/Sub API"; Id="pubsub.googleapis.com"},
    @{Name="Cloud Firestore API"; Id="firestore.googleapis.com"},
    @{Name="Cloud Storage API"; Id="storage.googleapis.com"},
    @{Name="Cloud Storage JSON API"; Id="storage-api.googleapis.com"},
    @{Name="Vertex AI API"; Id="aiplatform.googleapis.com"},
    @{Name="Secret Manager API"; Id="secretmanager.googleapis.com"},
    @{Name="Cloud Logging API"; Id="logging.googleapis.com"},
    @{Name="Cloud Monitoring API"; Id="monitoring.googleapis.com"}
)

Write-Host "=== GCP API 활성화 상태 확인 ===" -ForegroundColor Cyan
Write-Host "프로젝트: $project" -ForegroundColor Yellow
Write-Host ""

# 프로젝트 설정
gcloud config set project $project | Out-Null

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ gcloud CLI가 설치되어 있지 않거나 로그인이 필요합니다." -ForegroundColor Red
    Write-Host "다음 명령어를 실행하세요: gcloud auth login" -ForegroundColor Yellow
    exit 1
}

# 활성화된 API 목록 가져오기
Write-Host "활성화된 API 목록 조회 중..." -ForegroundColor Gray
$enabledApis = gcloud services list --enabled --project=$project --format="value(config.name)" 2>&1

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ API 목록 조회 실패" -ForegroundColor Red
    exit 1
}

Write-Host "✅ API 목록 조회 완료" -ForegroundColor Green
Write-Host ""

# 각 필수 API 확인
$enabledCount = 0
$disabledCount = 0
$disabledApis = @()

Write-Host "필수 API 활성화 상태 확인 중..." -ForegroundColor Cyan
Write-Host ""

foreach ($api in $requiredApis) {
    $isEnabled = $enabledApis -contains $api.Id
    
    if ($isEnabled) {
        Write-Host "  ✅ $($api.Name) ($($api.Id))" -ForegroundColor Green
        $enabledCount++
    } else {
        Write-Host "  ❌ $($api.Name) ($($api.Id))" -ForegroundColor Red
        $disabledCount++
        $disabledApis += $api
    }
}

Write-Host ""
Write-Host "=== 결과 요약 ===" -ForegroundColor Cyan
Write-Host "활성화됨: $enabledCount / $($requiredApis.Count)" -ForegroundColor Green
Write-Host "비활성화됨: $disabledCount / $($requiredApis.Count)" -ForegroundColor $(if ($disabledCount -gt 0) { "Red" } else { "Green" })

if ($disabledCount -gt 0) {
    Write-Host ""
    Write-Host "⚠️ 비활성화된 API가 있습니다." -ForegroundColor Yellow
    Write-Host ""
    Write-Host "활성화 방법:" -ForegroundColor Cyan
    Write-Host "1. GCP 콘솔에서 활성화:" -ForegroundColor Yellow
    Write-Host "   https://console.cloud.google.com/apis/library?project=$project" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "2. gcloud CLI로 활성화:" -ForegroundColor Yellow
    foreach ($api in $disabledApis) {
        Write-Host "   gcloud services enable $($api.Id) --project=$project" -ForegroundColor Gray
    }
    Write-Host ""
    Write-Host "3. 일괄 활성화:" -ForegroundColor Yellow
    Write-Host "   foreach (`$api in @($($disabledApis.Id -join ', '))) { gcloud services enable `$api --project=$project }" -ForegroundColor Gray
} else {
    Write-Host ""
    Write-Host "✅ 모든 필수 API가 활성화되어 있습니다!" -ForegroundColor Green
}

Write-Host ""
Write-Host "전체 활성화된 API 목록 보기:" -ForegroundColor Cyan
Write-Host "  gcloud services list --enabled --project=$project" -ForegroundColor Gray

