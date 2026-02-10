# CTA_1 차량원부등록 플로우 노드 — design_context·metadata 반영 갭 분석

**검증 기준**: 각 노드의 `mcp_outputs/{node}/metadata_raw.txt` 및 `design_context_raw.txt`에 명시된 레이아웃·문구·스타일을 구현에 반영했는지 여부. **미반영 항목 = 디버깅(구현) 대상.**

**데이터 소스**: NODE_TO_ROUTE_AND_FILE.md, IA_SITEMAP_SPEC_IPOE.md §4.9, mcp_outputs (CTA_1 차량원부등록 관련 nodeId).  
*1418-20498, 1418-20576은 mcp_outputs 없음 → 본 갭 표에서는 "참조 노드"로만 명시.*

---

## 1. CTA_1 노드 목록 (mcp_outputs 존재 노드)

| nodeId | 화면/역할 | 라우트 | 페이지 | 반영됨 | 미반영·보완 (디버깅 대상) |
|--------|-----------|--------|--------|--------|---------------------------|
| **1425-7638** | 매물등록 버튼 클릭 시 첫화면 (CTA_1 진입) | `/vehicles/new` | VehicleRegisterEntryPage | ✅ 1425:7678 669×350, 제목 "빠르고 간편하게! 완벽한 비대면 차량등록", 입력 669×175, placeholder "123가 4567", 다음 버튼 | ✅ **반영 완료** — SSOT_ERROR_ALREADY_REGISTERED 상수 추가, 1425:7683 에러 문구 SSOT (2025-02-10) |
| **1425-7684** | 차량 원부등록 (2단계 화면, 등록됨) | `/vehicles/new/step1` | VehicleRegisterStep1Page | ✅ 1425:7685 971×1313, 1425:7687 좌측 358×1058, 행 68px, 입력 286×40, 수정 68×40, 라벨 145px | ✅ **반영 완료** — 말소등록일 SSOT 유지(metadata "말소등쪽일" 오타 주석), data-node-id 1425:7685·7687 이미 적용 (2025-02-10) |
| **1425-8153** | 나의매물목록 전체 (차량목록 탭) | `/vehicles` | VehicleListPage | ✅ 249px 사이드바, 제목 159×44, 그리드 972px, 카드 314×291, 페이지네이션 970×114, 매물등록 버튼 | ✅ **반영 완료** — 1425:8237 그리드·1425:8239 카드 래퍼 data-node-id, gap 15px·min-h-[291px] (2025-02-10) |

**참조 노드 (mcp_outputs 없음)**  
- 1418-20498: 차량등록 비대면 랜딩·원부등록-2/-1 → VehicleRegisterEntryPage, Step1/Step2  
- 1418-20576: 차량등록완료 확인 → VehicleRegistrationCompletePage (`/vehicles/:vehicleId/complete`)

---

## 2. 노드별 metadata 주요 수치 (SSOT)

- **1425:7678** (1425-7638) — 669×350 중앙 그룹, 1425:7680 입력 박스 669×175, 1425:7681 placeholder "123가 4567", 1425:7683 에러 "※ 이미 등록 또는 거래된 매물입니다"
- **1425:7685** (1425-7684) — 971×1313 메인, **1425:7687** 좌측 358×1058, 행 그룹 365×68, 입력 286×40, 수정 68×40, 라벨 145px
- **1425:8237** (1425-8153) — 972×1271.738 메인, **1425:8239** 카드 314×291, 1425:8211 페이지네이션 970×114

---

## 3. 권장 보완 순서 (디버깅 = 구현 대상)

1. **1425-7638** — VehicleRegisterEntryPage: 에러 문구 1425:7683 "※ 이미 등록 또는 거래된 매물입니다" SSOT 검증 및 반영.
2. **1425-7684** — VehicleRegisterStep1Page: 라벨 **말소등록일** (metadata 오타 "말소등쪽일" 정정), 우측 열 1425:7754·rounded/shadow design_context 반영.
3. **1425-8153** — VehicleListPage: 메인 972px, 카드 314×291, gap 15px, 페이지네이션 970×114 검증 및 data-node-id 보강.
4. **최종** — CTA_1 갭 문서 "미반영" → "반영 완료" 갱신, 필요 시 리팩토링(중복 제거·상수화).

---

## 4. 디버깅 플로우 (CTA_2·CTA_4와 동일)

1. **대상 nodeId 확정** — 위 표 "미반영·보완" 열.
2. **노드별 mcp_outputs 읽기** — metadata_raw.txt, design_context_raw.txt(또는 내부 경로) 전부 read.
3. **레이아웃·문구 추출** — (width, height), rounded, shadow, 제목/부제/버튼/라벨 텍스트 테이블화.
4. **해당 라우트·페이지 코드 수정** — SSOT 픽셀·문구 그대로 적용.
5. **구현 후 검증** — 항목별 대조, 갭 문서 "미반영" → "반영 완료" 갱신.

---

## 5. 이번 SSOT 반영 요약 (2025-02-10)

- **1425-7638** — VehicleRegisterEntryPage: SSOT_ERROR_ALREADY_REGISTERED 상수 추가, 1425:7683 에러 문구 SSOT.
- **1425-7684** — VehicleRegisterStep1Page: 말소등록일 라벨 유지(metadata 오타 주석), 1425:7685·7687 data-node-id 확인.
- **1425-8153** — VehicleListPage: 그리드 1425:8237, 카드 래퍼 1425:8239 data-node-id, gap 15px·min-h-[291px]·972px.

---

*문서 버전: 1.1 | 최종 업데이트: 2025-02-10*
