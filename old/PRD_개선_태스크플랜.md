# PRD Phase 1 최종 업데이트 및 개선 태스크플랜

**대상 파일**: `PRD_Phase1_2025-12-31.md`  
**작성일**: 2025-12-31  
**기반**: 검증 보고서 (`PRD_IA_SPM_검증_보고서.md`) 분석 결과

---

## 개요

검증 보고서에서 발견된 문제점과 개선사항을 반영하여 PRD 문서의 완전성, 일관성, 정확성을 향상시키는 작업입니다.

---

## 1. Function Registry 보완

### 1.1 누락된 Function 추가 또는 상태 명확화

**현황**: FUNC-00, FUNC-03, FUNC-04, FUNC-09, FUNC-11, FUNC-12가 Function Registry에 없음 (20.2.1에만 언급)

**작업 내용**:
- **위치**: `PRD_Phase1_2025-12-31.md` 326-346행 (Function Registry 섹션)
- **작업**:
  1. FUNC-00 (로그인) 추가
     - 기능명: 로그인
     - 설명: 딜러/바이어 로그인 처리
     - 관련 화면: SCR-0001
     - 상태: 확정 (공통 기능)
  2. FUNC-03 (재인증/수정 요청) 추가 또는 주석 명확화
     - 기능명: 재인증/수정 요청
     - 설명: 사업자 인증 반려 시 재인증
     - 관련 화면: SCR-0003
     - 상태: FRD 미작성 (Phase 1 범위)
  3. FUNC-04 (차량 임시 저장) 추가 또는 주석 명확화
     - 기능명: 차량 임시 저장
     - 설명: 차량 등록 중 임시 저장
     - 관련 화면: SCR-0200
     - 상태: FRD 미작성 (Phase 1 범위)
  4. FUNC-09 (VIN 기반 중복 등록 방지) 추가 또는 주석 명확화
     - 기능명: VIN 기반 중복 등록 방지
     - 설명: 차대번호 중복 체크
     - 관련 화면: SCR-0200
     - 상태: FRD 미작성 (Phase 1 범위)
  5. FUNC-11 (판매 방식 선택) 추가 또는 주석 명확화
     - 기능명: 판매 방식 선택(일반/경매)
     - 설명: 초기 판매 방식 선택
     - 관련 화면: SCR-0300
     - 상태: FRD 미작성 (Phase 1 범위)
  6. FUNC-12 (경매 생성/설정) 추가 또는 주석 명확화
     - 기능명: 경매 생성/설정
     - 설명: 경매 시작가/즉시구매가 설정
     - 관련 화면: SCR-0400
     - 상태: FRD 미작성 (Phase 1 범위)

**대안**: Function Registry에 추가하지 않고, 20.2.1 섹션의 주석을 더 명확하게 개선

**우선순위**: High

---

## 2. API Registry 정리 및 명확화

### 2.1 API Registry 섹션 추가 또는 보완

**현황**: PRD에 명시적인 API Registry 섹션이 없음. API는 Function-API 매핑 테이블과 TSD 섹션에만 산재되어 있음

**작업 내용**:
- **위치**: `PRD_Phase1_2025-12-31.md` Section 13 (TSD: 기술 설계) 또는 새로운 섹션 추가
- **작업**:
  1. API Registry 테이블 생성
     - API ID, API명, 엔드포인트, HTTP 메서드, 설명, 관련 Function, 관련 NFR
     - Phase 1 Function 연계 API: API-0100, API-0200, API-0201, API-0300, API-0301, API-0600, API-0601, API-0602, API-0603, API-0604 (총 10개)
  2. 기존 API 정보 통합
     - ForwardMax_PRD_ExcelSource.md의 API 정보 참조
     - TSD 섹션의 API 정보와 일치성 확인
  3. API 상세 명세 보완
     - 요청 파라미터, 응답 데이터 형식 명확화
     - 에러 처리 규칙 명시

**우선순위**: High

---

## 3. 누락된 기능/화면 명세 보완

### 3.1 output.json에만 존재하는 항목에 대한 PRD 보완 결정

**현황**: output.json에만 존재하는 항목들이 PRD에 없음

