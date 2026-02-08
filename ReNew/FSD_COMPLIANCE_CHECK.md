# FSD 규칙 준수 점검 결과

**점검 일자**: 2026-01-28  
**점검 범위**: 이번 세션에서 추가/수정한 모든 파일  
**기준 문서**: `docs/FSD_ENFORCEMENT_RULES.md`

---

## ✅ 점검 결과: 모두 준수

이번 세션에서 추가/수정한 **모든 파일이 FSD 규칙을 준수**합니다.

---

## 📋 점검 상세

### Phase 1: 레거시 폴더 참조 금지 ✅

**규칙**: `@/components`, `@/config`, `@/services`, `@/utils` 직접 import 금지

**점검 결과**:
- ✅ `shared/ui/*` (6개 파일): 레거시 폴더 참조 없음
- ✅ `widgets/*` (2개 파일): 레거시 폴더 참조 없음
- ✅ `pages/*` (4개 파일): 레거시 폴더 참조 없음
- ✅ `entities/*` (1개 파일): 레거시 폴더 참조 없음

**위반 파일**: 없음

---

### Phase 2: 레이어 의존성 규칙 ✅

**규칙**: 하위 레이어는 상위 레이어를 참조할 수 없음

**의존성 방향**:
```
app → pages, widgets, features, entities, shared
pages → widgets, features, entities, shared
widgets → features, entities, shared
features → entities, shared
entities → shared
shared → (아무것도 참조 불가)
```

**점검 결과**:

#### shared 레이어
- ✅ `shared/ui/*`: 상위 레이어 참조 없음 (shared 내부만 참조)
- ✅ `shared/styles/design-tokens.css`: CSS 파일 (참조 없음)

#### entities 레이어
- ✅ `entities/vehicle/ui/VehicleCard.tsx`: `shared`만 참조 ✅

#### widgets 레이어
- ✅ `widgets/Header/ui/LandingHeader.tsx`: `shared`만 참조 ✅
- ✅ `widgets/MainLandingSidebar/ui/MainLandingSidebar.tsx`: `shared`만 참조 ✅

#### pages 레이어
- ✅ `pages/landing/LandingPage.tsx`: `widgets`, `shared`만 참조 ✅
- ✅ `pages/admin/DashboardPage.tsx`: `widgets`, `entities`, `shared`만 참조 ✅
- ✅ `pages/auth/SignupEntryPage.tsx`: `shared`만 참조 ✅
- ✅ `pages/auth/SignupStep1Page.tsx`: `shared`만 참조 ✅

**위반 파일**: 없음

---

### Phase 3: Public API (선택적) ⚠️

**규칙**: entities, features, widgets는 슬라이스 루트(`index.ts`)를 통해서만 import

**현재 상태**:
- ⚠️ 내부 경로 직접 참조 사용 중 (예: `@/entities/vehicle/ui/VehicleCard`)
- ⚠️ Public API (`index.ts`) 미구현

**이번 세션**:
- Public API 미구현 (선택적 단계이므로 OK)
- 향후 점진 적용 가능

**권장 사항**:
```ts
// 향후 개선 (선택적)
// entities/vehicle/index.ts
export { VehicleCard } from './ui/VehicleCard';
export { VehicleStatusBadge } from './ui/VehicleStatusBadge';
export type { Vehicle } from './model/types';

// 사용: import { VehicleCard } from '@/entities/vehicle';
```

---

### Phase 4: 세그먼트 간 참조 규칙 ✅

**규칙**: 
- `ui` → `model` ✅ (OK)
- `model` → `ui` ❌ (금지)
- `api` → `model` ✅ (OK)
- `model` → `api` ❌ (금지)

**점검 결과**:
- ✅ `ui` 세그먼트는 `model` 참조 없음 (이번 세션 파일)
- ✅ `model` 세그먼트는 없음 (이번 세션)

**위반 파일**: 없음

---

## 📊 추가된 파일별 FSD 준수 현황

| 파일 | 레이어 | 참조하는 레이어 | FSD 준수 |
|------|--------|----------------|----------|
| `shared/ui/SegmentedControl.tsx` | shared | - | ✅ |
| `shared/ui/MessageModal.tsx` | shared | shared | ✅ |
| `shared/ui/PillChip.tsx` | shared | - | ✅ |
| `shared/ui/DateRangePicker.tsx` | shared | - | ✅ |
| `shared/ui/Typography.tsx` | shared | - | ✅ |
| `shared/ui/LoginModal.tsx` | shared | shared | ✅ |
| `widgets/Header/ui/LandingHeader.tsx` | widgets | shared | ✅ |
| `widgets/MainLandingSidebar/ui/MainLandingSidebar.tsx` | widgets | shared | ✅ |
| `pages/landing/LandingPage.tsx` | pages | widgets, shared | ✅ |
| `pages/admin/DashboardPage.tsx` | pages | widgets, entities, shared | ✅ |
| `pages/auth/SignupEntryPage.tsx` | pages | shared | ✅ |
| `pages/auth/SignupStep1Page.tsx` | pages | shared | ✅ |
| `entities/vehicle/ui/VehicleCard.tsx` | entities | shared | ✅ |

---

## 🎯 다음 작업 시 FSD 규칙 체크리스트

### 구현 전
- [ ] Figma 디자인 확인
- [ ] 기존 코드 확인 (`codebase_search`, `grep`)
- [ ] FSD 규칙 문서 확인 (`docs/FSD_ENFORCEMENT_RULES.md`)

### 구현 중
- [ ] 레거시 폴더(`@/components`, `@/config`, `@/services`, `@/utils`) 사용 금지
- [ ] 레이어 의존성 준수 (하위 → 상위 참조 금지)
- [ ] 세그먼트 경로 규칙 준수 (`ui` → `model`만 허용)

### 구현 후
- [ ] `read_lints` 실행
- [ ] `npm run build` 실행
- [ ] FSD 규칙 위반 여부 최종 확인

---

## 📝 FSD 규칙 요약

### ✅ 허용된 import

```ts
// shared 레이어
import { Button } from '@/shared/ui/Button';
import { Z_INDEX } from '@/shared/config/zIndex';

// entities 레이어
import { VehicleCard } from '@/entities/vehicle/ui/VehicleCard';
import type { Vehicle } from '@/entities/vehicle/model/types';

// widgets 레이어
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';

// pages 레이어
import { LandingPage } from '@/pages/landing/LandingPage';
```

### ❌ 금지된 import

```ts
// 레거시 폴더 참조 금지
import Something from '@/components/...';  // ❌
import Config from '@/config/...';          // ❌
import Service from '@/services/...';       // ❌
import Util from '@/utils/...';             // ❌

// 레이어 의존성 위반
// shared에서 상위 레이어 참조 금지
import Page from '@/pages/...';            // ❌ (shared에서)
import Widget from '@/widgets/...';        // ❌ (shared에서)

// entities에서 상위 레이어 참조 금지
import Feature from '@/features/...';     // ❌ (entities에서)
import Widget from '@/widgets/...';       // ❌ (entities에서)
```

---

*이번 세션에서 추가한 모든 파일은 FSD 규칙을 준수합니다. 다음 작업 시에도 동일한 규칙을 준수해야 합니다.*
