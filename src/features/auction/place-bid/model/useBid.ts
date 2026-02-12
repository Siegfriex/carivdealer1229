/**
 * useBid Hook
 * 경매 입찰 (useMutation). apiClient.auction.bid 단일 경로 사용.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { auctionKeys } from '@/shared/api/queryKeys';
import { handleError } from '@/shared/lib/errorHandler';
import { useToast } from '@/shared/ui/Toast';

/** 입찰 요청 입력 */
interface BidInput {
  auction_id: string;
  bid_amount: number;
}

/** 입찰 응답 */
interface BidResponse {
  success: boolean;
  message: string;
}

/**
 * 경매 입찰 뮤테이션 훅
 * @description apiClient.auction.bid 호출, 성공 시 auctions 쿼리 무효화
 * @returns useMutation (mutationFn: BidInput → BidResponse)
 */
export const useBid = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async (input: BidInput): Promise<BidResponse> => {
      return await apiClient.auction.bid(input.auction_id, input.bid_amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: auctionKeys.auctions });
    },
    onError: (err) => {
      showToast(handleError(err), 'error');
    },
  });
};
