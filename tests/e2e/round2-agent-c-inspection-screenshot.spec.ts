/**
 * 라운드2 에이전트 C — §3.6 검차 (사이클 16) 러닝 스크린샷 캡처
 * 참조: FIGMASCR0208/§3.6_검차/ 8198(Step1), 9445(리스트), 9875(카드뷰)
 * 캡처: /inspections, /inspections/request/step1, /inspections/history
 */

import { test, expect } from '@playwright/test';

test.describe('라운드2 에이전트 C — 검차 §3.6 (사이클 16) 캡처', () => {
  test.setTimeout(60000);

  test('검차 신청목록 리스트·카드, Step1, 검차내역 캡처', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // 1) 검차 신청목록 리스트 — 1425:9445
    await page.goto('/inspections');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: /검차 신청목록/ })).toBeVisible({ timeout: 15000 });
    await page.screenshot({
      path: 'tests/screenshots/round2-c-inspections-list.png',
      fullPage: true,
    });

    // 2) 검차 신청목록 카드뷰 — 1425:9875
    await page.goto('/inspections?view=card');
    await page.waitForLoadState('domcontentloaded');
    await page.screenshot({
      path: 'tests/screenshots/round2-c-inspections-card.png',
      fullPage: true,
    });

    // 3) 검차 신청 Step1 — 1444:8198
    await page.goto('/inspections/request/step1');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: /검차 신청/ })).toBeVisible({ timeout: 10000 });
    await page.screenshot({
      path: 'tests/screenshots/round2-c-inspection-step1.png',
      fullPage: true,
    });

    // 4) 검차내역 리스트
    await page.goto('/inspections/history');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: /검차내역/ })).toBeVisible({ timeout: 10000 });
    await page.screenshot({
      path: 'tests/screenshots/round2-c-inspection-history-list.png',
      fullPage: true,
    });

    // 5) 검차내역 카드뷰
    await page.goto('/inspections/history?view=card');
    await page.waitForLoadState('domcontentloaded');
    await page.screenshot({
      path: 'tests/screenshots/round2-c-inspection-history-card.png',
      fullPage: true,
    });
  });
});
