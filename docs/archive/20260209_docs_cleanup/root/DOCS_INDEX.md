# 문서 목차 (Figma·API·ERD·FSD 스위트)

**의존 순서**: IA / Verification → api_v1 / ERD_Mapping → FSD 맵·최종 플랜.

---

## Figma 스위트

| 문서 | 설명 |
|------|------|
| [figma/FIGMA_IA_FSD_STRUCTURE.md](figma/FIGMA_IA_FSD_STRUCTURE.md) | Figma IA + FSD 구조 정의. 11개 섹션(§3.1~3.11), 통합 페이지 인덱스, 공통 컴포넌트·FSD 레이어 후보. |
| [figma/FIGMA_GLOBAL_PLAN.md](figma/FIGMA_GLOBAL_PLAN.md) | 전역 플랜. §2.7~2.11 차량 목록·등록·마이페이지·탁송·정산. 자식 nodeId 전목록. |
| [figma/IA_FSD_COMPLETE_VERIFICATION_20260208.md](figma/IA_FSD_COMPLETE_VERIFICATION_20260208.md) | 통합 페이지 인덱스(§2), 섹션별 자식 페이지 완전 나열(§3). |
| [figma/FIGMA_11_SECTIONS_TO_APP_MAP.md](figma/FIGMA_11_SECTIONS_TO_APP_MAP.md) | 11개 섹션 ↔ 앱 라우트·페이지 매핑. |

---

## API·ERD 스위트

| 문서 | 설명 |
|------|------|
| [CarivDealer_api_v1.md](CarivDealer_api_v1.md) | API 명세 v1. 회원가입·로그인·차량·검차. §4 라우트↔API 매핑(Figma Verification 기준). |
| [CarivDealer_API_ERD_Mapping.md](CarivDealer_API_ERD_Mapping.md) | API ↔ ERD 필드·엔티티 매핑. Figma IA §3.x·Global Plan §2.7~2.11·Verification 통합 인덱스 참조. |
| [CarivDealer_API_ERD_Consistency_Report.md](CarivDealer_API_ERD_Consistency_Report.md) | API-ERD 불일치·갭·권장 조치. |

---

## FSD 최종

| 문서 | 설명 |
|------|------|
| [figma/FSD_FINAL_MAP.md](figma/FSD_FINAL_MAP.md) | FSD 레이어·슬라이스·라우트↔페이지↔API 매트릭스. |
| [FSD_FINAL_PLAN.md](FSD_FINAL_PLAN.md) | 최종 FSD 확정 플랜. 적용 요약, 레이어·슬라이스 확정, 라우트→페이지→API→ERD 매트릭스, 구현 우선순위·유지보수 규칙. |

---

## 기타

- **[NEO_GOD_INDEX.md](NEO_GOD_INDEX.md)** — NEO GOD 명세서 진입점·목차  
- `archive/` — API·ERD·Figma 매핑 이력, 배포 체크리스트 등.
