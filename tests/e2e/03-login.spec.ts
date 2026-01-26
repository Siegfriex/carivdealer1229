/**
 * E2E Test: 로그인
 */

import { test, expect } from '@playwright/test';

test.describe('로그인', () => {
  test('로그인 페이지 렌더링 및 스크린샷', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    // 스크린샷
    await page.screenshot({
      path: 'tests/screenshots/03-login.png',
      fullPage: true,
    });
    
    // 요소 확인
    await expect(page.locator('h1')).toContainText('ForwardMax');
    await expect(page.locator('h2')).toContainText('로그인');
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
    
    // 로그인 시도
    await page.fill('input[type="email"]', 'test@example.com');
    await page.fill('input[type="password"]', 'password123');
    await page.screenshot({
      path: 'tests/screenshots/03-login-filled.png',
      fullPage: true,
    });
    
    await page.click('button:has-text("로그인")');
  });
});
