#!/bin/bash
# GCP 서비스 계정 일괄 생성 스크립트
# 프로젝트: carivdealer
# 작성일: 2025-12-28

set -e  # 오류 발생 시 스크립트 중단

PROJECT_ID="carivdealer"
PROJECT_NUMBER=$(gcloud projects describe ${PROJECT_ID} --format="value(projectNumber)" 2>/dev/null || echo "")

if [ -z "$PROJECT_NUMBER" ]; then
  echo "오류: 프로젝트 ${PROJECT_ID}를 찾을 수 없습니다."
  exit 1
fi

echo "=========================================="
echo "GCP 서비스 계정 일괄 생성 스크립트"
echo "프로젝트: ${PROJECT_ID}"
echo "프로젝트 번호: ${PROJECT_NUMBER}"
echo "=========================================="
echo ""

# 프로젝트 설정 확인
gcloud config set project ${PROJECT_ID}

# 1. Firebase Hosting Deploy
echo "[1/10] Firebase Hosting Deploy 서비스 계정 생성 중..."
gcloud iam service-accounts create firebase-hosting-deploy \
  --description="Firebase Hosting 배포용 서비스 계정" \
  --display-name="Firebase Hosting Deploy" \
  --project=${PROJECT_ID} 2>/dev/null || echo "  이미 존재하는 서비스 계정입니다."

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:firebase-hosting-deploy@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/firebasehosting.admin" \
  --condition=None 2>/dev/null || echo "  역할이 이미 부여되어 있습니다."

# 2. Cloud Functions Executor
echo "[2/10] Cloud Functions Executor 서비스 계정 생성 중..."
gcloud iam service-accounts create cloud-functions-executor \
  --description="Cloud Functions 실행용 서비스 계정" \
  --display-name="Cloud Functions Executor" \
  --project=${PROJECT_ID} 2>/dev/null || echo "  이미 존재하는 서비스 계정입니다."

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:cloud-functions-executor@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/cloudfunctions.invoker" \
  --condition=None 2>/dev/null || echo "  역할이 이미 부여되어 있습니다."

# 3. Cloud Run Executor
echo "[3/10] Cloud Run Executor 서비스 계정 생성 중..."
gcloud iam service-accounts create cloud-run-executor \
  --description="Cloud Run 실행용 서비스 계정" \
  --display-name="Cloud Run Executor" \
  --project=${PROJECT_ID} 2>/dev/null || echo "  이미 존재하는 서비스 계정입니다."

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:cloud-run-executor@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/run.invoker" \
  --condition=None 2>/dev/null || echo "  역할이 이미 부여되어 있습니다."

# 4. Firestore Admin
echo "[4/10] Firestore Admin 서비스 계정 생성 중..."
gcloud iam service-accounts create firestore-admin \
  --description="Firestore 데이터베이스 관리용 서비스 계정" \
  --display-name="Firestore Admin" \
  --project=${PROJECT_ID} 2>/dev/null || echo "  이미 존재하는 서비스 계정입니다."

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:firestore-admin@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/datastore.user" \
  --condition=None 2>/dev/null || echo "  역할이 이미 부여되어 있습니다."

# 5. Storage Admin
echo "[5/10] Storage Admin 서비스 계정 생성 중..."
gcloud iam service-accounts create storage-admin \
  --description="Cloud Storage 관리용 서비스 계정" \
  --display-name="Storage Admin" \
  --project=${PROJECT_ID} 2>/dev/null || echo "  이미 존재하는 서비스 계정입니다."

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:storage-admin@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/storage.admin" \
  --condition=None 2>/dev/null || echo "  역할이 이미 부여되어 있습니다."

# 6. Secret Manager Accessor
echo "[6/10] Secret Manager Accessor 서비스 계정 생성 중..."
gcloud iam service-accounts create secret-manager-accessor \
  --description="Secret Manager 시크릿 접근용 서비스 계정" \
  --display-name="Secret Manager Accessor" \
  --project=${PROJECT_ID} 2>/dev/null || echo "  이미 존재하는 서비스 계정입니다."

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:secret-manager-accessor@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor" \
  --condition=None 2>/dev/null || echo "  역할이 이미 부여되어 있습니다."

# 7. Gemini API User
echo "[7/10] Gemini API User 서비스 계정 생성 중..."
gcloud iam service-accounts create gemini-api-user \
  --description="Gemini API 호출용 서비스 계정" \
  --display-name="Gemini API User" \
  --project=${PROJECT_ID} 2>/dev/null || echo "  이미 존재하는 서비스 계정입니다."

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:gemini-api-user@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/aiplatform.user" \
  --condition=None 2>/dev/null || echo "  역할이 이미 부여되어 있습니다."

# 8. Cloud Build Executor
echo "[8/10] Cloud Build Executor 서비스 계정 생성 중..."
gcloud iam service-accounts create cloud-build-executor \
  --description="Cloud Build 빌드 및 배포용 서비스 계정" \
  --display-name="Cloud Build Executor" \
  --project=${PROJECT_ID} 2>/dev/null || echo "  이미 존재하는 서비스 계정입니다."

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:cloud-build-executor@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/cloudbuild.builds.builder" \
  --condition=None 2>/dev/null || echo "  역할이 이미 부여되어 있습니다."

# 9. Logging Writer
echo "[9/10] Logging Writer 서비스 계정 생성 중..."
gcloud iam service-accounts create logging-writer \
  --description="Cloud Logging 로그 쓰기용 서비스 계정" \
  --display-name="Logging Writer" \
  --project=${PROJECT_ID} 2>/dev/null || echo "  이미 존재하는 서비스 계정입니다."

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:logging-writer@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/logging.logWriter" \
  --condition=None 2>/dev/null || echo "  역할이 이미 부여되어 있습니다."

# 10. Monitoring Writer
echo "[10/10] Monitoring Writer 서비스 계정 생성 중..."
gcloud iam service-accounts create monitoring-writer \
  --description="Cloud Monitoring 메트릭 쓰기용 서비스 계정" \
  --display-name="Monitoring Writer" \
  --project=${PROJECT_ID} 2>/dev/null || echo "  이미 존재하는 서비스 계정입니다."

gcloud projects add-iam-policy-binding ${PROJECT_ID} \
  --member="serviceAccount:monitoring-writer@${PROJECT_ID}.iam.gserviceaccount.com" \
  --role="roles/monitoring.metricWriter" \
  --condition=None 2>/dev/null || echo "  역할이 이미 부여되어 있습니다."

echo ""
echo "=========================================="
echo "서비스 계정 생성 완료!"
echo "=========================================="
echo ""
echo "생성된 서비스 계정 목록:"
gcloud iam service-accounts list --project=${PROJECT_ID} \
  --filter="email:firebase-hosting-deploy@ OR email:cloud-functions-executor@ OR email:cloud-run-executor@ OR email:firestore-admin@ OR email:storage-admin@ OR email:secret-manager-accessor@ OR email:gemini-api-user@ OR email:cloud-build-executor@ OR email:logging-writer@ OR email:monitoring-writer@" \
  --format="table(email,displayName)"

echo ""
echo "다음 명령어로 상세 정보를 확인할 수 있습니다:"
echo "  gcloud iam service-accounts list --project=${PROJECT_ID}"
echo "  gcloud iam service-accounts describe <SERVICE_ACCOUNT_EMAIL> --project=${PROJECT_ID}"

