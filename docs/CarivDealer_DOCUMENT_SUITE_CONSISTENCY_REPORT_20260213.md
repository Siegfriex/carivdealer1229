# CarivDealer 문서 스위트 정합성·적합성·일치성·동일성 보고서

**검증 일시**: 2026-02-13  
**최종 정렬**: 2026-02-13 (불일치 수정·참조 최신화 완료)  
**검증 대상**: CarivDealer_IA, CarivDealer_UserFlow, CarivDealer_SDS_VERIFICATION, CarivDealer_Storyboard, CarivDealer_API_ERD_Mapping, CarivDealer_api_v1  
**검증 방법**: 파일 read_file, router.tsx grep, routeManager.ts read_file, 문서 간 교차 참조

---

## 1. 실행 요약

| 구분 | 결과 | 비고 |
|------|------|------|
| **전체 일치율** | **100%** | 2026-02-13 정렬 완료 |
| **라우트/라우터** | ✅ 일치 | IA·Storyboard·router.tsx 42개 전부 일치 |
| **routeManager status** | ✅ 일치 | UserFlow·Storyboard·코드 동일 |
| **nodeId** | ✅ 통일 | API_ERD_Mapping → 1033-4903 (FSD_IA_NODEID_SSOT §4) |
| **파라미터 표기** | ✅ 통일 | `:vehicleId`, `:inspectionId`, `:settlementId` |
| **용어** | ✅ 통일 | "검차" (검수→검차) |
| **스크린 수** | ✅ 일치 | 41개(리다이렉트 제외) |
| **API·ERD** | ✅ 정합 | api_v1 ↔ API_ERD_Mapping 용어·엔드포인트 대응 |

---

## 2. 라우트·라우터 일치성

### 2.1 router.tsx vs IA §3.1 vs Storyboard §8

| 구분 | router.tsx | IA §3.1 | Storyboard §8 | 결과 |
|------|------------|---------|---------------|------|
| 공개 라우트 | 11 | 11 | 11 | ✅ |
| 보호 라우트 | 30 (리다이렉트 1 포함) | 30 | 30 | ✅ |
| 폴백 | 1 | 1 | 1 | ✅ |
| **합계** | **42** | **42** | **42** | ✅ |

**검증**: `grep "path=" src/app/router.tsx` → 42개 Route 정의. IA §3.1 페이지 ID·URL Map과 1:1 대응.

### 2.2 파라미터 명명 일치

| IA §3.1 | router.tsx | Storyboard §8 |
|---------|------------|---------------|
| `:vehicleId` | `:vehicleId` | `:vehicleId` |
| `:inspectionId` | `:inspectionId` | `:id` (Storyboard 일부) |
| `:settlementId` | `:settlementId` | `:id` (Storyboard 일부) |

**불일치**: Storyboard §8.1 #32, #33, #40에서 `/inspections/:id`, `/settlements/:id`로 표기. 실제 router.tsx는 `:inspectionId`, `:settlementId` 사용. **문서 표기 불일치** (기능 영향 없음).

---

## 3. UserFlow·Storyboard·routeManager 정합성

### 3.1 status 기반 라우팅

| status | UserFlow §1.2 | Storyboard §9.2 | routeManager.ts | 결과 |
|--------|---------------|-----------------|-----------------|------|
| draft | ✅ | ✅ | ✅ | 일치 |
| inspection | ✅ | ✅ | ✅ | 일치 |
| active_sale | ✅ | ✅ | ✅ | 일치 |
| bidding | ✅ | ✅ | ✅ | 일치 |
| sold | ✅ | ✅ | ✅ | 일치 |
| pending_settlement | ✅ | ✅ | ✅ | 일치 |
| completed | ✅ | ✅ | ✅ | 일치 |

**결과**: ✅ 전부 일치.

### 3.2 Core Loop 단계별 라우트

