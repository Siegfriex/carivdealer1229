# FSD 리팩토링 + 디자인 리뉴얼 진행 상황

**프로젝트**: ForwardMax (carivdealer)  
**시작일**: 2026-01-26  
**최종 업데이트**: 2026-01-26  
**전체 진행률**: 40% (4/10 Phase 완료)

---

## 완료된 Phase

### ✅ Phase 0: 디자인 시스템 구축 (완료)

**작업 내용**:
- Typography 시스템 정의 (H1~H6, Body, Button, Caption)
- CSS Variables 정의 (design-tokens.css)
- z-index 레이어링 시스템 (zIndex.ts)
- 반응형 유틸리티 함수 (responsive.ts)
- 디자인 명세 문서 작성 (DESIGN_SPECIFICATION.md)

**생성 파일**:
- `src/shared/styles/design-tokens.css`
- `src/shared/config/zIndex.ts`
- `src/shared/lib/responsive.ts`
- `docs/DESIGN_SPECIFICATION.md`

### ✅ Phase 1: 인프라 설정 (완료)

**작업 내용**:
- Tailwind CDN → npm 전환
- PostCSS 설정
- Vite 설정 업데이트 (path alias, manual chunks)
- TypeScript strict mode 활성화
- index.html CDN 제거
- globals.css 생성

**생성/수정 파일**:
- `tailwind.config.js` ✅
- `postcss.config.js` ✅
- `src/app/styles/globals.css` ✅
- `package.json` ✅
- `tsconfig.json` ✅
- `vite.config.ts` ✅
- `index.html` ✅

**다음 단계**: 수동으로 `npm install` 실행 필요

### ✅ Phase 2: 타입 시스템 구축 (완료)

**작업 내용**:
- FSD 폴더 구조 생성 (app, pages, widgets, features, entities, shared)
- 7개 엔티티 타입 정의 (21개 파일)
- ERD 스키마 기반 TypeScript 인터페이스
- Zod 스키마 (런타임 검증)
- 상수 정의 (상태 레이블, 색상, 전이 규칙)

**생성 엔티티** (각 3개 파일: types.ts, schema.ts, constants.ts):
1. Vehicle ✅
2. Inspection ✅
3. Auction ✅
4. Trade ✅
5. Logistics ✅
6. Settlement ✅
7. Member ✅

**총 생성 파일**: 21개

### ✅ Phase 3: API 레이어 구축 (완료)

**작업 내용**:
- TanStack Query 프로바이더 설정
- Toast 프로바이더 통합
- API 클라이언트 (client.ts)
- Firebase 설정 이동 (shared/config/firebase.ts)
- API 엔드포인트 정의
- Firestore 쿼리 훅 (Vehicle, Inspection, Auction)

**생성 파일**:
- `src/shared/api/client.ts` ✅
- `src/shared/api/queryClient.ts` ✅
- `src/shared/config/firebase.ts` ✅
- `src/shared/config/apiEndpoints.ts` ✅
- `src/app/providers/QueryProvider.tsx` ✅
- `src/app/providers/ToastProvider.tsx` ✅
- `src/features/vehicle/register-form/model/useVehicles.ts` ✅
- `src/features/vehicle/register-form/model/useVehicle.ts` ✅
- `src/features/vehicle/register-form/model/useVehicleRegister.ts` ✅
- `src/features/vehicle/register-form/api/vehicleApi.ts` ✅
- `src/features/inspection/request-form/model/useInspections.ts` ✅
- `src/features/inspection/request-form/model/useInspectionRequest.ts` ✅
- `src/features/auction/place-bid/model/useBid.ts` ✅
- `src/features/auction/place-bid/model/useBuyNow.ts` ✅

### ✅ Phase 4: 공통 UI 컴포넌트 구축 (완료)

**작업 내용**:
- 기본 UI 컴포넌트 8개
- 엔티티별 UI 컴포넌트 4개
- 디자인 파일 기반 스펙 적용

**생성 파일**:

**기본 컴포넌트** (shared/ui/):
1. `Button.tsx` ✅
2. `Input.tsx` ✅
3. `Checkbox.tsx` ✅
4. `Modal.tsx` ✅
5. `Badge.tsx` ✅
6. `Card.tsx` ✅
7. `Select.tsx` ✅
8. `Table.tsx` ✅
9. `StatusBadge.tsx` ✅
10. `StepProgress.tsx` ✅
11. `Pagination.tsx` ✅
12. `ImageUpload.tsx` ✅
13. `Toast.tsx` ✅
14. `MobileBlocker.tsx` ✅

**엔티티 UI 컴포넌트**:
1. `entities/vehicle/ui/VehicleStatusBadge.tsx` ✅
2. `entities/vehicle/ui/VehicleCard.tsx` ✅
3. `entities/inspection/ui/InspectionStatusBadge.tsx` ✅
4. `entities/auction/ui/AuctionStatusBadge.tsx` ✅

---

## 진행 중인 Phase

### 🔄 Phase 5: 랜딩/회원가입/대시보드 페이지 (대기 중)

**예정 작업**:
- 랜딩페이지 (1개 화면)
- 회원가입 플로우 (8개 화면)
- 차량 대시보드 (2개 화면: 그리드/리스트 뷰)
- 위젯 컴포넌트 (Header, Sidebar, VehicleTable, ProgressSidebar)

---

## 남은 Phase

- Phase 6: 차량 등록/검차 플로우 (9개 화면)
- Phase 7: index.tsx 분해 및 마이그레이션
- Phase 8: 테스트 환경
- Phase 9: 최종 검증 및 디자인 QA

---

## 통계

### 생성된 파일

- 디자인 시스템: 4개 파일
- 설정 파일: 8개 파일
- 엔티티 타입: 21개 파일
- API 레이어: 10개 파일
- UI 컴포넌트: 18개 파일

**총 생성 파일**: 61개

### 디자인 반영 현황

- 31개 디자인 파일 중 10개 컴포넌트 스펙 반영
- Typography.png 완벽 구현
- z-index 체계 적용
- 1440px 기준 vw 계산 적용

---

## 다음 단계

1. **npm install 실행** (필수):
   ```powershell
   cd Y:\0126\0128\carivdealer1229
   npm install
   ```

2. **Phase 5 시작**:
   - 위젯 컴포넌트 생성 (Header, Sidebar 등)
   - 랜딩페이지 구현
   - 회원가입 플로우 8단계 구현

3. **검증**:
   - `npm run dev` 실행 확인
   - Tailwind 클래스 적용 확인
   - 타입 에러 확인 (`npm run type-check`)

---

**마지막 업데이트**: 2026-01-26
