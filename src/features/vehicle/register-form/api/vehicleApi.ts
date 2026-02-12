/**
 * Vehicle API Functions
 * Firebase Functions 호출
 * ocrRegistration은 @/features/vehicle-registration으로 분리됨
 *
 * getVehicleStatistics: getVehicleStatisticsAPI 엔드포인트가 Functions에 없음.
 * 방어적으로 mock 반환. 백엔드 API 생기면 apiClient.post 호출로 복원.
 */

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
 * @param _params - 등록년·등록월·연료코드 (현재 미사용, API 부재로 mock 반환)
 * @returns VehicleStatisticsResponse (빈 객체. 백엔드 API 생기면 실제 호출로 교체)
 */
export const getVehicleStatistics = async (
  _params: VehicleStatisticsParams
): Promise<VehicleStatisticsResponse> => {
  // getVehicleStatisticsAPI 엔드포인트 미구현. 방어적 mock 반환.
  return Promise.resolve({});
};
