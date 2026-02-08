# CarivDealer API ↔ ERD 매핑 문서

**목적**: [CarivDealer_api_v1.md](CarivDealer_api_v1.md) 명세와 ERD(erd/IMG_3923.png, CarivDealer_ERD_v1.0) 간 필드·엔티티 매핑 및 불일치 정리.  
**범위**: 회원가입·로그인·차량·검차 신청/최신 상태.  
**ERD 기준**: 이미지 ERD(erd/IMG_3923.png, CarivDealer_ERD_v1.0) — snake_case.

---

## 정합성 검증 요약

| 검증 항목 | 반영 여부 | 위치 |
|-----------|-----------|------|
| **API 요청/응답 필드 ↔ ERD 테이블·컬럼 1:1 매핑** | 예 | 아래 "필드 수준 매핑", "엔드포인트 ↔ ERD 테이블 매핑". 요청/응답 필드(camelCase)와 ERD 컬럼(snake_case) 대응표 제공. |
| **상태 enum(dealerVerificationStatus, inspection status 등)이 DB enum과 일치** | 예 | "타입·제약 대조", "상태·열거 정합성" 섹션. API 값(DRAFT, SUBMITTED, REQUESTED 등)과 ERD 컬럼 값 목록 명시 및 일치 여부 표기. |
| **파생 필드(displayStatus, nextStep, primaryCta 등)를 "계산값"으로 명시** | 예 | "3. 명시적으로 계산값으로 분류한 필드 목록"에서 **계산값(저장 없음)**으로 정의. 필드 수준 매핑 표에서도 해당 필드에 **계산값** 표기. |
| **Figma IA·라우트 ↔ API·ERD 정합성** | 예 | 검차: [FIGMA_IA_FSD_STRUCTURE.md](figma/FIGMA_IA_FSD_STRUCTURE.md) §3.6 (FIGMA_GLOBAL_PLAN에는 검차 전용 절 없음, §2.7~2.11만 존재). 일반 판매: IA §3.7. 차량 목록: IA §3.4, [FIGMA_GLOBAL_PLAN.md](figma/FIGMA_GLOBAL_PLAN.md) §2.7. 탁송: IA §3.10, Global Plan §2.9. 정산: IA §3.11, Global Plan §2.10. 마이페이지: IA §3.8, Global Plan §2.11. 통합 인덱스: [IA_FSD_COMPLETE_VERIFICATION_20260208.md](figma/IA_FSD_COMPLETE_VERIFICATION_20260208.md). 라우트 ↔ POST/GET inspections·vehicle·계산값 정합 유지. |

---

## ERD 테이블·컬럼 목록 (API 범위)

이미지 ERD 기준, API 명세 범위(회원가입·로그인·차량·검차)에 해당하는 테이블·컬럼만 정리.

| 테이블 | PK | 주요 컬럼 (타입·NULL) |
|--------|-----|------------------------|
| seller_user | seller_user_id (BIGINT) | email, password, phone, name, provider, provider_id, created_at, updated_at, deleted_at |
| user_profile | user_profile_id | seller_user_id(FK), profile_image_url, nickname, gender, birth_date, created_at, updated_at, deleted_at |
| auth_refresh_token | refresh_token_id | token, seller_user_id(FK), expires_at, created_at, updated_at |
| user_file | user_file_id | seller_user_id(FK), purpose, original_name, content_type, size, url, created_at, updated_at, deleted_at |
| seller_dealer | seller_dealer_id | seller_user_id(FK), business_no, representative_name, business_phone, business_type, business_info_type, vat_type, dealer_company_name, dealer_employee_card_no, **status**(DRAFT/SUBMITTED/APPROVED/REJECTED), **next_step**, business_registration_file_id(FK), created_at, updated_at, deleted_at |
| seller_dealer_address | seller_dealer_address_id | seller_dealer_id(FK), place_id, address, detail_address, zip_code, lat, lng, created_at, updated_at, deleted_at |
| seller_dealer_file | seller_dealer_file_id | seller_dealer_id(FK), user_file_id(FK), purpose, created_at, updated_at, deleted_at |
| seller_dealer_pledge | seller_dealer_pledge_id | seller_dealer_id(FK), signature_text, association_member, created_at, updated_at, deleted_at |
| seller_settlement_account | settlement_account_id | seller_dealer_id(FK), account_no, bank_name, depositor_name, account_option, passbook_copy_file_id(FK), created_at, updated_at, deleted_at |
| vehicle | vehicle_id | seller_dealer_id(FK), vehicle_no, vin, first_registered_at, mileage_km, brand, model_name, model_year, fuel_type, transmission_type, exterior_color, interior_color, status, display_status, latest_inspection_status, can_edit, primary_cta, created_at, updated_at, deleted_at |
| vehicle_file | vehicle_file_id | vehicle_id(FK), user_file_id(FK), purpose, created_at, updated_at, deleted_at |
| inspection | inspection_id | vehicle_id(FK), inspection_place_id(FK), desired_date(DATE), desired_time(VARCHAR), memo, status, payment_method, payment_provider, auto_pay_agree, created_at, updated_at, deleted_at |
| inspection_place | inspection_place_id | place_id, place_name, address, detail_address, zip_code, lat, lng, created_at, updated_at, deleted_at |

