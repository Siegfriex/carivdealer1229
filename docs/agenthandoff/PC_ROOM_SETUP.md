# PC방 개발 환경 구축 가이드

PC방에서 수동으로 패키지 다운로드 후 PATH·환경을 직접 잡을 때 고려할 **의존성·언어·도구** 정리.

---

## 1. 필수 (이 프로젝트 기준)

| 항목 | 버전/비고 | PATH 필요 | 용도 |
|------|-----------|-----------|------|
| **Node.js** | **20.x** (LTS 권장) | `node`, `npm` | 프론트(Vite/React), Functions 빌드·실행. `functions/package.json`에 `"engines": {"node":"20"}` 지정됨. |
| **npm** | Node 설치 시 포함 | `npm` | 루트·functions 의존성 설치, `npm run dev` / `npm run build` 등. |
| **Firebase CLI** | 최신 | `firebase` | `firebase deploy`, `firebase emulators:start`, 로그인. 전역 설치: `npm install -g firebase-tools`. |

---

## 2. 권장 (소스/배포·스크립트)

| 항목 | 비고 | PATH 필요 | 용도 |
|------|------|-----------|------|
| **Git** | 최신 | `git` | clone, push, 브랜치 작업. |
| **PowerShell** | Windows 기본 포함 | - | `scripts/*.ps1`, 루트 `*.ps1` 실행. (Python 아님) |

---

## 3. 선택 (E2E 테스트만 할 때)

| 항목 | 비고 | PATH 필요 | 용도 |
|------|------|-----------|------|
| **Playwright 브라우저** | npm 패키지 포함 | - | `npm run test:e2e` 시 필요. **최초 1회**: `npx playwright install` (Chromium 등 다운로드). PC방에서 오프라인 시 미리 받아 두거나 E2E 생략 가능. |

---

## 4. 이 프로젝트에서 **불필요**

| 항목 | 설명 |
|------|------|
| **Python** | 프로젝트 런타임·스크립트에서 사용 안 함. 문서(archive)에 예전 .py 파일 이름만 있고, 실제 스크립트는 PowerShell(.ps1). 필요 시 나중에 별도 설치. |
| **TypeScript 전역 설치** | 프로젝트 의존성으로 들어 있음. `npm install`만 하면 됨. |

---

## 5. 언어·런타임 요약

- **JavaScript/TypeScript**: Node 20 위에서 실행.
- **빌드/번들**: Vite 6, TypeScript 5.8.
- **백엔드**: Firebase Functions (Node 20).

---

## 6. 환경 변수·설정 (PC방 참고)

- **프론트**: `.env.local` (선택)  
  - `VITE_FIREBASE_*`, `VITE_API_BASE_URL` 등. 없으면 코드 내 demo 기본값 사용.
- **Functions**: `functions/.env.local` (로컬 에뮬레이터 시), 배포 시 GCP Secret Manager.
- **인코딩**: `.env` 파일은 **UTF-8**로 저장 (한글 등).

---

## 7. PATH에 넣을 실행 파일 (최소)

1. Node 설치 경로 (예: `C:\Program Files\nodejs`) → `node`, `npm`
2. npm 전역 bin (예: `%APPDATA%\npm` 또는 `nodejs` 경로에 포함) → `firebase`
3. (선택) Git 설치 경로 → `git`

설치 후 터미널에서 확인:

```powershell
node -v   # v20.x.x
npm -v
firebase --version
```

---

## 8. 한 번에 할 작업 순서 (권장)

1. Node.js 20 LTS 설치 → PATH 확인  
2. `npm install -g firebase-tools` → `firebase` PATH 확인  
3. 프로젝트 루트에서 `npm install`  
4. `cd functions && npm install`  
5. (E2E 할 경우) `npx playwright install`  
6. (선택) `.env.local` 복사 후 값 수정  

이 순서면 PC방에서 수동 설치·PATH만 맞춰도 개발·빌드·배포 가능합니다.

---

**0208 하이브리드(Node + Python)·단일 참조**: 모든 설정을 한 문서만 보고 진행하려면 [HANDOFF_AGENT_FIGMA_IA_INTEGRITY.md](HANDOFF_AGENT_FIGMA_IA_INTEGRITY.md) **§0 환경 설정**을 참조하라. 0208 폴더 레이아웃·0208_INIT.bat·에이전트 프롬프트까지 포함된다.
