# ForwardMax PRD Excel 변환 가이드

## 개요

본 가이드는 `ForwardMax_PRD_ExcelSource.md` 파일을 Excel 파일(`ForwardMax_PRD.xlsx`)로 변환하는 방법을 설명합니다.

## 파일 구조

```
C:\fowardmax\
├── ForwardMax_PRD_ExcelSource.md    # 엑셀 변환용 소스 마크다운 파일
├── export_prd_excel.py               # Python 변환 스크립트
├── ForwardMax_PRD.xlsx               # 출력 Excel 파일 (변환 후 생성)
├── ForwardMax_PRD_validation_report.md  # 검증 리포트 (변환 후 생성)
└── README_EXCEL_EXPORT.md            # 본 가이드 문서
```

## 사전 요구사항

### 1. Python 설치

- Python 3.7 이상 필요
- Windows 환경에서는 Python 공식 사이트에서 다운로드: https://www.python.org/downloads/
- 설치 시 "Add Python to PATH" 옵션 체크 권장

### 2. 필수 패키지 설치

다음 명령어로 필수 패키지를 설치합니다:

```bash
pip install pandas openpyxl
```

또는 `requirements.txt`가 있다면:

```bash
pip install -r requirements.txt
```

필수 패키지 목록:
- `pandas`: DataFrame 처리
- `openpyxl`: Excel 파일 생성 및 서식 적용

## 실행 방법

### Windows PowerShell에서 실행

1. 작업 디렉토리로 이동:
```powershell
cd C:\fowardmax
```

2. Python 스크립트 실행:
```powershell
python export_prd_excel.py
```

또는 `py` 런처 사용:
```powershell
py export_prd_excel.py
```

### Windows 명령 프롬프트(CMD)에서 실행

1. 작업 디렉토리로 이동:
```cmd
cd C:\fowardmax
```

2. Python 스크립트 실행:
```cmd
python export_prd_excel.py
```

## 출력 파일

### 1. ForwardMax_PRD.xlsx

- **위치**: `C:\fowardmax\ForwardMax_PRD.xlsx`
- **설명**: 변환된 Excel 파일
- **시트 구성**: 총 29개 시트
  - 메타/사전: `00_META`, `01_SCHEMA`, `02_GLOSSARY`, `03_ACTOR`, `04_COMPONENT`, `05_POLICY_DISCLOSURE`
  - 레지스트리: `10_FLOW`, `11_SCREEN`, `12_FUNCTION`, `13_ENTITY`, `14_API`, `15_NFR`, `16_DECISION`, `17_GAP`, `18_RISK`, `19_OPPORTUNITY`
  - IA/사이트맵: `20_SITEMAP`
  - 링크(관계/매핑): `30_FLOW_SCREEN`, `31_SCREEN_FUNCTION`, `32_FUNCTION_ENTITY`, `33_FUNCTION_API`, `34_FUNCTION_NFR`, `35_FUNCTION_DECISION`, `36_RBAC`, `37_MASKING`, `38_LOG_POLICY`
  - 추적: `40_NEED`, `41_REQUIREMENT`, `42_TRACE_CHAIN`

### 2. ForwardMax_PRD_validation_report.md

- **위치**: `C:\fowardmax\ForwardMax_PRD_validation_report.md`
- **설명**: 변환 과정에서 수행한 검증 결과 리포트
- **검증 항목**:
  - 참조 무결성 검증 (Link 시트의 ID가 Registry에 존재하는지)
  - 중복 검증 (Registry의 PK(ID) 중복 여부)
  - 필수 컬럼 검증 (01_SCHEMA에 정의된 required 컬럼 누락 여부)
  - 카운트 검증 (Screen/Function/Flow 개수)

## Excel 파일 특징

### 자동 적용되는 서식

1. **첫 행 고정**: 각 시트의 첫 행(헤더)이 고정되어 스크롤 시에도 항상 보임
2. **Auto Filter**: 각 시트에 자동 필터가 적용되어 데이터 필터링 가능
3. **열 너비 자동 조정**: 컬럼 내용에 맞게 열 너비가 자동 조정됨 (최대 50자)
4. **텍스트 줄바꿈**: 긴 텍스트는 자동으로 줄바꿈되어 표시됨
5. **ID 컬럼 텍스트 서식**: ID 컬럼은 텍스트 형식으로 강제되어 숫자로 변환되지 않음
6. **헤더 스타일**: 헤더 행은 파란색 배경, 흰색 굵은 글씨로 표시됨

