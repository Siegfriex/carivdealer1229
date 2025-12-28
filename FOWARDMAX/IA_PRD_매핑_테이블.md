# IA-PRD 매핑 테이블

**문서명**: output.json IA 1.0 ↔ PRD Function/Screen 매핑 테이블  
**버전**: 1.0  
**작성일**: 2025-12-31

---

## 매핑 규칙

1. **의미 기반 매칭**: 기능 정의와 기능명 비교
2. **카테고리 기반 매칭**: Depth 구조와 Flow 구조 비교
3. **화면 기반 매칭**: 화면 ID와 Screen ID 비교

---

## IA → PRD Function 매핑

| IA 기능 ID | 화면 ID | 기능 정의 | Depth 구조 | PRD Function ID | PRD Screen ID | PRD Flow ID | 매핑 상태 | 매핑 근거 |
|---|---|---|---|---|---|---|---|---|
| Seller-ia-front-join-01 | JoinEmail | 로그인 및 계정 식별에 사용할 이메일 주소를 입력한다 | 회원가입/인증 > 기본 회원가입 > 이메일 입력 | FUNC-01 | SCR-0002 | FLOW-01 | 매핑 가능 | 회원가입 기능의 일부 |
| Seller-ia-front-join-02 | JoinPassword | 계정 보호를 위한 비밀번호를 설정한다 | 회원가입/인증 > 기본 회원가입 > 비밀번호 설정 | FUNC-01 | SCR-0002 | FLOW-01 | 매핑 가능 | 회원가입 기능의 일부 |
| Seller-ia-front-join-03 | JoinPassword | 비밀번호 오입력을 방지하기 위해 동일한 비밀번호를 재입력한다 | 회원가입/인증 > 기본 회원가입 > 비밀번호 재입력 | FUNC-01 | SCR-0002 | FLOW-01 | 매핑 가능 | 회원가입 기능의 일부 |
| Seller-ia-front-join-04 | JoinProfile | 서비스 내에서 사용될 딜러 이름을 입력한다 | 회원가입/인증 > 기본 회원가입 > 딜러 이름 입력 | FUNC-01 | SCR-0002 | FLOW-01 | 매핑 가능 | 회원가입 기능의 일부 |
| Seller-ia-front-join-05 | JoinPhone | 본인 명의 휴대폰 번호를 입력한다 | 회원가입/인증 > 기본 회원가입 > 휴대폰 번호 입력 | FUNC-01 | SCR-0002 | FLOW-01 | 매핑 가능 | 회원가입 기능의 일부 |
| Seller-ia-front-join-06 | JoinPhone | 입력한 휴대폰 번호로 SMS 인증을 수행한다 | 회원가입/인증 > 기본 회원가입 > SMS 인증 수행 | FUNC-01 | SCR-0002 | FLOW-01 | 매핑 가능 | 회원가입 기능의 일부 |
| Seller-ia-front-join-07 | JoinTerms | 만 14세 이상 여부에 대한 동의를 받는다 | 회원가입/인증 > 기본 회원가입 > 만 14세 이상 동의 | FUNC-01 | SCR-0002 | FLOW-01 | 매핑 가능 | 회원가입 기능의 일부 |
| Seller-ia-front-join-08 | JoinTerms | 서비스 이용약관에 대한 동의를 받는다 | 회원가입/인증 > 기본 회원가입 > 서비스 이용약관 동의 | FUNC-01 | SCR-0002 | FLOW-01 | 매핑 가능 | 회원가입 기능의 일부 |
| Seller-ia-front-join-09 | JoinTerms | 개인정보 처리방침에 대한 동의를 받는다 | 회원가입/인증 > 기본 회원가입 > 개인정보 처리방침 동의 | FUNC-01 | SCR-0002 | FLOW-01 | 매핑 가능 | 회원가입 기능의 일부 |
| Seller-ia-front-biz-01 | - | 사업자 인증 관련 기능 | 승인 프로세스 > 사업자 인증 | FUNC-02 | SCR-0003 | FLOW-01 | 매핑 가능 | 사업자 인증 |
| Seller-ia-front-biz-02 | - | 사업자 인증 관련 기능 | 승인 프로세스 > 사업자 인증 | FUNC-02 | SCR-0003 | FLOW-01 | 매핑 가능 | 사업자 인증 |
| Seller-ia-front-biz-03 | - | 사업자 인증 관련 기능 | 승인 프로세스 > 사업자 인증 | FUNC-02 | SCR-0003 | FLOW-01 | 매핑 가능 | 사업자 인증 |
| Seller-ia-front-biz-04 | - | 사업자 인증 관련 기능 | 승인 프로세스 > 사업자 인증 | FUNC-02 | SCR-0003 | FLOW-01 | 매핑 가능 | 사업자 인증 |
| Seller-ia-front-settle-01 | - | 정산 관련 기능 | 정산 | - | - | - | 매핑 불가 | PRD에 정산 관련 Function 없음 (FUNC-23은 알림만) |
| Seller-ia-front-settle-02 | - | 정산 관련 기능 | 정산 | - | - | - | 매핑 불가 | PRD에 정산 관련 Function 없음 |
| Seller-ia-front-settle-03 | - | 정산 관련 기능 | 정산 | - | - | - | 매핑 불가 | PRD에 정산 관련 Function 없음 |
| Seller-ia-front-approve-01 | - | 승인 프로세스 관련 기능 | 승인 프로세스 > 딜러 승인 요청 | - | - | - | 매핑 불가 | PRD에 승인 프로세스 Function 없음 |
| Seller-ia-front-approve-02 | - | 승인 프로세스 관련 기능 | 승인 프로세스 > 관리자 승인 | - | - | - | 매핑 불가 | PRD에 승인 프로세스 Function 없음 |
| Seller-ia-front-approve-03 | - | 승인 프로세스 관련 기능 | 승인 프로세스 | - | - | - | 매핑 불가 | PRD에 승인 프로세스 Function 없음 |
| Seller-ia-front-approve-04 | - | 승인 프로세스 관련 기능 | 승인 프로세스 | - | - | - | 매핑 불가 | PRD에 승인 프로세스 Function 없음 |
| Seller-ia-front-approve-05 | - | 승인 프로세스 관련 기능 | 승인 프로세스 | - | - | - | 매핑 불가 | PRD에 승인 프로세스 Function 없음 |
| Seller-ia-front-approve-06 | - | 승인 프로세스 관련 기능 | 승인 프로세스 | - | - | - | 매핑 불가 | PRD에 승인 프로세스 Function 없음 |
| Seller-ia-front-list-01 | - | 차량 목록 관련 기능 | 매물 등록 > 차량 목록 | - | SCR-0101 | FLOW-03 | 매핑 가능 (화면만) | 차량 목록 화면 |
| Seller-ia-front-list-02 | - | 차량 목록 관련 기능 | 매물 등록 > 차량 목록 | - | SCR-0101 | FLOW-03 | 매핑 가능 (화면만) | 차량 목록 화면 |
| Seller-ia-front-list-03 | - | 차량 목록 관련 기능 | 매물 등록 > 차량 목록 | - | SCR-0101 | FLOW-03 | 매핑 가능 (화면만) | 차량 목록 화면 |
| Seller-ia-front-list-04 | - | 차량 목록 관련 기능 | 매물 등록 > 차량 목록 | - | SCR-0101 | FLOW-03 | 매핑 가능 (화면만) | 차량 목록 화면 |
| Seller-ia-front-list-05 | - | 차량 목록 관련 기능 | 매물 등록 > 차량 목록 | - | SCR-0101 | FLOW-03 | 매핑 가능 (화면만) | 차량 목록 화면 |
| Seller-ia-front-list-06 | - | 차량 목록 관련 기능 | 매물 등록 > 차량 목록 | - | SCR-0101 | FLOW-03 | 매핑 가능 (화면만) | 차량 목록 화면 |
| Seller-ia-front-list-07 | - | 차량 목록 관련 기능 | 매물 등록 > 차량 목록 | - | SCR-0101 | FLOW-03 | 매핑 가능 (화면만) | 차량 목록 화면 |
| Seller-ia-front-list-08 | - | 차량 목록 관련 기능 | 매물 등록 > 차량 목록 | - | SCR-0101 | FLOW-03 | 매핑 가능 (화면만) | 차량 목록 화면 |
| Seller-ia-front-inspect-01 | - | 검차 신청 관련 기능 | 검차 > 검차 신청 | FUNC-06 | SCR-0201 | FLOW-02 | 매핑 가능 | 검차 신청 |
| Seller-ia-front-inspect-02 | - | 검차 결과 조회 관련 기능 | 검차 > 검차 결과 조회 | FUNC-08 | SCR-0202 | FLOW-02 | 매핑 가능 | 검차 결과 조회 |
| Seller-ia-front-inspect-03 | - | 검차 관련 기능 | 검차 | FUNC-06 또는 FUNC-08 | SCR-0201 또는 SCR-0202 | FLOW-02 | 분석 필요 | 검차 관련 기능 |
| Seller-ia-front-inspect-04 | - | 검차 관련 기능 | 검차 | FUNC-06 또는 FUNC-08 | SCR-0201 또는 SCR-0202 | FLOW-02 | 분석 필요 | 검차 관련 기능 |
| Seller-ia-front-inspect-05 | - | 검차 관련 기능 | 검차 | FUNC-06 또는 FUNC-08 | SCR-0201 또는 SCR-0202 | FLOW-02 | 분석 필요 | 검차 관련 기능 |
| Seller-ia-front-inspect-06 | - | 검차 관련 기능 | 검차 | FUNC-06 또는 FUNC-08 | SCR-0201 또는 SCR-0202 | FLOW-02 | 분석 필요 | 검차 관련 기능 |
| Seller-ia-front-inspect-07 | - | 검차 관련 기능 | 검차 | FUNC-06 또는 FUNC-08 | SCR-0201 또는 SCR-0202 | FLOW-02 | 분석 필요 | 검차 관련 기능 |
| Seller-ia-front-inspect-08 | - | 검차 관련 기능 | 검차 | FUNC-06 또는 FUNC-08 | SCR-0201 또는 SCR-0202 | FLOW-02 | 분석 필요 | 검차 관련 기능 |
| Seller-ia-front-inspect-09 | - | 검차 관련 기능 | 검차 | FUNC-06 또는 FUNC-08 | SCR-0201 또는 SCR-0202 | FLOW-02 | 분석 필요 | 검차 관련 기능 |
| Seller-ia-front-inspect-10 | - | 검차 관련 기능 | 검차 | FUNC-06 또는 FUNC-08 | SCR-0201 또는 SCR-0202 | FLOW-02 | 분석 필요 | 검차 관련 기능 |
| Seller-ia-front-sale-01 | - | 일반 거래 선택 | 판매 방식 선택 > 일반 거래 > 일반 거래 선택 | FUNC-16 | SCR-0102 | FLOW-03 | 매핑 가능 | 일반 판매 |
| Seller-ia-front-sale-02 | OfferReceive | 바이어가 제안한 가격을 딜러가 수신한다 | 판매 방식 선택 > 일반 거래 > 가격 제안 수신 | FUNC-16 | SCR-0102 | FLOW-03 | 매핑 가능 | 일반 판매 제안 수락 |

