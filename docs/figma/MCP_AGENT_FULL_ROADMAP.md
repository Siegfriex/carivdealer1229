# MCP 에이전트 전체 로드맵

**전제**: 에이전트 세션이 끝날 수 있음을 대비하여, **한 번의 프롬프트 = 1회 사이클**을 강제한다.  
매 입력마다 **이 로드맵 문서(MCP_AGENT_FULL_ROADMAP.md) §1~§2와 §3의 31 사이클 표**를 1차로 확인한 뒤, 아래 단계를 **순차적으로만** 진행한다. Cursor plans에 "IA Figma 섹션별 MCP 사이클 플랜"이 있으면 추가 참고, 없으면 로드맵 + MCP_CYCLE_LOG_TEMPLATE.md로 수행한다.

**버전**: 1.0  
**최종 업데이트**: 2026-02-08

---

## 1. 1회 사이클 정의 (강제 순서)

한 사이클은 아래 **A → B → C → D → E → F** 순서로만 실행한다. 단계를 건너뛰거나 역순으로 하지 않는다.

| 단계 | 이름 | 설명 |
|------|------|------|
| **A** | 플랜·코드베이스 확인 | 플랜 1차 열람, 해당 섹션/노드의 라우트·페이지·코드베이스 구혀사항 확인 |
| **B** | MCP 호출 (순차) | 규칙에 따라 get_design_context(필요 시 get_metadata)만 단계·순차 진행, 반환 데이터 보관 |
| **C** | 1차 구현 | 반환 데이터 누락 없이 디자인 구현 (px, Figma SSOT), 문서 스위트(API/ERD) 참조 |
| **D** | 문서 검토·스크린샷 검증 | 문서 스위트에 따라 검토, get_screenshot 반환으로 세부 조정 및 감사 검토 |
| **E** | 체크리스트·API/ERD 갱신 | MCP_CYCLE_LOG 등 체크리스트 업데이트, API/ERD SSOT 보완 |
| **F** | 빌드·디버깅·리팩토링 | `npm run build` 실행, 에러 수정 및 필요 시 리팩토링 |

---

## 2. 단계별 상세 (에이전트 실행 규칙)

### A. 플랜·코드베이스 확인 (1차)

- **플랜 1차 열람**
  - **이 로드맵 문서(MCP_AGENT_FULL_ROADMAP.md) §1~§2와 §3의 31 사이클 표를 1차로 확인.** Cursor plans에 "IA Figma 섹션별 MCP 사이클 플랜"이 있으면 추가 참고, 없으면 로드맵 + [MCP_CYCLE_LOG_TEMPLATE.md](MCP_CYCLE_LOG_TEMPLATE.md)로 사이클 단계·체크리스트를 수행.
  - 이번 사이클의 **섹션 번호·이름**, **nodeId(최대 3개)**, **대표 라우트** 확인.
- **코드베이스 구혀사항 확인**
  - [src/app/router.tsx](src/app/router.tsx): 해당 라우트 존재 여부. 없으면 이번 사이클에서 라우트·페이지(플레이스홀더 가능) 추가할 것인지 확인.
  - [docs/figma/FIGMA_MCP_TO_CODE_CONVERSION.md](FIGMA_MCP_TO_CODE_CONVERSION.md): px 정합, rem/vw 제거·픽셀 변환 규칙 확인.
  - [docs/figma/FIGMA_IA_FSD_STRUCTURE.md](FIGMA_IA_FSD_STRUCTURE.md), [IA_FSD_COMPLETE_VERIFICATION_20260208.md](IA_FSD_COMPLETE_VERIFICATION_20260208.md): IA·라우트·nodeId SSOT 확인.
  - [docs/CarivDealer_api_v1.md](../CarivDealer_api_v1.md), [docs/CarivDealer_API_ERD_Mapping.md](../CarivDealer_API_ERD_Mapping.md): API/ERD SSOT 확인.

### B. MCP 호출 (단계적·순차)

- **규칙**: 데스크톱(로컬) MCP만 사용. Figma 데스크톱 앱에서 해당 프레임 선택 후 호출.
- **순서**:
  1. 해당 사이클의 **1~3개 nodeId**에 대해, **한 nodeId씩** 순차적으로:
     - 필요 시 `get_metadata`로 구조 확인 후, 구현 대상 노드 결정.
     - `get_design_context` 호출.
  2. 반환된 데이터(React+Tailwind, px 기반)를 **누락 없이** 기록·보관. Figma SSOT로 수용, 구현 시 **px 단위 유지**.

