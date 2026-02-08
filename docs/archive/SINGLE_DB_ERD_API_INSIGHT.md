# 단일 DB·ERD·API 정합성 및 인사이트

**프로젝트**: ForwardMax (carivdealer)  
**문서 버전**: 2.0  
**작성일**: 2026-01-28  
**최종 업데이트**: 2026-01-28 (웹 그라운딩 + 최종 플랜 반영)  
**대상**: 딜러웹 + 외부 플랫폼 3개, 단일 DB 전환  
**기준**: ERD 이미지(`erd/IMG_3923.png`) · API 명세 · 현시점 코드베이스 · 웹 모범 사례

---

## 1. 현시점 기준선 정리

### 1.1 기준 문서/아티팩트

| 구분 | 아티팩트 | 역할 |
|------|----------|------|
| **데이터 모델** | `erd/IMG_3923.png` | 원본 ERD (관계형 설계, 21개 테이블) |
| **API 플랜** | `docs/API_SPECIFICATION_v2.md` | 엔드포인트·에러·스키마 (Swagger 형식 아님, 마크다운 명세) |
| **스키마 문서** | `docs/DATABASE_ERD_SCHEMA.md` | ERD → Firestore 매핑, 컬렉션/필드 정의 |
| **코드** | `src/`, `functions/` | 프론트·백엔드 실제 구현 |

**참고**: 코드베이스에는 Swagger/OpenAPI 파일이 없음. API 플랜은 `API_SPECIFICATION_v2.md`가 담당.

---

## 2. 정합성(Consistency) — ERD ↔ API ↔ 코드

### 2.1 ERD(이미지) ↔ 스키마 문서

- **문서(DATABASE_ERD_SCHEMA.md)**는 원본 ERD(이미지) 기준으로 21개 엔티티·관계·상태 전이를 반영해 재작성됨.
- **정합성**: 문서 ↔ ERD 이미지 **맞춤 완료**.

### 2.2 ERD(이미지) ↔ API 명세

| ERD 엔티티/플로우 | API_SPECIFICATION_v2.md 반영 | 비고 |
|-------------------|------------------------------|------|
| vehicle, inspection | ✅ inspectionRequestAPI, inspectionAssignAPI, uploadResult, getResult | 검차 플로우 일치 |
| auction, auction_bid | ✅ bidAPI, buyNowAPI | 경매·입찰·즉구 반영 |
| listing / trade | ✅ changeSaleMethodAPI, acceptProposalAPI | 매물·제안 수락 (listing은 trades로 매핑) |
| delivery / logistics | ✅ logisticsScheduleAPI, dispatch, handover | 탁송 플로우 반영 |
| settlement | ✅ settlementNotifyAPI | 정산 알림 반영 |
| **order** | ❌ 전용 API 없음 | 주문 생성/상태/이력 API 미정의 |
| **payment** | ❌ 전용 API 없음 | 결제 요청/상태/환불 API 미정의 |
| **listing** (매물 CRUD) | ❌ 별도 API 없음 | 차량 등록·판매방식 변경으로 일부 커버 |
| **address** | ❌ 없음 | 주소 CRUD/검증 API 없음 |
| **review** | ❌ 없음 | 리뷰 API 없음 |
| **seller_docs** | ❌ 없음 | 서류 업로드/승인 API 없음 |

- **정합성**: ERD 상 **order, payment, listing, address, review, seller_docs** 에 해당하는 API가 명세에 없음.  
  → **API 플랜이 ERD보다 좁음.**

### 2.3 API 명세 ↔ 코드(백엔드)

- `apiEndpoints.ts` ↔ `functions/src/index.ts` export 이름은 대응됨.
- 구현된 Functions는 vehicle, inspection, auction, trade, logistics, settlement, report, config 등 **현재 API 명세 범위 내**에서 동작.
- **정합성**: “명세에 있는 것” 기준으로는 **일치**. 다만 명세에 없는 order/payment 등은 구현도 없음.

### 2.4 ERD(이미지) ↔ 코드(실제 저장소)

- **실제 사용 컬렉션**: `vehicles`, `inspections`, `auctions`, `trades`, `logistics`, `settlements`, `members`, `reports`.
- **ERD에는 있으나 컬렉션/코드 없음**: `orders`, `payments`, `listings`, `address(es)`, `reviews`, `seller_docs`.
- **정합성**: ERD의 **order·payment·listing·address·review·seller_docs** 는 아직 코드/DB에 미반영.

---

## 3. 무결성(Integrity)

### 3.1 참조 무결성

