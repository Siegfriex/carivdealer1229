@echo off
echo ========================================
echo ForwardMax 개발 서버 실행
echo ========================================
echo.

REM Node.js 설치 확인
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [오류] Node.js가 설치되어 있지 않거나 PATH에 등록되지 않았습니다.
    echo.
    echo Node.js 설치 방법:
    echo 1. https://nodejs.org/ 에서 Node.js LTS 버전 다운로드
    echo 2. 설치 후 이 배치 파일을 다시 실행하세요
    echo.
    pause
    exit /b 1
)

echo [1/3] Node.js 버전 확인...
node --version
npm --version
echo.

REM 의존성 확인
if not exist "node_modules" (
    echo [2/3] 의존성 설치 중...
    call npm install
    if %ERRORLEVEL% NEQ 0 (
        echo [오류] 의존성 설치에 실패했습니다.
        pause
        exit /b 1
    )
) else (
    echo [2/3] 의존성 이미 설치됨 (node_modules 존재)
)
echo.

REM .env.local 파일 확인
if not exist ".env.local" (
    echo [경고] .env.local 파일이 없습니다.
    echo .env.local.example 파일을 참조하여 .env.local 파일을 생성하세요.
    echo.
)

echo [3/3] 개발 서버 시작...
echo 브라우저에서 http://localhost:3000 으로 접속하세요.
echo 종료하려면 Ctrl+C를 누르세요.
echo.
call npm run dev

pause