*ERD에 **business_type**, **business_info_type**, **dealer_employee_card_no**, **status**, **next_step** 존재. dealerVerificationStatus(API) ↔ seller_dealer.status.*

---

## 요약 섹션

### 1. API-only 필드 목록

API 요청/응답에만 있고, ERD 테이블·컬럼에 **대응되는 저장 필드가 없는** 항목.

| API 필드(또는 경로) | 용도 | 비고 |
|--------------------|------|------|
| `nextStep` | 가입/로그인 응답 — 다음 단계 번호 | ERD: seller_dealer.next_step (INT) 존재 → 매핑됨. |
| `dealerVerificationStatus` | 가입 진행상태·딜러 인증 응답 | ERD에는 seller_dealer.`status` / `approval_status` 존재. **네이밍만 상이** → needs_domain_decision: doc_typing_miss |
| `isNew` | 소셜 로그인/가입 응답 | 신규 가입 여부. 파생값. |
| `tokens.accessToken`, `tokens.refreshToken` | 로그인/가입 응답 | Redis 등 별도 저장. API 명세 §1.2 반영. |
| `primaryCta` | GET /vehicles 목록 items | ERD: vehicle.primary_cta 존재 → 저장 가능. |
| `pledge.agreed` | PUT /signup/dealer body (문서상) | ERD에 컬럼 없음. needs_domain_decision: domain_model_revision |

*표에 `needs_domain_decision`이 적힌 항목은 하단 “불확실 항목 및 needs_domain_decision” 표에서 통합 관리.*

---

### 2. DB-only 필드 목록

ERD 테이블·컬럼에는 있으나, **현재 API 명세(CarivDealer_api_v1) 요청/응답에 노출되지 않는** 항목.

| ERD 테이블.컬럼 | 용도 | 비고 |
|-----------------|------|------|
| seller_user.`last_login_at` | 마지막 로그인 시각 | 로그인 시 업데이트, API 응답 미포함. |
| seller_dealer.`approval_status`, `reject_reason` | 승인/반려 상세 | API에는 dealerVerificationStatus 수준만. 상세 노출 여부 불명. → needs_domain_decision: domain_model_revision |
| seller_dealer_address.`address_type`, `post_code`, `full_address` | 주소 타입·우편·전체주소 | API는 placeId, detailAddress 위주. |
| user_file.`file_url`, `file_type` (일부) | 파일 메타 | API 응답은 fileId, purpose 위주. |
| vehicle.`created_at`, `updated_at` | 감사용 타임스탬프 | 목록 정렬 등에 사용 가능하나 API 필드명 미명시. |
| inspection.`created_at`, `updated_at` | 감사용 | 동일. |
| auth_refresh_token.`expires_at` | 토큰 만료 | API에 미노출. |

---

### 3. 명시적으로 **계산값**으로 분류한 필드 목록

**계산값**: DB에 별도 컬럼으로 저장하지 않고, **요청 시점에 규칙·집계로 계산**하여 API 응답에만 노출되는 값. (ERD에 동일명 컬럼이 있어도 "저장 후 배치 계산"으로 채울 수 있으면 구현 선택 사항.)

| 필드 | 출처(API) | 계산값 산출 규칙(정의) |
|------|-----------|------------------------|
| `nextStep` | 로그인/가입/가입상태 | dealer·settlement 상태 및 step 규칙에 따른 **계산값** — 다음 단계 번호. (ERD seller_dealer.next_step에 저장할 수도 있음.) |
| `displayStatus` | 차량 목록/상세 | status·inspection_status 등에 따른 **계산값** — 화면용 한글 라벨(예: "등록완료", "검차완료"). |
| `primaryCta` | GET /vehicles items | status·inspection_status 등에 따른 **계산값** — 목록 카드 주 액션 라벨(예: "검차신청", "매물등록"). |
| `canEdit` | 차량 목록/상세/lookup | 차량·검차 상태에 따른 **계산값** — 편집 허용 여부. |
| `latestInspectionStatus` | 차량 목록/상세/lookup | 해당 차량 최신 검차 1건의 status — **계산값**(inspection 조인/서브쿼리). |
| `isNew` | 소셜 로그인/가입 | idToken 기반 기존 회원 조회 여부 — **계산값**. |

