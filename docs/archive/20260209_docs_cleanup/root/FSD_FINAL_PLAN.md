# 최종 FSD 확정 플랜

**기준일**: 2026-02-08.  
**기준 문서**: [figma/FIGMA_IA_FSD_STRUCTURE.md](figma/FIGMA_IA_FSD_STRUCTURE.md), [figma/IA_FSD_COMPLETE_VERIFICATION_20260208.md](figma/IA_FSD_COMPLETE_VERIFICATION_20260208.md), [CarivDealer_api_v1.md](CarivDealer_api_v1.md), [CarivDealer_API_ERD_Mapping.md](CarivDealer_API_ERD_Mapping.md), [figma/FSD_FINAL_MAP.md](figma/FSD_FINAL_MAP.md).

---

## 1. 적용 완료 요약 (Phase 1~5)

| 단계 | 내용 | 산출 |
|------|------|------|
| **1.1** | Figma 3종(IA, Global Plan, Verification) 의존성 점검 | 상대 경로·문서명 참조 유효 확인. 역참조(ERD_Mapping·api_v1 → figma/) 경로 정리. |
| **1.2** | 통합 인덱스·자식 수 일치성 점검 | IA §3 vs Verification §2 행 단위 일치. 섹션별 페이지 수·nodeId 범위·라우트 패턴 SSOT: IA·Verification. |
| **1.3** | 용어·번호·라우트 정합성 + ERD Figma 참조 수정 | Global Plan §2.5/§2.4 제거. 검차: IA §3.6만. 일반 판매: IA §3.7. 차량·탁송·정산·마이페이지: IA §3.x·Global Plan §2.7~2.11·Verification 통합 인덱스 반영. [CarivDealer_API_ERD_Mapping.md](CarivDealer_API_ERD_Mapping.md) 정합성 표·문서 이력 1.10 반영. |
| **2.1** | IA 전 섹션 FSD 레이어/슬라이스 통합 추출 | shared/ui, entities, features, widgets, pages·도메인 슬라이스(auth, vehicle, inspection, logistics, settlement, mypage, offer, auction, general-sale) 정리. |
| **2.2** | FSD 최종 맵 문서 작성 | [figma/FSD_FINAL_MAP.md](figma/FSD_FINAL_MAP.md): 레이어 구조, 슬라이스, 라우트↔페이지↔API 매트릭스. |
| **3** | api_v1 라우트↔API 절·검토 표·이력 추가 | [CarivDealer_api_v1.md](CarivDealer_api_v1.md) §4 라우트↔API 매핑, §5 검토 표 "Figma IA·Verification 정합" 행, 문서 이력 1.3. |
| **4** | ERD_Mapping Figma 참조·이력 수정 | 정합성 검증 요약 표 수정(§2.5/§2.4 제거, IA §3.x·Verification 반영), 문서 이력 1.10. |
| **5** | 문서 스위트 갱신 | [DOCS_INDEX.md](DOCS_INDEX.md) 신규 생성. [README.md](README.md)에 Figma·API·ERD·FSD 스위트 안내 추가. |

---

## 2. FSD 레이어·슬라이스 확정 목록

- **레이어**: app → pages → widgets → features → entities → shared.  
- **슬라이스**: auth, vehicle, inspection, logistics, settlement, mypage, offer, auction, general-sale.

상세 컴포넌트·페이지 목록은 [figma/FSD_FINAL_MAP.md](figma/FSD_FINAL_MAP.md) §2·§3 참고.

---

## 3. 라우트 → 페이지 → API → ERD 매트릭스 (요약)

| 대표 라우트 | 페이지(대표) | API (현재·확장) | ERD 참조 |
|-------------|--------------|-----------------|----------|
| `/`, `/login`, `/signup/*` | 랜딩, LoginPage, Signup* | POST `/auth/login`, PUT `/signup/dealer`, POST `/signup/dealer/submit`, PUT `/signup/settlement` | seller_dealer, auth |
| `/vehicles`, `/vehicles/new`, `/vehicles/:id` | VehicleListPage, VehicleRegisterPage, VehicleDetailPage | GET/POST/PUT/PATCH `/vehicles`, GET `/vehicles/lookup`, POST `/vehicles/ocr/parse` | vehicle |
| `/inspections/*` | 검차 목록·신청·진행·완료 | POST `/vehicles/:id/inspections`, GET `/vehicles/:id/inspections/latest` | inspection |
| `/vehicles/:id/sale/*` | 일반 판매 | GET/POST/PUT `/vehicles` | vehicle, sale_mode |
| `/vehicles/:id/auction/*` | 경매 플로우 | 확장 제안 | auction, auction_bid |
| `/mypage/*`, `/offers` | 마이페이지·오퍼 | 확장: GET `/me`, GET `/offers`, PATCH `/dealer/profile` | offer, ERD_Mapping 오퍼/마이페이지 제안 |
| `/logistics/*` | 탁송 | 확장: GET/POST `/logistics/*` | logistics (ERD_Mapping 물류 제안) |
| `/settlements`, `/sales/history` | 정산 | 확장: GET `/settlements`, GET `/sales/history` | settlement, sales_history (ERD_Mapping 제안) |

상세 프레임 수(87개 대표)·nodeId·라우트 패턴은 [figma/IA_FSD_COMPLETE_VERIFICATION_20260208.md](figma/IA_FSD_COMPLETE_VERIFICATION_20260208.md) §2·§3, [CarivDealer_api_v1.md](CarivDealer_api_v1.md) §4 참고.

---

## 4. 구현 우선순위 제안

1. **레이어 순**: shared → entities → features → widgets → pages.  
2. **도메인 순**: 랜딩·auth → 차량·검차 → 일반 판매·경매 → 탁송·정산 → 마이페이지·오퍼.

---

## 5. 문서 유지보수 규칙

- **Figma 노드/라우트 변경 시**: IA, Verification, Global Plan 동기화. 통합 인덱스(IA §3, Verification §2) 및 섹션별 자식 수·nodeId 일치 유지.  
- **API/ERD 확장 시**: CarivDealer_api_v1 §4 라우트↔API, CarivDealer_API_ERD_Mapping, CarivDealer_API_ERD_Consistency_Report 및 figma/FSD_FINAL_MAP.md 갱신.  
- **문서 진입점**: [DOCS_INDEX.md](DOCS_INDEX.md)에서 Figma·API·ERD·FSD 스위트 목차·의존 순서 확인.
