# IA 기능명세 신규 문서 작성 플랜 (I·P·O·E + 전역/세부 플로우)

**전제**: 기존 [FIGMA_IA_FSD_STRUCTURE.md](FIGMA_IA_FSD_STRUCTURE.md)는 수정하지 않는다. **신규 문서 1개**를 새로 만든다.

**ERD·API 참조 (유일 신뢰 문서)**  
- [CarivDealer_api_v1.md](../CarivDealer_api_v1.md)  
- [CarivDealer_API_ERD_Mapping.md](../CarivDealer_API_ERD_Mapping.md)  

위 두 문서만 기준으로 API·엔티티·상태·필드를 인용하며, 그 외 ERD/API 문서는 참조하지 않는다.

---

## 1. 산출물

| 항목 | 내용 |
|------|------|
| **파일** | `docs/figma/IA_SITEMAP_SPEC_IPOE.md` (가제) — 신규 생성 |
| **IA 골격** | 사용자 제공 사이트맵(랜딩 → GNB 5탭 → 회원가입 → 매물등록 CTA → 마이페이지)을 계층·플로우 기준으로 반영 |
| **기능 단위** | 각 기능·화면별 **I·P·O·E** 구조로 명세 고정 |
| **플로우차트** | **전역 플로우** 1개 + **세부 기능별 플로우** N개, Mermaid 문법으로 작성(기존 문서 Mermaid 스타일 보강) |
| **API/ERD** | 모든 엔드포인트·필드·상태는 CarivDealer_api_v1.md, CarivDealer_API_ERD_Mapping.md만 인용 |

---

## 2. I·P·O·E 구조 정의

각 **기능(또는 화면/플로우)**마다 아래 4가지 블록으로 명세를 확정한다.

| 구분 | 의미 | 기재 내용 |
|------|------|-----------|
| **I (Input)** | 진입 조건·트리거·입력 데이터 | 라우트, 전제 조건(로그인 여부 등), 사용자 입력(폼 필드·클릭), 호출하는 API 요청 파라미터(참조: api_v1, ERD_Mapping) |
| **P (Process)** | 처리 단계·비즈니스 로직 | 단계별 처리(유효성 검사, API 호출 순서, 상태 전환), 사용 API(Method+URL)·ERD 테이블(ERD_Mapping 섹션 참조) |
| **O (Output)** | 결과·화면·상태 변화 | 표시 화면/라우트, API 응답에 따른 UI 상태, 저장/갱신되는 데이터(ERD 컬럼·계산값 구분은 ERD_Mapping §계산값 참고) |
| **E (Exception)** | 예외·에러·분기 | 실패 시 메시지, 재시도/복구, 권한 없음·유효성 실패·네트워크 오류 등; API message·에러 코드는 api_v1 공통 포맷 기준 |

---

## 3. 문서 전체 구조 (안)

1. **개요**  
   - 목적, SSOT 사이트맵 요약, ERD/API 참조 문서 고정(api_v1, ERD_Mapping만).
2. **전역 플로우**  
   - 단일 Mermaid flowchart: 앱 진입(/) → 랜딩 → (비로그인 시 회원가입 유도) / (로그인 시 GNB 5탭) → 차량목록/검차/거래/탁송/정산 → 회원가입 플로우, 매물등록 CTA(1~5), 마이페이지. 노드 ID는 공백 없이(camelCase/under_score).
3. **사이트맵 계층**  
   - 사용자 제공 사이트맵을 표로 정리(경로·탭·nodeId·역할). 1714-23434 등 컨테이너 nodeId는 “탭 랜딩”으로 명시.
4. **기능별 명세 (I·P·O·E)**  
   - 아래 5. 기능 목록 기준으로, 각 기능마다 **I / P / O / E** 4개 소절 + (해당 시) **세부 플로우 Mermaid** 1개.
5. **전역·세부 플로우 Mermaid 규칙**  
   - 노드 ID: 공백·예약어(end, subgraph 등) 금지; 레이블에 특수문자 있으면 쌍따옴표.  
   - 기존 문서와 동일하게 flowchart TD/LR, Start/End, Input(평행사변형), Task, Server, Decision 사용.  
   - 전역: 앱 레벨 1개. 세부: 기능별 1개(회원가입 step, 차량 등록, 검차 신청, 매물등록 CTA_1~5, 마이페이지 사이드 페이지 등).

---

## 4. 기능 목록 (I·P·O·E 적용 단위)

사이트맵 기준으로, 아래를 “기능” 단위로 두고 각각 I·P·O·E + 세부 플로우를 작성한다.

