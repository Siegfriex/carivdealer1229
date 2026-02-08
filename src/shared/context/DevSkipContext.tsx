/**
 * DevSkipContext
 * 개발 시 필수 입력 검증을 스킵하기 위한 전역 상태.
 * dev:skip 버튼으로 토글. localStorage에 유지하여 새로고침 후에도 유지.
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'dev_skip_required';

interface DevSkipContextValue {
  skipRequired: boolean;
  toggleSkipRequired: () => void;
}

const DevSkipContext = createContext<DevSkipContextValue | null>(null);

export const DevSkipProvider = ({ children }: { children: React.ReactNode }) => {
  const [skipRequired, setSkipRequiredState] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, String(skipRequired));
    } catch {
      // ignore
    }
  }, [skipRequired]);

  const toggleSkipRequired = useCallback(() => {
    setSkipRequiredState((prev) => !prev);
  }, []);

  return (
    <DevSkipContext.Provider value={{ skipRequired, toggleSkipRequired }}>
      {children}
    </DevSkipContext.Provider>
  );
};

export const useDevSkip = (): DevSkipContextValue => {
  const ctx = useContext(DevSkipContext);
  if (!ctx) {
    return {
      skipRequired: false,
      toggleSkipRequired: () => {},
    };
  }
  return ctx;
};
