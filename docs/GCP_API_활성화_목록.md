# GCP API 활성화 목록

**프로젝트**: carivdealer  
**작성일**: 2025-01-XX  
**상태**: 현재 프로젝트에서 사용 중인 API 목록

---

## 필수 API (반드시 활성화 필요)

### 1. Firebase 관련 API

| API 이름 | API ID | 용도 | 상태 |
|---------|--------|------|------|
| Firebase Management API | `firebase.googleapis.com` | Firebase 프로젝트 관리 | ✅ 필수 |
| Firebase Hosting API | `firebasehosting.googleapis.com` | 정적 파일 호스팅 | ✅ 필수 |
| Firebase Authentication API | `identitytoolkit.googleapis.com` | 사용자 인증 | ✅ 필수 |
| Firebase Extensions API | `firebaseextensions.googleapis.com` | Firebase 확장 기능 | ✅ 필수 |

### 2. Cloud Functions 관련 API

| API 이름 | API ID | 용도 | 상태 |
|---------|--------|------|------|
| Cloud Functions API | `cloudfunctions.googleapis.com` | 서버리스 함수 실행 | ✅ 필수 |
| Cloud Build API | `cloudbuild.googleapis.com` | Functions 빌드 | ✅ 필수 |
| Cloud Run API | `run.googleapis.com` | Functions v2 런타임 | ✅ 필수 |
| Artifact Registry API | `artifactregistry.googleapis.com` | 컨테이너 이미지 저장 | ✅ 필수 |
| Eventarc API | `eventarc.googleapis.com` | 이벤트 기반 트리거 | ✅ 필수 |
| Cloud Scheduler API | `cloudscheduler.googleapis.com` | 스케줄 함수 (manageProposalTTL) | ✅ 필수 |
| Pub/Sub API | `pubsub.googleapis.com` | 메시지 큐 (스케줄 함수) | ✅ 필수 |

### 3. 데이터베이스 및 스토리지

| API 이름 | API ID | 용도 | 상태 |
|---------|--------|------|------|
| Cloud Firestore API | `firestore.googleapis.com` | NoSQL 데이터베이스 | ✅ 필수 |
| Cloud Storage API | `storage.googleapis.com` | 파일 저장소 (이미지 업로드) | ✅ 필수 |
| Cloud Storage JSON API | `storage-api.googleapis.com` | Storage API 호출 | ✅ 필수 |

### 4. AI 및 머신러닝

| API 이름 | API ID | 용도 | 상태 |
|---------|--------|------|------|
| Vertex AI API | `aiplatform.googleapis.com` | Gemini API 호출 (OCR, 시세 추정) | ✅ 필수 |

### 5. 보안 및 시크릿 관리

| API 이름 | API ID | 용도 | 상태 |
|---------|--------|------|------|
| Secret Manager API | `secretmanager.googleapis.com` | API 키 관리 (Gemini API 키) | ✅ 필수 |

### 6. 모니터링 및 로깅

| API 이름 | API ID | 용도 | 상태 |
|---------|--------|------|------|
| Cloud Logging API | `logging.googleapis.com` | 로그 수집 및 조회 | ✅ 필수 |
| Cloud Monitoring API | `monitoring.googleapis.com` | 메트릭 수집 | ✅ 필수 |

---

## 선택적 API (조건부 활성화)

| API 이름 | API ID | 용도 | 상태 |
|---------|--------|------|------|
| Cloud Resource Manager API | `cloudresourcemanager.googleapis.com` | 리소스 관리 | ⚠️ 권장 |
| Service Usage API | `serviceusage.googleapis.com` | API 활성화 관리 | ⚠️ 권장 |
| IAM API | `iam.googleapis.com` | 권한 관리 | ⚠️ 권장 |
| Cloud Billing API | `cloudbilling.googleapis.com` | 결제 정보 (선택) | ❌ 선택 |

---

## API 활성화 확인 방법

### 방법 1: GCP 콘솔에서 확인

1. GCP 콘솔 접속: https://console.cloud.google.com/apis/library?project=carivdealer
2. 각 API 검색하여 "활성화됨" 상태 확인

### 방법 2: gcloud CLI로 확인

```powershell
# 프로젝트 설정
gcloud config set project carivdealer

# 활성화된 API 목록 확인
gcloud services list --enabled

# 특정 API 활성화 상태 확인
gcloud services list --enabled --filter="name:cloudfunctions.googleapis.com"
```

### 방법 3: 일괄 활성화 (gcloud CLI)

```powershell
# 필수 API 일괄 활성화
$apis = @(
    "firebase.googleapis.com",
    "firebasehosting.googleapis.com",
    "identitytoolkit.googleapis.com",
    "firebaseextensions.googleapis.com",
    "cloudfunctions.googleapis.com",
    "cloudbuild.googleapis.com",
    "run.googleapis.com",
    "artifactregistry.googleapis.com",
    "eventarc.googleapis.com",
    "cloudscheduler.googleapis.com",
    "pubsub.googleapis.com",
    "firestore.googleapis.com",
    "storage.googleapis.com",
    "storage-api.googleapis.com",
    "aiplatform.googleapis.com",
    "secretmanager.googleapis.com",
    "logging.googleapis.com",
    "monitoring.googleapis.com"
)

foreach ($api in $apis) {
    Write-Host "활성화 중: $api"
    gcloud services enable $api --project=carivdealer
}
```

