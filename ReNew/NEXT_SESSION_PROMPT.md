# 다음 세션 에이전트용 최종 프롬프트

아래 블록을 **그대로 복사**해 다음 세션 첫 메시지로 붙여 넣으면 됩니다.

---

```
이 프로젝트는 중고차 딜러 플랫폼(React + Vite + Firebase)입니다.

**현재 상태**
- Admin GNB는 LandingHeader로 통일 완료(커스텀 header 0건).
- Admin 전체 레이아웃은 아직 통일되지 않음: 1440px 래퍼는 일부 페이지만, 메인 max-width·사이드바·design-tokens는 페이지마다 상이합니다.

**이번 세션 목표: Admin 레이아웃 통일**
1. 시작 전 반드시 다음 문서를 읽고 진행하세요.
   - `ReNew/NEXT_AGENT_HANDOFF_FINAL.md` — 인수인계·체크리스트
   - `ReNew/ADMIN_LAYOUT_ISSUES.md` — **작업 명세**(대상 파일 27개, 검증 방법, 선행 작업 옵션, max-width 규칙, 사이드바·design-tokens·리스크·완료 기준)
2. Admin 페이지 전체(27개, Auth 제외)에 1440px 래퍼를 적용하세요.
   - 선행으로 `ADMIN_LAYOUT_ISSUES.md` §6에 따라 **옵션 A(AdminLayout 도입)** 또는 **옵션 B(페이지별 LAYOUT_CLASSES)** 중 하나를 선택하고, 문서에 선택 결과를 한 줄 남기세요.
   - 메인 max-width는 `src/shared/config/layout.ts`의 규칙(목록=MAIN_LIST, 상세/스텝=MAIN_DETAIL)과 `ADMIN_LAYOUT_ISSUES.md` §7을 따르세요.
3. 작업 후 다음으로 검증하세요.
   - 1440px: 뷰포트 1920px에서 콘텐츠가 1440px 안에서만 보이는지 확인.
   - GNB: `rg "<header" src/pages/admin --glob "*.tsx"` → 0건 유지.
   - `ADMIN_LAYOUT_ISSUES.md` §11 완료 기준 체크리스트를 채우고, 미완료 항목이 있으면 문서에 남겨 두세요.
4. FSD 규칙을 지키세요. 레거시 import(`@/components`, `@/config`, `@/services`, `@/utils`) 사용 금지. `ReNew/AGENT_GUIDE.md`, `docs/FSD_ENFORCEMENT_RULES.md` 참고.
5. 변경 후 `npm run build`로 빌드 성공을 확인하고, ReNew 문서(ADMIN_LAYOUT_ISSUES.md, SESSION_SUMMARY.md 등)에 이번 세션 작업 요약을 반영하세요.
```

---

*이 파일은 다음 세션에서 에이전트에게 붙여 넣을 프롬프트입니다. 수정해서 사용해도 됩니다.*
