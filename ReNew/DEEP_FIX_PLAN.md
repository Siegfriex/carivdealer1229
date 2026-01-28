# DEEP FIX PLAN - 프론트엔드 플로우 및 레이아웃 전면 수정

## 현재 상태 진단

### 문제 요약
서비스 불가 수준의 심각한 문제들이 발견됨:

| 카테고리 | 심각도 | 문제 수 |
|---------|-------|--------|
| 플로우 끊김 | Critical | 3개 |
| 레이아웃 깨짐 | High | 5개 |
| 그리드 불일치 | Medium | 4개 |
| 네비게이션 버그 | Medium | 6개 |
| E2E 테스트 실패 | - | 12개/66개 |

---

## Phase 1: Critical 플로우 수정 (즉시)

### 1.1 VehicleRegisterStep2Page - handleNext() ✅ 완료
- **문제**: "다음" 버튼이 console.log만 호출, 페이지 이동 없음
- **상태**: 수정 완료

### 1.2 InspectionRequestStep2Page - 검차 신청 완료 버튼 ✅ 완료
- **문제**: onClick 핸들러 없음
- **상태**: 수정 완료

### 1.3 Dashboard 무한 리다이렉트 ✅ 완료
- **문제**: /dashboard → /vehicles 리다이렉트 시 무한 루프
- **상태**: 수정 완료 (DashboardPage 직접 렌더링으로 변경)

---

## Phase 2: 레이아웃 시스템 통합 (High Priority)

### 2.1 Sidebar 너비 통일

**현재 상태:**
- MainLandingSidebar: `w-64` (256px)
- ProgressSidebar: `249px` (var(--sidebar-width-vw))
- InspectionListPage: 인라인 `w-64`

**해결 방안:**
```typescript
// 통일된 상수 정의 (src/shared/config/layout.ts)
export const LAYOUT = {
  SIDEBAR_WIDTH: 256,  // px (w-64)
  GNB_HEIGHT: 64,      // px (h-16)
  CONTAINER_MAX: 1440, // px
  BREAKPOINT_MD: 700,  // px
};
```

**수정 대상 파일:**
1. `src/widgets/ProgressSidebar/ui/ProgressSidebar.tsx`
2. `src/shared/styles/design-tokens.css`
3. `tailwind.config.js`

### 2.2 VehicleRegisterStep1Page 이중 Sidebar 수정

**현재 문제:**
```tsx
<div className="flex">
  <div className="w-64 flex-shrink-0">
    <ProgressSidebar />
    <div className="fixed left-0 top-64 w-64">  {/* 문제: fixed 중첩 */}
      <MainLandingSidebar />
    </div>
  </div>
  <main className="flex-1 p-8 ml-64">  {/* ml-64 수동 마진 */}
```

**해결 방안:**
```tsx
<div className="min-h-screen bg-gray-50">
  <LandingHeader />

  <div className="flex">
    {/* 단일 Sidebar 영역 */}
    <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 min-h-[calc(100vh-4rem)]">
      <ProgressSidebar steps={progressSteps} inline />
      <div className="p-4 border-t border-gray-200">
        <MainLandingSidebar searchValue={...} onSearchChange={...} />
      </div>
    </aside>

    {/* 메인 콘텐츠 - ml 불필요 */}
    <main className="flex-1 p-8">
      ...
    </main>
  </div>
</div>
```

### 2.3 Container Max-Width 일관성

**현재 상태:**
| 페이지 | Container 처리 |
|--------|---------------|
| DashboardPage | 전체 너비 (제약 없음) |
| VehicleListPage | 전체 너비 |
| InspectionListPage | `max-w-[1440px] mx-auto` |
| InspectionProgressPage | `max-w-[1440px] mx-auto` |

**해결 방안:**
모든 관리자 페이지에 통일된 wrapper 적용

```tsx
// src/shared/ui/AdminLayout.tsx
export const AdminLayout = ({ children, activeNav }) => (
  <div className="min-h-screen bg-gray-50">
    <LandingHeader variant="main" activeNav={activeNav} />
    <div className="flex max-w-[1440px] mx-auto">
      {children}
    </div>
  </div>
);
```

---

## Phase 3: 그리드 시스템 정규화 (Medium Priority)

### 3.1 Breakpoint 확장

**현재 tailwind.config.js:**
```js
screens: {
  'md': '700px',  // 단일 breakpoint
}
```

**수정:**
```js
screens: {
  'sm': '640px',
  'md': '768px',
  'lg': '1024px',
  'xl': '1280px',
  '2xl': '1536px',
  // 커스텀: 데스크톱 전환점
  'desktop': '700px',
}
```

