# 디자인 토큰·레이아웃 SSOT (nodeId 출처)

**목적**: 갭 해소 및 Figma 1:1 매핑 시 모든 픽셀·스타일 값의 출처를 명시.  
**참조**: `mcp_outputs/{nodeId}/metadata_raw.txt`, `design_context_raw.txt`

---

## 1. layout.ts (LAYOUT 수치)

| 상수 | 값 | nodeId 출처 |
|------|-----|-------------|
| SIDEBAR_WIDTH | 256 | w-64 기본 |
| GNB_SIDEBAR_WIDTH | 249 | 1714:22875, 1425:8154, 1714:22333 |
| GNB_MAIN_MAX | 972 | 1714:22920, 1714:22378, 1425:8237 |
| GNB_HEIGHT | 64 | GNB 헤더 |
| CONTAINER_MAX | 1440 | 루트 frame |
| DETAIL_PANEL_W | 320 | 1272:12927, 1123:13582, 1302:27096, 794:4201 |
| DETAIL_PANEL_H | 420 | 동일 |
| DETAIL_PANEL_ROW_H | 51 | 1272:12931, 1123:13585 |

---

## 2. layout.ts (LAYOUT_CLASSES)

| 클래스 | 용도 | nodeId 출처 |
|--------|------|-------------|
| GNB_SIDEBAR | !w-[249px] | 1714:22875, 1425:8154 |
| GNB_BADGE | 203×37, rounded 39px | 1425:8167, 1714:22345 |
| GNB_TITLE | text-[28px] leading-[44px] | 1714:22893, 1425:8210 |
| GNB_GRID | gap-x-15 gap-y-36 | 1425-8153, 1714 design_context |
| GNB_CARD_WRAPPER | min-h-291 max-w-314 | 1425:8239, 1714:22381 |
| GNB_CARD | rounded 23.441px shadow | design_context 공통 |
| GNB_CARD_PANEL_MIN_H | min-h-[473px] | 1193:7871, 1272:13152 |
| GNB_CARD_972_266 | 972×266 | 1425:10376 (1425-10285) |
| GNB_PANEL_400_160 | 400×160 | 1425:10378, 1425:10230 |
| DETAIL_PANEL | 320×420 rounded-[30px] shadow | 1272:12927 (1272-12926) |
| DETAIL_PANEL_ROW | h-[51px] border-b | 1272:12931, 1123:13585 |

---

## 3. design-tokens.css (갭 관련 변수)

| 변수 | 값 | nodeId 출처 |
|------|-----|-------------|
| --detail-panel-width | 320px | 1272:12927, 1123:13582, 1302:27096, 794:4201 |
| --detail-panel-height | 420px | 동일 |
| --row-height-detail | 51px | 1272:12931, 1123:13585 |
| --detail-panel-divider-width | 256.87px | 1272-12926 design_context Line 87 |
| --sidebar-width | 249px | 1425:8154, 1714:22333 |
| --shadow-figma-card | 2.344px 3.125px 11.017px | mcp_outputs 공통 DROP_SHADOW |
| --radius-card | 30px | 1272:12927, 1123:13582 등 |

---

## 4. 적용 페이지별 nodeId

| 페이지 | 주 nodeId | 참조 mcp_outputs |
|--------|-----------|------------------|
| InspectionCompletePage | 1425-10285 | 1425-10285 |
| GeneralSaleAnalyzingPage | 794-4015 | 794-4015 |
| AuctionStartPricePage | 1123-13580 | 1123-13580 |
| AuctionDurationPage | 1123-20023, 1123-13763 | 1123-20023, 1123-20699, 1123-13763 |
| AuctionCompletePage | 1123-13487 | 1123-13487 |
| TradeDetailPage | 1302-27093 | 1302-27093 |
| TradeListPage | 1714-22332 | 1714-22332 |
| LogisticsSchedulePage | 1272-12926, 1272-13099, 1272-14309 | 1272-12926, 1272-13099, 1272-14309 |
| GeneralSalePricePage | 794-4200 | 794-4200, 794-4371 |

---

*문서 버전: 1.0 | 최종 업데이트: 2025-02-10*
