# IAM 설정 체크리스트 (간단 버전)

각 Function을 클릭해서 아래 정보를 입력하세요.

## 입력할 정보

**새 주 구성원**:
```
cloud-functions-executor@carivdealer.iam.gserviceaccount.com
```

**역할**:
```
Cloud Functions Invoker
```

---

## 체크리스트

- [ ] `acceptProposalAPI` 설정 완료
- [ ] `handoverApproveAPI` 설정 완료
- [ ] `inspectionAssignAPI` 설정 완료
- [ ] `inspectionGetResultAPI` 설정 완료
- [ ] `inspectionUploadResultAPI` 설정 완료
- [ ] `logisticsDispatchConfirmAPI` 설정 완료
- [ ] `logisticsDispatchRequestAPI` 설정 완료
- [ ] `logisticsScheduleAPI` 설정 완료
- [ ] `settlementNotifyAPI` 설정 완료

---

## GCP 콘솔 링크

https://console.cloud.google.com/functions/list?project=carivdealer&region=asia-northeast3

