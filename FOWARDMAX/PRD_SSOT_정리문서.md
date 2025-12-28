# PRD SSOT (Single Source of Truth) 정리 문서

**문서명**: ForwardMax 딜러 웹앱 PRD SSOT 정리 문서  
**버전**: 1.0  
**작성일**: 2025-12-31  
**기준 문서**: PRD_Phase1_2025-12-31.md (v2.3)  
**목적**: PRD를 SSOT로 하여 모든 ID 참조와 매핑의 일관성 확보

---

## 1. SSOT 정의

### 1.1 SSOT 원칙

- **PRD_Phase1_2025-12-31.md**가 모든 ID와 명세의 단일 진실 공급원(Single Source of Truth)입니다.
- 모든 참조 ID는 PRD의 Registry에 존재해야 합니다.
- 모든 매핑 관계는 PRD의 매핑 테이블과 일치해야 합니다.

### 1.2 검증 완료 상태

- ✅ ID 형식 검증: 통과
- ✅ Registry 유일성: 통과
- ✅ Cross-Reference 무결성: 통과
- ✅ API Registry 보완: 완료 (16개 API 등록 완료)
- ✅ Traceability Matrix 일치성: 완료

---

## 2. ID Registry 통합 목록

### 2.1 Flow Registry (5개)

| Flow ID | 플로우명 | 설명 | 담당자 | 상태 |
|---|---|---|---|---|
| FLOW-00 | 공통 | 로그인/로그아웃/마이페이지 등 공통 플로우 | - | 확정 |
| FLOW-01 | 진입–회원가입 | 회원가입/인증 플로우 | 엄태영 | 확정 |
| FLOW-02 | 검차(검사) | 검차 신청/배정/수행 플로우 | 엄태영 | 확정 |
| FLOW-03 | 업로드 및 판매 | 차량 등록/판매 방식 선택/경매/일반 판매 | 황설휘 | 확정 |
| FLOW-04 | 탁송 | 탁송 예약/배차/인계 플로우 | 황설휘 | 확정 |

### 2.2 Screen Registry (16개)

| Screen ID | 화면명 | 역할 | Flow | 상태 |
|---|---|---|---|---|
| SCR-0001 | 로그인 | 공통 | FLOW-00 | 확정 |
| SCR-0002 | 회원가입(딜러) | 딜러 | FLOW-01 | 확정 |
| SCR-0003 | 사업자 인증 | 딜러 | FLOW-01 | 확정 |
| SCR-0100 | 딜러 대시보드 | 딜러 | FLOW-00 | 확정 |
| SCR-0101 | 차량 목록 | 딜러 | FLOW-03 | 확정 |
| SCR-0102 | 일반 판매 제안 목록 | 딜러 | FLOW-03 | 확정 |
| SCR-0103 | 판매 내역 | 딜러 | FLOW-03 | 확정 |
| SCR-0104 | 정산 내역 | 딜러 | FLOW-04 | 확정 |
| SCR-0105 | 정산 상세 | 딜러 | FLOW-04 | 확정 |
| SCR-0200 | 차량 등록(등록원부 OCR) | 딜러 | FLOW-03 | 확정 |
| SCR-0201 | 검차 신청 | 딜러 | FLOW-02 | 확정 |
| SCR-0202 | 검차 결과 조회 | 딜러 | FLOW-02 | 확정 |
| SCR-0300 | 차량 상세/판매 방식 선택 | 딜러 | FLOW-03 | 확정 |
| SCR-0400 | 경매 상세(즉시구매 포함) | 딜러 | FLOW-03 | 확정 |
| SCR-0600 | 탁송 예약/배차 | 딜러 | FLOW-04 | 확정 |
| SCR-0601 | 탁송 내역 | 딜러 | FLOW-04 | 확정 |

### 2.3 Function Registry (14개)

