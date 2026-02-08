# IAM 설정 간단 가이드 (초보자용)

**문제**: 스크립트 실행 실패 → 권한 없음  
**해결**: GCP 콘솔에서 직접 설정

---

## 🎯 무엇을 해야 하나요?

**9개의 Functions에 서비스 계정 권한을 추가**해야 합니다.

---

## 📝 단계별 가이드 (5분 소요)

### 1단계: GCP 콘솔 접속

브라우저에서 아래 링크를 열어주세요:

**👉 https://console.cloud.google.com/functions/list?project=carivdealer&region=asia-northeast3**

### 2단계: 첫 번째 Function 설정

1. 목록에서 **`acceptProposalAPI`** 클릭
2. 상단 탭에서 **"권한"** 또는 **"PERMISSIONS"** 클릭
3. **"주 구성원 추가"** 또는 **"ADD PRINCIPAL"** 버튼 클릭
4. **"새 주 구성원"** 입력란에 아래를 복사해서 붙여넣기:
   ```
   cloud-functions-executor@carivdealer.iam.gserviceaccount.com
   ```
5. **"역할 선택"** 드롭다운에서 **"Cloud Functions Invoker"** 선택
6. **"저장"** 또는 **"SAVE"** 클릭

### 3단계: 나머지 8개 Function도 동일하게 설정

**각 Function을 클릭해서 위의 2단계를 반복하세요:**

1. `handoverApproveAPI`
2. `inspectionAssignAPI`
3. `inspectionGetResultAPI`
4. `inspectionUploadResultAPI`
5. `logisticsDispatchConfirmAPI`
6. `logisticsDispatchRequestAPI`
7. `logisticsScheduleAPI`
8. `settlementNotifyAPI`

---

## ✅ 완료 확인 방법

각 Function의 **권한** 탭에서 다음이 보이면 성공:

```
cloud-functions-executor@carivdealer.iam.gserviceaccount.com
역할: Cloud Functions Invoker
```

---

## 🎨 시각적 가이드

### GCP 콘솔 화면 구조

```
[Functions 목록]
├─ acceptProposalAPI ← 클릭
│   └─ [권한 탭] ← 클릭
│       └─ [주 구성원 추가] ← 클릭
│           ├─ 새 주 구성원: cloud-functions-executor@carivdealer.iam.gserviceaccount.com
│           ├─ 역할: Cloud Functions Invoker
│           └─ [저장]
```

---

## ⏱️ 예상 소요 시간

- Function당 약 30초
- 총 9개 = 약 5분

---

## 💡 팁

- **한 번에 여러 개 설정 불가**: 각 Function마다 개별 설정 필요
- **복사-붙여넣기 활용**: 서비스 계정 이메일 주소를 메모장에 복사해두고 사용
- **저장 후 확인**: 각 Function 설정 후 "권한" 탭에서 확인

---

## 🆘 문제 발생 시

### "권한이 없습니다" 에러가 나는 경우
→ 프로젝트 소유자에게 `roles/functions.admin` 권한 요청

### Function을 찾을 수 없는 경우
→ 리전이 `asia-northeast3`인지 확인

### 저장이 안 되는 경우
→ 브라우저 새로고침 후 다시 시도

---

**다음 단계**: 모든 Function 설정 완료 후 → Hosting 배포