> 주석: 전체 IA 항목은 약 47개로 추정되며, 상세 분석 필요

---

## PRD에만 존재하는 Function

| PRD Function ID | 기능명 | 설명 | 관련 화면 | 상태 |
|---|---|---|---|---|
| FUNC-00 | 로그인 | 딜러/바이어 로그인 | SCR-0001 | 확정 |
| FUNC-05 | 차량 등록(등록원부 OCR) | 차량번호 입력 → 등록원부 OCR → 기본정보 자동 채움 | SCR-0200 | 확정 |
| FUNC-07 | 평가사 배정 | 시스템이 평가사를 자동 배정 | - | 확정 |
| FUNC-15 | 판매 방식 변경 | 일반 판매 → 경매 전환 | SCR-0300 | 확정 |
| FUNC-17 | 바이어 최종 구매 의사 재확인 | 바이어(기업) 최종 구매 의사 재확인 | - | 확정 |
| FUNC-18 | 경매 입찰 | 바이어(기업) 입찰 처리 | - | 확정 |
| FUNC-19 | 즉시구매 | 경매 내 즉시구매 실행 | SCR-0400 | 확정 |
| FUNC-20 | 탁송 일정 조율 | 탁송 희망 일정 선택 및 물류 파트너 조율 | SCR-0600 | 확정 |
| FUNC-21 | 배차 조율 및 확정 | 배차 요청 및 탁송 기사 배정 | SCR-0600, SCR-0601 | 확정 |
| FUNC-22 | 인계 승인 | 차량 상태 동일 확인서, 차키/서류 인계 확인 후 PIN 입력 | SCR-0601 | 확정 |
| FUNC-23 | 정산 완료 알림 | 인계 승인 완료 후 정산 완료 알림 자동 발송 | SCR-0105 | 확정 |

---

## 매핑 통계

| 항목 | 개수 | 매핑 가능 | 매핑 불가 | 분석 필요 |
|---|---|---|---|---|
| IA 기능 항목 | 42개 (매핑 테이블 기준) | ~15개 | ~6개 | ~26개 |
| PRD Function | 13개 (Phase 1 완전 목록) | - | - | - |

---

**문서 버전**: 1.0  
**최종 업데이트**: 2025-12-31

