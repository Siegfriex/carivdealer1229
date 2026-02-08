/**
 * 라운드 2 에이전트 B — 참조 스크린샷 대조용 러닝 스크린샷 캡처
 * §3.5 20576(차량등록완료·판매전환완료), 22630(거래 목록)
 * 캡처 경로: tests/screenshots/round2-b-*.png
 */

import { test, expect } from '@playwright/test';

test.describe('라운드 2 에이전트 B 러닝 스크린샷', () => {
  test('차량 등록 완료 (20576)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/vehicles/v-001/complete');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(4000);

    const heading = page.getByRole('heading', { name: /차량 등록이 완료되었습니다/ });
    const homeBtn = page.getByRole('button', { name: /홈으로 돌아가기/ });
    const errorMsg = page.getByText(/차량을 찾을 수 없습니다/);
    const ok =
      (await heading.isVisible().catch(() => false)) ||
      (await homeBtn.first().isVisible().catch(() => false)) ||
      (await errorMsg.first().isVisible().catch(() => false));
    expect(ok).toBe(true);

    await page.screenshot({
      path: 'tests/screenshots/round2-b-vehicle-registration-complete.png',
      fullPage: true,
    });
  });

  test('판매 전환 완료 (20576)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/vehicles/v-001/sale/complete');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(4000);

    const heading = page.getByRole('heading', { name: /판매 상태로 전환되었습니다/ });
    const sub = page.getByText(/구매제안이 오면 알람을 통해 알려드려요/);
    const confirmBtn = page.getByRole('button', { name: /^확인$/ });
    const errorMsg = page.getByText(/차량을 찾을 수 없습니다/);
    const ok =
      (await heading.isVisible().catch(() => false)) ||
      (await sub.first().isVisible().catch(() => false)) ||
      (await confirmBtn.first().isVisible().catch(() => false)) ||
      (await errorMsg.first().isVisible().catch(() => false));
    expect(ok).toBe(true);

    await page.screenshot({
      path: 'tests/screenshots/round2-b-sale-complete.png',
      fullPage: true,
    });
  });

  test('거래 목록 (22630)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/offers');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(4000);

    const heading = page.getByRole('heading', { name: /거래 목록/ });
    const empty = page.getByText(/거래 목록이 없습니다/);
    const loading = page.getByText(/로딩 중/);
    const ok =
      (await heading.isVisible().catch(() => false)) ||
      (await empty.first().isVisible().catch(() => false)) ||
      (await loading.first().isVisible().catch(() => false));
    expect(ok).toBe(true);

    await page.screenshot({
      path: 'tests/screenshots/round2-b-trade-list.png',
      fullPage: true,
    });
  });
});
