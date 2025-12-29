import React, { useState, useEffect } from 'react';
import { ArrowLeft, CreditCard, DollarSign, Percent, FileText, Download, Printer, Truck, Banknote, CheckCircle2 } from 'lucide-react';

interface SettlementDetail {
  id: string;
  vehicleId: string;
  plateNumber: string;
  modelName: string;
  manufacturer: string;
  modelYear: string;
  salePrice: number;
  settlementAmount: number;
  platformFee: number;
  platformFeeRate: number;
  vatRefund: number;
  vatRefundRate: number;
  totalRefund: number;
  finalAmount: number;
  settlementDate: string;
  buyerName: string;
  saleMethod: 'auction' | 'general';
  // ✅ 추가 항목
  logisticsFee?: number; // 탁송비
  inspectionFee?: number; // 검차비
  bankAccount?: string; // 입금 계좌
  accountHolder?: string; // 예금주
  settlementStatus?: 'pending' | 'completed' | 'paid'; // 정산 상태
}

const SettlementDetailPage = ({ onNavigate, settlementId }: { onNavigate: (screen: string, vehicleId?: string) => void; settlementId?: string }) => {
  const [settlement, setSettlement] = useState<SettlementDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (settlementId) {
      loadSettlementDetail(settlementId);
    }
  }, [settlementId]);

  const loadSettlementDetail = async (id: string) => {
    try {
      setLoading(true);
      // TODO: Firestore에서 실제 정산 상세 정보 로드
      // 임시 Mock 데이터
      const mockSettlement: SettlementDetail = {
        id: 'settle-001',
        vehicleId: 'v-106',
        plateNumber: '33바 3333',
        modelName: 'Carnival KA4',
        manufacturer: 'Kia',
        modelYear: '2022',
        salePrice: 2850,
        settlementAmount: 2850,
        platformFee: 142.5,
        platformFeeRate: 5,
        vatRefund: 259.09,
        vatRefundRate: 9.09,
        totalRefund: 259.09,
        finalAmount: 2966.59,
        settlementDate: '2025-05-20',
        buyerName: 'Global Motors Inc.',
        saleMethod: 'general',
        // ✅ 추가 항목
        logisticsFee: 35, // 탁송비 (만원)
        inspectionFee: 20, // 검차비 (만원)
        bankAccount: '123-456-789012', // 입금 계좌
        accountHolder: '포워드맥스', // 예금주
        settlementStatus: 'paid' // 정산 상태
      };
      setSettlement(mockSettlement);
    } catch (error) {
      console.error('Failed to load settlement detail:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-fmax-surface flex items-center justify-center">
        <div className="text-center text-gray-500">로딩 중...</div>
      </div>
    );
  }

  if (!settlement) {
    return (
      <div className="min-h-screen bg-fmax-surface flex items-center justify-center">
        <div className="text-center text-gray-500">정산 정보를 찾을 수 없습니다</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fmax-surface flex flex-col">
      <header className="bg-white border-b border-fmax-border px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => onNavigate('SCR-0104')} className="p-2 hover:bg-fmax-surface rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-fmax-text-secondary" />
          </button>
          <h1 className="text-lg font-bold text-fmax-text-main">정산 상세</h1>
        </div>
        <div className="flex gap-2">
          <button className="p-2 hover:bg-fmax-surface rounded-lg transition-colors" title="다운로드">
            <Download className="w-5 h-5 text-gray-600" />
          </button>
          <button className="p-2 hover:bg-fmax-surface rounded-lg transition-colors" title="인쇄">
            <Printer className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </header>

      <main className="flex-grow p-4 sm:p-6 lg:px-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Vehicle Info Card */}
          <div className="bg-white rounded-lg p-6 border border-fmax-border">
            <h2 className="text-lg font-bold text-fmax-text-main mb-4">차량 정보</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 mb-1">차량번호</p>
                <p className="font-bold text-fmax-text-main">{settlement.plateNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">차량명</p>
                <p className="font-bold text-fmax-text-main">{settlement.manufacturer} {settlement.modelName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">연식</p>
                <p className="font-bold text-fmax-text-main">{settlement.modelYear}년식</p>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">구매자</p>
                <p className="font-bold text-fmax-text-main">{settlement.buyerName}</p>
              </div>
            </div>
          </div>

          {/* Settlement Details */}
          <div className="bg-white rounded-lg p-6 border border-fmax-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-fmax-text-main flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                정산 내역
              </h2>
              {/* ✅ 상태 배지 추가 */}
              {settlement.settlementStatus && (
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  settlement.settlementStatus === 'paid' 
                    ? 'bg-green-100 text-green-700' 
                    : settlement.settlementStatus === 'completed'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {settlement.settlementStatus === 'paid' ? '정산 완료' : 
                   settlement.settlementStatus === 'completed' ? '정산 처리 중' : '정산 대기'}
                </span>
              )}
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-fmax-border">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-fmax-primary" />
                  <span className="text-fmax-text-main">판매가</span>
                </div>
                <span className="font-bold text-fmax-text-main">{settlement.salePrice.toLocaleString()}만원</span>
              </div>
              
              <div className="flex justify-between items-center py-3 border-b border-fmax-border">
                <div className="flex items-center gap-2">
                  <Percent className="w-5 h-5 text-gray-600" />
                  <span className="text-fmax-text-main">플랫폼 수수료 ({settlement.platformFeeRate}%)</span>
                </div>
                <span className="text-gray-600">-{settlement.platformFee.toLocaleString()}만원</span>
              </div>

              {/* ✅ 탁송비 항목 추가 */}
              {settlement.logisticsFee !== undefined && (
                <div className="flex justify-between items-center py-3 border-b border-fmax-border">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-gray-600" />
                    <span className="text-fmax-text-main">탁송비</span>
                  </div>
                  <span className="text-gray-600">-{settlement.logisticsFee.toLocaleString()}만원</span>
                </div>
              )}

              {/* ✅ 검차비 항목 추가 */}
              {settlement.inspectionFee !== undefined && (
                <div className="flex justify-between items-center py-3 border-b border-fmax-border">
                  <div className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-gray-600" />
                    <span className="text-fmax-text-main">검차비</span>
                  </div>
                  <span className="text-gray-600">-{settlement.inspectionFee.toLocaleString()}만원</span>
                </div>
              )}

              <div className="flex justify-between items-center py-3 border-b border-fmax-border">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-fmax-success" />
                  <span className="text-fmax-text-main">부가세 환급 ({settlement.vatRefundRate}%)</span>
                </div>
                <span className="font-bold text-fmax-success">+{settlement.vatRefund.toLocaleString()}만원</span>
              </div>

              <div className="flex justify-between items-center py-4 bg-fmax-surface rounded-lg px-4 mt-4">
                <span className="text-lg font-bold text-fmax-text-main">최종 정산 금액</span>
                <span className="text-2xl font-bold text-fmax-primary">{settlement.finalAmount.toLocaleString()}만원</span>
              </div>
            </div>
          </div>

          {/* ✅ 입금 계좌 정보 추가 */}
          {settlement.bankAccount && (
            <div className="bg-white rounded-lg p-6 border border-fmax-border">
              <h2 className="text-lg font-bold text-fmax-text-main mb-4 flex items-center gap-2">
                <Banknote className="w-5 h-5 text-fmax-primary" />
                입금 계좌 정보
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">은행 및 계좌번호</span>
                  <span className="font-medium text-fmax-text-main">국민은행 {settlement.bankAccount}</span>
                </div>
                {settlement.accountHolder && (
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">예금주</span>
                    <span className="font-medium text-fmax-text-main">{settlement.accountHolder}</span>
                  </div>
                )}
                <div className="mt-4 p-3 bg-blue-50 border border-blue-100 rounded-lg">
                  <p className="text-xs text-blue-800">
                    💡 정산 금액은 정산일 기준 3영업일 내 입금됩니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Settlement Date */}
          <div className="bg-white rounded-lg p-6 border border-fmax-border">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">정산일</span>
              <span className="font-bold text-fmax-text-main">{settlement.settlementDate}</span>
            </div>
          </div>

          {/* Logistics Action Button */}
          <div className="bg-white rounded-lg p-6 border border-fmax-border">
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => onNavigate('SCR-0600', settlement.vehicleId)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-fmax-primary text-white rounded-lg hover:bg-primaryHover transition-colors font-medium"
              >
                <Truck className="w-5 h-5" />
                탁송 신청
              </button>
              <button
                onClick={() => onNavigate('SCR-0601')}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border border-fmax-border rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                탁송 내역 보기
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-3 text-center">
              정산 완료 후 탁송 신청이 가능합니다.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SettlementDetailPage;

