# FSD 최종 맵 (Figma IA·Verification 기준)

**기준 문서**: [FIGMA_IA_FSD_STRUCTURE.md](FIGMA_IA_FSD_STRUCTURE.md), [IA_FSD_COMPLETE_VERIFICATION_20260208.md](IA_FSD_COMPLETE_VERIFICATION_20260208.md), [CarivDealer_api_v1.md](../CarivDealer_api_v1.md), [CarivDealer_API_ERD_Mapping.md](../CarivDealer_API_ERD_Mapping.md).  
**갱신**: 2026-02-08.

---

## 1. FSD 레이어 구조

| 레이어 | 설명 | 대표 예시 |
|--------|------|-----------|
| **app** | 앱 초기화, 라우터, 프로바이더, 전역 스타일 | Router, AuthProvider, theme |
| **pages** | 페이지 단위 라우트 컴포넌트 | admin, auth, landing, inspection |
| **widgets** | 복합 UI (헤더·사이드바·테이블) | Header, MainLandingSidebar, VehicleTable |
| **features** | 사용자 시나리오 훅/로직 | inspection, vehicle, place-bid, register-form |
| **entities** | 비즈니스 엔티티 UI·타입 | vehicle, inspection, logistics |
| **shared** | 공통 UI, API 클라이언트, 설정 | ui (Button, Input, Pagination), config, api |

---

## 2. 도메인 슬라이스

| 슬라이스 | 대표 페이지·라우트 | 연동 API (api_v1) | ERD 테이블 (ERD_Mapping 참조) |
|----------|-------------------|-------------------|-------------------------------|
| **auth** | `/login`, `/signup`, `/signup/step1`~`step5`, `/signup/pending`, `/signup/complete`, `/forgot-password` | POST `/auth/login`, `/auth/kakao/login`, `/auth/google/login`, PUT `/signup/dealer`, POST `/signup/dealer/submit`, PUT `/signup/settlement` | seller_dealer, seller_dealer_pledge, auth_refresh_token |
| **vehicle** | `/vehicles`, `/vehicles/new`, `/vehicles/:id` | GET/POST `/vehicles`, GET `/vehicles/:id`, PUT/PATCH/DELETE `/vehicles/:id`, GET `/vehicles/lookup`, POST `/vehicles/ocr/parse` | vehicle 및 관련 |
| **inspection** | `/inspections`, `/inspections/request`, `/inspections/:id/progress`, `/inspections/:id/complete` | POST `/vehicles/:id/inspections`, GET `/vehicles/:id/inspections/latest` | inspection |
| **logistics** | `/logistics/schedule`, `/logistics/history`, `/logistics/:id` | 확장 제안: GET/POST `/logistics/schedule`, GET `/logistics/history`, GET `/logistics/:id` | logistics (ERD_Mapping 물류 플로우 제안) |
| **settlement** | `/settlements`, `/settlements/:id`, `/sales/history` | 확장 제안: GET `/settlements`, GET `/settlements/:id`, GET `/sales/history` | settlement, sales_history |
| **mypage** | `/mypage/*` (profile, account, approval, settlement-account, notifications, support) | 확장 제안: GET `/me`, GET/PATCH `/dealer/profile` | offer, 딜러 승인·정산 계좌 (ERD_Mapping 오퍼/마이페이지 제안) |
| **offer** | `/offers` | 확장 제안: GET `/offers`, GET `/offers/:id`, 수락/거절 | offer |
| **auction** | `/vehicles/:id/auction/*` | 확장 제안 (ERD_Mapping 경매 플로우 제안) | auction, auction_bid |
| **general-sale** | `/vehicles`, `/vehicles/:id/sale/analyzing|price|complete` | GET/POST `/vehicles`, 차량 등록·수정 | vehicle, sale_mode 관련 |

---

## 3. 레이어별·슬라이스별 컴포넌트/페이지 요약

- **shared/ui**: Button(Primary/Secondary), Input, FormField, StepProgress, SegmentedControl, Checkbox, Pagination, Table, StatusBadge, Card, Modal, Toast, DatePicker, DateRangePicker, ViewToggle, EmptyState.
- **entities**: vehicle (VehicleCard, VehicleStatusBadge), inspection (InspectionStatusBadge), logistics (types, LogisticsStatus).
- **features**: vehicle (useVehicles), inspection (검차 신청/목록/진행 훅), auth (로그인/회원가입 플로우).
- **widgets**: Header (LandingHeader), MainLandingSidebar, VehicleTable.
- **pages**: landing (랜딩 3프레임), admin (LoginPage, VehicleListPage, Dashboard), auth (SignupEntryPage, SignupStep1~5, SignupPendingPage, SignupCompletePage, ForgotPasswordPage), admin/inspection (검차 7~9페이지), mypage·offers·logistics·settlements (Verification §3 해당 라우트).

---

## 4. 라우트 ↔ 페이지 ↔ API 매트릭스

| 라우트 패턴 | 페이지(대표) | Figma IA § | API 엔드포인트 (현재·확장 제안) |
|-------------|--------------|------------|----------------------------------|
| `/` | 랜딩 | §3.1 | — |
| `/login` | LoginPage | §3.2 | POST `/auth/login`, `/auth/kakao/login`, `/auth/google/login` |
| `/signup`, `/signup/step1`~`step5`, `/signup/pending`, `/signup/complete` | Signup* | §3.2 | PUT `/signup/dealer`, POST `/signup/dealer/submit`, PUT `/signup/settlement`, GET `/signup/status`, POST `/auth/files` |
| `/dashboard` | Dashboard | §3.3 | (대시 집계 시 GET `/vehicles` 등) |
| `/vehicles` (+ 쿼리) | VehicleListPage | §3.4 | GET `/vehicles` |
| `/vehicles/new`, `/vehicles/:id` | VehicleRegisterPage, VehicleDetailPage | §3.5 | POST/GET/PUT/PATCH `/vehicles`, GET `/vehicles/lookup`, POST `/vehicles/ocr/parse` |
| `/vehicles/:id/auction/*` | 경매 플로우 | §3.9 | 확장: 경매 시작가·입찰 등 |
| `/inspections`, `/inspections/request`, `/inspections/:id/progress|complete` | 검차 목록·신청·진행·완료 | §3.6 | POST `/vehicles/:id/inspections`, GET `/vehicles/:id/inspections/latest` |
| `/vehicles`, `/vehicles/:id/sale/*` | 일반 판매 | §3.7 | GET/POST/PUT `/vehicles` |
| `/mypage/*`, `/offers` | 마이페이지·오퍼 | §3.8 | 확장: GET `/me`, GET `/offers`, PATCH `/dealer/profile` 등 |
| `/logistics/schedule`, `/logistics/history`, `/logistics/:id` | 탁송 | §3.10 | 확장: GET/POST `/logistics/*` |
| `/settlements`, `/settlements/:id`, `/sales/history` | 정산 | §3.11 | 확장: GET `/settlements`, GET `/sales/history` |

상세 프레임·nodeId는 [IA_FSD_COMPLETE_VERIFICATION_20260208.md](IA_FSD_COMPLETE_VERIFICATION_20260208.md) §2·§3 참고.
