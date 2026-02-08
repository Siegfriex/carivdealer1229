/**
 * Vehicle API Functions
 * Firebase Functions 호출
 */

import { apiClient } from '@/shared/api/apiClient';
import { API_ENDPOINTS } from '@/shared/config/apiEndpoints';

/**
 * OCR 등록원부 처리
 */
export interface OcrResponse {
  vin: string;
  manufacturer: string;
  model: string;
  year: string;
  mileage: string;
}

export const ocrRegistration = async (carNo: string): Promise<OcrResponse> => {
  return await apiClient.post<OcrResponse>(API_ENDPOINTS.VEHICLE.OCR_REGISTRATION, {
    car_no: carNo,
  });
};

/**
 * 공공데이터 차량 통계 조회
 */
export interface VehicleStatisticsParams {
  registYy: string;
  registMt: string;
  useFuelCode: string;
}

export interface VehicleStatisticsResponse {
  // 공공데이터 API 응답 형식에 따라 정의
  [key: string]: unknown;
}

export const getVehicleStatistics = async (
  params: VehicleStatisticsParams
): Promise<VehicleStatisticsResponse> => {
  return await apiClient.post<VehicleStatisticsResponse>(
    API_ENDPOINTS.VEHICLE.GET_STATISTICS,
    params
  );
};
