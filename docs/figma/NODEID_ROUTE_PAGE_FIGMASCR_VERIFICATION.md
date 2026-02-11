# nodeId ↔ 라우트 ↔ 페이지 컴포넌트 ↔ FIGMASCR0208 매핑 무결성 검증

**검증 일시**: 2026-02-11  
**검증 방법**: `src/app/router.tsx`, `FIGMASCR0208/` 폴더 구조, `src/pages/` 존재 여부 직접 확인  
**데이터 소스**: FSD_SPEC_BLUEPRINT.md, IA_NODEID_TO_FILENAME.md, FIGMASCR0208/INDEX.md, router.tsx

---

## 1. 실행 요약

| 구분 | 결과 | 비고 |
|------|------|------|
| **라우트–페이지 컴포넌트** | ✅ 일치 | router.tsx 기준 모든 라우트와 컴포넌트 존재 |
| **FIGMASCR0208 폴더 구조** | ✅ 일치 | 01~14 폴더 존재 (05~07 제외, INDEX.md 기준) |
| **nodeId → FIGMASCR0208 파일** | ⚠️ 부분 불일치 | 1368-37364, 1368-37201 예시명 등 일부 파일 누락/상이 |
| **매핑 문서 라우트 표현** | ⚠️ 주의 | `:id` vs `:vehicleId`/`:inspectionId` 등 파라미터명 차이 (기능상 동일) |

---

## 2. 검증 방법

- **라우트**: `grep` + `read_file`로 `router.tsx` 경로·컴포넌트 매핑 확인
- **페이지 컴포넌트**: `list_dir`로 `src/pages/` 하위 파일 존재 확인
- **FIGMASCR0208**: `list_dir`로 `FIGMASCR0208/` 01~14 폴더 및 PNG 파일명 확인
- **nodeId**: `IA_NODEID_TO_FILENAME.md`, `FIGMASCR0208_IA_NAMING_MAP.md`와 실제 파일명 대조

---

## 3. 라우트 ↔ 페이지 컴포넌트 검증

| 라우트 (router.tsx) | 페이지 컴포넌트 | 존재 여부 |
|---------------------|-----------------|-----------|
| `/` | LandingPage | ✅ |
| `/login` | LoginPage | ✅ (admin/LoginPage.tsx) |
| `/signup` | SignupEntryPage | ✅ |
| `/signup/step1`~`step5` | SignupStep1Page~Step5Page | ✅ |
| `/signup/pending` | SignupPendingPage | ✅ |
| `/signup/complete` | SignupCompletePage | ✅ |
| `/vehicles` | VehicleListPage | ✅ |
| `/vehicles/new` | VehicleRegisterEntryPage | ✅ |
| `/vehicles/new/step1` | VehicleRegisterStep1Page | ✅ |
| `/vehicles/new/step2` | VehicleRegisterStep2Page | ✅ |
| `/vehicles/:vehicleId/complete` | VehicleRegistrationCompletePage | ✅ |
| `/vehicles/:vehicleId/sale/analyzing` | GeneralSaleAnalyzingPage | ✅ |
| `/vehicles/:vehicleId/sale/price` | GeneralSalePricePage | ✅ |
| `/vehicles/:vehicleId/sale/complete` | GeneralSaleCompletePage | ✅ |
| `/vehicles/:vehicleId/auction` | AuctionDetailPage | ✅ |
| `/vehicles/:vehicleId/auction/start-price` | AuctionStartPricePage | ✅ |
| `/vehicles/:vehicleId/auction/duration` | AuctionDurationPage | ✅ |
| `/vehicles/:vehicleId/auction/complete` | AuctionCompletePage | ✅ |
| `/vehicles/:vehicleId/trade` | TradeDetailPage | ✅ |
| `/vehicles/:vehicleId` | VehicleDetailPage | ✅ |
| `/inspections` | InspectionListPage | ✅ |
| `/inspections/request` | InspectionRequestLandingPage | ✅ |
| `/inspections/request/step1` | InspectionRequestStep1Page | ✅ |
| `/inspections/request/step2` | InspectionRequestStep2Page | ✅ |
| `/inspections/history` | InspectionHistoryPage | ✅ |
| `/inspections/:inspectionId/progress` | InspectionProgressPage | ✅ |
| `/inspections/:inspectionId/complete` | InspectionCompletePage | ✅ |
| `/offers` | TradeListPage | ✅ |
| `/logistics/schedule` | LogisticsSchedulePage | ✅ |
| `/logistics/history` | LogisticsHistoryPage | ✅ |
| `/sales/history` | SalesHistoryPage | ✅ |
| `/settlements` | SettlementListPage | ✅ |
| `/settlements/:settlementId` | SettlementDetailPage | ✅ |
| `/mypage/settlement-account` | SettlementAccountPage | ✅ |

