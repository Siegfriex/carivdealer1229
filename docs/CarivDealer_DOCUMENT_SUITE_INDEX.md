# CarivDealer 문서 스위트 인덱스

**목적**: 문서 스위트 의존성·참조 관계·독서 순서 정의. SSOT 기반 문서 정렬.  
**최종 업데이트**: 2026-02-13

---

## §1 문서 의존성 그래프

```
CarivDealer_VID ─────────────────────────────────┐
         │                                        │
         ▼                                        │
FSD_IA_NODEID_SSOT ◄── CarivDealer_IA ◄── CarivDealer_UserFlow
         │                    │                    │
         │                    ▼                    │
         │             CarivDealer_Storyboard ◄─────┘
         │                    │
         ▼                    ▼
CarivDealer_api_v1 ◄── CarivDealer_API_ERD_Mapping
         │
         ▼
   DATABASE_ERD_SCHEMA (참조)
```

### 계층별 설명

| 계층 | 문서 | 의존성 | 역할 |
|------|------|--------|------|
| **L0** | CarivDealer_VID | 없음 | 비전·프로토콜·routeManager 정의 |
| **L0** | FSD_IA_NODEID_SSOT | 없음 | nodeId ↔ 라우트 ↔ 페이지 SSOT |
| **L1** | CarivDealer_IA | VID, FSD_IA_NODEID_SSOT | 사이트맵·라우팅·메뉴·GNB/LNB |
| **L1** | CarivDealer_UserFlow | IA | Core Loop·Auth·routeManager·예외 처리 |
| **L2** | CarivDealer_Storyboard | IA, UserFlow | UI 스펙·Interaction Rule·스크린별 규칙 |
| **L2** | CarivDealer_api_v1 | IA (라우트) | API 명세 (회원가입·차량·검차) |
| **L3** | CarivDealer_API_ERD_Mapping | api_v1, FSD_IA_NODEID_SSOT, IA | API ↔ ERD 필드·엔티티 매핑 |
| **검증** | CarivDealer_SDS_VERIFICATION | IA, UserFlow, Storyboard, router | 서비스 설계 스펙 검증 |
| **정합성** | CarivDealer_DOCUMENT_SUITE_CONSISTENCY_REPORT | 전체 | 문서 간 정합성·일치성 보고 |

---

## §2 권장 독서 순서

### 신규 투입·온보딩
1. CarivDealer_VID — 비전·프로토콜
2. CarivDealer_IA — 정보 구조·라우트
3. CarivDealer_UserFlow — 핵심 플로우
4. CarivDealer_Storyboard — UI·인터랙션

### API·백엔드
1. CarivDealer_api_v1 — API 명세
2. CarivDealer_API_ERD_Mapping — 필드·ERD 매핑
3. DATABASE_ERD_SCHEMA — DB 스키마

### 검증·정합성
1. CarivDealer_SDS_VERIFICATION — 설계 검증
2. CarivDealer_DOCUMENT_SUITE_CONSISTENCY_REPORT — 문서 정합성

---

## §3 문서별 참조 요약

| 문서 | 참조하는 문서 | 참조되는 문서 |
|------|---------------|---------------|
| CarivDealer_IA | CarivDealer_VID, FSD_IA_NODEID_SSOT | UserFlow, Storyboard, api_v1, API_ERD_Mapping |
| CarivDealer_UserFlow | CarivDealer_IA | Storyboard, SDS_VERIFICATION |
| CarivDealer_Storyboard | CarivDealer_IA, CarivDealer_UserFlow, FSD_IA_NODEID_SSOT | SDS_VERIFICATION |
| CarivDealer_api_v1 | IA_FSD_COMPLETE_VERIFICATION, FIGMA_IA_FSD_STRUCTURE | CarivDealer_API_ERD_Mapping |
| CarivDealer_API_ERD_Mapping | CarivDealer_api_v1, FSD_IA_NODEID_SSOT, FIGMA_IA_FSD_STRUCTURE | — |
| CarivDealer_SDS_VERIFICATION | IA, UserFlow, Storyboard | — |
| CarivDealer_DOCUMENT_SUITE_CONSISTENCY_REPORT | 전체 | — |

---

## §4 문서 스위트 파일 목록

| 파일 | 버전 | 설명 |
|------|------|------|
| CarivDealer_IA.md | 1.1 | 정보 구조·사이트맵·라우팅 |
| CarivDealer_UserFlow.md | 1.1 | 사용자 시나리오·플로우 |
| CarivDealer_Storyboard.md | 1.2 | UI 스펙·Interaction Rule |
| CarivDealer_api_v1.md | 1.3 | API 명세 |
| CarivDealer_API_ERD_Mapping.md | 1.10 | API ↔ ERD 매핑 |
| CarivDealer_SDS_VERIFICATION.md | — | 설계 검증 보고서 |
| CarivDealer_DOCUMENT_SUITE_CONSISTENCY_REPORT_20260213.md | 1.0 | 문서 정합성 보고서 |
| CarivDealer_DOCUMENT_SUITE_INDEX.md | 1.0 | 본 문서 (인덱스) |

---

## §5 유지보수 규칙

1. **IA 변경 시**: UserFlow, Storyboard, api_v1 §4 라우트 매핑 검토
2. **routeManager 변경 시**: UserFlow §1.2, Storyboard §9.2 동기화
3. **nodeId 추가/변경 시**: FSD_IA_NODEID_SSOT 먼저 갱신, API_ERD_Mapping·Storyboard §6 반영
4. **라우트 파라미터 변경 시**: `:vehicleId`, `:inspectionId`, `:settlementId`로 통일 (router.tsx 기준)
5. **용어**: 검차(inspection) 통일. "검수"는 사용하지 않음
