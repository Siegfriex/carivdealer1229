/**
 * E2E Test: 검차 신청 플로우 (4단계)
 * 디자인:
 * - design/design_vehicle_input/vehicle_input_2/매물 등록 관리_차량 검차 신청1.svg
 * - design/design_vehicle_input/vehicle_input_2/매물 등록 관리_차량 검차 신청2_리스트뷰.svg
 * - design/design_vehicle_input/vehicle_input_3/매물 등록 관리_차량 검차 진행3.svg
 * - design/design_vehicle_input/vehicle_input_45/매물 등록 관리_차량 검차 완료4.svg
 */

import { test, expect } from '@playwright/test';

test.describe('검차 신청 플로우', () => {
  test('검차 신청 Step 1: 날짜/장소 선택', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/inspections/request/step1');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({
      path: 'tests/screenshots/06-inspection-step1-initial.png',
      fullPage: true,
    });
    
    // StepProgress 확인
    await expect(page.locator('text=날짜/장소 선택')).toBeVisible();
    await expect(page.locator('text=평가사 선택')).toBeVisible();
    
    // 날짜/시간 입력
    await page.fill('input[type="date"]', '2026-02-01');
    await page.fill('input[type="time"]', '14:00');
    await page.fill('input[placeholder*="테헤란로"]', '서울특별시 강남구 테헤란로 123');
    
    await page.screenshot({
      path: 'tests/screenshots/06-inspection-step1-filled.png',
      fullPage: true,
    });
  });
  
  test('검차 신청 Step 2: 평가사 선택 (리스트/카드 뷰)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/inspections/request/step2');
    await page.waitForLoadState('networkidle');
    
    // 리스트 뷰 스크린샷
    await page.screenshot({
      path: 'tests/screenshots/06-inspection-step2-list-view.png',
      fullPage: true,
    });
    
    // 평가사 목록 확인
    await expect(page.locator('text=김평가')).toBeVisible();
    await expect(page.locator('text=이평가')).toBeVisible();
    
    // 카드 뷰로 전환
    await page.click('button[aria-label*="카드"]');
    await page.waitForTimeout(500);
    await page.screenshot({
      path: 'tests/screenshots/06-inspection-step2-card-view.png',
      fullPage: true,
    });
    
    // 다시 리스트 뷰
    await page.click('button[aria-label*="리스트"]');
    await page.waitForTimeout(500);
    
    // 평가사 선택
    await page.click('input[type="radio"]').first();
    await page.screenshot({
      path: 'tests/screenshots/06-inspection-step2-selected.png',
      fullPage: true,
    });
  });
  
  test('검차 진행 중 페이지', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/inspections/insp-001/progress');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({
      path: 'tests/screenshots/06-inspection-progress.png',
      fullPage: true,
    });
    
    await expect(page.locator('text=검차가 진행 중입니다')).toBeVisible();
    await expect(page.locator('text=평가사가 곧 도착할 예정입니다')).toBeVisible();
  });
  
  test('검차 완료 페이지', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/inspections/insp-001/complete');
    await page.waitForLoadState('networkidle');
    
    await page.screenshot({
      path: 'tests/screenshots/06-inspection-complete.png',
      fullPage: true,
    });
    
    await expect(page.locator('text=검차가 완료되었습니다')).toBeVisible();
    await expect(page.locator('text=판매 방식을 선택하세요')).toBeVisible();
  });
});
