# carivdealder 의존성 일괄 설치 (Node.js 설치 후 실행)
# 사용: .\install-deps.ps1
# 또는: powershell -ExecutionPolicy Bypass -File "H:\0204\carivdealder\install-deps.ps1"

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

Write-Host "[1/2] Root: npm install" -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) { throw "Root npm install failed" }

Write-Host "[2/2] Functions: npm install + build" -ForegroundColor Cyan
Set-Location ".\functions"
npm install
if ($LASTEXITCODE -ne 0) { throw "Functions npm install failed" }
npm run build
if ($LASTEXITCODE -ne 0) { throw "Functions build failed" }
Set-Location $PSScriptRoot

Write-Host "Done. Run 'npm run dev' to start." -ForegroundColor Green
