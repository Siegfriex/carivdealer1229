# GCP Secret Manager 완전체 설정 프롬프트

**프로젝트**: `carivdealer`  
**한국교통안전공단 공공데이터 API Key**: `c06db8fb06b9eb310bd1060d450d7d2a2581f406ec46dbf1eae9a803bffbb738`

---

## 🎯 목표

Firebase Functions에서 사용할 한국교통안전공단 공공데이터 API 키를 GCP Secret Manager에 안전하게 저장하고, 서비스 계정에 접근 권한을 부여합니다.

---

## 📋 사전 준비사항

- [ ] GCP 프로젝트 `carivdealer`에 접근 권한이 있음
- [ ] `gcloud` CLI가 설치되어 있고 인증되어 있음
- [ ] 또는 GCP Console에 접근 가능

---

## 방법 1: GCP Console 사용 (GUI)

### 단계 1: Secret Manager 페이지 접속

```
https://console.cloud.google.com/security/secret-manager?project=carivdealer
```

### 단계 2: 시크릿 생성

1. **"시크릿 만들기"** 버튼 클릭

2. **시크릿 정보 입력**:
   - **이름**: `kotsa-public-data-api-key`
   - **시크릿 값**: `c06db8fb06b9eb310bd1060d450d7d2a2581f406ec46dbf1eae9a803bffbb738`
   - **복제 정책**: `자동` 선택

3. **"만들기"** 클릭

### 단계 3: 서비스 계정 권한 설정

1. **IAM 및 관리자 페이지 접속**:
   ```
   https://console.cloud.google.com/iam-admin/iam?project=carivdealer
   ```

2. **서비스 계정 검색**:
   - 검색창에 `carivdealer@appspot.gserviceaccount.com` 입력

3. **역할 편집**:
   - 해당 서비스 계정의 **연필 아이콘** 클릭
   - **"역할 추가"** 클릭
   - `Secret Manager Secret Accessor` 검색 및 선택
   - **"저장"** 클릭

### 단계 4: 확인

1. **Secret Manager 페이지로 돌아가기**
2. `kotsa-public-data-api-key` 시크릿이 생성되었는지 확인
3. 시크릿을 클릭하여 버전이 정상적으로 생성되었는지 확인

---

## 방법 2: gcloud CLI 사용 (터미널)

### 단계 1: 프로젝트 설정

```bash
gcloud config set project carivdealer
```

**예상 출력**:
```
Updated property [core/project].
```

### 단계 2: Secret Manager API 활성화

```bash
gcloud services enable secretmanager.googleapis.com
```

**예상 출력**:
```
Operation "operations/..." finished successfully.
```

### 단계 3: 시크릿 생성

```bash
echo -n "c06db8fb06b9eb310bd1060d450d7d2a2581f406ec46dbf1eae9a803bffbb738" | gcloud secrets create kotsa-public-data-api-key \
  --data-file=- \
  --replication-policy="automatic"
```

**예상 출력**:
```
Created secret [kotsa-public-data-api-key].
```

**⚠️ 주의**: 시크릿이 이미 존재하는 경우:
```bash
# 기존 시크릿에 새 버전 추가
echo -n "c06db8fb06b9eb310bd1060d450d7d2a2581f406ec46dbf1eae9a803bffbb738" | gcloud secrets versions add kotsa-public-data-api-key \
  --data-file=-
```

### 단계 4: 서비스 계정 권한 부여

```bash
gcloud projects add-iam-policy-binding carivdealer \
  --member="serviceAccount:carivdealer@appspot.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

**예상 출력**:
```
Updated IAM policy for project [carivdealer].
bindings:
- members:
  - serviceAccount:carivdealer@appspot.gserviceaccount.com
  role: roles/secretmanager.secretAccessor
```

### 단계 5: 확인

```bash
# 시크릿 목록 확인
gcloud secrets list --project=carivdealer

# 시크릿 값 확인 (최신 버전)
gcloud secrets versions access latest --secret="kotsa-public-data-api-key"
```

**예상 출력**:
```
NAME                        CREATED              REPLICATION
kotsa-public-data-api-key   2025-01-XX...       automatic

