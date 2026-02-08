/**
 * E2E Test: 차량 등록 완료
 * 디자인: design/design_vehicle_input/vehicle_input_45/매물 등록 관리_차량5 차량등록완료.svg
 */

import { test, expect } from '@playwright/test';

test.describe('차량 등록 완료', () => {
  test('차량 등록 완료 페이지 스크린샷', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/vehicles/v-001/complete');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({
      path: 'tests/screenshots/07-vehicle-registration-complete.png',
      fullPage: true,
    });
    
    await expect(page.locator('text=차량 등록이 완료되었습니다')).toBeVisible();
    await expect(page.locator('text=경매로 판매하기')).toBeVisible();
    await expect(page.locator('text=일반 판매하기')).toBeVisible();
  });
});
