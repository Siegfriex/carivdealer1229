/**
 * 라운드4 에이전트 C — §3.6 검차 (사이클 18) 검차 완료·결과 요약 페이지 러닝 스크린샷 캡처
 * 참조: FIGMASCR0208/§3.6_검차/ §3.6_1425-10813_검차진행_완료.png, §3.6_1425-10285_검차결과요약*.png
 * 캡처: /inspections/:inspectionId/complete
 */

import { test, expect } from '@playwright/test';

test.describe('라운드4 에이전트 C — 검차 완료·결과 요약 §3.6 (사이클 18) 캡처', () => {
  test.setTimeout(60000);

  test('검차내역(결과 요약) 페이지 캡처', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });

    await page.goto('/inspections/insp-4/complete');
    await page.waitForLoadState('domcontentloaded');
    await expect(page.getByRole('heading', { name: '검차내역', level: 1 })).toBeVisible({ timeout: 15000 });
    await page.screenshot({
      path: 'tests/screenshots/round4-c-inspection-complete.png',
      fullPage: true,
    });
  });
});
