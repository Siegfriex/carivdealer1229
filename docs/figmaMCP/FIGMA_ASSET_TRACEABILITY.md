# Figma 에셋 추적성

**목적**: MCP에서 가져온 이미지/SVG가 "어느 노드(페이지)에서 왔고, 어디에 import되는지" 추적.

**에셋 보관 위치**: `src/shared/figma_image/` (또는 프로젝트 규칙에 따른 경로). 실제 파일은 해당 폴더에 두고, 본 문서에는 **로컬 파일 경로**를 기입.

---

## Figma 에셋 URL 다운로드 불가

**Figma 에셋 URL**(`https://www.figma.com/api/mcp/asset/...`)은 **인증이 필요해** 스크립트/CI에서 직접 다운로드할 수 없습니다.  
실제 이미지 파일이 필요하면 **[Figma 이미지 다운로드 방법](FIGMA_IMAGE_DOWNLOAD.md)**(수동 Export 또는 REST API + `scripts/figma-download-images.mjs`)을 사용하세요.  
구현 시 다음 원칙을 따릅니다.

- **구분선**: Figma Line 에셋 대신 **CSS `border`** 로 구현.
- **상태 점**: Figma Ellipse 에셋 대신 **`rounded-full` + 색상** 으로 구현.
- **이미지 URL**: 코드에서 사용할 Figma 에셋 URL은 **상수 파일**에 두어, 나중에 CDN/Storage URL로 **교체 가능**하게 둠.
  - 예: `src/entities/vehicle/model/figma-assets.ts` (VehicleCard 1636-10115)

---

## 추적성 테이블

| 로컬 파일명 | 원본 nodeId (MCP 콜링 페이지) | 용도 | import 경로 (파일 또는 컴포넌트) |
|-------------|-------------------------------|------|----------------------------------|
| (예) icon_briefcase.svg | 1418:24679 (거래상세) | GNB/헤더 아이콘 | widgets/Header/ui/... |
| 1444-7928_탁송_cil-truck.png | 1444:7928 (로그인 전 랜딩) | GNB 탁송 아이콘 | widgets/Header/ui/LandingHeader.tsx (NAV_ITEMS 탁송 imgSrc) |
| 1444-7928_정산_coins-stacked-03.png | 1444:7928 (로그인 전 랜딩) | GNB 정산 아이콘 | widgets/Header/ui/LandingHeader.tsx (NAV_ITEMS 정산 imgSrc) |
| 1444-7928_검색_group.png | 1444:7928 (로그인 전 랜딩) | 헤더 검색 그룹 레이아웃 참조용 | 참조용 보관 (실제 사용: 검색_search) |
| 1444-7928_검색_search.png | 1444:7928 (로그인 전 랜딩) | 헤더 검색 버튼 아이콘 | widgets/Header/ui/LandingHeader.tsx (검색 버튼 \<img src={iconSearch} />) |
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
| 1425-8153_배지_briefcase.png | 1425:8153 (나의매물목록), 1714:22874 (GNB 탁송 탭) | 한국 수출차량 전문 플랫폼 배지 | pages/admin/VehicleListPage.tsx, pages/admin/logistics/LogisticsSchedulePage.tsx |
| 1425-8153_그리드_grid.png | 1425:8153 (나의매물목록) | 그리드 뷰 토글 아이콘 | pages/admin/VehicleListPage.tsx |
| 1425-8153_리스트_list.png | 1425:8153 (나의매물목록) | 리스트 뷰 토글 아이콘 | pages/admin/VehicleListPage.tsx |
| 1121-5308_검차일정_clock.png | 1121:5308 (검차자 매칭중) | 검차 일정 아이콘 | pages/admin/inspection/InspectionProgressPage.tsx |
| 1121-5308_검차장소_map.png | 1121:5308 (검차자 매칭중) | 검차 장소 아이콘 | pages/admin/inspection/InspectionProgressPage.tsx |

