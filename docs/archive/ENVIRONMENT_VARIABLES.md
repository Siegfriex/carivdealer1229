# 환경변수 설정 가이드

**버전**: 1.0  
**최종 업데이트**: 2025-01-XX

---

## 개요

이 문서는 프론트엔드(Vite/React)에서 사용하는 환경변수 설정 방법을 설명합니다.

---

## 환경변수 파일 생성

프로젝트 루트에 `.env` 파일을 생성하고 다음 내용을 추가하세요:

```bash
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-firebase-api-key
VITE_FIREBASE_AUTH_DOMAIN=carivdealer.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=carivdealer
VITE_FIREBASE_STORAGE_BUCKET=carivdealer.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=850300267700
VITE_FIREBASE_APP_ID=your-firebase-app-id
VITE_FIREBASE_MEASUREMENT_ID=G-ET5Q9986GQ

# Gemini API Key (Frontend - Optional, mainly for development)
# Note: Backend uses Secret Manager instead
GEMINI_API_KEY=your-gemini-api-key
VITE_GEMINI_API_KEY=your-gemini-api-key
```

---

## 환경변수 접두사 규칙

Vite는 **`VITE_`** 접두사가 붙은 환경변수만 클라이언트 코드에 노출됩니다.

- ✅ `VITE_FIREBASE_API_KEY` → 클라이언트에서 접근 가능
- ❌ `SECRET_API_KEY` → 클라이언트에서 접근 불가 (보안)

---

## Firebase 설정 값 확인

Firebase Console에서 설정 값을 확인할 수 있습니다:
- https://console.firebase.google.com/project/carivdealer/settings/general

**Firebase Web App 설정**:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyAX4zD8yWbJN6jLubOtLzSJtJsLqO5saW0",
  authDomain: "carivdealer.firebaseapp.com",
  projectId: "carivdealer",
  storageBucket: "carivdealer.firebasestorage.app",
  messagingSenderId: "850300267700",
  appId: "1:850300267700:web:60812e374759ac57903be1",
  measurementId: "G-ET5Q9986GQ"
};
```

---

## 코드에서 사용 방법

### TypeScript/React 컴포넌트

```typescript
// 환경변수 접근
const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID;

// 또는 vite.config.ts에서 정의된 값 사용
const geminiKey = import.meta.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
```

### vite.config.ts 설정

현재 `vite.config.ts`에서 환경변수를 다음과 같이 정의하고 있습니다:

```typescript
define: {
  'import.meta.env.VITE_FIREBASE_API_KEY': JSON.stringify(env.VITE_FIREBASE_API_KEY),
  'import.meta.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY),
  // ... 기타 설정
}
```

---

## 환경변수 우선순위

Vite는 다음 순서로 환경변수를 로드합니다:

1. `.env.[mode].local` (예: `.env.production.local`)
2. `.env.[mode]` (예: `.env.production`)
3. `.env.local`
4. `.env`

**참고**: `.local` 파일은 Git에 커밋하지 않아야 합니다 (이미 `.gitignore`에 포함됨).

---

## 보안 주의사항

### ✅ 공개 가능한 환경변수
- Firebase Config (API Key는 공개되어도 됨)
- Firebase Project ID
- Firebase Storage Bucket

### ❌ 공개하면 안 되는 환경변수
- **민감한 API 키** (Gemini API Key 등)는 **Backend API를 통해 간접 사용**
- 프론트엔드에서 직접 사용하는 Gemini API Key는 개발 환경에서만 사용

---

## 개발 환경 vs 프로덕션 환경

### 개발 환경 (`.env.local`)
```bash
# 개발용 설정
VITE_FIREBASE_API_KEY=dev-api-key
GEMINI_API_KEY=dev-gemini-key
```

### 프로덕션 환경 (`.env.production`)
```bash
# 프로덕션용 설정
VITE_FIREBASE_API_KEY=prod-api-key
# Gemini API Key는 Backend에서만 사용
```

---

## 문제 해결

### 에러: "Cannot find module 'process'"
- **원인**: Vite는 `process.env` 대신 `import.meta.env` 사용
- **해결**: `process.env.VITE_*` → `import.meta.env.VITE_*`로 변경

### 에러: "undefined" 환경변수
- **원인**: 환경변수가 로드되지 않음
- **해결**: 
  1. `.env` 파일이 프로젝트 루트에 있는지 확인
  2. 환경변수 이름이 `VITE_` 접두사로 시작하는지 확인
  3. 개발 서버 재시작 (`npm run dev`)

### 환경변수가 빌드에 포함되지 않음
- **원인**: `vite.config.ts`의 `define` 섹션에 정의되지 않음
- **해결**: `vite.config.ts`에 환경변수 추가

---

## 체크리스트

### 초기 설정
- [ ] `.env` 파일 생성
- [ ] Firebase 설정 값 입력
- [ ] 개발용 API 키 설정 (선택)
- [ ] `.env` 파일이 `.gitignore`에 포함되어 있는지 확인

### 배포 전 확인
- [ ] 프로덕션 환경변수 설정 확인
- [ ] 민감한 키가 공개되지 않는지 확인
- [ ] 빌드 후 환경변수가 올바르게 주입되었는지 확인

---

## 참고 문서

- [Vite 환경변수 문서](https://vitejs.dev/guide/env-and-mode.html)
- [SECRET_MANAGER_SETUP.md](./SECRET_MANAGER_SETUP.md) - Backend Secret Manager 설정 가이드
- [Firebase 설정 문서](https://firebase.google.com/docs/web/setup)

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0 | 2025-01-XX | 초기 버전 작성 |

