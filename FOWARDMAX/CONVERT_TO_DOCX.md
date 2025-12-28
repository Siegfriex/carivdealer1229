# DOCX 변환 가이드

## Pandoc 설치 방법

### Windows에서 Pandoc 설치

1. **Chocolatey 사용 (권장)**
   ```powershell
   choco install pandoc
   ```

2. **직접 다운로드**
   - https://pandoc.org/installing.html 에서 Windows 설치 프로그램 다운로드
   - 설치 후 PowerShell 재시작

3. **설치 확인**
   ```powershell
   pandoc --version
   ```

## DOCX 변환 명령어

Pandoc 설치 후 다음 명령어를 실행하세요:

```powershell
cd C:\fowardmax
pandoc PRD_Phase1_2025-12-31.md -o ForwardMax_PRD.docx --toc --toc-depth=3 --standalone --reference-doc=reference.docx
```

### 옵션 설명
- `--toc`: 목차 자동 생성
- `--toc-depth=3`: 목차 깊이 3단계까지
- `--standalone`: 독립 실행 가능한 문서 생성
- `--reference-doc=reference.docx`: 참조 문서 스타일 적용 (선택사항)

### 기본 변환 (참조 문서 없이)
```powershell
pandoc PRD_Phase1_2025-12-31.md -o ForwardMax_PRD.docx --toc --toc-depth=3 --standalone
```

## 변환 후 확인 사항

1. 목차가 올바르게 생성되었는지 확인
2. 표가 올바르게 표시되는지 확인
3. 각주가 올바르게 표시되는지 확인
4. 제목 스타일(볼드)이 올바르게 적용되었는지 확인

## 문제 해결

### Pandoc을 찾을 수 없는 경우
- PowerShell을 재시작하세요
- Pandoc 설치 경로가 PATH 환경 변수에 포함되어 있는지 확인하세요

### 표가 깨지는 경우
- Word에서 표 스타일을 수동으로 조정하세요
- 표 너비를 자동 조정하세요

### 각주가 표시되지 않는 경우
- Word에서 각주 형식을 확인하세요
- 마크다운 파일의 각주 형식이 올바른지 확인하세요 (`[^1]` 형식)



