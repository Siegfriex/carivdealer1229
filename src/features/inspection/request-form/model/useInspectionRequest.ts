/**
 * useInspectionRequest Hook
 * 검차 신청 (useMutation)
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/config/apiEndpoints';

interface InspectionRequestInput {
  vehicle_id: string;
  preferred_date: string;
  preferred_time: string;
}

interface InspectionRequestResponse {
  success: boolean;
  inspection_id: string;
  message: string;
}

export const useInspectionRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: InspectionRequestInput): Promise<InspectionRequestResponse> => {
      return await apiClient.post<InspectionRequestResponse>(
        API_ENDPOINTS.INSPECTION_REQUEST,
        input
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inspections'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};
