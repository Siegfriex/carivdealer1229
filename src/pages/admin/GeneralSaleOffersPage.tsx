/**
 * GeneralSaleOffersPage - 일반 판매 제안 목록
 * FSD 마이그레이션 완료 (Phase 2.4)
 */

import { useState, useEffect } from 'react';
import { Check, X, Clock, DollarSign, Building } from 'lucide-react';
import { LandingHeader } from '@/widgets/Header/ui/LandingHeader';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { apiClient } from '@/shared/api/apiClient';
import { useToast } from '@/shared/ui/Toast';

interface Offer {
  id: string;
  bidderName: string;
  amount: string;
  date: string;
  expiresAt?: string;
  vehicleId: string;
  vehicleInfo?: {
    plateNumber: string;
    modelName: string;
  };
}

export const GeneralSaleOffersPage = () => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { showToast } = useToast();

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      setLoading(true);
      // Mock 데이터
      const mockOffers: Offer[] = [
        {
          id: 'offer-001',
          bidderName: 'Global Motors Inc.',
          amount: '2,850',
          date: '2025-05-20',
          expiresAt: '2025-05-27',
          vehicleId: 'v-106',
          vehicleInfo: { plateNumber: '33바 3333', modelName: 'Carnival KA4' }
        },
        {
          id: 'offer-002',
          bidderName: 'Auto Export Co.',
          amount: '2,750',
          date: '2025-05-19',
          expiresAt: '2025-05-26',
          vehicleId: 'v-106',
          vehicleInfo: { plateNumber: '33바 3333', modelName: 'Carnival KA4' }
        },
      ];
      setOffers(mockOffers);
    } catch {
      // Error handled silently
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (offerId: string) => {
    try {
      setProcessingId(offerId);
      await apiClient.trade.acceptProposal(offerId, 'accept');
      setOffers(prev => prev.filter(o => o.id !== offerId));
      showToast('제안이 수락되었습니다.', 'success');
    } catch {
      showToast('제안 수락에 실패했습니다.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (offerId: string) => {
    try {
      setProcessingId(offerId);
      await apiClient.trade.acceptProposal(offerId, 'reject');
      setOffers(prev => prev.filter(o => o.id !== offerId));
      showToast('제안이 거절되었습니다.', 'success');
    } catch {
      showToast('제안 거절에 실패했습니다.', 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const getTimeRemaining = (expiresAt?: string) => {
    if (!expiresAt) return null;
    const now = new Date();
    const expiry = new Date(expiresAt);
    const diff = expiry.getTime() - now.getTime();
    if (diff <= 0) return '만료됨';
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return `${days}일 남음`;
  };

  return (
    <div className="min-h-screen bg-fmax-surface flex flex-col">
      <LandingHeader userName="홍길동" variant="main" activeNav="offers" />

      <div className={LAYOUT_CLASSES.CONTAINER}>
        <main className={`flex-grow p-4 sm:p-6 lg:px-8 ${LAYOUT_CLASSES.MAIN_LIST}`}>
          <div className="mx-auto max-w-4xl space-y-4">
          {loading ? (
            <div className="bg-white rounded-lg p-8 text-center text-gray-500">로딩 중...</div>
          ) : offers.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center text-gray-500">
              <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>받은 제안이 없습니다</p>
            </div>
          ) : (
            offers.map((offer) => (
              <div key={offer.id} className="bg-white rounded-lg p-6 border border-fmax-border hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Building className="w-5 h-5 text-fmax-primary" />
                      <h3 className="font-bold text-fmax-text-main">{offer.bidderName}</h3>
                    </div>
                    {offer.vehicleInfo && (
                      <p className="text-sm text-gray-600 mb-1">
                        {offer.vehicleInfo.plateNumber} · {offer.vehicleInfo.modelName}
                      </p>
                    )}
                    <div className="flex items-center gap-4 mt-3">
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-fmax-primary" />
                        <span className="text-xl font-bold text-fmax-primary">{offer.amount}만원</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>제안일: {offer.date}</span>
                      </div>
                      {offer.expiresAt && (
                        <div className={`text-sm font-medium ${
                          getTimeRemaining(offer.expiresAt) === '만료됨' ? 'text-red-600' : 'text-gray-600'
                        }`}>
                          {getTimeRemaining(offer.expiresAt)}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleAccept(offer.id)}
                      disabled={processingId === offer.id}
                      className="px-4 py-2 bg-fmax-primary text-white rounded-lg hover:bg-primaryHover transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      수락
                    </button>
                    <button
                      onClick={() => handleReject(offer.id)}
                      disabled={processingId === offer.id}
                      className="px-4 py-2 border border-fmax-border text-fmax-text-main rounded-lg hover:bg-fmax-surface transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      거절
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
          </div>
        </main>
      </div>
    </div>
  );
};
