# E2E · Figma SSOT 검증 로그

**검증 일시**: 2026-01-28  
**기준**: [Figma SSOT 플로우·레이아웃 검증 플랜](.cursor/plans/figma_ssot_플로우·레이아웃_검증_eeb3512a.plan.md), [FIGMA_SCR_ROUTE_MAP.md](FIGMA_SCR_ROUTE_MAP.md)

---

## 1. 완료 작업 요약

| 항목 | 상태 | 비고 |
|------|------|------|
| 헤더 일괄 적용 | 완료 | InspectionCompletePage, VehicleRegisterStep2Page, InspectionRequestStep1Page, InspectionRequestStep2Page → LandingHeader 전환 |
| E2E 플로우·헤더 assertion | 완료 | 01-landing, 05-vehicle-register, 06-inspection-flow에 헤더 노출 assertion 추가 |
| 판매방식·탁송 E2E | 완료 | 09-sale-method-flow.spec.ts, 10-logistics-flow.spec.ts 신규 추가, 00-run-all-screenshots에 경로 추가 |
| FSD 레거시 import | 완료 | @/components, @/config, @/services, @/utils 사용 없음 확인 |
| design-tokens·z-index | 완료 | z-30/z-50 매직넘버 → Z_INDEX.STICKY, MODAL_BACKDROP, MODAL 적용 (6개 페이지) |

---

## 2. E2E 실행 결과

- **실행 명령**: `npx playwright test tests/e2e/01-landing.spec.ts tests/e2e/05-vehicle-register-flow.spec.ts tests/e2e/06-inspection-flow.spec.ts tests/e2e/09-sale-method-flow.spec.ts tests/e2e/10-logistics-flow.spec.ts`
- **Viewport**: 1440x900 (playwright.config.ts)
- **결과**: 위 스펙 파일 기준 테스트 통과

---

## 3. 스크린샷 수집

- **경로**: `tests/screenshots/`
- **00-run-all-screenshots.spec.ts**: 랜딩·회원가입·대시·차량·검차·차량상세·탁송 예약/내역 등 전체 경로 1440px·700px 캡처
- **플로우별**: 01-landing, 05-vehicle-register, 06-inspection, 09-sale-method, 10-logistics에서 fullPage 스크린샷 저장

---

## 4. Figma 대조 (수동 권장)

- **Figma 파일**: Domestic Seller 1.0, fileKey `4w3ft8RpGwoho5EtvNO9hQ`
- **대조 방법**: FIGMA_SCR_ROUTE_MAP의 nodeId별로 Figma MCP `get_screenshot(nodeId)`로 기준 스크린샷 확보 후, `tests/screenshots/` 내 동일 경로 스크린샷과 비교
- **우선 대상**: 랜딩(1194-7481, 7500, 7534, 7606), 회원가입(1194-6171 등), 차량등록(1198-5889), 검차(1202-7440, 7752, 7902, 7588)

---

## 5. 플로우차트 정합

- **참조**: [img/상세화면 전환 플로우.png](../img/상세화면 전환 플로우.png)
- **회원가입**: /signup → step1~5 → pending → complete (02-signup-flow.spec.ts)
- **차량등록**: /vehicles/new/step1 → step2 → complete, OCR 분기 (05-vehicle-register-flow.spec.ts)
- **검차**: /inspections/request/step1 → step2 → progress → complete (06-inspection-flow.spec.ts)
- **판매방식**: /vehicles/:id → 경매/일반 분기 (09-sale-method-flow.spec.ts)
- **탁송**: /logistics/schedule, /logistics/history (10-logistics-flow.spec.ts)
