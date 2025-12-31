@echo off
chcp 65001 >nul
echo ========================================
echo ForwardMax Git 푸시 스크립트
echo ========================================
echo.

REM Git 설치 확인
where git >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [오류] Git이 설치되어 있지 않거나 PATH에 등록되지 않았습니다.
    echo.
    echo Git 설치 방법:
    echo 1. https://git-scm.com/download/win 에서 Git 다운로드
    echo 2. 설치 시 "Add Git to PATH" 옵션 선택
    echo 3. 설치 후 PowerShell을 재시작하고 이 배치 파일을 다시 실행하세요
    echo.
    pause
    exit /b 1
)

echo [1/6] Git 버전 확인...
git --version
echo.

cd /d C:\carivdealer

REM Git 저장소 초기화 확인
if not exist ".git" (
    echo [2/6] Git 저장소 초기화...
    call git init
    if %ERRORLEVEL% NEQ 0 (
        echo [오류] Git 초기화에 실패했습니다.
        pause
        exit /b 1
    )
) else (
    echo [2/6] Git 저장소 이미 초기화됨
)
echo.

REM 원격 레포지토리 확인 및 설정
call git remote get-url origin >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [3/6] 원격 레포지토리 연결...
    call git remote add origin https://github.com/Siegfriex/carivdealer1229.git
    if %ERRORLEVEL% NEQ 0 (
        echo [오류] 원격 레포지토리 연결에 실패했습니다.
        pause
        exit /b 1
    )
) else (
    echo [3/6] 원격 레포지토리 이미 연결됨
    call git remote set-url origin https://github.com/Siegfriex/carivdealer1229.git
)
echo.

REM .gitignore 확인
if not exist ".gitignore" (
    echo [경고] .gitignore 파일이 없습니다. 생성하는 것을 권장합니다.
    echo.
)

echo [4/6] 변경사항 스테이징...
call git add .
if %ERRORLEVEL% NEQ 0 (
    echo [오류] 스테이징에 실패했습니다.
    pause
    exit /b 1
)
echo.

echo [5/6] 커밋 생성...
call git commit -m "PRD v2.13 업데이트 및 output.json 통합 완료

- PRD 문서 v2.13으로 업데이트 (output.json 참조 섹션 보완)
- Critical Issues 해결 완료 (상태 전이-화면 매핑, FLOW-03 순서, 사이트맵 구조)
- output.json IA/SPM 항목 부록 추가 (Section 23.5~23.6)
- AI Studio 에이전트 사전 지침 문서 추가
- 개발 서버 실행 가이드 추가"
if %ERRORLEVEL% NEQ 0 (
    echo [경고] 커밋할 변경사항이 없거나 커밋에 실패했습니다.
    echo.
)
echo.

echo [6/6] 브랜치 설정 및 푸시...
call git branch -M main
call git push -u origin main
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [오류] 푸시에 실패했습니다.
    echo.
    echo 가능한 원인:
    echo 1. GitHub 인증이 필요합니다 (Personal Access Token 또는 SSH 키)
    echo 2. 원격 레포지토리에 이미 다른 커밋이 있을 수 있습니다
    echo.
    echo 해결 방법:
    echo 1. GitHub Personal Access Token 생성: https://github.com/settings/tokens
    echo 2. 또는 git pull origin main --allow-unrelated-histories 후 다시 푸시
    echo.
    pause
    exit /b 1
)

echo.
echo ========================================
echo [완료] GitHub에 성공적으로 푸시되었습니다!
echo ========================================
echo.
echo 레포지토리: https://github.com/Siegfriex/carivdealer1229
echo.

pause


