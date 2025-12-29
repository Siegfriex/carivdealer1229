#!/bin/bash
# Firebase Functions v2 빌드 서비스 계정 권한 부여 스크립트
# 프로젝트: carivdealer
# 프로젝트 번호: 850300267700

PROJECT_ID="carivdealer"
PROJECT_NUMBER="850300267700"
BUILD_SERVICE_ACCOUNT="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

echo "=========================================="
echo "Firebase Functions 빌드 서비스 계정 권한 부여"
echo "프로젝트: $PROJECT_ID"
echo "프로젝트 번호: $PROJECT_NUMBER"
echo "빌드 서비스 계정: $BUILD_SERVICE_ACCOUNT"
echo "=========================================="
echo ""

# 1. Storage Object Viewer 권한 부여 (Cloud Build가 소스 코드 저장/읽기 위해 필요)
echo "[1/5] Storage Object Viewer 권한 부여 중..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$BUILD_SERVICE_ACCOUNT" \
  --role="roles/storage.objectViewer"

if [ $? -eq 0 ]; then
    echo "✅ Storage Object Viewer 권한 부여 완료"
else
    echo "❌ Storage Object Viewer 권한 부여 실패"
fi

# 2. Storage Object Creator 권한 부여 (빌드 아티팩트 저장을 위해 필요)
echo "[2/5] Storage Object Creator 권한 부여 중..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$BUILD_SERVICE_ACCOUNT" \
  --role="roles/storage.objectCreator"

if [ $? -eq 0 ]; then
    echo "✅ Storage Object Creator 권한 부여 완료"
else
    echo "❌ Storage Object Creator 권한 부여 실패"
fi

# 3. Storage Admin 권한 부여 (모든 Storage 작업 - 권장)
echo "[3/5] Storage Admin 권한 부여 중..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$BUILD_SERVICE_ACCOUNT" \
  --role="roles/storage.admin"

if [ $? -eq 0 ]; then
    echo "✅ Storage Admin 권한 부여 완료"
else
    echo "❌ Storage Admin 권한 부여 실패"
fi

# 4. Cloud Build Service Account 권한 부여 (빌드 실행)
echo "[4/5] Cloud Build Service Account 권한 부여 중..."
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:$BUILD_SERVICE_ACCOUNT" \
  --role="roles/cloudbuild.builds.builder"

if [ $? -eq 0 ]; then
    echo "✅ Cloud Build Service Account 권한 부여 완료"
else
    echo "❌ Cloud Build Service Account 권한 부여 실패"
fi

# 5. Cloud Build Service Account 권한 확인
echo "[5/5] Cloud Build Service Account 권한 확인 중..."
gcloud projects get-iam-policy $PROJECT_ID \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:$BUILD_SERVICE_ACCOUNT" \
  --format="table(bindings.role)"

echo ""
echo "=========================================="
echo "권한 부여 완료!"
echo "이제 'firebase deploy --only functions' 명령어를 다시 실행하세요."
echo "=========================================="

