/**
 * errorHandler 유틸리티 테스트
 */

import { describe, test, expect } from 'vitest';
import { analyzeError, ErrorType, handleError, isRetryableError } from './errorHandler';

describe('analyzeError', () => {
  test('네트워크 에러 (Failed to fetch)를 NETWORK_ERROR로 분류', () => {
    const result = analyzeError(new Error('Failed to fetch'));
    expect(result.type).toBe(ErrorType.NETWORK_ERROR);
    expect(result.message).toBe('네트워크 연결을 확인해주세요.');
  });

  test('타임아웃 에러를 TIMEOUT_ERROR로 분류', () => {
    const result = analyzeError(new Error('Request timeout'));
    expect(result.type).toBe(ErrorType.TIMEOUT_ERROR);
    expect(result.message).toContain('요청 시간이 초과');
  });

  test('401/403을 AUTH_ERROR로 분류', () => {
    const result = analyzeError({ statusCode: 401, message: 'Unauthorized' });
    expect(result.type).toBe(ErrorType.AUTH_ERROR);
    expect(result.message).toContain('인증이 필요합니다');
  });

  test('404를 VALIDATION_ERROR로 분류', () => {
    const result = analyzeError({ statusCode: 404 });
    expect(result.type).toBe(ErrorType.VALIDATION_ERROR);
    expect(result.message).toContain('찾을 수 없습니다');
  });

  test('500을 SERVER_ERROR로 분류', () => {
    const result = analyzeError({ statusCode: 500 });
    expect(result.type).toBe(ErrorType.SERVER_ERROR);
    expect(result.message).toContain('서버 오류');
  });

  test('알 수 없는 에러를 UNKNOWN_ERROR로 분류', () => {
    const result = analyzeError(new Error('Custom error'));
    expect(result.type).toBe(ErrorType.UNKNOWN_ERROR);
    expect(result.message).toBe('Custom error');
  });
});

describe('handleError', () => {
  test('에러 메시지 문자열 반환', () => {
    const msg = handleError(new Error('Test error'), 'TestContext');
    expect(typeof msg).toBe('string');
    expect(msg).toBe('Test error');
  });
});

describe('isRetryableError', () => {
  test('NETWORK_ERROR는 재시도 가능', () => {
    expect(isRetryableError({ type: ErrorType.NETWORK_ERROR, message: '' })).toBe(true);
  });
  test('VALIDATION_ERROR는 재시도 불가', () => {
    expect(isRetryableError({ type: ErrorType.VALIDATION_ERROR, message: '' })).toBe(false);
  });
});
