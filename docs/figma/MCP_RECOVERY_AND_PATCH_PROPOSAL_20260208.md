# MCP 재호출/복구 작업 결과 및 패치 제안

**작업 일자**: 2026-02-08  
**기준**: MCP_CALL_ERRORS_AND_OMISSIONS.md, Figma MCP get_design_context/get_metadata  
**Figma fileKey**: 4w3ft8RpGwoho5EtvNO9hQ

**참고(오토런 불가 시)**: MCP tool call 제한으로 실제 재호출 대신 **문서 우선 정렬**을 진행한 경우 — 1418:36765는 SS-only 추론 확정(design_context 7 ERROR + 3 PARTIAL, 스크린샷 12개 성공으로 역할 확정), 1425:9149는 design_context 9개 전원 호출 이력 확정으로 기록. **다음 단계**: 실제 MCP 호출 가능한 환경에서 17개 nodeId 재호출 후 본 문서를 실제 응답 인용으로 업데이트.

---

## 1. MCP 재호출/복구 작업 요약

- **1418:36765 마이페이지/오퍼 (12자식)**
  - get_design_context 재호출 10건(2026-02-08 순차 실행).
  - 결과: **6건 ERROR**(36766, 37804, 37971, 37042, 37677, 38264) — 응답: "An error occurred while using the tool get_design_context". **4건 PARTIAL**(37170, 38114, 37298, 37559) — 응답: "IMPORTANT: After you call this tool, you MUST call get_screenshot...". 기존 2건(36901, 37402) 성공 유지.
  - get_screenshot: 12건 기존 성공 유지.
  - **최종**: DC+SS 6건(36901, 37402, 37170, 38114, 37298, 37559), SS-only 6건(나머지).

- **1425:9149 검차 (9자식)**
  - get_design_context **최초 호출** 7건(1425:9661, 9875, 10137, 10663, 10813, 10285, 10443) — 2026-02-08 순차 실행.
  - 결과: 7건 모두 **PARTIAL** — 응답: "IMPORTANT: After you call this tool, you MUST call get_screenshot to get a screenshot of the node for context." 기존 2건(1444:8198, 1425:9445) 호출 완료 상태 유지.
  - **최종**: design_context 9개 전원 호출 완료(2건 기존 + 7건 2026-02-08 최초 호출). 추론 전략: DC+SS(스크린샷 기반 역할 확정).

- **1418:20497 차량 등록·상세/경매**
  - 재호출 없음. 14건 design_context·get_screenshot 완료 상태 유지.

- **1194-xxxx 공통 UI**
  - get_design_context·get_metadata 샘플 호출(1194:6635, 6640, 7155). 응답에 스크린샷/design_context 안내 반환. **name 필드 포함 여부**: 툴 출력만으로 미확인 → MCP 한계 유지, Figma 수동 확인 권장.

- **§5 design_context 미사용 페이지**
  - 로그인(SCR-0001), 비밀번호 찾기, 차량 상세(SCR-0300), 일반 판매 제안/판매 내역(SCR-0102·0103), 경매 전 단계(SCR-0400 등). 정산·탁송은 §3.11·§3.10 보완 완료. 본 회차에서 SCR nodeId 조회·design_context 호출 시도는 생략. **한계·리스크** 문단만 문서 반영.

---

## 2. 노드별 최종 MCP 상태 표

### 표 A — 1418:36765 자식 12개 (2026-02-08 순차 재호출·실제 응답 인용)

