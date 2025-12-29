@echo off
chcp 65001 >nul
echo ========================================
echo PRD 최종 DOCX 변환 스크립트
echo ========================================
echo.

REM Python 확인
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [오류] Python이 설치되어 있지 않습니다.
    echo.
    echo 설치 방법:
    echo   1. https://www.python.org/downloads/ 에서 Python 3.x 다운로드
    echo   2. 설치 시 "Add Python to PATH" 옵션 체크
    echo   3. 설치 후 이 스크립트를 다시 실행하세요
    echo.
    echo 또는 python-docx 라이브러리 설치:
    echo   pip install python-docx
    echo.
    pause
    exit /b 1
)

echo [1/3] Python 확인 완료
echo.

REM python-docx 설치 확인
python -c "import docx" >nul 2>&1
if %errorlevel% neq 0 (
    echo [2/3] python-docx 라이브러리 설치 중...
    pip install python-docx
    if %errorlevel% neq 0 (
        echo [오류] python-docx 설치 실패
        pause
        exit /b 1
    )
) else (
    echo [2/3] python-docx 확인 완료
)
echo.

REM DOCX 변환
echo [3/3] DOCX 변환 중...
python convert_prd_to_docx.py

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo 변환 완료!
    echo ========================================
    echo 출력 파일: PRD_Phase1_2025-12-31_최종.docx
    echo.
) else (
    echo.
    echo [오류] 변환 실패
    echo.
)

pause