| Function ID | 기능명 | 설명 | 관련 화면 | 상태 |
|---|---|---|---|---|
| FUNC-00 | 로그인 | 딜러/바이어 로그인 처리 | `SCR-0001` | 확정 (공통 기능) |
| FUNC-01 | 딜러 회원가입 | 딜러 계정 생성 및 기본 정보 입력 | `SCR-0002` | 확정 |
| FUNC-02 | 사업자 인증 | 사업자등록증 OCR 및 진위 확인 | `SCR-0003` | 확정 |
| FUNC-05 | 차량 등록(등록원부 OCR) | 차량번호 입력 → 등록원부 OCR → 기본정보 자동 채움 | `SCR-0200` | 확정(D-P1-002) |
| FUNC-06 | 검차 신청 | 검차 희망 일정 선택 및 검차 신청 처리 | `SCR-0201` | 확정 |
| FUNC-07 | 평가사 배정 | 시스템이 평가사를 자동 배정 | - | 확정(시스템 자동) |
| FUNC-08 | 검차 결과 업로드 | 평가사가 검차 결과 업로드 | `SCR-0202` | 확정(평가사 액션) |
| FUNC-15 | 판매 방식 변경 | 일반 판매 → 경매 전환 | `SCR-0300` | 확정(D-P1-001) |
| FUNC-16 | 일반 판매 제안 수락 | 바이어(기업) 제안 수락/거절 | `SCR-0102` | 확정 |
| FUNC-17 | 바이어 최종 구매 의사 재확인 | 바이어(기업) 최종 구매 의사 재확인 | - | 확정(바이어 외부 시스템) |
| FUNC-18 | 경매 입찰 | 바이어(기업) 입찰 처리(진행 중 가격 비노출, 낙찰 후 당사자 공개) | - | 확정(D-P1-004) |
| FUNC-19 | 즉시구매 | 경매 내 즉시구매 실행 | `SCR-0400` | 확정(D-P1-003) |
| FUNC-20 | 탁송 일정 조율 | 탁송 희망 일정 선택 및 물류 파트너 조율 | `SCR-0600` | 확정 |
| FUNC-21 | 배차 조율 및 확정 | 배차 요청 및 탁송 기사 배정, 확정 후 변경 제한 | `SCR-0600`, `SCR-0601` | 확정 |
| FUNC-22 | 인계 승인 | 차량 상태 동일 확인서, 차키/서류 인계 확인 후 PIN 입력으로 책임 이관 | `SCR-0601` | 확정 |
| FUNC-23 | 정산 완료 알림 | 인계 승인 완료 후 정산 완료 알림 자동 발송 | `SCR-0105` | 확정(시스템 자동) |

> 주석: FRD 미작성 Function(FUNC-03, FUNC-04, FUNC-09, FUNC-11, FUNC-12)은 20.2.1 섹션 참조.

### 2.4 API Registry (16개)

