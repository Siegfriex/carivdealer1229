/**
 * 검차(Inspection) 엔티티 타입
 * ERD 스키마 기반. 참조: docs/DATABASE_ERD_SCHEMA.md
 */

import { Timestamp } from 'firebase/firestore';

/**
 * 검차 상태
 */
export type InspectionStatus = 'pending' | 'assigned' | 'in_progress' | 'completed';

/**
 * 검차 장소 정보
 */
export interface Location {
  address: string;
  coordinates: {
    lat: number;
    lng: number;
  } | null;
}

/**
 * 평가사 정보
 */
export interface Evaluator {
  name: string;
  id: string;
  rating: number;
  phone: string;
}

/**
 * 검차 결과 - 상태 정보
 */
export interface InspectionCondition {
  exterior: string;   // 외장 상태
  interior: string;   // 내장 상태
  mechanic: string;   // 기계 상태
  frame: string;      // 골격 상태
}

/**
 * AI 분석 정보
 */
export interface AiAnalysis {
  pros: string[];
  cons: string[];
  marketVerdict: string;
}

/**
 * 미디어 아이템
 */
export interface MediaItem {
  type: 'image' | 'video';
  url: string;
  label: string;
}

/**
 * 미디어 카테고리
 */
export interface MediaCategory {
  category: string;
  count: number;
  items: MediaItem[];
}

/**
 * 검차 리포트
 */
export interface InspectionReport {
  evaluator: Evaluator;
  summary: string;
  score: string;
  condition: InspectionCondition;
  aiAnalysis: AiAnalysis;
  media: MediaCategory[];
}

/**
 * 미디어 메타데이터
 */
export interface MediaMetadata {
  totalFiles: number;
  totalSize: number;
  lastUploadedAt?: Timestamp;
}

/**
 * 검차 엔티티
 */
export interface Inspection {
  id: string;
  platform_id?: string;
  vehicleId: string;
  preferredDate: string;
  preferredTime: string;
  location?: Location;
  status: InspectionStatus;
  evaluatorId?: string;
  evaluatorName?: string;
  assignedAt?: Timestamp;
  completedAt?: Timestamp;
  result?: InspectionReport;
  mediaMetadata?: MediaMetadata;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * 검차 신청 입력
 */
export type CreateInspectionInput = Omit<Inspection, 'id' | 'createdAt' | 'updatedAt' | 'status'>;

/**
 * 검차 업데이트 입력
 */
export type UpdateInspectionInput = Partial<Omit<Inspection, 'id' | 'createdAt'>>;
