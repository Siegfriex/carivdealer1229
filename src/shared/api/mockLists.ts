/**
 * 공용 목업 리스트 — 거래·탁송·차량목록
 * FSD: shared 층에서 페이지/피처가 import. entities 타입은 사용처에서 적용.
 * 리스트뷰·카드뷰 모두 지원. 이미지 없으면 placeholder 박스.
 *
 * @see docs/figmaMCP/mcp_outputs/1714-22332 — 거래 목록 이미지 URL
 */

import { Timestamp } from 'firebase/firestore';

/** mock Timestamp 헬퍼 */
const ts = (d: Date) => Timestamp.fromDate(d);

/** Figma MCP asset URL (거래 목록 카드 이미지) — 동작 안 하면 placeholder 사용 */
export const MOCK_IMAGE_URLS = [
  'https://www.figma.com/api/mcp/asset/2f9e1342-a307-47bb-8f43-886833d212c1',
  'https://www.figma.com/api/mcp/asset/cb2a7774-3a59-4378-8024-4bfd97672fd9',
  'https://www.figma.com/api/mcp/asset/6d9338c8-1a94-49df-802a-1b612d1ca7f3',
] as const;

/** Vehicle 호환 용도 — shared는 entities 의존 불가, 페이지에서 Vehicle로 캐스팅 */
export interface MockVehicleShape {
  id: string;
  status: string;
  plateNumber: string;
  manufacturer: string;
  modelName: string;
  modelYear: string;
  mileage: string;
  price?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * 거래·차량목록 탭 공통 목업 (useVehicles 폴백)
 * - 거래: active_sale, bidding, sold, completed
 * - 차량목록: draft, inspection, active_sale, bidding, sold, pending_settlement, completed (사이드바 필터 지원)
 */
export const MOCK_VEHICLES_ALL: MockVehicleShape[] = [
  { id: 'v-1', status: 'draft', plateNumber: '12가 3456', manufacturer: '현대', modelName: '아반떼', modelYear: '2022', mileage: '32000', createdAt: ts(new Date()), updatedAt: ts(new Date()) },
  { id: 'v-2', status: 'inspection', plateNumber: '33바 3333', manufacturer: '기아', modelName: '카니발', modelYear: '2023', mileage: '10000', createdAt: ts(new Date()), updatedAt: ts(new Date()) },
  { id: 'v-t1', status: 'active_sale', plateNumber: '82가 1923', manufacturer: '현대', modelName: '포터2', modelYear: '2018', mileage: '146000', price: '850', createdAt: ts(new Date('2025-02-10')), updatedAt: ts(new Date()) },
  { id: 'v-t2', status: 'bidding', plateNumber: '55라 5555', manufacturer: '현대', modelName: '그랜저 IG', modelYear: '2019', mileage: '82000', price: '1850', createdAt: ts(new Date('2025-02-09')), updatedAt: ts(new Date()) },
  { id: 'v-t3', status: 'active_sale', plateNumber: '12가 3456', manufacturer: '현대', modelName: '아반떼', modelYear: '2022', mileage: '32000', price: '1580', createdAt: ts(new Date('2025-02-08')), updatedAt: ts(new Date()) },
  { id: 'v-t4', status: 'bidding', plateNumber: '33바 3333', manufacturer: '기아', modelName: '카니발 KA4', modelYear: '2023', mileage: '10000', price: '3200', createdAt: ts(new Date('2025-02-07')), updatedAt: ts(new Date()) },
  { id: 'v-t5', status: 'sold', plateNumber: '12나 7890', manufacturer: '현대', modelName: 'G70 3T 스포츠 엘리트', modelYear: '2020', mileage: '55000', price: '2100', createdAt: ts(new Date('2025-02-05')), updatedAt: ts(new Date()) },
  { id: 'v-t6', status: 'pending_settlement', plateNumber: '98다 1111', manufacturer: '기아', modelName: 'K5', modelYear: '2021', mileage: '40000', price: '1850', createdAt: ts(new Date('2025-02-03')), updatedAt: ts(new Date()) },
  { id: 'v-t7', status: 'completed', plateNumber: '11하 2222', manufacturer: '현대', modelName: '투싼', modelYear: '2020', mileage: '62000', price: '1950', createdAt: ts(new Date('2025-02-01')), updatedAt: ts(new Date()) },
];

/** @deprecated MOCK_VEHICLES_ALL 사용 */
export const MOCK_TRADE_VEHICLES: MockVehicleShape[] = MOCK_VEHICLES_ALL;

/** API_ERD_Mapping §물류 status enum (scheduled, dispatched, in_transit, completed, canceled) */
export type MockLogisticsStatus = 'scheduled' | 'dispatched' | 'in_transit' | 'completed';

/** 탁송 목록 항목 타입 — status는 CarivDealer_API_ERD_Mapping §물류 기준 */
export interface MockLogisticsItem {
  id: string;
  plateNumber: string;
  modelName: string;
  modelYear: string;
  mileage: string;
  status: MockLogisticsStatus;
  thumbnailUrl?: string;
  vehicleId?: string;
}

/** 케이스 2: 탁송 목록 — MOCK_VEHICLES_ALL sold/pending_settlement/completed 차량과 vehicleId 연동 */
export const MOCK_LOGISTICS_ITEMS: MockLogisticsItem[] = [
  { id: 'log-1', plateNumber: '12나 7890', modelName: 'G70 3T 스포츠 엘리트', modelYear: '2020', mileage: '5.5', status: 'scheduled', vehicleId: 'v-t5' },
  { id: 'log-2', plateNumber: '98다 1111', modelName: 'K5', modelYear: '2021', mileage: '4.0', status: 'dispatched', vehicleId: 'v-t6' },
  { id: 'log-3', plateNumber: '11하 2222', modelName: '투싼', modelYear: '2020', mileage: '6.2', status: 'in_transit', vehicleId: 'v-t7' },
  { id: 'log-4', plateNumber: '33바 3333', modelName: '카니발 KA4', modelYear: '2023', mileage: '2.1', status: 'completed', vehicleId: 'v-t4' },
  { id: 'log-5', plateNumber: '12가 3456', modelName: '아반떼', modelYear: '2022', mileage: '3.2', status: 'scheduled', vehicleId: 'v-t3' },
  { id: 'log-6', plateNumber: '55라 5555', modelName: '그랜저 IG', modelYear: '2019', mileage: '8.2', status: 'dispatched', vehicleId: 'v-t2' },
];

/** 탁송 내역 항목 타입 (LogisticsHistoryPage) */
export interface MockLogisticsRecord {
  id: string;
  vehicleId: string;
  plateNumber: string;
  scheduleDate: string;
  scheduleTime: string;
  address: string;
  driverName?: string;
  driverPhone?: string;
  status: 'scheduled' | 'dispatched' | 'in_transit' | 'completed';
  pin?: string;
}

/** 케이스 4: 탁송 내역 — 6건. vehicleId는 MOCK_VEHICLES_ALL 기준 연동 */
export const MOCK_LOGISTICS_HISTORY: MockLogisticsRecord[] = [
  { id: 'log-h1', vehicleId: 'v-t4', plateNumber: '33바 3333', scheduleDate: '2025-05-25', scheduleTime: '14:00', address: '서울특별시 강남구 테헤란로 123', driverName: '김택시', driverPhone: '010-1234-5678', status: 'in_transit' },
  { id: 'log-h2', vehicleId: 'v-t2', plateNumber: '55라 5555', scheduleDate: '2025-05-24', scheduleTime: '10:00', address: '서울특별시 서초구 서초대로 456', driverName: '박운송', driverPhone: '010-9876-5432', status: 'completed' },
  { id: 'log-h3', vehicleId: 'v-t3', plateNumber: '12가 3456', scheduleDate: '2025-05-23', scheduleTime: '09:00', address: '인천광역시 서구 봉수대로 158', driverName: '이배송', driverPhone: '010-5555-5555', status: 'completed' },
  { id: 'log-h4', vehicleId: 'v-t5', plateNumber: '12나 7890', scheduleDate: '2025-05-22', scheduleTime: '15:00', address: '경기도 성남시 분당구 판교역로 235', status: 'dispatched' },
  { id: 'log-h5', vehicleId: 'v-t1', plateNumber: '82가 1923', scheduleDate: '2025-05-21', scheduleTime: '11:00', address: '대전광역시 유성구 과학로 125', status: 'scheduled' },
  { id: 'log-h6', vehicleId: 'v-t7', plateNumber: '11하 2222', scheduleDate: '2025-05-20', scheduleTime: '16:00', address: '부산광역시 해운대구 우동 1234', driverName: '최기사', driverPhone: '010-7777-7777', status: 'completed' },
];

/** 정산 목록 항목 (CarivDealer_API_ERD_Mapping §정산. settlementStatus: pending, completed, paid) */
export interface MockSettlementItem {
  id: string;
  vehicleId: string;
  plateNumber: string;
  modelName: string;
  salePrice: number;
  settlementAmount: number;
  platformFee: number;
  totalRefund: number;
  settlementDate: string;
  settlementStatus: 'pending' | 'completed' | 'paid';
}

/** 케이스 5: 정산 목록 — MOCK_VEHICLES_ALL vehicleId 연동 */
export const MOCK_SETTLEMENTS: MockSettlementItem[] = [
  { id: 'settle-001', vehicleId: 'v-t7', plateNumber: '11하 2222', modelName: '투싼', salePrice: 2850, settlementAmount: 2850, platformFee: 142.5, totalRefund: 259.09, settlementDate: '2025-05-20', settlementStatus: 'paid' },
  { id: 'settle-002', vehicleId: 'v-t5', plateNumber: '12나 7890', modelName: 'G70 3T 스포츠 엘리트', salePrice: 1450, settlementAmount: 1450, platformFee: 72.5, totalRefund: 131.81, settlementDate: '2025-05-19', settlementStatus: 'paid' },
  { id: 'settle-003', vehicleId: 'v-t6', plateNumber: '98다 1111', modelName: 'K5', salePrice: 4200, settlementAmount: 4200, platformFee: 210, totalRefund: 381.82, settlementDate: '2025-05-18', settlementStatus: 'pending' },
];

/** 정산 상세 (상세 페이지용) */
export interface MockSettlementDetail {
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
  settlementStatus: 'pending' | 'completed' | 'paid';
}

/** 케이스 5-2: 정산 상세 — settle-001~003 */
export const MOCK_SETTLEMENT_DETAILS: Record<string, MockSettlementDetail> = {
  'settle-001': {
    id: 'settle-001', vehicleId: 'v-t7', plateNumber: '11하 2222', modelName: '투싼', manufacturer: '현대', modelYear: '2020',
    salePrice: 1950, settlementAmount: 1950, platformFee: 97.5, platformFeeRate: 5, vatRefund: 177.41, vatRefundRate: 9.09,
    totalRefund: 177.41, finalAmount: 2127.41, settlementDate: '2025-05-20', buyerName: 'Global Motors Inc.', saleMethod: 'general',
    logisticsFee: 35, inspectionFee: 20, bankAccount: '123-456-789012', accountHolder: '포워드맥스', settlementStatus: 'paid',
  },
  'settle-002': {
    id: 'settle-002', vehicleId: 'v-t5', plateNumber: '12나 7890', modelName: 'G70 3T 스포츠 엘리트', manufacturer: '현대', modelYear: '2020',
    salePrice: 2100, settlementAmount: 2100, platformFee: 105, platformFeeRate: 5, vatRefund: 191.09, vatRefundRate: 9.09,
    totalRefund: 191.09, finalAmount: 2291.09, settlementDate: '2025-05-19', buyerName: 'Buyer Co.', saleMethod: 'auction',
    logisticsFee: 40, inspectionFee: 20, bankAccount: '123-456-789012', accountHolder: '포워드맥스', settlementStatus: 'paid',
  },
  'settle-003': {
    id: 'settle-003', vehicleId: 'v-t6', plateNumber: '98다 1111', modelName: 'K5', manufacturer: '기아', modelYear: '2021',
    salePrice: 1850, settlementAmount: 1850, platformFee: 92.5, platformFeeRate: 5, vatRefund: 168.32, vatRefundRate: 9.09,
    totalRefund: 168.32, finalAmount: 2018.32, settlementDate: '2025-05-18', buyerName: 'Pending Buyer', saleMethod: 'general',
    logisticsFee: 30, inspectionFee: 20, bankAccount: '123-456-789012', accountHolder: '포워드맥스', settlementStatus: 'pending',
  },
};

/** 매출 내역 항목 (CarivDealer_API_ERD_Mapping §정산. sale_type: general, auction) */
export interface MockSaleRecord {
  id: string;
  vehicleId: string;
  plateNumber: string;
  modelName: string;
  manufacturer: string;
  modelYear: string;
  salePrice: number;
  saleDate: string;
  buyerName: string;
  saleMethod: 'auction' | 'general';
}

/** 케이스 6: 매출 내역 — MOCK_VEHICLES_ALL vehicleId 연동 */
export const MOCK_SALES_HISTORY: MockSaleRecord[] = [
  { id: 'sale-001', vehicleId: 'v-t4', plateNumber: '33바 3333', modelName: '카니발 KA4', manufacturer: '기아', modelYear: '2022', salePrice: 2850, saleDate: '2025-05-15', buyerName: 'Global Motors Inc.', saleMethod: 'general' },
  { id: 'sale-002', vehicleId: 'v-t2', plateNumber: '55라 5555', modelName: '그랜저 IG', manufacturer: '현대', modelYear: '2021', salePrice: 1450, saleDate: '2025-05-14', buyerName: 'Auto Export Co.', saleMethod: 'auction' },
  { id: 'sale-003', vehicleId: 'v-t5', plateNumber: '12나 7890', modelName: 'G70 3T 스포츠 엘리트', manufacturer: '현대', modelYear: '2020', salePrice: 2100, saleDate: '2025-05-13', buyerName: 'Domestic Buyer', saleMethod: 'general' },
];

/** 차량 목록 6건 — MOCK_VEHICLES_ALL 기준 (draft, inspection, active_sale, bidding, sold, completed) */
export const MOCK_VEHICLE_LIST: MockVehicleShape[] = [
  MOCK_VEHICLES_ALL[0], // v-1 draft
  MOCK_VEHICLES_ALL[1], // v-2 inspection
  MOCK_VEHICLES_ALL[2], // v-t1 active_sale
  MOCK_VEHICLES_ALL[3], // v-t2 bidding
  MOCK_VEHICLES_ALL[6], // v-t5 sold
  MOCK_VEHICLES_ALL[8], // v-t7 completed
];
