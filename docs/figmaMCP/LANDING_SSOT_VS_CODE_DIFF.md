# 랜딩페이지 SSOT vs 코드베이스 차이 (1444-7928)

**목적**: Figma SSOT(mcp_outputs/1444-7928/design_context_raw.txt, metadata_raw.txt)와 현재 구현된 로그인 전 랜딩 페이지의 차이를 모두 식별.

**기준**
- SSOT: `docs/figmaMCP/mcp_outputs/1444-7928/design_context_raw.txt`, `metadata_raw.txt`
- 코드: `LandingPage.tsx`, `LandingHeroUnauth`, `LandingHeader`, `layout.ts` 등

---

## 1. Hero (1444:7929)

| 구분 | SSOT (Figma) | 코드베이스 | 차이 |
|------|----------------|------------|------|
| **배지 아이콘** | `imgBriefcase` 이미지 (18×18) | Lucide `Briefcase` 아이콘 | SSOT는 Figma 에셋, 코드는 아이콘만 사용. 1444-7928용 briefcase 에셋 미다운로드/미연동. |
| **Hero 우측 비주얼** | Mac Studio 이미지 653×490 (1444:7930, left 686, top 211) | 없음 | SSOT에는 우측에 Mac Studio 목업 이미지 존재. 코드에는 해당 영역/이미지 없음. |
| **타이틀 1행** | "현명한 중고자동차 거래를 위한" | 동일 | 일치 |
| **타이틀 2행** | "Cariv " (공백 포함 가능) | "Cariv" | 미세(공백) |
| **서브타이틀** | "for Domestic Sellers" 22px, left 390 top 222 | 동일 문구, font-medium text-[22px] | 일치 |
| **본문** | "차량 수출을**더** 쉽게, 더 빠르게 ForwardMax와…" (띄어쓰기 없음 '수출을더') | "차량 수출을 **더** 쉽게, 더 빠르게…" (띄어쓰기 있음) | SSOT는 오타(수출을더), 코드는 올바른 띄어쓰기. 코드가 문구적으로 올바름. |
| **이메일 입력** | 389×47, rounded-[39px], bg #f2f2f2, border #909090 0.3px, placeholder "이메일 주소 입력" | max-w-[389px] h-[47px] rounded-[39px], placeholder 동일 | border 두께 0.3px → 코드는 border만 지정(1px 등가 가능). 일치에 가깝음. |
| **회원가입 버튼** | 149.7×40.3, rounded-[43.297px], "회원가입 하기" + chevron-right 15px | Button + "회원가입 하기" + ChevronRight 15px | 일치 |
| **배지 문구** | "한국 수출차량 전문 플랫폼" | 동일 | 일치 |
| **배지 스타일** | 203×37, #eef5fe, border #d9e7fc, rounded-[39px] | LAYOUT_CLASSES.GNB_BADGE (동일 수치) | 일치 |

---

## 2. Section 2 (1444:7949) — "언제 어디서든 빠르고 간편하게"

| 구분 | SSOT (Figma) | 코드베이스 | 차이 |
|------|----------------|------------|------|
| **레이아웃** | 텍스트·버튼이 **오른쪽** (left 716~1265, -translate-x-full), 본문 492px 폭 | 콘텐츠가 **왼쪽** 시작, `md:text-right`로 텍스트만 오른쪽 정렬, `md:ml-auto`로 버튼 오른쪽 | SSOT는 블록 전체가 오른쪽에 위치; 코드는 flex로 왼쪽 정렬 후 텍스트/버튼만 오른쪽. 시각적으로 유사할 수 있으나 좌표 기준으로는 다름. |
| **시각 에셋** | MacBook Air (15 inch) 이미지 1099×825 (1444:7957, left -139, top -44) | 없음 | SSOT에는 대형 랩톱 목업 이미지 존재. 코드에는 해당 이미지/영역 없음. |
| **제목** | "언제 어디서든 빠르고 간편하게." 45px, leading 61px | 동일 | 일치 |
| **본문** | "판매를 희망하는 차량을 등록하고, 거래해보세요. 경매진행부터 " / "정산 대기까지의 과정을 실시간으로 확인하고, 빠르게 확인할 수 있습니다" (줄바꿈) | 한 문단으로 "판매를 희망하는 차량을 등록하고, 거래해보세요. 경매진행부터 정산 대기까지의 과정을 실시간으로 확인하고, 빠르게 확인할 수 있습니다." | 문구 동일. SSOT는 줄끊김 있음, 코드는 한 줄. |
| **버튼** | "차량 업로드하기" 173×40, rounded-[39px], chevron-right | Button size lg, "차량 업로드하기", rounded-[39px], ChevronRight | 일치 |
| **섹션 높이** | 555px | LANDING_SECTION2_MIN_H (min-h-[555px]) | 일치 |

