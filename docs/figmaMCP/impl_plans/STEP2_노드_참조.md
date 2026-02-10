# /vehicles/new/step2 — Figma 노드 참조 (폐지)

**상태**: **라우트·페이지 제거됨** (2025-02-10). 차량 원부등록(step1) 다음은 검차신청(`/inspections/request`)으로 직행.

**이전 라우트**: `http://localhost:3000/vehicles/new/step2`  
**이전 페이지**: `VehicleRegisterStep2Page` (삭제됨)

---

## 1. Figma 노드 (문서·아카이브 기준)

| nodeId (하이픈) | IA 화면 라벨 | 용도 |
|-----------------|---------------|------|
| **1418-20576** | 등록 step2 (추가정보·제출) / 차량등록완료 확인 / 판매 전환 완료 | step2 폼 화면·완료 화면 등 **동일 프레임 다용도** |
| **1418-21868** | step2 확인 화면 / 거래 목록 | step2 확인·거래 목록 |

**출처**:  
- `docs/archive/.../FIGMA_IA_FSD_STRUCTURE.md` — 차량 등록 step2: 1418:20576 (추가정보·제출), 1418:21868 (확인)  
- `VehicleRegisterStep2Page.tsx` 주석: "Figma 1418-20576"  
- `NODE_TO_ROUTE_AND_FILE.md`: 1418-20576 → 차량등록완료 확인 (`/vehicles/:vehicleId/complete`)로도 매핑됨 (동일 노드 재사용)

---

## 2. mcp_outputs 현황

| nodeId | mcp_outputs 폴더 | 비고 |
|--------|------------------|------|
| 1418-20576 | **없음** | MCP `get_metadata` / `get_design_context`로 추출 필요 |
| 1418-21868 | **없음** | MCP로 추출 필요 |

**경로**: `docs/figmaMCP/mcp_outputs/`  
현재 CTA_1 관련으로는 **1425-7638**, **1425-7684** 등만 있고, **1418-20576**, **1418-21868** 폴더는 없음.

---

## 3. step2 디자인 반영 시 절차

1. **Figma MCP로 아웃풋 생성**  
   - fileKey: `4w3ft8RpGwoho5EtvNO9hQ` (Domestic-Seller 1.0)  
   - nodeId: `1418:20576`, `1418:21868`  
   - `get_metadata`, `get_design_context` 호출 후 `mcp_outputs/1418-20576/`, `mcp_outputs/1418-21868/`에 저장  
2. **갭 분석**  
   - `metadata_raw.txt`, `design_context_raw.txt` 기준으로 VehicleRegisterStep2Page 레이아웃·문구·스타일 대조  
3. **구현 반영**  
   - 픽셀·문구·data-node-id 등 SSOT 반영

---

## 4. Figma URL

- 1418-20576: https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-20576  
- 1418-21868: https://www.figma.com/design/4w3ft8RpGwoho5EtvNO9hQ/Domestic-Seller-1.0?node-id=1418-21868  

---

*문서 버전: 1.0 | 최종 업데이트: 2025-02-10*
