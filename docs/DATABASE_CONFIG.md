# 데이터베이스 설정 문서

**버전**: 1.0  
**최종 업데이트**: 2025-01-XX  
**상태**: 테스트 모드 (2026-01-29까지)

---

## 개요

이 문서는 FOWARDMAX 프로젝트의 Firebase 데이터베이스 설정 원칙과 각 데이터베이스별 상세 설정 정보를 정의합니다.

---

## 리전 설정 원칙

### 기본 원칙
- **모든 데이터베이스는 `asia-northeast3` 리전 사용**

### 예외
- **Realtime Database는 `us-central1` 리전 사용**

### 적용 대상

| 데이터베이스 | 리전 | 비고 |
|------------|------|------|
| Firestore | `asia-northeast3` | 서울, 기본 원칙 적용 |
| Storage | `asia-northeast3` | 서울, 기본 원칙 적용 |
| Realtime Database | `us-central1` | 아이오와, 예외 적용 |

---

## 테스트 모드 설정

### 원칙
- **모든 데이터베이스는 테스트 모드로 설정 (30일간)**
- **만료일**: 2026-01-29 (`1769612400000` Unix timestamp)

### 적용 대상
- Firestore Rules: 테스트 모드 규칙 적용
- Storage Rules: 테스트 모드 규칙 적용
- Realtime Database Rules: 테스트 모드 규칙 적용

### 테스트 모드 규칙

#### Firestore Rules
```javascript
match /{document=**} {
  allow read, write: if request.time < timestamp.date(2026, 1, 29);
}
```

#### Storage Rules
```javascript
match /{allPaths=**} {
  allow read, write: if request.time < timestamp.date(2026, 1, 29);
}
```

#### Realtime Database Rules
```json
{
  "rules": {
    ".read": "now < 1769612400000",
    ".write": "now < 1769612400000"
  }
}
```

---

## 각 데이터베이스별 설정 정보

### 1. Firestore

| 항목 | 값 |
|------|-----|
| **데이터베이스 이름** | `(default)` |
| **리전** | `asia-northeast3` (서울) |
| **모드** | Native 모드 |
| **상태** | READY |
| **실시간 업데이트** | ENABLED |
| **Free Tier** | true |
| **Rules 파일** | `firestore.rules` |
| **인덱스 파일** | `firestore.indexes.json` |
| **테스트 모드 만료일** | 2026-01-29 |

**생성 완료 상태**:
- ✅ Location: `asia-northeast3` (서울)
- ✅ Type: `FIRESTORE_NATIVE`
- ✅ State: `READY`
- ✅ 생성일: 2025-12-28T14:26:42
- ✅ Realtime Updates: `ENABLED`
- ✅ Free Tier: `true`

---

### 2. Firebase Storage

| 항목 | 값 |
|------|-----|
| **버킷 이름** | `carivdealer.firebasestorage.app` |
| **리전** | `asia-northeast3` (서울) |
| **Storage Class** | REGIONAL |
| **Bucket Policy Only** | enabled (IAM 정책 사용) |
| **Public Access Prevention** | inherited (보안 강화) |
| **Rules 파일** | `storage.rules` |
| **테스트 모드 만료일** | 2026-01-29 |

**생성 완료 상태**:
- ✅ Bucket: `carivdealer.firebasestorage.app`
- ✅ Location: `ASIA-NORTHEAST3` (서울)
- ✅ Storage Class: `REGIONAL`
- ✅ 생성일: 2025-12-28T14:49:16
- ✅ Bucket Policy Only: `enabled` (IAM 정책 사용)
- ✅ Public Access Prevention: `inherited` (보안 강화)

**디렉토리 구조**: `docs/STORAGE_SCHEMA.md` 참조

---

### 3. Realtime Database

| 항목 | 값 |
|------|-----|
| **데이터베이스 URL** | `https://carivdealer-default-rtdb.firebaseio.com/` |
| **리전** | `us-central1` (아이오와, 예외) |
| **Rules 파일** | `database.rules.json` |
| **테스트 모드 만료일** | 2026-01-29 |

**참고**: Realtime Database는 리전 설정 예외로 `us-central1`을 사용합니다.

---

## 설정 파일 위치

| 설정 항목 | 파일 경로 |
|----------|----------|
| Firestore Rules | `firestore.rules` |
| Firestore Indexes | `firestore.indexes.json` |
| Storage Rules | `storage.rules` |
| Storage Rules (프로덕션) | `storage.rules.prod` |
| Realtime Database Rules | `database.rules.json` |
| Firebase 설정 | `firebase.json` |

---

## 배포 명령어

### Firestore Rules 배포
```bash
firebase deploy --only firestore:rules
```

### Firestore Indexes 배포
```bash
firebase deploy --only firestore:indexes
```

### Storage Rules 배포
```bash
firebase deploy --only storage
```

### Realtime Database Rules 배포
```bash
firebase deploy --only database
```

### 전체 Rules 배포
```bash
firebase deploy --only firestore:rules,firestore:indexes,storage,database
```

---

## 프로덕션 전환 가이드

테스트 모드 만료일(2026-01-29) 이전에 다음 작업을 수행해야 합니다:

1. **인증 시스템 통합**: 실제 사용자 인증 구현
2. **보안 규칙 강화**: 
   - `firestore.rules`에서 프로덕션 규칙 활성화
   - `storage.rules`를 `storage.rules.prod`로 교체
   - `database.rules.json`에 프로덕션 규칙 적용
3. **인덱스 최적화**: 쿼리 패턴에 맞춰 인덱스 추가/수정
4. **데이터 검증**: 필수 필드 누락 여부 확인
5. **TTL 정책 적용**: 만료된 제안 자동 삭제 (Cloud Functions Scheduled Function)

---

## 검증 방법

### 리전 설정 확인
```bash
# Firestore 리전 확인
gcloud firestore databases describe --database="(default)" --project=carivdealer

# Storage 리전 확인
gsutil ls -L -b gs://carivdealer.firebasestorage.app

# Realtime Database 리전 확인 (Firebase Console에서 확인)
```

### Rules 테스트
- Firestore Rules: Firebase Console → Firestore Database → Rules → Rules Playground
- Storage Rules: Firebase Console → Storage → Rules → Rules Playground
- Realtime Database Rules: Firebase Console → Realtime Database → Rules → Rules Playground

---

## 변경 이력

| 버전 | 날짜 | 변경 내용 |
|------|------|-----------|
| 1.0 | 2025-01-XX | 초기 버전 작성 |

---

## 참고 문서

- [FIRESTORE_SCHEMA.md](./FIRESTORE_SCHEMA.md) - Firestore 컬렉션 구조 정의서
- [STORAGE_SCHEMA.md](./STORAGE_SCHEMA.md) - Firebase Storage 구조 정의서
- [PRD_Phase1_2025-12-31.md](./PRD_Phase1_2025-12-31.md) - 제품 요구사항 문서

