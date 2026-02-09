/**
 * Vehicle API Functions
 * Firebase Functions 호출
 */

import { apiClient } from '@/shared/api/apiClient';
import { API_ENDPOINTS } from '@/shared/config/apiEndpoints';

/** OCR 등록원부 처리 응답 (VIN·제조사·모델·연식·주행거리) */
export interface OcrResponse {
  vin: string;
  manufacturer: string;
  model: string;
  year: string;
  mileage: string;
}

/**
 * OCR 등록원부 처리 (차량번호 → 등록원부 정보 추출)
 * @param carNo - 차량번호
 * @returns OcrResponse
 */
export const ocrRegistration = async (carNo: string): Promise<OcrResponse> => {
  return await apiClient.post<OcrResponse>(API_ENDPOINTS.VEHICLE.OCR_REGISTRATION, {
    car_no: carNo,
  });
};

/** 공공데이터 차량 통계 조회 요청 파라미터 */
export interface VehicleStatisticsParams {
  registYy: string;
  registMt: string;
  useFuelCode: string;
}

/** 공공데이터 차량 통계 응답 (API 형식에 따라 확장) */
export interface VehicleStatisticsResponse {
  [key: string]: unknown;
}

/**
 * 공공데이터 차량 통계 조회
 * @param params - 등록년·등록월·연료코드
 * @returns VehicleStatisticsResponse
 */
export const getVehicleStatistics = async (
  params: VehicleStatisticsParams
): Promise<VehicleStatisticsResponse> => {
  return await apiClient.post<VehicleStatisticsResponse>(
    API_ENDPOINTS.VEHICLE.GET_STATISTICS,
    params
  );
};
