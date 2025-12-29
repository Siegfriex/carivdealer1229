import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, Calendar, DollarSign, Eye, CheckCircle2 } from 'lucide-react';

interface Settlement {
  id: string;
  vehicleId: string;
  plateNumber: string;
  modelName: string;
  salePrice: string;
  settlementAmount: string;
  fees: string;
  refundAmount: string;
  settlementDate: string;
  status: 'completed' | 'pending';
}

const SettlementListPage = ({ onNavigate }: { onNavigate: (screen: string, settlementId?: string) => void }) => {
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    loadSettlements();
  }, [filter]);

  const loadSettlements = async () => {
    try {
      setLoading(true);
      // TODO: Firestore에서 실제 정산 내역 로드
      // 임시 Mock 데이터
      const mockSettlements: Settlement[] = [
        {
          id: 'settle-001',
          vehicleId: 'v-106',
          plateNumber: '33바 3333',
          modelName: 'Carnival KA4',
          salePrice: '2,850',
          settlementAmount: '2,850',
          fees: '142.5',
          refundAmount: '259.09',
          settlementDate: '2025-05-20',
          status: 'completed'
        },
        {
          id: 'settle-002',
          vehicleId: 'v-107',
          plateNumber: '77사 7777',
          modelName: 'Avante CN7',
          salePrice: '1,450',
          settlementAmount: '1,450',
          fees: '72.5',
          refundAmount: '131.81',
          settlementDate: '2025-05-19',
          status: 'completed'
        },
        {
          id: 'settle-003',
          vehicleId: 'v-108',
          plateNumber: '99아 9999',
          modelName: 'E-Class E300',
          salePrice: '4,200',
          settlementAmount: '4,200',
          fees: '210',
          refundAmount: '381.82',
          settlementDate: '2025-05-18',
          status: 'pending'
        },
      ];
      setSettlements(mockSettlements);
    } catch (error) {
      console.error('Failed to load settlements:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredSettlements = settlements.filter(s => 
    filter === 'all' || s.status === filter
  );

  return (
    <div className="min-h-screen bg-fmax-surface flex flex-col">
      <header className="bg-white border-b border-fmax-border px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('SCR-0100')} className="p-2 hover:bg-fmax-surface rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-fmax-text-secondary" />
          </button>
          <h1 className="text-lg font-bold text-fmax-text-main">정산 내역</h1>
        </div>
      </header>

      <main className="flex-grow p-4 sm:p-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-4">
          {/* Filter */}
          <div className="bg-white rounded-lg p-4">
            <div className="flex gap-2">
              {(['all', 'completed', 'pending'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === status
                      ? 'bg-fmax-primary text-white'
                      : 'bg-fmax-surface text-fmax-text-sub hover:bg-fmax-border'
                  }`}
                >
                  {status === 'all' ? '전체' : status === 'completed' ? '정산 완료' : '정산 대기'}
                </button>
              ))}
            </div>
          </div>

          {/* Settlement List */}
          {loading ? (
            <div className="bg-white rounded-lg p-8 text-center text-gray-500">로딩 중...</div>
          ) : filteredSettlements.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center text-gray-500">
              <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>정산 내역이 없습니다</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-fmax-border overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-fmax-border text-xs uppercase tracking-wider text-fmax-text-sub font-semibold">
                    <th className="p-4 pl-6">차량 정보</th>
                    <th className="p-4">판매가</th>
                    <th className="p-4">수수료</th>
                    <th className="p-4">환급액</th>
                    <th className="p-4">정산일</th>
                    <th className="p-4">상태</th>
                    <th className="p-4 text-right pr-6">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-fmax-border">
                  {filteredSettlements.map((settlement) => (
                    <tr key={settlement.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 pl-6">
                        <div>
                          <p className="font-bold text-fmax-text-main text-sm">{settlement.plateNumber}</p>
                          <p className="text-xs text-fmax-text-sub mt-0.5">{settlement.modelName}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-fmax-primary" />
                          <span className="font-bold text-fmax-text-main">{settlement.salePrice}만원</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-gray-600">{settlement.fees}만원</td>
                      <td className="p-4">
                        <span className="font-bold text-fmax-success">{settlement.refundAmount}만원</span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{settlement.settlementDate}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                          settlement.status === 'completed'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {settlement.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                          {settlement.status === 'completed' ? '정산 완료' : '정산 대기'}
                        </span>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <button
                          onClick={() => onNavigate('SCR-0105', settlement.id)}
                          className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-fmax-primary transition-colors"
                          title="상세보기"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SettlementListPage;

