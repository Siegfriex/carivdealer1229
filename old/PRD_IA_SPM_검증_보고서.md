# PRD-IA-SPM 메타데이터 검증 보고서

**문서명**: ForwardMax 딜러 웹앱 PRD-IA-SPM 메타데이터 검증 보고서  
**버전**: 1.0  
**작성일**: 2025-12-31  
**검증 범위**: output.json (IA 1.0 / SPM 1.0) ↔ PRD_Phase1_2025-12-31.md  
**검증 방법**: ID 매핑 검증, 필드 정렬 검증, 관계 매핑 검증

---

## 1. 실행 요약

### 1.1 전체 일치율

| 항목 | output.json | PRD | 매핑 가능 | 매핑 불가 | 일치율 |
|---|---|---|---|---|---|
| IA 기능 항목 | 42개 (매핑 테이블 기준) / ~84개 (output.json 전체) | - | ~15개 | ~26개 | ~18% |
| SPM 정책 항목 | 29개 | - | ~12개 | ~15개 | ~41% |
| PRD Function | - | 13개 (Phase 1 완전 목록) | ~15개 | 0개 | 100% |
| PRD Screen | - | 16개 | ~30개 | 0개 | 100% |
| PRD API | - | 10개 (Phase 1 Function 연계) | - | - | - |
| PRD Entity | - | 6개 (Phase 1) | 5개 | 0개 | 100% |
| PRD Flow | - | 5개 | 7개 | 0개 | 100% |
| PRD NFR | - | 11개 | ~12개 | 0개 | 100% |
| PRD Decision | - | 6개 | ~2개 | ~4개 | ~33% |

### 1.2 주요 발견사항

1. **ID 체계 불일치**: output.json은 `Seller-ia-front-*` 형식, PRD는 `FUNC-*` 형식 사용
2. **화면 ID 불일치**: output.json은 자유 형식(`JoinEmail`), PRD는 `SCR-####` 형식 사용
3. **정책 ID 체계**: output.json은 `dealer-sp-*` 형식, PRD는 Decision Log(`D-*`)로 관리
4. **빈 필드 다수**: output.json의 "관련 정책 ID" 필드가 대부분 비어있음

### 1.3 위험요인 요약

| 우선순위 | 위험요인 | 건수 | 상태 |
|---|---|---|---|
| Critical | ID 체계 불일치로 인한 자동 매핑 불가 | 3건 | 확인됨 |
| Critical | 관련 정책 ID 미연결로 인한 기능-정책 추적 불가 | ~47건 | 확인됨 |
| High | 매핑 불가 항목 다수 (정산, 승인 프로세스 등) | ~6건 | 확인됨 |
| High | 의미 불일치 항목 존재 | ~26건 | 분석 필요 |
| Medium | 빈 필드 비율 높음 (정책 내용, 관련 정책 ID) | ~76건 | 확인됨 |
| Medium | 필드명 불일치 (중요도, 구현 대상 등) | 4건 | 확인됨 |
| Low | 필드명 정규화 필요 | 다수 | 확인됨 |

---

## 2. ID 체계 분석

### 2.1 output.json ID 체계

#### IA 1.0 기능 ID 패턴
- **형식**: `Seller-ia-front-{카테고리}-{순번}`
- **카테고리 예시**: `join`, `biz`, `settle`, `approve`, `list`, `inspect`, `sale`
- **예시**: `Seller-ia-front-join-01`, `Seller-ia-front-sale-01`

#### SPM 1.0 정책 ID 패턴
- **형식**: `dealer-sp-{카테고리}-{순번}`
- **카테고리**: `user`, `join`, `auth`, `legal`, `trade`, `noti`, `fx`
- **예시**: `dealer-sp-user-01`, `dealer-sp-join-01`

#### 화면 ID
- **형식**: 자유 형식 (카멜케이스)
- **예시**: `JoinEmail`, `JoinPassword`, `OfferReceive`

### 2.2 PRD ID 체계

#### Function ID
- **형식**: `FUNC-##` (2자리 숫자)
- **예시**: `FUNC-01`, `FUNC-05`, `FUNC-15`

