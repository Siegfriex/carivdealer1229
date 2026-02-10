# GNB 직속 탭 공통 레이아웃 스펙

**출처**: mcp_outputs 1714-22874, 1425-8153, 1714-22332 metadata_raw.txt  
**적용 대상**: VehicleListPage, InspectionListPage, TradeListPage, LogisticsSchedulePage (목록 뷰).  
각 페이지는 **이 스펙 + 해당 노드 mcp_outputs**를 따름.

---

## 1. 공통 수치 (테이블)

| 항목 | 값 | nodeId 출처 | Tailwind/CSS |
|------|-----|-------------|--------------|
| 캔버스 기준 | 1440px | 루트 frame | max-w-[1440px] mx-auto |
| top bar | 1440×155 | 1425:8173, 1714 등 | h-[155px] (또는 Header 컴포넌트) |
| 사이드바 | **249**×1260 | 1714:22875, 1425:8154, 1714:22333 | `!w-[249px]` |
| 배지 | 260,106 **203×37** | 1714:22887, 1425:8167, 1714:22345 | w-[203px] h-[37px] |
| 배지 스타일 | rounded 39px, #eef5fe, border #d9e7fc | design_context | rounded-[39px] bg-[#eef5fe] border-[#d9e7fc] |
| 제목 | 295,207 근처, 104×44 또는 159×44 | 1714:22893, 1425:8210, 1714:22351 | text-[28px] leading-[44px] |
| 메인 콘텐츠 영역 | **972**×1271 | 1714:22920, 1714:22378, 1425 그리드 | max-w-[972px] |
| 그리드 gap | column 15, row 36 | 1714 design_context | gap-x-[15px] gap-y-[36px] |
| 카드(리스트) | **314×291** | 1714:22923, 1714:22381 | max-w-[314px] h-[291px] |
| 카드 rounded | 23.441px | design_context | rounded-[23.441px] |
| 카드 shadow | 2.34px 3.13px 11.02px rgba(0,0,0,0.05) | design_context | shadow-[2.34px_3.13px_11.02px_rgba(0,0,0,0.05)] |
| 카드 이미지 영역 | 318×174 | 1714:22924 | h-[174px] bg-[#eef5fe] |
| 페이지네이션 | 296,1301 **970×114** | 1714:22894, 1425:8211, 1714:22352 | w-full max-w-[970px] (또는 972 내부) |
| 푸터 | 0,1415 1440×327 | 1425:8165, 1714:22343 | — |

---

## 2. 적용 페이지별 참조 노드

| 페이지 | nodeId | 비고 |
|--------|--------|------|
| VehicleListPage | 1425-8153 | 차량목록·탭·그리드 |
| InspectionListPage | 1037-5126, 1037-5673, 1042-4681 | 검차요청내역 3상태 |
| TradeListPage | 1714-22332 | GNB 거래 탭 리스팅 |
| LogisticsSchedulePage | 1714-22874 | GNB 탁송 탭 목록 뷰 |

---

## 3. 구현 시 준수 사항

- **사이드바**: GnbMinimalSidebar에 `className="!w-[249px]"` 전달 (layout.ts SIDEBAR는 256px이므로 페이지별 오버라이드).
- **메인**: `max-w-7xl`(1280px) 대신 **max-w-[972px]** 사용.
- **그리드**: gap은 **gap-x-[15px] gap-y-[36px]**.
- **배지**: 203×37, rounded-[39px], #eef5fe.
- **제목**: 28px, line-height 44px.
- 상세 픽셀·타이포는 **해당 노드 mcp_outputs** metadata_raw.txt·design_context_raw.txt에서 추출해 적용.

---

*문서 버전: 1.0 | 최종 업데이트: 2025-02-10*
