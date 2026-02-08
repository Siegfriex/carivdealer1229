/**
 * Responsive Utilities Tests
 */

import { describe, test, expect } from 'vitest';
import { pxToVw, vwToPx, svgToVw, svgToClamp, gridColumnWidth } from './responsive';

describe('Responsive Utilities', () => {
  test('pxToVw 변환', () => {
    expect(pxToVw(720)).toBe(50);  // 720px = 50vw at 1440px
    expect(pxToVw(144)).toBe(10);  // 144px = 10vw at 1440px
    expect(pxToVw(1440)).toBe(100); // 1440px = 100vw
  });

  test('vwToPx 변환', () => {
    expect(vwToPx(50)).toBe(720);  // 50vw = 720px at 1440px
    expect(vwToPx(10)).toBe(144);  // 10vw = 144px at 1440px
    expect(vwToPx(100)).toBe(1440); // 100vw = 1440px
  });

  test('svgToVw 문자열 변환', () => {
    expect(svgToVw(720)).toBe('50.00vw');
    expect(svgToVw(144)).toBe('10.00vw');
  });

  test('svgToClamp CSS 함수 생성', () => {
    const result = svgToClamp(48);
    expect(result).toContain('clamp');
    expect(result).toContain('3.33vw');
    expect(result).toContain('48px');
  });

  test('gridColumnWidth 계산', () => {
    const width = gridColumnWidth(3, 24);
    expect(width).toBeCloseTo(32.22, 2);  // (1440 - 24*2) / 3 → 464px → 32.22vw
  });
});