---

## 불확실 항목 및 needs_domain_decision

각 불확실 항목을 다음 두 가지로 구분해, **PO/도메인 오너 회의 시** “문서·타이핑 수정” vs “도메인·모델 결정”을 나누어 검토할 수 있도록 표기한다.

| 플래그 | 의미 |
|--------|------|
| **doc_typing_miss** | 순수히 문서·타이핑·네이밍 불일치. ERD/API 중 한쪽에 반영만 되었거나 표기만 다른 경우. 코드/도메인 로직 변경 최소. |
| **domain_model_revision** | 도메인 모델·비즈니스 규칙을 손봐야 함. ERD 컬럼 추가, API 스키마 확장, 상태 정의 변경 등이 필요할 수 있음. |

### 불확실 항목 표

| 항목 | 구분 | needs_domain_decision | 조치 제안 |
|------|------|------------------------|-----------|
| dealerVerificationStatus vs seller_dealer.status | API 응답 필드명 vs ERD 컬럼명 | **doc_typing_miss** | 매핑 문서에 "dealerVerificationStatus ↔ seller_dealer.status" 명시. API는 camelCase 유지. |
| businessType, businessInfoType, dealerEmployeeCardNo | CarivDealer_api_v1 §1.2 "ERD에 없는 데이터" | **doc_typing_miss** | 이미지 ERD에 business_type, business_info_type, dealer_employee_card_no 존재 시 §1.2에서 제거. 없으면 **domain_model_revision** 전환. |
| pledge.agreed (서약 동의) | API body 예시에는 없음, §1.2에만 기재 | **domain_model_revision** | ERD에 agreed 컬럼 추가 여부, API body에 agreed 필드 포함 여부 도메인 결정. |
| seller_dealer.approval_status, reject_reason | API에 미노출 | **domain_model_revision** | 정산·운영팀 화면 등에서 노출할지, API 확장 시 응답에 포함할지 결정. |
| schedule.requestDate 형식 (날짜만 vs datetime) | 검차 신청 body | **doc_typing_miss** | API 명세에 "date only" vs "ISO datetime" 명시. ERD inspection.request_date 타입과 일치시키기. |

---

## 엔드포인트 ↔ ERD 테이블 매핑 (요약)

| API (Method + 경로) | 주로 사용하는 ERD 테이블 |
|---------------------|---------------------------|
| POST /auth/kakao/login, /auth/google/login, POST /auth/login | seller_user, auth_refresh_token |
| GET /signup/status | seller_user, seller_dealer |
| POST /auth/files | user_file |
| POST /signup/dealer/business-number/verify | (검증 API, DB 저장 여부는 백엔드 정책) |
| PUT /signup/dealer | seller_dealer, seller_dealer_address, seller_dealer_file, seller_dealer_pledge, user_file |
| POST /signup/dealer/submit | seller_dealer |
| PUT /signup/settlement | seller_settlement_account, user_file |
| POST /vehicle/files | user_file 또는 vehicle_file |
| GET /vehicles/lookup, POST /vehicles, GET /vehicles, GET /vehicles/:id | vehicle, vehicle_file (목록 시 inspection 조인/서브쿼리로 latestInspectionStatus 등) |
| POST /vehicles/ocr/parse | (OCR 결과 → vehicle 저장 전 입력용) |
| PUT /vehicles/:id, PATCH /vehicles/:id, DELETE /vehicles/:id | vehicle |
| POST /vehicles/:id/inspections | inspection, inspection_place |
| GET /vehicles/:id/inspections/latest | inspection, inspection_place, vehicle |
| POST /vehicles/search | vehicle (필터/페이징) |

---

## 필드 수준 매핑 (핵심만)

### 회원가입·딜러

| API (camelCase) | ERD (snake_case) | 비고 |
|-----------------|------------------|------|
| businessNo | seller_dealer.business_no | |
| representativeName | seller_dealer.representative_name | |
| businessPhone | seller_dealer.business_phone | |
| businessType | seller_dealer.business_type | 이미지 ERD 확인 시 doc_typing_miss |
| businessInfoType | seller_dealer.business_info_type | 위와 동일 |
| officeAddress.placeId, detailAddress | seller_dealer_address.place_id, detail_address | |
| businessRegistrationFileId | seller_dealer_file + user_file | purpose별 |
| dealerCompanyName | seller_dealer.dealer_company_name | |
| dealerEmployeeCardNo | seller_dealer.dealer_employee_card_no | |
| usedCarDealerLicenseFileIds 등 | seller_dealer_file (file_id 배열) | |
| pledge.signatureText, associationMember | seller_dealer_pledge.signature_text, association_member | |
| pledge.agreed | (없음) | needs_domain_decision: domain_model_revision |
| accountNo, bankName, depositorName, passbookCopyFileId, accountOption | seller_settlement_account | |

