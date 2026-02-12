/**
 * Vehicle API Functions
 * Firebase Functions 호출
 * ocrRegistration은 @/features/vehicle-registration으로 분리됨
 */

import { apiClient } from '@/shared/api/apiClient';
import { API_ENDPOINTS } from '@/shared/config/apiEndpoints';

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
