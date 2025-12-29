# Firebase Functions 배포 완료 후 다음 단계

## ✅ 완료된 작업
- Firebase Functions v2 배포 완료 (asia-northeast3)
- 6개 API 함수 배포:
  - `ocrRegistrationAPI` (API-0100)
  - `verifyBusinessAPI` (API-0002)
  - `inspectionRequestAPI` (API-0101)
  - `changeSaleMethodAPI` (API-0300)
  - `bidAPI` (API-0200)
  - `buyNowAPI` (API-0201)

---

## 📋 다음 단계 체크리스트

### 1. 배포된 Functions 엔드포인트 확인 및 테스트

#### 엔드포인트 URL 확인
```bash
# Functions 목록 확인
firebase functions:list

# 또는 GCP 콘솔에서 확인
# https://console.cloud.google.com/functions/list?project=carivdealer&region=asia-northeast3
```

**예상 엔드포인트 URL:**
- `https://asia-northeast3-carivdealer.cloudfunctions.net/ocrRegistrationAPI`
- `https://asia-northeast3-carivdealer.cloudfunctions.net/verifyBusinessAPI`
- `https://asia-northeast3-carivdealer.cloudfunctions.net/inspectionRequestAPI`
- `https://asia-northeast3-carivdealer.cloudfunctions.net/changeSaleMethodAPI`
- `https://asia-northeast3-carivdealer.cloudfunctions.net/bidAPI`
- `https://asia-northeast3-carivdealer.cloudfunctions.net/buyNowAPI`

#### 간단한 테스트 (curl)
```bash
# OCR Registration API 테스트
curl -X POST https://asia-northeast3-carivdealer.cloudfunctions.net/ocrRegistrationAPI \
  -H "Content-Type: application/json" \
  -d '{"car_no": "12가3456"}'

# 검차 신청 API 테스트
curl -X POST https://asia-northeast3-carivdealer.cloudfunctions.net/inspectionRequestAPI \
  -H "Content-Type: application/json" \
  -d '{"vehicle_id": "test-vehicle-001", "preferred_date": "2025-01-15", "preferred_time": "10:00"}'
```

---

### 2. Firestore 보안 규칙 배포

```bash
# Firestore 보안 규칙 배포
firebase deploy --only firestore:rules

# Firestore 인덱스 배포 (필요시)
firebase deploy --only firestore:indexes
```

**확인 사항:**
- `firestore.rules` 파일이 올바르게 작성되었는지 확인
- `firestore.indexes.json` 파일이 존재하는지 확인

---

### 3. GCP Secret Manager에 Gemini API 키 저장 (아직 안 했다면)

```bash
# Secret 생성
echo -n "AIzaSyB7CDM-9SP3y__bV2KIm-U3-aaQWdHdHgs" | \
  gcloud secrets create gemini-api-key \
  --project=carivdealer \
  --data-file=-

# 또는 Cloud Shell에서
echo -n "AIzaSyB7CDM-9SP3y__bV2KIm-U3-aaQWdHdHgs" | \
  gcloud secrets create gemini-api-key \
  --project=carivdealer \
  --data-file=-

# Secret 접근 권한 부여 (Functions 서비스 계정에)
gcloud secrets add-iam-policy-binding gemini-api-key \
  --project=carivdealer \
  --member="serviceAccount:cloud-runtime-unified@carivdealer.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

---

### 4. 프론트엔드 빌드 및 Firebase Hosting 배포

#### 4.1 프론트엔드 빌드
```powershell
cd C:\carivdealer\FOWARDMAX

# 의존성 설치 (아직 안 했다면)
npm install

# 프로덕션 빌드
npm run build
```

**빌드 결과:**
- `dist/` 폴더에 빌드된 파일 생성 확인

#### 4.2 Firebase Hosting 배포
```powershell
# Hosting 배포
firebase deploy --only hosting

# 또는 Functions와 함께 배포
firebase deploy
```

**배포 후 확인:**
- Firebase Hosting URL 확인:
  - `https://carivdealer.web.app`
  - `https://carivdealer.firebaseapp.com`

---

### 5. 환경 변수 확인 및 업데이트

#### 5.1 `.env.local` 파일 확인
```env
GEMINI_API_KEY=AIzaSyB7CDM-9SP3y__bV2KIm-U3-aaQWdHdHgs
VITE_API_BASE_URL=https://asia-northeast3-carivdealer.cloudfunctions.net
VITE_FIREBASE_API_KEY=AIzaSyAX4zD8yWbJN6jLubOtLzSJtJsLqO5saW0
VITE_FIREBASE_AUTH_DOMAIN=carivdealer.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=carivdealer
VITE_FIREBASE_STORAGE_BUCKET=carivdealer.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=850300267700
VITE_FIREBASE_APP_ID=1:850300267700:web:60812e374759ac57903be1
```

#### 5.2 Firebase Hosting 환경 변수 설정 (필요시)
- Firebase Hosting는 정적 파일만 제공하므로, 환경 변수는 빌드 시점에 포함되어야 함
- `vite.config.ts`에서 이미 설정되어 있음

---

### 6. 통합 테스트

#### 6.1 프론트엔드 → Functions API 연결 테스트
1. 브라우저에서 배포된 사이트 접속
2. 개발자 도구 → Network 탭 열기
3. 주요 기능 테스트:
   - 차량 등록 (OCR)
   - 검차 신청
   - 경매 입찰
   - 판매 방식 변경

#### 6.2 Functions 로그 확인
```bash
# Functions 로그 확인
firebase functions:log

# 특정 함수 로그만 확인
firebase functions:log --only ocrRegistrationAPI
```

---

### 7. 추가 설정 (선택사항)

#### 7.1 Firebase Authentication 설정
- Anonymous Auth 활성화 확인
- 필요시 다른 인증 방법 추가

#### 7.2 Firebase Storage 설정
- Storage 보안 규칙 확인
- 버킷 접근 권한 확인

#### 7.3 모니터링 설정
- Cloud Monitoring 대시보드 설정
- 알림 정책 설정

---

## 🚀 빠른 배포 명령어 (전체)

```powershell
# 1. Firestore 규칙 배포
firebase deploy --only firestore:rules

# 2. 프론트엔드 빌드
npm run build

# 3. Hosting 배포
firebase deploy --only hosting

# 또는 한 번에
firebase deploy
```

---

## 📝 체크리스트 요약

- [ ] Functions 엔드포인트 URL 확인
- [ ] Functions 간단 테스트 (curl 또는 브라우저)
- [ ] Firestore 보안 규칙 배포
- [ ] GCP Secret Manager에 Gemini API 키 저장
- [ ] 프론트엔드 빌드 (`npm run build`)
- [ ] Firebase Hosting 배포
- [ ] 배포된 사이트 접속 확인
- [ ] 통합 테스트 (프론트엔드 → Functions)
- [ ] Functions 로그 확인
- [ ] 에러 발생 시 로그 분석 및 수정

---

## 🔗 유용한 링크

- **Firebase Console**: https://console.firebase.google.com/project/carivdealer
- **GCP Console**: https://console.cloud.google.com/home/dashboard?project=carivdealer
- **Functions 목록**: https://console.cloud.google.com/functions/list?project=carivdealer&region=asia-northeast3
- **Firestore 데이터베이스**: https://console.firebase.google.com/project/carivdealer/firestore
- **Hosting 사이트**: https://carivdealer.web.app

---

**다음 단계 완료 후 알려주시면 추가 지원하겠습니다!** 🎉

