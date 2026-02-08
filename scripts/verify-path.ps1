# Verify PATH in a fresh process (run: powershell -NoProfile -File scripts\verify-path.ps1)
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
$machinePath = [Environment]::GetEnvironmentVariable("Path", "Machine")
$env:Path = $userPath + ";" + $machinePath

Write-Host "=== Python ===" -ForegroundColor Cyan
$py = Get-Command python -ErrorAction SilentlyContinue
if ($py) { Write-Host "Path: $($py.Source)" }
python --version 2>&1

Write-Host "`n=== Node ===" -ForegroundColor Cyan
$node = Get-Command node -ErrorAction SilentlyContinue
if ($node) { Write-Host "Path: $($node.Source)" }
node -v 2>&1

Write-Host "`n=== npm ===" -ForegroundColor Cyan
$npm = Get-Command npm -ErrorAction SilentlyContinue
if ($npm) { Write-Host "Path: $($npm.Source)" }
npm -v 2>&1

Write-Host "`n=== Git ===" -ForegroundColor Cyan
$git = Get-Command git -ErrorAction SilentlyContinue
if ($git) { Write-Host "Path: $($git.Source)" }
git --version 2>&1

Write-Host "`n=== Done ===" -ForegroundColor Green
