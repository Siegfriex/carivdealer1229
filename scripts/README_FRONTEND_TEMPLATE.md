# CarivDealer 프론트엔드

B2B 중고차 딜러 플랫폼 — React/Vite 기반 프론트엔드.  
FSD(Feature-Sliced Design) 구조, Firebase Auth/Storage, Mock 폴백 지원.

---

## 빠른 시작

```bash
# 의존성 설치
npm install

# 개발 서버 (Vite, port 3000)
npm run dev

# 프로덕션 빌드
npm run build

# 빌드 프리뷰
npm run preview
```

---

## 필수 의존성 및 환경 변수

### 1. Node.js
- **권장**: Node.js 20+ (LTS)
- `npm install` 수행 전 설치 확인

### 2. 환경 변수 (`.env.local`)

`.env.example`을 `.env.local`로 복사 후 값 입력:

| 변수 | 필수 | 설명 |
|------|------|------|
| `VITE_API_BASE_URL` | 예 | API 서버 URL (Firebase Functions 또는 별도 백엔드) |
| `VITE_FIREBASE_API_KEY` | 예 | Firebase 앱 설정 |
| `VITE_FIREBASE_AUTH_DOMAIN` | 예 | Firebase Auth 도메인 |
| `VITE_FIREBASE_PROJECT_ID` | 예 | Firebase 프로젝트 ID |
| `VITE_FIREBASE_STORAGE_BUCKET` | 예 | Firebase Storage 버킷 |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | 예 | FCM 등 |
| `VITE_FIREBASE_APP_ID` | 예 | Firebase App ID |
| `VITE_USE_MOCK_LIST` | 아니오 | `true` 시 차량 목록 Mock 사용 (기본: dev에서 true) |
| `VITE_RUN_DEV` | 아니오 | `true` 시 런데브 모드 (Mock 로그, DevSkip 버튼 등) |

### 3. 런데브(Run Dev) 모드

개발·프로토타입 시 다음이 활성화됩니다:

- `import.meta.env.DEV` (npm run dev 시) 또는 `VITE_RUN_DEV=true`
- **Mock 로그**: apiClient 타임아웃/네트워크 폴백 시 `[프로토타입]` 콘솔 로그
- **DevSkip 버튼**: 로그인 우회·플로우 점프
- **VITE_USE_MOCK_LIST=true**: 차량 목록·탁송·검차 등 Mock 데이터 사용

```bash
# 로컬 개발 (기본적으로 런데브 동작)
npm run dev

# 빌드에서도 런데브 노출 (배포용 아님)
VITE_RUN_DEV=true npm run build
```

### 4. 주요 npm 패키지

| 패키지 | 용도 |
|--------|------|
| react, react-dom | UI |
| react-router-dom | 라우팅 |
| @tanstack/react-query | 서버 상태·캐시 |
| firebase | Auth, Firestore, Storage |
| zustand | 클라이언트 상태 |
| zod | 스키마 검증 |
| tailwindcss | 스타일 |
| lucide-react | 아이콘 |

---

## 문서 (IA·스펙)

`docs/` 폴더는 **정보 구조(IA) 및 스펙 문서**를 중심으로 구성되어 있습니다.

### 핵심 문서 (읽는 순서 추천)

| 문서 | 설명 |
|------|------|
| **[CarivDealer_IA.md](docs/CarivDealer_IA.md)** | 사이트맵·라우팅·GNB/LNB·메뉴 구조. **IA 기준 문서**. |
| **[CarivDealer_UserFlow.md](docs/CarivDealer_UserFlow.md)** | Core Loop, Auth, routeManager, 예외 처리 |
| **[CarivDealer_Storyboard.md](docs/CarivDealer_Storyboard.md)** | UI 스펙, Interaction Rule, 스크린별 Toast·Modal |
| **[CarivDealer_DOCUMENT_SUITE_INDEX.md](docs/CarivDealer_DOCUMENT_SUITE_INDEX.md)** | 문서 의존성·독서 순서 |

### API·ERD

| 문서 | 설명 |
|------|------|
| **[CarivDealer_api_v1.md](docs/CarivDealer_api_v1.md)** | API 명세 (회원가입·차량·검차) |
| **[CarivDealer_API_ERD_Mapping.md](docs/CarivDealer_API_ERD_Mapping.md)** | API ↔ ERD 필드·엔티티 매핑 |

### 비전·정책

| 문서 | 설명 |
|------|------|
| **[CarivDealer_VID.md](docs/CarivDealer_VID.md)** | 비전·프로토콜·routeManager 정의 |
| **[FRONTEND_CONVENTIONS.md](docs/FRONTEND_CONVENTIONS.md)** | Mock 사용, 에러 처리, _isMockData 플래그 |
| **[STATE_MANAGEMENT_POLICY.md](docs/STATE_MANAGEMENT_POLICY.md)** | 상태 관리 (React Query, Zustand, URL) |

### 검증·Figma

| 문서 | 설명 |
|------|------|
| **[CarivDealer_SDS_VERIFICATION.md](docs/CarivDealer_SDS_VERIFICATION.md)** | 설계 검증 보고서 |
| **[CarivDealer_DOCUMENT_SUITE_CONSISTENCY_REPORT_20260213.md](docs/CarivDealer_DOCUMENT_SUITE_CONSISTENCY_REPORT_20260213.md)** | 문서 간 정합성 |
| **[docs/figma/FSD_IA_NODEID_SSOT.md](docs/figma/FSD_IA_NODEID_SSOT.md)** | nodeId ↔ 라우트 ↔ 페이지 SSOT |

### 기타

| 문서 | 설명 |
|------|------|
| **[FSD_ENFORCEMENT_RULES.md](docs/FSD_ENFORCEMENT_RULES.md)** | FSD 레이어·import 규칙 |
| **[TYPOGRAPHY_AND_FONTS.md](docs/TYPOGRAPHY_AND_FONTS.md)** | 타이포·폰트 |
| **[REFACTORING_DEVELOPMENT_RECOMMENDATIONS.md](docs/REFACTORING_DEVELOPMENT_RECOMMENDATIONS.md)** | 리팩토링 가이드 |

---

## 프로젝트 구조 (FSD)

```
src/
├── app/           # main, router, providers, globals
├── pages/         # admin, auth, landing
├── widgets/       # Header, Sidebar, VehicleTable 등
├── features/      # auction, inspection, vehicle-register-form
├── entities/      # vehicle, inspection, auction, trade 등
└── shared/        # api, config, context, lib, styles, ui, utils
```

---

## 스크립트

| 명령 | 설명 |
|------|------|
| `npm run dev` | Vite 개발 서버 (port 3000) |
| `npm run build` | 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run test` | Vitest 단위 테스트 |
| `npm run test:coverage` | 커버리지 포함 |
| `npm run test:e2e` | Playwright E2E |
| `npm run lint` | ESLint |
| `npm run type-check` | tsc --noEmit |

---

## 배포 (Firebase Hosting)

```bash
npm run build
firebase deploy --only hosting
```

`firebase.json`은 hosting만 포함. functions/firestore 등은 제외.

---

## 원본 레포

- **소스**: `c:\carivdealer` (풀스택)
- **이 복사본**: `H:\CarivDealer` (프론트엔드 전용)
- Git 업로드 없음 (로컬 작업용)