**1425-10813 design_context 에셋 (검차진행 완료·이동중)**  
| 1425-10813_imgIcon | 1425:10813 | imgIcon GNB file-search | design_context |
| 1425-10813_imgSearch | 1425:10813 | imgSearch 검색 아이콘 | design_context |
| 1425-10813_imgIcon1 | 1425:10813 | imgIcon1 GNB bar-chart | design_context |
| 1425-10813_imgCilTruck | 1425:10813 | imgCilTruck 탁송 아이콘 | design_context |
| 1425-10813_imgIcon2 | 1425:10813 | imgIcon2 GNB coins | design_context |
| 1425-10813_imgLine76 | 1425:10813 | imgLine76 GNB 구분선 | design_context (구현: border) |
| 1425-10813_imgStickMan1181741 | 1425:10813 | imgStickMan1181741 사용자 아바타 | design_context |
| 1425-10813_imgEllipse8398 | 1425:10813 | imgEllipse8398 기사 프로필 | design_context |
| 1425-10813_imgImage112 | 1425:10813 | imgImage112 차량 이미지 | design_context |
| 1425-10813_imgImage113 | 1425:10813 | imgImage113 차량 이미지 | design_context |
| 1425-10813_img202601061145265 | 1425:10813 | img202601061145265 차량 스크린샷 | design_context |
| 1425-10813_imgBriefcase | 1425:10813 | imgBriefcase 한국 수출차량 배지 | design_context |
| 1425-10813_imgGroup140 | 1425:10813 | imgGroup140 top bar | design_context |
| 1425-10813_imgGroup2085666007 | 1425:10813 | imgGroup2085666007 알림 아이콘 | design_context |
| 1425-10813_imgSearch1 | 1425:10813 | imgSearch1 검색 | design_context |
| 1425-10813_imgLine78 | 1425:10813 | imgLine78 사이드바 구분선 | design_context (구현: border) |
| 1425-10813_imgSearch2 | 1425:10813 | imgSearch2 사이드바 검색 | design_context |
| 1425-10813_imgGroup2085666051 | 1425:10813 | imgGroup2085666051 progress bar | design_context |
| 1425-10813_imgGroup2085666052 | 1425:10813 | imgGroup2085666052 progress bar | design_context |
| 1425-10813_imgGroup2085666053 | 1425:10813 | imgGroup2085666053 progress bar | design_context |
| 1425-10813_imgCheck | 1425:10813 | imgCheck 체크 아이콘 | design_context |
| 1425-10813_imgFrame2087328312 | 1425:10813 | imgFrame2087328312 진행중 ellipse | design_context |
| 1425-10813_imgEllipse48 | 1425:10813 | imgEllipse48 상태 점 | design_context (구현: rounded-full) |
| 1425-10813_imgLine83 | 1425:10813 | imgLine83 스테퍼 구분선 | design_context (구현: border) |
| 1425-10813_imgLine85 | 1425:10813 | imgLine85 스테퍼 구분선 | design_context (구현: border) |
| 1425-10813_imgCheck1 | 1425:10813 | imgCheck1 스테퍼 체크 | design_context |
| 1425-10813_imgEllipse56 | 1425:10813 | imgEllipse56 차량 카드 배경 | design_context |
| 1425-10813_imgEllipse45 | 1425:10813 | imgEllipse45 검차완료 뱃지 점 | design_context |
| 1425-10813_imgClock | 1425:10813 | imgClock 검차일정 | design_context |
| 1425-10813_imgMap | 1425:10813 | imgMap 검차장소 | design_context |
| 1425-10813_imgVector | 1425:10813 | imgVector 스크롤 화살표 | design_context |

