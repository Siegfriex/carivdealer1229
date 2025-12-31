/**
 * 에러 처리 미들웨어
 * Functions 전반에 일관된 에러 응답 및 로깅 패턴 적용
 */

import { Request, Response } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  context?: Record<string, any>;
}

/**
 * 통합 에러 핸들러
 * @param error 에러 객체
 * @param req Express Request 객체
 * @param res Express Response 객체
 */
export function errorHandler(error: ApiError, req: Request, res: Response): void {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';
  
  // 로깅 (상세 정보)
  const logContext = {
    method: req.method,
    path: req.path,
    endpoint: req.path,
    statusCode,
    code: error.code,
    message,
    context: error.context,
    timestamp: new Date().toISOString(),
  };
  
  // 개발 환경에서는 스택 트레이스 포함
  if (process.env.NODE_ENV === 'development' || process.env.FUNCTIONS_EMULATOR) {
    console.error('[ErrorHandler]', logContext, '\nStack:', error.stack);
  } else {
    console.error('[ErrorHandler]', logContext);
  }
  
  // 응답 (프로덕션에서는 상세 정보 제한)
  const response: any = {
    error: message,
  };
  
  // 개발 환경에서만 추가 정보 제공
  if (process.env.NODE_ENV === 'development' || process.env.FUNCTIONS_EMULATOR) {
    if (error.code) {
      response.code = error.code;
    }
    if (error.context) {
      response.context = error.context;
    }
  }
  
  res.status(statusCode).json(response);
}

/**
 * 비동기 핸들러 래퍼
 * Express 핸들러를 래핑하여 에러를 자동으로 처리합니다.
 * 
 * @param fn 비동기 Express 핸들러 함수
 * @returns 래핑된 핸들러 함수
 */
export function asyncHandler(
  fn: (req: Request, res: Response) => Promise<void>
): (req: Request, res: Response) => Promise<void> {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      await fn(req, res);
    } catch (error: any) {
      // ApiError로 변환
      const apiError: ApiError = error instanceof Error 
        ? error as ApiError
        : new Error(String(error)) as ApiError;
      
      // 기본 statusCode 설정
      if (!apiError.statusCode) {
        if (error.statusCode) {
          apiError.statusCode = error.statusCode;
        } else if (error.status) {
          apiError.statusCode = error.status;
        } else {
          apiError.statusCode = 500;
        }
      }
      
      errorHandler(apiError, req, res);
    }
  };
}

/**
 * 에러 생성 헬퍼
 * @param message 에러 메시지
 * @param statusCode HTTP 상태 코드
 * @param code 에러 코드 (선택)
 * @param context 추가 컨텍스트 정보 (선택)
 * @returns ApiError 객체
 */
export function createError(
  message: string,
  statusCode: number = 500,
  code?: string,
  context?: Record<string, any>
): ApiError {
  const error = new Error(message) as ApiError;
  error.statusCode = statusCode;
  if (code) {
    error.code = code;
  }
  if (context) {
    error.context = context;
  }
  return error;
}

