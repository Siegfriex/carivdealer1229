/**
 * Vitest 전역 설정
 * jest-dom 매처 확장·각 테스트 후 React cleanup.
 */

import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Vitest expect에 jest-dom 매처 확장
expect.extend(matchers);

// 각 테스트 후 DOM 정리
afterEach(() => {
  cleanup();
});