**작업 내용**:
- **항목 1**: 정산 관련 기능 (Seller-ia-front-settle-01~03)
  - **결정 필요**: PRD에 정산 관련 Function 추가 여부
  - **현황**: FUNC-23은 정산 완료 알림만 있음
  - **옵션**:
    - 옵션 A: 정산 조회/상세 기능 추가 (FUNC-24, FUNC-25 등)
    - 옵션 B: Phase 1 범위 외로 명시
  - **권장**: 옵션 B (Phase 1 후반 또는 Phase 2로 분류)

- **항목 2**: 승인 프로세스 관련 기능 (Seller-ia-front-approve-01~06)
  - **결정 필요**: PRD에 승인 프로세스 Function 추가 여부
  - **현황**: 사업자 인증(FUNC-02)은 있으나 승인 프로세스는 없음
  - **옵션**:
    - 옵션 A: 승인 프로세스 Function 추가
    - 옵션 B: FUNC-02의 일부로 간주
  - **권장**: 옵션 B (FUNC-02 설명 보완)

- **항목 3**: 차량 목록 조회 기능 (Seller-ia-front-list-01~08)
  - **결정 필요**: PRD에 차량 목록 조회 Function 추가 여부
  - **현황**: SCR-0101(차량 목록) 화면은 있으나 Function 없음
  - **옵션**:
    - 옵션 A: 차량 목록 조회 Function 추가 (FUNC-XX)
    - 옵션 B: 조회 기능은 Function으로 분류하지 않음
  - **권장**: 옵션 B (조회 기능은 별도 Function으로 분류하지 않는 것이 PRD 규칙)

**우선순위**: Medium

### 3.2 PRD에만 존재하는 항목에 대한 명세 보완

**현황**: PRD에만 존재하는 항목들이 output.json에 없음

**작업 내용**:
- **항목 1**: FUNC-00 (로그인)
  - **현황**: Function Registry에 없음, 20.2.1에만 언급
  - **작업**: Function Registry에 추가 (1.1 참조)

- **항목 2**: SCR-0001 (로그인), SCR-0100 (대시보드) 등
  - **현황**: Screen Registry에는 있으나 output.json에 없음
  - **작업**: Screen Registry는 유지 (output.json이 불완전한 것으로 간주)

- **항목 3**: API, Entity, NFR
  - **현황**: output.json에 API/Entity/NFR 정보가 없음
  - **작업**: PRD는 유지 (output.json이 IA/SPM 중심이므로 API/Entity/NFR은 PRD에만 있는 것이 정상)

**우선순위**: Low (대부분 정상적인 상황)

---

## 4. 정책 관련 Decision Log 보완

### 4.1 SPM 정책에 대응하는 Decision 추가

**현황**: output.json의 SPM 정책 중 일부가 PRD Decision Log에 없음

**작업 내용**:
- **위치**: `PRD_Phase1_2025-12-31.md` Section 16 (Decision Log)
- **작업**:
  1. 딜러 회원 정의 정책 (dealer-sp-user-01)
     - Decision 추가 또는 기존 Decision에 통합
  2. 가입 정보 입력 정책 (dealer-sp-join-02)
     - FUNC-01 관련 Decision 보완
  3. 로그인 정책 (dealer-sp-auth-01)
     - FUNC-00 관련 Decision 추가
  4. 서비스 이용 약관, 개인정보 처리 방침 (dealer-sp-legal-01~02)
     - FUNC-01 관련 Decision 보완
  5. 화폐 환율 적용 및 표시 (dealer-sp-fx-01)
     - Decision 추가 또는 Phase 1 범위 외로 명시

**우선순위**: Medium

---

## 5. 문서 일관성 검증 및 개선

### 5.1 ID 참조 일관성 검증

**작업 내용**:
- **위치**: 전체 문서
- **작업**:
  1. 모든 Function ID 참조가 Function Registry에 존재하는지 확인
  2. 모든 Screen ID 참조가 Screen Registry에 존재하는지 확인
  3. 모든 API ID 참조가 API Registry(신규 생성 시)에 존재하는지 확인
  4. 모든 Decision ID 참조가 Decision Log에 존재하는지 확인
  5. 모든 NFR ID 참조가 NFR Registry에 존재하는지 확인

