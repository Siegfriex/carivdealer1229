/**
 * AuthContext
 * 인증 상태 플레이스홀더. IA §4.2 비로그인 시 회원가입 유도 플로우용.
 * 현재는 localStorage 키로 가드만 동작; 추후 Firebase Auth 등으로 교체 가능.
 * @see docs/figma/IA_SITEMAP_SPEC_IPOE.md §4.2
 */

import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';

const AUTH_STORAGE_KEY = 'carivdealer_auth';

/** 인증 컨텍스트 값: 로그인 여부 및 설정 함수 */
interface AuthContextValue {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** localStorage에서 인증 여부 읽기 (실패 시 false) */
function readStoredAuth(): boolean {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

/**
 * 인증 상태 Provider. 자식에서 useAuth 사용 가능.
 * @param children - 자식 노드
 * @description 인증 상태를 localStorage에 동기화. 추후 Firebase Auth로 교체 가능.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setAuthenticatedState] = useState(readStoredAuth);

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, String(isAuthenticated));
    } catch {
      // ignore
    }
  }, [isAuthenticated]);

  const setAuthenticated = useCallback((value: boolean) => {
    setAuthenticatedState(value);
  }, []);

  const value = useMemo(
    () => ({ isAuthenticated, setAuthenticated }),
    [isAuthenticated, setAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * 인증 컨텍스트 훅. AuthProvider 밖에서 호출 시 에러.
 * @returns isAuthenticated, setAuthenticated
 */
export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

/**
 * 보호된 라우트 래퍼. 비로그인 시 /signup으로 리다이렉트하고 redirect 쿼리로 현재 경로 전달.
 * @description IA §4.2 회원가입 유도. 로그인 후 원래 목적지로 복귀 가능.
 */
export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const redirect = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/signup?redirect=${redirect}`} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
