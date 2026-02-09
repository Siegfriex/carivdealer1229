# 다음 에이전트 핸드오프

**작성일**: 2025-02-09  
**목적**: 다음 에이전트가 이어서 작업할 때 필요한 맥락·결정사항·미완 작업 요약.

---

## 1. 오늘 세션에서 한 일 (요약)

- **LandingHeader 구문/런타임 수정**: 잘못된 `</>` 제거, `Search` 아이콘 import 추가 → 빌드·랜딩 정상.
- **유저 드롭다운**: `<a href>` → `<Link to>` 로 변경해 SPA 이동(전체 새로고침 방지).  
  - 첫 메뉴를 **「대시보드」→「차량 목록」**으로 변경, `/vehicles` 연결.  
  - **마이페이지** 진입 추가 → `/mypage` (내부 리다이렉트: `/mypage/settlement-account`).
- **로그인/회원가입 후 진입점**: 기본 리다이렉트를 **`/dashboard` → `/vehicles`** 로 통일.  
  - `LoginPage`, `SignupCompletePage`, 라우터 `*` 폴백 모두 `/vehicles`.
- **마이페이지 레이아웃**: `SettlementAccountPage`를 차량목록/대시보드와 동일 구조(Container → flex → 사이드바 + main + 푸터)로 정렬.
- **탁송 완료 화면**: "대시보드로" 버튼 → **「차량 목록으로」** + `navigate('/vehicles')`.
- **사이트맵 대비 구현 현황 문서**: `docs/SITEMAP_IMPLEMENTATION_STATUS.md` 작성 (플로우별 구현/미구현 매핑).

---

## 2. 반드시 알아둘 결정사항

| 항목 | 결정 내용 |
|------|-----------|
| **메인 진입점** | 로그인·회원가입 후·404 폴백 모두 **차량 목록(`/vehicles`)**. `/dashboard` 라우트는 유지하되 기본 진입은 아님. |
| **GNB 유저 메뉴** | 순서: **차량 목록** → **마이페이지** → **로그아웃**. 모두 React Router `Link` 사용. |
| **마이페이지** | 진입 URL은 `/mypage` → 내부에서 `/mypage/settlement-account`로 리다이렉트. 현재 구현은 **정산 계좌** 페이지만. |

---

## 3. 현재 상태 & 알려진 갭

- **사이트맵 대비**: 랜딩·GNB 5탭·회원가입·매물등록 CTA_1~3·CTA_5는 라우트/페이지 구현됨.  
  - **CTA_4(탁송)**: 예약 폼·완료 있음. **주소검색 모달(우편번호 찾기)·연/월/일 캘린더 UI**는 Figma 명세 대비 단순화/미구현.  
  - **마이페이지**: **정산 계좌**만 구현. 내프로필 랜딩·기본정보수정·딜러승인·알림설정·알림센터·고객지원 등은 미구현(사이드바 "준비 중").
- **상세 매핑**: `docs/SITEMAP_IMPLEMENTATION_STATUS.md` 참고.

---

## 4. 다음 에이전트가 보면 좋은 문서·파일

| 용도 | 경로 |
|------|------|
| 프로젝트 컨텍스트 | `CLAUDE.md` (루트) |
| 사이트맵 대비 구현 현황 | `docs/SITEMAP_IMPLEMENTATION_STATUS.md` |
| IA/사이트맵 명세 | `docs/figma/IA_SITEMAP_SPEC_IPOE.md` |
| API·ERD | `docs/CarivDealer_api_v1.md`, `docs/CarivDealer_API_ERD_Mapping.md` |
| 라우트 정의 | `src/app/router.tsx` |
| GNB·유저 메뉴 | `src/widgets/Header/ui/LandingHeader.tsx` |
| 인증·보호 라우트 | `src/shared/context/AuthContext.tsx` |
| 마이페이지 레이아웃 | `src/pages/admin/mypage/SettlementAccountPage.tsx`, `src/widgets/MypageSidebar/` |

---

## 5. 제안 다음 작업 (우선순위 예시)

1. **탁송 CTA_4**: 주소검색 모달(우편번호 찾기·결과) 및 연/월/일·시간 선택 UI Figma 명세 반영.  
   - 참고: `functions/src/address/` (listAddresses, createAddress 등) 이미 있음.
2. **마이페이지 확장**: 내프로필 랜딩(§3.8 1418-36766), 기본정보수정·딜러승인·알림 등 사이드바 메뉴별 라우트·페이지 추가.
3. **회원가입 유도 화면**: 비로그인 GNB 탭 클릭 시 현재는 `/signup?redirect=...`로만 유도. 사이트맵의 「나의매물목록_회원가입유도」 전용 뷰가 필요하면 별도 라우트/페이지 검토.

---

## 6. 빌드·실행

```bash
npm run dev      # 프론트 개발 서버
npm run build    # 프로덕션 빌드
```

인증은 `localStorage` 키 `carivdealer_auth` 로 가드. (추후 Firebase Auth 등으로 교체 예정.)

---

**이 문서는 다음 에이전트가 `docs/HANDOFF_NEXT_AGENT.md` 또는 `HANDOFF` 로 검색해 바로 읽을 수 있도록 작성됨.**
