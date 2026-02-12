# CarivDealer 문서 스위트 검증 및 일치성 감사 보고서

**검증 일시**: 2026-02-12  
**검증 대상**: CarivDealer_API_ERD_Mapping, CarivDealer_api_v1, CarivDealer_IA, CarivDealer_SDS_VERIFICATION, CarivDealer_Storyboard, CarivDealer_UserFlow, CarivDealer_VID  
**검증 방법**: read_file, grep, list_dir, router.tsx 직접 확인

---

## 1. Executive Summary

| 항목 | 결과 | 비고 |
|------|------|------|
| **라우트 일치** | ✅ 일치 | IA·VID·UserFlow·router.tsx 간 라우트 42개 일치 |
| **페이지 수치** | ✅ 일치 | 공개 11, 보호 30, 폴백 1 |
| **상호 참조** | ⚠️ 3건 불일치 | 존재하지 않는 문서 참조 |
| **내용 정합** | ⚠️ 1건 오류 | UserFlow §1.1 라우트 경로 오타 |
| **문서 존재** | ✅ 7개 모두 존재 | |

---

## 2. 라우트·페이지 수치 검증

### 2.1 router.tsx 기준 실제 라우트 수

| 구분 | 수량 |明细 |
|------|------|------|
| 공개 | 11 | `/`, `/login`, `/signup`, `/signup/step1`~`step5`, `/signup/pending`, `/signup/complete`, `/forgot-password` |
| 보호 | 30 | dashboard, vehicles(8), inspections(7), offers(2), logistics(2), sales(1), settlements(2), mypage(2), + 내부 리다이렉트 1 |
| 폴백 | 1 | `path="*"` → `/vehicles` |
| **합계** | **42** | |

### 2.2 문서 간 라우트 수치 비교

| 문서 | 공개 | 보호 | 폴백 | 일치 |
|------|------|------|------|------|
| CarivDealer_IA §3.1 | 11 | 30 | 1 | ✅ |
| CarivDealer_VID §4 | 11 | 30 | 1 | ✅ |
| CarivDealer_SDS_VERIFICATION | 11 | 30 | 1 | ✅ |
| router.tsx | 11 | 30 | 1 | — |

---

## 3. 참조 문서 존재 여부 검증

### 3.1 존재하지 않는 참조 (404)

다음 문서는 **여러 문서에서 참조되나 docs/ 폴더에 존재하지 않음**:

| 참조 문서 | 참조 위치 | 존재 여부 |
|-----------|-----------|-----------|
| `figma/FIGMA_IA_FSD_STRUCTURE.md` | API_ERD_Mapping, CarivDealer_api_v1 | ❌ 없음 |
| `figma/FIGMA_GLOBAL_PLAN.md` | API_ERD_Mapping | ❌ 없음 |
| `figma/IA_FSD_COMPLETE_VERIFICATION_20260208.md` | API_ERD_Mapping, CarivDealer_api_v1, IA_SITEMAP_SPEC_IPOE | ❌ 없음 |

**추정**: archive로 이동했거나 FSD_IA_NODEID_SSOT·IA_SITEMAP_SPEC_IPOE로 대체됨.

**권장 조치**:
- API_ERD_Mapping, CarivDealer_api_v1에서 위 3개 참조를 `FSD_IA_NODEID_SSOT.md`, `IA_SITEMAP_SPEC_IPOE.md`로 교체 검토
- 또는 docs/README.md에 "대체 문서" 표기

### 3.2 존재하는 참조 (정상)

| 참조 문서 | 참조 위치 | 존재 |
|-----------|-----------|------|
| FSD_IA_NODEID_SSOT.md | VID, IA, Storyboard, API_ERD_Mapping | ✅ |
| IA_SITEMAP_SPEC_IPOE.md | VID, router.tsx, IA_SITEMAP_SPEC_IPOE_CONSISTENCY_REPORT | ✅ |
| CarivDealer_VID.md | IA, UserFlow, PHASE3_METHODOLOGY | ✅ |
| CarivDealer_IA.md | UserFlow, Storyboard, SDS_VERIFICATION | ✅ |
| CarivDealer_api_v1.md | API_ERD_Mapping | ✅ |
| CarivDealer_API_ERD_Mapping.md | CarivDealer_api_v1 | ✅ |

---

## 4. 내용 일치성 검증

### 4.1 라우트 경로 오류 (수정 필요)

| 문서 | 위치 | 현재 | 올바른 값 |
|------|------|------|-----------|
| **CarivDealer_UserFlow.md** | §1.1 단계별 라우트 | `/vehicles/:vehicleId/sale/price` → `/sale/complete` | `/vehicles/:vehicleId/sale/complete` |

**설명**: 일반판매 완료 페이지는 `/vehicles/:vehicleId/sale/complete`이어야 함. `/sale/complete`는 router.tsx에 없음.

### 4.2 routeManager·VID 동기화