- **ERD**: order → listing, payment → order, delivery → order, settlement → order 등 **FK 관계 명시**.
- **현재 코드**: Firestore라 FK 없음. `vehicleId`, `inspectionId`, `auctionId`, `dealerId` 등 **참조 ID만** 사용.
- **리스크**:  
  - order/payment 미구현으로 **“주문 → 결제 → 배송 → 정산”** 이 한 트랜잭션/엔티티 체인으로 보장되지 않음.  
  - 단일 DB로 갈 때 **플랫폼별로 order/payment를 두면** 중복·불일치 가능.

**권장**:  
- 단일 DB 전제라면 **order, payment를 ERD대로 한 번만 두고**, 모든 플랫폼(딜러웹 포함)이 같은 컬렉션/스키마를 쓰도록 설계.  
- 참조 무결성은 **백엔드/Functions에서**  
  - order 생성 시 `listing_id`/`vehicle_id` 유효성 검사,  
  - payment 생성 시 `order_id` 유효성 검사  
  등으로 보완.

### 3.2 데이터 일관성

- **상태 전이**: ERD/문서에는 listing → order → payment → delivery → settlement 흐름이 있으나, 코드에는 **order/payment가 없어** “거래 완료 → 정산” 구간이 trades·vehicles 상태에만 의존.
- **리스크**: 정산·결제·주문이 여러 플랫폼에서 나뉘면 **동일 거래가 서로 다른 상태**로 저장될 수 있음.

**권장**:  
- **단일 DB**에서는 **order를 거래의 단일 진입점**으로 두고,  
  - 딜러웹·외부 3개 플랫폼 모두 “주문 생성/수정”을 같은 API·같은 컬렉션으로만 하도록 강제.  
- 정산·결제는 항상 `order_id` 기준으로만 생성.

---

## 4. 에러 처리(Error handling)

### 4.1 API 명세

- **API_SPECIFICATION_v2.md**: 공통 에러 코드(400, 401, 403, 404, 500), 응답 형식(`{ "error": "메시지" }`), 프론트/백 에러 처리 가이드 존재.
- **한계**:  
  - 에러 **코드 체계**(예: `ERR_ORDER_NOT_FOUND`, `ERR_PAYMENT_FAILED`) 미정의.  
  - 재시도/부분실패(결제 실패·배송 지연 등)에 대한 표준 응답 없음.

### 4.2 프론트엔드

- **errorHandler.ts**:  
  - `analyzeError`: 네트워크/타임아웃/4xx/5xx 구분, 사용자용 메시지 반환.  
  - `retryWithBackoff`, `isRetryableError`로 재시도 가능 에러 구분.
- **apiClient.ts**:  
  - 타임아웃, `response.ok` 실패 시 `analyzeError` 사용.  
  - Mock 폴백 시 `_isMockData` 플래그.
- **강점**: 네트워크/타임아웃/일반 4xx·5xx에 대한 **일관된 처리** 있음.

### 4.3 백엔드(Functions)

- **현재**: `throw new Error(...)` 사용. `functions.https.HttpsError` 등 **표준 HTTP 상태 코드·JSON 에러 본문**으로 일원화된 레이어는 보이지 않음.
- **리스크**:  
  - 클라이언트가 “항상 `{ error: string }`”를 기대하는데, Functions가 다른 형태로 반환하면 프론트 에러 분기 불일치.  
  - 4xx/5xx 구분이 명확하지 않으면 재시도/사용자 메시지 선택이 어려움.

**권장**:  
- 모든 Callable/HTTP Functions에서 **공통 에러 래퍼** 사용 (예: `HttpsError` 또는 동일한 JSON 형식).  
- API 명세에 **에러 코드 enum + HTTP status 매핑** 추가 (예: `ORDER_NOT_FOUND → 404`, `PAYMENT_FAILED → 402`).  
- 단일 DB·멀티 플랫폼 환경에서는 **플랫폼 ID + 요청 ID**를 에러 로그에 포함해 트레이싱 가능하게.

---

## 5. 단일 DB + 4개 플랫폼(딜러웹 + 3) 인사이트

### 5.1 ERD가 단일 DB의 계약

- **ERD 이미지** = “단일 DB에 어떤 엔티티가 있고, 어떻게 연결되는가”에 대한 **계약**.
- 딜러웹과 외부 3개 플랫폼이 **같은 DB**를 쓴다면:  
  - **테이블(컬렉션) 이름·필드·관계**는 ERD를 따라가야 하고,  
  - **플랫폼별로 order/payment/listing을 따로 두지 않는 것**이 무결성·정합성에 유리.

### 5.2 백엔드 정합 — ERD와 가야 하는 것

