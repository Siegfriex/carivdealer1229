/**
 * E2E Test: 탁송 플로우 (플로우차트 정합)
 * /logistics/schedule, /logistics/history 진입 및 주요 UI 노출
 */

import { test, expect } from '@playwright/test';

test.describe('탁송 플로우', () => {
  test('탁송 예약/배차 페이지 진입', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/logistics/schedule');
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'tests/screenshots/10-logistics-schedule.png',
      fullPage: true,
    });

    await expect(page.getByRole('heading', { name: '탁송 예약/배차' })).toBeVisible();
    await expect(page.getByRole('heading', { name: '희망 날짜 선택' })).toBeVisible();
  });

  test('탁송 내역 페이지 진입', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/logistics/history');
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'tests/screenshots/10-logistics-history.png',
      fullPage: true,
    });

    await expect(page.getByRole('heading', { name: '탁송 내역' })).toBeVisible();
  });
});
