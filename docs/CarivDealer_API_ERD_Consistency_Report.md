# CarivDealer API ↔ ERD 정합성 리포트

**목적**: [CarivDealer_api_v1.md](CarivDealer_api_v1.md)와 ERD(erd/IMG_3923.png) 간 불일치·갭 목록 및 권장 조치.  
**기준**: [CarivDealer_API_ERD_Mapping.md](CarivDealer_API_ERD_Mapping.md)의 매핑·요약 섹션.  
**검토 일자**: 2026-02-07.

---

## 1. 불일치 목록

| ID | 구분 | API / ERD | 불일치 내용 | 우선순위 |
|----|------|-----------|-------------|----------|
| M01 | 필드명 | dealerVerificationStatus ↔ seller_dealer.status | API는 camelCase, ERD는 snake_case. 값(DRAFT, SUBMITTED)은 동일. | Low |
| M02 | 타입 | schedule.requestDate (API) ↔ desired_date, desired_time (ERD) | API는 단일 datetime 문자열, ERD는 DATE + VARCHAR(시간). 분리 저장 규칙 필요. | Medium |
| M03 | 컬럼명 | transmission (API) ↔ vehicle.transmission_type (ERD) | API 필드명과 ERD 컬럼명 상이. | Low |
| M04 | 주소 | officeAddress (API) ↔ seller_dealer_address | API는 placeId, detailAddress. ERD에는 address, zip_code, lat, lng 등 추가. API에 full address 노출 여부 미정. | Low |

---

## 2. 갭 목록

### 2.1 API에 있으나 ERD에 없는 컬럼

| API 필드 | 용도 | 권장 조치 |
|----------|------|-----------|
| pledge.agreed | 서약 동의 (문서상) | **ERD 보완**: seller_dealer_pledge에 `agreed` (BOOLEAN) 추가 검토. 또는 association_member/signature_text로 충족 여부 도메인 결정. needs_domain_decision: domain_model_revision. |

### 2.2 ERD에 있으나 API에 노출되지 않는 필드

| ERD 테이블.컬럼 | 용도 | 권장 조치 |
|-----------------|------|-----------|
| seller_user.last_login_at | 마지막 로그인 시각 | API 확장 시 선택적 노출. 현재는 미노출 유지 가능. |
| seller_dealer.approval_status, reject_reason | 승인/반려 상세 | 운영·정산 화면에서 필요 시 API 응답에 포함 검토. needs_domain_decision: domain_model_revision. |
| seller_dealer_address.address, zip_code, lat, lng | 주소 상세 | PUT /signup/dealer에서 officeAddress 확장 시 검토. |
| user_file.url, original_name, content_type, size | 파일 메타 | GET 파일 정보 API 또는 응답 보강 시 포함. |
| vehicle.created_at, updated_at | 감사 | 목록 정렬(sort=createdAt)에 사용. API 필드명 명시 권장. |
| inspection.desired_date, desired_time | 검차 희망일시 | 이미 매핑. API requestDate 형식만 통일. |
| auth_refresh_token.expires_at | 토큰 만료 | 클라이언트 갱신 로직용. 필요 시 API에 expiresIn 등 노출. |

---

## 3. 우선순위별 권장 조치

| 우선순위 | 항목 | 조치 유형 | 조치 내용 |
|----------|------|-----------|-----------|
| **Critical** | (없음) | — | 현재 범위에서 구현 차단 요인 없음. |
| **High** | §1.2 "ERD에 없는 데이터" 오기 | 문서 정리 | 이미지 ERD에 business_type, business_info_type, dealer_employee_card_no, status 존재. API 명세 §1.2에서 해당 항목 제거, pledge.agreed·tokens만 유지. |
| **Medium** | schedule.requestDate ↔ desired_date/desired_time | API 명세 보완 | 검차 신청 API에 "requestDate: ISO 8601 date 또는 date+time" 명시. 백엔드에서 desired_date, desired_time 분리 저장 규칙 문서화. |
| **Medium** | pledge.agreed | ERD 보완 또는 도메인 결정 | 서약 동의를 별도 컬럼으로 둘지, 기존 필드로 충족할지 PO/도메인 오너 결정. |
| **Low** | dealerVerificationStatus ↔ status | 문서 정리 | 매핑 문서에 "dealerVerificationStatus ↔ seller_dealer.status" 명시 완료. |
| **Low** | transmission vs transmission_type | 문서 정리 | 매핑 문서에 필드명 대응 명시. |
| **Low** | DB-only 필드 노출 | API 확장 | 필요 시 정산·운영·마이페이지 API에서 approval_status, reject_reason 등 노출. |

---

## 4. 문서 정리 반영 사항

- **CarivDealer_api_v1.md §1.2**: "ERD에 없는 데이터"를 이미지 ERD 기준으로 수정. businessType, businessInfoType, employeeCardNumber, dealerVerificationStatus는 ERD에 있으므로 제거. pledge.agreed, tokens(Redis)만 유지.
- **CarivDealer_API_ERD_Mapping.md**: ERD 테이블·컬럼 목록, 타입·제약 대조, 상태·열거 정합성 섹션 추가 완료.

---

## 5. 의존성 및 리스크

- **ERD 이미지 해석**: IMG_3923.png의 일부 컬럼이 다이어그램에서 누락·축약되었을 수 있음. 불확실 시 원본 제공자 확인.
- **미포함 API**: 탁송·정산·거래·경매 등은 본 검토 범위 외. 해당 ERD(deal, deal_contract, delivery, settlement)와의 정합성은 2차 검토.

---

**문서 이력**

| 버전 | 일자 | 비고 |
|------|------|------|
| 1.0 | 2026-02-07 | API-ERD 정합성 플랜 실행 결과. 불일치·갭·권장 조치 정리. |