---

## 3. Section 3 (1444:7958) — "간소화된 인증과정"

| 구분 | SSOT (Figma) | 코드베이스 | 차이 |
|------|----------------|------------|------|
| **시각 에셋** | 이미지 3개: "11 1" (1444:7959) 607×442, "image 15" (1444:7963) 474×383, "image 12" (1444:7964) 475×306 | 없음 | SSOT에는 인증/UI 목업 이미지 3개 존재. 코드에는 이미지 없음. |
| **제목** | "간소화된 인증과정" 45px, leading 61px, max-w 322px | 동일 + LANDING_SECTION3_TITLE_MAX_W | 일치 |
| **본문** | "기존의 복잡한 행정처리와 발품팔이를 스킵하고, 빠른 정보등록과 OCR스캔을 통해…" 506px 폭 | 동일 + LANDING_SECTION3_BODY_MAX_W (max-w-[506px]) | 일치 |
| **섹션 높이** | 673px | LANDING_SECTION3_MIN_H (min-h-[673px]) | 일치 |

---

## 4. Footer (1444:7965)

| 구분 | SSOT (Figma) | 코드베이스 | 차이 |
|------|----------------|------------|------|
| **배경색** | bg-[#f3f4f6] (gray-100) | bg-gray-50 | SSOT #f3f4f6(gray-100), 코드 gray-50(#f9fafb). 색상 불일치. |
| **텍스트** | "ForwardMax Cariv Domestic Seller 1.0 Prototype " (trailing space 가능) | "ForwardMax Cariv Domestic Seller 1.0 Prototype" | 미세(trailing space). |
| **위치** | left 171px, top 108px | LANDING_FOOTER_INNER md:pl-[171px] md:pt-[108px] | 일치 |
| **높이** | 327px | LANDING_FOOTER_MIN_H (min-h-[327px]) | 일치 |

---

## 5. Header / Top bar (1444:7967)

| 구분 | SSOT (Figma) | 코드베이스 | 차이 |
|------|----------------|------------|------|
| **헤더 전체 높이** | 155px (단일 top bar) | 1단 h-14(56px) + 2단 h-12(48px) = 104px | SSOT 155px vs 코드 104px. 높이 불일치. |
| **로고** | Group 140 **이미지** (254.76×13.67) | 텍스트 "FORWARDMAX" (span) | SSOT는 로고 이미지, 코드는 텍스트. 에셋 미사용. |
| **GNB 항목 수** | 4개: 차량목록, 거래, 탁송, 정산 | 5개: 차량목록, **검차**, 거래, 탁송, 정산 | SSOT(1444-7928)에는 "검차" 탭 없음. 코드는 검차 추가. |
| **로그인/회원가입** | stick-man 아이콘 + "로그인/회원가입" 14px, border rounded-[100px], 149×30 | 텍스트 "로그인/회원가입"만, 아이콘 없음 | SSOT는 아이콘+pill 형태; 코드는 버튼 텍스트만. |
| **매물 등록하기 (비로그인)** | "매물 **등록하기**" (띄어쓰기), clipboard-plus 아이콘, 149.7×40.3 | "**매물등록하기**" (붙여쓰기), 아이콘 없음 (랜딩 variant) | SSOT 띄어쓰기 + 아이콘; 코드 붙여쓰기 + 아이콘 없음. |
| **매물 등록하기 (로그인 후)** | — | "매물 등록하기" + Car 아이콘 | 로그인 후만 띄어쓰기/아이콘 적용. |
| **검색 아이콘** | Figma 에셋 (imgSearch) | 1444-7928_검색_search.png 사용 | 일치 (FIGMA_ASSET_TRACEABILITY 반영) |
| **탁송/정산 아이콘** | Figma 에셋 (cil-truck, coins-stacked-03) | 1444-7928_탁송, _정산 이미지 사용 | 일치 |

---

## 6. 비로그인 전용 추가 섹션 (코드에만 존재)

| 구분 | SSOT (1444-7928) | 코드베이스 | 비고 |
|------|-------------------|------------|------|
| **사용 가이드** | 1444-7928 design_context에 없음 | LandingUserGuide (withImages=false → 아이콘만) | SSOT에는 해당 블록 없음. 1368-37364(로그인 후) 노드에 해당. |
| **FAQ** | 1444-7928 design_context에 없음 | LandingFaq (withImage=false) | 동일. |
| **문의** | 1444-7928 design_context에 없음 | LandingInquiry (withImage=false) | 동일. |

→ 비로그인 시에도 사용 가이드/FAQ/문의를 노출하는지는 기획 선택. SSOT(1444-7928)만 보면 Hero → Section2 → Section3 → Footer까지만 정의됨.

---

## 7. 요약 — 수정 시 참고용 체크리스트

### SSOT에 맞추려면 보완할 항목

1. **Hero**
   - [ ] 1444-7928용 배지 briefcase 이미지 다운로드 후 Hero 배지에 img 연동 (또는 SSOT가 Lucide 허용이면 유지).
   - [ ] Hero 우측 Mac Studio 이미지(1444:7930) 영역 추가 또는 placeholder. (에셋 URL은 design_context 상 imgMacStudio 미정의·외부 참조 가능성.)

2. **Section 2**
   - [ ] MacBook Air (15 inch)(1444:7957) 이미지 추가 또는 placeholder.
   - [ ] SSOT처럼 텍스트/버튼 블록을 오른쪽에 배치하는 레이아웃으로 조정 (선택).

3. **Section 3**
   - [ ] 이미지 3개(1444:7959, 7963, 7964) 추가 또는 placeholder. (에셋 URL design_context에 img111, imgImage15, imgImage12 등.)

4. **Footer**
   - [ ] 배경을 #f3f4f6(gray-100)으로 통일.

5. **Header**
   - [ ] top bar 높이 155px에 맞춤 (또는 2단 합산 155px).
   - [ ] 로고를 Group 140 이미지로 교체 또는 텍스트 유지(기획 확인).
   - [ ] 로그인/회원가입: stick-man 아이콘 + pill 스타일(149×30, rounded-[100px]) 반영.
   - [ ] 비로그인 시 "매물 등록하기" 띄어쓰기 + clipboard-plus 아이콘 반영.

### 코드가 SSOT와 다르게 의도된 부분 (확인 필요)

- **GNB "검차" 탭**: SSOT(1444-7928)에는 4탭만 있음. 검차는 IA/기획상 추가일 수 있음 → 유지 시 문서에 명시.
- **본문 띄어쓰기**: "차량 수출을 더 쉽게" — 코드가 맞음, SSOT "수출을더"는 오타로 간주하고 코드 유지.
- **비로그인 시 사용 가이드/FAQ/문의**: 1444-7928에는 없음. 1368-37364 등 다른 노드 기준이면 현재 구현 유지.

---

*문서 버전: 1.0 | 최종 업데이트: 2025-02-10 | SSOT: mcp_outputs/1444-7928*
