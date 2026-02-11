# Figma SSOT 기반 에이전트·MCP 프론트엔드 디자인 업데이트 방법론

**목적**: 에이전트와 Figma MCP를 사용하여 Figma 디자인을 단일 소스 of truth(SSOT)로 삼고, 프론트엔드를 업데이트하는 워크플로우·프레임워크·사이클을 정리한 통합 방법론 문서.

**기준 문서**: [IA_SITEMAP_SPEC_IPOE.md](IA_SITEMAP_SPEC_IPOE.md), [WORKFLOW.md](../figmaMCP/WORKFLOW.md), [README.md](../figmaMCP/README.md)

---

## 1. 개요: SSOT 원칙

| 원칙 | 설명 |
|------|------|
| **Figma SSOT** | 디자인 기준은 Figma Design 파일(Domestic-Seller 1.0). `fileKey`: `4w3ft8RpGwoho5EtvNO9hQ`. |
| **nodeId = 스크린 명세** | IA·FSD 문서 및 FIGMASCR0208 스크린샷이 노드 기준으로 매핑됨. |
| **단일 진실 소스** | Figma → mcp_outputs → design-tokens → 코드. Figma 변경 시 위계를 따라 전파. |

---

## 2. 워크플로우 사이클 (Phase 0~7)

### 2.1 전체 흐름 개요

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  Figma SSOT 사이클                                                             │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  [Figma] ──MCP──▶ [mcp_outputs] ──매핑──▶ [impl_plans] ──적용──▶ [코드]     │
│     │                   │                       │                   │       │
│     │                   │                       │                   │       │
│     ▼                   ▼                       ▼                   ▼       │
│  get_metadata      metadata_raw.txt       레이아웃 스펙          npm build   │
│  get_design_context  design_context_raw.txt   구현계획서           검증·로그  │
│  get_screenshot     screenshot.png        에셋 추적성                         │
│                                                                             │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 2.2 Phase별 상세

| Phase | 명칭 | 핵심 행동 | 산출물 |
|-------|------|-----------|--------|
| **0** | 사전 준비 | nodeId 확정, NODE_TO_ROUTE_AND_FILE로 라우트·페이지·FIGMASCR0208 매핑 확인 | 작업 대상 nodeId, mcp_outputs 폴더명 |
| **1** | 메타데이터 저장 | get_metadata → 응답 전문을 `mcp_outputs/{nodeId}/metadata_raw.txt`에 저장 | metadata_raw.txt |
| **2** | 디자인 컨텍스트 저장 | get_design_context → `design_context_raw.txt` 저장, 에셋 URL·생성 코드·스타일 추출 | design_context_raw.txt, 에셋 목록 |
| **3** | 스크린 비교 | get_screenshot vs FIGMASCR0208 PNG 비교, 불일치 시 **Figma(MCP) 기준** | 구현 기준 정책 확인 |
| **4** | 구현 계획 작성 | impl_plans에 노드별 계획서, **레이아웃 스펙**(x,y,width,height 테이블) 필수 포함 | `{nodeId}_구현계획.md` |
| **5** | 에셋·추적성·연동 | 에셋 다운로드 → shared/figma_image 저장 → **컴포넌트에서 import·JSX 연동** → FIGMA_ASSET_TRACEABILITY 갱신 | 에셋 파일, 추적성 문서 |
| **6** | 리팩토링·리디자인 | 레이아웃 스펙에 따라 위치·크기·div 계층 적용, design-tokens 변환, 레이아웃 충실도 검증 | 수정된 소스, 검증 체크리스트 |
| **7** | 빌드·검증·로그 | npm run build 검증, figMCP.MD에 6하원칙 로그 추가 | 빌드 성공, 로그 누적 |

---

## 3. 에이전트 2단계 프레임워크

MCP 반환값이 잘려서 에이전트가 전체를 받지 못하는 경우, **1번 에이전트**와 **2번 에이전트**를 분리 사용.

### 3.1 1번 에이전트 (MCP 호출 + 폴더 생성)

| 항목 | 내용 |
|------|------|
| **역할** | Figma MCP 호출, mcp_outputs 폴더·파일 생성, 사용자에게 "반환 전체를 복사해 붙여넣기" 안내 |
| **프롬프트** | [figmaMCP/README.md](../figmaMCP/README.md) §에이전트 사용 순서 — `Implement this design from Figma.` + `@Figma URL` + 1번 상수(AGENT_1_PROMPT_TEMPLATE 참조) |
| **산출** | get_metadata·get_design_context 반환 전체 → 사용자가 metadata_raw.txt, design_context_raw.txt에 붙여넣기 |

