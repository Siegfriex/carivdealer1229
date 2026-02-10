/**
 * Inspection Entity Constants
 */

import type { InspectionStatus } from './types';

/** Figma §3.6 검차요청내역 리스트·카드와 동일 라벨 */
export const INSPECTION_STATUS_LABELS: Record<InspectionStatus, string> = {
  pending: '검차자 매칭중',
  assigned: '검차자 매칭완료',
  in_progress: '검차 진행중',
  completed: '검차 완료',
};

/** Figma 1037-5673: 검차 진행중 #10b981, 기타 상태 구분 */
export const INSPECTION_STATUS_COLORS: Record<InspectionStatus, string> = {
  pending: '#909090',      // Gray
  assigned: '#3B82F6',     // Blue
  in_progress: '#10B981',  // Green (Figma 검차 진행중)
  completed: '#10B981',    // Green
};

export const INSPECTION_STATUS_TRANSITIONS: Record<InspectionStatus, InspectionStatus[]> = {
  pending: ['assigned'],
  assigned: ['in_progress'],
  in_progress: ['completed'],
  completed: [],
};

/**
 * 미디어 카테고리 기본값
 */
export const DEFAULT_MEDIA_CATEGORIES = ['Exterior', 'Interior', 'Undercarriage', 'Engine', 'Other'];

/**
 * 검차 점수 등급
 */
export const INSPECTION_GRADES = ['A', 'B', 'C', 'D', 'F'] as const;

export type InspectionGrade = (typeof INSPECTION_GRADES)[number];

/**
 * 검차 상태 전이 가능 여부
 * @param currentStatus - 현재 검차 상태
 * @param nextStatus - 다음 상태
 * @returns 전이 가능하면 true
 */
export const canTransitionTo = (
  currentStatus: InspectionStatus,
  nextStatus: InspectionStatus
): boolean => {
  return INSPECTION_STATUS_TRANSITIONS[currentStatus].includes(nextStatus);
};
