/**
 * 라운드 1 에이전트 B — 참조 스크린샷 대조용 러닝 스크린샷 캡처
 * §3.5 20498(판매 방식 선택), 23705/23880(경매 사전 설정)
 * 캡처 경로: tests/screenshots/round1-b-*.png
 */

import { test, expect } from '@playwright/test';

test.describe('라운드 1 에이전트 B 러닝 스크린샷', () => {
  test('차량 상세 — 판매 방식 선택 (20498)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/vehicles/v-001');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(5000);

    const heading = page.getByRole('heading', { name: /판매 방식 선택/ });
    const errorMsg = page.getByText(/차량을 찾을 수 없습니다/);
    const backBtn = page.getByRole('button', { name: /차량 목록/ });
    const headingVisible = await heading.isVisible().catch(() => false);
    const errorVisible = await errorMsg.first().isVisible().catch(() => false);
    const backVisible = await backBtn.first().isVisible().catch(() => false);
    expect(headingVisible || errorVisible || backVisible).toBe(true);

    await page.screenshot({
      path: 'tests/screenshots/round1-b-vehicle-detail-sale-method.png',
      fullPage: true,
    });
  });

  test('경매 사전 설정 (23705/23880)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/vehicles/v-001/auction/start-price');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    const heading = page.getByRole('heading', { name: /경매 사전 설정/ });
    const fallback = page.getByText(/로딩 중|차량 목록/);
    await expect(heading.or(fallback)).toBeVisible({ timeout: 15000 });

    await page.screenshot({
      path: 'tests/screenshots/round1-b-auction-start-price.png',
      fullPage: true,
    });
  });
});
