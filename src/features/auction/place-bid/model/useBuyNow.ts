/**
 * useBuyNow Hook
 * 즉시구매 (useMutation). apiClient.auction.buyNow 단일 경로 사용.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';

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
      return await apiClient.auction.buyNow(input.auction_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
    },
  });
};
