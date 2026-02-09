/**
 * 에러 경계 컴포넌트
 * 자식 트리에서 발생한 런타임 에러를 잡아 fallback UI 표시 및 logError로 로깅.
 */

import { Component, type ErrorInfo, type ReactNode } from 'react';
import { logError, ErrorType } from '@/shared/lib/errorHandler';
import type { ApiError } from '@/shared/lib/errorHandler';

/** ErrorBoundary props (children, 선택 fallback) */
interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/** ErrorBoundary 내부 상태 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * 에러 경계. 자식에서 에러 발생 시 fallback 또는 기본 "문제가 발생했습니다" + 다시 시도 버튼 렌더.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    const apiError: ApiError = {
      type: ErrorType.UNKNOWN_ERROR,
      message: error.message,
      originalError: error,
    };
    logError(apiError, 'ErrorBoundary');
    if (import.meta.env.DEV) {
      console.error('ErrorBoundary caught:', error, errorInfo);
    }
  }

  render(): ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-md w-full text-center">
            <h1 className="text-h2 font-bold text-gray-900 mb-2">문제가 발생했습니다</h1>
            <p className="text-body text-gray-600 mb-6">
              일시적인 오류가 발생했습니다. 페이지를 새로고침하거나 잠시 후 다시 시도해주세요.
            </p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:opacity-90 transition-opacity font-medium"
            >
              다시 시도
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