### 차량·검차

| API (camelCase) | ERD (snake_case) | 비고 |
|-----------------|------------------|------|
| vehicleId | vehicle.id | |
| vehicleNo | vehicle.vehicle_no | |
| vin | vehicle.vin | |
| status | vehicle.status | |
| displayStatus | **계산값** (위 §3) | vehicle.display_status 저장 가능. 없으면 규칙으로 계산. |
| latestInspectionStatus | **계산값** (inspection.status 조인) | |
| canEdit | **계산값** (위 §3) | |
| primaryCta | **계산값** (위 §3) | |
| inspectionPlace.* | inspection_place + inspection.inspection_place_id | |
| schedule.requestDate | inspection.request_date, request_time | 타입 일치 필요 |
| payment.* | inspection.payment_* | |
| schedule.requestDate | inspection.desired_date, desired_time | API는 단일 datetime 가능. ERD는 DATE + VARCHAR(시간). 타입 정합 필요. |
| fuel (API) | vehicle.fuel_type | |
| transmission (API) | vehicle.transmission_type | ERD 컬럼명은 transmission_type. |

---

## 타입·제약 대조

| 항목 | API | ERD | 일치 | 비고 |
|------|-----|-----|------|------|
| 딜러 상태 | dealerVerificationStatus: DRAFT, SUBMITTED | seller_dealer.status: DRAFT, SUBMITTED, APPROVED, REJECTED | 부분 | API는 가입 플로우만. APPROVED/REJECTED는 DB-only 노출 여부 결정. |
| 차량 상태 | status: DRAFT, LISTABLE 등 | vehicle.status | 일치 | |
| 검차 희망일시 | schedule.requestDate (ISO 문자열) | inspection.desired_date (DATE), desired_time (VARCHAR) | 정합 필요 | API가 "2026-02-01T00:00:00"이면 날짜/시간 분리 저장. |
| 파일 ID | fileId (숫자) | user_file_id (BIGINT) | 일치 | |
| nextStep | 응답 필드 (숫자) | seller_dealer.next_step (INT) | 일치 | |

---

## 상태·열거 정합성 (API enum ↔ DB enum 일치)

API 응답/요청의 상태·열거 값은 ERD 컬럼에 저장되는 값과 **동일한 enum**을 사용한다.

| 도메인 | API (camelCase) | ERD (snake_case) | API·DB 공통 값 목록 |
|--------|-----------------|------------------|----------------------|
| 딜러 인증 | dealerVerificationStatus | seller_dealer.status | DRAFT, SUBMITTED (DB 추가: APPROVED, REJECTED) |
| 차량 | status | vehicle.status | DRAFT, LISTABLE, HIDDEN, DELETED |
| 차량 표시 | displayStatus | vehicle.display_status | 화면용 한글("등록완료", "검차완료" 등) |
| 검차 | (최신 검차) status | inspection.status | REQUESTED, MATCHING_*, IN_PROGRESS, COMPLETED, CANCELED |
| 연료 | fuel | vehicle.fuel_type | GASOLINE, DIESEL 등 |
| 변속기 | transmission | vehicle.transmission_type | AT, MT, CVT 등 |

---

## 검차 플로우 관련 필드/상태/열거 매핑 (Figma IA §3.6 기준)

※ FIGMA_IA_FSD_STRUCTURE.md §3.6.9 및 Figma MCP get_screenshot 검증 기반. UI 라벨과 API/ERD enum 대응표.

### 엔티티별 화면·필드 매핑

| 화면(역할) | nodeId | 관련 엔티티/필드 | API 엔드포인트 |
|------------|--------|------------------|----------------|
| 검차 신청 Step1 | 1444:8198 | vehicle, inspection_place(placeId, address, lat, lng), inspection(desired_date, desired_time), payment | POST /vehicles/:vehicleId/inspections |
| 검차 요청 내역(목록) | 1425:9445, 9661, 9875 | inspection(status, desired_date, address), vehicle(vehicle_no, model_name), 일련번호 | GET /vehicles?inspectionStatus=… 또는 검차 목록 전용 REST 확장 |
| 검차 진행 현황 | 1425:10137, 10663, 10813 | inspection.status, inspection_place, 검차자 정보 | GET /vehicles/:vehicleId/inspections/latest |
| 검차 결과 요약/상세 | 1425:10285, 10443 | inspection 결과, 양호/경미/주의/불량 개수, inspection_item·미디어 | GET /vehicles/:vehicleId/inspections/latest 또는 GET /inspections/:id (확장 시) |

