# 기존 서비스 계정으로 Functions IAM 설정 스크립트
# 사용법: .\scripts\fix-functions-iam-service-account.ps1

$functions = @(
    "acceptProposalAPI",
    "handoverApproveAPI",
    "inspectionAssignAPI",
    "inspectionGetResultAPI",
    "inspectionUploadResultAPI",
    "logisticsDispatchConfirmAPI",
    "logisticsDispatchRequestAPI",
    "logisticsScheduleAPI",
    "settlementNotifyAPI"
)

$region = "asia-northeast3"
$project = "carivdealer"
$serviceAccount = "cloud-functions-executor@carivdealer.iam.gserviceaccount.com"

Write-Host "=== 기존 서비스 계정으로 Functions IAM 설정 ===" -ForegroundColor Cyan
Write-Host "프로젝트: $project" -ForegroundColor Yellow
Write-Host "리전: $region" -ForegroundColor Yellow
Write-Host "서비스 계정: $serviceAccount" -ForegroundColor Yellow
Write-Host ""

# 프로젝트 설정
Write-Host "프로젝트 설정 중..." -ForegroundColor Gray
gcloud config set project $project

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ gcloud CLI가 설치되어 있지 않거나 로그인이 필요합니다." -ForegroundColor Red
    Write-Host "다음 명령어를 실행하세요: gcloud auth login" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ 프로젝트 설정 완료" -ForegroundColor Green
Write-Host ""

# 기존 Functions의 IAM 설정 확인 (참고용)
Write-Host "기존 Function IAM 설정 확인 중..." -ForegroundColor Gray
gcloud functions get-iam-policy ocrRegistrationAPI --region=$region --gen2 --format="yaml" | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ 기존 Function IAM 설정 확인 완료" -ForegroundColor Green
} else {
    Write-Host "⚠️ 기존 Function IAM 설정 확인 실패 (계속 진행)" -ForegroundColor Yellow
}
Write-Host ""

# 각 Function에 대해 서비스 계정 invoker 권한 부여
$successCount = 0
$failCount = 0

Write-Host "새 Functions에 서비스 계정 invoker 권한 부여 중..." -ForegroundColor Cyan
Write-Host ""

foreach ($func in $functions) {
    Write-Host "[$($functions.IndexOf($func) + 1)/$($functions.Count)] $func 설정 중..." -ForegroundColor Gray
    
    gcloud functions add-invoker-policy-binding $func `
        --region=$region `
        --member="serviceAccount:$serviceAccount" `
        --role="roles/cloudfunctions.invoker" `
        2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  ✅ $func 설정 완료" -ForegroundColor Green
        $successCount++
    } else {
        Write-Host "  ❌ $func 설정 실패" -ForegroundColor Red
        $failCount++
    }
}

Write-Host ""
Write-Host "=== 결과 요약 ===" -ForegroundColor Cyan
Write-Host "성공: $successCount" -ForegroundColor Green
Write-Host "실패: $failCount" -ForegroundColor $(if ($failCount -gt 0) { "Red" } else { "Green" })

if ($failCount -gt 0) {
    Write-Host ""
    Write-Host "⚠️ 일부 Function 설정에 실패했습니다." -ForegroundColor Yellow
    Write-Host "다음 권한이 필요할 수 있습니다:" -ForegroundColor Yellow
    Write-Host "  - roles/functions.admin" -ForegroundColor Yellow
    Write-Host "  - roles/iam.securityAdmin" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "GCP 콘솔에서 수동으로 설정하세요:" -ForegroundColor Yellow
    Write-Host "  https://console.cloud.google.com/functions/list?project=$project&region=$region" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "각 Function → 권한 탭 → 주 구성원 추가" -ForegroundColor Yellow
    Write-Host "  새 주 구성원: $serviceAccount" -ForegroundColor Yellow
    Write-Host "  역할: Cloud Functions Invoker" -ForegroundColor Yellow
} else {
    Write-Host ""
    Write-Host "✅ 모든 Function에 서비스 계정 invoker 권한이 설정되었습니다!" -ForegroundColor Green
    Write-Host ""
    Write-Host "검증 방법:" -ForegroundColor Cyan
    Write-Host "  gcloud functions get-iam-policy acceptProposalAPI --region=$region --gen2" -ForegroundColor Gray
}

