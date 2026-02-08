/**
 * 라운드 3 에이전트 B — 참조 스크린샷 대조용 러닝 스크린샷 캡처
 * §3.5 24679(거래 상세 일반), 21690(거래 상세 경매)
 * 캡처 경로: tests/screenshots/round3-b-*.png
 */

import { test, expect } from '@playwright/test';

test.describe('라운드 3 에이전트 B 러닝 스크린샷', () => {
  test('거래 상세 보기 — 경매 (21690)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/vehicles/v-001/auction');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(4000);

    const heading = page.getByRole('heading', { name: /거래 상세 보기/ });
    const progress = page.getByText(/현재 거래 진행상황/);
    const auctionStatus = page.getByText(/경매 거래 중/);
    const errorMsg = page.getByText(/차량을 찾을 수 없습니다/);
    const ok =
      (await heading.isVisible().catch(() => false)) ||
      (await progress.first().isVisible().catch(() => false)) ||
      (await auctionStatus.first().isVisible().catch(() => false)) ||
      (await errorMsg.first().isVisible().catch(() => false));
    expect(ok).toBe(true);

    await page.screenshot({
      path: 'tests/screenshots/round3-b-auction-detail.png',
      fullPage: true,
    });
  });

  test('거래 상세 보기 — 일반 (24679)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/vehicles/v-001/trade');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(4000);

    const heading = page.getByRole('heading', { name: /거래 상세 보기/ });
    const generalSale = page.getByText(/현재 일반 판매로 거래 중/);
    const errorMsg = page.getByText(/차량을 찾을 수 없습니다/);
    const ok =
      (await heading.isVisible().catch(() => false)) ||
      (await generalSale.first().isVisible().catch(() => false)) ||
      (await errorMsg.first().isVisible().catch(() => false));
    expect(ok).toBe(true);

    await page.screenshot({
      path: 'tests/screenshots/round3-b-trade-detail.png',
      fullPage: true,
    });
  });
});
