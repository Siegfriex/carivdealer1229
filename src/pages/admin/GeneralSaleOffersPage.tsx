/**
 * GeneralSaleOffersPage Component
 * 일반 판매 제안 목록
 * 
 * 기존: src/components/GeneralSaleOffersPage.tsx
 */

import { Header } from '@/widgets/Header/ui/Header';
import { Sidebar } from '@/widgets/Sidebar/ui/Sidebar';
import { Card } from '@/shared/ui/Card';
import { Button } from '@/shared/ui/Button';

// 기존 컴포넌트 임시 import (향후 제거)
import OriginalGeneralSaleOffersPage from '@/components/GeneralSaleOffersPage';

export const GeneralSaleOffersPage = ({ onNavigate }: { onNavigate?: (screen: string) => void }) => {
  // 임시: 기존 컴포넌트 래핑
  // TODO: 새로운 디자인으로 완전히 재작성
  return <OriginalGeneralSaleOffersPage onNavigate={onNavigate || (() => {})} />;
};