### 3.2 2번 에이전트 (파일 기반 구현)

| 항목 | 내용 |
|------|------|
| **역할** | MCP 호출 **금지**. mcp_outputs에 저장된 파일만 read_file로 읽고 Phase 4~7 수행 |
| **프롬프트** | [AGENT_PROMPT_TEMPLATE.md](../figmaMCP/AGENT_PROMPT_TEMPLATE.md) — 동일 URL에 2번 상수 붙여 구현 요청 |
| **산출** | 구현 계획서 작성, 에셋 적용, 코드 리팩토링, 빌드 검증, 로그 |

### 3.3 에이전트 사용 순서

```
1. 1번 에이전트: MCP 호출 → 폴더 생성 → 반환 전문 안내
2. 사용자: UI에서 get_metadata·get_design_context 반환 전체를 mcp_outputs/{nodeId}/ 에 붙여넣기
3. 2번 에이전트: 같은 Figma URL에 2번 상수 붙여 구현 요청 → Phase 4~7 수행
```

---

## 4. MCP 도구·반환 데이터 분류

| 도구 | 반환 요약 | 용도 |
|------|-----------|------|
| **get_screenshot** | 노드 스크린샷 이미지(PNG) | 디자인 시각 확인, 구현 검증 |
| **get_metadata** | 노드 트리 XML(구조·위치·크기) + 안내 문구 | 레이아웃·계층 파악 |
| **get_design_context** | XML + 에셋 URL + 생성 코드 + 스타일·컴포넌트 설명 | **구현의 핵심** — 에셋·코드·스타일·구현 지침 |

**구현 워크플로 권장 순서** (FIGMA_MCP_RESPONSE_TAXONOMY.md §6):

1. get_screenshot → 디자인 시각 확인  
2. get_metadata → 구조·위치 파악 (선택)  
3. get_design_context → 에셋 URL·생성 코드·스타일 확보  
4. 프로젝트 스택·디자인 토큰에 맞게 **코드 변환**  
5. 에셋은 만료 전 **로컬/CDN 저장**  

---

## 5. 핵심 산출물·매핑 체계

### 5.1 문서·폴더 구조

| 경로 | 역할 |
|------|------|
| `docs/figma/IA_SITEMAP_SPEC_IPOE.md` | 사이트맵 SSOT + I·P·O·E 기능명세 |
| `docs/figma/FSD_SPEC_BLUEPRINT.md` | 사이트맵·nodeId·라우트·FSD 레이어·페이지 컴포넌트 |
| `docs/figma/FIGMA_MCP_RESPONSE_TAXONOMY.md` | MCP 반환 데이터 범주 정의 |
| `docs/figmaMCP/NODE_TO_ROUTE_AND_FILE.md` | nodeId ↔ 라우트 ↔ 페이지 컴포넌트 ↔ FIGMASCR0208 경로 |
| `docs/figmaMCP/WORKFLOW.md` | Phase 0~7 단계별 워크플로 |
| `docs/figmaMCP/FIGMA_ASSET_TRACEABILITY.md` | 에셋 추적성 (로컬 파일 ↔ nodeId ↔ import 경로) |
| `docs/figmaMCP/SSOT_DESIGN_TOKENS.md` | mcp_outputs → design-tokens → 전역 CSS 연동 |
| `mcp_outputs/{nodeId}/` | metadata_raw.txt, design_context_raw.txt |
| `impl_plans/` | 노드별 구현 계획서 (레이아웃 스펙 포함) |
| `FIGMASCR0208/` | 노드별 참조 스크린샷 (01_랜딩 ~ 14_마이페이지) |

### 5.2 IA §4 ↔ FSD ↔ 라우트 매핑

| IA 기능 | FSD | 대표 라우트 |
|---------|-----|-------------|
| 4.1 랜딩 | pages/landing | `/` |
| 4.3 GNB 차량목록 | pages/admin + vehicle-list | `/vehicles` |
| 4.4 GNB 검차 | pages/admin/inspection | `/inspections` |
| 4.8 회원가입 | pages/auth | `/login`, `/signup/*` |
| 4.9 CTA_1 차량원부등록 | pages/admin/vehicle + features/vehicle/register-form | `/vehicles/new`, `/vehicles/new/step1` |
| 4.10 CTA_2 검차 | pages/admin/inspection + features/inspection/request-form | `/inspections/request`, `/:id/progress` |
| 4.11 CTA_3 거래 | pages/admin/sale, auction | `/vehicles/:id/sale/*`, `/vehicles/:id/auction/*`, `/vehicles/:id/trade` |
| 4.12 CTA_4 탁송 | pages/admin/logistics | `/logistics/schedule`, `/logistics/history` |
| 4.13 CTA_5 정산 | pages/admin | `/settlements`, `/sales/history` |
| 4.14 마이페이지 | pages/admin/mypage + widgets/MypageSidebar | `/mypage/settlement-account` |

