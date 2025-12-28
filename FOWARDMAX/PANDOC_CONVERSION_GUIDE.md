# PRD 마크다운 → DOCX 변환 가이드

## 1. Pandoc 설치

### Windows (Chocolatey 사용)
```powershell
choco install pandoc
```

### Windows (수동 설치)
1. https://pandoc.org/installing.html 방문
2. Windows 설치 프로그램 다운로드 및 설치

### 설치 확인
```powershell
pandoc --version
```

## 2. 마크다운 전처리 (각주 변환)

현재 마크다운 파일의 주석(`> 참조:`, `> 주석:`)을 pandoc 각주 형식(`[^note]`)으로 변환해야 합니다.

### 각주 변환 예시

**변환 전:**
```markdown
> 참조: `SSOT_딜러플랫폼_니즈.md` Section 2
```

**변환 후:**
```markdown
[^note1]

...

[^note1]: 참조: SSOT_딜러플랫폼_니즈.md Section 2
```

## 3. DOCX 변환 명령어

### 기본 변환
```powershell
pandoc PRD_Phase1_2025-12-31.md -o PRD_Phase1_2025-12-31.docx --toc --toc-depth=3 --standalone
```

### 고급 변환 (각주 포함)
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
- `--toc`: 목차 자동 생성
- `--toc-depth=3`: 목차 깊이 (H1, H2, H3까지)
- `--highlight-style=tango`: 코드 하이라이트 스타일
- `--standalone`: 독립 문서 생성
- `--reference-doc`: 참조 DOCX 파일 (제목 스타일, 볼드 등 미리 정의)

## 4. 제목 볼드 처리

### 방법 1: DOCX 변환 후 Word에서 수정
1. Word에서 변환된 DOCX 파일 열기
2. 스타일 창 열기 (홈 탭 > 스타일)
3. 각 제목 스타일(H1, H2, H3 등) 선택
4. 볼드체 적용

### 방법 2: 참조 DOCX 파일 생성
1. Word에서 새 문서 생성
2. 제목 스타일(H1, H2, H3)을 볼드체로 설정
3. `reference.docx`로 저장
4. `--reference-doc=reference.docx` 옵션 사용

## 5. 각주 처리

pandoc은 마크다운의 각주 형식을 자동으로 DOCX 각주로 변환합니다:

```markdown
텍스트 [^note1]

[^note1]: 각주 내용
```

## 6. 완전 자동화 스크립트 (Python 필요)

Python이 설치되어 있다면 `preprocess_for_docx.py` 스크립트를 사용할 수 있습니다:

```powershell
python preprocess_for_docx.py
pandoc PRD_Phase1_2025-12-31_preprocessed.md -o PRD_Phase1_2025-12-31.docx --toc --toc-depth=3 --standalone
```

## 7. 수동 전처리 (Python 없을 경우)

1. 텍스트 에디터에서 `PRD_Phase1_2025-12-31.md` 열기
2. `> 참조:` 또는 `> 주석:` 패턴 찾기
3. 각각을 `[^note1]`, `[^note2]` 형식으로 변환
4. 문서 끝에 각주 정의 추가:
   ```markdown
   [^note1]: 참조: 원본 내용
   [^note2]: 주석: 원본 내용
   ```

## 8. 변환 확인

변환 후 다음을 확인하세요:
- [ ] 목차가 생성되었는가?
- [ ] 각주가 올바르게 변환되었는가?
- [ ] 제목이 볼드체로 표시되는가?
- [ ] 표가 올바르게 표시되는가?



