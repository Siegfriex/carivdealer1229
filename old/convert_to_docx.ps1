# ForwardMax PRD DOCX 변환 스크립트
# Pandoc이 설치되어 있어야 합니다.

$InputFile = "PRD_Phase1_2025-12-31.md"
$OutputFile = "ForwardMax_PRD.docx"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "ForwardMax PRD DOCX 변환 스크립트" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Pandoc 설치 확인
Write-Host "Pandoc 설치 확인 중..." -ForegroundColor Yellow
try {
    $pandocVersion = pandoc --version 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✓ Pandoc이 설치되어 있습니다." -ForegroundColor Green
        Write-Host $pandocVersion[0] -ForegroundColor Gray
    } else {
        throw "Pandoc을 찾을 수 없습니다."
    }
} catch {
    Write-Host "✗ Pandoc이 설치되어 있지 않습니다." -ForegroundColor Red
    Write-Host ""
    Write-Host "Pandoc 설치 방법:" -ForegroundColor Yellow
    Write-Host "1. Chocolatey 사용: choco install pandoc" -ForegroundColor White
    Write-Host "2. 직접 다운로드: https://pandoc.org/installing.html" -ForegroundColor White
    Write-Host ""
    Write-Host "설치 후 PowerShell을 재시작하고 다시 실행하세요." -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# 입력 파일 확인
if (-not (Test-Path $InputFile)) {
    Write-Host "✗ 입력 파일을 찾을 수 없습니다: $InputFile" -ForegroundColor Red
    exit 1
}

Write-Host "✓ 입력 파일 확인: $InputFile" -ForegroundColor Green
Write-Host ""

# DOCX 변환 실행
Write-Host "DOCX 변환 중..." -ForegroundColor Yellow
Write-Host "출력 파일: $OutputFile" -ForegroundColor Gray
Write-Host ""

$convertCommand = "pandoc `"$InputFile`" -o `"$OutputFile`" --toc --toc-depth=3 --standalone"

try {
    Invoke-Expression $convertCommand
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "========================================" -ForegroundColor Green
        Write-Host "✓ 변환 완료!" -ForegroundColor Green
        Write-Host "========================================" -ForegroundColor Green
        Write-Host ""
        Write-Host "출력 파일: $OutputFile" -ForegroundColor Cyan
        
        if (Test-Path $OutputFile) {
            $fileInfo = Get-Item $OutputFile
            Write-Host "파일 크기: $([math]::Round($fileInfo.Length / 1KB, 2)) KB" -ForegroundColor Gray
            Write-Host "생성 시간: $($fileInfo.CreationTime)" -ForegroundColor Gray
        }
        
        Write-Host ""
        Write-Host "다음 단계:" -ForegroundColor Yellow
        Write-Host "1. Word에서 문서를 열어 스타일을 확인하세요" -ForegroundColor White
        Write-Host "2. 목차가 올바르게 생성되었는지 확인하세요" -ForegroundColor White
        Write-Host "3. 표와 각주가 올바르게 표시되는지 확인하세요" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "✗ 변환 실패 (종료 코드: $LASTEXITCODE)" -ForegroundColor Red
        exit 1
    }
} catch {
    Write-Host ""
    Write-Host "✗ 변환 중 오류 발생:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}



