# GCP 서비스 계정 생성 가이드

**프로젝트 ID**: `carivdealer`  
**프로젝트 네이밍**: `carivdealer`  
**작성일**: 2025-12-28

---

## 서비스 계정 네이밍 원칙

### 형식
```
{service}-{role}@{project}.iam.gserviceaccount.com
```

### 규칙
1. **소문자만 사용**: 대문자 사용 금지
2. **하이픈(`-`) 사용**: 단어 구분은 하이픈으로 통일
3. **최대 30자 이내**: GCP 서비스 계정 ID 제한 준수
4. **역할 명시**: 역할을 명확히 구분
   - `admin`: 전체 관리 권한
   - `executor`: 실행 권한 (Cloud Functions, Cloud Run)
   - `accessor`: 읽기/접근 권한
   - `user`: 사용 권한
   - `writer`: 쓰기 권한
   - `deploy`: 배포 권한

### 예시
- ✅ `firebase-hosting-deploy@carivdealer.iam.gserviceaccount.com`
- ✅ `cloud-functions-executor@carivdealer.iam.gserviceaccount.com`
- ❌ `Firebase_Hosting_Deploy@carivdealer.iam.gserviceaccount.com` (대문자, 언더스코어 사용)

---

## Phase 1 MVP 필수 서비스 계정 목록

| # | 서비스 계정 ID | 표시명 | 용도 | IAM 역할 |
|---|---|---|---|---|
| 1 | `firebase-hosting-deploy` | Firebase Hosting Deploy | 정적 파일 배포 | `roles/firebasehosting.admin` |
| 2 | `cloud-functions-executor` | Cloud Functions Executor | 서버리스 함수 실행 | `roles/cloudfunctions.invoker` |
| 3 | `cloud-run-executor` | Cloud Run Executor | 컨테이너 실행 | `roles/run.invoker` |
| 4 | `firestore-admin` | Firestore Admin | 데이터베이스 관리 | `roles/datastore.user` |
| 5 | `storage-admin` | Storage Admin | 파일 저장소 관리 | `roles/storage.admin` |
| 6 | `secret-manager-accessor` | Secret Manager Accessor | 시크릿 읽기 | `roles/secretmanager.secretAccessor` |
| 7 | `gemini-api-user` | Gemini API User | Gemini API 호출 | `roles/aiplatform.user` |
| 8 | `cloud-build-executor` | Cloud Build Executor | 빌드 및 배포 | `roles/cloudbuild.builds.builder` |
| 9 | `logging-writer` | Logging Writer | 로그 쓰기 | `roles/logging.logWriter` |
| 10 | `monitoring-writer` | Monitoring Writer | 메트릭 쓰기 | `roles/monitoring.metricWriter` |

**총 10개 서비스 계정** (모두 필수)

---

## 일괄 생성 방법

### 방법 1: 스크립트 실행 (권장)

```bash
# 스크립트 실행 권한 부여
chmod +x create_service_accounts.sh

# 스크립트 실행
./create_service_accounts.sh
```

### 방법 2: GCP 콘솔에서 수동 생성

1. GCP 콘솔 접속: https://console.cloud.google.com
2. 프로젝트 선택: `carivdealer`
3. 네비게이션 메뉴 → **IAM 및 관리자** → **서비스 계정**
4. **서비스 계정 만들기** 클릭
5. 위 표의 정보를 입력하여 각 서비스 계정 생성
6. 각 서비스 계정에 해당 IAM 역할 부여

---

## 개별 생성 명령어 예시

### Firebase Hosting Deploy

```bash
# 서비스 계정 생성
gcloud iam service-accounts create firebase-hosting-deploy \
  --description="Firebase Hosting 배포용 서비스 계정" \
  --display-name="Firebase Hosting Deploy" \
  --project=carivdealer

# IAM 역할 부여
gcloud projects add-iam-policy-binding carivdealer \
  --member="serviceAccount:firebase-hosting-deploy@carivdealer.iam.gserviceaccount.com" \
  --role="roles/firebasehosting.admin"
```

### Cloud Functions Executor

```bash
# 서비스 계정 생성
gcloud iam service-accounts create cloud-functions-executor \
  --description="Cloud Functions 실행용 서비스 계정" \
  --display-name="Cloud Functions Executor" \
  --project=carivdealer

# IAM 역할 부여
gcloud projects add-iam-policy-binding carivdealer \
  --member="serviceAccount:cloud-functions-executor@carivdealer.iam.gserviceaccount.com" \
  --role="roles/cloudfunctions.invoker"
```

---

## 생성 확인 명령어

### 전체 서비스 계정 목록 확인