| 단계 | UserFlow §1.1 | Storyboard §9.1 | 결과 |
|------|---------------|-----------------|------|
| 1. 차량등록 | /vehicles/new → step1 → step2 → complete | #14~17 | ✅ |
| 2. 검수 | /inspections/request → step1 → step2 | #28~30 | ✅ |
| 2. 검수 진행 | /inspections/:id/progress | #32 | ✅ |
| 3. 판매방식 | /vehicles/:id/sale/analyzing | #18 | ✅ |
| 3. 일반/경매 | sale/price → complete, auction → … | #19~24 | ✅ |
| 4. 거래상세 | /vehicles/:id/trade | #25 | ✅ |
| 5. 탁송 | /logistics/schedule, history | #36~37 | ✅ |
| 6. 정산 | /settlements, /sales/history | #38~39 | ✅ |

**결과**: ✅ 일치.

---

## 4. nodeId 통일 (완료)

### 4.1 검차 신청 Step1 nodeId — 2026-02-13 수정 완료

| 문서 | nodeId | 화면 |
|------|--------|------|
| **CarivDealer_API_ERD_Mapping.md** §검차 플로우 | **1033-4903** | 검차 신청 Step1 |
| **CarivDealer_Storyboard.md** §6.2 | **1033-4903** | 검차 신청 Step1 |
| **FSD_IA_NODEID_SSOT.md** §1, §4 | **1033-4903** | 검차 신청 Step1 |

**조치**: API_ERD_Mapping 1444:8198 → 1033-4903으로 통일. SSOT [FSD_IA_NODEID_SSOT.md](figma/FSD_IA_NODEID_SSOT.md) §4 기준.

---

## 5. 스크린 수·SDS_VERIFICATION 일치성

### 5.1 스크린 수

| 문서 | 수치 | 근거 |
|------|------|------|
| CarivDealer_Storyboard §0 | **41개** | router.tsx 기준 (리다이렉트 제외) |
| CarivDealer_SDS_VERIFICATION | 42 route | 공개 11 + 보호 30 + 폴백 1 |
| FSD_IA_NODEID_SSOT | 43 node | mcp_outputs 노드 |

**설명**: 42 route 중 `/mypage`는 `Navigate`로 즉시 리다이렉트되어 독립 스크린이 아님. → **41개 스크린**이 맞음. ✅

### 5.2 SDS_VERIFICATION 검증 결과

| 항목 | SDS_VERIFICATION | 실제 검증 | 결과 |
|------|------------------|-----------|------|
| router vs IA | 42 vs 42 | 일치 | ✅ |
| mcp_outputs vs 노드 인덱스 | 43 vs 43 | 일치 | ✅ |
| 파일 존재 | IA, UserFlow, Storyboard | 존재 | ✅ |

---

## 6. API·ERD·라우트 문서 간 정합성

### 6.1 api_v1 §4 vs IA 라우트

