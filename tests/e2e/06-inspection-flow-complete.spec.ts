/**
 * E2E Test: 검차 플로우 완전 테스트 (새로 구현된 페이지 포함)
 * Figma 노드: 915-998, 1202-6390, 1202-6685, 1202-7440, 1202-7752, 1202-7902, 1202-7588
 */

import { test, expect } from '@playwright/test';

test.describe('검차 플로우 완전 테스트', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
  });

  test('1. 차량등록 완료 → 검차 진행하기 플로우', async ({ page }) => {
    await page.goto('/vehicles/new/complete');
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'tests/screenshots/19-vehicle-complete-to-inspection.png',
      fullPage: true,
    });

    // "검차 진행하기" 버튼 확인
    await expect(page.locator('text=검차 진행하기')).toBeVisible();
    await expect(page.locator('text=홈으로 돌아가기')).toBeVisible();

    // "검차 진행하기" 클릭 → 검차신청 랜딩 이동
    await page.click('text=검차 진행하기');
    await page.waitForURL('**/inspections/request');
    await expect(page).toHaveURL(/\/inspections\/request/);
  });

  test('2. GNB "검차" 클릭 → 목록 이동', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // GNB "검차" 클릭
    await page.click('text=검차');
    await page.waitForURL('**/inspections');
    await expect(page).toHaveURL('/inspections');

    await page.screenshot({
      path: 'tests/screenshots/20-gnb-inspection-to-list.png',
      fullPage: true,
    });
  });

  test('3. 검차신청 랜딩 (3) - Figma 1202-6390', async ({ page }) => {
    await page.goto('/inspections/request');
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'tests/screenshots/21-inspection-request-landing.png',
      fullPage: true,
    });

    // 사이드바 단계 표시 확인
    await expect(page.getByRole('listitem').filter({ hasText: '검차 신청' }).first()).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: '검차 진행' }).first()).toBeVisible();
    await expect(page.getByRole('listitem').filter({ hasText: '검차 완료' }).first()).toBeVisible();

    // 메인 영역 확인 (제목, 버튼)
    await expect(page.getByRole('heading', { name: '검차 신청' })).toBeVisible();
    await expect(page.getByRole('button', { name: '검차 신청하기' })).toBeVisible();
    await expect(page.getByRole('button', { name: '임시저장' })).toBeVisible();

    // "검차 신청하기" 클릭 → step1 이동
    await page.click('text=검차 신청하기');
    await page.waitForURL('**/inspections/request/step1');
    await expect(page).toHaveURL(/\/inspections\/request\/step1/);

    // 뒤로 가서 "임시저장" 테스트
    await page.goBack();
    await page.waitForURL('**/inspections/request');
    await page.click('text=임시저장');
    await page.waitForURL('**/inspections');
    await expect(page).toHaveURL('/inspections');
  });

  test('4. 검차 신청 목록 (4) - Figma 1202-6685', async ({ page }) => {
    await page.goto('/inspections');
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'tests/screenshots/22-inspection-list-initial.png',
      fullPage: true,
    });

    // 제목 확인
    await expect(page.getByRole('heading', { name: '검차 신청 목록' })).toBeVisible();
    await expect(page.getByRole('button', { name: '검차 신청하기' })).toBeVisible();

    // 목록 4건 표시 확인 (pending, assigned, in_progress, completed)
    const listItems = page.locator('[role="button"]').filter({ hasText: /33바|12나|82가|55라/ });
    await expect(listItems).toHaveCount(4);

    // 검색 기능 테스트
    await page.fill('input[placeholder*="차량번호"]', '33바');
    await page.waitForTimeout(300);
    await expect(page.locator('text=33바 3333')).toBeVisible();
    await expect(page.locator('text=12나 3456')).not.toBeVisible();

    // 검색 초기화
    await page.fill('input[placeholder*="차량번호"]', '');
    await page.waitForTimeout(300);

    // 행 클릭 확장 (4-1) 테스트 - 첫 번째 행
    const firstRow = page.locator('[role="button"]').first();
    await firstRow.click();
    await page.waitForTimeout(300);

    await page.screenshot({
      path: 'tests/screenshots/23-inspection-list-expanded-single.png',
      fullPage: true,
    });

    // 확장 영역 확인 (라벨: 희망일시, 평가사, 상태)
    await expect(page.getByText('희망일시', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('평가사', { exact: true }).first()).toBeVisible();
    await expect(page.getByText('상태', { exact: true }).first()).toBeVisible();

    // 다중 확장 (4-1-1) 테스트 - 두 번째 행도 확장
    const secondRow = page.locator('[role="button"]').nth(1);
    await secondRow.click();
    await page.waitForTimeout(300);

    await page.screenshot({
      path: 'tests/screenshots/24-inspection-list-expanded-multiple.png',
      fullPage: true,
    });

    // 상태별 이동 테스트 - pending → progress matching
    await page.goto('/inspections');
    await page.waitForLoadState('networkidle');
    const pendingRow = page.locator('[role="button"]').filter({ hasText: '33바 3333' });
    await pendingRow.click();
    await page.waitForTimeout(300);
    const progressButton = page.locator('text=진행하기').first();
    if (await progressButton.isVisible()) {
      await progressButton.click();
      await page.waitForURL('**/inspections/*/progress*');
      await expect(page.url()).toMatch(/\/inspections\/[^/]+\/progress/);
    }
  });

  test('5. 검차 진행 단계 (5, 5-1, 5-2) - Figma 1202-7440, 7752, 7902', async ({ page }) => {
    // 5: 검차자 매칭중
    await page.goto('/inspections/insp-1/progress?stage=matching');
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'tests/screenshots/25-inspection-progress-matching.png',
      fullPage: true,
    });

    await expect(page.locator('text=검차 진행상황')).toBeVisible();
    await expect(page.locator('text=검차자 매칭중')).toBeVisible();
    await expect(page.locator('text=1/3')).toBeVisible();
    const devSkipBtn = page.getByTestId('dev-skip-area').getByRole('button', { name: 'DEV:SKIP' });
    await expect(devSkipBtn).toBeVisible();

    // DEV:SKIP 클릭 → 5-1 (en_route)
    await devSkipBtn.click();
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/stage=en_route/);

    await page.screenshot({
      path: 'tests/screenshots/26-inspection-progress-en-route.png',
      fullPage: true,
    });

    await expect(page.locator('text=검차자 이동중')).toBeVisible();
    await expect(page.locator('text=2/3')).toBeVisible();
    await expect(page.locator('text=평가사 정보')).toBeVisible();
    const skipBtn = page.getByTestId('dev-skip-area').getByRole('button', { name: '스킵' });
    await expect(skipBtn).toBeVisible();

    // 스킵 클릭 → 5-2 (complete)
    await skipBtn.click();
    await page.waitForTimeout(500);
    await expect(page).toHaveURL(/stage=complete/);

    await page.screenshot({
      path: 'tests/screenshots/27-inspection-progress-complete.png',
      fullPage: true,
    });

    await expect(page.locator('text=검차완료')).toBeVisible();
    await expect(page.locator('text=3/3')).toBeVisible();
    await expect(page.locator('text=검차가 완료되었습니다')).toBeVisible();
    await expect(page.locator('text=검차내역 보기')).toBeVisible();

    // "검차내역 보기" 클릭 → history 이동
    await page.click('text=검차내역 보기');
    await page.waitForURL('**/inspections/history');
    await expect(page).toHaveURL('/inspections/history');
  });

  test('6. 검차내역 (6) - Figma 1202-7588', async ({ page }) => {
    await page.goto('/inspections/history');
    await page.waitForLoadState('networkidle');

    await page.screenshot({
      path: 'tests/screenshots/28-inspection-history.png',
      fullPage: true,
    });

    // 제목 확인
    await expect(page.getByRole('heading', { name: '검차내역' })).toBeVisible();

    // 완료된 검차 목록 표시 확인 (completed만 표시)
    const completedItem = page.locator('text=55라 5555');
    await expect(completedItem).toBeVisible();

    // 검색 기능 테스트
    await page.fill('input[placeholder*="차량번호"]', '55라');
    await page.waitForTimeout(300);
    await expect(page.locator('text=55라 5555')).toBeVisible();

    // 검색 초기화
    await page.fill('input[placeholder*="차량번호"]', '');
    await page.waitForTimeout(300);

    // 행 클릭 → 상세 이동
    await completedItem.click();
    await page.waitForURL('**/inspections/*/complete');
    await expect(page.url()).toMatch(/\/inspections\/[^/]+\/complete/);
  });

  test('7. 전체 플로우 통합 테스트', async ({ page }) => {
    // 차량등록 완료 → 검차 진행하기 → 랜딩 → 목록 → 진행 → 내역
    await page.goto('/vehicles/new/complete');
    await page.waitForLoadState('networkidle');

    // 검차 진행하기
    await page.click('text=검차 진행하기');
    await page.waitForURL('**/inspections/request');

    // 랜딩에서 검차 신청하기
    await page.click('text=검차 신청하기');
    await page.waitForURL('**/inspections/request/step1');

    // 목록으로 직접 이동 (SPA에서 goBack은 예측 어려움)
    await page.goto('/inspections');
    await page.waitForLoadState('networkidle');

    // 목록에서 첫 번째 항목 확장 후 진행하기
    const firstRow = page.locator('[role="button"]').first();
    await firstRow.click();
    await page.waitForTimeout(300);
    const progressButton = page.locator('text=진행하기').first();
    if (await progressButton.isVisible()) {
      await progressButton.click();
      await page.waitForURL('**/inspections/*/progress*');
    }

    // 진행 단계에서 완료까지 (좌하단 DEV:SKIP/스킵)
    const devSkip = page.getByTestId('dev-skip-area').getByRole('button', { name: 'DEV:SKIP' });
    const skipToComplete = page.getByTestId('dev-skip-area').getByRole('button', { name: '스킵' });
    if (await devSkip.isVisible()) {
      await devSkip.click();
      await page.waitForTimeout(500);
    }
    if (await skipToComplete.isVisible()) {
      await skipToComplete.click();
      await page.waitForTimeout(500);
    }
    if (await page.locator('text=검차내역 보기').isVisible()) {
      await page.click('text=검차내역 보기');
      await page.waitForURL('**/inspections/history');
    }

    await page.screenshot({
      path: 'tests/screenshots/29-inspection-full-flow.png',
      fullPage: true,
    });
  });
});
