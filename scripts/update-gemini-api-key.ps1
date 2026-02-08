# ============================================
# Gemini API Key 업데이트 스크립트
# ============================================
# 이 스크립트는 유출된 API 키를 새 키로 교체합니다.
# 
# 사용법:
#   1. Google AI Studio에서 새 API 키 생성
#      https://aistudio.google.com/app/apikey
#   2. PowerShell에서 실행
#   3. 새 API Key를 입력하라는 프롬프트가 나타나면 입력
#
# ============================================

$PROJECT_ID = "carivdealer"
$SECRET_NAME = "gemini-api-key"
$SERVICE_ACCOUNT = "carivdealer@appspot.gserviceaccount.com"

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "Gemini API Key 업데이트" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "⚠️  현재 API 키가 유출로 보고되어 차단되었습니다." -ForegroundColor Yellow
Write-Host "새로운 API 키를 생성하고 업데이트해야 합니다." -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Google AI Studio에서 새 API 키 생성:" -ForegroundColor Cyan
Write-Host "   https://aistudio.google.com/app/apikey" -ForegroundColor White
Write-Host ""
Write-Host "2. 생성한 새 API 키를 아래에 입력하세요." -ForegroundColor Cyan
Write-Host ""

# 시크릿 존재 확인
$secretExists = $false
try {
    $null = gcloud secrets describe $SECRET_NAME --project=$PROJECT_ID --format="value(name)" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) {
        $secretExists = $true
    }
} catch {
    $secretExists = $false
}

if (-not $secretExists) {
    Write-Host "⚠️  시크릿 '$SECRET_NAME'이 존재하지 않습니다." -ForegroundColor Yellow
    Write-Host "새 시크릿을 생성합니다..." -ForegroundColor Yellow
    Write-Host ""
}

# 새 API 키 입력
Write-Host "새 Gemini API Key를 입력하세요 (입력한 내용은 화면에 표시되지 않습니다):" -ForegroundColor Cyan
$apiKey = Read-Host -AsSecureString

# SecureString을 일반 문자열로 변환
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($apiKey)
$apiKeyPlain = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($BSTR)

if ([string]::IsNullOrWhiteSpace($apiKeyPlain)) {
    Write-Host "❌ API Key가 비어있습니다. 종료합니다." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "시크릿 업데이트 중..." -ForegroundColor Yellow

if ($secretExists) {
    # 기존 시크릿에 새 버전 추가
    $apiKeyPlain | gcloud secrets versions add $SECRET_NAME --data-file=- --project=$PROJECT_ID 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 시크릿 버전 추가 완료" -ForegroundColor Green
        
        # 이전 버전 확인 (선택사항)
        Write-Host ""
        Write-Host "이전 버전을 비활성화하시겠습니까? (y/n): " -ForegroundColor Cyan -NoNewline
        $disableOld = Read-Host
        
        if ($disableOld -eq "y" -or $disableOld -eq "Y") {
            Write-Host "이전 버전 목록:" -ForegroundColor Yellow
            gcloud secrets versions list $SECRET_NAME --project=$PROJECT_ID --format="table(name,state)"
            Write-Host ""
            Write-Host "비활성화할 버전 번호를 입력하세요 (예: 1): " -ForegroundColor Cyan -NoNewline
            $versionToDisable = Read-Host
            
            if ($versionToDisable) {
                gcloud secrets versions disable $versionToDisable --secret=$SECRET_NAME --project=$PROJECT_ID 2>&1 | Out-Null
                if ($LASTEXITCODE -eq 0) {
                    Write-Host "✅ 버전 $versionToDisable 비활성화 완료" -ForegroundColor Green
                }
            }
        }
    } else {
        Write-Host "❌ 시크릿 버전 추가 실패" -ForegroundColor Red
        Write-Host "에러 메시지를 확인하세요." -ForegroundColor Yellow
        exit 1
    }
} else {
    # 새 시크릿 생성
    $apiKeyPlain | gcloud secrets create $SECRET_NAME `
        --data-file=- `
        --replication-policy="automatic" `
        --project=$PROJECT_ID 2>&1 | Out-Null
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ 시크릿 생성 완료" -ForegroundColor Green
        
        # 서비스 계정 권한 확인 및 부여
        Write-Host ""
        Write-Host "서비스 계정 권한 확인 중..." -ForegroundColor Yellow
        
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
    } else {
        Write-Host "❌ 시크릿 생성 실패" -ForegroundColor Red
        Write-Host "에러 메시지를 확인하세요." -ForegroundColor Yellow
        exit 1
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Green
Write-Host "✅ API 키 업데이트 완료!" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Green
Write-Host ""
Write-Host "다음 단계:" -ForegroundColor Cyan
Write-Host "  1. Functions 재배포 (필수):" -ForegroundColor Yellow
Write-Host "     firebase deploy --only functions:ocrRegistrationAPI" -ForegroundColor White
Write-Host ""
Write-Host "  2. Functions 로그 확인:" -ForegroundColor Yellow
Write-Host "     gcloud functions logs read ocrRegistrationAPI --region=asia-northeast3 --limit=50" -ForegroundColor White
Write-Host ""
Write-Host "  3. API 테스트:" -ForegroundColor Yellow
Write-Host "     웹 브라우저에서 OCR 기능 테스트" -ForegroundColor White
Write-Host ""
Write-Host "시크릿 확인:" -ForegroundColor Cyan
Write-Host "  gcloud secrets versions list $SECRET_NAME --project=$PROJECT_ID" -ForegroundColor White
Write-Host ""

