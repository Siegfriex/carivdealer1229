/**
 * E2E Test: 전체 화면 스크린샷 수집
 * 모든 페이지의 스크린샷을 1440px, 700px 해상도로 캡처
 */

import { test, expect } from '@playwright/test';

const pages = [
  { path: '/', name: '00-landing' },
  { path: '/login', name: '01-login' },
  { path: '/signup', name: '02-signup-entry' },
  { path: '/signup/step1', name: '03-signup-step1' },
  { path: '/signup/step2', name: '04-signup-step2' },
  { path: '/signup/step3', name: '05-signup-step3' },
  { path: '/signup/step4', name: '06-signup-step4' },
  { path: '/signup/step5', name: '07-signup-step5' },
  { path: '/signup/pending', name: '08-signup-pending' },
  { path: '/signup/complete', name: '09-signup-complete' },
  { path: '/dashboard', name: '10-dashboard' },
  { path: '/vehicles', name: '11-vehicle-list' },
  { path: '/vehicles/new/step1', name: '12-vehicle-register-step1' },
  { path: '/inspections/request/step1', name: '13-inspection-request-step1' },
  { path: '/inspections/request/step2', name: '14-inspection-request-step2' },
  { path: '/inspections/insp-001/progress', name: '16-inspection-progress' },
  { path: '/inspections/insp-001/complete', name: '17-inspection-complete' },
  { path: '/vehicles/v-001/complete', name: '18-vehicle-complete' },
  // 검차 플로우 (SSOT·정합성 측정용)
  { path: '/inspections', name: '30-inspection-list' },
  { path: '/inspections/request', name: '31-inspection-request-landing' },
  { path: '/inspections/history', name: '32-inspection-history' },
  { path: '/vehicles/v-001', name: '33-vehicle-detail' },
  { path: '/logistics/schedule', name: '34-logistics-schedule' },
  { path: '/logistics/history', name: '35-logistics-history' },
];

// Firebase/React Query 등으로 networkidle이 안정되지 않는 페이지는 domcontentloaded + 대기 사용
const STABLE_PATHS = ['/dashboard', '/vehicles', '/vehicles/v-001'];
function waitStable(page: import('@playwright/test').Page) {
  return page.waitForLoadState('domcontentloaded').then(() => page.waitForTimeout(2500));
}

test.describe('전체 화면 스크린샷', () => {
  for (const pageInfo of pages) {
    test(`${pageInfo.name} - 1440px`, async ({ page }) => {
      await page.setViewportSize({ width: 1440, height: 900 });
      await page.goto(pageInfo.path);
      if (STABLE_PATHS.some((p) => pageInfo.path.startsWith(p))) {
        await waitStable(page);
      } else {
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);
      }
      await page.screenshot({
        path: `tests/screenshots/${pageInfo.name}-1440px.png`,
        fullPage: true,
      });
    });

    test(`${pageInfo.name} - 700px`, async ({ page }) => {
      await page.setViewportSize({ width: 700, height: 900 });
      await page.goto(pageInfo.path);
      if (STABLE_PATHS.some((p) => pageInfo.path.startsWith(p))) {
        await waitStable(page);
      } else {
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(500);
      }
      await page.screenshot({
        path: `tests/screenshots/${pageInfo.name}-700px.png`,
        fullPage: true,
      });
    });
  }

  test('MobileBlocker - 699px', async ({ page }) => {
    await page.setViewportSize({ width: 699, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(500);
    await page.screenshot({
      path: 'tests/screenshots/99-mobile-blocker-699px.png',
      fullPage: false,
    });
    
    await expect(page.locator('#mobile-blocker')).toBeVisible();
    await expect(page.locator('text=데스크톱에서 접속해주세요')).toBeVisible();
  });
});