---

## 배포 시 자동 활성화되는 API

Firebase Functions 배포 시 다음 API들이 자동으로 활성화됩니다:

- ✅ `cloudfunctions.googleapis.com`
- ✅ `cloudbuild.googleapis.com`
- ✅ `artifactregistry.googleapis.com`
- ✅ `firebaseextensions.googleapis.com`
- ✅ `cloudscheduler.googleapis.com`
- ✅ `run.googleapis.com`
- ✅ `eventarc.googleapis.com`
- ✅ `pubsub.googleapis.com`
- ✅ `storage.googleapis.com`

**참고**: 배포 로그에서 "ensuring required API ... is enabled" 메시지가 보이면 자동 활성화 중입니다.

---

## API별 상세 설명

### Cloud Functions API (`cloudfunctions.googleapis.com`)
- **용도**: 서버리스 함수 실행 및 관리
- **필수 여부**: ✅ 필수
- **사용 위치**: 모든 Firebase Functions

### Cloud Build API (`cloudbuild.googleapis.com`)
- **용도**: Functions 코드 빌드
- **필수 여부**: ✅ 필수
- **사용 위치**: Functions 배포 시

### Cloud Run API (`run.googleapis.com`)
- **용도**: Functions v2 런타임 환경
- **필수 여부**: ✅ 필수
- **사용 위치**: 모든 Functions v2

### Artifact Registry API (`artifactregistry.googleapis.com`)
- **용도**: 컨테이너 이미지 저장소
- **필수 여부**: ✅ 필수
- **사용 위치**: Functions v2 배포 시

### Cloud Firestore API (`firestore.googleapis.com`)
- **용도**: NoSQL 데이터베이스
- **필수 여부**: ✅ 필수
- **사용 위치**: 모든 Functions에서 데이터 저장/조회

### Cloud Storage API (`storage.googleapis.com`)
- **용도**: 파일 저장소 (이미지 업로드)
- **필수 여부**: ✅ 필수
- **사용 위치**: `inspection/uploadResult.ts` (검차 이미지 업로드)

### Vertex AI API (`aiplatform.googleapis.com`)
- **용도**: Gemini API 호출 (OCR, 시세 추정)
- **필수 여부**: ✅ 필수
- **사용 위치**: 
  - `vehicle/ocrRegistration.ts` (등록원부 OCR)
  - 향후 시세 추정 기능

### Secret Manager API (`secretmanager.googleapis.com`)
- **용도**: API 키 등 시크릿 관리
- **필수 여부**: ✅ 필수
- **사용 위치**: `config/secrets.ts` (Gemini API 키 로드)

### Cloud Scheduler API (`cloudscheduler.googleapis.com`)
- **용도**: 스케줄 함수 실행
- **필수 여부**: ✅ 필수
- **사용 위치**: `trade/manageProposalTTL.ts` (제안 유효기간 관리)

### Pub/Sub API (`pubsub.googleapis.com`)
- **용도**: 스케줄 함수의 메시지 큐
- **필수 여부**: ✅ 필수
- **사용 위치**: `manageProposalTTL` 스케줄 함수

---

## API 활성화 상태 확인 스크립트

`scripts/check-gcp-apis.ps1` 파일을 생성하여 실행:

```powershell
cd C:\carivdealer\FOWARDMAX
.\scripts\check-gcp-apis.ps1
```

---

## 문제 해결

### API 활성화 실패 시

1. **권한 확인**: 프로젝트 소유자 또는 `roles/serviceusage.serviceUsageAdmin` 권한 필요
2. **결제 계정 확인**: 일부 API는 결제 계정이 활성화되어 있어야 함
3. **할당량 확인**: API 할당량이 초과되지 않았는지 확인

### 특정 API가 활성화되지 않는 경우

```powershell
# 수동 활성화
gcloud services enable API_ID --project=carivdealer

# 예시
gcloud services enable aiplatform.googleapis.com --project=carivdealer
```

---

## 예상 비용

대부분의 API는 **무료 티어**가 제공되지만, 사용량에 따라 과금될 수 있습니다:

- **Cloud Functions**: 월 200만 호출 무료
- **Cloud Firestore**: 월 1GB 저장, 5만 읽기/2만 쓰기 무료
- **Cloud Storage**: 월 5GB 저장, 5GB 다운로드 무료
- **Vertex AI**: 사용량 기반 과금 (Gemini API)
- **Cloud Build**: 월 120분 빌드 시간 무료

---

**총 필수 API 개수**: 18개  
**자동 활성화**: 배포 시 자동 활성화됨  
**수동 확인 필요**: GCP 콘솔에서 확인 권장

