/**
 * E2E: GNB 탭 전용 미니 사이드바 검증
 * 검차/거래/탁송/정산 탭 진입 시 "구역 + 검색만" 사이드바가 노출되는지 확인.
 * 보호된 라우트이므로 인증 상태를 설정한 뒤 접근.
 */

import { test, expect } from '@playwright/test';

const AUTH_STORAGE_KEY = 'carivdealer_auth';

const GNB_ROUTES: { path: string; sectionTitle: string }[] = [
  { path: '/inspections', sectionTitle: '검차' },
  { path: '/offers', sectionTitle: '거래' },
  { path: '/logistics/schedule', sectionTitle: '탁송' },
  { path: '/logistics/history', sectionTitle: '탁송' },
  { path: '/settlements', sectionTitle: '정산' },
];

async function setAuthenticated(page: import('@playwright/test').Page) {
  await page.goto('/');
  await page.evaluate((key) => {
    localStorage.setItem(key, 'true');
  }, AUTH_STORAGE_KEY);
}

test.describe('GNB 미니 사이드바', () => {
  test.beforeEach(async ({ page }) => {
    await setAuthenticated(page);
  });

  for (const { path, sectionTitle } of GNB_ROUTES) {
    test(`${path} → 구역 "${sectionTitle}" + 검색만 노출`, async ({ page }) => {
      await page.goto(path);
      await page.waitForLoadState('domcontentloaded');

      const sidebar = page.getByTestId('gnb-minimal-sidebar');
      await expect(sidebar).toBeVisible({ timeout: 10000 });

      const sectionEl = page.getByTestId('gnb-sidebar-section');
      await expect(sectionEl).toHaveText(sectionTitle);

      await expect(sidebar.locator('input[aria-label="검색"]')).toBeVisible();
      const mainSidebarList = page.locator('aside a[href*="/vehicles?filter="]');
      await expect(mainSidebarList).toHaveCount(0);
    });
  }
});