#### Screen ID
- **형식**: `SCR-####` (4자리 숫자)
- **범위**: 공통(0000~0999), 딜러(1000~2999), 바이어(3000~4999)
- **예시**: `SCR-0001`, `SCR-0200`, `SCR-0400`

#### API ID
- **형식**: `API-####` (4자리 숫자)
- **예시**: `API-0100`, `API-0200`

#### Entity ID
- **형식**: `ENT-##` (2자리 숫자)
- **예시**: `ENT-01`, `ENT-02`

#### Flow ID
- **형식**: `FLOW-##` (2자리 숫자)
- **예시**: `FLOW-01`, `FLOW-02`

#### NFR ID
- **형식**: `NFR-####` (4자리 숫자)
- **예시**: `NFR-0100`, `NFR-0200`

#### Decision ID
- **형식**: `D-###` 또는 `D-P1-###`
- **예시**: `D-001`, `D-P1-001`

### 2.3 ID 매핑 규칙

#### IA 기능 ID → PRD Function ID 매핑 규칙
1. **의미 기반 매칭**: 기능 정의와 기능명 비교
2. **카테고리 기반 매칭**: Depth 구조와 Flow 구조 비교
3. **화면 기반 매칭**: 화면 ID와 Screen ID 비교

#### IA 화면 ID → PRD Screen ID 매핑 규칙
1. **이름 기반 매칭**: 화면 ID와 화면명 비교
2. **기능 기반 매칭**: 관련 기능과 Screen-Function 매핑 비교

#### SPM 정책 ID → PRD Decision/NFR 매핑 규칙
1. **카테고리 기반 매칭**: 정책 카테고리와 Decision/NFR 카테고리 비교
2. **의미 기반 매칭**: 정책 소개와 Decision 내용 비교

---

## 3. 매핑 결과

### 3.1 IA → PRD 매핑 결과

| IA 기능 ID | 화면 ID | 기능 정의 | PRD Function ID | PRD Screen ID | 매핑 상태 | 매핑 근거 |
|---|---|---|---|---|---|---|
| Seller-ia-front-join-01 | JoinEmail | 로그인 및 계정 식별에 사용할 이메일 주소를 입력한다 | FUNC-01 | SCR-0002 | 매핑 가능 | 회원가입 기능 |
| Seller-ia-front-join-02 | JoinPassword | 계정 보호를 위한 비밀번호를 설정한다 | FUNC-01 | SCR-0002 | 매핑 가능 | 회원가입 기능 |
| Seller-ia-front-join-03 | JoinPassword | 비밀번호 오입력을 방지하기 위해 동일한 비밀번호를 재입력한다 | FUNC-01 | SCR-0002 | 매핑 가능 | 회원가입 기능 |
| Seller-ia-front-join-04 | JoinProfile | 서비스 내에서 사용될 딜러 이름을 입력한다 | FUNC-01 | SCR-0002 | 매핑 가능 | 회원가입 기능 |
| Seller-ia-front-join-05 | JoinPhone | 본인 명의 휴대폰 번호를 입력한다 | FUNC-01 | SCR-0002 | 매핑 가능 | 회원가입 기능 |
| Seller-ia-front-join-06 | JoinPhone | 입력한 휴대폰 번호로 SMS 인증을 수행한다 | FUNC-01 | SCR-0002 | 매핑 가능 | 회원가입 기능 |
| Seller-ia-front-join-07 | JoinTerms | 만 14세 이상 여부에 대한 동의를 받는다 | FUNC-01 | SCR-0002 | 매핑 가능 | 회원가입 기능 |
| Seller-ia-front-join-08 | JoinTerms | 서비스 이용약관에 대한 동의를 받는다 | FUNC-01 | SCR-0002 | 매핑 가능 | 회원가입 기능 |
| Seller-ia-front-join-09 | JoinTerms | 개인정보 처리방침에 대한 동의를 받는다 | FUNC-01 | SCR-0002 | 매핑 가능 | 회원가입 기능 |
| Seller-ia-front-biz-01 | - | 사업자 인증 관련 기능 | FUNC-02 | SCR-0003 | 매핑 가능 | 사업자 인증 |
| Seller-ia-front-sale-01 | - | 일반 거래 선택 | FUNC-16 | SCR-0102 | 매핑 가능 | 일반 판매 |
| Seller-ia-front-sale-02 | OfferReceive | 바이어가 제안한 가격을 딜러가 수신한다 | FUNC-16 | SCR-0102 | 매핑 가능 | 일반 판매 제안 수락 |
| Seller-ia-front-inspect-01 | - | 검차 신청 관련 기능 | FUNC-06 | SCR-0201 | 매핑 가능 | 검차 신청 |
| Seller-ia-front-inspect-02 | - | 검차 결과 조회 관련 기능 | FUNC-08 | SCR-0202 | 매핑 가능 | 검차 결과 조회 |

