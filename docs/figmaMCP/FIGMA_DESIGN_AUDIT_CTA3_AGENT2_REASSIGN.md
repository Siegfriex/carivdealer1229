# 2번 에이전트 재지시 프롬프트 — CTA_3 거래 검증 (Phase C)

**생성**: 3번 에이전트 | 2026-02-11  
**대상**: 2번 에이전트 (구현·계획·에셋 담당)

---

## 검증 결과 요약

| 항목 | 값 |
|------|-----|
| **노드** | 17개 (CTA_3 거래) |
| **Phase A** | 2 (794-4107, 1123-13487) |
| **Phase B** | 5 (794-4015, 794-4200, 794-4371, 1123-13580, 1123-13763) |
| **Phase C** | 10 (794-3704, 794-4542, 794-4708, 1123-13946, 1123-14112, 1123-20023, 1123-20699, 1302-27093, 1302-27289, 1714-22332) |
| **critical 합계** | 63건 |

---

## Phase C 사유

- **critical 4개 이상** 10개 노드
- **R001** — design-tokens 미반영 색상 (#777, #c8c8c8, #ff7575, #64748b, #ff9494, #96caff, #929292, #d4d4d4 등)
- **R002/R005** — FIGMA_ASSET_TRACEABILITY 미등록 에셋 다수
- **R003-C** — 1302:27093 → 1302:27096 토폴로지 불일치

---

## 2번 에이전트 수행 항목

### 1. design-tokens.css R001 색상 추가

**공통 (#777, #c8c8c8)** — 794-4200, 794-4371, 794-4542, 794-4708, 1123-13580, 1123-13763, 1123-13946, 1123-14112, 1123-20023, 1123-20699, 1302-27093

**1714-22332**: #ff7575, #64748b  
**1123-20023**: #ff9494, #96caff  
**1123-20699**: #929292, #d4d4d4  

### 2. FIGMA_ASSET_TRACEABILITY 미등록 에셋

**794-3704**: imgLShoppingBag, imgLWallet  
**794-4015**: imgLMagicWand  
**794-4542, 794-4708, 1123-13946, 1123-14112, 1302-27093**: img20260118712051, imgChevronRight (구현: border 또는 아이콘)  
**1123-20023**: imgEllipse4119 (구현: rounded-full)  
**1123-20699**: imgXCloseDelete  
**1302-27093**: imgArrowRepeat, imgAdjustHorizontalSettings  
**1302-27289**: imgCircle, imgSquare, imgTriangle, imgX, imgLine86 (구현: border 또는 아이콘)  
**1714-22332**: imgLine80 (구현: border), imgEllipse52 (구현: rounded-full)  

### 3. R003-C 토폴로지 (1302-27093)

- Figma parent(1302:27093) not ancestor of 1302:27096 in code  
- TradeDetailPage DOM 구조 조정: 1302:27093 래퍼 하위에 1302:27096 배치

### 4. CTA_3 특수 요구사항 (AGENT_3_PERSONA) (해당 시)

- **1714-22332**: 리스팅 클릭 시 하단 상태 전환 (검차와 유사)
- **판매방식선택**: 794-3704 → 일반/경매 분기
- **차량삭제·임시저장**: CTA_3 전체 거래 페이지 하단 공통 배치, 버튼 클릭 시 모달 노출

---

## 참조

- `docs/figmaMCP/report_*.json` (노드별)
- `docs/figma/FSD_IA_NODEID_SSOT.md`
- `docs/figmaMCP/FIGMA_ASSET_TRACEABILITY.md`
- `docs/figmaMCP/figMCP_VERIFICATION_LOG.md`
- `docs/figmaMCP/AGENT_3_PERSONA_AND_GUIDELINES.md` §4 CTA_3 특수 요구사항
