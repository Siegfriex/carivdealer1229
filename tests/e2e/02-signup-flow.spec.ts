/**
 * E2E Test: 회원가입 플로우 (8단계)
 * 디자인: design/design_SignIn/A. 회원/회원가입_1~6.svg
 */

import { test, expect } from '@playwright/test';

test.describe('회원가입 플로우', () => {
  test('회원가입 전체 플로우 - 8단계 스크린샷', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // 1. 회원가입 진입
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: 'tests/screenshots/02-signup-entry.png',
      fullPage: true,
    });
    await expect(page.locator('h2')).toContainText('딜러 회원가입');
    
    // 2. Step 1 - 이메일 입력
    await page.click('text=딜러 회원가입 시작');
    await page.waitForSelector('text=이메일을 입력해주세요');
    await page.screenshot({
      path: 'tests/screenshots/02-signup-step1-email.png',
      fullPage: true,
    });
    
    // ProgressSidebar 확인
    await expect(page.locator('text=이메일 입력')).toBeVisible();
    await expect(page.locator('text=비밀번호 설정')).toBeVisible();
    
    await page.fill('input[type="email"]', 'test@example.com');
    await page.click('text=다음');
    
    // 3. Step 2 - 비밀번호 설정
    await page.waitForSelector('text=비밀번호를 설정해주세요');
    await page.screenshot({
      path: 'tests/screenshots/02-signup-step2-password.png',
      fullPage: true,
    });
    
    await page.fill('input[placeholder="••••••••"]', 'Password123!').first();
    await page.fill('input[placeholder="••••••••"]', 'Password123!').last();
    await page.click('text=다음');
    
    // 4. Step 3 - 딜러 정보
    await page.waitForSelector('text=딜러 정보를 입력해주세요');
    await page.screenshot({
      path: 'tests/screenshots/02-signup-step3-dealer.png',
      fullPage: true,
    });
    
    await page.fill('input[placeholder*="Global Motors"]', 'Test Motors');
    await page.fill('input[placeholder="010-1234-5678"]', '010-9999-8888');
    await page.click('text=다음');
    
    // 5. Step 4 - 사업자 정보
    await page.waitForSelector('text=사업자 정보를 입력해주세요');
    await page.screenshot({
      path: 'tests/screenshots/02-signup-step4-business.png',
      fullPage: true,
    });
    
    await page.fill('input[placeholder*="글로벌모터스"]', '테스트 주식회사');
    await page.fill('input[placeholder="123-45-67890"]', '123-45-67890');
    await page.fill('input[placeholder="홍길동"]', '김테스트');
    await page.click('text=다음');
    
    // 6. Step 5 - 약관 동의
    await page.waitForSelector('text=약관에 동의해주세요');
    await page.screenshot({
      path: 'tests/screenshots/02-signup-step5-terms.png',
      fullPage: true,
    });
    
    await page.click('text=전체 동의');
    await page.screenshot({
      path: 'tests/screenshots/02-signup-step5-terms-checked.png',
      fullPage: true,
    });
    
    await page.click('text=회원가입 완료');
    
    // 7. Step 6 - 승인 대기
    await page.waitForSelector('text=승인 대기 중입니다');
    await page.screenshot({
      path: 'tests/screenshots/02-signup-step6-pending.png',
      fullPage: true,
    });
    await expect(page.locator('text=관리자의 승인이 필요합니다')).toBeVisible();
    
    // 8. 승인 완료 페이지 (직접 이동)
    // Note: 실제로는 관리자 승인 후 표시되지만, UI 확인을 위해 직접 이동
    await page.goto('/signup/complete');
    await page.waitForSelector('text=승인이 완료되었습니다');
    await page.screenshot({
      path: 'tests/screenshots/02-signup-step6-complete.png',
      fullPage: true,
    });
  });
});
