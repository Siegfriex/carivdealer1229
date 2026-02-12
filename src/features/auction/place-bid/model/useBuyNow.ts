/**
 * useBuyNow Hook
 * 즉시구매 (useMutation). apiClient.auction.buyNow 단일 경로 사용.
 */

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiClient } from '@/shared/api/client';
import { auctionKeys, vehicleKeys } from '@/shared/api/queryKeys';
import { handleError } from '@/shared/lib/errorHandler';
import { useToast } from '@/shared/ui/Toast';

/** 즉시구매 요청 입력 */
interface BuyNowInput {
  auction_id: string;
}

/** 즉시구매 응답 */
interface BuyNowResponse {
  success: boolean;
  contract_id: string;
  message: string;
}

/**
 * 즉시구매 뮤테이션 훅
 * @description apiClient.auction.buyNow 호출, 성공 시 auctions·vehicles 쿼리 무효화
 * @returns useMutation (mutationFn: BuyNowInput → BuyNowResponse)
 */
export const useBuyNow = () => {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  return useMutation({
    mutationFn: async (input: BuyNowInput): Promise<BuyNowResponse> => {
      return await apiClient.auction.buyNow(input.auction_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: auctionKeys.auctions });
      queryClient.invalidateQueries({ queryKey: vehicleKeys.all });
    },
    onError: (err) => {
      showToast(handleError(err), 'error');
    },
  });
};
