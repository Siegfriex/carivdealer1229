# FSD(Feature-Sliced Design) 세부 심층 설명 및 현 코드베이스 비교

**작성일**: 2025-01-28  
**목적**: FSD 아키텍처 원칙 정리 및 `src/` 코드베이스와의 준수/격차 분석

---

## 1. FSD 개요

Feature-Sliced Design은 **비즈니스 가치와 유지보수성**을 위해 레이어·슬라이스·세그먼트로 코드를 나누는 프론트엔드 아키텍처 방법론이다.

- **레이어(Layer)**: 수직 계층. 상위 레이어는 하위 레이어만 참조 가능(단방향).
- **슬라이스(Slice)**: 같은 레이어 내 도메인 단위(예: `vehicle`, `auth`).
- **세그먼트(Segment)**: 슬라이스 내 기술적 역할(ui, model, api, lib 등).

---

## 2. 레이어 상세

### 2.1 계층 구조와 의존성 방향

```
app          → pages, widgets, features, entities, shared (모두 사용 가능)
pages        → widgets, features, entities, shared
widgets      → features, entities, shared
features     → entities, shared
entities     → shared
shared       → (아무 레이어도 참조 금지)
```

- **규칙**: 같은 레이어끼리 참조는 가능하지만 권장하지 않음(슬라이스 간 결합 증가).
- **금지**: 하위 레이어가 상위 레이어를 import (예: `entities` → `features` 금지).

### 2.2 레이어별 역할

| 레이어   | 역할 | 예시 |
|----------|------|------|
| **app**  | 앱 초기화, 프로바이더, 라우터, 글로벌 스타일 | main.tsx, router, providers |
| **pages**| 라우트별 화면 조합. 비즈니스 로직 최소화 | DashboardPage, LoginPage |
| **widgets** | 페이지 조각, 여러 features/entities 조합 | Header, Sidebar, VehicleTable |
| **features** | 사용자 시나리오(액션). entities + shared 사용 | 차량 등록, 검수 요청, 입찰 |
| **entities** | 비즈니스 엔티티(타입, 스키마, 기본 UI) | vehicle, inspection, member |
| **shared**   | 재사용 유틸, UI 킷, 설정 | Button, api client, config |

---

## 3. 세그먼트 상세

각 슬라이스(예: `entities/vehicle`) 안에는 **세그먼트**로 역할을 나눈다.

| 세그먼트 | 용도 | 예시 |
|----------|------|------|
| **ui**   | React 컴포넌트 | VehicleCard.tsx, Button.tsx |
| **model**| 상태·타입·스키마·상수·비즈니스 규칙 | types.ts, schema.ts, useVehicle.ts |
| **api**  | API 호출 함수(HTTP/클라이언트) | vehicleApi.ts, client.ts |
| **lib**  | 순수 유틸(레거시 없음) | formatDate, validatePlateNumber |
| **config** | 슬라이스/앱 설정 | (보통 shared에 두고 공용 사용) |

- **규칙**: 세그먼트 간에도 “안정적인 쪽이 불안정한 쪽을 참조하지 않는다” 원칙 적용.  
  예: `ui` → `model` 참조 OK, `model` → `ui` 참조 금지.

---

## 4. Public API (index)

- **목적**: 슬라이스의 “경계”를 정의. 외부는 **슬라이스 루트**만 import하고, 내부 경로는 직접 쓰지 않는다.
- **형식**: 각 슬라이스 루트에 `index.ts`를 두고, 필요한 타입/컴포넌트/함수만 re-export.

**권장 import:**
```ts
import { VehicleCard } from '@/entities/vehicle';
import { useVehicles } from '@/features/vehicle/register-form';
```

**비권장 (내부 구현 노출):**
```ts
import { VehicleCard } from '@/entities/vehicle/ui/VehicleCard';
import { useVehicles } from '@/features/vehicle/register-form/model/useVehicles';
```

