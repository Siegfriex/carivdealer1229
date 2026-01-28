# ReNew – 잠재 위험·기회·픽스 요인

**기준**: ReNew README + Figma Domestic Seller 1.0 이식 작업  
**검증일**: 2025-01-28  
**대상**: `ReNew/` 문서 및 `src/` 코드베이스 대조

---

## 1. 픽스된 요인 (이미 해결·반영된 것)

| 항목 | 내용 | 검증 방법 |
|------|------|-----------|
| **Figma 컴포넌트 4종 구현** | SegmentedControl, MessageModal, PillChip, DateRangePicker 가 `src/shared/ui/` 에 존재 | `glob` + 파일 내용 확인 |
| **빌드·린트** | IMPLEMENTATION_LOG 기준 린트 에러 없음, `npm run build` 성공 | 문서 명시 |
| **첫 홈/랜딩 대응** | LandingPage + LandingHeader (variant=landing) 구현 | FIGMA_DESIGN_SPEC §2 ↔ `pages/landing`, `widgets/Header/ui/LandingHeader.tsx` |
| **로그인 후 메인 랜딩 대응** | DashboardPage + LandingHeader(variant=main) + MainLandingSidebar + VehicleCard(variant=mainLanding) | FIGMA_DESIGN_SPEC §2-2, §5 ↔ DashboardPage.tsx import/사용 |
| **타이포/디자인 토큰** | 1440px 기준 타입 스케일·폰트·spacing이 design-tokens.css + TYPOGRAPHY_SYSTEM.md와 일치 | design-tokens.css 주석·변수명 vs TYPOGRAPHY_SYSTEM.md 테이블 |
| **Figma→코드 매핑 문서화** | COMPONENT_SUMMARY.md에 Figma 컴포넌트 정리본(1194-6634)과 코드 경로 매핑 표 존재 | COMPONENT_SUMMARY.md §3 |
| **회원/인증 플로우 문서 대응** | SignupEntry ~ SignupComplete, SignupPending 페이지 존재하고 스펙 문서와 화면명 대응 | FIGMA_DESIGN_SPEC §3, §5 vs `pages/auth/*` |

---

## 2. 잠재 위험 요인

| 위험 | 설명 | 영향도 | 권장 조치 |
|------|------|--------|-----------|
| **신규 4컴포넌트 미사용** | SegmentedControl, MessageModal, PillChip, DateRangePicker 를 import 하는 페이지/위젯이 없음. ReNew는 “구현만 해둠” 상태. | 중 | 필요한 화면(필터·기간 선택·확인 다이얼로그 등)에 실제로 붙이거나, 사용처를 ReNew/IMPLEMENTATION_LOG에 명시해 두기. 미사용이 길어지면 데드 코드·스펙 drift 위험. |
| **Figma 링크 접근 제한** | FIGMA_DESIGN_SPEC 마지막 문구: “비밀번호 설정 시 링크 공유 전 Anyone with the link로 변경 필요.” | 중 | 디자인 확인이 필요한 멤버(또는 다른 에이전트)가 링크로 접근하지 못할 수 있음. 링크 공유 정책 정리 또는 팀 내 접근 방식 통일. |
| **문서–코드 이중 진실** | ReNew는 “Figma → 코드” 작업본인데, 실제 화면은 레거시 래핑(GeneralSaleOffersPage 등 6개)과 신규 FSD 페이지가 혼재. 어디까지가 Figma 반영인지 문서만으로는 한눈에 안 들어옴. | 중 | FIGMA_DESIGN_SPEC 또는 README에 “Figma 반영 완료 화면” vs “래핑/미반영 화면” 구분 표 추가. |
| **날짜 표기 불일치** | IMPLEMENTATION_LOG·FIGMA_DESIGN_SPEC 등에 “2026-01-28” 표기. 연도 오타 가능성. | 낮 | 2025로 통일할지, 실제 작업일이 2026이면 문서 버전 규칙 명시. |
| **VehicleListPage vs Dashboard** | 로그인 후 “전체 차량”은 DashboardPage(MainLandingSidebar + VehicleCard mainLanding). VehicleListPage는 기존 Sidebar + 그리드/리스트 전환. Figma “로그인 후 랜딩”과 1:1인 건 Dashboard이므로, 목록 화면이 두 종류라서 신규 입장자에게 헷갈릴 수 있음. | 낮 | README 또는 FIGMA_DESIGN_SPEC에 “로그인 후 첫 화면 = Dashboard (MainLandingSidebar)” 라고 명시. |
| **RadioGroup 부재** | COMPONENT_SUMMARY: “라디오 리스트 (옵션1, 옵션2, 100건)” → Select 또는 네이티브 radio, “필요 시 RadioGroup 추가” 로만 기록. | 낮 | Figma에서 라디오 리스트가 많이 쓰이면 RadioGroup을 shared/ui에 추가하고 COMPONENT_SUMMARY·IMPLEMENTATION_LOG에 반영. |

