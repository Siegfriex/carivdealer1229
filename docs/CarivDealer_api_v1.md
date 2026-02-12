# CarivDealer API 명세 v1

**대상**: FM Seller(Dealer) 앱  
**출처**: [FM Seller(Dealer) API명세 (Notion)](https://www.notion.so/2f559864d9fb800992b9cfd7beaa130e?pvs=21)  
**범위**: 회원가입·로그인·차량(등록/목록/상세/검차 신청·최신 상태) — Notion 합의 기준.  
**미포함(별도 확장 예정)**: 검차 목록/상세 전용 API, 탁송·정산·거래(제안)·경매·마이페이지 등 REST 경로는 Notion 본문에 없어 본 문서에는 수록하지 않음.  
**문서 스위트**: [CarivDealer_DOCUMENT_SUITE_INDEX.md](CarivDealer_DOCUMENT_SUITE_INDEX.md)

---

## 공통

- **응답 포맷**: `{ "ok": boolean, "result": object | null, "message": string | null }`
- **인증**: `Auth: Bearer <accessToken>` (Auth O인 경우만)
- **Base URL**: 환경별 설정 (예: `/api` 또는 Functions URL)

---

## 1. 회원가입

| 구분 | Method | URL | Auth | Request (예시) | Response (예시) |
|------|--------|-----|------|-----------------|-----------------|
| (보류) 휴대폰 OTP 요청 | POST | `/auth/phone/otp/request` | X | `{"phone":"01012345678"}` | `{"ok":true,"result":{"otpRequestId":"otp_01H...","expiresInSec":180},"message":null}` |
| (보류) 휴대폰 OTP 검증 | POST | `/auth/phone/otp/confirm` | X | `{"otpRequestId":"otp_01H...","code":"123456"}` | `{"ok":true,"result":{"phoneVerificationToken":"pvtk_01H...","verifiedPhone":"01012345678"},"message":null}` |
| (보류) 로컬 회원가입 (Step1 완료) | POST | `/auth/signup` | X | `{"localId":"test","email":"email@example.com","password":"***","passwordConfirm":"***","name":"홍길동","phoneVerificationToken":"pvtk_01H...","idCardImageId":?}` | `{"ok":true,"result":{"member":{"id":123,"email":"...","name":"홍길동","provider":"LOCAL"},"tokens":{"accessToken":"eyJ...","refreshToken":"eyJ..."},"nextStep":2},"message":null}` |
| 카카오 로그인/가입 (Step1 PASS) | POST | `/auth/kakao/login` | X | `{"idToken":"kakao_id_token"}` | `{"ok":true,"result":{"isNew":true,"member":{"id":234,"email":"k@k.com","provider":"KAKAO"},"tokens":{"accessToken":"eyJ...","refreshToken":"eyJ..."},"nextStep":2},"message":null}` |
| 구글 로그인/가입 (Step1 PASS) | POST | `/auth/google/login` | X | `{"idToken":"google_id_token"}` | `{"ok":true,"result":{"isNew":true,"member":{"id":345,"email":"g@gmail.com","provider":"GOOGLE"},"tokens":{"accessToken":"eyJ...","refreshToken":"eyJ..."},"nextStep":2},"message":null}` |
| 가입 진행상태 조회 → 캐시 (후순위) | GET | `/signup/status` | O | 없음 | `{"ok":true,"result":{"nextStep":2,"dealerVerificationStatus":"DRAFT"},"message":null}` |
| 파일 업로드(이미지/PDF) | POST | `/auth/files` | O | `multipart/form-data`: `file`, `purpose` (예: `BUSINESS_REGISTRATION`) | `{"ok":true,"result":{"fileId":1001,"purpose":"BUSINESS_REGISTRATION"},"message":null}` |
| 사업자번호 확인(버튼) | POST | `/signup/dealer/business-number/verify` | O | `{"businessNo":"123-45-67890"}` | `{"ok":true,"result":{"valid":true},"message":null}` |
| 딜러 인증 Draft 저장(Step2) | PUT | `/signup/dealer` | O | *(아래 바디 참고)* | `{"ok":true,"result":{"saved":true,"dealerVerificationStatus":"DRAFT","nextStep":2},"message":null}` |
| 딜러 인증 제출(Step2 완료) | POST | `/signup/dealer/submit` | O | 없음 | `{"ok":true,"result":{"saved":true,"dealerVerificationStatus":"SUBMITTED","nextStep":3},"message":null}` |
| Step3 저장/제출 | PUT | `/signup/settlement` | O | `{"accountNo":"123-456-789012","bankName":"국민은행","depositorName":"홍길동","passbookCopyFileId":4001,"accountOption":"CORPORATE","action":"SUBMIT"}` | `{"ok":true,"result":{"saved":true,"nextStep":4},"message":null}` |

### 1.1 딜러 인증 Request Body (PUT `/signup/dealer`)

```json
{
  "business": {
    "businessNo": "123-45-67890",
    "representativeName": "대표자명",
    "businessPhone": "02-0000-0000",
    "businessType": "업태/종목",
    "businessInfoType": "드롭다운 선택값",
    "vatType": "TAXABLE",
    "officeAddress": {
      "placeId": "ChIJ....",
      "detailAddress": "상세주소(선택)"
    },
    "businessRegistrationFileId": 1001
  },
  "usedCarDealer": {
    "usedCarDealerLicenseFileIds": [2001],
    "dealerCompanyName": "매매 상사명",
    "dealerEmployeeCardNo": "AA12-12345",
    "employeeCardPhotoFileIds": [2002],
    "dealerRegistrationImageFileIds": [2003]
  },
  "pledge": {
    "signatureText": "홍길동",
    "associationMember": true
  },
  "action": "SUBMIT"
}
```

### 1.2 ERD와의 대응 (회원가입·딜러 인증)

**이미지 ERD(erd/IMG_3923.png) 기준으로 존재하는 항목**: businessType → seller_dealer.business_type, businessInfoType → seller_dealer.business_info_type, dealerEmployeeCardNo → seller_dealer.dealer_employee_card_no, dealerVerificationStatus → seller_dealer.status, representativeName → seller_dealer.representative_name, businessPhone → seller_dealer.business_phone, vatType → seller_dealer.vat_type. nextStep → seller_dealer.next_step.

**ERD에 컬럼이 없거나 별도 저장인 항목**:
- `pledge.agreed` (서약 동의): seller_dealer_pledge에 agreed 컬럼 없음. 도메인 결정 후 ERD/API 보완 검토.
- `tokens.accessToken`, `tokens.refreshToken`: Redis 등 별도 저장. auth_refresh_token 테이블에는 refresh 토큰만.

*상세 매핑·불일치: [CarivDealer_API_ERD_Mapping.md](CarivDealer_API_ERD_Mapping.md), [CarivDealer_API_ERD_Consistency_Report.md](CarivDealer_API_ERD_Consistency_Report.md) 참고.*

---

## 2. 로그인

| 구분 | Method | URL | Auth | Request | Response |
|------|--------|-----|------|---------|----------|
| 로컬 로그인 | POST | `/auth/login` | X | `{"email":"email@company.com","password":"***"}` | `{"ok":true,"result":{"member":{"id":1,"email":"...","loginProvider":"LOCAL"},"tokens":{"accessToken":"...","refreshToken":"..."},"nextStep":2},"message":null}` |
| 카카오 로그인/가입 | POST | `/auth/kakao/login` | X | `{"idToken":"..."}` | 동일 구조 (isNew, member, tokens, nextStep) |
| 구글 로그인/가입 | POST | `/auth/google/login` | X | `{"idToken":"..."}` | 동일 구조 (isNew, member, tokens, nextStep) |
| 토큰 재발급 | POST | `/auth/refresh` | X | `{"refreshToken":"..."}` | `{"ok":true,"result":{"accessToken":"...","refreshToken":"..."},"message":null}` |
| 로그아웃 | POST | `/auth/logout` | O | `{"refreshToken":"..."}` | `{"ok":true,"result":{"loggedOut":true},"message":null}` |

---

## 3. 차량

| 구분 | Method | URL | Auth | Request | Response |
|------|--------|-----|------|---------|----------|
| 차량 등록 원본 업로드(등록원부/서류) | POST | `/vehicle/files` | O | `multipart/form-data`: `file`, `purpose` = `"VEHICLE_REG_DOC"` (jpg/png/pdf) | `{"ok":true,"result":{"fileId":4001,"purpose":"VEHICLE_REG_DOC","originalName":"doc.jpg","contentType":"image/jpeg","size":123456},"message":null}` |
| 차량번호로 기존 데이터 불러오기 | GET | `/vehicles/lookup` | O | Query: `vehicleNo=230가9148` | `{"ok":true,"result":{"exists":true,"vehicle":{"vehicleId":101,"vehicleNo":"230가9148","vin":"KNAG241ABLA013046","modelName":"K5","modelYear":2020,"mileageKm":52000,"status":"LISTABLE","latestInspectionStatus":"REQUESTED","canEdit":true}},"message":null}` |
| 이미지로 등록(OCR 자동입력) | POST | `/vehicles/ocr/parse` | O | `{"vehicleNo":"230가9148","fileId":4001}` | `{"ok":true,"result":{"extracted":{"vehicleNo":"230가9148","vin":"KNAG241ABLA013046","brand":"KIA","modelName":"K5","modelYear":2020,"mileageKm":52000,"fuelType":"GASOLINE","transmission":"AT"}},"message":null}` |
| 차량 등록(신규 저장: 작성중/DRAFT) | POST | `/vehicles` | O | `{"vehicleNo":"230가9148","action":"DRAFT"}` | `{"ok":true,"result":{"vehicleId":101,"status":"DRAFT","displayStatus":"차량 등록 원부 작성 중"},"message":null}` |
| 차량 등록(신규 저장: 등록완료/SUBMIT) | POST | `/vehicles` | O | `{"vehicleNo":"230가9148","vin":"KNAG241ABLA013046","firstRegisteredAt":"2020-03-10","mileageKm":52000,"brand":"KIA","modelName":"K5","modelYear":2020,"fuel":"GASOLINE","transmission":"AT","exteriorColor":"WHITE","interiorColor":"BLACK","action":"SUBMIT"}` | `{"ok":true,"result":{"vehicleId":101,"status":"LISTABLE","displayStatus":"등록완료"},"message":null}` |
| 등록매물 목록 조회(필터/페이징) | GET | `/vehicles` | O | Query: `page=1&size=20&status=ALL&inspectionStatus=ALL&sort=createdAt,DESC` | `{"ok":true,"result":{"items":[...],"page":1,"size":20,"total":2},"message":null}` *(items 필드: 아래 3.2 참고)* |
| 등록매물 목록(검차완료만) | GET | `/vehicles` | O | Query: `inspectionStatus=COMPLETED` 등 | 동일 구조, items만 필터됨 |
| 차량 상세 조회 | GET | `/vehicles/{vehicleId}` | O | 없음 | `{"ok":true,"result":{"vehicleId":101,"vehicleNo":"230가9148","vin":"...","status":"LISTABLE","latestInspectionStatus":"REQUESTED","canEdit":true,...},"message":null}` |
| 차량 수정(전체 PUT) | PUT | `/vehicles/{vehicleId}` | O | `{"vehicleNo":"...","vin":"...","mileageKm":53000,"modelName":"K5","modelYear":2020,"action":"SUBMIT"}` | `{"ok":true,"result":{"updated":true,"vehicleId":101,"status":"LISTABLE"},"message":null}` |
| 차량 부분 수정(PATCH, 옵션) | PATCH | `/vehicles/{vehicleId}` | O | `{"mileageKm":53500}` | `{"ok":true,"result":{"updated":true,"vehicleId":101},"message":null}` |
| 차량 삭제(권장: DRAFT만) | DELETE | `/vehicles/{vehicleId}` | O | 없음 | `{"ok":true,"result":{"deleted":true,"vehicleId":101},"message":null}` |
| 검차 신청(목록 카드 "검차신청") | POST | `/vehicles/{vehicleId}/inspections` | O | *(아래 바디 참고)* | `{"ok":true,"result":{"inspectionId":9001,"vehicleId":101,"status":"REQUESTED"},"message":null}` |
| 최신 검차 상태 조회 | GET | `/vehicles/{vehicleId}/inspections/latest` | O | 없음 | `{"ok":true,"result":{"inspectionId":9001,"vehicleId":101,"status":"REQUESTED","desiredDate":"2026-02-01","desiredTime":"14:00","address":"test",...},"message":null}` |
| (확장) 복잡 검색 | POST | `/vehicles/search` | O | `{"filters":{"status":["LISTABLE"],"modelYearFrom":2018,"modelYearTo":2022,"mileageMax":80000,"inspectionStatus":["COMPLETED"]},"page":1,"size":20,"sort":[{"field":"createdAt","direction":"DESC"}]}` | `{"ok":true,"result":{"items":[...],"page":1,"size":20,"total":1},"message":null}` |

### 3.1 검차 신청 Request Body (POST `/vehicles/{vehicleId}/inspections`)

```json
{
  "inspectionPlace": {
    "placeId": "ChIJ....",
    "placeName": "검차장소명",
    "address": "서울 강남구 ...",
    "lat": 37.5001,
    "lng": 127.0362
  },
  "schedule": {
    "requestDate": "2026-02-01T00:00:00"
  },
  "payment": {
    "method": "AUTO",
    "provider": "CARD",
    "autoPayAgree": true
  },
  "memo": "메모"
}
```

### 3.2 등록매물 목록 `items[]` 필드 (GET `/vehicles`)

각 항목에 포함되는 필드(예시): `vehicleId`, `vehicleNo`, `modelName`, `modelYear`, `mileageKm`, `status`, `displayStatus`, `latestInspectionStatus`, `canEdit`, `primaryCta`.  
- `displayStatus`: 화면 표시용 한글 상태(예: "등록완료", "검차완료").  
- `primaryCta`: 목록 카드 주 액션(예: "검차신청", "매물등록").

---

## 4. 라우트 ↔ API 매핑 (Figma IA·Verification 기준)

앱 라우트는 [figma/IA_FSD_COMPLETE_VERIFICATION_20260208.md](figma/IA_FSD_COMPLETE_VERIFICATION_20260208.md) §2 통합 페이지 인덱스·§3 섹션별 자식 페이지와 대응한다. 해당 라우트는 [figma/FIGMA_IA_FSD_STRUCTURE.md](figma/FIGMA_IA_FSD_STRUCTURE.md) §3.x 참조.

| 라우트 패턴 | Figma IA § | 현재 명세 API | 확장 제안 |
|-------------|------------|---------------|-----------|
| `/`, `/login`, `/signup`, `/signup/step1`~`step5`, `/signup/pending`, `/signup/complete` | §3.1, §3.2 | POST `/auth/login`, `/auth/kakao/login`, `/auth/google/login`, PUT `/signup/dealer`, POST `/signup/dealer/submit`, PUT `/signup/settlement`, GET `/signup/status`, POST `/auth/files` | `/forgot-password` 등 |
| `/dashboard` | §3.3 | (대시 집계 시 GET `/vehicles` 등) | — |
| `/vehicles`, `/vehicles/new`, `/vehicles/:id` | §3.4, §3.5 | GET/POST/PUT/PATCH/DELETE `/vehicles`, GET `/vehicles/lookup`, POST `/vehicles/ocr/parse`, POST `/vehicle/files` | — |
| `/vehicles/:id/auction/*` | §3.9 | — | 경매 시작가·입찰 등 (ERD_Mapping 경매 플로우 제안) |
| `/inspections`, `/inspections/request`, `/inspections/:id/progress`, `/inspections/:id/complete` | §3.6 | POST `/vehicles/:id/inspections`, GET `/vehicles/:id/inspections/latest` | 검차 목록/상세 전용 엔드포인트 |
| `/vehicles`, `/vehicles/:id/sale/*` | §3.7 | GET/POST/PUT `/vehicles` | sale_mode PATCH 등 |
| `/mypage/*`, `/offers` | §3.8 | — | GET `/me`, GET `/offers`, PATCH `/dealer/profile`, 딜러 승인·정산 계좌·알림 (ERD_Mapping 오퍼/마이페이지 제안) |
| `/logistics/schedule`, `/logistics/history`, `/logistics/:id` | §3.10 | — | GET/POST `/logistics/*` (ERD_Mapping 물류 플로우 제안) |
| `/settlements`, `/settlements/:id`, `/sales/history` | §3.11 | — | GET `/settlements`, GET `/sales/history` (ERD_Mapping 정산/매출 제안) |

---

## 5. 검토·확인 (누락 여부)

| 구분 | 확인 결과 |
|------|-----------|
| 회원가입 | Notion 원문 표 전부 반영. (보류) OTP·로컬 회원가입, 카카오/구글, 가입상태·파일·사업자확인·딜러 인증 Draft/제출·Step3 정산. 딜러 인증 body·ERD 보완 노트 포함. |
| 로그인 | 로컬·카카오·구글·토큰 재발급·로그아웃 전부 반영. |
| 차량 | 원본 업로드(`/vehicle/files`), lookup, OCR parse, 등록 DRAFT/SUBMIT, 목록/상세, PUT/PATCH/DELETE, 검차 신청·최신 상태, 복잡 검색 반영. 검차 신청 body·목록 items 필드(§3.2) 보완. |
| URL 일관성 | 명세상 `/vehicle/files`(단수), `/vehicles`(복수) — 원문 그대로 유지. |
| 미포함(의도적) | 검차 목록/상세 전용, 탁송·정산·거래(제안)·경매·마이페이지 등 REST 경로는 Notion 본문 범위 외. 코드베이스 `apiEndpoints.ts`의 Functions 이름(예: `inspectionRequestAPI`)과의 매핑은 별도 문서 참고. |
| 탁송(추가 제안) | 확장 시: GET/POST `/logistics/schedule`, GET `/logistics/history`, GET `/logistics/:id`, PIN 인계 승인(POST `/logistics/:id/handover-approve` 등). [CarivDealer_API_ERD_Mapping.md](CarivDealer_API_ERD_Mapping.md) 물류/탁송 플로우 제안 참고. |
| 정산·매출(추가 제안) | 확장 시: GET `/settlements`(status, from, to, page, size), GET `/settlements/:id`, GET `/sales/history`. [CarivDealer_API_ERD_Mapping.md](CarivDealer_API_ERD_Mapping.md) 정산/매출 플로우 제안 참고. |
| 오퍼·마이페이지(추가 제안) | 확장 시: GET `/offers`, GET `/offers/:id`, 수락/거절 API, GET `/me`, GET/PATCH `/dealer/profile`, 딜러 승인·정산 계좌·알림 설정. [CarivDealer_API_ERD_Mapping.md](CarivDealer_API_ERD_Mapping.md) 오퍼/마이페이지 플로우 제안 참고. |
| API-ERD 매핑 | 필드·엔티티 대조, API-only/DB-only/파생값 목록, needs_domain_decision 플래그는 [CarivDealer_API_ERD_Mapping.md](CarivDealer_API_ERD_Mapping.md) 참고. |
| API-ERD 정합성 | 불일치·갭·우선순위별 권장 조치는 [CarivDealer_API_ERD_Consistency_Report.md](CarivDealer_API_ERD_Consistency_Report.md) 참고. |
| **Figma IA·Verification 정합** | 라우트↔API 절(§4) 및 [figma/IA_FSD_COMPLETE_VERIFICATION_20260208.md](figma/IA_FSD_COMPLETE_VERIFICATION_20260208.md) 통합 인덱스와 교차 검증 완료. |

---

## 6. 문서 이력

| 버전 | 일자 | 비고 |
|------|------|------|
| 1.0 | 2026-02-07 | Notion FM Seller(Dealer) API 명세 기준 최초 문서화, FSD/재정의 기반 정리 |
| 1.1 | 2026-02-07 | 누락 검토: 범위·미포함 안내, 목록 items 필드(§3.2), 검토·확인 표(§5) 추가 |
| 1.2 | 2026-02-07 | §1.2 재검: 이미지 ERD 기준으로 "ERD에 없는 데이터" 정정. businessType 등 ERD 존재 항목 제거, pledge.agreed·tokens만 유지. API-ERD 매핑·정합성 리포트 링크 추가. |
| 1.3 | 2026-02-08 | §4 라우트↔API 매핑 절 추가(IA_FSD_COMPLETE_VERIFICATION 기준). §5 검토 표에 Figma IA·Verification 정합 행 추가. |
