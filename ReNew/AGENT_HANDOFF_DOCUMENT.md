# Agent Handoff Document

**작성일**: 2026-01-28
**목적**: 다음 AI 에이전트를 위한 초기 프롬프트 및 작업 규약
**다음 작업**: Figma 디자인 구현 (node-id=1194-5866)

---

## 1. 이전 세션 작업 완료 요약

### ✅ Phase 1: 비필수 파일 정리
| 작업 | 결과 |
|-----|------|
| 루트 레벨 보고서 | 11개 → `docs/archive/` 이동 |
| docs/ 중복 문서 | 28개 → `docs/archive/` 이동 |
| .gitignore | `playwright-report/`, `test-results/` 추가 |
| **총계** | 51개 파일 아카이브 |

### ✅ Phase 2.1: 설정 파일 통합
| 레거시 | FSD | 결과 |
|--------|-----|------|
| `src/config/firebase.ts` | `src/shared/config/firebase.ts` | 삭제됨 ✅ |
| `src/config/apiEndpoints.ts` | `src/shared/config/apiEndpoints.ts` | 병합 후 삭제됨 ✅ |
| `src/config/` 폴더 | - | 삭제됨 ✅ |

### ✅ Phase 2.2: API Client 통합
| 레거시 | FSD | 결과 |
|--------|-----|------|
| `src/services/api.ts` | `src/shared/api/apiClient.ts` | 이동됨 ✅ |
| `src/services/apiMockData.ts` | `src/shared/api/mockData.ts` | 이동됨 ✅ |
| `src/utils/errorHandler.ts` | `src/shared/lib/errorHandler.ts` | 이동됨 ✅ |
| `src/services/` 폴더 | - | 삭제됨 ✅ |
| `src/utils/` 폴더 | - | 삭제됨 ✅ |

### ✅ Phase 2.3: Entity Index 파일 생성
**12개 Entity 모두 index.ts 생성 완료:**
```
src/entities/
├── vehicle/index.ts     ✅ (model + ui export)
├── auction/index.ts     ✅ (model + ui export)
├── inspection/index.ts  ✅ (model + ui export)
├── logistics/index.ts   ✅ (model export)
├── trade/index.ts       ✅ (model export)
├── member/index.ts      ✅ (model export)
├── settlement/index.ts  ✅ (model export)
├── order/index.ts       ✅ (신규)
├── payment/index.ts     ✅ (신규)
├── listing/index.ts     ✅ (신규)
├── address/index.ts     ✅ (신규)
└── review/index.ts      ✅ (신규)
```

### ✅ Phase 3: DB 스키마 재작성
- `docs/DATABASE_ERD_SCHEMA.md` 전면 재작성 (원본 ERD `erd/IMG_3923.png` 기준)
- 5개 신규 Entity 타입 정의: order, payment, listing, address, review
- Functions 필드명 정합성 수정: `dispatchAt` → `dispatchedAt`, `handoverPin` → `pin`

### ✅ Phase 4: FSD Compliance 최종 점검 (2026-01-28 추가)
| 작업 | 결과 |
|-----|------|
| Toast 컴포넌트 중복 해결 | `src/components/ui/Toast.tsx` 삭제 ✅ |
| ToastProvider FSD 수정 | `@/shared/ui/Toast` 참조로 변경 ✅ |
| ESLint FSD 규칙 적용 | `.eslintrc.json`에 no-restricted-imports 추가 ✅ |
| 레이어 의존성 규칙 | shared/entities/features/widgets 각각 override 적용 ✅ |

### ⏳ Phase 2.4-2.5: 레거시 페이지 마이그레이션 (미완료)
**7개 파일이 `src/components/` → `src/pages/admin/` 병합 대기 중:**
```
components/SalesHistoryPage.tsx      → pages/admin/ 병합 필요
components/GeneralSaleOffersPage.tsx → pages/admin/ 병합 필요
components/SettlementListPage.tsx    → pages/admin/ 병합 필요
components/SettlementDetailPage.tsx  → pages/admin/ 병합 필요
components/LogisticsSchedulePage.tsx → pages/admin/ 병합 필요
components/LogisticsHistoryPage.tsx  → pages/admin/ 병합 필요
components/VehicleListPage.tsx       → pages/admin/ 병합 필요
```

---

## 2. 커밋 정보

**커밋 해시**: `249aa3a`
```
refactor: FSD 구조 완성 및 코드베이스 정리

Phase 1: 비필수 파일 정리
Phase 2: FSD 구조 완성
Phase 3: DB 스키마 재작성
```

**변경 통계**:
- 103개 파일 변경
- +4,289줄 추가
- -2,059줄 삭제

---

## 3. 현재 공통 컴포넌트 (shared/ui)

### 사용 가능한 UI 컴포넌트 (21개)
```typescript
// src/shared/ui/
Badge.tsx           // 상태 배지
Button.tsx          // 버튼 (primary, secondary, outline, danger)
Card.tsx            // 카드 컨테이너
Checkbox.tsx        // 체크박스
DateRangePicker.tsx // 날짜 범위 선택 (신규)
ImageUpload.tsx     // 이미지 업로드
Input.tsx           // 텍스트 입력
LoginModal.tsx      // 로그인 모달 (신규)
MessageModal.tsx    // 메시지 모달 (신규)
MobileBlocker.tsx   // 모바일 차단
Modal.tsx           // 기본 모달
Pagination.tsx      // 페이지네이션
PillChip.tsx        // 필 태그 (신규)
SegmentedControl.tsx// 세그먼트 컨트롤 (신규)
Select.tsx          // 셀렉트 박스
StatusBadge.tsx     // 상태 배지 (확장)
StepProgress.tsx    // 단계 진행률
Table.tsx           // 테이블
Toast.tsx           // 토스트 알림
Typography.tsx      // 타이포그래피 (신규)
```

