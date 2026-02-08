# NEO GOD 검토 체크리스트 및 미식별·잠재 위험 요인

**목적**: Mermaid/React/Vite 그라운딩 비교 대조, 리스크 표 정리.  
**기준**: NEO GOD 시스템 설계 헌법, 현시점 코드베이스.

---

## 1. 비교 대조 체크리스트

| 항목 | 검증 방법 | 결과 |
|------|-----------|------|
| 라우트 수(38+1) = 구현 페이지 파일 수 | router.tsx Route 개수 vs src/pages 하위 페이지 컴포넌트 수 | 38개 path + * 리다이렉트. 각 path당 1개 element(페이지) 매핑됨. 일치. |
| FIGMA_SCR_ROUTE_MAP 28개 SCR ↔ 라우트(경로 그룹) 매핑 일치 여부 | FIGMA_SCR_ROUTE_MAP.md 테이블 vs router path | SCR별 경로가 실제 라우트와 대응. 일부 SCR은 복수 경로(step1~4 등) 대응. 일치. |
| apiEndpoints 상수 ↔ functions export 이름 일치 여부 | apiEndpoints.ts 값 vs functions/src/index.ts export | MEMBER.REGISTER는 'member/dealer/register'(경로형). 나머지 대부분 함수명(verifyBusinessAPI, ocrRegistrationAPI 등). 불일치: REGISTER. 실제 호출 URL은 함수명 기준이므로 명세 테이블·점검 문서에 "실제 호출 경로" 반영함. |
| SCREEN_FLOWCHARTS 내 모든 경로가 router에 존재하는지 | SCREEN_FLOWCHARTS.md Mermaid 내 "/path" vs router | §2에 `/logistics` 단일 표기, 실제는 /logistics/schedule, /logistics/history. §7 노드 E 미정의. 불일치 목록은 NEO_GOD_Codebase_Audit.md §1.2에 정리됨. |

---

## 2. 미식별·잠재 위험 요인

| 위험 | 설명 | 대응 |
|------|------|------|
| **엔드포인트 경로 혼재** | apiEndpoints에 경로형(`member/dealer/register`)과 함수명형(`verifyBusinessAPI`) 혼재. Firebase HTTP 트리거는 함수명이 경로. | NEO_GOD_Codebase_Audit.md §1.1에서 "실제 호출 경로" 테이블 작성. apiEndpoints 또는 API_SPECIFICATION_v2를 실제 배포 경로(함수명)로 통일하는 수정 제안 반영. |
| **ORDER/PAYMENT/ADDRESS/REVIEW/SELLER_DOCS** | API·ERD는 있으나 프론트 라우트·페이지 없음. | NEO_GOD_Integrated_Spec_Table.md에 "API만 존재, 화면 미구현" 행으로 기입. 전역/탭 플로우에는 미구현 노드 제외. |
| **플로우차트 노드 누락** | SCREEN_FLOWCHARTS §7 일반 판매에서 `E(("완료"))` 미정의. §2 `/logistics` 단일 노드. | NEO_GOD_Tab_Flows.md 등 상세 플로우에서 노드 ID 일괄 정의. SCREEN_FLOWCHARTS §2는 /logistics/schedule, /logistics/history 분리 또는 라벨 보강 권장. |
| **ERD 이중 정의** | FIRESTORE_SCHEMA(컬렉션) vs DATABASE_ERD_SCHEMA(21 테이블). | 통합 명세의 "관련 ERD 필드"는 Firestore 컬렉션·필드 우선 매핑. ERD 테이블은 관계도 참조로만 명시(NEO_GOD_Data_API_Rules.md). |
| **인증 미구현** | API 명세에 "인증 미구현(프로토타입)". 전역 플로우에서 "로그인 성공"은 UI 전제. | NEO_GOD_Global_Flow.md, NEO_GOD_Integrated_Spec_Table.md 등에 "현재 인증: 미적용. 전역 플로우는 인증 적용 후 시나리오로 간주" 문구 명시. |

---

## 3. 그라운딩 요약

- **Mermaid**: [Flowchart syntax](https://mermaid.js.org/syntax/flowchart.html) 기준. 노드 ID 공백/특수문자 시 따옴표, 화살표 라벨 괄호 시 따옴표. 서브그래프 ID 영문 권장. NEO_GOD_Codebase_Audit.md §1.3에 NEO GOD Mermaid 규칙 정리.
- **React Router**: router.tsx는 BrowserRouter, Routes, Route, Navigate 사용. 딥링크·새로고침 대응.
- **Vite**: 진입점 index.html + index.tsx, 경로 별칭 @/. 빌드/실행 환경은 Vite 기준.
