# 태스크 플랜 — 식별 문제 해결 및 스크린샷 기준 최종 검수

**프로젝트**: ForwardMax (carivdealer)  
**작성일**: 2026-01-28  
**기준**: ERD 이미지(`erd/IMG_3923.png`), `SINGLE_DB_ERD_API_INSIGHT.md`, `ERD_COMPARISON_REPORT.md`

---

## 1. dev:skip 버튼 (구현 완료)

### 1.1 요구사항

- **위치**: 좌하단 고정
- **역할**: 필수 입력 항목을 스킵하고 다음 단계로 진행할 수 있는 개발용 장치

### 1.2 구현 내용

| 항목 | 내용 |
|------|------|
| **컨텍스트** | `src/shared/context/DevSkipContext.tsx` — `skipRequired` 전역 상태, `localStorage` 키 `dev_skip_required`로 유지 |
| **플로팅 버튼** | `src/shared/ui/DevSkipFloatingButton.tsx` — `fixed bottom-6 left-6`, 라벨 `dev:skip ON/OFF` |
| **연동** | `main.tsx`에 `DevSkipProvider` 래핑, `router.tsx`에서 모든 화면에 `DevSkipFloatingButton` 렌더 |
| **적용 페이지** | 검차 신청 Step1(`InspectionRequestStep1Page`): `skipRequired` 시 날짜/시간/장소 미입력해도 다음으로 이동. 차량 등록 Step1(`VehicleRegisterStep1Page`): `skipRequired` 시 차량번호 없이 OCR 호출 가능 |

### 1.3 최종 검수 (스크린샷 기준)

- [ ] **스크린샷 1**: 로그인/랜딩/대시 중 임의 화면 — 좌하단에 `dev:skip OFF` 버튼 노출
- [ ] **스크린샷 2**: `dev:skip` 클릭 후 — 버튼이 `dev:skip ON`으로 변경
- [ ] **스크린샷 3**: 검차 신청 Step1 — 필수 미입력 상태에서 `다음` 클릭 시 `skipRequired === false`면 알럿, `true`면 step2로 이동
- [ ] **스크린샷 4**: 차량 등록 Step1 — 차량번호 비워둔 상태에서 OCR 버튼 클릭 시 `skipRequired === false`면 알럿, `true`면 OCR 호출(또는 다음 동작)

---

## 2. 식별된 문제 해결 태스크 플랜

### 2.1 Critical — 주문·결제·에러 계약

| ID | 태스크 | 상세 | 완료 |
|----|--------|------|------|
| T1-1 | `orders` 컬렉션 추가 | Firestore 컬렉션 `orders` 생성. ERD 필드: `platform_id`, `listing_id`, `buyer_id`, `seller_id`, `vehicle_id`, `order_type`, `status`, `total_price`, 타임스탬프. `firestore.indexes.json` 복합 인덱스 추가. | [ ] |
| T1-2 | `payments` 컬렉션 추가 | Firestore 컬렉션 `payments` 생성. `order_id`, `amount`, `method`, `status`, `pg_transaction_id`, `paid_at`, `platform_id`. Rules·인덱스 반영. | [ ] |
| T1-3 | Order/Payment API | 주문 생성·조회·상태 변경, 결제 요청·상태·환불 API. `API_SPECIFICATION_v2.md` 및 `apiEndpoints.ts`에 추가. Functions 구현. | [ ] |
| T1-4 | 에러 응답 RFC 9457 | Functions 공통 에러 래퍼: HTTP 4xx/5xx + RFC 9457 형식(`type`, `status`, `title`, `detail`, `instance`, `traceId`). API 명세에 에러 코드 enum·매핑 문서화. | [ ] |
| T1-5 | Firestore Rules (orders, payments) | `orders`, `payments` 경로에 `request.auth` + `resource.data.platform_id` 검증 규칙 추가. | [ ] |

### 2.2 High — 매물·주소·플랫폼 필드

