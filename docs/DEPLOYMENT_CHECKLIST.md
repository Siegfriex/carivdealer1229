# 배포 체크리스트

**프로젝트**: `carivdealer`  
**작성일**: 2025-01-XX  
**상태**: 배포 준비 완료

---

## 배포 전 필수 확인 사항

### 1. Secret Manager 설정
- [ ] `gemini-api-key` 시크릿 생성 완료
- [ ] `kotsa-public-data-api-key` 시크릿 생성 완료
- [ ] 서비스 계정 권한 확인 (`roles/secretmanager.secretAccessor`)

**설정 방법**: `docs/SECRET_MANAGER_완전체_설정_프롬프트.md` 참조

### 2. 환경변수 파일 (로컬 개발용)
- [ ] `functions/.env` 파일 생성 (로컬 개발 시 사용)
- [ ] `functions/.env` 파일이 `.gitignore`에 포함되어 있는지 확인

### 3. 빌드 확인
- [ ] 프론트엔드 빌드 테스트: `npm run build`
- [ ] Functions 빌드 테스트: `cd functions && npm run build`

---

## 배포 순서

### 1단계: Rules 배포 (데이터베이스 보안 규칙)

#### 1-1. Storage Rules 배포
```bash
firebase deploy --only storage
```

**예상 결과**:
```
+  storage: deployed rules in firebase.storage successfully
```

#### 1-2. Firestore Rules 배포
```bash
firebase deploy --only firestore:rules
```

**예상 결과**:
```
+  firestore: deployed rules in firestore.rules successfully
```

#### 1-3. Realtime Database Rules 배포
```bash
firebase deploy --only database
```

**예상 결과**:
```
+  database: deployed rules in database.rules.json successfully
```

**참고**: Firestore 인덱스는 이미 배포 완료되었습니다.

---

### 2단계: Functions 배포 (Secret Manager 설정 후)

#### 2-1. Secret Manager 설정 확인
```bash
# 시크릿 목록 확인
gcloud secrets list --project=carivdealer

# 시크릿 값 확인 (마스킹)
gcloud secrets versions access latest --secret="gemini-api-key" | Select-Object -First 1
gcloud secrets versions access latest --secret="kotsa-public-data-api-key" | Select-Object -First 1
```

#### 2-2. Functions 배포
```bash
firebase deploy --only functions
```

**예상 결과**:
```
+  functions[ocrRegistrationAPI(asia-northeast3)]: Successful create operation.
+  functions[verifyBusinessAPI(asia-northeast3)]: Successful create operation.
  ... (기타 Functions)
```

**주의**: Functions 배포는 시간이 오래 걸릴 수 있습니다 (5-10분).

---

### 3단계: 프론트엔드 빌드 및 배포

#### 3-1. 프론트엔드 빌드
```bash
cd C:\carivdealer\FOWARDMAX
npm run build
```

**예상 결과**:
```
✓ built in 2.67s
dist/index.html                  3.16 kB │ gzip:   1.22 kB
dist/assets/index-*.js         616.10 kB │ gzip: 145.96 kB
```

#### 3-2. Hosting 배포
```bash
firebase deploy --only hosting
```

**예상 결과**:
```
+  hosting: 2 files uploaded successfully
+  hosting[carivdealer]: deployed successfully
```

**배포 URL**: https://carivdealer.web.app

---

## 전체 배포 (한 번에)

모든 항목을 한 번에 배포하려면:

```bash
# 1. 프론트엔드 빌드
npm run build

# 2. 전체 배포 (Rules + Functions + Hosting)
firebase deploy
```

**주의**: Functions 배포는 시간이 오래 걸리므로, 단계별 배포를 권장합니다.

---

## 배포 후 확인 사항

### 1. Rules 배포 확인
- [ ] Storage Rules: Firebase Console → Storage → Rules 탭 확인
- [ ] Firestore Rules: Firebase Console → Firestore Database → Rules 탭 확인
- [ ] Realtime Database Rules: Firebase Console → Realtime Database → Rules 탭 확인

### 2. Functions 배포 확인
- [ ] Functions 목록: Firebase Console → Functions 확인
- [ ] Functions 로그: `firebase functions:log` 실행
- [ ] API 엔드포인트 테스트 (선택)

### 3. Hosting 배포 확인
- [ ] 배포된 사이트 접속: https://carivdealer.web.app
- [ ] 메인 페이지 로드 확인
- [ ] 주요 기능 테스트

---

## 빠른 배포 명령어 모음

### Rules만 배포
```bash
firebase deploy --only firestore:rules,storage,database
```

### Functions만 배포
```bash
firebase deploy --only functions
```

### Hosting만 배포
```bash
npm run build
firebase deploy --only hosting
```

### Rules + Hosting 배포 (Functions 제외)
```bash
npm run build
firebase deploy --only firestore:rules,storage,database,hosting
```

---

## 문제 해결

### 에러: "Storage Rules compilation error"
- **원인**: `storage.rules` 파일 문법 오류
- **해결**: `storage.rules` 파일 확인 (닫는 중괄호 확인)

### 에러: "Functions deploy failed"
- **원인**: Secret Manager 접근 권한 없음 또는 빌드 오류
- **해결**: 
  1. 서비스 계정 권한 확인
  2. `cd functions && npm run build` 실행하여 빌드 오류 확인

### 에러: "Hosting deploy failed"
- **원인**: `dist/` 폴더가 없음
- **해결**: `npm run build` 실행 후 재배포

---

## 배포 상태 요약

| 항목 | 상태 | 배포 명령어 |
|------|------|------------|
| Firestore 인덱스 | ✅ 배포 완료 | `firebase deploy --only firestore:indexes` |
| Storage Rules | ⏳ 배포 필요 | `firebase deploy --only storage` |
| Firestore Rules | ⏳ 배포 필요 | `firebase deploy --only firestore:rules` |
| Realtime Database Rules | ⏳ 배포 필요 | `firebase deploy --only database` |
| Functions | ⏳ 배포 필요 (Secret Manager 설정 후) | `firebase deploy --only functions` |
| Hosting | ⏳ 배포 필요 (빌드 후) | `npm run build && firebase deploy --only hosting` |

---

## 권장 배포 순서

1. **Rules 배포** (빠름, 1-2분)
   ```bash
   firebase deploy --only firestore:rules,storage,database
   ```

2. **Secret Manager 설정** (수동)
   - `docs/SECRET_MANAGER_완전체_설정_프롬프트.md` 참조

3. **Functions 배포** (느림, 5-10분)
   ```bash
   firebase deploy --only functions
   ```

4. **프론트엔드 빌드 및 배포** (중간, 2-3분)
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

---

## 예상 소요 시간

- Rules 배포: 1-2분
- Secret Manager 설정: 5-10분 (수동)
- Functions 배포: 5-10분
- 프론트엔드 빌드: 1-2분
- Hosting 배포: 1-2분

**총 예상 시간**: 15-25분

---

## 다음 단계

배포 완료 후:
1. 배포된 사이트 접속 확인
2. 주요 기능 테스트
3. Functions 로그 모니터링
4. 에러 발생 시 로그 분석

