# API 엔드포인트 매핑 가이드

## 개요

이 문서는 프론트엔드에서 호출하는 API 엔드포인트가 실제 Firebase Functions로 어떻게 매핑되는지 설명합니다.

## API Base URL

```
https://asia-northeast3-carivdealer.cloudfunctions.net
```

## 엔드포인트 매핑 테이블

**중요**: Firebase Functions v2 `onRequest`는 경로 파라미터를 자동 파싱하지 않으므로, 모든 ID는 **Body(POST) 또는 Query(GET)**로 전달합니다.

| 프론트엔드 호출 | 실제 Firebase Function | 전체 URL | 파라미터 전달 방식 |
|----------------|----------------------|----------|-------------------|
| `acceptProposalAPI` | `acceptProposalAPI` | `https://asia-northeast3-carivdealer.cloudfunctions.net/acceptProposalAPI` | POST Body: `{ proposal_id, action }` |
| `logisticsScheduleAPI` | `logisticsScheduleAPI` | `https://asia-northeast3-carivdealer.cloudfunctions.net/logisticsScheduleAPI` | POST Body: `{ schedule_date, schedule_time, address, vehicle_id, special_notes }` |
| `logisticsDispatchRequestAPI` | `logisticsDispatchRequestAPI` | `https://asia-northeast3-carivdealer.cloudfunctions.net/logisticsDispatchRequestAPI` | POST Body: `{ logistics_id }` |
| `logisticsDispatchConfirmAPI` | `logisticsDispatchConfirmAPI` | `https://asia-northeast3-carivdealer.cloudfunctions.net/logisticsDispatchConfirmAPI` | POST Body: `{ dispatch_id, driver_name?, driver_phone? }` |
| `handoverApproveAPI` | `handoverApproveAPI` | `https://asia-northeast3-carivdealer.cloudfunctions.net/handoverApproveAPI` | POST Body: `{ logistics_id, pin }` |
| `settlementNotifyAPI` | `settlementNotifyAPI` | `https://asia-northeast3-carivdealer.cloudfunctions.net/settlementNotifyAPI` | POST Body: `{ settlement_id }` |
| `ocrRegistrationAPI` | `ocrRegistrationAPI` | `https://asia-northeast3-carivdealer.cloudfunctions.net/ocrRegistrationAPI` | POST FormData: `{ registration_image }` |
| `verifyBusinessAPI` | `verifyBusinessAPI` | `https://asia-northeast3-carivdealer.cloudfunctions.net/verifyBusinessAPI` | POST FormData: `{ business_registration_image }` |
| `inspectionRequestAPI` | `inspectionRequestAPI` | `https://asia-northeast3-carivdealer.cloudfunctions.net/inspectionRequestAPI` | POST Body: `{ vehicle_id, preferred_date, preferred_time }` |
| `inspectionAssignAPI` | `inspectionAssignAPI` | `https://asia-northeast3-carivdealer.cloudfunctions.net/inspectionAssignAPI` | POST Body: `{ inspection_id }` |
| `inspectionUploadResultAPI` | `inspectionUploadResultAPI` | `https://asia-northeast3-carivdealer.cloudfunctions.net/inspectionUploadResultAPI` | POST FormData: `{ inspection_id, inspection_result, images[] }` |
| `inspectionGetResultAPI` | `inspectionGetResultAPI` | `https://asia-northeast3-carivdealer.cloudfunctions.net/inspectionGetResultAPI` | GET Query: `?inspection_id=...` |
| `changeSaleMethodAPI` | `changeSaleMethodAPI` | `https://asia-northeast3-carivdealer.cloudfunctions.net/changeSaleMethodAPI` | POST Body: `{ vehicle_id, auction_settings }` |
| `bidAPI` | `bidAPI` | `https://asia-northeast3-carivdealer.cloudfunctions.net/bidAPI` | POST Body: `{ auction_id, bid_amount }` |
| `buyNowAPI` | `buyNowAPI` | `https://asia-northeast3-carivdealer.cloudfunctions.net/buyNowAPI` | POST Body: `{ auction_id }` |

**참고**: 상세 계약은 `API_계약_정의서.md`를 참조하세요.

## 코드 위치

### 프론트엔드 API 클라이언트
- 파일: `src/services/api.ts`
- 함수: `apiCall<T>(endpoint: string, options: RequestInit, queryString?: string, mockFallback?: () => T)`
- URL 생성: `${API_BASE_URL}/${endpoint}`

### 백엔드 Firebase Functions
- 파일: `functions/src/index.ts`
- 함수 정의: `export const {endpointName}API = onRequest({ region: 'asia-northeast3', cors: true }, handler)`

## 타임아웃 및 폴백 로직

### 타임아웃 설정
- **타임아웃 시간**: 5초 (5000ms)
- **설정 위치**: `src/services/api.ts`의 `API_TIMEOUT` 상수

### 폴백 동작
1. 실제 API 호출 시도
2. 5초 내 응답 없음 → 타임아웃 발생
3. 타임아웃 또는 네트워크 에러 발생 시 → Mock 데이터로 자동 폴백
4. Mock 데이터는 `src/services/apiMockData.ts`에 정의됨

### 폴백이 적용되는 API
- ✅ `acceptProposal` - 일반 판매 제안 수락/거절
- ✅ `scheduleLogistics` - 탁송 일정 조율
- ✅ `requestDispatch` - 배차 조율 요청
- ✅ `confirmDispatch` - 배차 확정
- ✅ `approveHandover` - 인계 승인
- ✅ `notifySettlement` - 정산 완료 알림
- ✅ `assignEvaluator` - 평가사 배정
- ✅ `uploadInspectionResult` - 검차 결과 업로드
- ✅ `getInspectionResult` - 검차 결과 조회
- ✅ `inspectionRequest` - 검차 신청

### 폴백이 없는 API (에러만 throw)
- `ocrRegistration` - 등록원부 OCR (Mock 데이터 없음)
- `verifyBusiness` - 사업자 인증 (Mock 데이터 없음)

## 예제

### 프론트엔드 호출
```typescript
import { apiClient } from './services/api';

// 실제 API 호출 시도 → 5초 타임아웃 → 실패 시 Mock 데이터 반환
const result = await apiClient.trade.acceptProposal('proposal-001', 'accept');
```

### 백엔드 함수 정의
```typescript
// functions/src/index.ts
export const acceptProposalAPI = onRequest({
  region: 'asia-northeast3',
  cors: true,
}, acceptProposal);
```

## 디버깅

### 개발 환경에서 Mock 호출 확인
개발 환경(`import.meta.env.DEV === true`)에서는 콘솔에 다음 경고가 출력됩니다:
```
[프로토타입] API 타임아웃/에러로 인한 Mock 폴백: acceptProposalAPI API_TIMEOUT
```

### 실제 API 호출 확인
브라우저 개발자 도구의 Network 탭에서 다음을 확인할 수 있습니다:
- 요청 URL: `https://asia-northeast3-carivdealer.cloudfunctions.net/{endpointName}`
- 응답 시간: 5초 이내면 성공, 초과 시 타임아웃