### 3.2 그리드 클래스 통일

**수정 대상:**
- `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- → `grid grid-cols-1 desktop:grid-cols-2 lg:grid-cols-3`

---

## Phase 4: 네비게이션 및 상태 관리 (Medium Priority)

### 4.1 네비게이션 일관성

**현재 상태 (혼용):**
```typescript
// 방식 1: pushState + popstate 이벤트
window.history.pushState({}, '', '/signup/step2');
window.dispatchEvent(new PopStateEvent('popstate'));

// 방식 2: location.href 직접 변경
window.location.href = '/vehicles/new/step2';

// 방식 3: history.back()
window.history.back();
```

**해결 방안:**
통일된 네비게이션 유틸리티 사용

```typescript
// src/shared/lib/navigation.ts
export const navigate = (path: string) => {
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

export const navigateReplace = (path: string) => {
  window.history.replaceState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
};

export const goBack = () => {
  window.history.back();
};
```

### 4.2 폼 상태 관리 (향후 개선)

**문제:** Step 간 이동 시 입력 데이터 손실

**해결 방안 (Phase 5에서):**
- Zustand 또는 Context API 도입
- sessionStorage 백업
- 폼별 custom hook 생성

---

## Phase 5: E2E 테스트 수정

### 5.1 실패한 테스트 목록 및 원인

| 테스트 | 원인 | 수정 방향 |
|--------|------|----------|
| 10-dashboard (1440px/700px) | networkidle 타임아웃 | DashboardPage 직접 렌더링 |
| 11-vehicle-list (1440px/700px) | networkidle 타임아웃 | 동일 |
| 01-landing | "시작하기" 텍스트 불일치 | 실제 UI 텍스트 확인 |
| 02-signup-flow | waitForURL 타임아웃 | 네비게이션 안정화 |
| 03-login | "시작하기" 텍스트 불일치 | 동일 |
| 04-dashboard | networkidle 타임아웃 | 동일 |
| 06-inspection-flow (Step1) | "지도에서 장소 선택" 불일치 | 실제 텍스트 "(Google Maps)" |
| 06-inspection-flow (Step2) | aria-label 미존재 | 버튼에 aria-label 추가 |
| 06-inspection-flow (진행중) | "평가사가 곧 도착" 불일치 | 실제 텍스트 확인 |
| 08-vehicle-list | networkidle 타임아웃 | DashboardPage 수정 반영 |

### 5.2 테스트 수정 전략

1. **UI 텍스트 일치:** 테스트 selector를 실제 UI와 동기화
2. **Timeout 증가:** networkidle 대신 특정 요소 waitForSelector 사용
3. **Aria-label 추가:** 테스트 가능한 접근성 속성 추가

---

## 수정 순서 및 파일 목록

### 즉시 수정 (Phase 1) ✅ 완료
- [x] `src/pages/admin/vehicle/VehicleRegisterStep2Page.tsx`
- [x] `src/pages/admin/inspection/InspectionRequestStep2Page.tsx`
- [x] `src/app/router.tsx`

### 단기 수정 (Phase 2-3)
- [ ] `src/shared/config/layout.ts` (신규)
- [ ] `src/widgets/ProgressSidebar/ui/ProgressSidebar.tsx`
- [ ] `src/pages/admin/vehicle/VehicleRegisterStep1Page.tsx`
- [ ] `src/shared/ui/AdminLayout.tsx` (신규)
- [ ] `tailwind.config.js`
- [ ] `src/shared/styles/design-tokens.css`

### 중기 수정 (Phase 4-5)
- [ ] `src/shared/lib/navigation.ts` (신규)
- [ ] 모든 페이지의 네비게이션 호출 통일
- [ ] `tests/e2e/*.spec.ts` (12개 파일)
- [ ] 접근성 속성 추가 (aria-label 등)

---

## 예상 결과

### Before
- E2E 테스트: 54/66 통과 (82%)
- 플로우 끊김: 3개
- 레이아웃 깨짐: 5개

### After (목표)
- E2E 테스트: 66/66 통과 (100%)
- 플로우 끊김: 0개
- 레이아웃 깨짐: 0개

---

## 승인 요청

위 플랜에 따라 Phase 2부터 순차적으로 수정을 진행하시겠습니까?

1. **Yes - 전체 진행**: Phase 2-5 순차 진행
2. **Partial - 선택 진행**: 특정 Phase만 진행
3. **Review - 추가 검토 필요**: 특정 부분 상세 분석 요청
