# PRD 마크다운을 DOCX 변환용으로 전처리하는 PowerShell 스크립트
# 주석/부연설명/의존성을 각주로 변환

$inputFile = "PRD_Phase1_2025-12-31.md"
$outputFile = "PRD_Phase1_2025-12-31_preprocessed.md"

if (-not (Test-Path $inputFile)) {
    Write-Host "입력 파일을 찾을 수 없습니다: $inputFile" -ForegroundColor Red
    exit 1
}

$content = Get-Content $inputFile -Raw -Encoding UTF8
$lines = $content -split "`n"
$newLines = @()
$footnotes = @{}
$footnoteCounter = 1

function Get-FootnoteId {
    param([string]$text)
    
    $cleanText = $text.Trim() -replace '`', ''
    
    if ($footnotes.ContainsKey($cleanText)) {
        return $footnotes[$cleanText]
    }
    
    $script:footnoteCounter++
    $footnoteId = "note$footnoteCounter"
    $footnotes[$cleanText] = $footnoteId
    return $footnoteId
}

$i = 0
while ($i -lt $lines.Length) {
    $line = $lines[$i]
    $originalLine = $line
    
    # 1. > 참조: ... 형식을 각주로 변환
    if ($line.Trim().StartsWith('> 참조:')) {
        $refText = $line -replace '> 참조:', '' | ForEach-Object { $_.Trim() }
        $footnoteId = Get-FootnoteId "참조: $refText"
        if ($newLines.Count -gt 0 -and $newLines[-1].Trim()) {
            $newLines[-1] = $newLines[-1].TrimEnd() + " [^$footnoteId]"
        } else {
            $newLines += "[^$footnoteId]"
        }
        $i++
        continue
    }
    
    # 2. > 주석: ... 형식을 각주로 변환
    if ($line.Trim().StartsWith('> 주석:')) {
        $noteText = $line -replace '> 주석:', '' | ForEach-Object { $_.Trim() }
        $footnoteId = Get-FootnoteId "주석: $noteText"
        if ($newLines.Count -gt 0 -and $newLines[-1].Trim()) {
            $newLines[-1] = $newLines[-1].TrimEnd() + " [^$footnoteId]"
        } else {
            $newLines += "[^$footnoteId]"
        }
        $i++
        continue
    }
    
    # 3. > 비고: ... 형식을 각주로 변환
    if ($line.Trim().StartsWith('> 비고:')) {
        $noteText = $line -replace '> 비고:', '' | ForEach-Object { $_.Trim() }
        $footnoteId = Get-FootnoteId "비고: $noteText"
        if ($newLines.Count -gt 0 -and $newLines[-1].Trim()) {
            $newLines[-1] = $newLines[-1].TrimEnd() + " [^$footnoteId]"
        } else {
            $newLines += "[^$footnoteId]"
        }
        $i++
        continue
    }
    
    $newLines += $line
    $i++
}

# 각주 정의를 문서 끝에 추가
if ($footnotes.Count -gt 0) {
    $newLines += ""
    $newLines += "---"
    $newLines += ""
    $newLines += "## 각주"
    $newLines += ""
    
    foreach ($key in $footnotes.Keys | Sort-Object) {
        $footnoteId = $footnotes[$key]
        $newLines += "[^$footnoteId]: $key"
        $newLines += ""
    }
}

# 결과 저장
$newContent = $newLines -join "`n"
[System.IO.File]::WriteAllText((Resolve-Path .).Path + "\$outputFile", $newContent, [System.Text.Encoding]::UTF8)

Write-Host "전처리 완료: $outputFile" -ForegroundColor Green
Write-Host "총 $($footnotes.Count)개의 각주 생성됨" -ForegroundColor Green
Write-Host ""
Write-Host "다음 명령어로 DOCX 변환:" -ForegroundColor Yellow
Write-Host "pandoc $outputFile -o PRD_Phase1_2025-12-31.docx --toc --toc-depth=3 --standalone" -ForegroundColor Cyan



