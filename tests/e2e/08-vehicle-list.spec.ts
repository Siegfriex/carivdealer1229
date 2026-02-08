/**
 * E2E Test: 차량 목록
 */

import { test, expect } from '@playwright/test';

test.describe('차량 목록', () => {
  test('차량 목록 페이지 - 그리드/리스트 뷰', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/vehicles');

    // 페이지 제목이 나타날 때까지 대기 (networkidle 대신)
    await page.waitForSelector('text=나의 매물 목록', { timeout: 10000 });

    // Header + Sidebar 확인
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('aside')).toBeVisible();
    
    // 리스트 뷰 스크린샷
    await page.screenshot({
      path: 'tests/screenshots/08-vehicle-list-list-view.png',
      fullPage: true,
    });
    
    // 그리드 뷰로 전환 (이미 그리드 뷰가 기본)
    const gridButton = page.locator('button[aria-label="그리드 뷰"]');
    if (await gridButton.count() > 0) {
      await gridButton.click();
      await page.waitForTimeout(500);
    }
    await page.screenshot({
      path: 'tests/screenshots/08-vehicle-list-grid-view.png',
      fullPage: true,
    });

    // 검색 기능 테스트 (실제 placeholder: "차량번호/모델명")
    const searchInput = page.locator('input[placeholder="차량번호/모델명"]');
    if (await searchInput.count() > 0) {
      await searchInput.fill('Carnival');
      await page.waitForTimeout(500);
    }
    await page.screenshot({
      path: 'tests/screenshots/08-vehicle-list-search.png',
      fullPage: true,
    });
  });
});
