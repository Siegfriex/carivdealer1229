/**
 * E2E Test: 디버그 - 콘솔 에러 확인
 */

import { test, expect } from '@playwright/test';

test.describe('디버그', () => {
  test('콘솔 에러 및 DOM 구조 확인', async ({ page }) => {
    const consoleMessages: string[] = [];
    const errors: string[] = [];

    // 콘솔 메시지 수집
    page.on('console', (msg) => {
      consoleMessages.push(`${msg.type()}: ${msg.text()}`);
    });

    // 페이지 에러 수집
    page.on('pageerror', (error) => {
      errors.push(error.message);
    });

    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);

    // DOM 구조 확인
    const rootContent = await page.locator('#root').innerHTML();
    const mobileBlockerVisible = await page.locator('#mobile-blocker').isVisible();
    
    console.log('=== Console Messages ===');
    console.log(consoleMessages.join('\n'));
    
    console.log('\n=== Errors ===');
    console.log(errors.join('\n'));
    
    console.log('\n=== DOM Info ===');
    console.log('Mobile Blocker Visible:', mobileBlockerVisible);
    console.log('Root Content Length:', rootContent.length);
    console.log('Root Content:', rootContent.substring(0, 500));
    
    // HTML 저장
    const html = await page.content();
    await page.evaluate(() => {
      return {
        rootHTML: document.getElementById('root')?.innerHTML,
        mobileBlockerHTML: document.getElementById('mobile-blocker')?.innerHTML,
      };
    });
  });
});
