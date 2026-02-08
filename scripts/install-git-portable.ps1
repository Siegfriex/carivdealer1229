# MinGit (Portable Git) to E:\0208\git - PATH already has E:\0208\git\cmd
$ErrorActionPreference = "Stop"
$base = "E:\0208"
$gitDir = "$base\git"
$version = "2.53.0"
$zipName = "MinGit-$version-64-bit.zip"
$url = "https://github.com/git-for-windows/git/releases/download/v$version.windows.1/$zipName"
$tempZip = "$env:TEMP\$zipName"
$extractTemp = "$env:TEMP\mingit_extract"

Write-Host "=== MinGit to E:\0208\git ===" -ForegroundColor Cyan
if (Test-Path "$gitDir\cmd\git.exe") {
    Write-Host "Already installed: $gitDir\cmd\git.exe" -ForegroundColor Yellow
    & "$gitDir\cmd\git.exe" --version
    exit 0
}

if (-not (Test-Path $base)) { New-Item -ItemType Directory -Path $base -Force | Out-Null }
if (Test-Path $gitDir) {
    Write-Host "Removing existing $gitDir ..."
    Remove-Item -Recurse -Force $gitDir
}
New-Item -ItemType Directory -Path $gitDir -Force | Out-Null

Write-Host "Downloading $zipName ..."
try {
    [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
    Invoke-WebRequest -Uri $url -OutFile $tempZip -UseBasicParsing
} catch {
    Write-Host "Download failed: $_" -ForegroundColor Red
    exit 1
}

if (Test-Path $extractTemp) { Remove-Item -Recurse -Force $extractTemp }
Expand-Archive -Path $tempZip -DestinationPath $extractTemp -Force
Remove-Item $tempZip -Force -ErrorAction SilentlyContinue

$items = Get-ChildItem $extractTemp
if ($items.Count -eq 1 -and $items[0].PSIsContainer) {
    Move-Item -Path "$($items[0].FullName)\*" -Destination $gitDir -Force
    Remove-Item $items[0].FullName -Force
} else {
    Move-Item -Path "$extractTemp\*" -Destination $gitDir -Force
}
Remove-Item $extractTemp -Recurse -Force -ErrorAction SilentlyContinue

$gitExe = "$gitDir\cmd\git.exe"
if (-not (Test-Path $gitExe)) {
    Write-Host "Expected git.exe at $gitExe not found." -ForegroundColor Red
    Get-ChildItem $gitDir -Recurse -File | Select-Object -First 20 FullName
    exit 1
}

Write-Host "Installed:" -ForegroundColor Green
& $gitExe --version
Write-Host "Path already in User PATH: E:\0208\git\cmd" -ForegroundColor Green
Write-Host "Open a new terminal and run: git --version" -ForegroundColor Green
