/**
 * Responsive Utilities
 * 1440px 기준 반응형 계산 함수
 */

const BASE_WIDTH = 1440;

/**
 * vw 값을 px로 변환
 * @param vw - vw 단위 값
 * @param baseWidth - 기준 너비 (기본값: 1440px)
 * @returns px 값
 */
export const vwToPx = (vw: number, baseWidth = BASE_WIDTH): number => {
  return (vw / 100) * baseWidth;
};

/**
 * px 값을 vw로 변환
 * @param px - px 단위 값
 * @param baseWidth - 기준 너비 (기본값: 1440px)
 * @returns vw 값
 */
export const pxToVw = (px: number, baseWidth = BASE_WIDTH): number => {
  return (px / baseWidth) * 100;
};

/**
 * SVG 좌표(1440px 기준)를 vw 문자열로 변환
 * @param svgValue - SVG 파일의 px 값
 * @returns "X.XXvw" 형식 문자열
 * 
 * @example
 * svgToVw(720) // "50vw" (1440px의 절반)
 * svgToVw(144) // "10vw"
 */
export const svgToVw = (svgValue: number): string => {
  return `${pxToVw(svgValue).toFixed(2)}vw`;
};

/**
 * SVG 좌표를 clamp() CSS 함수로 변환
 * @param svgValue - SVG 파일의 px 값
 * @param minPx - 최소 px 값 (선택)
 * @returns clamp() CSS 문자열
 * 
 * @example
 * svgToClamp(48) // "clamp(32px, 3.33vw, 48px)"
 */
export const svgToClamp = (
  svgValue: number,
  minPx: number = svgValue * 0.67
): string => {
  const vw = pxToVw(svgValue).toFixed(2);
  return `clamp(${minPx}px, ${vw}vw, ${svgValue}px)`;
};

/**
 * 1440px 기준 그리드 간격 계산
 * @param columns - 컬럼 수
 * @param gap - 간격 (px)
 * @returns 컬럼 너비 (vw)
 */
export const gridColumnWidth = (columns: number, gap: number = 24): number => {
  const totalGap = gap * (columns - 1);
  const availableWidth = BASE_WIDTH - totalGap;
  const columnWidth = availableWidth / columns;
  return pxToVw(columnWidth);
};

/**
 * 반응형 브레이크포인트
 */
export const BREAKPOINTS = {
  mobile: 699,
  desktop: 700,
  wide: 1440,
} as const;

/**
 * 미디어 쿼리 헬퍼
 */
export const mediaQuery = {
  mobile: `@media (max-width: ${BREAKPOINTS.mobile}px)`,
  desktop: `@media (min-width: ${BREAKPOINTS.desktop}px)`,
  wide: `@media (min-width: ${BREAKPOINTS.wide}px)`,
} as const;
