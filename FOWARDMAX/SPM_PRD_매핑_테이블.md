# SPM-PRD 매핑 테이블

**문서명**: output.json SPM 1.0 ↔ PRD Decision/NFR 매핑 테이블  
**버전**: 1.0  
**작성일**: 2025-12-31

---

## 매핑 규칙

1. **카테고리 기반 매칭**: 정책 카테고리와 Decision/NFR 카테고리 비교
2. **의미 기반 매칭**: 정책 소개와 Decision 내용 비교
3. **관계 기반 매칭**: 관련 기능과 Decision/NFR 관계 비교

---

## SPM → PRD Decision/NFR 매핑

| SPM 정책 ID | 정책 소개 | 정책분류 | 세부 항목 | PRD Decision ID | PRD NFR ID | 매핑 상태 | 매핑 근거 |
|---|---|---|---|---|---|---|---|
| dealer-sp-user-01 | 딜러 회원 정의 | User / Member | 회원 정의 | - | - | 매핑 불가 | PRD에 명시적 정책 없음 |
| dealer-sp-user-02 | 계정 상태 구분 | User / Member | 계정 상태 | - | - | 매핑 불가 | PRD에 명시적 정책 없음 |
| dealer-sp-join-01 | 딜러 가입 조건 | Sign Up | 가입 조건 | D-P1-001? | - | 분석 필요 | 회원가입 관련 결정 (간접적) |
| dealer-sp-join-02 | 가입 정보 입력 | Sign Up | 가입 정보 | - | - | 매핑 불가 | PRD에 명시적 정책 없음 |
| dealer-sp-join-03 | 가입 승인 방식 | Sign Up | 승인 방식 | - | - | 매핑 불가 | PRD에 명시적 정책 없음 |
| dealer-sp-join-04 | 가입 반려 처리 | Sign Up | 반려 처리 | - | - | 매핑 불가 | PRD에 명시적 정책 없음 |
| dealer-sp-auth-01 | 로그인 정책 | Auth | 로그인 | - | - | 매핑 불가 | PRD에 명시적 정책 없음 |
| dealer-sp-auth-02 | 비밀번호 재설정 | Auth | 비밀번호 | - | - | 매핑 불가 | PRD에 명시적 정책 없음 |
| dealer-sp-auth-03 | 로그인 제한 | Auth | 로그인 제한 | - | - | 매핑 불가 | PRD에 명시적 정책 없음 |
| dealer-sp-legal-01 | 서비스 이용 약관 | Legal | 약관 | - | - | 매핑 불가 | PRD에 명시적 정책 없음 |
| dealer-sp-legal-02 | 개인정보 처리 방침 | Legal | 개인정보 | - | - | 매핑 불가 | PRD에 명시적 정책 없음 |
| dealer-sp-legal-03 | 마케팅 정보 수신 | Legal | 마케팅 | - | - | 매핑 불가 | PRD에 명시적 정책 없음 |
| dealer-sp-legal-04 | 위치 정보 이용 | Legal | 위치 정보 | - | - | 매핑 불가 | PRD에 명시적 정책 없음 |
| dealer-sp-legal-05 | (추가 약관) | Legal | 약관 | - | - | 매핑 불가 | PRD에 명시적 정책 없음 |
| dealer-sp-trade-01 | 거래 정책 | Trade | 거래 | D-P1-004 | - | 매핑 가능 | 정보 공개 원칙 (간접적) |
| dealer-sp-trade-02 | 운영 정책 | Trade | 운영 | - | - | 매핑 불가 | PRD에 명시적 정책 없음 |
| dealer-sp-trade-03 | 공통 정책 | Trade | 공통 | - | - | 매핑 불가 | PRD에 명시적 정책 없음 |
| dealer-sp-noti-01 | 알림 정책 (딜러 승인 완료) | Notification | 알림 | - | NFR-0302 | 매핑 가능 | 알림 정확도 |
| dealer-sp-noti-02 | 알림 정책 (매물 등록 완료) | Notification | 알림 | - | NFR-0302 | 매핑 가능 | 알림 정확도 |
| dealer-sp-noti-03 | 알림 정책 (경매 시작) | Notification | 알림 | - | NFR-0302 | 매핑 가능 | 알림 정확도 |
| dealer-sp-noti-04 | 알림 정책 (거래 확정) | Notification | 알림 | - | NFR-0302 | 매핑 가능 | 알림 정확도 |
| dealer-sp-noti-05 | 알림 정책 (정산 완료) | Notification | 알림 | - | NFR-0302, NFR-0305 | 매핑 가능 | 알림 정확도 및 재시도 |
| dealer-sp-noti-06 | 알림 정책 | Notification | 알림 | - | NFR-0302 | 매핑 가능 | 알림 정확도 |
| dealer-sp-noti-07 | 알림 정책 | Notification | 알림 | - | NFR-0302 | 매핑 가능 | 알림 정확도 |
| dealer-sp-noti-08 | 알림 정책 | Notification | 알림 | - | NFR-0302 | 매핑 가능 | 알림 정확도 |
| dealer-sp-noti-09 | 알림 정책 | Notification | 알림 | - | NFR-0302 | 매핑 가능 | 알림 정확도 |
| dealer-sp-noti-10 | 알림 정책 | Notification | 알림 | - | NFR-0302 | 매핑 가능 | 알림 정확도 |
| dealer-sp-noti-11 | 알림 정책 | Notification | 알림 | - | NFR-0302 | 매핑 가능 | 알림 정확도 |
| dealer-sp-fx-01 | 화폐 환율 적용 및 표시 | FX | 환율 | - | - | 매핑 불가 | PRD에 명시적 정책 없음 |

