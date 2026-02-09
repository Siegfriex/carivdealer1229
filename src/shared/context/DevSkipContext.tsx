/**
 * DevSkipContext
 * 개발 시 필수 입력 검증을 스킵하기 위한 전역 상태.
 * dev:skip 버튼으로 토글. localStorage에 유지하여 새로고침 후에도 유지.
 */

import { createContext, useContext, useState, useCallback, useEffect } from 'react';

const STORAGE_KEY = 'dev_skip_required';

/** 개발용 스킵 상태: 필수 입력 스킵 여부 및 토글 함수 */
interface DevSkipContextValue {
  skipRequired: boolean;
  toggleSkipRequired: () => void;
}

const DevSkipContext = createContext<DevSkipContextValue | null>(null);

/**
 * 개발용 스킵 Provider. dev:skip 버튼으로 토글 시 전역 상태 반영, localStorage 동기화.
 * @param children - 자식 노드
 */
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

/**
 * 개발용 스킵 훅. Provider 밖에서는 skipRequired false, 토글 no-op 반환.
 * @returns skipRequired, toggleSkipRequired
 */
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
