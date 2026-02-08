# Figma 스크린샷 (SSOT 레퍼런스)

Figma Dev MCP로 수집한 검차 플로우 노드 스크린샷의 레퍼런스입니다.

**Figma 파일**: Domestic Seller 1.0 — `fileKey`: `4w3ft8RpGwoho5EtvNO9hQ`

## 노드 목록 (검차 플로우 9개)

| 노드 ID (MCP) | 화면 | 로컬 스크린샷 대응 |
|---------------|------|---------------------|
| 915:998 | 차량등록 완료 (2-2) | 19-vehicle-complete-to-inspection.png |
| 1202:6390 | 검차신청 랜딩 (3) | 21-inspection-request-landing.png |
| 1202:6685 | 검차 신청 목록 (4) | 22-inspection-list-initial.png |
| 1202:7020 | 목록 확장 단일 (4-1) | 23-inspection-list-expanded-single.png |
| 1202:7204 | 목록 확장 전체 (4-1-1) | 24-inspection-list-expanded-multiple.png |
| 1202:7440 | 검차 진행 매칭중 (5) | 25-inspection-progress-matching.png |
| 1202:7752 | 검차 진행 이동중 (5-1) | 26-inspection-progress-en-route.png |
| 1202:7902 | 검차 진행 완료 (5-2) | 27-inspection-progress-complete.png |
| 1202:7588 | 검차내역 (6) | 28-inspection-history.png |

## 스크린샷 수집 방법

Figma MCP 도구로 노드별 스크린샷을 가져옵니다.

- `mcp_Figma_get_screenshot(nodeId, fileKey)` — 예: nodeId `915:998`, fileKey `4w3ft8RpGwoho5EtvNO9hQ`
- 노드 ID는 URL 형식 `XXXX-YYYY`가 아닌 **콜론** 형식 `XXXX:YYYY` 사용

정합성 측정 시 로컬 스크린샷(Playwright 1440×900)과 Figma 스크린샷을 나란히 비교합니다.
