---
name: dealer-front 레포 분리 및 최적화
overview: saas-front 레퍼런스 기반 dealer-front 단일 레포 생성, 브랜치별 분기 전략 수립, 현 carivdealer 코드베이스 프론트엔드 최적화 및 마이그레이션 계획.
todos:
  - id: phase0
    content: Phase 0: 현황 정리 및 dealer-front 레포 설계
  - id: phase1
    content: Phase 1: carivdealer 프론트엔드 정리 (functions 분리, 불필요 산출물 제거)
  - id: phase2
    content: Phase 2: dealer-front 초기 레포 생성 및 브랜치 전략 적용
  - id: phase3
    content: Phase 3: 마이그레이션 실행 및 CI/CD 정립
isProject: false
---

# dealer-front 레포 분리 및 최적화 계획

## 1. 현황 요약

### 1.1 현재 carivdealer 구조

| 구분 | 경로 | 역할 |
|------|------|------|
| **프론트엔드** | `src/` | React 19 + Vite + FSD (app, pages, widgets, features, entities, shared) |
| **백엔드** | `functions/` | Firebase Functions (vehicle, auction, inspection, trade, logistics 등) |
| **인프라** | `firebase.json`, `firestore.*`, `storage.rules` | Hosting(dist), Firestore, Storage |
| **문서/설정** | `docs/`, `FIGMASCR0208/`, `figma-design-audit/` | IA·Figma·검증 도구 |

### 1.2 Git 현황

| 항목 | 내용 |
|------|------|
| **원격** | origin (carivdealer1229), carivdealder (carivdealder) |
| **브랜치** | 0126, 0207~0211, 0211F (날짜 기반), main, backend 등 |
| **현재** | 0211 (Phase 1~4 변경 staged/unstaged) |

### 1.3 참조: saas-front (cariv-dev/saas-front)

- **가정**: 프론트엔드 전용 레포, 브랜치별 기능 분기
- **404**: Private 레포로 추정. 동일 조직 cariv-dev 산하 dealer-front 예정

---

## 2. 목표·원칙

| 목표 | 설명 |
|------|------|
| **dealer-front 단일화** | 프론트엔드만 `cariv-dev/dealer-front` (또는 동일 org)에 분리 |
| **브랜치 전략** | saas-front 스타일 — `main` + `feature/xxx` 또는 `yyy/feature-name` |
| **carivdealer 역할** | 백엔드(functions) + 인프라(Firestore, Storage) + 공유 설정 유지 또는 dealer-backend로 이전 |
| **추적성** | VID, FSD_IA_NODEID_SSOT 등 문서는 dealer-front 또는 별도 docs 레포로 이관 |

---

## 3. 브랜치 전략 (saas-front 벤치마크)

### 3.1 권장 브랜치 모델

```
main                    # 프로덕션 배포 기준
├── develop             # 통합 개발 (선택)
├── feature/xxx         # 기능 브랜치 (예: feature/vehicle-register)
├── fix/xxx             # 버그 수정 (예: fix/auth-redirect)
├── refactor/xxx        # 리팩토링 (예: refactor/fsd-phase1)
└── chore/xxx           # 설정·의존성 (예: chore/upgrade-vite)
```

### 3.2 브랜치 네이밍 규칙

| 유형 | 패턴 | 예시 |
|------|------|------|
| 기능 | `feature/{domain}-{기능}` | `feature/vehicle-register`, `feature/auction-bid` |
| 수정 | `fix/{이슈}` | `fix/auth-redirect`, `fix/route-404` |
| 리팩토링 | `refactor/{대상}` | `refactor/fsd-slice`, `refactor/route-manager` |
| 설정 | `chore/{작업}` | `chore/upgrade-deps`, `chore/firebase-config` |

### 3.3 기존 날짜 브랜치(0126, 0211 등) 처리

- **옵션 A**: dealer-front 신규 생성 시 `main`에 0211 기준 코드 반영 후 날짜 브랜치 미사용
- **옵션 B**: `0211` → `main` 또는 `develop`으로 머지 후 브랜치 삭제

---

## 4. dealer-front 레포 설계

### 4.1 포함 대상

| 경로/파일 | 포함 | 비고 |
|-----------|------|------|
| `src/` | O | 프론트엔드 전체 |
| `index.html` | O | |
| `vite.config.ts`, `tsconfig.json`, `postcss.config.js` | O | |
| `package.json`, `package-lock.json` | O | functions 의존성 제외 |
| `.env.example` | O | VITE_*, GEMINI 등 프론트 전용만 |
| `eslint.config.mjs`, `.prettierrc` | O | |
| `docs/` | O 또는 선택 | VID, FSD_IA 등 — 레포 분리 시 docs 별도 검토 |
| `FIGMASCR0208/` | O 또는 선택 | 화면 참조용 — 대용량 시 .gitignore 또는 LFS |
| `design/`, `img/` | O | |
| `firebase.json` (hosting만) | O | hosting 블록만, functions 제거 |
| `firestore.rules`, `storage.rules` | X 또는 공유 레포 | 백엔드 소유 시 제외 |
| `functions/` | X | dealer-backend 또는 carivdealer 유지 |
| `figma-design-audit/` | X 또는 별도 | Python 검증기 — 필요 시 별도 레포 |

