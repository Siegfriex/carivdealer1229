/**
 * 에러 처리 미들웨어
 * RFC 9457 Problem Details for HTTP APIs 형식으로 일관된 에러 응답 및 로깅
 */

import { Request, Response } from 'express';

const ERROR_BASE_URI = 'https://api.carivdealer.com/errors#';

/** HTTP 상태 코드별 problem type (RFC 9457) */
const STATUS_TO_TYPE: Record<number, string> = {
  400: `${ERROR_BASE_URI}BadRequest`,
  401: `${ERROR_BASE_URI}Unauthorized`,
  403: `${ERROR_BASE_URI}Forbidden`,
  404: `${ERROR_BASE_URI}NotFound`,
  405: `${ERROR_BASE_URI}MethodNotAllowed`,
  409: `${ERROR_BASE_URI}Conflict`,
  422: `${ERROR_BASE_URI}ValidationError`,
  500: `${ERROR_BASE_URI}InternalError`,
};

function getProblemType(statusCode: number): string {
  return STATUS_TO_TYPE[statusCode] ?? `${ERROR_BASE_URI}InternalError`;
}

function generateTraceId(): string {
  return `trace-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  context?: Record<string, any>;
  /** RFC 9457: problem type URI */
  type?: string;
  /** RFC 9457: short summary */
  title?: string;
  /** RFC 9457: human-readable detail (default: message) */
  detail?: string;
  /** RFC 9457: instance URI (e.g. request path) */
  instance?: string;
  /** 확장: 요청 추적 ID */
  traceId?: string;
}

/**
 * RFC 9457 Problem Details 응답 본문
 */
export interface ProblemDetails {
  type: string;
  status: number;
  title: string;
  detail: string;
  instance?: string;
  traceId?: string;
  /** 확장: 에러 코드 */
  code?: string;
  /** 확장: 개발용 컨텍스트 (개발 환경에서만) */
  context?: Record<string, any>;
}

/**
 * 통합 에러 핸들러 (RFC 9457)
 * Content-Type: application/problem+json
 */
export function errorHandler(error: ApiError, req: Request, res: Response): void {
  const statusCode = error.statusCode || 500;
  const message = error.message || 'Internal server error';
  const reqId = req.headers['x-request-id'];
  const traceId =
    error.traceId ??
    (typeof reqId === 'string' ? reqId : Array.isArray(reqId) ? reqId[0] : undefined) ??
    generateTraceId();

  const logContext = {
    method: req.method,
    path: req.path,
    statusCode,
    code: error.code,
    message,
    context: error.context,
    traceId,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV === 'development' || process.env.FUNCTIONS_EMULATOR) {
    console.error('[ErrorHandler]', logContext, '\nStack:', error.stack);
  } else {
    console.error('[ErrorHandler]', logContext);
  }

  const problem: ProblemDetails = {
    type: error.type ?? getProblemType(statusCode),
    status: statusCode,
    title: error.title ?? (statusCode === 500 ? 'Internal Server Error' : 'Request Error'),
    detail: error.detail ?? message,
    instance: error.instance ?? req.path,
    traceId,
    code: error.code,
  };

  if (process.env.NODE_ENV === 'development' || process.env.FUNCTIONS_EMULATOR) {
    if (error.context) {
      problem.context = error.context;
    }
  }

  res.status(statusCode).setHeader('Content-Type', 'application/problem+json').json(problem);
}

/**
 * 비동기 핸들러 래퍼
 */
export function asyncHandler(
  fn: (req: Request, res: Response) => Promise<void>
): (req: Request, res: Response) => Promise<void> {
  return async (req: Request, res: Response): Promise<void> => {
    try {
      await fn(req, res);
    } catch (error: any) {
      const apiError: ApiError =
        error instanceof Error ? (error as ApiError) : (new Error(String(error)) as ApiError);

      if (!apiError.statusCode) {
        apiError.statusCode = error.statusCode ?? error.status ?? 500;
      }
      if (!apiError.traceId) {
        apiError.traceId = generateTraceId();
      }

      errorHandler(apiError, req, res);
    }
  };
}

/**
 * 에러 생성 헬퍼 (RFC 9457 필드 지원)
 */
export function createError(
  message: string,
  statusCode: number = 500,
  code?: string,
  context?: Record<string, any>,
  options?: { type?: string; title?: string; detail?: string; instance?: string }
): ApiError {
  const error = new Error(message) as ApiError;
  error.statusCode = statusCode;
  if (code) error.code = code;
  if (context) error.context = context;
  if (options?.type) error.type = options.type;
  if (options?.title) error.title = options.title;
  if (options?.detail) error.detail = options.detail;
  if (options?.instance) error.instance = options.instance;
  return error;
}
