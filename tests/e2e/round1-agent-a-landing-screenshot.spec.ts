/**
 * 라운드1 에이전트 A — §3.1 랜딩 러닝 스크린샷 캡처
 * 참조: FIGMASCR0208/§3.1_랜딩 (37201 Hero중심, 43715 알림노출)
 * 캡처 경로: tests/screenshots/round1-agent-a-landing-*.png
 */

import { test } from '@playwright/test';

test.describe('라운드1 에이전트 A — 랜딩 캡처', () => {
  test('랜딩 / 1440px 풀페이지 + 알림 드롭다운 열린 상태 캡처', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // 1) 기본 랜딩 (Hero·가이드·FAQ·문의) — 참조 37201
    await test.expect(page.getByText(/FORWARD/).first()).toBeVisible();
    await test.expect(page.getByRole('heading', { level: 1 }).filter({ hasText: /ForwardMax Cariv/ }).first()).toBeVisible();
    await page.screenshot({
      path: 'tests/screenshots/round1-agent-a-landing-hero.png',
      fullPage: true,
    });

    // 2) 알림 벨 클릭 후 드롭다운 노출 — 참조 43715
    await page.getByRole('button', { name: '알림' }).click();
    await page.waitForTimeout(300);
    await test.expect(page.getByText('알림').first()).toBeVisible();
    await page.screenshot({
      path: 'tests/screenshots/round1-agent-a-landing-notification-open.png',
      fullPage: false,
    });
  });
});