| 항목 | CarivDealer_VID §5 | routeManager.ts | UserFlow §1.2 | 일치 |
|------|-------------------|-----------------|---------------|------|
| FALLBACK_ROUTE | `/vehicles` | `/vehicles` | — | ✅ |
| status='draft' | MOCK_VEHICLE_TO_INSPECTION → inspections/… | 동일 | 동일 | ✅ |
| status='active_sale' | `/vehicles/:vehicleId/trade` | 동일 | — | ✅ |
| status='bidding' | `/vehicles/:vehicleId/auction` | 동일 | — | ✅ |
| status='sold' | `/logistics/schedule?vehicleId=...` | 동일 | — | ✅ |

### 4.3 vehicle status enum 일치

| 문서 | status 값 |
|------|-----------|
| CarivDealer_UserFlow | draft, inspection, active_sale, bidding, sold, pending_settlement, completed |
| CarivDealer_VID §5 | 동일 |
| entities/vehicle/model/types.ts | draft, inspection, bidding, active_sale, sold, pending_settlement, completed |

**결과**: ✅ 일치 (inspection 순서만 상이, 값은 동일)

---

## 5. 문서별 상호 참조 맵

```
CarivDealer_VID (중앙 SSOT)
├── FSD_IA_NODEID_SSOT ✅
├── IA_SITEMAP_SPEC_IPOE ✅
└── router.tsx (코드)

CarivDealer_IA
├── CarivDealer_VID ✅
├── FSD_IA_NODEID_SSOT ✅
└── router.tsx

CarivDealer_UserFlow
├── CarivDealer_IA ✅
└── CarivDealer_VID §5 ✅

CarivDealer_Storyboard
├── CarivDealer_IA ✅
├── CarivDealer_UserFlow ✅
└── FSD_IA_NODEID_SSOT ✅

CarivDealer_SDS_VERIFICATION
├── CarivDealer_IA ✅
├── CarivDealer_UserFlow ✅
├── CarivDealer_Storyboard ✅
└── router.tsx ✅

CarivDealer_api_v1
├── figma/IA_FSD_COMPLETE_VERIFICATION_20260208.md ❌
└── figma/FIGMA_IA_FSD_STRUCTURE.md ❌

CarivDealer_API_ERD_Mapping
├── CarivDealer_api_v1 ✅
├── figma/FIGMA_IA_FSD_STRUCTURE.md ❌
├── figma/FIGMA_GLOBAL_PLAN.md ❌
└── figma/IA_FSD_COMPLETE_VERIFICATION_20260208.md ❌
```

---

## 6. 버전·메타데이터 일치

| 문서 | 버전 | 최종 검증 | 일관성 |
|------|------|-----------|--------|
| CarivDealer_IA | 1.1 | 2026-02-12 | ✅ |
| CarivDealer_VID | 1.3→1.4 | 2026-02-12 | ✅ |
| CarivDealer_UserFlow | 1.0 | 2026-02-12 | ✅ |
| CarivDealer_Storyboard | 1.0 | 2026-02-12 | ✅ |
| CarivDealer_api_v1 | 1.3 | 2026-02-07 | IA·VID보다 이전 |
| CarivDealer_API_ERD_Mapping | 1.10 | 2026-02-08 | 동일 |
| CarivDealer_SDS_VERIFICATION | — | 2026-02-12 | ✅ |

---

## 7. 권장 조치 (우선순위)

### 7.1 즉시 수정 (Critical)

| # | 조치 | 대상 | 내용 |
|---|------|------|------|
| 1 | 라우트 경로 수정 | CarivDealer_UserFlow.md §1.1 | `/sale/complete` → `/vehicles/:vehicleId/sale/complete` |

### 7.2 참조 갱신 (High)

| # | 조치 | 대상 | 내용 |
|---|------|------|------|
| 2 | 참조 문서 교체 | CarivDealer_api_v1.md §4, §5 | `IA_FSD_COMPLETE_VERIFICATION`, `FIGMA_IA_FSD_STRUCTURE` → `FSD_IA_NODEID_SSOT`, `IA_SITEMAP_SPEC_IPOE` 또는 "대체됨" 명시 |
| 3 | 참조 문서 교체 | CarivDealer_API_ERD_Mapping.md | 동일. 또는 README에 archive 경로 명시 |

### 7.3 선택적 (Medium)

| # | 조치 | 대상 | 내용 |
|---|------|------|------|
| 4 | 문서 이력 추가 | CarivDealer_SDS_VERIFICATION | §6 문서 스위트 감사 결과 반영 |
| 5 | README 갱신 | docs/README.md | FIGMA_IA_FSD_STRUCTURE 등 → "FSD_IA_NODEID_SSOT로 대체" 명시 |

---

## 8. 결론

- **라우트·페이지 수치**: 일치. IA·VID·SDS_VERIFICATION·router.tsx 정합.
- **참조 문서**: 3개 문서(FIGMA_IA_FSD_STRUCTURE, FIGMA_GLOBAL_PLAN, IA_FSD_COMPLETE_VERIFICATION) 미존재. 대체 문서 참조로 갱신 권장.
- **내용 오류**: UserFlow §1.1 일반판매 완료 라우트 오타 1건 수정 필요.
- **전체**: 문서 스위트는 대체로 일치하나, 위 정정 사항 반영 시 일치성 향상.
