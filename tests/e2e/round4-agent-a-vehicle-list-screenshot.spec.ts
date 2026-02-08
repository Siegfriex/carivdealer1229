/**
 * 라운드4 에이전트 A — §3.4 차량 목록 (사이클 8) 러닝 스크린샷 캡처
 * IA·기존 코드 SSOT. nodeId: 1418:16327(검색), 1418:16111(확인 필요차량), 1418:16860(Empty)
 * 캡처 경로: tests/screenshots/round4-agent-a-vehicles-*.png
 */

import { test } from '@playwright/test';

test.describe('라운드4 에이전트 A — 차량 목록 (§3.4 사이클 8) 캡처', () => {
  test('차량 목록 16327·16111·16860 변형 캡처', async ({ page }) => {
    test.setTimeout(60000);
    await page.setViewportSize({ width: 1440, height: 900 });

    // 1) 검색 적용 — 16327: /vehicles?q=...
    await page.goto('/vehicles?q=테스트');
    await page.waitForLoadState('domcontentloaded');
    await test.expect(page.getByRole('heading', { name: /나의 매물 목록/ })).toBeVisible({ timeout: 15000 });
    await page.screenshot({
      path: 'tests/screenshots/round4-agent-a-vehicles-search.png',
      fullPage: false,
    });

    // 2) 확인 필요차량 — 16111: /vehicles?needsAttention=1
    await page.goto('/vehicles?needsAttention=1');
    await page.waitForLoadState('domcontentloaded');
    await page.screenshot({
      path: 'tests/screenshots/round4-agent-a-vehicles-needs-attention.png',
      fullPage: false,
    });

    // 3) Empty state — 16860: 결과 0건 (검색어로 매칭 없음)
    await page.goto('/vehicles?q=xyznonexistent123');
    await page.waitForLoadState('domcontentloaded');
    await test.expect(page.getByText(/등록된 차량이 없습니다/)).toBeVisible({ timeout: 10000 });
    await page.screenshot({
      path: 'tests/screenshots/round4-agent-a-vehicles-empty.png',
      fullPage: false,
    });
  });
});
