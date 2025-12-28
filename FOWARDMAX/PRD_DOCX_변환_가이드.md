# PRD DOCX 변환 가이드

**대상 파일**: `PRD_Phase1_2025-12-31.md`  
**출력 파일**: `PRD_Phase1_2025-12-31_최종.docx`

---

## 방법 1: Python 스크립트 사용 (권장)

### 전제 조건
- Python 3.x 설치
- python-docx 라이브러리 설치

### 실행 방법

1. **Python 설치 확인**
   ```powershell
   python --version
   ```

2. **python-docx 설치** (필요시)
   ```powershell
   pip install python-docx
   ```

3. **변환 실행**
   ```powershell
   python convert_prd_to_docx.py
   ```
   
   또는 배치 파일 실행:
   ```powershell
   .\convert_prd_final.bat
   ```

---

## 방법 2: Pandoc 사용

### 전제 조건
- Pandoc 설치

### 설치 방법

**Chocolatey 사용 (권장)**:
```powershell
choco install pandoc
```

**직접 다운로드**:
- https://pandoc.org/installing.html 에서 Windows 설치 프로그램 다운로드

### 실행 방법

```powershell
pandoc PRD_Phase1_2025-12-31.md -o PRD_Phase1_2025-12-31_최종.docx --toc --toc-depth=3 --standalone
```

---

## 방법 3: 온라인 변환 도구 사용

1. **Markdown to DOCX 변환기** 사용:
   - https://www.markdowntopdf.com/
   - https://cloudconvert.com/md-to-docx
   - https://convertio.co/kr/md-docx/

2. `PRD_Phase1_2025-12-31.md` 파일 업로드
3. DOCX 형식으로 다운로드

---

## 방법 4: Word에서 직접 열기

1. Microsoft Word 실행
2. 파일 → 열기 → `PRD_Phase1_2025-12-31.md` 선택
3. Word가 자동으로 변환 (일부 서식 손실 가능)
4. 다른 이름으로 저장 → DOCX 형식 선택

---

## 변환 후 확인 사항

1. ✅ 목차가 올바르게 생성되었는지 확인
2. ✅ 표가 올바르게 표시되는지 확인
3. ✅ 제목 스타일(볼드)이 올바르게 적용되었는지 확인
4. ✅ 코드 블록이 올바르게 표시되는지 확인
5. ✅ 하이퍼링크가 작동하는지 확인

---

## 문제 해결

### Python이 인식되지 않는 경우
- Python 설치 시 "Add Python to PATH" 옵션을 체크했는지 확인
- PowerShell 재시작
- 또는 전체 경로로 실행: `C:\Python3x\python.exe convert_prd_to_docx.py`

### python-docx 설치 오류
```powershell
pip install --upgrade pip
pip install python-docx
```

### Pandoc 변환 시 한글 깨짐
- 인코딩 옵션 추가:
```powershell
pandoc PRD_Phase1_2025-12-31.md -o PRD_Phase1_2025-12-31_최종.docx --toc --toc-depth=3 --standalone --from markdown+smart --to docx
```

---

## 최종 파일 위치

변환 완료 후 다음 파일이 생성됩니다:
- `PRD_Phase1_2025-12-31_최종.docx`

---

**작성일**: 2025-12-31  
**대상 문서**: PRD_Phase1_2025-12-31.md (v2.3)

