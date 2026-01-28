# 설치 가이드

**날짜**: 2026-01-26  
**상태**: 설치 대기 중

---

## ⚠️ PowerShell 실행 정책 문제 해결

### 방법 1: 관리자 권한으로 실행 정책 변경

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
npm install
```

### 방법 2: cmd 사용

```cmd
cmd
cd Y:\0126\0128\carivdealer1229
npm install
```

### 방법 3: 직접 node_modules 경로 사용

```powershell
& "Y:\0126\nodejs\npm.cmd" install
```

---

## 설치 후 검증 단계

### 1. 타입 체크

```bash
npm run type-check
```

예상 결과: 타입 에러 확인 및 수정

### 2. 개발 서버 실행

```bash
npm run dev
```

예상 URL: http://localhost:3000

### 3. 브라우저 확인

- 700px 미만: MobileBlocker 표시 확인
- 700px 이상: 로그인 페이지 표시 확인

### 4. 빌드 테스트

```bash
npm run build
```

예상 결과: dist/ 폴더 생성

---

## 예상되는 타입 에러 및 해결

### 1. lucide-react import 에러

**에러**:
```
Cannot find module 'lucide-react'
```

**해결**:
```bash
npm install lucide-react
```

### 2. @tanstack/react-query 타입 에러

**에러**:
```
Property 'gcTime' does not exist
```

**해결**: `queryClient.ts`에서 `cacheTime` → `gcTime` 변경 (이미 적용됨)

### 3. Firebase Timestamp 타입 에러

**해결**: 이미 Zod 스키마에서 처리됨

---

## 설치 완료 후 테스트 항목

- [ ] npm install 성공
- [ ] npm run dev 실행
- [ ] 로그인 페이지 렌더링
- [ ] Tailwind 클래스 적용 확인
- [ ] 700px 미만에서 MobileBlocker 표시
- [ ] Console 에러 없음
- [ ] npm run type-check 통과
- [ ] npm run build 성공

---

**다음 단계**: 위 방법 중 하나로 npm install 실행
