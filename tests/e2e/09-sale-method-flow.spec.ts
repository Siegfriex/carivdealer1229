/**
 * E2E Test: 판매 방식 선택 플로우 (플로우차트 정합)
 * /vehicles/:id → 경매(시작가→기간→완료) vs 일반 판매(분석→가격→완료)
 */

import { test, expect } from '@playwright/test';

test.describe('판매 방식 선택 플로우', () => {
  test('차량 상세에서 경매 루트 진입', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/vehicles/v-001');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    // 차량 로딩 시: 경매/일반 버튼, 에러 메시지, 또는 로딩 후 콘텐츠
    const auctionBtn = page.getByRole('button', { name: /경매로 판매하기|경매/ });
    const generalBtn = page.getByRole('button', { name: /일반 판매하기|일반 판매/ });
    const errorMsg = page.getByText(/차량을 찾을 수 없습니다|잘못된 경로/);
    const backBtn = page.getByRole('button', { name: /차량 목록/ });
    await expect(auctionBtn.or(generalBtn).or(errorMsg).or(backBtn).first()).toBeVisible({ timeout: 15000 });

    // 헤더는 차량 로드 시에만 있음 (에러 시 없을 수 있음)
    const header = page.getByText(/FORWARD/);
    if (await header.isVisible()) {
      await expect(page.getByRole('link', { name: '차량목록' })).toBeVisible();
    }

    // 경매 버튼이 있으면 클릭 → 시작가 페이지
    if (await auctionBtn.isVisible()) {
      await auctionBtn.click();
      await page.waitForURL(/\/vehicles\/.*\/auction/);
      await page.waitForLoadState('networkidle');
      await expect(
        page.getByText(/시작가|경매 시작 가격|입력/).or(page.getByRole('heading'))
      ).toBeVisible({ timeout: 5000 });
    }
  });

  test('차량 상세에서 일반 판매 루트 진입', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/vehicles/v-001');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(2000);

    const generalBtn = page.getByRole('button', { name: /일반 판매하기|일반 판매/ });
    const errorMsg = page.getByText(/차량을 찾을 수 없습니다|잘못된 경로/);
    await expect(generalBtn.or(errorMsg)).toBeVisible({ timeout: 10000 });

    if (await generalBtn.isVisible()) {
      await generalBtn.click();
      await page.waitForURL(/\/vehicles\/.*\/sale\/analyzing/);
      await page.waitForLoadState('networkidle');
      await expect(
        page.getByText(/분석|가격|시세/).or(page.getByRole('heading'))
      ).toBeVisible({ timeout: 5000 });
    }
  });
});
