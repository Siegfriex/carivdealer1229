/**
 * SalesHistoryPage Component
 * 판매 이력
 * 
 * 기존: src/components/SalesHistoryPage.tsx
 */

import OriginalSalesHistoryPage from '@/components/SalesHistoryPage';

export const SalesHistoryPage = ({ onNavigate }: { onNavigate?: (screen: string) => void }) => {
  return <OriginalSalesHistoryPage onNavigate={onNavigate || (() => {})} />;
};
