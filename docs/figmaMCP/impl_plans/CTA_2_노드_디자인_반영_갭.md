# CTA_2 검차 플로우 노드 — design_context·metadata 반영 갭 분석

**검증 기준**: 각 노드의 `mcp_outputs/{node}/metadata_raw.txt` 및 `design_context_raw.txt`에 명시된 레이아웃·문구·스타일을 구현에 반영했는지 여부. **미반영 항목 = 디버깅(구현) 대상.**

**데이터 소스**: NODE_TO_ROUTE_AND_FILE.md, mcp_outputs (CTA_2 검차 관련 nodeId만).  
*1425-9445, 1444-8198, 1425-9661, 1425-9875는 mcp_outputs 없음 → 본 갭 표 제외.*

---

## 1. CTA_2 노드 목록 (mcp_outputs 존재 노드)

| nodeId | 화면/역할 | 라우트 | 페이지 | 반영됨 | 미반영·보완 (디버깅 대상) |
|--------|-----------|--------|--------|--------|---------------------------|
| **1033-4903** | 검차신청 Step1 (변형) | `/inspections/request`, `request/step1` | InspectionRequestLandingPage, Step1Page | ✅ 메인 max-w 980, 검차 신청 플로우 | ✅ **반영 완료** — Step1 검차 차량 선택에 placeholder "예) 12바 1234", 버튼 "검색하기" (2025-02-10) |
| **1037-5126** | 검차요청내역 (동일페이지·상태1) | `/inspections` | InspectionListPage | ✅ 리스트·필터(검차자 매칭중 등)·INSPECTION_STATUS_LABELS | ✅ **반영 완료** — 테이블 컨테이너 max-w-[974px], 행 min-h-[56px] data-node-id="1037:5391", rounded-xl·shadow (2025-02-10) |
| **1037-5673** | 검차요청내역 (상태2·클릭 시 하단) | `/inspections` | InspectionListPage | ✅ 카드 확장·상세 | ✅ **반영 완료** — 확장 패널 data-node-id="1037:5673", min-h-[56px] (2025-02-10) |
| **1042-4681** | 검차요청내역 (상태3) | `/inspections` | InspectionListPage | ✅ 카드뷰·상태 배지 | ✅ **반영 완료** — 카드 좌 397×243 #eef5fe (1193:8820), rounded-[23.441px], data-node-id 1193:8819 (2025-02-10) |
| **1425-10137** | 검차진행 매칭중 | `/inspections/:id/progress?stage=matching` | InspectionProgressPage | ✅ 249px 사이드바, 972×473 메인·400×160 패널, 스테퍼 | ✅ **반영 완료** (2025-02-10) |
| **1425-10813** | 검차진행 (검차자 이동중) | `/inspections/:id/progress?stage=en_route` | InspectionProgressPage | ✅ 972×473·400×160, 제목 "검차자 이동중 🛻" | ✅ **반영 완료** (2025-02-10) |
| **1425-10285** | 검차결과요약 (검차완료! 내역 확인) | `/inspections/:id/complete` | InspectionCompletePage | ✅ 2열 차량정보·전체 피드백, 검차자 카드, 세부 검차내역 | ✅ **반영 완료** — 1193-8120 제목/부제, 1425:10376 972×266(GNB_CARD_972_266), 1425:10378 400×160(GNB_PANEL_400_160), data-node-id 1425:10285·10325·10376·10378 (2025-02-10) |
| **1121-5308** | 검차자 매칭중 (Figma 디자인) | `/inspections/:id/progress?stage=matching` | InspectionProgressPage | ✅ 1121:5350 249px, 972×473 메인, 검차일정/검차장소 아이콘 | ✅ **반영 완료** (2025-02-10) |
| **1193-8343** | 검차자 이동중 (Figma 디자인) | `/inspections/:id/progress?stage=en_route` | InspectionProgressPage | ✅ 스테퍼 문구(검차자 매칭중·매칭 완료·검차중·검차완료), 사이드바 "검차 진행"+"진행 중...", 카드 제목 "검차자 이동중 🛻" | ✅ **반영 완료** (2025-02-10) |
| **1193-8120** | 검차완료! 내역을 확인하세요 | `/inspections/:id/complete` | InspectionCompletePage | ✅ 완료 뷰·차량/피드백/검차자 | ✅ **반영 완료** — h1 "검차완료!", 부제 "내역을 확인하세요" (2025-02-10) |
| **1193-9217** | 검차내역 (클릭 시 아래 스크롤) | `/inspections/:id/complete` | InspectionCompletePage | ✅ scrollToDetail, detailSectionRef | — |

