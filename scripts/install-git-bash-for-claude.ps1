# Claude Code needs Git Bash (bash.exe). This script:
# - If "C:\Program Files\Git\bin\bash.exe" exists: sets CLAUDE_CODE_GIT_BASH_PATH and adds Git\bin to PATH.
# - If not: downloads Git for Windows installer, runs /VERYSILENT (installs to Program Files), then sets env.
# E:\0208\git stays as MinGit (git.exe only); bash comes from Program Files\Git.
$ErrorActionPreference = "Stop"
$version = "2.53.0"
$exeName = "Git-$version-64-bit.exe"
$url = "https://github.com/git-for-windows/git/releases/download/v$version.windows.1/$exeName"
$tempExe = "$env:TEMP\$exeName"
$programFilesBash = "C:\Program Files\Git\bin\bash.exe"
$gitBin = "C:\Program Files\Git\bin"

Write-Host "=== Git Bash for Claude Code ===" -ForegroundColor Cyan

if (Test-Path $programFilesBash) {
    Write-Host "Found: $programFilesBash" -ForegroundColor Yellow
    [Environment]::SetEnvironmentVariable("CLAUDE_CODE_GIT_BASH_PATH", $programFilesBash, "User")
    $userPath = [Environment]::GetEnvironmentVariable("Path", "User")
    if ($userPath -notlike "*$gitBin*") {
        [Environment]::SetEnvironmentVariable("Path", $gitBin + ";" + $userPath, "User")
        Write-Host "Added $gitBin to User PATH" -ForegroundColor Green
    }
    & $programFilesBash --version 2>&1
    Write-Host "CLAUDE_CODE_GIT_BASH_PATH set. Open a new terminal and run: claude" -ForegroundColor Green
    exit 0
}

Write-Host "Downloading $exeName (installs to C:\Program Files\Git) ..."
try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri $url -OutFile $tempExe -UseBasicParsing
} catch {
    Write-Host "Download failed: $_" -ForegroundColor Red
    exit 1
}

Write-Host "Installing (may take a minute) ..."
$proc = Start-Process -FilePath $tempExe -ArgumentList "/VERYSILENT", "/NORESTART", "/NOCANCEL", "/SP-" -Wait -PassThru
Remove-Item $tempExe -Force -ErrorAction SilentlyContinue
if (-not (Test-Path $programFilesBash)) {
    Write-Host "After install, bash.exe not found at $programFilesBash" -ForegroundColor Red
    exit 1
}
[Environment]::SetEnvironmentVariable("CLAUDE_CODE_GIT_BASH_PATH", $programFilesBash, "User")
$userPath = [Environment]::GetEnvironmentVariable("Path", "User")
if ($userPath -notlike "*$gitBin*") {
    [Environment]::SetEnvironmentVariable("Path", $gitBin + ";" + $userPath, "User")
}
Write-Host "Done. Open a new terminal and run: claude" -ForegroundColor Green
& $programFilesBash --version 2>&1