- **반드시 ERD와 맞춰야 하는 것**:  
  - **저장소 스키마**: 컬렉션/문서 구조가 ERD 엔티티·관계와 1:1 매핑 가능해야 함.  
  - **주문·결제·매물·정산**의 생명주기: ERD의 order → payment → delivery → settlement 순서를 코드/API에서도 지키는 것.
- **현재 갭**:  
  - `order`, `payment` 컬렉션·API·코드 없음.  
  - `listing`은 ERD에는 있으나 코드는 `trades`만 사용.  
  - `address`, `review`, `seller_docs` 미구현.

**권장 순서**:  
1. **order, payment** 컬렉션·API·Functions 구현 (ERD 필드/관계 준수).  
2. **listing** 정책 결정: `trades` 확장 vs `listings` 신규 컬렉션.  
3. **address, review, seller_docs**는 단일 DB에서 “어느 플랫폼에서 쓰는지”를 필드(예: `platform_id`)로 구분할 수 있게 설계.

### 5.3 플랫폼 구분 필드

- 단일 DB에서 **딜러웹 vs 외부 3개**를 구분하려면:  
  - 예: `orders.platform_id`, `payments.platform_id`, `listings.platform_id` (또는 `source`)  
  - 이렇게 하면 조회·정산·장애 추적 시 “어느 플랫폼에서 발생한 주문/결제인지” 명확.
- ERD 이미지에는 **platform/source** 필드가 없을 수 있으므로, **ERD 2.0** 또는 “단일 DB 확장 규칙” 문서에 위 필드 추가를 권장.

### 5.4 API 계약 — Swagger/OpenAPI 권장

- 현재는 **API_SPECIFICATION_v2.md**만 있음.  
- 단일 DB + 4개 플랫폼이면 **외부 플랫폼(예: CarsOfKorea)이 같은 API를 호출**할 가능성이 있음.  
- **Swagger/OpenAPI** 도입 시:  
  - ERD 엔티티(order, payment, listing 등)와 **요청/응답 스키마**를 명시적으로 연결 가능.  
  - 에러 응답 스키마·에러 코드를 한 문서에서 관리 가능.  
  - 코드 생성(sdk)·문서·테스트가 ERD·백엔드와 **한 번에 정합**되기 쉬움.

---

## 6. 요약 및 액션

### 6.1 정합성

- **ERD ↔ 스키마 문서**: 맞춤됨.  
- **ERD ↔ API 명세**: order, payment, listing, address, review, seller_docs 관련 API 부재.  
- **ERD ↔ 코드**: order, payment, listings, address, reviews, seller_docs 미구현.

### 6.2 무결성

- order/payment 미구현으로 “주문→결제→배송→정산” 체인이 코드 수준에서 보장되지 않음.  
- 단일 DB 전환 시 **order를 중심**으로 한 플로우와 **플랫폼 구분 필드** 도입 권장.

### 6.3 에러 처리

- 프론트: `analyzeError`·재시도·타임아웃·Mock 폴백으로 **일관된 처리** 있음.  
- 백엔드: 공통 HTTP 에러 형식·에러 코드 체계 정리 및 API 명세 반영 권장.

### 6.4 단일 DB·멀티 플랫폼

- **ERD(이미지)**를 단일 DB의 **스키마 계약**으로 고정하고,  
- **백엔드는 ERD에 맞춰** order, payment, listing(정책 확정 후), address, review, seller_docs를 순차 반영.  
- **API 명세**는 ERD 엔티티와 1:1로 맞추고, 가능하면 **Swagger/OpenAPI**로 고정해 4개 플랫폼이 같은 계약을 쓰도록 하는 것이 좋음.

---

## 7. 웹 그라운딩 — 모범 사례 요약

### 7.1 단일 DB·멀티플랫폼 B2B SaaS

- **Shared DB + 스키마/플랫폼 구분**: 중규모 B2B(10~1,000 테넌트)에서는 **단일 DB + tenant/platform 구분**이 비용 대비 격리·운영에 유리하다는 사례가 많음. 전용 DB는 엔터프라이즈 격리용으로 한정.
- **플랫폼 독립성**: DB 스키마·API 계약을 플랫폼에 묶지 않고, **ERD·OpenAPI를 단일 소스**로 두면 이식성·멀티플랫폼 확장에 유리.
- **참고**: Azure Well-Architected SaaS Data, Multitenancy and Cosmos DB, GCP Multi-cloud DB 관리 가이드.

### 7.2 Firestore 단일 DB·멀티테넌트

