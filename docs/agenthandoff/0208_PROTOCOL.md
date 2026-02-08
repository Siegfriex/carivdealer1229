# [NEO GOD] 0208 세션 현장 집행 프로토콜 (vFinal)

**목표**: PC방/오프라인 환경에서 '뇌를 비우고 손만 움직여' 10분 내 하이브리드 기지 구축.  
**전제**: E:\0208 드라이브 사용 (상황에 따라 드라이브 문자 변경 가능).

---

## Phase 1. 보급품 확보 (집/클라우드/USB)

(현장에 가기 전 확인)

| 항목 | 비고 |
|------|------|
| **Node.js 20 LTS (Zip)** | 압축 풀면 바로 node.exe가 보이는 바이너리 버전. |
| **Python 3.12+ (Embeddable)** | 압축 풀면 바로 python.exe가 보이는 버전. |
| **Portable Git (7z/exe)** | 압축을 풀면 내부에 cmd 폴더가 있고 그 안에 git.exe가 있는 버전. |
| **Cursor Setup** | 설치 파일 또는 포터블. |

**핵심 자산 (필수)**

- `neoprime-loader-key.json` (GCP 인증키)
- **CarivDealer 저장소** (USB에 carivdealer 폴더 통째로 담아가거나, 현장에서 클론)

※ 핸드오프 문서와 배치 파일은 저장소 안에 이미 포함되어 있습니다.

---

## Phase 2. 기지 구축 (현장 도착 0~5분)

### 1. 폴더 생성

탐색기를 열고 **E:\0208** 폴더 생성.

### 2. 엔진 배치 (압축 해제 및 경로 주의)

