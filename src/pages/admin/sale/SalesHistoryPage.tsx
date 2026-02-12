/**
 * SalesHistoryPage - 판매 내역
 * useSalesHistory 훅 사용 (P0 Migration)
 */

import { useNavigate } from 'react-router-dom';
import { Car, Calendar, DollarSign, Eye } from 'lucide-react';
import { LandingHeader } from '@/widgets/Header';
import { LAYOUT_CLASSES } from '@/shared/config/layout';
import { useSalesHistory } from '@/features/sale';

export const SalesHistoryPage = () => {
  const navigate = useNavigate();
  const { data: sales = [], isLoading: loading } = useSalesHistory();

  return (
    <div className="min-h-screen bg-fmax-surface flex flex-col">
      <LandingHeader userName="홍길동" variant="main" activeNav="offers" />

      <div className={LAYOUT_CLASSES.CONTAINER}>
        <main className={`flex-grow p-4 sm:p-6 lg:px-8 ${LAYOUT_CLASSES.MAIN_LIST}`}>
          <div className="mx-auto max-w-7xl">
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
                          <span className="font-bold text-fmax-primary">{sale.salePrice.toLocaleString()}만원</span>
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
                          onClick={() => navigate(`/vehicles/${sale.vehicleId}`)}
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
    </div>
  );
};
