/**
 * E2E Test: 랜딩페이지
 * 디자인: design/landing/로그인 후 랜딩페이지_첫 사용자.svg
 */

import { test, expect } from '@playwright/test';

test.describe('랜딩페이지', () => {
  test('랜딩페이지 렌더링 및 스크린샷', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 헤더 (Figma 1198-6958 2단) 노출 확인
    await expect(page.getByText(/FORWARD/)).toBeVisible();
    // 제목 또는 CTA 확인 (랜딩 본문 h1, MobileBlocker 제외)
    await expect(page.getByRole('heading', { level: 1 }).filter({ hasNotText: '데스크톱에서 접속해주세요' }).first()).toBeVisible();
    await page.screenshot({
      path: 'tests/screenshots/01-landing-desktop-1440px.png',
      fullPage: true,
    });
    
    // 700px (최소 지원 해상도)
    await page.setViewportSize({ width: 700, height: 900 });
    await page.screenshot({
      path: 'tests/screenshots/01-landing-desktop-700px.png',
      fullPage: true,
    });
    
    // 699px (MobileBlocker 표시)
    await page.setViewportSize({ width: 699, height: 900 });
    await page.screenshot({
      path: 'tests/screenshots/01-landing-mobile-blocker.png',
      fullPage: false,
    });
    await expect(page.locator('#mobile-blocker')).toBeVisible();
    await expect(page.locator('text=데스크톱에서 접속해주세요')).toBeVisible();
    
    // CTA 버튼 클릭 테스트
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await page.click('text=지금 시작하기');
  });
});