| # | 기능(플로우) | 설명 | 참조 API/ERD (api_v1, ERD_Mapping만) |
|---|----------------|------|--------------------------------------|
| 1 | 랜딩 | 로그인 전 풀뷰 → Hero → 알림노출 | (정적 화면; API 없을 수 있음) |
| 2 | 회원가입 유도 | GNB 탭 클릭 시 비로그인 → 나의매물목록_회원가입유도 | GET /signup/status 등 |
| 3 | GNB 차량목록 탭 | 1714-23434, 필터별 8153/8420/12046/8636/8842 | GET /vehicles, POST /vehicles/search, §목록 items (api_v1 §3, ERD_Mapping 차량 목록) |
| 4 | GNB 검차 탭 | 9445 검차요청내역 리스트, 리스팅 클릭 시 상태 전환 | POST /vehicles/:id/inspections, GET /vehicles/:id/inspections/latest (api_v1 §3.1, ERD_Mapping 검차 플로우) |
| 5 | GNB 거래 탭 | 1714-22332 리스팅, 단계별 상태 전환 | GET /vehicles, vehicle.status·displayStatus·primaryCta (ERD_Mapping 차량 목록·판매방식) |
| 6 | GNB 탁송 탭 | 1714-22874 | ERD_Mapping 물류/탁송 제안(GET/POST /logistics/*) |
| 7 | GNB 정산 탭 | 1714-23139 | ERD_Mapping 정산/매출 제안 |
| 8 | 회원가입 | 로그인 → 진입 → Step1~5 → 승인대기(→승인완료) | api_v1 §1·§2, ERD_Mapping 회원가입·딜러·엔드포인트 매핑 |
| 9 | 매물등록 CTA_1 차량원부등록 | 비대면 랜딩 → 원부등록 → 완료확인 | POST /vehicle/files, GET /vehicles/lookup, POST /vehicles/ocr/parse, POST /vehicles (api_v1 §3) |
| 10 | 매물등록 CTA_2 검차 | 검차신청 Step1 → 매칭 → 완료 → 결과요약 | POST /vehicles/:id/inspections, GET /vehicles/:id/inspections/latest (api_v1 §3.1, ERD_Mapping 검차) |
| 11 | 매물등록 CTA_3 거래 | 판매방식선택 → 일반/경매 분기 → 시세·시작가·완료·거래상세 | GET /vehicles/:id, ERD_Mapping 판매방식·경매 플로우 (api_v1 확장 제안만 있으면 “제안”으로 명시) |
| 12 | 매물등록 CTA_4 탁송 | 목록뷰 → 새탁송예약(폼·주소·일시) → 기사배정 진행 | ERD_Mapping 물류/탁송 엔드포인트 제안 |
| 13 | 매물등록 CTA_5 정산 | 검차피드백 → 정산목록 필터카드뷰, 종료 시 차량목록 복귀 | ERD_Mapping 정산/매출 제안 |
| 14 | 마이페이지 | 내프로필 랜딩, 사이드바 페이지 전환(기본정보·딜러승인·사업자·비밀번호·알림·알림센터·FAQ) | ERD_Mapping 오퍼/마이페이지 제안 |

---

## 5. 전역 플로우 Mermaid (개요)

- **전역 1개**: 진입(/) → 랜딩 → 비로그인/로그인 분기 → (회원가입 유도 or GNB 5탭) → 회원가입 플로우 / 매물등록 CTA / 마이페이지 → 각 종료 또는 차량목록 복귀.
- 노드 ID: `Landing`, `GNB`, `SignupFlow`, `ListingVehicles`, `ListingInspections`, `ListingDeals`, `ListingLogistics`, `ListingSettlements`, `CTA1`~`CTA5`, `Mypage` 등 공백 없이.

---

## 6. 세부 플로우 Mermaid 보강 규칙

- 기존 [FIGMA_IA_FSD_STRUCTURE.md](FIGMA_IA_FSD_STRUCTURE.md)의 Mermaid 스타일(flowchart TD/LR, `Start([Start])`, `End([End])`, `:::start`, `:::input`, `:::task`, `:::server`, `:::decision`)을 유지하되, 다음을 적용한다.  
  - 노드 ID에 공백·예약어 사용 금지.  
  - 엣지 라벨에 괄호 등 특수문자 있으면 쌍따옴표로 감싼다.  
  - 세부 플로우는 “기능별 1개”만 두어, 해당 기능의 I·P·O와 일치시킨다.

---

## 7. 작업 순서

1. `docs/figma/IA_SITEMAP_SPEC_IPOE.md` 신규 생성.  
2. §개요: SSOT 사이트맵 요약, ERD/API 참조는 api_v1·ERD_Mapping만 명시.  
3. §전역 플로우: Mermaid 1개 작성(노드 ID·엣지 규칙 준수).  
4. §사이트맵 계층: 사용자 사이트맵 표 정리(경로·nodeId·역할).  
5. §기능별 명세: 4. 기능 목록 순으로, 각 기능에 **I / P / O / E** 4소절 작성; API·ERD 인용 시 반드시 [CarivDealer_api_v1.md](../CarivDealer_api_v1.md), [CarivDealer_API_ERD_Mapping.md](../CarivDealer_API_ERD_Mapping.md)의 절·표만 참조.  
6. 기능별 **세부 플로우** Mermaid 1개씩 추가(해당 기능 블록 하단).  
7. 최종 검토: ERD/API 출처가 두 문서 밖에 없도록 확인.

---

이 플랜대로 진행하면, 기존 IA 문서는 건드리지 않고 **신규 IA 기능명세 문서**만 생성되며, **I·P·O·E**로 각 기능이 고정되고, **전역·세부 플로우**가 Mermaid로 보강되며, **ERD/API는 CarivDealer_api_v1.md와 CarivDealer_API_ERD_Mapping.md만 유일 참조**로 유지된다.
