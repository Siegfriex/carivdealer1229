/**
 * LogisticsSchedulePage Component
 * 탁송 일정 관리
 * 
 * 기존: src/components/LogisticsSchedulePage.tsx
 */

import OriginalLogisticsSchedulePage from '@/components/LogisticsSchedulePage';

export const LogisticsSchedulePage = ({ onNavigate }: { onNavigate?: (screen: string) => void }) => {
  return <OriginalLogisticsSchedulePage onNavigate={onNavigate || (() => {})} />;
};
