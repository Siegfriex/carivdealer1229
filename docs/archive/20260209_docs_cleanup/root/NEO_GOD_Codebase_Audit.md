# NEO GOD 코드베이스 점검

**목적**: 라우트·화면·엔드포인트 매핑, 플로우차트–라우트 정합성, Mermaid 규칙 정리  
**기준**: router.tsx, apiEndpoints.ts, apiClient.ts, functions/src/index.ts. (SCREEN_FLOWCHARTS.md는 [archive/SCREEN_FLOWCHARTS.md](archive/SCREEN_FLOWCHARTS.md) 참조)

---

## 1.1 라우트–페이지–API 호출 매핑표

**실제 호출 URL**: Firebase Functions v2 HTTP 트리거는 `BASE_URL + "/" + export함수명`.  
apiEndpoints에 경로형(`member/dealer/register`)과 함수명형(`verifyBusinessAPI`)이 혼재하므로, 아래 "실제 호출 경로"는 **functions export 이름** 기준으로 기재.

| Route Path | Page 컴포넌트 | 사용 API (호출처) | 실제 호출 경로 | 비고 |
|------------|---------------|------------------|----------------|------|
| `/` | LandingPage | 없음 | — | 공개 |
| `/login` | LoginPage | 없음 | — | 인증 미구현 |
| `/signup` | SignupEntryPage | (step에서 호출) | — | |
| `/signup/step1` | SignupStep1Page | (회원정보) | — | |
| `/signup/step2` | SignupStep2Page | (서류) | — | |
| `/signup/step3` | SignupStep3Page | verifyBusiness | verifyBusinessAPI | 사업자 인증 |
| `/signup/step4` | SignupStep4Page | (정산 정보) | — | |
| `/signup/step5` | SignupStep5Page | (약관) | — | |
| `/signup/pending` | SignupPendingPage | 없음 | — | |
| `/signup/complete` | SignupCompletePage | 없음 | — | |
| `/forgot-password` | ForgotPasswordPage | 없음 | — | |
| `/dashboard` | DashboardPage | 없음 | — | 허브 |
| `/vehicles` | VehicleListPage | (목록 조회·필터) | — | Firestore/로컬 등 |
| `/vehicles/new` | VehicleRegisterEntryPage | (진입) | — | |
| `/vehicles/new/step1` | VehicleRegisterStep1Page | ocrRegistration, getVehicleStatistics | ocrRegistrationAPI, getVehicleStatisticsAPI | vehicleApi.ts |
| `/vehicles/new/step2` | VehicleRegisterStep2Page | changeSaleMethod | changeSaleMethodAPI | 차량 등록 시 |
| `/vehicles/:vehicleId/complete` | VehicleRegistrationCompletePage | (완료 표시) | — | |
| `/vehicles/:vehicleId` | VehicleDetailPage | (상세 조회) | — | |
| `/vehicles/:vehicleId/sale/analyzing` | GeneralSaleAnalyzingPage | report.generateReport | generateReportAPI | |
| `/vehicles/:vehicleId/sale/price` | GeneralSalePricePage | report.saveReport 등 | saveReportAPI | |
| `/vehicles/:vehicleId/sale/complete` | GeneralSaleCompletePage | (완료 표시) | — | |
| `/vehicles/:vehicleId/auction` | AuctionDetailPage | bid, buyNow (입찰/즉시구매) | bidAPI, buyNowAPI | useBid, useBuyNow |
| `/vehicles/:vehicleId/auction/start-price` | AuctionStartPricePage | changeSaleMethod | changeSaleMethodAPI | |
| `/vehicles/:vehicleId/auction/duration` | AuctionDurationPage | (기간 설정 후 저장) | changeSaleMethodAPI 등 | |
| `/vehicles/:vehicleId/auction/complete` | AuctionCompletePage | (완료 표시) | — | |
| `/inspections` | InspectionListPage | (목록) | — | |
| `/inspections/request` | InspectionRequestLandingPage | (진입) | — | |
| `/inspections/request/step1` | InspectionRequestStep1Page | (일정 선택) | — | |
| `/inspections/request/step2` | InspectionRequestStep2Page | inspectionRequest | inspectionRequestAPI | useInspectionRequest |
| `/inspections/history` | InspectionHistoryPage | (목록) | — | |
| `/inspections/:inspectionId/progress` | InspectionProgressPage | inspection.getResult | inspectionGetResultAPI | |
| `/inspections/:inspectionId/complete` | InspectionCompletePage | inspection.getResult | inspectionGetResultAPI | |
| `/offers` | GeneralSaleOffersPage | trade.acceptProposal | acceptProposalAPI | 수락/거절 |
| `/logistics/schedule` | LogisticsSchedulePage | logistics.schedule | logisticsScheduleAPI | |
| `/logistics/history` | LogisticsHistoryPage | logistics.approveHandover | handoverApproveAPI | PIN 인계 |
| `/sales/history` | SalesHistoryPage | 없음 | — | 목록(모크 등) |
| `/settlements` | SettlementListPage | 없음 | — | 목록 |
| `/settlements/:settlementId` | SettlementDetailPage | 없음 | — | 상세 |
| `*` | Navigate to /dashboard | — | — | 폴백 |

