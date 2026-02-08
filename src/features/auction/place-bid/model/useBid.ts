/**
 * useBid Hook
 * 경매 입찰 (useMutation). apiClient.auction.bid 단일 경로 사용.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';

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
      return await apiClient.auction.bid(input.auction_id, input.bid_amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auctions'] });
    },
  });
};