### UI 라벨 ↔ inspection.status 매핑

| UI 라벨(Figma) | API/ERD 제안값 | 비고 |
|----------------|----------------|------|
| 임시저장 | DRAFT | |
| 임시저장 (중복됨) | DRAFT_DUPLICATE | **TODO**: ERD/API 확장 시 추가. needs_domain_decision |
| 검차자 매칭 중 | REQUESTED 또는 MATCHING_IN_PROGRESS | |
| 검차자 매칭완료 | MATCHING_COMPLETED | |
| 검차중 | IN_PROGRESS | |
| 검차완료 | COMPLETED | |
| 차량보관 | STORAGE 또는 ARCHIVED | **TODO**: ERD enum 확장 시 반영 |

### 추가/수정 필요 항목 (TODO)

| 항목 | 유형 | 설명 |
|------|------|------|
| GET /inspections 또는 검차 목록 전용 REST | API 추가 필요 | 목록 화면(9445/9661/9875) 상태 필터·페이징용. 현재는 GET /vehicles로 차량 기준 조회만 명세됨. |
| inspection.status enum 확장 | ERD/API | DRAFT_DUPLICATE, STORAGE(차량보관) UI 반영 시 enum 값 정의. |
| 검차 결과 상세(양호/경미/주의/불량) | API 응답 필드 | result_summary, item_counts 등 검차 결과 요약 필드 명세 확장. |
| schedule.requestDate 형식 | doc_typing_miss | API "2026-02-01T00:00:00" vs ERD desired_date(DATE)+desired_time(VARCHAR) 타입 정합. |

---

## 판매방식 선택 관련 필드/상태/enum·엔드포인트 (초안)

※ FIGMA_IA_FSD_STRUCTURE.md §3.5.8·Figma MCP get_screenshot(1368:41154, 1368:41309) 기반. 판매방식 선택은 현재 **네비게이션만** 수행하며, 전용 API·ERD 필드는 없음.

### 역할별 엔티티/필드

| 역할 | 관련 엔티티/필드 | 현재 API/ERD | 비고 |
|------|------------------|--------------|------|
| 판매방식 선택 화면 | vehicle(해당 차량) | GET /vehicles/:id | 차량 상세 내 섹션. 선택 시 라우트만 변경. |
| 선택 시 저장 | sale_mode / sale_type | **없음** | 도메인 결정: 선택 시 PATCH로 저장할지 여부. |

### 상태·열거값 제안 (추가 시)

| UI 라벨(Figma) | API/ERD 제안값 | 비고 |
|----------------|----------------|------|
| 일반 판매 | GENERAL | sale_mode 또는 sale_type enum |
| 경매 | AUCTION | 동일 |

### API 엔드포인트

| 동작 | 현재 | 제안(도메인 결정 후) |
|------|------|----------------------|
| 선택 시 저장 | 없음(프론트 라우트만) | PATCH /vehicles/:id body에 `sale_mode: "GENERAL" \| "AUCTION"` 추가 검토 |
| 선택 화면 데이터 | GET /vehicles/:id 기존 응답 | vehicle.sale_mode 응답 포함 시 화면에서 "이미 선택됨" 등 표시 가능 |

### 정리

- **현재**: 판매방식 선택은 VehicleDetailPage에서 "판매 방식을 선택하세요" 섹션(SCR-0300)으로 구현되며, 일반 판매 클릭 → `/vehicles/:id/sale/analyzing`, 경매 클릭 → `/vehicles/:id/auction`으로 이동. **API 호출 없음.**
- **추가 필요 시**: vehicle 테이블에 `sale_mode`(또는 `sale_type`) ENUM 컬럼, API 명세에 PATCH /vehicles/:id 요청 body 확장. CarivDealer_api_v1.md에 "선택은 프론트 라우트만, API 없음" 또는 "추가 검토" 반영.

---

## 차량 목록/일반 거래 관련 필터·정렬·상태 매핑 (초안)

※ FIGMA_IA_FSD_STRUCTURE.md §3.4·FIGMA_GLOBAL_PLAN.md §2.7·Figma MCP get_screenshot(1418:15486 자식 13프레임) 기준. VehicleListPage ↔ GET /vehicles·POST /vehicles/search 연동.

### UI 필터/정렬 항목 ↔ API 쿼리 파라미터 ↔ ERD 필드

