/**
 * useInspectionRequest Hook
 * 검차 신청 (useMutation)
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { inspectionKeys, vehicleKeys } from '@/shared/api/queryKeys';
import { API_ENDPOINTS } from '@/shared/config/apiEndpoints';
import { handleError } from '@/shared/lib/errorHandler';
import { useToast } from '@/shared/ui/Toast';

/** 검차 신청 요청 입력 */
interface InspectionRequestInput {
  vehicle_id: string;
  preferred_date: string;
  preferred_time: string;
}

/** 검차 신청 응답 */
interface InspectionRequestResponse {
  success: boolean;
  inspection_id: string;
  message: string;
}

/**
 * 검차 신청 뮤테이션 훅
 * @description VEHICLE.INSPECTION_REQUEST 엔드포인트로 검차 신청, 성공 시 inspections·vehicles 쿼리 무효화
 * @returns useMutation (mutationFn: InspectionRequestInput → InspectionRequestResponse)
 */
export const useInspectionRequest = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async (input: InspectionRequestInput): Promise<InspectionRequestResponse> => {
      return await apiClient.post<InspectionRequestResponse>(
        API_ENDPOINTS.VEHICLE.INSPECTION_REQUEST,
        input
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: inspectionKeys.all });
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
    },
    onError: (err) => {
      showToast(handleError(err), 'error');
    },
  });
};