**엔드포인트 불일치**: `apiEndpoints.MEMBER.REGISTER`는 `'member/dealer/register'`로 되어 있으나, functions에는 해당 이름의 HTTP export가 없음. 실제 회원가입 호출이 있다면 배포 경로를 확인해 apiEndpoints를 **함수명** 또는 실제 URL 경로로 통일할 것.

---

## 1.2 플로우차트–라우트 불일치 목록

| 위치 | 내용 | 실제 라우트 | 수정 제안 |
|------|------|-------------|-----------|
| SCREEN_FLOWCHARTS.md §2 | 어드민 영역에 `M["/logistics 탁송"]` 단일 노드 | `/logistics/schedule`, `/logistics/history` 존재 | `/logistics`를 `/logistics/schedule`, `/logistics/history` 두 노드로 분리하거나, "탁송(일정/내역)" 라벨로 통합 노드 유지 시 설명 보강 |
| SCREEN_FLOWCHARTS.md §7 | 일반 판매 플로우 마지막에 `E(("완료"))` 사용, 화면 서브그래프에 E 미정의 | `/vehicles/:id/sale/complete` | 노드 E를 `E["/vehicles/:id/sale/complete 완료"]`로 정의하고, 완료 화면으로 연결 |
| SCREEN_FLOWCHARTS.md §2 | 차량·검차·제안·탁송·판매이력·정산만 나열, 차량 상세·등록·일반판매/경매 하위 경로 없음 | 라우트는 38개 이상 | 전역 맵은 허브 수준 유지, 상세 경로는 "탭별 상세 플로우"에서 보완 |

---

## 1.3 NEO GOD Mermaid 규칙 (1페이지)

**헌법 원문**: "평행사변형(입출력), 마름모(분기) 규칙을 엄격히 준수하라."

### 노드 형태 (Mermaid 공식 문법 준수)

| 용도 | Mermaid 문법 | 예시 |
|------|--------------|------|
| **시작/종료** | `(("텍스트"))` 또는 `(텍스트)` | `(("시작"))`, `(("완료"))` |
| **화면(스크린)** | `[ "경로 화면명" ]` | `["/dashboard 대시보드"]` |
| **결정(분기)** | `{ 조건? }` | `{"로그인 성공?"}` |
| **입력** | `[/ 설명 /]` | `[/"이메일, 비밀번호 입력"/]` |
| **출력** | `[\ 설명 \]` | `[\"저장 완료 메시지"\]` |
| **외부/서브 프로세스** | `[[ 설명 ]]` | `[["OCR·Gemini 추출"]]` |

### 규칙 요약

1. **입출력**: 반드시 평행사변형 `[/ /]`(입력), `[\ \]`(출력). 스타디엄 등 다른 형태로 입출력 표현 금지.
2. **분기**: 조건·예/아니오 선택은 마름모 `{ }`만 사용.
3. **화살표 라벨**: 괄호·특수문자 포함 시 따옴표. 예: `-->|"예"|`, `-->|"제출"|`.
4. **서브그래프 ID**: 공백 없이 영문/숫자 권장. 라벨은 대괄호로. 예: `subgraph adminHub [어드민 허브]`.
5. **노드 ID**: 한글 라벨만 쓸 경우 ID는 영문 권장. 예: `S1["/ 랜딩"]`.

### 참조

- [Mermaid Flowchart](https://mermaid.js.org/syntax/flowchart.html)
- NEO GOD 시스템 설계 헌법: "이 지시는 시스템 설계의 헌법이며, 임의로 생략하거나 단순화할 수 없다."