### C. 1차 구현

- 반환 데이터를 바탕으로 **디자인 구현** (페이지/위젯).
  - **px 단위**, rem/vw 사용 금지. 기존 컴포넌트 수정 시 rem/vw → px 변환 적용.
- API 호출이 필요하면 [CarivDealer_api_v1.md](../CarivDealer_api_v1.md), [CarivDealer_API_ERD_Mapping.md](../CarivDealer_API_ERD_Mapping.md)만 참조.

### D. 문서 검토·스크린샷 검증 (세부 조정·감사)

- **문서 스위트에 따른 검토**
  - IA·라우트·nodeId가 문서와 일치하는지 확인.
  - FIGMA_MCP_TO_CODE_CONVERSION 규칙 준수 여부 확인.
- **스크린샷 반환**
  - 구현한 라우트에 대해 `get_screenshot`(Figma nodeId) 호출.
  - Figma와 비교하여 **세부 조정**(레이아웃·간격·타이포·색상 등) 수행.
  - **감사 검토**: 동일 라우트 여러 상태(§3.4 등)는 IA 맥락으로 “같은 페이지의 다른 상태”임을 확인·기록.

### E. 체크리스트·API/ERD 갱신

- [MCP_CYCLE_LOG_TEMPLATE.md](MCP_CYCLE_LOG_TEMPLATE.md)의 체크리스트 블록을 채워 [MCP_CYCLE_LOG.md](MCP_CYCLE_LOG.md)에 이번 사이클 행 추가.
- 이번 사이클에서 사용한 엔드포인트·엔티티를 api_v1·ERD Mapping에 없으면 보완(또는 “예정” 표기).

### F. 빌드·디버깅·리팩토링

- **`npm run build`** 실행.
- 빌드 에러가 있으면 **즉시 수정** (디버깅).
- 필요 시 리팩토링(중복 제거, 네이밍, px 정합 등) 수행 후 다시 빌드로 검증.

---

## 3. 전체 로드맵 (31 사이클)

| 사이클 | 섹션 | nodeId (최대 3개) | 대표 라우트 |
|--------|------|-------------------|-------------|
| 1 | §3.1 랜딩 | 1368:37201, 37364, 43715 | `/` |
| 2 | §3.2 로그인·회원가입 | 1425:7280, 7613, 1513:12032 | `/login`, `/signup`, `/signup/step1` |
| 3 | §3.2 로그인·회원가입 | 1425:7309, 1513:11607, 1425:7445 | `/signup/step2`~`step4` |
| 4 | §3.2 로그인·회원가입 | 1425:7514, 7496, 7505 | `/signup/step5`, `/signup/pending`, `/signup/complete` |
| 5 | §3.3 대시보드 | 1418:25059 | `/dashboard` |
| 6 | §3.4 차량 목록 | 15487, 15695, 15903 | `/vehicles` |
| 7 | §3.4 차량 목록 | 15565, 17357, 20145 | `/vehicles` |
| 8 | §3.4 차량 목록 | 16327, 16111, 16860 | `/vehicles` |
| 9 | §3.4 차량 목록 | 16684, 17629, 17036 | `/vehicles` |
| 10 | §3.4 차량 목록 | 17196 | `/vehicles` |
| 11 | §3.5 차량 등록·상세·경매 | 20498, 23705, 23880 | `/vehicles/new`, `/vehicles/:id/auction/*` |
| 12 | §3.5 차량 등록·상세·경매 | 20576, 21868, 22630 | `/vehicles/:id`, `/vehicles/:id/auction/*` |
| 13 | §3.5 차량 등록·상세·경매 | 24679, 24463, 21690 | `/vehicles/:id/auction/*` |
| 14 | §3.5 차량 등록·상세·경매 | 21512, 24856, 22153 | `/vehicles/:id`, `/vehicles/:id/auction/*` |
| 15 | §3.5 차량 등록·상세·경매 | 22315, 22951 | `/vehicles/:id/auction/*` |
| 16 | §3.6 검차 | 1444:8198, 1425:9445, 9661 | `/inspections`, `/inspections/request` 등 |
| 17 | §3.6 검차 | 9875, 10137, 10663 | `/inspections/:id/*` |
| 18 | §3.6 검차 | 10813, 10285, 10443 | `/inspections/:id/*` |
| 19 | §3.7 일반 판매 | 8153, 8420, 12046 | `/vehicles`, `/vehicles/:id/sale/*` |
| 20 | §3.7 일반 판매 | 8636, 8842, 7638 | `/vehicles/:id/sale/*` |
| 21 | §3.7 일반 판매 | 8107, 7684, 7918 | `/vehicles/:id/sale/*` |
| 22 | §3.8 마이페이지/오퍼 | 36766, 37804, 37971 | `/mypage/*`, `/offers` |
| 23 | §3.8 마이페이지/오퍼 | 37042, 37170, 37677 | `/mypage/*`, `/offers` |
| 24 | §3.8 마이페이지/오퍼 | 38264, 38114, 36901 | `/mypage/*`, `/offers` |
| 25 | §3.8 마이페이지/오퍼 | 37298, 37559, 37402 | `/mypage/*`, `/offers` |
| 26 | §3.10 탁송 | 29145, 28880, 25060 | `/logistics/schedule`, `/logistics/request`, `/logistics/:id` |
| 27 | §3.10 탁송 | 25219, 27070, 26827 | `/logistics/*` |
| 28 | §3.10 탁송 | 25400, 25619, 26067 | `/logistics/*` |
| 29 | §3.10 탁송 | 26325, 26583 | `/logistics/*` |
| 30 | §3.11 정산 | 36405, 27657 | `/settlements`, `/settlements/:id`, `/sales/history` |
| 31 | §3.11 정산 | 27434, 27952 | `/settlements/:id`, `/sales/history` |

