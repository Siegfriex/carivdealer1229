# FSD 강제 규칙 (현 코드베이스 기준)

**작성일**: 2025-01-28  
**목적**: Feature-Sliced Design 아키텍처를 코드 레벨에서 강제하는 규칙  
**적용 범위**: `src/` 디렉토리 전체

---

## 1. ESLint 규칙 (import 경로 제한)

### 1.1 레거시 폴더 참조 금지

**규칙**: `@/components`, `@/config`, `@/services`, `@/utils` 직접 import 금지

**현재 위반 파일** (7개):
- `src/pages/admin/settlement/SettlementListPage.tsx`
- `src/pages/admin/settlement/SettlementDetailPage.tsx`
- `src/pages/admin/sale/SalesHistoryPage.tsx`
- `src/pages/admin/logistics/LogisticsHistoryPage.tsx`
- `src/pages/admin/logistics/LogisticsSchedulePage.tsx`
- `src/pages/admin/sale/GeneralSaleOffersPage.tsx`
- `src/app/providers/ToastProvider.tsx`

**ESLint 설정 추가**:

```json
// .eslintrc.json
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "paths": [
          {
            "name": "@/components",
            "message": "FSD 위반: 레거시 폴더 참조 금지. shared/ui, entities/*/ui, widgets/*/ui 사용"
          },
          {
            "name": "@/config",
            "message": "FSD 위반: 레거시 폴더 참조 금지. shared/config 사용"
          },
          {
            "name": "@/services",
            "message": "FSD 위반: 레거시 폴더 참조 금지. shared/api, features/*/api 사용"
          },
          {
            "name": "@/utils",
            "message": "FSD 위반: 레거시 폴더 참조 금지. shared/lib 사용"
          }
        ],
        "patterns": [
          {
            "group": ["@/components/*", "@/config/*", "@/services/*", "@/utils/*"],
            "message": "FSD 위반: 레거시 폴더 참조 금지"
          }
        ]
      }
    ]
  }
}
```

---

### 1.2 레이어 의존성 규칙

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

**ESLint 설정 추가**:

```json
// .eslintrc.json
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "paths": [
          // shared는 아무 레이어도 참조 불가
          {
            "name": "@/app",
            "message": "FSD 위반: shared는 app 참조 불가",
            "importNames": ["*"],
            "allowTypeImports": false
          },
          {
            "name": "@/pages",
            "message": "FSD 위반: shared는 pages 참조 불가",
            "importNames": ["*"],
            "allowTypeImports": false
          },
          {
            "name": "@/widgets",
            "message": "FSD 위반: shared는 widgets 참조 불가",
            "importNames": ["*"],
            "allowTypeImports": false
          },
          {
            "name": "@/features",
            "message": "FSD 위반: shared는 features 참조 불가",
            "importNames": ["*"],
            "allowTypeImports": false
          },
          {
            "name": "@/entities",
            "message": "FSD 위반: shared는 entities 참조 불가",
            "importNames": ["*"],
            "allowTypeImports": false
          },
          // entities는 features/widgets/pages/app 참조 불가
          {
            "name": "@/features",
            "message": "FSD 위반: entities는 features 참조 불가",
            "importNames": ["*"],
            "allowTypeImports": false
          },
          {
            "name": "@/widgets",
            "message": "FSD 위반: entities는 widgets 참조 불가",
            "importNames": ["*"],
            "allowTypeImports": false
          },
          {
            "name": "@/pages",
            "message": "FSD 위반: entities는 pages 참조 불가",
            "importNames": ["*"],
            "allowTypeImports": false
          },
          {
            "name": "@/app",
            "message": "FSD 위반: entities는 app 참조 불가",
            "importNames": ["*"],
            "allowTypeImports": false
          },
          // features는 widgets/pages/app 참조 불가
          {
            "name": "@/widgets",
            "message": "FSD 위반: features는 widgets 참조 불가",
            "importNames": ["*"],
            "allowTypeImports": false
          },
          {
            "name": "@/pages",
            "message": "FSD 위반: features는 pages 참조 불가",
            "importNames": ["*"],
            "allowTypeImports": false
          },
          {
            "name": "@/app",
            "message": "FSD 위반: features는 app 참조 불가",
            "importNames": ["*"],
            "allowTypeImports": false
          },
          // widgets는 pages/app 참조 불가
          {
            "name": "@/pages",
            "message": "FSD 위반: widgets는 pages 참조 불가",
            "importNames": ["*"],
            "allowTypeImports": false
          },
          {
            "name": "@/app",
            "message": "FSD 위반: widgets는 app 참조 불가",
            "importNames": ["*"],
            "allowTypeImports": false
          },
          // pages는 app 참조 불가
          {
            "name": "@/app",
            "message": "FSD 위반: pages는 app 참조 불가 (router.tsx 제외)",
            "importNames": ["*"],
            "allowTypeImports": false
          }
        ]
      }
    ]
  }
}
```

