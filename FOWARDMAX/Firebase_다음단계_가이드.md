# Firebase 다음 단계 가이드

**프로젝트 ID**: `carivdealer`  
**작성일**: 2025-12-28

---

## 현재 완료 상태

### ✅ 완료된 작업

1. **Firestore 데이터베이스**: 생성 완료
   - Type: `FIRESTORE_NATIVE`
   - Location: `asia-northeast3`
   - State: `READY`

2. **Firebase Storage 버킷**: 생성 완료
   - Bucket: `carivdealer.firebasestorage.app`
   - Location: `ASIA-NORTHEAST3`
   - Storage Class: `REGIONAL`

3. **Firebase 프로젝트 초기화**: 완료
   - Analytics 활성화
   - Authentication 활성화

---

## 다음 단계 (우선순위 순)

### 1. Firestore Security Rules 설정 (최우선)

**목적**: 프로덕션 모드에 맞는 보안 규칙 설정

**Rules 파일 생성** (`firestore.rules`):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // 인증된 사용자만 기본 접근 가능
    match /{document=**} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Vehicles 컬렉션 - 딜러만 생성, 소유자만 수정/삭제
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
    
    // Auctions 컬렉션
    match /auctions/{auctionId} {
      allow read: if request.auth != null;
      allow create, update: if request.auth != null && 
                              request.auth.token.role == 'DEALER';
    }
    
    // Trades 컬렉션
    match /trades/{tradeId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Members 컬렉션 - 본인 정보만 수정 가능
    match /members/{memberId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && 
                     request.auth.uid == memberId;
    }
  }
}
```

**배포 명령어**:
```bash
# Firebase CLI 로그인 (필요시)
firebase login --no-localhost

# 프로젝트 디렉토리 생성 및 초기화
mkdir -p ~/carivdealer-firebase
cd ~/carivdealer-firebase
firebase init firestore

# Rules 파일 작성 후 배포
firebase deploy --only firestore:rules
```

---

### 2. Firebase Storage Security Rules 설정

**목적**: Storage 접근 권한 제어

**Rules 파일 생성** (`storage.rules`):

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    // 업로드 폴더 - 사용자별 디렉토리
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
    
    // 공개 이미지 - 모든 사용자 읽기, 딜러만 쓰기
    match /public/{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null && 
                     request.auth.token.role == 'DEALER';
    }
    
    // 사업자등록증 등록원부 - 본인만 접근
    match /documents/{userId}/{allPaths=**} {
      allow read, write: if request.auth != null && 
                            request.auth.uid == userId;
    }
  }
}
```

**배포 명령어**:
```bash
# Storage Rules 배포
firebase deploy --only storage
```

---

### 3. Secret Manager 시크릿 생성

**목적**: Gemini API 키 등 민감 정보 저장

**시크릿 생성 명령어**:

```bash
# Gemini API 키 시크릿 생성
echo -n "YOUR_GEMINI_API_KEY_HERE" | gcloud secrets create gemini-api-key \
  --data-file=- \
  --replication-policy="automatic" \
  --project=carivdealer

# 다른 API 키들도 동일하게 생성
# 예: 외부 API 키, 데이터베이스 연결 정보 등

# 시크릿 목록 확인
gcloud secrets list --project=carivdealer

# 시크릿 접근 권한 확인
gcloud secrets get-iam-policy gemini-api-key --project=carivdealer
```

**필요한 시크릿 목록**:
- `gemini-api-key`: Gemini 1.5 Pro API 키
- `firebase-admin-sdk`: Firebase Admin SDK 키 (선택사항)

---

### 4. Firebase 프로젝트 구조 설정

**Firestore 컬렉션 구조**:

