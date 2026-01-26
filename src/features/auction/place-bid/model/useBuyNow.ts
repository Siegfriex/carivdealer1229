/**
 * useBuyNow Hook
 * 즉시구매 (useMutation)
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/config/apiEndpoints';

interface BuyNowInput {
  auction_id: string;
}

interface BuyNowResponse {
  success: boolean;
  contract_id: string;
  message: string;
}

export const useBuyNow = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: BuyNowInput): Promise<BuyNowResponse> => {
      return await apiClient.post<BuyNowResponse>(API_ENDPOINTS.BUY_NOW, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};