**결론**: 매핑 문서에 명시된 모든 페이지 컴포넌트가 실제로 존재하며, router.tsx 정의와 일치함.

---

## 4. nodeId ↔ FIGMASCR0208 파일 검증

### 4.1 Critical: 실제 폴더에 없는 파일

| nodeId | 문서 예시 파일명 | 실제 FIGMASCR0208 | 비고 |
|--------|------------------|-------------------|------|
| 1368-37364 | §3.1_1368-37364_랜딩페이지_동일구조.png | **없음** | 01_랜딩페이지에 §3.1_1368-37364_* 파일 없음 |
| 1368-37201 | §3.1_1368-37201_랜딩페이지_Hero중심.png | **없음** | 01_랜딩페이지에 `Hero중심.png` 없음. `Hero중심-1.png`, `로그인전_풀뷰.png`만 존재 |

### 4.2 실제 존재하는 FIGMASCR0208 파일 (샘플)

| 폴더 | nodeId 포함 파일 |
|------|------------------|
| 01_랜딩페이지 | §3.1_1368-37201_랜딩페이지_Hero중심-1.png, §3.1_1368-37201_랜딩페이지_로그인전_풀뷰.png, §3.1_1368-43715_랜딩페이지_알림노출.png |
| 02_회원가입_이전_GNB | §3.7_1425-8153_나의매물목록_회원가입유도.png |
| 03_GNB_차량목록_탭 | §3.7_1425-8153_나의매물목록_전체.png, §3.7_1425-8420_*, §3.7_1425-8636_*, §3.7_1425-8842_*, §3.7_1425-12046_* |
| 04_GNB_검차_탭 | §3.6_1425-9445_검차요청내역_리스트_변형.png |
| 08_회원가입 | §3.2_1425-7280_로그인.png, §3.2_1425-7613_회원가입진입.png, §3.2_1513-12032_회원가입_Step1_ref.png 등 |
| 09_매물등록_CTA_1 | §3.5_1418-20498_차량등록_비대면_랜딩.png, §3.5_1418-20498_차량등록_원부등록-*.png, §3.5_1418-20576_차량등록완료_확인.png |
| 10_매물등록_CTA_2 | §3.6_1444-8198_검차신청_Step1_변형.png, §3.6_1425-9445_*, §3.6_1425-10137_*, §3.6_1425-10813_*, §3.6_1425-10285_*, §3.6_1425-9875_* |
| 11_매물등록_CTA_3 | §3.5_1418-20498_판매방식선택.png, §3.5_1418-23705_*, §3.5_1418-24679_*, §3.5_1418-21690_* 등 |
| 12_매물등록_CTA_4 | §3.5_1418-22630_판매_거래목록_목록뷰-*.png, §3.10_1418-25400_*, §3.10_1418-26827_*, §3.10_1418-27070_* 등 |
| 13_매물등록_CTA_5 | §3.11_1418-27434_정산현황_검차피드백*.png, §3.11_1418-36405_정산목록_정산필터카드뷰.png |
| 14_마이페이지 | §3.8_1418-36766_내프로필*.png, §3.8_1418-37804_기본정보수정.png, §3.8_1418-37298_알림센터*.png 등 |

### 4.3 매핑 문서 vs 실제 파일명 불일치

| 매핑 문서 예시 | 실제 FIGMASCR0208 | 조치 |
|----------------|-------------------|------|
| §3.1_1368-37201_랜딩페이지_Hero중심.png | §3.1_1368-37201_랜딩페이지_Hero중심-**1**.png | 문서를 `-1` 변형으로 수정하거나, 기본 파일 추가 |
| §3.1_1368-37364_랜딩페이지_동일구조.png | **파일 없음** | 01_랜딩페이지에 스크린샷 추가 또는 문서에서 "미등록" 표기 |
| 1444-7928 | (FIGMASCR0208 미등록) | 문서대로 MCP 스크린샷 기준 유지 (정확) |

