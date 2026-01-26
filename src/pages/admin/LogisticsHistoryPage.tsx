/**
 * LogisticsHistoryPage Component
 * 탁송 이력
 * 
 * 기존: src/components/LogisticsHistoryPage.tsx
 */

import OriginalLogisticsHistoryPage from '@/components/LogisticsHistoryPage';

export const LogisticsHistoryPage = ({ onNavigate }: { onNavigate?: (screen: string) => void }) => {
  return <OriginalLogisticsHistoryPage onNavigate={onNavigate || (() => {})} />;
};
