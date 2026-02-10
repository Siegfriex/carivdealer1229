# CTA_3 거래 플로우 노드 — design_context·metadata 반영 갭 분석

**검증 기준**: 각 노드의 `mcp_outputs/{node}/metadata_raw.txt` 및 `design_context_raw.txt`에 명시된 레이아웃·문구·스타일을 구현에 반영했는지 여부. **미반영 항목 = 디버깅(구현) 대상.**

**데이터 소스**: NODE_TO_ROUTE_AND_FILE.md, mcp_outputs (CTA_3 관련 nodeId만).

---

## 1. CTA_3 노드 목록 (mcp_outputs 존재 노드)

| nodeId | 화면/역할 | 라우트 | 페이지 | 반영됨 | 미반영·보완 (디버깅 대상) |
|--------|-----------|--------|--------|--------|---------------------------|
| **794-3704** | 판매방식선택 | `/vehicles/:id/sale/analyzing` | GeneralSaleAnalyzingPage | ✅ 제목 "판매 방식 선택" 38px, 카드 297×280 rounded-[15px] shadow, "일반 판매"/"경매" 26px primary, 본문 SSOT 문구 | — |
| **794-4015** | 시세분석중 (일반/경매 공통) | `/vehicles/:id/sale/analyzing` | GeneralSaleAnalyzingPage | ✅ analyzing 단계·자동 이동, 794:4102 "홍길동님의 차량 시세를 분석 중입니다 ...", data-node-id 794:4015 | ✅ 반영 완료 (2025-02-10) |
| **794-4200** | 경매 시작가설정 보정 (일반) | `/vehicles/:id/sale/price` | GeneralSalePricePage | ✅ 좌측 **320×420** 차량정보 패널(794:4201), rounded-[30px] shadow, 행 51px, 라벨 0.4·값 0.8, 우측 폼 | — |
| **794-4371** | 경매 시작가설정 보정-1 (일반) | `/vehicles/:id/sale/price` | GeneralSalePricePage | (794-4200과 동일) | — |
| **794-4107** | 판매전환완료 (일반) | `/vehicles/:id/sale/complete` | GeneralSaleCompletePage | ✅ "판매 상태로 전환되었습니다", "구매제안이 오면 알람을 통해 알려드려요!" | ⚠️ GNB activeNav "offers", 배지 203×37·배경 #eef5fe 등 CTA_4와 동일 톤 선택 |
| **794-4708** | 거래상세 변형 (클릭 시 아래 펼침) | `/vehicles/:id/trade` | TradeDetailPage | ✅ 컨테이너 클릭 펼침, data-node-id 794:4708 | — |
| **794-4542** | 거래상세 경매 (펼쳐지는 뷰) | `/vehicles/:id/trade` | TradeDetailPage | ✅ detailExpanded 뷰, 794:4542 | — |
| **1302-27093** | 판매방식 변경·판매가 수정 컨테이너 | `/vehicles/:id/trade` | TradeDetailPage | ✅ 카드 2개 (판매방식 변경, 판매가 수정) | ⚠️ metadata 1302:27096 **320×420** 좌측 패널·행 51px·라벨 0.4·값 0.8 (거래상세 좌측 패널 동일 스펙일 수 있음) |
| **1302-27289** | 검차 상세내역 모달 | TradeDetailPage 모달 | TradeDetailPage | ✅ "세부 검차내역" 26px, 사진항목/영상항목 24px, 행 h-14 border #e6e6e6, 12px #707070 | — |
| **1123-13580** | 경매 시작가설정 (경매 방식) | `/vehicles/:id/auction/start-price` | AuctionStartPricePage | ✅ 시작가·즉시가 입력·다음, 좌측 320×420 LAYOUT_CLASSES.DETAIL_PANEL, data-node-id 1123:13580·13582 | ✅ 반영 완료 (2025-02-10) |
| **1123-20023** | 경매시작가 값입력·연월일시 | `/vehicles/:id/auction/duration` | AuctionDurationPage | ✅ 종료일·종료시간 입력 | ⚠️ 디자인: 연월일시 플로우·문구·레이아웃 SSOT |
| **1123-20699** | 경매 연월일시 입력 | `/vehicles/:id/auction/duration` | AuctionDurationPage | (1123-20023과 동일) | 동일 |
| **1123-13763** | 경매 모두 입력 완료 화면 | `/vehicles/:id/auction/duration` | AuctionDurationPage | (제출 전 확인 뷰) | ⚠️ "모두 입력 완료" 문구·확인 UI |
| **1123-13487** | 판매전환완료 (경매) | `/vehicles/:id/auction/complete` | AuctionCompletePage | ✅ "경매가 등록되었습니다" 등 | ⚠️ design_context 문구·버튼 라벨 SSOT |
| **1123-14112** | 거래상세 경매-1 (클릭 시 아래 펼침) | `/vehicles/:id/trade` | TradeDetailPage | (794-4708과 동일 구조) | — |
| **1123-13946** | 거래상세 경매 펼쳐지는 뷰 | `/vehicles/:id/trade` | TradeDetailPage | (794-4542와 동일) | — |
| **1714-22332** | GNB 거래 탭 리스팅 | `/offers` | TradeListPage | ✅ 라우트·페이지 존재 | ⚠️ 리스트 레이아웃 970px·페이지네이션·카드 스펙(249px 사이드바 등) mcp_outputs 기준 반영 |

