# Figma Design Audit — 1425-10813 노드 검증 테스트 보고서

**검증 일시**: 2026-02-11  
**대상 노드**: 1425-10813 (검차진행 완료·이동중)  
**IA 라벨**: 매물등록 CTA_2 검차, §3.6_1425-10813_검차진행_완료.png

---

## 1. 검증 테스트 방법론

### 1.1 흐름

```
[1단계] 코드베이스 분석 → 정답지(Ground Truth) 도출
        ↓
[2단계] 검증기 실행 (figma-audit --node 1425-10813 --no-cache)
        ↓
[3단계] 정답지 vs 검증결과 비교·핀포인팅
        ↓
[4단계] 코드베이스 재검 (차이점 원인 분석)
        ↓
[5단계] 최종 판정
```

### 1.2 정답지 도출 기준

| 항목 | 도출 방법 |
|------|-----------|
| **구현 노드** | SSOT §4 코드 참조 → 실제 파일 grep `data-node-id` |
| **미구현 노드** | metadata_raw 계층 vs 코드 노드 비교 |
| **impl_plan** | `impl_plans/{nodeId}_구현계획.md` 존재 여부 |
| **색상/에셋** | design_context global_colors, global_assets vs 코드/토큰/추적성 |

---

## 2. 정답지 (코드베이스 분석 결과)

### 2.1 SSOT 매핑

| 항목 | 값 |
|------|-----|
| nodeId | 1425-10813 |
| IA | 검차진행 완료 (이동중) |
| 코드 참조 | pages/admin/inspection/InspectionProgressPage.tsx |
| 라우트 | `/inspections/:inspectionId/progress?stage=en_route` |

### 2.2 코드에 구현된 data-node-id

**파일**: `InspectionProgressPage.tsx`

| node_id | 용도 | 라인 |
|---------|------|------|
| 1121:5350 | 사이드바 (GNB_SIDEBAR) | 47 |
| 1193:8433 | 진행 중... | 70 |
| 1121:5381 | 제목 "검차 진행상황" | 201 |
| 1193:9066 | 차량 카드 (974×243) | 204 |
| 1425:10227 | 검차 카드 (972×473) | 244, 277 |
| 1425:10228 | 검차자 매칭중 제목 | 246 |
| 1425:10229 | 날짜/장소 본문 | 249 |
| 1425:10230 | 기사 정보 패널 (400×160) | 257, 291 |
| 1193:8436 | 검차자 이동중 제목 | 286 |

**핵심**: 코드에는 **1425:10813** 또는 **1425:108xx** 계열 노드가 **없음**.

### 2.3 Design (metadata/design_context) 노드

| 구분 | 노드 범위 |
|------|-----------|
| metadata 루트 | 1425:10813 (1440×1121) |
| metadata 자식 | 1425:10814 ~ 1425:10967 |
| design_context | 동일 (Figma 생성 React 코드) |

**핵심**: Design과 Code의 **node_id 교집합이 없음**. Design은 1425:108xx, Code는 1121/1193/1425:102xx.

### 2.4 정답지 요약

| 규칙 | 예상 결과 | 근거 |
|------|-----------|------|
| **R003-C** | 0건 | code_map에 1425:108xx 없음 → 위상 검증 대상 없음 |
| **R003-D** | 0건 | 동일 |
| **R006** | 1건 warn | impl_plans/1425-10813_구현계획.md 없음 |
| **R001** | 1건 critical | design_context #5b78cd, 코드 미사용 (figma-assets는 주석만) |
| **R002** | 25건 critical | design_context global_assets → figma_image/추적성 미등록 |
| **R005** | 25건 critical | 동일 (FIGMA_ASSET_TRACEABILITY 미등록) |

---

## 3. 검증기 실행 결과

### 3.1 CLI 출력

```bash
figma-audit --node 1425-10813 --no-cache
```

| 항목 | 값 |
|------|-----|
| Exit code | 1 |
| critical_count | 51 |
| warn_count | 1 |

### 3.2 Finding 분포

| Rule | 개수 | Severity |
|------|------|----------|
| R006 | 1 | warn |
| R001 | 1 | critical |
| R002 | 25 | critical |
| R005 | 25 | critical |

---

## 4. 정답지 vs 검증결과 비교

