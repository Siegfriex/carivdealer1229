@echo off
chcp 65001 >nul
echo ========================================
echo PRD 마크다운 → DOCX 변환 스크립트
echo ========================================
echo.

REM pandoc 설치 확인
where pandoc >nul 2>&1
if %errorlevel% neq 0 (
    echo [오류] pandoc이 설치되어 있지 않습니다.
    echo.
    echo 설치 방법:
    echo   1. Chocolatey 사용: choco install pandoc
    echo   2. 또는 https://pandoc.org/installing.html 에서 다운로드
    echo.
    pause
    exit /b 1
)

echo [1/2] pandoc 확인 완료
echo.

REM DOCX 변환
echo [2/2] DOCX 변환 중...
pandoc PRD_Phase1_2025-12-31.md -o PRD_Phase1_2025-12-31.docx --toc --toc-depth=3 --standalone --highlight-style=tango

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo 변환 완료!
    echo ========================================
    echo 출력 파일: PRD_Phase1_2025-12-31.docx
    echo.
    echo 참고사항:
    echo   - 제목 볼드 처리는 Word에서 스타일을 수정하세요
    echo   - 각주는 마크다운 파일에서 [^note] 형식으로 변환 필요
    echo.
) else (
    echo.
    echo [오류] 변환 실패
    echo.
)

pause


