/**
 * 로깅 유틸리티
 * platform_id, request_id(traceId) 메타데이터를 포함한 일관된 로깅
 */

import { Request } from 'express';

export interface LogContext {
  platform_id?: string;
  request_id?: string;
  traceId?: string;
  [key: string]: any;
}

/**
 * 요청에서 platform_id 추출 (헤더 또는 토큰)
 */
export function extractPlatformId(req: Request): string | undefined {
  const header = req.headers['x-platform-id'];
  if (typeof header === 'string') {
    return header;
  }
  // 향후: Firebase Auth 토큰에서 추출
  // const token = req.headers.authorization?.replace('Bearer ', '');
  // if (token) {
  //   const decoded = admin.auth().verifyIdToken(token);
  //   return decoded.platform_id;
  // }
  return undefined;
}

/**
 * 요청에서 request_id/traceId 추출
 */
export function extractRequestId(req: Request): string | undefined {
  const reqId = req.headers['x-request-id'];
  if (typeof reqId === 'string') {
    return reqId;
  }
  if (Array.isArray(reqId) && reqId.length > 0) {
    return reqId[0];
  }
  return undefined;
}

/**
 * 로그 컨텍스트 생성
 */
export function createLogContext(req: Request, additional?: Record<string, any>): LogContext {
  const context: LogContext = {
    platform_id: extractPlatformId(req),
    request_id: extractRequestId(req),
    traceId: extractRequestId(req),
    method: req.method,
    path: req.path,
  };
  if (additional) {
    Object.assign(context, additional);
  }
  return context;
}

/**
 * 로그 헬퍼 함수들
 */
export const logger = {
  info: (message: string, context?: LogContext) => {
    console.log(`[INFO] ${message}`, context || {});
  },
  warn: (message: string, context?: LogContext) => {
    console.warn(`[WARN] ${message}`, context || {});
  },
  error: (message: string, error?: Error | unknown, context?: LogContext) => {
    const logContext = {
      ...context,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    };
    console.error(`[ERROR] ${message}`, logContext);
  },
  debug: (message: string, context?: LogContext) => {
    if (process.env.NODE_ENV === 'development' || process.env.FUNCTIONS_EMULATOR) {
      console.debug(`[DEBUG] ${message}`, context || {});
    }
  },
};