**우선순위**: High

### 5.2 문서 버전 및 메타데이터 업데이트

**작업 내용**:
- **위치**: `PRD_Phase1_2025-12-31.md` 1-10행
- **작업**:
  1. 버전 업데이트: v2.1 → v2.2
  2. 최종 업데이트일: 2025-12-24 → 2025-12-31
  3. 검증 상태: 작성 중 → 검증 완료 (또는 검증 중)
  4. 검증 보고서 참조 추가

**우선순위**: Low

### 5.3 수치 정확성 검증

**작업 내용**:
- **위치**: 전체 문서
- **작업**:
  1. Function 개수: 13개 (Phase 1 완전 목록) 명시
  2. Screen 개수: 16개 확인
  3. API 개수: 10개 (Phase 1 Function 연계) 명시
  4. Entity 개수: 6개 확인
  5. Flow 개수: 5개 확인
  6. NFR 개수: 11개 확인
  7. Decision 개수: 6개 확인

**우선순위**: High

---

## 6. 검증 보고서 반영

### 6.1 검증 보고서 참조 추가

**작업 내용**:
- **위치**: `PRD_Phase1_2025-12-31.md` Section 19 (문서 거버넌스) 또는 부록
- **작업**:
  1. 검증 보고서 링크 추가
  2. 검증 일자 및 검증자 정보 추가
  3. 주요 발견사항 요약 추가

**우선순위**: Low

---

## 7. FRD 미작성 Function 명세 작성 (선택사항)

### 7.1 FRD 미작성 Function의 기본 명세 작성

**현황**: FUNC-00, FUNC-03, FUNC-04, FUNC-09, FUNC-11, FUNC-12가 FRD 미작성 상태

**작업 내용**:
- **위치**: `PRD_Phase1_2025-12-31.md` Section 10 (FRD: 세부 기능 명세)
- **작업**:
  1. 각 Function에 대한 기본 FRD 작성
     - 기능명, 정의, 목표, 트리거, 선행조건, 주요 플로우, 예외/오류, 출력, 달성기준, 관련 화면, 관련 API, 관련 NFR, 소스
  2. 우선순위에 따라 순차 작성
     - 우선순위 1: FUNC-00 (로그인) - 공통 기능
     - 우선순위 2: FUNC-11 (판매 방식 선택) - 핵심 기능
     - 우선순위 3: FUNC-12 (경매 생성/설정) - 핵심 기능
     - 우선순위 4: FUNC-03, FUNC-04, FUNC-09 - 보조 기능

**우선순위**: Medium (Phase 1 완료를 위해 필요)

---

## 우선순위별 작업 순서

### Phase 1 (즉시 실행)
1. 수치 정확성 검증 (5.3)
2. ID 참조 일관성 검증 (5.1)
3. Function Registry 보완 (1.1) - 최소한 FUNC-00 추가
4. API Registry 정리 (2.1)

### Phase 2 (단기)
5. 누락된 기능/화면 명세 보완 결정 (3.1)
6. 정책 관련 Decision Log 보완 (4.1)
7. FRD 미작성 Function 명세 작성 (7.1) - 우선순위 높은 항목부터

### Phase 3 (중기)
8. 문서 버전 및 메타데이터 업데이트 (5.2)
9. 검증 보고서 참조 추가 (6.1)

---

## 예상 산출물

1. 업데이트된 `PRD_Phase1_2025-12-31.md`
   - Function Registry 보완
   - API Registry 추가
   - Decision Log 보완
   - 문서 일관성 개선
2. 변경 이력 문서 (선택사항)
   - 변경 사항 요약
   - 변경 근거

---

## 주의사항

1. **기존 내용 보존**: 기존 PRD 내용을 삭제하지 않고 보완하는 방향으로 진행
2. **일관성 유지**: 기존 문서 스타일과 형식 유지
3. **검증 완료 후 반영**: 각 수정 사항은 검증 후 반영
4. **버전 관리**: 변경 사항은 버전 관리 시스템에 커밋

---

**작성일**: 2025-12-31  
**작성자**: AI Assistant  
**검토 필요**: 기획팀 리뷰 필요

