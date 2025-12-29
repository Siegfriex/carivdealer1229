import React, { useState, useEffect } from 'react';
import { ArrowLeft, Car, Calendar, DollarSign, Eye } from 'lucide-react';

interface SaleRecord {
  id: string;
  vehicleId: string;
  plateNumber: string;
  modelName: string;
  manufacturer: string;
  modelYear: string;
  salePrice: string;
  saleDate: string;
  buyerName: string;
  saleMethod: 'auction' | 'general';
}

const SalesHistoryPage = ({ onNavigate }: { onNavigate: (screen: string, vehicleId?: string) => void }) => {
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    try {
      setLoading(true);
      // TODO: Firestore에서 실제 판매 내역 로드
      // 임시 Mock 데이터
      const mockSales: SaleRecord[] = [
        {
          id: 'sale-001',
          vehicleId: 'v-106',
          plateNumber: '33바 3333',
          modelName: 'Carnival KA4',
          manufacturer: 'Kia',
          modelYear: '2022',
          salePrice: '2,850',
          saleDate: '2025-05-15',
          buyerName: 'Global Motors Inc.',
          saleMethod: 'general'
        },
        {
          id: 'sale-002',
          vehicleId: 'v-107',
          plateNumber: '77사 7777',
          modelName: 'Avante CN7',
          manufacturer: 'Hyundai',
          modelYear: '2021',
          salePrice: '1,450',
          saleDate: '2025-05-14',
          buyerName: 'Auto Export Co.',
          saleMethod: 'auction'
        },
      ];
      setSales(mockSales);
    } catch (error) {
      console.error('Failed to load sales:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-fmax-surface flex flex-col">
      <header className="bg-white border-b border-fmax-border px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('SCR-0100')} className="p-2 hover:bg-fmax-surface rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-fmax-text-secondary" />
          </button>
          <h1 className="text-lg font-bold text-fmax-text-main">판매 내역</h1>
        </div>
      </header>

      <main className="flex-grow p-4 sm:p-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="bg-white rounded-lg p-8 text-center text-gray-500">로딩 중...</div>
          ) : sales.length === 0 ? (
            <div className="bg-white rounded-lg p-8 text-center text-gray-500">
              <Car className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>판매 내역이 없습니다</p>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-fmax-border overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-fmax-border text-xs uppercase tracking-wider text-fmax-text-sub font-semibold">
                    <th className="p-4 pl-6">차량 정보</th>
                    <th className="p-4">판매 방식</th>
                    <th className="p-4">구매자</th>
                    <th className="p-4">판매가</th>
                    <th className="p-4">판매일</th>
                    <th className="p-4 text-right pr-6">관리</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-fmax-border">
                  {sales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                            <Car className="w-5 h-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-bold text-fmax-text-main text-sm">
                              {sale.modelYear} {sale.manufacturer} {sale.modelName}
                            </p>
                            <p className="text-xs text-fmax-text-sub mt-0.5">{sale.plateNumber}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          sale.saleMethod === 'auction' 
                            ? 'bg-purple-100 text-purple-700' 
                            : 'bg-blue-100 text-blue-700'
                        }`}>
                          {sale.saleMethod === 'auction' ? '경매' : '일반 판매'}
                        </span>
                      </td>
                      <td className="p-4 text-sm text-fmax-text-main">{sale.buyerName}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4 text-fmax-primary" />
                          <span className="font-bold text-fmax-primary">{sale.salePrice}만원</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          <span>{sale.saleDate}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <button
                          onClick={() => onNavigate('SCR-0105', sale.vehicleId)}
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

export default SalesHistoryPage;