```
firestore/
├── vehicles/              # 차량 정보
│   └── {vehicleId}/
│       ├── basicInfo      # 기본 정보 (VIN, 모델, 연식 등)
│       ├── status         # 상태 (Draft, Inspecting, Active 등)
│       ├── saleMethod     # 판매 방식 (Normal, Auction)
│       └── createdAt      # 생성일시
├── inspections/           # 검차 정보
│   └── {inspectionId}/
│       ├── vehicleId      # 차량 ID 참조
│       ├── inspectorId    # 평가사 ID
│       ├── result         # 검차 결과
│       ├── media          # 미디어 URL 목록
│       └── createdAt      # 생성일시
├── auctions/              # 경매 정보
│   └── {auctionId}/
│       ├── vehicleId      # 차량 ID 참조
│       ├── startPrice     # 시작가
│       ├── buyNowPrice    # 즉시구매가
│       ├── bids           # 입찰 정보 (서브컬렉션)
│       └── status         # 경매 상태
├── trades/                # 거래 정보
│   └── {tradeId}/
│       ├── vehicleId      # 차량 ID 참조
│       ├── buyerId        # 바이어 ID
│       ├── sellerId        # 딜러 ID
│       ├── price          # 거래 가격
│       └── status         # 거래 상태
└── members/               # 회원 정보
    └── {memberId}/
        ├── role           # 역할 (DEALER, INSPECTOR 등)
        ├── company        # 회사명
        └── createdAt      # 생성일시
```

**Storage 폴더 구조**:

```
storage/
├── uploads/               # 사용자 업로드 파일
│   └── {userId}/
│       ├── business-registration/  # 사업자등록증
│       └── registration-cert/      # 등록원부
├── inspections/           # 검차 미디어
│   └── {inspectionId}/
│       ├── photos/       # 사진 (37+)
│       └── videos/       # 비디오 (3)
└── public/                # 공개 이미지
    └── vehicles/         # 차량 공개 이미지
```

---

### 5. Firebase 인덱스 설정

**복합 쿼리를 위한 인덱스 생성** (`firestore.indexes.json`):

```json
{
  "indexes": [
    {
      "collectionGroup": "vehicles",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "ownerId",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "status",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    },
    {
      "collectionGroup": "auctions",
      "queryScope": "COLLECTION",
      "fields": [
        {
          "fieldPath": "status",
          "order": "ASCENDING"
        },
        {
          "fieldPath": "createdAt",
          "order": "DESCENDING"
        }
      ]
    }
  ],
  "fieldOverrides": []
}
```

**배포 명령어**:
```bash
firebase deploy --only firestore:indexes
```

---

## 일괄 실행 명령어 (GCP 콘솔 터미널)

### Step 1: Firebase CLI 설정

```bash
# Firebase CLI 로그인
firebase login --no-localhost

# 프로젝트 디렉토리 생성
mkdir -p ~/carivdealer-firebase
cd ~/carivdealer-firebase

# Firebase 프로젝트 초기화 (Firestore, Storage 선택)
firebase init
```

### Step 2: Security Rules 배포

```bash
# Firestore Rules 배포
firebase deploy --only firestore:rules

# Storage Rules 배포
firebase deploy --only storage
```

### Step 3: Secret Manager 시크릿 생성

```bash
# Gemini API 키 시크릿 생성 (실제 키로 교체 필요)
echo -n "YOUR_GEMINI_API_KEY" | gcloud secrets create gemini-api-key \
  --data-file=- \
  --replication-policy="automatic" \
  --project=carivdealer

# 시크릿 목록 확인
gcloud secrets list --project=carivdealer
```

---

## 체크리스트

### 즉시 수행 (필수)

- [x] Firestore 데이터베이스 생성 ✅
- [x] Firebase Storage 버킷 생성 ✅
- [ ] Firestore Security Rules 설정 및 배포
- [ ] Firebase Storage Security Rules 설정 및 배포
- [ ] Secret Manager 시크릿 생성 (Gemini API 키)

### 중기 수행 (선택)

- [ ] Firestore 인덱스 설정
- [ ] Firebase 프로젝트 구조 문서화
- [ ] Storage CORS 설정 (필요시)
- [ ] Firebase Hosting 설정

---

## 다음 단계 우선순위

1. **Firestore Security Rules 설정** (보안 강화)
2. **Firebase Storage Security Rules 설정** (보안 강화)
3. **Secret Manager 시크릿 생성** (Gemini API 키 저장)
4. **Firestore 인덱스 설정** (쿼리 성능 최적화)

---

**작성일**: 2025-12-28  
**참조**: PRD_Phase1_2025-12-31.md Section 13.1.2