---

## 3. 기회 요인

| 기회 | 설명 | 활용 방향 |
|------|------|-----------|
| **신규 4컴포넌트 즉시 활용** | SegmentedControl, MessageModal, PillChip, DateRangePicker 가 이미 구현·빌드 통과 상태. | 필터/탭(세그먼트), 기간 필터(DateRangePicker), 필터 칩(PillChip), 확인/취소 다이얼로그(MessageModal)가 필요한 화면(예: 일반 판매 제안, 탁송, 정산 목록)에 우선 연결. |
| **ReNew를 단일 체크리스트로 사용** | FIGMA_DESIGN_SPEC + COMPONENT_SUMMARY + IMPLEMENTATION_LOG + TYPOGRAPHY_SYSTEM 을 “Figma 이식 작업본”으로 묶어 두었음. | 신규 화면 추가·기존 페이지 Figma 갱신 시 ReNew 문서만 보고 스펙·컴포넌트 매핑·타이포를 한곳에서 확인 가능. |
| **Figma 노드 ID 고정** | 1194-5754(플로우), 1194-6634(컴포넌트 정리), 1194-7425(타이포), 1194-7481(첫 홈), 1194-7664(메인 랜딩) 등 노드 ID가 문서화됨. | Figma Dev Mode·MCP로 같은 노드만 열면 디자인–코드 비교가 쉬움. |
| **타이포/토큰 일치** | TYPOGRAPHY_SYSTEM.md와 design-tokens.css가 1440px·Pretendard·스케일로 맞춰져 있음. | 새 화면은 `text-h1`~`text-caption`, Typography 컴포넌트로 통일하면 Figma와 시각적 일관성 유지 용이. |
| **메인 랜딩 완전 FSD 반영** | DashboardPage가 MainLandingSidebar + LandingHeader(main) + VehicleCard(mainLanding) + Pagination 으로 Figma 1194-7664와 1:1 대응. | 레거시 래핑 페이지를 Figma 기준으로 갱신할 때 이 패턴(위젯+엔티티 variant)을 템플릿으로 재사용. |

---

## 4. 요약

- **픽스됨**: Figma 기준 첫 홈/랜딩·로그인 후 메인 랜딩·타이포/토큰·컴포넌트 4종 구현·매핑 문서는 반영 완료.
- **위험**: 신규 4컴포넌트 미사용(데드 코드·드리프트), Figma 링크 접근 제한, “어디까지 Figma 반영인지” 구분 부재, 날짜 표기.
- **기회**: 4컴포넌트를 실제 화면에 연결, ReNew를 Figma 이식용 단일 체크리스트로 활용, 노드 ID로 Dev Mode/MCP 활용, 메인 랜딩 패턴을 다른 페이지 갱신에 재사용.

이 문서는 ReNew 작업본(README + 하위 문서)과 코드베이스를 대조한 결과를 정리한 것입니다. 주기적으로 “픽스/위험/기회”를 업데이트하면 Figma 이식 진행 상황을 한눈에 관리할 수 있습니다.
