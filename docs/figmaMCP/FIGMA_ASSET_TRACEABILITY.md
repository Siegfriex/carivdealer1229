# Figma 에셋 추적성

**목적**: MCP에서 가져온 이미지/SVG가 "어느 노드(페이지)에서 왔고, 어디에 import되는지" 추적.

**에셋 보관 위치**: `src/shared/figma_image/` (또는 프로젝트 규칙에 따른 경로). 실제 파일은 해당 폴더에 두고, 본 문서에는 **로컬 파일 경로**를 기입.

---

## 추적성 테이블

| 로컬 파일명 | 원본 nodeId (MCP 콜링 페이지) | 용도 | import 경로 (파일 또는 컴포넌트) |
|-------------|-------------------------------|------|----------------------------------|
| (예) icon_briefcase.svg | 1418:24679 (거래상세) | GNB/헤더 아이콘 | widgets/Header/ui/... |
| 1444-7928_탁송_cil-truck.png | 1444:7928 (로그인 전 랜딩) | GNB 탁송 아이콘 | widgets/Header/ui/LandingHeader.tsx |
| 1444-7928_정산_coins-stacked-03.png | 1444:7928 (로그인 전 랜딩) | GNB 정산 아이콘 | widgets/Header/ui/LandingHeader.tsx |
| 1444-7928_검색_group.png | 1444:7928 (로그인 전 랜딩) | 헤더 검색 영역 | (참조용 보관) |
| 1444-7928_검색_search.png | 1444:7928 (로그인 전 랜딩) | 헤더 검색 아이콘 | widgets/Header/ui/LandingHeader.tsx |
| 1368-37364_지금시작하기_chevron-right.png | 1368:37364 (로그인 후 랜딩) | Hero CTA 버튼 화살표 | pages/landing/LandingPage.tsx |
| 1368-37364_배지_briefcase.png | 1368:37364 (로그인 후 랜딩) | Hero 배지 아이콘 | pages/landing/LandingPage.tsx |
| 1368-37364_스텝1_L-Up-Arrow.png | 1368:37364 (로그인 후 랜딩) | 사용 가이드 STEP.1 아이콘 | pages/landing/LandingPage.tsx |
| 1368-37364_스텝2_L-Search.png | 1368:37364 (로그인 후 랜딩) | 사용 가이드 STEP.2 아이콘 | pages/landing/LandingPage.tsx |
| 1368-37364_스텝3_L-Newspaper.png | 1368:37364 (로그인 후 랜딩) | 사용 가이드 STEP.3 아이콘 | pages/landing/LandingPage.tsx |
| 1368-37364_스텝4_R-Shopping-Cart.png | 1368:37364 (로그인 후 랜딩) | 사용 가이드 STEP.4 아이콘 | pages/landing/LandingPage.tsx |
| 1368-37364_스텝5_L-Dollar-Coin.png | 1368:37364 (로그인 후 랜딩) | 사용 가이드 STEP.5 아이콘 | pages/landing/LandingPage.tsx |
| 1368-37364_FAQ_Question-Lg.png | 1368:37364 (로그인 후 랜딩) | FAQ 질문 아이콘 | pages/landing/LandingPage.tsx |
| 1368-37364_문의_image110.png | 1368:37364 (로그인 후 랜딩) | 문의하기 카카오 아이콘 | pages/landing/LandingPage.tsx |
| 1425-8153_검색_search.png | 1425:8153 (나의매물목록) | 사이드바 검색 아이콘 | widgets/MainLandingSidebar/ui/MainLandingSidebar.tsx |
| 1425-8153_배지_briefcase.png | 1425:8153 (나의매물목록), 1714:22874 (GNB 탁송 탭) | 한국 수출차량 전문 플랫폼 배지 | pages/admin/VehicleListPage.tsx, pages/admin/LogisticsSchedulePage.tsx |
| 1425-8153_그리드_grid.png | 1425:8153 (나의매물목록) | 그리드 뷰 토글 아이콘 | pages/admin/VehicleListPage.tsx |
| 1425-8153_리스트_list.png | 1425:8153 (나의매물목록) | 리스트 뷰 토글 아이콘 | pages/admin/VehicleListPage.tsx |
| 1121-5308_검차일정_clock.png | 1121:5308 (검차자 매칭중) | 검차 일정 아이콘 | pages/admin/inspection/InspectionProgressPage.tsx |
| 1121-5308_검차장소_map.png | 1121:5308 (검차자 매칭중) | 검차 장소 아이콘 | pages/admin/inspection/InspectionProgressPage.tsx |

**추가 시**: 위 컬럼 규칙으로 한 행씩 추가. 로컬 파일명은 `src/shared/figma_image/` 기준 상대 경로 또는 파일명만 기입.

---

## 네이밍 권장

- `{nodeId하이픈}_{용도}_{Figma에셋이름}.png` 또는 `icon_{용도}.svg`
- 여러 노드에서 공통 사용 시: `common_{용도}.svg` 등

---

*문서 버전: 1.0 | 최종 업데이트: 2025-02-10*