---

## 2. 노드별 metadata 주요 수치 (SSOT)

- **794:3705** — 971.707×712.93 (판매방식 선택 메인)
- **794:3711** — 카드 297.377×279.73, rounded 15px, shadow 6.019px 7.738px 21.84px
- **794:4201** (794-4200) — 좌측 패널 320×420, rounded 30px, shadow 2.344px 3.125px 11.017px. 행 51px, 구분선 256.87px
- **1302:27096** (1302-27093) — 320×420 (동일 스펙)
- **1302:27289** — 모달 rounded 30px, 제목 26px, 섹션 24px, 행 56px, border #e6e6e6

---

## 3. 권장 보완 순서 (디버깅 = 구현 대상)

1. ~~**794-3704** — GeneralSaleAnalyzingPage~~ ✅ 이미 반영됨 (문서 1.0 기준 확인).
2. ~~**794-4200 / 794-4371** — GeneralSalePricePage~~ ✅ 반영 완료 (2025-02-10).
3. **1123-13580** — AuctionStartPricePage: 좌측 320×420 차량정보 패널 동일 스펙 반영.
4. **794-4015** — GeneralSaleAnalyzingPage 시세분석중: "시세 분석 중" 등 design_context 문구·로딩 UI.
5. **1123-20023 / 1123-20699 / 1123-13763** — AuctionDurationPage: 연월일시·완료 확인 문구 SSOT.
6. **1123-13487** — AuctionCompletePage: design_context 문구·버튼 라벨.
7. **1714-22332** — TradeListPage: 970px·카드·페이지네이션 레이아웃 (1714-22874 탁송과 유사 패턴).

---

## 4. 디버깅 플로우 (CTA_4와 동일)

1. **대상 nodeId 확정** — 위 표의 "미반영·보완" 열 노드.
2. **노드별 mcp_outputs 읽기** — `metadata_raw.txt`, `design_context_raw.txt` 전부 read (경로 참조 시 해당 파일 open).
3. **레이아웃 스펙 추출** — (x, y, width, height), rounded, shadow, 문구 테이블화.
4. **해당 라우트·페이지 코드 수정** — SSOT 픽셀·문구 그대로 적용.
5. **구현 후 검증** — 항목별 대조, 갭 문서 "미반영" → "반영 완료" 갱신.

---

## 5. 이번 SSOT 반영 요약 (2025-02-10)

- **갭 문서 생성**: CTA_3 노드 전수 대조 후 미반영 항목 = 디버깅 대상으로 표기.
- **반영 완료**: 794-3704(이미 반영 확인), 794-4200/794-4371(GeneralSalePricePage 좌측 320×420 차량정보 패널 추가).
- **반영 위치**: `src/pages/admin/sale/GeneralSalePricePage.tsx` (useVehicle, 794:4201 패널, 행 51px·라벨 0.4·값 0.8).
- **다음 권장**: 1123-13580 AuctionStartPricePage 좌측 320×420 패널, 794-4015 시세분석중 문구, 1714-22332 TradeListPage 레이아웃.

---

*문서 버전: 1.1 | 최종 업데이트: 2025-02-10*
