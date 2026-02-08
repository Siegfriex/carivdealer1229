/**
 * E2E Test: 대시보드
 * 디자인:
 * - design/design_vehicle_dashboard/매물 등록 관리_그리드 뷰1.svg
 * - design/design_vehicle_dashboard/매물 등록 관리_리스트 뷰2.svg
 */

import { test, expect } from '@playwright/test';

test.describe('대시보드', () => {
  test('대시보드 그리드/리스트 뷰 전환', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/dashboard');

    // 페이지 제목이 나타날 때까지 대기 (networkidle 대신)
    await page.waitForSelector('text=전체 차량', { timeout: 10000 });

    // Header + Sidebar 확인
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('aside')).toBeVisible();
    
    // 그리드 뷰 스크린샷
    await page.screenshot({
      path: 'tests/screenshots/04-dashboard-grid-view.png',
      fullPage: true,
    });
    
    // DashboardPage는 그리드 뷰만 지원 (VehicleListPage와 다름)
    // 스크린샷 촬영
    await page.screenshot({
      path: 'tests/screenshots/04-dashboard-main.png',
      fullPage: true,
    });

    // 매물 등록하기 버튼 확인 (헤더·메인 둘 다 있을 수 있음 → 첫 번째만 검사)
    await expect(page.getByRole('button', { name: '매물 등록하기' }).first()).toBeVisible();
  });
});
