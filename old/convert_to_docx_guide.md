# PRD 마크다운 → DOCX 변환 가이드

## 1. Pandoc 설치

### Windows
```powershell
# Chocolatey 사용
choco install pandoc

# 또는 직접 다운로드
# https://pandoc.org/installing.html
```

### 설치 확인
```powershell
pandoc --version
```

## 2. 마크다운 전처리

주석(`> 참조:`, `> 주석:`)을 각주 형식으로 변환해야 합니다.

## 3. DOCX 변환 명령어

```powershell
pandoc PRD_Phase1_2025-12-31_preprocessed.md `
  -o PRD_Phase1_2025-12-31.docx `
  --toc `
  --toc-depth=3 `
  --highlight-style=tango `
  --standalone `
  --reference-doc=reference.docx
```

### 옵션 설명
- `--toc`: 목차 생성
- `--toc-depth=3`: 목차 깊이 (H1, H2, H3까지)
- `--highlight-style=tango`: 코드 하이라이트 스타일
- `--standalone`: 독립 문서
- `--reference-doc`: 참조 DOCX 파일 (제목 스타일 등 정의)

## 4. 제목 볼드 처리

DOCX 변환 후 Word에서:
1. 스타일 창 열기
2. 제목 스타일(H1, H2, H3 등) 선택
3. 볼드체 적용

또는 참조 DOCX 파일을 만들어 제목 스타일에 볼드를 미리 적용할 수 있습니다.