- Public API를 쓰면 슬라이스 내부 리팩터(파일 이동·이름 변경) 시 상위 레이어 수정을 최소화할 수 있다.

---

## 5. 슬라이스/세그먼트 명명

- **슬라이스**: 도메인·기능 단위. 소문자, 케밥 또는 단일 단어.  
  예: `vehicle`, `register-form`, `place-bid`.
- **세그먼트**: FSD에서 정한 `ui`, `model`, `api`, `lib` 등 고정 이름 사용.
- **파일**: PascalCase(컴포넌트), camelCase(함수·훅·유틸).

---

## 6. 현 코드베이스와의 비교

### 6.1 레이어 구조

| FSD 레이어 | 현 코드베이스 | 비고 |
|------------|----------------|------|
| app        | ✅ `app/` (main, router, providers, styles) | 구조 일치 |
| pages      | ✅ `pages/` (admin, auth, landing) | 구조 일치 |
| widgets    | ✅ `widgets/` (Header, Sidebar, ProgressSidebar, VehicleTable) | 구조 일치 |
| features   | ✅ `features/` (auction, inspection, vehicle) | 구조 일치 |
| entities   | ✅ `entities/` (vehicle, inspection, auction, member 등) | 구조 일치 |
| shared     | ✅ `shared/` (api, config, lib, styles, ui) | 구조 일치 |

**추가(FSD 외):**  
- `components/`, `config/`, `services/`, `utils/` 는 **레거시**로 존재. FSD에서는 점진적으로 제거하거나 shared/entities/features 등으로 이전하는 것이 목표.

---

### 6.2 의존성 방향 검증

- **shared**: 상위 레이어(app, pages, widgets, features, entities)를 import 하는 파일 **없음** → ✅ 준수.
- **entities**: features/widgets/pages를 import 하는 파일 **없음** → ✅ 준수.
- **features**: entities, shared만 참조 → ✅ 준수.
- **widgets**: features, entities, shared 참조(페이지 직접 참조 없음) → ✅ 준수.
- **pages**: widgets, features, entities, shared 참조 + **일부 `@/components` 참조** → ⚠️ 레거시 의존성만 위반.
- **app**: `router`에서 pages만 참조, `ToastProvider`에서 **`@/components/ui/Toast`** 참조 → ⚠️ 레거시 의존성 위반.

**요약:**  
- FSD 레이어 간 “하위만 참조” 규칙은 **전부 준수**.
- 위반은 **레거시 폴더(`components`)를 app·pages가 참조**하는 부분뿐.

---

### 6.3 Public API (index) 사용 현황

| 위치 | FSD 권장 | 현 코드베이스 | 격차 |
|------|----------|----------------|------|
| entities | 슬라이스별 `index.ts`에서 ui/model re-export | address, listing, order, payment, review만 `index.ts` 있음. vehicle, inspection, auction 등 **핵심 엔티티는 index 없음** | ⚠️ 일부만 Public API |
| features | 슬라이스/기능별 `index.ts` | **없음**. 호출처에서 `@/features/.../model/useVehicles` 등 **내부 경로 직접 참조** | ❌ Public API 미사용 |
| widgets | 위젯별 `index.ts` | **없음**. `@/widgets/Header/ui/Header` 등 **내부 경로 직접 참조** | ❌ Public API 미사용 |
| shared | 필요 시 ui/config 등에서 re-export | **없음**. `@/shared/ui/Button` 등 직접 경로 사용 | △ (shared는 직접 경로도 허용되는 경우 많음) |

**실제 import 예:**

- Pages/Widgets → entities:  
  `@/entities/vehicle/ui/VehicleCard`, `@/entities/vehicle/model/types`  
  → entity에 `index.ts`가 있으면 `@/entities/vehicle` 로 통일 가능.
- Pages → features:  
  `@/features/vehicle/register-form/model/useVehicles`,  
  `@/features/vehicle/register-form/api/vehicleApi`  
  → feature에 `index.ts`를 두고 훅/API만 re-export 하면 FSD에 더 부합.