### 데이터 구조

- **정규화**: 다중값(예: ScreenIDs, NFRIDs)은 Link 시트로 분리되어 참조 무결성 검증 가능
- **1행=1개체**: Registry 시트는 1행이 1개체를 의미
- **관계 추적**: Link 시트를 통해 기능-화면-API-엔터티-NFR 간 관계 추적 가능

## 업데이트 프로세스

### 1. 소스 마크다운 파일 수정

`ForwardMax_PRD_ExcelSource.md` 파일을 수정합니다.

**주의사항**:
- 시트 선언 형식 유지: `## SHEET: 시트명`
- 마크다운 표 형식 유지: 헤더 1줄 + 구분줄(`|---|`) + 데이터 N줄
- ID는 텍스트로 유지 (숫자로 변환되지 않도록)
- 셀 내 개행 금지 (긴 텍스트는 요약 컬럼 사용)

### 2. Excel 파일 재생성

수정 후 다시 변환 스크립트를 실행합니다:

```powershell
python export_prd_excel.py
```

### 3. 검증 리포트 확인

변환 후 생성된 `ForwardMax_PRD_validation_report.md` 파일을 확인하여 오류가 없는지 검증합니다.

## 문제 해결

### Python이 인식되지 않는 경우

**증상**: `python: command not found` 또는 `'python'은(는) 내부 또는 외부 명령, 실행할 수 있는 프로그램, 또는 배치 파일이 아닙니다.`

**해결 방법**:
1. Python이 설치되어 있는지 확인: `py --version` 또는 `python3 --version`
2. Python 설치 경로가 PATH 환경 변수에 추가되어 있는지 확인
3. Python 설치 시 "Add Python to PATH" 옵션을 체크했는지 확인
4. Windows에서는 `py` 런처 사용 시도: `py export_prd_excel.py`

### 패키지 설치 오류

**증상**: `ModuleNotFoundError: No module named 'pandas'` 또는 `ModuleNotFoundError: No module named 'openpyxl'`

**해결 방법**:
```bash
pip install pandas openpyxl
```

또는 Python 버전에 따라:
```bash
pip3 install pandas openpyxl
```

### 파일 인코딩 오류

**증상**: 한글이 깨져서 표시되거나 `UnicodeDecodeError` 발생

**해결 방법**:
- 소스 마크다운 파일이 UTF-8로 저장되어 있는지 확인
- Windows 메모장에서 "다른 이름으로 저장" → 인코딩: UTF-8 선택

### Excel 파일이 열리지 않는 경우

**증상**: Excel 파일이 손상되었다는 오류 메시지

**해결 방법**:
1. 변환 스크립트를 다시 실행하여 파일 재생성
2. Excel 파일이 다른 프로그램에서 열려있지 않은지 확인
3. 파일 권한 확인

## 검증 기준

변환이 성공적으로 완료되었는지 확인하는 기준:

1. ✅ **참조 무결성**: Link 시트의 모든 ID가 해당 Registry에 존재
2. ✅ **중복 없음**: Registry의 PK(ID)에 중복 없음
3. ✅ **필수 컬럼**: 01_SCHEMA에 정의된 필수 컬럼이 모두 존재
4. ✅ **카운트 일치**: Screen/Function/Flow 개수가 예상과 일치

## 고급 사용법

### 특정 시트만 변환하기

스크립트를 수정하여 특정 시트만 변환할 수 있습니다. `export_prd_excel.py`의 `main()` 함수에서 `sheet_names` 리스트를 수정하세요.

### 검증 규칙 추가하기

`export_prd_excel.py`에 새로운 검증 함수를 추가하여 커스텀 검증 규칙을 적용할 수 있습니다.

예시:
```python
def validate_custom_rule(wb, validation_results):
    """커스텀 검증 규칙"""
    errors = []
    # 검증 로직 작성
    validation_results['custom_errors'] = errors
```

그리고 `main()` 함수에서 호출:
```python
validate_custom_rule(wb, validation_results)
```

## 참고 자료

- [pandas 문서](https://pandas.pydata.org/docs/)
- [openpyxl 문서](https://openpyxl.readthedocs.io/)
- [Python 공식 문서](https://docs.python.org/3/)

## 문의

문제가 발생하거나 개선 사항이 있으면 기획팀에 문의하세요.

---

**문서 버전**: v1.0  
**최종 업데이트**: 2025-12-24  
**작성자**: ForwardMax 기획팀



