/**
 * 앱 진입점
 * 프로바이더 래핑(Query·Toast·Auth·DevSkip)·라우터·전역 스타일 로드.
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryProvider } from './providers/QueryProvider';
import { ToastProvider } from './providers/ToastProvider';
import { AuthProvider } from '@/shared/context/AuthContext';
import { DevSkipProvider } from '@/shared/context/DevSkipContext';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';
import { Router } from './router';
import './styles/globals.css';

/** 루트 앱 컴포넌트 (StrictMode·ErrorBoundary·프로바이더·Router) */
const App = () => {
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <QueryProvider>
          <ToastProvider>
            <DevSkipProvider>
              <AuthProvider>
                <Router />
              </AuthProvider>
            </DevSkipProvider>
          </ToastProvider>
        </QueryProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

// #root에 React 앱 마운트
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