- **Node**: E:\0208\node 폴더 안에 **node.exe**가 바로 보이도록 배치. (이중 폴더 주의)
- **Python**: E:\0208\python 폴더 안에 **python.exe**가 바로 보이도록 배치 (또는 E:\0208 아무 하위 폴더에만 있으면 됨 — Phase 3 배치가 재귀 검색함).  
  **[필수]** 같은 폴더 내 `python3xx._pth` 파일을 메모장으로 열고 `#import site`의 주석(#) 제거 후 저장. (pip 활성화)
- **Git**: E:\0208\git 폴더 안에 **cmd** 폴더가 보이도록 배치.  
  **확인**: `E:\0208\git\cmd\git.exe` 경로가 존재해야 함.
- **인증키**: `neoprime-loader-key.json` 파일을 **E:\0208\** (루트)에 복사.

### 3. 코드베이스 확보

- **USB 사용 시**: carivdealer(또는 실제 폴더명) 폴더를 E:\0208\ 안으로 복사.
- **Clone 시**:  
  `E:\0208\git\cmd\git.exe clone <저장소URL> E:\0208\carivdealer`  
  (일부 Portable Git 빌드에서는 `git\cmd\git-cmd.exe`일 수 있음. 그 경우 해당 exe로 실행하거나, Phase 3 기폭 후 터미널에서 `git clone` 실행 가능.)

**비고**: 코드베이스 폴더명이 **carivdealder**인 경우에도 Phase 3 배치가 **자동으로 CODEBASE를 감지**하므로, bat 수정 없이 복사만 하면 된다. Phase 4의 `cd` 경로만 실제 폴더명(carivdealder)으로 입력한다.

---

## Phase 3. 시스템 기폭 (5~7분)

### 1. 배치 파일 복사 (스니펫 생성 X, 파일 복사 O)

- **저장소 내 파일 경로**: `E:\0208\carivdealer\docs\agenthandoff\0208_INIT.bat` (또는 `carivdealder`인 경우 동일 상대 경로)
- 위 파일을 **복사**하여 **E:\0208\** (루트)에 붙여넣기.
- **결과**: E:\0208\0208_INIT.bat 파일 존재.

### 2. 배치 동작 (자동 수색)

0208_INIT.bat은 실행 시 다음을 **자동 감지**한다.

| 항목 | 동작 |
|------|------|
| **CODEBASE** | `E:\0208\carivdealder` 존재 시 해당 경로, 없으면 `E:\0208\carivdealer` |
| **Python** | `E:\0208` 하위를 **재귀 검색**하여 `python.exe`가 있는 폴더를 PATH에 주입 (Embeddable 압축 풀었을 때 하위 폴더에 있어도 동작) |
| **Node** | `E:\0208\node\node.exe` 있으면 `node` 폴더, 없으면 `E:\0208`(node.exe가 루트에 있는 경우) |

(배치 내 한글 주석 없음 — CMD 인코딩 이슈 방지.)

### 3. 실행 (더블 클릭)

0208_INIT.bat 파일을 **더블 클릭**하여 실행.

(선택: 보안 문제로 막히면 PowerShell에서 `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass` 후 `E:\0208\0208_INIT.bat` 실행.)

### 4. 기폭 확인

- CMD 창에 **\[CARIV 0208] Hybrid Environment Activated** 배너 확인.
- **Python path**, **Node path**, **Project** 경로가 예상대로 출력되는지 확인.
- `python --version`, `node -v` 출력 확인. (Python 미배치 시 `[Warning] Python not found`만 나와도 Node만 있어도 Phase 4 진행 가능.)
- Cursor가 있으면 자동 실행됨. 없으면 수동 실행 후 코드베이스 폴더 열기.

**기폭 직후 Phase 4 진행 (같은 터미널에서)**  

배치 파일(.bat)은 **자기 프로세스(CMD) 안에서만** PATH를 바꾼다. 그래서 **PowerShell**에서 `.\0208_INIT.bat`을 실행한 뒤 같은 창에서 `npm install`을 치면 **npm을 찾을 수 없다**고 나온다. 아래처럼 **먼저 PATH를 넣은 다음** 명령을 실행해야 한다.

**PowerShell에서 (한 번에 붙여 넣기):**

```powershell
$env:PATH = "E:\0208;E:\0208\git\cmd;" + $env:PATH
cd E:\0208\carivdealder
npm install
cd functions
npm install
cd ..
npm run build
```

**CMD에서** 배치 실행 후 남는 창(cmd /k)에서 진행한다면, 그 CMD 창에서는 이미 PATH가 잡혀 있으므로 `cd E:\0208\carivdealder`부터만 입력하면 된다.

(`npm run build` 성공 확인 후, 필요 시 `npm install -g firebase-tools` 실행.)

---

## Phase 4. 의존성 주입 (7~10분)

Cursor 터미널(Ctrl+J) 또는 열려 있는 CMD 창에서 입력.

### 1. Node 의존성

```bash
cd E:\0208\carivdealder
npm install
cd functions
npm install
cd ..
npm install -g firebase-tools
```

(PowerShell에서는 `&&` 대신 세 줄로 나누어 실행하거나, `cd E:\0208\carivdealder; npm install; cd functions; npm install; cd ..` 형태로 실행. **폴더명이 carivdealer이면** 경로를 `E:\0208\carivdealer`로 바꾼다.)

**PowerShell에서 "스크립트를 실행할 수 없으므로 npm.ps1을 로드할 수 없습니다" 나올 때** (실행 정책 제한):  
- **우회 1**: `cmd /c "npm run build"` (같은 창에서 CMD로 npm 실행).  
- **우회 2**: `& "E:\0208\npm.cmd" run build`  
- **우회 3**: `scripts\npm-run-build.cmd` 더블클릭 또는 터미널에서 실행.  
- **세션만 완화**: `Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force` 후 `npm run build` (그룹 정책이 Process를 막지 않으면 적용).

### 2. Python 의존성

- **있으면**: `pip install -r requirements.txt` (프로젝트 루트에 있음)
- **없으면**: `pip install pandas google-cloud-bigquery`

---

## Phase 5. 에이전트 가동 (10분~)

1. Cursor에서 **Ctrl+L** (또는 Ctrl+I)로 에이전트 채팅 오픈.
2. `docs/agenthandoff/HANDOFF_AGENT_FIGMA_IA_INTEGRITY.md` 파일을 엽니다. (@Files로 참조)
3. 아래 프롬프트를 복사해 붙여넣습니다.

```markdown
# Role: 0208 세션 정합성 오퍼레이터 (Hybrid Mode)
# Context: E:/0208/carivdealer (Node+Python Environment)

너는 지금부터 `docs/agenthandoff/HANDOFF_AGENT_FIGMA_IA_INTEGRITY.md`를 절대 기준으로 삼는다.

1. **환경 인식**: 이미 상위 폴더의 Node/Python 엔진이 PATH에 잡혀있음을 인지하라.
2. **최초 점검**: 핸드오프 문서 §6에 따라 문서 스위트(API/ERD/IA)의 존재와 샘플 정합성을 확인하라.
3. **작업 수행**: 점검 후, §7 규칙에 따라 **'차량 등록·상세' 섹션**의 Figma MCP 검증 작업을 시작하라. (호출 순서: get_metadata -> get_design_context -> get_screenshot 엄수)

지금 바로 실행하고 [0208 세션 가동 리포트]를 출력하라.
```

---

## 부록: PowerShell로 Python 경로 수색 (선택)

Python을 E:\0208 어딘가에 풀어 두었지만 경로를 모를 때, PowerShell에서 아래를 실행하면 **python.exe 위치**를 찾고 PATH에 잠깐 넣어 확인할 수 있다. (배치 기폭과 동일한 논리.)

```powershell
$ROOT = "E:\0208"
Write-Host "=== [NEO GOD] E:드라이브 파이썬 수색 ===" -ForegroundColor Cyan
$target = Get-ChildItem -Path $ROOT -Filter "python.exe" -Recurse -ErrorAction SilentlyContinue | Select-Object -First 1
if ($target) {
  $REAL_PY_DIR = $target.DirectoryName
  Write-Host ">>> 파이썬 발견: $REAL_PY_DIR" -ForegroundColor Green
  $env:PATH = "$REAL_PY_DIR;$REAL_PY_DIR\Scripts;$ROOT;$ROOT\node;$ROOT\git\cmd;" + $env:PATH
  Write-Host "Python:" (Get-Command python).Source
  python --version
} else {
  Write-Host ">>> E:\0208 안에서 python.exe를 찾을 수 없습니다." -ForegroundColor Red
}
```

※ 기지 기폭은 **0208_INIT.bat** 한 번으로 동일하게 수행된다. 위 스크립트는 검증·수동 PATH 설정용.

---

*문서: vFinal. 저장소 docs/agenthandoff 내 배치·핸드오프와 동기화.*
