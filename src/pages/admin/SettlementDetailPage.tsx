/**
 * SettlementDetailPage Component
 * 정산 상세
 * 
 * 기존: src/components/SettlementDetailPage.tsx
 */

import OriginalSettlementDetailPage from '@/components/SettlementDetailPage';

export const SettlementDetailPage = ({
  onNavigate,
  settlementId,
}: {
  onNavigate?: (screen: string) => void;
  settlementId?: string;
}) => {
  return <OriginalSettlementDetailPage onNavigate={onNavigate || (() => {})} settlementId={settlementId} />;
};
