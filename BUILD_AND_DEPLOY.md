# 빌드 및 배포 가이드

**작성일**: 2025-01-XX  
**프로젝트**: ForwardMax (carivdealer)

---

## 📋 사전 확인 사항

### 1. 환경 변수 확인
- `.env.local` 파일이 존재하고 모든 Firebase 설정이 포함되어 있는지 확인
- GEMINI_API_KEY가 설정되어 있는지 확인

### 2. 의존성 설치 확인
```bash
npm install
```

### 3. 린터 및 타입 체크
```bash
# TypeScript 타입 체크
npx tsc --noEmit

# 린터 체크 (ESLint가 설정된 경우)
npx eslint src/
```

---

## 🔨 빌드 프로세스

### 1. 프로덕션 빌드 실행
```bash
cd C:\carivdealer\FOWARDMAX
npm run build
```

**빌드 결과물**:
- `dist/` 폴더에 생성됨
- `dist/index.html` - 메인 HTML 파일
- `dist/assets/` - 번들된 JS/CSS 파일

### 2. 빌드 검증
```bash
# 빌드 결과물 확인
ls dist/
ls dist/assets/

# 로컬 프리뷰 (선택사항)
npm run preview
```

---

## 🚀 배포 프로세스

### Firebase Hosting 배포

#### 1. Firebase CLI 로그인 확인
```bash
firebase login
```

#### 2. 프로젝트 확인
```bash
firebase projects:list
# carivdealer 프로젝트가 표시되는지 확인
```

#### 3. Hosting 배포
```bash
cd C:\carivdealer\FOWARDMAX
firebase deploy --only hosting
```

**배포 결과**:
- 배포된 URL: `https://carivdealer.web.app`
- 또는: `https://carivdealer.firebaseapp.com`

#### 4. Functions 배포 (필요시)
```bash
firebase deploy --only functions
```

#### 5. 전체 배포 (Hosting + Functions)
```bash
firebase deploy
```

---

## ✅ 배포 후 확인 사항

### 1. 배포된 사이트 확인
- [ ] 메인 페이지 로드 확인
- [ ] 로그인 화면 정상 동작 확인
- [ ] 대시보드 정상 표시 확인
- [ ] 탁송 플로우 정상 동작 확인:
  - [ ] SCR-0600 (탁송 예약) - 출발지/도착지 자동 처리 확인
  - [ ] SCR-0601 (탁송 내역) - 인계 승인 모달 개선 확인
  - [ ] SCR-0105 (정산 상세) - 탁송비/검차비, 입금 계좌 표시 확인

### 2. 콘솔 에러 확인
- 브라우저 개발자 도구에서 콘솔 에러 확인
- 네트워크 탭에서 API 호출 확인

### 3. 반응형 디자인 확인
- 모바일 화면에서 레이아웃 확인
- Two-Column 레이아웃이 데스크톱에서 정상 표시되는지 확인

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
   # 에러 메시지 확인 후 수정
   ```

3. **환경 변수 누락**
   - `.env.local` 파일 확인
   - `vite.config.ts`의 환경 변수 설정 확인

### 배포 실패 시

1. **Firebase CLI 버전 확인**
   ```bash
   firebase --version
   # 최신 버전으로 업데이트: npm install -g firebase-tools
   ```

2. **권한 확인**
   ```bash
   firebase login --reauth
   ```

3. **프로젝트 설정 확인**
   ```bash
   cat .firebaserc
   # default 프로젝트가 "carivdealer"인지 확인
   ```

---

## 📝 배포 체크리스트

### 빌드 전
- [ ] 모든 파일 저장 완료
- [ ] 린터 에러 없음 확인
- [ ] TypeScript 타입 에러 없음 확인
- [ ] 환경 변수 설정 확인

### 빌드 중
- [ ] 빌드 성공 확인
- [ ] 빌드 결과물 크기 확인 (과도하게 크지 않은지)
- [ ] 소스맵 생성 확인 (개발용)

### 배포 전
- [ ] 로컬 프리뷰로 동작 확인
- [ ] 주요 기능 테스트 완료

### 배포 후
- [ ] 배포된 사이트 접속 확인
- [ ] 주요 화면 정상 표시 확인
- [ ] API 호출 정상 동작 확인
- [ ] 콘솔 에러 없음 확인

---

## 🔄 롤백 절차 (필요시)

### 이전 버전으로 롤백
```bash
# Firebase Hosting 이전 버전 확인
firebase hosting:channel:list

# 특정 버전으로 롤백
firebase hosting:rollback
```

---

## 📊 배포 이력

| 날짜 | 버전 | 변경 사항 | 배포자 |
|------|------|----------|--------|
| 2025-01-XX | - | 탁송 플로우 개선 완료 | - |

---

**참고**: 
- 빌드 및 배포는 개발 환경에서 직접 실행해야 합니다.
- npm이 PATH에 없는 경우, Node.js 설치 경로를 확인하거나 전체 경로를 사용하세요.
- 예: `C:\Program Files\nodejs\npm.cmd run build`

