# PRD DOCX 변환 최종 가이드

**대상 파일**: `PRD_Phase1_2025-12-31.md` (v2.3)  
**출력 파일**: `PRD_Phase1_2025-12-31_최종.docx`

---

## 🚀 빠른 실행 (권장)

### 방법 1: 배치 파일 실행 (가장 간단)

```powershell
.\PRD_최종_DOCX_변환_실행.bat
```

이 스크립트가 자동으로:
1. Python 전처리 실행 (각주 변환)
2. Pandoc으로 DOCX 변환
3. 최종 파일 생성

---

## 📋 수동 실행 방법

### 전제 조건 확인

#### 1. Pandoc 설치 확인
```powershell
pandoc --version
```

**설치되지 않은 경우**:
- **Chocolatey 사용** (권장):
  ```powershell
  choco install pandoc
  ```
- **직접 다운로드**: https://pandoc.org/installing.html

#### 2. Python 설치 확인 (선택사항, 전처리용)
```powershell
python --version
```

---

### 단계별 실행

#### Step 1: 마크다운 전처리 (선택사항, 각주 변환용)

Python이 설치되어 있다면:
```powershell
python preprocess_for_docx.py
```

이 명령어는 `PRD_Phase1_2025-12-31_preprocessed.md` 파일을 생성합니다.

#### Step 2: DOCX 변환

**전처리 파일 사용**:
```powershell
pandoc PRD_Phase1_2025-12-31_preprocessed.md -o PRD_Phase1_2025-12-31_최종.docx --toc --toc-depth=3 --standalone
```

**원본 파일 직접 변환**:
```powershell
pandoc PRD_Phase1_2025-12-31.md -o PRD_Phase1_2025-12-31_최종.docx --toc --toc-depth=3 --standalone
```

---

## 🎨 고급 옵션

### 스타일 적용 변환

참조 DOCX 파일이 있다면:
```powershell
pandoc PRD_Phase1_2025-12-31.md -o PRD_Phase1_2025-12-31_최종.docx --toc --toc-depth=3 --standalone --reference-doc=reference.docx
```

### 메타데이터 포함

```powershell
pandoc PRD_Phase1_2025-12-31.md -o PRD_Phase1_2025-12-31_최종.docx --toc --toc-depth=3 --standalone --metadata title="ForwardMax 딜러 웹앱 통합 설계 PRD" --metadata author="ForwardMax 기획팀"
```

---

## ✅ 변환 후 확인 사항

변환된 DOCX 파일을 Word에서 열어 다음을 확인하세요:

1. **목차**
   - [ ] 목차가 자동으로 생성되었는가?
   - [ ] 목차 링크가 작동하는가?

2. **제목 스타일**
   - [ ] H1, H2, H3가 올바른 스타일로 표시되는가?
   - [ ] 제목이 볼드체로 표시되는가?

3. **표**
   - [ ] 모든 표가 올바르게 표시되는가?
   - [ ] 표 헤더가 강조되어 있는가?

4. **각주**
   - [ ] 각주가 올바르게 표시되는가?
   - [ ] 각주 번호가 올바른가?

5. **코드 블록**
   - [ ] 코드 블록이 올바르게 표시되는가?
   - [ ] 코드 폰트가 고정폭인가?

6. **링크**
   - [ ] 하이퍼링크가 작동하는가?

---

## 🔧 문제 해결

### Pandoc을 찾을 수 없는 경우

1. Pandoc 설치 확인:
   ```powershell
   where pandoc
   ```

2. PATH 환경 변수 확인:
   - Pandoc 설치 경로가 PATH에 포함되어 있는지 확인
   - PowerShell 재시작

### 한글 깨짐 문제

인코딩 옵션 추가:
```powershell
pandoc PRD_Phase1_2025-12-31.md -o PRD_Phase1_2025-12-31_최종.docx --toc --toc-depth=3 --standalone --from markdown+smart --to docx
```

### 표가 깨지는 경우

- 마크다운 표 형식 확인
- 셀 내 줄바꿈은 `<br>` 태그 사용

### 각주가 표시되지 않는 경우

- 전처리 스크립트(`preprocess_for_docx.py`) 실행 확인
- 각주 형식이 `[^note]`인지 확인

---

## 📁 생성되는 파일

변환 과정에서 다음 파일들이 생성될 수 있습니다:

1. `PRD_Phase1_2025-12-31_preprocessed.md` - 전처리된 마크다운 (각주 변환)
2. `PRD_Phase1_2025-12-31_최종.docx` - **최종 DOCX 파일** ⭐

---

## 💡 팁

1. **Word에서 스타일 수정**: 변환 후 Word에서 제목 스타일을 원하는 대로 수정할 수 있습니다.
2. **목차 업데이트**: Word에서 목차를 우클릭 → "필드 업데이트"로 목차를 새로고침할 수 있습니다.
3. **표 스타일**: Word의 표 디자인 기능으로 표 스타일을 변경할 수 있습니다.

---

**작성일**: 2025-12-31  
**대상 문서**: PRD_Phase1_2025-12-31.md (v2.3)  
**최종 출력**: PRD_Phase1_2025-12-31_최종.docx

