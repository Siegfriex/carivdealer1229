# Firebase 프로덕션 모드 설정 가이드

**프로젝트 ID**: `carivdealer`  
**프로젝트 번호**: `850300267700`  
**작성일**: 2025-12-28

---

## Firebase 프로젝트 정보

### Web App 설정

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

### 활성화된 서비스

- ✅ Firebase Analytics (`G-ET5Q9986GQ`)
- ✅ Firebase Authentication (`carivdealer.firebaseapp.com`)
- ✅ Firebase Storage (`carivdealer.firebasestorage.app`)
- ⚠️ Firestore (생성 확인 필요)

---

## GCP 콘솔 터미널 실행 명령어

### 1. 프로젝트 설정 확인

```bash
# 프로젝트 설정 확인
gcloud config set project carivdealer

# 현재 프로젝트 확인
gcloud config get-value project
```

### 2. Firestore 데이터베이스 생성 및 확인

```bash
# Firestore 데이터베이스 목록 확인
gcloud firestore databases list --project=carivdealer

# 데이터베이스가 없으면 생성 (Native 모드 - 프로덕션 권장)
gcloud firestore databases create \
  --location=asia-northeast3 \
  --type=firestore-native \
  --project=carivdealer

# 데이터베이스 상세 정보 확인
gcloud firestore databases describe --database="(default)" --project=carivdealer
```

**예상 결과**:
- Location: `asia-northeast3` (서울 리전)
- Type: `firestore-native`
- State: `READY`

### 3. Firebase Storage 버킷 확인

```bash
# Storage 버킷 목록 확인
gsutil ls -p carivdealer

# 기본 버킷 상세 정보 확인
gsutil ls -L -b gs://carivdealer.firebasestorage.app

# 버킷 IAM 정책 확인
gsutil iam get gs://carivdealer.firebasestorage.app

# 버킷 설정 확인
gsutil cors get gs://carivdealer.firebasestorage.app
```

### 4. Firebase CLI 설정 확인

```bash
# Firebase CLI 설치 확인
firebase --version

# Firebase 로그인 상태 확인
firebase login:list

# 프로젝트 목록 확인
firebase projects:list

# 현재 프로젝트 설정
firebase use carivdealer

# Firebase 프로젝트 정보 확인
firebase projects:get carivdealer
```

### 5. Firestore Security Rules 설정 (프로덕션 모드)

**기본 프로덕션 규칙** (`firestore.rules`):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 인증된 사용자만 접근 가능
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Vehicles 컬렉션 - 딜러만 쓰기 가능
    match /vehicles/{vehicleId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null && 
                     request.auth.token.role == 'DEALER';
      allow update, delete: if request.auth != null && 
                              request.auth.uid == resource.data.ownerId;
    }
    
    // Inspections 컬렉션 - 평가사만 쓰기 가능
    match /inspections/{inspectionId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                    request.auth.token.role == 'INSPECTOR';
    }
    
    // Auctions 컬렉션 - 읽기는 인증된 사용자, 쓰기는 딜러만
    match /auctions/{auctionId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null && 
                              request.auth.token.role == 'DEALER';
    }
  }
}
```

**배포**:
```bash
# Firestore Rules 배포
firebase deploy --only firestore:rules
```

### 6. Firebase Storage Security Rules 설정 (프로덕션 모드)

**기본 프로덕션 규칙** (`storage.rules`):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 업로드 폴더 - 인증된 사용자만 업로드 가능
    match /uploads/{userId}/{allPaths=**} {
      allow read: if true; // 공개 읽기 (CDN 활용)
      allow write: if request.auth != null && 
                     request.auth.uid == userId;
    }
    
    // 검차 미디어 - 평가사만 업로드 가능
    match /inspections/{inspectionId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     request.auth.token.role == 'INSPECTOR';
    }
    
    // 공개 이미지 - 모든 사용자 읽기 가능
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                     request.auth.token.role == 'DEALER';
    }
  }
}
```

**배포**:
```bash
# Storage Rules 배포
firebase deploy --only storage
```

---

## 일괄 실행 명령어 (GCP 콘솔 터미널)

```bash
# 프로젝트 설정
gcloud config set project carivdealer

# Firestore 데이터베이스 확인 및 생성
echo "=== Firestore 데이터베이스 확인 ==="
gcloud firestore databases list --project=carivdealer

# 데이터베이스가 없으면 생성
gcloud firestore databases create --location=asia-northeast3 --type=firestore-native --project=carivdealer 2>/dev/null || echo "데이터베이스가 이미 존재하거나 생성 중입니다."

# Storage 버킷 확인
echo "=== Firebase Storage 버킷 확인 ==="
gsutil ls -p carivdealer

# Firebase CLI 설정 확인
echo "=== Firebase CLI 설정 확인 ==="
firebase use carivdealer || echo "Firebase CLI가 설치되지 않았거나 로그인이 필요합니다."

# 최종 상태 확인
echo "=== 최종 상태 확인 ==="
echo "Firestore 데이터베이스:"
gcloud firestore databases list --project=carivdealer --format="table(name,locationId,type)"

echo "Storage 버킷:"
gsutil ls -p carivdealer
```

---

## Firebase 프로젝트 구조

### 예상 컬렉션 구조

```
firestore/
├── vehicles/          # 차량 정보
│   └── {vehicleId}/
│       ├── basicInfo
│       ├── status
│       └── ...
├── inspections/       # 검차 정보
│   └── {inspectionId}/
│       ├── result
│       ├── media
│       └── ...
├── auctions/          # 경매 정보
│   └── {auctionId}/
│       ├── bids
│       ├── status
│       └── ...
├── trades/            # 거래 정보
│   └── {tradeId}/
│       └── ...
└── members/           # 회원 정보
    └── {memberId}/
        └── ...
```

### Storage 폴더 구조

```
storage/
├── uploads/           # 사용자 업로드 파일
│   └── {userId}/
│       └── ...
├── inspections/       # 검차 미디어
│   └── {inspectionId}/
│       ├── photos/
│       └── videos/
└── public/            # 공개 이미지
    └── ...
```

---

## 다음 단계

1. ✅ Firebase 프로젝트 초기화 확인
2. ⚠️ Firestore 데이터베이스 생성 확인
3. ⚠️ Firebase Storage 버킷 확인
4. 다음: Firestore Security Rules 배포
5. 다음: Firebase Storage Security Rules 배포
6. 다음: Secret Manager에 Gemini API 키 저장
7. 다음: Cloud Functions/Run 배포 준비

---

**작성일**: 2025-12-28  
**참조**: PRD_Phase1_2025-12-31.md Section 13.1.2