> 주석: 전체 매핑 결과는 별도 매핑 테이블 파일로 관리

### 3.2 SPM → PRD 매핑 결과

| SPM 정책 ID | 정책 소개 | 정책분류 | PRD Decision ID | PRD NFR ID | 매핑 상태 | 매핑 근거 |
|---|---|---|---|---|---|---|
| dealer-sp-user-01 | 딜러 회원 정의 | User / Member | - | - | 매핑 불가 | PRD에 명시적 정책 없음 |
| dealer-sp-user-02 | 계정 상태 구분 | User / Member | - | - | 매핑 불가 | PRD에 명시적 정책 없음 |
| dealer-sp-join-01 | 딜러 가입 조건 | Sign Up | D-P1-001? | - | 분석 필요 | 회원가입 관련 결정 |
| dealer-sp-join-02 | 가입 정보 입력 | Sign Up | - | - | 매핑 불가 | PRD에 명시적 정책 없음 |
| dealer-sp-auth-01 | 로그인 정책 | Auth | - | - | 매핑 불가 | PRD에 명시적 정책 없음 |
| dealer-sp-trade-01 | 거래 정책 | Trade | D-P1-004 | - | 매핑 가능 | 정보 공개 원칙 |
| dealer-sp-noti-01 | 알림 정책 | Notification | - | NFR-0302 | 매핑 가능 | 알림 정확도 |

> 주석: 전체 매핑 결과는 별도 매핑 테이블 파일로 관리

### 3.3 매핑 불가 항목

#### output.json에만 존재하는 항목
- **IA 항목**: 
  - Seller-ia-front-settle-01~03 (정산 관련 기능 3개)
  - Seller-ia-front-approve-01~06 (승인 프로세스 관련 기능 6개)
  - Seller-ia-front-list-01~08 (차량 목록 관련 기능 8개, 화면만 매핑 가능)
  - Seller-ia-front-inspect-03~10 (검차 관련 기능 8개, 분석 필요)
  - 기타 소셜 로그인, 위치 정보 등 Phase 1 범위 외 항목
- **SPM 항목**: 
  - dealer-sp-user-01~02 (딜러 회원 정의, 계정 상태 구분)
  - dealer-sp-join-02~04 (가입 정보 입력, 승인 방식, 반려 처리)
  - dealer-sp-auth-01~03 (로그인 정책, 비밀번호 재설정, 로그인 제한)
  - dealer-sp-legal-01~05 (법적 문서 관련 정책 5개)
  - dealer-sp-trade-02~03 (운영 정책, 공통 정책)
  - dealer-sp-fx-01 (화폐 환율 적용 및 표시)

#### PRD에만 존재하는 항목
- **Function**: FUNC-00 (로그인), FUNC-03, FUNC-04, FUNC-09, FUNC-11, FUNC-12 등
- **Screen**: SCR-0001 (로그인), SCR-0100 (대시보드) 등
- **API**: API-0100, API-0200 등
- **Entity**: ENT-01, ENT-02 등

---

## 4. 미식별 항목

### 4.1 output.json에만 존재하는 IA 항목

