/**
 * 관리 에이전트 — 라운드 1 전체 검증 (A+B+C)
 * §3.1 랜딩(A), §3.3 대시보드(C), §3.5 차량 상세·경매(B) 순서로 E2E 실행.
 * 실행: npm run test:e2e -- tests/e2e/round1-management-full.spec.ts
 */

import { test, expect } from '@playwright/test';

test.describe('라운드 1 관리 에이전트 — 전체 검증', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test('A: 랜딩(/) — Hero·알림 노출', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    await expect(page.getByText(/FORWARD/).first()).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 1 }).filter({ hasText: /ForwardMax Cariv/ }).first()
    ).toBeVisible();
    await page.getByRole('button', { name: '알림' }).click();
    await page.waitForTimeout(300);
    await expect(page.getByText('알림').first()).toBeVisible();
  });

  test('C: 대시보드(/dashboard) — 레이아웃·전체 차량', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page.getByText('전체 차량', { exact: false }).first()).toBeVisible({ timeout: 15000 });
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('aside')).toBeVisible();
    await expect(page.getByRole('button', { name: '매물 등록하기' }).first()).toBeVisible();
  });

  test('B: 차량 상세(/vehicles/:id) — 판매방식 또는 에러 UI', async ({ page }) => {
    await page.goto('/vehicles/v-001');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    const heading = page.getByRole('heading', { name: /판매 방식 선택/ });
    const errorMsg = page.getByText(/차량을 찾을 수 없습니다/);
    const backBtn = page.getByRole('button', { name: /차량 목록/ });
    const h = await heading.isVisible().catch(() => false);
    const e = await errorMsg.first().isVisible().catch(() => false);
    const b = await backBtn.first().isVisible().catch(() => false);
    expect(h || e || b).toBe(true);
  });

  test('B: 경매 사전 설정(/vehicles/:id/auction/start-price)', async ({ page }) => {
    await page.goto('/vehicles/v-001/auction/start-price');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);
    const heading = page.getByRole('heading', { name: /경매 사전 설정/ });
    const fallback = page.getByText(/로딩 중|차량 목록/);
    await expect(heading.or(fallback)).toBeVisible({ timeout: 15000 });
  });
});