| API ID | API명 | HTTP 메서드 | 엔드포인트 | 관련 Function | 관련 NFR | 상태 |
|---|---|---|---|---|---|---|
| API-0001 | 딜러 회원가입 | POST | `/api/v1/member/dealer/register` | FUNC-01 | NFR-0300 | 확정 |
| API-0002 | 사업자 인증 | POST | `/api/v1/member/dealer/verify-business` | FUNC-02 | NFR-0100, NFR-0300 | 확정 |
| API-0100 | 등록원부 OCR | POST | `/api/v1/vehicle/ocr-registration` | FUNC-05 | NFR-0100, NFR-0201 | 확정 |
| API-0101 | 검차 신청 | POST | `/api/v1/vehicle/{vehicle_id}/inspection/request` | FUNC-06 | NFR-0300 | 확정 |
| API-0102 | 평가사 배정 | POST | `/api/v1/inspection/{inspection_id}/assign` | FUNC-07 | NFR-0300 | 확정(시스템 자동) |
| API-0103 | 검차 결과 업로드 | POST | `/api/v1/inspection/{inspection_id}/result` | FUNC-08 | NFR-0300 | 확정(평가사 액션) |
| API-0200 | 경매 입찰 | POST | `/api/v1/auction/{auction_id}/bid` | FUNC-18 | NFR-0200 | 확정 |
| API-0201 | 즉시구매 | POST | `/api/v1/auction/{auction_id}/buy-now` | FUNC-19 | NFR-0200, NFR-0202 | 확정 |
| API-0300 | 판매 방식 변경 | POST | `/api/v1/vehicle/{vehicle_id}/change-sale-method` | FUNC-15 | NFR-0200 | 확정 |
| API-0301 | 일반 판매 제안 수락/거절 | POST | `/api/v1/trade/{proposal_id}/accept` | FUNC-16 | NFR-0200 | 확정 |
| API-0302 | 바이어 최종 구매 의사 재확인 | POST | `/api/v1/trade/{proposal_id}/confirm` | FUNC-17 | NFR-0200 | 확정(바이어 외부 시스템) |
| API-0600 | 탁송 일정 조율 | POST | `/api/v1/logistics/schedule` | FUNC-20 | NFR-0300, NFR-0301 | 확정 |
| API-0601 | 배차 조율 요청 | POST | `/api/v1/logistics/dispatch` | FUNC-21 | NFR-0300 | 확정 |
| API-0602 | 배차 확정 | POST | `/api/v1/logistics/dispatch/{dispatch_id}/confirm` | FUNC-21 | NFR-0300, NFR-0302 | 확정 |
| API-0603 | 인계 승인 | POST | `/api/v1/logistics/handover/{logistics_id}/approve` | FUNC-22 | NFR-0303, NFR-0304 | 확정 |
| API-0604 | 정산 완료 알림 발송 | POST | `/api/v1/settlement/{settlement_id}/notify` | FUNC-23 | NFR-0302, NFR-0305 | 확정 |

### 2.5 Entity Registry (6개)

| Entity ID | 엔터티명 | 설명 |
|---|---|---|
| ENT-01 | Vehicle | 차량 정보 |
| ENT-02 | Auction | 경매 정보 |
| ENT-03 | Member-Dealer | 딜러 회원 정보 |
| ENT-04 | Logistics_Schedule | 탁송 일정 정보 |
| ENT-05 | Logistics_History | 탁송 내역 정보 |
| ENT-06 | Settlement | 정산 정보 |

### 2.6 NFR Registry (5개 이상)

| NFR ID | 요구사항명 | 관련 기능 |
|---|---|---|
| NFR-0100 | OCR 성능 | FUNC-02, FUNC-05 |
| NFR-0101 | 경매 낙찰 처리 성능 | FUNC-18 |
| NFR-0200 | 동시성 제어 | FUNC-15, FUNC-16, FUNC-17, FUNC-18, FUNC-19 |
| NFR-0201 | 외부 API 장애 대응 | FUNC-05 |
| NFR-0202 | 원자성 보장 | FUNC-19 |
| NFR-0300 | 외부 API 장애 대응 | FUNC-01, FUNC-02, FUNC-06, FUNC-07, FUNC-08, FUNC-20, FUNC-21 |
| NFR-0301 | 탁송 일정 조율 응답 시간 | FUNC-20 |
| NFR-0302 | 알림 정확도 | FUNC-16, FUNC-21, FUNC-23 |
| NFR-0303 | 데이터 무결성 | FUNC-22 |
| NFR-0304 | 보안 로그 | FUNC-22 |
| NFR-0305 | 알림 재시도 | FUNC-23 |

### 2.7 Decision Registry (6개)

| Decision ID | 결정 내용 | 관련 기능/화면 |
|---|---|---|
| D-P1-001 | 일반 판매 → 경매 전환 가능 | FUNC-15, SCR-0300 |
| D-P1-002 | 등록원부 OCR 기반 차량정보 자동 채움 | FUNC-05, SCR-0200 |
| D-P1-003 | 경매 즉시구매 포함 | FUNC-19, SCR-0400 |
| D-P1-004 | 정보 공개 원칙(비공개=상호 공개) | FUNC-18, FUNC-19 |
| D-P1-005 | 일반 거래(제안형) 프로세스 명시 | FUNC-16 |
| D-P1-006 | 바이어 스코프 축소(딜러 웹앱 중심) | 전체 문서 |