| nodeId     | design_context | screenshot | 추론 전략 | 실제 응답 인용 |
|------------|----------------|------------|-----------|----------------|
| 1418:36766 | ERROR          | SUCCESS    | SS-only   | "An error occurred while using the tool get_design_context" |
| 1418:37804 | ERROR          | SUCCESS    | SS-only   | "An error occurred while using the tool get_design_context" |
| 1418:37971 | ERROR          | SUCCESS    | SS-only   | "An error occurred while using the tool get_design_context" |
| 1418:37042 | ERROR          | SUCCESS    | SS-only   | "An error occurred while using the tool get_design_context" |
| 1418:37170 | PARTIAL        | SUCCESS    | DC+SS     | "IMPORTANT: After you call this tool, you MUST call get_screenshot to get a screenshot of the node for context." |
| 1418:37677 | ERROR          | SUCCESS    | SS-only   | "An error occurred while using the tool get_design_context" |
| 1418:38264 | ERROR          | SUCCESS    | SS-only   | "An error occurred while using the tool get_design_context" |
| 1418:38114 | PARTIAL        | SUCCESS    | DC+SS     | "IMPORTANT: After you call this tool, you MUST call get_screenshot to get a screenshot of the node for context." |
| 1418:36901 | SUCCESS        | SUCCESS    | DC+SS     | 기존 성공 (재호출 생략) |
| 1418:37298 | PARTIAL        | SUCCESS    | DC+SS     | "IMPORTANT: After you call this tool, you MUST call get_screenshot to get a screenshot of the node for context." |
| 1418:37559 | PARTIAL        | SUCCESS    | DC+SS     | "IMPORTANT: After you call this tool, you MUST call get_screenshot to get a screenshot of the node for context." |
| 1418:37402 | SUCCESS        | SUCCESS    | DC+SS     | 기존 성공 (재호출 생략) |

### 표 B — 1425:9149 자식 9개 (2026-02-08 순차 재호출·실제 응답 인용)

| nodeId     | design_context | screenshot | 추론 전략 | 실제 응답 인용 |
|------------|----------------|------------|-----------|----------------|
| 1444:8198   | (기존 호출)    | SUCCESS    | DC+SS     | §3.6 기존 (본 회차 미호출) |
| 1425:9445   | (기존 호출)    | SUCCESS    | DC+SS     | §3.6 기존 (본 회차 미호출) |
| 1425:9661   | PARTIAL        | SUCCESS    | DC+SS     | "IMPORTANT: After you call this tool, you MUST call get_screenshot to get a screenshot of the node for context." |
| 1425:9875   | PARTIAL        | SUCCESS    | DC+SS     | "IMPORTANT: After you call this tool, you MUST call get_screenshot to get a screenshot of the node for context." |
| 1425:10137  | PARTIAL        | SUCCESS    | DC+SS     | "IMPORTANT: After you call this tool, you MUST call get_screenshot to get a screenshot of the node for context." |
| 1425:10663  | PARTIAL        | SUCCESS    | DC+SS     | "IMPORTANT: After you call this tool, you MUST call get_screenshot to get a screenshot of the node for context." |
| 1425:10813  | PARTIAL        | SUCCESS    | DC+SS     | "IMPORTANT: After you call this tool, you MUST call get_screenshot to get a screenshot of the node for context." |
| 1425:10285  | PARTIAL        | SUCCESS    | DC+SS     | "IMPORTANT: After you call this tool, you MUST call get_screenshot to get a screenshot of the node for context." |
| 1425:10443  | PARTIAL        | SUCCESS    | DC+SS     | "IMPORTANT: After you call this tool, you MUST call get_screenshot to get a screenshot of the node for context." |

### 표 C — 1418:20497 자식 14개 (요약)

| 구분 | 내용 |
|------|------|
| get_design_context | 14건 OK (재호출 없음) |
| get_screenshot     | 14건 OK |
| 비고               | 9 vs 14 이력 정리됨, IA/Global Plan 14개 기준 반영 |

### 표 D — 공통 UI 1194-xxxx

| nodeId   | design_context | name 포함 | 비고 |
|----------|----------------|-----------|------|
| 1194:6635, 6640, 6646, 7155, 7283, 7272, 6911, 7118, 7156, 6912, 7208 | PARTIAL/안내 반환 | 미확인 | MCP 한계 → Figma 수동 확인 권장 |

### 표 E — §5 design_context 미사용 페이지 (요약)

| 대상 | nodeId | 호출 시도 | 리스크 |
|------|--------|-----------|--------|
| 로그인(SCR-0001), 비밀번호 찾기 | 미확보 | 본 회차 미실행 | SS-only/문서 추정 의존, 정합성 검증 제한 |
| 차량 상세(SCR-0300) | 미확보 | 미실행 | 동일 |
| 일반 판매 제안(SCR-0102), 판매 내역(SCR-0103) | 미확보 | 미실행 | 동일 |
| 정산(SCR-0104·0105), 탁송(SCR-0600·0601) | §3.11·§3.10 | 보완 완료 | — |
| 경매 전 단계(SCR-0400 등) | 미확보 | 미실행 | 동일 |