c06db8fb06b9eb310bd1060d450d7d2a2581f406ec46dbf1eae9a803bffbb738
```

---

## 방법 3: PowerShell 스크립트 사용 (자동화)

### 스크립트 실행

```powershell
# 프로젝트 루트에서 실행
cd C:\carivdealer\FOWARDMAX
.\scripts\setup-secrets.ps1
```

### 또는 직접 실행

```powershell
# 프로젝트 설정
$PROJECT_ID = "carivdealer"
$SERVICE_ACCOUNT = "carivdealer@appspot.gserviceaccount.com"
$API_KEY = "c06db8fb06b9eb310bd1060d450d7d2a2581f406ec46dbf1eae9a803bffbb738"

Write-Host "=== GCP Secret Manager 설정 ===" -ForegroundColor Cyan

# 1. 프로젝트 설정
Write-Host "[1/4] 프로젝트 설정 중..." -ForegroundColor Green
gcloud config set project $PROJECT_ID

# 2. Secret Manager API 활성화
Write-Host "[2/4] Secret Manager API 활성화 중..." -ForegroundColor Green
gcloud services enable secretmanager.googleapis.com

# 3. 서비스 계정 권한 부여
Write-Host "[3/4] 서비스 계정 권한 부여 중..." -ForegroundColor Green
gcloud projects add-iam-policy-binding $PROJECT_ID `
  --member="serviceAccount:$SERVICE_ACCOUNT" `
  --role="roles/secretmanager.secretAccessor"

# 4. 시크릿 생성
Write-Host "[4/4] 시크릿 생성 중..." -ForegroundColor Green
$API_KEY | gcloud secrets create kotsa-public-data-api-key `
  --data-file=- `
  --replication-policy="automatic"

if ($LASTEXITCODE -eq 0) {
  Write-Host "✅ 한국교통안전공단 공공데이터 API Key 생성 완료" -ForegroundColor Green
} else {
  Write-Host "⚠️  시크릿이 이미 존재합니다. 새 버전을 추가합니다..." -ForegroundColor Yellow
  $API_KEY | gcloud secrets versions add kotsa-public-data-api-key --data-file=-
  Write-Host "✅ 한국교통안전공단 공공데이터 API Key 업데이트 완료" -ForegroundColor Green
}

Write-Host ""
Write-Host "=== 설정 완료 ===" -ForegroundColor Cyan
Write-Host ""
Write-Host "시크릿 목록:" -ForegroundColor Yellow
gcloud secrets list --project=$PROJECT_ID
```

---

## 🔍 검증 및 테스트

### 1. 시크릿 존재 확인

```bash
gcloud secrets describe kotsa-public-data-api-key --project=carivdealer
```

**예상 출력**:
```
name: projects/carivdealer/secrets/kotsa-public-data-api-key
replication:
  automatic: {}
createTime: '2025-01-XX...'
```

### 2. 시크릿 값 확인

```bash
gcloud secrets versions access latest --secret="kotsa-public-data-api-key" --project=carivdealer
```

**예상 출력**:
```
c06db8fb06b9eb310bd1060d450d7d2a2581f406ec46dbf1eae9a803bffbb738
```

### 3. 서비스 계정 권한 확인

```bash
gcloud projects get-iam-policy carivdealer \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:carivdealer@appspot.gserviceaccount.com" \
  --format="table(bindings.role)"
```

**예상 출력**:
```
ROLE
roles/secretmanager.secretAccessor
```

### 4. Firebase Functions에서 테스트

Firebase Functions 코드에서 다음과 같이 사용:

```typescript
import { getSecret } from '../config/secrets';

// 시크릿 로드
const apiKey = await getSecret('kotsa-public-data-api-key');
console.log('API Key loaded:', apiKey ? 'Success' : 'Failed');
```

---

## 🚀 배포 및 사용

### Firebase Functions 배포

```bash
cd C:\carivdealer\FOWARDMAX
firebase deploy --only functions
```

### 코드에서 사용 예시

**`functions/src/vehicle/getVehicleStatistics.ts`** (구현 예정):
```typescript
import { getSecret } from '../config/secrets';