---

## 5. 라우트 파라미터·쿼리 정리

| 매핑 문서 표현 | router.tsx 실제 | 비고 |
|----------------|-----------------|------|
| `/inspections/:id/progress` | `/inspections/:inspectionId/progress` | 파라미터명만 상이, 동일 라우트 |
| `/inspections/:id/complete` | `/inspections/:inspectionId/complete` | 동일 |
| `/vehicles/:id/sale/analyzing` | `/vehicles/:vehicleId/sale/analyzing` | 동일 |
| `/vehicles/:id/trade` | `/vehicles/:vehicleId/trade` | 동일 |
| `/inspections/:id/progress?stage=matching` | 지원됨 (InspectionProgressPage) | 코드에서 `stage` 쿼리 사용 |
| `/vehicles?stage=logistics` | VehicleListPage `STAGE_PARAM` | VehicleListPage.tsx L33 확인 |
| `/inspections/history?view=card` | InspectionHistoryPage | L4 주석 확인 |

---

## 6. 코드·문서 불일치 (보완 제안)

### 6.1 step2 제거 주장 vs 실제

- **매핑 문서**: "step2 제거, 원부 다음→검차신청"
- **실제**: `/vehicles/new/step2` 라우트·VehicleRegisterStep2Page 존재
- **권장**: 문서를 "step2 있음"으로 수정하거나, step2 제거 시 라우트·페이지 삭제 후 문서 반영

### 6.2 마이페이지 서브 라우트

- **매핑 문서**: "기본정보수정 (마이페이지 내)", "알림센터 (마이페이지 내)", 페이지를 "(마이페이지 서브)"로 표기
- **실제**: `/mypage/settlement-account`만 라우트로 정의. 기본정보수정·알림센터는 모달/서브뷰로 처리 가능
- **권장**: "마이페이지 내"가 다른 라우트인지, settlement-account 내 서브뷰인지 명확히 기술

### 6.3 FIGMASCR0208 폴더 05~07

- **INDEX.md**: 05_GNB_거래_탭, 06_GNB_탁송_탭, 07_GNB_정산_탭 기술
- **실제**: 해당 폴더 없음. 11, 12, 13 등에 통합된 것으로 보임
- **권장**: INDEX.md 또는 매핑 문서에 "05~07은 11~13에 통합" 등 명시

---

## 7. 매핑 테이블 행별 검증 결과