---

### 6.4 세그먼트(ui, model, api, lib) 사용

| 세그먼트 | FSD | 현 코드베이스 | 비고 |
|----------|-----|----------------|------|
| ui       | 컴포넌트 | ✅ entities/vehicle/ui, widgets/Header/ui 등 일관 사용 | 준수 |
| model    | 타입, 스키마, 훅, 상수 | ✅ entities/*/model, features/*/model | 준수 |
| api      | API 호출 | ✅ features/vehicle/register-form/api, shared/api | 준수 |
| lib      | 순수 유틸 | ✅ shared/lib (responsive 등) | 준수 |

- **config**: FSD에서는 보통 앱/슬라이스 설정. 현재는 `shared/config`에 두고 사용 → 무방.

---

### 6.5 레거시 폴더와의 혼재

| 항목 | 내용 |
|------|------|
| **pages → components** | GeneralSaleOffersPage, LogisticsHistoryPage, LogisticsSchedulePage, SalesHistoryPage, SettlementListPage, SettlementDetailPage 가 `@/components/...` 를 import 하여 레거시 페이지를 래핑. |
| **app → components** | `ToastProvider`가 `@/components/ui/Toast` 에서 export를 가져옴. |
| **레거시 구조** | `components/`, `config/`, `services/`, `utils/` 가 그대로 존재. FSD 관점에서는 점진적으로 제거하거나 shared/entities/features로 흡수하는 것이 목표. |

---

### 6.6 FSD 관점 요약 표

| 항목 | 상태 | 설명 |
|------|------|------|
| 레이어 6개 구조 | ✅ | app, pages, widgets, features, entities, shared 모두 존재 |
| 레이어 간 의존성 방향 | ✅ | 상위→하위만 참조, shared/entities는 상위 참조 없음 |
| 세그먼트(ui/model/api/lib) | ✅ | 슬라이스 내 ui, model, api 사용 일관 |
| Public API (index) | ⚠️ | entities 일부만, features/widgets는 미사용·내부 경로 직접 참조 |
| 레거시 제거 | ❌ | components/config/services/utils 잔존, app·pages가 components 참조 |

---

## 7. 권장 보완 방향 (우선순위)

1. **Public API 도입**
   - `entities/vehicle`, `entities/inspection`, `entities/auction` 등에 `index.ts` 추가 후 타입·UI·스키마 등 필요한 것만 re-export.
   - `features/vehicle/register-form`, `features/inspection/request-form` 등에 `index.ts` 추가 후 훅·API 함수만 re-export.
   - `widgets/Header`, `widgets/Sidebar` 등에 `index.ts` 추가 후 컴포넌트 re-export.
   - 이후 pages/widgets의 import를 `@/entities/vehicle`, `@/features/vehicle/register-form` 등으로 점진 전환.

2. **레거시 의존성 제거**
   - `ToastProvider`: `@/components/ui/Toast` → `@/shared/ui/Toast` (또는 shared에서 re-export하는 한 곳)로 변경.
   - 래핑된 6개 페이지: 레거시 컴포넌트 로직을 FSD 구조(pages + widgets + features + entities)로 이전한 뒤 `@/components` import 제거.
   - 그 후 `components/`, `config/`, `services/`, `utils/` 내용을 shared/entities/features로 이전하고 폴더 제거.

3. **문서화**
   - “프로젝트는 FSD를 따르며, 새 코드는 반드시 Public API를 통해 슬라이스를 참조한다”는 규칙을 CONTRIBUTING 또는 아키텍처 문서에 명시.
   - ESLint/import 규칙으로 `@/components`, `@/config`, `@/services`, `@/utils` 직접 참조를 금지하거나 경고하는 것도 고려.

이렇게 하면 현재 코드베이스는 **FSD 구조와 의존성 규칙은 이미 대부분 따르고 있고**, Public API 보강과 레거시 제거만으로 FSD 정합성을 크게 높일 수 있다.
