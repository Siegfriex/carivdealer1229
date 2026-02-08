/**
 * AuthContext
 * 인증 상태 플레이스홀더. IA §4.2 비로그인 시 회원가입 유도 플로우용.
 * 현재는 localStorage 키로 가드만 동작; 추후 Firebase Auth 등으로 교체 가능.
 * @see docs/figma/IA_SITEMAP_SPEC_IPOE.md §4.2
 */

import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';

const AUTH_STORAGE_KEY = 'carivdealer_auth';

interface AuthContextValue {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredAuth(): boolean {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

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

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}

/**
 * GNB 목적지 등 보호된 라우트: 비로그인 시 /signup으로 리다이렉트(IA §4.2 회원가입 유도).
 * 현재 경로를 redirect 쿼리로 전달하여 로그인 후 복귀 가능하게 함.
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