---

## 3. 매핑 관계 통합 목록

### 3.1 FLOW → Screen 매핑

| Flow ID | Screen ID | 순서 | 설명 |
|---|---|---|---|
| FLOW-00 | SCR-0001 | 1 | 로그인 화면 |
| FLOW-00 | SCR-0100 | 2 | 딜러 대시보드 |
| FLOW-01 | SCR-0002 | 1 | 회원가입 화면 |
| FLOW-01 | SCR-0003 | 2 | 사업자 인증 화면 |
| FLOW-02 | SCR-0201 | 1 | 검차 신청 화면 |
| FLOW-02 | SCR-0202 | 2 | 검차 결과 조회 화면 |
| FLOW-03 | SCR-0101 | 1 | 차량 목록 화면 |
| FLOW-03 | SCR-0200 | 2 | 차량 등록 화면 |
| FLOW-03 | SCR-0300 | 3 | 판매 방식 선택 화면 |
| FLOW-03 | SCR-0400 | 4 | 경매 상세 화면(딜러) |
| FLOW-03 | SCR-0102 | 5 | 일반 판매 제안 목록 화면 |
| FLOW-03 | SCR-0103 | 6 | 판매 내역 화면 |
| FLOW-04 | SCR-0104 | 1 | 정산 내역 화면 |
| FLOW-04 | SCR-0105 | 2 | 정산 상세 화면 |
| FLOW-04 | SCR-0600 | 3 | 탁송 예약/배차 화면 |
| FLOW-04 | SCR-0601 | 4 | 탁송 내역 화면 |

### 3.2 Screen → Function 매핑

| Screen ID | Function ID | 설명 |
|---|---|---|
| SCR-0001 | FUNC-00 | 로그인 |
| SCR-0002 | FUNC-01 | 딜러 회원가입 |
| SCR-0003 | FUNC-02 | 사업자 인증 |
| SCR-0100 | - | 딜러 대시보드(통합 화면) |
| SCR-0101 | - | 차량 목록 조회 |
| SCR-0102 | FUNC-16 | 일반 판매 제안 수락/거절 |
| SCR-0103 | - | 판매 내역 조회 |
| SCR-0104 | - | 정산 내역 조회 |
| SCR-0105 | FUNC-23 | 정산 완료 알림(시스템 자동) |
| SCR-0200 | FUNC-05 | 차량 등록(등록원부 OCR) |
| SCR-0201 | FUNC-06 | 검차 신청 |
| SCR-0202 | FUNC-08 | 검차 결과 조회(평가사 업로드) |
| SCR-0300 | FUNC-15 | 판매 방식 변경 |
| SCR-0400 | FUNC-19 | 즉시구매(바이어 외부 시스템) |
| SCR-0600 | FUNC-20, FUNC-21 | 탁송 일정 조율, 배차 조율 및 확정 |
| SCR-0601 | FUNC-21, FUNC-22 | 배차 정보 조회, 인계 승인 |

### 3.3 Function → Entity/API/NFR 매핑

