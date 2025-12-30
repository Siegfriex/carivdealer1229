# Firestore Rules 배포 전 검증 스크립트
# 프로덕션 배포 시 오픈 룰(allow read, write: if true)이 포함되어 있으면 배포 차단

param(
    [Parameter(Mandatory=$false)]
    [string]$RulesFile = "firestore.rules"
)

$rulesContent = Get-Content -Path $RulesFile -Raw -Encoding UTF8

# 오픈 룰 패턴 검사
$openRulePattern = "allow\s+(read|write)\s*:\s*if\s+true"

if ($rulesContent -match $openRulePattern) {
    Write-Host "❌ 오류: $RulesFile 에 오픈 룰(allow read, write: if true)이 포함되어 있습니다." -ForegroundColor Red
    Write-Host "프로덕션 배포 전에 firestore.rules.prod 를 사용하거나 오픈 룰을 제거해주세요." -ForegroundColor Yellow
    exit 1
} else {
    Write-Host "✅ $RulesFile 검증 완료: 오픈 룰이 없습니다." -ForegroundColor Green
    exit 0
}

