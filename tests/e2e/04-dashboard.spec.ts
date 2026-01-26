/**
 * E2E Test: 대시보드
 * 디자인:
 * - design/design_vehicle_dashboard/매물 등록 관리_그리드 뷰1.svg
 * - design/design_vehicle_dashboard/매물 등록 관리_리스트 뷰2.svg
 */

import { test, expect } from '@playwright/test';

test.describe('대시보드', () => {
  test('대시보드 그리드/리스트 뷰 전환', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/dashboard');
    await page.waitForLoadState('networkidle');
    
    // Header + Sidebar 확인
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('aside')).toBeVisible();
    
    // 그리드 뷰 스크린샷
    await page.screenshot({
      path: 'tests/screenshots/04-dashboard-grid-view.png',
      fullPage: true,
    });
    
    // 리스트 뷰로 전환
    await page.click('button[aria-label="리스트 뷰"]');
    await page.waitForTimeout(500); // 애니메이션 대기
    await page.screenshot({
      path: 'tests/screenshots/04-dashboard-list-view.png',
      fullPage: true,
    });
    
    // 다시 그리드 뷰로 전환
    await page.click('button[aria-label="그리드 뷰"]');
    await page.waitForTimeout(500);
    
    // 차량 등록 버튼 클릭
    await page.click('text=차량 등록');
  });
});
