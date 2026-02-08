# GCP 콘솔에서 Functions IAM 설정 가이드

**문제**: Functions 배포 시 IAM Policy 설정 실패  
**영향받는 Functions**: 9개 (새로 생성된 Functions)

---

## 문제 요약

다음 Functions들이 생성되었지만 IAM invoker 권한 설정에 실패했습니다:

1. `acceptProposalAPI`
2. `handoverApproveAPI`
3. `inspectionAssignAPI`
4. `inspectionGetResultAPI`
5. `inspectionUploadResultAPI`
6. `logisticsDispatchConfirmAPI`
7. `logisticsDispatchRequestAPI`
8. `logisticsScheduleAPI`
9. `settlementNotifyAPI`

---

## 해결 방법 1: GCP 콘솔에서 직접 설정 (권장)

### 단계별 가이드

#### 1. Cloud Functions 콘솔 접속
1. GCP 콘솔 접속: https://console.cloud.google.com
2. 프로젝트 선택: `carivdealer`
3. 메뉴 → **Cloud Functions** 클릭
4. 리전 선택: **asia-northeast3**

#### 2. 각 Function에 대해 IAM 설정

각 Function을 클릭하여 상세 페이지로 이동:

**Function 1: acceptProposalAPI**
1. `acceptProposalAPI` 클릭
2. 상단 탭에서 **"권한"** 또는 **"PERMISSIONS"** 클릭
3. **"주 구성원 추가"** 또는 **"ADD PRINCIPAL"** 클릭
4. **새 주 구성원**: `allUsers` 입력
5. **역할**: `Cloud Functions 호출자` 또는 `Cloud Functions Invoker` 선택
6. **저장** 클릭

**나머지 8개 Function에 대해 동일한 과정 반복:**
- `handoverApproveAPI`
- `inspectionAssignAPI`
- `inspectionGetResultAPI`
- `inspectionUploadResultAPI`
- `logisticsDispatchConfirmAPI`
- `logisticsDispatchRequestAPI`
- `logisticsScheduleAPI`
- `settlementNotifyAPI`

---

## 해결 방법 2: gcloud CLI 사용 (빠른 방법)

### 필수 권한 확인
```bash
# 현재 사용자 권한 확인
gcloud projects get-iam-policy carivdealer --flatten="bindings[].members" --filter="bindings.members:user:$(gcloud config get-value account)"
```

### Functions에 public invoker 권한 부여

```bash
# 프로젝트 설정
gcloud config set project carivdealer

# 각 Function에 public invoker 권한 부여
gcloud functions add-invoker-policy-binding acceptProposalAPI \
  --region=asia-northeast3 \
  --member="allUsers" \
  --role="roles/cloudfunctions.invoker"

gcloud functions add-invoker-policy-binding handoverApproveAPI \
  --region=asia-northeast3 \
  --member="allUsers" \
  --role="roles/cloudfunctions.invoker"

gcloud functions add-invoker-policy-binding inspectionAssignAPI \
  --region=asia-northeast3 \
  --member="allUsers" \
  --role="roles/cloudfunctions.invoker"

gcloud functions add-invoker-policy-binding inspectionGetResultAPI \
  --region=asia-northeast3 \
  --member="allUsers" \
  --role="roles/cloudfunctions.invoker"

gcloud functions add-invoker-policy-binding inspectionUploadResultAPI \
  --region=asia-northeast3 \
  --member="allUsers" \
  --role="roles/cloudfunctions.invoker"

gcloud functions add-invoker-policy-binding logisticsDispatchConfirmAPI \
  --region=asia-northeast3 \
  --member="allUsers" \
  --role="roles/cloudfunctions.invoker"

gcloud functions add-invoker-policy-binding logisticsDispatchRequestAPI \
  --region=asia-northeast3 \
  --member="allUsers" \
  --role="roles/cloudfunctions.invoker"

gcloud functions add-invoker-policy-binding logisticsScheduleAPI \
  --region=asia-northeast3 \
  --member="allUsers" \
  --role="roles/cloudfunctions.invoker"

gcloud functions add-invoker-policy-binding settlementNotifyAPI \
  --region=asia-northeast3 \
  --member="allUsers" \
  --role="roles/cloudfunctions.invoker"
```

### 일괄 실행 스크립트 (PowerShell)

