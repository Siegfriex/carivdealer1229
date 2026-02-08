# GCP API 활성화 확인 결과

**확인 일시**: 2025-01-XX  
**프로젝트**: carivdealer

---

## ✅ 필수 API 활성화 상태 (18개)

### Firebase 관련 (4개)
- ✅ `firebase.googleapis.com` - Firebase Management API
- ✅ `firebasehosting.googleapis.com` - Firebase Hosting API
- ✅ `identitytoolkit.googleapis.com` - Firebase Authentication API
- ✅ `firebaseextensions.googleapis.com` - Firebase Extensions API

### Cloud Functions 관련 (7개)
- ✅ `cloudfunctions.googleapis.com` - Cloud Functions API
- ✅ `cloudbuild.googleapis.com` - Cloud Build API
- ✅ `run.googleapis.com` - Cloud Run Admin API
- ✅ `artifactregistry.googleapis.com` - Artifact Registry API
- ✅ `eventarc.googleapis.com` - Eventarc API
- ✅ `cloudscheduler.googleapis.com` - Cloud Scheduler API
- ✅ `pubsub.googleapis.com` - Cloud Pub/Sub API

### 데이터베이스 및 스토리지 (3개)
- ✅ `firestore.googleapis.com` - Cloud Firestore API
- ✅ `storage.googleapis.com` - Cloud Storage API
- ✅ `storage-api.googleapis.com` - Google Cloud Storage JSON API

### AI 및 보안 (2개)
- ✅ `aiplatform.googleapis.com` - Vertex AI API (Gemini)
- ✅ `secretmanager.googleapis.com` - Secret Manager API

### 모니터링 (2개)
- ✅ `logging.googleapis.com` - Cloud Logging API
- ✅ `monitoring.googleapis.com` - Cloud Monitoring API

**결론**: ✅ **모든 필수 API가 활성화되어 있습니다!**

---

## 📋 추가로 활성화된 API (선택/자동 활성화)

다음 API들은 필수는 아니지만, 자동으로 활성화되었거나 향후 사용 가능한 API입니다:

### Firebase 관련 추가 API
- ✅ `firebaserules.googleapis.com` - Firebase Rules API (Firestore Rules 관리)
- ✅ `firebasestorage.googleapis.com` - Cloud Storage for Firebase API
- ✅ `firebaseinstallations.googleapis.com` - Firebase Installations API
- ✅ `fcm.googleapis.com` - Firebase Cloud Messaging API (푸시 알림, 향후 사용 가능)
- ✅ `securetoken.googleapis.com` - Token Service API (Firebase Auth)

### 인프라 관리 API
- ✅ `cloudresourcemanager.googleapis.com` - Cloud Resource Manager API (리소스 관리)
- ✅ `iam.googleapis.com` - Identity and Access Management API (권한 관리)
- ✅ `iamcredentials.googleapis.com` - IAM Service Account Credentials API
- ✅ `serviceusage.googleapis.com` - Service Usage API (API 활성화 관리)
- ✅ `servicemanagement.googleapis.com` - Service Management API

### 모니터링 및 추적
- ✅ `cloudtrace.googleapis.com` - Cloud Trace API (분산 추적)

### 스토리지 관련
- ✅ `storage-component.googleapis.com` - Cloud Storage (Storage 컴포넌트)

### 데이터베이스 관련
- ✅ `datastore.googleapis.com` - Cloud Datastore API (레거시, Firestore와 관련)

### AI 관련 추가
- ✅ `generativelanguage.googleapis.com` - Generative Language API
  - **참고**: `aiplatform.googleapis.com`과 함께 Gemini API를 사용하는 데 필요할 수 있음
  - 두 API 모두 활성화되어 있으므로 문제없음

### 기타 (현재 사용하지 않음)
- `bigquery.googleapis.com` - BigQuery API (데이터 분석, 현재 미사용)
- `compute.googleapis.com` - Compute Engine API (VM 인스턴스, 현재 미사용)
- `containerregistry.googleapis.com` - Container Registry API (레거시, Artifact Registry 사용 중)
- `appengine.googleapis.com` - App Engine Admin API (현재 미사용)
- 기타 여러 API들 (현재 프로젝트에서 사용하지 않음)

---

## 🎯 결론

### ✅ 필수 API 상태
**18개 필수 API 모두 활성화 완료** ✅

### 📊 전체 상태
- **필수 API**: 18/18 활성화 ✅
- **추가 활성화된 API**: 약 20개 이상 (자동 활성화 또는 선택적)
- **현재 미사용 API**: 다수 (BigQuery, Compute Engine 등)

---

## 💡 권장 사항

### 1. 현재 상태
✅ **모든 필수 API가 활성화되어 있어 문제없습니다.**

### 2. 추가 확인 사항
- `generativelanguage.googleapis.com`이 활성화되어 있는데, 이는 Gemini API의 다른 엔드포인트일 수 있습니다.
- `aiplatform.googleapis.com`과 함께 사용되므로 두 API 모두 활성화되어 있는 것이 정상입니다.

### 3. 비용 고려
- 활성화만 되어 있고 실제로 사용하지 않는 API는 비용이 발생하지 않습니다.
- 사용량이 있는 API만 과금됩니다.

---

## 🔍 특이사항

### `generativelanguage.googleapis.com` vs `aiplatform.googleapis.com`
- **`aiplatform.googleapis.com`**: Vertex AI API (Gemini 3.0 Pro Preview 등)
- **`generativelanguage.googleapis.com`**: Generative Language API (Gemini API의 다른 엔드포인트)
- **현재 프로젝트**: `@google/genai` 패키지를 사용하므로 `aiplatform.googleapis.com`이 주로 사용됨
- **두 API 모두 활성화**: 문제없음 (호환성을 위해)

---

## ✅ 최종 확인

**현재 프로젝트에서 필요한 모든 API가 활성화되어 있습니다!**

다음 단계:
1. ✅ API 활성화 완료
2. ⏳ IAM 설정 완료 (GCP 콘솔에서 수동 설정 필요)
3. ⏳ Hosting 배포 (프론트엔드 변경사항 반영)

