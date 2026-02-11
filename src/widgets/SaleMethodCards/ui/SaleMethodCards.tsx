/**
 * SaleMethodCards — 판매방식 변경·판매가 수정·보관·삭제 4카드
 * TradeDetailPage, AuctionDetailPage 공통
 */

import { RefreshCw, Wallet, Archive, Trash2 } from 'lucide-react';
import { Button } from '@/shared/ui/Button';
import { Card } from '@/shared/ui/Card';

export interface SaleMethodCardsProps {
  onSaleMethodChange?: () => void;
  onPriceEdit?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  /** 현재 판매 방식 (예: "일반 판매") */
  currentSaleType?: string;
  /** 현재 즉시 판매가 (예: "1,300만원") */
  currentPrice?: string;
}

export function SaleMethodCards({
  onSaleMethodChange,
  onPriceEdit,
  onArchive,
  onDelete,
  currentSaleType = '일반 판매',
  currentPrice = '1,300만원',
}: SaleMethodCardsProps) {
  return (
    <section className="mb-8">
      <h2 className="text-h3 font-bold text-gray-900 mb-4">판매 방식</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <RefreshCw className="w-6 h-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="text-body font-bold text-gray-900 mb-1">판매 방식 변경</h3>
              <p className="text-caption text-gray-600 mb-3">현재 {currentSaleType}로 거래 중입니다.</p>
              <Button size="sm" onClick={onSaleMethodChange}>변경하기</Button>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <Wallet className="w-6 h-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="text-body font-bold text-gray-900 mb-1">판매가 수정</h3>
              <p className="text-caption text-gray-600 mb-3">현재 즉시 판매가격은 {currentPrice} 입니다.</p>
              <Button size="sm" onClick={onPriceEdit}>수정하기</Button>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <Archive className="w-6 h-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="text-body font-bold text-gray-900 mb-1">보관하기</h3>
              <p className="text-caption text-gray-600 mb-3">해당 거래를 미노출 시킵니다.</p>
              <Button size="sm" variant="secondary" onClick={onArchive}>보관하기</Button>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-start gap-3">
            <Trash2 className="w-6 h-6 text-primary flex-shrink-0" />
            <div>
              <h3 className="text-body font-bold text-gray-900 mb-1">삭제하기</h3>
              <p className="text-caption text-gray-600 mb-3">해당 거래를 영구적으로 삭제합니다.</p>
              <Button size="sm" variant="secondary" onClick={onDelete}>삭제하기</Button>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