---

## PRD Decision Log

| Decision ID | 결정 내용 | 영향 범위 | 상태 |
|---|---|---|---|
| D-P1-001 | 일반 판매 → 경매 전환 가능 | SCR-0300, FUNC-15 | 확정 |
| D-P1-002 | 등록원부 OCR 기반 차량정보 자동 채움 | SCR-0200, FUNC-05, SRD-001 | 확정 |
| D-P1-003 | 경매 즉시구매 포함 | SCR-0400, FUNC-19 | 확정 |
| D-P1-004 | 정보 공개 원칙(비공개=상호 공개) | FUNC-18, FUNC-19, 유저플로우, NFR, TSD | 확정 |
| D-P1-005 | 일반 거래(제안형) 프로세스 명시 | FUNC-16, 일반 판매 제안 관련 기능 | 확정 |
| D-P1-006 | 바이어 스코프 축소(딜러 웹앱 중심) | 전체 문서 | 확정 |

---

## PRD NFR Registry

| NFR ID | 요구사항명 | 정의 | 관련 기능 |
|---|---|---|---|
| NFR-0100 | OCR 성능 | 등록원부 OCR 처리 시간 및 정확도 요구사항 | FUNC-05 |
| NFR-0101 | 경매 낙찰 처리 성능 | 경매 종료 시 낙찰 처리 및 당사자 공개 지연 시간 | FUNC-18 |
| NFR-0200 | 동시성 제어 | 경매 입찰 및 즉시구매 시 동시 요청 처리 정확도 | FUNC-18, FUNC-19 |
| NFR-0201 | 외부 API 장애 대응 | 등록원부 OCR 등 외부 API 장애 시 대체 경로 | FUNC-05 |
| NFR-0202 | 원자성 보장 | 즉시구매 시 동시 요청 중 첫 번째 요청만 성공 | FUNC-19 |
| NFR-0300 | 외부 API 장애 대응 | 탁송 일정 조율 시 외부 API 연동 | FUNC-20 |
| NFR-0301 | 타임아웃 처리 | 탁송 일정 조율 시 타임아웃 처리 | FUNC-20 |
| NFR-0302 | 알림 정확도 | 알림 발송 정확도 | FUNC-23 |
| NFR-0303 | 데이터 무결성 | 인계 승인 시 데이터 무결성 | FUNC-22 |
| NFR-0304 | 보안 로그 | 인계 승인 시 보안 로그 | FUNC-22 |
| NFR-0305 | 알림 재시도 | 알림 발송 실패 시 재시도 | FUNC-23 |

---

## 매핑 통계

| 항목 | 개수 | 매핑 가능 | 매핑 불가 | 분석 필요 |
|---|---|---|---|---|
| SPM 정책 항목 | 29개 | ~12개 | ~15개 | ~2개 |
| PRD Decision | 6개 | - | - | - |
| PRD NFR | 11개 | - | - | - |

---

## 주요 발견사항

1. **정책 내용 미기입**: SPM 시트의 "정책 내용" 필드가 대부분 비어있어 상세 매핑 어려움
2. **매핑 불가 항목 다수**: PRD에 명시적 정책이 없는 SPM 항목이 많음
3. **알림 정책 매핑 가능**: dealer-sp-noti-* 항목들은 NFR-0302와 매핑 가능
4. **거래 정책 간접 매핑**: dealer-sp-trade-01은 D-P1-004와 간접적으로 관련

---

**문서 버전**: 1.0  
**최종 업데이트**: 2025-12-31