export const getVehicleStatistics = async (params: VehicleStatisticsParams) => {
  try {
    // Secret Manager에서 API 키 로드
    const apiKey = await getSecret('kotsa-public-data-api-key');
    
    if (!apiKey) {
      throw new Error('KOTSA Public Data API key is not configured');
    }
    
    // API 키 사용
    const url = `${PUBLIC_DATA_API_BASE}?serviceKey=${apiKey}&...`;
    // ... 나머지 코드
  } catch (error) {
    // 에러 처리
  }
};
```

---

## ⚠️ 문제 해결

### 에러 1: "Permission denied"

**원인**: 서비스 계정에 Secret Manager 접근 권한 없음

**해결**:
```bash
gcloud projects add-iam-policy-binding carivdealer \
  --member="serviceAccount:carivdealer@appspot.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### 에러 2: "Secret already exists"

**원인**: 시크릿이 이미 존재함

**해결**: 기존 시크릿에 새 버전 추가
```bash
echo -n "c06db8fb06b9eb310bd1060d450d7d2a2581f406ec46dbf1eae9a803bffbb738" | \
  gcloud secrets versions add kotsa-public-data-api-key --data-file=-
```

### 에러 3: "API not enabled"

**원인**: Secret Manager API가 비활성화됨

**해결**:
```bash
gcloud services enable secretmanager.googleapis.com
```

### 에러 4: "Failed to get secret" (Functions에서)

**원인**: 
- 시크릿 이름이 잘못됨
- 서비스 계정 권한 없음
- 시크릿이 존재하지 않음

**해결**:
1. 시크릿 이름 확인: `gcloud secrets list`
2. 권한 확인: 위의 "서비스 계정 권한 확인" 참조
3. 시크릿 존재 확인: `gcloud secrets describe kotsa-public-data-api-key`

---

## 📝 체크리스트

### 설정 전
- [ ] GCP 프로젝트 `carivdealer` 접근 권한 확인
- [ ] `gcloud` CLI 설치 및 인증 확인
- [ ] API 키 준비 완료

### 설정 중
- [ ] Secret Manager API 활성화
- [ ] 시크릿 `kotsa-public-data-api-key` 생성
- [ ] 서비스 계정 권한 부여

### 설정 후
- [ ] 시크릿 목록 확인
- [ ] 시크릿 값 확인 (올바른 키인지)
- [ ] 서비스 계정 권한 확인
- [ ] Firebase Functions 배포
- [ ] Functions 로그에서 시크릿 로드 성공 확인

---

## 🔐 보안 주의사항

1. **API 키 보호**
   - ✅ Secret Manager에 저장 (완료)
   - ❌ 코드에 하드코딩 금지
   - ❌ Git에 커밋 금지
   - ❌ 환경변수 파일을 공개 저장소에 업로드 금지

2. **접근 제어**
   - ✅ 최소 권한 원칙 적용
   - ✅ 서비스 계정에만 접근 권한 부여
   - ✅ 정기적인 권한 검토

3. **모니터링**
   - Secret Manager 접근 로그 확인
   - Functions 에러 로그 모니터링

---

## 📚 참고 문서

- [GCP Secret Manager 문서](https://cloud.google.com/secret-manager/docs)
- [Firebase Functions 환경변수](https://firebase.google.com/docs/functions/config-env)
- [SECRET_MANAGER_SETUP.md](./SECRET_MANAGER_SETUP.md) - 상세 설정 가이드
- [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md) - 환경변수 설정 가이드

---

## ✅ 완료 확인

모든 단계를 완료했다면 다음 명령어로 최종 확인:

```bash
# 시크릿 확인
gcloud secrets list --project=carivdealer

# 시크릿 값 확인
gcloud secrets versions access latest --secret="kotsa-public-data-api-key"

# 권한 확인
gcloud projects get-iam-policy carivdealer \
  --flatten="bindings[].members" \
  --filter="bindings.members:serviceAccount:carivdealer@appspot.gserviceaccount.com"
```

**예상 결과**:
- ✅ `kotsa-public-data-api-key` 시크릿이 목록에 표시됨
- ✅ 시크릿 값이 올바르게 반환됨
- ✅ `roles/secretmanager.secretAccessor` 권한이 부여됨

---

**설정 완료 후 Firebase Functions를 배포하면 Secret Manager에서 한국교통안전공단 공공데이터 API 키를 자동으로 로드합니다.**