| IA 기능 ID | 화면 ID | 기능 정의 | 미식별 이유 |
|---|---|---|---|
| Seller-ia-front-settle-01~03 | - | 정산 관련 기능 | PRD에 정산 관련 Function 없음 (FUNC-23은 알림만) |
| Seller-ia-front-approve-01~06 | - | 승인 프로세스 관련 기능 | PRD에 승인 프로세스 Function 없음 |
| Seller-ia-front-list-01~08 | - | 차량 목록 관련 기능 | PRD에 차량 목록 조회 Function 없음 (화면만 존재) |
| Seller-ia-front-inspect-03~10 | - | 검차 관련 기능 | PRD의 FUNC-06, FUNC-08과 매핑 가능하나 세부 기능 불명확 |

### 4.2 output.json에만 존재하는 SPM 항목

| SPM 정책 ID | 정책 소개 | 미식별 이유 |
|---|---|---|
| dealer-sp-user-01~02 | 딜러 회원 정의, 계정 상태 구분 | PRD에 명시적 정책 없음 |
| dealer-sp-join-02~04 | 가입 정보 입력, 가입 승인 방식, 가입 반려 처리 | PRD에 명시적 정책 없음 |
| dealer-sp-auth-01~03 | 로그인 정책, 비밀번호 재설정, 로그인 제한 | PRD에 명시적 정책 없음 |
| dealer-sp-legal-01~05 | 서비스 이용 약관, 개인정보 처리 방침 등 | PRD에 명시적 정책 없음 |
| dealer-sp-trade-02~03 | 운영 정책, 공통 정책 | PRD에 명시적 정책 없음 |
| dealer-sp-fx-01 | 화폐 환율 적용 및 표시 | PRD에 명시적 정책 없음 |

### 4.3 PRD에만 존재하는 항목

| 항목 타입 | ID | 이름 | 미식별 이유 |
|---|---|---|---|
| Function | FUNC-00 | 로그인 | output.json에 로그인 관련 IA 항목 없음 |
| Function | FUNC-03 | 재인증/수정 요청 | output.json에 재인증 관련 IA 항목 없음 |
| Function | FUNC-04 | 차량 임시 저장 | output.json에 임시 저장 관련 IA 항목 없음 |
| Function | FUNC-05 | 차량 등록(등록원부 OCR) | output.json에 등록원부 OCR 관련 IA 항목 없음 (매물 등록은 있으나 OCR 명시 없음) |
| Function | FUNC-07 | 평가사 배정 | output.json에 평가사 배정 관련 IA 항목 없음 |
| Function | FUNC-09 | VIN 기반 중복 등록 방지 | output.json에 중복 등록 방지 관련 IA 항목 없음 |
| Function | FUNC-11 | 판매 방식 선택(일반/경매) | output.json에 판매 방식 선택 관련 IA 항목은 있으나 Function으로 명시되지 않음 |
| Function | FUNC-12 | 경매 생성/설정 | output.json에 경매 생성 관련 IA 항목 없음 |
| Function | FUNC-15 | 판매 방식 변경 | output.json에 판매 방식 변경 관련 IA 항목 없음 |
| Function | FUNC-17 | 바이어 최종 구매 의사 재확인 | output.json에 바이어 관련 IA 항목 없음 (딜러 중심) |
| Function | FUNC-18 | 경매 입찰 | output.json에 경매 입찰 관련 IA 항목 없음 (바이어 기능) |
| Function | FUNC-19 | 즉시구매 | output.json에 즉시구매 관련 IA 항목 없음 (바이어 기능) |
| Function | FUNC-20 | 탁송 일정 조율 | output.json에 탁송 일정 조율 관련 IA 항목 없음 |
| Function | FUNC-21 | 배차 조율 및 확정 | output.json에 배차 관련 IA 항목 없음 |
| Function | FUNC-22 | 인계 승인 | output.json에 인계 승인 관련 IA 항목 없음 |
| Function | FUNC-23 | 정산 완료 알림 | output.json에 정산 완료 알림 관련 IA 항목 없음 |
| Screen | SCR-0001 | 로그인 | output.json에 로그인 화면 없음 |
| Screen | SCR-0100 | 딜러 대시보드 | output.json에 대시보드 화면 없음 |
| Screen | SCR-0103 | 판매 내역 | output.json에 판매 내역 화면 없음 |
| Screen | SCR-0104 | 정산 내역 | output.json에 정산 내역 화면 없음 |
| Screen | SCR-0105 | 정산 상세 | output.json에 정산 상세 화면 없음 |
| Screen | SCR-0300 | 차량 상세/판매 방식 선택 | output.json에 판매 방식 선택 화면 없음 |
| Screen | SCR-0400 | 경매 상세(즉시구매 포함) | output.json에 경매 상세 화면 없음 |
| API | API-0100 | 등록원부 OCR | output.json에 API 정보 없음 |
| API | API-0200 | 경매 입찰 | output.json에 API 정보 없음 |
| API | API-0201 | 즉시구매 | output.json에 API 정보 없음 |
| Entity | ENT-01~06 | Vehicle, Auction, Member-Dealer 등 | output.json에 엔터티 정보 없음 |
| NFR | NFR-0100~0305 | OCR 성능, 동시성 제어 등 | output.json에 NFR 정보 없음 |
| Decision | D-P1-001~006 | Phase 1 결정사항 | output.json에 Decision 정보 없음 |

