@echo off
chcp 65001 >nul
echo ========================================
echo PRD 최종 DOCX 변환 스크립트
echo ========================================
echo.

REM 작업 디렉토리 확인
cd /d "%~dp0"
echo 현재 디렉토리: %CD%
echo.

REM 입력 파일 확인
if not exist "PRD_Phase1_2025-12-31.md" (
    echo [오류] PRD_Phase1_2025-12-31.md 파일을 찾을 수 없습니다.
    pause
    exit /b 1
)

echo [1/4] 입력 파일 확인 완료
echo.

REM Python 확인
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [경고] Python이 설치되어 있지 않습니다.
    echo.
    echo Pandoc을 사용하여 직접 변환을 시도합니다...
    echo.
    goto :pandoc_convert
)

echo [2/4] Python 확인 완료
echo.

REM 전처리 실행
echo [3/4] 마크다운 전처리 중...
python preprocess_for_docx.py
if %errorlevel% neq 0 (
    echo [경고] 전처리 실패. 원본 파일로 직접 변환합니다.
    set PREPROCESSED_FILE=PRD_Phase1_2025-12-31.md
) else (
    set PREPROCESSED_FILE=PRD_Phase1_2025-12-31_preprocessed.md
)
echo.

REM Pandoc 확인
:pandoc_convert
where pandoc >nul 2>&1
if %errorlevel% neq 0 (
    echo [오류] Pandoc이 설치되어 있지 않습니다.
    echo.
    echo 설치 방법:
    echo   1. Chocolatey: choco install pandoc
    echo   2. 또는 https://pandoc.org/installing.html 에서 다운로드
    echo.
    echo 또는 Python + python-docx를 사용하세요:
    echo   pip install python-docx
    echo   python convert_prd_to_docx.py
    echo.
    pause
    exit /b 1
)

echo [4/4] DOCX 변환 중...
pandoc "%PREPROCESSED_FILE%" -o "PRD_Phase1_2025-12-31_최종.docx" --toc --toc-depth=3 --standalone --highlight-style=tango

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo 변환 완료!
    echo ========================================
    echo 출력 파일: PRD_Phase1_2025-12-31_최종.docx
    echo.
    echo 참고사항:
    echo   - Word에서 열어 제목 스타일을 확인하세요
    echo   - 목차가 자동으로 생성되었습니다
    echo   - 표와 각주를 확인하세요
    echo.
) else (
    echo.
    echo [오류] 변환 실패
    echo.
)

pause

