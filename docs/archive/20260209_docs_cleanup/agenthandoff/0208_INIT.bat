@echo off
setlocal enabledelayedexpansion
set ROOT=%~dp0
set ROOT=%ROOT:~0,-1%

:: CODEBASE: carivdealder if exists, else carivdealer
if exist "%ROOT%\carivdealder" (set "CODEBASE=%ROOT%\carivdealder") else (set "CODEBASE=%ROOT%\carivdealer")

:: Python: search under ROOT for python.exe (like PowerShell script)
set "PY_BIN=%ROOT%\python"
for /R "%ROOT%" %%i in (python.exe) do (
  set "PY_BIN=%%~dpi"
  set "PY_BIN=!PY_BIN:~0,-1!"
  goto :py_done
)
:py_done

:: Node: ROOT\node\node.exe or ROOT\node.exe
if exist "%ROOT%\node\node.exe" (set "NODE_BIN=%ROOT%\node") else (set "NODE_BIN=%ROOT%")
set "GIT_BIN=%ROOT%\git\cmd"
set "CURSOR_BIN=%ROOT%\cursor"
set "NPM_GLOBAL_BIN=%AppData%\npm"

:: PATH: Python, Python\Scripts, Node, npm global, Git
set "PATH=%PY_BIN%;%PY_BIN%\Scripts;%NODE_BIN%;%NPM_GLOBAL_BIN%;%GIT_BIN%;%PATH%"

if exist "%ROOT%\neoprime-loader-key.json" set "GOOGLE_APPLICATION_CREDENTIALS=%ROOT%\neoprime-loader-key.json"

echo ======================================================
echo [CARIV 0208] Hybrid Environment Activated
echo - Node: 20.x (LTS) / Python: 3.12+
echo - Project: %CODEBASE%
echo - Python path: %PY_BIN%
echo - Node path: %NODE_BIN%
echo ======================================================

python --version 2>nul || echo [Warning] Python not found via PATH
node -v 2>nul || echo [Warning] Node not found via PATH

if exist "%CURSOR_BIN%\Cursor.exe" (
  start "" "%CURSOR_BIN%\Cursor.exe" "%CODEBASE%"
) else (
  echo [System] Cursor not found at %CURSOR_BIN%. Please open manually.
  cmd /k
)
