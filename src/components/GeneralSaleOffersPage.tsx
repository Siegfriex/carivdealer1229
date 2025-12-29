import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check, X, Clock, DollarSign, Building } from 'lucide-react';
import { apiClient } from '../services/api';

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

const GeneralSaleOffersPage = ({ onNavigate }: { onNavigate: (screen: string, vehicleId?: string) => void }) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  useEffect(() => {
    loadOffers();
  }, []);

  const loadOffers = async () => {
    try {
      setLoading(true);
      // TODO: Firestore에서 실제 제안 목록 로드
      // 임시 Mock 데이터
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
    } catch (error) {
      console.error('Failed to load offers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (offerId: string) => {
    try {
      setProcessingId(offerId);
      await apiClient.trade.acceptProposal(offerId, 'accept');
      // 제안 목록에서 제거
      setOffers(prev => prev.filter(o => o.id !== offerId));
      alert('제안이 수락되었습니다.');
    } catch (error) {
      console.error('Failed to accept offer:', error);
      alert('제안 수락에 실패했습니다.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (offerId: string) => {
    try {
      setProcessingId(offerId);
      await apiClient.trade.acceptProposal(offerId, 'reject');
      setOffers(prev => prev.filter(o => o.id !== offerId));
      alert('제안이 거절되었습니다.');
    } catch (error) {
      console.error('Failed to reject offer:', error);
      alert('제안 거절에 실패했습니다.');
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
      <header className="bg-white border-b border-fmax-border px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('SCR-0100')} className="p-2 hover:bg-fmax-surface rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-fmax-text-secondary" />
          </button>
          <h1 className="text-lg font-bold text-fmax-text-main">일반 판매 제안 목록</h1>
        </div>
      </header>

      <main className="flex-grow p-4 sm:p-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-4">
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
  );
};

export default GeneralSaleOffersPage;

