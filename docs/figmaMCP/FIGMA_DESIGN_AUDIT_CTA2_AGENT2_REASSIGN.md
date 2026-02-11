# 2번 에이전트 재지시 프롬프트 — CTA_2 검차 검증 (Phase C)

**생성**: 3번 에이전트 | 2026-02-11  
**대상**: 2번 에이전트 (구현·계획·에셋 담당)

---

## 검증 결과 요약

| 항목 | 값 |
|------|-----|
| **노드** | 1033-4903, 1037-5126, 1037-5673, 1042-4681, 1121-5308, 1193-8343, 1193-9217, 1425-10137, 1425-10285 |
| **Phase A 통과** | 1193-8120, 1425-10813 |
| **critical** | 150건 (9개 노드 합계) |
| **warn** | 21건 |
| **Rule별** | R001(25), R002(52), R005(52), R003-C(4), R006(3), R003-D(warn) |

---

## Phase C 사유

- **critical 4개 이상** 다수 노드 (9개)
- **R001/R002/R005** — design-tokens, figma_image, FIGMA_ASSET_TRACEABILITY 일괄 보완 필요
- **R003-C** — Figma parent-child 토폴로지·코드 구조 불일치 (1042-4681, 1425-10285)
- **R006** — 1037-5126, 1037-5673, 1042-4681 단독 impl_plan 없음 (통합 `1037-5126_1037-5673_1042-4681_구현계획.md` 사용 중)

---

## 2번 에이전트 수행 항목

### 1. FIGMA_ASSET_TRACEABILITY 미등록 에셋

**검차 공통** (1121-5308, 1193-8343, 1425-10137 공유):
- `imgEllipse49`, `imgEllipse50` — 상태 점 → `(구현: rounded-full)` 로 추적표 등록

**1193-9217, 1425-10285** (검차내역 상세·결과요약):
- `imgEllipse55`, `imgEllipse57`, `imgEllipse58`, `imgLine87`, `imgLine88` — 구분선/점 → `(구현: border)` 또는 `(구현: rounded-full)` 등록

**1033-4903** (검차 신청 step1):
- `imgFCard`, `imgImage116~122`, `imgFLink`, `imgFSettings`, `img1231`, `imgHelpCircle`, `imgVector1`, `imgEllipse44` — 다운로드 또는 `(구현: rounded-full)` 등록

**1037-5126, 1037-5673, 1042-4681** (검차 목록):
- `imgFrame2087328289`, `imgFrame2087328290`, `imgVector1~5`, `imgThreeDots`, `imgGrid`, `imgList`, `imgEllipse44/46/47` — GNB·공통 레이아웃 에셋 (1444-7928, 1425-8153 경로 사용 또는 등록)

### 2. design-tokens 미반영 색상 (R001)

- **1033-4903**: `#eee`, `#9c9c9c`, `#f21824`, `#ff5b5b` 등 16색 — `src/shared/styles/design-tokens.css` 추가
- **1037/1042**: `#e10000`, `#fffffe` 등 — 공통 색상 토큰화
- **1042-4681**: `#e9d873`, `#ffcec9` — 상태 배지 색상

### 3. R003-C 토폴로지·R006 impl_plan

- **1042-4681**: Figma parent(1042:4681) not ancestor of 1193:8810, 1300:6039, 1367:9463 — 코드 구조 검토
- **1425-10285**: Figma parent(1425:10376) not ancestor of 1425:10378 — 코드 구조 검토
- **R006**: 1037-5126, 1037-5673, 1042-4681 — 단독 impl_plan 없음. 통합 `1037-5126_1037-5673_1042-4681_구현계획.md` 존재 확인. 필요 시 별도 파일 참조 또는 `NODE_ALIAS_MAP.json`에 alias 추가

### 4. 플로우 매핑 (참조)

```
/inspections (1037-5126, 1037-5673, 1042-4681)
  ├── /inspections/request/step1 (1033-4903)
  └── /inspections/:id/progress
        ├── ?stage=matching: 1121-5308, 1425-10137
        └── ?stage=en_route: 1193-8343, 1425-10813
              └── /inspections/:id/complete (1193-8120, 1193-9217, 1425-10285)
```

---

## 참조

- `docs/figmaMCP/report_*.json` (노드별)
- `docs/figma/FSD_IA_NODEID_SSOT.md`
- `docs/figmaMCP/FIGMA_ASSET_TRACEABILITY.md`
- `docs/figmaMCP/figMCP_VERIFICATION_LOG.md`
