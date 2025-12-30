# 기존 서비스 계정으로 Functions IAM 설정

**문제**: 새로 생성된 Functions에 기존 서비스 계정 invoker 권한이 자동 적용되지 않음

---

## 기존 서비스 계정 정보

프로젝트에 다음 서비스 계정이 이미 설정되어 있습니다:

### 1. Cloud Functions Executor
- **서비스 계정**: `cloud-functions-executor@carivdealer.iam.gserviceaccount.com`
- **역할**: `roles/cloudfunctions.invoker`
- **용도**: Cloud Functions 실행용

### 2. Cloud Runtime Unified (통합 런타임)
- **서비스 계정**: `cloud-runtime-unified@carivdealer.iam.gserviceaccount.com`
- **역할**: `roles/cloudfunctions.invoker` 포함
- **용도**: 모든 Cloud Functions/Run 통합 런타임

---

## 해결 방법: 기존 서비스 계정을 새 Functions에 적용

### 방법 1: gcloud CLI로 일괄 설정 (권장)

```powershell
# 프로젝트 설정
gcloud config set project carivdealer

# 기존 서비스 계정을 새 Functions에 invoker로 추가
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

$serviceAccount = "cloud-functions-executor@carivdealer.iam.gserviceaccount.com"
$region = "asia-northeast3"

foreach ($func in $functions) {
    Write-Host "Setting invoker for $func..."
    gcloud functions add-invoker-policy-binding $func `
        --region=$region `
        --member="serviceAccount:$serviceAccount" `
        --role="roles/cloudfunctions.invoker"
}
```

### 방법 2: GCP 콘솔에서 설정

1. GCP 콘솔 접속: https://console.cloud.google.com/functions/list?project=carivdealer&region=asia-northeast3

2. 각 Function 클릭 → **권한** 탭

3. **주 구성원 추가** 클릭

4. **새 주 구성원**: `cloud-functions-executor@carivdealer.iam.gserviceaccount.com` 입력

5. **역할**: `Cloud Functions Invoker` 선택

6. **저장**

**대상 Functions (9개)**:
- `acceptProposalAPI`
- `handoverApproveAPI`
- `inspectionAssignAPI`
- `inspectionGetResultAPI`
- `inspectionUploadResultAPI`
- `logisticsDispatchConfirmAPI`
- `logisticsDispatchRequestAPI`
- `logisticsScheduleAPI`
- `settlementNotifyAPI`

---

## 왜 자동 적용되지 않았나?

### 원인 분석

1. **Firebase Functions v2 동작 차이**
   - Functions v2는 새로 생성될 때 기본적으로 public invoker를 설정하지 않음
   - 기존 Functions는 업데이트 시 기존 IAM 설정을 유지하지만, 새 Functions는 빈 상태로 생성됨

2. **서비스 계정 vs Public Invoker**
   - 기존 Functions는 `cloud-functions-executor` 서비스 계정에 invoker 권한이 있음
   - 새 Functions는 아무 invoker도 설정되지 않은 상태

3. **배포 시 IAM 설정 실패**
   - 배포 로그에서 "Failed to set the IAM Policy" 에러 발생
   - Functions는 생성되었지만 IAM 설정만 실패한 상태

---

## 권장 해결 순서

### 1단계: 기존 서비스 계정 확인
```powershell
# 기존 Functions의 IAM 설정 확인
gcloud functions get-iam-policy ocrRegistrationAPI --region=asia-northeast3 --gen2
```

### 2단계: 새 Functions에 동일한 서비스 계정 적용
```powershell
# 위의 방법 1 스크립트 실행
```

### 3단계: Public Invoker 설정 (프로토타입용, 선택사항)
```powershell
# 프로토타입 단계에서는 public도 허용 가능
foreach ($func in $functions) {
    gcloud functions add-invoker-policy-binding $func `
        --region=asia-northeast3 `
        --member="allUsers" `
        --role="roles/cloudfunctions.invoker"
}
```

---

## 검증 방법

### 1. IAM 정책 확인
```powershell
# 각 Function의 IAM 정책 확인
gcloud functions get-iam-policy acceptProposalAPI --region=asia-northeast3 --gen2
```

**예상 결과**:
```
bindings:
- members:
  - serviceAccount:cloud-functions-executor@carivdealer.iam.gserviceaccount.com
  role: roles/cloudfunctions.invoker
```

### 2. API 호출 테스트
프론트엔드에서 API 호출 시:
- **200 OK 또는 CORS 에러**: IAM 설정 성공 (Function이 응답함)
- **403 Forbidden**: IAM 설정 필요
- **404 Not Found**: Function이 존재하지 않음

---

## 향후 방지 방법

### Functions 코드에서 명시적으로 설정 (선택사항)

`functions/src/index.ts`에서 각 Function에 `invoker` 옵션 추가:

```typescript
export const acceptProposalAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
  invoker: 'public', // 또는 특정 서비스 계정
}, acceptProposal);
```

**참고**: Firebase Functions v2에서는 `invoker` 옵션이 아직 공식적으로 지원되지 않을 수 있습니다. IAM 정책으로 관리하는 것이 권장됩니다.

---

## 빠른 실행 스크립트

`scripts/fix-functions-iam-service-account.ps1` 파일을 생성하여 실행:

```powershell
cd C:\carivdealer\FOWARDMAX
.\scripts\fix-functions-iam-service-account.ps1
```

