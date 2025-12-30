/**
 * 통합 에러 처리 유틸리티
 * 
 * API 호출 실패 시 사용자 친화적인 에러 메시지를 제공합니다.
 */

export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  TIMEOUT_ERROR = 'TIMEOUT_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  SERVER_ERROR = 'SERVER_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export interface ApiError {
  type: ErrorType;
  message: string;
  originalError?: any;
  statusCode?: number;
}

/**
 * 에러를 분석하여 타입을 결정합니다.
 */
export const analyzeError = (error: any): ApiError => {
  // 네트워크 에러 감지
  if (
    error?.message?.includes('Failed to fetch') ||
    error?.message?.includes('NetworkError') ||
    error?.message?.includes('Network request failed') ||
    error?.message?.includes('ERR_CONNECTION_REFUSED') ||
    error?.message?.includes('ECONNREFUSED') ||
    error?.code === 'ECONNREFUSED' ||
    error?.name === 'NetworkError'
  ) {
    return {
      type: ErrorType.NETWORK_ERROR,
      message: '네트워크 연결을 확인해주세요.',
      originalError: error,
    };
  }

  // 타임아웃 에러 감지
  if (
    error?.message?.includes('timeout') ||
    error?.message?.includes('Timeout') ||
    error?.code === 'ETIMEDOUT'
  ) {
    return {
      type: ErrorType.TIMEOUT_ERROR,
      message: '요청 시간이 초과되었습니다. 잠시 후 다시 시도해주세요.',
      originalError: error,
    };
  }

  // HTTP 상태 코드 기반 에러 처리
  if (error?.statusCode || error?.status) {
    const statusCode = error.statusCode || error.status;

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
          message: error.message || '입력 정보를 확인해주세요.',
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
        message: error.message || '요청을 처리할 수 없습니다.',
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
    message: error?.message || '알 수 없는 오류가 발생했습니다.',
    originalError: error,
  };
};

/**
 * 에러를 사용자 친화적인 메시지로 변환합니다.
 */
export const getUserFriendlyMessage = (error: ApiError): string => {
  return error.message;
};

/**
 * 에러를 로깅합니다.
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
 * 에러 처리 헬퍼 함수
 * 
 * @param error - 처리할 에러 객체
 * @param context - 에러 발생 컨텍스트 (선택사항)
 * @returns 사용자 친화적인 에러 메시지
 */
export const handleError = (error: any, context?: string): string => {
  const apiError = analyzeError(error);
  logError(apiError, context);
  return getUserFriendlyMessage(apiError);
};

/**
 * 재시도 가능한 에러인지 확인합니다.
 */
export const isRetryableError = (error: ApiError): boolean => {
  return (
    error.type === ErrorType.NETWORK_ERROR ||
    error.type === ErrorType.TIMEOUT_ERROR ||
    error.type === ErrorType.SERVER_ERROR
  );
};

/**
 * 에러 복구 메커니즘 (재시도)
 */
export const retryWithBackoff = async <T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  initialDelay: number = 1000
): Promise<T> => {
  let lastError: any;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      const apiError = analyzeError(error);

      if (!isRetryableError(apiError)) {
        throw error; // 재시도 불가능한 에러는 즉시 throw
      }

      if (attempt < maxRetries - 1) {
        const delay = initialDelay * Math.pow(2, attempt); // Exponential backoff
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  throw lastError;
};

