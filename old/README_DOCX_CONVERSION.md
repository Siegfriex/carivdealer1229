# PRD 마크다운 → DOCX 변환 가이드

## 빠른 시작

### 1. Pandoc 설치 확인
```powershell
pandoc --version
```

설치되어 있지 않다면:
- **Chocolatey**: `choco install pandoc`
- **수동 설치**: https://pandoc.org/installing.html

### 2. 기본 변환 (각주 미처리)
```powershell
.\CONVERT_TO_DOCX.bat
```

또는 직접 명령어:
```powershell
pandoc PRD_Phase1_2025-12-31.md -o PRD_Phase1_2025-12-31.docx --toc --toc-depth=3 --standalone
```

## 각주 변환 (권장)

현재 마크다운 파일의 `> 참조:`, `> 주석:` 형식을 pandoc 각주 형식으로 변환해야 합니다.

### 변환 예시

**변환 전:**
```markdown
- 디지털 전환율 극히 낮음 → 플랫폼 기회

> 참조: `SSOT_딜러플랫폼_니즈.md` Section 2
```

**변환 후:**
```markdown
- 디지털 전환율 극히 낮음 → 플랫폼 기회 [^ref1]

[^ref1]: 참조: SSOT_딜러플랫폼_니즈.md Section 2
```

### 자동 변환 (Python 필요)

Python이 설치되어 있다면:
```powershell
python preprocess_for_docx.py
pandoc PRD_Phase1_2025-12-31_preprocessed.md -o PRD_Phase1_2025-12-31.docx --toc --toc-depth=3 --standalone
```

## 제목 볼드 처리

### 방법 1: Word에서 수정 (권장)
1. 변환된 DOCX 파일을 Word에서 열기
2. **홈** 탭 > **스타일** 창 열기
3. 각 제목 스타일 선택:
   - **제목 1** (H1) → 볼드 적용
   - **제목 2** (H2) → 볼드 적용
   - **제목 3** (H3) → 볼드 적용
4. 목차도 자동으로 업데이트됨

### 방법 2: 참조 DOCX 파일 사용
1. Word에서 새 문서 생성
2. 제목 스타일을 볼드체로 설정
3. `reference.docx`로 저장
4. 변환 시 `--reference-doc=reference.docx` 옵션 추가

## 고급 옵션

### 전체 옵션 포함 변환
```powershell
pandoc PRD_Phase1_2025-12-31.md `
  -o PRD_Phase1_2025-12-31.docx `
  --toc `
  --toc-depth=3 `
  --highlight-style=tango `
  --standalone `
  --reference-doc=reference.docx `
  --metadata title="ForwardMax 딜러 플랫폼 통합 PRD"
```

### 옵션 설명
- `--toc`: 목차 자동 생성
- `--toc-depth=3`: 목차 깊이 (H1~H3)
- `--highlight-style=tango`: 코드 하이라이트
- `--standalone`: 독립 문서
- `--reference-doc`: 스타일 참조 파일
- `--metadata`: 문서 메타데이터

## 변환 후 확인사항

- [ ] 목차가 생성되었는가?
- [ ] 각주가 올바르게 표시되는가?
- [ ] 제목이 볼드체로 표시되는가?
- [ ] 표가 올바르게 표시되는가?
- [ ] 코드 블록이 올바르게 표시되는가?

## 문제 해결

### 각주가 표시되지 않는 경우
- 마크다운 파일에서 `[^note]` 형식으로 변환되었는지 확인
- 문서 끝에 각주 정의가 있는지 확인

### 제목이 볼드가 아닌 경우
- Word에서 스타일을 수정하거나
- 참조 DOCX 파일을 사용

### 표가 깨지는 경우
- 마크다운 표 형식이 올바른지 확인
- 셀 내 줄바꿈은 `<br>` 사용



