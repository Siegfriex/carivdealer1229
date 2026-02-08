# NEO GOD 시스템 명세서 인덱스

**역할**: Vice-Director (System Architect) — NEO GOD 시스템 설계 헌법에 따른 최종 명세서 산출물 목차.  
**구조**: 서론(목표·범위) — 본론(점검·전역플로우·탭플로우·통합테이블·데이터API규칙·IA사이트맵) — 결론(검토·리스크).

---

## 서론

- **목표**: (1) 현 프론트엔드 코드베이스 일괄 점검 (2) NEO GOD 헌법에 따른 명세 산출 (3) IA·사이트맵 포함 (4) Mermaid/React/Vite 그라운딩 및 리스크 식별.
- **범위**: router.tsx, apiEndpoints.ts, apiClient.ts, functions/src/index.ts. 참조 문서(SCREEN_FLOWCHARTS, FIRESTORE_SCHEMA, FIGMA_SCR_ROUTE_MAP, API_SPECIFICATION_v2, DATABASE_ERD_SCHEMA 등)는 `docs/archive/`에 있음.

---

## 본론 (산출물)

| 순서 | 문서 | 내용 |
|------|------|------|
| 1 | [NEO_GOD_Codebase_Audit.md](NEO_GOD_Codebase_Audit.md) | 1.1 라우트–페이지–API 매핑표, 1.2 플로우차트–라우트 불일치 목록, 1.3 NEO GOD Mermaid 규칙 |
| 2 | [NEO_GOD_Global_Flow.md](NEO_GOD_Global_Flow.md) | 전역 유저 플로우 (진입→종료, 유저 액션만, 단일 Mermaid) |
| 3 | [NEO_GOD_Tab_Flows.md](NEO_GOD_Tab_Flows.md) | 탭별 상세 유저 플로우 (랜딩/회원가입/차량/검차/제안/탁송/판매/정산), 전역 노드와 연동 |
| 4 | [NEO_GOD_Integrated_Spec_Table.md](NEO_GOD_Integrated_Spec_Table.md) | 통합 명세서 테이블 (Flow ID, Screen, Function, Data, API) |
| 5 | [NEO_GOD_Data_API_Rules.md](NEO_GOD_Data_API_Rules.md) | 데이터·인터페이스 강제 규칙 (ERD 필드 타입·제약, API RESTful·요청/응답) |
| 6 | [NEO_GOD_IA_Sitemap.md](NEO_GOD_IA_Sitemap.md) | IA(정보 구조) 계층, SCR↔경로 매핑, 사이트맵(Mermaid + 목록) |
| 7 | [NEO_GOD_Review_Risks.md](NEO_GOD_Review_Risks.md) | 비교 대조 체크리스트, 미식별·잠재 위험 요인 표 |
| 8 | [NEO_GOD_Meeting_Comparison_Report.md](NEO_GOD_Meeting_Comparison_Report.md) | 회의록(2026-02-04 라스트 밋업) vs NEO GOD 플로우·IA 비교 분석, 일치/불일치·갭 요약·권장 후속 |

---

## 결론

- **핵심**: 코드베이스 점검 후 NEO GOD 헌법(전역 유저플로우, 탭별 상세플로우, 통합 테이블, ERD/API 규칙, IA/사이트맵)에 따라 누락·단순화 없이 명세 작성 완료.
- **그라운딩**: Mermaid 공식 문법, React Router·Vite 사용 패턴과 비교 검증. 엔드포인트 혼재·미구현 화면·ERD 이중 정의·인증 미적용 등 위험은 NEO_GOD_Review_Risks.md에 명시.

---

*"이 지시는 시스템 설계의 헌법이며, 임의로 생략하거나 단순화할 수 없다." — NEO GOD 시스템 설계 시작.*
