/**
 * E2E Test: 회원가입 플로우 (새 플로우)
 * Figma: 1194-6171, 1194-5792, 1194-5866, 1194-5921, 1194-6002, 1194-6072, 1194-6063, 1194-6054
 */

import { test, expect } from '@playwright/test';

test.describe('회원가입 플로우', () => {
  test('회원가입 전체 플로우 - 새 플로우 (8단계)', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // 1. 회원가입 진입 (SignupEntryPage)
    await page.goto('/signup');
    await page.waitForLoadState('networkidle');
    await page.screenshot({
      path: 'tests/screenshots/02-signup-entry.png',
      fullPage: true,
    });
    await expect(page.getByRole('heading', { name: '회원가입' })).toBeVisible();
    
    // "딜러로 시작하기" 클릭
    await page.click('text=딜러로 시작하기');
    await page.waitForURL('**/signup/step1');
    
    // 2. Step 1 - 본인인증 (SignupStep1Page)
    await page.waitForSelector('text=회원가입');
    await page.waitForSelector('text=① 본인인증');
    await page.screenshot({
      path: 'tests/screenshots/02-signup-step1-identity.png',
      fullPage: true,
    });
    
    // StepProgress 확인
    await expect(page.locator('text=① 본인인증')).toBeVisible();
    await expect(page.locator('text=② 사업자 정보 입력')).toBeVisible();
    
    // 기본정보 입력
    await page.fill('input[placeholder="아이디"]', 'testuser123');
    await page.click('text=중복 확인');
    
    await page.locator('input[type="password"]').first().fill('password123');
    await page.locator('input[type="password"]').last().fill('password123');
    
    // 본인인증 (이메일: placeholder "아이디" 두 번째 = 이메일 로컬 + 도메인 select)
    await page.locator('input[placeholder="아이디"]').nth(1).fill('test');
    await page.locator('select').first().selectOption({ label: 'naver.com' });
    await page.fill('input[placeholder="이름"]', '홍길동');
    await page.fill('input[placeholder="휴대폰 번호"]', '01012345678');
    await page.click('text=인증번호 전송');
    
    // 신분증 등록 (신분증 섹션 내 file input)
    const fileInput = page.locator('section:has(h2:has-text("신분증"))').locator('input[type="file"]');
    await fileInput.setInputFiles({
      name: 'test-id.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake image content'),
    });
    await page.waitForTimeout(300);
    await page.getByRole('button', { name: '다음' }).click();
    await page.waitForURL('**/signup/step2');
    
    // 3. Step 2 - 사업자 정보 입력 (SignupStep2Page)
    await page.waitForSelector('text=② 사업자 정보 입력');
    await page.screenshot({
      path: 'tests/screenshots/02-signup-step2-business.png',
      fullPage: true,
    });
    
    await page.fill('input[placeholder="XXX-XX-XXXXX"]', '1234567890');
    await expect(page.locator('input[placeholder="XXX-XX-XXXXX"]')).toHaveValue('123-45-67890');
    
    // 사업자 등록증 이미지 업로드
    const businessRegInput = page.locator('input[type="file"]').first();
    await businessRegInput.setInputFiles({
      name: 'business-reg.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake image content'),
    });
    
    await page.fill('input[placeholder="대표자명"]', '홍길동');
    await page.fill('input[placeholder="사업장 주소"]', '서울시 강남구 테헤란로 123');
    
    // Select 드롭다운 2개: 업태 종목, 사업자 정보 선택
    await page.locator('select').first().selectOption({ label: '소매업' });
    await page.locator('select').nth(1).selectOption({ label: '개인사업자' });
    
    await page.click('text=다음');
    await page.waitForURL('**/signup/step3');
    
    // 4. Step 3 - 중고차 매매업 인증 (SignupStep3Page)
    await page.waitForSelector('text=③ 중고차 매매업 인증');
    await page.screenshot({
      path: 'tests/screenshots/02-signup-step3-dealership.png',
      fullPage: true,
    });
    
    // 중고차 매매업 등록증 업로드
    const regCertInput = page.locator('input[type="file"]').first();
    await regCertInput.setInputFiles({
      name: 'dealership-reg.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake image content'),
    });
    
    await page.fill('input[placeholder="매매 상사명"]', '테스트 매매상사');
    await page.fill('input[placeholder="예) AA12-12345"]', 'AA12-12345');
    
    // 매매 사원증 사진, 매매업 등록증 이미지 업로드
    const employeePhotoInput = page.locator('input[type="file"]').nth(1);
    await employeePhotoInput.setInputFiles({
      name: 'employee-card.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake image content'),
    });
    
    const regImageInput = page.locator('input[type="file"]').nth(2);
    await regImageInput.setInputFiles({
      name: 'reg-image.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake image content'),
    });
    
    // 선택정보: 협회/조합 회원 여부 라디오
    await page.check('input[type="radio"][value="no"]');
    
    await page.click('text=다음');
    await page.waitForURL('**/signup/step4');
    
    // 5. Step 4 - 정산 정보 입력 (SignupStep4Page)
    await page.waitForSelector('text=④ 정산 정보 입력');
    await page.screenshot({
      path: 'tests/screenshots/02-signup-step4-settlement.png',
      fullPage: true,
    });
    
    await page.fill('input[placeholder*="계좌번호"]', '1234567890123');
    await page.fill('input[placeholder*="하나은행"]', '하나은행');
    await page.fill('input[placeholder="예금주 실명"]', '홍길동');
    
    // 통장 사본 이미지 업로드
    const bankbookInput = page.locator('input[type="file"]').first();
    await bankbookInput.setInputFiles({
      name: 'bankbook.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake image content'),
    });
    
    // 선택정보: 계좌 유형 라디오
    await page.check('input[type="radio"][value="corporate"]');
    
    await page.click('text=다음');
    await page.waitForURL('**/signup/step5');
    
    // 6. Step 5 - 약관 동의 (SignupStep5Page)
    await page.waitForSelector('text=⑤ 약관 동의');
    await page.screenshot({
      path: 'tests/screenshots/02-signup-step5-terms.png',
      fullPage: true,
    });
    
    // "모두 동의합니다" 체크
    await page.check('#agree-all');
    await page.waitForTimeout(500); // 체크박스 상태 업데이트 대기
    await page.screenshot({
      path: 'tests/screenshots/02-signup-step5-terms-checked.png',
      fullPage: true,
    });
    
    // 필수 약관 모두 체크 확인
    await expect(page.locator('#agree-age14')).toBeChecked();
    await expect(page.locator('#agree-service')).toBeChecked();
    await expect(page.locator('#agree-privacy')).toBeChecked();
    await expect(page.locator('#agree-collection')).toBeChecked();
    
    await page.click('text=다음');
    await page.waitForURL('**/signup/pending');
    
    // 7. Step 6 - 승인 대기 (SignupPendingPage)
    await page.waitForSelector('text=⑥ 승인 대기');
    await page.waitForSelector('text=감사합니다');
    await page.screenshot({
      path: 'tests/screenshots/02-signup-step6-pending.png',
      fullPage: true,
    });
    
    await expect(page.locator('text=감사합니다. 딜러 승인 대기 중 입니다')).toBeVisible();
    await expect(page.locator('text=승인까지는 영업일 기준 1-2일 정도 소요됩니다')).toBeVisible();
    
    // 8. 승인 완료 (SignupCompletePage) - 직접 이동
    await page.goto('/signup/complete');
    await page.waitForSelector('text=딜러인증이 완료되었습니다');
    await page.screenshot({
      path: 'tests/screenshots/02-signup-step6-complete.png',
      fullPage: true,
    });
    
    await expect(page.locator('text=딜러인증이 완료되었습니다')).toBeVisible();
    await expect(page.locator('text=매물 등록하러 가기')).toBeVisible();
  });
  
  test('회원가입 플로우 - 필수 필드 검증', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Step 2로 직접 이동
    await page.goto('/signup/step2');
    await page.waitForLoadState('networkidle');
    
    // 필수 필드 없이 "다음" 클릭
    await page.click('text=다음');
    
    // 에러 메시지 확인
    await expect(page.locator('text=사업자 등록 번호를 입력해주세요')).toBeVisible();
    
    // 필수 필드 입력
    await page.fill('input[placeholder="XXX-XX-XXXXX"]', '1234567890');
    
    // 파일 업로드
    const fileInput = page.locator('input[type="file"]').first();
    await fileInput.setInputFiles({
      name: 'test.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake image content'),
    });
    
    await page.fill('input[placeholder="대표자명"]', '홍길동');
    await page.fill('input[placeholder="사업장 주소"]', '서울시 강남구');
    
    // 필수 Select 2개: 업태 종목, 사업자 정보 선택
    await page.locator('select').first().selectOption({ label: '소매업' });
    await page.locator('select').nth(1).selectOption({ label: '개인사업자' });
    
    // 다시 "다음" 클릭 - 이번엔 통과해야 함
    await page.click('text=다음');
    await page.waitForURL('**/signup/step3');
  });
  
  test('회원가입 플로우 - 이전 버튼 동작', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    
    // Step 3로 직접 이동
    await page.goto('/signup/step3');
    await page.waitForLoadState('networkidle');
    
    // "이전" 버튼 클릭
    await page.click('text=이전');
    await page.waitForURL('**/signup/step2');
    
    // Step 2에서 다시 "이전"
    await page.click('text=이전');
    await page.waitForURL('**/signup/step1');
  });
});