### 사용 예시
```typescript
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';
import { Badge } from '@/shared/ui/Badge';
import { Modal } from '@/shared/ui/Modal';
```

---

## 4. FSD 규칙 준수 상태

### ✅ 준수 항목
| 규칙 | 상태 |
|-----|------|
| `@/config` 참조 금지 | ✅ 폴더 삭제됨 |
| `@/services` 참조 금지 | ✅ 폴더 삭제됨 |
| `@/utils` 참조 금지 | ✅ 폴더 삭제됨 |
| Entity index.ts (Public API) | ✅ 12개 모두 생성 |
| 레이어 의존성 (shared) | ✅ 상위 레이어 참조 없음 |
| Toast 컴포넌트 통합 | ✅ shared/ui/Toast 단일화 |
| ESLint FSD 규칙 | ✅ no-restricted-imports 적용 |

### ⚠️ 미준수 항목 (Phase 2.4-2.5 완료 시 해결)
| 규칙 | 위반 파일 | 해결 방법 |
|-----|----------|----------|
| `@/components` 참조 금지 | 7개 pages/admin/*.tsx | 인라인 병합 후 components/ 삭제 |

### 위반 파일 목록
```typescript
// 현재 이 7개 파일이 @/components 참조 중
src/pages/admin/SalesHistoryPage.tsx
src/pages/admin/GeneralSaleOffersPage.tsx
src/pages/admin/SettlementListPage.tsx
src/pages/admin/SettlementDetailPage.tsx
src/pages/admin/LogisticsSchedulePage.tsx
src/pages/admin/LogisticsHistoryPage.tsx
src/pages/admin/VehicleListPage.tsx
```

---

## 5. 다음 작업: Figma 디자인 구현

### 대상 화면
**Figma URL**: https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1194-5866&m=dev

### 구현 시 반드시 준수할 규칙

#### 5.1 파일 생성 위치
```
신규 페이지      → src/pages/[domain]/[PageName]Page.tsx
신규 위젯       → src/widgets/[WidgetName]/ui/[WidgetName].tsx
신규 컴포넌트   → src/shared/ui/[ComponentName].tsx
신규 Entity UI → src/entities/[entity]/ui/[ComponentName].tsx
```

#### 5.2 Import 규칙
```typescript
// ✅ 올바른 import
import { Button } from '@/shared/ui/Button';
import { VehicleCard } from '@/entities/vehicle';
import { apiClient } from '@/shared/api/apiClient';
import { db } from '@/shared/config/firebase';

// ❌ 금지된 import (FSD 위반)
import Something from '@/components/Something';    // 금지
import Something from '@/config/something';        // 금지
import Something from '@/services/something';      // 금지
import Something from '@/utils/something';         // 금지
```

#### 5.3 레이어 의존성
```
app     → pages, widgets, features, entities, shared
pages   → widgets, features, entities, shared
widgets → features, entities, shared
features→ entities, shared
entities→ shared
shared  → (아무것도 참조 불가)
```

#### 5.4 스타일링
- **Tailwind CSS** 사용
- **Design Tokens**: `src/shared/styles/design-tokens.css` 참조
- **타이포그래피**: `ReNew/TYPOGRAPHY_SYSTEM.md` 참조

---

## 6. 참고 문서

| 문서 | 경로 | 설명 |
|-----|------|------|
| FSD 강제 규칙 | `docs/FSD_ENFORCEMENT_RULES.md` | ESLint 규칙, 레이어 의존성 |
| Figma 디자인 스펙 | `ReNew/FIGMA_DESIGN_SPEC.md` | 화면별 디자인 요약 |
| 컴포넌트 정리본 | `ReNew/COMPONENT_SUMMARY.md` | Figma→코드 매핑 |
| 타이포그래피 | `ReNew/TYPOGRAPHY_SYSTEM.md` | 폰트 시스템 |
| DB 스키마 | `docs/DATABASE_ERD_SCHEMA.md` | ERD 및 Firestore 매핑 |
| 아키텍처 리뷰 | `docs/FRONTEND_ARCHITECTURE_REVIEW.md` | 코드베이스 분석 |

---

## 7. 검증 체크리스트

### 작업 전 확인
- [ ] `npm run build` 성공 확인
- [ ] FSD_ENFORCEMENT_RULES.md 숙지
- [ ] 대상 Figma 노드 확인 (node-id=1194-5866)

### 작업 중 확인
- [ ] 신규 파일 위치 FSD 준수
- [ ] Import 경로 레거시 폴더 미참조
- [ ] 레이어 의존성 준수
- [ ] shared/ui 컴포넌트 재사용

### 작업 후 확인
- [ ] `npm run build` 성공
- [ ] `npm run lint` 통과 (FSD 규칙 포함)
- [ ] 커밋 메시지 작성

---

## 8. 빠른 시작 명령어

```bash
# 개발 서버 실행
npm run dev

# 빌드 검증
npm run build

# 린트 검사
npm run lint

# Functions 빌드 (백엔드)
cd functions && npm run build
```

---

*이 문서는 AI 에이전트 간 작업 인수인계를 위한 규약입니다. FSD 강제 규칙을 반드시 준수하십시오.*