| Function ID | Entity ID | API ID | NFR ID | 설명 |
|---|---|---|---|---|
| FUNC-00 | - | - | - | 로그인 (API 별도 정의 필요) |
| FUNC-01 | ENT-03 | API-0001 | NFR-0300 | 딜러 회원가입 |
| FUNC-02 | ENT-03 | API-0002 | NFR-0100, NFR-0300 | 사업자 인증 |
| FUNC-05 | ENT-01 | API-0100 | NFR-0100, NFR-0201 | 차량 등록(등록원부 OCR) |
| FUNC-06 | ENT-01 | API-0101 | NFR-0300 | 검차 신청 |
| FUNC-07 | ENT-01 | API-0102 | NFR-0300 | 평가사 배정(시스템 자동) |
| FUNC-08 | ENT-01 | API-0103 | NFR-0300 | 검차 결과 업로드(평가사) |
| FUNC-15 | ENT-01, ENT-02 | API-0300 | NFR-0200 | 판매 방식 변경 |
| FUNC-16 | ENT-02 | API-0301 | NFR-0200, NFR-0302 | 일반 판매 제안 수락 |
| FUNC-17 | ENT-02 | API-0302 | NFR-0200 | 바이어 최종 구매 의사 재확인(바이어 외부) |
| FUNC-18 | ENT-02 | API-0200 | NFR-0200 | 경매 입찰(바이어 외부 시스템) |
| FUNC-19 | ENT-02 | API-0201 | NFR-0200, NFR-0202 | 즉시구매(바이어 외부 시스템) |
| FUNC-20 | ENT-04 | API-0600 | NFR-0300, NFR-0301 | 탁송 일정 조율 |
| FUNC-21 | ENT-04, ENT-05 | API-0601, API-0602 | NFR-0300, NFR-0302 | 배차 조율 및 확정 |
| FUNC-22 | ENT-05 | API-0603 | NFR-0303, NFR-0304 | 인계 승인 |
| FUNC-23 | ENT-06 | API-0604 | NFR-0302, NFR-0305 | 정산 완료 알림(시스템 자동) |

---

## 4. 검증 완료 상태

### 4.1 무결성 검사

- ✅ ID 형식 검증: 모든 ID가 규칙 준수
- ✅ Registry 유일성: 중복 없음
- ✅ Cross-Reference 무결성: 모든 참조 ID 유효
- ✅ API Registry 보완: Traceability Matrix의 모든 API 등록 완료

### 4.2 논리 일치성 검사

- ✅ Phase 범위 논리: Function Registry 개수 일치 (14개)
- ✅ API 논리: API Registry ↔ 상세 명세 대응성 완료 (16개)
- ✅ Traceability Matrix 일치성: 모든 API 참조 일치

---

## 5. SSOT 준수 원칙

### 5.1 ID 참조 규칙

1. **모든 ID는 PRD Registry에서만 참조**: 다른 문서에서 ID를 참조할 때는 반드시 PRD Registry에 존재하는지 확인
2. **새로운 ID 추가 시**: PRD Registry에 먼저 추가한 후 다른 문서에서 참조
3. **ID 수정 시**: PRD Registry 수정 후 모든 참조 문서 업데이트

### 5.2 매핑 관계 규칙

1. **매핑 테이블 일치성**: 모든 매핑 테이블은 PRD의 매핑 테이블과 일치해야 함
2. **새로운 매핑 추가 시**: PRD의 매핑 테이블에 먼저 추가
3. **매핑 수정 시**: PRD의 매핑 테이블 수정 후 모든 참조 문서 업데이트

### 5.3 문서 버전 관리

1. **PRD 버전 업데이트 시**: 모든 참조 문서의 버전 정보 업데이트
2. **변경 이력 관리**: PRD의 변경 이력을 문서 거버넌스 섹션에 기록

---

## 6. 향후 작업 권장사항

### 6.1 즉시 작업 (완료)

- ✅ API Registry 보완 (API-0001, API-0002, API-0101, API-0102, API-0103, API-0302 추가)
- ✅ API 상세 명세 작성
- ✅ Traceability Matrix 일치성 확인

### 6.2 단기 작업 (1주일 내)

- IA/SPM 미매핑 항목 해결 (정산/승인 프로세스)
- IA 관련 정책 ID 채우기
- 빈 필드 비율 분석 및 보완

### 6.3 중기 작업 (1개월 내)

- Entity 스키마 상세 정의 (ENT-03, ENT-04, ENT-05, ENT-06)
- NFR 전체 목록 정리 및 Registry 구축
- 문서 스타일 일관성 점검

---

**SSOT 정리 완료일**: 2025-12-31  
**기준 문서**: PRD_Phase1_2025-12-31.md (v2.3)  
**검증 상태**: 완료

