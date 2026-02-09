/**
 * 통합 에러 처리 유틸리티
 * API 호출 실패 시 에러 분류(네트워크·타임아웃·인증·서버 등) 및 사용자 친화 메시지·로깅·재시도 제공.
 */

/** 에러 분류 타입 (네트워크·타임아웃·검증·인증·서버·알수없음) */
export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

/** API 에러 객체: 분류·메시지·원본 에러·HTTP 상태코드 */
export interface ApiError {
  type: ErrorType;
  message: string;
  originalError?: unknown;
  statusCode?: number;
}

/** message 문자열 존재 여부 타입 가드 */
function hasMessage(e: unknown): e is { message: string } {
  return typeof e === 'object' && e !== null && 'message' in e && typeof (e as { message: unknown }).message === 'string';
}
/** code 문자열 존재 여부 타입 가드 */
function hasCode(e: unknown): e is { code: string } {
  return typeof e === 'object' && e !== null && 'code' in e && typeof (e as { code: unknown }).code === 'string';
}
/** name 문자열 존재 여부 타입 가드 */
function hasName(e: unknown): e is { name: string } {
  return typeof e === 'object' && e !== null && 'name' in e && typeof (e as { name: unknown }).name === 'string';
}
/** statusCode 또는 status 존재 여부 타입 가드 */
function hasStatus(e: unknown): e is { statusCode?: number; status?: number; message?: string } {
  return typeof e === 'object' && e !== null && (('statusCode' in e) || ('status' in e));
}

/**
 * unknown 에러를 분류하여 ApiError로 반환.
 * @param error - catch된 에러 (unknown)
 * @returns ErrorType·message·originalError·statusCode가 채워진 ApiError
 */
export const analyzeError = (error: unknown): ApiError => {
  // 네트워크 에러 감지
  if (
    (hasMessage(error) && (
      error.message.includes('Failed to fetch') ||
      error.message.includes('NetworkError') ||
      error.message.includes('Network request failed') ||
      error.message.includes('ERR_CONNECTION_REFUSED') ||
      error.message.includes('ECONNREFUSED')
    )) ||
    (hasCode(error) && error.code === 'ECONNREFUSED') ||
    (hasName(error) && error.name === 'NetworkError')
  ) {
    return {
      type: ErrorType.NETWORK_ERROR,
      message: '네트워크 연결을 확인해주세요.',
      originalError: error,
    };
  }

  // 타임아웃 에러 감지
  if (
    (hasMessage(error) && (error.message.includes('timeout') || error.message.includes('Timeout'))) ||
    (hasCode(error) && error.code === 'ETIMEDOUT')
  ) {
    return {
      type: ErrorType.TIMEOUT_ERROR,
      message: '요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.',
      originalError: error,
    };
  }

  // HTTP 상태 코드 기반 에러 처리
  if (hasStatus(error)) {
    const statusCode = error.statusCode ?? error.status ?? 0;

    if (statusCode >= 400 && statusCode < 500) {
      // 클라이언트 에러 (4xx)
      if (statusCode === 401 || statusCode === 403) {
        return {
          type: ErrorType.AUTH_ERROR,
          message: '인증이 필요합니다. 다시 로그인해주세요.',
          originalError: error,
          statusCode,
        };
      }

      if (statusCode === 400) {
        return {
          type: ErrorType.VALIDATION_ERROR,
          message: (hasMessage(error) ? error.message : null) || '입력 정보를 확인해주세요.',
          originalError: error,
          statusCode,
        };
      }

      if (statusCode === 404) {
        return {
          type: ErrorType.VALIDATION_ERROR,
          message: '요청한 리소스를 찾을 수 없습니다.',
          originalError: error,
          statusCode,
        };
      }

      return {
        type: ErrorType.VALIDATION_ERROR,
        message: (hasMessage(error) ? error.message : null) || '요청을 처리할 수 없습니다.',
        originalError: error,
        statusCode,
      };
    }

    if (statusCode >= 500) {
      // 서버 에러 (5xx)
      return {
        type: ErrorType.SERVER_ERROR,
        message: '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.',
        originalError: error,
        statusCode,
      };
    }
  }

  // 알 수 없는 에러
  return {
    type: ErrorType.UNKNOWN_ERROR,
    message: (hasMessage(error) ? error.message : null) || '알 수 없는 오류가 발생했습니다.',
    originalError: error,
  };
};

/**
 * ApiError에서 사용자에게 보여줄 메시지 문자열 반환.
 * @param error - analyzeError로 변환된 에러
 * @returns 한글 등 사용자 친화 메시지
 */
export const getUserFriendlyMessage = (error: ApiError): string => {
  return error.message;
};

/**
 * 에러를 콘솔에 로깅. context로 출처 표시 가능.
 * @param error - 로깅할 ApiError
 * @param context - 로그 접두사 (예: 'ErrorBoundary')
 */
export const logError = (error: ApiError, context?: string) => {
  const logContext = context ? `[${context}]` : '';
  console.error(`${logContext} Error:`, {
    type: error.type,
    message: error.message,
    statusCode: error.statusCode,
    originalError: error.originalError,
  });
};

/**
 * unknown 에러를 분석·로깅 후 사용자 메시지 문자열 반환.
 * @param error - catch된 에러
 * @param context - logError에 전달할 컨텍스트
 * @returns 사용자에게 보여줄 메시지
 */
export const handleError = (error: unknown, context?: string): string => {
  const apiError = analyzeError(error);
  logError(apiError, context);
  return getUserFriendlyMessage(apiError);
};

/**
 * 재시도 가능한 에러 타입인지 여부.
 * @param error - ApiError
 * @returns 네트워크·타임아웃·서버 에러이면 true
 */
export const isRetryableError = (error: ApiError): boolean => {
  return (
    error.type === ErrorType.NETWORK_ERROR ||
    error.type === ErrorType.TIMEOUT_ERROR ||
    error.type === ErrorType.SERVER_ERROR
  );
};

/**
 * 지수 백오프 재시도. 재시도 불가 에러면 즉시 throw.
 * @param fn - 실행할 비동기 함수
 * @param maxRetries - 최대 재시도 횟수 (기본 3)
 * @param initialDelay - 첫 대기 시간 밀리초 (기본 1000)
 * @returns fn의 반환값
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> => {
  let lastError: unknown;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const apiError = analyzeError(error);

      if (!isRetryableError(apiError)) {
        throw error;
      }

      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
};