---

## 2. 노드별 metadata 주요 수치 (SSOT)

- **1425:10227** (1425-10137) — 972×473 메인, 1425:10230 400×160 버튼
- **1425:10376** (1425-10285) — 972×266, 1425:10378 400×160
- **1037:5391** — 974×56 테이블 행 (검차요청내역)
- **1121:5350** — 249px 사이드바 (검차 진행)
- **1193:9066** — 972×243 차량 카드, **1193:7871** — 972×473 검차 카드

---

## 3. 권장 보완 순서 (디버깅 = 구현 대상)

1. **1193-8120 / 1425-10285** — InspectionCompletePage: 제목 **"검차완료!"**, 부제 **"내역을 확인하세요"** SSOT 반영(현재 "검차내역" → 변경).
2. **1425-10137 / 1425-10813 / 1121-5308 / 1193-8343** — InspectionProgressPage: 메인 **972×473**, 버튼 영역 **400×160**, design_context 제목·부제 문구.
3. **1037-5126 / 1037-5673 / 1042-4681** — InspectionListPage: 테이블 행 56px, rounded-xl·shadow, 카드뷰 좌우 레이아웃(1042).
4. **1033-4903** — InspectionRequestLandingPage/Step1: 제목·본문·버튼 라벨 design_context 문구.

---

## 4. 디버깅 플로우 (CTA_4와 동일)

1. **대상 nodeId 확정** — 위 표 "미반영·보완" 열.
2. **노드별 mcp_outputs 읽기** — metadata_raw.txt, design_context_raw.txt(또는 내부 경로) 전부 read.
3. **레이아웃·문구 추출** — (width, height), rounded, shadow, 제목/부제/버튼 텍스트 테이블화.
4. **해당 라우트·페이지 코드 수정** — SSOT 픽셀·문구 그대로 적용.
5. **구현 후 검증** — 항목별 대조, 갭 문서 "미반영" → "반영 완료" 갱신.

---

## 5. 이번 SSOT 반영 요약 (2025-02-10)

- **1193-8120 / 1425-10285** — InspectionCompletePage: h1 "검차완료!", 부제 "내역을 확인하세요" 반영 완료.
- **1425-10137 / 1425-10813** — InspectionProgressPage: 매칭·이동중 카드 **972×473** (rounded-[30px], shadow), 우측 **400×160** 패널(bg #f3f3f3, rounded-[20px], 날짜/장소 24px, "검차자 매칭중" 38px primary, "익명의 기사님"/"홍길동 기사님" + 연락처) 반영 완료.
- **1037-5126 / 1037-5673** — InspectionListPage: 리스트 테이블 max-w-[974px], 행 **974×56** (min-h-[56px], data-node-id 1037:5391), 확장 패널 1037:5673.
- **1042-4681** — InspectionListPage 카드뷰: 좌측 **397×243** #eef5fe (1193:8820), rounded-[23.441px], 카드 1193:8819.
- **1033-4903** — InspectionRequestStep1Page: 검차 차량 선택 블록(1193:6763)에 placeholder **"예) 12바 1234"**, 버튼 **"검색하기"** (1193:6755).

---

*문서 버전: 1.2 | 최종 업데이트: 2025-02-10*
