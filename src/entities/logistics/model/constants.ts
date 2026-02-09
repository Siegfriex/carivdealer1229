/**
 * 탁송 엔티티 상수 (상태 라벨·색상·전이 규칙)
 */

import type { LogisticsStatus } from './types';

/** 탁송 상태 한글 라벨 */
export const LOGISTICS_STATUS_LABELS: Record<LogisticsStatus, string> = {
  scheduled: '일정 조율 완료',
  dispatched: '배차 확정',
  in_transit: '탁송 진행 중',
  completed: '인계 완료',
};

export const LOGISTICS_STATUS_COLORS: Record<LogisticsStatus, string> = {
  scheduled: '#3B82F6',   // Blue
  dispatched: '#F59E0B',  // Yellow
  in_transit: '#8B5CF6',  // Purple
  completed: '#10B981',   // Green
};

export const LOGISTICS_STATUS_TRANSITIONS: Record<LogisticsStatus, LogisticsStatus[]> = {
  scheduled: ['dispatched'],
  dispatched: ['in_transit'],
  in_transit: ['completed'],
  completed: [],
};

/**
 * 탁송 상태 전이 가능 여부
 * @param currentStatus - 현재 탁송 상태
 * @param nextStatus - 다음 상태
 * @returns 전이 가능하면 true
 */
export const canTransitionTo = (
  currentStatus: LogisticsStatus,
  nextStatus: LogisticsStatus
): boolean => {
  return LOGISTICS_STATUS_TRANSITIONS[currentStatus].includes(nextStatus);
};
