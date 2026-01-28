/**
 * Application Entry Point
 * 프로바이더 래핑 및 앱 초기화
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryProvider } from './providers/QueryProvider';
import { ToastProvider } from './providers/ToastProvider';
import { DevSkipProvider } from '@/shared/context/DevSkipContext';
import { ErrorBoundary } from '@/shared/ui/ErrorBoundary';
import { Router } from './router';
import './styles/globals.css';

const App = () => {
  return (
    <React.StrictMode>
      <ErrorBoundary>
        <QueryProvider>
          <ToastProvider>
            <DevSkipProvider>
              <Router />
            </DevSkipProvider>
          </ToastProvider>
        </QueryProvider>
      </ErrorBoundary>
    </React.StrictMode>
  );
};

// Mount app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
