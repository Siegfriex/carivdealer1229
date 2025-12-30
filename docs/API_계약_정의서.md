# API 계약 정의서 (SSOT: Single Source of Truth)

**문서 버전**: 2.0  
**최종 업데이트**: 2025-01-XX  
**적용 범위**: 프론트엔드 ↔ Firebase Functions v2 ↔ Firestore

---

## 개요

이 문서는 **프론트엔드 API 클라이언트**와 **Firebase Functions v2** 간의 계약(Contract)을 정의합니다.  
**Firebase Functions v2 `onRequest`**는 경로 파라미터(`req.params`)를 자동으로 파싱하지 않으므로,  
모든 ID 전달은 **Body(POST) 또는 Query(GET)**로 통일합니다.

---

## 계약 원칙

1. **POST 요청**: 모든 파라미터는 `req.body`에서 읽음
2. **GET 요청**: 모든 파라미터는 `req.query`에서 읽음
3. **경로 파라미터 사용 금지**: `/api/{id}` 형태의 경로 파라미터는 사용하지 않음
4. **에러 코드 표준화**:
   - `400`: 필수 파라미터 누락 또는 잘못된 값
   - `404`: 리소스를 찾을 수 없음
   - `409`: 상태 전이 불가 (예: 이미 완료된 작업)
   - `401`: 인증 실패 (예: PIN 불일치)
   - `500`: 서버 내부 오류

---

## API 계약 테이블

### 검차 관련 API

| API ID | 엔드포인트명 | HTTP | 프론트 호출 | Functions 입력 | Firestore 갱신 |
|--------|-------------|------|------------|---------------|----------------|
| API-0101 | inspectionRequestAPI | POST | `inspectionRequestAPI` | `req.body.vehicle_id`<br/>`req.body.preferred_date`<br/>`req.body.preferred_time` | `inspections/{id}` 생성<br/>`vehicles/{vehicleId}` 상태 업데이트 |
| API-0102 | inspectionAssignAPI | POST | `inspectionAssignAPI` | `req.body.inspection_id` | `inspections/{inspectionId}` 상태 업데이트 |
| API-0103 | inspectionUploadResultAPI | POST | `inspectionUploadResultAPI` | `req.body.inspection_id` (FormData)<br/>`req.body.inspection_result` (JSON string)<br/>`req.body.images[]` (File[]) | `inspections/{inspectionId}` 결과 저장<br/>`vehicles/{vehicleId}` 상태 전이 |
| API-0104 | inspectionGetResultAPI | GET | `inspectionGetResultAPI?inspection_id=...` | `req.query.inspection_id` | (조회만) |

### 거래 관련 API

| API ID | 엔드포인트명 | HTTP | 프론트 호출 | Functions 입력 | Firestore 갱신 |
|--------|-------------|------|------------|---------------|----------------|
| API-0301 | acceptProposalAPI | POST | `acceptProposalAPI` | `req.body.proposal_id`<br/>`req.body.action` ('accept'\|'reject') | `trades/{proposalId}` 상태 업데이트<br/>`vehicles/{vehicleId}` 상태 전이 |

### 탁송 관련 API

| API ID | 엔드포인트명 | HTTP | 프론트 호출 | Functions 입력 | Firestore 갱신 |
|--------|-------------|------|------------|---------------|----------------|
| API-0600 | logisticsScheduleAPI | POST | `logisticsScheduleAPI` | `req.body.schedule_date`<br/>`req.body.schedule_time`<br/>`req.body.address`<br/>`req.body.vehicle_id` (필수)<br/>`req.body.special_notes` (선택) | `logistics/{id}` 생성<br/>PIN 자동 생성 |
| API-0601 | logisticsDispatchRequestAPI | POST | `logisticsDispatchRequestAPI` | `req.body.logistics_id` | `logistics/{logisticsId}` 상태 업데이트 |
| API-0602 | logisticsDispatchConfirmAPI | POST | `logisticsDispatchConfirmAPI` | `req.body.dispatch_id`<br/>`req.body.driver_name` (선택)<br/>`req.body.driver_phone` (선택) | `logistics/{logisticsId}` 상태 전이<br/>기사 정보 업데이트 |
| API-0603 | handoverApproveAPI | POST | `handoverApproveAPI` | `req.body.logistics_id`<br/>`req.body.pin` (6자리 숫자) | `logistics/{logisticsId}` 상태 전이<br/>`vehicles/{vehicleId}` 상태 전이 |

### 정산 관련 API

| API ID | 엔드포인트명 | HTTP | 프론트 호출 | Functions 입력 | Firestore 갱신 |
|--------|-------------|------|------------|---------------|----------------|
| API-0604 | settlementNotifyAPI | POST | `settlementNotifyAPI` | `req.body.settlement_id` | (알림 발송만, Firestore 갱신 없음) |

---

## 상세 계약 명세

### API-0101: 검차 신청

**요청 형식**: JSON  
**요청 Body**:
```json
{
  "vehicle_id": "v-101",
  "preferred_date": "2025-01-15",
  "preferred_time": "14:00"
}
```

**응답**:
```json
{
  "success": true,
  "inspection_id": "insp-001",
  "message": "검차 신청이 완료되었습니다."
}
```

**Firestore 갱신**:
- `inspections/{inspectionId}` 생성: `vehicleId`, `preferredDate`, `preferredTime`, `status='pending'`
- `vehicles/{vehicleId}` 업데이트: `status='inspection'`, `inspectionId`

---

### API-0102: 평가사 배정

**요청 형식**: JSON  
**요청 Body**:
```json
{
  "inspection_id": "insp-001"
}
```