**nodeId 표기**: fileKey가 다른 섹션(§3.1, §3.2, §3.6 등)은 `파일키:노드` 형태(예: 1368:37201, 1425:7280). 동일 파일(1418) 내에서는 노드 번호만(예: 15487)으로 표기해도 됨. MCP 호출 시 Figma에서 선택하는 노드 ID는 Figma 앱 기준으로 입력.

---

## 4. 참조 문서 스위트

| 용도 | 문서 |
|------|------|
| 플랜 | 이 로드맵 §1~§3 (필수). 선택: Cursor plans의 IA Figma 섹션별 MCP 사이클 플랜 |
| IA·nodeId·라우트 SSOT | [FIGMA_IA_FSD_STRUCTURE.md](FIGMA_IA_FSD_STRUCTURE.md), [IA_FSD_COMPLETE_VERIFICATION_20260208.md](IA_FSD_COMPLETE_VERIFICATION_20260208.md) |
| Figma→코드 규칙 | [FIGMA_MCP_TO_CODE_CONVERSION.md](FIGMA_MCP_TO_CODE_CONVERSION.md) |
| 체크리스트 템플릿·로그 | [MCP_CYCLE_LOG_TEMPLATE.md](MCP_CYCLE_LOG_TEMPLATE.md), [MCP_CYCLE_LOG.md](MCP_CYCLE_LOG.md) |
| API/ERD SSOT | [CarivDealer_api_v1.md](../CarivDealer_api_v1.md), [CarivDealer_API_ERD_Mapping.md](../CarivDealer_API_ERD_Mapping.md) |
| 라우터 | [src/app/router.tsx](../../src/app/router.tsx) |

---

## 5. 1회 사이클 완료 기준

- A: 플랜·라우트·문서 확인 완료.
- B: 해당 사이클 nodeId(1~3개)에 대한 MCP 호출 완료, 반환 데이터 보관.
- C: 반환 데이터 기반 1차 구현 완료 (px, API/ERD 참조).
- D: 문서 스위트 검토 + get_screenshot 기반 세부 조정·감사 완료.
- E: MCP_CYCLE_LOG 등 체크리스트·API/ERD 갱신 완료.
- F: `npm run build` 성공 및 필요 시 디버깅·리팩토링 완료.

이 로드맵에 따라 **한 프롬프트당 한 사이클**만 진행하면, 세션이 끊겨도 다음 입력에서 다음 사이클만 지정해 이어갈 수 있다.
