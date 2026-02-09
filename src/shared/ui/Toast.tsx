/**
 * 토스트 알림 (Context + Provider)
 * success/error/info/warning 타입, 3초 후 자동 제거. z-index: Z_INDEX.TOAST(800).
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { Z_INDEX } from '@/shared/config/zIndex';

/** 토스트 타입 */
type ToastType = 'success' | 'error' | 'info' | 'warning';

/** 단일 토스트 항목 */
interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

/** Context 값: showToast 함수 */
interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

/**
 * 토스트 Provider. 자식에서 useToast()로 showToast 호출.
 * @param children - 자식 노드
 */
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 3000);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const icons = {
    success: CheckCircle2,
    error: AlertCircle,
    info: Info,
    warning: AlertTriangle,
  };

  const colors = {
    success: 'bg-success-light border-success text-success',
    error: 'bg-error-light border-error text-error',
    info: 'bg-info-light border-info text-info',
    warning: 'bg-warning-light border-warning text-warning',
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        className="fixed top-4 right-4 flex flex-col gap-2"
        style={{ zIndex: Z_INDEX.TOAST }}
      >
        {toasts.map((toast) => {
          const Icon = icons[toast.type];
          return (
            <div
              key={toast.id}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg
                min-w-[300px] max-w-[500px]
                animate-slide-up
                ${colors[toast.type]}
              `}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              <p className="flex-1 text-body font-medium">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 hover:opacity-70 transition-fast"
                aria-label="닫기"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

/**
 * 토스트 훅. ToastProvider 내부에서만 사용.
 * @returns showToast(message, type?) — success/error/info/warning (기본 info)
 */
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};