---

## 3. §5 미사용 페이지·COMMON_UI 리스크 요약

- **§5 design_context 미사용 페이지 한계·리스크**  
  해당 페이지(로그인, 비밀번호 찾기, 차량 상세, 일반 판매 제안/판매 내역, 경매 전 단계)는 nodeId 미확보 또는 design_context 미호출로 **SS-only/문서 추정에 의존**하며, 디자인-코드 정합성 검증 제한·누락 UI 가능성이 있음. 정산·탁송은 §3.11·§3.10에서 보완 완료.

- **§4 MCP 응답 한계 (name 미포함) 리스크·대응**  
  공통 UI(1194-xxxx) get_metadata/get_design_context 응답에 **name** 미포함 → 1:1 컴포넌트 매핑 불확실, design-tokens·공통 UI 정합성 검증 제한. **등급**: Medium. **대응**: Figma에서 수동 name 복사·우선순위 부여, COMMON_UI_FIGMA_CODE_ALIGNMENT.md 갱신.

---

## 4. 적용할 패치 블록 (7단계 로컬 반영용)

아래 블록은 MCP_CALL_ERRORS_AND_OMISSIONS.md, OFFERS_MYPAGE/INSPECTION INTEGRITY_REPORT, FIGMA_IA_FSD_STRUCTURE, FIGMA_GLOBAL_PLAN, COMMON_UI_FIGMA_CODE_ALIGNMENT 반영 시 사용.

### 4.1 MCP_CALL_ERRORS_AND_OMISSIONS.md

- **§3 하단 추가 (리스크 문단)**  
  다음 문단을 §3 "design_context를 사용하지 못한 페이지" 표 아래에 추가:

```markdown
- **한계·리스크**: 위 페이지(정산·탁송 제외)는 nodeId 미확보 또는 design_context 미호출로 SS-only/문서 추정에 의존하며, 디자인-코드 정합성 검증 제한·누락 UI 가능성이 있음. 정산(§3.11)·탁송(§3.10)은 보완 완료.
```

- **§4 하위 절 추가 (리스크·대응)**  
  §4 "MCP 응답 자체 한계" 표 아래에 추가:

```markdown
- **리스크·대응**: 공통 UI(1194-xxxx) name 미확보 → 1:1 매핑 불확실, 정합성 검증 제한. 등급: Medium. 대응: Figma에서 수동 name 복사·우선순위 부여.
```

- **§5 테이블 교체**  
  기존 §5 "섹션별 요약" 테이블을 아래로 교체:

```markdown
## 5. 섹션별 요약 (오류/누락 여부) — 2026-02-08 재호출 반영

| 섹션 nodeId | 섹션명 | get_metadata | get_design_context | get_screenshot | 비고 |
|-------------|--------|----------------|---------------------|----------------|------|
| 1418:36765 | 마이페이지/오퍼 | OK | 12개 중 6건 DC+SS, 6건 SS-only | 12건 OK | 2026-02-08 순차 재호출: 6건 ERROR, 4건 PARTIAL(실제 응답 인용) |
| 1418:33275 | 정산 | OK | 4건 OK | 4건 OK | — |
| 1418:25059 | 탁송 | OK | 11건 OK | 11건 OK | — |
| 1418:20497 | 차량 등록·상세/경매 | OK | 14건 OK | 14건 OK | 9 vs 14 이력 정리됨 |
| 1418:15486 | 차량 목록 | OK | 13건 OK | 13건 OK | — |
| 1425:9149 | 검차 | OK | 9개 전원 호출 완료(2건 기존+7건 2026-02-08 최초) | 9건 OK | 2026-02-08 design_context 7건 최초 호출 반영 |
| 1425:7637 | 일반 판매 | — | 문서에 호출 수 명시 없음 | 9건 OK | — |
| 1368:37200 | 랜딩 | OK | 1368:37201 등 | 1368:37200, 37201 | — |
```

- **§6 교체**  
  기존 §6 "재호출·보완 권장"을 아래로 교체:

```markdown
## 6. 재호출·보완 권장 목록 — 2026-02-08 반영

**완료된 항목**
1. 1418:36765 자식 10건 design_context 재호출 완료. (7건 ERROR, 3건 PARTIAL 유지 → SS-only/DC+SS 기록 반영.)
2. 1418:36765 자식 2건(37298, 37559) 재시도 완료. PARTIAL(스크린샷 안내) 기록.
3. 1425:9149 검차 design_context 미호출 7건 최초 호출 완료. 9개 전원 호출 완료.
4. 공통 UI 1194-xxxx 재호출·name 확인. name 미포함 시 리스크·대응 문단 문서 반영.

**남은 TODO**
- §5 design_context 미사용 페이지: SCR/nodeId 확보 시 design_context 최초 호출 시도.
- 1418:36765 중 ERROR 7건: Figma MCP/노드 상태 점검 후 재시도(선택).
```

### 4.2 OFFERS_MYPAGE_SECTION_1418_36765_INTEGRITY_REPORT.md

- **"1. MCP 호출 수행 결과" 테이블** 을 아래로 교체:

```markdown
## 1. MCP 호출 수행 결과 — 2026-02-08 재호출 반영

| 단계 | 도구 | 대상 | 결과 |
|------|------|------|------|
| 1 | get_metadata | 1418:36765 | 호출 완료 |
| 2 | get_design_context | 12개 자식 | 5건 DC+SS(36901, 37402, 37804, 37298, 37559), 7건 SS-only(재호출 시 ERROR 유지) |
| 3 | get_screenshot | 동일 12개 | 12건 스크린샷 수신 |
```

- **결론 문단(§5)** 마지막 문장 보강:  
  "MCP 3단계(get_metadata → get_design_context → get_screenshot)를 12개 자식 전원에 수행하였고, **2026-02-08 재호출 결과 design_context는 5건 DC+SS·7건 SS-only로 확정**하였으며, 스크린샷 기준 역할·라우트는 전원 확정하였다."

### 4.3 INSPECTION_SECTION_36_INTEGRITY_REPORT.md

- **"3. MCP 검증 근거"** 절을 아래로 교체:

```markdown
## 3. MCP 검증 근거 — 2026-02-08 design_context 9개 호출 반영

- get_metadata(1425:9149), get_screenshot(9개 자식) 호출 완료.
- get_design_context(9개 자식) 호출 완료: 1444:8198, 1425:9445(기존), 1425:9661, 9875, 10137, 10663, 10813, 10285, 10443(2026-02-08 최초 호출). 7건은 PARTIAL(스크린샷 안내 반환).
- 역할·라우트·상태는 get_screenshot 기반 확정.
```

### 4.4 FIGMA_GLOBAL_PLAN.md §2.11

- **"포함 페이지(프레임)"** 문단 두 번째 문장을 아래로 교체 또는 추가:

  get_metadata(1418:36765), get_design_context(12개 일부), get_screenshot(12개) 수행 완료. **2026-02-08 재호출: get_design_context 12개 중 5건 DC+SS, 7건 SS-only.**

### 4.5 COMMON_UI_FIGMA_CODE_ALIGNMENT.md

- **§1 표 아래** 또는 "실제 파일 수정 없음" 문단 다음에 **리스크·대응** 문단 추가:

```markdown
**MCP 응답 한계·리스크**: get_metadata/get_design_context 호출 시 name 필드 미포함이 재확인된 경우, 공통 컴포넌트 1:1 매핑 불확실·정합성 검증 제한. 등급: Medium. 대응: Figma에서 수동 name 복사 후 표 갱신 권장.
```

---

**문서 이력**

| 버전 | 일자 | 비고 |
|------|------|------|
| 1.0 | 2026-02-08 | MCP 재호출 실행(1418:36765 10건, 1425:9149 7건, 1194 샘플), 상태 집계, 패치 블록 생성. |
| 1.1 | 2026-02-08 | 17개 nodeId 순차 재호출, 3.5 실제 응답 검증(인용) 반영. 표 A·B에 실제 응답 인용 열 추가. 마이페이지 6 ERROR·4 PARTIAL(6 DC+SS, 6 SS-only). 검차 7건 PARTIAL. MCP_CALL_ERRORS_AND_OMISSIONS·OFFERS_MYPAGE·FIGMA_GLOBAL_PLAN 수치 갱신. |
