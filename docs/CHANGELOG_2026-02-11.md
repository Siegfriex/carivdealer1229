# 2026-02-11 작업 로그

**날짜**: 2026년 2월 11일  
**브랜치**: `0211`  
**목적**: 차량목록·거래·탁송·정산 목록 페이지 통합·목업 연동 및 Figma 검증 인프라 정비

---

## 1. 요약

| 영역 | 주요 내용 |
|------|-----------|
| **목업 공통화** | mockLists.ts, mockNavigationMap.ts 추가 — 거래·차량·탁송·정산 공통 목업 |
| **차량목록·거래·탁송·정산** | 사이드바 필터 ↔ 상태별 목록/카드 연동, 클릭 시 상세 페이지 라우팅 |
| **위젯** | VehicleListCard, VehicleListTableWithExpand, ImagePlaceholder, StepFooter |
| **Figma 검증** | Python 검증기 상세 가이드(VERIFIER_DETAILED_GUIDE.md), 0211 브랜치 스냅샷 |
| **설정** | .env.example 추가 |

---

## 2. 신규 추가 파일

### 2.1 shared/api

| 파일 | 용도 |
|------|------|
| `mockLists.ts` | 거래·차량목록·탁송·정산 공통 목업 (MOCK_VEHICLES_ALL, MOCK_TRADES, MOCK_LOGISTICS, MOCK_SETTLEMENTS), Figma MCP asset URL 참조 |
| `mockNavigationMap.ts` | vehicleId → inspectionId/settlementId 매핑, `getVehicleDetailRoute()` — 상태별 상세 페이지 경로 반환 |

### 2.2 shared/ui

| 파일 | 용도 |
|------|------|
| `ImagePlaceholder.tsx` | 이미지 미존재 시 placeholder 박스 (리스트·카드뷰 공통) |
| `StepFooter.tsx` | 플로우 단계 하단 버튼 (다음/이전) 공통 컴포넌트 |

### 2.3 entities/vehicle/model

| 파일 | 용도 |
|------|------|
| `vehicleListFilterMeta.ts` | 차량목록 사이드바 필터 메타 (전체·검차·판매·탁송·정산) — 라벨·route·status 매핑 |

### 2.4 widgets

| 위젯 | 용도 |
|------|------|
| `VehicleListCard/` | 차량목록 카드뷰용 카드 (VehicleCard 래퍼, 클릭 시 getVehicleDetailRoute) |
| `VehicleTable/ui/VehicleListTableWithExpand.tsx` | 테이블형 리스트 + 확장 펼침 뷰 |

### 2.5 설정

| 파일 | 용도 |
|------|------|
| `.env.example` | 환경 변수 예시 (Firebase, API 등) |

---

## 3. 수정된 파일

### 3.1 페이지

| 파일 | 변경 내용 |
|------|-----------|
| `VehicleListPage.tsx` | mockLists, mockNavigationMap, vehicleListFilterMeta 연동, 사이드바 필터 ↔ 목록 |
| `TradeListPage.tsx` | mockLists MOCK_TRADES, 상태별 카드·테이블 |
| `LogisticsSchedulePage.tsx` | mockLists MOCK_LOGISTICS, 탁송 목록 |
| `LogisticsHistoryPage.tsx` | mockLists 연동 |
| `SettlementListPage.tsx` | mockLists MOCK_SETTLEMENTS |
| `SettlementDetailPage.tsx` | mockNavigationMap 연동 |
| `AuctionStartPricePage.tsx` | StepFooter 사용 |
| `GeneralSalePricePage.tsx` | StepFooter 사용 |

### 3.2 엔티티·피처

| 파일 | 변경 내용 |
|------|-----------|
| `VehicleCard.tsx` | ImagePlaceholder, mockLists 구조 호환 |
| `VehicleStatusBadge.tsx` | 상태 라벨·스타일 보강 |
| `useVehicles.ts` | mockLists 폴백, vehicleListFilterMeta 필터 적용 |

### 3.3 위젯

| 파일 | 변경 내용 |
|------|-----------|
| `MainLandingSidebar.tsx` | vehicleListFilterMeta 기반 필터 탭, route 쿼리 연동 |
| `VehicleTable/index.ts` | VehicleListTableWithExpand export |

### 3.4 기타

| 파일 | 변경 내용 |
|------|-----------|
| `mockInspectionList.ts` | 검차 목록 목업 보강 |

---

## 4. Figma 검증·문서

### 4.1 검증기

- `figma-design-audit/docs/VERIFIER_DETAILED_GUIDE.md` — 처음 보는 사람용 Python 검증기 상세 가이드
  - 인풋/아웃풋, Stage 1~3 파이프라인, R001~R008 규칙, IPOE 설명, 기대효과

### 4.2 0211 브랜치 초기 스냅샷 (이전 커밋)

- Figma MCP impl_plans, report_*.json
- FeedbackBlock, InspectionDetailModal, SaleMethodCards, TradeDetailCard, VehicleInfoPanel
- CTA3 메타데이터·디자인 컨텍스트 분석 문서

---

## 5. 라우팅·상태 매핑

| 차량 상태 | 상세 페이지 |
|-----------|-------------|
| draft, inspection | `/inspections/{inspectionId}/progress` 또는 `/inspections/request?vehicleId=` |
| active_sale | `/vehicles/{vehicleId}/trade` |
| bidding | `/vehicles/{vehicleId}/auction` |
| sold | `/logistics/schedule?vehicleId=` |
| pending_settlement, completed | `/settlements/{settlementId}` |

---

## 6. 실행·검증

```bash
# 프론트엔드
npm run dev

# Figma 검증 (단일 노드)
cd figma-design-audit && pip install -e . && figma-audit --node 794-3704
```

---

## 7. 문서 이력

| 버전 | 일자 | 비고 |
|------|------|------|
| 1.0 | 2026-02-11 | 2026-02-11 작업 로그 초안 |
