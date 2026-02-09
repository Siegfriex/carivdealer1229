/**
 * 정산 엔티티 상수 (상태·판매방식 라벨·색상·전이·정산 계산)
 */

import type { SettlementStatus, SaleMethod } from './types';

/** 정산 상태 한글 라벨 */
export const SETTLEMENT_STATUS_LABELS: Record<SettlementStatus, string> = {
  pending: '정산 대기',
  completed: '정산 완료',
  paid: '지급 완료',
};

export const SETTLEMENT_STATUS_COLORS: Record<SettlementStatus, string> = {
  pending: '#F59E0B',   // Yellow
  completed: '#3B82F6', // Blue
  paid: '#10B981',      // Green
};

export const SALE_METHOD_LABELS: Record<SaleMethod, string> = {
  auction: '경매',
  general: '일반 판매',
};

export const SETTLEMENT_STATUS_TRANSITIONS: Record<SettlementStatus, SettlementStatus[]> = {
  pending: ['completed'],
  completed: ['paid'],
  paid: [],
};

/**
 * 정산 금액 계산 (수수료·부가세 환급·최종 금액)
 * @param params - salePrice, platformFeeRate, vatRefundRate, logisticsFee, inspectionFee
 * @returns settlementAmount, platformFee, vatRefund, totalRefund, finalAmount
 */
export const calculateSettlement = (params: {
  salePrice: number;
  platformFeeRate: number;
  vatRefundRate: number;
  logisticsFee?: number;
  inspectionFee?: number;
}) => {
  const platformFee = params.salePrice * (params.platformFeeRate / 100);
  const vatRefund = params.salePrice * (params.vatRefundRate / 100);
  const logisticsFee = params.logisticsFee || 0;
  const inspectionFee = params.inspectionFee || 0;
  
  const settlementAmount = params.salePrice;
  const totalRefund = vatRefund;
  const finalAmount = settlementAmount - platformFee + vatRefund - logisticsFee - inspectionFee;

  return {
    settlementAmount,
    platformFee,
    vatRefund,
    totalRefund,
    finalAmount,
  };
};

/**
 * 정산 상태 전이 가능 여부
 * @param currentStatus - 현재 정산 상태
 * @param nextStatus - 다음 상태
 * @returns 전이 가능하면 true
 */
export const canTransitionTo = (
  currentStatus: SettlementStatus,
  nextStatus: SettlementStatus
): boolean => {
  return SETTLEMENT_STATUS_TRANSITIONS[currentStatus].includes(nextStatus);
};
