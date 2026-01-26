# 디자인 시스템 명세서

**프로젝트**: ForwardMax (carivdealer)  
**버전**: 1.0  
**최종 업데이트**: 2026-01-26  
**디자인 파일**: 31개 (design/ 폴더)  
**기준 해상도**: 1440px

---

## 목차

1. [개요](#1-개요)
2. [타이포그래피 시스템](#2-타이포그래피-시스템)
3. [색상 시스템](#3-색상-시스템)
4. [레이아웃 그리드](#4-레이아웃-그리드)
5. [z-index 레이어링](#5-z-index-레이어링)
6. [공통 컴포넌트 스펙](#6-공통-컴포넌트-스펙)
7. [반응형 전략](#7-반응형-전략)

---

## 1. 개요

### 1.1 디자인 원칙

1. **1440px 기준 디자인**: 모든 디자인 파일은 1440px 너비 기준
2. **vw 기반 반응형**: 700px 이상에서 vw 단위로 비례 축소/확대
3. **픽셀 퍼펙트**: ±5px 오차 허용
4. **접근성 우선**: WCAG 2.1 AA 준수

### 1.2 디자인 파일 목록

총 **31개 파일**:
- 랜딩페이지: 1개
- 회원가입 플로우: 8개
- 공통 컴포넌트: 10개
- 타이포그래피: 1개
- 차량 대시보드: 2개
- 차량 등록/검차: 9개

### 1.3 참조 파일

- 디자인 토큰: [src/shared/styles/design-tokens.css](../src/shared/styles/design-tokens.css)
- z-index 설정: [src/shared/config/zIndex.ts](../src/shared/config/zIndex.ts)
- 반응형 유틸: [src/shared/lib/responsive.ts](../src/shared/lib/responsive.ts)

---

## 2. 타이포그래피 시스템

### 2.1 폰트 패밀리

**주 폰트**: Pretendard

**폴백**: -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif

**참조**: `design/design_typhography/Typography.png`

### 2.2 타이포 스케일

| 스케일 | 크기 (px) | vw (1440px 기준) | Weight | 용도 |
|--------|----------|------------------|--------|------|
| H1 | 36px | 2.5vw | Medium (500) | 페이지 타이틀 |
| H2 | 24px | 1.67vw | Medium (500) | 섹션 타이틀 |
| H3 | 18px | 1.25vw | Bold (700) | 서브 섹션 타이틀 |
| H4 | 16px | 1.11vw | Regular (400) | 카드 타이틀 |
| Body | 14px | 0.97vw | Regular (400) | 본문 텍스트 |
| Button | 12px | 0.83vw | Regular (400) | 버튼 텍스트 |
| Caption | 10px | 0.69vw | Regular (400) | 작은 설명 텍스트 |

### 2.3 행간 (Line Height)

- **Tight**: 1.2 (제목용)
- **Normal**: 1.5 (본문용)
- **Relaxed**: 1.75 (긴 텍스트용)

### 2.4 자간 (Letter Spacing)

- **Tight**: -0.02em (큰 제목용)
- **Normal**: 0
- **Wide**: 0.02em (작은 텍스트용)

### 2.5 CSS 사용 예시

```css
h1 {
  font-size: var(--text-h1);
  font-weight: var(--font-weight-medium);
  line-height: var(--leading-tight);
  letter-spacing: var(--tracking-tight);
}

.body-text {
  font-size: var(--text-body);
  font-weight: var(--font-weight-regular);
  line-height: var(--leading-normal);
}
```

---

## 3. 색상 시스템

### 3.1 Primary Brand

**참조**: SVG 파일에서 추출 (`#2048E5`)

| 색상 | Hex | 용도 |
|------|-----|------|
| Primary | #2048E5 | 주 브랜드 색상, CTA 버튼 |
| Primary Hover | #1A3BB8 | 버튼 호버 상태 |
| Primary Active | #142E8C | 버튼 클릭 상태 |
| Primary Light | #EEF5FE | 배경, 하이라이트 |
| Primary Border | #D9E7FC | 테두리 |

### 3.2 Accent

| 색상 | Hex | 용도 |
|------|-----|------|
| Accent | #8A38F5 | 강조 색상 |
| Accent Hover | #7229CC | 호버 상태 |
| Accent Active | #5A1FA3 | 클릭 상태 |

### 3.3 Neutral (Grayscale)

| 색상 | Hex | 용도 |
|------|-----|------|
| White | #FFFFFF | 배경, 카드 |
| Gray 50 | #F8F9FA | 페이지 배경 |
| Gray 100 | #F3F4F6 | 푸터 배경 |
| Gray 200 | #E6E6E6 | 테두리 (연한) |
| Gray 300 | #D1D5DB | 테두리 (중간) |
| Gray 400 | #9CA3AF | 테두리 (강한) |
| Gray 500 | #909090 | 비활성 텍스트 |
| Gray 600 | #727272 | 보조 텍스트 |
| Gray 700 | #4B5563 | 본문 텍스트 |
| Gray 800 | #1F2937 | 제목 텍스트 |
| Gray 900 | #111827 | 주 텍스트 |
| Black | #000000 | 강조 텍스트 |

### 3.4 Semantic Colors

| 색상 | Hex | 용도 |
|------|-----|------|
| Success | #10B981 | 성공 메시지, 일반 판매 상태 |
| Success Light | #D1FAE5 | 성공 배경 |
| Warning | #F59E0B | 경고 메시지, 정산 대기 |
| Warning Light | #FEF3C7 | 경고 배경 |
| Error | #EF4444 | 에러 메시지 |
| Error Light | #FEE2E2 | 에러 배경 |
| Info | #3B82F6 | 정보 메시지, 검차 상태 |
| Info Light | #DBEAFE | 정보 배경 |

### 3.5 Status Colors (차량 상태)

| 상태 | 색상 | Hex | 용도 |
|------|------|-----|------|
| Draft | Gray 500 | #909090 | 임시 저장 |
| Inspection | Info | #3B82F6 | 검차 진행 중 |
| Bidding | Purple | #8B5CF6 | 경매 진행 중 |
| Active Sale | Success | #10B981 | 일반 판매 |
| Sold | Orange | #F97316 | 판매 완료 |
| Pending Settlement | Warning | #F59E0B | 정산 대기 |
| Completed | Teal | #14B8A6 | 거래 완료 |

---

## 4. 레이아웃 그리드

### 4.1 Container

- **최대 너비**: 1440px
- **패딩**: 24px (1.67vw)
- **중앙 정렬**: `margin: 0 auto`

### 4.2 Spacing Scale

| 이름 | px | vw | 용도 |
|------|----|----|------|
| space-1 | 4px | 0.28vw | 매우 작은 간격 |
| space-2 | 8px | 0.56vw | 작은 간격 |
| space-3 | 12px | 0.83vw | 기본 간격 |
| space-4 | 16px | 1.11vw | 카드 내부 패딩 |
| space-5 | 20px | 1.39vw | 중간 간격 |
| space-6 | 24px | 1.67vw | 섹션 간격 |
| space-8 | 32px | 2.22vw | 큰 간격 |
| space-10 | 40px | 2.78vw | 매우 큰 간격 |
| space-12 | 48px | 3.33vw | 섹션 구분 |
| space-16 | 64px | 4.44vw | 대섹션 구분 |
| space-20 | 80px | 5.56vw | 페이지 구분 |
| space-24 | 96px | 6.67vw | 대형 공간 |

### 4.3 Grid System

**3-Column Grid** (차량 카드):
```css
.grid-3col {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-6);
}
```

**계산**:
- 컬럼 너비: (1440 - 24*2 - 24*2) / 3 = 448px (31.11vw)

---

## 5. z-index 레이어링

### 5.1 레이어 정의

| 레이어 | z-index | 용도 | 예시 |
|--------|---------|------|------|
| BASE | 0 | 기본 컨텐츠 | 페이지 본문 |
| DROPDOWN | 100 | 드롭다운 | 검차 신청 평가사 드롭다운 |
| STICKY | 200 | Sticky 요소 | GNB (상단 네비게이션) |
| FIXED | 300 | Fixed 요소 | 좌측 프로그래스바 |
| MODAL_BACKDROP | 400 | 모달 배경 | 어두운 오버레이 |
| MODAL | 500 | 모달 컨텐츠 | 팝업, 다이얼로그 |
| POPOVER | 600 | 팝오버 | 툴팁형 컨텐츠 |
| TOOLTIP | 700 | 툴팁 | 도움말 툴팁 |
| TOAST | 800 | 토스트 알림 | 성공/에러 알림 |
| LOADING | 900 | 로딩 오버레이 | 전체 화면 로딩 |

### 5.2 사용 예시

```typescript
import { Z_INDEX } from '@/shared/config/zIndex';

// CSS-in-JS
const headerStyles = {
  position: 'sticky',
  zIndex: Z_INDEX.STICKY,
};

// Tailwind (arbitrary values)
<div className="fixed z-[var(--z-modal)]">
```

---

## 6. 공통 컴포넌트 스펙

### 6.1 GNB (상단 네비게이션)

**디자인 파일**: `design/design_component/GNB(상단 네비게이션 메뉴).svg`

**스펙**:
- 높이: 64px (4.44vw)
- 배경: White (#FFFFFF)
- 그림자: `0 1px 2px rgba(0, 0, 0, 0.05)`
- 위치: sticky top-0
- z-index: 200 (STICKY)

**구성 요소**:
- 로고 (좌측)
- 네비게이션 메뉴 (중앙)
- 사용자 정보 (우측)

### 6.2 좌측 프로그래스바

**디자인 파일**: `design/design_component/좌측 프로그래스바.svg`

**스펙**:
- 너비: 249px (17.29vw)
- 높이: 전체 화면
- 배경: White (#FFFFFF)
- 위치: fixed left-0
- z-index: 300 (FIXED)

**스텝 구조**:
- 원 크기: 27.2px (1.89vw)
- 스텝 간격: 105px (7.29vw)
- 체크 완료: #2048E5 (파란색 채움 + 흰색 체크)
- 현재 진행: #2048E5 (파란색 테두리 + 내부 작은 원)
- 미완료: #909090 opacity 0.2 (회색 테두리)

### 6.3 검차단계 프로그래스바

**디자인 파일**: `design/design_component/검차단계 프로그래스바.svg`

**스펙**:
- 높이: 60px (4.17vw)
- 가로 형태
- 스텝 표시: 숫자 또는 체크 아이콘

**상태**:
- 완료: 파란색 원 + 흰색 체크
- 진행중: 파란색 테두리 + 파란색 내부 원
- 대기: 회색 테두리

### 6.4 상태 배지 (StatusBadge)

**디자인 파일**: `design/design_component/상태창.svg`

**스펙**:
- 높이: 33px (2.29vw)
- 패딩: 20px (1.39vw) 좌우
- 테두리 반경: 10px
- 그림자: `0 3px 10px rgba(0, 0, 0, 0.05)`

**Variant**:
- **Selected** (선택됨):
  - 배경: #2048E5
  - 텍스트: White
  
- **Default** (기본):
  - 배경: White
  - 테두리: #E6E6E6
  - 텍스트: Black

### 6.5 리스트 카드 (ListCard)

**디자인 파일**: `design/design_component/리스트 카드.svg`

**스펙**:
- 크기: 213x126px (비율 약 1.69:1)
- 배경: White
- 테두리 반경: 10px
- 그림자: `0 3px 10px rgba(0, 0, 0, 0.05)`
- 호버 그림자: `0 6px 20px rgba(0, 0, 0, 0.08)`

**레이아웃**:
- 3열 그리드
- 간격: 24px

### 6.6 체크박스 (Checkbox)

**디자인 파일**: `design/design_component/체크박스.svg`, `체크박스2.svg`

**스펙**:
- 크기: 12px × 12px (0.83vw)
- 테두리 반경: 3px

**상태**:
- **Unchecked**:
  - 배경: Transparent
  - 테두리: #909090 (0.4px)
  
- **Checked**:
  - 배경: Transparent
  - 테두리: #2048E5
  - 체크 마크: #2048E5

### 6.7 OCR 버튼

**디자인 파일**: `design/design_component/OCR.svg`

**스펙**:
- 아이콘 + 텍스트 버튼
- 배경: Primary (#2048E5)
- 텍스트: White
- 패딩: 12px 24px
- 테두리 반경: 10px

### 6.8 차량 사진 업로더

**디자인 파일**: `design/design_component/차량 사진.svg`

**스펙**:
- 크기: 120px × 120px (8.33vw)
- 테두리: 1px dashed #D1D5DB
- 테두리 반경: 10px
- 아이콘: 카메라 또는 플러스

### 6.9 임시저장 리스트

**디자인 파일**: `design/design_component/임시저장 리스트.svg`

**스펙**:
- 리스트 아이템
- 편집/삭제 버튼
- 아이콘 포함

### 6.10 페이지네이션

**디자인 파일**: `design/design_component/이전\다음 페이지 전환.svg`

**스펙**:
- 이전/다음 버튼
- 페이지 번호 표시
- 현재 페이지: Primary 색상

---

## 7. 반응형 전략

### 7.1 브레이크포인트

| 브레이크포인트 | 범위 | 전략 |
|--------------|------|------|
| Mobile | < 700px | MobileBlocker 표시 |
| Desktop | 700px ~ 1440px | vw 기반 비례 축소 |
| Wide | > 1440px | 최대 너비 1440px 고정 |

### 7.2 MobileBlocker 컴포넌트

**디자인**: 없음 (새로 디자인)

**구현**:
```tsx
<div className="block md:hidden min-h-screen flex items-center justify-center p-4 bg-gray-50">
  <div className="text-center">
    <h1 className="text-2xl font-bold mb-4">데스크톱에서 접속해주세요</h1>
    <p className="text-gray-600">
      본 서비스는 데스크톱 환경에 최적화되어 있습니다.
      <br />
      PC나 태블릿(가로 모드)에서 접속해주세요.
    </p>
  </div>
</div>
```

### 7.3 Tailwind 설정

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    screens: {
      'md': '700px',  // 700px 이상만 지원
    },
  },
};
```

### 7.4 vw 계산 예시

```typescript
// 1440px 기준 720px 요소
const width = pxToVw(720); // 50vw

// CSS에서 사용
width: clamp(480px, 50vw, 720px);
```

---

## 8. 컴포넌트별 디자인 매핑

### 8.1 랜딩페이지

**디자인**: `design/landing/로그인 후 랜딩페이지_첫 사용자.svg`

**구현**: `pages/landing/LandingPage.tsx`

### 8.2 회원가입 플로우 (8단계)

| 단계 | 디자인 파일 | 구현 파일 |
|------|-----------|----------|
| 진입 | `design_SignIn/A. 회원/회원가입진입.svg` | `SignupEntryPage.tsx` |
| Step 1 | `design_SignIn/A. 회원/회원가입_1.svg` | `SignupStep1Page.tsx` |
| Step 2 | `design_SignIn/A. 회원/회원가입_2.svg` | `SignupStep2Page.tsx` |
| Step 3 | `design_SignIn/A. 회원/회원가입_3.svg` | `SignupStep3Page.tsx` |
| Step 4 | `design_SignIn/A. 회원/회원가입_4.svg` | `SignupStep4Page.tsx` |
| Step 5 | `design_SignIn/A. 회원/회원가입_5_약관동의.svg` | `SignupStep5Page.tsx` |
| 승인대기 | `design_SignIn/A. 회원/회원가입_6승인대기.svg` | `SignupPendingPage.tsx` |
| 승인완료 | `design_SignIn/A. 회원/회원가입_6_승인완료.svg` | `SignupCompletePage.tsx` |

### 8.3 차량 대시보드

| 뷰 | 디자인 파일 | 구현 파일 |
|----|-----------|----------|
| 그리드 | `design_vehicle_dashboard/매물 등록 관리_그리드 뷰1.svg` | `DashboardPage.tsx` (grid mode) |
| 리스트 | `design_vehicle_dashboard/매물 등록 관리_리스트 뷰2.svg` | `DashboardPage.tsx` (list mode) |

### 8.4 차량 등록 플로우 (2단계)

| 단계 | 디자인 파일 | 구현 파일 |
|------|-----------|----------|
| Step 1 | `design_vehicle_input/vehicle_input_1/매물 등록 관리_차량 등록1.svg` | `VehicleRegisterStep1Page.tsx` |
| Step 2 | `design_vehicle_input/vehicle_input_1/매물 등록 관리_차량 등록2.svg` | `VehicleRegisterStep2Page.tsx` |

### 8.5 검차 신청 플로우 (4단계)

| 단계 | 디자인 파일 | 구현 파일 |
|------|-----------|----------|
| Step 1 | `design_vehicle_input/vehicle_input_2/매물 등록 관리_차량 검차 신청1.svg` | `InspectionRequestStep1Page.tsx` |
| Step 2 (리스트) | `design_vehicle_input/vehicle_input_2/매물 등록 관리_차량 검차 신청2_리스트뷰.svg` | `InspectionRequestStep2Page.tsx` |
| Step 2 (드롭다운) | `design_vehicle_input/vehicle_input_2/매물 등록 관리_차량 검차 신청2_1_리스트뷰_드롭다운.svg` | `InspectionRequestStep2Page.tsx` |
| Step 2 (카드) | `design_vehicle_input/vehicle_input_2/매물 등록 관리_차량 검차 신청2_2_카드뷰_토글.svg` | `InspectionRequestStep2Page.tsx` |

### 8.6 검차 진행/완료 (3단계)

| 단계 | 디자인 파일 | 구현 파일 |
|------|-----------|----------|
| 진행중 | `design_vehicle_input/vehicle_input_3/매물 등록 관리_차량 검차 진행3.svg` | `InspectionProgressPage.tsx` |
| 완료 | `design_vehicle_input/vehicle_input_45/매물 등록 관리_차량 검차 완료4.svg` | `InspectionCompletePage.tsx` |
| 등록완료 | `design_vehicle_input/vehicle_input_45/매물 등록 관리_차량5 차량등록완료.svg` | `VehicleRegistrationCompletePage.tsx` |

---

## 9. 구현 가이드

### 9.1 CSS Variables 사용

```css
.button-primary {
  background: var(--color-primary);
  color: var(--color-text-inverse);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  font-size: var(--text-button);
  transition: var(--transition-base);
}

.button-primary:hover {
  background: var(--color-primary-hover);
  box-shadow: var(--shadow-md);
}
```

### 9.2 Tailwind Utility Classes

```tsx
<button className="bg-primary hover:bg-primary-hover text-white px-6 py-3 rounded-md text-button">
  클릭
</button>
```

### 9.3 TypeScript 사용

```typescript
import { Z_INDEX } from '@/shared/config/zIndex';
import { svgToVw, pxToVw } from '@/shared/lib/responsive';

// z-index 사용
const modalStyles = {
  zIndex: Z_INDEX.MODAL,
};

// SVG 좌표를 vw로 변환
const width = svgToVw(720); // "50vw"
```

---

## 10. 검증 체크리스트

### Phase 0 완료 기준

- [x] Typography 변수 정의 완료
- [x] 레이아웃 그리드 시스템 정의
- [x] z-index 레이어링 시스템 정의
- [x] 색상 팔레트 정의
- [x] 반응형 전략 설정
- [ ] 10개 공통 컴포넌트 스펙 추출 완료
- [ ] 디자인 명세 문서 작성 완료

### 디자인 QA 기준 (Phase 9)

- [ ] 31개 디자인 파일 100% 반영
- [ ] 1440px에서 픽셀 퍼펙트 (±5px)
- [ ] Typography.png 완벽 구현
- [ ] 색상 일관성 100%
- [ ] z-index 겹침 문제 없음
- [ ] 700px 미만 MobileBlocker 동작

---

**문서 끝**
