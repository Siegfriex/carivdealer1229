/**
 * SettlementListPage Component
 * 정산 목록
 * 
 * 기존: src/components/SettlementListPage.tsx
 */

import OriginalSettlementListPage from '@/components/SettlementListPage';

export const SettlementListPage = ({ onNavigate }: { onNavigate?: (screen: string) => void }) => {
  return <OriginalSettlementListPage onNavigate={onNavigate || (() => {})} />;
};
