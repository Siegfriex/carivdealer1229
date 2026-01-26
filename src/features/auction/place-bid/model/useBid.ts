/**
 * useBid Hook
 * 경매 입찰 (useMutation)
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { API_ENDPOINTS } from '@/shared/config/apiEndpoints';

interface BidInput {
  auction_id: string;
  bid_amount: number;
}

interface BidResponse {
  success: boolean;
  message: string;
}

export const useBid = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: BidInput): Promise<BidResponse> => {
      return await apiClient.post<BidResponse>(API_ENDPOINTS.BID, input);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
    },
  });
};