### 4.2 제외·분리 대상

| 대상 | 처리 |
|------|------|
| `functions/` | carivdealer에 유지 또는 `cariv-dev/dealer-backend` 신규 |
| `firestore.*`, `database.rules.json` | 백엔드 레포 소유 |
| `scripts/` | fix-functions-*, setup-secrets 등 → 백엔드. log-collector, figma-download → 프론트 유지 |
| `tests/` | playwright, vitest — dealer-front에 포함 |

### 4.3 환경 변수 정리 (dealer-front)

```env
# .env.example (dealer-front)
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_API_BASE_URL=https://asia-northeast3-carivdealer.cloudfunctions.net
VITE_USE_MOCK_LIST=false
VITE_RUN_DEV=
VITE_GEMINI_API_KEY=
```

---

## 5. carivdealer 최적화 (마이그레이션 전)

### 5.1 Phase 1: 정리 작업

| 순서 | 작업 | 목적 |
|------|------|------|
| 1 | **Staged 변경 커밋** | Phase 1~4 (폴더 이동, routeManager) 0211에 반영 |
| 2 | **firebase.json 분리 검토** | hosting만 분리 가능한지 확인. functions는 별도 deploy |
| 3 | **scripts 분류** | 프론트 전용(log-collector, figma-download) vs 백엔드 전용 구분 |
| 4 | **docs 용량·의존성** | figmaMCP mcp_outputs, FIGMASCR0208 — 레포 크기 영향 |
| 5 | **.gitignore 보강** | `.cursor/` 등 불필요 추적 제외 |

### 5.2 Phase 2: dealer-front 추출 준비

| 작업 | 내용 |
|------|------|
| **디렉터리 복사** | `carivdealer/` → 임시 `dealer-front-copy/` (src, index.html, vite 등) |
| **package.json 정리** | functions 관련 script 제거. `firebase deploy` → `firebase deploy --only hosting` |
| **firebase.json** | hosting 블록만 유지. functions 블록 제거 또는 빈 배열 |
| **README** | dealer-front 전용 개발·배포 가이드 |

---

## 6. 마이그레이션 실행 순서

```
Step 1: carivdealer 0211 정리
  - Phase 1~4 변경 커밋
  - 브랜치 0211 또는 main에 머지

Step 2: cariv-dev/dealer-front 레포 생성
  - GitHub에서 빈 레포 생성
  - .gitignore, README, LICENSE 추가

Step 3: dealer-front 초기 푸시
  - carivdealer에서 프론트 전용 추출
  - dealer-front에 푸시 (main)

Step 4: 브랜치 전략 적용
  - main 보호, PR 필수
  - feature/xxx 브랜치 생성 규칙 문서화

Step 5: carivdealer 역할 재정의
  - dealer-backend 또는 carivdealer: functions + firestore + storage
  - dealer-front: Hosting 빌드 산출물 배포 (또는 Vercel/Cloudflare 등)
```

---

## 7. Firebase Hosting 연동

| 시나리오 | 방법 |
|----------|------|
| **A. dealer-front에서 Hosting 배포** | dealer-front에 `firebase.json` (hosting만), `firebase deploy --only hosting` |
| **B. carivdealer에서 Hosting 배포** | dealer-front 빌드 산출물(dist)을 carivdealer로 복사 또는 CI에서 artifact 사용 |
| **C. 별도 Hosting** | Vercel/Cloudflare Pages에 dealer-front 연결 |

**권장**: A — dealer-front가 자체 배포. Firebase 프로젝트는 동일(carivdealer) 유지.

---

## 8. CI/CD 예시 (dealer-front)

```yaml
# .github/workflows/ci.yml (예시)
name: CI
on: [push, pull_request]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npm run lint
      - run: npm run type-check
      - run: npm run build
```

---

## 9. 체크리스트 (실행 전)

- [ ] cariv-dev 조직 또는 dealer-front 레포 생성 권한
- [ ] saas-front 실제 구조 확인 (Private이라면 팀 내 공유)
- [ ] Firebase 프로젝트(carivdealer) Hosting 배포 권한 — dealer-front 레포에서
- [ ] 0211 브랜치 Phase 1~4 변경 커밋 여부

---

## 10. 위험·고려사항

| 항목 | 대응 |
|------|------|
| **Firestore 직접 접근** | src/에서 firebase/firestore 사용 중. dealer-front도 Firebase SDK 유지. 백엔드 분리 시 API 경유로 전환 검토 |
| **functions 호출** | `VITE_API_BASE_URL`로 cloudfunctions.net 호출. dealer-front에서 동일 |
| **FIGMASCR0208·mcp_outputs** | 대용량. .gitignore 또는 Git LFS, 또는 별도 스토리지 |
| **문서 이중화** | docs/ — dealer-front에 포함 vs docs 레포 분리. 팀 합의 필요 |
