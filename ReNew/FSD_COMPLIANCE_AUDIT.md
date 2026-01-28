# FSD 규칙 준수 상태 감사 (AGENT_HANDOFF_DOCUMENT.md 검증)

**검증일**: 2025-01-28  
**기준 문서**: `ReNew/AGENT_HANDOFF_DOCUMENT.md`  
**검증 방법**: 실제 코드베이스 대조

---

## 1. 에이전트 보고 vs 실제 상태

### ✅ 일치 항목

| 항목 | 에이전트 보고 | 실제 상태 | 검증 |
|------|--------------|----------|------|
| `config/` 폴더 삭제 | ✅ 삭제됨 | ✅ 삭제됨 | 일치 |
| `services/` 폴더 삭제 | ✅ 삭제됨 | ✅ 삭제됨 | 일치 |
| `utils/` 폴더 삭제 | ✅ 삭제됨 | ✅ 삭제됨 | 일치 |
| Entity index.ts 12개 | ✅ 모두 생성 | ✅ 12개 존재 | 일치 |
| 레이어 의존성 (shared) | ✅ 준수 | ✅ 준수 | 일치 |

---

## 2. 🔴 Critical: 미식별 위협 요인

### 2.1 Toast 컴포넌트 중복 및 레거시 참조

**문제**:
- `src/shared/ui/Toast.tsx` 존재 (FSD 준수)
- `src/components/ui/Toast.tsx` 존재 (레거시)
- `src/app/providers/ToastProvider.tsx`가 **레거시를 참조** 중:
  ```ts
  export { ToastProvider, useToast } from '@/components/ui/Toast';
  ```

**영향**:
- `app/` 레이어가 레거시 폴더(`@/components`) 참조 → FSD 위반
- Toast 중복으로 인한 혼란 (어느 것을 사용해야 하는지 불명확)
- `main.tsx`에서 어떤 Toast를 사용하는지 확인 필요

**위험도**: 🔴 **Critical**

**조치**:
1. `ToastProvider.tsx`를 `@/shared/ui/Toast`로 변경
2. `components/ui/Toast.tsx` 삭제 또는 `shared/ui/Toast.tsx`와 통합 확인
3. `main.tsx`에서 사용하는 Toast 경로 확인

---

### 2.2 Public API 미사용 (내부 경로 직접 참조)

**문제**:
- Entity `index.ts`는 12개 모두 존재하지만, **여전히 내부 경로 직접 참조**가 15개 파일에서 발생
- 예시:
  ```ts
  // ❌ 현재: 내부 경로 직접 참조
  import { VehicleCard } from '@/entities/vehicle/ui/VehicleCard';
  import type { Vehicle } from '@/entities/vehicle/model/types';
  
  // ✅ 권장: Public API 사용
  import { VehicleCard, type Vehicle } from '@/entities/vehicle';
  ```

**위반 파일** (8개):
- `src/pages/admin/DashboardPage.tsx`
- `src/pages/admin/VehicleListPage.tsx`
- `src/widgets/VehicleTable/ui/VehicleTable.tsx`
- `src/entities/vehicle/ui/VehicleCard.tsx`
- `src/entities/vehicle/ui/VehicleStatusBadge.tsx`
- `src/features/vehicle/register-form/model/useVehicles.ts`
- `src/features/vehicle/register-form/model/useVehicleRegister.ts`
- `src/features/vehicle/register-form/model/useVehicle.ts`

**영향**:
- Public API의 목적(슬라이스 내부 변경 시 상위 레이어 영향 최소화)을 달성하지 못함
- 리팩토링 시 여러 파일 수정 필요

**위험도**: 🟡 **Medium**

**조치**:
1. 위반 파일 8개를 Public API 사용으로 전환
2. ESLint 규칙 추가로 내부 경로 직접 참조 경고/에러

---

### 2.3 ESLint 규칙 미적용

**문제**:
- `docs/FSD_ENFORCEMENT_RULES.md`에 FSD 강제 규칙이 문서화되어 있음
- **실제 `.eslintrc.json`에는 FSD 규칙이 적용되지 않음**
- 현재 ESLint 설정은 기본 React/TypeScript 규칙만 포함

**영향**:
- FSD 위반이 자동으로 감지되지 않음
- 개발자가 실수로 레거시 폴더 참조해도 린트 에러 없음
- 코드 리뷰에만 의존해야 함