| UI 필터/정렬 항목 | API 쿼리 파라미터 | ERD 필드 | 타입/enum |
|-------------------|-------------------|----------|-----------|
| 상태(전체/임시저장/등록완료) | status, filter | vehicle.status | DRAFT, LISTABLE, HIDDEN, DELETED 등 |
| 검색(차량번호/모델명) | q 또는 POST /vehicles/search filters | vehicle.vehicle_no, model_name, brand | string |
| 뷰(그리드/리스트) | view | (클라이언트만) | grid \| list |
| 페이지 | page, size | — | number |
| 정렬 | sort (createdAt,DESC 등) | vehicle.created_at 등 | API 명세 §3 참고 |
| 확인 필요차량 | needsAttention=1 (또는 inspectionStatus) | vehicle.status, latest_inspection_status | draft/inspection 등 |

### UI 라벨 ↔ vehicle.status / displayStatus / primaryCta

| UI 라벨(Figma/코드) | API/ERD 제안값 | 비고 |
|---------------------|----------------|------|
| 임시저장됨 | DRAFT | filter=draft |
| 등록완료 | LISTABLE, HIDDEN 등 | filter=completed 시 completed·active_sale·sold 매핑 |
| 전체 | ALL 또는 미지정 | status 쿼리 생략 |
| displayStatus 한글 | 계산값 | "등록완료", "검차완료", "검차 신청 임시저장" 등 |
| primaryCta | 계산값 | "검차신청", "매물등록" 등 목록 카드 주 액션 |

### TODO (추가 필요 시)

- GET /vehicles 쿼리 파라미터 목록(status, inspectionStatus, sort 필드/방향, page, size)을 CarivDealer_api_v1.md에 명시.
- needsAttention 쿼리 정의: 클라이언트 필터(draft·inspection)만 사용 시 API 확장 여부 도메인 결정.
- URL 쿼리 동기화: VehicleListPage에서 useSearchParams로 filter, view, page 반영 여부 코드 검토.

---

## 경매 플로우 관련 필드/상태/엔드포인트 (제안)

**(Figma MCP get_screenshot 기반 검증)** — 섹션 1418:20497 자식 14프레임 검증(2026-02-08) 결과, 경매 사전 설정(1418:23705, 23880)·거래 상세·구매 제안·판매 방식 변경 모달 등 UI와 연계할 필드/상태 제안.

| 역할 | 엔티티/필드 | 상태/enum | 설명 |
|------|--------------|-----------|------|
| 시작가 설정 | auction.start_price (또는 동일 목적 필드) | number | 경매 시작 금액. UI: "경매 시작가는 N 만원으로 설정할게요." |
| 즉시 판매가 | auction.buy_now_price 또는 vehicle 관련 | number | 즉시 구매가. UI: "즉시 판매가는 N 만원으로 설정할게요." |
| 기간 설정 | auction.start_at / end_at | datetime | 경매 시작/종료. AuctionDurationPage 대응. |
| 경매 상태 표시 | auction.status | DRAFT / ACTIVE / COMPLETED 등 | UI 라벨("경매 진행 중", "거래완료")과 매핑. |
| 판매방식 | vehicle.sale_mode | GENERAL / AUCTION | §3.5.8·ERD 기존 제안과 통일. "현재 경매 판매로 거래 중입니다." |
| 구매 제안/입찰 | auction_bid 또는 offer | bid_amount, status(만료됨 등) | UI "구매 제안" 목록·수락/거절. |

**추가 제안 (API/ERD)**  
- CarivDealer_api_v1.md: 경매·검차 목록 등 REST가 현재 미포함. **POST /auctions** 또는 **POST /vehicles/:id/auction** (경매 생성), **PATCH /auctions/:id** (시작가·기간·즉시판매가 수정), **GET /vehicles/:id** 응답에 sale_mode·auction 요약 포함 여부 명시 권장.  
- ERD: **auction** 테이블(auction_id, vehicle_id(FK), start_price, buy_now_price, start_at, end_at, status 등), **auction_bid** 또는 offer 테이블 정의 시 위 enum·UI 라벨과 일치시키기. vehicle.sale_mode와 auction 존재 관계(1:1 등) 도메인 결정.

---

## 물류/탁송 플로우 관련 필드/상태/엔드포인트 (제안)

**(Figma MCP get_screenshot 기반 검증)** — 섹션 1418:25059 자식 11프레임 검증(2026-02-08) 결과, 물류 스케줄 목록·탁송 신청·새 탁송 예약·탁송 신청 완료(타임라인)·내역·PIN 인계와 연계할 필드/상태 제안.

| UI 필드/상태 | API/쿼리 파라미터 | ERD 필드 | enum/타입 |
|--------------|-------------------|----------|-----------|
| 배송 상태(탁송 신청/매칭 중/매칭완료/완료/취소) | status | logistics.status | LOGISTICS_STATUS (scheduled, dispatched, in_transit, completed, canceled) |
| 픽업/배송 예정일 | scheduled_date, schedule_time | logistics.scheduled_at (또는 scheduled_date + time) | datetime |
| 운송사/기사 | carrier, driver | logistics.carrier_id 등 | FK, driver_name, driver_phone |
| 주소(탁송 장소) | address, zip_code, detail_address | logistics.pickup_address, zip_code, detail_address | string |
| PIN 인계 | pin (요청 body) | logistics.pin 또는 handover 인증 | 6자리 등 |