| ID | 태스크 | 상세 | 완료 |
|----|--------|------|------|
| T2-1 | `listings` 정책 확정 | `trades` 확장 vs `listings` 신규 결정. 결정 반영 후 ERD listing 필드·`platform_id` 반영. | [ ] |
| T2-2 | `addresses` 컬렉션 | user/member 기준 주소 CRUD. `platform_id`, `user_id`, `address_type`, 주소·좌표 필드. Rules·인덱스. | [ ] |
| T2-3 | 기존 컬렉션 `platform_id` | `vehicles`, `inspections`, `auctions`, `trades`, `logistics`, `settlements`에 `platform_id`(또는 source) 필드 추가. 마이그레이션 스크립트 또는 기본값. | [ ] |

### 2.3 Medium — 리뷰·서류·OpenAPI

| ID | 태스크 | 상세 | 완료 |
|----|--------|------|------|
| T3-1 | `reviews` 컬렉션 | `order_id`, `reviewer_id`, `reviewee_id`, `rating`, `content`, `platform_id`. API·Rules. | [ ] |
| T3-2 | `seller_docs` 컬렉션 | `seller_id`, `doc_type`, `file_url`, `status`, `platform_id`. API·Rules. | [ ] |
| T3-3 | OpenAPI 명세 | `API_SPECIFICATION_v2.md` → OpenAPI 3.0 YAML/JSON. 스키마는 `DATABASE_ERD_SCHEMA.md` 엔티티와 매핑. 에러 스키마 RFC 9457. | [ ] |

### 2.4 Low — 외부 연동·모니터링

| ID | 태스크 | 상세 | 완료 |
|----|--------|------|------|
| T4-1 | CarsOfKorea 연동 스키마 | ERD의 CarsOfKorea_vehicle/listing/auction/auction_bid. `external_id`, `sync_status`, `platform_id`. | [ ] |
| T4-2 | 에러 traceId/로깅 | 모든 API 에러 응답에 `traceId`(또는 `instance`) 포함. 로그에 `platform_id`, `request_id`. | [ ] |

---

## 3. 스크린샷 기준 최종 검수 체크리스트

### 3.1 공통

- [ ] **좌하단 dev:skip 버튼**: 모든 화면에서 고정 좌하단에 노출, ON/OFF 토글 동작
- [ ] **dev:skip ON 시**: 필수 미입력 상태에서도 다음 단계/제출 가능 (검차 Step1, 차량 등록 Step1 등)

### 3.2 화면별 검수 (스크린샷 촬영 권장)

| 화면 | 경로 | 검수 항목 | 스크린샷 |
|------|------|-----------|----------|
| 랜딩 | `/` | 헤더·GNB·dev:skip 버튼 노출 | [ ] |
| 로그인 | `/login` | 이메일/비밀번호 필드, dev:skip | [ ] |
| 대시(차량 목록) | `/vehicles` | 차량 목록·사이드바·dev:skip | [ ] |
| 차량 등록 Step1 | `/vehicles/new/step1` | 차량번호·OCR·필수 표시·dev:skip ON 시 OCR/다음 가능 | [ ] |
| 차량 등록 Step2 | `/vehicles/new/step2` | 진행·dev:skip | [ ] |
| 검차 신청 Step1 | `/inspections/request/step1` | 날짜/시간/장소 필수·dev:skip ON 시 다음 가능 | [ ] |
| 검차 신청 Step2 | `/inspections/request/step2` | 평가사 선택·dev:skip | [ ] |
| 검차 목록 | `/inspections` | 목록·dev:skip | [ ] |
| 탁송 일정 | `/logistics/schedule` | dev:skip | [ ] |
| 정산 목록 | `/settlements` | 목록·dev:skip | [ ] |
| 회원가입 Step1~5 | `/signup/step1` ~ `step5` | 필수 입력·dev:skip (필요 시 동일 패턴 적용) | [ ] |

### 3.3 검수 완료 기준

- **필수**: dev:skip 버튼 좌하단 노출·토글·검차 Step1/차량 등록 Step1에서 스킵 동작 확인
- **권장**: 위 표의 각 화면별 스크린샷 1장 이상 보관 후 체크리스트 완료

---

## 4. 참고

- **ERD·단일 DB·API 인사이트**: `docs/SINGLE_DB_ERD_API_INSIGHT.md`
- **ERD 정합성 비교**: `docs/ERD_COMPARISON_REPORT.md`
- **DB 스키마 명세**: `docs/DATABASE_ERD_SCHEMA.md`
