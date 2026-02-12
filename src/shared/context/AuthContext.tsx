/**
 * AuthContext
 * 인증 상태 플레이스홀더. IA §4.2 비로그인 시 회원가입 유도 플로우용.
 * 현재는 localStorage 키로 가드만 동작; 추후 Firebase Auth 등으로 교체 가능.
 * @see docs/figma/IA_SITEMAP_SPEC_IPOE.md §4.2
 */

import { createContext, useContext, useMemo, useState, useCallback, useEffect } from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';

const AUTH_STORAGE_KEY = 'carivdealer_auth';
const LOGGED_OUT_BY_USER_KEY = 'carivdealer_logged_out';

/** Mock/Dev용 딜러 ID 플레이스홀더. API 전환 시 Firebase Auth uid 또는 JWT sub로 교체 */
const MOCK_DEALER_ID = 'mock-dealer-id';

/** 인증 컨텍스트 값: 로그인 여부, dealerId, 설정 함수 */
interface AuthContextValue {
  isAuthenticated: boolean;
  setAuthenticated: (value: boolean) => void;
  /** 현재 로그인 딜러 ID. API 전환 시 JWT/uid 등에서 채움. Mock/Dev에서는 MOCK_DEALER_ID */
  dealerId: string | null;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** URL 쿼리 ?devLogin=1 체크 (런데브·파베 호스팅 공통, 캐시 없이 로그인 우회) */
function readDevLoginFromUrl(): boolean {
  try {
    return new URLSearchParams(window.location.search).get('devLogin') === '1';
  } catch {
    return false;
  }
}

/** 사용자가 명시적으로 로그아웃했는지 (로그아웃 시 devLogin 우회 무시) */
function readLoggedOutByUser(): boolean {
  try {
    return localStorage.getItem(LOGGED_OUT_BY_USER_KEY) === 'true';
  } catch {
    return false;
  }
}

/** localStorage에서 인증 여부 읽기 (실패 시 false) */
function readStoredAuth(): boolean {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY) === 'true';
  } catch {
    return false;
  }
}

/** 최종 인증 여부: devLogin URL(단, 사용자 로그아웃 제외) > localStorage */
function getInitialAuth(): boolean {
  if (readDevLoginFromUrl() && !readLoggedOutByUser()) return true;
  return readStoredAuth();
}

/**
 * 인증 상태 Provider. 자식에서 useAuth 사용 가능.
 * @param children - 자식 노드
 * @description 인증 상태를 localStorage에 동기화. 추후 Firebase Auth로 교체 가능.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setAuthenticatedState] = useState(getInitialAuth);

  useEffect(() => {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, String(isAuthenticated));
      if (isAuthenticated) {
        localStorage.removeItem(LOGGED_OUT_BY_USER_KEY);
      }
    } catch {
      // ignore
    }
  }, [isAuthenticated]);

  const setAuthenticated = useCallback((value: boolean) => {
    setAuthenticatedState(value);
    try {
      if (!value) {
        localStorage.setItem(LOGGED_OUT_BY_USER_KEY, 'true');
      }
    } catch {
      // ignore
    }
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated,
      setAuthenticated,
      dealerId: isAuthenticated ? MOCK_DEALER_ID : null,
    }),
    [isAuthenticated, setAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * 인증 컨텍스트 훅. AuthProvider 밖에서 호출 시 에러.
 * @returns isAuthenticated, setAuthenticated, dealerId (로그인 시. API 전환 시 JWT/uid로 교체 예정)
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
