/**
 * Application Entry Point
 * 프로바이더 래핑 및 앱 초기화
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { QueryProvider } from './providers/QueryProvider';
import { ToastProvider } from './providers/ToastProvider';
import { Router } from './router';
import './styles/globals.css';

const App = () => {
  return (
    <React.StrictMode>
      <QueryProvider>
        <ToastProvider>
          <Router />
        </ToastProvider>
      </QueryProvider>
    </React.StrictMode>
  );
};

// Mount app
const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
