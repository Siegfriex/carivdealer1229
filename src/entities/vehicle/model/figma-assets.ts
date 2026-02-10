/**
 * Figma 1636-10115 (VehicleCard) 에셋 URL 상수
 *
 * - Figma API/MCP URL은 인증이 필요해 직접 다운로드할 수 없습니다.
 * - 구분선: 디자인에서는 img Line 80 → 구현은 border 사용.
 * - 상태 점: 디자인에서는 Ellipse 이미지 → 구현은 rounded-full + VEHICLE_STATUS_COLORS_1636 색상 사용.
 * - 아래 URL은 placeholder/참조용이며, 나중에 CDN 또는 Storage URL로 교체할 수 있습니다.
 */

/** 차량 카드 placeholder 이미지 (Figma 1636-10132 등) — 이미지 없음 fallback 시 선택 사용 */
export const FIGMA_ASSET_VEHICLE_PLACEHOLDER =
  'https://www.figma.com/api/mcp/asset/bf6e272b-3ee0-4ea6-8472-4a1f7b63833f';

/** 구분선 (Figma Line 80) — 구현 시 border 사용 권장 */
export const FIGMA_ASSET_LINE_DIVIDER =
  'https://www.figma.com/api/mcp/asset/468105c4-e5a6-4973-86c8-b25ac8a165a0';

/** 상태 점 Ellipse 에셋 (참조용, 구현은 rounded-full + 색상 사용) */
export const FIGMA_ASSET_ELLIPSE_STATUS = {
  /** 검차 신청완료 #0ea5e9 */
  inspectionRequested: 'https://www.figma.com/api/mcp/asset/c28b79b0-1406-43db-942a-78cfef77641d',
  /** 검차 진행중 #10b981 */
  inspectionInProgress: 'https://www.figma.com/api/mcp/asset/a7424f9f-cce6-4763-8ec1-f6312338a321',
  /** 검차완료 #5b78cd */
  inspectionComplete: 'https://www.figma.com/api/mcp/asset/344ad000-d8a0-4072-9cc6-80ca0120a481',
  /** 거래중 #ff7575 */
  trading: 'https://www.figma.com/api/mcp/asset/36d8b185-9cf1-436b-9491-0efe5e1fa270',
  /** 기타 상태들 (참조용) */
  ellipse48: 'https://www.figma.com/api/mcp/asset/78d09107-b30c-4a9c-9f09-1721bca05650',
  ellipse49: 'https://www.figma.com/api/mcp/asset/5076b0dc-da8d-447d-aa1e-2906729dc150',
  ellipse50: 'https://www.figma.com/api/mcp/asset/850237af-5497-4cfe-8953-eb2f35cf9ea9',
  ellipse51: 'https://www.figma.com/api/mcp/asset/c2113b56-c2d5-468f-97a1-442144e2f932',
  ellipse52: 'https://www.figma.com/api/mcp/asset/a8830d99-0dbc-4a4a-bbe1-10c8e08c6b28',
  ellipse53: 'https://www.figma.com/api/mcp/asset/91a8b52e-ef8c-4532-8363-5d2518014bbb',
} as const;