```bash
# 프로젝트 설정
gcloud config set project carivdealer

# 생성된 서비스 계정 목록 확인
gcloud iam service-accounts list --project=carivdealer

# 필수 서비스 계정만 필터링
gcloud iam service-accounts list --project=carivdealer \
  --filter="email:firebase-hosting-deploy@ OR email:cloud-functions-executor@ OR email:cloud-run-executor@ OR email:firestore-admin@ OR email:storage-admin@ OR email:secret-manager-accessor@ OR email:gemini-api-user@ OR email:cloud-build-executor@ OR email:logging-writer@ OR email:monitoring-writer@"
```

### 특정 서비스 계정 상세 정보 확인

```bash
# 서비스 계정 상세 정보
gcloud iam service-accounts describe firebase-hosting-deploy@carivdealer.iam.gserviceaccount.com \
  --project=carivdealer

# 서비스 계정의 IAM 역할 확인
gcloud projects get-iam-policy carivdealer \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:firebase-hosting-deploy@carivdealer.iam.gserviceaccount.com" \
  --format="table(bindings.role)"
```

---

## 서비스 계정 키 생성 (필요시)

> ⚠️ **주의**: 서비스 계정 키는 보안상 위험할 수 있으므로, 가능한 한 **Workload Identity**나 **Application Default Credentials**를 사용하는 것을 권장합니다.

### 키 생성

```bash
# 키 저장 디렉토리 생성
mkdir -p ~/keys/carivdealer

# 특정 서비스 계정 키 생성 예시
gcloud iam service-accounts keys create ~/keys/carivdealer/firebase-hosting-deploy-key.json \
  --iam-account=firebase-hosting-deploy@carivdealer.iam.gserviceaccount.com \
  --project=carivdealer

# 키 파일 권한 설정 (보안)
chmod 600 ~/keys/carivdealer/*.json
```

### 키 사용 (애플리케이션에서)

```bash
# 환경 변수로 설정
export GOOGLE_APPLICATION_CREDENTIALS="~/keys/carivdealer/firebase-hosting-deploy-key.json"
```

---

## IAM 역할 상세 설명

| 역할 | 권한 범위 | 사용 서비스 계정 |
|---|---|---|
| `roles/firebasehosting.admin` | Firebase Hosting 전체 관리 | `firebase-hosting-deploy` |
| `roles/cloudfunctions.invoker` | Cloud Functions 호출 | `cloud-functions-executor` |
| `roles/run.invoker` | Cloud Run 서비스 호출 | `cloud-run-executor` |
| `roles/datastore.user` | Firestore 읽기/쓰기 | `firestore-admin` |
| `roles/storage.admin` | Cloud Storage 전체 관리 | `storage-admin` |
| `roles/secretmanager.secretAccessor` | Secret Manager 시크릿 읽기 | `secret-manager-accessor` |
| `roles/aiplatform.user` | Vertex AI/Gemini API 사용 | `gemini-api-user` |
| `roles/cloudbuild.builds.builder` | Cloud Build 빌드 실행 | `cloud-build-executor` |
| `roles/logging.logWriter` | Cloud Logging 로그 쓰기 | `logging-writer` |
| `roles/monitoring.metricWriter` | Cloud Monitoring 메트릭 쓰기 | `monitoring-writer` |

> 참조: [GCP IAM 역할 문서](https://cloud.google.com/iam/docs/understanding-roles)

---

## 문제 해결

### 서비스 계정이 이미 존재하는 경우

스크립트는 이미 존재하는 서비스 계정에 대해 오류를 무시하고 계속 진행합니다. 필요시 수동으로 확인:

```bash
# 서비스 계정 존재 여부 확인
gcloud iam service-accounts describe firebase-hosting-deploy@carivdealer.iam.gserviceaccount.com \
  --project=carivdealer
```

### IAM 역할이 이미 부여된 경우

역복이 이미 부여되어 있어도 스크립트는 계속 진행합니다. 확인:

```bash
# 특정 서비스 계정의 역할 확인
gcloud projects get-iam-policy carivdealer \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:firebase-hosting-deploy@carivdealer.iam.gserviceaccount.com"
```

### 권한 오류 발생 시

```bash
# 현재 사용자의 권한 확인
gcloud projects get-iam-policy carivdealer \
  --flatten="bindings[].members" \
  --filter="bindings.members:user:$(gcloud config get-value account)"

# 필요한 권한: roles/iam.serviceAccountAdmin, roles/resourcemanager.projectIamAdmin
```

---

## 다음 단계

1. ✅ 서비스 계정 생성 완료
2. 다음: 각 서비스 계정을 Cloud Functions, Cloud Run 등에 할당
3. 다음: Secret Manager에 API 키 저장 및 접근 권한 설정
4. 다음: Firebase 프로젝트 초기화 및 설정

---

**작성일**: 2025-12-28  
**참조 문서**: PRD_Phase1_2025-12-31.md Section 13.1.2

