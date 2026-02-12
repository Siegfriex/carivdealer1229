/**
 * OCR 등록원부 API
 * 차량번호 → 등록원부 정보 추출 (vehicle-registration 전용)
 */

import { apiClient } from '@/shared/api/client';
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
