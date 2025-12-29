# 배포 가이드 (Deployment Guide)

**작성일**: 2025-01-XX  
**프로젝트**: ForwardMax (carivdealer)

---

## 📋 배포 전 체크리스트

### 1. 코드 품질 확인
- [x] 린터 에러 없음
- [x] TypeScript 타입 에러 없음
- [x] 모든 import 정상 작동
- [x] 환경 변수 타입 정의 완료 (`src/vite-env.d.ts`)

### 2. 환경 변수 확인
`.env.local` 파일에 다음 변수들이 설정되어 있는지 확인:
```bash
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=carivdealer
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

### 3. 의존성 확인
- [ ] `npm install` 실행 완료
- [ ] `functions/` 디렉토리에서도 `npm install` 실행 완료

---

## 🔨 빌드 프로세스

### 1. 프론트엔드 빌드
```bash
cd C:\carivdealer\FOWARDMAX
npm install
npm run build
```

**빌드 결과물**: `dist/` 폴더에 생성됨

### 2. Functions 빌드 (자동)
`firebase deploy --only functions` 실행 시 자동으로 빌드됩니다.
수동 빌드가 필요한 경우:
```bash
cd C:\carivdealer\FOWARDMAX\functions
npm install
npm run build
```

---

## 🚀 배포 프로세스

### 배포 전 확인 사항

#### 1. Firebase CLI 로그인 확인
```bash
firebase login
firebase projects:list
# carivdealer 프로젝트 확인
```

#### 2. 프로젝트 설정 확인
```bash
cat .firebaserc
# default 프로젝트가 "carivdealer"인지 확인
```

### 배포 옵션

#### 옵션 1: 전체 배포 (권장)
```bash
cd C:\carivdealer\FOWARDMAX
firebase deploy
```
**포함 항목**: Hosting + Functions + Firestore Rules + Storage Rules

#### 옵션 2: 선택적 배포

**Hosting만 배포** (프론트엔드만 업데이트):
```bash
firebase deploy --only hosting
```

**Functions만 배포** (백엔드만 업데이트):
```bash
firebase deploy --only functions
```

**Firestore Rules만 배포**:
```bash
firebase deploy --only firestore:rules
```

**Storage Rules만 배포** (Storage Rules가 있는 경우):
```bash
firebase deploy --only storage
```

---

## 📊 배포 항목별 필요 여부

### ✅ 항상 배포 필요
1. **Hosting** - 프론트엔드 코드 변경 시
2. **Firestore Rules** - 보안 규칙 변경 시

### ⚠️ 조건부 배포
1. **Functions** - 백엔드 코드 변경 시만 필요
   - 현재 상태: 일부 Functions가 구현되어 있음
   - 변경 사항 없으면 재배포 불필요

2. **Storage Rules** - Storage 사용 시 필요
   - 현재 상태: Storage Rules 파일 존재 여부 확인 필요
   - 파일이 없으면 배포 불필요

---

## 🔍 현재 변경 사항 분석

### 변경된 파일
1. `src/services/gemini.ts` - 타입 에러 수정, 환경 변수 처리 개선
2. `src/services/api.ts` - 로그 최적화 (개발 환경에서만 출력)
3. `src/vite-env.d.ts` - 새로 생성 (환경 변수 타입 정의)
4. `vite.config.ts` - GEMINI_API_KEY 환경 변수 추가
5. `index.tsx` - 검차 요청 플로우 수정

### 배포 필요 여부

#### Hosting (필수)
- ✅ 프론트엔드 코드 변경 있음 → **재배포 필요**

#### Functions (조건부)
- ❓ Functions 코드 변경 여부 확인 필요
- Functions 코드 변경 없으면 재배포 불필요

#### Storage (조건부)
- ❓ Storage Rules 파일 존재 여부 확인 필요
- 파일이 없거나 변경 없으면 재배포 불필요

---

## 🎯 권장 배포 순서

### 1단계: 빌드 테스트
```bash
cd C:\carivdealer\FOWARDMAX
npm install
npm run build
```

**확인 사항**:
- 빌드 성공 여부
- `dist/` 폴더 생성 확인
- 빌드 파일 크기 확인 (과도하게 크지 않은지)

### 2단계: 로컬 프리뷰 (선택사항)
```bash
npm run preview
```
브라우저에서 `http://localhost:4173` 접속하여 확인

### 3단계: Functions 빌드 확인 (Functions 변경 시)
```bash
cd functions
npm install
npm run build
```

### 4단계: 배포 실행

**최소 배포** (프론트엔드만):
```bash
firebase deploy --only hosting
```

**전체 배포** (모든 항목):
```bash
firebase deploy
```

---

## ✅ 배포 후 확인 사항

### 1. Hosting 확인
- [ ] https://carivdealer.web.app 접속 확인
- [ ] 메인 페이지 로드 확인
- [ ] 주요 화면 정상 표시 확인:
  - [ ] SCR-0200 (차량 등록) - 검차 요청 버튼 정상 동작
  - [ ] SCR-0201 (검차 신청) - 로딩 없이 정상 표시
  - [ ] SCR-0600 (탁송 예약) - 출발지/도착지 자동 처리
  - [ ] SCR-0601 (탁송 내역) - 인계 승인 모달 개선
  - [ ] SCR-0105 (정산 상세) - 탁송비/검차비 표시

### 2. 콘솔 확인
- [ ] 브라우저 개발자 도구 콘솔 에러 없음
- [ ] 네트워크 요청 정상 동작
- [ ] 프로덕션 환경에서 Mock 로그 미출력 확인

### 3. Functions 확인 (Functions 배포 시)
```bash
firebase functions:log
```
- [ ] Functions 로그 정상 확인
- [ ] 에러 없음 확인

---

## 🐛 문제 해결

### 빌드 실패 시

1. **의존성 문제**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **TypeScript 에러**
   ```bash
   npx tsc --noEmit
   ```

3. **환경 변수 누락**
   - `.env.local` 파일 확인
   - `vite.config.ts`의 환경 변수 설정 확인

### 배포 실패 시

1. **Firebase CLI 버전 확인**
   ```bash
   firebase --version
   npm install -g firebase-tools@latest
   ```

2. **권한 확인**
   ```bash
   firebase login --reauth
   ```

3. **프로젝트 설정 확인**
   ```bash
   cat .firebaserc
   ```

4. **Functions 빌드 실패 시**
   ```bash
   cd functions
   npm install
   npm run build
   # 빌드 에러 확인 후 수정
   ```

---

## 📝 배포 이력

| 날짜 | 버전 | 변경 사항 | 배포 항목 |
|------|------|----------|----------|
| 2025-01-XX | - | gemini.ts 타입 에러 수정, 로그 최적화, 검차 요청 플로우 수정 | Hosting |

---

## 💡 참고 사항

### Functions 재배포 필요 여부
- **재배포 불필요**: Functions 코드 변경 없음
- **재배포 필요**: Functions 코드 변경 있음

### Storage 재배포 필요 여부
- **재배포 불필요**: Storage Rules 파일 없음 또는 변경 없음
- **재배포 필요**: Storage Rules 파일 변경 있음

### 환경 변수 관리
- `.env.local` 파일은 Git에 커밋하지 않음 (`.gitignore`에 포함)
- Firebase Hosting 환경 변수는 `firebase.json` 또는 Firebase Console에서 설정
- Functions 환경 변수는 Secret Manager 사용 권장

---

**다음 단계**: 빌드 테스트 → 배포 실행 → 배포 확인

