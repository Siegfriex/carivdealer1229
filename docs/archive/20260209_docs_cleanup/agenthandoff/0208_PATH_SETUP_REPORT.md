# 0208 PATH 영구 설정 보고서

**작업 일시**: 2026-02-08  
**목적**: 새 터미널/다른 창에서도 Python 3.14, Node/npm, Git이 동일하게 인식되도록 PATH 영구 반영.

---

## 1. 수행 내용

### 1.1 User PATH 수정 (영구)

**사용자 환경 변수 Path** 앞에 아래 4개 경로를 **맨 앞**에 추가함(기존 항목과 중복 제거 후 선두에 추가).

| 경로 | 용도 |
|------|------|
| `C:\Python314` | Chocolatey 설치 Python 실행 파일 |
| `C:\Python314\Scripts` | pip, pip3 등 스크립트 |
| `E:\0208` | Node.js (node.exe, npm.cmd 등) |
| `E:\0208\git\cmd` | MinGit (git.exe) |
| `C:\Program Files\Git\bin` | Git Bash (bash.exe, Claude Code용) |

- **이유**: WindowsApps의 `python.exe`(스토어 스텁)보다 실제 Python이 먼저 잡히도록 하기 위함.
- **적용 방법**: `[Environment]::SetEnvironmentVariable("Path", $newPath, "User")` 로 레지스트리(사용자 Path)에 저장.

### 1.2 검증 스크립트 추가

- **파일**: `scripts/verify-path.ps1`
- **용도**: 새 프로세스에서 User+Machine PATH를 합친 뒤 `python`, `node`, `npm`, `git` 인식 여부 확인.
- **실행 예**: `powershell -NoProfile -ExecutionPolicy Bypass -File E:\0208\carivdealder\scripts\verify-path.ps1`

---

## 2. 검증 결과 (새 프로세스 기준)

| 항목 | 실행 경로 | 버전/비고 |
|------|-----------|-----------|
| **python** | `C:\Python314\python.exe` | Python 3.14.3 |
| **node** | `E:\0208\node.exe` | v24.13.0 |
| **npm** | `E:\0208\npm.ps1` | 11.6.2 |
| **git** | `E:\0208\git\cmd\git.exe` | MinGit 2.53.0 (Portable, `scripts/install-git-portable.ps1`로 설치) |

- Python: 이전에 나오던 WindowsApps 스텁이 아닌 **C:\Python314** 로 정상 인식됨.
- Node/npm: **E:\0208** 기준으로 정상 인식.
- Git: 검증 당시에는 **E:\0208\git** 미설치로 인식되지 않음. §5의 `scripts/install-git-portable.ps1` 실행 후 상단 표·§7과 동일하게 인식됨.

---

## 3. 다른 창/새 터미널에서의 동작

- **새로 여는 PowerShell/CMD**는 부팅 시 또는 로그인 시 로드된 **User PATH**를 사용합니다.
- 이번에 수정한 것은 **사용자 환경 변수(Path)** 이므로, **이후에 연 모든 새 터미널**에는 수정된 PATH가 적용됩니다.
- **이미 켜 둔 터미널**은 예전 PATH를 갖고 있으므로, 새로 열거나 한 번 닫았다 열면 반영됩니다.

**확인 방법**: Cursor에서 터미널을 새로 열고 다음 실행.

```powershell
python --version
node -v
npm -v
```

---

## 4. PowerShell에서 npm 실행이 막힐 때 (실행 정책)

**증상**: `npm run build` 입력 시  
`이 시스템에서 스크립트를 실행할 수 없으므로 E:\0208\npm.ps1 파일을 로드할 수 없습니다` (실행 정책 오류).

**원인**: PowerShell이 `.ps1` 스크립트 실행을 막고 있음. 그룹 정책으로 `Set-ExecutionPolicy` 변경이 불가한 환경일 수 있음.

**해결 (매 새 창마다 자동이 안 될 때)**

