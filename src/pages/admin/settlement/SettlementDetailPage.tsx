/**
 * SettlementDetailPage - 정산 상세
 * FSD 마이그레이션 완료 (Phase 2.4)
 */

import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CreditCard, DollarSign, Percent, FileText, Download, Printer, Truck, Banknote } from 'lucide-react';
import { LandingHeader } from '@/widgets/Header';
import { GnbMinimalSidebar } from '@/widgets/GnbMinimalSidebar';
import { LAYOUT_CLASSES } from '@/shared/config/layout';

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
  logisticsFee?: number;
  inspectionFee?: number;
  bankAccount?: string;
  accountHolder?: string;
  settlementStatus?: 'pending' | 'completed' | 'paid';
}

export const SettlementDetailPage = () => {
  const navigate = useNavigate();
  const { settlementId } = useParams<{ settlementId: string }>();
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
      // Mock 데이터 — routeManager MOCK_VEHICLE_TO_SETTLEMENT, SettlementListPage와 ID 연동
      const mockById: Record<string, SettlementDetail> = {
        'settle-001': {
          id: 'settle-001',
          vehicleId: 'v-t7',
          plateNumber: '11하 2222',
          modelName: '투싼',
          manufacturer: '현대',
          modelYear: '2020',
          salePrice: 1950,
          settlementAmount: 1950,
          platformFee: 97.5,
          platformFeeRate: 5,
          vatRefund: 177.41,
          vatRefundRate: 9.09,
          totalRefund: 177.41,
          finalAmount: 2127.41,
          settlementDate: '2025-05-20',
          buyerName: 'Global Motors Inc.',
          saleMethod: 'general',
          logisticsFee: 35,
          inspectionFee: 20,
          bankAccount: '123-456-789012',
          accountHolder: '포워드맥스',
          settlementStatus: 'paid'
        },
        'settle-002': {
          id: 'settle-002',
          vehicleId: 'v-t5',
          plateNumber: '12나 7890',
          modelName: 'G70 3T 스포츠 엘리트',
          manufacturer: '현대',
          modelYear: '2020',
          salePrice: 2100,
          settlementAmount: 2100,
          platformFee: 105,
          platformFeeRate: 5,
          vatRefund: 191.09,
          vatRefundRate: 9.09,
          totalRefund: 191.09,
          finalAmount: 2291.09,
          settlementDate: '2025-05-19',
          buyerName: 'Buyer Co.',
          saleMethod: 'auction',
          logisticsFee: 40,
          inspectionFee: 20,
          bankAccount: '123-456-789012',
          accountHolder: '포워드맥스',
          settlementStatus: 'paid'
        },
        'settle-003': {
          id: 'settle-003',
          vehicleId: 'v-t6',
          plateNumber: '98다 1111',
          modelName: 'K5',
          manufacturer: '기아',
          modelYear: '2021',
          salePrice: 1850,
          settlementAmount: 1850,
          platformFee: 92.5,
          platformFeeRate: 5,
          vatRefund: 168.32,
          vatRefundRate: 9.09,
          totalRefund: 168.32,
          finalAmount: 2018.32,
          settlementDate: '2025-05-18',
          buyerName: 'Pending Buyer',
          saleMethod: 'general',
          logisticsFee: 30,
          inspectionFee: 20,
          bankAccount: '123-456-789012',
          accountHolder: '포워드맥스',
          settlementStatus: 'pending'
        },
      };
      const mockSettlement = mockById[id] ?? {
        id,
        vehicleId: 'v-t7',
        plateNumber: '11하 2222',
        modelName: '투싼',
        manufacturer: '현대',
        modelYear: '2020',
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
        logisticsFee: 35,
        inspectionFee: 20,
        bankAccount: '123-456-789012',
        accountHolder: '포워드맥스',
        settlementStatus: 'paid'
      };
      setSettlement(mockSettlement);
    } catch {
      // Error handled silently
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
    <div className="min-h-screen bg-gray-50">
      <LandingHeader userName="홍길동" variant="main" activeNav="settlements" />

      <div className={`flex ${LAYOUT_CLASSES.CONTAINER}`}>
        <GnbMinimalSidebar sectionTitle="정산" />
        <main className={`flex-1 min-w-0 p-8 ${LAYOUT_CLASSES.MAIN_DETAIL}`}>
          <div className="mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-fmax-text-main">정산 상세</h1>
            <div className="flex gap-2">
              <button className="p-2 hover:bg-fmax-surface rounded-lg transition-colors" title="다운로드">
                <Download className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-fmax-surface rounded-lg transition-colors" title="인쇄">
                <Printer className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>
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

              {settlement.logisticsFee !== undefined && (
                <div className="flex justify-between items-center py-3 border-b border-fmax-border">
                  <div className="flex items-center gap-2">
                    <Truck className="w-5 h-5 text-gray-600" />
                    <span className="text-fmax-text-main">탁송비</span>
                  </div>
                  <span className="text-gray-600">-{settlement.logisticsFee.toLocaleString()}만원</span>
                </div>
              )}

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

          {/* Bank Account Info */}
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
                    정산 금액은 정산일 기준 3영업일 내 입금됩니다.
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
                onClick={() => navigate(`/logistics/schedule?vehicleId=${settlement.vehicleId}`)}
                className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-fmax-primary text-white rounded-lg hover:bg-primaryHover transition-colors font-medium"
              >
                <Truck className="w-5 h-5" />
                탁송 신청
              </button>
              <button
                onClick={() => navigate('/logistics/history')}
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
    </div>
  );
};
