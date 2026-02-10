# 이미지 전수조사 — 빠진 이미지 리스트

**조사 기준**: 코드베이스 전체 (src, docs, FIGMASCR0208, design, erd)  
**조사 시점**: 2025-02-10  
**검증 방법**: grep(import/figma_image/이미지 경로), list_dir(실제 폴더), FIGMA_ASSET_TRACEABILITY·IA_SITEMAP_SPEC_IPOE 참조 경로 대조.

---

## 1. 런타임 이미지 (src에서 import·사용)

### 1.1 `src/shared/figma_image/` import 현황

| import 경로 | 사용처 | 파일 존재 |
|-------------|--------|-----------|
| 1425-8153_배지_briefcase.png | GnbListLayout.tsx | ✅ |
| 1368-37364_문의_image110.png | LandingInquiry, LandingHero | ✅ |
| 1368-37364_FAQ_Question-Lg.png | LandingFaq, LandingHero | ✅ |
| 1368-37364_지금시작하기_chevron-right.png | LandingHero, LandingHeroAuth | ✅ |
| 1368-37364_배지_briefcase.png | LandingHero, LandingHeroAuth | ✅ |
| 1368-37364_스텝1~5_L-*.png | LandingHero, LandingUserGuide | ✅ |
| 1121-5308_검차일정_clock.png | InspectionScheduleBlock | ✅ |
| 1121-5308_검차장소_map.png | InspectionScheduleBlock | ✅ |
| 1425-8153_그리드_grid.png | ViewModeToggle | ✅ |
| 1425-8153_리스트_list.png | ViewModeToggle | ✅ |
| 1444-7928_검색_search.png | LandingHeader | ✅ |
| 1444-7928_탁송_cil-truck.png | LandingHeader | ✅ |
| 1444-7928_정산_coins-stacked-03.png | LandingHeader | ✅ |
| 1425-8153_검색_search.png | MainLandingSidebar | ✅ |

**결론**: **런타임에서 import하는 figma_image 파일은 모두 존재함. 빠진 런타임 이미지 0건.**

---

## 2. 문서·참조용 이미지

### 2.1 FIGMASCR0208 (docs/figma/IA_SITEMAP_SPEC_IPOE.md 링크)

- 01_랜딩페이지, 02_회원가입_이전_GNB, 03_GNB_차량목록_탭, 04_GNB_검차_탭, 08_회원가입, 09_매물등록_CTA_1_차량원부등록, 10_매물등록_CTA_2_검차, 11_매물등록_CTA_3_거래, 12_매물등록_CTA_4_탁송, 13_매물등록_CTA_5_정산, 14_마이페이지 — IA에 나온 PNG 경로대로 **해당 폴더에 파일 존재** 확인.
- **빠진 FIGMASCR0208 PNG: 0건** (조사한 범위 내).

### 2.2 design/design_component (주석 참조만)

- src 내 주석: `디자인: design/design_component/검차단계 프로그래스바.svg`, `리스트 카드.svg`, `체크박스.svg`, `상태창.svg`, `이전 다음 페이지 전환.svg`, `GNB(상단 네비게이션 메뉴).svg`, `좌측 프로그래스바.svg`, `차량 사진.svg` 등.
- 실제 폴더: `design/design_component/` 아래 해당 SVG 존재.  
- **단, Pagination.tsx 등 주석의 "이전 다음 페이지 전환.svg"** 는 실제 경로가 `design/design_component/이전/다음 페이지 전환.svg` (하위 폴더 `이전`). 코드에서 import 하지 않으므로 런타임 누락 아님. **문서/주석 경로만 실제 구조와 다름.**

### 2.3 erd/ (주석 참조만)

- entities 등 주석: `원본 ERD: erd/IMG_3923.png`
- **파일 존재**: `erd/IMG_3923.png` ✅

---

## 3. Figma 에셋 추적성 문서 기준

- **FIGMA_ASSET_TRACEABILITY.md** 추적성 테이블: 로컬 파일명·nodeId·용도·import 경로 기입. 테이블 첫 행 "(예) icon_briefcase.svg | 1418:24679" 는 **예시**이며, 1418-24679용 아이콘을 코드에서 import하는 곳은 없음 (LandingHeader는 1444-7928 노드 아이콘 사용).
- **에셋 미사용(구현 대체)**: 1636-10115 VehicleCard — 구분선/상태점은 border·rounded-full로 구현, 이미지 파일 없음. 의도된 설계.

---

## 4. 요약: “빠진” 이미지 리스트

| 구분 | 빠진 이미지 | 비고 |
|------|-------------|------|
| **런타임 (src import)** | **없음** | figma_image 18개 파일 모두 존재 |
| **FIGMASCR0208 (문서 링크)** | **없음** | IA_SITEMAP에서 참조한 PNG 존재 확인 |
| **design/design_component** | **없음** | 주석 참조만, SVG 존재. 경로만 `이전/다음 페이지 전환.svg` 등 실제 구조와 일부 상이 |
| **erd/** | **없음** | IMG_3923.png 존재 |

**최종**: 코드베이스 전수조사 결과 **실제로 누락된 런타임/문서 참조 이미지는 없음.**  
선택 보완: 주석의 `design/design_component/이전 다음 페이지 전환.svg` 를 실제 경로 `design/design_component/이전/다음 페이지 전환.svg` 로 정정하면 문서·폴더 구조와 일치함.

---

*문서 버전: 1.0 | 최종 업데이트: 2025-02-10*
