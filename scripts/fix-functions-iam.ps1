# Functions IAM 설정 자동화 스크립트
# 사용법: .\scripts\fix-functions-iam.ps1

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

Write-Host "=== Functions IAM 설정 시작 ===" -ForegroundColor Cyan
Write-Host "프로젝트: $project" -ForegroundColor Yellow
Write-Host "리전: $region" -ForegroundColor Yellow
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

# 각 Function에 대해 IAM 설정
$successCount = 0
$failCount = 0

foreach ($func in $functions) {
    Write-Host "[$($functions.IndexOf($func) + 1)/$($functions.Count)] $func 설정 중..." -ForegroundColor Gray
    
    gcloud functions add-invoker-policy-binding $func `
        --region=$region `
        --member="allUsers" `
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
} else {
    Write-Host ""
    Write-Host "✅ 모든 Function IAM 설정이 완료되었습니다!" -ForegroundColor Green
}

