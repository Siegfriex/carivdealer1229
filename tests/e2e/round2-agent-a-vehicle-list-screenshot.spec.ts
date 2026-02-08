/**
 * 라운드2 에이전트 A — §3.4 차량 목록 (사이클 6) 러닝 스크린샷 캡처
 * 참조: IA §3.4 + 기존 코드 SSOT (FIGMASCR0208 §3.4 전용 폴더 없음)
 * nodeId: 1418:15487(기본), 1418:15695(전체 탭), 1418:15903(임시저장 탭)
 * 캡처 경로: tests/screenshots/round2-agent-a-vehicles-*.png
 */

import { test } from '@playwright/test';

test.describe('라운드2 에이전트 A — 차량 목록 (§3.4 사이클 6) 캡처', () => {
  test('차량 목록 15487·15695·15903 변형 캡처', async ({ page }) => {
    test.setTimeout(60000);
    await page.setViewportSize({ width: 1440, height: 900 });

    // 1) 기본 — 15487: /vehicles
    await page.goto('/vehicles');
    await page.waitForLoadState('domcontentloaded');
    await test.expect(page.getByRole('heading', { name: /나의 매물 목록/ })).toBeVisible({ timeout: 15000 });
    await page.screenshot({
      path: 'tests/screenshots/round2-agent-a-vehicles-default.png',
      fullPage: true,
    });

    // 2) 전체 탭 — 15695: /vehicles?filter=all
    await page.goto('/vehicles?filter=all');
    await page.waitForLoadState('domcontentloaded');
    await page.screenshot({
      path: 'tests/screenshots/round2-agent-a-vehicles-filter-all.png',
      fullPage: false,
    });

    // 3) 임시저장 탭 — 15903: /vehicles?filter=draft
    await page.goto('/vehicles?filter=draft');
    await page.waitForLoadState('domcontentloaded');
    await page.screenshot({
      path: 'tests/screenshots/round2-agent-a-vehicles-filter-draft.png',
      fullPage: false,
    });
  });
});