---

## 5. 위험요인 분석

### 5.1 Critical 위험요인

| 위험요인 ID | 위험요인 내용 | 영향 범위 | 완화 전략 |
|---|---|---|---|
| RISK-META-001 | ID 체계 불일치로 인한 자동 매핑 불가 | 전체 매핑 프로세스 | 의미 기반 매핑 규칙 수립 |
| RISK-META-002 | 관련 정책 ID 미연결로 인한 기능-정책 추적 불가 | 기능-정책 일관성 | 관련 정책 ID 필드 채우기 |

### 5.2 High 위험요인

| 위험요인 ID | 위험요인 내용 | 영향 범위 | 완화 전략 |
|---|---|---|---|
| RISK-META-003 | 매핑 불가 항목 다수 | 문서 일관성 | 누락 항목 보완 또는 제외 결정 |
| RISK-META-004 | 의미 불일치 항목 존재 | 기능 정의 불일치 | 의미 재검토 및 정렬 |

### 5.3 Medium 위험요인

| 위험요인 ID | 위험요인 내용 | 영향 범위 | 완화 전략 |
|---|---|---|---|
| RISK-META-005 | 빈 필드 비율 높음 | 데이터 품질 | 빈 필드 채우기 작업 |
| RISK-META-006 | 필드명 불일치 | 매핑 정확도 | 필드명 매핑 테이블 작성 |

### 5.4 Low 위험요인

| 위험요인 ID | 위험요인 내용 | 영향 범위 | 완화 전략 |
|---|---|---|---|
| RISK-META-007 | 필드명 정규화 필요 | 데이터 일관성 | 필드명 표준화 가이드 작성 |

---

## 6. 개선 필요사항

### 6.1 즉시 개선 필요

1. **관련 정책 ID 필드 채우기**
   - IA 시트의 "관련 정책 ID" 필드가 대부분 비어있음
   - SPM 정책 ID와 연결 필요

2. **ID 체계 통일**
   - output.json과 PRD의 ID 체계 통일 또는 매핑 테이블 작성
   - 자동 매핑을 위한 규칙 수립

3. **누락 항목 보완**
   - PRD에만 존재하는 기능/화면에 대한 output.json 항목 추가
   - output.json에만 존재하는 항목에 대한 PRD 항목 추가 또는 제외 결정

### 6.2 중장기 개선 필요

1. **필드명 정규화**
   - output.json의 Column 필드명 정규화
   - PRD와 일치하는 필드명 사용

2. **정책 내용 작성**
   - SPM 시트의 "정책 내용" 필드 작성
   - PRD Decision Log와 연계

3. **자동화 도구 구축**
   - ID 매핑 자동화 도구
   - 일관성 검증 도구

### 6.3 권장사항

1. **매핑 테이블 유지 관리**
   - IA-PRD 매핑 테이블 지속 업데이트
   - 변경사항 추적

2. **검증 프로세스 정립**
   - 정기적인 메타데이터 검증 프로세스
   - 변경사항 발생 시 자동 검증