```powershell
# PowerShell 스크립트
$functions = @(
    "acceptProposalAPI",
    "handoverApproveAPI",
    "inspectionAssignAPI",
    "inspectionGetResultAPI",
    "inspectionUploadResultAPI",
    "logisticsDispatchConfirmAPI",
    "logisticsDispatchRequestAPI",
    "logisticsScheduleAPI",
    "settlementNotifyAPI"
)

$region = "asia-northeast3"
$project = "carivdealer"

gcloud config set project $project

foreach ($func in $functions) {
    Write-Host "Setting IAM policy for $func..."
    gcloud functions add-invoker-policy-binding $func `
        --region=$region `
        --member="allUsers" `
        --role="roles/cloudfunctions.invoker"
    Write-Host "Done: $func" -ForegroundColor Green
}
```

---

## 해결 방법 3: IAM 역할 확인 및 부여

### 현재 사용자에게 필요한 권한

Functions IAM 정책을 설정하려면 다음 역할 중 하나가 필요합니다:

- `roles/functions.admin` (권장)
- `roles/iam.securityAdmin`
- `roles/owner`

### 권한 부여 (프로젝트 소유자 또는 관리자가 실행)

```bash
# 현재 사용자에게 Functions Admin 역할 부여
gcloud projects add-iam-policy-binding carivdealer \
  --member="user:$(gcloud config get-value account)" \
  --role="roles/functions.admin"
```

---

## 해결 방법 4: Terraform/Infrastructure as Code (선택사항)

### functions-iam.tf 파일 생성

```hcl
resource "google_cloudfunctions_function_iam_member" "public_invoker" {
  for_each = toset([
    "acceptProposalAPI",
    "handoverApproveAPI",
    "inspectionAssignAPI",
    "inspectionGetResultAPI",
    "inspectionUploadResultAPI",
    "logisticsDispatchConfirmAPI",
    "logisticsDispatchRequestAPI",
    "logisticsScheduleAPI",
    "settlementNotifyAPI"
  ])

  project        = "carivdealer"
  region         = "asia-northeast3"
  cloud_function = each.value
  role           = "roles/cloudfunctions.invoker"
  member         = "allUsers"
}
```

---

## 검증 방법

### 1. GCP 콘솔에서 확인
1. Cloud Functions 목록에서 각 Function 클릭
2. **권한** 탭에서 `allUsers`가 `Cloud Functions Invoker` 역할로 표시되는지 확인

### 2. curl로 테스트 (CORS 에러가 나면 정상)

```bash
# 각 Function URL로 테스트
curl -X POST https://asia-northeast3-carivdealer.cloudfunctions.net/acceptProposalAPI \
  -H "Content-Type: application/json" \
  -d '{"test": "data"}'

# CORS 에러가 나면 IAM 설정은 성공 (Function이 응답함)
# 403 Forbidden이 나면 IAM 설정 실패
```

### 3. 브라우저에서 확인
프론트엔드에서 API 호출 시:
- **CORS 에러**: IAM 설정 성공 (Function이 응답함)
- **403 Forbidden**: IAM 설정 필요
- **404 Not Found**: Function이 존재하지 않음

---

## 주의사항

### 보안 고려사항

1. **프로토타입 단계**: `allUsers` 사용 가능 (현재 상황)
2. **프로덕션 단계**: 
   - `allAuthenticatedUsers` 사용 권장 (인증된 사용자만)
   - 또는 특정 서비스 계정에만 권한 부여

### 프로덕션용 IAM 설정 (향후)

```bash
# 인증된 사용자만 허용
gcloud functions add-invoker-policy-binding FUNCTION_NAME \
  --region=asia-northeast3 \
  --member="allAuthenticatedUsers" \
  --role="roles/cloudfunctions.invoker"

# 또는 특정 서비스 계정만 허용
gcloud functions add-invoker-policy-binding FUNCTION_NAME \
  --region=asia-northeast3 \
  --member="serviceAccount:YOUR_SERVICE_ACCOUNT@carivdealer.iam.gserviceaccount.com" \
  --role="roles/cloudfunctions.invoker"
```

---

## 빠른 해결 체크리스트

- [ ] GCP 콘솔 접속: https://console.cloud.google.com
- [ ] 프로젝트 선택: `carivdealer`
- [ ] Cloud Functions 메뉴 접속
- [ ] 리전 선택: `asia-northeast3`
- [ ] 각 Function 클릭 → 권한 탭
- [ ] `allUsers` 추가 → `Cloud Functions Invoker` 역할 부여
- [ ] 9개 Function 모두 설정 완료 확인

---

## 참고 링크

- Cloud Functions IAM 문서: https://cloud.google.com/functions/docs/securing/managing-access
- gcloud Functions 명령어: https://cloud.google.com/sdk/gcloud/reference/functions

---

**권장 방법**: GCP 콘솔에서 직접 설정 (방법 1)이 가장 직관적이고 안전합니다.