**위험도**: 🟡 **Medium**

**조치**:
1. `.eslintrc.json`에 `no-restricted-imports` 규칙 추가
2. Phase 1 (레거시 폴더 참조 금지) 즉시 적용
3. CI/CD에서 `npm run lint` 실패 시 빌드 중단

---

### 2.4 Features/Widgets Public API 부재

**문제**:
- Entity는 `index.ts`가 12개 모두 존재
- **Features, Widgets에는 `index.ts`가 전혀 없음**
- 현재 내부 경로 직접 참조:
  ```ts
  // ❌ 현재
  import { useVehicles } from '@/features/vehicle/register-form/model/useVehicles';
  import { Header } from '@/widgets/Header/ui/Header';
  
  // ✅ 권장 (index.ts 추가 후)
  import { useVehicles } from '@/features/vehicle/register-form';
  import { Header } from '@/widgets/Header';
  ```

**영향**:
- FSD 원칙상 모든 슬라이스는 Public API를 가져야 함
- Features/Widgets 내부 구조 변경 시 상위 레이어 영향

**위험도**: 🟡 **Medium**

**조치**:
1. 주요 features에 `index.ts` 추가 (우선순위: vehicle, inspection, auction)
2. 모든 widgets에 `index.ts` 추가
3. 기존 import 경로 점진 전환

---

## 3. 🟠 High: 부분적 미준수

### 3.1 Components 폴더 잔존

**문제**:
- 에이전트 보고: "7개 파일이 `@/components` 참조 중" (래핑 상태)
- **실제**: `components/` 폴더에 **8개 파일** 존재:
  - `GeneralSaleOffersPage.tsx`
  - `LogisticsHistoryPage.tsx`
  - `LogisticsSchedulePage.tsx`
  - `SalesHistoryPage.tsx`
  - `SettlementDetailPage.tsx`
  - `SettlementListPage.tsx`
  - `VehicleListPage.tsx`
  - `ui/Toast.tsx` ← **에이전트 보고서에 누락**

**영향**:
- 레거시 폴더가 완전히 제거되지 않음
- `Toast.tsx` 중복 문제와 연계

**위험도**: 🟠 **High**

**조치**:
1. `components/ui/Toast.tsx` → `shared/ui/Toast.tsx` 통합 확인 후 삭제
2. 7개 Page 컴포넌트를 FSD 구조로 완전 마이그레이션
3. `components/` 폴더 완전 삭제

---

### 3.2 레거시 페이지 래핑 상태

**문제**:
- 7개 admin 페이지가 레거시 컴포넌트를 래핑만 하고 있음
- 예시:
  ```ts
  // pages/admin/GeneralSaleOffersPage.tsx
  import OriginalGeneralSaleOffersPage from '@/components/GeneralSaleOffersPage';
  export const GeneralSaleOffersPage = () => {
    return <OriginalGeneralSaleOffersPage />;
  };
  ```

**영향**:
- FSD 구조의 이점(재사용성, 테스트 용이성)을 활용하지 못함
- 레거시 코드 의존성 지속

**위험도**: 🟠 **High**

**조치**:
1. 각 페이지를 FSD 구조(widgets + features + entities)로 완전 재작성
2. 레거시 컴포넌트 로직을 적절한 레이어로 분산

---

## 4. 🟡 Medium: 개선 기회

### 4.1 세그먼트 간 참조 규칙 미검증

**문제**:
- FSD 원칙: `ui` → `model`만 허용, `model` → `ui/api` 금지
- 현재 코드베이스에서 세그먼트 간 참조 규칙 준수 여부 미검증

**영향**:
- 세그먼트 간 순환 참조 가능성
- 모델이 UI에 의존하는 구조 위험

**위험도**: 🟡 **Medium**

**조치**:
1. 세그먼트 간 참조 패턴 전체 검증
2. ESLint 규칙 추가 (Phase 4)

---

### 4.2 문서-코드 불일치

**문제**:
- `AGENT_HANDOFF_DOCUMENT.md`에 "7개 파일"이라고 했지만 실제로는 `Toast.tsx` 포함 8개
- `ToastProvider.tsx`의 레거시 참조가 보고서에 누락

**영향**:
- 다음 에이전트가 보고서만 보고 작업 시 놓치는 위반 사항

