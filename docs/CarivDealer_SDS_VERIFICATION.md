# CarivDealer Service Design Specification 검증 보고서

**검증 일시**: 2026-02-13  
**검증 대상**: CarivDealer_IA, CarivDealer_UserFlow, CarivDealer_Storyboard, router.tsx, CarivDealer_api_v1, CarivDealer_API_ERD_Mapping

---

## 1. router.tsx Route 수 vs CarivDealer_IA 페이지 수

| 구분 | router.tsx | CarivDealer_IA §3.1 |
|------|------------|---------------------|
| 공개 | 11 | 11 |
| 보호 | 30 (리다이렉트 1 포함) | 30 |
| 폴백 | 1 | 1 |
| **합계** | **42** | **42** |

**결과**: ✅ 일치

---

## 2. mcp_outputs 43개 vs 노드 인덱스 행 수

| 항목 | 수량 |
|------|------|
| FSD_IA_NODEID_SSOT §4 노드 | 43 |
| CarivDealer_Storyboard §6 노드 인덱스 | 43 |

**결과**: ✅ 일치

---

## 3. 파일 존재 검증

| 파일 | 존재 |
|------|------|
| docs/CarivDealer_IA.md | ✅ |
| docs/CarivDealer_UserFlow.md | ✅ |
| docs/CarivDealer_Storyboard.md | ✅ |
| docs/CarivDealer_api_v1.md | ✅ |
| docs/CarivDealer_API_ERD_Mapping.md | ✅ |

---

## 4. 참조 문서 일치

| CarivDealer_IA §3.1 URL | router.tsx path |
|-------------------------|-----------------|
| `/` | `path="/"` |
| `/vehicles/:vehicleId` | `path="/vehicles/:vehicleId"` |
| `/logistics/schedule` | `path="/logistics/schedule"` |
| ... | 일치 |

**결과**: ✅ SSOT(VID §4)와 일치

---

## 5. 검증 방법

- `grep` for Route path in router.tsx
- `list_dir` for docs/
- 수동 행 수 카운트

---

## 6. api_v1·API_ERD_Mapping 교차 검증

| 항목 | api_v1 | API_ERD_Mapping | 결과 |
|------|--------|-----------------|------|
| 차량 API | GET/POST/PUT/PATCH/DELETE /vehicles | vehicle·vehicle_file 매핑 | ✅ 일치 |
| 검차 API | POST /vehicles/:id/inspections, GET /vehicles/:id/inspections/latest | inspection·inspection_place 매핑 | ✅ 일치 |
| nodeId SSOT | — | 검차 Step1: 1033-4903 (FSD_IA_NODEID_SSOT §4) | ✅ 통일 |
| 계산값 | displayStatus, primaryCta (§3.2) | §3 계산값 목록 | ✅ 일치 |
| 라우트 패턴 | §4 라우트↔API | IA §3.x, FIGMA_IA_FSD_STRUCTURE | ✅ 일치 |

**참조**: [CarivDealer_DOCUMENT_SUITE_CONSISTENCY_REPORT_20260213.md](CarivDealer_DOCUMENT_SUITE_CONSISTENCY_REPORT_20260213.md), [CarivDealer_DOCUMENT_SUITE_INDEX.md](CarivDealer_DOCUMENT_SUITE_INDEX.md)