- **테넌트/플랫폼 ID 위치**: 단일 Firestore DB에서 멀티테넌트는 **경로 최상단 또는 문서 필드**에 tenant/platform ID를 두고, **모든 쿼리·Rules에서 필터**하는 패턴이 권장됨.
- **규칙**: `request.auth.token` 등으로 tenant/platform을 검증하고, `resource.data.platform_id == request.auth.token.platform` 형태로 Rules에 반영.
- **컬렉션 그룹**: 관리자용 크로스 플랫폼 조회는 `collectionGroup('orders')` 등으로 하되, Rules에서 역할/클레임으로 접근 제어.
- **참고**: Firebase 멀티테넌트 문서, Firestore Rules multi-tenancy Stack Overflow, Wild Codes Firestore multi-tenant 모델링.

### 7.3 API 에러 응답 표준 — RFC 9457

- **RFC 9457**(Problem Details for HTTP APIs, 2023)이 RFC 7807을 대체하는 **표준 에러 본문 형식**.
- **권장 JSON 필드**: `type`(URI), `status`(HTTP 코드), `title`, `detail`, `instance`(요청 URI), 필요 시 `traceId`, `code` 등 확장.
- **Content-Type**: `application/problem+json`.
- **효과**: 클라이언트가 에러 코드·메시지·추적 ID를 일관되게 파싱하고, 4개 플랫폼이 동일한 에러 계약을 사용 가능.
- **참고**: RFC 9457, Swagger Blog "Problem Details (RFC 9457): Doing API Errors Well".

### 7.4 이커머스 주문·결제 단일 소스

- **Order 중심**: 주문을 **단일 소스**로 두고, 결제·배송·정산은 **order_id**로만 연결하는 구조가 일관성·감사에 유리.
- **Payment**: order에 payment_id를 두고, 결제 상태·금액은 payment 엔티티에서만 관리해 중복·불일치를 방지.
- **참고**: Universal Commerce Schema, commercetools Orders API, AWS Distributed Order Management.

### 7.5 OpenAPI ↔ DB/ERD 정합

- **OpenAPI 스키마 ↔ DB**: OpenAPI 3.0 Schema 객체(JSON Schema 기반)로 엔티티·관계를 정의하면 ERD와 1:1 매핑 가능. DB→OpenAPI 자동 생성 도구(예: DB2OpenAPI)로 초기 정합 후, API 전용 필드만 보강하는 방식이 사용됨.
- **효과**: ERD = DB 계약, OpenAPI = API 계약으로 고정 시 **4개 플랫폼이 동일 스키마·에러 형식**을 쓰기 쉬움.
- **참고**: Zuplo "Generate OpenAPI From Your Database", Swagger Data Models.

### 7.6 Firebase 단일 프로젝트·다중 앱

- **단일 프로젝트·동일 Firestore**: 여러 앱(딜러웹 + 외부 3개)을 **같은 Firebase 프로젝트**에 두고 **동일 Firestore DB**를 쓰는 구성이 공식 권장. 리소스·데이터 일원화에 유리.
- **참고**: Firebase "Multiple Apps connected to single Firestore", Firebase 프로젝트·다중 DB 가이드.

---

## 8. 최종 플랜 (웹 그라운딩 반영)

### 8.1 원칙

- **ERD(이미지)** = 단일 DB의 **유일한 스키마 계약**. 모든 플랫폼(딜러웹 + 3)은 동일 컬렉션·필드 규칙 준수.
- **OpenAPI**(또는 동등 명세) = **API 계약**. 요청/응답/에러는 RFC 9457 + 에러 코드 체계로 통일.
- **플랫폼 구분**: 모든 주문·결제·매물·정산 문서에 **platform_id**(또는 source) 필드 필수. Rules·쿼리에서 플랫폼별 필터 적용.

### 8.2 Phase 1 — 주문·결제·에러 계약 (Critical)

| 순서 | 항목 | 내용 | 웹 그라운딩 반영 |
|------|------|------|------------------|
| 1.1 | `orders` 컬렉션 | ERD 필드·관계 준수. `platform_id`, `listing_id`, `buyer_id`, `seller_id`, `vehicle_id`, `order_type`, `status`, `total_price`, 타임스탬프. | Order 단일 소스, payment_id 참조 |
| 1.2 | `payments` 컬렉션 | `order_id` FK, `amount`, `method`, `status`, `pg_transaction_id`, `paid_at`, `platform_id`. | 결제 상태·금액 단일 소스 |
| 1.3 | Order/Payment API | 주문 생성·조회·상태 변경, 결제 요청·상태·환불 API. API_SPECIFICATION_v2.md 및 (선택) OpenAPI에 추가. | ERD ↔ API 1:1 |
| 1.4 | 에러 응답 표준화 | Functions 공통 래퍼: HTTP 4xx/5xx + **RFC 9457** 형식(`type`, `status`, `title`, `detail`, `instance`, `traceId`). API 명세에 에러 코드 enum·매핑 문서화. | RFC 9457, OpenAPI error responses |
| 1.5 | Firestore Rules | `orders`, `payments` 경로에 대해 `request.auth` + `resource.data.platform_id` 검증. | Firestore 멀티테넌트 패턴 |

