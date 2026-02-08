# 매물등록 플로우 테스트 환경: 로그 리프레시 + 수집기 기동
# 사용:
#   .\scripts\run-register-flow-test.ps1           # 수집기 포그라운드 (이 터미널에서 계속 실행)
#   .\scripts\run-register-flow-test.ps1 -Background # 로그만 초기화 후 수집기 백그라운드 기동, 종료
# 그 다음: npm run dev 후 브라우저에서 플로우 테스트

param([switch]$Background)

$ErrorActionPreference = "Stop"
$ProjectRoot = $PSScriptRoot + "\.."
$CursorDir = Join-Path $ProjectRoot ".cursor"
$LogFile = Join-Path $CursorDir "register-flow.log"

# 1) 로그 리프레시
if (Test-Path $LogFile) {
  Remove-Item $LogFile -Force
  Write-Host "[OK] Deleted $LogFile" -ForegroundColor Green
} else {
  Write-Host "[--] No existing log file (will create on first ingest)" -ForegroundColor Gray
}

# 2) .cursor 폴더 확보
if (-not (Test-Path $CursorDir)) {
  New-Item -ItemType Directory -Path $CursorDir -Force | Out-Null
  Write-Host "[OK] Created $CursorDir" -ForegroundColor Green
}

# 3) 수집기 기동 (포트 7244)
$Port = if ($env:LOG_COLLECTOR_PORT) { $env:LOG_COLLECTOR_PORT } else { "7244" }
$CollectorScript = Join-Path $ProjectRoot "scripts\log-collector.js"
if (-not (Test-Path $CollectorScript)) {
  Write-Host "[ERROR] Not found: $CollectorScript" -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "=== Register flow log collector ===" -ForegroundColor Cyan
Write-Host "  Log file: $LogFile"
Write-Host "  Ingest:   http://127.0.0.1:${Port}/ingest/..."
Write-Host "  Test entry (검차완료->판매방식): http://localhost:3002/inspections/insp-4/complete"
Write-Host "  Params doc: docs/REGISTER_FLOW_TEST_PARAMS.md"
if ($Background) {
  Write-Host "  Next: npm run dev (collector running in background)"
} else {
  Write-Host "  Next: open another terminal and run: npm run dev"
}
Write-Host "====================================" -ForegroundColor Cyan
Write-Host ""

$env:LOG_COLLECTOR_PORT = $Port
if ($Background) {
  Start-Process -FilePath "node" -ArgumentList $CollectorScript -WorkingDirectory $ProjectRoot -WindowStyle Hidden
  Write-Host "[OK] Log collector started in background (port $Port)" -ForegroundColor Green
} else {
  & node $CollectorScript
}