1. **PowerShell 프로필 사용 (가능한 경우)**  
   다음 파일이 있으면, 새 PowerShell을 열 때 **현재 프로세스에만** 실행 정책 Bypass + PATH 선두 추가가 적용됨.  
   `C:\Users\Administrator\Documents\WindowsPowerShell\Microsoft.PowerShell_profile.ps1`  
   (실행 정책이 완전히 Restricted면 프로필 자체가 안 돌 수 있음.)

2. **우회 1 — CMD에서 npm 실행**  
   PowerShell에서:
   ```powershell
   cmd /c "npm run build"
   ```
   CMD는 `npm.cmd`를 실행하므로 실행 정책 영향 없음. PATH에 `E:\0208`만 있으면 동작함.

3. **우회 2 — npm.cmd 직접 호출**  
   ```powershell
   & "E:\0208\npm.cmd" run build
   ```

4. **우회 3 — 매번 이 세션만 실행 정책 완화**  
   새 PowerShell 창을 열 때마다 한 번만:
   ```powershell
   Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force
   ```
   (그룹 정책이 **Process** 범위까지 막지 않으면 적용됨.)

5. **우회 4 — CMD 배치로 빌드**  
   프로젝트 내 `scripts\npm-run-build.cmd` 실행 (더블클릭 또는 터미널에서 `.\scripts\npm-run-build.cmd`). PATH 설정 후 `npm run build`를 CMD에서 실행함.

---

## 5. Claude Code용 Git Bash (CLAUDE_CODE_GIT_BASH_PATH)

**문제**: `claude` 실행 시 "Claude Code on Windows requires git-bash" 메시지.

**해결**: Git for Windows 전체 설치 시 포함되는 **bash.exe** 경로를 사용자 환경 변수에 설정.

- **환경 변수**: `CLAUDE_CODE_GIT_BASH_PATH` = `C:\Program Files\Git\bin\bash.exe`
- **PATH**: `C:\Program Files\Git\bin` 을 User PATH에 추가(이미 반영됨).
- Git for Windows는 https://git-scm.com/download/win 에서 설치. (이미 설치된 경우 위 환경 변수만 설정하면 됨.)
- 스크립트: `scripts/install-git-bash-for-claude.ps1` — bash 없으면 설치 후 위 설정 적용.

**참고**: `git` 명령은 계속 **E:\0208\git\cmd** (MinGit) 사용. bash만 Program Files\Git 사용.

## 6. Git (MinGit Portable)

**설치**: PATH에 `E:\0208\git\cmd`가 이미 있으므로, Git이 없을 때만 아래 실행.

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File E:\0208\carivdealder\scripts\install-git-portable.ps1
```

- MinGit 2.53.0 64-bit를 GitHub에서 받아 `E:\0208\git`에 압축 해제.
- 새 터미널에서 `git --version`으로 인식 확인.

## 7. Git 사용 시 (참고)

- MinGit을 **E:\0208\git**에 두면 PATH의 `E:\0208\git\cmd` 덕분에 **추가 설정 없이** `git` 명령이 인식됨.
- 재설치/다른 버전이 필요하면 `scripts/install-git-portable.ps1` 다시 실행(기존 폴더 제거 후 재설치).

---

## 8. 요약

| 항목 | 상태 |
|------|------|
| User PATH 영구 반영 | 완료 (C:\Python314, C:\Python314\Scripts, E:\0208, E:\0208\git\cmd 선두 추가) |
| 새 프로세스에서 Python | C:\Python314\python.exe, 3.14.3 |
| 새 프로세스에서 Node/npm | E:\0208 기준 정상 |
| Git | E:\0208\git\cmd (MinGit). bash: C:\Program Files\Git\bin, CLAUDE_CODE_GIT_BASH_PATH 설정됨 |
| 검증 스크립트 | scripts/verify-path.ps1 |

다른 창이나 새로 열었을 때도 **Python 3.14.3**, **Node/npm** 은 동일하게 인식되며, **Git**은 E:\0208\git 배치 후 동일하게 사용 가능합니다.
