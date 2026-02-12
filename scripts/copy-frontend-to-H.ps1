# CarivDealer 프론트엔드 전용 복사 스크립트
# 대상: H:\CarivDealer
# 실행: c:\carivdealer에서 .\scripts\copy-frontend-to-H.ps1

$ErrorActionPreference = "Stop"
$Source = "c:\carivdealer"
$Dest = "H:\CarivDealer"

Write-Host "============================================" -ForegroundColor Cyan
Write-Host " CarivDealer 프론트엔드 복사 → $Dest" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

# 대상 폴더 생성
if (-not (Test-Path $Dest)) {
    New-Item -ItemType Directory -Path $Dest -Force | Out-Null
    Write-Host "생성: $Dest" -ForegroundColor Green
} else {
    Write-Host "기존 폴더 사용: $Dest" -ForegroundColor Yellow
}

# 복사 함수
function Copy-ItemRecursive {
    param([string]$From, [string]$To, [string[]]$Exclude = @())
    $params = @{
        Path = $From
        Destination = $To
        Recurse = $true
        Force = $true
        ErrorAction = "SilentlyContinue"
    }
    if ($Exclude.Count -gt 0) {
        $params["Exclude"] = $Exclude
    }
    Copy-Item @params
}

# 1. src/ 전체
Write-Host "`n[1/10] src/ 복사..." -ForegroundColor White
Copy-ItemRecursive -From "$Source\src" -To "$Dest\src"

# 2. 루트 설정 파일
Write-Host "[2/10] 루트 설정 파일 복사..." -ForegroundColor White
$rootFiles = @(
    "package.json", "package-lock.json", "index.html",
    "vite.config.ts", "tsconfig.json", "postcss.config.js", "tailwind.config.js",
    "vitest.config.ts", "playwright.config.ts",
    ".env.example", ".gitignore", ".eslintrc.json", ".prettierrc"
)
foreach ($f in $rootFiles) {
    if (Test-Path "$Source\$f") {
        Copy-Item "$Source\$f" "$Dest\$f" -Force
    }
}

# 3. design/
Write-Host "[3/10] design/ 복사..." -ForegroundColor White
Copy-ItemRecursive -From "$Source\design" -To "$Dest\design"

# 4. img/
Write-Host "[4/10] img/ 복사..." -ForegroundColor White
Copy-ItemRecursive -From "$Source\img" -To "$Dest\img"

# 5. docs/ — 선택 문서만
Write-Host "[5/10] docs/ (선택 문서) 복사..." -ForegroundColor White
$docsDest = "$Dest\docs"
New-Item -ItemType Directory -Path $docsDest -Force | Out-Null

$docsFiles = @(
    "CarivDealer_IA.md",
    "CarivDealer_UserFlow.md",
    "CarivDealer_Storyboard.md",
    "CarivDealer_api_v1.md",
    "CarivDealer_API_ERD_Mapping.md",
    "CarivDealer_DOCUMENT_SUITE_INDEX.md",
    "CarivDealer_VID.md",
    "CarivDealer_SDS_VERIFICATION.md",
    "CarivDealer_DOCUMENT_SUITE_CONSISTENCY_REPORT_20260213.md",
    "FRONTEND_CONVENTIONS.md",
    "STATE_MANAGEMENT_POLICY.md",
    "FSD_ENFORCEMENT_RULES.md",
    "TYPOGRAPHY_AND_FONTS.md",
    "REFACTORING_DEVELOPMENT_RECOMMENDATIONS.md"
)
foreach ($f in $docsFiles) {
    if (Test-Path "$Source\docs\$f") {
        Copy-Item "$Source\docs\$f" "$docsDest\$f" -Force
    }
}

# docs/figma/
$figmaDest = "$docsDest\figma"
New-Item -ItemType Directory -Path $figmaDest -Force | Out-Null
$figmaFiles = @(
    "FSD_IA_NODEID_SSOT.md",
    "IA_SITEMAP_SPEC_IPOE.md",
    "FIGMA_SSOT_AGENT_MCP_METHODOLOGY.md"
)
foreach ($f in $figmaFiles) {
    if (Test-Path "$Source\docs\figma\$f") {
        Copy-Item "$Source\docs\figma\$f" "$figmaDest\$f" -Force
    }
}

# 6. .vscode/
Write-Host "[6/10] .vscode/ 복사..." -ForegroundColor White
if (Test-Path "$Source\.vscode") {
    Copy-ItemRecursive -From "$Source\.vscode" -To "$Dest\.vscode"
}

# 7. firebase.json (hosting만)
Write-Host "[7/10] firebase.json (hosting only) 생성..." -ForegroundColor White
$firebaseHostingOnly = @"
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
"@
Set-Content -Path "$Dest\firebase.json" -Value $firebaseHostingOnly -Encoding UTF8

# 8. .env.example 보강 (필수 env 변수 명시)
Write-Host "[8/10] .env.example 보강..." -ForegroundColor White
$envExample = @"
# ============================================
# CarivDealer 프론트엔드 환경 변수
# .env.local 으로 복사 후 값 채우기
# ============================================

# API Base URL (Firebase Functions 또는 별도 백엔드)
VITE_API_BASE_URL=https://asia-northeast3-carivdealer.cloudfunctions.net

# Firebase (Auth, Storage, Firestore 연결용)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=

# Mock / 개발
VITE_USE_MOCK_LIST=true
VITE_RUN_DEV=
"@
Set-Content -Path "$Dest\.env.example" -Value $envExample -Encoding UTF8

# 9. README.md 복사
Write-Host "[9/10] README.md 복사..." -ForegroundColor White
if (Test-Path "$Source\scripts\README_FRONTEND_TEMPLATE.md") {
    Copy-Item "$Source\scripts\README_FRONTEND_TEMPLATE.md" "$Dest\README.md" -Force
} else {
    Write-Host "  (README_FRONTEND_TEMPLATE.md 없음 - 수동 작성 필요)" -ForegroundColor Yellow
}

# 10. CLAUDE.md (에이전트 컨텍스트)
Write-Host "[10/10] CLAUDE.md 복사..." -ForegroundColor White
if (Test-Path "$Source\CLAUDE.md") {
    Copy-Item "$Source\CLAUDE.md" "$Dest\CLAUDE.md" -Force
}

Write-Host "`n============================================" -ForegroundColor Cyan
Write-Host " 복사 완료: $Dest" -ForegroundColor Green
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "`n다음 단계:" -ForegroundColor Yellow
Write-Host "  1. cd $Dest"
Write-Host "  2. .env.example → .env.local 복사 후 Firebase/API 키 입력"
Write-Host "  3. npm install"
Write-Host "  4. npm run dev"
Write-Host ""
