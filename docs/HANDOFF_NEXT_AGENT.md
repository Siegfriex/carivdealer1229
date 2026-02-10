# 다음 에이전트 핸드오프 (세션 보존)

**최종 갱신**: 2025-02-10  
**목적**: 리프레시 후 다음 에이전트가 **바로 이어서** 작업할 수 있도록 맥락·경로·다음 작업을 한곳에 정리.

> **세션 리프레시 후**: 이 문서를 먼저 읽고 §5 "다음에 이어서 할 작업"부터 재개하면 됩니다.

---

## 1. 이 문서를 먼저 읽으세요

- **`docs/HANDOFF_NEXT_AGENT.md`** (본 문서)를 열어 현재 상태와 다음 작업을 확인한 뒤 진행하세요.
- Figma 구현은 **MCP 호출 없이** `docs/figmaMCP/mcp_outputs/{nodeId}/` 의 `metadata_raw.txt`, `design_context_raw.txt` 를 **read_file로만** 사용합니다. (2번 에이전트 규칙)

---

## 2. 최근 세션에서 한 일 (요약)

| 영역 | 상태 |
|------|------|
| **CTA_1** (매물등록·차량원부) | 1425-7638, 1425-7684 매핑·구현계획·VehicleRegisterEntryPage·VehicleRegisterStep1Page 반영 |
| **CTA_2** (검차) | 1033-4903, 1037-5126/5673, 1042-4681, 1121-5308, 1193-8343/8120/9217 매핑·구현. InspectionProgressPage 임시저장·다음단계·검차내역 스크롤·검차 상세 모달 |
| **CTA_3** (거래) | 17노드(1714-22332, 794-3704/4015/4200/4371/4107/4708/4542, 1302-27289/27093, 1123-13580/20023/20699/13763/13487/14112/13946) mcp_outputs·NODE_TO_ROUTE·구현. 판매방식선택·시세분석·거래상세 펼침·검차 상세 모달·판매방식 변경 컨테이너 |
| **CTA_4** (탁송) | 10노드(1714-22874, 1362-36169, 1272-12926/13294/14540/13503/13819/14309/15049/13099) mcp_outputs·NODE_TO_ROUTE·MCP 호출. GNB 탁송≠차량목록 탁송단계 별도 페이지. TradeDetailPage "탁송 목록으로" 버튼·JSDoc(목록 돌아가기=GNB 탁송). LogisticsSchedulePage 탁송 목록·리스트 클릭 하단 패널·새 탁송예약 폼·주소 모달·기사배정 진행중·탁송완료(탁송목록/정산 분기) |

---

## 3. 반드시 유지할 결정사항

| 항목 | 내용 |
|------|------|
| **목록 돌아가기 (거래 단계)** | 매물등록 CTA_3 거래에서 "목록 돌아가기" = **GNB 탁송 탭** (`/logistics/schedule`). TradeDetailPage에 "탁송 목록으로" 버튼 있음. |
| **GNB 탁송 vs 차량목록 탁송** | **GNB 탁송 탭** = `/logistics/schedule` (LogisticsSchedulePage). **차량목록 탭 탁송단계 필터** = `/vehicles?stage=logistics` (VehicleListPage). 서로 다른 페이지. |
| **탁송 상태 4개** | 탁송일정 → 탁송 배정 → 픽업 완료 → 인계완료. 정산단계 진행은 **인계완료** 시에만. |
| **메인 진입점** | 로그인·회원가입 후·404 폴백 → **차량 목록(`/vehicles`)**. |

---

## 4. Figma MCP 워크플로 (재적용 시)

| 단계 | 경로/행동 |
|------|-----------|
| **문서** | `docs/figmaMCP/README.md`, `WORKFLOW.md`, `NODE_TO_ROUTE_AND_FILE.md`, `MCP_RESPONSE_CHECKLIST.md` |
| **데이터** | `docs/figmaMCP/mcp_outputs/{nodeId하이픈}/metadata_raw.txt`, `design_context_raw.txt` (MCP 호출 금지·read_file만) |
| **계획** | `docs/figmaMCP/impl_plans/` (노드별 `{nodeId}_구현계획.md`, `CTA_3_거래_플로우_요약.md`, `CTA_4_탁송_플로우_요약.md`) |
| **에셋** | `src/shared/figma_image/`, `docs/figmaMCP/FIGMA_ASSET_TRACEABILITY.md` |
| **로그** | `docs/figmaMCP/figMCP.MD` (6하원칙) |
| **2번 에이전트** | `docs/figmaMCP/AGENT_PROMPT_TEMPLATE.md` 의 "2번 에이전트용" 상수 복사 후, 같은 Figma URL + 구현 요청 |

---

## 5. 다음에 이어서 할 작업 (우선순위)

1. **CTA_4 탁송 상세 UI**  
   - `LogisticsSchedulePage`: 주소 모달(1272-14540) 우편번호 검색·결과, 연도 캘린더(1272-13503)·월 3×4(1272-13819)·시간 선택(1272-14309) Figma대로 반영.  
   - `docs/figmaMCP/mcp_outputs/1272-*` 채워진 경우 read_file로 레이아웃 스펙 추출 후 적용.

2. **차량목록 탭 탁송단계 필터**  
   - `VehicleListPage`: `/vehicles?stage=logistics` 시 1362-36169 디자인(별도 페이지) 반영.  
   - `mcp_outputs/1362-36169/` 내용 기준으로 레이아웃·필터 UI.

3. **기타**  
   - 마이페이지 확장(내프로필·기본정보수정 등), 회원가입 유도 전용 뷰 등은 `docs/SITEMAP_IMPLEMENTATION_STATUS.md` 참고.

---

## 6. 핵심 파일 경로

| 용도 | 경로 |
|------|------|
| 프로젝트 컨텍스트 | `CLAUDE.md` |
| 라우트 | `src/app/router.tsx` |
| Figma 노드↔라우트↔페이지 | `docs/figmaMCP/NODE_TO_ROUTE_AND_FILE.md` |
| CTA_3 거래 요약 | `docs/figmaMCP/impl_plans/CTA_3_거래_플로우_요약.md` |
| CTA_4 탁송 요약 | `docs/figmaMCP/impl_plans/CTA_4_탁송_플로우_요약.md` |
| 탁송 페이지 | `src/pages/admin/LogisticsSchedulePage.tsx` |
| 거래 상세(탁송 목록으로 버튼) | `src/pages/admin/TradeDetailPage.tsx` |
| 차량 목록(탁송단계 필터) | `src/pages/admin/VehicleListPage.tsx` |

---

## 7. 빌드·실행

```bash
npm run dev      # 프론트 개발 서버
npm run build    # 프로덕션 빌드
```

---

**리프레시 후**: 이 파일(`HANDOFF_NEXT_AGENT.md`)을 열고, §5 다음 작업부터 이어서 진행하면 됩니다.