**응답**:
```json
{
  "success": true,
  "evaluator_id": "eval-001",
  "message": "평가사가 배정되었습니다."
}
```

**Firestore 갱신**:
- `inspections/{inspectionId}` 업데이트: `evaluatorId`, `status='assigned'`, `assignedAt`

---

### API-0103: 검차 결과 업로드

**요청 형식**: multipart/form-data  
**요청 Body (FormData)**:
- `inspection_id`: string (필수)
- `inspection_result`: JSON string (필수)
- `images[]`: File[] (선택)

**예시 (프론트엔드)**:
```typescript
const formData = new FormData();
formData.append('inspection_id', inspectionId);
formData.append('inspection_result', JSON.stringify(resultData));
images.forEach(img => formData.append('images[]', img));
```

**응답**:
```json
{
  "success": true,
  "message": "검차 결과가 성공적으로 업로드되었습니다."
}
```

**Firestore 갱신**:
- `inspections/{inspectionId}` 업데이트: `result`, `media` (Storage URL 배열), `status='completed'`
- `vehicles/{vehicleId}` 업데이트: `status='active_sale'`, `inspectionId`

---

### API-0104: 검차 결과 조회

**요청 형식**: GET Query  
**요청 URL**: `inspectionGetResultAPI?inspection_id=insp-001`

**응답**:
```json
{
  "success": true,
  "result": { /* 검차 결과 데이터 */ },
  "inspection": {
    "id": "insp-001",
    "vehicleId": "v-101",
    "status": "completed",
    "preferredDate": "2025-01-15",
    "preferredTime": "14:00",
    "evaluatorId": "eval-001"
  }
}
```

---

### API-0301: 일반 판매 제안 수락/거절

**요청 형식**: JSON  
**요청 Body**:
```json
{
  "proposal_id": "trade-001",
  "action": "accept" // 또는 "reject"
}
```

**응답**:
```json
{
  "success": true,
  "message": "제안이 수락되었습니다." // 또는 "제안이 거절되었습니다."
}
```

**Firestore 갱신**:
- `trades/{proposalId}` 업데이트: `status='accepted'` 또는 `'rejected'`, `acceptedAt` 또는 `rejectedAt`
- `vehicles/{vehicleId}` 업데이트: `status='locked'` (수락 시)

---

### API-0600: 탁송 일정 조율

**요청 형식**: JSON  
**요청 Body**:
```json
{
  "schedule_date": "2025-01-28",
  "schedule_time": "14:00",
  "address": "서울특별시 강남구 테헤란로 123",
  "vehicle_id": "v-106", // 필수
  "special_notes": "차키 조수석 서랍에 보관" // 선택
}
```

**응답**:
```json
{
  "success": true,
  "logistics_id": "log-001",
  "message": "탁송 일정이 조율되었습니다."
}
```

**Firestore 갱신**:
- `logistics/{logisticsId}` 생성: `vehicleId`, `scheduleDate`, `scheduleTime`, `departureAddress`, `destinationAddress`, `status='scheduled'`, `handoverPin` (6자리 랜덤)

---

### API-0601: 배차 조율 요청

**요청 형식**: JSON  
**요청 Body**:
```json
{
  "logistics_id": "log-001"
}
```

**응답**:
```json
{
  "success": true,
  "dispatch_id": "dispatch-log-001",
  "message": "배차 요청이 전송되었습니다."
}
```

**Firestore 갱신**:
- `logistics/{logisticsId}` 업데이트: `dispatchId`, `status='dispatched'`, `dispatchAt`

---

### API-0602: 배차 확정

**요청 형식**: JSON  
**요청 Body**:
```json
{
  "dispatch_id": "dispatch-log-001",
  "driver_name": "김택시", // 선택
  "driver_phone": "010-1234-5678" // 선택
}
```

**응답**:
```json
{
  "success": true,
  "message": "배차가 확정되었습니다."
}
```

**Firestore 갱신**:
- `logistics/{logisticsId}` 업데이트: `status='in_transit'`, `driverName`, `driverPhone`

---

### API-0603: 인계 승인

**요청 형식**: JSON  
**요청 Body**:
```json
{
  "logistics_id": "log-001",
  "pin": "123456" // 6자리 숫자
}
```

**응답**:
```json
{
  "success": true,
  "handover_timestamp": "2025-01-28T16:30:00Z",
  "message": "인계 승인이 완료되었습니다."
}
```

**에러 응답 (PIN 불일치)**:
```json
{
  "error": "Invalid PIN"
}
```
- HTTP 상태 코드: `401`

**Firestore 갱신**:
- `logistics/{logisticsId}` 업데이트: `status='completed'`, `handoverTimestamp`
- `vehicles/{vehicleId}` 업데이트: `status='pending_settlement'`

---

### API-0604: 정산 완료 알림 발송

**요청 형식**: JSON  
**요청 Body**:
```json
{
  "settlement_id": "settle-001"
}
```

**응답**:
```json
{
  "success": true,
  "notification_id": "notif-001",
  "message": "정산 완료 알림이 발송되었습니다."
}
```

---

## 상태 전이 규칙

### 검차 상태 전이
```
pending → assigned → completed
```

### 탁송 상태 전이
```
scheduled → dispatched → in_transit → completed
```

### 거래 상태 전이
```
pending → accepted / rejected
```

### 차량 상태 전이
```
draft → inspection → active_sale → locked → pending_settlement → settlement_completed
```

---

## 변경 이력

- **v2.0** (2025-01-XX): Body/Query only 계약으로 통일, 경로 파라미터 제거
- **v1.0** (2025-01-XX): 초기 계약 정의