**UI 라벨 ↔ status enum**  
탁송 신청 → scheduled; 탁송 매칭 중/매칭완료 → dispatched 또는 in_transit; 탁송 완료 → completed; 취소 → canceled.

**엔드포인트 제안**  
- GET /logistics/schedule — 스케줄 목록(쿼리: status, date_from, date_to, page, size)  
- POST /logistics/schedule — 새 탁송 예약 생성(장소·일정·결제 정보)  
- GET /logistics/history — 탁송 내역 목록  
- GET /logistics/:id — 탁송 상세(기사 방문 확정·타임라인)  
- POST /logistics/:id/handover-approve — PIN 인계 승인 (또는 handoverApproveAPI 대응)

**ERD 제안**  
- **logistics_schedule** 또는 **logistics** 테이블: id, vehicle_id(FK), scheduled_at, pickup_address, zip_code, detail_address, status, carrier_id(FK), driver_name, driver_phone, pin(암호화), handover_at, created_at, updated_at 등.  
- status enum: scheduled, dispatched, in_transit, completed, canceled.

---

## 정산/매출 플로우 관련 필드/상태/엔드포인트 (제안)

**(Figma MCP get_screenshot 기반 검증)** — 섹션 1418:33275 자식 4프레임 검증(2026-02-08) 결과, 정산 목록·정산 상세·정산 현황·매출 히스토리와 연계할 필드/상태 제안.

| UI 필드/상태 | API/쿼리 파라미터 | ERD 필드 | enum/타입 |
|--------------|-------------------|----------|-----------|
| 정산 상태(정산 대기/정산 완료/지급 완료) | status | settlement.status | SETTLEMENT_STATUS (pending, completed, paid) |
| 정산 금액/최종금액 | — | settlement.total_amount, settlement.final_amount | number |
| 정산 대상 기간 | from, to | settlement.period_start, period_end | datetime |
| 매출 유형(일반/경매) | type | sales_history.sale_type | SALE_TYPE (general, auction) |
| 판매가·검차/탁송비·정산금액·정산일 | — | settlement.sale_price, inspection_delivery_fee, final_amount, settlement_date | number, date |

**UI 라벨 ↔ status enum**  
정산 대기 → pending; 정산 완료 → completed; 지급 완료 → paid.

**엔드포인트 제안**  
- GET /settlements — 정산 목록(쿼리: status, from, to, page, size)  
- GET /settlements/:id — 정산 상세(차량 정보·검차 피드백·정산 테이블)  
- GET /sales/history — 매출/정산 히스토리(기간·유형·집계)

**ERD 제안**  
- **settlement** 테이블: id, vehicle_id(FK), dealer_id(FK), sale_price, settlement_amount, platform_fee, vat_refund, final_amount, logistics_fee, inspection_fee, settlement_date, settlement_status, bank_account, account_holder, created_at, updated_at 등.  
- **settlement_item** (필요 시): 건별 항목.  
- **sales_history** (또는 판매 내역 뷰): vehicle_id, sale_date, sale_price, sale_type(general/auction), buyer_name 등.  
- status enum: pending, completed, paid.

---

## 오퍼/마이페이지 플로우 관련 필드/상태/엔드포인트 (제안)

**(Figma MCP get_screenshot 기반 검증)** — 섹션 1418:36765 자식 12프레임 검증(2026-02-08) 결과, 오퍼 목록·수락/거절 및 마이페이지(프로필·계정·딜러 승인·정산 계좌·알림·문의)와 연계할 필드/상태 제안.

| UI 필드/상태 | API/쿼리 파라미터 | ERD 필드 | enum/타입 |
|--------------|-------------------|----------|-----------|
| 오퍼 상태(진행중/만료/거절/수락) | status | offer.status | OFFER_STATUS (pending, expired, rejected, accepted) |
| 오퍼 금액 | — | offer.price, offer.amount | number |
| 오퍼 만료일 | expires_at | offer.expires_at | datetime |
| 딜러 승인 상태(승인완료/대기/반려) | — | dealer.approval_status | APPROVAL_STATUS |
| 프로필(이메일·성함·생년월일·휴대폰·주소) | — | user, dealer, seller_dealer_address | string, date |
| 정산 계좌(국가·은행명·계좌번호·예금주) | — | seller_settlement_account | 기존 ERD 참고 |
| 알림 설정(검차·경매·계약·정산·구매 제안) | — | user_notification_preference 등 | boolean/토글 |

