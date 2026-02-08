/**
 * 라운드3 에이전트 A — §3.4 차량 목록 (사이클 7) 러닝 스크린샷 캡처
 * IA·기존 코드 SSOT (FIGMASCR0208 §3.4 전용 폴더 없음)
 * nodeId: 1418:15565(등록완료 탭), 1418:17357(그리드 뷰), 1418:20145(리스트 뷰)
 * 캡처 경로: tests/screenshots/round3-agent-a-vehicles-*.png
 */

import { test } from '@playwright/test';

test.describe('라운드3 에이전트 A — 차량 목록 (§3.4 사이클 7) 캡처', () => {
  test('차량 목록 15565·17357·20145 변형 캡처', async ({ page }) => {
    test.setTimeout(60000);
    await page.setViewportSize({ width: 1440, height: 900 });

    // 1) 등록완료 탭 — 15565: /vehicles?filter=completed
    await page.goto('/vehicles?filter=completed');
    await page.waitForLoadState('domcontentloaded');
    await test.expect(page.getByRole('heading', { name: /나의 매물 목록/ })).toBeVisible({ timeout: 15000 });
    await page.screenshot({
      path: 'tests/screenshots/round3-agent-a-vehicles-filter-completed.png',
      fullPage: true,
    });

    // 2) 그리드 뷰 — 17357: /vehicles?view=grid
    await page.goto('/vehicles?view=grid');
    await page.waitForLoadState('domcontentloaded');
    await page.screenshot({
      path: 'tests/screenshots/round3-agent-a-vehicles-view-grid.png',
      fullPage: false,
    });

    // 3) 리스트 뷰 — 20145: /vehicles?view=list
    await page.goto('/vehicles?view=list');
    await page.waitForLoadState('domcontentloaded');
    await page.screenshot({
      path: 'tests/screenshots/round3-agent-a-vehicles-view-list.png',
      fullPage: false,
    });
  });
});
