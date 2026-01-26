/**
 * E2E Test: 차량 목록
 */

import { test, expect } from '@playwright/test';

test.describe('차량 목록', () => {
  test('차량 목록 페이지 - 그리드/리스트 뷰', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/vehicles');
    await page.waitForLoadState('networkidle');
    
    // Header + Sidebar 확인
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('aside')).toBeVisible();
    
    // 리스트 뷰 스크린샷
    await page.screenshot({
      path: 'tests/screenshots/08-vehicle-list-list-view.png',
      fullPage: true,
    });
    
    // 그리드 뷰로 전환
    await page.click('button[aria-label="그리드 뷰"]');
    await page.waitForTimeout(500);
    await page.screenshot({
      path: 'tests/screenshots/08-vehicle-list-grid-view.png',
      fullPage: true,
    });
    
    // 검색 기능 테스트
    await page.fill('input[placeholder*="검색"]', 'Carnival');
    await page.waitForTimeout(500);
    await page.screenshot({
      path: 'tests/screenshots/08-vehicle-list-search.png',
      fullPage: true,
    });
  });
});