**엔드포인트 제안**  
- GET /offers — 오퍼 목록(쿼리: status, vehicle_id, page, size)  
- GET /offers/:id — 오퍼 상세  
- POST/PATCH /offers/:id/accept, /offers/:id/reject — 수락·거절 (또는 acceptProposalAPI 대응)  
- GET /me — 현재 사용자·프로필 요약  
- GET/PATCH /dealer/profile — 딜러 프로필·기본 정보 수정  
- GET /dealer/approval-status — 딜러 승인 상태 확인  
- GET/PATCH /mypage/settlement-account — 정산 계좌 조회·등록/변경  
- GET/PATCH /mypage/notifications — 알림 설정

**ERD 제안**  
- **offer** 테이블(일반 판매 제안): id, vehicle_id(FK), bidder_id(FK), amount, status, expires_at, created_at 등. status enum: pending, expired, rejected, accepted.  
- 마이페이지·프로필·딜러 승인: seller_dealer, user_profile, seller_settlement_account 등 기존 ERD 확장. 알림 설정용 테이블 도메인 결정 시 추가.

---

## 문서 이력

| 버전 | 일자 | 비고 |
|------|------|------|
| 1.0 | 2026-02-07 | 요약 섹션(API-only, DB-only, 파생값), needs_domain_decision 규칙 및 불확실 항목 표 추가. 엔드포인트–테이블·필드 매핑 요약. |
| 1.1 | 2026-02-07 | ERD 테이블·컬럼 목록(API 범위), 타입·제약 대조, 상태·열거 정합성 섹션 추가. API-only 목록 이미지 ERD 재확인 반영. 불일치·갭 상세는 [CarivDealer_API_ERD_Consistency_Report.md](CarivDealer_API_ERD_Consistency_Report.md) 참고. |
| 1.2 | 2026-02-07 | 정합성 검증 요약 표 추가(1:1 매핑·상태 enum 일치·계산값 명시). §3 제목을 "계산값"으로 통일, 필드 수준 매핑 표에 계산값 표기. 상태·열거 정합성에 "API enum ↔ DB enum 일치" 명시. |
| 1.3 | 2026-02-07 | 검차 플로우 관련 필드/상태/열거 매핑 섹션 추가. Figma IA §3.6·get_screenshot 기반 UI 라벨↔inspection.status 매핑, 엔티티별 화면·필드 표, TODO(API 확장·enum·타입 정합) 반영. |
| 1.4 | 2026-02-07 | 판매방식 선택 관련 필드/상태/enum·엔드포인트 초안 추가. §3.5.8·get_screenshot(1368:41154, 1368:41309) 기준. 현재 네비게이션만, sale_mode 저장 시 PATCH 제안. |
| 1.5 | 2026-02-07 | 차량 목록/일반 거래(1418-15486) 필터·정렬·상태 매핑 섹션 추가. §3.4·§2.7·get_screenshot(13프레임) 기준. UI↔API↔ERD 표, TODO. |
| 1.6 | 2026-02-08 | 경매 플로우 관련 필드/상태/엔드포인트 제안 섹션 추가. Figma MCP get_screenshot(1418:20497 자식 14프레임) 기반. auction·auction_bid 엔티티 및 API 확장 제안. |
| 1.7 | 2026-02-08 | 물류/탁송 플로우 관련 필드/상태/엔드포인트 제안 섹션 추가. Figma MCP get_screenshot(1418:25059 자식 11프레임) 기반. logistics 테이블·status enum·UI 라벨·엔드포인트 제안. |
| 1.8 | 2026-02-08 | 정산/매출 플로우 관련 필드/상태/엔드포인트 제안 섹션 추가. Figma MCP get_screenshot(1418:33275 자식 4프레임) 기반. settlement·sales_history·SETTLEMENT_STATUS·엔드포인트 제안. |
| 1.9 | 2026-02-08 | 오퍼/마이페이지 플로우 관련 필드/상태/엔드포인트 제안 섹션 추가. Figma MCP get_screenshot(1418:36765 자식 12프레임) 기반. offer·OFFER_STATUS·마이페이지·프로필·딜러 승인·정산 계좌·알림·엔드포인트 제안. |
| 1.10 | 2026-02-08 | Figma 참조 정리: 정합성 검증 요약 표에서 Global Plan §2.5/§2.4 제거. 검차·일반판매는 IA §3.6·§3.7만 참조, 차량목록·탁송·정산·마이페이지는 IA §3.x·Global Plan §2.7~2.11·IA_FSD_COMPLETE_VERIFICATION 통합 인덱스 반영. |