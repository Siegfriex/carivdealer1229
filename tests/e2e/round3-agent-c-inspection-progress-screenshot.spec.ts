/**
 * 라운드3 에이전트 C — §3.6 검차 (사이클 17) 검차 진행 페이지 러닝 스크린샷 캡처
 * 참조: FIGMASCR0208/§3.6_검차/ §3.6_1425-10137_검차진행_매칭중*.png (10663 픽업/이동중은 10137 변형 참고)
 * 캡처: /inspections/:id/progress?stage=matching|en_route|complete
 */

import { test, expect } from '@playwright/test';

test.describe('라운드3 에이전트 C — 검차 진행 §3.6 (사이클 17) 캡처', () => {
  test.setTimeout(60000);

  test('검차 진행 매칭중·이동중·완료 캡처', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    // 1) 검차자 매칭중 — 1425:10137
    await page.goto('/inspections/insp-1/progress?stage=matching');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: /검차 진행상황/ })).toBeVisible({ timeout: 15000 });
    await page.screenshot({
      path: 'tests/screenshots/round3-c-inspection-progress-matching.png',
      fullPage: true,
    });

    // 2) 검차자 이동중 — 1425:10663
    await page.goto('/inspections/insp-1/progress?stage=en_route');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByText(/검차자 이동중/)).toBeVisible({ timeout: 10000 });
    await page.screenshot({
      path: 'tests/screenshots/round3-c-inspection-progress-en-route.png',
      fullPage: true,
    });

    // 3) 검차완료 — 1425:10813
    await page.goto('/inspections/insp-1/progress?stage=complete');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: '검차완료' })).toBeVisible({ timeout: 10000 });
    await page.screenshot({
      path: 'tests/screenshots/round3-c-inspection-progress-complete.png',
      fullPage: true,
    });
  });
});