| nodeId | IA 화면 라벨 | 라우트 | 페이지 | FIGMASCR0208 | 결과 |
|--------|--------------|--------|--------|---------------|------|
| 1368-37201 | 랜딩 Hero 중심 | `/` | LandingPage | 01_랜딩페이지 | ⚠️ 예시 파일명 `Hero중심.png` → 실제는 `Hero중심-1.png` |
| 1368-37364 | 랜딩 (로그인 후) | `/` | LandingPage | 01_랜딩페이지 | ❌ §3.1_1368-37364_* 파일 없음 |
| 1444-7928 | 랜딩 로그인 전 | `/` | LandingPage | 01_랜딩페이지 | ✅ 문서대로 "FIGMASCR0208 미등록" |
| 1368-43715 | 랜딩 알림 노출 | `/` | LandingPage | 01_랜딩페이지 | ✅ |
| 1425-8153 | 나의매물목록_회원가입유도 | `/vehicles` (비로그인) | VehicleListPage | 02, 03 | ✅ |
| 1425-9445 | 검차요청내역_리스트 | `/inspections` | InspectionListPage | 04, 10 | ✅ |
| 1425-7280 | 로그인 | `/login` | LoginPage | 08 | ✅ |
| 1425-7613 | 회원가입 진입 | `/signup` | SignupEntryPage | 08 | ✅ |
| 1513-12032 | 회원가입 Step1 | `/signup/step1` | SignupStep1Page | 08 | ✅ |
| 1425-7309 | 회원가입 Step2 | `/signup/step2` | SignupStep2Page | 08 | ✅ |
| 1425-7496 | 승인 대기 | `/signup/pending` | SignupPendingPage | 08 | ✅ |
| 1418-20498 | 차량등록 비대면 랜딩 | `/vehicles/new` | VehicleRegisterEntryPage | 09 | ✅ |
| 1418-20498 | 차량등록 원부등록 | `/vehicles/new/step1` | VehicleRegisterStep1Page | 09 | ⚠️ 문서 "step2 제거" vs 실제 step2 존재 |
| 1418-20576 | 차량등록완료 확인 | `/vehicles/:vehicleId/complete` | VehicleRegistrationCompletePage | 09 | ✅ |
| 1444-8198 | 검차신청 Step1 | `/inspections/request`, step1 | InspectionRequestLandingPage, Step1Page | 10 | ✅ |
| 1425-10137 | 검차진행 매칭중 | `/inspections/:id/progress?stage=matching` | InspectionProgressPage | 10 | ✅ |
| 1425-10813 | 검차진행 완료 (이동중) | `/inspections/:id/progress?stage=en_route` | InspectionProgressPage | 10 | ✅ |
| 1425-10285 | 검차결과요약 | `/inspections/:id/complete` | InspectionCompletePage | 10 | ✅ |
| 1425-9661 | 검차내역 리스트 | `/inspections/history` | InspectionHistoryPage | 10 | ✅ |
| 1425-9875 | 검차내역 카드뷰 | `/inspections/history?view=card` | InspectionHistoryPage | 10 | ✅ |
| 1418-20498 | 판매방식선택 | `/vehicles/:id/sale/analyzing` | GeneralSaleAnalyzingPage | 11 | ✅ |
| 1418-23705 | 경매 시작가 설정 | `/vehicles/:id/auction/start-price` | AuctionStartPricePage | 11 | ✅ |
| 1418-24679 | 거래상세 | `/vehicles/:id/trade` | TradeDetailPage | 11 | ✅ |
| 1418-21690 | 거래상세 경매 | `/vehicles/:id/trade` | TradeDetailPage | 11 | ✅ |
| 1714-22332 | GNB 거래 탭 리스팅 | `/offers` | TradeListPage | 11 | ✅ |
| 1418-22630 | 판매/거래 목록 | `/logistics/schedule` 등 | LogisticsSchedulePage | 12 | ✅ |
| 1714-22874 | GNB 탁송 탭 | `/logistics/schedule` | LogisticsSchedulePage | 12 | ✅ |
| 1362-36169 | 차량목록 탁송단계 필터 | `/vehicles?stage=logistics` | VehicleListPage | 03 | ✅ (VehicleListPage L33) |
| 1418-25400 | 새탁송예약 폼 | `/logistics/schedule` | LogisticsSchedulePage | 12 | ✅ |
| 1418-27434 | 정산현황 검차피드백 | `/settlements`, `/sales/history` | SettlementListPage, SalesHistoryPage | 13 | ✅ |
| 1418-36405 | 정산 목록 | `/settlements` | SettlementListPage | 13 | ✅ |
| 1418-36766 | 내 프로필 | `/mypage/settlement-account` | SettlementAccountPage | 14 | ✅ |
| 1418-37804 | 기본정보수정 | (마이페이지 내) | (마이페이지 서브) | 14 | ⚠️ 별도 라우트 없음, 서브뷰 가능 |
| 1418-37298 | 알림센터 | (마이페이지 내) | (마이페이지 서브) | 14 | ⚠️ 동일 |

---

## 8. 권장 보완 사항

1. **1368-37364**  
   - 01_랜딩페이지에 `§3.1_1368-37364_랜딩페이지_동일구조.png` 추가  
   - 또는 매핑 문서에서 "FIGMASCR0208 미등록 (MCP 기준)"으로 명시

2. **1368-37201 Hero중심**  
   - 예시 파일명을 `§3.1_1368-37201_랜딩페이지_Hero중심-1.png`로 수정

3. **step2**  
   - step2 제거 여부 결정 후, 유지 시 문서를 "step2 있음"으로, 제거 시 라우트·페이지 삭제 후 문서 반영

4. **IA_NODEID_TO_FILENAME.md**  
   - 1368-37364, 1368-37201 관련 파일명을 실제 FIGMASCR0208 파일과 동기화

---

**문서 버전**: 1.0  
**검증자**: 코드베이스 직접 검증 (list_dir, grep, read_file)  
**최종 업데이트**: 2026-02-11