**주의**: `src/app/router.tsx`는 pages를 import해야 하므로 예외 처리 필요.

---

### 1.3 Public API 강제 (선택적, 점진 적용)

**규칙**: entities, features, widgets는 슬라이스 루트(`index.ts`)를 통해서만 import

**현재 위반 예시**:
```ts
// ❌ 금지: 내부 경로 직접 참조
import { VehicleCard } from '@/entities/vehicle/ui/VehicleCard';
import type { Vehicle } from '@/entities/vehicle/model/types';
import { useVehicles } from '@/features/vehicle/register-form/model/useVehicles';

// ✅ 권장: Public API 사용
import { VehicleCard, type Vehicle } from '@/entities/vehicle';
import { useVehicles } from '@/features/vehicle/register-form';
```

**ESLint 설정 (선택적)**:

```json
// .eslintrc.json
{
  "rules": {
    "no-restricted-imports": [
      "warn",  // error → warn으로 점진 적용
      {
        "patterns": [
          {
            "group": [
              "@/entities/*/ui/*",
              "@/entities/*/model/*",
              "@/entities/*/api/*",
              "@/features/*/model/*",
              "@/features/*/api/*",
              "@/widgets/*/ui/*"
            ],
            "message": "FSD 권장: Public API(index.ts) 사용 권장. 예: @/entities/vehicle 대신 @/entities/vehicle/ui/VehicleCard"
          }
        ]
      }
    ]
  }
}
```

**현재 Public API 상태**:
- ✅ `entities/address/index.ts` 존재
- ✅ `entities/order/index.ts` 존재
- ✅ `entities/payment/index.ts` 존재
- ✅ `entities/listing/index.ts` 존재
- ✅ `entities/review/index.ts` 존재
- ❌ `entities/vehicle/index.ts` **없음** (추가 필요)
- ❌ `entities/inspection/index.ts` **없음** (추가 필요)
- ❌ `entities/auction/index.ts` **없음** (추가 필요)
- ❌ `features/*/index.ts` **없음** (추가 필요)
- ❌ `widgets/*/index.ts` **없음** (추가 필요)

---

## 2. TypeScript 경로 별칭 규칙

**현재 설정** (`tsconfig.json`):
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**권장**: 레거시 폴더 경로 별칭 제거 (선택적)

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      // 레거시 폴더는 별칭 제거 (또는 deprecated 경고)
      "@/components/*": ["./src/components/*"],  // deprecated
      "@/config/*": ["./src/config/*"],  // deprecated
      "@/services/*": ["./src/services/*"],  // deprecated
      "@/utils/*": ["./src/utils/*"]  // deprecated
    }
  }
}
```

---

## 3. 세그먼트 경로 규칙

**규칙**: 세그먼트(ui, model, api, lib)는 슬라이스 내부에서만 사용

**허용된 세그먼트**:
- `ui/` - React 컴포넌트
- `model/` - 타입, 스키마, 훅, 상수
- `api/` - API 호출 함수
- `lib/` - 순수 유틸리티 (shared/lib만)

**세그먼트 간 참조 규칙**:
- `ui` → `model` ✅ (OK)
- `model` → `ui` ❌ (금지)
- `api` → `model` ✅ (OK)
- `model` → `api` ❌ (금지)

**ESLint 설정 (선택적)**:

```json
{
  "rules": {
    "no-restricted-imports": [
      "warn",
      {
        "patterns": [
          {
            "group": ["**/model/**", "**/api/**"],
            "from": "**/ui/**",
            "message": "FSD 위반: ui 세그먼트는 model/api 참조 불가"
          },
          {
            "group": ["**/ui/**", "**/api/**"],
            "from": "**/model/**",
            "message": "FSD 위반: model 세그먼트는 ui/api 참조 불가 (model은 순수 타입/로직만)"
          }
        ]
      }
    ]
  }
}
```

---

## 4. 파일 구조 규칙

### 4.1 슬라이스 구조

**필수 구조**:
```
entities/vehicle/
├── index.ts          # Public API (필수)
├── model/
│   ├── types.ts
│   ├── schema.ts
│   └── constants.ts
└── ui/
    ├── VehicleCard.tsx
    └── VehicleStatusBadge.tsx