| 항목 | 정답지 | 검증결과 | 일치 |
|------|--------|----------|------|
| R003-C | 0 | 0 | ✅ |
| R003-D | 0 | 0 | ✅ |
| R006 | 1 warn | 1 warn | ✅ |
| R001 | 1 critical | 1 critical (#5b78cd) | ✅ |
| R002 | 25 critical | 25 critical | ✅ |
| R005 | 25 critical | 25 critical | ✅ |

**결론**: 검증기가 정답지와 **100% 일치**.

---

## 5. 핀포인팅 (차이점 원인 분석)

### 5.1 Node ID 불일치

| 구분 | 노드 범위 | 파일 |
|------|-----------|------|
| **Design** | 1425:10813 ~ 1425:10967 | mcp_outputs/1425-10813 (Figma 생성) |
| **Code** | 1121:5350, 1193:8433, 1121:5381, 1193:9066, 1425:10227~10230, 1193:8436 | InspectionProgressPage.tsx |

**원인**: 1425-10813 design은 Figma 전체 페이지(루트 1425:10813)이며, 실제 InspectionProgressPage는 **다른 디자인 블록**(1425:10227 972×473, 1425:10230 400×160)을 재사용해 구현. SSOT는 1425-10813 → InspectionProgressPage로 매핑하지만, 코드는 1425:10227 계열을 사용.

**영향**: R003-C, R003-D는 code_map에 있는 노드만 검증 → 1425:108xx 미포함 → 검증 대상 없음 (정상).

### 5.2 R006 impl_plan

| 경로 | 존재 |
|------|------|
| `impl_plans/1425-10813_구현계획.md` | ❌ 없음 |

**권장**: 1425-10813 또는 1425:10227 레이아웃 기준 구현계획서 추가.

### 5.3 R001 #5b78cd

| 구분 | 위치 |
|------|------|
| Design | design_context 1425:10951 `text-[#5b78cd]` (검차완료 뱃지) |
| Code | figma-assets.ts 주석 `/** 검차완료 #5b78cd */` — 실제 사용 없음 |
| design-tokens | 미정의 |

**권장**: design-tokens.css에 `--color-inspection-complete: #5b78cd` 추가 또는 코드에 반영.

### 5.4 R002/R005 에셋

design_context의 global_assets가 FIGMA_ASSET_TRACEABILITY 테이블·figma_image에 미등록. GNB 공통 에셋(imgLShoppingBag, imgBriefcase 등) 포함.

**권장**: GNB/검차 관련 에셋 변수명 등록.

---

## 6. 코드베이스 재검 (최종 검증)

### 6.1 InspectionProgressPage.tsx

```bash
rg "data-node-id" src/pages/admin/inspection/InspectionProgressPage.tsx
```

- 1425:10813, 1425:108xx **미사용**
- 1425:10227, 1425:10228, 1425:10229, 1425:10230 **사용** (검차 카드 영역)

### 6.2 impl_plans

```bash
ls docs/figmaMCP/impl_plans/*1425*10813*
# 0 files
```

### 6.3 #5b78cd

```bash
rg "#5b78cd|5b78cd" src/
# figma-assets.ts:24 — 주석만
```

---

## 7. 최종 판정

| 항목 | 결과 |
|------|------|
| **검증기 정확도** | 100% (정답지 일치) |
| **R003-C/R003-D** | 0건 (node_id 불일치로 검증 대상 없음 — 정상) |
| **R006** | 1건 (impl_plan 미존재 — 정탐) |
| **R001** | 1건 (#5b78cd 미반영 — 정탐) |
| **R002/R005** | 50건 (에셋 추적성 미등록 — 정탐) |
| **종합 등급** | **C** (critical 51건, 보완 필요) |

### 7.1 우선 보완 권장

1. **impl_plans**: `1425-10813_구현계획.md` 추가 또는 1425:10227 레이아웃 기준 문서 병합
2. **design-tokens**: #5b78cd 토큰 추가
3. **FIGMA_ASSET_TRACEABILITY**: 1425-10813 design_context 에셋 변수명 등록

---

## 8. 검증 방법론 문서화

### 8.1 실행 명령

```powershell
cd c:\carivdealer\figma-design-audit
pip install -e .
figma-audit --node 1425-10813 --no-cache --output c:\carivdealer\docs\figmaMCP\report_1425-10813.json
```

### 8.2 정답지 도출 절차

1. SSOT §4 → 코드 참조 확인
2. 해당 파일 grep `data-node-id` → 구현 노드 목록
3. metadata_raw → design 노드 목록
4. 교집합 분석 → R003-C/R003-D 검증 대상
5. impl_plans, design-tokens, figma_image 검사

### 8.3 비교 판정 기준

| 규칙 | 정탐 기준 |
|------|-----------|
| R003-C/D | code_map에 노드 있을 때만 검증, 없으면 0건 (정상) |
| R006 | impl_plan 파일 존재 여부 |
| R001 | global_colors → 코드/토큰 반영 여부 |
| R002/R005 | global_assets → figma_image/추적성 등록 여부 |

---

## 9. 문서 이력

| 버전 | 일자 | 비고 |
|------|------|------|
| 1.0 | 2026-02-11 | 1425-10813 검증 테스트 보고서 (방법론 포함) |