---

## 6. 반복 사이클 (디자인 변경 시)

```
┌──────────────────────────────────────────────────────────────────┐
│  Figma 디자인 변경                                                 │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  Phase 0~1: nodeId 확정, get_metadata 호출·저장                   │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  Phase 2: get_design_context 호출·저장, 에셋·스타일 추출           │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  Phase 3: 스크린샷 비교 (Figma 기준 우선)                          │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  Phase 4: impl_plans 갱신 (레이아웃 스펙 반드시 포함)               │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  Phase 5: 에셋 다운로드·저장·컴포넌트 연동·FIGMA_ASSET_TRACEABILITY  │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  Phase 6: 코드 리팩토링 (레이아웃 스펙 적용, design-tokens 변환)     │
└──────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│  Phase 7: npm run build, figMCP.MD 로그                           │
└──────────────────────────────────────────────────────────────────┘
                              │
                              └──────────▶ 다음 노드 또는 디자인 변경
```

---

## 7. 필수 준수 사항

### 7.1 레이아웃·위치 반영

- design_context의 **left, top, width, height**를 반드시 추출·적용.
- metadata_raw를 파싱해 노드별 (x, y, width, height) 테이블을 impl_plans "레이아웃 스펙"에 포함.
- div 계층 구조(부모-자식) 유지.

### 7.2 에셋 처리

- design_context 에셋 URL은 **만료 전** 다운로드 → shared/figma_image 저장.
- **대상 컴포넌트에서 직접 import·JSX 연동** — 다운로드만으로 끝내지 않음.
- FIGMA_ASSET_TRACEABILITY.md에 **실제 import 경로** 갱신.

### 7.3 디자인 토큰

- mcp_outputs를 SSOT로 design-tokens.css에 hex/rgba/shadow/radius 매핑.
- 인라인 `shadow-[...]`, `rounded-[...]` 대신 `shadow-figma-card`, `rounded-card` 등 토큰 기반 클래스 사용.

### 7.4 Tailwind

- 프로젝트에 Tailwind가 없거나 사용자 지시가 없으면 의존성 추가 금지.
- MCP Tailwind 클래스는 design-tokens·기존 CSS 방식으로 변환.

---

## 8. 참조 문서 인덱스

| 문서 | 용도 |
|------|------|
| [IA_SITEMAP_SPEC_IPOE.md](IA_SITEMAP_SPEC_IPOE.md) | 사이트맵 SSOT, I·P·O·E 기능명세 |
| [FSD_SPEC_BLUEPRINT.md](FSD_SPEC_BLUEPRINT.md) | 사이트맵·FSD·라우트·매핑 |
| [FIGMA_MCP_RESPONSE_TAXONOMY.md](FIGMA_MCP_RESPONSE_TAXONOMY.md) | MCP 반환 데이터 분류 |
| [figmaMCP/README.md](../figmaMCP/README.md) | Figma MCP 워크플로 허브 |
| [figmaMCP/WORKFLOW.md](../figmaMCP/WORKFLOW.md) | Phase 0~7 상세 |
| [figmaMCP/AGENT_PROMPT_TEMPLATE.md](../figmaMCP/AGENT_PROMPT_TEMPLATE.md) | 2번 에이전트 프롬프트 |
| [figmaMCP/NODE_TO_ROUTE_AND_FILE.md](../figmaMCP/NODE_TO_ROUTE_AND_FILE.md) | nodeId↔라우트↔파일 매핑 |
| [figmaMCP/FIGMA_ASSET_TRACEABILITY.md](../figmaMCP/FIGMA_ASSET_TRACEABILITY.md) | 에셋 추적성 |
| [figmaMCP/SSOT_DESIGN_TOKENS.md](../figmaMCP/SSOT_DESIGN_TOKENS.md) | 디자인 토큰 연동 |

---

## 9. 문서 이력

| 버전 | 일자 | 비고 |
|------|------|------|
| 1.0 | 2026-02-11 | docs/figma·docs/figmaMCP 기반 통합 방법론 정리 |