```

**features 구조**:
```
features/vehicle/register-form/
├── index.ts          # Public API (권장)
├── api/
│   └── vehicleApi.ts
└── model/
    ├── useVehicle.ts
    └── useVehicles.ts
```

**widgets 구조**:
```
widgets/Header/
├── index.ts          # Public API (권장)
└── ui/
    └── Header.tsx
```

---

## 5. 적용 우선순위

### Phase 1: 즉시 적용 (Critical)
1. ✅ **레거시 폴더 참조 금지** (`@/components`, `@/config`, `@/services`, `@/utils`)
   - 위반 파일 7개 수정 필요
   - ESLint 규칙 추가

### Phase 2: 단기 적용 (High)
2. ⚠️ **레이어 의존성 규칙**
   - shared → 상위 레이어 참조 금지
   - entities → features/widgets/pages/app 참조 금지
   - ESLint 규칙 추가

### Phase 3: 중기 적용 (Medium)
3. 📋 **Public API 강제**
   - `entities/vehicle/index.ts` 추가
   - `entities/inspection/index.ts` 추가
   - `entities/auction/index.ts` 추가
   - `features/*/index.ts` 추가
   - `widgets/*/index.ts` 추가
   - 기존 import 경로 점진 전환

### Phase 4: 장기 적용 (Low)
4. 🔍 **세그먼트 간 참조 규칙**
   - ui → model만 허용
   - model → ui/api 금지
   - ESLint 규칙 추가 (warn 레벨)

---

## 6. ESLint 설정 파일 (전체)

```json
{
  "env": {
    "browser": true,
    "es2022": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react/recommended",
    "plugin:react-hooks/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "plugins": ["react", "@typescript-eslint", "react-hooks"],
  "rules": {
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    
    /* ===== FSD 강제 규칙 ===== */
    
    /* Phase 1: 레거시 폴더 참조 금지 */
    "no-restricted-imports": [
      "error",
      {
        "paths": [
          {
            "name": "@/components",
            "message": "FSD 위반: 레거시 폴더 참조 금지. shared/ui, entities/*/ui, widgets/*/ui 사용"
          },
          {
            "name": "@/config",
            "message": "FSD 위반: 레거시 폴더 참조 금지. shared/config 사용"
          },
          {
            "name": "@/services",
            "message": "FSD 위반: 레거시 폴더 참조 금지. shared/api, features/*/api 사용"
          },
          {
            "name": "@/utils",
            "message": "FSD 위반: 레거시 폴더 참조 금지. shared/lib 사용"
          }
        ],
        "patterns": [
          {
            "group": ["@/components/*", "@/config/*", "@/services/*", "@/utils/*"],
            "message": "FSD 위반: 레거시 폴더 참조 금지"
          }
        ]
      }
    ]
  },
  "overrides": [
    {
      /* app/router.tsx는 pages import 허용 */
      "files": ["src/app/router.tsx"],
      "rules": {
        "no-restricted-imports": "off"
      }
    },
    {
      /* shared 레이어: 상위 레이어 참조 금지 */
      "files": ["src/shared/**/*"],
      "rules": {
        "no-restricted-imports": [
          "error",
          {
            "paths": [
              {
                "name": "@/app",
                "message": "FSD 위반: shared는 app 참조 불가"
              },
              {
                "name": "@/pages",
                "message": "FSD 위반: shared는 pages 참조 불가"
              },
              {
                "name": "@/widgets",
                "message": "FSD 위반: shared는 widgets 참조 불가"
              },
              {
                "name": "@/features",
                "message": "FSD 위반: shared는 features 참조 불가"
              },
              {
                "name": "@/entities",
                "message": "FSD 위반: shared는 entities 참조 불가"
              }
            ]
          }
        ]
      }
    },
    {
      /* entities 레이어: features/widgets/pages/app 참조 금지 */
      "files": ["src/entities/**/*"],
      "rules": {
        "no-restricted-imports": [
          "error",
          {
            "paths": [
              {
                "name": "@/features",
                "message": "FSD 위반: entities는 features 참조 불가"
              },
              {
                "name": "@/widgets",
                "message": "FSD 위반: entities는 widgets 참조 불가"
              },
              {
                "name": "@/pages",
                "message": "FSD 위반: entities는 pages 참조 불가"
              },
              {
                "name": "@/app",
                "message": "FSD 위반: entities는 app 참조 불가"
              }
            ]
          }
        ]
      }
    },
    {
      /* features 레이어: widgets/pages/app 참조 금지 */
      "files": ["src/features/**/*"],
      "rules": {
        "no-restricted-imports": [
          "error",
          {
            "paths": [
              {
                "name": "@/widgets",
                "message": "FSD 위반: features는 widgets 참조 불가"
              },
              {
                "name": "@/pages",
                "message": "FSD 위반: features는 pages 참조 불가"
              },
              {
                "name": "@/app",
                "message": "FSD 위반: features는 app 참조 불가"
              }
            ]
          }
        ]
      }
    },
    {
      /* widgets 레이어: pages/app 참조 금지 */
      "files": ["src/widgets/**/*"],
      "rules": {
        "no-restricted-imports": [
          "error",
          {
            "paths": [
              {
                "name": "@/pages",
                "message": "FSD 위반: widgets는 pages 참조 불가"
              },
              {
                "name": "@/app",
                "message": "FSD 위반: widgets는 app 참조 불가"
              }
            ]
          }
        ]
      }
    }
  ],
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

---

## 7. 적용 방법

### 7.1 즉시 적용 (Phase 1)

1. **ESLint 설정 업데이트**:
   ```bash
   # .eslintrc.json에 위 규칙 추가
   ```

2. **위반 파일 수정**:
   ```bash
   npm run lint
   # 위반 파일 7개 수정
   ```

3. **CI/CD 통합**:
   ```json
   // package.json
   {
     "scripts": {
       "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
       "lint:fsd": "eslint . --ext ts,tsx --rule 'no-restricted-imports: error'"
     }
   }
   ```

### 7.2 점진 적용 (Phase 2-4)

1. **Public API 추가**:
   ```bash
   # entities/vehicle/index.ts 생성
   export * from './model/types';
   export * from './model/schema';
   export * from './model/constants';
   export { VehicleCard } from './ui/VehicleCard';
   export { VehicleStatusBadge } from './ui/VehicleStatusBadge';
   ```

2. **Import 경로 전환**:
   ```bash
   # 기존: @/entities/vehicle/ui/VehicleCard
   # 신규: @/entities/vehicle
   ```

3. **ESLint 규칙 점진 강화**:
   - Phase 2: 레이어 의존성 규칙 추가
   - Phase 3: Public API 강제 (warn → error)
   - Phase 4: 세그먼트 간 참조 규칙 추가

---

## 8. 검증 명령어

```bash
# FSD 규칙 검증
npm run lint

# 특정 레이어 검증
npx eslint src/shared --rule 'no-restricted-imports: error'
npx eslint src/entities --rule 'no-restricted-imports: error'

# Public API 사용 확인
grep -r "@/entities/[^/]+/(ui|model|api)/" src/
grep -r "@/features/[^/]+/(model|api)/" src/
```

---

## 9. 예외 처리

### 9.1 허용된 예외

1. **app/router.tsx**: pages import 필요 (라우팅)
2. **마이그레이션 중**: 레거시 폴더 제거 전까지 임시 허용 (ESLint disable 주석)
   ```ts
   // eslint-disable-next-line no-restricted-imports
   import OriginalPage from '@/components/SomePage';
   ```

### 9.2 ESLint disable 주석

```ts
/* eslint-disable no-restricted-imports */
// 임시: 레거시 컴포넌트 래핑 (마이그레이션 중)
import OriginalPage from '@/components/SomePage';
/* eslint-enable no-restricted-imports */
```

---

## 10. 참고 문서

- [FSD_DEEP_DIVE_AND_CODEBASE_COMPARISON.md](../docs/FSD_DEEP_DIVE_AND_CODEBASE_COMPARISON.md) - FSD 원칙 및 현 코드베이스 비교
- [FRONTEND_ARCHITECTURE_REVIEW.md](../FRONTEND_ARCHITECTURE_REVIEW.md) - 아키텍처 리뷰
- [Feature-Sliced Design 공식 문서](https://feature-sliced.design/)

---

*이 문서는 현 코드베이스 기준으로 FSD를 강제하는 구체적인 규칙을 제시합니다. Phase별로 점진 적용을 권장합니다.*