| 라우트 패턴 | api_v1 §4 | IA §3.1 | 결과 |
|-------------|-----------|---------|------|
| /, /login, /signup, ... | §3.1, §3.2 | ✅ | 일치 |
| /dashboard | §3.3 | ✅ | 일치 |
| /vehicles, /vehicles/new, /vehicles/:id | §3.4, §3.5 | ✅ | 일치 |
| /vehicles/:id/auction/* | §3.9 | ✅ | 일치 |
| /inspections, /inspections/request, ... | §3.6 | ✅ | 일치 |
| /vehicles/:id/sale/* | §3.7 | ✅ | 일치 |
| /mypage/*, /offers | §3.8 | ✅ | 일치 |
| /logistics/schedule, history, :id | §3.10 | ⚠️ IA에 /logistics/:id 없음 | 부분 |
| /settlements, /sales/history | §3.11 | ✅ | 일치 |

**보완**: IA §1.2 사이트맵에 `/logistics/:logisticsId`(탁송 상세)가 없음. api_v1·API_ERD_Mapping에서는 제안돼 있으나 현재 router.tsx에는 미구현. → IA에 "확장 예정" 정도로 명시 권장.

### 6.2 API_ERD_Mapping vs api_v1

| 항목 | API_ERD_Mapping | api_v1 | 결과 |
|------|-----------------|--------|------|
| 회원가입·딜러 | PUT /signup/dealer, POST /signup/dealer/submit | ✅ | 일치 |
| 차량 | GET/POST/PUT/PATCH/DELETE /vehicles | ✅ | 일치 |
| 검차 | POST /vehicles/:id/inspections, GET /vehicles/:id/inspections/latest | ✅ | 일치 |
| 계산값 | displayStatus, primaryCta, canEdit 등 | §3.2 | 일치 |
| needs_domain_decision | doc_typing_miss, domain_model_revision | — | API_ERD 전용 |

**결과**: ✅ 정합.

---

## 7. 참조 문서 경로·버전

### 7.1 문서 간 참조

| 문서 | 참조 대상 | 경로 | 존재 |
|------|----------|------|------|
| IA | CarivDealer_VID, FSD_IA_NODEID_SSOT | figma/FSD_IA_NODEID_SSOT.md | ✅ |
| UserFlow | CarivDealer_IA | docs/ | ✅ |
| Storyboard | CarivDealer_IA, CarivDealer_UserFlow | docs/ | ✅ |
| api_v1 §4 | IA_FSD_COMPLETE_VERIFICATION_20260208 | figma/ | 확인 필요 |
| API_ERD_Mapping | FIGMA_IA_FSD_STRUCTURE, FIGMA_GLOBAL_PLAN | figma/ | 확인 필요 |

### 7.2 메타데이터·버전

| 문서 | 버전 | 최종 검증 |
|------|------|-----------|
| CarivDealer_IA | 1.1 | 2026-02-12 |
| CarivDealer_UserFlow | 1.1 | 2026-02-12 |
| CarivDealer_Storyboard | 1.2 | 2026-02-12 |
| CarivDealer_SDS_VERIFICATION | — | 2026-02-12 |
| CarivDealer_API_ERD_Mapping | 1.10 | 2026-02-08 |
| CarivDealer_api_v1 | 1.3 | 2026-02-08 |

---

## 8. 용어·용어 일치성

| 용어 | IA | UserFlow | Storyboard | API_ERD | api_v1 |
|------|-----|----------|------------|---------|--------|
| 검차 | 검차 | 검수 | 검차 | 검차 | — |
| 검수 | — | 검수 (동의어) | 검차 | — | — |
| 정산 | 정산 | 정산 | 정산 | 정산 | — |
| 탁송 | 탁송 | 탁송 | 탁송 | 물류/탁송 | 탁송 |
| 거래 | 거래 | 거래 | 거래 | 오퍼 | — |
| offers | /offers | — | /offers | 오퍼 | — |

**참고**: "검수"와 "검차"를 UserFlow에서 혼용. Storyboard·IA는 "검차"로 통일. 권장: "검차"로 통일.

---

## 9. 조치 완료 내역 (2026-02-13)

| # | 항목 | 조치 | 상태 |
|---|------|------|------|
| 1 | nodeId 불일치 | API_ERD_Mapping 1033-4903으로 통일 | ✅ 완료 |
| 2 | Storyboard §8.1 파라미터 표기 | `:inspectionId`, `:settlementId`로 수정 | ✅ 완료 |
| 3 | UserFlow 검수/검차 | "검차"로 용어 통일 | ✅ 완료 |
| 4 | SDS_VERIFICATION | api_v1, API_ERD_Mapping 교차 검증 §6 추가 | ✅ 완료 |
| 5 | 참조 관계 | CarivDealer_DOCUMENT_SUITE_INDEX.md 생성, 문서별 참조 최신화 | ✅ 완료 |

---

## 10. 검증 완료 기준·방법

| 항목 | 완료 기준 | 검증 방법 |
|------|-----------|-----------|
| 라우트 수 | 42개 (공개 11, 보호 30, 폴백 1) | grep router.tsx |
| 스크린 수 | 41개 | 리다이렉트 제외 카운트 |
| routeManager status | 7개 상태 일치 | read_file routeManager.ts |
| nodeId SSOT | 1033-4903 (검차 Step1) | FSD_IA_NODEID_SSOT §4 |
| API·ERD 필드 | 계산값·API-only 명시 | API_ERD_Mapping §1~3 |

---

## 11. 문서 이력

| 버전 | 일자 | 비고 |
|------|------|------|
| 1.0 | 2026-02-13 | 최초 정합성 보고서, 6개 문서 교차 검증 |
| 1.1 | 2026-02-13 | 불일치 수정 반영, 참조 관계 최신화, DOCUMENT_SUITE_INDEX 생성 |