### 8.3 Phase 2 — 매물·주소·플랫폼 필드 (High)

| 순서 | 항목 | 내용 | 웹 그라운딩 반영 |
|------|------|------|------------------|
| 2.1 | `listings` 정책 | `trades` 확장 vs `listings` 신규 결정. 결정 시 ERD listing 필드·관계 반영, `platform_id` 포함. | 단일 소스·관계 명확화 |
| 2.2 | `addresses` 컬렉션 | user/member 기준 주소 CRUD. `platform_id`, `user_id`, `address_type`, 주소·좌표 필드. | ERD address 엔티티 |
| 2.3 | 기존 컬렉션에 `platform_id` | `vehicles`, `inspections`, `auctions`, `trades`, `logistics`, `settlements`에 **platform_id**(또는 source) 필드 추가. 기존 문서는 마이그레이션 시 기본값(예: `dealer_web`) 설정. | Firestore 단일 DB 멀티 플랫폼 |

### 8.4 Phase 3 — 리뷰·서류·OpenAPI (Medium)

| 순서 | 항목 | 내용 | 웹 그라운딩 반영 |
|------|------|------|------------------|
| 3.1 | `reviews` 컬렉션 | `order_id`, `reviewer_id`, `reviewee_id`, `rating`, `content`, `platform_id`. | ERD review |
| 3.2 | `seller_docs` 컬렉션 | `seller_id`, `doc_type`, `file_url`, `status`, `platform_id`. | ERD seller_docs |
| 3.3 | OpenAPI 명세 도입 | API_SPECIFICATION_v2.md 내용을 **OpenAPI 3.0** YAML/JSON으로 전환. 스키마는 DATABASE_ERD_SCHEMA.md 엔티티와 매핑. 에러 스키마는 RFC 9457 구조. | OpenAPI ↔ DB 정합, 4개 플랫폼 공통 계약 |

### 8.5 Phase 4 — 외부 연동·모니터링 (Low)

| 순서 | 항목 | 내용 | 웹 그라운딩 반영 |
|------|------|------|------------------|
| 4.1 | CarsOfKorea 등 연동 테이블 | ERD의 CarsOfKorea_vehicle/listing/auction/auction_bid. `external_id`, `sync_status`, `platform_id`. | DATABASE_ERD_SCHEMA.md 3.19 |
| 4.2 | 에러·트레이싱 | 모든 API 에러 응답에 `traceId`(또는 `instance`) 포함. 로그에 `platform_id`, `request_id` 포함. | RFC 9457, 멀티 플랫폼 디버깅 |

### 8.6 체크리스트 요약

- [ ] **Phase 1**: orders/payments 컬렉션·API, RFC 9457 에러, Rules 반영.
- [ ] **Phase 2**: listings 정책 확정, addresses 컬렉션, 기존 컬렉션 platform_id.
- [ ] **Phase 3**: reviews, seller_docs, OpenAPI 명세.
- [ ] **Phase 4**: CarsOfKorea 연동 스키마, traceId/로깅.

---

**반영**: 웹 그라운딩 모범 사례 + 최종 플랜(Phase 1~4).

### 8.7 참고 출처 (웹 그라운딩)

| 주제 | 참고 |
|------|------|
| 단일 DB B2B SaaS | Azure Well-Architected SaaS Data, Multitenancy and Cosmos DB, GCP Multi-cloud DB 관리 |
| Firestore 멀티테넌트 | Firebase 멀티테넌트 문서, Firestore Rules multi-tenancy, Wild Codes Firestore 모델링 |
| API 에러 표준 | RFC 9457 (Problem Details for HTTP APIs), Swagger Blog RFC 9457 |
| 주문·결제 단일 소스 | Universal Commerce Schema, commercetools Orders API, AWS Distributed Order Management |
| OpenAPI ↔ DB | Zuplo "Generate OpenAPI From Your Database", Swagger Data Models |
| Firebase 다중 앱 | Firebase "Multiple Apps connected to single Firestore", Firebase 프로젝트 가이드 |
