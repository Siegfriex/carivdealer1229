# DOCX 변환 가이드

## Pandoc 설치

### Windows 설치 방법

1. **Chocolatey 사용 (권장)**:
```powershell
choco install pandoc
```

2. **수동 설치**:
   - https://pandoc.org/installing.html 에서 Windows 설치 프로그램 다운로드
   - 설치 프로그램 실행
   - 설치 후 PowerShell 재시작

### 설치 확인

```powershell
pandoc --version
```

## DOCX 변환 명령어

### FRD_v2.md → FRD_v2.docx

```powershell
cd C:\carivdealer\FOWARDMAX\docs
pandoc FRD_v2.md -o FRD_v2.docx --reference-doc=reference.docx
```

### API_SPECIFICATION_v2.md → API_SPECIFICATION_v2.docx

```powershell
cd C:\carivdealer\FOWARDMAX\docs
pandoc API_SPECIFICATION_v2.md -o API_SPECIFICATION_v2.docx --reference-doc=reference.docx
```

## 참고 문서 스타일 적용 (선택사항)

참고 문서 스타일을 적용하려면 `--reference-doc` 옵션을 사용합니다.

```powershell
pandoc FRD_v2.md -o FRD_v2.docx --reference-doc=reference.docx
```

`reference.docx` 파일이 없으면 기본 스타일로 변환됩니다.

## 한글 폰트 설정 (선택사항)

한글 폰트를 지정하려면:

```powershell
pandoc FRD_v2.md -o FRD_v2.docx --variable=mainfont:"맑은 고딕" --variable=sansfont:"맑은 고딕"
```

## 일괄 변환 스크립트

```powershell
# PowerShell 스크립트
$docs = @("FRD_v2.md", "API_SPECIFICATION_v2.md")

foreach ($doc in $docs) {
    $output = $doc -replace "\.md$", ".docx"
    pandoc $doc -o $output --variable=mainfont:"맑은 고딕" --variable=sansfont:"맑은 고딕"
    Write-Host "변환 완료: $output"
}
```

## 문제 해결

### 한글이 깨지는 경우

1. UTF-8 인코딩 확인:
```powershell
Get-Content FRD_v2.md -Encoding UTF8 | Set-Content FRD_v2_utf8.md
```

2. 변환 시 인코딩 지정:
```powershell
pandoc FRD_v2.md -o FRD_v2.docx --from=markdown+smart --to=docx
```

### 표가 깨지는 경우

표 형식이 복잡한 경우 HTML로 먼저 변환 후 DOCX로 변환:

```powershell
pandoc FRD_v2.md -o FRD_v2.html
pandoc FRD_v2.html -o FRD_v2.docx
```