**CTA_2 검차 에셋 (구현 대체, R002/R005)**  
| (로컬 파일 없음) | 1121:5308, 1193:8343, 1425:10137 | imgEllipse49 imgEllipse50 상태 점 | (구현: rounded-full) | InspectionProgressPage.tsx, InspectionScheduleBlock |
| (로컬 파일 없음) | 1193:9217, 1425:10285 | imgEllipse55 imgEllipse57 imgEllipse58 imgLine87 imgLine88 | (구현: border, rounded-full) | InspectionCompletePage.tsx |
| (로컬 파일 없음) | 1033:4903 | imgFCard imgImage116 imgImage117 imgImage118 imgImage119 imgImage120 imgImage121 imgImage122 imgFLink imgFSettings img1231 imgHelpCircle imgVector1 imgEllipse44 | (구현: rounded-full) | InspectionRequestStep1Page.tsx |
| (로컬 파일 없음) | 1037:5126, 1037:5673, 1042:4681 | imgFrame2087328289 imgFrame2087328290 imgVector1 imgVector2 imgVector3 imgVector4 imgVector5 imgThreeDots imgGrid imgList imgEllipse44 imgEllipse46 imgEllipse47 | 1444-7928/1425-8153 경로 사용 | InspectionListPage.tsx, MainLandingSidebar |

**CTA_3 거래 에셋 (구현 대체)**
| (로컬 파일 없음) | 794:4200, 794:4371, 1123:13580 | imgLine87 imgLine88 imgLine89 imgEllipse55 구분선·상태점 | (구현: border, rounded-full) | GeneralSalePricePage.tsx, AuctionStartPricePage.tsx |
| (로컬 파일 없음) | 794:4107, 1123:13487 | imgEllipse50 imgEllipse51 imgRShoppingmode 완료 아이콘 | (구현: Lucide 또는 rounded-full) | GeneralSaleCompletePage.tsx, AuctionCompletePage.tsx |
| (로컬 파일 없음) | 1714:22332 | imgBriefcase imgSearch imgIcon imgIcon1 imgCilTruck imgIcon3 GNB·사이드바 | 1425-8153 경로 사용 | TradeListPage.tsx, GnbListLayout |
| (로컬 파일 없음) | 1302:27093, 1302:27289, 794:4708, 1123:14112 | imgLine87 imgEllipse55 차량정보·피드백 | (구현: border, rounded-full) | TradeDetailPage.tsx |
| (로컬 파일 없음) | 794:3704 | imgLShoppingBag imgLWallet | (구현: Lucide ShoppingBag, Gavel) | GeneralSaleAnalyzingPage.tsx |
| (로컬 파일 없음) | 794:4015 | imgLMagicWand | (구현: Lucide Loader2) | GeneralSaleAnalyzingPage.tsx |
| (로컬 파일 없음) | 794:4542, 794:4708, 1123:13946, 1123:14112 | img20260118712051 imgChevronRight | (구현: border, Lucide ChevronDown/ChevronUp) | TradeDetailPage.tsx |
| (로컬 파일 없음) | 1123:20023 | imgEllipse4119 | (구현: rounded-full) | AuctionDurationPage.tsx |
| (로컬 파일 없음) | 1123:20699 | imgXCloseDelete | (구현: Lucide X 또는 border) | AuctionDurationPage.tsx |
| (로컬 파일 없음) | 1302:27093 | imgArrowRepeat imgAdjustHorizontalSettings | (구현: Lucide RefreshCw, Wallet) | TradeDetailPage.tsx |
| (로컬 파일 없음) | 1302:27289 | imgCircle imgSquare imgTriangle imgX imgLine86 | (구현: border, Lucide 아이콘) | TradeDetailPage.tsx (Modal) |
| (로컬 파일 없음) | 1714:22332 | imgLine80 imgEllipse52 | (구현: border, rounded-full) | TradeListPage.tsx, GnbListLayout |

**에셋 미사용(구현 대체)**  
| (로컬 파일 없음) | 1636:10115 (VehicleCard) | 구분선 → border, 상태 점 → rounded-full+색상. URL만 상수: `entities/vehicle/model/figma-assets.ts` | entities/vehicle/ui/VehicleCard.tsx |

**추가 시**: 위 컬럼 규칙으로 한 행씩 추가. 로컬 파일명은 `src/shared/figma_image/` 기준 상대 경로 또는 파일명만 기입.

---

## 네이밍 권장

- `{nodeId하이픈}_{용도}_{Figma에셋이름}.png` 또는 `icon_{용도}.svg`
- 여러 노드에서 공통 사용 시: `common_{용도}.svg` 등

---

*문서 버전: 1.0 | 최종 업데이트: 2025-02-10*