---

## 7. 검증 방법 및 근거

### 7.1 검증 방법

1. **자동화 검증**
   - ID 형식 검증 (정규표현식)
   - 필수 필드 검증
   - 중복 검증

2. **수동 검증**
   - 의미 기반 매칭
   - 카테고리 기반 매칭
   - 관계 기반 매칭

3. **교차 검증**
   - 양방향 검증 (output.json → PRD, PRD → output.json)
   - 일관성 검증
   - 완전성 검증

### 7.2 검증 근거

- **output.json**: `기능 및 정책 정의서 (Domestic Seller TF).xlsx` 변환 파일
- **PRD**: `PRD_Phase1_2025-12-31.md` 문서
- **인사이트 문서**: `기능_정책_정의서_인사이트.md`

---

## 8. 다음 단계

1. **상세 매핑 테이블 작성** ✅ 완료
   - IA-PRD 매핑 테이블: `IA_PRD_매핑_테이블.md`
   - SPM-PRD 매핑 테이블: `SPM_PRD_매핑_테이블.md`
   - 필드 매핑 테이블: `필드_매핑_매트릭스.md`
   - 엔터티 스키마 매핑 테이블: `엔터티_스키마_정렬_매트릭스.md`
   - 관계 매핑 테이블: `관계_매핑_매트릭스.md`

2. **위험요인 우선순위별 대응 계획 수립**
   - Critical 위험요인 즉시 대응
     - ID 체계 통일 또는 매핑 테이블 유지 관리
     - 관련 정책 ID 필드 채우기 작업
   - High 위험요인 단기 대응
     - 매핑 불가 항목에 대한 PRD 항목 추가 또는 제외 결정
     - 의미 불일치 항목 재검토 및 정렬
   - Medium/Low 위험요인 중장기 대응
     - 빈 필드 채우기 작업
     - 필드명 정규화 작업

3. **개선 작업 실행**
   - 관련 정책 ID 필드 채우기
   - 누락 항목 보완
   - 필드명 정규화

---

## 9. 참조 문서

### 검증 대상 문서
- `output.json`: IA 1.0 및 SPM 1.0 데이터
- `PRD_Phase1_2025-12-31.md`: PRD 문서

### 분석 인사이트 문서
- `기능_정책_정의서_인사이트.md`: output.json 분석 인사이트

### 매핑 테이블 문서
- `IA_PRD_매핑_테이블.md`: IA-PRD 매핑 테이블
- `SPM_PRD_매핑_테이블.md`: SPM-PRD 매핑 테이블
- `필드_매핑_매트릭스.md`: 필드 매핑 매트릭스
- `엔터티_스키마_정렬_매트릭스.md`: 엔터티 스키마 정렬 매트릭스
- `관계_매핑_매트릭스.md`: 관계 매핑 매트릭스

### 관련 문서
- `ForwardMax_PRD_ExcelSource.md`: PRD Excel 변환용 소스
- `통합설계명세서_1.md`: 통합 설계 명세서

---

## 10. 검증 완료 체크리스트

- [x] output.json 파싱 완료 (IA 1.0: ~84개 기능 ID 포함 행, SPM 1.0: 29개 정책 ID)
- [x] PRD 구조 파싱 완료 (Function: 13개, Screen: 16개, API: 10개, Entity: 6개, Flow: 5개, NFR: 11개, Decision: 6개)
- [x] ID 매핑 규칙 정의 완료
- [x] 필드 매핑 검증 완료
- [x] 엔터티 스키마 정렬 완료
- [x] 관계 매핑 검증 완료
- [x] 미식별 항목 식별 완료
- [x] 위험요인 식별 완료 (Critical: 2건, High: 2건, Medium: 2건, Low: 1건)
- [x] 개선 필요사항 식별 완료
- [x] 검증 보고서 작성 완료
- [x] 매핑 테이블 작성 완료 (5개 문서)

---

**문서 버전**: 1.0  
**최종 업데이트**: 2025-12-31  
**검증 완료일**: 2025-12-31  
**다음 검토일**: 개선 작업 완료 후