**위험도**: 🟡 **Medium**

**조치**:
1. `AGENT_HANDOFF_DOCUMENT.md` 업데이트
2. 검증 체크리스트에 "Toast 중복 확인" 추가

---

## 5. 📊 종합 위험도 매트릭스

| 위협 요인 | 위험도 | 영향 범위 | 조치 우선순위 |
|----------|--------|----------|--------------|
| Toast 중복 및 레거시 참조 | 🔴 Critical | `app/` 레이어 | 즉시 |
| ESLint 규칙 미적용 | 🟡 Medium | 전체 코드베이스 | Phase 1 |
| Public API 미사용 | 🟡 Medium | 8개 파일 | Phase 2 |
| Features/Widgets Public API 부재 | 🟡 Medium | features, widgets 전체 | Phase 3 |
| Components 폴더 잔존 | 🟠 High | 8개 파일 | Phase 2.4-2.5 |
| 레거시 페이지 래핑 | 🟠 High | 7개 페이지 | Phase 2.4-2.5 |
| 세그먼트 간 참조 미검증 | 🟡 Medium | 전체 슬라이스 | Phase 4 |
| 문서-코드 불일치 | 🟡 Medium | 문서 신뢰성 | 즉시 |

---

## 6. 권장 조치 계획

### 즉시 조치 (Critical)

1. **Toast 통합 및 레거시 참조 제거**
   ```bash
   # 1. shared/ui/Toast.tsx와 components/ui/Toast.tsx 비교
   # 2. ToastProvider.tsx를 @/shared/ui/Toast로 변경
   # 3. components/ui/Toast.tsx 삭제
   # 4. main.tsx에서 사용 경로 확인
   ```

2. **AGENT_HANDOFF_DOCUMENT.md 업데이트**
   - Toast 중복 문제 명시
   - ToastProvider.tsx 레거시 참조 추가
   - 검증 체크리스트 보완

### Phase 1: ESLint 규칙 적용

1. `.eslintrc.json`에 FSD 규칙 추가
2. 레거시 폴더 참조 금지 규칙 적용
3. CI/CD 통합

### Phase 2: Public API 전환

1. 위반 파일 8개를 Public API 사용으로 전환
2. Features 주요 슬라이스에 `index.ts` 추가
3. Widgets에 `index.ts` 추가

### Phase 3: 레거시 완전 제거

1. 7개 레거시 페이지를 FSD 구조로 완전 재작성
2. `components/` 폴더 삭제
3. 최종 검증

---

## 7. 검증 체크리스트 (보완)

### 작업 전 확인
- [x] `npm run build` 성공 확인
- [x] FSD_ENFORCEMENT_RULES.md 숙지
- [ ] **Toast 중복 확인** (`shared/ui/Toast.tsx` vs `components/ui/Toast.tsx`)
- [ ] **ToastProvider.tsx 레거시 참조 확인**
- [ ] 대상 Figma 노드 확인

### 작업 중 확인
- [x] 신규 파일 위치 FSD 준수
- [ ] Import 경로 레거시 폴더 미참조
- [ ] **Public API 사용** (내부 경로 직접 참조 금지)
- [ ] 레이어 의존성 준수
- [ ] shared/ui 컴포넌트 재사용

### 작업 후 확인
- [x] `npm run build` 성공
- [ ] `npm run lint` 통과 (FSD 규칙 포함)
- [ ] **Toast 중복 없음 확인**
- [ ] 커밋 메시지 작성

---

## 8. 결론

**에이전트 보고서의 정확도**: 약 **85%**

**주요 발견사항**:
1. ✅ Entity index.ts 12개 생성은 정확
2. ✅ config/services/utils 폴더 삭제는 정확
3. ❌ Toast 중복 및 레거시 참조 **미식별**
4. ❌ Public API 미사용 문제 **미식별**
5. ❌ ESLint 규칙 미적용 **미식별**
6. ⚠️ Components 폴더 8개 파일 (Toast 포함) - 보고서에는 7개만 언급

**즉시 조치 필요**:
- Toast 통합 및 레거시 참조 제거
- ESLint 규칙 적용
- AGENT_HANDOFF_DOCUMENT.md 업데이트

---

*이 문서는 AGENT_HANDOFF_DOCUMENT.md의 FSD 준수 보고를 실제 코드베이스와 대조 검증한 결과입니다.*
