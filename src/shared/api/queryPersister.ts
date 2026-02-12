/**
 * Query Cache Selective Persister
 * STATE_MANAGEMENT_POLICY P4. 필요한 캐시만 localStorage에 저장.
 *
 * @see docs/STATE_MANAGEMENT_POLICY.md §7 P4, §8.5
 *
 * ## Whitelist (영속화 대상)
 * - **vehicles**: 차량 목록·상세. 읽기 전용, 오프라인 조회 가치.
 * - **settlements**: 정산 목록·상세. 읽기 전용, 오프라인 조회 가치.
 *
 * ## Blacklist (영속화 제외)
 * - **auction** / **auctions**: 경매 입찰·가격. 실시간성·민감정보 우선.
 * - **user**: 사용자 개인정보. 보안 우선.
 * - **inspections**, **logistics**, **sales**: 선택적 제외 (용량·데이터 민감도).
 */

import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import type { Query } from '@tanstack/react-query';

const PERSIST_KEY = 'REACT_QUERY_OFFLINE_CACHE';

/** Whitelist: queryKey[0]이 이 값이면 영속화 */
const PERSIST_WHITELIST = ['vehicles', 'settlements'] as const;

/** Blacklist: queryKey[0]이 이 값이면 영속화 제외 */
const PERSIST_BLACKLIST = ['auction', 'auctions', 'user', 'inspections', 'logistics', 'sales'] as const;

/**
 * 영속화할 쿼리만 필터링 (whitelist 방식)
 * @see STATE_MANAGEMENT_POLICY §8.5
 */
export const shouldDehydrateQuery = (query: Query): boolean => {
  const firstKey = query.queryKey[0];
  if (typeof firstKey !== 'string') return false;
  if (PERSIST_BLACKLIST.includes(firstKey as (typeof PERSIST_BLACKLIST)[number])) return false;
  return PERSIST_WHITELIST.includes(firstKey as (typeof PERSIST_WHITELIST)[number]);
};

export const queryPersister = createSyncStoragePersister({
  storage: window.localStorage,
  key: PERSIST_KEY,
  throttleTime: 1000,
});
