/**
 * E2E Test: 차량 등록 플로우 (2단계)
 * 디자인:
 * - design/design_vehicle_input/vehicle_input_1/매물 등록 관리_차량 등록1.svg
 * - design/design_vehicle_input/vehicle_input_1/매물 등록 관리_차량 등록2.svg
 */

import { test, expect } from '@playwright/test';

test.describe('차량 등록 플로우', () => {
  test('차량 등록 Step 1-2 스크린샷 및 OCR 테스트', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Step 1: 차량 정보 입력
    await page.goto('/vehicles/new/step1');
    await page.waitForLoadState('networkidle');
    
    // StepProgress 확인
    await expect(page.locator('text=차량 정보 입력')).toBeVisible();
    
    // 초기 상태 스크린샷
    await page.screenshot({
      path: 'tests/screenshots/05-vehicle-register-step1-initial.png',
      fullPage: true,
    });
    
    // 차량번호 입력
    await page.fill('input[placeholder="33바 3333"]', '33바 3333');
    await page.screenshot({
      path: 'tests/screenshots/05-vehicle-register-step1-plate-filled.png',
      fullPage: true,
    });
    
    // OCR 버튼 클릭 (Mock 데이터 반환 예상)
    await page.click('text=OCR 실행');
    await page.waitForTimeout(1000); // OCR 처리 대기
    
    // OCR 결과 입력된 상태 스크린샷
    await page.screenshot({
      path: 'tests/screenshots/05-vehicle-register-step1-ocr-result.png',
      fullPage: true,
    });
    
    // 다음 단계 클릭
    await page.click('text=다음 단계');
    
    // Step 2: 상세 정보 입력
    await page.waitForSelector('text=상세 정보를 입력해주세요');
    await page.screenshot({
      path: 'tests/screenshots/05-vehicle-register-step2-initial.png',
      fullPage: true,
    });
    
    // 연료 종류 선택
    await page.selectOption('select', '가솔린');
    await page.fill('input[placeholder*="화이트"]', '화이트');
    await page.fill('input[placeholder="2850"]', '2850');
    
    await page.screenshot({
      path: 'tests/screenshots/05-vehicle-register-step2-filled.png',
      fullPage: true,
    });
    
    // 이미지 업로드 영역 확인
    await expect(page.locator('text=이미지를 드래그하거나 클릭하여 업로드')).toBeVisible();
    
    // 임시저장 버튼 확인
    await expect(page.locator('text=임시저장')).toBeVisible();
  });
});
