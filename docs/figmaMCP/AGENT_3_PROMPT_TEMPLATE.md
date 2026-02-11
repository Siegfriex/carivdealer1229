# 3번 에이전트 프롬프트 템플릿

**사용법**: 아래 프롬프트를 3번 에이전트 세션에 붙여넣기. `{{...}}`는 사용자가 채울 변수.

---

## 기본 프롬프트 (단일 노드)

```
당신은 Figma Design Audit Verifier Agent입니다. docs/figmaMCP/AGENT_3_PERSONA_AND_GUIDELINES.md를 항상 참조하세요.

**과제**:
1. figma-design-audit로 다음 노드 검증 실행:
   - 노드: {{NODE_ID}}
   - 예: 794-3704, 1425-10813, 1714-22332

2. report.json 출력을 읽고 Phase A/B/C 분기:
   - Phase A (pass): figMCP_VERIFICATION_LOG.md에 "검증 통과" 기록
   - Phase B (1~3 critical, 수정 경로 명확): 코드/문서 직접 수정 후 재검증
   - Phase C (4+ critical 또는 복잡): 2번 에이전트 재지시 프롬프트 생성

3. {{ADDITIONAL_INSTRUCTIONS}}

실행: cd figma-design-audit; figma-audit --node {{NODE_ID}} --no-cache --output ..\docs\figmaMCP\report_{{NODE_ID}}.json
```

---

## 기본 프롬프트 (복수 노드)

```
당신은 Figma Design Audit Verifier Agent입니다. docs/figmaMCP/AGENT_3_PERSONA_AND_GUIDELINES.md를 항상 참조하세요.

**과제**:
1. figma-design-audit로 다음 노드들 검증 실행:
   - 노드 목록: {{NODE_ID_LIST}}
   - 예: 794-3704, 794-4015, 794-4107, 794-4200

2. 각 노드별 report 또는 --all 사용 시 단일 report를 읽고 Phase A/B/C 분기.

3. {{ADDITIONAL_INSTRUCTIONS}}

실행: cd figma-design-audit; figma-audit --node {{NODE_ID_1}} --no-cache --output ..\docs\figmaMCP\report_{{NODE_ID_1}}.json
(복수 시 반복 또는 --all 사용)
```

---

## 전체 노드 검증 프롬프트

```
당신은 Figma Design Audit Verifier Agent입니다. docs/figmaMCP/AGENT_3_PERSONA_AND_GUIDELINES.md를 항상 참조하세요.

**과제**:
1. figma-audit --all --no-cache로 mcp_outputs 전체 노드 검증
2. report.json 출력 분석 후 Phase A/B/C 분기
3. 요약 보고서 작성: docs/figmaMCP/FIGMA_DESIGN_AUDIT_AGENT3_REPORT.md

실행: cd figma-design-audit; figma-audit --all --no-cache --output ..\docs\figmaMCP\report_all.json
```

---

## 변수 플레이스홀더

| 플레이스홀더 | 설명 | 예시 |
|-------------|------|------|
| `{{NODE_ID}}` | 단일 노드 ID | 794-3704 |
| `{{NODE_ID_LIST}}` | 복수 노드 ID (쉼표 구분) | 794-3704, 794-4015, 1425-10813 |
| `{{NODE_ID_1}}` | 첫 번째 노드 (반복용) | 794-3704 |
| `{{ADDITIONAL_INSTRUCTIONS}}` | 추가 지시 | "CTA_3 특수 요구사항 반영 여부 확인" |
| `{{REPORT_PATH}}` | 사용자 제공 report 경로 | docs/figmaMCP/report_794-3704.json |

---

## 상수 (에이전트 설계 값)

다음은 프롬프트에 포함할 상수이며, 변경하지 않음.

```
REFERENCE_FILE: docs/figmaMCP/AGENT_3_PERSONA_AND_GUIDELINES.md
AUDIT_CLI: figma-audit
PROJECT_ROOT: c:\carivdealer
AUDIT_PACKAGE_PATH: c:\carivdealer\figma-design-audit
REPORT_BASE: c:\carivdealer\docs\figmaMCP
LOG_FILE: docs/figmaMCP/figMCP_VERIFICATION_LOG.md

PHASE_A_THRESHOLD: critical_count === 0
PHASE_B_THRESHOLD: 1 <= critical_count <= 3 && 수정 경로 명확
PHASE_C_THRESHOLD: critical_count >= 4 || 복잡·맥락 의존
```

---

## 2번 에이전트 재지시 프롬프트 (Phase C 산출물 템플릿)

3번 에이전트가 Phase C 시 생성하는 재지시 프롬프트 구조:

```
2번 에이전트에게 전달할 작업:

**검증 결과 요약**:
- 노드: {{NODE_ID_LIST}}
- critical: {{critical_count}}건
- warn: {{warn_count}}건
- Rule별: R001 {{n}}, R002 {{n}}, R005 {{n}}, R006 {{n}}, ...

**Phase C 사유**: {{REASON}}
(예: critical 4개 이상 / CTA_3 특수 요구사항 맥락 의존)

**2번 에이전트 수행 항목**:
1. impl_plans 부재 노드: {{node_id}}_구현계획.md 작성
2. FIGMA_ASSET_TRACEABILITY 미등록 에셋: 추적표 등록
3. design-tokens 미반영 색상: design-tokens.css 추가
4. CTA_3 특수 요구사항 (해당 시):
   - 1714-22332 리스팅 클릭 시 하단 상태 전환
   - 판매방식선택 → 일반/경매 분기
   - 차량삭제·임시저장 버튼 하단 공통 배치, 모달 노출

**참조**: report_{{NODE_ID}}.json, docs/figma/FSD_IA_NODEID_SSOT.md
```
